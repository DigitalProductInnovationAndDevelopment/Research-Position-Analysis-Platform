import React from 'react';
import styles from './DropdownTrigger.module.css';

const DropdownTrigger = ({
  value,
  placeholder,
  onClick,
  onClear,
  darkMode = false,
  disabled = false
}) => {
  return (
    <div
      className={`${styles.triggerContainer} ${darkMode ? styles.dark : ''} ${disabled ? styles.disabled : ''}`}
      onClick={disabled ? undefined : onClick}
      style={{ cursor: disabled ? 'not-allowed' : 'pointer', position: 'relative' }}
    >
      <span className={styles.triggerText}>
        {value || placeholder}
      </span>
      {value && onClear && (
        <button
          className={styles.clearButton}
          onClick={e => {
            e.stopPropagation();
            onClear();
          }}
          aria-label="Clear"
          tabIndex={0}
        >
          ×
        </button>
      )}
      <span className={styles.triggerArrow}>▼</span>
    </div>
  );
};

export default DropdownTrigger; 