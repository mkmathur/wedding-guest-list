# Split View Design - Detailed Mockup

```
+--------------------------------------------------------------------------------+
|                              Wedding Guest List                                  |
+--------------------------------------------------------------------------------+
| + New Household    🔍 Search    Export ⬇️    Total Guests: 142                   |
+--------------------------------------------------------------------------------+
|                  |                                            |                  |
| CATEGORIES & TIERS|              HOUSEHOLD LIST               |    SCENARIOS     |
| ⚡Quick Filters   |                                            | + New Scenario   |
|------------------|  📋 My Family (45 guests)                   |------------------|
| Categories       |  ┣━ Smith Family (4) [Must Invite]         | Saved Scenarios |
| ⭕ My Family     |  ┣━ Johnson Family (3) [Must Invite]       |                  |
| ⭕ Partner Family |  ┗━ Williams (2) [Want to Invite]         | ▶️ Just Family   |
| ⭕ College Friends|                                            |   125 guests    |
| ⭕ Work Friends   |  📋 Partner Family (52 guests)             |                  |
|                  |  ┣━ Brown Family (5) [Must Invite]         | ▶️ All Must     |
| Tiers           |  ┣━ Miller Family (4) [Must Invite]        |   Invites       |
| 🔴 Must Invite   |  ┗━ Davis Family (3) [Want to Invite]      |   165 guests    |
| 🟡 Want to Invite|                                            |                  |
| 🔵 If Space      |  📋 College Friends (45 guests)            | ▶️ Full List    |
|                  |  ┣━ Alex & Jordan (2) [Must Invite]        |   250 guests    |
|------------------|  ┣━ Taylor Group (4) [Want to Invite]      |                  |
| Drag categories  |  ┗━ Chris & Pat (2) [If Space]            |------------------|
| or tiers here   |                                            | Compare         |
| to filter list  |                                            | Scenarios       |
|                  |                                            |                  |
+------------------+--------------------------------------------+------------------+
```

## Layout Explanation

### Left Panel: Categories & Tiers
- Fixed width sidebar showing all available filters
- Categories shown with distinct colors (⭕)
- Tiers shown with priority indicators (🔴🟡🔵)
- Drag & drop area at bottom for quick filtering
- Quick filters section for common combinations

### Middle Panel: Household List (Main Content)
- Takes up most of the screen width
- Households grouped by category (📋)
- Each household shows:
  - Name
  - Guest count in parentheses
  - Tier in brackets
- Hierarchical view with expand/collapse (┣━ ┗━)
- Running totals per category

### Right Panel: Scenarios
- Narrow sidebar for scenario management
- Shows saved scenarios with guest counts
- Quick play button (▶️) to apply scenario
- Compare feature at bottom
- Collapsible for more space when needed

### Top Bar
- Quick actions for common tasks
- Search functionality
- Export option
- Total guest count always visible

## Interactions

1. **Filtering:**
   - Drag a category or tier to filter area
   - Click category/tier to toggle visibility
   - Multiple filters can be combined

2. **Household Management:**
   - Click household to edit
   - Quick actions on hover
   - Drag between categories

3. **Scenarios:**
   - Click to load a scenario
   - Quick comparison view
   - Save current filters as new scenario

## Mobile Adaptation

On mobile devices, this layout transforms into:

```
+--------------------------------+
|        Wedding Guest List       |
+--------------------------------+
| 🔍 Search       Total: 142    + |
+--------------------------------+
| [Categories] [Households] [Scenarios]
+--------------------------------+
|                                |
|        Household List          |
|                                |
|                                |
+--------------------------------+
|  📱 Bottom Navigation Bar       |
+--------------------------------+
```

- Panels become swipeable views
- Bottom navigation for quick access
- Floating action button (+) for new items
- Modal dialogs for detailed views
- Collapsible filters and scenarios

Would you like me to:
1. Add more interaction details?
2. Show specific component mockups?
3. Create examples of different states (filtering, editing, etc.)?
4. Show more mobile views? 