import type { Tier } from '../../types';
import styles from './TierManager.module.css';
import { useState } from 'react';
import { FiEdit2, FiTrash2, FiChevronUp, FiChevronDown } from 'react-icons/fi';

interface TierManagerProps {
  tiers: Tier[];
  onAdd: (name: string) => void;
  onEdit: (tierId: string, name: string) => void;
  onDelete: (tierId: string) => void;
  onMoveUp: (tierId: string) => void;
  onMoveDown: (tierId: string) => void;
}

export function TierManager({
  tiers,
  onAdd,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown
}: TierManagerProps) {
  const [newTierName, setNewTierName] = useState('');
  const [editingTierId, setEditingTierId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [error, setError] = useState('');

  const validateTierName = (name: string) => {
    if (!name.trim()) {
      setError('Tier name cannot be empty');
      return false;
    }
    if (tiers.some(tier => 
      tier.name.toLowerCase() === name.toLowerCase() && 
      tier.id !== editingTierId
    )) {
      setError('Tier name must be unique');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingTierId) {
      if (!validateTierName(editingName)) return;
      onEdit(editingTierId, editingName);
      setEditingTierId(null);
      setEditingName('');
    } else {
      if (!validateTierName(newTierName)) return;
      onAdd(newTierName);
      setNewTierName('');
    }
  };

  const startEditing = (tier: Tier) => {
    setEditingTierId(tier.id);
    setEditingName(tier.name);
    setError('');
  };

  const cancelEditing = () => {
    setEditingTierId(null);
    setEditingName('');
    setError('');
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          className={styles.input}
          placeholder="Enter tier name"
          value={editingTierId ? editingName : newTierName}
          onChange={(e) => {
            if (editingTierId) {
              setEditingName(e.target.value);
            } else {
              setNewTierName(e.target.value);
            }
          }}
        />
        {error && <div className={styles.error}>{error}</div>}
        <div className={styles.buttonGroup}>
          <button type="submit" className={styles.textButton}>
            {editingTierId ? 'Update Tier' : 'Add Tier'}
          </button>
          {editingTierId && (
            <button
              type="button"
              className={styles.textButton}
              onClick={cancelEditing}
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
                onClick={() => onMoveUp(tier.id)}
                disabled={index === 0}
                title="Move Up"
                aria-label="Move tier up"
              >
                <FiChevronUp />
              </button>
              <button
                className={styles.orderButton}
                onClick={() => onMoveDown(tier.id)}
                disabled={index === tiers.length - 1}
                title="Move Down"
                aria-label="Move tier down"
              >
                <FiChevronDown />
              </button>
              <button
                className={styles.actionButton}
                onClick={() => startEditing(tier)}
                title="Edit tier"
                aria-label="Edit tier"
              >
                <FiEdit2 />
              </button>
              <button
                className={styles.deleteButton}
                onClick={() => {
                  if (confirm('Are you sure you want to delete this tier?')) {
                    onDelete(tier.id);
                  }
                }}
                title="Delete tier"
                aria-label="Delete tier"
              >
                <FiTrash2 />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 