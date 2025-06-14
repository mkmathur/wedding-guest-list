import React, { useState } from 'react';
import { ImportStep } from '../../types/bulkImport';
import type { ParsedHousehold, NewCategory } from '../../types/bulkImport';
import styles from './BulkImportModal.module.css';
import { TextInputStep } from './TextInputStep';

// Placeholder step components
const CategoryReviewStep = () => <div>Category Review Step (placeholder)</div>;
const HouseholdReviewStep = () => <div>Household Review Step (placeholder)</div>;

interface BulkImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BulkImportModal: React.FC<BulkImportModalProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState<ImportStep>(ImportStep.TextInput);
  // Shared state for import data (to be expanded in later tasks)
  const [parsedHouseholds, setParsedHouseholds] = useState<ParsedHousehold[]>([]);
  const [newCategories, setNewCategories] = useState<NewCategory[]>([]);
  const [textValue, setTextValue] = useState('');

  if (!isOpen) return null;

  const renderStep = () => {
    switch (currentStep) {
      case ImportStep.TextInput:
        return <TextInputStep value={textValue} onChange={setTextValue} />;
      case ImportStep.CategoryReview:
        return <CategoryReviewStep />;
      case ImportStep.HouseholdReview:
        return <HouseholdReviewStep />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent} role="dialog" aria-modal="true" aria-labelledby="bulk-import-title">
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle} id="bulk-import-title">Bulk Import</h2>
          <button className={styles.closeButton} onClick={onClose} aria-label="Close Bulk Import Modal">&times;</button>
        </div>
        <div className={styles.stepContent}>
          {renderStep()}
        </div>
        <div className={styles.stepNavigation}>
          {currentStep !== ImportStep.TextInput && (
            <button onClick={() => setCurrentStep(prev => prev === ImportStep.CategoryReview ? ImportStep.TextInput : ImportStep.CategoryReview)}>
              Back
            </button>
          )}
          {currentStep !== ImportStep.HouseholdReview && (
            <button className={styles.primaryButton} onClick={() => setCurrentStep(prev => prev === ImportStep.TextInput ? ImportStep.CategoryReview : ImportStep.HouseholdReview)}>
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BulkImportModal; 