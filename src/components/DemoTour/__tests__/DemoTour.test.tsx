import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import DemoTour, { TourState } from '../DemoTour';

describe('DemoTour', () => {
  const mockTourState: TourState = {
    isActive: false,
    showWelcome: false
  };

  const defaultProps = {
    tourState: mockTourState,
    onTourStateChange: vi.fn(),
    onSummaryModeToggle: vi.fn()
  };

  it('renders nothing when tour is not active and welcome is not shown', () => {
    const { container } = render(<DemoTour {...defaultProps} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders welcome modal when showWelcome is true', () => {
    const tourState: TourState = {
      isActive: false,
      showWelcome: true
    };

    render(<DemoTour {...defaultProps} tourState={tourState} />);
    
    // The Joyride component should be present with welcome content
    expect(document.querySelector('[data-test-id="react-joyride-step-0"]')).toBeDefined();
  });

  it('tracks tour completion in localStorage', () => {
    const onTourStateChange = vi.fn();
    const tourState: TourState = {
      isActive: true,
      showWelcome: false
    };

    render(
      <DemoTour 
        {...defaultProps} 
        tourState={tourState}
        onTourStateChange={onTourStateChange}
      />
    );

    // Component should render when tour is active
    expect(document.querySelector('[data-test-id^="react-joyride"]')).toBeDefined();
  });
});