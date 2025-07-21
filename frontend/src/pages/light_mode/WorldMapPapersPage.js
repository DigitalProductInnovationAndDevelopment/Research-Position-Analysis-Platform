import React, { useState } from "react";
import TopBar from "../../components/shared/TopBar";
import WorldMapPapers from "../../components/shared/WorldMapPapers/WorldMapPapers";

const WorldMapPapersPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [maxPapers, setMaxPapers] = useState(20); // Default value

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div style={{ background: '#f5f6fa', minHeight: '100vh' }}>
      <TopBar />
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem 1rem' }}>
        <h1 style={{ color: '#4F6AF6', fontWeight: 700, fontSize: '2.5rem', marginBottom: '1.5rem', lineHeight: 1.1 }}>World Map of Publications</h1>
        <div style={{ marginBottom: 24, textAlign: 'center' }}>
          <input
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            placeholder="Search for a paper, author, or keyword..."
            style={{
              width: '100%',
              maxWidth: 400,
              padding: '12px 18px',
              borderRadius: 8,
              border: '1px solid #ccc',
              fontSize: 18,
              outline: 'none',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
            }}
          />
        </div>
        <div style={{ marginBottom: 24, textAlign: 'center' }}>
          <label>
            Max papers to show:&nbsp;
            <input
              type="number"
              min={1}
              max={100}
              value={maxPapers}
              onChange={e => setMaxPapers(Number(e.target.value))}
              style={{ width: 80, padding: 6, borderRadius: 4, border: '1px solid #ccc', fontSize: 16 }}
            />
          </label>
        </div>
        <WorldMapPapers searchQuery={searchQuery} maxPapers={maxPapers} />
      </div>
    </div>
  );
};

export default WorldMapPapersPage; 