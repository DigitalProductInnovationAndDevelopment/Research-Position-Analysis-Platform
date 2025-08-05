import React from "react";
import styles from "../../assets/styles/about.module.css";

const HowToUseSparkBox = () => {
  return (
    <div style={{borderRadius: '20px', height: '100%', display: 'flex', flexDirection: 'column'}}>
      <h2 className={styles.boxTitle}>How to Use SPARK</h2>
      
      <h3 style={{ color: '#4F6AF6', marginTop: '1rem', marginBottom: '0.5rem' }}>Search Page</h3>
      <p>Use this page to explore publications from the OpenAlex database. You can:</p>
      <ul style={{ paddingLeft: '2rem', marginTop: '0.5rem', marginBottom: '1rem' }}>
        <li style={{ marginBottom: '0.5rem', listStylePosition: 'outside' }}>
          Search using keywords (matched in title and abstract)
        </li>
        <li style={{ marginBottom: '0.5rem', listStylePosition: 'outside' }}>
          Filter by: Authors (single or multiple), Institutions, Publication type, Journal, Publication year, *Year range
        </li>
      </ul>

      <h3 style={{ color: '#4F6AF6', marginTop: '1rem', marginBottom: '0.5rem' }}>Publication Trends Page</h3>
      <p>Track the evolution of research topics over time. You can:</p>
      <ul style={{ paddingLeft: '2rem', marginTop: '0.5rem', marginBottom: '1rem' }}>
        <li style={{ marginBottom: '0.5rem', listStylePosition: 'outside' }}>
          Search using keywords (matched in title and abstract)
        </li>
        <li style={{ marginBottom: '0.5rem', listStylePosition: 'outside' }}>
          Filter by: Authors (single or multiple), Institutions, Publication types, Journals, Publication year, *Year range
        </li>
      </ul>

      <h3 style={{ color: '#4F6AF6', marginTop: '1rem', marginBottom: '0.5rem' }}>Collaboration Page</h3>
      <p>Analyze co-authorship and institutional collaboration networks. You can:</p>
      <ul style={{ paddingLeft: '2rem', marginTop: '0.5rem', marginBottom: '1rem' }}>
        <li style={{ marginBottom: '0.5rem', listStylePosition: 'outside' }}>
          Enter an institution
        </li>
        <li style={{ marginBottom: '0.5rem', listStylePosition: 'outside' }}>
          Optionally filter by: Authors (single or multiple), Keywords (title and abstract)
        </li>
        <li style={{ marginBottom: '0.5rem', listStylePosition: 'outside' }}>
          Click "Generate Graph" to visualize the network
        </li>
      </ul>
      <p>In the generated graph:</p>
      <ul style={{ paddingLeft: '2rem', marginTop: '0.5rem', marginBottom: '1rem' }}>
        <li style={{ marginBottom: '0.5rem', listStylePosition: 'outside' }}>
          Institutions are shown in <span style={{ color: '#FFA500' }}>orange</span>
        </li>
        <li style={{ marginBottom: '0.5rem', listStylePosition: 'outside' }}>
          Universities appear in <span style={{ color: '#0066CC' }}>blue</span>
        </li>
        <li style={{ marginBottom: '0.5rem', listStylePosition: 'outside' }}>
          Authors are displayed in <span style={{ color: '#800080' }}>purple</span>
        </li>
      </ul>
      <p>Clicking a connection between two nodes reveals the shared publications. Each listed paper includes a "View Publisher" link to access the publication.</p>

      <h3 style={{ color: '#4F6AF6', marginTop: '1rem', marginBottom: '0.5rem' }}>World Map Page</h3>
      <p>Visualize the global distribution and impact of research. You can:</p>
      <ul style={{ paddingLeft: '2rem', marginTop: '0.5rem', marginBottom: '1rem' }}>
        <li style={{ marginBottom: '0.5rem', listStylePosition: 'outside' }}>
          Search using keywords (matched in title and abstract)
        </li>
        <li style={{ marginBottom: '0.5rem', listStylePosition: 'outside' }}>
          Filter by: Authors (multiple), Institutions (multiple), Publication types, Journals, Publication year, *Year range
        </li>
      </ul>
      <p>SPARK displays a global map where each dot represents a localized publication, and a Research Leadership Analysis provides.</p>
    </div>
  );
};

export default HowToUseSparkBox; 