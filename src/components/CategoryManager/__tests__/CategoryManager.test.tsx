import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '../../../test/utils'
import { CategoryManager } from '../CategoryManager'
import { storage } from '../../../utils/storage'

// Mock the storage utility
vi.mock('../../../utils/storage', () => ({
  storage: {
    getCategories: vi.fn(),
    setCategories: vi.fn(),
  },
}))

// Mock crypto.randomUUID
const mockUUID = '123e4567-e89b-12d3-a456-426614174000'
vi.stubGlobal('crypto', {
  randomUUID: () => mockUUID,
})

describe('CategoryManager', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Start with empty categories
    vi.mocked(storage.getCategories).mockReturnValue([])
  })

  it('renders the add category form', () => {
    render(<CategoryManager />)
    
    expect(screen.getByPlaceholderText('Enter category name')).toBeInTheDocument()
    expect(screen.getByText('Add Category')).toBeInTheDocument()
  })

  it('adds a new category', () => {
    render(<CategoryManager />)
    
    const input = screen.getByPlaceholderText('Enter category name')
    fireEvent.change(input, { target: { value: 'Family' } })
    fireEvent.click(screen.getByText('Add Category'))

    expect(storage.setCategories).toHaveBeenCalledWith([
      { id: mockUUID, name: 'Family' }
    ])
  })

  it('validates empty category name', () => {
    render(<CategoryManager />)
    
    const input = screen.getByPlaceholderText('Enter category name')
    fireEvent.change(input, { target: { value: '   ' } })
    fireEvent.click(screen.getByText('Add Category'))

    expect(screen.getByText('Category name cannot be empty')).toBeInTheDocument()
    expect(storage.setCategories).not.toHaveBeenCalled()
  })

  it('validates duplicate category name', () => {
    vi.mocked(storage.getCategories).mockReturnValue([
      { id: '1', name: 'Family' }
    ])

    render(<CategoryManager />)
    
    const input = screen.getByPlaceholderText('Enter category name')
    fireEvent.change(input, { target: { value: 'Family' } })
    fireEvent.click(screen.getByText('Add Category'))

    expect(screen.getByText('Category name must be unique')).toBeInTheDocument()
    expect(storage.setCategories).not.toHaveBeenCalled()
  })

  it('edits an existing category', () => {
    const existingCategory = { id: '1', name: 'Family' }
    vi.mocked(storage.getCategories).mockReturnValue([existingCategory])

    render(<CategoryManager />)
    
    // Start editing
    fireEvent.click(screen.getByText('Edit'))
    
    const input = screen.getByPlaceholderText('Enter category name')
    fireEvent.change(input, { target: { value: 'Close Family' } })
    fireEvent.click(screen.getByText('Update Category'))

    expect(storage.setCategories).toHaveBeenCalledWith([
      { id: '1', name: 'Close Family' }
    ])
  })

  it('deletes a category after confirmation', () => {
    const mockConfirm = vi.fn(() => true)
    vi.stubGlobal('confirm', mockConfirm)

    const existingCategory = { id: '1', name: 'Family' }
    vi.mocked(storage.getCategories).mockReturnValue([existingCategory])

    render(<CategoryManager />)
    
    fireEvent.click(screen.getByText('Delete'))

    expect(mockConfirm).toHaveBeenCalledWith('Are you sure you want to delete this category?')
    expect(storage.setCategories).toHaveBeenCalledWith([])
  })

  it('cancels category deletion when not confirmed', () => {
    const mockConfirm = vi.fn(() => false)
    vi.stubGlobal('confirm', mockConfirm)

    const existingCategory = { id: '1', name: 'Family' }
    vi.mocked(storage.getCategories).mockReturnValue([existingCategory])

    render(<CategoryManager />)
    
    fireEvent.click(screen.getByText('Delete'))

    expect(mockConfirm).toHaveBeenCalledWith('Are you sure you want to delete this category?')
    expect(storage.setCategories).not.toHaveBeenCalled()
  })
}) 