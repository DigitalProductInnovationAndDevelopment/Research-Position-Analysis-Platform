import React, { useState } from 'react';

const years = Array.from({ length: 30 }, (_, i) => 2025 - i); // Example: last 30 years

export default function SearchFilters({ onSearch, onReset }) {
  const [keyword, setKeyword] = useState('');
  const [year, setYear] = useState('');
  const [author, setAuthor] = useState('');
  const [institution, setInstitution] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ keyword, year, author, institution });
  };

  const handleReset = () => {
    setKeyword('');
    setYear('');
    setAuthor('');
    setInstitution('');
    onReset();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Keyword"
        value={keyword}
        onChange={e => setKeyword(e.target.value)}
      />
      <select value={year} onChange={e => setYear(e.target.value)}>
        <option value="">Year</option>
        {years.map(y => (
          <option key={y} value={y}>{y}</option>
        ))}
      </select>
      <input
        type="text"
        placeholder="Author"
        value={author}
        onChange={e => setAuthor(e.target.value)}
      />
      <input
        type="text"
        placeholder="Institution"
        value={institution}
        onChange={e => setInstitution(e.target.value)}
      />
      <button type="submit">Search</button>
      <button type="button" onClick={handleReset}>Reset</button>
    </form>
  );
}