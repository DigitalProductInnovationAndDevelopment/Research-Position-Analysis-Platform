import React from 'react';
import SideMenu from '../SideMenu/SideMenu';
import DarkBtn from '../DarkBtn/DarkBtn';
import TopMenu from '../TopMenu/TopMenu';
import search3Svg from '../../../assets/icons/search-3.svg';
import siemensLogo from '../../../assets/images/siemens-logo.png';
import styles from '../../../assets/styles/layout.module.css'; // Corrected import path

const PageLayout = ({ children, darkMode, toggleDarkMode, hideSearch = false }) => {
  return (
    <div className={styles.pageLayoutContainer}>
      <SideMenu
        className={styles.sideMenu}
        darkMode={darkMode}
        mobile={false}
        logo={siemensLogo}
      />
      <DarkBtn className={styles.darkBtnInstance} darkLight={darkMode} onClick={toggleDarkMode} />
      <div className={styles.contentArea}>
        <TopMenu hideSearch={hideSearch} searchFieldIconOutlinedSearch={search3Svg} />
        {children}
      </div>
    </div>
  );
};

export default PageLayout; 