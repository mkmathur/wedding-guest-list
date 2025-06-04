import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '../../../test/utils'
import { TierManager } from '../TierManager'
import { storage } from '../../../utils/storage'

// Mock the storage utility
vi.mock('../../../utils/storage', () => ({
  storage: {
    getTiers: vi.fn(),
    setTiers: vi.fn(),
  },
}))

// Mock crypto.randomUUID
const mockUUID = '123e4567-e89b-12d3-a456-426614174000'
vi.stubGlobal('crypto', {
  randomUUID: () => mockUUID,
})

describe('TierManager', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Start with empty tiers
    vi.mocked(storage.getTiers).mockReturnValue([])
  })

  it('renders the add tier form', () => {
    render(<TierManager />)
    
    expect(screen.getByPlaceholderText('Enter tier name')).toBeInTheDocument()
    expect(screen.getByText('Add Tier')).toBeInTheDocument()
  })

  it('adds a new tier', () => {
    render(<TierManager />)
    
    const input = screen.getByPlaceholderText('Enter tier name')
    fireEvent.change(input, { target: { value: 'Must Invite' } })
    fireEvent.click(screen.getByText('Add Tier'))

    expect(storage.setTiers).toHaveBeenCalledWith([
      { id: mockUUID, name: 'Must Invite', order: 0 }
    ])
  })

  it('validates empty tier name', () => {
    render(<TierManager />)
    
    const input = screen.getByPlaceholderText('Enter tier name')
    fireEvent.change(input, { target: { value: '   ' } })
    fireEvent.click(screen.getByText('Add Tier'))

    expect(screen.getByText('Tier name cannot be empty')).toBeInTheDocument()
    expect(storage.setTiers).not.toHaveBeenCalled()
  })

  it('validates duplicate tier name', () => {
    vi.mocked(storage.getTiers).mockReturnValue([
      { id: '1', name: 'Must Invite', order: 0 }
    ])

    render(<TierManager />)
    
    const input = screen.getByPlaceholderText('Enter tier name')
    fireEvent.change(input, { target: { value: 'Must Invite' } })
    fireEvent.click(screen.getByText('Add Tier'))

    expect(screen.getByText('Tier name must be unique')).toBeInTheDocument()
    expect(storage.setTiers).not.toHaveBeenCalled()
  })

  it('edits an existing tier', () => {
    const existingTier = { id: '1', name: 'Must Invite', order: 0 }
    vi.mocked(storage.getTiers).mockReturnValue([existingTier])

    render(<TierManager />)
    
    // Start editing
    fireEvent.click(screen.getByText('Edit'))
    
    const input = screen.getByPlaceholderText('Enter tier name')
    fireEvent.change(input, { target: { value: 'Must Invite - VIP' } })
    fireEvent.click(screen.getByText('Update Tier'))

    expect(storage.setTiers).toHaveBeenCalledWith([
      { id: '1', name: 'Must Invite - VIP', order: 0 }
    ])
  })

  it('deletes a tier after confirmation', () => {
    const mockConfirm = vi.fn(() => true)
    vi.stubGlobal('confirm', mockConfirm)

    const existingTier = { id: '1', name: 'Must Invite', order: 0 }
    vi.mocked(storage.getTiers).mockReturnValue([existingTier])

    render(<TierManager />)
    
    fireEvent.click(screen.getByText('Delete'))

    expect(mockConfirm).toHaveBeenCalledWith('Are you sure you want to delete this tier?')
    expect(storage.setTiers).toHaveBeenCalledWith([])
  })

  it('moves a tier up', () => {
    const tiers = [
      { id: '1', name: 'Tier 1', order: 0 },
      { id: '2', name: 'Tier 2', order: 1 }
    ]
    vi.mocked(storage.getTiers).mockReturnValue(tiers)

    render(<TierManager />)
    
    // Move second tier up
    const moveUpButtons = screen.getAllByTitle('Move Up')
    fireEvent.click(moveUpButtons[1]) // Second tier's up button

    expect(storage.setTiers).toHaveBeenCalledWith([
      { id: '2', name: 'Tier 2', order: 0 },
      { id: '1', name: 'Tier 1', order: 1 }
    ])
  })

  it('moves a tier down', () => {
    const tiers = [
      { id: '1', name: 'Tier 1', order: 0 },
      { id: '2', name: 'Tier 2', order: 1 }
    ]
    vi.mocked(storage.getTiers).mockReturnValue(tiers)

    render(<TierManager />)
    
    // Move first tier down
    const moveDownButtons = screen.getAllByTitle('Move Down')
    fireEvent.click(moveDownButtons[0]) // First tier's down button

    expect(storage.setTiers).toHaveBeenCalledWith([
      { id: '2', name: 'Tier 2', order: 0 },
      { id: '1', name: 'Tier 1', order: 1 }
    ])
  })

  it('disables up button for first tier', () => {
    const tiers = [
      { id: '1', name: 'Tier 1', order: 0 },
      { id: '2', name: 'Tier 2', order: 1 }
    ]
    vi.mocked(storage.getTiers).mockReturnValue(tiers)

    render(<TierManager />)
    
    const moveUpButtons = screen.getAllByTitle('Move Up')
    expect(moveUpButtons[0]).toBeDisabled() // First tier's up button
    expect(moveUpButtons[1]).not.toBeDisabled() // Second tier's up button
  })

  it('disables down button for last tier', () => {
    const tiers = [
      { id: '1', name: 'Tier 1', order: 0 },
      { id: '2', name: 'Tier 2', order: 1 }
    ]
    vi.mocked(storage.getTiers).mockReturnValue(tiers)

    render(<TierManager />)
    
    const moveDownButtons = screen.getAllByTitle('Move Down')
    expect(moveDownButtons[0]).not.toBeDisabled() // First tier's down button
    expect(moveDownButtons[1]).toBeDisabled() // Second tier's down button
  })
}) 