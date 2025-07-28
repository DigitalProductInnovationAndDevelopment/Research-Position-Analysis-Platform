import React, { useState, useEffect } from 'react';
import styles from './ModalDropdown.module.css';

const ModalDropdown = ({
  isOpen,
  onClose,
  title,
  placeholder,
  searchValue,
  onSearchChange,
  suggestions,
  onSelect,
  darkMode = false,
  minSearchLength = 2,
  noResultsMessage = "No results found",
  minSearchMessage = "Type at least 2 characters to search",
  loading = false
}) => {
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (isOpen) {
      setInputValue('');
    }
  }, [isOpen]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    onSearchChange(value);
  };

  const handleSelect = (item) => {
    onSelect(item);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={`${styles.modalContent} ${darkMode ? styles.dark : ''}`}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{title}</h2>
          <button
            onClick={onClose}
            className={styles.closeButton}
          >
            ×
          </button>
        </div>

        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          className={styles.searchInput}
          autoFocus
        />

        <div className={styles.suggestionsContainer}>
          {loading && (
            <div className={styles.loading}>
              Loading...
            </div>
          )}
          {!loading && suggestions.map((item) => (
            <div
              key={item.id}
              onClick={() => handleSelect(item)}
              className={styles.suggestionItem}
            >
              {item.display_name}
            </div>
          ))}
          {!loading && suggestions.length === 0 && inputValue.length >= minSearchLength && (
            <div className={styles.noResults}>
              {noResultsMessage}
            </div>
          )}
          {inputValue.length < minSearchLength && (
            <div className={styles.minSearch}>
              {minSearchMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModalDropdown; 