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

## Phase 2: Core Features - Data Management
- [x] Implement Tier Management
  - [x] Create/edit/delete tiers
  - [x] Set tier names (e.g., "Must Invite", "Want to Invite", "If Space Permits")
  - [x] Set tier order/priority
  - [x] Local storage persistence
  - [x] Write tests for tier management
  - [x] Fix tier editing UX issues
  - [x] Complete manual testing of tier features
    - [x] Form validation
    - [x] Household integration
    - [x] Delete functionality

- [x] Implement Household Management
  - [x] Add/edit/delete households
  - [x] Set household name
  - [x] Set guest count per household
  - [x] Assign category to household
  - [x] Assign tier to household
  - [x] Local storage persistence for households
  - [x] Write tests for household management
  - [x] Complete manual testing of household features

## Phase 3: Event Planning Features
- [x] Create Event Builder Interface
  - [x] Create Event interface
    - [x] Define event name
    - [x] Define category-tier selections structure
    - [x] Define guest count calculations
  - [x] Create EventManager component
    - [x] Basic layout structure
    - [x] Event list view
    - [x] New event button
  - [x] Create EventForm component
    - [x] Event name input
    - [x] Category-tier selection checkboxes
    - [x] Guest count display
    - [x] Save/Cancel buttons
  - [x] Implement event storage
    - [x] Add event CRUD operations to storage utils
    - [x] Add event validation
    - [x] Add event persistence
  - [x] Add event calculations
    - [x] Calculate per-category guest counts
    - [x] Calculate total guest count
    - [x] Update counts in real-time
  - [x] Implement form validation
    - [x] Required event name
    - [x] At least one tier selected
    - [x] Clear error messages
  - [x] Add event list functionality
    - [x] Display saved events
    - [x] Show guest counts
    - [x] Add delete functionality
  - [x] Write tests
    - [x] Unit tests for Event interface
    - [x] Unit tests for storage operations
    - [x] Component tests for EventManager
    - [x] Component tests for EventForm
    - [x] Integration tests for calculations
  - [ ] Complete manual testing of event features

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
  - [x] Empty state messaging with helpful guidance
    - [x] Categories: Guide new users to create organization categories
    - [x] Tiers: Explain invitation priority system 
    - [x] Events: Explain event-based guest list filtering
    - [x] Households: Guide through prerequisite setup and first guest addition
    - [x] Consistent styling with muted italic text
  - [ ] Success/error notifications (toast notifications)
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
  - [x] Test events calculations
  - [x] Test events validation

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