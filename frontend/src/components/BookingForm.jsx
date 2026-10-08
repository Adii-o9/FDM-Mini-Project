import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  DollarSign,
  Moon,
  CreditCard,
  User,
  Compass,
  Globe,
  Briefcase,
  History,
  Edit3,
  Car,
  Sparkles,
  AlertCircle,
  RotateCcw,
  Sparkle,
  BookmarkCheck,
  CheckCircle2,
  Info
} from 'lucide-react';
import AssessmentSummary from './AssessmentSummary';

const INITIAL_FORM_STATE = {
  lead_time: '',
  arrival_date: '',
  stays_in_weekend_nights: '',
  stays_in_week_nights: '',
  adr: '',
  deposit_type: 'No Deposit',
  customer_type: 'Transient',
  market_segment: 'Online TA',
  country: 'Unknown',
  agent: 'No Agent',
  previous_cancellations: 0,
  booking_changes: 0,
  required_car_parking_spaces: 0,
  total_of_special_requests: 0
};

// Verified Low-Risk Test Booking (Expected low risk, ~17.9% cancellation)
const SAMPLE_LOW_RISK = {
  lead_time: 65,
  arrival_date: '2026-08-15',
  stays_in_weekend_nights: 2,
  stays_in_week_nights: 3,
  adr: 125.50,
  deposit_type: 'No Deposit',
  customer_type: 'Transient',
  market_segment: 'Online TA',
  country: 'PRT',
  agent: '9',
  previous_cancellations: 0,
  booking_changes: 1,
  required_car_parking_spaces: 0,
  total_of_special_requests: 2
};

// Verified High-Risk Test Booking (Expected high risk, ~97.4% cancellation)
const SAMPLE_HIGH_RISK = {
  lead_time: 250,
  arrival_date: '2026-09-01',
  stays_in_weekend_nights: 1,
  stays_in_week_nights: 2,
  adr: 130.00,
  deposit_type: 'Non Refund',
  customer_type: 'Transient',
  market_segment: 'Online TA',
  country: 'PRT',
  agent: '9',
  previous_cancellations: 2,
  booking_changes: 0,
  required_car_parking_spaces: 0,
  total_of_special_requests: 0
};

