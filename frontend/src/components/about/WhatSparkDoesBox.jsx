import React from "react";
import styles from "../../assets/styles/about.module.css";

const WhatSparkDoesBox = () => {
  return (
    <div style={{borderRadius: '20px', height: '100%', display: 'flex', flexDirection: 'column'}}>
      <h2 className={styles.boxTitle}>What SPARK Does:</h2>
      <p>
        SPARK (Siemens Publications and Research Knowledgebase) is a web-based analytics
        platform designed to automate and accelerate literature reviews.
      </p>
      <p>By integrating structured and unstructured publication data, SPARK:</p>
      <ol style={{ paddingLeft: '2rem', marginTop: '0.5rem', marginBottom: '1rem' }}>
        <li style={{ marginBottom: '0.5rem', listStylePosition: 'outside' }}>
          <strong>Identifies Institutional Outputs</strong> – Filters and tags publications by author affiliation to highlight Siemens-relevant research.
        </li>
        <li style={{ marginBottom: '0.5rem', listStylePosition: 'outside' }}>
          <strong>Analyzes Trend Dynamics</strong> – Generates time-series charts of keyword popularity and research activity over time.
        </li>
        <li style={{ marginBottom: '0.5rem', listStylePosition: 'outside' }}>
          <strong>Maps Collaborations</strong> – Builds and visualizes co-authorship networks to reveal top university and industry partners.
        </li>
        <li style={{ marginBottom: '0.5rem', listStylePosition: 'outside' }}>
          <strong>Benchmarks Performance</strong> – Compares your institution's contributions and citation metrics against peers.
        </li>
        <li style={{ marginBottom: '0.5rem', listStylePosition: 'outside' }}>
          <strong>Reports Impact</strong> – Displays patent citation rates and funding distributions as clear KPI cards.
        </li>
      </ol>
    </div>
  );
};

export default WhatSparkDoesBox; 