import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import { storage } from '../utils/storage';

// Mock storage
vi.mock('../utils/storage', () => ({
  storage: {
    getCategories: vi.fn(() => []),
    getTiers: vi.fn(() => []),
    getHouseholds: vi.fn(() => []),
    getEvents: vi.fn(() => []),
    setCategories: vi.fn(),
    setTiers: vi.fn(),
    setHouseholds: vi.fn(),
    setEvents: vi.fn(),
  }
}));

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all main sections', () => {
    render(<App />);
    
    expect(screen.getByText('Wedding Guest List')).toBeInTheDocument();
    expect(screen.getByText('Categories')).toBeInTheDocument();
    expect(screen.getByText('Tiers')).toBeInTheDocument();
    expect(screen.getByText('Households')).toBeInTheDocument();
    expect(screen.getByText('Events')).toBeInTheDocument();
  });

  it('updates household form when new category is added', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Add a new category
    const categoryInput = screen.getByPlaceholderText(/enter category name/i);
    await user.type(categoryInput, 'Colleagues');
    await user.click(screen.getByText('Add Category'));

    // Verify category was added in the categories list
    const categoriesList = screen.getByTestId('categories-list');
    expect(within(categoriesList).getByText('Colleagues')).toBeInTheDocument();

    // Show the household form
    await user.click(screen.getByRole('button', { name: /new household/i }));
    // Find the household form's category dropdown
    const householdSection = screen.getByText('Households').closest('div');
    expect(householdSection).not.toBeNull();
    const categorySelect = within(householdSection!).getByLabelText(/category/i);

    // Verify new category appears in household form
    const options = within(categorySelect).getAllByRole('option');
    expect(options).toHaveLength(1); // Just the new category since storage was empty
    expect(options[0]).toHaveTextContent('Colleagues');

    // Verify storage was updated
    expect(storage.setCategories).toHaveBeenCalledWith([
      expect.objectContaining({ name: 'Colleagues' })
    ]);
  });

  it('maintains categories in household form after editing', async () => {
    const user = userEvent.setup();
    
    // Mock initial category
    vi.mocked(storage.getCategories).mockReturnValue([
      { id: 'cat1', name: 'Friends' }
    ]);

    render(<App />);

    // Edit the category
    await user.click(screen.getByRole('button', { name: /edit category/i }));
    const editInput = screen.getByPlaceholderText(/enter category name/i);
    await user.clear(editInput);
    await user.type(editInput, 'Close Friends');
    await user.click(screen.getByText('Update Category'));

    // Verify category was updated in the categories list
    const categoriesList = screen.getByTestId('categories-list');
    expect(within(categoriesList).getByText('Close Friends')).toBeInTheDocument();

    // Show the household form
    await user.click(screen.getByRole('button', { name: /new household/i }));
    // Verify household form reflects the change
    const householdSection = screen.getByText('Households').closest('div');
    expect(householdSection).not.toBeNull();
    const categorySelect = within(householdSection!).getByLabelText(/category/i);
    const options = within(categorySelect).getAllByRole('option');
    expect(options).toHaveLength(1);
    expect(options[0]).toHaveTextContent('Close Friends');

    // Verify storage was updated
    expect(storage.setCategories).toHaveBeenCalledWith([
      expect.objectContaining({ id: 'cat1', name: 'Close Friends' })
    ]);
  });

  it('prevents category deletion when households are assigned', async () => {
    const user = userEvent.setup();
    
    // Mock initial data with a category and household
    const mockCategory = { id: 'cat1', name: 'Family' };
    const mockHousehold = { 
      id: 'h1', 
      name: 'Smith Family', 
      categoryId: 'cat1',
      tierId: 'tier1',
      guestCount: 2 
    };

    vi.mocked(storage.getCategories).mockReturnValue([mockCategory]);
    vi.mocked(storage.getHouseholds).mockReturnValue([mockHousehold]);
    vi.mocked(storage.getTiers).mockReturnValue([
      { id: 'tier1', name: 'Must Invite' }
    ]);

    // Mock window.confirm and window.alert
    const confirmMock = vi.spyOn(window, 'confirm').mockImplementation(() => true);
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});

    render(<App />);

    // Find and click the delete button in the categories section
    const categoriesSection = screen.getByText('Categories').closest('section');
    const deleteButton = within(categoriesSection!).getByRole('button', { name: /delete category/i });
    await user.click(deleteButton);

    // Verify confirm was called
    expect(confirmMock).toHaveBeenCalledWith('Are you sure you want to delete this category?');

    // Verify alert was shown
    expect(alertMock).toHaveBeenCalledWith(
      'Cannot delete category that has households assigned to it'
    );

    // Verify category still exists
    const categoriesList = screen.getByTestId('categories-list');
    expect(within(categoriesList).getByText('Family')).toBeInTheDocument();

    // Verify storage wasn't updated
    expect(storage.setCategories).not.toHaveBeenCalled();
  });

  it('maintains correct tier order when moving tiers', async () => {
    const user = userEvent.setup()
    
    // Mock initial tiers - order is determined by array position
    vi.mocked(storage.getTiers).mockReturnValue([
      { id: '1', name: 'Tier 1' },
      { id: '2', name: 'Tier 2' },
      { id: '3', name: 'Tier 3' }
    ])

    render(<App />)

    // Get the tiers section
    const tiersSection = screen.getByText('Tiers').closest('section')
    expect(tiersSection).not.toBeNull()

    // Verify initial order
    const initialTiers = within(tiersSection!).getAllByText(/Tier \d/)
    expect(initialTiers[0]).toHaveTextContent('Tier 1')
    expect(initialTiers[1]).toHaveTextContent('Tier 2')
    expect(initialTiers[2]).toHaveTextContent('Tier 3')

    // Move Tier 2 up
    const moveUpButtons = within(tiersSection!).getAllByTitle('Move Up')
    await user.click(moveUpButtons[1])

    // Wait for the UI to update and verify order
    const tiersAfterUp = await within(tiersSection!).findAllByText(/Tier \d/)
    expect(tiersAfterUp[0]).toHaveTextContent('Tier 2')
    expect(tiersAfterUp[1]).toHaveTextContent('Tier 1')
    expect(tiersAfterUp[2]).toHaveTextContent('Tier 3')

    // Verify storage was updated with correct order (array position determines order)
    expect(storage.setTiers).toHaveBeenCalledWith([
      { id: '2', name: 'Tier 2' },
      { id: '1', name: 'Tier 1' },
      { id: '3', name: 'Tier 3' }
    ])

    // Move Tier 2 back down
    const moveDownButtons = within(tiersSection!).getAllByTitle('Move Down')
    await user.click(moveDownButtons[0])

    // Wait for the UI to update and verify order
    const tiersAfterDown = await within(tiersSection!).findAllByText(/Tier \d/)
    expect(tiersAfterDown[0]).toHaveTextContent('Tier 1')
    expect(tiersAfterDown[1]).toHaveTextContent('Tier 2')
    expect(tiersAfterDown[2]).toHaveTextContent('Tier 3')

    // Verify storage was updated with correct order (array position determines order)
    expect(storage.setTiers).toHaveBeenCalledWith([
      { id: '1', name: 'Tier 1' },
      { id: '2', name: 'Tier 2' },
      { id: '3', name: 'Tier 3' }
    ])
  })
}); 