import React from "react";
import styles from "../../assets/styles/about.module.css";

const DisclaimerBox = () => {
  return (
    <div style={{padding: '1rem', borderRadius: '16px', border: '1px solid #ddd'}}>
      <h2 className={styles.boxTitle}>Disclaimer</h2>
      <p>
        SPARK is intended for internal research teams and does not guarantee exhaustive coverage of every publication source. External data changes or API updates may affect result completeness. Use SPARK insights as a guide, not a definitive source of record.
      </p>
      <p>
        This website is part of a non-commercial academic project and uses only publicly available, open-source data. No commercial intent is pursued.
      </p>
    </div>
  );
};

export default DisclaimerBox; 