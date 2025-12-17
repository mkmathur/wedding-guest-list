import { useState } from 'react';
import type { Category, CategorySide } from '../../types';
import { CategoryForm } from './CategoryForm';
import { GuestSideIcon } from '../shared/GuestSideIcon';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import styles from './CategoryManager.module.css';

interface CategoryManagerProps {
  categories: Category[];
  selectedCategoryId?: string | null;
  isSummaryMode?: boolean;
  onAdd: (name: string, side: CategorySide) => void;
  onEdit: (categoryId: string, name: string, side: CategorySide) => void;
  onDelete: (categoryId: string) => void;
  onCategorySelect?: (categoryId: string) => void;
}

export function CategoryManager({ 
  categories, 
  selectedCategoryId,
  isSummaryMode = false,
  onAdd, 
  onEdit, 
  onDelete,
  onCategorySelect
}: CategoryManagerProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const handleSubmit = (name: string, side: CategorySide) => {
    if (editingCategory) {
      onEdit(editingCategory.id, name, side);
      setEditingCategory(null);
    } else {
      onAdd(name, side);
      setIsCreating(false);
    }
  };

  const handleCancel = () => {
    setEditingCategory(null);
    setIsCreating(false);
  };

  const startEditing = (category: Category) => {
    setEditingCategory(category);
  };

  const handleCategoryClick = (categoryId: string) => {
    // Only allow selection in detailed view and if handler is provided
    if (!isSummaryMode && onCategorySelect) {
      onCategorySelect(categoryId);
    }
  };

  return (
    <div className={styles.categoryManager}>
      {!isCreating && !editingCategory && (
        <button
          className={styles.newCategoryButton}
          onClick={() => setIsCreating(true)}
        >
          + New Category
        </button>
      )}

      {(isCreating || editingCategory) ? (
        <CategoryForm
          categories={categories}
          category={editingCategory || undefined}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      ) : (
        <div className={styles.list} data-testid="categories-list">
          {categories.length === 0 ? (
            <div className={styles.emptyState}>
              <p>No categories yet. Create your first category to organize your guest list by family, friends, or other groups.</p>
            </div>
          ) : (
            categories.map(category => (
            <div 
              key={category.id} 
              className={`${styles.category} ${
                selectedCategoryId === category.id ? styles.selected : ''
              } ${
                !isSummaryMode ? styles.interactive : ''
              }`}
              onClick={() => handleCategoryClick(category.id)}
            >
              <span className={styles.categoryName}>
                <span className={styles.sideEmoji}>
                  <GuestSideIcon side={category.side || 'unspecified'} size="1rem" />
                </span>
                {category.name}
              </span>
              <div className={styles.actions}>
                <button
                  className={styles.actionButton}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent category selection when editing
                    startEditing(category);
                  }}
                  title="Edit category"
                  aria-label="Edit category"
                >
                  <FiEdit2 />
                </button>
                <button
                  className={styles.deleteButton}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent category selection when deleting
                    if (confirm('Are you sure you want to delete this category?')) {
                      onDelete(category.id);
                    }
                  }}
                  title="Delete category"
                  aria-label="Delete category"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
            ))
          )}
        </div>
      )}
    </div>
  );
} 