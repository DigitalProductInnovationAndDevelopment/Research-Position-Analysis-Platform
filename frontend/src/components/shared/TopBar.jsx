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

const TopBar = () => {
  const location = useLocation();
  const isIndex = location.pathname === "/";
  
  return (
    <div style={{
      width: '100%',
      background: '#2a2a2a',
      borderBottom: '1px solid #404040',
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
                    ? '#4F6AF6'
                    : '#1a1a1a',
                  color: location.pathname === link.to 
                    ? '#fff'
                    : '#ccc',
                  border: '1px solid #404040',
                  borderRadius: 8,
                  padding: '8px 20px',
                  fontWeight: 600,
                  fontSize: 16,
                  cursor: 'pointer',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  if (location.pathname !== link.to) {
                    e.target.style.background = '#404040';
                  }
                }}
                onMouseLeave={(e) => {
                  if (location.pathname !== link.to) {
                    e.target.style.background = '#1a1a1a';
                  }
                }}
              >
                {link.label}
              </button>
            </Link>
          ))}
        </div>
      )}
      

    </div>
  );
};

export default TopBar; 