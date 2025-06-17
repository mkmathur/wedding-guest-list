import React from 'react';
import { exportBackupData, downloadBackupFile } from '../../utils/backup';
import type { Category, Tier, Household } from '../../types';
import type { Event } from '../../types/event';
import styles from './ExportBackupButton.module.css';

interface ExportBackupButtonProps {
  households: Household[];
  categories: Category[];
  tiers: Tier[];
  events: Event[];
}

export const ExportBackupButton: React.FC<ExportBackupButtonProps> = ({
  households,
  categories,
  tiers,
  events
}) => {
  const handleExport = () => {
    try {
      const backupData = exportBackupData(households, categories, tiers, events);
      downloadBackupFile(backupData);
    } catch (error) {
      console.error('Error exporting backup:', error);
      alert('Failed to export backup. Please try again.');
    }
  };

  return (
    <button 
      className={styles.exportButton}
      onClick={handleExport}
      title="Export all data to a JSON backup file"
    >
      Export Backup (.json)
    </button>
  );
}; 