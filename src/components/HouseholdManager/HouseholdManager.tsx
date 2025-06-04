import { useState, useEffect } from 'react';
import type { Household, Category, Tier } from '../../types';
import { storage } from '../../utils/storage';
import styles from './HouseholdManager.module.css';

interface HouseholdFormData {
  name: string;
  guestCount: number;
  categoryId: string;
  tierId: string;
}

const initialFormData: HouseholdFormData = {
  name: '',
  guestCount: 1,
  categoryId: '',
  tierId: '',
};

export function HouseholdManager() {
  const [households, setHouseholds] = useState<Household[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [formData, setFormData] = useState<HouseholdFormData>(initialFormData);
  const [editingHousehold, setEditingHousehold] = useState<Household | null>(null);
  const [error, setError] = useState('');

  // Load data on component mount
  useEffect(() => {
    const loadedHouseholds = storage.getHouseholds();
    const loadedCategories = storage.getCategories();
    const loadedTiers = storage.getTiers();
    
    setHouseholds(loadedHouseholds);
    setCategories(loadedCategories);
    setTiers(loadedTiers.sort((a, b) => a.order - b.order));

    // If there are categories and tiers, set initial form values
    if (loadedCategories.length > 0 && loadedTiers.length > 0) {
      setFormData(prev => ({
        ...prev,
        categoryId: loadedCategories[0].id,
        tierId: loadedTiers[0].id,
      }));
    }
  }, []);

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Household name is required');
      return false;
    }
    if (formData.guestCount < 1) {
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
      h => h.name.toLowerCase() === formData.name.toLowerCase() && 
          h.id !== editingHousehold?.id
    );
    if (isDuplicate) {
      setError('A household with this name already exists');
      return false;
    }

    setError('');
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    if (editingHousehold) {
      // Update existing household
      const updatedHouseholds = households.map(household =>
        household.id === editingHousehold.id
          ? { ...editingHousehold, ...formData }
          : household
      );
      setHouseholds(updatedHouseholds);
      storage.setHouseholds(updatedHouseholds);
      setEditingHousehold(null);
    } else {
      // Add new household
      const newHousehold: Household = {
        id: crypto.randomUUID(),
        ...formData,
      };
      const updatedHouseholds = [...households, newHousehold];
      setHouseholds(updatedHouseholds);
      storage.setHouseholds(updatedHouseholds);
    }

    // Reset form
    setFormData(initialFormData);
  };

  const handleDelete = (householdId: string) => {
    if (!confirm('Are you sure you want to delete this household?')) return;
    
    const updatedHouseholds = households.filter(h => h.id !== householdId);
    setHouseholds(updatedHouseholds);
    storage.setHouseholds(updatedHouseholds);
  };

  const startEdit = (household: Household) => {
    setEditingHousehold(household);
    setFormData({
      name: household.name,
      guestCount: household.guestCount,
      categoryId: household.categoryId,
      tierId: household.tierId,
    });
  };

  const cancelEdit = () => {
    setEditingHousehold(null);
    setFormData(initialFormData);
    setError('');
  };

  // Group households by category
  const householdsByCategory = categories.map(category => ({
    category,
    households: households.filter(h => h.categoryId === category.id),
  }));

  // Calculate total guests
  const totalGuests = households.reduce((sum, h) => sum + h.guestCount, 0);

  return (
    <div>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="name">Household Name:</label>
          <input
            id="name"
            type="text"
            value={formData.name}
            onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
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
            onChange={e => setFormData(prev => ({ ...prev, guestCount: parseInt(e.target.value) || 1 }))}
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
          {editingHousehold && (
            <button type="button" onClick={cancelEdit} className={styles.cancelButton}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className={styles.totalGuests}>
        Total Guests: {totalGuests}
      </div>

      <div className={styles.householdList}>
        {householdsByCategory.map(({ category, households }) => (
          <div key={category.id} className={styles.categoryGroup}>
            <h3 className={styles.categoryTitle}>
              {category.name} ({households.reduce((sum, h) => sum + h.guestCount, 0)} guests)
            </h3>
            {households.map(household => {
              const tier = tiers.find(t => t.id === household.tierId);
              return (
                <div key={household.id} className={styles.household}>
                  <div className={styles.householdInfo}>
                    <span className={styles.householdName}>{household.name}</span>
                    <span className={styles.guestCount}>
                      ({household.guestCount} {household.guestCount === 1 ? 'guest' : 'guests'})
                    </span>
                    {tier && <span className={styles.tier}>[{tier.name}]</span>}
                  </div>
                  <div className={styles.actions}>
                    <button
                      onClick={() => startEdit(household)}
                      className={styles.editButton}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(household.id)}
                      className={styles.deleteButton}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
} 