import React, { useState, useEffect, useRef } from 'react';
import styles from './Autocomplete.module.css';
import useDebounce from '../../../hooks/useDebounce';

const Autocomplete = ({ value, onValueChange, placeholder, type, onEnterPress }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [searchOnEnter, setSearchOnEnter] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const debouncedSearchTerm = useDebounce(value, 300);
  const inputRef = useRef(null);

  useEffect(() => {
    if (debouncedSearchTerm && debouncedSearchTerm.length >= 2) {
      const fetchSuggestions = async () => {
        setIsLoading(true);
        try {
          const response = await fetch(`/autocomplete?query=${encodeURIComponent(debouncedSearchTerm)}&type=${type}`);
          if (!response.ok) throw new Error('Failed to fetch');
          const data = await response.json();
          setSuggestions((data.results || []).slice(0, 10));
          setActiveIndex(0);
        } catch (error) {
          setSuggestions([]);
        }
        setIsLoading(false);
      };
      fetchSuggestions();
      setDropdownOpen(true);
    } else {
      setSuggestions([]);
      setDropdownOpen(false);
    }
  }, [debouncedSearchTerm, type]);

  useEffect(() => {
    if (searchOnEnter) {
      if (onEnterPress) onEnterPress();
      setSearchOnEnter(false);
    }
  }, [value, searchOnEnter, onEnterPress]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (suggestions.length > 0 && suggestions[activeIndex]) {
        onValueChange(suggestions[activeIndex].display_name);
        setSuggestions([]);
        setDropdownOpen(false);
        setSearchOnEnter(true);
      } else {
        if (onEnterPress) onEnterPress();
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(activeIndex > 0 ? activeIndex - 1 : suggestions.length - 1);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(activeIndex < suggestions.length - 1 ? activeIndex + 1 : 0);
    } else if (e.key === 'Tab') {
      if (suggestions.length > 0 && suggestions[activeIndex]) {
        onValueChange(suggestions[activeIndex].display_name);
        setSuggestions([]);
        setDropdownOpen(false);
      }
    }
  };

  const handleClick = (suggestion) => {
    onValueChange(suggestion.display_name);
    setSuggestions([]);
    setDropdownOpen(false);
    if (onEnterPress) onEnterPress();
  };

  const handleFocus = () => {
    if (value.length >= 2) setDropdownOpen(true);
  };

  const handleBlur = (e) => {
    // Delay closing to allow click
    setTimeout(() => setDropdownOpen(false), 100);
  };

  return (
    <div className={styles.autocomplete}>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        autoComplete="off"
      />
      {dropdownOpen && value.length >= 2 && suggestions.length > 0 && (
        <ul className={styles.suggestions}>
          {isLoading ? (
            <li className={styles.loading}>Loading...</li>
          ) : (
            suggestions.map((suggestion, index) => (
              <li
                key={suggestion.id}
                className={index === activeIndex ? styles.active : ""}
                onClick={() => handleClick(suggestion)}
              >
                {suggestion.display_name}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};

export default Autocomplete;