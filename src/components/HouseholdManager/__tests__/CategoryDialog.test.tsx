import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CategoryDialog } from '../CategoryDialog';

describe('CategoryDialog', () => {
  const mockOnProceed = vi.fn();
  const mockOnBack = vi.fn();
  const mockExistingCategories = [
    { id: 'cat1', name: 'Family' },
    { id: 'cat2', name: 'Friends' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = (newCategories: string[]) => {
    return render(
      <CategoryDialog
        newCategories={newCategories}
        existingCategories={mockExistingCategories}
        onProceed={mockOnProceed}
        onBack={mockOnBack}
      />
    );
  };

  it('renders with new categories', () => {
    renderComponent(['Work', 'Neighbors']);

    expect(screen.getByText('Categories Detected')).toBeInTheDocument();
    expect(screen.getByText(/select any new categories you want to create/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/work.*new/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/neighbors.*new/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create selected categories/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument();
  });

  it('renders with no new categories', () => {
    renderComponent([]);

    expect(screen.getByText('Categories Detected')).toBeInTheDocument();
    expect(screen.getByText(/all categories already exist/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /proceed without new categories/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument();
  });

  it('allows proceeding without selecting any categories', async () => {
    const user = userEvent.setup();
    renderComponent(['Work', 'Neighbors']);

    // Uncheck all categories
    await user.click(screen.getByLabelText(/work.*new/i));
    await user.click(screen.getByLabelText(/neighbors.*new/i));

    // Button text should update
    expect(screen.getByRole('button', { name: /proceed without new categories/i })).toBeInTheDocument();

    // Click proceed
    await user.click(screen.getByRole('button', { name: /proceed without new categories/i }));

    // Should call onProceed with empty array
    expect(mockOnProceed).toHaveBeenCalledWith([]);
  });

  it('allows proceeding with selected categories', async () => {
    const user = userEvent.setup();
    renderComponent(['Work', 'Neighbors']);

    // Uncheck one category
    await user.click(screen.getByLabelText(/neighbors.*new/i));

    // Button text should update
    expect(screen.getByRole('button', { name: /create selected categories/i })).toBeInTheDocument();

    // Click proceed
    await user.click(screen.getByRole('button', { name: /create selected categories/i }));

    // Should call onProceed with selected category
    expect(mockOnProceed).toHaveBeenCalledWith(['Work']);
  });

  it('handles back button click', async () => {
    const user = userEvent.setup();
    renderComponent(['Work', 'Neighbors']);

    await user.click(screen.getByRole('button', { name: /back/i }));
    expect(mockOnBack).toHaveBeenCalled();
  });

  it('shows existing categories as non-interactive', () => {
    renderComponent(['Work']);

    // Existing categories should be shown but not as checkboxes
    expect(screen.getByText(/family.*already exists/i)).toBeInTheDocument();
    expect(screen.getByText(/friends.*already exists/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/family/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/friends/i)).not.toBeInTheDocument();
  });

  it('shows appropriate subtitle when there are no new categories', () => {
    renderComponent([]);

    expect(screen.getByText(/all categories already exist/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /proceed without new categories/i })).toBeInTheDocument();
  });

  it('shows appropriate subtitle when there are new categories', () => {
    renderComponent(['Work', 'Neighbors']);

    expect(screen.getByText(/select any new categories you want to create/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create selected categories/i })).toBeInTheDocument();
  });

  it('updates button text based on selection state', async () => {
    const user = userEvent.setup();
    renderComponent(['Work', 'Neighbors']);

    // Initially all categories are selected
    expect(screen.getByRole('button', { name: /create selected categories/i })).toBeInTheDocument();

    // Uncheck one category
    await user.click(screen.getByLabelText(/work.*new/i));
    expect(screen.getByRole('button', { name: /create selected categories/i })).toBeInTheDocument();

    // Uncheck all categories
    await user.click(screen.getByLabelText(/neighbors.*new/i));
    expect(screen.getByRole('button', { name: /proceed without new categories/i })).toBeInTheDocument();

    // Check one category again
    await user.click(screen.getByLabelText(/work.*new/i));
    expect(screen.getByRole('button', { name: /create selected categories/i })).toBeInTheDocument();
  });
}); 