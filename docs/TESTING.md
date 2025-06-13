# Testing Documentation

This document outlines the testing strategy for the Wedding Guest List application.

## Testing Process

### Manual Testing Workflow
1. Follow the checklist items in order, focusing on one component at a time

2. For each checklist item:
   - Test the specific functionality
   - Report any bugs found
   - For each bug:
     a. Add/update unit tests to catch the bug
     b. Run tests to confirm they fail (showing they catch the bug)
     c. Fix the code
     d. Run tests again to verify the fix
     e. Manually verify the fix
   - Mark the item as complete once verified
   - Document any UX improvements or feature requests identified

3. Track status in this document:
   - Check off completed items
   - Document bugs in "Known Issues" until fixed
   - Add UX improvements to "Future Improvements"

## Automated Tests

The application uses Vitest and React Testing Library for automated testing. Run the test suite with:

```bash
npm test -- --run
```

Testing Strategy:
For now, tests focus on user-visible behavior via UI integration tests.
As the app grows, extract and test logic separately when it becomes complex or reused across features.

## Manual Testing Checklist

### Category Management
- [x] Add a new category:
  * Add category with a unique name
  * Verify it appears in the category list
  * Verify it appears as an option in household form

- [x] Edit a category:
  * Change category name
  * Verify change reflects in household list
  * Verify change reflects in household form options

- [x] Delete a category:
  * Delete a category with no households
  * Try to delete a category with households
  * Verify proper warning/error messages

- [x] Form Validation:
  * Try submitting without a name
  * Try submitting with a duplicate name
  * Verify error messages are clear and visible

### Tier Management
- [x] Add a new tier:
  * Add tier with name and order
  * Verify it appears in tier list
  * Verify it appears as an option in household form

- [ ] Edit a tier:
  * [x] Change tier name (basic functionality)
  * [x] Change tier order
  * [ ] Form validation for editing
    * [x] Empty name
    * [x] Duplicate name
  * [x] Verify changes reflect in household list
  * [x] Verify changes reflect in household form

- [x] Delete a tier:
  * Delete a tier with no households
  * Try to delete a tier with households
  * Verify proper warning/error messages

- [x] Form Validation:
  * Try submitting without a name
  * Try submitting with a duplicate name
  * ~~Try submitting with invalid order~~ (Removed - using array position)
  * Verify error messages are clear and visible

### Household Management
- [x] Add a new household:
  * Fill out all fields (name, guest count, category, tier)
  * Verify it appears in the correct category group
  * Verify total guest count updates
  * Verify tier label is displayed correctly

- [x] Edit a household:
  * Click edit button
  * Verify form is populated with correct data
  * Change each field and save
  * Verify changes are reflected in the list
  * Verify total guest count updates correctly

- [x] Delete a household:
  * Click delete button
  * Verify confirmation dialog appears
  * Confirm deletion
  * Verify household is removed
  * Check that total guest count updates

- [x] Form Validation:
  * Try submitting without a name
  * Try submitting with a duplicate name
  * Try setting guest count to 0 or negative
  * Try setting guest count to non-numeric value
  * Test cancel button during edit mode

### Data Persistence
- [x] Refresh the page:
  * Add/edit some data
  * Refresh the page
  * Verify all changes persist
  * Check total guest count remains accurate

### Cross-Component Interaction
- [x] Category-Household Relationship:
  * Create a new category
  * Add households to it
  * Edit the category
  * Delete the category
  * Verify proper handling of relationships

- [x] Tier-Household Relationship:
  * Create a new tier
  * Add households to it
  * Edit the tier
  * Delete the tier
  * Verify proper handling of relationships

### Event Management
- [x] Create a new event:
  * Enter event name
  * Select tiers for each category
  * Verify guest count updates
  * Save event
  * Verify it appears in event list

- [x] Edit an event:
  * Click edit button
  * Verify form is populated
  * Change event name
  * Modify tier selections
  * Save changes
  * Verify updates in list

- [x] Delete an event:
  * Click delete button
  * Verify confirmation dialog
  * Confirm deletion
  * Verify event is removed

- [x] Form Validation:
  * Try submitting without a name
  * Try submitting without any tier selections
  * Verify error messages are clear
  * Test cancel button

- [x] Guest Count Calculations:
  * Select different tier combinations
  * Verify per-category counts
  * Verify total count
  * Check counts update in real-time

- [x] Data Persistence:
  * Create/edit events
  * Refresh page
  * Verify all changes persist
  * Check guest counts remain accurate

- [x] Edge Cases:
  * Create event with all tiers selected
  * Create event with minimal selections
  * Test with many categories/tiers
  * Verify performance with large guest counts