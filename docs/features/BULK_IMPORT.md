# Wedding Guest List App - Bulk Import Feature

## Overview
The bulk import feature will allow users to quickly add multiple households to the guest list by pasting text from their existing notes or documents. The system will make an initial attempt to parse the text, then let users review and adjust the parsed data before adding it to the guest list.

## Integration with Existing App

### Access Point
- Add a "Bulk Import" button to the HouseholdManager component
- Button will be placed next to the existing "Add Household" button
- This keeps the import feature easily discoverable while maintaining the current UI

### UI Flow
1. User clicks "Bulk Import" in HouseholdManager
2. Modal opens with the import interface
3. After successful import:
   - Modal closes
   - User returns to HouseholdManager
   - New households appear in the list
   - New categories appear in the category list

### Error Handling
- If import fails, return to HouseholdManager
- Show error message 

## Design Principles

### 1. Smart but Simple
- Make a best effort to parse the input
- Don't try to be too clever
- Give users control to correct any mistakes
- Use simple, familiar UI patterns

### 2. Progressive Enhancement
- Start with basic text parsing
- Add more sophisticated parsing later if needed
- Keep the core experience solid
- Make it easy to add new parsing rules

### 3. User Flow
- Clear steps: paste → review → confirm
- Immediate feedback on parsing
- Easy to correct mistakes
- Simple bulk actions

## UI Design

### 1. Import Interface
```
+------------------------------------------+
|  Paste your guest list below:            |
|  +------------------------------------+  |
|  |                                    |  |
|  |  **Family**                        |  |
|  |  John Smith + 1                    |  |
|  |  Jane Doe, John Doe, 2 kids        |  |
|  |  Smith Family (4)                  |  |
|  |                                    |  |
|  |  **Friends**                       |  |
|  |  Alice Brown                       |  |
|  |  Bob Wilson +1                     |  |
|  |                                    |  |
|  +------------------------------------+  |
|  [Preview Import]                       |
+------------------------------------------+

+------------------------------------------+
|  Categories Detected                     |
|  +------------------------------------+  |
|  | Found the following categories:    |  |
|  |                                    |  |
|  | [x] Family (already exists)        |  |
|  | [x] Friends (new)                  |  |
|  |                                    |  |
|  | Create the new categories?         |  |
|  |                                    |  |
|  | [Create Selected Categories]       |  |
|  | [Cancel]                           |  |
|  +------------------------------------+  |
+------------------------------------------+
```

### 2. Review Interface
```
+------------------------------------------+
|  Review and Edit Households              |
|  +------------------------------------+  |
|  | Household Name    Category    Tier    Guest Count    |
|  | John Smith       [Family ▼]   [T1 ▼]  [1]           |
|  | Jane Doe,        [Family ▼]   [T2 ▼]  [4]           |
|  | John Doe                                         |
|  | Alice Brown      [Friends ▼]  [T1 ▼]  [1]           |
|  | Bob Wilson       [Friends ▼]  [T1 ▼]  [1]           |
|  |                                    |  |
|  | [Save All] [Cancel]                 |  |
|  +------------------------------------+  |
+------------------------------------------+
```

### 3. Bulk Actions
*Note: Bulk actions will be added in a future enhancement*

## Implementation Tasks

### Phase 0: Access Point
- [ ] Add bulk import button to HouseholdManager
  - [ ] Add button next to "Add Household"
  - [ ] Style to match existing buttons
  - [ ] Add click handler to open modal
- [ ] Create modal component
  - [ ] Basic modal structure
  - [ ] Close button
  - [ ] Backdrop click to close
  - [ ] Keyboard (Esc) to close

### Phase 1: Basic Import
- [ ] Create ImportForm component
  - [ ] Text area for pasting
  - [ ] Basic parsing logic
  - [ ] Preview button
- [ ] Create CategoryDialog component
  - [ ] Check categories against existing ones
  - [ ] Show which categories are new vs existing
  - [ ] Allow selecting which new categories to create
  - [ ] Create/Cancel buttons
