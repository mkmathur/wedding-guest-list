import { useState, useEffect } from 'react';
import type { Category } from '../../types';
import { storage } from '../../utils/storage';
import styles from './CategoryManager.module.css';

export function CategoryManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    setCategories(storage.getCategories());
  }, []);

  const validateCategoryName = (name: string) => {
    if (!name.trim()) {
      setError('Category name cannot be empty');
      return false;
    }
    if (categories.some(cat => cat.name.toLowerCase() === name.toLowerCase() && cat.id !== editingCategory?.id)) {
      setError('Category name must be unique');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = editingCategory ? editingCategory.name : newCategoryName;
    
    if (!validateCategoryName(name)) return;

    if (editingCategory) {
      // Update existing category
      const updatedCategories = categories.map(cat =>
        cat.id === editingCategory.id ? editingCategory : cat
      );
      setCategories(updatedCategories);
      storage.setCategories(updatedCategories);
      setEditingCategory(null);
    } else {
      // Add new category
      const newCategory: Category = {
        id: crypto.randomUUID(),
        name: newCategoryName.trim()
      };
      const updatedCategories = [...categories, newCategory];
      setCategories(updatedCategories);
      storage.setCategories(updatedCategories);
      setNewCategoryName('');
    }
  };

  const handleDelete = (categoryId: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    
    const updatedCategories = categories.filter(cat => cat.id !== categoryId);
    setCategories(updatedCategories);
    storage.setCategories(updatedCategories);
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
            if (editingCategory) {
              setEditingCategory({ ...editingCategory, name: e.target.value });
            } else {
              setNewCategoryName(e.target.value);
            }
          }}
        />
        {error && <div className={styles.error}>{error}</div>}
        <div className={styles.buttonGroup}>
          <button type="submit" className={styles.actionButton}>
            {editingCategory ? 'Update Category' : 'Add Category'}
          </button>
          {editingCategory && (
            <button
              type="button"
              className={styles.actionButton}
              onClick={cancelEditing}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className={styles.list}>
        {categories.map(category => (
          <div key={category.id} className={styles.category}>
            <span className={styles.categoryName}>{category.name}</span>
            <div className={styles.actions}>
              <button
                className={styles.actionButton}
                onClick={() => startEditing(category)}
              >
                Edit
              </button>
              <button
                className={styles.deleteButton}
                onClick={() => handleDelete(category.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 