export default function BookingForm({ onSubmit, isLoading, generalError }) {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    switch (name) {
      case 'lead_time':
        if (value === '' || value === null || value === undefined) {
          return 'Days before arrival is required.';
        }
        if (Number(value) < 0) {
          return 'Days before arrival cannot be negative.';
        }
        return '';
      case 'arrival_date':
        if (!value || value.trim() === '') {
          return 'Arrival date is required.';
        }
        return '';
      case 'stays_in_weekend_nights':
        if (value === '' || value === null || value === undefined) {
          return 'Weekend nights is required.';
        }
        if (Number(value) < 0) {
          return 'Weekend nights cannot be negative.';
        }
        return '';
      case 'stays_in_week_nights':
        if (value === '' || value === null || value === undefined) {
          return 'Weekday nights is required.';
        }
        if (Number(value) < 0) {
          return 'Weekday nights cannot be negative.';
        }
        return '';
      case 'adr':
        if (value === '' || value === null || value === undefined) {
          return 'Average daily room rate is required.';
        }
        if (Number(value) < 0) {
          return 'Average daily room rate cannot be negative.';
        }
        return '';
      case 'previous_cancellations':
        if (Number(value) < 0) {
          return 'Previous cancellations cannot be negative.';
        }
        return '';
      case 'booking_changes':
        if (Number(value) < 0) {
          return 'Booking changes cannot be negative.';
        }
        return '';
      case 'required_car_parking_spaces':
        if (Number(value) < 0) {
          return 'Parking spaces cannot be negative.';
        }
        return '';
      case 'total_of_special_requests':
        if (Number(value) < 0) {
          return 'Special requests cannot be negative.';
        }
        return '';
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    // Live validation update
    const err = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: err
    }));
  };

  const validateAll = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const err = validateField(key, formData[key]);
      if (err) newErrors[key] = err;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateAll()) {
      return;
    }

    // Format clean payload with exact types matching BookingRequest schema
    const payload = {
      lead_time: parseInt(formData.lead_time, 10),
      arrival_date: formData.arrival_date,
      stays_in_weekend_nights: parseInt(formData.stays_in_weekend_nights, 10),
      stays_in_week_nights: parseInt(formData.stays_in_week_nights, 10),
      adr: parseFloat(formData.adr),
      deposit_type: formData.deposit_type,
      customer_type: formData.customer_type,
      market_segment: formData.market_segment,
      country: formData.country ? formData.country.trim() : 'Unknown',
      agent: formData.agent ? formData.agent.trim() : 'No Agent',
      previous_cancellations: parseInt(formData.previous_cancellations || 0, 10),
      booking_changes: parseInt(formData.booking_changes || 0, 10),
      required_car_parking_spaces: parseInt(formData.required_car_parking_spaces || 0, 10),
      total_of_special_requests: parseInt(formData.total_of_special_requests || 0, 10)
    };

    onSubmit(payload);
  };

  const handleReset = () => {
    setFormData(INITIAL_FORM_STATE);
    setErrors({});
  };

  const loadPreset = (preset) => {
    setFormData(preset);
    setErrors({});
  };

  return (
    <form className="booking-form" onSubmit={handleSubmit} noValidate>
      {/* Test Sample Quick Fill Bar */}
      <div className="preset-bar">
        <span className="preset-label">
          <BookmarkCheck size={14} /> Quick Samples for Review:
        </span>
        <div className="preset-buttons">
          <button
            type="button"
            className="preset-btn btn-preset-low"
            onClick={() => loadPreset(SAMPLE_LOW_RISK)}
            disabled={isLoading}
            title="Load sample booking with low cancellation indicators"
          >
            Sample: Low Risk Booking
          </button>
          <button
            type="button"
            className="preset-btn btn-preset-high"
            onClick={() => loadPreset(SAMPLE_HIGH_RISK)}
            disabled={isLoading}
            title="Load sample booking with high cancellation indicators"
          >
            Sample: High Risk Booking
          </button>
          <button
            type="button"
            className="preset-btn btn-preset-clear"
            onClick={handleReset}
            disabled={isLoading}
          >
            <RotateCcw size={13} /> Clear
          </button>
        </div>
      </div>

      {generalError && (
        <div className="form-error-banner" role="alert">
          <AlertCircle size={18} />
          <span>{generalError}</span>
        </div>
      )}

      {/* SECTION 1: Booking Information */}
      <div className="form-section">
        <div className="section-header">
          <div className="section-number">1</div>
          <div>
            <h2 className="section-title">Booking Information</h2>
            <p className="section-desc">Key timing parameters between reservation placement and check-in</p>
          </div>
        </div>

        <div className="fields-grid grid-2">
          {/* Lead Time / Days Before Arrival */}
          <div className={`form-field ${errors.lead_time ? 'has-error' : ''}`}>
            <label htmlFor="lead_time" className="field-label">
              <Clock size={15} /> Days Before Arrival <span className="required-star">*</span>
            </label>
            <input
              id="lead_time"
              name="lead_time"
              type="number"
              min="0"
              placeholder="e.g. 45"
              value={formData.lead_time}
              onChange={handleChange}
              className="field-input"
              required
            />
            <span className="field-help">Number of days between the booking date and arrival date.</span>
            {errors.lead_time && <span className="field-error-msg">{errors.lead_time}</span>}
          </div>

          {/* Arrival Date */}
          <div className={`form-field ${errors.arrival_date ? 'has-error' : ''}`}>
            <label htmlFor="arrival_date" className="field-label">
              <Calendar size={15} /> Arrival Date <span className="required-star">*</span>
            </label>
            <input
              id="arrival_date"
              name="arrival_date"
              type="date"
              value={formData.arrival_date}
              onChange={handleChange}
              className="field-input"
              required
            />
            <span className="field-help">Scheduled guest check-in date.</span>
            {errors.arrival_date && <span className="field-error-msg">{errors.arrival_date}</span>}
          </div>
        </div>
      </div>

      {/* SECTION 2: Stay Details */}
      <div className="form-section">
        <div className="section-header">
          <div className="section-number">2</div>
          <div>
            <h2 className="section-title">Stay & Room Rate Details</h2>
            <p className="section-desc">Duration of scheduled stay and daily room revenue rate</p>
          </div>
        </div>

        <div className="fields-grid grid-3">
          {/* Weekend Nights */}
          <div className={`form-field ${errors.stays_in_weekend_nights ? 'has-error' : ''}`}>
            <label htmlFor="stays_in_weekend_nights" className="field-label">
              <Moon size={15} /> Weekend Nights <span className="required-star">*</span>
            </label>
            <input
              id="stays_in_weekend_nights"
              name="stays_in_weekend_nights"
              type="number"
              min="0"
              placeholder="0"
              value={formData.stays_in_weekend_nights}
              onChange={handleChange}
              className="field-input"
              required
            />
            <span className="field-help">Saturday or Sunday nights.</span>
            {errors.stays_in_weekend_nights && (
              <span className="field-error-msg">{errors.stays_in_weekend_nights}</span>
            )}
          </div>

          {/* Weekday Nights */}
          <div className={`form-field ${errors.stays_in_week_nights ? 'has-error' : ''}`}>
            <label htmlFor="stays_in_week_nights" className="field-label">
              <Calendar size={15} /> Weekday Nights <span className="required-star">*</span>
            </label>
            <input
              id="stays_in_week_nights"
              name="stays_in_week_nights"
              type="number"
              min="0"
              placeholder="0"
              value={formData.stays_in_week_nights}
              onChange={handleChange}
              className="field-input"
              required
            />
            <span className="field-help">Monday to Friday nights.</span>
            {errors.stays_in_week_nights && (
              <span className="field-error-msg">{errors.stays_in_week_nights}</span>
            )}
          </div>

          {/* Average Daily Room Rate (ADR) */}
          <div className={`form-field ${errors.adr ? 'has-error' : ''}`}>
            <label htmlFor="adr" className="field-label">
              <DollarSign size={15} />
              <span>Average Daily Room Rate</span>
              <span className="field-label-sub">(ADR)</span>
              <span className="required-star">*</span>
            </label>
            <input
              id="adr"
              name="adr"
              type="number"
              step="0.01"
              min="0"
              placeholder="e.g. 110.50"
              value={formData.adr}
              onChange={handleChange}
              className="field-input"
              required
            />
            <span className="field-help">Average price per room per night in EUR/USD.</span>
            {errors.adr && <span className="field-error-msg">{errors.adr}</span>}
          </div>
        </div>
      </div>

      {/* SECTION 3: Customer & Booking Source */}
      <div className="form-section">
        <div className="section-header">
          <div className="section-number">3</div>
          <div>
            <h2 className="section-title">Guest Profile & Booking Channel</h2>
            <p className="section-desc">Deposit terms, guest classification, and distribution source</p>
          </div>
        </div>

        <div className="fields-grid grid-3">
          {/* Deposit Type */}
          <div className="form-field">
            <label htmlFor="deposit_type" className="field-label">
              <CreditCard size={15} /> Deposit Type <span className="required-star">*</span>
            </label>
            <select
              id="deposit_type"
              name="deposit_type"
              value={formData.deposit_type}
              onChange={handleChange}
              className="field-select"
              required
            >
              <option value="No Deposit">No Deposit</option>
              <option value="Non Refund">Non Refund</option>
              <option value="Refundable">Refundable</option>
            </select>
            <span className="field-help">Reservation guarantee policy.</span>
          </div>

          {/* Customer Type */}
          <div className="form-field">
            <label htmlFor="customer_type" className="field-label">
              <User size={15} /> Customer Type <span className="required-star">*</span>
            </label>
            <select
              id="customer_type"
              name="customer_type"
              value={formData.customer_type}
              onChange={handleChange}
              className="field-select"
              required
            >
              <option value="Transient">Transient (Individual)</option>
              <option value="Transient-Party">Transient-Party (Associated)</option>
              <option value="Contract">Contract (Corporate/Allotment)</option>
              <option value="Group">Group</option>
            </select>
            <span className="field-help">Booking party structure.</span>
          </div>

          {/* Market Segment */}
          <div className="form-field">
            <label htmlFor="market_segment" className="field-label">
              <Compass size={15} /> Market Segment <span className="required-star">*</span>
            </label>
            <select
              id="market_segment"
              name="market_segment"
              value={formData.market_segment}
              onChange={handleChange}
              className="field-select"
              required
            >
              <option value="Online TA">Online Travel Agency (OTA)</option>
              <option value="Offline TA/TO">Offline TA / Tour Operator</option>
              <option value="Groups">Groups</option>
              <option value="Direct">Direct Hotel Booking</option>
              <option value="Corporate">Corporate</option>
              <option value="Complementary">Complementary</option>
              <option value="Aviation">Aviation</option>
            </select>
            <span className="field-help">Booking channel origin.</span>
          </div>
        </div>

        <div className="fields-grid grid-2" style={{ marginTop: '1rem' }}>
          {/* Country Code */}
          <div className="form-field">
            <label htmlFor="country" className="field-label">
              <Globe size={15} /> Country Code
            </label>
            <input
              id="country"
              name="country"
              type="text"
              placeholder="PRT, GBR, FRA, ESP, or Unknown"
              value={formData.country}
              onChange={handleChange}
              className="field-input"
            />
            <span className="field-help">3-letter country code (Default: Unknown).</span>
          </div>

          {/* Booking Agent ID */}
          <div className="form-field">
            <label htmlFor="agent" className="field-label">
              <Briefcase size={15} /> Booking Agent ID
            </label>
            <input
              id="agent"
              name="agent"
              type="text"
              placeholder="e.g. 9, 240, or No Agent"
              value={formData.agent}
              onChange={handleChange}
              className="field-input"
            />
            <span className="field-help">Partner agent identifier (Default: No Agent).</span>
          </div>
        </div>
      </div>

      {/* SECTION 4: Booking History & Requests */}
      <div className="form-section">
        <div className="section-header">
          <div className="section-number">4</div>
          <div>
            <h2 className="section-title">History & Special Requests</h2>
            <p className="section-desc">Prior guest cancellations, reservation modifications, and requests</p>
          </div>
        </div>

        <div className="fields-grid grid-4">
          {/* Previous Cancellations by Guest */}
          <div className={`form-field ${errors.previous_cancellations ? 'has-error' : ''}`}>
            <label htmlFor="previous_cancellations" className="field-label">
              <History size={15} /> Prev. Cancellations
            </label>
            <input
              id="previous_cancellations"
              name="previous_cancellations"
              type="number"
              min="0"
              value={formData.previous_cancellations}
              onChange={handleChange}
              className="field-input"
            />
            <span className="field-help">Previous cancellations by guest.</span>
            {errors.previous_cancellations && (
              <span className="field-error-msg">{errors.previous_cancellations}</span>
            )}
          </div>

          {/* Booking Changes */}
          <div className={`form-field ${errors.booking_changes ? 'has-error' : ''}`}>
            <label htmlFor="booking_changes" className="field-label">
              <Edit3 size={15} /> Booking Changes
            </label>
            <input
              id="booking_changes"
              name="booking_changes"
              type="number"
              min="0"
              value={formData.booking_changes}
              onChange={handleChange}
              className="field-input"
            />
            <span className="field-help">Amendments made before arrival.</span>
            {errors.booking_changes && (
              <span className="field-error-msg">{errors.booking_changes}</span>
            )}
          </div>

          {/* Parking Spaces */}
          <div className={`form-field ${errors.required_car_parking_spaces ? 'has-error' : ''}`}>
            <label htmlFor="required_car_parking_spaces" className="field-label">
              <Car size={15} /> Parking Spaces
            </label>
            <input
              id="required_car_parking_spaces"
              name="required_car_parking_spaces"
              type="number"
              min="0"
              value={formData.required_car_parking_spaces}
              onChange={handleChange}
              className="field-input"
            />
            <span className="field-help">Requested vehicle parking slots.</span>
            {errors.required_car_parking_spaces && (
              <span className="field-error-msg">{errors.required_car_parking_spaces}</span>
            )}
          </div>

          {/* Special Requests */}
          <div className={`form-field ${errors.total_of_special_requests ? 'has-error' : ''}`}>
            <label htmlFor="total_of_special_requests" className="field-label">
              <Sparkles size={15} /> Special Requests
            </label>
            <input
              id="total_of_special_requests"
              name="total_of_special_requests"
              type="number"
              min="0"
              value={formData.total_of_special_requests}
              onChange={handleChange}
              className="field-input"
            />
            <span className="field-help">High floor, twin beds, etc.</span>
            {errors.total_of_special_requests && (
              <span className="field-error-msg">{errors.total_of_special_requests}</span>
            )}
          </div>
        </div>
      </div>

      {/* SECTION 5: Review & Assessment Summary */}
      <div className="form-section-review">
        <AssessmentSummary formData={formData} />
      </div>

      {/* Form Action Buttons */}
      <div className="form-submit-row">
        <button
          type="button"
          className="btn-secondary"
          onClick={handleReset}
          disabled={isLoading}
        >
          <RotateCcw size={16} /> Reset Form
        </button>

        <button
          type="submit"
          className="btn-primary btn-submit-action"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="spinner"></span>
              <span>Assessing booking risk...</span>
            </>
          ) : (
            <>
              <Sparkle size={18} />
              <span>Assess Cancellation Risk</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
