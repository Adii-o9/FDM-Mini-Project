import React from 'react';
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  ShieldAlert,
  ArrowRight,
  Info,
  HelpCircle
} from 'lucide-react';

export default function RiskGuidePage({ onNavigate }) {
  const riskTiers = [
    {
      level: 'LOW RISK',
      range: '0% – 39%',
      theme: 'tier-low',
      icon: CheckCircle,
      meaning: 'Fewer cancellation-risk signals are currently present.',
      response: 'Continue with the standard reservation process.',
      recommendations: [
        'Proceed with normal check-in and preparation protocols.',
        'Standard booking confirmation emails are sufficient.',
        'No emergency room reassignment needed.'
      ]
    },
    {
      level: 'MEDIUM RISK',
      range: '40% – 69%',
      theme: 'tier-medium',
      icon: AlertTriangle,
      meaning: 'Some cancellation-risk signals are present.',
      response: 'Consider confirming the booking or sending a reminder.',
      recommendations: [
        'Send a friendly pre-arrival welcome note or stay confirmation.',
        'Verify contact details or arrival time with the guest.',
        'Monitor lead-time changes as the scheduled check-in nears.'
      ]
    },
    {
      level: 'HIGH RISK',
      range: '70% – 100%',
      theme: 'tier-high',
      icon: XCircle,
      meaning: 'Stronger cancellation-risk signals are present.',
      response: 'Consider closer review during reservation and occupancy planning.',
      recommendations: [
        'Review deposit status, payment guarantee, and cancellation policies.',
        'Attempt courteous direct contact to verify arrival intention.',
        'Factor risk into front-desk room inventory and overbooking buffers.'
      ]
    }
  ];

  return (
    <div className="risk-guide-page">
      <div className="page-header">
        <span className="page-eyebrow">Operational Standards</span>
        <h1 className="page-title">Understanding Risk Levels</h1>
        <p className="page-subtitle">
          Operational guidelines for interpreting cancellation assessments and deciding staff responses.
        </p>
      </div>

      {/* Three Risk Cards */}
      <div className="risk-cards-grid">
        {riskTiers.map((tier) => {
          const Icon = tier.icon;
          return (
            <div key={tier.level} className={`risk-card ${tier.theme}`}>
              <div className="risk-card-header">
                <div className="risk-card-badge">
                  <Icon size={18} />
                  <span>{tier.level}</span>
                </div>
                <span className="risk-card-range">{tier.range}</span>
              </div>

              <div className="risk-card-section">
                <span className="risk-label-micro">MEANING</span>
                <p className="risk-meaning-text">{tier.meaning}</p>
              </div>

              <div className="risk-card-section highlighted-section">
                <span className="risk-label-micro">SUGGESTED RESPONSE</span>
                <p className="risk-response-text">{tier.response}</p>
              </div>

              <div className="risk-card-section">
                <span className="risk-label-micro">OPERATIONAL CHECKLIST</span>
                <ul className="risk-checklist">
                  {tier.recommendations.map((rec, i) => (
                    <li key={i} className="risk-checklist-item">
                      <span className="checklist-bullet"></span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>

      {/* Crucial Uncertainty Notice */}
      <div className="uncertainty-notice-card">
        <div className="uncertainty-header">
          <Info size={22} className="notice-icon" />
          <h3 className="notice-title">Risk does not mean certainty.</h3>
        </div>
        <p className="notice-text">
          Even a high-risk booking may continue to arrive without issues, and a low-risk booking may still cancel due to unforeseen guest circumstances.
        </p>
        <p className="notice-subtext">
          ReserveIQ provides probabilistic indicators to guide staff attention. It should never be used as sole justification to unilaterally cancel or penalize any reservation.
        </p>
      </div>

      {/* Action Footer */}
      <div className="page-action-footer">
        <button
          type="button"
          className="btn-primary"
          onClick={() => onNavigate('assessment')}
        >
          <span>Run a New Assessment</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
