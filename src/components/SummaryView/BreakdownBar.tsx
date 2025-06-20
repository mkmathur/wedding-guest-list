import type { SideBreakdown } from '../../utils/guestCounts';
import type { CategorySide } from '../../types';
import { GuestSideIcon } from '../shared/GuestSideIcon';
import styles from './BreakdownBar.module.css';

interface BreakdownBarProps {
  breakdown: SideBreakdown;
}

interface SideInfo {
  key: keyof SideBreakdown;
  label: string;
  side: CategorySide;
  color: string;
}

const SIDE_INFO: SideInfo[] = [
  { key: 'bride', label: 'Bride', side: 'bride', color: 'var(--color-bride)' },
  { key: 'groom', label: 'Groom', side: 'groom', color: 'var(--color-groom)' },
  { key: 'both', label: 'Both', side: 'both', color: 'var(--color-accent)' },
  { key: 'unspecified', label: 'Unspecified', side: 'unspecified', color: 'var(--color-text-secondary)' }
];

export function BreakdownBar({ breakdown }: BreakdownBarProps) {
  const totalGuests = Object.values(breakdown).reduce((sum, count) => sum + count, 0);
  
  // If no guests, show empty state
  if (totalGuests === 0) {
    return (
      <div className={styles.breakdownBar}>
        <div className={styles.emptyState}>
          No guests to display
        </div>
      </div>
    );
  }

  // Filter out sides with 0 guests
  const activeSides = SIDE_INFO.filter(side => breakdown[side.key] > 0);
  
  return (
    <div className={styles.breakdownBar}>
      <div className={styles.barContainer}>
        {activeSides.map(side => {
          const count = breakdown[side.key];
          const percentage = Math.round((count / totalGuests) * 100);
          
          return (
            <div
              key={side.key}
              className={styles.segment}
              style={{
                width: `${percentage}%`,
                backgroundColor: side.color
              }}
            />
          );
        })}
      </div>
      
      <div className={styles.labelsContainer}>
        {activeSides.map(side => {
          const count = breakdown[side.key];
          const percentage = Math.round((count / totalGuests) * 100);
          
          return (
            <div
              key={side.key}
              className={styles.label}
              style={{ width: `${percentage}%` }}
            >
              <span className={styles.emoji}>
                <GuestSideIcon side={side.side} size="1.125rem" />
              </span>
              <span className={styles.labelText}>
                {side.label}: {count} guest{count !== 1 ? 's' : ''} ({percentage}%)
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
} 