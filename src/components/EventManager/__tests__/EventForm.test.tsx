import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EventForm } from '../EventForm';
import type { Event } from '../../../types/event';

// Mock data
const mockCategories = [
  { id: 'cat1', name: 'Family' },
  { id: 'cat2', name: 'Friends' },
];

const mockTiers = [
  { id: 'tier1', name: 'Must Invite' },
  { id: 'tier2', name: 'Want to Invite' },
];

const mockHouseholds = [
  {
    id: 'h1',
    name: 'Smith Family',
    guestCount: 4,
    categoryId: 'cat1',
    tierId: 'tier1',
  },
  {
    id: 'h2',
    name: 'Johnson Family',
    guestCount: 3,
    categoryId: 'cat1',
    tierId: 'tier2',
  },
];

const mockEvent: Event = {
  id: 'e1',
  name: 'Intimate Wedding',
  selections: [
    {
      categoryId: 'cat1',
      selectedTierIds: ['tier1'],
    },
  ],
};

describe('EventForm', () => {
  const mockOnSubmit = vi.fn();
  const mockOnCancel = vi.fn();

  const renderComponent = (
    event?: Event,
    categories = mockCategories,
    tiers = mockTiers,
    households = mockHouseholds
  ) => {
    return render(
      <EventForm
        categories={categories}
        tiers={tiers}
        households={households}
        event={event}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the form with initial data', () => {
    renderComponent();
    
    // Check if form elements are present
    expect(screen.getByLabelText(/event name/i)).toBeInTheDocument();
    expect(screen.getByText('Family')).toBeInTheDocument();
    expect(screen.getByText('Friends')).toBeInTheDocument();
    expect(screen.getByText('Must Invite')).toBeInTheDocument();
    expect(screen.getByText('Want to Invite')).toBeInTheDocument();
  });

  it('initializes form with event data when editing', () => {
    renderComponent(mockEvent);
    
    // Check if event name is pre-filled
    const nameInput = screen.getByLabelText(/event name/i) as HTMLInputElement;
    expect(nameInput.value).toBe('Intimate Wedding');
    
    // Check if tier selection is pre-filled
    const mustInviteCheckbox = screen.getByLabelText('Must Invite') as HTMLInputElement;
    const wantInviteCheckbox = screen.getByLabelText('Want to Invite') as HTMLInputElement;
    expect(mustInviteCheckbox.checked).toBe(true);
    expect(wantInviteCheckbox.checked).toBe(false);
  });

  it('validates required fields', async () => {
    const user = userEvent.setup();
    renderComponent();
    
    // Try to submit without filling required fields
    await user.click(screen.getByText('Create Event'));
    
    // Check for error message
    expect(screen.getByText('Event name is required')).toBeInTheDocument();
    
    // Fill in name but no tiers
    await user.type(screen.getByLabelText(/event name/i), 'New Event');
    await user.click(screen.getByText('Create Event'));
    
    // Check for error message
    expect(screen.getByText('Please select at least one tier')).toBeInTheDocument();
  });

  it('calculates guest counts correctly', async () => {
    const user = userEvent.setup();
    renderComponent();
    
    // Fill in name
    await user.type(screen.getByLabelText(/event name/i), 'New Event');
    
    // Select tier1 for Family
    await user.click(screen.getByLabelText('Must Invite'));
    
    // Check guest count
    expect(screen.getByText('4 guests')).toBeInTheDocument();
    
    // Select tier2 for Family
    await user.click(screen.getByLabelText('Want to Invite'));
    
    // Check updated guest count
    expect(screen.getByText('7 guests')).toBeInTheDocument();
  });

  it('submits form with correct data', async () => {
    const user = userEvent.setup();
    renderComponent();
    
    // Fill in form
    await user.type(screen.getByLabelText(/event name/i), 'New Event');
    await user.click(screen.getByLabelText('Must Invite'));
    
    // Submit form
    await user.click(screen.getByText('Create Event'));
    
    // Check if onSubmit was called with correct data
    expect(mockOnSubmit).toHaveBeenCalledWith({
      name: 'New Event',
      selections: [
        {
          categoryId: 'cat1',
          selectedTierIds: ['tier1'],
        },
        {
          categoryId: 'cat2',
          selectedTierIds: [],
        },
      ],
    });
  });

  it('handles cancel action', async () => {
    const user = userEvent.setup();
    renderComponent();
    
    // Click cancel
    await user.click(screen.getByText('Cancel'));
    
    // Check if onCancel was called
    expect(mockOnCancel).toHaveBeenCalled();
  });
}); 