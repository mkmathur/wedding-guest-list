import { useState } from 'react';
import type { Tier } from '../../types';
import styles from './TierManager.module.css';

interface TierManagerProps {
  tiers: Tier[];
  onAdd: (name: string, order: number) => void;
  onEdit: (tierId: string, name: string, order: number) => void;
  onDelete: (tierId: string) => void;
}

export function TierManager({ tiers, onAdd, onEdit, onDelete }: TierManagerProps) {
  const [newTierName, setNewTierName] = useState('');
  const [editingTier, setEditingTier] = useState<Tier | null>(null);
  const [error, setError] = useState('');

  const validateTierName = (name: string) => {
    if (!name.trim()) {
      setError('Tier name cannot be empty');
      return false;
    }
    if (tiers.some(tier => tier.name.toLowerCase() === name.toLowerCase() && tier.id !== editingTier?.id)) {
      setError('Tier name must be unique');
      return false;
    }
    setError('');
    return true;
  };

  const getNextOrder = () => {
    if (tiers.length === 0) return 0;
    return Math.max(...tiers.map(tier => tier.order)) + 1;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = editingTier ? editingTier.name : newTierName;
    
    if (!validateTierName(name)) return;

    if (editingTier) {
      onEdit(editingTier.id, name.trim(), editingTier.order);
      setEditingTier(null);
    } else {
      onAdd(newTierName.trim(), getNextOrder());
      setNewTierName('');
    }
  };

  const handleMoveUp = (index: number) => {
    if (index <= 0) return;
    
    const currentTier = tiers[index];
    const prevTier = tiers[index - 1];
    
    onEdit(currentTier.id, currentTier.name, prevTier.order);
    onEdit(prevTier.id, prevTier.name, currentTier.order);
  };

  const handleMoveDown = (index: number) => {
    if (index >= tiers.length - 1) return;
    
    const currentTier = tiers[index];
    const nextTier = tiers[index + 1];
    
    onEdit(currentTier.id, currentTier.name, nextTier.order);
    onEdit(nextTier.id, nextTier.name, currentTier.order);
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          className={styles.input}
          placeholder="Enter tier name"
          value={editingTier ? editingTier.name : newTierName}
          onChange={(e) => {
            if (editingTier) {
              setEditingTier({ ...editingTier, name: e.target.value });
            } else {
              setNewTierName(e.target.value);
            }
          }}
        />
        {error && <div className={styles.error}>{error}</div>}
        <div className={styles.buttonGroup}>
          <button type="submit" className={styles.actionButton}>
            {editingTier ? 'Update Tier' : 'Add Tier'}
          </button>
          {editingTier && (
            <button
              type="button"
              className={styles.actionButton}
              onClick={() => setEditingTier(null)}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className={styles.list}>
        {tiers.map((tier, index) => (
          <div key={tier.id} className={styles.tier}>
            <span className={styles.tierName}>{tier.name}</span>
            <div className={styles.actions}>
              <button
                className={styles.orderButton}
                onClick={() => handleMoveUp(index)}
                disabled={index === 0}
                title="Move Up"
              >
                ↑
              </button>
              <button
                className={styles.orderButton}
                onClick={() => handleMoveDown(index)}
                disabled={index === tiers.length - 1}
                title="Move Down"
              >
                ↓
              </button>
              <button
                className={styles.actionButton}
                onClick={() => setEditingTier(tier)}
              >
                Edit
              </button>
              <button
                className={styles.deleteButton}
                onClick={() => {
                  if (confirm('Are you sure you want to delete this tier?')) {
                    onDelete(tier.id);
                  }
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 