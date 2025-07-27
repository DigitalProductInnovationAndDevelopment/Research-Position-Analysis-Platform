import React from 'react';

const apiCallInfoBox = ({ userInputs, apiCalls, darkMode = true }) => {
  if (!userInputs || !apiCalls || (userInputs.length === 0 && apiCalls.length === 0)) {
    return null;
  }

  return (
    <div style={{
      background: '#2a2a2a',
      border: '1px solid #404040',
      borderRadius: 12,
      padding: 20,
      margin: '20px auto',
      maxWidth: 900,
      boxShadow: '0 2px 16px rgba(0,0,0,0.3)'
    }}>
      <h3 style={{
        color: '#fff',
        margin: '0 0 16px 0',
        fontSize: '1.1rem',
        fontWeight: 600,
        display: 'flex',
        alignItems: 'center',
        gap: 8
      }}>
        <span style={{ fontSize: '1.2rem' }}>ℹ️</span>
        API Call Information
      </h3>
      
      {userInputs.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ color: '#ccc', fontSize: '0.9rem', marginBottom: 8, fontWeight: 500 }}>
            Using your input:
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {userInputs.map((input, index) => (
              <div key={index} style={{ 
                color: '#fff', 
                fontSize: '0.9rem',
                padding: '4px 0'
              }}>
                <span style={{ color: '#4F6AF6', fontWeight: 600 }}>{input.category}:</span> {input.value}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {apiCalls.length > 0 && (
        <div>
          <div style={{ color: '#ccc', fontSize: '0.9rem', marginBottom: 8, fontWeight: 500 }}>
            The results displayed on this page are retrieved from the following database search:
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {apiCalls.map((call, index) => (
              <div key={index} style={{
                background: '#1a1a1a',
                border: '1px solid #404040',
                borderRadius: 8,
                padding: 12,
                fontFamily: 'monospace',
                fontSize: '0.8rem',
                color: '#ddd',
                wordBreak: 'break-all',
                lineHeight: 1.4
              }}>
                {call}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default apiCallInfoBox; 