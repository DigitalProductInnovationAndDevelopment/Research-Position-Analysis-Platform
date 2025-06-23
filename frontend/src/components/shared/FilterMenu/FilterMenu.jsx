import React, { useState } from 'react';
import styles from './FilterMenu.module.css';

const FilterMenu = ({ onSelectFilter, availableFilters }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFilters = availableFilters.filter(filter =>
    filter.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.filterMenu}>
      <div className={styles.searchAllFilters}>
        <input
          type="text"
          placeholder="Search all filters"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <ul>
        {filteredFilters.map((filter) => (
          <li key={filter} onClick={() => onSelectFilter(filter)}>
            {filter}
          </li>
        ))}
      </ul>
      <div className={styles.moreOptions}>
        <button>More</button>
      </div>
    </div>
  );
};

export default FilterMenu; 