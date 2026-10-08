import React from 'react';
import { Calendar, Moon, Clock, CreditCard, DollarSign } from 'lucide-react';

export default function AssessmentSummary({ formData }) {
  // Format total nights
  const weekend = parseInt(formData.stays_in_weekend_nights, 10) || 0;
  const weekday = parseInt(formData.stays_in_week_nights, 10) || 0;
  const totalNights = weekend + weekday;

  // Format arrival date display
  const formatDate = (dateStr) => {
    if (!dateStr) return 'Not selected';
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const d = new Date(parts[0], parseInt(parts[1], 10) - 1, parts[2]);
        if (!isNaN(d.getTime())) {
          return d.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          });
        }
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  // Format room rate
  const formatRate = (rate) => {
    if (rate === '' || rate === null || rate === undefined) return '$0.00';
    const num = parseFloat(rate);
    return isNaN(num) ? '$0.00' : `$${num.toFixed(2)}`;
  };

  return (
    <div className="assessment-summary-box">
      <div className="summary-title-row">
        <span className="summary-badge">Summary</span>
        <h4 className="summary-heading">Reservation Details for Assessment</h4>
      </div>

      <div className="summary-items-grid">
        <div className="summary-item">
          <Calendar size={14} className="summary-icon" />
          <span className="summary-label">Arrival:</span>
          <span className="summary-val">{formatDate(formData.arrival_date)}</span>
        </div>

        <div className="summary-item">
          <Moon size={14} className="summary-icon" />
          <span className="summary-label">Stay:</span>
          <span className="summary-val">
            {totalNights} {totalNights === 1 ? 'night' : 'nights'}
          </span>
        </div>

        <div className="summary-item">
          <Clock size={14} className="summary-icon" />
          <span className="summary-label">Days before arrival:</span>
          <span className="summary-val">
            {formData.lead_time !== '' ? `${formData.lead_time} days` : 'Not set'}
          </span>
        </div>

        <div className="summary-item">
          <CreditCard size={14} className="summary-icon" />
          <span className="summary-label">Deposit:</span>
          <span className="summary-val">{formData.deposit_type || 'No Deposit'}</span>
        </div>

        <div className="summary-item">
          <DollarSign size={14} className="summary-icon" />
          <span className="summary-label">Average room rate:</span>
          <span className="summary-val">{formatRate(formData.adr)}</span>
        </div>
      </div>
    </div>
  );
}
