import React, { useCallback, useEffect, useState } from 'react';
import Joyride, { type CallBackProps, STATUS, type Step } from 'react-joyride';

export interface TourState {
  isActive: boolean;
  showWelcome: boolean;
}

interface DemoTourProps {
  tourState: TourState;
  onTourStateChange: (state: TourState) => void;
  onSummaryModeToggle: (enabled: boolean) => void;
  isSummaryMode: boolean;
  selectedEventId?: string | null;
}

const TOUR_COMPLETED_KEY = 'wedding-guest-list:tour-completed';

const DemoTour: React.FC<DemoTourProps> = ({
  tourState,
  onTourStateChange,
  onSummaryModeToggle,
  isSummaryMode,
  selectedEventId
}) => {
  const [stepIndex, setStepIndex] = useState(0);

  const steps: Step[] = [
    {
      target: 'body',
      content: (
        <div>
          <h2>Deciding on your guest list?</h2>
          <p>We help you visualize your options and make confident decisions. Take a quick tour to see how it works with sample data.</p>
        </div>
      ),
      placement: 'center',
      disableBeacon: true,
      hideCloseButton: true,
      locale: {
        next: 'Start Tour (Step 1 of 7)',
        skip: 'Skip Tour'
      }
    },
    {
      target: '[data-tour-target="organization-overview"]',
      content: 'Start by organizing guests by category and how close you are to them. This helps you decide who to invite to each event.',
      placement: 'top'
    },
    {
      target: '[data-event-id="demo-ceremony"]',
      content: 'Each event can have a different mix of guests. Click "Ceremony" to see which guests are invited.',
      placement: 'left',
      disableBeacon: false,
      hideFooter: true,
      spotlightClicks: true
    },
    {
      target: '[data-tour-target="organization-overview"]',
      content: 'You can see at a glance who\'s invited to each event.',
      placement: 'top'
    },
    {
      target: 'button[title="Switch to summary view"]',
      content: 'Want the big picture? Click "Summary View" to see bride vs groom balance and expected attendance.',
      placement: 'bottom',
      disableBeacon: false,
      hideFooter: true,
      spotlightClicks: true
    },
    {
      target: '[data-testid="breakdown-bar"]',
      content: 'Expected attendance is based on likelihood each guest will attend. This helps you plan for realistic headcount.',
      placement: 'bottom'
    },
    {
      target: 'body',
      content: (
        <div>
          <h2>🎉 Tour Complete!</h2>
          <p>You've seen how to organize guests, assign them to events, and visualize your guest list.</p>
          <p><strong>Ready to plan your wedding?</strong></p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '16px' }}>
            <button style={{ padding: '8px 16px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '6px', fontSize: '14px', cursor: 'pointer' }}>
              Sign Up
            </button>
            <button style={{ padding: '8px 16px', backgroundColor: 'white', color: '#4f46e5', border: '1px solid #4f46e5', borderRadius: '6px', fontSize: '14px', cursor: 'pointer' }}>
              Log In
            </button>
            <button style={{ padding: '8px 16px', backgroundColor: '#f3f4f6', color: '#374151', border: 'none', borderRadius: '6px', fontSize: '14px', cursor: 'pointer' }}>
              Keep Exploring Demo
            </button>
          </div>
        </div>
      ),
      placement: 'center',
      hideCloseButton: true,
      hideFooter: true
    }
  ];

  const completeTour = useCallback(() => {
    localStorage.setItem(TOUR_COMPLETED_KEY, 'true');
    onSummaryModeToggle(false);
    onTourStateChange({
      isActive: false,
      showWelcome: false
    });
  }, [onTourStateChange, onSummaryModeToggle]);

  const handleJoyrideCallback = useCallback((data: CallBackProps) => {
    const { status, index, action, type } = data;

    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      completeTour();
      return;
    }

    if (type === 'step:after' && action === 'next') {
      // Handle welcome modal -> tour start
      if (index === 0) {
        onTourStateChange({
          isActive: true,
          showWelcome: false
        });
        setStepIndex(1);
        return;
      }

      setStepIndex(index + 1);
    } else if (type === 'step:after' && action === 'prev') {
      setStepIndex(index - 1);
    }
  }, [completeTour, onSummaryModeToggle, onTourStateChange]);

  // Reset step index when tour becomes active
  useEffect(() => {
    if (tourState.isActive) {
      setStepIndex(0);
    }
  }, [tourState.isActive]);

  // Auto-advance from step 2 to step 3 when user selects an event
  useEffect(() => {
    if (stepIndex === 2 && selectedEventId === 'demo-ceremony' && tourState.isActive) {
      // Scroll to top to ensure targets are visible, then advance
      window.scrollTo({ top: 0, behavior: 'smooth' });
      const timer = setTimeout(() => setStepIndex(3), 800);
      return () => clearTimeout(timer);
    }
  }, [stepIndex, selectedEventId, tourState.isActive]);

  // Auto-advance to summary insights step when user enables summary mode  
  useEffect(() => {
    if (stepIndex === 4 && isSummaryMode && tourState.isActive) {
      // Small delay to let React finish rendering the summary view
      const timer = setTimeout(() => setStepIndex(5), 300);
      return () => clearTimeout(timer);
    }
  }, [stepIndex, isSummaryMode, tourState.isActive]);

  if (!tourState.showWelcome && !tourState.isActive) {
    return null;
  }

  return (
    <Joyride
      steps={steps}
      run={tourState.showWelcome || tourState.isActive}
      stepIndex={stepIndex}
      callback={handleJoyrideCallback}
      continuous
      showProgress
      showSkipButton
      scrollToFirstStep
      disableOverlayClose
      styles={{
        options: {
          primaryColor: '#4f46e5',
          textColor: '#374151',
          backgroundColor: '#ffffff',
          arrowColor: '#ffffff',
          overlayColor: 'rgba(0, 0, 0, 0.4)',
        },
        tooltip: {
          borderRadius: 8,
          fontSize: 14,
          padding: 20,
        },
        tooltipTitle: {
          fontSize: 18,
          fontWeight: 600,
          marginBottom: 10,
        },
        buttonNext: {
          backgroundColor: '#4f46e5',
          borderRadius: 6,
          fontSize: 14,
          fontWeight: 500,
          padding: '8px 16px',
        },
        buttonSkip: {
          color: '#6b7280',
          fontSize: 14,
          fontWeight: 500,
        }
      }}
    />
  );
};

export default DemoTour;