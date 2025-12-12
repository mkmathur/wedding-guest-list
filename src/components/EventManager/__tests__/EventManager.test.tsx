import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EventManager } from '../EventManager';
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

const mockEvents: Event[] = [
  {
    id: 'e1',
    name: 'Intimate Wedding',
    selections: [
      {
        categoryId: 'cat1',
        selectedTierIds: ['tier1'],
      },
    ],
  },
  {
    id: 'e2',
    name: 'Full Reception',
    selections: [
      {
        categoryId: 'cat1',
        selectedTierIds: ['tier1', 'tier2'],
      },
    ],
  },
];

describe('EventManager', () => {
  const mockOnAdd = vi.fn();
  const mockOnEdit = vi.fn();
  const mockOnDelete = vi.fn();
  const mockOnSelect = vi.fn();
  const mockOnReorder = vi.fn();

  const renderComponent = (
    events = mockEvents,
    categories = mockCategories,
    tiers = mockTiers,
    households = mockHouseholds,
    selectedEventId = null
  ) => {
    return render(
      <EventManager
        events={events}
        categories={categories}
        tiers={tiers}
        households={households}
        selectedEventId={selectedEventId}
        onAdd={mockOnAdd}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onSelect={mockOnSelect}
        onReorder={mockOnReorder}
      />
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the component with initial data', () => {
    renderComponent();
    
    // Check if events are displayed
    expect(screen.getByText('Intimate Wedding')).toBeInTheDocument();
    expect(screen.getByText('Full Reception')).toBeInTheDocument();
    
    // Check if guest counts are displayed (invited → expected format)
    // Intimate Wedding: tier1 only = Smith Family (4 guests, 75% = 3 expected)
    expect(screen.getByText('4 invited → 3 expected')).toBeInTheDocument();
    // Full Reception: tier1 + tier2 = Smith + Johnson (7 guests, 75% each = 5.25 → 5 expected)
    expect(screen.getByText('7 invited → 5 expected')).toBeInTheDocument();
  });

  it('shows new event button when not creating', () => {
    renderComponent();
    expect(screen.getByText('+ New Event')).toBeInTheDocument();
  });

  it('handles event deletion', async () => {
    const user = userEvent.setup();
    const mockConfirm = vi.spyOn(window, 'confirm').mockReturnValue(true);
    const events = [
      { 
        id: '1', 
        name: 'Intimate Wedding', 
        guestCount: 4,
        selections: [
          { categoryId: '1', selectedTierIds: ['1'] },
          { categoryId: '2', selectedTierIds: [] }
        ]
      },
      { 
        id: '2', 
        name: 'Full Reception', 
        guestCount: 7,
        selections: [
          { categoryId: '1', selectedTierIds: ['1', '2'] },
          { categoryId: '2', selectedTierIds: ['1'] }
        ]
      }
    ];
    renderComponent(events);
    
    // Click delete on first event
    await user.click(screen.getAllByRole('button', { name: /delete event/i })[0]);
    
    // Confirm deletion
    expect(mockConfirm).toHaveBeenCalledWith('Are you sure you want to delete this event?');
    expect(mockOnDelete).toHaveBeenCalledWith('1');
    mockConfirm.mockRestore();
  });

  it('calculates guest counts correctly', () => {
    renderComponent();
    
    // Intimate Wedding (tier1 only) = 4 invited → 3 expected (4 * 75%)
    expect(screen.getByText('4 invited → 3 expected')).toBeInTheDocument();
    
    // Full Reception (tier1 + tier2) = 7 invited → 5 expected (7 * 75% = 5.25 → 5)
    expect(screen.getByText('7 invited → 5 expected')).toBeInTheDocument();
  });

  it('handles empty events list', () => {
    renderComponent([]);
    expect(screen.getByText('+ New Event')).toBeInTheDocument();
  });
}); 