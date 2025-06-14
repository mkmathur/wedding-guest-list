import { useState, useEffect } from 'react';
import type { Household, Category, Tier } from '../../types';
import { ImportForm } from './ImportForm';
import { CategoryDialog } from './CategoryDialog';
import { ReviewForm } from './ReviewForm';
import styles from './BulkImportModal.module.css';

interface BulkImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (households: Omit<Household, 'id'>[]) => void;
  existingCategories: Category[];
  existingTiers: Tier[];
  onAddCategory: (name: string) => void;
  onAddCategories: (names: string[]) => Promise<Category[]>;
}

interface ParsedHousehold {
  name: string;
  guestCount: number;
  categoryName: string;
  tierId: string;
}

interface ReviewHousehold {
  name: string;
  guestCount: number;
  categoryName: string;
  tierId: string;
}

export function BulkImportModal({
  isOpen,
  onClose,
  onImport,
  existingCategories,
  existingTiers,
  onAddCategory,
  onAddCategories,
}: BulkImportModalProps) {
  const [step, setStep] = useState<'import' | 'categories' | 'review'>('import');
  const [parsedHouseholds, setParsedHouseholds] = useState<ParsedHousehold[]>([]);
  const [newCategories, setNewCategories] = useState<string[]>([]);
  const [error, setError] = useState<string>('');
  const [createdCategories, setCreatedCategories] = useState<Category[]>([]);

  // Reset state when modal is closed
  useEffect(() => {
    if (!isOpen) {
      setStep('import');
      setParsedHouseholds([]);
      setNewCategories([]);
      setError('');
      setCreatedCategories([]);
    }
  }, [isOpen]);

  // Reset error when step changes
  useEffect(() => {
    setError('');
  }, [step]);

  if (!isOpen) return null;

  const handleImport = (text: string) => {
    try {
      // Check if there are any tiers available
      if (existingTiers.length === 0) {
        setError('Please create at least one tier before importing households. You can add tiers in the Tiers section.');
        return;
      }

      const { households, categories } = parseImportText(text, existingCategories);
      
      // If there are no households, show an error
      if (households.length === 0) {
        setError('No valid households found in the input. Please check your input and try again.');
        return;
      }

      setParsedHouseholds(households);
      setNewCategories(categories);
      setError('');
      setStep('categories');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse import text');
    }
  };

  const handleCategoriesConfirmed = async (categoriesToCreate: string[]) => {
    try {
      // Create new categories if any were selected
      const newCategoriesList = categoriesToCreate.length > 0
        ? await onAddCategories(categoriesToCreate)
        : [];

      // Update households with category IDs
      const updatedHouseholds = parsedHouseholds.map(h => {
        // First try to find in existing categories
        const category = [...existingCategories, ...newCategoriesList].find(
          c => c.name.toLowerCase() === h.categoryName.toLowerCase()
        );

        if (!category) {
          throw new Error(`Category not found: ${h.categoryName}`);
        }

        return {
          ...h,
          categoryId: category.id,
        };
      });

      setParsedHouseholds(updatedHouseholds);
      setCreatedCategories(newCategoriesList);
      setStep('review');
    } catch (error) {
      console.error('Error creating categories:', error);
      setError('Failed to create categories. Please try again.');
    }
  };

  const handleReviewComplete = async (reviewedHouseholds: ReviewHousehold[]) => {
    try {
      // Map category names to IDs using the updated categories list
      const householdsWithIds = reviewedHouseholds.map(h => {
        const category = [...existingCategories, ...createdCategories].find(
          c => c.name.toLowerCase() === h.categoryName.toLowerCase()
        );
        if (!category) {
          throw new Error(`Category not found: ${h.categoryName}`);
        }
        if (!h.tierId) {
          throw new Error('Tier is required');
        }
        return {
          name: h.name,
          guestCount: h.guestCount,
          categoryId: category.id,
          tierId: h.tierId,
        };
      });

      await onImport(householdsWithIds);
      onClose();
    } catch (error) {
      console.error('Error importing households:', error);
      setError('Failed to import households. Please try again.');
    }
  };

  const handleClose = () => {
    // Clear any pending state before closing
    setError('');
    onClose();
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>Bulk Import Households</h2>
          <button onClick={handleClose} className={styles.closeButton}>&times;</button>
        </div>

        <div className={styles.modalContent}>
          {error && <div className={styles.error}>{error}</div>}

          {step === 'import' && (
            <ImportForm onSubmit={handleImport} />
          )}

          {step === 'categories' && (
            <CategoryDialog
              newCategories={newCategories}
              existingCategories={existingCategories}
              onProceed={handleCategoriesConfirmed}
              onBack={() => setStep('import')}
            />
          )}

          {step === 'review' && (
            <ReviewForm
              households={parsedHouseholds}
              categories={[...existingCategories, ...createdCategories]}
              tiers={existingTiers}
              onComplete={handleReviewComplete}
              onBack={() => setStep('categories')}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// Helper function to clean up a category name
function cleanCategoryName(name: string): string {
  // Remove any guest count patterns like "(4)", "+1", etc.
  return name
    .replace(/\s*\(\d+\)$/, '')  // Remove (4) at the end
    .replace(/\s*\+\s*\d+$/, '') // Remove +1 at the end
    .replace(/\s+\d+\s*kids?$/i, '') // Remove "2 kids" at the end
    .trim();
}

// Helper function to normalize a category name (for consistent case handling)
function normalizeCategoryName(name: string, isExisting: boolean): string {
  // First clean the name
  const cleaned = cleanCategoryName(name);
  // If it's an existing category, use its exact name
  // Otherwise, preserve the original case for new categories
  return isExisting ? cleaned : cleaned;
}

// Helper function to parse the import text
function parseImportText(text: string, existingCategories: Category[]): {
  households: ParsedHousehold[];
  categories: string[];
} {
  // Split into lines, keeping empty lines to help identify groups
  const lines = text.split('\n').map(line => line.trim());
  const households: ParsedHousehold[] = [];
  const categories = new Set<string>();
  let currentCategory = existingCategories[0]?.name || '';

  // Process lines in groups
  let i = 0;
  while (i < lines.length) {
    // Skip empty lines
    while (i < lines.length && !lines[i]) {
      i++;
    }
    if (i >= lines.length) break;

    // First non-empty line of a group is the category
    // Normalize the category name for consistent case handling
    const rawCategory = cleanCategoryName(lines[i]);
    // Check if this category matches an existing one (case-insensitive)
    const existingCategory = existingCategories.find(
      ec => ec.name.toLowerCase() === rawCategory.toLowerCase()
    );
    // Use existing category name if found, otherwise use the original name
    currentCategory = existingCategory ? existingCategory.name : normalizeCategoryName(rawCategory, false);
    i++;

    // Process all subsequent non-empty lines as households until we hit another group
    let householdsInCategory = 0;
    while (i < lines.length) {
      // If we hit an empty line, this group is done
      if (!lines[i]) {
        i++;
        break;
      }

      // Parse household line
      const { name, guestCount } = parseHouseholdLine(lines[i]);
      if (name) {
        households.push({
          name,
          guestCount,
          categoryName: currentCategory,
          tierId: '', // Will be set to default tier in ReviewForm
        });
        householdsInCategory++;
      }
      i++;
    }

    // Only add category if it has households
    if (householdsInCategory > 0) {
      categories.add(currentCategory);
    }
  }

  return {
    households,
    categories: Array.from(categories).filter(cat => 
      !existingCategories.some(ec => ec.name.toLowerCase() === cat.toLowerCase())
    ),
  };
}

// Helper function to parse a single household line
function parseHouseholdLine(line: string): { name: string; guestCount: number } {
  // Try to match patterns like:
  // "John Smith + 1"
  // "Jane Doe, John Doe, 2 kids"
  // "Smith Family (4)"
  // "Bob Wilson +1"
  // "Just a name 3"

  // Remove any trailing numbers in parentheses
  const withoutParens = line.replace(/\s*\(\d+\)$/, '');
  
  // Try to match "name + number" pattern
  const plusMatch = withoutParens.match(/^(.+?)\s*\+\s*(\d+)$/);
  if (plusMatch) {
    return {
      name: plusMatch[1].trim(),
      guestCount: 1 + parseInt(plusMatch[2], 10), // Add 1 for the base guest
    };
  }

  // Try to match "name, name, N kids" pattern
  const kidsMatch = withoutParens.match(/^(.+?),\s*(\d+)\s*kids$/i);
  if (kidsMatch) {
    const nameCount = kidsMatch[1].split(',').length;
    return {
      name: kidsMatch[1].trim(),
      guestCount: nameCount + parseInt(kidsMatch[2], 10),
    };
  }

  // Try to match "name (number)" pattern
  const parensMatch = line.match(/^(.+?)\s*\((\d+)\)$/);
  if (parensMatch) {
    return {
      name: parensMatch[1].trim(),
      guestCount: parseInt(parensMatch[2], 10),
    };
  }

  // Try to match "name number" pattern
  const numberMatch = line.match(/^(.+?)\s+(\d+)$/);
  if (numberMatch) {
    return {
      name: numberMatch[1].trim(),
      guestCount: parseInt(numberMatch[2], 10),
    };
  }

  // If no patterns match, assume it's just a name with 1 guest
  return {
    name: line.trim(),
    guestCount: 1,
  };
} 