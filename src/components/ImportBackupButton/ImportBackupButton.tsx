import React, { useRef } from 'react';
import { parseBackupFile } from '../../utils/backup';
import { storage } from '../../utils/storage';
import type { Category, Tier, Household } from '../../types';
import type { Event } from '../../types/event';
import styles from './ImportBackupButton.module.css';

interface ImportBackupButtonProps {
  onImportComplete: (
    households: Household[],
    categories: Category[],
    tiers: Tier[],
    events: Event[]
  ) => void;
}

export const ImportBackupButton: React.FC<ImportBackupButtonProps> = ({
  onImportComplete
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Reset the input value so the same file can be selected again
    event.target.value = '';

    try {
      const backupData = await parseBackupFile(file);
      
      // Update localStorage with imported data
      storage.setHouseholds(backupData.households);
      storage.setCategories(backupData.categories);
      storage.setTiers(backupData.tiers);
      storage.setEvents(backupData.events);
      
      // Update app state
      onImportComplete(
        backupData.households,
        backupData.categories,
        backupData.tiers,
        backupData.events
      );
      
      alert('Backup imported successfully!');
    } catch (error) {
      console.error('Error importing backup:', error);
      alert('Failed to import backup: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  return (
    <>
      <button 
        className={styles.importButton}
        onClick={handleImportClick}
        title="Import data from a JSON backup file"
      >
        Import Backup (.json)
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
    </>
  );
}; 