- [ ] Create ReviewForm component
  - [ ] Simple table view of households
  - [ ] In-place editing of household names and guest counts
  - [ ] Category and tier dropdowns (only show existing categories)
  - [ ] Save/Cancel buttons
- [ ] Implement basic parsing
  - [ ] Detect categories (lines with **)
  - [ ] Check categories against existing ones
  - [ ] Parse household names
  - [ ] Basic guest count detection
  - [ ] Initial tier assignment

### Phase 2: Review Interface
- [ ] Implement table view
  - [ ] Display households in a table
  - [ ] Allow in-place editing
- [ ] Implement data validation
  - [ ] Validate household names
  - [ ] Validate guest counts
  - [ ] Validate categories and tiers
  - [ ] Check for duplicate household names
  - [ ] Show validation errors immediately
- [ ] Implement conflict prevention
  - [ ] Check household names against existing households
  - [ ] Show warning for potential duplicates
  - [ ] Allow editing to resolve conflicts
  - [ ] Disable save button if conflicts exist

### Phase 3: Data Management
- [ ] Implement save functionality
  - [ ] Save to local storage
  - [ ] Show success/error messages
- [ ] Add error handling
  - [ ] Show parsing errors
  - [ ] Show validation errors
  - [ ] Provide recovery options

## Testing Plan

### Unit Tests
- [ ] Test parsing logic
  - [ ] Category detection
  - [ ] Existing category detection
  - [ ] New category detection
  - [ ] Household name parsing
  - [ ] Guest count detection
- [ ] Test validation
  - [ ] Household name validation
  - [ ] Guest count validation
  - [ ] Category and tier validation
  - [ ] Duplicate household detection
  - [ ] Conflict prevention
- [ ] Test HouseholdManager integration
  - [ ] Test bulk import button
  - [ ] Test modal open/close
  - [ ] Test keyboard navigation

### Component Tests
- [ ] Test ImportForm
  - [ ] Text area input
  - [ ] Preview button
  - [ ] Error display
- [ ] Test CategoryDialog
  - [ ] Display new and existing categories
  - [ ] Show which categories are new
  - [ ] Category selection
  - [ ] Create/Cancel actions
- [ ] Test ReviewForm
  - [ ] Table display
  - [ ] In-place editing
  - [ ] Save/Cancel actions
  - [ ] Conflict warnings
  - [ ] Save button state
- [ ] Test modal component
  - [ ] Test open/close behavior
  - [ ] Test backdrop click
  - [ ] Test keyboard events
  - [ ] Test focus management

### Integration Tests
- [ ] Test full user flow
  - [ ] Open modal from HouseholdManager
  - [ ] Complete import process
  - [ ] Return to HouseholdManager
  - [ ] Verify new households appear
  - [ ] Verify new categories appear

### Manual Testing
- [ ] Test with various input formats
  - [ ] Different category formats
  - [ ] Mix of new and existing categories
  - [ ] Categories with similar names
  - [ ] Different household name formats
  - [ ] Different guest count formats
- [ ] Test edge cases
  - [ ] Empty input
  - [ ] Invalid input
  - [ ] Very large input
  - [ ] Duplicate household names
  - [ ] Similar household names
- [ ] Test user experience
  - [ ] Input feedback
  - [ ] Error messages
  - [ ] Recovery options
  - [ ] Mobile responsiveness
- [ ] Test UI integration
  - [ ] Button placement and styling
  - [ ] Modal behavior
  - [ ] Keyboard navigation
  - [ ] Screen reader accessibility

## Future Enhancements
- [ ] Bulk actions
  - [ ] Select multiple households
  - [ ] Bulk category assignment
  - [ ] Bulk tier assignment
- [ ] More sophisticated parsing
  - [ ] Support more input formats
  - [ ] Custom parsing rules
- [ ] UI improvements
  - [ ] Keyboard shortcuts
  - [ ] Progress indicators 