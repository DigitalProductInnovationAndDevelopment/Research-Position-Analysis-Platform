import React, { useState } from "react";
import TopBar from "../components/shared/TopBar";
import WorldMapPapers from "../components/shared/WorldMapPapers/WorldMapPapers";
import DropdownTrigger from "../components/shared/DropdownTrigger";
import ModalDropdown from "../components/shared/ModalDropdown";
import useDropdownSearch from "../hooks/useDropdownSearch";

const WorldMapPapersPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showInstitutionModal, setShowInstitutionModal] = useState(false);
  const [selectedInstitution, setSelectedInstitution] = useState(null);

  // Institution dropdown search
  const {
    suggestions: institutionSuggestions,
    loading: institutionLoading,
    searchItems: searchInstitutions,
    clearSuggestions: clearInstitutionSuggestions
  } = useDropdownSearch('https://api.openalex.org/institutions?search={query}&per_page=20');

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div style={{ background: '#1a1a1a', minHeight: '100vh' }}>
      <TopBar />
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem 1rem' }}>
        <h1 style={{ color: '#4F6AF6', fontWeight: 700, fontSize: '2.5rem', marginBottom: '1.5rem', lineHeight: 1.1 }}>World Map of Publications</h1>
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, maxWidth: 400 }}>
              <label style={{ 
                fontWeight: 600, 
                marginBottom: 8, 
                display: 'block', 
                color: '#fff' 
              }}>
                Search Query
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={handleInputChange}
                placeholder="Search for a paper, author, or keyword..."
                style={{
                  width: '100%',
                  padding: '12px 18px',
                  borderRadius: 8,
                  border: '1px solid #ccc',
                  fontSize: 18,
                  outline: 'none',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  background: '#222',
                  color: '#fff'
                }}
              />
            </div>
            <div style={{ flex: 1, maxWidth: 400 }}>
              <label style={{ 
                fontWeight: 600, 
                marginBottom: 8, 
                display: 'block', 
                color: '#fff' 
              }}>
                Filter by Institution
              </label>
                              <DropdownTrigger
                  value={selectedInstitution ? selectedInstitution.display_name : ''}
                  placeholder="Click to search institutions..."
                  onClick={() => {
                    setShowInstitutionModal(true);
                    clearInstitutionSuggestions();
                  }}
                  darkMode={true}
                />
            </div>
          </div>
        </div>
        <WorldMapPapers searchQuery={searchQuery} />

        {/* Institution Modal Dropdown */}
        <ModalDropdown
          isOpen={showInstitutionModal}
          onClose={() => setShowInstitutionModal(false)}
          title="Select Institution"
          placeholder="Type to search institutions..."
          onSearchChange={searchInstitutions}
          suggestions={institutionSuggestions}
          onSelect={(institution) => {
            setSelectedInstitution(institution);
          }}
          darkMode={true}
          loading={institutionLoading}
        />
      </div>
    </div>
  );
};

export default WorldMapPapersPage; 