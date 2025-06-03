export interface Tier {
  id: string;
  name: string;
  order: number;
}

export interface Category {
  id: string;
  name: string;
}

export interface Household {
  id: string;
  name: string;
  guestCount: number;
  categoryId: string;
  tierId: string;
}

export interface CategoryTierSelection {
  categoryId: string;
  selectedTierIds: string[];  // Allows selecting multiple tiers for a category
}

export interface Scenario {
  id: string;
  name: string;
  selections: CategoryTierSelection[];  // Each category can have its own tier selections
} 