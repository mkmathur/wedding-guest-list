import type { Category, Household, Tier } from '../../types';
import type { Event } from '../../types/event';

export const demoCategories: Category[] = [
  { id: 'demo-bride-family', name: "Bride's Family", side: 'bride' },
  { id: 'demo-bride-friends', name: "Bride's Friends", side: 'bride' },
  { id: 'demo-groom-family', name: "Groom's Family", side: 'groom' },
  { id: 'demo-groom-friends', name: "Groom's Friends", side: 'groom' }
];

export const demoTiers: Tier[] = [
  { id: 'demo-t1', name: 'T1' },
  { id: 'demo-t2', name: 'T2' },
  { id: 'demo-t3', name: 'T3' }
];

export const demoTierOrder = {
  tierIds: ['demo-t1', 'demo-t2', 'demo-t3']
};

export const demoHouseholds: Household[] = [
  // Bride's Family (24 guests)
  { id: 'demo-bf-1', name: 'Mom & Dad', guestCount: 2, categoryId: 'demo-bride-family', tierId: 'demo-t1', rsvpProbability: 100 },
  { id: 'demo-bf-2', name: 'Nani & Nana', guestCount: 2, categoryId: 'demo-bride-family', tierId: 'demo-t1', rsvpProbability: 100 },
  { id: 'demo-bf-3', name: 'Mama & Mami', guestCount: 2, categoryId: 'demo-bride-family', tierId: 'demo-t2', rsvpProbability: 90 },
  { id: 'demo-bf-4', name: 'The Sharma Family', guestCount: 4, categoryId: 'demo-bride-family', tierId: 'demo-t2', rsvpProbability: 75 },
  { id: 'demo-bf-5', name: 'The Patel Family', guestCount: 3, categoryId: 'demo-bride-family', tierId: 'demo-t3', rsvpProbability: 50 },
  { id: 'demo-bf-6', name: 'Bua & Bua ji', guestCount: 2, categoryId: 'demo-bride-family', tierId: 'demo-t2', rsvpProbability: 75 },
  { id: 'demo-bf-7', name: 'The Kumar Family', guestCount: 4, categoryId: 'demo-bride-family', tierId: 'demo-t3', rsvpProbability: 25 },
  { id: 'demo-bf-8', name: 'Chachi & Chacha ji', guestCount: 2, categoryId: 'demo-bride-family', tierId: 'demo-t2', rsvpProbability: 90 },
  { id: 'demo-bf-9', name: 'The Agarwal Family', guestCount: 3, categoryId: 'demo-bride-family', tierId: 'demo-t3', rsvpProbability: 50 },

  // Bride's Friends (18 guests)
  { id: 'demo-bfr-1', name: 'Priya & Mike', guestCount: 2, categoryId: 'demo-bride-friends', tierId: 'demo-t1', rsvpProbability: 100 },
  { id: 'demo-bfr-2', name: 'The Johnsons', guestCount: 4, categoryId: 'demo-bride-friends', tierId: 'demo-t2', rsvpProbability: 75 },
  { id: 'demo-bfr-3', name: 'Anita & David', guestCount: 2, categoryId: 'demo-bride-friends', tierId: 'demo-t2', rsvpProbability: 90 },
  { id: 'demo-bfr-4', name: 'The Chens', guestCount: 3, categoryId: 'demo-bride-friends', tierId: 'demo-t3', rsvpProbability: 50 },
  { id: 'demo-bfr-5', name: 'Sarah & James', guestCount: 2, categoryId: 'demo-bride-friends', tierId: 'demo-t1', rsvpProbability: 100 },
  { id: 'demo-bfr-6', name: 'The Williams Family', guestCount: 3, categoryId: 'demo-bride-friends', tierId: 'demo-t2', rsvpProbability: 75 },
  { id: 'demo-bfr-7', name: 'College Roommates', guestCount: 2, categoryId: 'demo-bride-friends', tierId: 'demo-t3', rsvpProbability: 25 },

  // Groom's Family (20 guests)  
  { id: 'demo-gf-1', name: 'Mom & Dad', guestCount: 2, categoryId: 'demo-groom-family', tierId: 'demo-t1', rsvpProbability: 100 },
  { id: 'demo-gf-2', name: 'Dada & Dadi', guestCount: 2, categoryId: 'demo-groom-family', tierId: 'demo-t1', rsvpProbability: 100 },
  { id: 'demo-gf-3', name: 'Chacha & Chachi', guestCount: 2, categoryId: 'demo-groom-family', tierId: 'demo-t2', rsvpProbability: 90 },
  { id: 'demo-gf-4', name: 'The Gupta Family', guestCount: 4, categoryId: 'demo-groom-family', tierId: 'demo-t2', rsvpProbability: 75 },
  { id: 'demo-gf-5', name: 'The Singh Family', guestCount: 3, categoryId: 'demo-groom-family', tierId: 'demo-t2', rsvpProbability: 75 },
  { id: 'demo-gf-6', name: 'Tau & Tai ji', guestCount: 2, categoryId: 'demo-groom-family', tierId: 'demo-t2', rsvpProbability: 90 },
  { id: 'demo-gf-7', name: 'The Mehta Family', guestCount: 3, categoryId: 'demo-groom-family', tierId: 'demo-t3', rsvpProbability: 50 },
  { id: 'demo-gf-8', name: 'Extended Relatives', guestCount: 2, categoryId: 'demo-groom-family', tierId: 'demo-t3', rsvpProbability: 25 },

  // Groom's Friends (18 guests)
  { id: 'demo-gfr-1', name: 'Raj & Sarah', guestCount: 2, categoryId: 'demo-groom-friends', tierId: 'demo-t1', rsvpProbability: 100 },
  { id: 'demo-gfr-2', name: 'The Davis Family', guestCount: 4, categoryId: 'demo-groom-friends', tierId: 'demo-t2', rsvpProbability: 75 },
  { id: 'demo-gfr-3', name: 'Vikram & Emma', guestCount: 2, categoryId: 'demo-groom-friends', tierId: 'demo-t2', rsvpProbability: 90 },
  { id: 'demo-gfr-4', name: 'The Martinez Family', guestCount: 3, categoryId: 'demo-groom-friends', tierId: 'demo-t3', rsvpProbability: 50 },
  { id: 'demo-gfr-5', name: 'Work Colleagues', guestCount: 3, categoryId: 'demo-groom-friends', tierId: 'demo-t2', rsvpProbability: 75 },
  { id: 'demo-gfr-6', name: 'College Friends', guestCount: 2, categoryId: 'demo-groom-friends', tierId: 'demo-t1', rsvpProbability: 100 },
  { id: 'demo-gfr-7', name: 'The Neighbors', guestCount: 2, categoryId: 'demo-groom-friends', tierId: 'demo-t3', rsvpProbability: 25 }
];

