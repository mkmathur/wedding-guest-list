import { useState, useEffect } from 'react';
import type { Event, EventFormData, CategoryTierSelection } from '../../types/event';
import type { Category, Tier } from '../../types';
import styles from './EventForm.module.css';

interface EventFormProps {
  categories: Category[];
  tiers: Tier[];
  households: Array<{
    id: string;
    name: string;
    guestCount: number;
    categoryId: string;
    tierId: string;
  }>;
  event?: Event;
  onSubmit: (formData: EventFormData) => void;
  onCancel: () => void;
  onPreviewChange?: (selections: CategoryTierSelection[]) => void;
}

export function EventForm({
  categories,
  tiers,
  households,
  event,
  onSubmit,
  onCancel,
  onPreviewChange
}: EventFormProps) {
  const [formData, setFormData] = useState<EventFormData>({
    name: '',
    selections: []
  });
  const [error, setError] = useState('');

  // Initialize form data when editing an event
  useEffect(() => {
    if (event) {
      // When editing an existing event, we need to ensure all current categories are included
      // This handles the case where new categories were added after the event was created
      const existingSelections = event.selections;
      const allCategorySelections = categories.map(category => {
        // Find existing selection for this category
        const existingSelection = existingSelections.find(s => s.categoryId === category.id);
        return existingSelection || {
          categoryId: category.id,
          selectedTierIds: []
        };
      });
      
      setFormData({
        name: event.name,
        selections: allCategorySelections
      });
    } else {
      // Initialize with empty selections for each category
      setFormData({
        name: '',
        selections: categories.map(category => ({
          categoryId: category.id,
          selectedTierIds: []
        }))
      });
    }
  }, [event, categories]);

  // Trigger preview updates whenever selections change
  useEffect(() => {
    if (onPreviewChange) {
      onPreviewChange(formData.selections);
    }
  }, [formData.selections, onPreviewChange]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    onSubmit(formData);
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Event name is required');
      return false;
    }

    // Check if at least one tier is selected
    const hasSelections = formData.selections.some(
      selection => selection.selectedTierIds.length > 0
    );
    if (!hasSelections) {
      setError('Please select at least one tier');
      return false;
    }

    setError('');
    return true;
  };

  const toggleTierSelection = (categoryId: string, tierId: string) => {
    setFormData(prev => ({
      ...prev,
      selections: prev.selections.map(selection => {
        if (selection.categoryId === categoryId) {
          const selectedTierIds = selection.selectedTierIds.includes(tierId)
            ? selection.selectedTierIds.filter(id => id !== tierId)
            : [...selection.selectedTierIds, tierId];
          return { ...selection, selectedTierIds };
        }
        return selection;
      })
    }));
  };

  // Calculate guest count for a category
  const calculateCategoryGuestCount = (categoryId: string, selectedTierIds: string[]) => {
    return households
      .filter(h => h.categoryId === categoryId && selectedTierIds.includes(h.tierId))
      .reduce((sum, h) => sum + h.guestCount, 0);
  };

  // Calculate total guest count
  const calculateTotalGuestCount = () => {
    return formData.selections.reduce((total, selection) => {
      return total + calculateCategoryGuestCount(
        selection.categoryId,
        selection.selectedTierIds
      );
    }, 0);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formGroup}>
        <label htmlFor="name">Event Name:</label>
        <input
          id="name"
          type="text"
          value={formData.name}
          onChange={e => {
            setFormData(prev => ({ ...prev, name: e.target.value }));
            if (error) validateForm();
          }}
          className={styles.input}
          placeholder="Enter event name"
        />
      </div>

      <div className={styles.selections}>
        {categories.map(category => {
          const selection = formData.selections.find(s => s.categoryId === category.id);
          if (!selection) return null;

          return (
            <div key={category.id} className={styles.categoryGroup}>
              <h3 className={styles.categoryTitle}>{category.name}</h3>
              <div className={styles.tierCheckboxes}>
                {tiers.map(tier => (
                  <label key={tier.id} className={styles.tierCheckbox}>
                    <input
                      type="checkbox"
                      checked={selection.selectedTierIds.includes(tier.id)}
                      onChange={() => toggleTierSelection(category.id, tier.id)}
                    />
                    {tier.name}
                  </label>
                ))}
              </div>
              <div className={styles.categoryCount}>
                {calculateCategoryGuestCount(category.id, selection.selectedTierIds)} guests
              </div>
            </div>
          );
        })}
      </div>

      <div className={styles.totalCount}>
        Total Guests: {calculateTotalGuestCount()}
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.buttonGroup}>
        <button type="submit" className={styles.submitButton}>
          {event ? 'Update Event' : 'Create Event'}
        </button>
        <button
          type="button"
          className={styles.cancelButton}
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </form>
  );
} 