# Wedding Guest List App - Technical Design

## Overview
A simple, client-side web application for managing a wedding guest list. The app allows users to organize guests by categories and tiers and create guest lists for wedding events.

## Tech Stack

### Frontend
- **React 18 with TypeScript**
  - Using built-in hooks and context for state management
  - Type safety for better development experience
  - No external state management libraries needed

- **Vite**
  - Modern, fast build tool
  - Quick development experience

- **CSS modules**
  - Simpler alternative to Tailwind CSS
  - Scoped CSS for components prevents style conflicts
  - Type-safe class names
  - Better code organization without utility class complexity
  - Familiar CSS syntax with modular benefits

## Data Architecture

### Storage Strategy
- **Local Storage**
  - All data stored in browser's localStorage
  - No backend required
  - Automatic saving of changes
  - Data persists between sessions

### Data Model

1. **Tiers**
   - Represents priority levels for guests
   - Properties: name, order
   - Example: "Must Invite", "Want to Invite", "If Space Permits"

2. **Categories**
   - Groups of guests (e.g., family, friends)
   - Properties: name
   - Example: "My Family", "Partner's Family", "College Friends"

3. **Households**
   - Basic unit of guest management
   - Properties: name, guest count, category, tier
   - Example: "Smith Family"

4. **Events**
   - Create and save different event configurations
   - Compare guest counts between events

## Application Flow

1. **Data Management**
   - User creates/edits categories and tiers
   - User adds households with guest counts
   - Changes automatically saved to localStorage

2. **Event Planning**
   - Create and save multiple events
   - Compare guest counts between events

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
- Automatic saving to prevent data loss
- Clear error messages for users