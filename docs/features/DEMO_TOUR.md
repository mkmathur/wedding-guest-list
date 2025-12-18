# Demo Tour Feature - Product Requirements Document

## Overview
A guided tour feature that demonstrates the value and unique capabilities of the Wedding Guest List Manager through realistic demo data and focused walkthroughs.

## Problem Statement
New users face two key barriers:
1. **Empty state confusion**: Blank interfaces don't showcase the app's organizational power
2. **Value differentiation**: Users don't immediately understand advantages over spreadsheets or existing wedding tools

## User Flow

### Initial Experience
1. User lands on app (first visit)
2. Welcome modal appears:
   ```
   Welcome to Wedding Guest List Manager!
   See how smart wedding planning works with our quick tour.
   
   [Take a Tour]
   ```
3. User clicks "Take a Tour" → Tour begins with pre-loaded demo data

### Tour Structure (3 Steps)

**Step 1: "Smart Organization"**
- **Focus area**: Main kanban board
- **Message**: "Organize guests by category AND priority - see how the visual layout beats spreadsheet rows"
- **Demo data visible**: ~80 guests distributed across categories/tiers

**Step 2: "Multi-Event Planning"**
- **Focus area**: Events panel + filtered household view
- **Message**: "Plan multiple wedding events with different guest lists - perfect for multi-day Indian weddings"
- **Interaction**: Highlight switching between events to show different guest counts automatically updating

**Step 3: "Planning Insights"**
- **Focus area**: Summary view + guest counts
- **Message**: "Get real wedding planning insights - bride vs groom breakdown, expected attendance across multiple events"
- **Interaction**: Switch to summary view, demonstrate existing RSVP probability feature showing invited vs expected attendance calculations

### Tour Completion
- Final message: "Ready to plan your wedding?"
- **[Start Planning]** button → Clears all demo data, app auto-initializes with default categories/tiers, removes demo mode

## Demo Data Strategy

### Households (~80 total guests)
```
Bride's Family (24 guests):
- "Mom & Dad" (2 guests, T1)
- "Nani & Nana" (2 guests, T1)
- "Mama & Mami" (2 guests, T2)
- "The Sharma Family" (4 guests, T2)
- "The Patel Family" (3 guests, T3)

Bride's Friends (18 guests):
- "Priya & Mike" (2 guests, T1)
- "The Johnsons" (4 guests, T2)
- "Anita & David" (2 guests, T2)
- "The Chens" (3 guests, T3)

Groom's Family (20 guests):
- "Mom & Dad" (2 guests, T1)
- "Dada & Dadi" (2 guests, T1)
- "Chacha & Chachi" (2 guests, T2)
- "The Gupta Family" (4 guests, T2)
- "The Singh Family" (3 guests, T2)

Groom's Friends (18 guests):
- "Raj & Sarah" (2 guests, T1)
- "The Davis Family" (4 guests, T2)
- "Vikram & Emma" (2 guests, T2)
- "The Martinez Family" (3 guests, T3)
```

### Events
- **"Haldi"**: T1 + Groom's T2 friends/family
- **"Mehndi"**: T1 + Bride's T2 friends/family  
- **"Ceremony"**: T1 + T2
- **"Reception"**: All tiers

### RSVP Probabilities
Demo households should include varied RSVP probabilities to demonstrate realistic planning.

## Technical Requirements

### Data Isolation
- **Demo data must never mix with user data**: Demo households, categories, and events should be completely separate from any real wedding planning data to prevent confusion and data corruption
- **Clean transition**: When tour completes, user should start with a fresh slate - no residual demo data should appear in their real planning workflow
- **No accidental persistence**: Demo data should never be saved permanently, ensuring users don't mistakenly build on sample data

### State Persistence  
- **Tour completion tracking**: Remember if user has completed or skipped the tour to avoid showing welcome modal repeatedly
- **Temporary demo state**: Demo data should only exist during the active tour session
- **Performance requirement**: Tour system should not impact app loading speed for returning users who have already completed the tour

### Future Compatibility
- **Database migration readiness**: Demo system should work independently of current localStorage approach to support planned database migration without requiring tour redesign

## User Experience Requirements

### Welcome Modal
- **Trigger**: User has never completed the tour (localStorage 'tourCompleted' flag is not 'true')
- **Behavior**: Modal overlay, cannot be dismissed by clicking outside
- **Design**: Clean, welcoming, single clear CTA

### Tour Behavior
- **Skippable**: "Skip Tour" option always visible
- **Navigation**: "Next" button progression with option to upgrade to bidirectional navigation in future iterations
- **Performance**: No impact on app loading for returning users
- **Visual focus**: Text-based guidance for MVP, with potential for visual highlighting enhancements in future iterations

### Demo Mode Indicator
- Subtle banner: "📝 Demo Mode - Exploring with sample data"
- **Placement**: Top header bar above all three panels
- Not intrusive but clearly indicates current state
- Removed immediately when tour completes

### Exit Strategy
- Clear "Start Planning" CTA at tour completion
- One-click transition to real planning mode
- Confirmation: "This will clear the demo data and start fresh"

## Design Principles
- **Keep it simple**: Prioritize simplicity over advanced features for initial implementation
- **Polished appearance**: Tour should feel professional and well-designed

## Edge Cases

### Skip Tour
- User can skip at any point
- Skipping = same as completing (demo data cleared, normal app state)
- No half-states or confusion

### Return Visitors
- Once tour completed, never show welcome modal again
- App loads normally with auto-initialized categories/tiers
- No residual demo data

### Tour Interruption
- Browser refresh during tour → restart tour from beginning
- Keep it simple rather than trying to resume mid-tour

## Success Criteria

### Functional Requirements
- [ ] Welcome modal appears for new users
- [ ] Demo data loads correctly and shows realistic wedding planning scenario
- [ ] 3-step tour highlights key differentiating features
- [ ] Tour completion cleanly transitions to normal app state
- [ ] No performance impact for returning users

### User Experience Requirements
- [ ] Tour is skippable at any point
- [ ] Demo data feels realistic and relevant
- [ ] Value propositions are clearly communicated
- [ ] Transition from demo to real planning feels natural

### Technical Requirements
- [ ] Demo state is properly isolated from real data
- [ ] Tour completion state persists across sessions
- [ ] No performance impact on app loading
- [ ] Tour integrates cleanly with existing components