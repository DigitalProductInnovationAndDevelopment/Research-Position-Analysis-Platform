import React from "react";
import SearchResultCard from "./SearchResultCard";

const SearchResultsList = ({ results, loading, error, darkMode = false }) => {
  if (loading) {
    return (
      <div style={{ 
        textAlign: 'center', 
        margin: '2rem 0',
        color: '#ccc'
      }}>
        Loading...
      </div>
    );
  }
  
  if (error) {
    return (
      <div style={{ 
        color: '#ff6666', 
        textAlign: 'center', 
        margin: '2rem 0',
        background: '#4a1a1a',
        border: '1px solid #ff4444',
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
        color: '#ccc',
        background: '#2a2a2a',
        border: '1px dashed #404040',
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