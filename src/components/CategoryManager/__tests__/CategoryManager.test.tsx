import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '../../../test/utils'
import { CategoryManager } from '../CategoryManager'
import type { Category, CategorySide } from '../../../types'

describe('CategoryManager', () => {
  const mockCategories: Category[] = []
  const mockOnAdd = vi.fn()
  const mockOnEdit = vi.fn()
  const mockOnDelete = vi.fn()

  const renderComponent = (categories = mockCategories) => {
    return render(
      <CategoryManager
        categories={categories}
        onAdd={mockOnAdd}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    )
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the new category button initially', () => {
    renderComponent()
    
    expect(screen.getByText('+ New Category')).toBeInTheDocument()
  })

  it('shows category form when new category button is clicked', () => {
    renderComponent()
    
    fireEvent.click(screen.getByText('+ New Category'))
    
    expect(screen.getByText('Category Name:')).toBeInTheDocument()
    expect(screen.getByText('Which side is this guest group from?')).toBeInTheDocument()
    expect(screen.getByText('Create Category')).toBeInTheDocument()
    expect(screen.getByText('Cancel')).toBeInTheDocument()
  })

  it('adds a new category with default side', () => {
    renderComponent()
    
    fireEvent.click(screen.getByText('+ New Category'))
    
    const input = screen.getByLabelText('Category Name:')
    fireEvent.change(input, { target: { value: 'Family' } })
    fireEvent.click(screen.getByText('Create Category'))

    expect(mockOnAdd).toHaveBeenCalledWith('Family', 'bride')
  })

  it('adds a new category with selected side', () => {
    renderComponent()
    
    fireEvent.click(screen.getByText('+ New Category'))
    
    const input = screen.getByLabelText('Category Name:')
    const select = screen.getByLabelText('Which side is this guest group from?')
    
    fireEvent.change(input, { target: { value: 'Family' } })
    fireEvent.change(select, { target: { value: 'groom' } })
    fireEvent.click(screen.getByText('Create Category'))

    expect(mockOnAdd).toHaveBeenCalledWith('Family', 'groom')
  })

  it('validates empty category name', () => {
    renderComponent()
    
    fireEvent.click(screen.getByText('+ New Category'))
    
    const input = screen.getByLabelText('Category Name:')
    fireEvent.change(input, { target: { value: '   ' } })
    fireEvent.click(screen.getByText('Create Category'))

    expect(screen.getByText('Category name cannot be empty')).toBeInTheDocument()
    expect(mockOnAdd).not.toHaveBeenCalled()
  })

  it('validates duplicate category name', () => {
    const existingCategories = [
      { id: '1', name: 'Family', side: 'bride' as CategorySide }
    ]

    renderComponent(existingCategories)
    
    fireEvent.click(screen.getByText('+ New Category'))
    
    const input = screen.getByLabelText('Category Name:')
    fireEvent.change(input, { target: { value: 'Family' } })
    fireEvent.click(screen.getByText('Create Category'))

    expect(screen.getByText('Category name must be unique')).toBeInTheDocument()
    expect(mockOnAdd).not.toHaveBeenCalled()
  })

  it('validates duplicate category name with whitespace', () => {
    const existingCategories = [
      { id: '1', name: 'Family', side: 'bride' as CategorySide }
    ]

    renderComponent(existingCategories)
    
    fireEvent.click(screen.getByText('+ New Category'))
    
    // Try to add a category with leading/trailing whitespace
    const input = screen.getByLabelText('Category Name:')
    fireEvent.change(input, { target: { value: '  Family  ' } })
    fireEvent.click(screen.getByText('Create Category'))

    // Should detect as duplicate and prevent adding
    expect(screen.getByText('Category name must be unique')).toBeInTheDocument()
    expect(mockOnAdd).not.toHaveBeenCalled()

    // Try with different whitespace patterns
    fireEvent.change(input, { target: { value: 'Family ' } })
    expect(screen.getByText('Category name must be unique')).toBeInTheDocument()
    expect(mockOnAdd).not.toHaveBeenCalled()

    // Should allow different name with whitespace
    fireEvent.change(input, { target: { value: '  New Family  ' } })
    fireEvent.click(screen.getByText('Create Category'))
    expect(mockOnAdd).toHaveBeenCalledWith('New Family', 'bride')
  })

  it('properly handles error message visibility', () => {
    const existingCategories = [
      { id: '1', name: 'Family', side: 'bride' as CategorySide }
    ]

    renderComponent(existingCategories)
    
    fireEvent.click(screen.getByText('+ New Category'))
    
    const input = screen.getByLabelText('Category Name:')
    
    // First trigger a duplicate name error
    fireEvent.change(input, { target: { value: 'Family' } })
    fireEvent.click(screen.getByText('Create Category'))
    expect(screen.getByText('Category name must be unique')).toBeInTheDocument()

    // Error should clear immediately when typing a non-duplicate name
    fireEvent.change(input, { target: { value: 'Friends' } })
    expect(screen.queryByText('Category name must be unique')).not.toBeInTheDocument()

    // Test empty name error
    fireEvent.change(input, { target: { value: '' } })
    fireEvent.click(screen.getByText('Create Category'))
    expect(screen.getByText('Category name cannot be empty')).toBeInTheDocument()

    // Error should clear immediately when typing any non-empty value
    fireEvent.change(input, { target: { value: 'a' } })
    expect(screen.queryByText('Category name cannot be empty')).not.toBeInTheDocument()
  })

  it('displays category with icon based on side', () => {
    const existingCategories = [
      { id: '1', name: 'Bride Family', side: 'bride' as CategorySide },
      { id: '2', name: 'Groom Family', side: 'groom' as CategorySide },
      { id: '3', name: 'Both Families', side: 'both' as CategorySide },
      { id: '4', name: 'Old Category' }, // No side property (backward compatibility)
    ]

    renderComponent(existingCategories)
    
    // Check that icons are rendered with proper aria-labels
    expect(screen.getByLabelText('Bride side')).toBeInTheDocument()
    expect(screen.getByLabelText('Groom side')).toBeInTheDocument()
    expect(screen.getByLabelText('Both sides')).toBeInTheDocument()
    expect(screen.getByLabelText('Unspecified side')).toBeInTheDocument()
  })

  it('edits an existing category', () => {
    const existingCategories = [
      { id: '1', name: 'Family', side: 'bride' as CategorySide }
    ]

    renderComponent(existingCategories)
    
    // Start editing
    fireEvent.click(screen.getByRole('button', { name: /edit category/i }))
    
    const input = screen.getByLabelText('Category Name:')
    const select = screen.getByLabelText('Which side is this guest group from?')
    
    fireEvent.change(input, { target: { value: 'Close Family' } })
    fireEvent.change(select, { target: { value: 'both' } })
    fireEvent.click(screen.getByText('Update Category'))

    expect(mockOnEdit).toHaveBeenCalledWith('1', 'Close Family', 'both')
  })

  it('deletes a category after confirmation', () => {
    const mockConfirm = vi.fn(() => true)
    vi.stubGlobal('confirm', mockConfirm)

    const existingCategories = [
      { id: '1', name: 'Family', side: 'bride' as CategorySide }
    ]

    renderComponent(existingCategories)
    
    fireEvent.click(screen.getByRole('button', { name: /delete category/i }))

    expect(mockConfirm).toHaveBeenCalledWith('Are you sure you want to delete this category?')
    expect(mockOnDelete).toHaveBeenCalledWith('1')
  })

  it('cancels category deletion when not confirmed', async () => {
    const mockConfirm = vi.spyOn(window, 'confirm').mockReturnValue(false);
    const existingCategories = [{ id: '1', name: 'Family', side: 'bride' as CategorySide }];
    renderComponent(existingCategories)
    
    fireEvent.click(screen.getByRole('button', { name: /delete category/i }))

    expect(mockConfirm).toHaveBeenCalledWith('Are you sure you want to delete this category?')
    expect(mockOnDelete).not.toHaveBeenCalled();
    mockConfirm.mockRestore();
  })

  it('cancels editing when cancel button is clicked', async () => {
    const existingCategories = [{ id: '1', name: 'Family', side: 'bride' as CategorySide }];
    renderComponent(existingCategories)
    
    // Start editing
    fireEvent.click(screen.getByRole('button', { name: /edit category/i }))
    expect(screen.getByText('Update Category')).toBeInTheDocument()
    
    // Click cancel
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }))
    expect(screen.queryByText('Update Category')).not.toBeInTheDocument()
    expect(screen.getByText('+ New Category')).toBeInTheDocument()
  })

  it('updates category when form is submitted', async () => {
    const existingCategories = [{ id: '1', name: 'Family', side: 'bride' as CategorySide }];
    renderComponent(existingCategories)
    
    // Start editing
    fireEvent.click(screen.getByRole('button', { name: /edit category/i }))
    expect(screen.getByText('Update Category')).toBeInTheDocument()
    
    // Update category name and side
    fireEvent.change(screen.getByLabelText('Category Name:'), { target: { value: 'Updated Family' } })
    fireEvent.change(screen.getByLabelText('Which side is this guest group from?'), { target: { value: 'groom' } })
    fireEvent.click(screen.getByRole('button', { name: /update category/i }))
    
    expect(mockOnEdit).toHaveBeenCalledWith('1', 'Updated Family', 'groom')
  })

  it('deletes category when confirmed', async () => {
    const mockConfirm = vi.spyOn(window, 'confirm').mockReturnValue(true);
    const existingCategories = [{ id: '1', name: 'Family', side: 'bride' as CategorySide }];
    renderComponent(existingCategories)
    
    fireEvent.click(screen.getByRole('button', { name: /delete category/i }))

    expect(mockConfirm).toHaveBeenCalledWith('Are you sure you want to delete this category?')
    expect(mockOnDelete).toHaveBeenCalledWith('1')
    mockConfirm.mockRestore();
  })

  it('cancels form creation when cancel button is clicked', () => {
    renderComponent()
    
    fireEvent.click(screen.getByText('+ New Category'))
    expect(screen.getByText('Create Category')).toBeInTheDocument()
    
    fireEvent.click(screen.getByText('Cancel'))
    expect(screen.queryByText('Create Category')).not.toBeInTheDocument()
    expect(screen.getByText('+ New Category')).toBeInTheDocument()
  })
})