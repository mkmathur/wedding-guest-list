import { describe, it, expect } from 'vitest';
import { calculateExpectedAttendance, calculateInvitedCount } from '../expectedAttendance';
import type { Household } from '../../types';
import type { Event } from '../../types/event';

// Mock data for testing
const mockHouseholds: Household[] = [
  {
    id: '1',
    name: 'Smith Family',
    guestCount: 4,
    categoryId: 'cat1',
    tierId: 'tier1',
    rsvpProbability: 100
  },
  {
    id: '2',
    name: 'Johnson Family',
    guestCount: 4,
    categoryId: 'cat1',
    tierId: 'tier1',
    rsvpProbability: 50
  },
  {
    id: '3',
    name: 'Wilson Family',
    guestCount: 2,
    categoryId: 'cat1',
    tierId: 'tier1',
    rsvpProbability: 75
  },
  {
    id: '4',
    name: 'Davis Family',
    guestCount: 3,
    categoryId: 'cat2',
    tierId: 'tier1',
    rsvpProbability: 0
  },
  {
    id: '5',
    name: 'Brown Family',
    guestCount: 2,
    categoryId: 'cat1',
    tierId: 'tier2',
    // No rsvpProbability - should default to 75%
  }
];

const mockEvent: Event = {
  id: 'event1',
  name: 'Wedding Ceremony',
  selections: [
    {
      categoryId: 'cat1',
      selectedTierIds: ['tier1', 'tier2']
    }
  ]
};

describe('calculateExpectedAttendance', () => {
  it('calculates expected attendance correctly', () => {
    // Expected calculation:
    // Smith: 4 * 1.00 = 4.0
    // Johnson: 4 * 0.50 = 2.0  
    // Wilson: 2 * 0.75 = 1.5
    // Brown: 2 * 0.75 = 1.5 (default probability)
    // Davis: not invited (different category)
    // Total: 9.0 -> rounds to 9
    
    const result = calculateExpectedAttendance(mockHouseholds, mockEvent);
    expect(result).toBe(9);
  });

  it('handles households with default probability', () => {
    const householdsWithoutProbability: Household[] = [
      {
        id: '1',
        name: 'Test Family',
        guestCount: 4,
        categoryId: 'cat1',
        tierId: 'tier1'
        // No rsvpProbability - should use 75% default
      }
    ];

    const result = calculateExpectedAttendance(householdsWithoutProbability, mockEvent);
    // 4 * 0.75 = 3.0 -> rounds to 3
    expect(result).toBe(3);
  });

  it('returns 0 for events with no invited households', () => {
    const eventWithNoInvites: Event = {
      id: 'event2',
      name: 'Private Event',
      selections: [
        {
          categoryId: 'nonexistent',
          selectedTierIds: ['tier1']
        }
      ]
    };

    const result = calculateExpectedAttendance(mockHouseholds, eventWithNoInvites);
    expect(result).toBe(0);
  });

  it('handles 0% probability correctly', () => {
    const householdsWith0Percent: Household[] = [
      {
        id: '1',
        name: 'Unlikely Family',
        guestCount: 10,
        categoryId: 'cat1',
        tierId: 'tier1',
        rsvpProbability: 0
      }
    ];

    const result = calculateExpectedAttendance(householdsWith0Percent, mockEvent);
    expect(result).toBe(0);
  });

  it('rounds fractional results correctly', () => {
    const householdsForRounding: Household[] = [
      {
        id: '1',
        name: 'Test Family',
        guestCount: 3,
        categoryId: 'cat1',
        tierId: 'tier1',
        rsvpProbability: 50
      }
    ];

    const result = calculateExpectedAttendance(householdsForRounding, mockEvent);
    // 3 * 0.50 = 1.5 -> rounds to 2
    expect(result).toBe(2);
  });
});

describe('calculateInvitedCount', () => {
  it('calculates total invited guests correctly', () => {
    // Smith: 4, Johnson: 4, Wilson: 2, Brown: 2 (all in cat1)
    // Davis: not invited (cat2 not in event selections)
    const result = calculateInvitedCount(mockHouseholds, mockEvent);
    expect(result).toBe(12);
  });

  it('returns 0 for events with no invited households', () => {
    const eventWithNoInvites: Event = {
      id: 'event2',
      name: 'Private Event',
      selections: [
        {
          categoryId: 'nonexistent',
          selectedTierIds: ['tier1']
        }
      ]
    };

    const result = calculateInvitedCount(mockHouseholds, eventWithNoInvites);
    expect(result).toBe(0);
  });
});