import React from 'react';
import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import { BulkImportModal } from './BulkImportModal';
import { ImportStep } from '../../types/bulkImport';
import { describe, it, beforeEach, expect, vi } from 'vitest';

describe('BulkImportModal', () => {
  const onClose = vi.fn();

  beforeEach(() => {
    onClose.mockClear();
  });

  it('does not render when isOpen is false', () => {
    render(<BulkImportModal isOpen={false} onClose={onClose} />);
    expect(screen.queryByText(/Text Input Step/)).toBeNull();
  });

  it('renders and closes when Close button is clicked', async () => {
    render(<BulkImportModal isOpen={true} onClose={onClose} />);
    expect(screen.getByText(/Bulk Import/)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /close/i }));
    expect(onClose).toHaveBeenCalled();
  });

  it('shows step content and navigates between steps', async () => {
    render(<BulkImportModal isOpen={true} onClose={onClose} />);
    // Starts at TextInputStep
    expect(screen.getByText(/Paste your guest list below/)).toBeInTheDocument();
    // Click Next to go to CategoryReviewStep
    await user.click(screen.getByRole('button', { name: /next/i }));
    expect(screen.getByText(/Category Review Step/)).toBeInTheDocument();
    // Click Next to go to HouseholdReviewStep
    await user.click(screen.getByRole('button', { name: /next/i }));
    expect(screen.getByText(/Household Review Step/)).toBeInTheDocument();
    // Click Back to go to CategoryReviewStep
    await user.click(screen.getByRole('button', { name: /back/i }));
    expect(screen.getByText(/Category Review Step/)).toBeInTheDocument();
    // Click Back to go to TextInputStep
    await user.click(screen.getByRole('button', { name: /back/i }));
    expect(screen.getByText(/Paste your guest list below/)).toBeInTheDocument();
  });
}); 