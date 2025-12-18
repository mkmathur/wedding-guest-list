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

// Mock localStorage for tour completion
const localStorageMock = {
  getItem: vi.fn((key: string) => {
    if (key === 'wedding-guest-list:tour-completed') {
      return 'true'; // Simulate tour has been completed
    }
    return null;
  }),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset localStorage mock for each test
    localStorageMock.getItem.mockImplementation((key: string) => {
      if (key === 'wedding-guest-list:tour-completed') {
        return 'true'; // Default: tour completed (normal app behavior)
      }
      return null;
    });
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

    // Click New Category button to show the form
    await user.click(screen.getByText('+ New Category'));
    
    // Add a new category
    const categoryInput = screen.getByLabelText('Category Name:');
    await user.type(categoryInput, 'Colleagues');
    await user.click(screen.getByText('Create Category'));

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
    const editInput = screen.getByLabelText('Category Name:');
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

  it('auto-numbers new tiers correctly', async () => {
    const user = userEvent.setup()
    
    // Mock initial tiers (T1, T2, T3)
    vi.mocked(storage.getTiers).mockReturnValue([
      { id: '1', name: 'T1' },
      { id: '2', name: 'T2' },
      { id: '3', name: 'T3' }
    ])

    render(<App />)

    // Get the tiers section
    const tiersSection = screen.getByText('Tiers').closest('section')
    expect(tiersSection).not.toBeNull()

    // Verify initial tiers are numbered correctly
    expect(within(tiersSection!).getByText('T1')).toBeInTheDocument()
    expect(within(tiersSection!).getByText('T2')).toBeInTheDocument()
    expect(within(tiersSection!).getByText('T3')).toBeInTheDocument()

    // Add a new tier
    const addTierButton = within(tiersSection!).getByText('Add tier')
    await user.click(addTierButton)

    // Verify that the new tier would be added as T4 (check the call to storage)
    // Since tiers.length is 3, new tier should be numbered as T4
    expect(storage.setTiers).toHaveBeenCalledWith([
      { id: '1', name: 'T1' },
      { id: '2', name: 'T2' },
      { id: '3', name: 'T3' },
      expect.objectContaining({ name: 'T4' })
    ])
  })

  // Demo Tour Integration Tests
  describe('Demo Tour Integration', () => {
    it('shows normal app for returning users (tour completed)', () => {
      // Default behavior: tour completed
      render(<App />);

      // Should show normal app elements
      expect(screen.getByText('Wedding Guest List')).toBeInTheDocument();
      expect(screen.getByText('📝 Demo App - Data stored locally in browser only')).toBeInTheDocument();
      
      // Should not show demo mode banner
      expect(screen.queryByText('📝 Demo Mode - Exploring with sample data')).not.toBeInTheDocument();
      
      // Storage should be called to load user data
      expect(storage.getCategories).toHaveBeenCalled();
      expect(storage.getTiers).toHaveBeenCalled();
      expect(storage.getHouseholds).toHaveBeenCalled();
      expect(storage.getEvents).toHaveBeenCalled();
    });

    it('handles new users appropriately (tour not completed)', () => {
      // Mock localStorage to return null for tour completion
      localStorageMock.getItem.mockImplementation((key: string) => {
        if (key === 'wedding-guest-list:tour-completed') {
          return null; // Tour not completed
        }
        return null;
      });

      render(<App />);

      // Should still show the main app structure
      expect(screen.getByText('Wedding Guest List')).toBeInTheDocument();
      
      // Storage methods should NOT be called initially for new users
      // (they'll be called after tour completion)
      expect(storage.getCategories).not.toHaveBeenCalled();
      expect(storage.getTiers).not.toHaveBeenCalled();
      expect(storage.getHouseholds).not.toHaveBeenCalled();
      expect(storage.getEvents).not.toHaveBeenCalled();
    });

    it('prevents user modifications during demo mode', async () => {
      const user = userEvent.setup();
      
      // Mock localStorage to simulate tour not completed
      localStorageMock.getItem.mockImplementation((key: string) => {
        if (key === 'wedding-guest-list:tour-completed') {
          return null;
        }
        return null;
      });

      render(<App />);

      // Try to add a category (should be blocked in demo mode)
      const newCategoryButton = screen.queryByText('+ New Category');
      if (newCategoryButton) {
        await user.click(newCategoryButton);
        // In demo mode, this action should be blocked
        // We can verify this by checking that storage.setCategories was not called
        expect(storage.setCategories).not.toHaveBeenCalled();
      }
    });
  });
}); 