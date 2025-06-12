import type { Category, Household, Tier } from './index';

export interface CategoryTierSelection {
  categoryId: string;
  selectedTierIds: string[];  // Allows selecting multiple tiers for a category
}

export interface Event {
  id: string;
  name: string;
  selections: CategoryTierSelection[];
}

export interface EventGuestCount {
  categoryId: string;
  count: number;
}

export interface EventFormData {
  name: string;
  selections: CategoryTierSelection[];
}

export interface EventManagerProps {
  events: Event[];
  categories: Category[];
  tiers: Tier[];
  households: Household[];
  onAdd: (event: Omit<Event, 'id'>) => void;
  onEdit: (eventId: string, updates: Partial<Event>) => void;
  onDelete: (eventId: string) => void;
} 