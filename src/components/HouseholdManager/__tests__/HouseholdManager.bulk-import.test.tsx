import React from 'react';
import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import { HouseholdManager } from '../HouseholdManager';
import { describe, it, expect } from 'vitest';
import type { Household, Category, Tier } from '../../../types';

const mockHouseholds: Household[] = [];
const mockCategories: Category[] = [
  { id: 'cat1', name: 'Family' },
  { id: 'cat2', name: 'Friends' },
];
const mockTiers: Tier[] = [
  { id: 'tier1', name: 'A' },
  { id: 'tier2', name: 'B' },
];

describe('HouseholdManager Bulk Import Integration', () => {
  it('shows Bulk Import button and opens modal on click', async () => {
    render(
      <HouseholdManager
        households={mockHouseholds}
        categories={mockCategories}
        tiers={mockTiers}
        onAdd={() => {}}
        onEdit={() => {}}
        onDelete={() => {}}
      />
    );

    // Both buttons should be visible
    expect(screen.getByRole('button', { name: /new household/i })).toBeInTheDocument();
    const bulkImportButton = screen.getByRole('button', { name: /bulk import/i });
    expect(bulkImportButton).toBeInTheDocument();

    // Modal should not be visible yet
    expect(screen.queryByRole('dialog', { name: /bulk import/i })).not.toBeInTheDocument();

    // Click Bulk Import
    await user.click(bulkImportButton);

    // Modal should appear with title
    expect(screen.getByRole('dialog', { name: /bulk import/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /bulk import/i })).toBeInTheDocument();
  });
}); 