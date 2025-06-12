import { useState, useEffect } from 'react';
import { storage } from '../utils/storage';
import type { Household } from '../types';

export function useHouseholds() {
  const [households, setHouseholds] = useState<Household[]>([]);

  useEffect(() => {
    setHouseholds(storage.getHouseholds());
  }, []);

  const addHousehold = (household: Omit<Household, 'id'>) => {
    const newHousehold: Household = {
      id: crypto.randomUUID(),
      ...household,
    };
    const updatedHouseholds = [...households, newHousehold];
    setHouseholds(updatedHouseholds);
    storage.setHouseholds(updatedHouseholds);
  };

  const editHousehold = (householdId: string, updates: Partial<Household>) => {
    const updatedHouseholds = households.map((h) =>
      h.id === householdId ? { ...h, ...updates } : h
    );
    setHouseholds(updatedHouseholds);
    storage.setHouseholds(updatedHouseholds);
  };

  const deleteHousehold = (householdId: string) => {
    const updatedHouseholds = households.filter((h) => h.id !== householdId);
    setHouseholds(updatedHouseholds);
    storage.setHouseholds(updatedHouseholds);
  };

  return {
    households,
    addHousehold,
    editHousehold,
    deleteHousehold,
  };
} 