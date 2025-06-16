import React, { useState } from 'react';
import SearchFilters from '../components/SearchFilters';

export default function SearchPage() {
  const [results, setResults] = useState([]);

  const handleSearch = async (filters) => {
    const params = new URLSearchParams(filters);
    const res = await fetch(`/api/search?${params.toString()}`);
    const data = await res.json();
    setResults(data);
  };

  const handleReset = () => {
    setResults([]);
  };

  return (
    <div>
      <SearchFilters onSearch={handleSearch} onReset={handleReset} />
      {/* Render results here */}
    </div>
  );
}