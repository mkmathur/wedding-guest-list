import { useState, useEffect } from 'react'
import styles from './App.module.css'
import { CategoryManager } from './components/CategoryManager/CategoryManager'
import { TierManager } from './components/TierManager/TierManager'
import { HouseholdManager } from './components/HouseholdManager/HouseholdManager'
import { EventManager } from './components/EventManager/EventManager'
import { storage } from './utils/storage'
import type { Category, Tier, Household } from './types'
import type { Event } from './types/event'

function App() {
  // State
  const [categories, setCategories] = useState<Category[]>([]);
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [households, setHouseholds] = useState<Household[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [totalGuests, setTotalGuests] = useState(0);

  // Initial data load
  useEffect(() => {
    setCategories(storage.getCategories());
    setTiers(storage.getTiers());
    setHouseholds(storage.getHouseholds());
    setEvents(storage.getEvents());
  }, []);

  // Update total guests whenever households change
  useEffect(() => {
    setTotalGuests(households.reduce((sum, h) => sum + h.guestCount, 0));
  }, [households]);

  // Category handlers
  const handleAddCategory = (name: string) => {
    const newCategory: Category = {
      id: crypto.randomUUID(),
      name: name.trim()
    };
    const updatedCategories = [...categories, newCategory];
    setCategories(updatedCategories);
    storage.setCategories(updatedCategories);
  };

  const handleEditCategory = (categoryId: string, name: string) => {
    const updatedCategories = categories.map(cat =>
      cat.id === categoryId ? { ...cat, name: name.trim() } : cat
    );
    setCategories(updatedCategories);
    storage.setCategories(updatedCategories);
  };

  const handleDeleteCategory = (categoryId: string) => {
    if (households.some(h => h.categoryId === categoryId)) {
      alert('Cannot delete category that has households assigned to it');
      return;
    }
    const updatedCategories = categories.filter(cat => cat.id !== categoryId);
    setCategories(updatedCategories);
    storage.setCategories(updatedCategories);
  };

  // Tier handlers
  const handleAddTier = (name: string) => {
    const newTier: Tier = {
      id: crypto.randomUUID(),
      name: name.trim()
    };
    const updatedTiers = [...tiers, newTier];
    setTiers(updatedTiers);
    storage.setTiers(updatedTiers);
  };

  const handleEditTier = (tierId: string, name: string) => {
    const updatedTiers = tiers.map(tier =>
      tier.id === tierId ? { ...tier, name: name.trim() } : tier
    );
    setTiers(updatedTiers);
    storage.setTiers(updatedTiers);
  };

  const handleDeleteTier = (tierId: string) => {
    if (households.some(h => h.tierId === tierId)) {
      alert('Cannot delete tier that has households assigned to it');
      return;
    }
    const updatedTiers = tiers.filter(tier => tier.id !== tierId);
    setTiers(updatedTiers);
    storage.setTiers(updatedTiers);
  };

  const handleMoveTier = (tierId: string, direction: 'up' | 'down') => {
    const currentIndex = tiers.findIndex(t => t.id === tierId);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= tiers.length) return;

    const updatedTiers = [...tiers];
    [updatedTiers[currentIndex], updatedTiers[newIndex]] = 
      [updatedTiers[newIndex], updatedTiers[currentIndex]];

    setTiers(updatedTiers);
    storage.setTiers(updatedTiers);
  };

  // Household handlers
  const handleAddHousehold = (household: Omit<Household, 'id'>) => {
    const newHousehold: Household = {
      id: crypto.randomUUID(),
      ...household
    };
    const updatedHouseholds = [...households, newHousehold];
    setHouseholds(updatedHouseholds);
    storage.setHouseholds(updatedHouseholds);
  };

  const handleEditHousehold = (householdId: string, updates: Partial<Household>) => {
    const updatedHouseholds = households.map(h =>
      h.id === householdId ? { ...h, ...updates } : h
    );
    setHouseholds(updatedHouseholds);
    storage.setHouseholds(updatedHouseholds);
  };

  const handleDeleteHousehold = (householdId: string) => {
    const updatedHouseholds = households.filter(h => h.id !== householdId);
    setHouseholds(updatedHouseholds);
    storage.setHouseholds(updatedHouseholds);
  };

  // Event handlers
  const handleAddEvent = (event: Omit<Event, 'id'>) => {
    const newEvent: Event = {
      id: crypto.randomUUID(),
      ...event
    };
    const updatedEvents = [...events, newEvent];
    setEvents(updatedEvents);
    storage.setEvents(updatedEvents);
  };

  const handleEditEvent = (eventId: string, updates: Partial<Event>) => {
    const updatedEvents = events.map(e =>
      e.id === eventId ? { ...e, ...updates } : e
    );
    setEvents(updatedEvents);
    storage.setEvents(updatedEvents);
  };

  const handleDeleteEvent = (eventId: string) => {
    const updatedEvents = events.filter(e => e.id !== eventId);
    setEvents(updatedEvents);
    storage.setEvents(updatedEvents);
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
                onAdd={handleAddCategory}
                onEdit={handleEditCategory}
                onDelete={handleDeleteCategory}
              />
            </section>
            <section>
              <h2 className={styles.panelTitle}>Tiers</h2>
              <TierManager
                tiers={tiers}
                onAdd={handleAddTier}
                onEdit={handleEditTier}
                onDelete={handleDeleteTier}
                onMoveUp={(tierId) => handleMoveTier(tierId, 'up')}
                onMoveDown={(tierId) => handleMoveTier(tierId, 'down')}
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
              onAdd={handleAddHousehold}
              onEdit={handleEditHousehold}
              onDelete={handleDeleteHousehold}
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
              onAdd={handleAddEvent}
              onEdit={handleEditEvent}
              onDelete={handleDeleteEvent}
            />
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
