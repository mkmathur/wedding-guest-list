# Demo Tour Feature - Technical Specification

## Overview
Implement a 3-step guided tour using React Joyride that showcases the app's key features with realistic demo data. Demo data exists only in React state during tour, never persists to localStorage.

## Dependencies Required
- Add `react-joyride` (latest stable version ~2.9.3+)
- No other dependencies needed

## Implementation Components

### 1. New Files to Create
```
src/components/DemoTour/
├── DemoTour.tsx              # Main tour orchestrator component
├── DemoTour.module.css       # Styling for demo banner and customizations
├── demoData.ts               # Hardcoded demo data (~80 guests, 4 categories, 4 events)
└── __tests__/
    └── DemoTour.test.tsx     # Unit tests
```

### 2. Tour State Management
Add to App.tsx:
```typescript
interface TourState {
  isActive: boolean;           # Currently running tour
  showWelcome: boolean;        # Show welcome modal for new users
}
```

Tour completion tracking:
- localStorage key: `'wedding-guest-list:tour-completed'`
- Check on app mount to determine if welcome should show
- Set to `'true'` on tour complete or skip

### 3. Demo Data Structure
Create hardcoded data in `demoData.ts` using the exact data specification from `DEMO_TOUR.md` PRD:
- **Categories**: 4 categories (Bride's Family, Bride's Friends, Groom's Family, Groom's Friends)
- **Households**: Use the detailed household list from PRD 
- **Tiers**: Use existing T1, T2, T3 structure
- **Events**: 4 events as specified in the PRD
- **RSVP Probabilities**: Add varied probabilities (25%, 50%, 75%, 90%, or 100%) to demonstrate planning insights

### 4. Tour Steps Configuration
React Joyride steps array:

**Step 0 (Welcome Modal)**:
- Target: `'body'` with center placement
- Content: Welcome message + "Take a Tour" button
- `disableBeacon: true`, `hideCloseButton: true`

**Step 1 (Smart Organization)**:
- Target: `.middle-panel` (household kanban area)
- Message: "Organize guests by category AND priority - see how the visual layout beats spreadsheet rows"

**Step 2 (Multi-Event Planning)**:
- Target: `.right-panel` (events panel)  
- Message: "Plan multiple wedding events with different guest lists - perfect for multi-day Indian weddings"

**Step 3 (Planning Insights)**:
- Target: summary mode toggle button
- Message: "Get real wedding planning insights - bride vs groom breakdown, expected attendance across multiple events"
- Auto-trigger: Call `handleSummaryModeToggle(true)` when this step activates

### 5. Data Source Switching Pattern
Modify App.tsx to switch data sources based on tour state:
```typescript
# When tour is active, use demo data; otherwise use real data from localStorage
const activeHouseholds = tourState.isActive ? demoData.households : households;
const activeCategories = tourState.isActive ? demoData.categories : categories;
# Apply same pattern to tiers and events
```

### 6. Demo Mode UI Indicator
Add demo banner when `tourState.isActive`:
```typescript
{tourState.isActive && (
  <div className={styles.demoBanner}>
    📝 Demo Mode - Exploring with sample data
  </div>
)}
```

### 7. Tour Completion Logic
Both tour completion and skip should:
1. Set localStorage `'wedding-guest-list:tour-completed'` to `'true'`
2. Set `tourState.isActive` to `false`
3. Reset summary mode: `handleSummaryModeToggle(false)`
4. Let existing auto-initialization create default categories/tiers

### 8. Performance Implementation
- Check localStorage only once on App mount
- Conditionally render `<DemoTour>` component only if tour not completed
- Demo data loads only when tour starts (lazy loading)

### 9. Integration Points
Modify these existing components:

**App.tsx**:
- Add tour state management
- Add data source switching logic
- Add demo banner conditional rendering
- Add tour completion handlers

**Existing components**: 
- No changes needed - they receive data as props and don't care about source

### 10. Error Handling Requirements
- Browser refresh during tour: Restart from welcome modal (don't persist tour progress)
- Tour skip: Identical behavior to tour completion
- Demo data validation: Use TypeScript for compile-time validation only

### 11. Testing Requirements
Test these scenarios:
- New user sees welcome modal
- Returning user (tour completed) sees no tour components
- Demo data displays correctly in all panels
- Tour completion transitions cleanly to real app
- Skip tour works identically to completion
- Step 3 auto-switches to summary mode

### 12. Future Auth Integration Hook
Architecture ready for additional sign-up step:
- Add Step 4 targeting sign-up area
- Preserve demo data through auth flow if user signs up
- No architectural changes required

## Implementation Notes
- Use existing CSS variable system for demo banner styling
- Follow existing component patterns (CSS modules, TypeScript interfaces)
- Reference `docs/features/DEMO_TOUR.md` for exact demo data specifications
- Keep tour messaging concise and value-focused
- Ensure tour works with existing panel collapse/expand functionality