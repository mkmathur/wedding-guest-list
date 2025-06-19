import { useState, useEffect } from 'react';
import type { Category, CategorySide } from '../../types';
import styles from './CategoryForm.module.css';

// Side options with emojis
const SIDE_OPTIONS = [
  { value: 'bride' as CategorySide, label: '💗 Bride', emoji: '💗' },
  { value: 'groom' as CategorySide, label: '💙 Groom', emoji: '💙' },
  { value: 'both' as CategorySide, label: '🤝 Both', emoji: '🤝' },
  { value: 'unspecified' as CategorySide, label: '❓ Unspecified', emoji: '❓' },
];

interface CategoryFormProps {
  categories: Category[];
  category?: Category;
  onSubmit: (name: string, side: CategorySide) => void;
  onCancel: () => void;
}

export function CategoryForm({ categories, category, onSubmit, onCancel }: CategoryFormProps) {
  const [name, setName] = useState('');
  const [side, setSide] = useState<CategorySide>('bride');
  const [error, setError] = useState('');

  // Initialize form data when editing a category
  useEffect(() => {
    if (category) {
      setName(category.name);
      setSide(category.side || 'unspecified');
    } else {
      setName('');
      setSide('bride');
    }
    setError('');
  }, [category]);

  const validateCategoryName = (name: string) => {
    if (!name.trim()) {
      setError('Category name cannot be empty');
      return false;
    }
    if (categories.some(cat => 
      cat.name.trim().toLowerCase() === name.trim().toLowerCase() && 
      cat.id !== category?.id
    )) {
      setError('Category name must be unique');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateCategoryName(name)) return;

    onSubmit(name.trim(), side);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
    // Clear error when input changes
    if (error) {
      validateCategoryName(value);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formGroup}>
        <label htmlFor="categoryName">Category Name:</label>
        <input
          id="categoryName"
          type="text"
          className={styles.input}
          placeholder="Enter category name"
          value={name}
          onChange={handleNameChange}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="categorySide">Which side is this guest group from?</label>
        <select
          id="categorySide"
          className={styles.select}
          value={side}
          onChange={(e) => setSide(e.target.value as CategorySide)}
        >
          {SIDE_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.buttonGroup}>
        <button type="submit" className={styles.submitButton}>
          {category ? 'Update Category' : 'Create Category'}
        </button>
        <button
          type="button"
          className={styles.cancelButton}
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </form>
  );
} 