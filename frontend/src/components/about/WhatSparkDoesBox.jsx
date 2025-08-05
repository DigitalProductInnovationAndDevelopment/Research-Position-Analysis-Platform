import React from "react";
import styles from "../../assets/styles/about.module.css";

const WhatSparkDoesBox = () => {
  return (
    <div style={{borderRadius: '20px', height: '100%', display: 'flex', flexDirection: 'column'}}>
      <h2 className={styles.boxTitle}>What SPARK Does</h2>
      <p>
        SPARK (Search Publications and Research Knowledgebase) is a comprehensive research publication analytics platform designed to automate and enhance the analysis of academic and industrial research output.
      </p>
      <p>With SPARK, users can:</p>
      <ol style={{ paddingLeft: '2rem', marginTop: '0.5rem', marginBottom: '1rem' }}>
        <li style={{ marginBottom: '0.5rem', listStylePosition: 'outside' }}>
          <strong>Search Publications with Precision</strong> – Use advanced filters including publication year, year range, author, affiliation, institution, keywords, journals, and publication type to find relevant research.
        </li>
        <li style={{ marginBottom: '0.5rem', listStylePosition: 'outside' }}>
          <strong>Track Topic Trends</strong> – Analyze the evolution of research topics over time, filtered by keywords, institutions, authors, journals, and publication types.
        </li>
        <li style={{ marginBottom: '0.5rem', listStylePosition: 'outside' }}>
          <strong>Discover Collaboration Networks</strong> – Visualize co-authorship and institutional collaboration networks based on selected authors, institutions, or research domains.
        </li>
        <li style={{ marginBottom: '0.5rem', listStylePosition: 'outside' }}>
          <strong>Identify Global Research Clusters</strong> – Explore a world map of research activity localized by keyword, author, or institution, with tools to assess global research impact.
        </li>
        <li style={{ marginBottom: '0.5rem', listStylePosition: 'outside' }}>
          <strong>Analyze Research Leadership</strong> – Examine country and institutional leadership, and emerging research trends.
        </li>
      </ol>
      <p>
        SPARK empowers users to explore, benchmark, and strategize around research activity with data-driven insights.
      </p>
    </div>
  );
};

export default WhatSparkDoesBox; 