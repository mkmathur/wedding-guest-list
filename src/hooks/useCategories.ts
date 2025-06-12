import { useState, useEffect } from 'react';
import { storage } from '../utils/storage';
import type { Category } from '../types';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    setCategories(storage.getCategories());
  }, []);

  const handleAddCategory = (name: string) => {
    const newCategory: Category = {
      id: crypto.randomUUID(),
      name: name.trim(),
    };
    const updatedCategories = [...categories, newCategory];
    setCategories(updatedCategories);
    storage.setCategories(updatedCategories);
  };

  const handleEditCategory = (categoryId: string, name: string) => {
    const updatedCategories = categories.map((cat) =>
      cat.id === categoryId ? { ...cat, name: name.trim() } : cat
    );
    setCategories(updatedCategories);
    storage.setCategories(updatedCategories);
  };

  const handleDeleteCategory = (categoryId: string) => {
    // This logic will be updated later to also check households from a shared state
    const updatedCategories = categories.filter((cat) => cat.id !== categoryId);
    setCategories(updatedCategories);
    storage.setCategories(updatedCategories);
  };

  return {
    categories,
    addCategory: handleAddCategory,
    editCategory: handleEditCategory,
    deleteCategory: handleDeleteCategory,
  };
} 