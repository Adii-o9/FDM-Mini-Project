const API_BASE_URL = 'http://127.0.0.1:8000';

/**
 * Checks the operational health and artifact loading status of the FastAPI backend.
 * @returns {Promise<{online: boolean, model_loaded?: boolean, preprocessing_loaded?: boolean, error?: string}>}
 */
export async function checkHealth() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      return {
        online: true,
        model_loaded: data.model_loaded,
        preprocessing_loaded: data.preprocessing_loaded
      };
    } else {
      return {
        online: false,
        error: `Server returned HTTP ${response.status}`
      };
    }
  } catch (err) {
    return {
      online: false,
      error: 'Cannot connect to backend server. Make sure the FastAPI service is running on port 8000.'
    };
  }
}

/**
 * Sends validated raw booking details to the ReserveIQ prediction endpoint.
 * @param {Object} bookingData 
 * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
 */
export async function predictBooking(bookingData) {
  try {
    const response = await fetch(`${API_BASE_URL}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(bookingData)
    });

    const responseBody = await response.json().catch(() => null);

    if (response.ok) {
      return {
        success: true,
        data: responseBody
      };
    }

    // Handle HTTP 422 Validation Error
    if (response.status === 422) {
      let message = 'Validation error: Please review the highlighted fields.';
      if (responseBody?.detail) {
        message = typeof responseBody.detail === 'string'
          ? responseBody.detail
          : Array.isArray(responseBody.detail)
            ? responseBody.detail.map(d => d.msg || JSON.stringify(d)).join(', ')
            : JSON.stringify(responseBody.detail);
      }
      return { success: false, error: message, status: 422 };
    }

    // Handle HTTP 400 Business Logic Error
    if (response.status === 400) {
      return {
        success: false,
        error: responseBody?.detail || 'Invalid booking data provided.',
        status: 400
      };
    }

    // Handle HTTP 503 Service Unavailable (e.g. Model missing)
    if (response.status === 503) {
      return {
        success: false,
        error: responseBody?.detail || 'Model service is temporarily unavailable. Artifacts not found.',
        status: 503
      };
    }

    // Handle HTTP 500 Internal Error
    if (response.status >= 500) {
      return {
        success: false,
        error: 'An internal error occurred on the prediction server. Please try again later.',
        status: response.status
      };
    }

    return {
      success: false,
      error: responseBody?.detail || `Prediction request failed with status ${response.status}.`,
      status: response.status
    };
  } catch (err) {
    // Network failure / CORS failure / Backend offline
    return {
      success: false,
      error: 'Network connection error: Unable to reach the ReserveIQ backend. Please verify that the FastAPI server is running on http://127.0.0.1:8000.'
    };
  }
}
