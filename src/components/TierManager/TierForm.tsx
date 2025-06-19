import { useState, useEffect } from 'react';
import type { Tier } from '../../types';
import styles from './TierForm.module.css';

interface TierFormProps {
  tiers: Tier[];
  tier?: Tier;
  onSubmit: (name: string) => void;
  onCancel: () => void;
}

export function TierForm({ tiers, tier, onSubmit, onCancel }: TierFormProps) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  // Initialize form data when editing a tier
  useEffect(() => {
    if (tier) {
      setName(tier.name);
    } else {
      setName('');
    }
    setError('');
  }, [tier]);

  const validateTierName = (name: string) => {
    if (!name.trim()) {
      setError('Tier name cannot be empty');
      return false;
    }
    if (tiers.some(tierItem => 
      tierItem.name.toLowerCase() === name.toLowerCase() && 
      tierItem.id !== tier?.id
    )) {
      setError('Tier name must be unique');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateTierName(name)) return;

    onSubmit(name);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
    // Clear error when input changes
    if (error) {
      validateTierName(value);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formGroup}>
        <label htmlFor="tierName">Tier Name:</label>
        <input
          id="tierName"
          type="text"
          className={styles.input}
          placeholder="Enter tier name"
          value={name}
          onChange={handleNameChange}
        />
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.buttonGroup}>
        <button type="submit" className={styles.submitButton}>
          {tier ? 'Update Tier' : 'Create Tier'}
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