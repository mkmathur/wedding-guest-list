import type { Category, Tier, Household } from '../types';
import type { Event } from '../types/event';

// Backup data structure - matches internal app state
export interface BackupData {
  households: Household[];
  categories: Category[];
  tiers: Tier[];
  events: Event[];
  version: string; // For future compatibility
  exportedAt: string; // ISO timestamp
}

// Export all app data to backup format
export const exportBackupData = (
  households: Household[],
  categories: Category[],
  tiers: Tier[],
  events: Event[]
): BackupData => {
  return {
    households,
    categories,
    tiers,
    events,
    version: '1.0.0',
    exportedAt: new Date().toISOString()
  };
};

// Validate backup data structure
export const validateBackupData = (data: any): data is BackupData => {
  if (!data || typeof data !== 'object') return false;
  
  // Check required top-level properties
  const requiredProps = ['households', 'categories', 'tiers', 'events'];
  if (!requiredProps.every(prop => Array.isArray(data[prop]))) return false;
  
  // Basic validation of array contents
  const isValidCategory = (cat: any): cat is Category =>
    cat && typeof cat.id === 'string' && typeof cat.name === 'string';
    
  const isValidTier = (tier: any): tier is Tier =>
    tier && typeof tier.id === 'string' && typeof tier.name === 'string';
    
  const isValidHousehold = (household: any): household is Household =>
    household && 
    typeof household.id === 'string' &&
    typeof household.name === 'string' &&
    typeof household.guestCount === 'number' &&
    typeof household.categoryId === 'string' &&
    typeof household.tierId === 'string';
    
  const isValidEvent = (event: any): event is Event =>
    event &&
    typeof event.id === 'string' &&
    typeof event.name === 'string' &&
    Array.isArray(event.selections);
  
  return (
    data.categories.every(isValidCategory) &&
    data.tiers.every(isValidTier) &&
    data.households.every(isValidHousehold) &&
    data.events.every(isValidEvent)
  );
};

// Generate and download backup file
export const downloadBackupFile = (data: BackupData, filename = 'guest-list-backup.json'): void => {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Parse uploaded file content
export const parseBackupFile = (file: File): Promise<BackupData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const data = JSON.parse(content);
        
        if (validateBackupData(data)) {
          resolve(data);
        } else {
          reject(new Error('Invalid backup file format'));
        }
      } catch (error) {
        reject(new Error('Unable to parse backup file'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Error reading backup file'));
    };
    
    reader.readAsText(file);
  });
}; 