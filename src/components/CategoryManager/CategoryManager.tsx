import { useState } from 'react';
import type { Category, CategorySide } from '../../types';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import styles from './CategoryManager.module.css';

// Side options with emojis
const SIDE_OPTIONS = [
  { value: 'bride' as CategorySide, label: '💗 Bride', emoji: '💗' },
  { value: 'groom' as CategorySide, label: '💙 Groom', emoji: '💙' },
  { value: 'both' as CategorySide, label: '🤝 Both', emoji: '🤝' },
  { value: 'unspecified' as CategorySide, label: '❓ Unspecified', emoji: '❓' },
];

const getSideEmoji = (side?: CategorySide): string => {
  const option = SIDE_OPTIONS.find(opt => opt.value === side);
  return option ? option.emoji : '❓';
};

interface CategoryManagerProps {
  categories: Category[];
  onAdd: (name: string, side: CategorySide) => void;
  onEdit: (categoryId: string, name: string, side: CategorySide) => void;
  onDelete: (categoryId: string) => void;
}

export function CategoryManager({ categories, onAdd, onEdit, onDelete }: CategoryManagerProps) {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategorySide, setNewCategorySide] = useState<CategorySide>('bride');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [error, setError] = useState('');

  const validateCategoryName = (name: string) => {
    if (!name.trim()) {
      setError('Category name cannot be empty');
      return false;
    }
    if (categories.some(cat => 
      cat.name.trim().toLowerCase() === name.trim().toLowerCase() && 
      cat.id !== editingCategory?.id
    )) {
      setError('Category name must be unique');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = editingCategory ? editingCategory.name : newCategoryName;
    const side = editingCategory ? (editingCategory.side || 'unspecified') : newCategorySide;
    
    if (!validateCategoryName(name)) return;

    if (editingCategory) {
      onEdit(editingCategory.id, name.trim(), side);
      setEditingCategory(null);
    } else {
      onAdd(newCategoryName.trim(), side);
      setNewCategoryName('');
      setNewCategorySide('bride'); // Reset to default
    }
  };

  const startEditing = (category: Category) => {
    setEditingCategory(category);
    setNewCategoryName('');
    setError('');
  };

  const cancelEditing = () => {
    setEditingCategory(null);
    setError('');
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          className={styles.input}
          placeholder="Enter category name"
          value={editingCategory ? editingCategory.name : newCategoryName}
          onChange={(e) => {
            const value = e.target.value;
            if (editingCategory) {
              setEditingCategory({ ...editingCategory, name: value });
            } else {
              setNewCategoryName(value);
            }
            // Clear error when input changes
            if (error) {
              validateCategoryName(value);
            }
          }}
        />
        
        <label className={styles.label}>
          Which side is this guest group from?
          <select
            className={styles.select}
            value={editingCategory ? (editingCategory.side || 'unspecified') : newCategorySide}
            onChange={(e) => {
              const side = e.target.value as CategorySide;
              if (editingCategory) {
                setEditingCategory({ ...editingCategory, side });
              } else {
                setNewCategorySide(side);
              }
            }}
          >
            {SIDE_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        
        {error && <div className={styles.error}>{error}</div>}
        <div className={styles.buttonGroup}>
          <button type="submit" className={styles.textButton}>
            {editingCategory ? 'Update Category' : 'Add Category'}
          </button>
          {editingCategory && (
            <button
              type="button"
              className={styles.textButton}
              onClick={cancelEditing}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className={styles.list} data-testid="categories-list">
        {categories.map(category => (
          <div key={category.id} className={styles.category}>
            <span className={styles.categoryName}>
              <span className={styles.sideEmoji}>{getSideEmoji(category.side)}</span>
              {category.name}
            </span>
            <div className={styles.actions}>
              <button
                className={styles.actionButton}
                onClick={() => startEditing(category)}
                title="Edit category"
                aria-label="Edit category"
              >
                <FiEdit2 />
              </button>
              <button
                className={styles.deleteButton}
                onClick={() => {
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
        ))}
      </div>
    </div>
  );
} 