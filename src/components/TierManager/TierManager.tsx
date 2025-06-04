import { useState, useEffect } from 'react';
import type { Tier } from '../../types';
import { storage } from '../../utils/storage';
import styles from './TierManager.module.css';

export function TierManager() {
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [newTierName, setNewTierName] = useState('');
  const [editingTier, setEditingTier] = useState<Tier | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadedTiers = storage.getTiers();
    // Sort tiers by order when loading
    setTiers(loadedTiers.sort((a, b) => a.order - b.order));
  }, []);

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
      // Update existing tier
      const updatedTiers = tiers.map(tier =>
        tier.id === editingTier.id ? editingTier : tier
      );
      setTiers(updatedTiers);
      storage.setTiers(updatedTiers);
      setEditingTier(null);
    } else {
      // Add new tier
      const newTier: Tier = {
        id: crypto.randomUUID(),
        name: newTierName.trim(),
        order: getNextOrder(),
      };
      const updatedTiers = [...tiers, newTier];
      setTiers(updatedTiers);
      storage.setTiers(updatedTiers);
      setNewTierName('');
    }
  };

  const handleDelete = (tierId: string) => {
    if (!confirm('Are you sure you want to delete this tier?')) return;
    
    const updatedTiers = tiers.filter(tier => tier.id !== tierId);
    setTiers(updatedTiers);
    storage.setTiers(updatedTiers);
  };

  const handleMoveUp = (index: number) => {
    if (index <= 0) return;
    
    const updatedTiers = [...tiers];
    const currentTier = updatedTiers[index];
    const prevTier = updatedTiers[index - 1];
    
    // Swap orders
    const tempOrder = currentTier.order;
    currentTier.order = prevTier.order;
    prevTier.order = tempOrder;
    
    // Swap positions in array
    updatedTiers[index] = prevTier;
    updatedTiers[index - 1] = currentTier;
    
    setTiers(updatedTiers);
    storage.setTiers(updatedTiers);
  };

  const handleMoveDown = (index: number) => {
    if (index >= tiers.length - 1) return;
    
    const updatedTiers = [...tiers];
    const currentTier = updatedTiers[index];
    const nextTier = updatedTiers[index + 1];
    
    // Swap orders
    const tempOrder = currentTier.order;
    currentTier.order = nextTier.order;
    nextTier.order = tempOrder;
    
    // Swap positions in array
    updatedTiers[index] = nextTier;
    updatedTiers[index + 1] = currentTier;
    
    setTiers(updatedTiers);
    storage.setTiers(updatedTiers);
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
                onClick={() => handleDelete(tier.id)}
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