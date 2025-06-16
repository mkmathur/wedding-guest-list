import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HouseholdManager } from '../HouseholdManager';
import type { Household, Category, Tier } from '../../../types';

// Mock data
const mockCategories: Category[] = [
  { id: 'cat1', name: 'Family' },
  { id: 'cat2', name: 'Friends' },
];

const mockTiers: Tier[] = [
  { id: 'tier1', name: 'Must Invite' },
  { id: 'tier2', name: 'Want to Invite' },
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
  const mockOnAddMultiple = vi.fn();
  const mockOnEdit = vi.fn();
  const mockOnDelete = vi.fn();
  const mockOnAddCategory = vi.fn();
  const mockOnAddCategories = vi.fn().mockResolvedValue(undefined);

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
        onAddMultiple={mockOnAddMultiple}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onAddCategory={mockOnAddCategory}
        onAddCategories={mockOnAddCategories}
      />
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the component with initial data', async () => {
    const user = userEvent.setup();
    renderComponent();
    
    // Click new household button to show the form
    await user.click(screen.getByText('+ New Household'));
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
    
    // Click new household button to show the form
    await user.click(screen.getByText('+ New Household'));
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
    
    // Click new household button to show the form
    await user.click(screen.getByText('+ New Household'));
    // Try to submit empty form
    await user.click(screen.getByText('Add Household'));
    
    // Check for error message
    expect(screen.getByText('Household name is required')).toBeInTheDocument();
    expect(mockOnAdd).not.toHaveBeenCalled();
  });

  it('prevents duplicate household names', async () => {
    const user = userEvent.setup();
    renderComponent();
    
    // Click new household button to show the form
    await user.click(screen.getByText('+ New Household'));
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
    
    // Click on first household card to open modal
    await user.click(screen.getByRole('button', { name: 'Edit Smith Family household' }));
    
    // Modify the name in the modal
    const nameInput = screen.getByLabelText(/household name/i);
    await user.clear(nameInput);
    await user.type(nameInput, 'Updated Smith Family');
    
    // Submit changes using the new button text
    await user.click(screen.getByText('Save Changes'));
    
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
    
    // Click on first household card to open modal
    await user.click(screen.getByRole('button', { name: 'Edit Smith Family household' }));
    
    // Click delete button in the modal
    await user.click(screen.getByRole('button', { name: /delete household/i }));
    
    // Verify onDelete was called with correct id
    expect(mockOnDelete).toHaveBeenCalledWith('h1');
  });

  it('handles form cancellation during edit', async () => {
    const user = userEvent.setup();
    renderComponent();
    
    // Click on household card to open modal
    await user.click(screen.getByRole('button', { name: 'Edit Smith Family household' }));
    
    // Click cancel in the modal
    await user.click(screen.getByText('Cancel'));
    
    // Verify modal is closed and no edit was made
    expect(screen.queryByText('Edit Household')).not.toBeInTheDocument();
    expect(mockOnEdit).not.toHaveBeenCalled();
  });

  it('sets initial category and tier values when available', async () => {
    const user = userEvent.setup();
    renderComponent();
    
    // Click new household button to show the form
    await user.click(screen.getByText('+ New Household'));
    
    // Now we can find the form elements
    const categorySelect = screen.getByRole('combobox', { name: /category/i }) as HTMLSelectElement;
    const tierSelect = screen.getByRole('combobox', { name: /tier/i }) as HTMLSelectElement;
    
    expect(categorySelect.value).toBe('cat1');
    expect(tierSelect.value).toBe('tier1');
  });

  it('updates category dropdown when categories prop changes', async () => {
    const user = userEvent.setup();
    // Initial render with original categories
    const { rerender } = renderComponent();
    
    // Click new household button to show the form
    await user.click(screen.getByText('+ New Household'));
    
    // Verify initial categories are present
    const categorySelect = screen.getByRole('combobox', { name: /category/i }) as HTMLSelectElement;
    expect(categorySelect).toHaveLength(2);
    expect(screen.getByRole('option', { name: 'Family' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Friends' })).toBeInTheDocument();

    // Add a new category
    const updatedCategories = [
      ...mockCategories,
      { id: 'cat3', name: 'Colleagues' }
    ];

    // Re-render with updated categories
    rerender(
      <HouseholdManager
        households={mockHouseholds}
        categories={updatedCategories}
        tiers={mockTiers}
        onAdd={mockOnAdd}
        onAddMultiple={mockOnAddMultiple}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onAddCategory={mockOnAddCategory}
        onAddCategories={mockOnAddCategories}
      />
    );

    // Verify new category appears in dropdown
    expect(categorySelect).toHaveLength(3);
    expect(screen.getByRole('option', { name: 'Colleagues' })).toBeInTheDocument();

    // Verify we can select the new category
    await user.selectOptions(categorySelect, 'cat3');
    expect(categorySelect.value).toBe('cat3');
  });

  it('uses first category and tier when adding a new household', async () => {
    const user = userEvent.setup();
    renderComponent();
    
    // Click new household button to show the form
    await user.click(screen.getByText('+ New Household'));
    
    // Fill out just the name (category and tier should be pre-selected)
    await user.type(screen.getByRole('textbox', { name: /household name/i }), 'New Family');
    
    // Submit the form
    await user.click(screen.getByRole('button', { name: 'Add Household' }));
    
    // Verify onAdd was called with first category and tier
    expect(mockOnAdd).toHaveBeenCalledWith({
      name: 'New Family',
      guestCount: 1,
      categoryId: 'cat1',  // First category from mockCategories
      tierId: 'tier1',     // First tier from mockTiers
    });
  });
}); 