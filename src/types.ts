export interface Category {
  id: string;
  name: string;
}

export interface Tier {
  id: string;
  name: string;
}

// The order of tiers is maintained separately from the tier data
export interface TierOrder {
  tierIds: string[];
}

export interface Household {
  id: string;
  name: string;
  guestCount: number;
  categoryId?: string;
  tierId?: string;
  notes?: string;
}

// ... rest of the types ... 