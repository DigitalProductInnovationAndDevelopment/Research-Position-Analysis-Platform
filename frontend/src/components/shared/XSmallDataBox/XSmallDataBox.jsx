import React from 'react';
import styles from './XSmallDataBox.module.css';

const XSmallDataBox = ({ text, chartImage, className }) => {
  return (
    <div className={`${styles.xSmallDataBox} ${className}`}>
      <div className={styles.topText}>
        <div className={styles.textWrapper}>{text}</div>
      </div>
      <div className={styles.chartContainer}>
        {chartImage && <img src={chartImage} alt="Chart" className={styles.chartImage} />}
      </div>
    </div>
  );
};

export default XSmallDataBox; 