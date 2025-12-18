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
  // Calculate total invited guests (not including expected counts)
  const totalGuests = breakdown.bride + breakdown.groom + breakdown.both + breakdown.unspecified;
  
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
    <div className={styles.breakdownBar} data-testid="breakdown-bar">
      <div className={styles.barContainer}>
        {activeSides.map(side => {
          const invitedCount = breakdown[side.key];
          const expectedCount = breakdown[`${side.key}Expected` as keyof typeof breakdown];
          const percentage = Math.round((invitedCount / totalGuests) * 100);
          const expectedPercentage = (expectedCount / invitedCount) * 100;
          
          return (
            <div
              key={side.key}
              className={styles.segment}
              style={{ width: `${percentage}%` }}
            >
              {/* Expected portion (full color) */}
              <div
                className={styles.expectedPortion}
                style={{
                  width: `${expectedPercentage}%`,
                  backgroundColor: side.color
                }}
              />
              {/* Uncertain portion (lighter color) */}
              <div
                className={styles.uncertainPortion}
                style={{
                  width: `${100 - expectedPercentage}%`,
                  backgroundColor: side.color,
                  opacity: 0.3
                }}
              />
            </div>
          );
        })}
      </div>
      
      <div className={styles.labelsContainer}>
        {activeSides.map(side => {
          const invitedCount = breakdown[side.key];
          const expectedCount = breakdown[`${side.key}Expected` as keyof typeof breakdown];
          const percentage = Math.round((invitedCount / totalGuests) * 100);
          
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
                {side.label}: {invitedCount} invited → {expectedCount} expected
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
} 