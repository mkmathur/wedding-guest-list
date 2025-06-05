import { useState, useEffect } from 'react'
import styles from './App.module.css'
import { CategoryManager } from './components/CategoryManager/CategoryManager'
import { TierManager } from './components/TierManager/TierManager'
import { HouseholdManager } from './components/HouseholdManager/HouseholdManager'
import { storage } from './utils/storage'
import type { Category, Tier, Household } from './types'

function App() {
  // State
  const [categories, setCategories] = useState<Category[]>([]);
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [households, setHouseholds] = useState<Household[]>([]);
  const [totalGuests, setTotalGuests] = useState(0);

  // Initial data load
  useEffect(() => {
    setCategories(storage.getCategories());
    setTiers(storage.getTiers());
    setHouseholds(storage.getHouseholds());
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
    const updatedHouseholds = households.map(household =>
      household.id === householdId ? { ...household, ...updates } : household
    );
    setHouseholds(updatedHouseholds);
    storage.setHouseholds(updatedHouseholds);
  };

  const handleDeleteHousehold = (householdId: string) => {
    const updatedHouseholds = households.filter(h => h.id !== householdId);
    setHouseholds(updatedHouseholds);
    storage.setHouseholds(updatedHouseholds);
  };

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
