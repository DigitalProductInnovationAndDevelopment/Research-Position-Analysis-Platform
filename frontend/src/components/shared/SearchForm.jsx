import React from "react";
import searchPublicationsIcon from "../../assets/icons/search-publications.svg";
import authorIcon from "../../assets/icons/author.svg";
import institutionIcon from "../../assets/icons/institution.svg";

const SearchForm = ({
  searchKeyword,
  setSearchKeyword,
  selectedAuthors = [],
  setSelectedAuthors,
  selectedInstitutions = [],
  setSelectedInstitutions,
  onSearch,
  onOpenAdvancedFilters,
  onAuthorsClick,
  onInstitutionsClick,
  loading,
  darkMode = false,
  description = "Enter keywords and apply filters to find relevant research"
}) => {
  const labelStyle = { 
    fontWeight: 700, 
    fontSize: 16, 
    marginBottom: 4, 
    display: 'flex', 
    alignItems: 'center', 
    gap: 8, 
    paddingLeft: 2,
    color: '#fff'
  };
  
  const subLabelStyle = { 
    fontWeight: 600, 
    fontSize: 14, 
    marginBottom: 4, 
    display: 'flex', 
    alignItems: 'center', 
    gap: 6,
    color: '#ccc'
  };
  
  const inputBoxStyle = { 
    background: '#222', 
    border: '1px solid #404040', 
    borderRadius: 8, 
    padding: '20px 22px', 
    fontSize: 18, 
    width: '100%', 
    height: 64,
    color: '#fff'
  };

  return (
    <div style={{ 
      background: 'rgba(26, 26, 26, 0.25)', 
      backdropFilter: 'blur(4px)',
      borderRadius: 16, 
      boxShadow: '0 4px 24px rgba(0,0,0,0.3)', 
      padding: 32, 
      maxWidth: 900, 
      margin: '0 auto 2rem auto',
      border: '1px solid rgba(64, 64, 64, 0.2)'
    }}>
      <form onSubmit={e => { e.preventDefault(); onSearch(); }} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={labelStyle}>
          <span style={{ display: 'flex', alignItems: 'center' }}>
            <img src={searchPublicationsIcon} alt="Search Publications" style={{ marginRight: 4, width: 20, height: 20 }} />
          </span>
          Search Publications
        </div>
        <div style={{ 
          color: '#ccc', 
          fontSize: 14, 
          marginBottom: 12, 
          paddingLeft: 2 
        }}>
          {description}
        </div>
        <input
          type="text"
          placeholder="Enter keywords..."
          value={searchKeyword}
          onChange={e => setSearchKeyword(e.target.value)}
          style={{ 
            ...inputBoxStyle, 
            marginBottom: 12, 
            height: 48, 
            padding: '16px 18px'
          }}
        />
        <div style={{ display: 'flex', gap: 16 }}>
          <div style={{ flex: 1 }}>
            <div style={subLabelStyle}>
              <span style={{ display: 'flex', alignItems: 'center' }}>
                <img src={authorIcon} alt="Author" style={{ marginRight: 3, width: 18, height: 18 }} />
              </span>
              Authors
            </div>
            <div style={{ width: '100%' }}>
              <div
                style={{
                  minHeight: 48,
                  border: '1px solid #404040',
                  borderRadius: 8,
                  background: '#222',
                  display: 'flex',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 6,
                  padding: '8px 12px',
                  cursor: 'pointer',
                  color: '#fff'
                }}
                onClick={onAuthorsClick}
              >
                {selectedAuthors.length === 0 && (
                  <span style={{ color: '#888' }}>Click to search authors...</span>
                )}
                {selectedAuthors.map(author => (
                  <span key={author.id} style={{
                    background: '#4F6AF6',
                    color: '#fff',
                    borderRadius: 12,
                    padding: '2px 10px',
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: 14,
                    marginRight: 4
                  }}>
                    {author.display_name}
                    <button
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#fff',
                        marginLeft: 6,
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: 16
                      }}
                      onClick={e => {
                        e.stopPropagation();
                        setSelectedAuthors(selectedAuthors.filter(a => a.id !== author.id));
                      }}
                      aria-label="Remove author"
                    >×</button>
                  </span>
                ))}
              </div>
            </div>
          </div>
          {/* Institutions Multi-Select */}
          <div style={{ flex: 1 }}>
            <div style={subLabelStyle}>
              <span style={{ display: 'flex', alignItems: 'center' }}>
                <img src={institutionIcon} alt="Institution" style={{ marginRight: 3, width: 18, height: 18 }} />
              </span>
              Institutions
            </div>
            <div style={{ width: '100%' }}>
              <div
                style={{
                  minHeight: 48,
                  border: '1px solid #404040',
                  borderRadius: 8,
                  background: '#222',
                  display: 'flex',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 6,
                  padding: '8px 12px',
                  cursor: 'pointer',
                  color: '#fff'
                }}
                onClick={onInstitutionsClick}
              >
                {selectedInstitutions.length === 0 && (
                  <span style={{ color: '#888' }}>Click to search institutions...</span>
                )}
                {selectedInstitutions.map(inst => (
                  <span key={inst.id} style={{
                    background: '#4F6AF6',
                    color: '#fff',
                    borderRadius: 12,
                    padding: '2px 10px',
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: 14,
                    marginRight: 4
                  }}>
                    {inst.display_name}
                    <button
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#fff',
                        marginLeft: 6,
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: 16
                      }}
                      onClick={e => {
                        e.stopPropagation();
                        setSelectedInstitutions(selectedInstitutions.filter(i => i.id !== inst.id));
                      }}
                      aria-label="Remove institution"
                    >×</button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12, marginTop: 18 }}>
          <button 
            type="submit" 
            style={{ 
              background: '#4F6AF6', 
              color: '#fff', 
              border: 'none', 
              borderRadius: 8, 
              padding: '10px 24px', 
              fontWeight: 600, 
              cursor: 'pointer', 
              fontSize: 16, 
              display: 'flex', 
              alignItems: 'center', 
              gap: 8,
              opacity: loading ? 0.7 : 1
            }} 
            disabled={loading}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
          <button 
            type="button" 
            style={{ 
              background: 'rgba(26, 26, 26, 0.15)', 
              color: '#4F6AF6', 
              border: '1px solid #4F6AF6', 
              borderRadius: 8, 
              padding: '10px 24px', 
              fontWeight: 600, 
              cursor: 'pointer', 
              fontSize: 16 
            }} 
            onClick={onOpenAdvancedFilters}
          >
            Advanced Filters
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchForm; 