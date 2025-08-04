import React from "react";
import styles from "../../assets/styles/about.module.css";

const DisclaimerBox = () => {
  return (
    <div style={{
      borderRadius: '16px',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    }}>
      <div>
        <h2 className={styles.boxTitle}>Disclaimer</h2>
        <p style={{ color: '#fff' }}>
          SPARK is intended for internal research teams and does not guarantee exhaustive coverage of every publication source. External data changes or API updates may affect result completeness. Use SPARK insights as a guide, not a definitive source of record.
        </p>
        <p style={{ color: '#fff' }}>
          This website is part of a non-commercial academic project and uses only publicly available, open-source data. No commercial intent is pursued.
        </p>
      </div>
    </div>
  );
};

export default DisclaimerBox; 