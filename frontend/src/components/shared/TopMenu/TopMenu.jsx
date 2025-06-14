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
 */
const TopMenu = ({
  className,
  searchFieldIconOutlinedSearch,
  onSearch,
  placeholder = "Search..."
}) => {
  const navigate = useNavigate();

  const handleSearch = (e) => {
    const query = e.target.value;
    // You can call the original onSearch prop if it's still needed for other logic
    onSearch?.(query);

    // Navigate to the search page. You can add the query as a URL parameter if needed.
    // For example: navigate(`/search?q=${query}`);
    if (e.key === 'Enter') { // Only navigate on Enter key press
        navigate(`/search?q=${query}`);
    }
  };

  return (
    <header className={`${styles.topMenu} ${className || ''}`}>
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
    </header>
  );
};

export default TopMenu; 