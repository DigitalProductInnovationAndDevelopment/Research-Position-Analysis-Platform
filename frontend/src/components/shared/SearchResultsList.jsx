import React from "react";
import SearchResultCard from "./SearchResultCard";

const SearchResultsList = ({ results, loading, error, darkMode = false }) => {
  if (loading) {
    return (
      <div style={{ 
        textAlign: 'center', 
        margin: '2rem 0',
        color: darkMode ? '#ccc' : '#666'
      }}>
        Loading...
      </div>
    );
  }
  
  if (error) {
    return (
      <div style={{ 
        color: darkMode ? '#ff6666' : 'red', 
        textAlign: 'center', 
        margin: '2rem 0',
        background: darkMode ? '#4a1a1a' : '#fef2f2',
        border: darkMode ? '1px solid #ff4444' : '1px solid #fecaca',
        borderRadius: '8px',
        padding: '1rem'
      }}>
        {error}
      </div>
    );
  }
  
  if (!results || results.length === 0) {
    return (
      <div style={{ 
        textAlign: 'center', 
        margin: '2rem 0',
        color: darkMode ? '#ccc' : '#666',
        background: darkMode ? '#2a2a2a' : '#f9fafb',
        border: darkMode ? '1px dashed #404040' : '1px dashed #d1d5db',
        borderRadius: '8px',
        padding: '2rem'
      }}>
        No publications found.
      </div>
    );
  }
  
  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      {results.map(result => (
        <SearchResultCard key={result.id} result={result} darkMode={darkMode} />
      ))}
    </div>
  );
};

export default SearchResultsList; 