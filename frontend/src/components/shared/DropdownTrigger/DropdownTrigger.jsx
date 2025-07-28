import React from 'react';
import styles from './DropdownTrigger.module.css';

const DropdownTrigger = ({
  value,
  placeholder,
  onClick,
  darkMode = false,
  disabled = false
}) => {
  return (
    <div
      className={`${styles.triggerContainer} ${darkMode ? styles.dark : ''} ${disabled ? styles.disabled : ''}`}
      onClick={disabled ? undefined : onClick}
      style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
    >
      <span className={styles.triggerText}>
        {value || placeholder}
      </span>
      <span className={styles.triggerArrow}>▼</span>
    </div>
  );
};

export default DropdownTrigger; 