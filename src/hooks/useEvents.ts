import { useState, useEffect } from 'react';
import { storage } from '../utils/storage';
import type { Event } from '../types';

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    setEvents(storage.getEvents());
  }, []);

  const addEvent = (event: Omit<Event, 'id'>) => {
    const newEvent: Event = {
      id: crypto.randomUUID(),
      ...event,
    };
    const updatedEvents = [...events, newEvent];
    setEvents(updatedEvents);
    storage.setEvents(updatedEvents);
  };

  const editEvent = (eventId: string, updates: Partial<Event>) => {
    const updatedEvents = events.map((e) =>
      e.id === eventId ? { ...e, ...updates } : e
    );
    setEvents(updatedEvents);
    storage.setEvents(updatedEvents);
  };

  const deleteEvent = (eventId: string) => {
    const updatedEvents = events.filter((e) => e.id !== eventId);
    setEvents(updatedEvents);
    storage.setEvents(updatedEvents);
  };

  return {
    events,
    addEvent,
    editEvent,
    deleteEvent,
  };
} 