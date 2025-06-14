import React from 'react';
import styles from './BulkImportModal.module.css';

interface TextInputStepProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export const TextInputStep: React.FC<TextInputStepProps> = ({ value, onChange, error }) => {
  return (
    <div>
      <label htmlFor="bulk-import-textarea" style={{ fontWeight: 500, display: 'block', marginBottom: '0.5rem' }}>
        <div className={styles.instructions}>
            <strong>Paste your guest list below using this format:</strong>
            <pre className={styles.exampleBlock}>
    {`Family
Harry, Ginny, 2 kids
Hermione, Ron, baby

Friends
Alice & Bob
Charlie +1
Carol + husband/baby
Anne + Bob
The Weasleys: Molly, Arthur, seven kids`}
            </pre>
            <div>
            <ul className={styles.instructionsList}>
                <li>Each <strong>category</strong> starts on a new line (e.g., <code>Family</code>, <code>Friends</code>).</li>
                <li><strong>Household names</strong> can be indented or not, but must follow a category.</li>
                <li>Blank lines separate categories.</li>
                <li>Guest info can use <code>+1</code>, <code>&amp;</code>, commas, or explicit numbers/words (e.g., <code>7 kids</code>, <code>seven kids</code>).</li>
            </ul>
            </div>
        </div>
      </label>
      <textarea
        id="bulk-import-textarea"
        rows={10}
        className={styles.textarea}
        value={value}
        onChange={e => onChange(e.target.value)}
        aria-label="Guest List Text"
        aria-invalid={!!error}
      />
      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
};

export default TextInputStep; 