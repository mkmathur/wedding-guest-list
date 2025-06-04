# Testing Documentation

This document outlines the testing strategy for the Wedding Guest List application.

## Automated Tests

The application uses Vitest and React Testing Library for automated testing. Run the test suite with:

```bash
npm test
```

## Manual Testing Checklist

### Household Management
- [ ] Add a new household:
  * Fill out all fields (name, guest count, category, tier)
  * Verify it appears in the correct category group
  * Verify total guest count updates
  * Verify tier label is displayed correctly

- [ ] Edit a household:
  * Click edit button
  * Verify form is populated with correct data
  * Change each field and save
  * Verify changes are reflected in the list
  * Verify total guest count updates correctly

- [ ] Delete a household:
  * Click delete button
  * Verify confirmation dialog appears
  * Confirm deletion
  * Verify household is removed
  * Check that total guest count updates

- [ ] Form Validation:
  * Try submitting without a name
  * Try submitting with a duplicate name
  * Try setting guest count to 0 or negative
  * Try setting guest count to non-numeric value
  * Test cancel button during edit mode

### Category Management
- [ ] Add a new category:
  * Add category with a unique name
  * Verify it appears in the category list
  * Verify it appears as an option in household form

- [ ] Edit a category:
  * Change category name
  * Verify change reflects in household list
  * Verify change reflects in household form options

- [ ] Delete a category:
  * Delete a category with no households
  * Try to delete a category with households
  * Verify proper warning/error messages

### Tier Management
- [ ] Add a new tier:
  * Add tier with name and order
  * Verify it appears in tier list
  * Verify it appears as an option in household form

- [ ] Edit a tier:
  * Change tier name
  * Change tier order
  * Verify changes reflect in household list
  * Verify changes reflect in household form

- [ ] Delete a tier:
  * Delete a tier with no households
  * Try to delete a tier with households
  * Verify proper warning/error messages

### Data Persistence
- [ ] Refresh the page:
  * Add/edit some data
  * Refresh the page
  * Verify all changes persist
  * Check total guest count remains accurate

### UI/UX
- [ ] Responsive layout:
  * Test on different screen sizes
  * Verify forms are usable on mobile
  * Check that lists are scrollable when needed

- [ ] Quick Actions Bar:
  * Verify total guest count updates in real-time
  * Test "New Household" button
  * Test "Export" button (if implemented)

### Edge Cases
- [ ] Special Characters:
  * Try adding households/categories/tiers with special characters
  * Try using emojis in names
  * Try using very long names

- [ ] Large Numbers:
  * Add many households (20+)
  * Test with large guest counts
  * Verify performance remains good

### Cross-Component Interaction
- [ ] Category-Household Relationship:
  * Create a new category
  * Add households to it
  * Edit the category
  * Delete the category
  * Verify proper handling of relationships

- [ ] Tier-Household Relationship:
  * Create a new tier
  * Add households to it
  * Edit the tier
  * Delete the tier
  * Verify proper handling of relationships

## Bug Reporting

When reporting bugs, please include:
1. Steps to reproduce
2. Expected behavior
3. Actual behavior
4. Screenshots (if applicable)
5. Browser and OS information

## Test Environment Setup

The application should be tested in the following environments:
- Latest versions of Chrome, Firefox, and Safari
- Mobile devices (iOS and Android)
- Different screen sizes (desktop, tablet, mobile)

## Known Issues

(This section will be updated as issues are discovered and resolved) 