import type { Household, Category, Tier } from '../types';

// Escape CSV field values that contain commas, quotes, or newlines
const escapeCsvField = (field: string): string => {
  if (field.includes(',') || field.includes('"') || field.includes('\n')) {
    return `"${field.replace(/"/g, '""')}"`;
  }
  return field;
};

export const exportHouseholdsToCSV = (
  households: Household[],
  categories: Category[],
  tiers: Tier[]
): string => {
  // CSV header
  const headers = ['Household Name', 'Guest Count', 'Category', 'Tier'];
  const csvRows = [headers.join(',')];

  // Convert each household to CSV row
  households.forEach(household => {
    const category = categories.find(cat => cat.id === household.categoryId);
    const tier = tiers.find(t => t.id === household.tierId);

    const row = [
      escapeCsvField(household.name),
      household.guestCount.toString(),
      escapeCsvField(category?.name ?? 'Unknown'),
      escapeCsvField(tier?.name ?? 'Unknown')
    ];

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