export const demoEvents: Event[] = [
  {
    id: 'demo-haldi',
    name: 'Haldi',
    selections: [
      { categoryId: 'demo-bride-family', selectedTierIds: ['demo-t1'] },
      { categoryId: 'demo-bride-friends', selectedTierIds: ['demo-t1'] },
      { categoryId: 'demo-groom-family', selectedTierIds: ['demo-t1', 'demo-t2'] },
      { categoryId: 'demo-groom-friends', selectedTierIds: ['demo-t1', 'demo-t2'] }
    ]
  },
  {
    id: 'demo-mehndi',
    name: 'Mehndi',
    selections: [
      { categoryId: 'demo-bride-family', selectedTierIds: ['demo-t1', 'demo-t2'] },
      { categoryId: 'demo-bride-friends', selectedTierIds: ['demo-t1', 'demo-t2'] },
      { categoryId: 'demo-groom-family', selectedTierIds: ['demo-t1'] },
      { categoryId: 'demo-groom-friends', selectedTierIds: ['demo-t1'] }
    ]
  },
  {
    id: 'demo-ceremony',
    name: 'Ceremony',
    selections: [
      { categoryId: 'demo-bride-family', selectedTierIds: ['demo-t1', 'demo-t2'] },
      { categoryId: 'demo-bride-friends', selectedTierIds: ['demo-t1', 'demo-t2'] },
      { categoryId: 'demo-groom-family', selectedTierIds: ['demo-t1', 'demo-t2'] },
      { categoryId: 'demo-groom-friends', selectedTierIds: ['demo-t1', 'demo-t2'] }
    ]
  },
  {
    id: 'demo-reception',
    name: 'Reception',
    selections: [
      { categoryId: 'demo-bride-family', selectedTierIds: ['demo-t1', 'demo-t2', 'demo-t3'] },
      { categoryId: 'demo-bride-friends', selectedTierIds: ['demo-t1', 'demo-t2', 'demo-t3'] },
      { categoryId: 'demo-groom-family', selectedTierIds: ['demo-t1', 'demo-t2', 'demo-t3'] },
      { categoryId: 'demo-groom-friends', selectedTierIds: ['demo-t1', 'demo-t2', 'demo-t3'] }
    ]
  }
];

export const demoData = {
  categories: demoCategories,
  households: demoHouseholds,
  tiers: demoTiers,
  tierOrder: demoTierOrder,
  events: demoEvents
};