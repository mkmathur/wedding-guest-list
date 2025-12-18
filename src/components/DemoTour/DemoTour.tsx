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
}

const TOUR_COMPLETED_KEY = 'wedding-guest-list:tour-completed';

const DemoTour: React.FC<DemoTourProps> = ({
  tourState,
  onTourStateChange,
  onSummaryModeToggle
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
      target: '.right-panel, [data-testid="right-panel"]',
      content: 'Plan multiple wedding events with different guest lists - perfect for multi-day Indian weddings',
      placement: 'left'
    },
    {
      target: '[data-testid="summary-mode-toggle"], .summary-toggle',
      content: 'Get real wedding planning insights - bride vs groom breakdown, expected attendance across multiple events',
      placement: 'bottom'
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

      // When moving to step 3 (Planning Insights), auto-enable summary mode
      if (index === 2) {
        onSummaryModeToggle(true);
      }
      setStepIndex(index + 1);
    } else if (type === 'step:after' && action === 'prev') {
      // When going back from step 3, disable summary mode  
      if (index === 3) {
        onSummaryModeToggle(false);
      }
      setStepIndex(index - 1);
    }
  }, [completeTour, onSummaryModeToggle, onTourStateChange]);

  // Reset step index when tour becomes active
  useEffect(() => {
    if (tourState.isActive) {
      setStepIndex(0);
    }
  }, [tourState.isActive]);

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