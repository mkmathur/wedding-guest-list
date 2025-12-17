import type { Tier, Household } from '../../types';
import styles from './TierManager.module.css';
import { FiTrash2, FiPlus } from 'react-icons/fi';

interface TierManagerProps {
  tiers: Tier[];
  households: Household[];
  onAdd: () => void;
  onDelete: (tierId: string) => void;
}

export function TierManager({
  tiers,
  households,
  onAdd,
  onDelete
}: TierManagerProps) {
  
  const canDeleteTier = (tier: Tier): boolean => {
    // Can only delete the last tier (highest number)
    const isLastTier = tier === tiers[tiers.length - 1];
    
    // Can't delete if households are assigned to this tier
    const hasHouseholds = households.some(h => h.tierId === tier.id);
    
    return isLastTier && !hasHouseholds;
  };
  
  const getDeleteTooltip = (tier: Tier): string => {
    const isLastTier = tier === tiers[tiers.length - 1];
    const hasHouseholds = households.some(h => h.tierId === tier.id);
    
    if (!isLastTier) {
      return 'Can only delete the last tier';
    }
    if (hasHouseholds) {
      return 'Cannot delete - households are assigned to this tier';
    }
    return 'Delete tier';
  };

  return (
    <div className={styles.tierManager}>
      <div className={styles.list}>
        {tiers.length === 0 ? (
          <div className={styles.emptyState}>
            <p>Tiers are automatically created (T1, T2, T3). Add more tiers as needed for your invitation priority levels.</p>
          </div>
        ) : (
          tiers.map((tier) => (
            <div key={tier.id} className={styles.tier}>
              <span className={styles.tierName}>{tier.name}</span>
              {tier === tiers[tiers.length - 1] && (
                <button
                  className={styles.deleteButton}
                  onClick={() => {
                    if (confirm(`Are you sure you want to delete ${tier.name}?`)) {
                      onDelete(tier.id);
                    }
                  }}
                  disabled={!canDeleteTier(tier)}
                  title={getDeleteTooltip(tier)}
                  aria-label={`Delete ${tier.name}`}
                >
                  <FiTrash2 />
                </button>
              )}
            </div>
          ))
        )}
      </div>
      
      <button
        className={styles.addTierLink}
        onClick={onAdd}
        title="Add new tier"
      >
        <FiPlus /> Add tier
      </button>
    </div>
  );
} 