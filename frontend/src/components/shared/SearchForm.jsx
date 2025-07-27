import React from "react";
import Autocomplete from "./Autocomplete/Autocomplete";
import searchPublicationsIcon from "../../assets/icons/search-publications.svg";
import authorIcon from "../../assets/icons/author.svg";
import institutionIcon from "../../assets/icons/institution.svg";

const SearchForm = ({
  searchKeyword,
  setSearchKeyword,
  author,
  setAuthor,
  institution,
  setInstitution,
  onSearch,
  onOpenAdvancedFilters,
  loading,
  darkMode = false
}) => {
  const labelStyle = { 
    fontWeight: 700, 
    fontSize: 16, 
    marginBottom: 4, 
    display: 'flex', 
    alignItems: 'center', 
    gap: 8, 
    paddingLeft: 2,
    color: darkMode ? '#fff' : '#000'
  };
  
  const subLabelStyle = { 
    fontWeight: 600, 
    fontSize: 14, 
    marginBottom: 4, 
    display: 'flex', 
    alignItems: 'center', 
    gap: 6,
    color: darkMode ? '#ccc' : '#000'
  };
  
  const inputBoxStyle = { 
    background: darkMode ? '#1a1a1a' : '#f8f9fb', 
    border: darkMode ? '1px solid #404040' : '1px solid #e5e7eb', 
    borderRadius: 8, 
    padding: '20px 22px', 
    fontSize: 18, 
    width: '100%', 
    height: 64,
    color: darkMode ? '#fff' : '#000'
  };

  return (
    <div style={{ 
      background: darkMode ? '#2a2a2a' : '#fff', 
      borderRadius: 16, 
      boxShadow: darkMode 
        ? '0 4px 24px rgba(0,0,0,0.3)' 
        : '0 4px 24px rgba(0,0,0,0.07)', 
      padding: 32, 
      maxWidth: 900, 
      margin: '0 auto 2rem auto',
      border: darkMode ? '1px solid #404040' : 'none'
    }}>
      <form onSubmit={e => { e.preventDefault(); onSearch(); }} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={labelStyle}>
          <span style={{ display: 'flex', alignItems: 'center' }}>
            <img src={searchPublicationsIcon} alt="Search Publications" style={{ marginRight: 4, width: 20, height: 20 }} />
          </span>
          Search Publications
        </div>
        <div style={{ 
          color: darkMode ? '#ccc' : '#888', 
          fontSize: 14, 
          marginBottom: 12, 
          paddingLeft: 2 
        }}>
          Enter keywords and apply filters to find relevant research
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
              Author
            </div>
            <div style={{ width: '100%' }}>
              <Autocomplete
                value={author}
                onValueChange={setAuthor}
                placeholder="Type author name"
                type="author"
                inputStyle={{ ...inputBoxStyle, height: 56 }}
                darkMode={darkMode}
              />
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={subLabelStyle}>
              <span style={{ display: 'flex', alignItems: 'center' }}>
                <img src={institutionIcon} alt="Institution" style={{ marginRight: 3, width: 18, height: 18 }} />
              </span>
              Institution
            </div>
            <div style={{ width: '100%' }}>
              <Autocomplete
                value={institution}
                onValueChange={setInstitution}
                placeholder="Type institution name"
                type="institution"
                inputStyle={{ ...inputBoxStyle, height: 56 }}
                darkMode={darkMode}
              />
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
              background: darkMode ? '#1a1a1a' : '#f5f6fa', 
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