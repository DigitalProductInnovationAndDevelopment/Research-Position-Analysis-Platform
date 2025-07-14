import React from "react";

const SearchResultCard = ({ result }) => {
  const authorString = result.authorships?.map(a => a.author.display_name).join(', ');
  const institutionList = result.authorships
    ? Array.from(new Set(result.authorships.flatMap(a => a.institutions || []).map(inst => inst.display_name))).filter(Boolean)
    : [];
  const institutionString = institutionList.join(', ');
  const publicationDate = result.publication_date || result.publication_year || '';
  const journalName = result.primary_location?.source?.display_name || '';

  return (
    <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 16px rgba(0,0,0,0.07)', padding: 24, marginBottom: 24 }}>
      <h3 style={{ margin: 0, fontWeight: 700, fontSize: '1.2rem' }}>{result.display_name}</h3>
      <div style={{ color: '#555', margin: '8px 0' }}>{authorString}</div>
      {institutionString && <div style={{ color: '#888', marginBottom: 4 }}>{institutionString}</div>}
      {journalName && <div style={{ color: '#888', marginBottom: 4 }}>{journalName}</div>}
      {publicationDate && <div style={{ color: '#888', marginBottom: 4 }}>{publicationDate}</div>}
      {result.abstract_inverted_index && (
        <div style={{ marginTop: 12, color: '#333' }}>
          <span>{Object.keys(result.abstract_inverted_index).slice(0, 30).join(' ')}...</span>
        </div>
      )}
      <div style={{ marginTop: 12, display: 'flex', gap: 16, alignItems: 'center' }}>
        <span style={{ color: '#4F6AF6', fontWeight: 600 }}>Citations: {result.cited_by_count}</span>
        {result.primary_location?.landing_page_url && (
          <a href={result.primary_location.landing_page_url} target="_blank" rel="noopener noreferrer" style={{ color: '#4F6AF6', textDecoration: 'underline' }}>
            View at Publisher
          </a>
        )}
      </div>
    </div>
  );
};

export default SearchResultCard; 