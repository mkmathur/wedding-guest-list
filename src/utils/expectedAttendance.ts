import type { Household } from '../types';
import type { Event } from '../types/event';

// Check if a household is invited to a specific event
const isHouseholdInvitedToEvent = (household: Household, event: Event): boolean => {
  // Find the selection for this household's category
  const categorySelection = event.selections.find(
    selection => selection.categoryId === household.categoryId
  );

  // If no selection for this category, household is not invited
  if (!categorySelection) {
    return false;
  }

  // Check if the household's tier is in the selected tiers for this category
  return categorySelection.selectedTierIds.includes(household.tierId);
};

// Calculate expected attendance for a specific event
export const calculateExpectedAttendance = (
  households: Household[],
  event: Event
): number => {
  const invitedHouseholds = households.filter(household => 
    isHouseholdInvitedToEvent(household, event)
  );

  const expectedCount = invitedHouseholds.reduce((total, household) => {
    const probability = household.rsvpProbability ?? 75; // Default to 75%
    const expectedGuests = household.guestCount * (probability / 100);
    return total + expectedGuests;
  }, 0);

  return Math.round(expectedCount);
};

// Calculate total invited guests for an event
export const calculateInvitedCount = (
  households: Household[],
  event: Event
): number => {
  return households
    .filter(household => isHouseholdInvitedToEvent(household, event))
    .reduce((total, household) => total + household.guestCount, 0);
};