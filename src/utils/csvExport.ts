import type { Household, Category, Tier } from '../types';
import type { Event } from '../types/event';

// Escape CSV field values that contain commas, quotes, or newlines
const escapeCsvField = (field: string): string => {
  if (field.includes(',') || field.includes('"') || field.includes('\n')) {
    return `"${field.replace(/"/g, '""')}"`;
  }
  return field;
};

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

export const exportHouseholdsToCSV = (
  households: Household[],
  categories: Category[],
  tiers: Tier[],
  events: Event[] = []
): string => {
  // CSV header - base columns plus event columns
  const headers = ['Household Name', 'Guest Count', 'Category', 'Tier'];
  
  // Add event columns
  events.forEach(event => {
    headers.push(escapeCsvField(event.name));
  });
  
  const csvRows = [headers.join(',')];

  // Sort households by category order (array position), then by tier order
  const sortedHouseholds = [...households].sort((a, b) => {
    // First sort by category order (array position in categories array)
    const categoryIndexA = categories.findIndex(cat => cat.id === a.categoryId);
    const categoryIndexB = categories.findIndex(cat => cat.id === b.categoryId);
    
    // Put unknown categories at the end
    if (categoryIndexA === -1 && categoryIndexB === -1) return 0;
    if (categoryIndexA === -1) return 1;
    if (categoryIndexB === -1) return -1;
    
    const categoryComparison = categoryIndexA - categoryIndexB;
    if (categoryComparison !== 0) {
      return categoryComparison;
    }

    // Then sort by tier order (array position in tiers array)
    const tierIndexA = tiers.findIndex(t => t.id === a.tierId);
    const tierIndexB = tiers.findIndex(t => t.id === b.tierId);
    
    // Put unknown tiers at the end
    if (tierIndexA === -1 && tierIndexB === -1) return 0;
    if (tierIndexA === -1) return 1;
    if (tierIndexB === -1) return -1;
    
    return tierIndexA - tierIndexB;
  });

  // Convert each household to CSV row
  sortedHouseholds.forEach(household => {
    const category = categories.find(cat => cat.id === household.categoryId);
    const tier = tiers.find(t => t.id === household.tierId);

    const row = [
      escapeCsvField(household.name),
      household.guestCount.toString(),
      escapeCsvField(category?.name ?? 'Unknown'),
      escapeCsvField(tier?.name ?? 'Unknown')
    ];

    // Add event invitation columns
    events.forEach(event => {
      const isInvited = isHouseholdInvitedToEvent(household, event);
      row.push(isInvited ? 'Yes' : 'No');
    });

    csvRows.push(row.join(','));
  });

  return csvRows.join('\n');
};

export const downloadCSV = (csvContent: string, filename: string): void => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};