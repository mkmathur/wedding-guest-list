import { useState, useEffect } from 'react';
import { storage } from '../utils/storage';
import type { Tier } from '../types';

export function useTiers() {
  const [tiers, setTiers] = useState<Tier[]>([]);

  useEffect(() => {
    setTiers(storage.getTiers());
  }, []);

  const addTier = (name: string) => {
    const newTier: Tier = {
      id: crypto.randomUUID(),
      name: name.trim(),
    };
    const updatedTiers = [...tiers, newTier];
    setTiers(updatedTiers);
    storage.setTiers(updatedTiers);
  };

  const editTier = (tierId: string, name: string) => {
    const updatedTiers = tiers.map((tier) =>
      tier.id === tierId ? { ...tier, name: name.trim() } : tier
    );
    setTiers(updatedTiers);
    storage.setTiers(updatedTiers);
  };

  const deleteTier = (tierId: string) => {
    const updatedTiers = tiers.filter((tier) => tier.id !== tierId);
    setTiers(updatedTiers);
    storage.setTiers(updatedTiers);
  };

  const moveTier = (tierId: string, direction: 'up' | 'down') => {
    const currentIndex = tiers.findIndex((t) => t.id === tierId);
    if (currentIndex === -1) return;
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= tiers.length) return;
    const updatedTiers = [...tiers];
    [updatedTiers[currentIndex], updatedTiers[newIndex]] = [
      updatedTiers[newIndex],
      updatedTiers[currentIndex],
    ];
    setTiers(updatedTiers);
    storage.setTiers(updatedTiers);
  };

  return {
    tiers,
    addTier,
    editTier,
    deleteTier,
    moveTier,
  };
} 