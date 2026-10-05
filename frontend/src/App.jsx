import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import BookingForm from './components/BookingForm';
import ResultCard from './components/ResultCard';
import { checkHealth, predictBooking } from './services/api';
import { ShieldCheck, BarChart3, Clock, CheckCircle } from 'lucide-react';

export default function App() {
  const [backendStatus, setBackendStatus] = useState({
    loading: true,
    online: false,
    error: null
  });

  const [isLoading, setIsLoading] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);
  const [submittedBooking, setSubmittedBooking] = useState(null);
  const [generalError, setGeneralError] = useState(null);

  // Check backend health on initial load
  const loadHealthStatus = async () => {
    setBackendStatus((prev) => ({ ...prev, loading: true }));
    const health = await checkHealth();
    setBackendStatus({
      loading: false,
      online: health.online,
      error: health.error || null
    });
  };

  useEffect(() => {
    loadHealthStatus();
  }, []);

  const handlePredict = async (bookingData) => {
    setIsLoading(true);
    setGeneralError(null);
    setSubmittedBooking(bookingData);

    const response = await predictBooking(bookingData);

    setIsLoading(false);

    if (response.success) {
      setPredictionResult(response.data);
      // Smooth scroll to results
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 50);
    } else {
      setGeneralError(response.error || 'An error occurred while generating the prediction.');
      // Update health status if network error
      if (response.error && response.error.includes('Network connection error')) {
        setBackendStatus({ loading: false, online: false, error: response.error });
      }
    }
  };

  const handleReset = () => {
    setPredictionResult(null);
    setSubmittedBooking(null);
    setGeneralError(null);
  };

  return (
    <div className="app-layout">
      <Header
        backendStatus={backendStatus}
        onRetryHealth={loadHealthStatus}
      />

      <main className="main-content">
        <div className="content-container">
          {predictionResult ? (
            <div className="results-wrapper">
              <ResultCard
                result={predictionResult}
                bookingSummary={submittedBooking}
                onReset={handleReset}
              />
            </div>
          ) : (
            <div className="form-wrapper">
              <BookingForm
                onSubmit={handlePredict}
                isLoading={isLoading}
                generalError={generalError}
              />
            </div>
          )}
        </div>
      </main>

      <footer className="app-footer">
        <div className="footer-content">
          <div className="footer-meta">
            <span className="footer-brand">ReserveIQ</span>
            <span className="footer-sep">•</span>
            <span>Trained Random Forest Classification (300 Trees)</span>
            <span className="footer-sep">•</span>
            <span>Top-20 Feature Pipeline</span>
          </div>
          <p className="footer-note">
            Powered by scikit-learn & FastAPI. Zero PII collected.
          </p>
        </div>
      </footer>
    </div>
  );
}
