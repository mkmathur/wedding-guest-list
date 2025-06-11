import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BulkImportModal } from '../BulkImportModal';
import type { Category, Tier } from '../../../types';

// Mock data
const mockCategories: Category[] = [
  { id: 'cat1', name: 'Family' },
  { id: 'cat2', name: 'Friends' },
];

const mockTiers: Tier[] = [
  { id: 'tier1', name: 'Must Invite' },
  { id: 'tier2', name: 'Want to Invite' },
];

describe('BulkImportModal', () => {
  const mockOnClose = vi.fn();
  const mockOnImport = vi.fn();
  const mockOnAddCategories = vi.fn().mockResolvedValue(undefined);

  const renderComponent = (isOpen = true) => {
    return render(
      <BulkImportModal
        isOpen={isOpen}
        onClose={mockOnClose}
        onImport={mockOnImport}
        existingCategories={mockCategories}
        existingTiers={mockTiers}
        onAddCategories={mockOnAddCategories}
      />
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders nothing when closed', () => {
    const { container } = renderComponent(false);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders the import form when open', () => {
    renderComponent();
    expect(screen.getByText('Bulk Import Households')).toBeInTheDocument();
    expect(screen.getByText('Paste your guest list below:')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Preview Import' })).toBeInTheDocument();
  });

  it('parses and shows categories for review', async () => {
    const user = userEvent.setup();
    renderComponent();

    // Enter some test data
    const textarea = screen.getByRole('textbox');
    await user.type(textarea, `FAMILY\n  John Smith + 1\n  Jane Doe, John Doe, 2 kids\n\nFRIENDS\n  Alice Brown\n  Bob Wilson +1`);

    // Submit the form
    await user.click(screen.getByRole('button', { name: /preview import/i }));

    // Should show category dialog
    expect(screen.getByText(/categories detected/i)).toBeInTheDocument();
    // Use regex to match category names regardless of case or splitting
    expect(screen.getByText((content, node) => /family/i.test(content))).toBeInTheDocument();
    expect(screen.getByText((content, node) => /friends/i.test(content))).toBeInTheDocument();
  });

  it('creates selected categories and moves to review step', async () => {
    const user = userEvent.setup();
    renderComponent();

    // Enter test data with only existing categories
    const textarea = screen.getByRole('textbox');
    await user.type(textarea, `FAMILY\n  John Smith + 1\n  Jane Doe, John Doe, 2 kids\n\nFRIENDS\n  Alice Brown\n  Bob Wilson +1`);

    // Submit the form
    await user.click(screen.getByRole('button', { name: /preview import/i }));

    // There should be no checkboxes for existing categories
    expect(screen.queryByLabelText(/family/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/friends/i)).not.toBeInTheDocument();
    // The dialog should show existing categories as already available
    expect(screen.getByText((content) => /family.*already exists/i.test(content))).toBeInTheDocument();
    expect(screen.getByText((content) => /friends.*already exists/i.test(content))).toBeInTheDocument();
    // The proceed button should be present, but clicking it should not call the spy
    await user.click(screen.getByRole('button', { name: /proceed without new categories/i }));
    expect(mockOnAddCategories).not.toHaveBeenCalled();
  });

  it('imports households after review', async () => {
    const user = userEvent.setup();
    renderComponent();

    // Enter test data with only existing categories
    const textarea = screen.getByRole('textbox');
    await user.type(textarea, `FAMILY\n  John Smith + 1\n  Jane Doe, John Doe, 2 kids\n\nFRIENDS\n  Alice Brown\n  Bob Wilson +1`);

    // Go through category creation
    await user.click(screen.getByRole('button', { name: /preview import/i }));
    await user.click(screen.getByRole('button', { name: /proceed without new categories/i }));

    // Wait for the review step to be ready
    await vi.waitFor(() => {
      expect(screen.getAllByRole('combobox', { name: /tier/i })).toHaveLength(4);
    });

    // Set tiers for households
    const tierSelects = screen.getAllByRole('combobox', { name: /tier/i });
    await user.selectOptions(tierSelects[0], 'tier1');
    await user.selectOptions(tierSelects[1], 'tier1');
    await user.selectOptions(tierSelects[2], 'tier2');
    await user.selectOptions(tierSelects[3], 'tier2');

    // Save all households
    await user.click(screen.getByRole('button', { name: /save all/i }));

    // Should call onImport with the households
    expect(mockOnImport).toHaveBeenCalledWith([
      {
        name: 'John Smith',
        guestCount: 2, // 1 base + 1 additional
        categoryId: 'cat1',
        tierId: 'tier1',
      },
      {
        name: 'Jane Doe, John Doe',
        guestCount: 4, // 2 names + 2 kids
        categoryId: 'cat1',
        tierId: 'tier1',
      },
      {
        name: 'Alice Brown',
        guestCount: 1,
        categoryId: 'cat2',
        tierId: 'tier2',
      },
      {
        name: 'Bob Wilson',
        guestCount: 2, // 1 base + 1 additional
        categoryId: 'cat2',
        tierId: 'tier2',
      },
    ]);
    // Should close the modal
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('handles back button in review step', async () => {
    const user = userEvent.setup();
    renderComponent();

    // Enter test data and go through category creation
    const textarea = screen.getByRole('textbox');
    await user.type(textarea, `FAMILY\n  John Smith + 1`);
    await user.click(screen.getByRole('button', { name: /preview import/i }));
    await user.click(screen.getByRole('button', { name: /proceed without new categories/i }));

    // Wait for the review step to be ready
    await vi.waitFor(() => {
      expect(screen.getByRole('combobox', { name: /tier/i })).toBeInTheDocument();
    });

    // Set tier for household
    const tierSelect = screen.getByRole('combobox', { name: /tier/i });
    await user.selectOptions(tierSelect, 'tier1');

    // Click back button (should be in ReviewForm)
    const backButton = screen.getByRole('button', { name: /back/i });
    await user.click(backButton);

    // Should go back to category step
    expect(screen.getByText(/categories detected/i)).toBeInTheDocument();
  });

  it('handles back button in category step', async () => {
    const user = userEvent.setup();
    renderComponent();

    // Enter test data
    const textarea = screen.getByRole('textbox');
    await user.type(textarea, `FAMILY\n  John Smith + 1`);
    await user.click(screen.getByRole('button', { name: 'Preview Import' }));

    // Click back
    await user.click(screen.getByRole('button', { name: 'Back' }));

    // Should go back to import step
    expect(screen.getByText('Paste your guest list below:')).toBeInTheDocument();
  });

  it('handles case-insensitive category matching with existing categories', async () => {
    const user = userEvent.setup();
    
    // Mock existing categories with mixed case
    const mockExistingCategories = [
      { id: 'cat1', name: 'Family' },
      { id: 'cat2', name: 'FRIENDS' },
    ];

    // Mock the onAddCategories function to return new categories
    const mockOnAddCategories = vi.fn().mockResolvedValue([
      { id: 'cat3', name: 'COLLEAGUES' }
    ]);

    render(
      <BulkImportModal
        isOpen={true}
        onClose={mockOnClose}
        onImport={mockOnImport}
        existingCategories={mockExistingCategories}
        existingTiers={mockTiers}
        onAddCategories={mockOnAddCategories}
      />
    );

    // Enter text with mixed case categories
    const textarea = screen.getByRole('textbox');
    await user.type(textarea, `family\n  John Smith + 1\n  Jane Doe, John Doe, 2 kids\n\nfriends\n  Alice Brown\n  Bob Wilson +1\n\nCOLLEAGUES\n  Carol Davis\n  Dave Evans`);

    // Submit the form
    await user.click(screen.getByRole('button', { name: 'Preview Import' }));

    // Should only show COLLEAGUES as a new category
    expect(screen.getByText(/COLLEAGUES/)).toBeInTheDocument();
    expect(screen.queryByText(/family \(new\)/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/friends \(new\)/i)).not.toBeInTheDocument();

    // Create the new category
    await user.click(screen.getByRole('button', { name: 'Create Selected Categories' }));

    // Wait for categories to be created
    await vi.waitFor(() => {
      expect(mockOnAddCategories).toHaveBeenCalledWith(['COLLEAGUES']);
    });

    // Set tiers for households
    const tierSelects = screen.getAllByRole('combobox', { name: 'Tier' });
    await user.selectOptions(tierSelects[0], 'tier1'); // John Smith
    await user.selectOptions(tierSelects[1], 'tier1'); // Jane Doe
    await user.selectOptions(tierSelects[2], 'tier2'); // Alice Brown
    await user.selectOptions(tierSelects[3], 'tier2'); // Bob Wilson
    await user.selectOptions(tierSelects[4], 'tier1'); // Carol Davis
    await user.selectOptions(tierSelects[5], 'tier1'); // Dave Evans

    // Save all households
    await user.click(screen.getByRole('button', { name: 'Save All' }));

    // Verify that households were imported with correct category IDs
    expect(mockOnImport).toHaveBeenCalledWith([
      {
        name: 'John Smith',
        guestCount: 2, // 1 base + 1 additional
        categoryId: 'cat1', // Family
        tierId: 'tier1',
      },
      {
        name: 'Jane Doe, John Doe',
        guestCount: 4, // 2 names + 2 kids
        categoryId: 'cat1', // Family
        tierId: 'tier1',
      },
      {
        name: 'Alice Brown',
        guestCount: 1,
        categoryId: 'cat2', // FRIENDS
        tierId: 'tier2',
      },
      {
        name: 'Bob Wilson',
        guestCount: 2, // 1 base + 1 additional
        categoryId: 'cat2', // FRIENDS
        tierId: 'tier2',
      },
      {
        name: 'Carol Davis',
        guestCount: 1,
        categoryId: 'cat3', // COLLEAGUES
        tierId: 'tier1',
      },
      {
        name: 'Dave Evans',
        guestCount: 1,
        categoryId: 'cat3', // COLLEAGUES
        tierId: 'tier1',
      },
    ]);
  });

  it('handles case-insensitive category matching in review step', async () => {
    const user = userEvent.setup();
    
    // Mock existing categories
    const mockExistingCategories = [
      { id: 'cat1', name: 'Family' },
      { id: 'cat2', name: 'Friends' },
    ];

    // Mock the onAddCategories function to return new categories
    const mockOnAddCategories = vi.fn().mockResolvedValue([
      { id: 'cat3', name: 'Colleagues' }
    ]);

    render(
      <BulkImportModal
        isOpen={true}
        onClose={mockOnClose}
        onImport={mockOnImport}
        existingCategories={mockExistingCategories}
        existingTiers={mockTiers}
        onAddCategories={mockOnAddCategories}
      />
    );

    // Enter text with mixed case categories
    const textarea = screen.getByRole('textbox');
    await user.type(textarea, `FAMILY\n  John Smith + 1\n\nfriends\n  Alice Brown\n\nCOLLEAGUES\n  Carol Davis`);

    // Go through category creation
    await user.click(screen.getByRole('button', { name: 'Preview Import' }));
    await user.click(screen.getByRole('button', { name: 'Create Selected Categories' }));

    // Wait for categories to be created
    await vi.waitFor(() => {
      expect(mockOnAddCategories).toHaveBeenCalledWith(['COLLEAGUES']);
    });

    // Change some category assignments in review step
    const categorySelects = screen.getAllByRole('combobox', { name: 'Category' });
    
    // Change FAMILY household to friends category
    await user.selectOptions(categorySelects[0], 'Friends');
    
    // Change friends household to FAMILY category
    await user.selectOptions(categorySelects[1], 'Family');

    // Set tiers
    const tierSelects = screen.getAllByRole('combobox', { name: 'Tier' });
    await user.selectOptions(tierSelects[0], 'tier1');
    await user.selectOptions(tierSelects[1], 'tier2');
    await user.selectOptions(tierSelects[2], 'tier1');

    // Save all households
    await user.click(screen.getByRole('button', { name: 'Save All' }));

    // Verify that households were imported with correct category IDs after review changes
    expect(mockOnImport).toHaveBeenCalledWith([
      {
        name: 'John Smith',
        guestCount: 2,
        categoryId: 'cat2', // Friends (changed from FAMILY)
        tierId: 'tier1',
      },
      {
        name: 'Alice Brown',
        guestCount: 1,
        categoryId: 'cat1', // Family (changed from friends)
        tierId: 'tier2',
      },
      {
        name: 'Carol Davis',
        guestCount: 1,
        categoryId: 'cat3', // COLLEAGUES
        tierId: 'tier1',
      },
    ]);
  });

  it('normalizes category names and maintains consistent category assignment', async () => {
    const user = userEvent.setup();
    
    // Mock existing categories
    const mockExistingCategories = [
      { id: 'cat1', name: 'Family' },
      { id: 'cat2', name: 'Close Friends' },
    ];

    // Mock the onAddCategories function to return new categories
    const mockOnAddCategories = vi.fn().mockResolvedValue([
      { id: 'cat3', name: 'Work Colleagues' }
    ]);

    render(
      <BulkImportModal
        isOpen={true}
        onClose={mockOnClose}
        onImport={mockOnImport}
        existingCategories={mockExistingCategories}
        existingTiers={mockTiers}
        onAddCategories={mockOnAddCategories}
      />
    );

    // Enter text with various case formats for the same categories
    const textarea = screen.getByRole('textbox');
    await user.type(textarea, `family\n  John Smith + 1\n\nFAMILY\n  Jane Doe, John Doe, 2 kids\n\nclose friends\n  Alice Brown\n\nCLOSE FRIENDS\n  Bob Wilson +1\n\nwork colleagues\n  Carol Davis\n\nWORK COLLEAGUES\n  Dave Evans`);

    // Submit the form
    await user.click(screen.getByRole('button', { name: /preview import/i }));

    // Should only show work colleagues as a new category (case-insensitive)
    expect(screen.getByText((content) => /work colleagues.*new/i.test(content))).toBeInTheDocument();
    expect(screen.queryByText((content) => /family.*new/i.test(content))).not.toBeInTheDocument();
    expect(screen.queryByText((content) => /close friends.*new/i.test(content))).not.toBeInTheDocument();

    // Create the new category
    await user.click(screen.getByRole('button', { name: /create selected categories/i }));

    // Wait for categories to be created
    await vi.waitFor(() => {
      expect(mockOnAddCategories).toHaveBeenCalledWith(['work colleagues']);
    });

    // Set tiers for households
    const tierSelects = screen.getAllByRole('combobox', { name: /tier/i });
    await user.selectOptions(tierSelects[0], 'tier1'); // John Smith
    await user.selectOptions(tierSelects[1], 'tier1'); // Jane Doe
    await user.selectOptions(tierSelects[2], 'tier2'); // Alice Brown
    await user.selectOptions(tierSelects[3], 'tier2'); // Bob Wilson
    await user.selectOptions(tierSelects[4], 'tier1'); // Carol Davis
    await user.selectOptions(tierSelects[5], 'tier1'); // Dave Evans

    // Save all households
    await user.click(screen.getByRole('button', { name: /save all/i }));

    // Verify that households were imported with correct category IDs
    expect(mockOnImport).toHaveBeenCalledWith([
      {
        name: 'John Smith',
        guestCount: 2,
        categoryId: 'cat1', // Family
        tierId: 'tier1',
      },
      {
        name: 'Jane Doe, John Doe',
        guestCount: 4,
        categoryId: 'cat1', // Family
        tierId: 'tier1',
      },
      {
        name: 'Alice Brown',
        guestCount: 1,
        categoryId: 'cat2', // Close Friends
        tierId: 'tier2',
      },
      {
        name: 'Bob Wilson',
        guestCount: 2,
        categoryId: 'cat2', // Close Friends
        tierId: 'tier2',
      },
      {
        name: 'Carol Davis',
        guestCount: 1,
        categoryId: 'cat3', // Work Colleagues
        tierId: 'tier1',
      },
      {
        name: 'Dave Evans',
        guestCount: 1,
        categoryId: 'cat3', // Work Colleagues
        tierId: 'tier1',
      },
    ]);
  });

  it('handles category name normalization with special characters', async () => {
    const user = userEvent.setup();
    
    // Mock existing categories
    const mockExistingCategories = [
      { id: 'cat1', name: 'Family & Friends' },
    ];

    // Mock the onAddCategories function to return new categories
    const mockOnAddCategories = vi.fn().mockResolvedValue([
      { id: 'cat2', name: 'Work & Colleagues' }
    ]);

    render(
      <BulkImportModal
        isOpen={true}
        onClose={mockOnClose}
        onImport={mockOnImport}
        existingCategories={mockExistingCategories}
        existingTiers={mockTiers}
        onAddCategories={mockOnAddCategories}
      />
    );

    // Enter text with various case formats and special characters
    const textarea = screen.getByRole('textbox');
    await user.type(textarea, `family & friends\n  John Smith + 1\n\nFAMILY & FRIENDS\n  Jane Doe\n\nwork & colleagues\n  Alice Brown\n\nWORK & COLLEAGUES\n  Bob Wilson`);

    // Submit the form
    await user.click(screen.getByRole('button', { name: /preview import/i }));

    // Should only show work & colleagues as a new category (case-insensitive)
    expect(screen.getByText((content) => /work & colleagues.*new/i.test(content))).toBeInTheDocument();
    expect(screen.queryByText((content) => /family & friends.*new/i.test(content))).not.toBeInTheDocument();

    // Create the new category
    await user.click(screen.getByRole('button', { name: /create selected categories/i }));

    // Wait for categories to be created
    await vi.waitFor(() => {
      expect(mockOnAddCategories).toHaveBeenCalledWith(['work & colleagues']);
    });

    // Set tiers for households
    const tierSelects = await screen.getAllByRole('combobox', { name: /tier/i });
    await user.selectOptions(tierSelects[0], 'tier1'); // John Smith
    await user.selectOptions(tierSelects[1], 'tier1'); // Jane Doe
    await user.selectOptions(tierSelects[2], 'tier2'); // Alice Brown
    await user.selectOptions(tierSelects[3], 'tier2'); // Bob Wilson

    // Save all households
    await user.click(screen.getByRole('button', { name: /save all/i }));

    // Verify that households were imported with correct category IDs
    expect(mockOnImport).toHaveBeenCalledWith([
      {
        name: 'John Smith',
        guestCount: 2,
        categoryId: 'cat1', // Family & Friends
        tierId: 'tier1',
      },
      {
        name: 'Jane Doe',
        guestCount: 1,
        categoryId: 'cat1', // Family & Friends
        tierId: 'tier1',
      },
      {
        name: 'Alice Brown',
        guestCount: 1,
        categoryId: 'cat2', // Work & Colleagues
        tierId: 'tier2',
      },
      {
        name: 'Bob Wilson',
        guestCount: 1,
        categoryId: 'cat2', // Work & Colleagues
        tierId: 'tier2',
      },
    ]);
  });
}); 