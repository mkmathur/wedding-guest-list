# Wedding Guest List App - Development Phases

## Phase 1: Project Setup & Category Management
**Features:**
- Basic React app setup with TypeScript and Tailwind
- Create, edit, and delete categories
- List view of all categories
- Local storage persistence for categories

**Automated Testing:**
```typescript
// Unit Tests
- Test category validation functions
- Test localStorage save/load for categories

// Component Tests
- Test CategoryForm submission
- Test CategoryList rendering
- Test category deletion confirmation
```

**Manual Testing:**
1. Create several categories (e.g., "My Family", "Partner's Family", "Friends")
2. Edit a category name
3. Delete a category
4. Refresh page - verify categories persist
5. Verify mobile responsiveness

**Expected Outcomes:**
- Categories save correctly to localStorage
- UI is responsive and intuitive
- All CRUD operations work for categories

## Phase 2: Household Management
**Features:**
- Add/edit/delete households
- Set guest count per household
- Assign category to household
- List view of households grouped by category
- Running total of guests

**Automated Testing:**
```typescript
// Unit Tests
- Test guest count calculations
- Test household validation
- Test household data persistence

// Component Tests
- Test HouseholdForm submission
- Test guest count updates
- Test category assignment
```

**Manual Testing:**
1. Add households with different guest counts
2. Edit guest count for a household
3. Move household between categories
4. Delete household
5. Verify totals update correctly
6. Check persistence after refresh
7. Test invalid inputs (negative guests, empty names)

**Expected Outcomes:**
- Accurate guest count totals
- Proper categorization of households
- Data persists correctly
- Form validation works

## Phase 3: Tier Management
**Features:**
- Create, edit, and delete tiers
- Assign tiers to households
- Update household list view to show tiers
- Filter households by tier

**Automated Testing:**
```typescript
// Unit Tests
- Test tier ordering logic
- Test tier assignment validation

// Component Tests
- Test tier selection in forms
- Test tier filtering functionality
```

**Manual Testing:**
1. Create multiple tiers
2. Assign tiers to existing households
3. Filter households by tier
4. Edit tier names
5. Delete tier - verify households update
6. Check tier persistence

**Expected Outcomes:**
- Tiers integrate with existing households
- Filtering works correctly
- Tier changes reflect immediately in views
- Data consistency maintained

## Phase 4: Scenario Planning
**Features:**
- Create and save scenarios
- Select categories and tiers for scenarios
- View guest count for scenarios
- Compare multiple scenarios

**Automated Testing:**
```typescript
// Unit Tests
- Test scenario guest count calculations
- Test scenario validation
- Test scenario comparison logic

// Component Tests
- Test scenario builder interface
- Test scenario saving/loading
```

**Manual Testing:**
1. Create scenario with specific categories
2. Create scenario with specific tiers
3. Create scenario with both categories and tiers
4. Verify guest counts are accurate
5. Save and reload scenarios
6. Delete scenarios
7. Test edge cases (empty selections)

**Expected Outcomes:**
- Accurate guest counts per scenario
- Scenarios save and load correctly
- Clear comparison between scenarios
- Proper handling of edge cases

## Phase 5: CSV Export/Import
**Features:**
- Export complete guest list to CSV
- Export specific scenarios to CSV
- Basic data validation

**Manual Testing:**
1. Export full guest list
2. Export specific scenario
3. Verify CSV format is correct
4. Open exported file in spreadsheet software
5. Verify all data is included
6. Test with various data sizes

**Expected Outcomes:**
- CSV files open correctly in Excel/Google Sheets
- All relevant data included in export
- Proper formatting of guest counts and categories
- Clear column headers

## Phase 6: UI Polish & Optimization
**Features:**
- Improved navigation
- Bulk actions for households
- Search/filter capabilities
- Loading states
- Error handling

**Manual Testing:**
1. Test navigation flow
2. Perform bulk category/tier changes
3. Search for specific households
4. Test filter combinations
5. Verify error messages
6. Check performance with large lists
7. Test on different devices/browsers

