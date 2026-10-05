import React from 'react';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Percent,
  TrendingUp,
  Info
} from 'lucide-react';

export default function ResultCard({ result, onReset, bookingSummary }) {
  if (!result) return null;

  const isCancelled = result.prediction === 1;
  const probability = result.cancellation_probability;
  const percentage = result.cancellation_percentage ?? (probability * 100).toFixed(2);
  const riskLevel = result.risk_level;

  // Determine color theme based on risk tier
  let themeClass = 'risk-low';
  let badgeText = 'Low Risk';
  if (riskLevel === 'High Risk' || probability >= 0.70) {
    themeClass = 'risk-high';
    badgeText = 'High Risk';
  } else if (riskLevel === 'Medium Risk' || probability >= 0.40) {
    themeClass = 'risk-medium';
    badgeText = 'Medium Risk';
  }

  return (
    <div className={`result-card-container ${themeClass}`}>
      <div className="result-card-header">
        <div className="result-status-badge">
          {isCancelled ? (
            <XCircle className="result-icon-cancel" size={24} />
          ) : (
            <CheckCircle2 className="result-icon-continue" size={24} />
          )}
          <span className="result-headline">{result.label}</span>
        </div>

        <div className={`risk-pill ${themeClass}`}>
          <TrendingUp size={14} />
          <span>{badgeText}</span>
        </div>
      </div>

      <div className="result-metric-grid">
        <div className="result-metric-card primary-metric">
          <span className="metric-label">Cancellation Probability</span>
          <div className="metric-value-row">
            <span className="metric-large-value">{percentage}%</span>
            <span className="metric-ratio">({probability.toFixed(4)})</span>
          </div>

          <div className="probability-bar-track">
            <div
              className={`probability-bar-fill ${themeClass}`}
              style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
            ></div>
          </div>

          <div className="probability-bar-scale">
            <span>0% (Safe)</span>
            <span>40% (Medium)</span>
            <span>70% (High)</span>
            <span>100%</span>
          </div>
        </div>

        <div className="result-metric-card secondary-metric">
          <span className="metric-label">Model Class Decision</span>
          <div className="metric-decision-box">
            <span className="decision-code">Class {result.prediction}</span>
            <span className="decision-desc">
              {isCancelled ? 'High cancellation hazard' : 'Booking likely retained'}
            </span>
          </div>

          {bookingSummary && (
            <div className="booking-summary-pills">
              <span className="summary-pill">Lead: {bookingSummary.lead_time}d</span>
              <span className="summary-pill">Stay: {Number(bookingSummary.stays_in_weekend_nights || 0) + Number(bookingSummary.stays_in_week_nights || 0)}n</span>
              <span className="summary-pill">ADR: ${Number(bookingSummary.adr || 0).toFixed(2)}</span>
            </div>
          )}
        </div>
      </div>

      <div className="risk-bands-explainer">
        <div className="explainer-header">
          <Info size={14} />
          <span>Application Risk Tiers (Operational Policy)</span>
        </div>
        <div className="risk-bands-grid">
          <div className={`band-item ${probability < 0.40 ? 'active' : ''}`}>
            <span className="band-name">Low Risk</span>
            <span className="band-range">0% – 39%</span>
            <span className="band-action">Standard check-in protocol</span>
          </div>
          <div className={`band-item ${probability >= 0.40 && probability < 0.70 ? 'active' : ''}`}>
            <span className="band-name">Medium Risk</span>
            <span className="band-range">40% – 69%</span>
            <span className="band-action">Send confirmation reminder</span>
          </div>
          <div className={`band-item ${probability >= 0.70 ? 'active' : ''}`}>
            <span className="band-name">High Risk</span>
            <span className="band-range">70% – 100%</span>
            <span className="band-action">Review deposit & overbooking buffer</span>
          </div>
        </div>
        <p className="explainer-disclaimer">
          *Note: Risk tiers are application-level presentation guidelines for staff prioritization. The primary decision is generated directly by the trained Random Forest model.
        </p>
      </div>

      <div className="result-actions">
        <button
          type="button"
          className="btn-new-prediction"
          onClick={onReset}
        >
          <RotateCcw size={16} />
          <span>Test Another Booking</span>
        </button>
      </div>
    </div>
  );
}
