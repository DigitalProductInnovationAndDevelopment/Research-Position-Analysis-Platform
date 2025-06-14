import React from 'react';
import styles from './XLargeDataBox.module.css';

const XLargeDataBox = ({ chartImage, chartTitle, className }) => {
  return (
    <div className={`${styles.xLargeDataBox} ${className}`}>
      <div className={styles.chartTitle}>{chartTitle}</div>
      <div className={styles.chartContainer}>
        {chartImage && <img src={chartImage} alt="Chart" className={styles.chartImage} />}
      </div>
    </div>
  );
};

export default XLargeDataBox; 