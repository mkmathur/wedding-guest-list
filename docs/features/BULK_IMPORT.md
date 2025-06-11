# Wedding Guest List App - Bulk Import Feature

## Overview
The bulk import feature will allow users to quickly add multiple households to the guest list by pasting text from their existing notes or documents. The system will make an initial attempt to parse the text, then let users review and adjust the parsed data before adding it to the guest list.

## Integration with Existing App

### Access Point
- [x] Add a "Bulk Import" button to the HouseholdManager component
- [x] Button will be placed next to the existing "Add Household" button
- [x] This keeps the import feature easily discoverable while maintaining the current UI

### UI Flow
1. User clicks "Bulk Import" in HouseholdManager
2. Modal opens with the import interface
3. After successful import:
   - Modal closes
   - User returns to HouseholdManager
   - New households appear in the list
   - New categories appear in the category list

### Error Handling
- [x] If import fails, return to HouseholdManager
- [x] Show error message 

## Design Principles

### 1. Smart but Simple
- [x] Make a best effort to parse the input
- [x] Don't try to be too clever
- [x] Give users control to correct any mistakes
- [x] Use simple, familiar UI patterns

### 2. Progressive Enhancement
- [x] Start with basic text parsing
- [ ] Add more sophisticated parsing later if needed
- [x] Keep the core experience solid
- [x] Make it easy to add new parsing rules

### 3. User Flow
- [x] Clear steps: paste → review → confirm
- [x] Immediate feedback on parsing
- [x] Easy to correct mistakes
- [x] Simple bulk actions

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
- [x] Add bulk import button to HouseholdManager
  - [x] Add button next to "Add Household"
  - [x] Style to match existing buttons
  - [x] Add click handler to open modal
- [x] Create modal component
  - [x] Basic modal structure
  - [x] Close button
  - [x] Backdrop click to close
  - [x] Keyboard (Esc) to close

### Phase 1: Basic Import
- [x] Create ImportForm component
  - [x] Text area for pasting
  - [x] Basic parsing logic
  - [x] Preview button
- [x] Create CategoryDialog component
  - [x] Check categories against existing ones
  - [x] Show which categories are new vs existing
  - [x] Allow selecting which new categories to create
  - [x] Create/Cancel buttons
- [x] Create ReviewForm component
  - [x] Simple table view of households
  - [x] In-place editing of household names and guest counts
  - [x] Category and tier dropdowns (only show existing categories)
  - [x] Save/Cancel buttons
- [x] Implement basic parsing
  - [x] Detect categories (lines with **)
  - [x] Check categories against existing ones
  - [x] Parse household names
  - [x] Basic guest count detection
  - [x] Initial tier assignment

### Phase 2: Review Interface
- [x] Implement table view
  - [x] Display households in a table
  - [x] Allow in-place editing
- [x] Implement data validation
  - [x] Validate household names
  - [x] Validate guest counts
  - [x] Validate categories and tiers
  - [x] Check for duplicate household names
  - [x] Show validation errors immediately
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
  - [x] Show parsing errors
  - [x] Show validation errors
  - [ ] Provide recovery options

## Testing Plan

### Unit Tests
- [x] Test parsing logic
  - [x] Category detection
  - [x] Existing category detection
  - [x] New category detection
  - [x] Household name parsing
  - [x] Guest count detection
- [x] Test validation
  - [x] Household name validation
  - [x] Guest count validation
  - [x] Category and tier validation
  - [x] Duplicate household detection
  - [ ] Conflict prevention
- [x] Test HouseholdManager integration
  - [x] Test bulk import button
  - [x] Test modal open/close
  - [x] Test keyboard navigation

### Component Tests
- [x] Test ImportForm
  - [x] Text area input
  - [x] Preview button
  - [x] Error display
- [x] Test CategoryDialog
  - [x] Display new and existing categories
  - [x] Show which categories are new
  - [x] Category selection
  - [x] Create/Cancel actions
- [x] Test ReviewForm
  - [x] Table display
  - [x] In-place editing
  - [x] Save/Cancel actions
  - [x] Conflict warnings
  - [x] Save button state
- [x] Test modal component
  - [x] Test open/close behavior
  - [x] Test backdrop click
  - [x] Test keyboard events
  - [x] Test focus management

### Integration Tests
- [x] Test full user flow
  - [x] Open modal from HouseholdManager
  - [x] Complete import process
  - [x] Return to HouseholdManager
  - [x] Verify new households appear
  - [x] Verify new categories appear

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

---

## Next Steps

- **Conflict prevention:** Implement logic to check for duplicate household names against existing households, warn the user, and disable saving if conflicts exist.
- **Data management:** Add saving to local storage and show success/error messages after import.
- **Manual testing:** Test the import feature with a variety of input formats and edge cases (see checklist above).
- **UI/UX polish:** Improve error messages, add recovery options, and ensure accessibility and mobile responsiveness.
- **Future:** Add bulk actions and more sophisticated parsing as needed. 