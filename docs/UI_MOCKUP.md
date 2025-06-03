# Wedding Guest List App - UI Mockups

## Overall Layout

### Split View Layout
```
+--------------------------------------------------------------------------------+
|                              Wedding Guest List                                  |
+--------------------------------------------------------------------------------+
| + New Household    🔍 Search    Export ⬇️    Total Guests: 142                   |
+--------------------------------------------------------------------------------+
|                  |                                            |                  |
| CATEGORIES & TIERS|              HOUSEHOLD LIST               |     EVENTS      |
| ⚡Quick Filters   |                                            | + New Event     |
|------------------|  📋 My Family (45 guests)                   |------------------|
| Categories       |  ┣━ Smith Family (4) [Must Invite]         | Saved Events    |
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
| to filter list  |                                            | Events          |
|                  |                                            |                  |
+------------------+--------------------------------------------+------------------+
```

### Layout Components

#### Left Panel: Categories & Tiers
- Fixed width sidebar showing all available filters
- Categories shown with distinct colors (⭕)
- Tiers shown with priority indicators (🔴🟡🔵)
- Drag & drop area at bottom for quick filtering
- Quick filters section for common combinations

#### Middle Panel: Household List
- Takes up most of the screen width
- Households grouped by category (📋)
- Each household shows:
  - Name
  - Guest count in parentheses
  - Tier in brackets
- Hierarchical view with expand/collapse (┣━ ┗━)
- Running totals per category

#### Right Panel: Events
- Narrow sidebar for event management
- Shows saved events with guest counts
- Quick play button (▶️) to apply event
- Compare feature at bottom
- Collapsible for more space when needed

#### Top Bar
- Quick actions for common tasks
- Search functionality
- Export option
- Total guest count always visible

## Event Builder Interface

### Event List View
```
+------------------+------------------+------------------+
|   Categories     |   Households     |     Events      |
|   & Tiers        |                  |                  |
|                  |                  | + New Event      |
|                  |                  |                  |
|                  |                  | Saved Events:    |
|                  |                  |                  |
|                  |                  | Intimate Wedding |
|                  |                  | 65 guests        |
|                  |                  | [Edit] [Delete]  |
|                  |                  |                  |
|                  |                  | Full Reception   |
|                  |                  | 120 guests       |
|                  |                  | [Edit] [Delete]  |
|                  |                  |                  |
|                  |                  | Family Only      |
|                  |                  | 45 guests        |
|                  |                  | [Edit] [Delete]  |
+------------------+------------------+------------------+
```

### Event Form View
```
+------------------+------------------+------------------+
|   Categories     |   Households     |     Events      |
|   & Tiers        |                  |                  |
|                  |                  | Event Name:      |
|                  |                  | [Intimate Wed.]  |
|                  |                  |                  |
|                  |                  | Select Guests:   |
|                  |                  |                  |
|                  |                  | Family           |
|                  |                  | [✓] Must Invite  |
|                  |                  | [✓] Want Invite  |
|                  |                  | [ ] If Space     |
|                  |                  |                  |
|                  |                  | Friends          |
|                  |                  | [✓] Must Invite  |
|                  |                  | [ ] Want Invite  |
|                  |                  | [ ] If Space     |
|                  |                  |                  |
|                  |                  | Guest Count:     |
|                  |                  | Family: 45       |
|                  |                  | Friends: 20      |
|                  |                  | Total: 65        |
|                  |                  |                  |
|                  |                  | [Save] [Cancel]  |
+------------------+------------------+------------------+
```

## Mobile Layouts

### Event List (Mobile)
```
+--------------------------------+
|        Wedding Guest List       |
+--------------------------------+
| + New Event                    |
+--------------------------------+
| Saved Events:                  |
|                                |
| Intimate Wedding               |
| 65 guests                      |
| [Edit] [Delete]                |
|                                |
| Full Reception                 |
| 120 guests                     |
| [Edit] [Delete]                |
|                                |
| Family Only                    |
| 45 guests                      |
| [Edit] [Delete]                |
+--------------------------------+
```

### Event Form (Mobile)
```
+--------------------------------+
|        Wedding Guest List       |
+--------------------------------+
| Event Name:                    |
| [Intimate Wedding]             |
|                                |
| Select Guests:                 |
|                                |
| Family                         |
| [✓] Must Invite                |
| [✓] Want Invite                |
| [ ] If Space                   |
|                                |
| Friends                        |
| [✓] Must Invite                |
| [ ] Want Invite                |
| [ ] If Space                   |
|                                |
| Guest Count:                   |
| Family: 45                     |
| Friends: 20                    |
| Total: 65                      |
|                                |
| [Save] [Cancel]                |
+--------------------------------+
```

## Component Details

### Event List Components
- New Event button (top)
- Event cards with:
  - Event name
  - Guest count
  - Edit/Delete actions
- Clear visual separation between events

### Event Form Components
- Event name input field
- Category sections with:
  - Category name
  - Tier checkboxes
  - Visual grouping
- Guest count section with:
  - Per-category breakdown
  - Total count
- Action buttons:
  - Save (primary)
  - Cancel (secondary)

## Interaction States

### Event List
- Hover state for event cards
- Active state for buttons
- Loading state for actions
- Empty state when no events

### Event Form
- Input focus states
- Checkbox selection states
- Validation error states
- Loading state during save
- Disabled state for buttons

Would you like me to:
1. Show more component states?
2. Add more mobile variations?
3. Detail specific interactions? 