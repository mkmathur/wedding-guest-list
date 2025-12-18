# Wedding Guest List App - Technical Design

## Overview
A simple, client-side web application for managing a wedding guest list. The app allows users to organize guests by categories and tiers, create guest lists for wedding events, and export data to CSV format.

## Tech Stack

### Frontend
- **React 18 with TypeScript**
  - Using built-in hooks and context for state management
  - Type safety for better development experience
  - No external state management libraries needed

- **Vite**
  - Modern, fast build tool
  - Quick development experience

- **Tailwind CSS**
  - Utility-first CSS framework
  - Responsive design out of the box

## Data Architecture

### Storage Strategy
- **Local Storage**
  - All data stored in browser's localStorage
  - No backend required
  - Automatic saving of changes
  - Data persists between sessions

- **CSV Import/Export**
  - Backup and restore functionality
  - Easy editing in spreadsheet software
  - Data portability

### Data Model

1. **Tiers**
   - Represents priority levels for guests
   - Properties: name, order
   - **Naming Convention**: Uses numbered tiers (T1, T2, T3, etc.)
   - **Design Decision**: Moved from descriptive names to numbered tiers to avoid imposing specific semantics on users. Users can mentally assign their own meaning (e.g., T1 = "Must Have", T2 = "Should Invite", T3 = "Nice to Have") while keeping the interface simple and flexible
   - Example: "T1", "T2", "T3"

2. **Categories**
   - Groups of guests (e.g., family, friends)
   - Properties: name
   - Example: "My Family", "Partner's Family", "College Friends"

3. **Households**
   - Basic unit of guest management
   - Properties: name, guest count, category, tier
   - Example: "Smith Family (4 guests)"

4. **Events**
   - Create and save different event configurations
   - Compare guest counts between events
   - Export specific events to CSV

## Application Flow

1. **Data Management**
   - User creates/edits categories and tiers
   - User adds households with guest counts
   - Changes automatically saved to localStorage
   - Optional CSV export for backup

2. **Event Planning**
   - Create and save multiple events
   - Compare guest counts between events
   - Export specific events to CSV

3. **Event Builder**
   - Create new events
   - Select categories and tiers
   - Event comparison
   - Save/load events

4. **Data Export**
   - Export complete guest list to CSV
   - Import from previously exported CSV
   - Easy sharing and backup

## User Interface

### Main Views
1. **Dashboard**
   - Total guest count
   - Breakdown by category and tier
   - Quick actions

2. **Household Management**
   - List view with filtering
   - Add/edit household form
   - Bulk update capabilities

3. **Event Builder**
   - Create new events
   - Select categories and tiers
   - Event comparison
   - Save/load events

### Design Principles
- Mobile-first responsive design
- Simple, intuitive interface
- Minimal clicks for common actions
- Clear feedback for user actions

## Error Handling
- Form validation for required fields
- Data format validation for CSV import
- Automatic saving to prevent data loss
- Clear error messages for users

## Future Considerations

### Potential Enhancements
1. **Data Management**
   - Notes field for households
   - Custom fields for categories
   - Target guest count tracking

2. **User Experience**
   - Dark/light mode
   - Keyboard shortcuts
   - Search and advanced filtering

3. **Data Visualization**
   - Charts and graphs
   - Guest list breakdown views
   - Event comparisons 