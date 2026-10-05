import React from 'react';
import { ShieldCheck, Server, AlertCircle, RefreshCw } from 'lucide-react';

export default function Header({ backendStatus, onRetryHealth }) {
  return (
    <header className="header-container">
      <div className="header-content">
        <div className="brand-group">
          <div className="brand-icon-wrapper">
            <ShieldCheck className="brand-icon" size={32} />
          </div>
          <div>
            <div className="brand-title-row">
              <h1 className="brand-title">ReserveIQ</h1>
              <span className="brand-badge">ML 1.0</span>
            </div>
            <p className="brand-subtitle">Hotel Booking Cancellation Prediction System</p>
          </div>
        </div>

        <div className="header-status-area">
          <div
            className={`status-pill ${backendStatus.online ? 'status-online' : 'status-offline'}`}
            title={backendStatus.online ? 'FastAPI Backend Online' : (backendStatus.error || 'Backend Unreachable')}
          >
            <span className="status-dot"></span>
            <Server size={14} className="status-icon" />
            <span className="status-label">
              {backendStatus.loading
                ? 'Connecting...'
                : backendStatus.online
                  ? 'Backend Online'
                  : 'Backend Offline'}
            </span>
            {!backendStatus.online && (
              <button
                className="retry-btn"
                onClick={onRetryHealth}
                title="Retry connecting to backend"
                type="button"
              >
                <RefreshCw size={12} />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="header-description-bar">
        <p className="header-description">
          Enter raw booking details below to estimate the likelihood of reservation cancellation using the trained Random Forest model.
        </p>
      </div>
    </header>
  );
}
