import { useState, useEffect } from 'react';
import { 
  DndContext, 
  DragOverlay, 
  useDraggable,
  useDroppable,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import type { Household, Category, Tier } from '../../types';
import type { Event } from '../../types/event';
import { FiUpload, FiMenu } from 'react-icons/fi';
import { BulkImportModal } from './BulkImportModal';
import { HouseholdEditModal } from './HouseholdEditModal';
import styles from './HouseholdManager.module.css';

interface HouseholdFormData {
  name: string;
  guestCount: string;
  categoryId: string;
  tierId: string;
}

interface HouseholdManagerProps {
  households: Household[];
  categories: Category[];
  tiers: Tier[];
  selectedEvent?: Event;
  previewSelections?: Event['selections'] | null;
  onAdd: (household: Omit<Household, 'id'>) => void;
  onAddMultiple: (households: Omit<Household, 'id'>[]) => void;
  onEdit: (id: string, household: Omit<Household, 'id'>) => void;
  onDelete: (id: string) => void;
  onAddCategory: (name: string) => void;
  onAddCategories: (names: string[]) => Promise<Category[]>;
}

// Draggable Household Card Component
function DraggableHouseholdCard({ 
  household, 
  onEdit 
}: { 
  household: Household; 
  onEdit: (household: Household) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: `household-${household.id}`,
    data: {
      type: 'household',
      household,
    },
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div 
      ref={setNodeRef}
      style={style}
      className={`${styles.householdCard} ${isDragging ? styles.dragging : ''}`}
      data-household-id={household.id}
    >
      <div 
        className={styles.householdContent}
        onClick={() => onEdit(household)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onEdit(household);
          }
        }}
        role="button"
        tabIndex={0}
        aria-label={`Edit ${household.name} household`}
      >
        <div className={styles.householdInfo}>
          <span className={styles.householdName}>{household.name}</span>
          <span className={styles.guestCount}>
            {household.guestCount} {household.guestCount === 1 ? 'guest' : 'guests'}
          </span>
        </div>
      </div>
      <div 
        className={styles.dragHandle} 
        aria-label="Drag handle"
        {...listeners}
        {...attributes}
      >
        <FiMenu />
      </div>
    </div>
  );
}

// Droppable Tier Column Component
function DroppableTierColumn({ 
  tier, 
  categoryId, 
  households, 
  onEditHousehold,
  isIncludedInSelectedEvent = true
}: { 
  tier: Tier; 
  categoryId: string; 
  households: Household[]; 
  onEditHousehold: (household: Household) => void;
  isIncludedInSelectedEvent?: boolean;
}) {
  const {
    setNodeRef,
    isOver,
  } = useDroppable({
    id: `tier-${tier.id}-category-${categoryId}`,
    data: {
      type: 'tier',
      tier,
      categoryId,
    },
  });

  return (
    <div 
      ref={setNodeRef}
      className={`${styles.tierColumn} ${isOver ? styles.dropZoneActive : ''} ${!isIncludedInSelectedEvent ? styles.dimmed : ''}`}
      data-tier-id={tier.id}
      data-category-id={categoryId}
    >
      <h4 className={styles.tierColumnHeader}>{tier.name}</h4>
      <div className={styles.tierColumnContent}>
        {households.length > 0 ? (
          households.map(household => (
            <DraggableHouseholdCard
              key={household.id}
              household={household}
              onEdit={onEditHousehold}
            />
          ))
        ) : (
          <div className={styles.emptyColumnPlaceholder}>---</div>
        )}
      </div>
    </div>
  );
}

