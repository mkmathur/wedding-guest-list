import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
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
    const categories = [
      { id: '1', name: 'Family' },
      { id: '2', name: 'Friends' }
    ];
    const tiers = [
      { id: '1', name: 'Must Invite' },
      { id: '2', name: 'Want to Invite' }
    ];
    const households = [
      { id: '1', name: 'Smith Family', categoryId: '1', tierId: '1', guestCount: 2 },
      { id: '2', name: 'Jones Family', categoryId: '2', tierId: '2', guestCount: 3 }
    ];

    render(<EventForm categories={categories} tiers={tiers} households={households} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    expect(screen.getByLabelText(/event name/i)).toBeInTheDocument();
    expect(screen.getByText('Family')).toBeInTheDocument();
    expect(screen.getByText('Friends')).toBeInTheDocument();

    // Check for Must Invite checkbox within Family category
    const familyGroup = screen.getByText('Family').closest('div._categoryGroup_7b232b') as HTMLElement;
    expect(within(familyGroup).getByLabelText('Must Invite')).toBeInTheDocument();
    expect(within(familyGroup).getByLabelText('Want to Invite')).toBeInTheDocument();

    // Check for Must Invite checkbox within Friends category
    const friendsGroup = screen.getByText('Friends').closest('div._categoryGroup_7b232b') as HTMLElement;
    expect(within(friendsGroup).getByLabelText('Must Invite')).toBeInTheDocument();
    expect(within(friendsGroup).getByLabelText('Want to Invite')).toBeInTheDocument();
  });

  it('initializes form with event data when editing', () => {
    renderComponent(mockEvent);
    
    // Check if event name is pre-filled
    const nameInput = screen.getByLabelText(/event name/i) as HTMLInputElement;
    expect(nameInput.value).toBe('Intimate Wedding');
    
    // Check if tier selection is pre-filled for Family category (cat1)
    const familyGroup = screen.getByText('Family').closest('div._categoryGroup_7b232b') as HTMLElement;
    const mustInviteCheckbox = within(familyGroup).getByLabelText('Must Invite') as HTMLInputElement;
    const wantInviteCheckbox = within(familyGroup).getByLabelText('Want to Invite') as HTMLInputElement;
    expect(mustInviteCheckbox.checked).toBe(true);
    expect(wantInviteCheckbox.checked).toBe(false);
    
    // Check that Friends category has no tiers selected
    const friendsGroup = screen.getByText('Friends').closest('div._categoryGroup_7b232b') as HTMLElement;
    const friendsMustInvite = within(friendsGroup).getByLabelText('Must Invite') as HTMLInputElement;
    const friendsWantInvite = within(friendsGroup).getByLabelText('Want to Invite') as HTMLInputElement;
    expect(friendsMustInvite.checked).toBe(false);
    expect(friendsWantInvite.checked).toBe(false);
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
    const categories = [
      { id: '1', name: 'Family' },
      { id: '2', name: 'Friends' }
    ];
    const tiers = [
      { id: '1', name: 'Must Invite' },
      { id: '2', name: 'Want to Invite' }
    ];
    const households = [
      { id: '1', name: 'Smith Family', categoryId: '1', tierId: '1', guestCount: 2 },
      { id: '2', name: 'Jones Family', categoryId: '2', tierId: '2', guestCount: 3 }
    ];

    render(<EventForm categories={categories} tiers={tiers} households={households} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    // Fill in form
    await user.type(screen.getByLabelText(/event name/i), 'New Event');
    
    // Select tier1 for Family
    const familyGroup = screen.getByText('Family').closest('div._categoryGroup_7b232b') as HTMLElement;
    await user.click(within(familyGroup).getByLabelText('Must Invite'));
    
    // Check guest count
    expect(screen.getByText('Total Guests: 2')).toBeInTheDocument();
    expect(within(familyGroup).getByText('2 guests')).toBeInTheDocument();
    expect(within(screen.getByText('Friends').closest('div._categoryGroup_7b232b') as HTMLElement).getByText('0 guests')).toBeInTheDocument();
  });

  it('submits form with correct data', async () => {
    const user = userEvent.setup();
    const categories = [
      { id: '1', name: 'Family' },
      { id: '2', name: 'Friends' }
    ];
    const tiers = [
      { id: '1', name: 'Must Invite' },
      { id: '2', name: 'Want to Invite' }
    ];
    const households = [
      { id: '1', name: 'Smith Family', categoryId: '1', tierId: '1', guestCount: 2 },
      { id: '2', name: 'Jones Family', categoryId: '2', tierId: '2', guestCount: 3 }
    ];

    render(<EventForm categories={categories} tiers={tiers} households={households} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    // Fill in form
    await user.type(screen.getByLabelText(/event name/i), 'New Event');
    const familyGroup = screen.getByText('Family').closest('div._categoryGroup_7b232b') as HTMLElement;
    await user.click(within(familyGroup).getByLabelText('Must Invite'));
    
    // Submit form
    await user.click(screen.getByRole('button', { name: /create event/i }));

    expect(mockOnSubmit).toHaveBeenCalledWith({
      name: 'New Event',
      selections: [
        { categoryId: '1', selectedTierIds: ['1'] },
        { categoryId: '2', selectedTierIds: [] }
      ]
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