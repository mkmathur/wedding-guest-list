import React from 'react';
import { exportHouseholdsToCSV, downloadCSV } from '../../utils/csvExport';
import type { Category, Tier, Household } from '../../types';
import type { Event } from '../../types/event';
import styles from './CsvExportButton.module.css';

interface CsvExportButtonProps {
  households: Household[];
  categories: Category[];
  tiers: Tier[];
  events: Event[];
}

export const CsvExportButton: React.FC<CsvExportButtonProps> = ({
  households,
  categories,
  tiers,
  events
}) => {
  const handleExport = () => {
    try {
      const csvContent = exportHouseholdsToCSV(households, categories, tiers, events);
      downloadCSV(csvContent, 'wedding-guest-list.csv');
    } catch (error) {
      console.error('Error exporting CSV:', error);
      alert('Failed to export CSV. Please try again.');
    }
  };

  return (
    <button 
      className={styles.exportButton}
      onClick={handleExport}
      title="Export households to CSV file"
    >
      Export CSV
    </button>
  );
};