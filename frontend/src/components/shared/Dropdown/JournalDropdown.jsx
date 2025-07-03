import { useState, useEffect, useRef } from 'react';
import styles from '../../../assets/styles/institutionDropdown.module.css';

const JournalDropdown = ({ value, onChange, label = 'Select Journal', placeholder = 'Type to browse journals...', style = {}, className = '' }) => {
  const [search, setSearch] = useState('');
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0); // NEW
  const debounceTimeout = useRef(null);

  useEffect(() => {
    // Debounce search
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    if (search.length >= 2) {
      debounceTimeout.current = setTimeout(() => {
        fetchJournals(search);
      }, 300);
    } else {
      setJournals([]);
    }
    return () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    };
  }, [search]);

  const fetchJournals = async (searchTerm) => {
    setLoading(true);
    try {
      const res = await fetch(`/autocomplete?query=${encodeURIComponent(searchTerm)}&type=journals`);
      const data = await res.json();
      setJournals((data.results || []).slice(0, 10));
    } catch (e) {
      setJournals([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setSearch(e.target.value);
    setDropdownOpen(true);
    setActiveIndex(0); // reset on new search
  };

  const handleKeyDown = (e) => {
    if (!dropdownOpen) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(i => (i + 1) % journals.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(i => (i - 1 + journals.length) % journals.length);
    } else if (e.key === 'Enter') {
      if (journals[activeIndex]) {
        handleSelect(journals[activeIndex]);
      }
    }
  };

  const handleSelect = (journal) => {
    onChange && onChange(journal);
    setDropdownOpen(false);
    setSearch(journal.display_name);
  };

  const handleDropdownToggle = () => {
    setDropdownOpen((open) => {
      const willOpen = !open;
      if (willOpen && search.length >= 2 && journals.length === 0 && !loading) {
        fetchJournals(search);
      }
      return willOpen;
    });
  };

  const handleBlur = () => {
    setTimeout(() => setDropdownOpen(false), 100);
  };

  return (
    <div className={`${styles.dropdownContainer} ${className}`} style={style}>
      {label && <label className={styles.label}>{label}</label>}
      <div className={styles.inputWrapper}>
        <input
          type="text"
          value={search}
          onChange={handleInputChange}
          onFocus={handleDropdownToggle}
          onBlur={handleBlur}
          placeholder={placeholder}
          className={styles.input}
          autoComplete="off"
          onKeyDown={handleKeyDown}
        />
        <button type="button" className={styles.toggleBtn} onClick={handleDropdownToggle}>
          ▼
        </button>
      </div>
      {dropdownOpen && search.length >= 2 && (
        <div className={styles.dropdownList}>
          {loading && <div className={styles.loading}>Loading...</div>}
          {journals.map(journal => (
            <div
              key={journal.id}
              className={styles.dropdownItem}
              onClick={() => handleSelect(journal)}
            >
              {journal.display_name}
            </div>
          ))}
            {!loading && journals.length === 0 && <div className={styles.noResults}>No journals found.</div>}
        </div>
      )}
      {value && value.display_name && (
        <div className={styles.selectedValue}>
          Selected: {value.display_name}
        </div>
      )}
    </div>
  );
};

export default JournalDropdown;
