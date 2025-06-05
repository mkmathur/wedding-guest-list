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

  it('edits an existing category', () => {
    const existingCategories = [
      { id: '1', name: 'Family' }
    ]

    renderComponent(existingCategories)
    
    // Start editing
    fireEvent.click(screen.getByText('Edit'))
    
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
    
    fireEvent.click(screen.getByText('Delete'))

    expect(mockConfirm).toHaveBeenCalledWith('Are you sure you want to delete this category?')
    expect(mockOnDelete).toHaveBeenCalledWith('1')
  })

  it('cancels category deletion when not confirmed', () => {
    const mockConfirm = vi.fn(() => false)
    vi.stubGlobal('confirm', mockConfirm)

    const existingCategories = [
      { id: '1', name: 'Family' }
    ]

    renderComponent(existingCategories)
    
    fireEvent.click(screen.getByText('Delete'))

    expect(mockConfirm).toHaveBeenCalledWith('Are you sure you want to delete this category?')
    expect(mockOnDelete).not.toHaveBeenCalled()
  })

  it('cancels editing when cancel button is clicked', () => {
    const existingCategories = [
      { id: '1', name: 'Family' }
    ]

    renderComponent(existingCategories)
    
    // Start editing
    fireEvent.click(screen.getByText('Edit'))
    expect(screen.getByText('Update Category')).toBeInTheDocument()
    
    // Cancel editing
    fireEvent.click(screen.getByText('Cancel'))
    expect(screen.getByText('Add Category')).toBeInTheDocument()
    expect(mockOnEdit).not.toHaveBeenCalled()
  })
}) 