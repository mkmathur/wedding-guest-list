// Types for the Bulk Import feature

export interface ParsedHousehold {
  parsedName: string;      // The cleaned household name
  category?: string;       // The category (set by parseBulkImportText)
  guestCount: number;      // Inferred guest count (default 1 if not found)
  rawInput: string;        // The original line for review/debugging
  needsReview?: boolean;   // True if parsing was ambiguous or failed
  isDuplicate?: boolean;   // True if detected as duplicate (set later)
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