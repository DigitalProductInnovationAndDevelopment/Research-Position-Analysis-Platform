import React, { useState } from "react";
import PageLayout from "../../components/shared/PageLayout/PageLayout";
import WorldMapPapers from "../../components/shared/WorldMapPapers/WorldMapPapers";

const WorldMapPapersPage = ({ darkMode, toggleDarkMode }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <PageLayout darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 0' }}>
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
        <WorldMapPapers searchQuery={searchQuery} />
      </div>
    </PageLayout>
  );
};

export default WorldMapPapersPage; 