export function HouseholdManager({ 
  households,
  categories,
  tiers,
  selectedEvent,
  previewSelections,
  onAdd,
  onAddMultiple,
  onEdit,
  onDelete,
  onAddCategory,
  onAddCategories,
}: HouseholdManagerProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [editingHousehold, setEditingHousehold] = useState<Household | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [formData, setFormData] = useState<HouseholdFormData>({
    name: '',
    guestCount: '1',
    categoryId: '',
    tierId: '',
  });
  const [error, setError] = useState('');

  // Helper function to check if a category/tier is included in preview or selected event
  const isIncludedInEvent = (categoryId: string, tierId: string): boolean => {
    // Preview selections take precedence over selected event
    const activeSelections = previewSelections || selectedEvent?.selections;
    
    if (!activeSelections) return true; // If no event/preview active, show all normally
    
    return activeSelections.some(selection => 
      selection.categoryId === categoryId && 
      selection.selectedTierIds.includes(tierId)
    );
  };

  // Configure sensors for drag activation
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useEffect(() => {
    if (categories.length > 0 && tiers.length > 0) {
      setFormData(prev => ({
        ...prev,
        categoryId: categories[0].id,
        tierId: tiers[0].id,
      }));
    }
  }, [categories, tiers]);

  const resetForm = () => {
    setFormData({
      name: '',
      guestCount: '1',
      categoryId: categories[0]?.id || '',
      tierId: tiers[0]?.id || '',
    });
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const householdData = {
      ...formData,
      guestCount: parseInt(formData.guestCount)
    };

    onAdd(householdData);
    setIsCreating(false);
    resetForm();
  };

  const handleCancel = () => {
    setIsCreating(false);
    resetForm();
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Household name is required');
      return false;
    }
    const guestCount = parseInt(formData.guestCount);
    if (isNaN(guestCount) || guestCount < 1) {
      setError('Guest count must be at least 1');
      return false;
    }
    if (!formData.categoryId) {
      setError('Please select a category');
      return false;
    }
    if (!formData.tierId) {
      setError('Please select a tier');
      return false;
    }
    
    // Check for duplicate names
    const isDuplicate = households.some(
      h => h.name.toLowerCase().trim() === formData.name.toLowerCase().trim()
    );
    if (isDuplicate) {
      setError('A household with this name already exists');
      return false;
    }

    setError('');
    return true;
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Extract household ID from active element
    const householdId = activeId.replace('household-', '');
    
    // Extract tier ID and category ID from drop zone
    const tierCategoryMatch = overId.match(/^tier-(.+)-category-(.+)$/);
    if (!tierCategoryMatch) return;
    
    const [, newTierId, newCategoryId] = tierCategoryMatch;
    
    // Find the household being dragged
    const household = households.find(h => h.id === householdId);
    if (!household) return;

    // Only allow drops within the same category
    if (household.categoryId !== newCategoryId) return;

    // Only update if the tier is actually different
    if (household.tierId !== newTierId) {
      onEdit(householdId, {
        ...household,
        tierId: newTierId,
      });
    }
  };

  // Get active household for drag overlay
  const activeHousehold = activeId 
    ? households.find(h => h.id === activeId.replace('household-', ''))
    : null;

  // Group households by category, then by tier within each category
  const householdsByCategory = categories.map(category => {
    const categoryHouseholds = households.filter(h => h.categoryId === category.id);
    
    // Group households within this category by tier
    const householdsByTier = tiers.map(tier => ({
      tier,
      households: categoryHouseholds.filter(h => h.tierId === tier.id),
    }));

    return {
      category,
      tierGroups: householdsByTier,
    };
  });

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className={styles.householdManager}>
        <div className={styles.buttonGroup}>
          {!isCreating && (
            <>
              <button
                className={styles.newHouseholdButton}
                onClick={() => setIsCreating(true)}
              >
                + New Household
              </button>
              <button
                className={styles.importButton}
                onClick={() => setIsImporting(true)}
                title="Bulk import households"
              >
                <FiUpload className={styles.buttonIcon} />
                Bulk Import
              </button>
            </>
          )}
        </div>

        {isCreating && (
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="name">Household Name:</label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={e => {
                  setFormData(prev => ({ ...prev, name: e.target.value }));
                  if (error) validateForm();
                }}
                className={styles.input}
                placeholder="Enter household name"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="guestCount">Number of Guests:</label>
              <input
                id="guestCount"
                type="number"
                min="1"
                value={formData.guestCount}
                onChange={e => setFormData(prev => ({ ...prev, guestCount: e.target.value }))}
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="category">Category:</label>
              <select
                id="category"
                value={formData.categoryId}
                onChange={e => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
                className={styles.select}
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="tier">Tier:</label>
              <select
                id="tier"
                value={formData.tierId}
                onChange={e => setFormData(prev => ({ ...prev, tierId: e.target.value }))}
                className={styles.select}
              >
                {tiers.map(tier => (
                  <option key={tier.id} value={tier.id}>
                    {tier.name}
                  </option>
                ))}
              </select>
            </div>

            {error && <div className={styles.error}>{error}</div>}
            <div className={styles.buttonGroup}>
              <button type="submit" className={styles.submitButton}>
                Add Household
              </button>
              <button
                type="button"
                className={styles.cancelButton}
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className={styles.householdList}>
          {householdsByCategory.map(({ category, tierGroups }) => (
            <div key={category.id} className={styles.categoryGroup}>
              <h3 className={styles.categoryTitle}>{category.name}</h3>
              <div className={`${styles.kanbanBoard} ${(selectedEvent || previewSelections) ? styles.eventFilterActive : ''}`} data-category-id={category.id}>
                {tierGroups.map(({ tier, households: tierHouseholds }) => (
                  <DroppableTierColumn
                    key={tier.id}
                    tier={tier}
                    categoryId={category.id}
                    households={tierHouseholds}
                    onEditHousehold={setEditingHousehold}
                    isIncludedInSelectedEvent={isIncludedInEvent(category.id, tier.id)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Drag Overlay */}
        <DragOverlay>
          {activeHousehold ? (
            <div className={`${styles.householdCard} ${styles.dragOverlay}`}>
              <div className={styles.householdContent}>
                <div className={styles.householdInfo}>
                  <span className={styles.householdName}>{activeHousehold.name}</span>
                  <span className={styles.guestCount}>
                    {activeHousehold.guestCount} {activeHousehold.guestCount === 1 ? 'guest' : 'guests'}
                  </span>
                </div>
              </div>
              <div className={styles.dragHandle}>
                <FiMenu />
              </div>
            </div>
          ) : null}
        </DragOverlay>

        <BulkImportModal
          isOpen={isImporting}
          onClose={() => setIsImporting(false)}
          onImport={households => {
            try {
              // Validate all households first
              households.forEach(household => {
                if (!household.categoryId || !household.tierId) {
                  throw new Error(
                    `Invalid household data: ${JSON.stringify(household)}`
                  );
                }
              });
              
              onAddMultiple(households);
              setIsImporting(false);
            } catch (err) {
              console.error('Failed to import households:', err);
              // You might want to show an error message to the user here
            }
          }}
          existingCategories={categories}
          existingTiers={tiers}
          onAddCategories={onAddCategories}
        />

        <HouseholdEditModal
          isOpen={!!editingHousehold}
          household={editingHousehold}
          categories={categories}
          tiers={tiers}
          onClose={() => setEditingHousehold(null)}
          onSave={onEdit}
          onDelete={onDelete}
        />
      </div>
    </DndContext>
  );
} 