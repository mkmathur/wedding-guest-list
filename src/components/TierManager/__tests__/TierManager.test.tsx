import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '../../../test/utils'
import { TierManager } from '../TierManager'
import type { Tier } from '../../../types'

describe('TierManager', () => {
  const mockTiers: Tier[] = []
  const mockOnAdd = vi.fn()
  const mockOnEdit = vi.fn()
  const mockOnDelete = vi.fn()
  const mockOnMoveUp = vi.fn()
  const mockOnMoveDown = vi.fn()

  const renderComponent = (tiers = mockTiers) => {
    return render(
      <TierManager
        tiers={tiers}
        onAdd={mockOnAdd}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onMoveUp={mockOnMoveUp}
        onMoveDown={mockOnMoveDown}
      />
    )
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the new tier button initially', () => {
    renderComponent()
    
    expect(screen.getByText('+ New Tier')).toBeInTheDocument()
  })

  it('shows tier form when new tier button is clicked', () => {
    renderComponent()
    
    fireEvent.click(screen.getByText('+ New Tier'))
    
    expect(screen.getByText('Tier Name:')).toBeInTheDocument()
    expect(screen.getByText('Create Tier')).toBeInTheDocument()
    expect(screen.getByText('Cancel')).toBeInTheDocument()
  })

  it('adds a new tier', () => {
    renderComponent()
    
    fireEvent.click(screen.getByText('+ New Tier'))
    
    const input = screen.getByLabelText('Tier Name:')
    fireEvent.change(input, { target: { value: 'Must Invite' } })
    fireEvent.click(screen.getByText('Create Tier'))

    expect(mockOnAdd).toHaveBeenCalledWith('Must Invite')
  })

  it('validates empty tier name', () => {
    renderComponent()
    
    fireEvent.click(screen.getByText('+ New Tier'))
    
    const input = screen.getByLabelText('Tier Name:')
    fireEvent.change(input, { target: { value: '   ' } })
    fireEvent.click(screen.getByText('Create Tier'))

    expect(screen.getByText('Tier name cannot be empty')).toBeInTheDocument()
    expect(mockOnAdd).not.toHaveBeenCalled()
  })

  it('validates duplicate tier name', () => {
    const existingTiers = [
      { id: '1', name: 'Must Invite' }
    ]

    renderComponent(existingTiers)
    
    fireEvent.click(screen.getByText('+ New Tier'))
    
    const input = screen.getByLabelText('Tier Name:')
    fireEvent.change(input, { target: { value: 'Must Invite' } })
    fireEvent.click(screen.getByText('Create Tier'))

    expect(screen.getByText('Tier name must be unique')).toBeInTheDocument()
    expect(mockOnAdd).not.toHaveBeenCalled()
  })

  it('edits an existing tier', () => {
    const existingTiers = [
      { id: '1', name: 'Must Invite' }
    ]

    renderComponent(existingTiers)
    
    // Start editing using role and index
    fireEvent.click(screen.getAllByRole('button', { name: 'Edit tier' })[0])
    
    const input = screen.getByLabelText('Tier Name:')
    fireEvent.change(input, { target: { value: 'Must Invite - VIP' } })
    fireEvent.click(screen.getByText('Update Tier'))

    expect(mockOnEdit).toHaveBeenCalledWith('1', 'Must Invite - VIP')
  })

  it('deletes a tier after confirmation', () => {
    const mockConfirm = vi.fn(() => true)
    vi.stubGlobal('confirm', mockConfirm)

    const existingTiers = [
      { id: '1', name: 'Must Invite' }
    ]

    renderComponent(existingTiers)
    
    // Click delete button using role and index
    fireEvent.click(screen.getAllByRole('button', { name: 'Delete tier' })[0])

    expect(mockConfirm).toHaveBeenCalledWith('Are you sure you want to delete this tier?')
    expect(mockOnDelete).toHaveBeenCalledWith('1')
  })

  it('moves a tier up', () => {
    const existingTiers = [
      { id: '1', name: 'Tier 1' },
      { id: '2', name: 'Tier 2' },
      { id: '3', name: 'Tier 3' }
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

    // Verify onMoveUp was called
    expect(mockOnMoveUp).toHaveBeenCalledWith('2')
  })

  it('moves a tier down', () => {
    const existingTiers = [
      { id: '1', name: 'Tier 1' },
      { id: '2', name: 'Tier 2' },
      { id: '3', name: 'Tier 3' }
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

    // Verify onMoveDown was called
    expect(mockOnMoveDown).toHaveBeenCalledWith('2')
  })

  it('maintains correct order after multiple moves', () => {
    const existingTiers = [
      { id: '1', name: 'Tier 1' },
      { id: '2', name: 'Tier 2' },
      { id: '3', name: 'Tier 3' }
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

    // Verify first move
    expect(mockOnMoveUp).toHaveBeenCalledWith('2')

    // Simulate the state update after first move
    const tiersAfterUp = [
      { id: '2', name: 'Tier 2' },
      { id: '1', name: 'Tier 1' },
      { id: '3', name: 'Tier 3' }
    ]
    rerender(
      <TierManager
        tiers={tiersAfterUp}
        onAdd={mockOnAdd}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onMoveUp={mockOnMoveUp}
        onMoveDown={mockOnMoveDown}
      />
    )

    // Move top tier (Tier 2) down
    const moveDownButtons = screen.getAllByTitle('Move Down')
    fireEvent.click(moveDownButtons[0]) // Move Tier 2 down

    // Verify second move
    expect(mockOnMoveDown).toHaveBeenCalledWith('2')

    // Simulate the state update after second move
    const tiersAfterDown = [
      { id: '1', name: 'Tier 1' },
      { id: '2', name: 'Tier 2' },
      { id: '3', name: 'Tier 3' }
    ]
    rerender(
      <TierManager
        tiers={tiersAfterDown}
        onAdd={mockOnAdd}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onMoveUp={mockOnMoveUp}
        onMoveDown={mockOnMoveDown}
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
      { id: '1', name: 'Tier 1' },
      { id: '2', name: 'Tier 2' }
    ]

    renderComponent(existingTiers)
    
    const moveUpButtons = screen.getAllByTitle('Move Up')
    expect(moveUpButtons[0]).toBeDisabled() // First tier's up button
    expect(moveUpButtons[1]).not.toBeDisabled() // Second tier's up button
  })

  it('disables down button for last tier', () => {
    const existingTiers = [
      { id: '1', name: 'Tier 1' },
      { id: '2', name: 'Tier 2' }
    ]

    renderComponent(existingTiers)
    
    const moveDownButtons = screen.getAllByTitle('Move Down')
    expect(moveDownButtons[0]).not.toBeDisabled() // First tier's down button
    expect(moveDownButtons[1]).toBeDisabled() // Last tier's down button
  })

  it('cancels editing when cancel button is clicked', () => {
    const existingTiers = [
      { id: '1', name: 'Must Invite' }
    ]

    renderComponent(existingTiers)
    
    // Start editing using role and index
    fireEvent.click(screen.getAllByRole('button', { name: 'Edit tier' })[0])
    
    // Click cancel
    fireEvent.click(screen.getByText('Cancel'))

    // Verify we're back in list mode
    expect(screen.getByText('+ New Tier')).toBeInTheDocument()
  })

  it('cancels form creation when cancel button is clicked', () => {
    renderComponent()
    
    fireEvent.click(screen.getByText('+ New Tier'))
    expect(screen.getByText('Create Tier')).toBeInTheDocument()
    
    fireEvent.click(screen.getByText('Cancel'))
    expect(screen.queryByText('Create Tier')).not.toBeInTheDocument()
    expect(screen.getByText('+ New Tier')).toBeInTheDocument()
  })
}) 