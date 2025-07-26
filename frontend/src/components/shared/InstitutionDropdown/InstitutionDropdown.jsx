import { useState, useEffect, useRef } from 'react';
import styles from '../../../assets/styles/institutionDropdown.module.css';

const InstitutionDropdown = ({ value, onChange, label = 'Select Institution', placeholder = 'Type to search institutions...', style = {}, className = '', onClearSearch, darkMode = false }) => {
  const [search, setSearch] = useState('');
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const debounceTimeout = useRef(null);

  useEffect(() => {
    // Clear search when value is cleared
    if (!value) {
      setSearch('');
    }
  }, [value]);

  useEffect(() => {
    // Debounce search
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    if (search.length >= 1) {
      debounceTimeout.current = setTimeout(() => {
        fetchInstitutions(search);
      }, 250);
    } else {
      setInstitutions([]);
    }
    return () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    };
  }, [search]);

  const fetchInstitutions = async (searchTerm) => {
    setLoading(true);
    try {
      const res = await fetch(`/autocomplete?query=${encodeURIComponent(searchTerm)}&type=institution`);
      const data = await res.json();
      setInstitutions((data.results || []).slice(0, 10));
    } catch (e) {
      setInstitutions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setSearch(e.target.value);
    setDropdownOpen(true);
  };

  const handleSelect = (institution) => {
    onChange && onChange(institution);
    setDropdownOpen(false);
    setSearch(institution.display_name);
  };

  const handleDropdownToggle = () => {
    setDropdownOpen((open) => {
      const willOpen = !open;
      if (willOpen && search.length >= 1 && institutions.length === 0 && !loading) {
        fetchInstitutions(search);
      }
      return willOpen;
    });
  };

  const handleBlur = () => {
    setTimeout(() => setDropdownOpen(false), 100);
  };

  return (
    <div className={`${styles.dropdownContainer} ${className} ${darkMode ? 'dark' : ''}`} style={style}>
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
        />
        <button type="button" className={styles.toggleBtn} onClick={handleDropdownToggle}>
          ▼
        </button>
      </div>
      {dropdownOpen && search.length >= 1 && (
        <div className={styles.dropdownList}>
          {loading && <div className={styles.loading}>Loading...</div>}
          {institutions.map(inst => (
            <div
              key={inst.id}
              className={styles.dropdownItem}
              onClick={() => handleSelect(inst)}
            >
              {inst.display_name}
            </div>
          ))}
          {!loading && institutions.length === 0 && <div className={styles.noResults}>No institutions found.</div>}
        </div>
      )}
    </div>
  );
};

export default InstitutionDropdown;
