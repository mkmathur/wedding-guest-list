// Types for the Bulk Import feature

export interface ParsedHousehold {
  name: string;
  category: string;
  guestCount: number;
  isDuplicate?: boolean;
}

export interface NewCategory {
  name: string;
  selected: boolean;
}

export enum ImportStep {
  TextInput = 'TextInput',
  CategoryReview = 'CategoryReview',
  HouseholdReview = 'HouseholdReview',
} 