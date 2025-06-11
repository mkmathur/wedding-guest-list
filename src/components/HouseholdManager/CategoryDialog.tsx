import { useState, useMemo } from 'react';
import type { Category } from '../../types';
import styles from './CategoryDialog.module.css';

interface CategoryDialogProps {
  newCategories: string[];
  existingCategories: Category[];
  onProceed: (categoriesToCreate: string[]) => void;
  onBack: () => void;
}

interface ProcessedCategories {
  uniqueNewCategories: string[];
  duplicates: string[];
  hasNewCategories: boolean;
}

export function CategoryDialog({
  newCategories,
  existingCategories,
  onProceed,
  onBack,
}: CategoryDialogProps) {
  // Process categories to handle duplicates and case-insensitive matching
  const processedCategories = useMemo<ProcessedCategories>(() => {
    // Convert all to lowercase for case-insensitive comparison
    const existingNames = new Set(existingCategories.map(cat => cat.name.toLowerCase()));
    const newNames = new Set<string>();
    const duplicates = new Set<string>();
    const uniqueNewCategories: string[] = [];

    // Process each category
    newCategories.forEach(category => {
      const lowerName = category.toLowerCase();
      
      // Check if it's a duplicate of an existing category
      if (existingNames.has(lowerName)) {
        return; // Skip existing categories
      }
      
      // Check if it's a duplicate of a new category
      if (newNames.has(lowerName)) {
        duplicates.add(category);
        return;
      }
      
      // Add to unique categories
      newNames.add(lowerName);
      uniqueNewCategories.push(category);
    });

    return {
      uniqueNewCategories,
      duplicates: Array.from(duplicates),
      hasNewCategories: uniqueNewCategories.length > 0,
    };
  }, [newCategories, existingCategories]);

  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(
    new Set(processedCategories.uniqueNewCategories)
  );
  const [error, setError] = useState<string>('');

  const handleToggleCategory = (categoryName: string) => {
    setSelectedCategories(prev => {
      const next = new Set(prev);
      if (next.has(categoryName)) {
        next.delete(categoryName);
      } else {
        next.add(categoryName);
      }
      return next;
    });
  };

  const handleProceed = () => {
    // Clear any previous errors
    setError('');

    // Always allow proceeding, regardless of whether categories are selected
    // If no categories are selected, we'll proceed with an empty array
    onProceed(Array.from(selectedCategories));
  };

  return (
    <div className={styles.dialog}>
      <h3>Categories Detected</h3>
      
      {processedCategories.hasNewCategories ? (
        <p className={styles.subtitle}>
          Select any new categories you want to create, or proceed without creating new categories.
          Existing categories are already available.
        </p>
      ) : (
        <p className={styles.subtitle}>
          All categories already exist. You can proceed to review the households.
        </p>
      )}

      {error && <div className={styles.error}>{error}</div>}

      {processedCategories.duplicates.length > 0 && (
        <div className={styles.warning}>
          Duplicate categories detected: {processedCategories.duplicates.join(', ')}
        </div>
      )}

      <div className={styles.categoryList}>
        {processedCategories.uniqueNewCategories.map(categoryName => (
          <label key={categoryName} className={styles.categoryItem}>
            <input
              type="checkbox"
              checked={selectedCategories.has(categoryName)}
              onChange={() => handleToggleCategory(categoryName)}
            />
            <span>{categoryName} (new)</span>
          </label>
        ))}
        {existingCategories.map(category => (
          <div key={category.id} className={styles.categoryItem}>
            <span className={styles.existingCategory}>{category.name} (already exists)</span>
          </div>
        ))}
      </div>

      <div className={styles.buttonGroup}>
        <button
          type="button"
          className={styles.confirmButton}
          onClick={handleProceed}
        >
          {selectedCategories.size > 0 ? 'Create Selected Categories' : 'Proceed Without New Categories'}
        </button>
        <button
          type="button"
          className={styles.cancelButton}
          onClick={onBack}
        >
          Back
        </button>
      </div>
    </div>
  );
} 