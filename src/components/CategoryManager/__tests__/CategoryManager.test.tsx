import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '../../../test/utils'
import { CategoryManager } from '../CategoryManager'
import type { Category } from '../../../types'

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
  })

  it('adds a new category', () => {
    renderComponent()
    
    const input = screen.getByPlaceholderText('Enter category name')
    fireEvent.change(input, { target: { value: 'Family' } })
    fireEvent.click(screen.getByText('Add Category'))

    expect(mockOnAdd).toHaveBeenCalledWith('Family')
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
      { id: '1', name: 'Family' }
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
      { id: '1', name: 'Family' }
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
    expect(mockOnAdd).toHaveBeenCalledWith('New Family')
  })

  it('properly handles error message visibility', () => {
    const existingCategories = [
      { id: '1', name: 'Family' }
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

  it('edits an existing category', () => {
    const existingCategories = [
      { id: '1', name: 'Family' }
    ]

    renderComponent(existingCategories)
    
    // Start editing
    fireEvent.click(screen.getByRole('button', { name: /edit category/i }))
    
    const input = screen.getByPlaceholderText('Enter category name')
    fireEvent.change(input, { target: { value: 'Close Family' } })
    fireEvent.click(screen.getByText('Update Category'))

    expect(mockOnEdit).toHaveBeenCalledWith('1', 'Close Family')
  })

  it('deletes a category after confirmation', () => {
    const mockConfirm = vi.fn(() => true)
    vi.stubGlobal('confirm', mockConfirm)

    const existingCategories = [
      { id: '1', name: 'Family' }
    ]

    renderComponent(existingCategories)
    
    fireEvent.click(screen.getByRole('button', { name: /delete category/i }))

    expect(mockConfirm).toHaveBeenCalledWith('Are you sure you want to delete this category?')
    expect(mockOnDelete).toHaveBeenCalledWith('1')
  })

  it('cancels category deletion when not confirmed', async () => {
    const mockConfirm = vi.spyOn(window, 'confirm').mockReturnValue(false);
    const existingCategories = [{ id: '1', name: 'Family' }];
    renderComponent(existingCategories)
    
    fireEvent.click(screen.getByRole('button', { name: /delete category/i }))

    expect(mockConfirm).toHaveBeenCalledWith('Are you sure you want to delete this category?')
    expect(mockOnDelete).not.toHaveBeenCalled();
    mockConfirm.mockRestore();
  })

  it('cancels editing when cancel button is clicked', async () => {
    const existingCategories = [{ id: '1', name: 'Family' }];
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
    const existingCategories = [{ id: '1', name: 'Family' }];
    renderComponent(existingCategories)
    
    // Start editing
    fireEvent.click(screen.getByRole('button', { name: /edit category/i }))
    expect(screen.getByText('Update Category')).toBeInTheDocument()
    
    // Update category name
    fireEvent.change(screen.getByPlaceholderText(/enter category name/i), { target: { value: 'Updated Family' } })
    fireEvent.click(screen.getByRole('button', { name: /update category/i }))
    
    expect(mockOnEdit).toHaveBeenCalledWith('1', 'Updated Family')
  })

  it('deletes category when confirmed', async () => {
    const mockConfirm = vi.spyOn(window, 'confirm').mockReturnValue(true);
    const existingCategories = [{ id: '1', name: 'Family' }];
    renderComponent(existingCategories)
    
    fireEvent.click(screen.getByRole('button', { name: /delete category/i }))

    expect(mockConfirm).toHaveBeenCalledWith('Are you sure you want to delete this category?')
    expect(mockOnDelete).toHaveBeenCalledWith('1')
    mockConfirm.mockRestore();
  })
}) 