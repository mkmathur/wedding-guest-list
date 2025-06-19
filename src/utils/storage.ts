import type { Tier, Category, Household } from '../types';
import type { Event, CategoryTierSelection } from '../types/event';

const STORAGE_KEYS = {
  TIERS: 'wedding-guest-list:tiers',
  CATEGORIES: 'wedding-guest-list:categories',
  HOUSEHOLDS: 'wedding-guest-list:households',
  EVENTS: 'wedding-guest-list:events',
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

  getEvents: (): Event[] => {
    return safelyParseJSON<Event[]>(
      localStorage.getItem(STORAGE_KEYS.EVENTS),
      []
    );
  },

  setEvents: (events: Event[]): void => {
    safelyStoreJSON(STORAGE_KEYS.EVENTS, events);
  },

  clearAll: (): void => {
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
  },

  // Utility function to validate data integrity
  validateData: () => {
    const tiers = storage.getTiers();
    const categories = storage.getCategories();
    const households = storage.getHouseholds();
    const events = storage.getEvents();

    // Check for households referencing non-existent categories or tiers
    const invalidHouseholds = households.filter(household =>
      !categories.find(cat => cat.id === household.categoryId) ||
      !tiers.find(tier => tier.id === household.tierId)
    );

    // Check for events referencing non-existent categories or tiers
    const invalidEvents = events.filter(event =>
      event.selections.some(selection =>
        !categories.find(cat => cat.id === selection.categoryId) ||
        !selection.selectedTierIds.every(tierId =>
          tiers.find(tier => tier.id === tierId)
        )
      )
    );

    return {
      hasInvalidHouseholds: invalidHouseholds.length > 0,
      invalidHouseholds,
      hasInvalidEvents: invalidEvents.length > 0,
      invalidEvents,
    };
  },
}; 