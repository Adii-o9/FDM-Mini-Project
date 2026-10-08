import React from 'react';
import {
  FileEdit,
  Cpu,
  Layers,
  UserCheck,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function HowItWorksPage({ onNavigate }) {
  const steps = [
    {
      number: '01',
      title: 'Enter Reservation Details',
      desc: 'Use information already available when processing a booking.',
      details: [
        'Days before scheduled check-in',
        'Length of weekend and weekday stay',
        'Average room rate and deposit policy',
        'Distribution channel and booking origin'
      ],
      icon: FileEdit
    },
    {
      number: '02',
      title: 'ReserveIQ Reviews the Booking',
      desc: 'The system looks at booking patterns associated with cancellation behaviour.',
      details: [
        'Evaluates key historical risk indicators',
        'Checks correlation with lead times and deposit types',
        'Considers guest booking modification history',
        'Operates instantly without storing private guest data'
      ],
      icon: Cpu
    },
    {
      number: '03',
      title: 'Receive a Risk Assessment',
      desc: 'The reservation is presented as Low, Medium, or High risk.',
      details: [
        'Straightforward percentage probability',
        'Clear operational risk band indicator',
        'Summary of primary booking characteristics',
        'No confusing mathematical formulas or code'
      ],
      icon: Layers
    },
    {
      number: '04',
      title: 'Staff Choose the Response',
      desc: 'Hotel employees use the risk information alongside their own judgement.',
      details: [
        'Decide whether to send a polite confirmation note',
        'Verify prepayment or credit guarantee details',
        'Adjust room allocation and buffer planning',
        'Maintain personal hospitality standards'
      ],
      icon: UserCheck
    }
  ];

  return (
    <div className="how-it-works-page">
      <div className="page-header">
        <span className="page-eyebrow">Product Guide</span>
        <h1 className="page-title">How ReserveIQ Works</h1>
        <p className="page-subtitle">No machine-learning knowledge required.</p>
      </div>

      {/* 4 Steps Grid */}
      <div className="steps-container">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <div key={step.number} className="step-card">
              <div className="step-card-top">
                <span className="step-number-tag">STEP {step.number}</span>
                <div className="step-icon-bubble">
                  <Icon size={22} />
                </div>
              </div>
              <h3 className="step-card-title">{step.title}</h3>
              <p className="step-card-desc">{step.desc}</p>

              <div className="step-bullet-list">
                {step.details.map((detail, idx) => (
                  <div key={idx} className="step-bullet-item">
                    <CheckCircle2 size={14} className="bullet-check" />
                    <span>{detail}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Strong Callout */}
      <div className="strong-callout-card">
        <div className="callout-icon-col">
          <ShieldAlert size={26} className="callout-symbol" />
        </div>
        <div className="callout-body">
          <h3 className="callout-heading">ReserveIQ does not automatically cancel bookings.</h3>
          <p className="callout-detail">
            The system acts purely as an early radar for front office and reservation managers.
            It provides actionable risk signals to support human decision-making, keeping hotel staff in full control of every guest relationship.
          </p>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="page-action-footer">
        <button
          type="button"
          className="btn-primary"
          onClick={() => onNavigate('assessment')}
        >
          <span>Try a Booking Assessment</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
