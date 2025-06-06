export interface Tier {
  id: string;
  name: string;
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

export interface Event {
  id: string;
  name: string;
  selections: CategoryTierSelection[];
} 