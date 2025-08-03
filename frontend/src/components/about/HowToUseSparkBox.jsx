import React from "react";
import styles from "../../assets/styles/about.module.css";

const HowToUseSparkBox = () => {
  return (
    <div style={{borderRadius: '20px', height: '100%', display: 'flex', flexDirection: 'column'}}>
      <h2 className={styles.boxTitle}>How to use SPARK:</h2>
      <ol style={{ paddingLeft: '2rem', marginTop: '0.5rem', marginBottom: '1rem' }}>
        <li style={{ marginBottom: '0.5rem', listStylePosition: 'outside' }}>
          Search: Enter a keyword or institution in the search bar.
        </li>
        <li style={{ marginBottom: '0.5rem', listStylePosition: 'outside' }}>
          Filter: Refine results by year, keyword, or affiliation using the filter panel.
        </li>
        <li style={{ marginBottom: '0.5rem', listStylePosition: 'outside' }}>
          Visualize: Explore charts and graphs for trends, collaborations, and benchmarks.
        </li>
        <li style={{ marginBottom: '0.5rem', listStylePosition: 'outside' }}>
          Export: Download your filtered data and visualizations as CSV or JSON for offline analysis.
        </li>
      </ol>
      <h3 className={styles.subTitle}>Data Source & what to expect:</h3>
      <ul style={{ paddingLeft: '2rem', marginTop: '0.5rem', marginBottom: '1rem' }}>
        <li style={{ marginBottom: '0.5rem', listStylePosition: 'outside' }}>
          Primary API: OpenAlex – Delivers rich, up-to-date publication metadata via RESTful queries.
        </li>
        <li style={{ marginBottom: '0.5rem', listStylePosition: 'outside' }}>
          Fallback Sources: IEEE Xplore, ACM Digital Library, and Google Scholar scraping as needed.
        </li>
      </ul>
      <p>
        Results are indicative of publicly available research outputs. While SPARK performs name-normalization and affiliation matching with high accuracy, some variations in author metadata may occur. For critical decisions, please cross-verify with original publication records
      </p>
    </div>
  );
};

export default HowToUseSparkBox; 