**Expected Outcomes:**
- Smooth user experience
- Fast performance
- Clear error messages
- Intuitive navigation
- Works well on all devices

## Testing Notes

### Automated Testing Approach
1. **Unit Tests (Vitest)**
   - Focus on business logic
   - Data calculations
   - Validation functions
   - Utility functions
   - LocalStorage operations

2. **Component Tests (React Testing Library)**
   - Basic component rendering
   - User interactions
   - Form submissions
   - Error states
   - Loading states

3. **Test Coverage Goals**
   - 80%+ coverage for utility functions
   - 70%+ coverage for components
   - Focus on critical paths

4. **Test Organization**
   ```
   src/
     __tests__/
       utils/         # Utility function tests
       components/    # Component tests
       hooks/         # Custom hook tests
   ```

5. **Continuous Integration**
   - Run tests before commits
   - Maintain test coverage thresholds

### What Not to Test
- Third-party library functionality
- Implementation details
- Purely visual components
- Browser-specific features

### Testing Tools
- Vitest for unit testing
- React Testing Library for component testing
- MSW for mocking API calls (if needed)
- Testing Library User Event for interaction testing

### General Testing Approach
- Test on both desktop and mobile devices
- Test with both mouse and keyboard navigation
- Verify all data persistence
- Check error handling
- Validate accessibility

### Test Data Suggestions
- Create at least 3 categories
- Add 5-10 households per category
- Use various guest counts (1-8)
- Create 2-3 tiers
- Make multiple scenarios

### Edge Cases to Test
- Very long household names
- Large guest counts
- Empty categories
- No tiers assigned
- Multiple browser tabs open
- Low storage conditions
- Slow network conditions

### Performance Testing
- Test with 100+ households
- Rapid category/tier switching
- Multiple scenario calculations
- Quick successive updates

### Browser Compatibility
Test on:
- Chrome
- Safari
- Firefox
- Mobile browsers

### Error Scenarios
- Invalid data in localStorage
- Network failures during CSV export
- Invalid user inputs
- Duplicate names
- Concurrent edits 

## Testing Strategy

### Automated Testing Approach
1. **Unit Tests (Vitest)**
   - Focus on business logic
   - Data calculations
   - Validation functions
   - Utility functions
   - LocalStorage operations

2. **Component Tests (React Testing Library)**
   - Basic component rendering
   - User interactions
   - Form submissions
   - Error states
   - Loading states

3. **Test Coverage Goals**
   - 80%+ coverage for utility functions
   - 70%+ coverage for components
   - Focus on critical paths

4. **Test Organization**
   ```
   src/
     __tests__/
       utils/         # Utility function tests
       components/    # Component tests
       hooks/         # Custom hook tests
   ```

5. **Continuous Integration**
   - Run tests before commits
   - Maintain test coverage thresholds

### What Not to Test
- Third-party library functionality
- Implementation details
- Purely visual components
- Browser-specific features

### Testing Tools
- Vitest for unit testing
- React Testing Library for component testing
- MSW for mocking API calls (if needed)
- Testing Library User Event for interaction testing

### General Testing Approach
- Test on both desktop and mobile devices
- Test with both mouse and keyboard navigation
- Verify all data persistence
- Check error handling
- Validate accessibility

### Test Data Suggestions
- Create at least 3 categories
- Add 5-10 households per category
- Use various guest counts (1-8)
- Create 2-3 tiers
- Make multiple scenarios

### Edge Cases to Test
- Very long household names
- Large guest counts
- Empty categories
- No tiers assigned
- Multiple browser tabs open
- Low storage conditions
- Slow network conditions

### Performance Testing
- Test with 100+ households
- Rapid category/tier switching
- Multiple scenario calculations
- Quick successive updates

### Browser Compatibility
Test on:
- Chrome
- Safari
- Firefox
- Mobile browsers

### Error Scenarios
- Invalid data in localStorage
- Network failures during CSV export
- Invalid user inputs
- Duplicate names
- Concurrent edits 