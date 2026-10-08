import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import OverviewPage from './components/pages/OverviewPage';
import AssessmentPage from './components/pages/AssessmentPage';
import HowItWorksPage from './components/pages/HowItWorksPage';
import RiskGuidePage from './components/pages/RiskGuidePage';
import AboutPage from './components/pages/AboutPage';
import { checkHealth, predictBooking } from './services/api';

export default function App() {
  const [activePage, setActivePage] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [backendStatus, setBackendStatus] = useState({
    loading: true,
    online: false,
    error: null
  });

  const [isLoading, setIsLoading] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);
  const [submittedBooking, setSubmittedBooking] = useState(null);
  const [generalError, setGeneralError] = useState(null);

  // Check system health on initial load
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
      setGeneralError(response.error || 'An error occurred while assessing cancellation risk.');
      if (response.error && response.error.includes('Network connection error')) {
        setBackendStatus({ loading: false, online: false, error: response.error });
      }
    }
  };

  const handleResetPrediction = () => {
    setPredictionResult(null);
    setSubmittedBooking(null);
    setGeneralError(null);
  };

  const handleNavigate = (pageId) => {
    setActivePage(pageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getPageTitle = (pageId) => {
    switch (pageId) {
      case 'overview':
        return 'Overview';
      case 'assessment':
        return 'New Risk Assessment';
      case 'how-it-works':
        return 'How It Works';
      case 'risk-guide':
        return 'Risk Guide';
      case 'about':
        return 'About ReserveIQ';
      default:
        return 'ReserveIQ';
    }
  };

  return (
    <div className="app-shell-layout">
      {/* Left Navigation Sidebar */}
      <Sidebar
        activePage={activePage}
        onNavigate={handleNavigate}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        backendStatus={backendStatus}
      />

      {/* Main View Area */}
      <div className="app-main-viewport">
        {/* Top Bar for Mobile & Quick Status */}
        <TopBar
          onToggleSidebar={() => setSidebarOpen(true)}
          activePageTitle={getPageTitle(activePage)}
          backendStatus={backendStatus}
        />

        <main className="app-content-area" id="main-content">
          <div className="app-content-container">
            {activePage === 'overview' && (
              <OverviewPage onNavigate={handleNavigate} />
            )}

            {activePage === 'assessment' && (
              <AssessmentPage
                onSubmit={handlePredict}
                isLoading={isLoading}
                generalError={generalError}
                predictionResult={predictionResult}
                submittedBooking={submittedBooking}
                onReset={handleResetPrediction}
                onNavigate={handleNavigate}
              />
            )}

            {activePage === 'how-it-works' && (
              <HowItWorksPage onNavigate={handleNavigate} />
            )}

            {activePage === 'risk-guide' && (
              <RiskGuidePage onNavigate={handleNavigate} />
            )}

            {activePage === 'about' && (
              <AboutPage />
            )}
          </div>
        </main>

        {/* Professional Minimalist Footer */}
        <footer className="app-footer">
          <div className="footer-content">
            <div className="footer-brand-row">
              <span className="footer-title">ReserveIQ</span>
              <span className="footer-sep">•</span>
              <span>Hotel Booking Cancellation Risk Decision Support</span>
            </div>
            <p className="footer-notice">
              Decision support tool for hotel operations. Staff judgement should guide reservation actions.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
