import React from 'react';
import {
  FileText,
  Search,
  ShieldAlert,
  Users,
  Clock,
  Filter,
  CalendarCheck,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  ChevronRight,
  Building2,
  CheckCircle2
} from 'lucide-react';

export default function OverviewPage({ onNavigate }) {
  return (
    <div className="overview-page">
      {/* Hero Section with Split Hospitality Visual */}
      <section className="hero-section">
        <div className="hero-split-container">
          {/* Left Text & CTAs */}
          <div className="hero-text-col">
            <div className="hero-badge">
              <span className="badge-dot"></span>
              <span>Hotel Operations Decision Support</span>
            </div>
            <h1 className="hero-title">
              Spot Cancellation Risk Before It Becomes a Surprise
            </h1>
            <p className="hero-subtitle">
              ReserveIQ uses existing reservation information to estimate cancellation risk,
              helping hotel teams identify bookings that may need additional attention before arrival.
            </p>
            <div className="hero-actions">
              <button
                type="button"
                className="btn-primary hero-btn-primary"
                onClick={() => onNavigate('assessment')}
              >
                <span>Assess a Booking</span>
                <ArrowRight size={18} />
              </button>
              <button
                type="button"
                className="btn-secondary hero-btn-secondary"
                onClick={() => onNavigate('how-it-works')}
              >
                <span>How ReserveIQ Works</span>
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* Right Hospitality Visual Showcase */}
          <div className="hero-visual-col">
            <div className="hero-image-card">
              <img
                src="/images/hotel_reception_hero.jpg"
                alt="Modern luxury hotel front desk and reservation area"
                className="hero-image"
                loading="eager"
              />
              <div className="hero-image-overlay-badge">
                <Building2 size={14} className="overlay-badge-icon" />
                <span>Front Desk & Reservation Operations</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Journey Section */}
      <section className="journey-section">
        <div className="section-intro">
          <span className="section-eyebrow">Operational Workflow</span>
          <h2 className="section-heading">How Decision Support Works in Practice</h2>
        </div>

        <div className="journey-grid">
          {/* Step 1 */}
          <div className="journey-card">
            <div className="journey-step-badge">1</div>
            <div className="journey-icon-box">
              <FileText size={20} />
            </div>
            <h3 className="journey-card-title">Booking Details</h3>
            <p className="journey-card-desc">
              Use information already available in the reservation.
            </p>
          </div>

          <div className="journey-connector" aria-hidden="true">
            <ArrowRight size={18} />
          </div>

          {/* Step 2 */}
          <div className="journey-card">
            <div className="journey-step-badge">2</div>
            <div className="journey-icon-box">
              <Search size={20} />
            </div>
            <h3 className="journey-card-title">ReserveIQ</h3>
            <p className="journey-card-desc">
              Reviews booking patterns linked with cancellation risk.
            </p>
          </div>

          <div className="journey-connector" aria-hidden="true">
            <ArrowRight size={18} />
          </div>

          {/* Step 3 */}
          <div className="journey-card">
            <div className="journey-step-badge">3</div>
            <div className="journey-icon-box">
              <ShieldAlert size={20} />
            </div>
            <h3 className="journey-card-title">Risk Assessment</h3>
            <p className="journey-card-desc">
              Returns a simple Low, Medium, or High risk indication.
            </p>
          </div>

          <div className="journey-connector" aria-hidden="true">
            <ArrowRight size={18} />
          </div>

          {/* Step 4 */}
          <div className="journey-card">
            <div className="journey-step-badge">4</div>
            <div className="journey-icon-box">
              <Users size={20} />
            </div>
            <h3 className="journey-card-title">Staff Decision</h3>
            <p className="journey-card-desc">
              Hotel staff decide what action is appropriate.
            </p>
          </div>
        </div>

        {/* Visible Core Principle Banner */}
        <div className="principle-banner">
          <div className="principle-quote">
            <Sparkles size={18} className="principle-icon" />
            <span className="principle-text">
              &ldquo;ReserveIQ informs the decision. Your team makes the decision.&rdquo;
            </span>
          </div>
        </div>
      </section>

      {/* Why Use ReserveIQ Section */}
      <section className="benefits-section">
        <div className="section-intro">
          <span className="section-eyebrow">Practical Value</span>
          <h2 className="section-heading">Why use ReserveIQ?</h2>
        </div>

        <div className="benefits-grid">
          <div className="benefit-card">
            <div className="benefit-icon-wrapper">
              <Clock size={22} />
            </div>
            <h3 className="benefit-title">Earlier Awareness</h3>
            <p className="benefit-text">
              Identify bookings that may deserve attention well before arrival, giving front-desk and reservation teams time to reach out.
            </p>
          </div>

          <div className="benefit-card">
            <div className="benefit-icon-wrapper">
              <Filter size={22} />
            </div>
            <h3 className="benefit-title">Better Prioritization</h3>
            <p className="benefit-text">
              Help staff focus follow-up communications and confirmation reminders where they may be most productive.
            </p>
          </div>

          <div className="benefit-card">
            <div className="benefit-icon-wrapper">
              <CalendarCheck size={22} />
            </div>
            <h3 className="benefit-title">Better Planning</h3>
            <p className="benefit-text">
              Use risk information alongside room availability and occupancy forecasting to make better daily operational choices.
            </p>
          </div>
        </div>
      </section>

      {/* Responsible Use Callout */}
      <section className="responsible-section">
        <div className="responsible-callout">
          <div className="responsible-icon-col">
            <AlertTriangle size={22} className="responsible-icon" />
          </div>
          <div className="responsible-content">
            <h4 className="responsible-title">
              Cancellation risk is an estimate, not a certainty.
            </h4>
            <p className="responsible-text">
              ReserveIQ is designed to support staff judgement rather than automatically cancelling, altering, or penalizing any reservation. Always rely on guest context and hotel policies.
            </p>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bottom-cta-section">
        <div className="bottom-cta-card">
          <div className="bottom-cta-text">
            <h3>Ready to check a reservation?</h3>
            <p>Assess lead times, stay details, and channels with our dedicated risk tool.</p>
          </div>
          <button
            type="button"
            className="btn-primary"
            onClick={() => onNavigate('assessment')}
          >
            <span>Start Risk Assessment</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </section>
    </div>
  );
}
