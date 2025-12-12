import { useState, useEffect } from 'react'
import styles from './App.module.css'
import { CategoryManager } from './components/CategoryManager/CategoryManager'
import { TierManager } from './components/TierManager/TierManager'
import { HouseholdManager } from './components/HouseholdManager/HouseholdManager'
import { EventManager } from './components/EventManager/EventManager'
import { ExportBackupButton } from './components/ExportBackupButton/ExportBackupButton'
import { ImportBackupButton } from './components/ImportBackupButton/ImportBackupButton'
import { CsvExportButton } from './components/CsvExportButton/CsvExportButton'
import { storage } from './utils/storage'
import type { Category, CategorySide, Tier, Household } from './types'
import type { Event } from './types/event'

function App() {
  // State
  const [categories, setCategories] = useState<Category[]>([]);
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [households, setHouseholds] = useState<Household[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [totalGuests, setTotalGuests] = useState(0);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [previewSelections, setPreviewSelections] = useState<Event['selections'] | null>(null);
  
  // Panel collapse state
  const [isLeftPanelCollapsed, setIsLeftPanelCollapsed] = useState(false);
  const [isRightPanelCollapsed, setIsRightPanelCollapsed] = useState(false);
  
  // Summary mode state
  const [isSummaryMode, setIsSummaryMode] = useState(false);
  
  // Category selection state for filtering
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

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
  const handleAddCategory = (name: string, side: CategorySide) => {
    const newCategory: Category = {
      id: crypto.randomUUID(),
      name: name.trim(),
      side
    };
    const updatedCategories = [...categories, newCategory];
    setCategories(updatedCategories);
    storage.setCategories(updatedCategories);
  };

  const handleAddCategories = (names: string[]): Promise<Category[]> => {
    return new Promise((resolve) => {
      const newCategories: Category[] = names.map(name => ({
        id: crypto.randomUUID(),
        name: name.trim(),
        side: 'unspecified' as CategorySide
      }));
      const updatedCategories = [...categories, ...newCategories];
      setCategories(updatedCategories);
      storage.setCategories(updatedCategories);
      // Use setTimeout to ensure state updates are processed
      setTimeout(() => resolve(newCategories), 0);
    });
  };

  const handleEditCategory = (categoryId: string, name: string, side: CategorySide) => {
    const updatedCategories = categories.map(cat =>
      cat.id === categoryId ? { ...cat, name: name.trim(), side } : cat
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

  const handleAddMultipleHouseholds = (newHouseholds: Omit<Household, 'id'>[]) => {
    const householdsWithIds = newHouseholds.map(household => ({
      id: crypto.randomUUID(),
      ...household
    }));
    
    const updatedHouseholds = [...households, ...householdsWithIds];
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
    
    // Clear selection if deleting the selected event
    if (selectedEventId === eventId) {
      setSelectedEventId(null);
    }
  };

  const handleReorderEvent = (eventId: string, newIndex: number) => {
    const currentIndex = events.findIndex(e => e.id === eventId);
    if (currentIndex === -1 || currentIndex === newIndex) return;

    const updatedEvents = [...events];
    const [movedEvent] = updatedEvents.splice(currentIndex, 1);
    updatedEvents.splice(newIndex, 0, movedEvent);

    setEvents(updatedEvents);
    storage.setEvents(updatedEvents);
  };

  // Event selection handler
  const handleSelectEvent = (eventId: string) => {
    // Toggle selection: if same event is clicked, deselect it
    setSelectedEventId(selectedEventId === eventId ? null : eventId);
  };

  // Event preview handler
  const handleEventPreviewChange = (selections: Event['selections'] | null) => {
    setPreviewSelections(selections);
  };

  // Category selection handler
  const handleCategorySelect = (categoryId: string) => {
    // Only allow category selection in detailed view
    if (isSummaryMode) return;
    
    // Toggle selection: if same category is clicked, deselect it
    setSelectedCategoryId(selectedCategoryId === categoryId ? null : categoryId);
  };

  // Summary mode toggle handler with category selection clearing
  const handleSummaryModeToggle = (mode: boolean) => {
    setIsSummaryMode(mode);
    // Clear category selection when switching to summary mode
    if (mode) {
      setSelectedCategoryId(null);
    }
  };

  // Backup import handler
  const handleImportComplete = (
    importedHouseholds: Household[],
    importedCategories: Category[],
    importedTiers: Tier[],
    importedEvents: Event[]
  ) => {
    setHouseholds(importedHouseholds);
    setCategories(importedCategories);
    setTiers(importedTiers);
    setEvents(importedEvents);
  };

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1>Wedding Guest List</h1>
        <div className={styles.demoNotice}>
          📝 Demo App - Data stored locally in browser only
        </div>
        <div className={styles.headerActions}>
          <div className={styles.totalGuests}>
            Total Guests: {totalGuests}
          </div>
          <div className={styles.backupButtons}>
            <CsvExportButton
              households={households}
              categories={categories}
              tiers={tiers}
              events={events}
            />
            <ExportBackupButton
              households={households}
              categories={categories}
              tiers={tiers}
              events={events}
            />
            <ImportBackupButton
              onImportComplete={handleImportComplete}
            />
          </div>
        </div>
      </header>

      <main className={styles.mainContent}>
        <div className={`${styles.panels} ${isLeftPanelCollapsed ? styles.leftCollapsed : ''} ${isRightPanelCollapsed ? styles.rightCollapsed : ''}`}>
          {/* Left Panel - Categories & Tiers */}
          <div className={styles.leftPanel}>
            {isLeftPanelCollapsed ? (
              <div className={styles.collapsedPanel}>
                <button 
                  className={styles.expandButton}
                  onClick={() => setIsLeftPanelCollapsed(false)}
                  aria-label="Expand categories and tiers panel"
                  title="Expand categories and tiers panel"
                >
                  ▶
                </button>
                <div className={styles.collapsedLabel}>Categories & Tiers</div>
              </div>
            ) : (
              <>
                <div className={styles.panelHeader}>
                  <button 
                    className={styles.collapseButton}
                    onClick={() => setIsLeftPanelCollapsed(true)}
                    aria-label="Collapse categories and tiers panel"
                    title="Collapse panel"
                  >
                    ◀
                  </button>
                </div>
                <section>
                  <h2 className={styles.panelTitle}>Categories</h2>
                  <CategoryManager
                    categories={categories}
                    selectedCategoryId={selectedCategoryId}
                    isSummaryMode={isSummaryMode}
                    onAdd={handleAddCategory}
                    onEdit={handleEditCategory}
                    onDelete={handleDeleteCategory}
                    onCategorySelect={handleCategorySelect}
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
              </>
            )}
          </div>

          {/* Middle Panel - Household List */}
          <div className={styles.middlePanel}>
            <h2 className={styles.panelTitle}>Households</h2>
            <HouseholdManager
              households={households}
              categories={categories}
              tiers={tiers}
              selectedEvent={selectedEventId ? events.find(e => e.id === selectedEventId) : undefined}
              previewSelections={previewSelections}
              selectedCategoryId={selectedCategoryId}
              isSummaryMode={isSummaryMode}
              onSummaryModeToggle={handleSummaryModeToggle}
              onAdd={handleAddHousehold}
              onAddMultiple={handleAddMultipleHouseholds}
              onEdit={handleEditHousehold}
              onDelete={handleDeleteHousehold}
              onAddCategory={(name: string) => handleAddCategory(name, 'unspecified')}
              onAddCategories={handleAddCategories}
            />
          </div>

          {/* Right Panel - Events */}
          <div className={styles.rightPanel}>
            {isRightPanelCollapsed ? (
              <div className={styles.collapsedPanel}>
                <button 
                  className={styles.expandButton}
                  onClick={() => setIsRightPanelCollapsed(false)}
                  aria-label="Expand events panel"
                  title="Expand events panel"
                >
                  ◀
                </button>
                <div className={styles.collapsedLabel}>Events</div>
              </div>
            ) : (
              <>
                <div className={styles.panelHeader}>
                  <button 
                    className={styles.collapseButton}
                    onClick={() => setIsRightPanelCollapsed(true)}
                    aria-label="Collapse events panel"
                    title="Collapse panel"
                  >
                    ▶
                  </button>
                </div>
                <h2 className={styles.panelTitle}>Events</h2>
                <EventManager
                  events={events}
                  categories={categories}
                  tiers={tiers}
                  households={households}
                  selectedEventId={selectedEventId}
                  onAdd={handleAddEvent}
                  onEdit={handleEditEvent}
                  onDelete={handleDeleteEvent}
                  onSelect={handleSelectEvent}
                  onReorder={handleReorderEvent}
                  onPreviewChange={handleEventPreviewChange}
                />
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
