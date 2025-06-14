import React from 'react';
import styles from './XxSmallDataBox.module.css';

const XxSmallDataBox = ({ chartImage, chartTitle, className }) => {
  return (
    <div className={`${styles.xxSmallDataBox} ${className}`}>
      <div className={styles.chartTitle}>{chartTitle}</div>
      <div className={styles.chartContainer}>
        {chartImage && <img src={chartImage} alt="Chart" className={styles.chartImage} />}
      </div>
    </div>
  );
};

export default XxSmallDataBox; 