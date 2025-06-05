# Wedding Guest List App - Development Tasks

## Phase 1: Project Setup and Basic Structure
- [x] Initialize React + TypeScript project using Vite
- [x] ~~Set up Tailwind CSS~~ (Switched to CSS Modules)
- [x] Create basic project structure
  - [x] `/src/components/` for React components
  - [x] `/src/hooks/` for custom hooks
  - [x] `/src/utils/` for utilities
  - [x] `/src/types/` for TypeScript interfaces
- [x] Define TypeScript interfaces for data models
  - [x] Tier interface
  - [x] Category interface
  - [x] Household interface
  - [x] Event interface (with category-tier selections)
- [x] Set up local storage utilities
  - [x] Basic CRUD operations
  - [x] Type safety
  - [x] Error handling
  - [x] Data integrity validation
- [x] Implement Category Management
  - [x] Create/edit/delete categories
  - [x] Category list view
  - [x] Form validation
  - [x] Local storage persistence
- [x] Set up Testing Infrastructure
  - [x] Install and configure Vitest
  - [x] Set up React Testing Library
  - [x] Write unit tests for category validation
  - [x] Write unit tests for localStorage operations
  - [x] Write component tests for CategoryManager
  - [x] Create comprehensive testing documentation
  - [ ] Complete manual testing checklist

## Next Immediate Tasks:
1. Complete manual testing of existing features
   - [x] Category management testing
   - [ ] Tier management testing
     - [x] Basic edit functionality (name changes)
     - [x] Order changes
     - [ ] Form validation
     - [ ] Household list/form updates
     - [ ] Delete functionality
   - [ ] Household management testing
2. Fix any issues found during manual testing
   - [x] Fix tier editing real-time update issue
   - [x] Fix tier name whitespace handling
3. Continue with remaining Phase 2 features

## Phase 2: Core Features - Data Management
- [ ] Implement Tier Management
  - [x] Create/edit/delete tiers
  - [x] Set tier names (e.g., "Must Invite", "Want to Invite", "If Space Permits")
  - [x] Set tier order/priority
  - [x] Local storage persistence
  - [x] Write tests for tier management
  - [x] Fix tier editing UX issues
  - [ ] Complete manual testing of tier features
    - [ ] Form validation
    - [ ] Household integration
    - [ ] Delete functionality

- [x] Implement Household Management
  - [x] Add/edit/delete households
  - [x] Set household name
  - [x] Set guest count per household
  - [x] Assign category to household
  - [x] Assign tier to household
  - [x] Local storage persistence for households
  - [x] Write tests for household management
  - [ ] Complete manual testing of household features
  - [ ] Implement bulk edit capabilities for quick updates

## Phase 3: Event Planning Features
- [ ] Create Event Builder Interface
- [ ] Select categories and tiers for events
- [ ] Save/load events
- [ ] Compare multiple events

## Phase 4: CSV Import/Export
- [ ] Implement CSV Export
  - [ ] Generate CSV with household data
    - Columns: Household Name, Guest Count, Category, Tier
  - [ ] Include category and tier information
  - [ ] Format for easy spreadsheet viewing
  - [ ] Export tier definitions and settings

- [ ] Implement CSV Import
  - [ ] Parse CSV files
  - [ ] Validate data format
  - [ ] Support importing tier definitions
  - [ ] Update local storage with imported data

## Phase 5: UI/UX Enhancements
- [ ] Create Dashboard View
  - [x] Total guest count
  - [ ] Quick actions bar
  - [ ] Breakdown by category
  - [ ] Breakdown by tier
  - [ ] Cross-reference view (categories × tiers)
  - [ ] Quick actions for bulk updates

- [ ] Implement Responsive Design
  - [ ] Mobile-friendly layouts
  - [ ] Touch-friendly interactions

- [ ] Add User Experience Features
  - [x] Confirmation dialogs for deletions
  - [x] Form validation feedback
  - [ ] Success/error notifications
  - [ ] Loading states
  - [ ] Undo/redo functionality
  - [ ] Drag-and-drop tier reordering
  - [ ] Quick guest count adjustments (+/- buttons)

## Phase 6: Testing and Refinement
- [x] Add Error Handling
  - [x] Data validation
  - [x] Error messages
  - [x] Recovery options
  - [ ] Tier conflict resolution

- [x] Testing
  - [x] Unit tests for all components
  - [x] Integration tests for component interactions
  - [x] Test data persistence
  - [x] Test all CRUD operations
  - [x] Test tier management operations
  - [x] Verify guest count calculations
  - [ ] Test CSV import/export
  - [ ] Test events calculations
  - [ ] Test events validation
  - [ ] Test events comparison logic

## Phase 7: Documentation
- [x] Create README
  - [x] Setup instructions
  - [x] Usage guide
  - [ ] CSV format specification
  - [x] Local storage details
  - [x] Testing guide

## Nice-to-Have Features (Future)
- [ ] Dark/Light mode toggle
- [ ] Keyboard shortcuts
- [ ] Data backup warnings
- [ ] Search/filter functionality
- [ ] Sort options for lists
- [ ] Print-friendly views
- [ ] Tier-based color coding
- [ ] Tier capacity limits
- [ ] Tier dependencies (e.g., "If inviting Tier 2, must invite all of Tier 1")
- [ ] Notes field for households
- [ ] Guest count summary view (e.g., "120 out of target 150 guests") 