import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './TopMenu.module.css';

/**
 * TopMenu Component
 * A top navigation bar component
 * @param {Object} props
 * @param {string} props.className - Additional CSS class name
 * @param {string} props.searchFieldIconOutlinedSearch - Search icon source
 * @param {Function} props.onSearch - Search handler function
 * @param {string} props.placeholder - Search placeholder text
 * @param {boolean} props.hideSearch - Whether to hide the search bar
 */
const TopMenu = ({
  className,
  searchFieldIconOutlinedSearch,
  onSearch,
  placeholder = "Search keyword...",
  hideSearch
}) => {
  const navigate = useNavigate();

  const handleSearch = (e) => {
    const query = e.target.value;
    
    // Validate input type
    if (e.key === 'Enter') {
      // Check if the input is a number or contains only numbers
      if (!isNaN(query) || /^\d+$/.test(query)) {
        alert('Please enter a keyword (text) instead of numbers');
        return;
      }
      
      // Check if the input is empty or contains only whitespace
      if (!query.trim()) {
        alert('Please enter a keyword to search');
        return;
      }

      // Navigate to search page with the query
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleWorldMapClick = () => {
    navigate('/world-map');
  };

  return (
    <header className={`${styles.topMenu} ${className || ''}`}>
      {!hideSearch && (
        <div className={styles.searchContainer}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder={placeholder}
            onChange={handleSearch}
            onKeyPress={handleSearch}
          />
          <img 
            src={searchFieldIconOutlinedSearch} 
            alt="Search" 
            className={styles.searchIcon}
          />
        </div>
      )}
      <button
        className={styles.worldMapNavBtn}
        onClick={handleWorldMapClick}
        style={{ marginLeft: 'auto', marginRight: 16, padding: '8px 18px', borderRadius: 6, border: 'none', background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)', color: '#fff', fontWeight: 600, fontSize: 16, cursor: 'pointer', boxShadow: '0 2px 8px rgba(102,126,234,0.08)' }}
      >
        World Map
      </button>
    </header>
  );
};

export default TopMenu; 