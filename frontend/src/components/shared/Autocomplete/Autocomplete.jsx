import React, { useState, useEffect } from 'react';
import styles from './Autocomplete.module.css';
import useDebounce from '../../../hooks/useDebounce';

const Autocomplete = ({ value, onValueChange, placeholder, apiEndpoint, onEnterPress }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [searchOnEnter, setSearchOnEnter] = useState(false);
  const debouncedSearchTerm = useDebounce(value, 300);

  useEffect(() => {
    if (debouncedSearchTerm) {
      const fetchSuggestions = async () => {
        setIsLoading(true);
        try {
          const response = await fetch(`${apiEndpoint}/autocomplete?q=${encodeURIComponent(debouncedSearchTerm)}`);
          if (!response.ok) throw new Error('Failed to fetch');
          const data = await response.json();
          setSuggestions(data.results || []);
          setActiveIndex(0);
        } catch (error) {
          console.error("Failed to fetch autocomplete suggestions:", error);
          setSuggestions([]);
        }
        setIsLoading(false);
      };
      fetchSuggestions();
    } else {
      setSuggestions([]);
    }
  }, [debouncedSearchTerm, apiEndpoint]);

  useEffect(() => {
    if (searchOnEnter) {
      if (onEnterPress) {
        onEnterPress();
      }
      setSearchOnEnter(false);
    }
  }, [value, searchOnEnter, onEnterPress]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (suggestions.length > 0 && suggestions[activeIndex]) {
        onValueChange(suggestions[activeIndex].display_name);
        setSuggestions([]);
        setSearchOnEnter(true);
      } else {
        if (onEnterPress) {
          onEnterPress();
        }
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(activeIndex > 0 ? activeIndex - 1 : suggestions.length - 1);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(activeIndex < suggestions.length - 1 ? activeIndex + 1 : 0);
    } else if (e.key === 'Tab') {
        if(suggestions.length > 0 && suggestions[activeIndex]) {
            onValueChange(suggestions[activeIndex].display_name);
            setSuggestions([]);
        }
    }
  };
  
  const handleClick = (suggestion) => {
    onValueChange(suggestion.display_name);
    setSuggestions([]);
  };

  return (
    <div className={styles.autocomplete}>
      <input
        type="text"
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
      />
      {value && suggestions.length > 0 && (
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