import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '../../../test/utils'
import { TierManager } from '../TierManager'
import type { Tier, Household } from '../../../types'

describe('TierManager', () => {
  const mockTiers: Tier[] = [
    { id: '1', name: 'T1' },
    { id: '2', name: 'T2' },
    { id: '3', name: 'T3' }
  ]
  const mockHouseholds: Household[] = []
  const mockOnAdd = vi.fn()
  const mockOnDelete = vi.fn()

  const renderComponent = (tiers = mockTiers, households = mockHouseholds) => {
    return render(
      <TierManager
        tiers={tiers}
        households={households}
        onAdd={mockOnAdd}
        onDelete={mockOnDelete}
      />
    )
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders tiers with numbered names', () => {
    renderComponent()
    
    expect(screen.getByText('T1')).toBeInTheDocument()
    expect(screen.getByText('T2')).toBeInTheDocument()
    expect(screen.getByText('T3')).toBeInTheDocument()
  })

  it('renders the add tier button', () => {
    renderComponent()
    
    expect(screen.getByText('Add tier')).toBeInTheDocument()
  })

  it('shows empty state when no tiers exist', () => {
    renderComponent([], [])
    
    expect(screen.getByText(/No invitation tiers yet/)).toBeInTheDocument()
  })

  it('calls onAdd when add tier button is clicked', () => {
    renderComponent()
    
    fireEvent.click(screen.getByText('Add tier'))
    
    expect(mockOnAdd).toHaveBeenCalledTimes(1)
  })

  it('shows delete button only for last tier', () => {
    renderComponent()
    
    // Should only find one delete button (for the last tier T3)
    const deleteButtons = screen.getAllByLabelText(/Delete T/)
    expect(deleteButtons).toHaveLength(1)
    expect(deleteButtons[0]).toHaveAttribute('aria-label', 'Delete T3')
  })

  it('deletes last tier when confirmed', () => {
    const mockConfirm = vi.fn(() => true)
    vi.stubGlobal('confirm', mockConfirm)

    renderComponent()
    
    fireEvent.click(screen.getByLabelText('Delete T3'))

    expect(mockConfirm).toHaveBeenCalledWith('Are you sure you want to delete T3?')
    expect(mockOnDelete).toHaveBeenCalledWith('3')
  })

  it('does not delete when confirmation is canceled', () => {
    const mockConfirm = vi.fn(() => false)
    vi.stubGlobal('confirm', mockConfirm)

    renderComponent()
    
    fireEvent.click(screen.getByLabelText('Delete T3'))

    expect(mockConfirm).toHaveBeenCalled()
    expect(mockOnDelete).not.toHaveBeenCalled()
  })

  it('disables delete button when households are assigned to last tier', () => {
    const householdsWithT3 = [
      { id: '1', name: 'Smith Family', guestCount: 4, categoryId: 'cat1', tierId: '3' }
    ]

    renderComponent(mockTiers, householdsWithT3)
    
    const deleteButton = screen.getByLabelText('Delete T3')
    expect(deleteButton).toBeDisabled()
  })

  it('enables delete button when no households are assigned to last tier', () => {
    const householdsWithT2 = [
      { id: '1', name: 'Smith Family', guestCount: 4, categoryId: 'cat1', tierId: '2' }
    ]

    renderComponent(mockTiers, householdsWithT2)
    
    const deleteButton = screen.getByLabelText('Delete T3')
    expect(deleteButton).not.toBeDisabled()
  })

  it('shows correct tooltip when delete is disabled due to households', () => {
    const householdsWithT3 = [
      { id: '1', name: 'Smith Family', guestCount: 4, categoryId: 'cat1', tierId: '3' }
    ]

    renderComponent(mockTiers, householdsWithT3)
    
    const deleteButton = screen.getByLabelText('Delete T3')
    expect(deleteButton).toHaveAttribute('title', 'Cannot delete - households are assigned to this tier')
  })

  it('shows correct tooltip when delete is enabled', () => {
    renderComponent()
    
    const deleteButton = screen.getByLabelText('Delete T3')
    expect(deleteButton).toHaveAttribute('title', 'Delete tier')
  })

  it('does not show delete button for non-last tiers even with single tier', () => {
    const singleTier = [{ id: '1', name: 'T1' }]
    
    renderComponent(singleTier)
    
    // Should find the delete button for T1 (which is the last/only tier)
    expect(screen.getByLabelText('Delete T1')).toBeInTheDocument()
  })
})