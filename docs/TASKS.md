# Wedding Guest List App - Development Tasks

## Phase 1: Project Setup and Basic Structure
- [ ] Initialize React + TypeScript project using Vite
- [ ] Set up Tailwind CSS
- [ ] Create basic project structure
- [ ] Set up local storage utilities
- [ ] Define TypeScript interfaces for data models
  - [ ] Tier interface
  - [ ] Category interface
  - [ ] Household interface (with guest count)

## Phase 2: Core Features - Data Management
- [ ] Implement Tier Management
  - [ ] Create/edit/delete tiers
  - [ ] Set tier names (e.g., "Must Invite", "Want to Invite", "If Space Permits")
  - [ ] Set tier order/priority
  - [ ] Local storage persistence for tiers

- [ ] Implement Category Management
  - [ ] Create/edit/delete categories
  - [ ] Category list view
  - [ ] Local storage persistence for categories

- [ ] Implement Household Management
  - [ ] Add/edit/delete households
  - [ ] Set household name
  - [ ] Set guest count per household
  - [ ] Assign category to household
  - [ ] Assign tier to household
  - [ ] Local storage persistence for households
  - [ ] Bulk edit capabilities for quick updates

## Phase 3: Scenario Planning Features
- [ ] Create Scenario Builder Interface
  - [ ] UI for selecting categories and tiers
  - [ ] Support multiple tier combinations
  - [ ] Real-time total guest count calculations
  - [ ] Save/load scenarios
  - [ ] Display detailed breakdown by category and tier
  - [ ] Show number of households and total guests per category/tier

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
  - [ ] Total guest count
  - [ ] Total household count
  - [ ] Breakdown by category
  - [ ] Breakdown by tier
  - [ ] Cross-reference view (categories × tiers)
  - [ ] Quick actions for bulk updates

- [ ] Implement Responsive Design
  - [ ] Mobile-friendly layouts
  - [ ] Touch-friendly interactions

- [ ] Add User Experience Features
  - [ ] Confirmation dialogs for deletions
  - [ ] Success/error notifications
  - [ ] Loading states
  - [ ] Undo/redo functionality
  - [ ] Drag-and-drop tier reordering
  - [ ] Quick guest count adjustments (+/- buttons)

## Phase 6: Testing and Refinement
- [ ] Add Error Handling
  - [ ] Data validation
  - [ ] Error messages
  - [ ] Recovery options
  - [ ] Tier conflict resolution

- [ ] Testing
  - [ ] Test data persistence
  - [ ] Test CSV import/export
  - [ ] Test all CRUD operations
  - [ ] Test scenarios calculations
  - [ ] Test tier management operations
  - [ ] Verify guest count calculations

## Phase 7: Documentation
- [ ] Create README
  - [ ] Setup instructions
  - [ ] Usage guide
  - [ ] CSV format specification
  - [ ] Local storage details
  - [ ] Tier management guide

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