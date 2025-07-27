import React from "react";
import { Link, useLocation } from "react-router-dom";
import searchIcon from "../../assets/icons/search.svg";
import trendIcon from "../../assets/icons/trend.svg";
import graphIcon from "../../assets/icons/graph.svg";
import worldMapIcon from "../../assets/icons/world-map.svg";

const navLinks = [
  { to: "/search", label: "Search", icon: searchIcon },
  { to: "/trends", label: "Topic Trends", icon: trendIcon },
  { to: "/graph-view", label: "Collaboration", icon: graphIcon },
  { to: "/world-map", label: "World Map", icon: worldMapIcon },
  { to: "/about", label: "Learn More" },
];

const TopBar = ({ darkMode, toggleDarkMode }) => {
  const location = useLocation();
  const isIndex = location.pathname === "/";
  
  return (
    <div style={{
      width: '100%',
      background: darkMode ? '#2a2a2a' : '#fff',
      borderBottom: darkMode ? '1px solid #404040' : '1px solid #f0f0f0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0 2rem',
      height: 60,
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '10%' }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <div style={{ 
            fontWeight: 900, 
            fontSize: 24, 
            color: '#7B61FF', 
            letterSpacing: 1, 
            cursor: 'pointer' 
          }}>
            SPARK
          </div>
        </Link>
      </div>
      {!isIndex && (
        <div style={{ display: 'flex', gap: 15, justifyContent: 'center' }}>
          {navLinks.map(link => (
            <Link key={link.to} to={link.to} style={{ textDecoration: 'none' }}>
              <button
                style={{
                  background: location.pathname === link.to 
                    ? (darkMode ? '#4F6AF6' : '#e0e0e0')
                    : (darkMode ? '#1a1a1a' : '#f3f4f6'),
                  color: location.pathname === link.to 
                    ? (darkMode ? '#fff' : '#7B61FF')
                    : (darkMode ? '#ccc' : '#333'),
                  border: darkMode ? '1px solid #404040' : 'none',
                  borderRadius: 8,
                  padding: '8px 20px',
                  fontWeight: 600,
                  fontSize: 16,
                  cursor: 'pointer',
                  boxShadow: darkMode 
                    ? '0 1px 4px rgba(0,0,0,0.3)' 
                    : '0 1px 4px rgba(0,0,0,0.04)',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  if (location.pathname !== link.to) {
                    e.target.style.background = darkMode ? '#404040' : '#e8e8e8';
                  }
                }}
                onMouseLeave={(e) => {
                  if (location.pathname !== link.to) {
                    e.target.style.background = darkMode ? '#1a1a1a' : '#f3f4f6';
                  }
                }}
              >
                {link.label}
              </button>
            </Link>
          ))}
        </div>
      )}
      
      {/* Dark Mode Toggle Button */}
      {toggleDarkMode && (
        <button
          onClick={toggleDarkMode}
          style={{
            background: darkMode ? '#4F6AF6' : '#f3f4f6',
            color: darkMode ? '#fff' : '#333',
            border: darkMode ? '1px solid #404040' : '1px solid #e0e0e0',
            borderRadius: '50%',
            width: 40,
            height: 40,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 18,
            transition: 'all 0.2s',
            boxShadow: darkMode 
              ? '0 2px 8px rgba(0,0,0,0.4)' 
              : '0 2px 8px rgba(0,0,0,0.1)'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.1)';
            e.target.style.background = darkMode ? '#5a7aff' : '#e8e8e8';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.background = darkMode ? '#4F6AF6' : '#f3f4f6';
          }}
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
      )}
    </div>
  );
};

export default TopBar; 