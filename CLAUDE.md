# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Commands
- **Development server**: `npm run dev` - Start Vite development server
- **Build**: `npm run build` - TypeScript compilation and production build
- **Linting**: `npm run lint` - Run ESLint on all TypeScript files
- **Preview**: `npm run preview` - Preview production build locally

### Testing Commands
- **Run tests**: `npm test` - Run test suite with Vitest
- **Test UI**: `npm run test:ui` - Launch Vitest UI for interactive testing
- **Coverage**: `npm run test:coverage` - Generate test coverage report

## Architecture Overview

### Application Structure
This is a React TypeScript application for managing wedding guest lists with a three-panel layout:

1. **Left Panel**: Categories & Tiers management
2. **Middle Panel**: Household management (main content area)  
3. **Right Panel**: Events management

### Core Data Models
- **Household**: Primary entity representing guest groups with `name`, `guestCount`, `categoryId`, `tierId`
- **Category**: Guest categorization with optional `side` (bride/groom/both/unspecified)
- **Tier**: Invitation priority levels maintained in array order (no explicit order field)
- **Event**: Specific occasions with category/tier selections for invitations

### State Management Philosophy
The application follows simple React patterns:
- **Array position determines order**: Especially for tiers - use array operations for reordering
- **Immutable updates**: Always create new arrays/objects for state updates
- **Local state**: Uses `useState` for component state, no external state management
- **localStorage persistence**: All data persisted via `src/utils/storage.ts`

### Key Technical Patterns
- **Component organization**: Feature-based folders with co-located tests and styles
- **CSS Modules**: Component-scoped styling (`.module.css` files)
- **Bulk operations**: Support for importing multiple households/categories at once
- **Data validation**: Reference integrity checking in storage layer

### Important Design Principles
From `DEVELOPMENT.md`:
- **Prefer simple solutions** over complex abstractions
- **Let data structures guide design** - array position for ordering vs explicit order fields
- **Single responsibility** components with clear interfaces
- **Immutable state updates** using spread operator and array methods

### Testing Setup
- **Framework**: Vitest with React Testing Library
- **Setup**: Tests configured in `src/test/setup.ts` with jest-dom matchers
- **Structure**: Tests co-located with components in `__tests__` folders

### File Structure Notes
- Component styles use CSS Modules pattern (`ComponentName.module.css`)
- Types split between `src/types.ts` (main types) and `src/types/event.ts`
- Utilities in `src/utils/` for storage, backup, and guest calculations
- Sample data available in `sample-data/` directory for testing