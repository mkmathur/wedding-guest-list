import type { Household, Category, Tier } from '../types';
import type { Event } from '../types/event';
import type { CategorySide } from '../types';

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

/**
 * Calculate guest counts by side (bride, groom, both, unspecified)
 */
export interface SideBreakdown {
  bride: number;
  groom: number;
  both: number;
  unspecified: number;
}

export function calculateSideBreakdown(
  households: Household[],
  categories: Category[],
  eventSelections?: Event['selections'] | null
): SideBreakdown {
  const breakdown: SideBreakdown = {
    bride: 0,
    groom: 0,
    both: 0,
    unspecified: 0
  };

  // Create a map of categoryId to side for quick lookup
  const categoryIdToSide = new Map<string, CategorySide>();
  categories.forEach(category => {
    categoryIdToSide.set(category.id, category.side || 'unspecified');
  });

  households.forEach(household => {
    const side = categoryIdToSide.get(household.categoryId) || 'unspecified';
    
    // Check if this household is included in the current event
    const isIncluded = isIncludedInEvent(household.categoryId, household.tierId, eventSelections || null);
    
    if (isIncluded) {
      breakdown[side] += household.guestCount;
    }
  });

  return breakdown;
} 