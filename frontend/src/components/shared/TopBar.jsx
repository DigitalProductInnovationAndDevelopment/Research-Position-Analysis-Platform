import React from "react";
import { Link } from "react-router-dom";

const TopBar = () => (
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

export default TopBar; 