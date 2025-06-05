import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '../../../test/utils'
import { TierManager } from '../TierManager'
import type { Tier } from '../../../types'

describe('TierManager', () => {
  const mockTiers: Tier[] = []
  const mockOnAdd = vi.fn()
  const mockOnEdit = vi.fn()
  const mockOnDelete = vi.fn()

  const renderComponent = (tiers = mockTiers) => {
    return render(
      <TierManager
        tiers={tiers}
        onAdd={mockOnAdd}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    )
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the add tier form', () => {
    renderComponent()
    
    expect(screen.getByPlaceholderText('Enter tier name')).toBeInTheDocument()
    expect(screen.getByText('Add Tier')).toBeInTheDocument()
  })

  it('adds a new tier', () => {
    renderComponent()
    
    const input = screen.getByPlaceholderText('Enter tier name')
    fireEvent.change(input, { target: { value: 'Must Invite' } })
    fireEvent.click(screen.getByText('Add Tier'))

    expect(mockOnAdd).toHaveBeenCalledWith('Must Invite', 0)
  })

  it('validates empty tier name', () => {
    renderComponent()
    
    const input = screen.getByPlaceholderText('Enter tier name')
    fireEvent.change(input, { target: { value: '   ' } })
    fireEvent.click(screen.getByText('Add Tier'))

    expect(screen.getByText('Tier name cannot be empty')).toBeInTheDocument()
    expect(mockOnAdd).not.toHaveBeenCalled()
  })

  it('validates duplicate tier name', () => {
    const existingTiers = [
      { id: '1', name: 'Must Invite', order: 0 }
    ]

    renderComponent(existingTiers)
    
    const input = screen.getByPlaceholderText('Enter tier name')
    fireEvent.change(input, { target: { value: 'Must Invite' } })
    fireEvent.click(screen.getByText('Add Tier'))

    expect(screen.getByText('Tier name must be unique')).toBeInTheDocument()
    expect(mockOnAdd).not.toHaveBeenCalled()
  })

  it('edits an existing tier', () => {
    const existingTiers = [
      { id: '1', name: 'Must Invite', order: 0 }
    ]

    renderComponent(existingTiers)
    
    // Start editing
    fireEvent.click(screen.getByText('Edit'))
    
    const input = screen.getByPlaceholderText('Enter tier name')
    fireEvent.change(input, { target: { value: 'Must Invite - VIP' } })
    fireEvent.click(screen.getByText('Update Tier'))

    expect(mockOnEdit).toHaveBeenCalledWith('1', 'Must Invite - VIP', 0)
  })

  it('deletes a tier after confirmation', () => {
    const mockConfirm = vi.fn(() => true)
    vi.stubGlobal('confirm', mockConfirm)

    const existingTiers = [
      { id: '1', name: 'Must Invite', order: 0 }
    ]

    renderComponent(existingTiers)
    
    fireEvent.click(screen.getByText('Delete'))

    expect(mockConfirm).toHaveBeenCalledWith('Are you sure you want to delete this tier?')
    expect(mockOnDelete).toHaveBeenCalledWith('1')
  })

  it('moves a tier up', () => {
    const existingTiers = [
      { id: '1', name: 'Tier 1', order: 0 },
      { id: '2', name: 'Tier 2', order: 1 },
      { id: '3', name: 'Tier 3', order: 2 }
    ]

    renderComponent(existingTiers)
    
    // Verify initial render
    const tierElements = screen.getAllByText(/Tier \d/)
    expect(tierElements[0]).toHaveTextContent('Tier 1')
    expect(tierElements[1]).toHaveTextContent('Tier 2')
    expect(tierElements[2]).toHaveTextContent('Tier 3')

    // Verify initial button states
    const moveUpButtons = screen.getAllByTitle('Move Up')
    expect(moveUpButtons[0]).toBeDisabled() // Top tier can't move up
    expect(moveUpButtons[1]).not.toBeDisabled() // Middle tier can move up
    expect(moveUpButtons[2]).not.toBeDisabled() // Bottom tier can move up

    // Move middle tier up
    fireEvent.click(moveUpButtons[1])

    // Verify onEdit was called with correct parameters
    expect(mockOnEdit).toHaveBeenCalledTimes(2)
    expect(mockOnEdit).toHaveBeenCalledWith('2', 'Tier 2', 0) // Move Tier 2 up
    expect(mockOnEdit).toHaveBeenCalledWith('1', 'Tier 1', 1) // Move Tier 1 down
  })

  it('moves a tier down', () => {
    const existingTiers = [
      { id: '1', name: 'Tier 1', order: 0 },
      { id: '2', name: 'Tier 2', order: 1 },
      { id: '3', name: 'Tier 3', order: 2 }
    ]

    renderComponent(existingTiers)
    
    // Verify initial render
    const tierElements = screen.getAllByText(/Tier \d/)
    expect(tierElements[0]).toHaveTextContent('Tier 1')
    expect(tierElements[1]).toHaveTextContent('Tier 2')
    expect(tierElements[2]).toHaveTextContent('Tier 3')

    // Verify initial button states
    const moveDownButtons = screen.getAllByTitle('Move Down')
    expect(moveDownButtons[0]).not.toBeDisabled() // Top tier can move down
    expect(moveDownButtons[1]).not.toBeDisabled() // Middle tier can move down
    expect(moveDownButtons[2]).toBeDisabled() // Bottom tier can't move down

    // Move middle tier down
    fireEvent.click(moveDownButtons[1])

    // Verify onEdit was called with correct parameters
    expect(mockOnEdit).toHaveBeenCalledTimes(2)
    expect(mockOnEdit).toHaveBeenCalledWith('2', 'Tier 2', 2) // Move Tier 2 down
    expect(mockOnEdit).toHaveBeenCalledWith('3', 'Tier 3', 1) // Move Tier 3 up
  })

  it('maintains correct order after multiple moves', () => {
    const existingTiers = [
      { id: '1', name: 'Tier 1', order: 0 },
      { id: '2', name: 'Tier 2', order: 1 },
      { id: '3', name: 'Tier 3', order: 2 }
    ]

    const { rerender } = renderComponent(existingTiers)
    
    // Get initial tier elements
    const tierElements = screen.getAllByText(/Tier \d/)
    expect(tierElements[0]).toHaveTextContent('Tier 1')
    expect(tierElements[1]).toHaveTextContent('Tier 2')
    expect(tierElements[2]).toHaveTextContent('Tier 3')
    
    // Move middle tier up
    const moveUpButtons = screen.getAllByTitle('Move Up')
    fireEvent.click(moveUpButtons[1]) // Move Tier 2 up

    // Verify first move sequence
    expect(mockOnEdit.mock.calls[0]).toEqual(['2', 'Tier 2', 0]) // First call: Move Tier 2 up
    expect(mockOnEdit.mock.calls[1]).toEqual(['1', 'Tier 1', 1]) // Second call: Move Tier 1 down

    // Simulate the state update after first move
    const tiersAfterUp = [
      { id: '2', name: 'Tier 2', order: 0 },
      { id: '1', name: 'Tier 1', order: 1 },
      { id: '3', name: 'Tier 3', order: 2 }
    ]
    rerender(
      <TierManager
        tiers={tiersAfterUp}
        onAdd={mockOnAdd}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    )

    // Move top tier (Tier 2) down
    const moveDownButtons = screen.getAllByTitle('Move Down')
    fireEvent.click(moveDownButtons[0]) // Move Tier 2 down

    // Verify second move sequence
    expect(mockOnEdit.mock.calls[2]).toEqual(['2', 'Tier 2', 1]) // Third call: Move Tier 2 down
    expect(mockOnEdit.mock.calls[3]).toEqual(['1', 'Tier 1', 0]) // Fourth call: Move Tier 1 up

    // Simulate the state update after second move
    const tiersAfterDown = [
      { id: '1', name: 'Tier 1', order: 0 },
      { id: '2', name: 'Tier 2', order: 1 },
      { id: '3', name: 'Tier 3', order: 2 }
    ]
    rerender(
      <TierManager
        tiers={tiersAfterDown}
        onAdd={mockOnAdd}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    )

    // Verify final UI state
    const finalTierElements = screen.getAllByText(/Tier \d/)
    expect(finalTierElements[0]).toHaveTextContent('Tier 1')
    expect(finalTierElements[1]).toHaveTextContent('Tier 2')
    expect(finalTierElements[2]).toHaveTextContent('Tier 3')
  })

  it('disables up button for first tier', () => {
    const existingTiers = [
      { id: '1', name: 'Tier 1', order: 0 },
      { id: '2', name: 'Tier 2', order: 1 }
    ]

    renderComponent(existingTiers)
    
    const moveUpButtons = screen.getAllByTitle('Move Up')
    expect(moveUpButtons[0]).toBeDisabled() // First tier's up button
    expect(moveUpButtons[1]).not.toBeDisabled() // Second tier's up button
  })

  it('disables down button for last tier', () => {
    const existingTiers = [
      { id: '1', name: 'Tier 1', order: 0 },
      { id: '2', name: 'Tier 2', order: 1 }
    ]

    renderComponent(existingTiers)
    
    const moveDownButtons = screen.getAllByTitle('Move Down')
    expect(moveDownButtons[0]).not.toBeDisabled() // First tier's down button
    expect(moveDownButtons[1]).toBeDisabled() // Second tier's down button
  })

  it('cancels editing when cancel button is clicked', () => {
    const existingTiers = [
      { id: '1', name: 'Must Invite', order: 0 }
    ]

    renderComponent(existingTiers)
    
    // Start editing
    fireEvent.click(screen.getByText('Edit'))
    expect(screen.getByText('Update Tier')).toBeInTheDocument()
    
    // Cancel editing
    fireEvent.click(screen.getByText('Cancel'))
    expect(screen.getByText('Add Tier')).toBeInTheDocument()
    expect(mockOnEdit).not.toHaveBeenCalled()
  })
}) 