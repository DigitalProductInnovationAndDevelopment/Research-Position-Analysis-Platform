import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './SideMenu.module.css';

// Import new icons
import homeIcon from '../../../assets/icons/home.svg';
import searchIcon from '../../../assets/icons/search.svg';
import graphIcon from '../../../assets/icons/graph.svg';
import aboutIcon from '../../../assets/icons/about.png';
import trendIcon from '../../../assets/icons/trend.svg';

/**
 * SideMenu Component
 * A navigation sidebar component
 * @param {Object} props
 * @param {string} props.className - Additional CSS class name
 * @param {boolean} props.darkMode - Whether the menu is in dark mode
 * @param {boolean} props.mobile - Whether the menu is in mobile view
 * @param {string} props.logo - Logo image source
 * @param {string} props.dividerLine - Divider line image
 */
const SideMenu = ({
  className,
  darkMode,
  mobile,
  logo,
  dividerLine
}) => {
  const location = useLocation();
  return (
    <nav className={`${styles.sideMenu} ${className || ''} ${darkMode ? styles.darkMode : ''} ${mobile ? styles.mobile : ''}`}>
      <div className={styles.logoContainer}>
        <img src={logo} alt="Logo" className={styles.logo} />
      </div>
      
      <div className={styles.menuItems}>
        <Link to="/" className={`${styles.menuItem} ${location.pathname === '/' ? styles.active : ''}`}>
          <img src={homeIcon} alt="Home" className={styles.icon} />
          <span className={styles.label}>Home</span>
        </Link>
        
        <Link to="/search" className={`${styles.menuItem} ${location.pathname === '/search' ? styles.active : ''}`}>
          <img src={searchIcon} alt="Search" className={styles.icon} />
          <span className={styles.label}>Search</span>
        </Link>
        
        <Link to="/trends" className={`${styles.menuItem} ${location.pathname === '/trends' ? styles.active : ''}`}>
          <img src={trendIcon} alt="View Trends" className={styles.icon} />
          <span className={styles.label}>View Trends</span>
        </Link>
        
        <Link to="/graph-view" className={`${styles.menuItem} ${location.pathname === '/graph-view' ? styles.active : ''}`}>
          <img src={graphIcon} alt="Graph View" className={styles.icon} />
          <span className={styles.label}>Graph View</span>
        </Link>
        
        <Link to="/about" className={`${styles.menuItem} ${location.pathname === '/about' ? styles.active : ''}`}>
          <img src={aboutIcon} alt="About SPARK" className={styles.icon} />
          <span className={styles.label}>About SPARK</span>
        </Link>
      </div>
    </nav>
  );
};

export default SideMenu; 