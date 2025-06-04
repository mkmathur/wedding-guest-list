import { useState, useEffect } from 'react'
import styles from './App.module.css'
import { CategoryManager } from './components/CategoryManager/CategoryManager'
import { TierManager } from './components/TierManager/TierManager'
import { HouseholdManager } from './components/HouseholdManager/HouseholdManager'
import { storage } from './utils/storage'

function App() {
  const [totalGuests, setTotalGuests] = useState(0);

  useEffect(() => {
    // Update total guests whenever households change
    const updateTotalGuests = () => {
      const households = storage.getHouseholds();
      setTotalGuests(households.reduce((sum, h) => sum + h.guestCount, 0));
    };

    // Initial count
    updateTotalGuests();

    // Listen for storage changes
    window.addEventListener('storage', updateTotalGuests);
    return () => window.removeEventListener('storage', updateTotalGuests);
  }, []);

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Wedding Guest List</h1>
        </div>
      </header>

      {/* Quick Actions Bar */}
      <div className={styles.quickActions}>
        <div className={styles.quickActionsContent}>
          <div className={styles.buttonGroup}>
            <button className={styles.primaryButton}>
              + New Household
            </button>
            <button className={styles.secondaryButton}>
              Export
            </button>
          </div>
          <div>
            Total Guests: {totalGuests}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className={styles.mainContent}>
        <div className={styles.panels}>
          {/* Left Panel - Categories & Tiers */}
          <div className={styles.leftPanel}>
            <section>
              <h2 className={styles.panelTitle}>Categories</h2>
              <CategoryManager />
            </section>
            <section>
              <h2 className={styles.panelTitle}>Tiers</h2>
              <TierManager />
            </section>
          </div>

          {/* Middle Panel - Household List */}
          <div className={styles.middlePanel}>
            <h2 className={styles.panelTitle}>Households</h2>
            <HouseholdManager />
          </div>

          {/* Right Panel - Scenarios */}
          <div className={styles.rightPanel}>
            <h2 className={styles.panelTitle}>Scenarios</h2>
            {/* Content will be added in next phase */}
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
