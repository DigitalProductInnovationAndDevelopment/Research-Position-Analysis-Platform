import React from "react";
import SearchResultCard from "./SearchResultCard";

const SearchResultsList = ({ results, loading, error }) => {
  if (loading) return <div style={{ textAlign: 'center', margin: '2rem 0' }}>Loading...</div>;
  if (error) return <div style={{ color: 'red', textAlign: 'center', margin: '2rem 0' }}>{error}</div>;
  if (!results || results.length === 0) return <div style={{ textAlign: 'center', margin: '2rem 0' }}>No publications found.</div>;
  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      {results.map(result => (
        <SearchResultCard key={result.id} result={result} />
      ))}
    </div>
  );
};

export default SearchResultsList; 