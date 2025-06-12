export interface Tier {
  id: string;
  name: string;
}

// The order of tiers is maintained separately from the tier data
export interface TierOrder {
  tierIds: string[];
} 