import { useState, useEffect } from 'react';
import type { Household, Category, Tier } from '../../types';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import styles from './HouseholdManager.module.css';
import { BulkImportModal } from '../BulkImportModal/BulkImportModal';

interface HouseholdFormData {
  name: string;
  guestCount: string;
  categoryId: string;
  tierId: string;
}

interface HouseholdManagerProps {
  households: Household[];
  categories: Category[];
  tiers: Tier[];
  onAdd: (household: Omit<Household, 'id'>) => void;
  onEdit: (householdId: string, updates: Partial<Household>) => void;
  onDelete: (householdId: string) => void;
}

export function HouseholdManager({ 
  households,
  categories,
  tiers,
  onAdd,
  onEdit,
  onDelete
}: HouseholdManagerProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [editingHousehold, setEditingHousehold] = useState<Household | null>(null);
  const [formData, setFormData] = useState<HouseholdFormData>({
    name: '',
    guestCount: '1',
    categoryId: '',
    tierId: '',
  });
  const [error, setError] = useState('');
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);

  useEffect(() => {
    if (categories.length > 0 && tiers.length > 0) {
      if (editingHousehold) {
        setFormData({
          name: editingHousehold.name,
          guestCount: editingHousehold.guestCount.toString(),
          categoryId: editingHousehold.categoryId || '',
          tierId: editingHousehold.tierId || '',
        });
      } else {
        setFormData(prev => ({
          ...prev,
          categoryId: categories[0].id,
          tierId: tiers[0].id,
        }));
      }
    }
  }, [categories, tiers, editingHousehold]);

  const resetForm = () => {
    setFormData({
      name: '',
      guestCount: '1',
      categoryId: categories[0]?.id || '',
      tierId: tiers[0]?.id || '',
    });
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const householdData = {
      ...formData,
      guestCount: parseInt(formData.guestCount)
    };

    if (editingHousehold) {
      onEdit(editingHousehold.id, householdData);
      setEditingHousehold(null);
    } else {
      onAdd(householdData);
      setIsCreating(false);
    }

    resetForm();
  };

  const startEdit = (household: Household) => {
    setEditingHousehold(household);
  };

  const handleCancel = () => {
    setEditingHousehold(null);
    setIsCreating(false);
    resetForm();
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Household name is required');
      return false;
    }
    const guestCount = parseInt(formData.guestCount);
    if (isNaN(guestCount) || guestCount < 1) {
      setError('Guest count must be at least 1');
      return false;
    }
    if (!formData.categoryId) {
      setError('Please select a category');
      return false;
    }
    if (!formData.tierId) {
      setError('Please select a tier');
      return false;
    }
    
    // Check for duplicate names (excluding the current editing household)
    const isDuplicate = households.some(
      h => h.name.toLowerCase().trim() === formData.name.toLowerCase().trim() && 
          h.id !== editingHousehold?.id
    );
    if (isDuplicate) {
      setError('A household with this name already exists');
      return false;
    }

    setError('');
    return true;
  };

  // Group households by category
  const householdsByCategory = categories.map(category => ({
    category,
    households: households.filter(h => h.categoryId === category.id),
  }));

  return (
    <div className={styles.householdManager}>
      {!isCreating && !editingHousehold && (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            className={styles.newHouseholdButton}
            onClick={() => setIsCreating(true)}
          >
            + New Household
          </button>
          <button
            className={styles.newHouseholdButton}
            onClick={() => setIsBulkImportOpen(true)}
          >
            Bulk Import
          </button>
        </div>
      )}
      <BulkImportModal isOpen={isBulkImportOpen} onClose={() => setIsBulkImportOpen(false)} />

      {(isCreating || editingHousehold) && (
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Household Name:</label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={e => {
                setFormData(prev => ({ ...prev, name: e.target.value }));
                if (error) validateForm();
              }}
              className={styles.input}
              placeholder="Enter household name"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="guestCount">Number of Guests:</label>
            <input
              id="guestCount"
              type="number"
              min="1"
              value={formData.guestCount}
              onChange={e => setFormData(prev => ({ ...prev, guestCount: e.target.value }))}
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="category">Category:</label>
            <select
              id="category"
              value={formData.categoryId}
              onChange={e => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
              className={styles.select}
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="tier">Tier:</label>
            <select
              id="tier"
              value={formData.tierId}
              onChange={e => setFormData(prev => ({ ...prev, tierId: e.target.value }))}
              className={styles.select}
            >
              {tiers.map(tier => (
                <option key={tier.id} value={tier.id}>
                  {tier.name}
                </option>
              ))}
            </select>
          </div>

          {error && <div className={styles.error}>{error}</div>}
          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.submitButton}>
              {editingHousehold ? 'Update Household' : 'Add Household'}
            </button>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className={styles.householdList}>
        {householdsByCategory.map(({ category, households: categoryHouseholds }) => (
          <div key={category.id} className={styles.categoryGroup}>
            <h3 className={styles.categoryTitle}>{category.name}</h3>
            {categoryHouseholds.map(household => (
              <div key={household.id} className={styles.household}>
                <div className={styles.householdInfo}>
                  <span className={styles.householdName}>{household.name}</span>
                  <span className={styles.guestCount}>
                    {household.guestCount} {household.guestCount === 1 ? 'guest' : 'guests'}
                  </span>
                  <span className={styles.tierLabel}>
                    {tiers.find(t => t.id === household.tierId)?.name}
                  </span>
                </div>
                <div className={styles.actions}>
                  <button
                    className={styles.editButton}
                    onClick={() => startEdit(household)}
                    title="Edit household"
                    aria-label="Edit household"
                  >
                    <FiEdit2 />
                  </button>
                  <button
                    className={styles.deleteButton}
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this household?')) {
                        onDelete(household.id);
                      }
                    }}
                    title="Delete household"
                    aria-label="Delete household"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
} 