import React from "react";

const customInputStyle = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: 6,
  border: '1px solid #ddd',
  fontSize: 16,
  background: '#fafbfc',
  marginTop: 4,
  marginBottom: 0,
  outline: 'none',
  boxSizing: 'border-box',
};

const AdvancedFiltersDrawer = ({
  open,
  onClose,
  publicationYear,
  setPublicationYear,
  startYear,
  setStartYear,
  endYear,
  setEndYear,
  publicationType,
  setPublicationType,
  onApply
}) => {
  if (!open) return null;
  return (
    <div style={{ position: 'fixed', top: 0, right: 0, width: 400, height: '100%', background: '#fff', boxShadow: '-2px 0 16px rgba(0,0,0,0.07)', zIndex: 1000, padding: 32, overflowY: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 700 }}>Advanced Filters</h2>
        <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer' }}>Close</button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <input type="text" placeholder="Type (e.g., journal-article)" value={publicationType} onChange={e => setPublicationType(e.target.value)} style={{ padding: 10, borderRadius: 6, border: '1px solid #ddd' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 0 }}>
          <label style={{ fontWeight: 500, marginBottom: 2 }}>Publication Year</label>
          <input
            type="number"
            placeholder="e.g. 2023"
            value={publicationYear}
            onChange={e => setPublicationYear(e.target.value)}
            style={customInputStyle}
          />
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <input type="number" placeholder="Year From" value={startYear} onChange={e => setStartYear(e.target.value)} style={{ flex: 1, padding: 10, borderRadius: 6, border: '1px solid #ddd' }} />
          <input type="number" placeholder="Year To" value={endYear} onChange={e => setEndYear(e.target.value)} style={{ flex: 1, padding: 10, borderRadius: 6, border: '1px solid #ddd' }} />
        </div>
        <button onClick={onApply} style={{ background: '#4F6AF6', color: '#fff', border: 'none', borderRadius: 6, padding: '10px 24px', fontWeight: 600, cursor: 'pointer', marginTop: 12 }}>Apply Filters</button>
      </div>
    </div>
  );
};

export default AdvancedFiltersDrawer; 