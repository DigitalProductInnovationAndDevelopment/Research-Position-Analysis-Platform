import React from "react";
import { Link, useLocation } from "react-router-dom";

const navLinks = [
  { to: "/search", label: "Search" },
  { to: "/trends", label: "Topic Trends" },
  { to: "/graph-view", label: "Collaboration" },
  { to: "/about", label: "Learn More" },
];

const TopBar = () => {
  const location = useLocation();
  const isIndex = location.pathname === "/";
  return (
    <div style={{
      width: '100%',
      background: '#fff',
      borderBottom: '1px solid #f0f0f0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 2rem',
      height: 60,
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <Link to="/" style={{ textDecoration: 'none' }}>
        <div style={{ fontWeight: 900, fontSize: 24, color: '#7B61FF', letterSpacing: 1, cursor: 'pointer' }}>SPARK</div>
      </Link>
      {!isIndex && (
        <div style={{ display: 'flex', gap: 12, marginLeft: 32 }}>
          {navLinks.map(link => (
            <Link key={link.to} to={link.to} style={{ textDecoration: 'none' }}>
              <button
                style={{
                  background: '#f3f4f6',
                  color: '#333',
                  border: 'none',
                  borderRadius: 8,
                  padding: '8px 20px',
                  fontWeight: 600,
                  fontSize: 16,
                  cursor: 'pointer',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                  transition: 'background 0.2s, color 0.2s',
                  ...(location.pathname === link.to ? { background: '#e0e0e0', color: '#7B61FF' } : {})
                }}
              >
                {link.label}
              </button>
            </Link>
          ))}
        </div>
      )}
      <Link to="/world-map" style={{ textDecoration: 'none' }}>
        <button style={{
          background: '#7B61FF',
          color: '#fff',
          border: 'none',
          borderRadius: 8,
          padding: '8px 24px',
          fontWeight: 600,
          fontSize: 16,
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(123,97,255,0.08)'
        }}>
          Wordmap
        </button>
      </Link>
    </div>
  );
};

export default TopBar; 