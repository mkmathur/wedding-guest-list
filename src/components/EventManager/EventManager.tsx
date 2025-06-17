import { useState } from 'react';
import type { EventManagerProps, Event, CategoryTierSelection } from '../../types/event';
import { EventForm } from './EventForm';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import styles from './EventManager.module.css';

export function EventManager({
  events,
  categories,
  tiers,
  households,
  selectedEventId,
  onAdd,
  onEdit,
  onDelete,
  onSelect,
  onPreviewChange
}: EventManagerProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  // Calculate guest count for an event
  const calculateGuestCount = (event: Event) => {
    return event.selections.reduce((total: number, selection: CategoryTierSelection) => {
      const categoryHouseholds = households.filter(
        h => h.categoryId === selection.categoryId &&
        selection.selectedTierIds.includes(h.tierId)
      );
      return total + categoryHouseholds.reduce((sum, h) => sum + h.guestCount, 0);
    }, 0);
  };

  const handleSubmit = (formData: Omit<Event, 'id'>) => {
    if (editingEvent) {
      onEdit(editingEvent.id, formData);
      setEditingEvent(null);
    } else {
      onAdd(formData);
      setIsCreating(false);
    }
    // Clear preview when form is submitted
    if (onPreviewChange) {
      onPreviewChange(null);
    }
  };

  const handleCancel = () => {
    setEditingEvent(null);
    setIsCreating(false);
    // Clear preview when form is cancelled
    if (onPreviewChange) {
      onPreviewChange(null);
    }
  };

  const handlePreviewChange = (selections: CategoryTierSelection[]) => {
    if (onPreviewChange) {
      onPreviewChange(selections);
    }
  };

  return (
    <div className={styles.eventManager}>
      {!isCreating && !editingEvent && (
        <button
          className={styles.newEventButton}
          onClick={() => setIsCreating(true)}
        >
          + New Event
        </button>
      )}

      {(isCreating || editingEvent) ? (
        <EventForm
          categories={categories}
          tiers={tiers}
          households={households}
          event={editingEvent || undefined}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          onPreviewChange={handlePreviewChange}
        />
      ) : (
        <div className={styles.eventList}>
          {events.map(event => (
            <div 
              key={event.id} 
              className={`${styles.eventCard} ${selectedEventId === event.id ? styles.selected : ''}`}
              onClick={() => onSelect(event.id)}
            >
              <div className={styles.eventInfo}>
                <h3 className={styles.eventName}>{event.name}</h3>
                <span className={styles.guestCount}>
                  {calculateGuestCount(event)} guests
                </span>
              </div>
              <div className={styles.actions}>
                <button
                  className={styles.editButton}
                  onClick={() => setEditingEvent(event)}
                  title="Edit event"
                  aria-label="Edit event"
                >
                  <FiEdit2 />
                </button>
                <button
                  className={styles.deleteButton}
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this event?')) {
                      onDelete(event.id);
                    }
                  }}
                  title="Delete event"
                  aria-label="Delete event"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 