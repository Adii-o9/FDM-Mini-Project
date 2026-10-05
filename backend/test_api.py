import pytest
from fastapi.testclient import TestClient
from backend.app.main import app
from backend.app.preprocessor import preprocess_booking, load_artifacts

client = TestClient(app)

# Standard verified sample booking
VALID_BOOKING = {
    "lead_time": 65,
    "arrival_date": "2026-08-15",
    "stays_in_weekend_nights": 2,
    "stays_in_week_nights": 3,
    "adr": 125.50,
    "deposit_type": "No Deposit",
    "customer_type": "Transient",
    "market_segment": "Online TA",
    "country": "PRT",
    "agent": "9",
    "previous_cancellations": 0,
    "booking_changes": 1,
    "required_car_parking_spaces": 0,
    "total_of_special_requests": 2
}


def test_root_endpoint():
    """Test root GET / returns HTTP 200 with welcome message."""
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "ReserveIQ API is running"}


def test_health_endpoint():
    """Test 1: GET /health returns HTTP 200 and reports artifacts loaded."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["model_loaded"] is True
    assert data["preprocessing_loaded"] is True


def test_valid_booking_prediction():
    """
    Test 2 & 3: Valid booking returns HTTP 200 and required fields:
      - prediction
      - label
      - cancellation_probability
      - cancellation_percentage
      - risk_level
    """
    response = client.post("/predict", json=VALID_BOOKING)
    assert response.status_code == 200
    data = response.json()

    assert "prediction" in data
    assert "label" in data
    assert "cancellation_probability" in data
    assert "cancellation_percentage" in data
    assert "risk_level" in data

    # Verify against previously verified values (prediction=0, prob ≈ 0.1791)
    assert data["prediction"] == 0
    assert data["label"] == "Likely to Continue"
    assert 0.15 <= data["cancellation_probability"] <= 0.20
    assert 15.0 <= data["cancellation_percentage"] <= 20.0
    assert data["risk_level"] == "Low Risk"


def test_negative_lead_time_validation():
    """Test 4: Negative lead_time returns HTTP 422 validation error."""
    payload = VALID_BOOKING.copy()
    payload["lead_time"] = -5
    response = client.post("/predict", json=payload)
    assert response.status_code == 422
    assert "lead_time" in response.json()["detail"].lower()


def test_negative_adr_validation():
    """Test 5: Negative adr returns HTTP 422 validation error."""
    payload = VALID_BOOKING.copy()
    payload["adr"] = -10.0
    response = client.post("/predict", json=payload)
    assert response.status_code == 422
    assert "adr" in response.json()["detail"].lower()


def test_invalid_deposit_type_validation():
    """Test 6: Invalid deposit_type returns HTTP 422 validation error."""
    payload = VALID_BOOKING.copy()
    payload["deposit_type"] = "InvalidDepositOption"
    response = client.post("/predict", json=payload)
    assert response.status_code == 422
    assert "deposit_type" in response.json()["detail"].lower()


def test_missing_required_field_validation():
    """Test 7: Missing required field (e.g. adr) returns HTTP 422 validation error."""
    payload = VALID_BOOKING.copy()
    del payload["adr"]
    response = client.post("/predict", json=payload)
    assert response.status_code == 422
    assert "adr" in response.json()["detail"].lower()


def test_preprocessed_feature_shape_and_ordering():
    """Test 8: Preprocessed feature shape is exactly (1, 20) with matching columns."""
    artifacts = load_artifacts()
    top_features = artifacts["top_features"]

    df = preprocess_booking(VALID_BOOKING)
    assert df.shape == (1, 20)
    assert list(df.columns) == top_features
    assert df.isnull().sum().sum() == 0


def test_high_risk_cancellation_prediction():
    """
    Test prediction on high-cancellation attributes:
    Non Refund deposit + long lead time + previous cancellations
    """
    high_risk_booking = {
        "lead_time": 250,
        "arrival_date": "2026-09-01",
        "stays_in_weekend_nights": 1,
        "stays_in_week_nights": 2,
        "adr": 130.00,
        "deposit_type": "Non Refund",
        "customer_type": "Transient",
        "market_segment": "Online TA",
        "country": "PRT",
        "agent": "9",
        "previous_cancellations": 2,
        "booking_changes": 0,
        "required_car_parking_spaces": 0,
        "total_of_special_requests": 0
    }
    response = client.post("/predict", json=high_risk_booking)
    assert response.status_code == 200
    data = response.json()
    assert data["prediction"] == 1
    assert data["label"] == "Likely to Cancel"
    assert data["cancellation_probability"] >= 0.70
    assert data["risk_level"] == "High Risk"
