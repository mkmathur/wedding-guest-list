import { useState, useEffect } from 'react'
import styles from './App.module.css'
import { CategoryManager } from './components/CategoryManager/CategoryManager'
import { TierManager } from './components/TierManager/TierManager'
import { HouseholdManager } from './components/HouseholdManager/HouseholdManager'
import { EventManager } from './components/EventManager/EventManager'
import { storage } from './utils/storage'
import type { Tier, Household, Event } from './types'
import { useCategories } from './hooks/useCategories'
import { useTiers } from './hooks/useTiers'
import { useHouseholds } from './hooks/useHouseholds'
import { useEvents } from './hooks/useEvents'

function App() {
  const {
    categories,
    addCategory,
    editCategory,
    deleteCategory,
  } = useCategories();
  const {
    tiers,
    addTier,
    editTier,
    deleteTier,
    moveTier,
  } = useTiers();
  const {
    households,
    addHousehold,
    editHousehold,
    deleteHousehold,
  } = useHouseholds();
  const {
    events,
    addEvent,
    editEvent,
    deleteEvent,
  } = useEvents();
  const [totalGuests, setTotalGuests] = useState(0);

  // Update total guests whenever households change
  useEffect(() => {
    setTotalGuests(households.reduce((sum, h) => sum + h.guestCount, 0));
  }, [households]);

  // Category handlers
  const handleDeleteCategory = (categoryId: string) => {
    if (households.some(h => h.categoryId === categoryId)) {
      alert('Cannot delete category that has households assigned to it');
      return;
    }
    deleteCategory(categoryId);
  };

  // Tier handlers
  const handleDeleteTier = (tierId: string) => {
    if (households.some(h => h.tierId === tierId)) {
      alert('Cannot delete tier that has households assigned to it');
      return;
    }
    deleteTier(tierId);
  };

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1>Wedding Guest List</h1>
        <div className={styles.totalGuests}>
          Total Guests: {totalGuests}
        </div>
      </header>

      <main className={styles.mainContent}>
        <div className={styles.panels}>
          {/* Left Panel - Categories & Tiers */}
          <div className={styles.leftPanel}>
            <section>
              <h2 className={styles.panelTitle}>Categories</h2>
              <CategoryManager
                categories={categories}
                onAdd={addCategory}
                onEdit={editCategory}
                onDelete={handleDeleteCategory}
              />
            </section>
            <section>
              <h2 className={styles.panelTitle}>Tiers</h2>
              <TierManager
                tiers={tiers}
                onAdd={addTier}
                onEdit={editTier}
                onDelete={handleDeleteTier}
                onMoveUp={(tierId) => moveTier(tierId, 'up')}
                onMoveDown={(tierId) => moveTier(tierId, 'down')}
              />
            </section>
          </div>

          {/* Middle Panel - Household List */}
          <div className={styles.middlePanel}>
            <h2 className={styles.panelTitle}>Households</h2>
            <HouseholdManager
              households={households}
              categories={categories}
              tiers={tiers}
              onAdd={addHousehold}
              onEdit={editHousehold}
              onDelete={deleteHousehold}
            />
          </div>

          {/* Right Panel - Events */}
          <div className={styles.rightPanel}>
            <h2 className={styles.panelTitle}>Events</h2>
            <EventManager
              events={events}
              categories={categories}
              tiers={tiers}
              households={households}
              onAdd={addEvent}
              onEdit={editEvent}
              onDelete={deleteEvent}
            />
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
