import { useState } from 'react';
import type { EventManagerProps, Event, CategoryTierSelection } from '../../types/event';
import { EventForm } from './EventForm';
import { calculateExpectedAttendance, calculateInvitedCount } from '../../utils/expectedAttendance';
import { FiEdit2, FiTrash2, FiMenu } from 'react-icons/fi';
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  DragOverlay
} from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
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
  onReorder,
  onPreviewChange
}: EventManagerProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );


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

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(String(event.active.id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = events.findIndex(e => e.id === active.id);
    const newIndex = events.findIndex(e => e.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      onReorder(String(active.id), newIndex);
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
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={events.map(e => e.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className={styles.eventList}>
              {events.map(event => (
                <SortableEventCard
                  key={event.id}
                  event={event}
                  isSelected={selectedEventId === event.id}
                  households={households}
                  onSelect={onSelect}
                  onEdit={setEditingEvent}
                  onDelete={onDelete}
                />
              ))}
            </div>
          </SortableContext>
          <DragOverlay>
            {activeId ? (
              <EventCardOverlay
                event={events.find(e => e.id === activeId)!}
                households={households}
              />
            ) : null}
          </DragOverlay>
        </DndContext>
      )}
    </div>
  );
}

interface SortableEventCardProps {
  event: Event;
  isSelected: boolean;
  households: EventManagerProps['households'];
  onSelect: (eventId: string) => void;
  onEdit: (event: Event) => void;
  onDelete: (eventId: string) => void;
}

function SortableEventCard({
  event,
  isSelected,
  households,
  onSelect,
  onEdit,
  onDelete
}: SortableEventCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: event.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      className={`${styles.eventCard} ${isSelected ? styles.selected : ''} ${isDragging ? styles.dragging : ''}`}
      style={style}
    >
      <div
        {...attributes}
        {...listeners}
        className={styles.dragHandle}
        title="Drag to reorder"
      >
        <FiMenu />
      </div>
      <div 
        className={styles.eventContent}
        onClick={() => onSelect(event.id)}
      >
        <div className={styles.eventInfo}>
          <h3 className={styles.eventName}>{event.name}</h3>
          <span className={styles.guestCount}>
            {calculateInvitedCount(households, event)} invited → {calculateExpectedAttendance(households, event)} expected
          </span>
        </div>
        <div className={styles.actions}>
          <button
            className={styles.editButton}
            onClick={(e) => {
              e.stopPropagation();
              onEdit(event);
            }}
            title="Edit event"
            aria-label="Edit event"
          >
            <FiEdit2 />
          </button>
          <button
            className={styles.deleteButton}
            onClick={(e) => {
              e.stopPropagation();
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
    </div>
  );
}

interface EventCardOverlayProps {
  event: Event;
  households: EventManagerProps['households'];
}

function EventCardOverlay({ event, households }: EventCardOverlayProps) {
  return (
    <div className={`${styles.eventCard} ${styles.dragOverlay}`}>
      <div className={styles.dragHandle}>
        <FiMenu />
      </div>
      <div className={styles.eventContent}>
        <div className={styles.eventInfo}>
          <h3 className={styles.eventName}>{event.name}</h3>
          <span className={styles.guestCount}>
            {calculateInvitedCount(households, event)} invited → {calculateExpectedAttendance(households, event)} expected
          </span>
        </div>
        <div className={styles.actions}>
          <button className={styles.editButton}>
            <FiEdit2 />
          </button>
          <button className={styles.deleteButton}>
            <FiTrash2 />
          </button>
        </div>
      </div>
    </div>
  );
} 