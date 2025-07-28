import React from "react";

const SearchHeader = ({ 
  darkMode = false, 
  title = "Publication Search",
  subtitle = "Search and filter through millions of research publications"
}) => (
  <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'left', paddingLeft: 2 }}>
    <h1 style={{ 
      color: '#4F6AF6', 
      fontWeight: 700, 
      fontSize: '2.5rem', 
      marginBottom: '0.5rem', 
      lineHeight: 1.1 
    }}>
      {title}
    </h1>
    {subtitle && (
      <p style={{ 
        color: darkMode ? '#ccc' : '#555', 
        fontSize: '1.2rem', 
        marginBottom: 32 
      }}>
        {subtitle}
      </p>
    )}
  </div>
);

export default SearchHeader; 