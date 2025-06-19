import { generateSummaryData, calculateSideBreakdown } from '../../utils/guestCounts';
import type { Household, Category, Tier } from '../../types';
import type { Event } from '../../types/event';
import { BreakdownBar } from './BreakdownBar';
import styles from './SummaryView.module.css';

interface SummaryViewProps {
  households: Household[];
  categories: Category[];
  tiers: Tier[];
  selectedEvent?: Event;
  previewSelections?: Event['selections'] | null;
}

export function SummaryView({ 
  households, 
  categories, 
  tiers, 
  selectedEvent,
  previewSelections 
}: SummaryViewProps) {
  // Use preview selections if available, otherwise use selected event selections
  const activeSelections = previewSelections || selectedEvent?.selections;
  
  const summaryData = generateSummaryData(
    households, 
    categories, 
    tiers, 
    activeSelections
  );

  // Calculate side breakdown for the breakdown bar
  const sideBreakdown = calculateSideBreakdown(
    households,
    categories,
    activeSelections
  );

  // Check if event filtering is active (some cells are included, some are not)
  const isEventFilterActive = activeSelections && summaryData.some(row => 
    row.tierCounts.some(cell => cell.isIncluded) && 
    row.tierCounts.some(cell => !cell.isIncluded)
  );

  // If no data, show empty state
  if (categories.length === 0 || tiers.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>No categories or tiers available to display summary.</p>
      </div>
    );
  }

  return (
    <div className={styles.summaryView}>
      {/* Add the breakdown bar above the grid */}
      <BreakdownBar breakdown={sideBreakdown} />
      
      <div className={`${styles.gridContainer} ${activeSelections ? styles.eventFilterActive : ''}`}>
        {/* Header row with tier names */}
        <div className={styles.gridHeader}>
          <div className={styles.cornerCell}></div>
          {tiers.map(tier => (
            <div key={tier.id} className={styles.headerCell}>
              {tier.name}
            </div>
          ))}
        </div>

        {/* Data rows */}
        {summaryData.map(({ category, tierCounts }) => (
          <div key={category.id} className={styles.gridRow}>
            {/* Category name cell */}
            <div className={styles.categoryCell}>
              {category.name}
            </div>
            
            {/* Guest count cells */}
            {tierCounts.map(({ tier, guestCount, isIncluded }) => (
              <div 
                key={tier.id} 
                className={`${styles.countCell} ${!isIncluded ? styles.dimmed : ''}`}
              >
                {guestCount > 0 ? `${guestCount} guests` : '—'}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
} 