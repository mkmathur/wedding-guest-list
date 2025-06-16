import { useState, useEffect } from 'react';
import type { Household, Category, Tier } from '../../types';
import { FiUpload, FiMenu } from 'react-icons/fi';
import { BulkImportModal } from './BulkImportModal';
import { HouseholdEditModal } from './HouseholdEditModal';
import styles from './HouseholdManager.module.css';

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
  onAddMultiple: (households: Omit<Household, 'id'>[]) => void;
  onEdit: (id: string, household: Omit<Household, 'id'>) => void;
  onDelete: (id: string) => void;
  onAddCategory: (name: string) => void;
  onAddCategories: (names: string[]) => Promise<Category[]>;
}

export function HouseholdManager({ 
  households,
  categories,
  tiers,
  onAdd,
  onAddMultiple,
  onEdit,
  onDelete,
  onAddCategory,
  onAddCategories,
}: HouseholdManagerProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [editingHousehold, setEditingHousehold] = useState<Household | null>(null);
  const [formData, setFormData] = useState<HouseholdFormData>({
    name: '',
    guestCount: '1',
    categoryId: '',
    tierId: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (categories.length > 0 && tiers.length > 0) {
      setFormData(prev => ({
        ...prev,
        categoryId: categories[0].id,
        tierId: tiers[0].id,
      }));
    }
  }, [categories, tiers]);

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

    onAdd(householdData);
    setIsCreating(false);
    resetForm();
  };

  const handleCancel = () => {
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
    
    // Check for duplicate names
    const isDuplicate = households.some(
      h => h.name.toLowerCase().trim() === formData.name.toLowerCase().trim()
    );
    if (isDuplicate) {
      setError('A household with this name already exists');
      return false;
    }

    setError('');
    return true;
  };

  // Group households by category, then by tier within each category
  const householdsByCategory = categories.map(category => {
    const categoryHouseholds = households.filter(h => h.categoryId === category.id);
    
    // Group households within this category by tier
    const householdsByTier = tiers.map(tier => ({
      tier,
      households: categoryHouseholds.filter(h => h.tierId === tier.id),
    }));

    return {
      category,
      tierGroups: householdsByTier,
    };
  });

  return (
    <div className={styles.householdManager}>
      <div className={styles.buttonGroup}>
        {!isCreating && (
          <>
            <button
              className={styles.newHouseholdButton}
              onClick={() => setIsCreating(true)}
            >
              + New Household
            </button>
            <button
              className={styles.importButton}
              onClick={() => setIsImporting(true)}
              title="Bulk import households"
            >
              <FiUpload className={styles.buttonIcon} />
              Bulk Import
            </button>
          </>
        )}
      </div>

      {isCreating && (
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
              Add Household
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
        {householdsByCategory.map(({ category, tierGroups }) => (
          <div key={category.id} className={styles.categoryGroup}>
            <h3 className={styles.categoryTitle}>{category.name}</h3>
            <div className={styles.kanbanBoard} data-category-id={category.id}>
              {tierGroups.map(({ tier, households: tierHouseholds }) => (
                <div 
                  key={tier.id} 
                  className={styles.tierColumn}
                  data-tier-id={tier.id}
                  data-category-id={category.id}
                >
                  <h4 className={styles.tierColumnHeader}>{tier.name}</h4>
                  <div className={styles.tierColumnContent}>
                    {tierHouseholds.length > 0 ? (
                      tierHouseholds.map(household => (
                        <div 
                          key={household.id} 
                          className={styles.householdCard}
                          data-household-id={household.id}
                        >
                          <div 
                            className={styles.householdContent}
                            onClick={() => setEditingHousehold(household)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                setEditingHousehold(household);
                              }
                            }}
                            role="button"
                            tabIndex={0}
                            aria-label={`Edit ${household.name} household`}
                          >
                            <div className={styles.householdInfo}>
                              <span className={styles.householdName}>{household.name}</span>
                              <span className={styles.guestCount}>
                                {household.guestCount} {household.guestCount === 1 ? 'guest' : 'guests'}
                              </span>
                            </div>
                          </div>
                          <div className={styles.dragHandle} aria-label="Drag handle">
                            <FiMenu />
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className={styles.emptyColumnPlaceholder}>---</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <BulkImportModal
        isOpen={isImporting}
        onClose={() => setIsImporting(false)}
        onImport={households => {
          try {
            // Validate all households first
            households.forEach(household => {
              if (!household.categoryId || !household.tierId) {
                throw new Error(
                  `Invalid household data: ${JSON.stringify(household)}`
                );
              }
            });
            
            onAddMultiple(households);
            setIsImporting(false);
          } catch (err) {
            console.error('Failed to import households:', err);
            // You might want to show an error message to the user here
          }
        }}
        existingCategories={categories}
        existingTiers={tiers}
        onAddCategories={onAddCategories}
      />

      <HouseholdEditModal
        isOpen={!!editingHousehold}
        household={editingHousehold}
        categories={categories}
        tiers={tiers}
        onClose={() => setEditingHousehold(null)}
        onSave={onEdit}
        onDelete={onDelete}
      />
    </div>
  );
} 