import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RotateCcw,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Info,
  ShieldCheck,
  Calendar,
  Clock,
  Moon,
  CreditCard,
  DollarSign,
  History,
  Sparkles,
  UserCheck
} from 'lucide-react';

export default function ResultCard({
  result,
  onReset,
  bookingSummary,
  onBackToOverview
}) {
  const [showDetails, setShowDetails] = useState(false);

  if (!result) return null;

  // Extract probability and percentage
  const prob = typeof result.cancellation_probability === 'number'
    ? result.cancellation_probability
    : 0;
  const percentage = result.cancellation_percentage !== undefined
    ? Number(result.cancellation_percentage).toFixed(2)
    : (prob * 100).toFixed(2);

  // Consistent Risk Tier Classification:
  // < 0.40: Low Risk
  // < 0.70: Medium Risk
  // >= 0.70: High Risk
  let tier = 'low';
  let tierLabel = 'LOW RISK';
  let tierHeadline = 'Likely to Continue';
  let tierSummary = 'This reservation currently shows a lower level of cancellation risk.';
  let whatItMeans = 'The booking currently shows fewer cancellation-risk signals.';
  let suggestedResponse = 'Continue with the standard reservation process.';

  if (prob >= 0.70) {
    tier = 'high';
    tierLabel = 'HIGH RISK';
    tierHeadline = 'Likely to Cancel';
    tierSummary = 'This reservation shows a high level of cancellation risk and may deserve additional staff attention.';
    whatItMeans = 'The booking shows stronger cancellation-risk signals and may deserve closer review during planning.';
    suggestedResponse = 'Consider reviewing the reservation, deposit arrangements, and occupancy planning.';
  } else if (prob >= 0.40) {
    tier = 'medium';
    tierLabel = 'MEDIUM RISK';
    tierHeadline = 'Cancellation Risk Identified';
    tierSummary = 'This reservation shows a moderate level of cancellation risk based on its booking information.';
    whatItMeans = 'The booking shows some cancellation-risk signals and may benefit from a confirmation or reminder.';
    suggestedResponse = 'Consider sending a confirmation reminder or reviewing the reservation closer to arrival.';
  }

  // Format booking snapshot figures
  const totalNights = bookingSummary
    ? (parseInt(bookingSummary.stays_in_weekend_nights || 0, 10) +
       parseInt(bookingSummary.stays_in_week_nights || 0, 10))
    : 0;

  const roomRate = bookingSummary?.adr !== undefined
    ? `$${Number(bookingSummary.adr).toFixed(2)}`
    : 'N/A';

  return (
    <div className={`result-card-container tier-${tier}`}>
      {/* ========================================================
          A. RESULT HEADER
         ======================================================== */}
      <div className="result-header-panel">
        <div className="result-tier-pill">
          {tier === 'low' && <CheckCircle2 size={16} />}
          {tier === 'medium' && <AlertTriangle size={16} />}
          {tier === 'high' && <XCircle size={16} />}
          <span>{tierLabel}</span>
        </div>

        <div className="result-score-block">
          <span className="result-score-title">Cancellation Risk:</span>
          <span className="result-score-number">{percentage}%</span>
        </div>

        <h2 className="result-headline-text">{tierHeadline}</h2>
        <p className="result-summary-sentence">{tierSummary}</p>
      </div>

      {/* ========================================================
          B. SIMPLE VISUAL RISK METER
         ======================================================== */}
      <div className="risk-meter-section">
        <div className="meter-label-row">
          <span className="meter-section-title">Risk Scale Position</span>
          <span className="meter-current-tag">{percentage}% Risk</span>
        </div>

        <div className="meter-visual-track">
          {/* Segments: Low (0-40%), Medium (40-70%), High (70-100%) */}
          <div className="meter-segment segment-low" style={{ width: '40%' }}>
            <span className="segment-text">LOW</span>
          </div>
          <div className="meter-segment segment-medium" style={{ width: '30%' }}>
            <span className="segment-text">MEDIUM</span>
          </div>
          <div className="meter-segment segment-high" style={{ width: '30%' }}>
            <span className="segment-text">HIGH</span>
          </div>

          {/* Pointer Marker */}
          <div
            className="meter-pointer-pin"
            style={{ left: `${Math.min(98, Math.max(2, parseFloat(percentage)))}%` }}
            aria-label={`Position: ${percentage}%`}
          >
            <div className="pointer-arrow"></div>
            <div className="pointer-dot"></div>
          </div>
        </div>

        <div className="meter-scale-markers">
          <span className="scale-point point-0">0%</span>
          <span className="scale-point point-40">40%</span>
          <span className="scale-point point-70">70%</span>
          <span className="scale-point point-100">100%</span>
        </div>
      </div>

      {/* ========================================================
          C. WHAT DOES THIS MEAN?
         ======================================================== */}
      <div className="result-section-box">
        <div className="section-box-header">
          <Info size={17} className="box-icon" />
          <h3 className="box-title">What does this mean?</h3>
        </div>
        <p className="box-text-content">{whatItMeans}</p>
      </div>

      {/* ========================================================
          D. SUGGESTED STAFF RESPONSE
         ======================================================== */}
      <div className="result-section-box highlight-box">
        <div className="section-box-header">
          <UserCheck size={17} className="box-icon" />
          <h3 className="box-title">Suggested Staff Response</h3>
        </div>
        <p className="box-text-content bold-text">{suggestedResponse}</p>
        <div className="box-reminder-note">
          <span className="reminder-bullet">•</span>
          <span>Staff judgement should always be used before taking action.</span>
        </div>
      </div>

      {/* ========================================================
          E. BOOKING SNAPSHOT
         ======================================================== */}
      {bookingSummary && (
        <div className="booking-snapshot-box">
          <div className="snapshot-header">
            <h3 className="snapshot-title">Booking Snapshot</h3>
            <button
              type="button"
              className="snapshot-toggle-btn"
              onClick={() => setShowDetails(!showDetails)}
            >
              <span>{showDetails ? 'Hide details' : 'Review entered details'}</span>
              {showDetails ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            </button>
          </div>

          <div className="snapshot-grid">
            <div className="snapshot-card">
              <Clock size={15} className="snapshot-icon" />
              <div className="snapshot-info">
                <span className="snapshot-label">Days Before Arrival</span>
                <span className="snapshot-value">{bookingSummary.lead_time} days</span>
              </div>
            </div>

            <div className="snapshot-card">
              <Moon size={15} className="snapshot-icon" />
              <div className="snapshot-info">
                <span className="snapshot-label">Stay Duration</span>
                <span className="snapshot-value">{totalNights} nights</span>
              </div>
            </div>

            <div className="snapshot-card">
              <DollarSign size={15} className="snapshot-icon" />
              <div className="snapshot-info">
                <span className="snapshot-label">Room Rate</span>
                <span className="snapshot-value">{roomRate}</span>
              </div>
            </div>

            <div className="snapshot-card">
              <CreditCard size={15} className="snapshot-icon" />
              <div className="snapshot-info">
                <span className="snapshot-label">Deposit Type</span>
                <span className="snapshot-value">{bookingSummary.deposit_type || 'No Deposit'}</span>
              </div>
            </div>

            <div className="snapshot-card">
              <History size={15} className="snapshot-icon" />
              <div className="snapshot-info">
                <span className="snapshot-label">Previous Cancellations</span>
                <span className="snapshot-value">{bookingSummary.previous_cancellations || 0}</span>
              </div>
            </div>

            <div className="snapshot-card">
              <Sparkles size={15} className="snapshot-icon" />
              <div className="snapshot-info">
                <span className="snapshot-label">Special Requests</span>
                <span className="snapshot-value">{bookingSummary.total_of_special_requests || 0}</span>
              </div>
            </div>
          </div>

          {showDetails && (
            <div className="snapshot-extended-details">
              <div className="extended-row">
                <span className="ext-label">Arrival Date:</span>
                <span className="ext-val">{bookingSummary.arrival_date || 'N/A'}</span>
              </div>
              <div className="extended-row">
                <span className="ext-label">Customer Type:</span>
                <span className="ext-val">{bookingSummary.customer_type}</span>
              </div>
              <div className="extended-row">
                <span className="ext-label">Distribution Channel:</span>
                <span className="ext-val">{bookingSummary.market_segment}</span>
              </div>
              <div className="extended-row">
                <span className="ext-label">Country Code:</span>
                <span className="ext-val">{bookingSummary.country || 'Unknown'}</span>
              </div>
              <div className="extended-row">
                <span className="ext-label">Booking Changes:</span>
                <span className="ext-val">{bookingSummary.booking_changes || 0}</span>
              </div>
              <div className="extended-row">
                <span className="ext-label">Parking Spaces Requested:</span>
                <span className="ext-val">{bookingSummary.required_car_parking_spaces || 0}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          F. ACTIONS
         ======================================================== */}
      <div className="result-actions-toolbar">
        <button
          type="button"
          className="btn-primary"
          onClick={onReset}
        >
          <RotateCcw size={16} />
          <span>Assess Another Booking</span>
        </button>

        {onBackToOverview && (
          <button
            type="button"
            className="btn-secondary"
            onClick={onBackToOverview}
          >
            <ArrowLeft size={16} />
            <span>Back to Overview</span>
          </button>
        )}
      </div>
    </div>
  );
}
