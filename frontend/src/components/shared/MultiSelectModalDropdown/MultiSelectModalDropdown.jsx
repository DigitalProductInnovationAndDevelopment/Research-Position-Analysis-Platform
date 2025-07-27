import React, { useState, useEffect } from 'react';
import styles from './MultiSelectModalDropdown.module.css';

const MultiSelectModalDropdown = ({
  isOpen,
  onClose,
  title,
  placeholder,
  onSearchChange,
  suggestions,
  selectedItems,
  onSelect,
  onDeselect,
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

  const handleItemToggle = (item) => {
    const isSelected = selectedItems.some(selected => selected.id === item.id);
    if (isSelected) {
      onDeselect(item);
    } else {
      onSelect(item);
    }
  };

  const handleRemoveSelected = (item) => {
    onDeselect(item);
  };

  const isItemSelected = (item) => {
    return selectedItems.some(selected => selected.id === item.id);
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

        {/* Selected Items Display */}
        {selectedItems.length > 0 && (
          <div className={styles.selectedItemsContainer}>
            <h3 className={styles.selectedItemsTitle}>Selected Items:</h3>
            <div className={styles.selectedItemsList}>
              {selectedItems.map((item) => (
                <div key={item.id} className={styles.selectedItem}>
                  <span className={styles.selectedItemText}>{item.display_name}</span>
                  <button
                    onClick={() => handleRemoveSelected(item)}
                    className={styles.removeButton}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

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
              onClick={() => handleItemToggle(item)}
              className={`${styles.suggestionItem} ${isItemSelected(item) ? styles.selected : ''}`}
            >
              <input
                type="checkbox"
                checked={isItemSelected(item)}
                onChange={() => handleItemToggle(item)}
                className={styles.checkbox}
              />
              <span className={styles.itemText}>{item.display_name}</span>
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

        <div className={styles.modalFooter}>
          <button
            onClick={onClose}
            className={styles.doneButton}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default MultiSelectModalDropdown; 