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
          <h2>Welcome to Wedding Guest List Manager!</h2>
          <p>See how smart wedding planning works with our quick tour.</p>
        </div>
      ),
      placement: 'center',
      disableBeacon: true,
      hideCloseButton: true,
      locale: {
        next: 'Take a Tour',
        skip: 'Skip Tour'
      }
    },
    {
      target: '[data-tour-target="organization-overview"]',
      content: 'Organize guests by category AND priority - see how the visual layout beats spreadsheet rows',
      placement: 'top'
    },
    {
      target: '[data-event-id="demo-ceremony"]',
      content: 'Click "Ceremony" to see event-specific guest filtering - different events, different guest lists!',
      placement: 'left',
      disableBeacon: false,
      hideFooter: true,
      spotlightClicks: true
    },
    {
      target: 'button[title="Switch to summary view"]',
      content: 'Click "Summary View" to unlock planning insights!',
      placement: 'bottom',
      disableBeacon: false,
      hideFooter: true,
      spotlightClicks: true
    },
    {
      target: '[data-testid="breakdown-bar"]',
      content: 'Perfect! Now you can see bride vs groom breakdown and expected attendance across all events - real insights that help with planning!',
      placement: 'bottom'
    },
    {
      target: 'body',
      content: (
        <div>
          <h2>🎉 Tour Complete!</h2>
          <p>You're ready to plan like a pro!</p>
          <h3>Next steps:</h3>
          <ul>
            <li>Add your own guest households</li>
            <li>Create your first wedding event</li>
            <li>Explore the summary insights</li>
          </ul>
        </div>
      ),
      placement: 'center',
      hideCloseButton: true,
      locale: {
        last: 'Start Planning'
      }
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

  // Auto-advance from step 3 to step 4 when user selects an event
  useEffect(() => {
    if (stepIndex === 2 && selectedEventId === 'demo-ceremony' && tourState.isActive) {
      // Small delay to let the filtering take effect
      const timer = setTimeout(() => setStepIndex(3), 500);
      return () => clearTimeout(timer);
    }
  }, [stepIndex, selectedEventId, tourState.isActive]);

  // Auto-advance to final step when user enables summary mode  
  useEffect(() => {
    if (stepIndex === 3 && isSummaryMode && tourState.isActive) {
      // Small delay to let React finish rendering the summary view
      const timer = setTimeout(() => setStepIndex(4), 300);
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