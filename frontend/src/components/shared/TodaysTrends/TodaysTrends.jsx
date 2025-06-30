import React from 'react';
import styles from './TodaysTrends.module.css';

/**
 * TodaysTrends Component
 * A component displaying today's trends and statistics
 * @param {Object} props
 * @param {string} props.className - Additional CSS class name
 * @param {Array} props.trends - Array of trend data
 * @param {Function} props.onTrendClick - Trend click handler
 */
const TodaysTrends = ({
  className,
  trends = [],
  onTrendClick
}) => {
  return (
    <div className={`${styles.container} ${className || ''}`}>
      <h2 className={styles.title}>Today's Trends</h2>
      <div className={styles.trendsGrid}>
        {trends.map((trend, index) => (
          <div 
            key={index}
            className={styles.trendCard}
            onClick={() => onTrendClick?.(trend)}
          >
            <div className={styles.trendHeader}>
              <img 
                src={trend.icon} 
                alt={trend.title} 
                className={styles.trendIcon}
              />
              <span className={styles.trendTitle}>{trend.title}</span>
            </div>
            <div className={styles.trendStats}>
              <span className={styles.trendValue}>{trend.value}</span>
              <span className={`${styles.trendChange} ${trend.change >= 0 ? styles.positive : styles.negative}`}>
                {trend.change >= 0 ? '+' : ''}{trend.change}%
              </span>
            </div>
            {trend.description && (
              <p className={styles.trendDescription}>{trend.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodaysTrends; 