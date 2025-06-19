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

  it('renders the add category form', () => {
    renderComponent()
    
    expect(screen.getByPlaceholderText('Enter category name')).toBeInTheDocument()
    expect(screen.getByText('Add Category')).toBeInTheDocument()
    expect(screen.getByText('Which side is this guest group from?')).toBeInTheDocument()
    expect(screen.getByDisplayValue('💗 Bride')).toBeInTheDocument() // Default selection
  })

  it('adds a new category with default side', () => {
    renderComponent()
    
    const input = screen.getByPlaceholderText('Enter category name')
    fireEvent.change(input, { target: { value: 'Family' } })
    fireEvent.click(screen.getByText('Add Category'))

    expect(mockOnAdd).toHaveBeenCalledWith('Family', 'bride')
  })

  it('adds a new category with selected side', () => {
    renderComponent()
    
    const input = screen.getByPlaceholderText('Enter category name')
    const select = screen.getByDisplayValue('💗 Bride')
    
    fireEvent.change(input, { target: { value: 'Family' } })
    fireEvent.change(select, { target: { value: 'groom' } })
    fireEvent.click(screen.getByText('Add Category'))

    expect(mockOnAdd).toHaveBeenCalledWith('Family', 'groom')
  })

  it('validates empty category name', () => {
    renderComponent()
    
    const input = screen.getByPlaceholderText('Enter category name')
    fireEvent.change(input, { target: { value: '   ' } })
    fireEvent.click(screen.getByText('Add Category'))

    expect(screen.getByText('Category name cannot be empty')).toBeInTheDocument()
    expect(mockOnAdd).not.toHaveBeenCalled()
  })

  it('validates duplicate category name', () => {
    const existingCategories = [
      { id: '1', name: 'Family', side: 'bride' as CategorySide }
    ]

    renderComponent(existingCategories)
    
    const input = screen.getByPlaceholderText('Enter category name')
    fireEvent.change(input, { target: { value: 'Family' } })
    fireEvent.click(screen.getByText('Add Category'))

    expect(screen.getByText('Category name must be unique')).toBeInTheDocument()
    expect(mockOnAdd).not.toHaveBeenCalled()
  })

  it('validates duplicate category name with whitespace', () => {
    const existingCategories = [
      { id: '1', name: 'Family', side: 'bride' as CategorySide }
    ]

    renderComponent(existingCategories)
    
    // Try to add a category with leading/trailing whitespace
    const input = screen.getByPlaceholderText('Enter category name')
    fireEvent.change(input, { target: { value: '  Family  ' } })
    fireEvent.click(screen.getByText('Add Category'))

    // Should detect as duplicate and prevent adding
    expect(screen.getByText('Category name must be unique')).toBeInTheDocument()
    expect(mockOnAdd).not.toHaveBeenCalled()

    // Try with different whitespace patterns
    fireEvent.change(input, { target: { value: 'Family ' } })
    expect(screen.getByText('Category name must be unique')).toBeInTheDocument()
    expect(mockOnAdd).not.toHaveBeenCalled()

    // Should allow different name with whitespace
    fireEvent.change(input, { target: { value: '  New Family  ' } })
    fireEvent.click(screen.getByText('Add Category'))
    expect(mockOnAdd).toHaveBeenCalledWith('New Family', 'bride')
  })

  it('properly handles error message visibility', () => {
    const existingCategories = [
      { id: '1', name: 'Family', side: 'bride' as CategorySide }
    ]

    renderComponent(existingCategories)
    
    const input = screen.getByPlaceholderText('Enter category name')
    
    // First trigger a duplicate name error
    fireEvent.change(input, { target: { value: 'Family' } })
    fireEvent.click(screen.getByText('Add Category'))
    expect(screen.getByText('Category name must be unique')).toBeInTheDocument()

    // Error should clear immediately when typing a non-duplicate name
    fireEvent.change(input, { target: { value: 'Friends' } })
    expect(screen.queryByText('Category name must be unique')).not.toBeInTheDocument()

    // Test empty name error
    fireEvent.change(input, { target: { value: '' } })
    fireEvent.click(screen.getByText('Add Category'))
    expect(screen.getByText('Category name cannot be empty')).toBeInTheDocument()

    // Error should clear immediately when typing any non-empty value
    fireEvent.change(input, { target: { value: 'a' } })
    expect(screen.queryByText('Category name cannot be empty')).not.toBeInTheDocument()
  })

  it('displays category with emoji based on side', () => {
    const existingCategories = [
      { id: '1', name: 'Bride Family', side: 'bride' as CategorySide },
      { id: '2', name: 'Groom Family', side: 'groom' as CategorySide },
      { id: '3', name: 'Both Families', side: 'both' as CategorySide },
      { id: '4', name: 'Old Category' }, // No side property (backward compatibility)
    ]

    renderComponent(existingCategories)
    
    expect(screen.getByText('💗')).toBeInTheDocument() // Bride emoji
    expect(screen.getByText('💙')).toBeInTheDocument() // Groom emoji
    expect(screen.getByText('🤝')).toBeInTheDocument() // Both emoji
    expect(screen.getByText('❓')).toBeInTheDocument() // Unspecified emoji for old category
  })

  it('edits an existing category', () => {
    const existingCategories = [
      { id: '1', name: 'Family', side: 'bride' as CategorySide }
    ]

    renderComponent(existingCategories)
    
    // Start editing
    fireEvent.click(screen.getByRole('button', { name: /edit category/i }))
    
    const input = screen.getByPlaceholderText('Enter category name')
    const select = screen.getByDisplayValue('💗 Bride')
    
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
    expect(screen.getByText('Add Category')).toBeInTheDocument()
  })

  it('updates category when form is submitted', async () => {
    const existingCategories = [{ id: '1', name: 'Family', side: 'bride' as CategorySide }];
    renderComponent(existingCategories)
    
    // Start editing
    fireEvent.click(screen.getByRole('button', { name: /edit category/i }))
    expect(screen.getByText('Update Category')).toBeInTheDocument()
    
    // Update category name and side
    fireEvent.change(screen.getByPlaceholderText(/enter category name/i), { target: { value: 'Updated Family' } })
    fireEvent.change(screen.getByDisplayValue('💗 Bride'), { target: { value: 'groom' } })
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
})