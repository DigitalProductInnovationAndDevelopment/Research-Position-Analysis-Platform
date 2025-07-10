import React from "react";
import styles from "../../assets/styles/about.module.css";

const HowToUseSparkBox = () => {
  return (
    <div style={{padding: '2rem', borderRadius: '20px', border: '1px solid #ddd'}}>
      <h2 className={styles.boxTitle}>How to use SPARK:</h2>
      <ol className={styles.howToUseList}>
        <li>
          Search: Enter a keyword or institution in the search bar.
        </li>
        <li>
          Filter: Refine results by year, keyword, or affiliation using the filter panel.
        </li>
        <li>
          Visualize: Explore charts and graphs for trends, collaborations, and benchmarks.
        </li>
        <li>
          Export: Download your filtered data and visualizations as CSV or JSON for offline analysis.
        </li>
      </ol>
      <h3 className={styles.subTitle}>Data Source & what to expect:</h3>
      <ul className={styles.dataSourceList}>
        <li>
          Primary API: OpenAlex – Delivers rich, up-to-date publication metadata via RESTful queries.
        </li>
        <li>
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