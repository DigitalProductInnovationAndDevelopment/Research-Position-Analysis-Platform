import { useState, useEffect, useRef } from 'react';
import styles from '../../../assets/styles/institutionDropdown.module.css';

const VenueDropdown = ({ value, onChange, label = 'Select Conference Venue', placeholder = 'Type to browse venues...', style = {}, className = '' }) => {
  const [search, setSearch] = useState('');
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0); 
  const debounceTimeout = useRef(null);

  useEffect(() => {
    // Debounce search
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    if (search.length >= 2) {
      debounceTimeout.current = setTimeout(() => {
        fetchVenues(search);
      }, 300);
    } else {
      setVenues([]);
    }
    return () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    };
  }, [search]);

  const fetchVenues = async (searchTerm) => {
    setLoading(true);
    try {
      const res = await fetch(`/autocomplete?query=${encodeURIComponent(searchTerm)}&type=venues`);
      const data = await res.json();
      setVenues((data.results || []).slice(0, 10));
    } catch (e) {
      setVenues([]);
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
      setActiveIndex(i => (i + 1) % venues.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(i => (i - 1 + venues.length) % venues.length);
    } else if (e.key === 'Enter') {
      if (venues[activeIndex]) {
        handleSelect(venues[activeIndex]);
      }
    }
  };

  const handleSelect = (venue) => {
    onChange && onChange(venue);
    setDropdownOpen(false);
    setSearch(venue.display_name);
  };

  const handleDropdownToggle = () => {
    setDropdownOpen((open) => {
      const willOpen = !open;
      if (willOpen && search.length >= 2 && venues.length === 0 && !loading) {
        fetchVenues(search);
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
          {venues.map(inst => (
            <div
              key={inst.id}
              className={styles.dropdownItem}
              onClick={() => handleSelect(inst)}
            >
              {inst.display_name}
            </div>
          ))}
          {!loading && venues.length === 0 && <div className={styles.noResults}>No venues found.</div>}
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

export default VenueDropdown;
