# Product Requirements Document: Bulk Import Feature

## Introduction/Overview

The bulk import feature allows users to quickly add multiple households to their wedding guest list by pasting structured text from existing notes or documents. This feature addresses the common pain point where users have already compiled their guest list in another format (notes, documents, etc.) and need to manually enter each household one by one into the application.

The goal is to reduce the time required to create an initial guest list by enabling batch import of household data while maintaining data quality through a guided review and adjustment process.

## Goals

1. **Reduce Initial Setup Time**: Cut down guest list creation time from hours to minutes for users with existing guest data
2. **Improve User Adoption**: Lower the barrier to entry by making it easier to migrate existing guest lists
3. **Maintain Data Quality**: Ensure imported data follows the application's category and tier structure through guided review
4. **Provide Flexible Input**: Support common text formats that users naturally use when organizing guest lists

## User Stories

1. **As a bride planning my wedding**, I want to paste my existing guest list from my notes app so that I don't have to manually type each family name and guest count.

2. **As a groom with a spreadsheet of guests**, I want to copy and paste sections of my guest list organized by family/friends so that I can quickly populate the app with my existing data.

3. **As a wedding planner managing multiple client lists**, I want to import guest data from various text formats so that I can quickly set up new wedding guest lists without manual data entry.

4. **As a user reviewing imported data**, I want to see and adjust the parsed household information before it's added to my guest list so that I can ensure accuracy and proper categorization.

5. **As a user importing a guest list with new categories**, I want to choose which new categories to add to my application so that I can control my category structure while importing data.

## Functional Requirements

### Core Import Functionality
1. The system must provide a "Bulk Import" button next to the existing "New Household" button
2. The system must open a modal dialog when the bulk import button is clicked
3. The system must provide a large text area for users to paste their guest list data
4. The system must accept structured text input in the following format:
   ```
   Category Name
   Household Name
   Household Name + guest info
   
   Another Category
     Household Name
     Household Name + guest info
   ```

### Text Parsing Requirements
5. The system must identify category names as the first line in each text block (separated by blank lines)
6. The system must parse household names from lines that follow category headers
7. The system must automatically infer guest counts from household text using these patterns:
   - Single names default to 1 guest (e.g., "Alice" = 1 guest)
   - Names with "+1" or "+ 1" add one guest (e.g., "Bob +1" = 2 guests)
   - Listed names count each person (e.g., "Harry, Ron, Hermione" = 3 guests)
   - Explicit numbers are counted (e.g., "Molly, Arthur, 7 kids" = 9 guests)
   - Various formats should be handled flexibly, e.g.
        "Anne + Bob" = 2 guests
        "Carol + husband/baby" = 3 guests
        "Molly, Arthur, seven kids" = 9 guests

### New Categories Review Interface
8. The system must identify categories in the imported text that do not exist in the current application data
9. The system must display a "New Categories Found" step showing all new categories with checkboxes
10. The system must select new categories by default (users can uncheck to reject)
11. The system must show how many households would be affected by each new category
12. The system must provide "Select All" and "Deselect All" options for bulk category selection
13. The system must allow users to proceed to household review after category selection

### Review and Adjustment Interface
14. The system must display parsed data in a review table showing: Household Name, Category, Tier, and Guest Count
15. The system must allow users to edit any field in the review table before importing
16. The system must provide dropdown selections for Category and Tier fields using existing application data plus approved new categories
17. The system must allow users to edit household names and guest counts inline
18. The system must flag households whose categories were rejected in the previous step as "Needs Category Assignment"
19. The system must require category assignment for flagged households before allowing import

### Error Handling and Data Validation
20. The system must flag households that couldn't be parsed clearly with a "Needs Review" indicator and make a best guess
21. The system must detect duplicate households within the imported data and show them in the review step for user decision
22. The system must check for duplicates against existing households in the application and flag them for review
23. The system must provide a summary of parsing results (e.g., "15 households parsed, 3 new categories found, 2 need review, 1 duplicate found")

### Import Completion
24. The system must create approved new categories in the application before importing households
25. The system must provide "Import" and "Cancel" buttons in the modal
26. The system must add approved households to the main guest list when Import is clicked
27. The system must close the modal after successful import
28. The system must display the newly imported households in the main interface
29. The system must save all changes to localStorage automatically

## Non-Goals (Out of Scope)

1. **Advanced Format Support**: Complex spreadsheet formats (CSV, Excel) are not supported in the initial version
2. **Automatic Tier Assignment**: The system will not attempt to guess tier assignments based on keywords or patterns
3. **Household Merging/Splitting**: Users cannot merge or split households during the import review process
4. **Bulk Delete**: Users cannot delete multiple households from the review interface
5. **Import History**: The system will not maintain a history of import operations
6. **File Upload**: Only copy-paste text input is supported, not file upload functionality
7. **Category Matching**: Suggesting similar existing categories is not supported in the initial version

## Design Considerations

### Modal Interface
- Use a full-screen modal on mobile devices and a centered modal on desktop
- Include clear instructions and format examples above the text area
- Use a three-step process: Input → New Categories Review → Household Review → Import
- Allow users to go back to previous steps if needed

### New Categories Review Step
- Show a clear list of new categories with household counts
- Use prominent checkboxes with categories selected by default
- Include "Select All" and "Deselect All" buttons for convenience
- Show a summary of selections before proceeding

### Review Table
- Make the table responsive with horizontal scrolling on mobile if needed
- Use inline editing for better user experience
- Highlight flagged items (duplicates, needs review, needs category) with different color coding
- Show guest count totals at the bottom of the review table
- Clearly indicate households that need category assignment

### Visual Feedback
- Use warning icons for items that need review
- Use different background colors for duplicates and category assignment needs
- Show a summary card with parsing results including new categories
- Provide clear success feedback after import completion

## Technical Considerations

### Integration Points
- Should integrate with existing Category and Tier management system
- Must work with current localStorage data structure
- Should trigger the same validation as manual household creation
- Must update the main household list display after import
- Must create new categories using the same logic as manual category creation

### Parsing Logic
- Implement flexible text parsing that handles variations in spacing and formatting
- Consider case-insensitive category and household name matching for duplicate detection
- Compare parsed categories against existing categories to identify new ones

### Performance
- We can assume that import sizes are reasonable (< 100 households)
- Ensure parsing doesn't block the UI for reasonable data sizes
- Handle category creation efficiently when processing multiple new categories
