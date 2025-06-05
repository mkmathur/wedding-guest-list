import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HouseholdManager } from '../HouseholdManager';
import type { Household, Category, Tier } from '../../../types';

// Mock data
const mockCategories: Category[] = [
  { id: 'cat1', name: 'Family' },
  { id: 'cat2', name: 'Friends' },
];

const mockTiers: Tier[] = [
  { id: 'tier1', name: 'Must Invite', order: 0 },
  { id: 'tier2', name: 'Want to Invite', order: 1 },
];

const mockHouseholds: Household[] = [
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

describe('HouseholdManager', () => {
  const mockOnAdd = vi.fn();
  const mockOnEdit = vi.fn();
  const mockOnDelete = vi.fn();

  const renderComponent = (
    households = mockHouseholds,
    categories = mockCategories,
    tiers = mockTiers
  ) => {
    return render(
      <HouseholdManager
        households={households}
        categories={categories}
        tiers={tiers}
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
    
    // Check if form elements are present
    expect(screen.getByLabelText(/household name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/number of guests/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/tier/i)).toBeInTheDocument();
    
    // Check if households are displayed
    expect(screen.getByText('Smith Family')).toBeInTheDocument();
    expect(screen.getByText('Johnson Family')).toBeInTheDocument();
  });

  it('adds a new household', async () => {
    const user = userEvent.setup();
    renderComponent();
    
    // Fill out the form
    await user.type(screen.getByLabelText(/household name/i), 'New Family');
    
    // Set guest count using fireEvent to directly set the value
    const guestCountInput = screen.getByLabelText(/number of guests/i);
    fireEvent.change(guestCountInput, { target: { value: '2' } });
    
    await user.selectOptions(screen.getByLabelText(/category/i), 'cat1');
    await user.selectOptions(screen.getByLabelText(/tier/i), 'tier1');
    
    // Submit the form
    await user.click(screen.getByText('Add Household'));
    
    // Verify onAdd was called with correct data
    expect(mockOnAdd).toHaveBeenCalledWith({
      name: 'New Family',
      guestCount: 2,
      categoryId: 'cat1',
      tierId: 'tier1',
    });
  });

  it('validates required fields', async () => {
    const user = userEvent.setup();
    renderComponent();
    
    // Try to submit empty form
    await user.click(screen.getByText('Add Household'));
    
    // Check for error message
    expect(screen.getByText('Household name is required')).toBeInTheDocument();
    expect(mockOnAdd).not.toHaveBeenCalled();
  });

  it('prevents duplicate household names', async () => {
    const user = userEvent.setup();
    renderComponent();
    
    // Try to add a household with existing name
    await user.type(screen.getByLabelText(/household name/i), 'Smith Family');
    await user.click(screen.getByText('Add Household'));
    
    // Check for error message
    expect(screen.getByText('A household with this name already exists')).toBeInTheDocument();
    expect(mockOnAdd).not.toHaveBeenCalled();
  });

  it('edits an existing household', async () => {
    const user = userEvent.setup();
    renderComponent();
    
    // Click edit button on first household
    await user.click(screen.getAllByText('Edit')[0]);
    
    // Modify the name
    const nameInput = screen.getByLabelText(/household name/i);
    await user.clear(nameInput);
    await user.type(nameInput, 'Updated Smith Family');
    
    // Submit changes
    await user.click(screen.getByText('Update Household'));
    
    // Verify onEdit was called with correct data
    expect(mockOnEdit).toHaveBeenCalledWith('h1', {
      name: 'Updated Smith Family',
      guestCount: 4,
      categoryId: 'cat1',
      tierId: 'tier1',
    });
  });

  it('deletes a household', async () => {
    const user = userEvent.setup();
    // Mock confirm dialog
    vi.spyOn(window, 'confirm').mockImplementation(() => true);
    
    renderComponent();
    
    // Click delete button on first household
    await user.click(screen.getAllByText('Delete')[0]);
    
    // Verify onDelete was called with correct id
    expect(mockOnDelete).toHaveBeenCalledWith('h1');
  });

  it('displays tier information for each household', () => {
    renderComponent();
    
    // Check if tier labels are shown
    expect(screen.getByText('Must Invite')).toBeInTheDocument();
    expect(screen.getByText('Want to Invite')).toBeInTheDocument();
  });

  it('handles form cancellation during edit', async () => {
    const user = userEvent.setup();
    renderComponent();
    
    // Start editing
    await user.click(screen.getAllByText('Edit')[0]);
    
    // Click cancel
    await user.click(screen.getByText('Cancel'));
    
    // Verify form is reset and no edit was made
    expect(screen.getByText('Add Household')).toBeInTheDocument();
    expect(mockOnEdit).not.toHaveBeenCalled();
  });

  it('sets initial category and tier values when available', () => {
    renderComponent();
    
    const categorySelect = screen.getByLabelText(/category/i) as HTMLSelectElement;
    const tierSelect = screen.getByLabelText(/tier/i) as HTMLSelectElement;
    
    expect(categorySelect.value).toBe('cat1');
    expect(tierSelect.value).toBe('tier1');
  });
}); 