import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EventManager } from '../EventManager';
import type { Event, CategoryTierSelection } from '../../../types/event';

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

  const renderComponent = (
    events = mockEvents,
    categories = mockCategories,
    tiers = mockTiers,
    households = mockHouseholds
  ) => {
    return render(
      <EventManager
        events={events}
        categories={categories}
        tiers={tiers}
        households={households}
        onAdd={mockOnAdd}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
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
    
    // Check if guest counts are displayed
    expect(screen.getByText('4 guests')).toBeInTheDocument();
    expect(screen.getByText('7 guests')).toBeInTheDocument();
  });

  it('shows new event button when not creating', () => {
    renderComponent();
    expect(screen.getByText('+ New Event')).toBeInTheDocument();
  });

  it('handles event deletion', async () => {
    const user = userEvent.setup();
    renderComponent();
    
    // Click delete on first event
    await user.click(screen.getAllByText('Delete')[0]);
    
    // Confirm deletion
    await user.click(screen.getByText('OK'));
    
    expect(mockOnDelete).toHaveBeenCalledWith('e1');
  });

  it('calculates guest counts correctly', () => {
    renderComponent();
    
    // Intimate Wedding (tier1 only) = 4 guests
    expect(screen.getByText('4 guests')).toBeInTheDocument();
    
    // Full Reception (tier1 + tier2) = 7 guests
    expect(screen.getByText('7 guests')).toBeInTheDocument();
  });

  it('handles empty events list', () => {
    renderComponent([]);
    expect(screen.getByText('+ New Event')).toBeInTheDocument();
  });
}); 