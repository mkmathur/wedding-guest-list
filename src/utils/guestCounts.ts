import type { Household, Category, Tier } from '../types';
import type { Event } from '../types/event';

/**
 * Calculate guest count for a specific category and tier combination
 */
export function calculateCategoryTierGuestCount(
  households: Household[], 
  categoryId: string, 
  tierId: string
): number {
  return households
    .filter(h => h.categoryId === categoryId && h.tierId === tierId)
    .reduce((sum, h) => sum + h.guestCount, 0);
}

/**
 * Calculate guest count for a category with multiple selected tiers
 */
export function calculateCategoryGuestCount(
  households: Household[], 
  categoryId: string, 
  selectedTierIds: string[]
): number {
  return households
    .filter(h => h.categoryId === categoryId && selectedTierIds.includes(h.tierId))
    .reduce((sum, h) => sum + h.guestCount, 0);
}

/**
 * Check if a category/tier combination is included in an event's selections
 */
export function isIncludedInEvent(
  categoryId: string, 
  tierId: string, 
  selections: Event['selections'] | null
): boolean {
  if (!selections) return true; // If no event active, include everything
  
  return selections.some(selection => 
    selection.categoryId === categoryId && 
    selection.selectedTierIds.includes(tierId)
  );
}

/**
 * Generate summary data for the grid view
 */
export function generateSummaryData(
  households: Household[],
  categories: Category[],
  tiers: Tier[],
  eventSelections?: Event['selections'] | null
) {
  return categories.map(category => ({
    category,
    tierCounts: tiers.map(tier => ({
      tier,
      guestCount: calculateCategoryTierGuestCount(households, category.id, tier.id),
      isIncluded: isIncludedInEvent(category.id, tier.id, eventSelections || null)
    }))
  }));
} 