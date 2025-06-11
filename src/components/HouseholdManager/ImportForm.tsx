import { useState } from 'react';
import type { Category } from '../../types';
import styles from './ImportForm.module.css';

interface ParsedHousehold {
  name: string;
  guestCount: number;
  categoryName: string;
}

interface ImportFormProps {
  onSubmit: (text: string) => void;
}

export function ImportForm({ onSubmit }: ImportFormProps) {
  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!text.trim()) {
      setError('Please enter some text to import');
      return;
    }

    onSubmit(text);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formGroup}>
        <p className={styles.subtitle}>
          Paste your guest list below:
          <br />
          <small>
            Each category should be on its own line, followed by the households in that category.
            <br />
            Use empty lines to separate categories.
          </small>
        </p>
        {error && <div className={styles.error}>{error}</div>}
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="FAMILY
  John Smith + 1
  Jane Doe, John Doe, 2 kids

FRIENDS
  Alice Brown
  Bob Wilson +1"
          className={styles.textarea}
          rows={10}
        />
      </div>
      <div className={styles.buttonGroup}>
        <button type="submit" className={styles.submitButton}>
          Preview Import
        </button>
      </div>
    </form>
  );
} 