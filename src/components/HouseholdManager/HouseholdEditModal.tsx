import { useState, useEffect } from 'react';
import { FiX, FiTrash2 } from 'react-icons/fi';
import type { Household, Category, Tier } from '../../types';
import styles from './HouseholdEditModal.module.css';

interface HouseholdFormData {
  name: string;
  guestCount: string;
  categoryId: string;
  tierId: string;
  rsvpProbability: string;
}

interface HouseholdEditModalProps {
  isOpen: boolean;
  household: Household | null;
  categories: Category[];
  tiers: Tier[];
  onClose: () => void;
  onSave: (id: string, household: Omit<Household, 'id'>) => void;
  onDelete: (id: string) => void;
}

export function HouseholdEditModal({
  isOpen,
  household,
  categories,
  tiers,
  onClose,
  onSave,
  onDelete,
}: HouseholdEditModalProps) {
  const [formData, setFormData] = useState<HouseholdFormData>({
    name: '',
    guestCount: '1',
    categoryId: '',
    tierId: '',
    rsvpProbability: '75',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (household && categories.length > 0 && tiers.length > 0) {
      setFormData({
        name: household.name,
        guestCount: household.guestCount.toString(),
        categoryId: household.categoryId,
        tierId: household.tierId,
        rsvpProbability: (household.rsvpProbability ?? 75).toString(),
      });
      setError('');
    }
  }, [household, categories, tiers]);

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
    
    setError('');
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !household) return;

    const householdData = {
      ...formData,
      guestCount: parseInt(formData.guestCount),
      rsvpProbability: parseInt(formData.rsvpProbability)
    };

    onSave(household.id, householdData);
    onClose();
  };

  const handleDelete = () => {
    if (!household) return;
    
    if (confirm('Are you sure you want to delete this household? This action cannot be undone.')) {
      onDelete(household.id);
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen || !household) return null;

  return (
    <div 
      className={styles.modalOverlay} 
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
    >
      <div className={styles.modalContent} role="dialog" aria-labelledby="modal-title" aria-modal="true">
        <div className={styles.modalHeader}>
          <h2 id="modal-title" className={styles.modalTitle}>Edit Household</h2>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close modal"
          >
            <FiX />
          </button>
        </div>

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
              autoFocus
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

          <div className={styles.formGroup}>
            <label htmlFor="rsvpProbability">RSVP Probability:</label>
            <select
              id="rsvpProbability"
              value={formData.rsvpProbability}
              onChange={e => setFormData(prev => ({ ...prev, rsvpProbability: e.target.value }))}
              className={styles.select}
            >
              <option value="0">0%</option>
              <option value="25">25%</option>
              <option value="50">50%</option>
              <option value="75">75%</option>
              <option value="90">90%</option>
              <option value="100">100%</option>
            </select>
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.modalActions}>
            <div className={styles.primaryActions}>
              <button type="submit" className={styles.saveButton}>
                Save Changes
              </button>
              <button
                type="button"
                className={styles.cancelButton}
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
            <button
              type="button"
              className={styles.deleteButton}
              onClick={handleDelete}
            >
              <FiTrash2 className={styles.deleteIcon} />
              Delete Household
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 