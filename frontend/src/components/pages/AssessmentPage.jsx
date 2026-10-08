import React from 'react';
import BookingForm from '../BookingForm';
import ResultCard from '../ResultCard';
import {
  Calendar,
  BedDouble,
  UserCheck2,
  FileClock,
  ClipboardList,
  RotateCcw
} from 'lucide-react';

export default function AssessmentPage({
  onSubmit,
  isLoading,
  generalError,
  predictionResult,
  submittedBooking,
  onReset,
  onNavigate
}) {
  const progressSteps = [
    { num: 1, label: 'Booking', icon: Calendar },
    { num: 2, label: 'Stay', icon: BedDouble },
    { num: 3, label: 'Guest & Channel', icon: UserCheck2 },
    { num: 4, label: 'Booking History', icon: FileClock },
    { num: 5, label: 'Review', icon: ClipboardList }
  ];

  return (
    <div className="assessment-page">
      {/* Assessment Page Header */}
      <div className="assessment-header">
        <span className="page-eyebrow">Operational Tool</span>
        <h1 className="assessment-title">New Risk Assessment</h1>
        <p className="assessment-subtitle">
          Enter the reservation information below to estimate cancellation risk.
        </p>

        {/* Visual Progress Steps Indicator */}
        {!predictionResult && (
          <div className="form-progress-indicator" aria-label="Assessment Form Sections">
            {progressSteps.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.num} className="progress-step-item">
                  <div className="step-circle">
                    <span className="step-num">{step.num}</span>
                  </div>
                  <span className="step-text">{step.label}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Main Assessment Body: Form or Result */}
      <div className="assessment-body">
        {predictionResult ? (
          <div className="results-wrapper">
            <ResultCard
              result={predictionResult}
              bookingSummary={submittedBooking}
              onReset={onReset}
              onBackToOverview={() => onNavigate('overview')}
            />
          </div>
        ) : (
          <div className="form-wrapper">
            <BookingForm
              onSubmit={onSubmit}
              isLoading={isLoading}
              generalError={generalError}
            />
          </div>
        )}
      </div>
    </div>
  );
}
