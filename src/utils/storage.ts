import type { Tier, Category, Household, Scenario } from '../types';

const STORAGE_KEYS = {
  TIERS: 'wedding-guest-list:tiers',
  CATEGORIES: 'wedding-guest-list:categories',
  HOUSEHOLDS: 'wedding-guest-list:households',
  SCENARIOS: 'wedding-guest-list:scenarios',
} as const;

type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS];

// Generic function to safely parse JSON data
const safelyParseJSON = <T>(data: string | null, fallback: T): T => {
  if (!data) return fallback;
  try {
    return JSON.parse(data) as T;
  } catch (e) {
    console.error(`Error parsing JSON from localStorage:`, e);
    return fallback;
  }
};

// Generic function to safely stringify and store data
const safelyStoreJSON = <T>(key: StorageKey, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Error storing data in localStorage:`, e);
    // Re-throw storage errors (like quota exceeded) to handle them in the UI
    throw e;
  }
};

export const storage = {
  getTiers: (): Tier[] => {
    return safelyParseJSON<Tier[]>(
      localStorage.getItem(STORAGE_KEYS.TIERS),
      []
    );
  },

  setTiers: (tiers: Tier[]): void => {
    safelyStoreJSON(STORAGE_KEYS.TIERS, tiers);
  },

  getCategories: (): Category[] => {
    return safelyParseJSON<Category[]>(
      localStorage.getItem(STORAGE_KEYS.CATEGORIES),
      []
    );
  },

  setCategories: (categories: Category[]): void => {
    safelyStoreJSON(STORAGE_KEYS.CATEGORIES, categories);
  },

  getHouseholds: (): Household[] => {
    return safelyParseJSON<Household[]>(
      localStorage.getItem(STORAGE_KEYS.HOUSEHOLDS),
      []
    );
  },

  setHouseholds: (households: Household[]): void => {
    safelyStoreJSON(STORAGE_KEYS.HOUSEHOLDS, households);
  },

  getScenarios: (): Scenario[] => {
    return safelyParseJSON<Scenario[]>(
      localStorage.getItem(STORAGE_KEYS.SCENARIOS),
      []
    );
  },

  setScenarios: (scenarios: Scenario[]): void => {
    safelyStoreJSON(STORAGE_KEYS.SCENARIOS, scenarios);
  },

  clearAll: (): void => {
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
  },

  // Utility function to validate data integrity
  validateDataIntegrity: () => {
    const tiers = storage.getTiers();
    const categories = storage.getCategories();
    const households = storage.getHouseholds();
    const scenarios = storage.getScenarios();

    // Check for orphaned households (referencing non-existent categories or tiers)
    const orphanedHouseholds = households.filter(
      household =>
        !categories.some(category => category.id === household.categoryId) ||
        !tiers.some(tier => tier.id === household.tierId)
    );

    // Check for scenarios referencing non-existent categories or tiers
    const invalidScenarios = scenarios.filter(scenario =>
      scenario.selections.some(selection =>
        !categories.some(category => category.id === selection.categoryId) ||
        selection.selectedTierIds.some(tierId =>
          !tiers.some(tier => tier.id === tierId)
        )
      )
    );

    return {
      hasOrphanedHouseholds: orphanedHouseholds.length > 0,
      orphanedHouseholds,
      hasInvalidScenarios: invalidScenarios.length > 0,
      invalidScenarios,
    };
  },
}; 