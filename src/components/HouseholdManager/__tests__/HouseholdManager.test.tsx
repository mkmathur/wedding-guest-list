import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HouseholdManager } from '../HouseholdManager';
import { storage } from '../../../utils/storage';
import type { Household, Category, Tier } from '../../../types';

// Mock storage
vi.mock('../../../utils/storage');

// Mock data
const mockCategories = [
  { id: 'cat1', name: 'Family' },
  { id: 'cat2', name: 'Friends' },
];

const mockTiers = [
  { id: 'tier1', name: 'Must Invite', order: 0 },
  { id: 'tier2', name: 'Want to Invite', order: 1 },
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

describe('HouseholdManager', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();
    
    // Setup default mock returns
    vi.mocked(storage.getHouseholds).mockReturnValue(mockHouseholds);
    vi.mocked(storage.getCategories).mockReturnValue(mockCategories);
    vi.mocked(storage.getTiers).mockReturnValue(mockTiers);
  });

  it('renders the component with initial data', () => {
    render(<HouseholdManager />);
    
    // Check if form elements are present
    expect(screen.getByLabelText(/household name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/number of guests/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/tier/i)).toBeInTheDocument();
    
    // Check if households are displayed
    expect(screen.getByText('Smith Family')).toBeInTheDocument();
    expect(screen.getByText('Johnson Family')).toBeInTheDocument();
    
    // Check if categories are grouped
    expect(screen.getByText('Family (7 guests)')).toBeInTheDocument();
  });

  it('adds a new household', async () => {
    const user = userEvent.setup();
    render(<HouseholdManager />);
    
    // Fill out the form
    await user.type(screen.getByLabelText(/household name/i), 'New Family');
    
    // Set guest count using fireEvent to directly set the value
    const guestCountInput = screen.getByLabelText(/number of guests/i);
    fireEvent.change(guestCountInput, { target: { value: '2' } });
    
    await user.selectOptions(screen.getByLabelText(/category/i), 'cat1');
    await user.selectOptions(screen.getByLabelText(/tier/i), 'tier1');
    
    // Submit the form
    await user.click(screen.getByText('Add Household'));
    
    // Verify storage was called with new household
    expect(storage.setHouseholds).toHaveBeenCalledWith([
      ...mockHouseholds,
      expect.objectContaining({
        name: 'New Family',
        guestCount: 2,
        categoryId: 'cat1',
        tierId: 'tier1',
      }),
    ]);
  });

  it('validates required fields', async () => {
    const user = userEvent.setup();
    render(<HouseholdManager />);
    
    // Try to submit empty form
    await user.click(screen.getByText('Add Household'));
    
    // Check for error message
    expect(screen.getByText('Household name is required')).toBeInTheDocument();
  });

  it('prevents duplicate household names', async () => {
    const user = userEvent.setup();
    render(<HouseholdManager />);
    
    // Try to add a household with existing name
    await user.type(screen.getByLabelText(/household name/i), 'Smith Family');
    await user.click(screen.getByText('Add Household'));
    
    // Check for error message
    expect(screen.getByText('A household with this name already exists')).toBeInTheDocument();
  });

  it('edits an existing household', async () => {
    const user = userEvent.setup();
    render(<HouseholdManager />);
    
    // Click edit button on first household
    await user.click(screen.getAllByText('Edit')[0]);
    
    // Modify the name
    const nameInput = screen.getByLabelText(/household name/i);
    await user.clear(nameInput);
    await user.type(nameInput, 'Updated Smith Family');
    
    // Submit changes
    await user.click(screen.getByText('Update Household'));
    
    // Verify storage was called with updated household
    expect(storage.setHouseholds).toHaveBeenCalledWith(
      mockHouseholds.map(h => 
        h.id === 'h1' 
          ? expect.objectContaining({
              id: 'h1',
              name: 'Updated Smith Family',
            })
          : h
      )
    );
  });

  it('deletes a household', async () => {
    const user = userEvent.setup();
    // Mock confirm dialog
    vi.spyOn(window, 'confirm').mockImplementation(() => true);
    
    render(<HouseholdManager />);
    
    // Click delete button on first household
    await user.click(screen.getAllByText('Delete')[0]);
    
    // Verify storage was called without the deleted household
    expect(storage.setHouseholds).toHaveBeenCalledWith(
      mockHouseholds.filter(h => h.id !== 'h1')
    );
  });

  it('calculates total guests correctly', () => {
    render(<HouseholdManager />);
    
    // Check total guests (4 + 3 = 7)
    expect(screen.getByText('Total Guests: 7')).toBeInTheDocument();
  });

  it('groups households by category with correct guest counts', () => {
    render(<HouseholdManager />);
    
    // Check category group header
    const categoryHeader = screen.getByText('Family (7 guests)');
    expect(categoryHeader).toBeInTheDocument();
    
    // Check individual household guest counts
    expect(screen.getByText('(4 guests)')).toBeInTheDocument();
    expect(screen.getByText('(3 guests)')).toBeInTheDocument();
  });

  it('displays tier information for each household', () => {
    render(<HouseholdManager />);
    
    // Check if tier labels are shown
    expect(screen.getByText('[Must Invite]')).toBeInTheDocument();
    expect(screen.getByText('[Want to Invite]')).toBeInTheDocument();
  });

  it('handles form cancellation during edit', async () => {
    const user = userEvent.setup();
    render(<HouseholdManager />);
    
    // Start editing
    await user.click(screen.getAllByText('Edit')[0]);
    
    // Click cancel
    await user.click(screen.getByText('Cancel'));
    
    // Verify form is reset
    expect(screen.getByLabelText(/household name/i)).toHaveValue('');
    expect(screen.getByText('Add Household')).toBeInTheDocument();
  });
}); 