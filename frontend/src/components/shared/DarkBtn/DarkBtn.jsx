import React from 'react';
import styles from './DarkBtn.module.css';

/**
 * DarkBtn Component
 * A button component that toggles between light and dark themes
 * @param {Object} props
 * @param {string} props.className - Additional CSS class name
 * @param {boolean} props.darkLight - Whether the button is in dark mode
 * @param {Function} props.onClick - Click handler function
 */
const DarkBtn = ({ className, darkLight, onClick }) => {
  return (
    <button 
      className={`${styles.darkBtn} ${className || ''}`}
      onClick={onClick}
      aria-label={darkLight ? "Switch to light mode" : "Switch to dark mode"}
    >
      <span className={styles.icon}>
        {darkLight ? '🌙' : '☀️'}
      </span>
    </button>
  );
};

export default DarkBtn; 