import type { Tier } from '../../types';
import { TierForm } from './TierForm';
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
  const [isCreating, setIsCreating] = useState(false);
  const [editingTier, setEditingTier] = useState<Tier | null>(null);

  const handleSubmit = (name: string) => {
    if (editingTier) {
      onEdit(editingTier.id, name);
      setEditingTier(null);
    } else {
      onAdd(name);
      setIsCreating(false);
    }
  };

  const handleCancel = () => {
    setEditingTier(null);
    setIsCreating(false);
  };

  const startEditing = (tier: Tier) => {
    setEditingTier(tier);
  };

  return (
    <div className={styles.tierManager}>
      {!isCreating && !editingTier && (
        <button
          className={styles.newTierButton}
          onClick={() => setIsCreating(true)}
        >
          + New Tier
        </button>
      )}

      {(isCreating || editingTier) ? (
        <TierForm
          tiers={tiers}
          tier={editingTier || undefined}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      ) : (
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
      )}
    </div>
  );
} 