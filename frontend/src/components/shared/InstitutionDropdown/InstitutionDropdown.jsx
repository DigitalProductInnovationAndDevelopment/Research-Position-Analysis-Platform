import { useState, useEffect } from 'react';
import styles from '../../../assets/styles/institutionDropdown.module.css';

const PAGE_SIZE = 20;

const InstitutionDropdown = ({ value, onChange, label = 'Select Institution', placeholder = 'Type to search institutions...', style = {}, className = '' }) => {
  const [search, setSearch] = useState('');
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    setInstitutions([]);
    setPage(1);
    setHasMore(true);
  }, [search]);

  useEffect(() => {
    if (!dropdownOpen) return;
    fetchInstitutions(page, search);
  }, [page, search, dropdownOpen]);

  const fetchInstitutions = async (pageNum, searchTerm) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pageNum,
        per_page: PAGE_SIZE,
        search: searchTerm || '',
      });
      const res = await fetch(`/api/institutions?${params.toString()}`);
      const data = await res.json();
      if (pageNum === 1) {
        setInstitutions(data.results);
      } else {
        setInstitutions(prev => [...prev, ...data.results]);
      }
      setHasMore(data.results.length === PAGE_SIZE);
    } catch (e) {
      setInstitutions([]);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleSelect = (institution) => {
    onChange && onChange(institution);
    setDropdownOpen(false);
  };

  const handleDropdownToggle = () => {
    setDropdownOpen((open) => {
      const willOpen = !open;
      if (willOpen && institutions.length === 0 && !loading) {
        // Always fetch first page if opening and list is empty
        setPage(1);
        fetchInstitutions(1, search);
      }
      return willOpen;
    });
  };

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollHeight - scrollTop <= clientHeight + 10 && hasMore && !loading) {
      setPage((p) => p + 1);
    }
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
          placeholder={placeholder}
          className={styles.input}
        />
        <button type="button" className={styles.toggleBtn} onClick={handleDropdownToggle}>
          ▼
        </button>
      </div>
      {dropdownOpen && (
        <div className={styles.dropdownList} onScroll={handleScroll}>
          {loading && institutions.length === 0 && <div className={styles.loading}>Loading...</div>}
          {institutions.map(inst => (
            <div
              key={inst.id}
              className={styles.dropdownItem}
              onClick={() => handleSelect(inst)}
            >
              {inst.display_name}
            </div>
          ))}
          {loading && institutions.length > 0 && <div className={styles.loading}>Loading more...</div>}
          {!loading && institutions.length === 0 && <div className={styles.noResults}>No institutions found.</div>}
        </div>
      )}
      {value && (
        <div className={styles.selectedValue}>
          Selected: {value.display_name}
        </div>
      )}
    </div>
  );
};

export default InstitutionDropdown;
