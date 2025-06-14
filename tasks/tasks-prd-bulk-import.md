# Tasks: Bulk Import Feature

## Relevant Files

- `src/components/BulkImportModal/BulkImportModal.tsx` - Main modal component for the bulk import feature
- `src/components/BulkImportModal/BulkImportModal.test.tsx` - Unit tests for the bulk import modal (includes business logic testing)
- `src/components/BulkImportModal/BulkImportModal.module.css` - Styles for the bulk import modal
- `src/components/BulkImportModal/TextInputStep.tsx` - Component for the text input step of the import process
- `src/components/BulkImportModal/TextInputStep.test.tsx` - Unit tests for the text input step
- `src/components/BulkImportModal/CategoryReviewStep.tsx` - Component for reviewing and selecting new categories
- `src/components/BulkImportModal/CategoryReviewStep.test.tsx` - Unit tests for the category review step
- `src/components/BulkImportModal/HouseholdReviewStep.tsx` - Component for reviewing and editing parsed households
- `src/components/BulkImportModal/HouseholdReviewStep.test.tsx` - Unit tests for the household review step
- `src/utils/textParser.ts` - Utility functions for parsing imported text and inferring guest counts
- `src/utils/textParser.test.ts` - Unit tests for text parsing functions
- `src/utils/duplicateDetection.ts` - Utility functions for detecting duplicate households within import data and against existing data
- `src/utils/duplicateDetection.test.ts` - Unit tests for duplicate detection
- `src/components/HouseholdManager.tsx` - Needs modification to add the bulk import button
- `src/types/bulkImport.ts` - Type definitions for bulk import data structures

### Notes

- Unit tests should typically be placed alongside the code files they are testing (e.g., `BulkImportModal.tsx` and `BulkImportModal.test.tsx` in the same directory).
- Use `npx jest [optional/path/to/test/file]` to run tests. Running without a path executes all tests found by the Jest configuration.
- Follow the existing testing patterns: mock storage utilities using `vi.mock()` like in `App.test.tsx`.
- Focus on behavior-focused testing - test user interactions (typing, clicking, selecting) rather than implementation details.
- Add tests iteratively as components are built, not all at the end.
- Test complex business logic (parsing) with comprehensive unit tests, user flows with integration tests.
- The modal should integrate with existing hooks (`useCategories`, `useHouseholds`, `useTiers`) rather than creating a custom state management hook.
- Follow the existing CSS modules pattern for styling components.
- MVP focus: handle the common case well, let users manually fix edge cases in the review step.
- Desktop-only for MVP - mobile support can be added later.

### Developer Guidance

- **Step Communication**: The three steps (TextInput → CategoryReview → HouseholdReview) should share data through React state in the main BulkImportModal component. Pass data down as props and use callbacks to update parent state.
- **Error Handling**: For MVP, show simple error messages to users when things go wrong (parsing fails, import fails). Don't worry about complex error recovery - users can cancel and try again.
- **Modal Styling**: Make the modal large enough to be usable (maybe 80% of screen width/height) with a clean, simple design. Look at existing modal patterns in the codebase for inspiration.

## Tasks

- [ ] 1.0 Create Types and Modal Structure
  - [x] 1.1 Create type definitions in `src/types/bulkImport.ts`: ParsedHousehold (name, category, guestCount, isDuplicate), NewCategory (name, selected), ImportStep enum
  - [x] 1.2 Create base BulkImportModal component with React state to manage current step and shared data between steps
  - [x] 1.3 Test BulkImportModal component: modal open/close, step navigation, state management
  - [x] 1.4 Add "Bulk Import" button to HouseholdManager component next to "New Household" button
  - [x] 1.5 Test HouseholdManager integration: button appears, clicking opens modal
  - [ ] 1.6 Create TextInputStep component with large text area and format instructions (show expected format: category names on their own line, followed by household names indented or not, with guest info patterns like +1, &, commas, explicit numbers/words; see PRD for details)
  - [x] 1.8 Style the modal components using CSS modules (make modal appropriately sized, clean layout, but don't overthink the design)

- [x] 2.0 Implement Text Parsing Engine
  - [x] 2.1 Define textParser interfaces in `src/utils/textParser.ts`. Create these TypeScript interfaces: 
    ```typescript
    interface ParsedHousehold {
      name: string;
      guestCount: number;
    }
    
    interface ParsedCategory {  
      categoryName: string;
      households: ParsedHousehold[];
    }
    
    interface ParseResult {
      categories: ParsedCategory[];
    }
    ```
    And the main parsing function: `function parseImportText(text: string): ParseResult`
  - [x] 2.2 Implement basic text parsing: split text into category blocks (separated by blank lines), extract category names from first line of each block, parse household lines that follow. MVP scope: handle simple category headers and basic household name patterns, don't worry about complex edge cases
  - [x] 2.3 Implement guest count inference for common patterns: single names default to 1, "+1", "+2" patterns, "+" and "and" for couples, comma-separated names, simple number words like "Mom, Dad, 2 kids". Return reasonable defaults for unclear cases rather than failing
  - [x] 2.4 Create comprehensive tests for textParser: test category detection, household parsing, guest count inference. Test edge cases like empty categories, malformed input, but focus on common success cases

- [ ] 3.0 Build New Categories Review Interface
  - [ ] 3.1 Create CategoryReviewStep component with checkbox list of new categories
  - [ ] 3.2 Implement logic to identify categories not in existing application data
  - [ ] 3.3 Test category identification: mock existing categories, verify new category detection
  - [ ] 3.4 Show categories as selected by default
  - [ ] 3.5 Test default selection: categories checked by default, can be unchecked
  - [ ] 3.6 Create navigation to proceed to household review step (Next button or similar - your choice on UX)

- [ ] 4.0 Develop Household Review and Editing Interface
  - [ ] 4.1 Create HouseholdReviewStep component with basic data table
  - [ ] 4.2 Test household table display: render HouseholdReviewStep with sample household data, verify table shows household name, category, tier, guest count columns
  - [ ] 4.3 Implement inline editing for household name and guest count
  - [ ] 4.4 Create dropdown selections for category and tier using existing + approved new categories
  - [ ] 4.5 Test dropdown functionality: mock storage.getCategories and storage.getTiers, render HouseholdReviewStep, click category dropdown, verify shows existing + new categories as options
  - [ ] 4.6 Implement basic duplicate detection that shows simple text warnings for duplicate household names (display warnings however makes sense - in table, below table, etc.)
  - [ ] 4.7 Test duplicate warnings: mock storage.getHouseholds with existing households, render HouseholdReviewStep with duplicate household names, verify warning text appears (e.g., "Warning: Smith Family already exists")

- [ ] 5.0 Add Bulk Import Methods and Implement Import Logic
  - [ ] 5.1 Add `addCategoriesBulk(categoryNames: string[])` method to useCategories hook
  - [ ] 5.2 Add `addHouseholdsBulk(households: Omit<Household, 'id'>[])` method to useHouseholds hook
  - [ ] 5.3 Implement import logic: when user clicks Import, create categories first, then households, then close modal (handle any errors that occur by showing simple error messages)
  - [ ] 5.4 Test complete import flow: mock storage, render BulkImportModal, paste text, select categories, edit households, click Import, verify new categories and households appear in main UI and modal closes 