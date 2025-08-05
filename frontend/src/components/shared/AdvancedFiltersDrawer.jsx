import React from "react";
import DropdownTrigger from "./DropdownTrigger/DropdownTrigger";

const AdvancedFiltersDrawer = ({
  open,
  onClose,
  publicationYear,
  setPublicationYear,
  startYear,
  setStartYear,
  endYear,
  setEndYear,
  // Multi-select props
  selectedPublicationTypes,
  setSelectedPublicationTypes,
  selectedJournals,
  setSelectedJournals,
  onPublicationTypesClick,
  onJournalsClick,
  onApply,
  darkMode = true
}) => {
  if (!open) return null;

  const drawerStyle = {
    position: 'fixed',
    top: 0,
    right: 0,
    width: 400,
    height: '100%',
    background: darkMode ? '#1a1a1a' : '#fff',
    boxShadow: darkMode ? '-2px 0 16px rgba(0,0,0,0.5)' : '-2px 0 16px rgba(0,0,0,0.07)',
    zIndex: 1000,
    padding: 32,
    overflowY: 'auto',
    borderLeft: darkMode ? '1px solid #404040' : 'none'
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24
  };

  const titleStyle = {
    fontSize: '1.3rem',
    fontWeight: 700,
    color: darkMode ? '#fff' : '#000'
  };

  const closeButtonStyle = {
    background: 'none',
    border: 'none',
    fontSize: 18,
    cursor: 'pointer',
    color: darkMode ? '#ccc' : '#666',
    padding: '4px 8px',
    borderRadius: 4,
    transition: 'all 0.2s ease'
  };

  const inputStyle = {
    width: '100%',
    maxWidth: '100%',
    padding: '10px 14px',
    borderRadius: 6,
    border: darkMode ? '1px solid #404040' : '1px solid #ddd',
    fontSize: 16,
    background: darkMode ? '#2a2a2a' : '#fafbfc',
    color: darkMode ? '#fff' : '#000',
    marginTop: 4,
    marginBottom: 0,
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'all 0.2s ease'
  };

  const labelStyle = {
    fontWeight: 500,
    marginBottom: 2,
    color: darkMode ? '#fff' : '#000'
  };

  const applyButtonStyle = {
    background: '#4F6AF6',
    color: '#fff',
    border: 'none',
    borderRadius: 6,
    padding: '10px 24px',
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: 12,
    transition: 'all 0.2s ease'
  };

  const cancelButtonStyle = {
    background: 'transparent',
    color: darkMode ? '#ccc' : '#666',
    border: `1px solid ${darkMode ? '#404040' : '#ddd'}`,
    borderRadius: 6,
    padding: '10px 24px',
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: 8,
    transition: 'all 0.2s ease'
  };

  const yearRangeStyle = {
    display: 'flex',
    gap: 8,
    width: '100%'
  };

  const yearInputStyle = {
    flex: 1,
    minWidth: 0, // Allow flex items to shrink below their content size
    maxWidth: '50%', // Ensure each input takes at most half the container width
    padding: 10,
    borderRadius: 6,
    border: darkMode ? '1px solid #404040' : '1px solid #ddd',
    background: darkMode ? '#2a2a2a' : '#fafbfc',
    color: darkMode ? '#fff' : '#000',
    outline: 'none',
    transition: 'all 0.2s ease',
    boxSizing: 'border-box'
  };

  // Helper function to get display text for multi-select dropdowns
  const getDisplayText = (selectedItems, placeholder) => {
    if (!selectedItems || selectedItems.length === 0) {
      return placeholder;
    }
    if (selectedItems.length === 1) {
      return selectedItems[0].display_name;
    }
    return `${selectedItems.length} items selected`;
  };

  return (
    <div style={drawerStyle}>
      <div style={headerStyle}>
        <h2 style={titleStyle}>Advanced Filters</h2>
        <button 
          onClick={onClose} 
          style={closeButtonStyle}
          onMouseEnter={(e) => {
            e.target.style.background = darkMode ? '#404040' : '#f0f0f0';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'none';
          }}
        >
          ✕
        </button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {/* Publication Types Filter */}
        <div>
          <label style={labelStyle}>Publication Types</label>
          <DropdownTrigger
            value={getDisplayText(selectedPublicationTypes, "Click to select publication types...")}
            placeholder="Click to select publication types..."
            onClick={onPublicationTypesClick}
            darkMode={darkMode}
          />
        </div>

        {/* Journals Filter */}
        <div>
          <label style={labelStyle}>Journals</label>
          <DropdownTrigger
            value={getDisplayText(selectedJournals, "Click to select journals...")}
            placeholder="Click to select journals..."
            onClick={onJournalsClick}
            darkMode={darkMode}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 0 }}>
          <label style={labelStyle}>Publication Year</label>
          <input
            type="number"
            placeholder="e.g. 2023"
            value={publicationYear}
            onChange={e => setPublicationYear(e.target.value)}
            style={inputStyle}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label style={labelStyle}>Year Range</label>
          <div style={yearRangeStyle}>
            <input 
              type="number" 
              placeholder="Year From" 
              value={startYear} 
              onChange={e => setStartYear(e.target.value)} 
              style={yearInputStyle} 
            />
            <input 
              type="number" 
              placeholder="Year To" 
              value={endYear} 
              onChange={e => setEndYear(e.target.value)} 
              style={yearInputStyle} 
            />
          </div>
        </div>
        <button 
          onClick={onApply} 
          style={applyButtonStyle}
          onMouseEnter={(e) => {
            e.target.style.background = '#3d5ae8';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = '#4F6AF6';
          }}
        >
          Apply Filters
        </button>
        <button 
          onClick={onClose} 
          style={cancelButtonStyle}
          onMouseEnter={(e) => {
            e.target.style.background = darkMode ? '#404040' : '#f0f0f0';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'transparent';
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default AdvancedFiltersDrawer; 