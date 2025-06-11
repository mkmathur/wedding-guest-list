import { useState, useEffect } from 'react';
import type { Category, Tier } from '../../types';
import styles from './ReviewForm.module.css';

export interface ReviewFormProps {
  households: Array<{
    name: string;
    guestCount: number;
    categoryName: string;
    tierId: string;
  }>;
  categories: Category[];
  tiers: Tier[];
  onComplete: (households: ReviewFormProps['households']) => void;
  onBack: () => void;
}

export function ReviewForm({
  households: initialHouseholds,
  categories,
  tiers,
  onComplete,
  onBack,
}: ReviewFormProps) {
  const [households, setHouseholds] = useState<ReviewFormProps['households']>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // Set initial households with default tier
    const defaultTierId = tiers[0]?.id || '';
    setHouseholds(
      initialHouseholds.map(h => ({
        ...h,
        tierId: h.tierId || defaultTierId,
      }))
    );
  }, [initialHouseholds, tiers]);

  const handleHouseholdChange = (
    index: number,
    field: keyof ReviewFormProps['households'][0],
    value: string | number
  ) => {
    setHouseholds(prev => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: value,
      };
      return updated;
    });

    // Clear error for this field
    setErrors(prev => {
      const { [`${index}-${field}`]: _, ...rest } = prev;
      return rest;
    });
  };

  const validateHouseholds = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    households.forEach((household, index) => {
      // Validate name
      if (!household.name.trim()) {
        newErrors[`${index}-name`] = 'Name is required';
        isValid = false;
      }

      // Validate guest count
      if (household.guestCount < 1) {
        newErrors[`${index}-guestCount`] = 'Guest count must be at least 1';
        isValid = false;
      }

      // Validate category
      if (!household.categoryName) {
        newErrors[`${index}-categoryName`] = 'Category is required';
        isValid = false;
      }

      // Validate tier
      if (!household.tierId) {
        newErrors[`${index}-tierId`] = 'Tier is required';
        isValid = false;
      }

      // Check for duplicate names
      const duplicateIndex = households.findIndex(
        (h, i) => i !== index && h.name.toLowerCase().trim() === household.name.toLowerCase().trim()
      );
      if (duplicateIndex !== -1) {
        newErrors[`${index}-name`] = 'Duplicate household name';
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateHouseholds()) {
      onComplete(households);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formGroup}>
        <h3 className={styles.title}>Review and Edit Households</h3>
        <p className={styles.subtitle}>
          Review the parsed households and make any necessary adjustments.
        </p>

        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Household Name</th>
                <th>Category</th>
                <th>Tier</th>
                <th>Guest Count</th>
              </tr>
            </thead>
            <tbody>
              {households.map((household, index) => (
                <tr key={index}>
                  <td>
                    <div className={styles.inputGroup}>
                      <input
                        type="text"
                        value={household.name}
                        onChange={e => handleHouseholdChange(index, 'name', e.target.value)}
                        className={`${styles.input} ${
                          errors[`${index}-name`] ? styles.inputError : ''
                        }`}
                      />
                      {errors[`${index}-name`] && (
                        <div className={styles.error}>{errors[`${index}-name`]}</div>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className={styles.inputGroup}>
                      <select
                        className={`${styles.select} ${errors[`${index}-categoryName`] ? styles.error : ''}`}
                        value={household.categoryName}
                        onChange={e => handleHouseholdChange(index, 'categoryName', e.target.value)}
                        aria-label="Category"
                      >
                        {categories.map(category => (
                          <option key={category.id} value={category.name}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                      {errors[`${index}-categoryName`] && (
                        <div className={styles.error}>{errors[`${index}-categoryName`]}</div>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className={styles.inputGroup}>
                      <select
                        className={`${styles.select} ${errors[`${index}-tierId`] ? styles.error : ''}`}
                        value={household.tierId}
                        onChange={e => handleHouseholdChange(index, 'tierId', e.target.value)}
                        aria-label="Tier"
                      >
                        {tiers.map(tier => (
                          <option key={tier.id} value={tier.id}>
                            {tier.name}
                          </option>
                        ))}
                      </select>
                      {errors[`${index}-tierId`] && (
                        <div className={styles.error}>{errors[`${index}-tierId`]}</div>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className={styles.inputGroup}>
                      <input
                        type="number"
                        min="1"
                        value={household.guestCount}
                        onChange={e => handleHouseholdChange(index, 'guestCount', parseInt(e.target.value, 10))}
                        className={`${styles.input} ${
                          errors[`${index}-guestCount`] ? styles.inputError : ''
                        }`}
                      />
                      {errors[`${index}-guestCount`] && (
                        <div className={styles.error}>{errors[`${index}-guestCount`]}</div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className={styles.buttonGroup}>
        <button type="submit" className={styles.submitButton}>
          Save All
        </button>
        <button type="button" className={styles.cancelButton} onClick={onBack}>
          Back
        </button>
      </div>
    </form>
  );
} 