import React, { useState } from 'react';
import {
  ShieldCheck,
  Target,
  Users,
  Compass,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Cpu,
  Layers,
  FileCode2,
  Lock
} from 'lucide-react';

export default function AboutPage() {
  const [techOpen, setTechOpen] = useState(false);

  return (
    <div className="about-page">
      <div className="page-header">
        <span className="page-eyebrow">System Overview</span>
        <h1 className="page-title">About ReserveIQ</h1>
        <p className="page-subtitle">
          Decision-support prototype engineered to provide earlier cancellation awareness for hospitality teams.
        </p>
      </div>

      {/* Main Core Mission Box */}
      <div className="about-lead-card">
        <div className="about-lead-icon">
          <ShieldCheck size={28} />
        </div>
        <p className="about-lead-text">
          ReserveIQ is a hotel booking cancellation decision-support prototype developed to help hotel teams identify cancellation risk earlier.
        </p>
      </div>

      {/* Key Aspects Grid */}
      <div className="about-grid">
        <div className="about-card">
          <div className="about-card-icon">
            <Target size={20} />
          </div>
          <span className="about-card-tag">PURPOSE</span>
          <h3 className="about-card-title">Earlier Cancellation-Risk Awareness</h3>
          <p className="about-card-desc">
            Surfacing cancellation indicators in advance so hospitality teams have sufficient time to plan room allocations and communicate with guests.
          </p>
        </div>

        <div className="about-card">
          <div className="about-card-icon">
            <Users size={20} />
          </div>
          <span className="about-card-tag">DESIGNED FOR</span>
          <h3 className="about-card-title">Hospitality Professionals</h3>
          <p className="about-card-desc">
            Tailored specifically for reservation desks, revenue managers, and front-office hotel operations staff.
          </p>
        </div>

        <div className="about-card">
          <div className="about-card-icon">
            <Compass size={20} />
          </div>
          <span className="about-card-tag">ROLE</span>
          <h3 className="about-card-title">Decision Support Only</h3>
          <p className="about-card-desc">
            Acts as an advisory indicator to guide operational prioritization. Final discretion always rests with experienced hotel staff.
          </p>
        </div>

        <div className="about-card limitation-card">
          <div className="about-card-icon limitation-icon">
            <AlertTriangle size={20} />
          </div>
          <span className="about-card-tag tag-warning">LIMITATION</span>
          <h3 className="about-card-title">Historical Data Scope</h3>
          <p className="about-card-desc">
            The current model was developed using historical reservation data from two Portuguese hotels from 2015–2017 and should be validated using current hotel data before real-world deployment.
          </p>
        </div>
      </div>

      {/* Privacy & Ethics Note */}
      <div className="ethics-card">
        <div className="ethics-icon">
          <Lock size={18} />
        </div>
        <div>
          <h4 className="ethics-title">Privacy-Centric Architecture</h4>
          <p className="ethics-desc">
            ReserveIQ processes booking metadata anonymously. It requires no guest names, phone numbers, email addresses, or payment card details.
          </p>
        </div>
      </div>

      {/* Optional Collapsed Section: Technical Information */}
      <div className="technical-accordion">
        <button
          type="button"
          className="technical-accordion-toggle"
          onClick={() => setTechOpen(!techOpen)}
          aria-expanded={techOpen}
        >
          <div className="toggle-left">
            <Cpu size={18} />
            <span>Technical Information (System Architecture)</span>
          </div>
          {techOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>

        {techOpen && (
          <div className="technical-accordion-content">
            <div className="tech-spec-row">
              <span className="spec-label">Final Model Architecture</span>
              <span className="spec-value">Tuned Random Forest</span>
            </div>
            <div className="tech-spec-row">
              <span className="spec-label">Prediction Type</span>
              <span className="spec-value">Binary cancellation prediction</span>
            </div>
            <div className="tech-spec-row">
              <span className="spec-label">Operational Presentation</span>
              <span className="spec-value">Low (0–39%) / Medium (40–69%) / High (70–100%)</span>
            </div>
            <div className="tech-spec-row">
              <span className="spec-label">Feature Pipeline</span>
              <span className="spec-value">20 preprocessed booking attributes with standard scaling and encoding</span>
            </div>
            <div className="tech-spec-row">
              <span className="spec-label">Serving Engine</span>
              <span className="spec-value">FastAPI + Uvicorn with eager model pre-loading</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
