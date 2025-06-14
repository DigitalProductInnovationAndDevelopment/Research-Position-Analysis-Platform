import React from "react";
import styles from "../../assets/styles/about.module.css";
import WhatSparkDoesBox from "../../components/about/WhatSparkDoesBox";
import HowToUseSparkBox from "../../components/about/HowToUseSparkBox";
import ImpressumBox from "../../components/about/ImpressumBox";
import RightColumnAboutBoxes from "../../components/about/RightColumnAboutBoxes";
import SideMenu from "../../components/shared/SideMenu/SideMenu";
import TopmenuFill from "../../components/shared/TopMenu/TopMenu";
import DarkBtn from "../../components/shared/DarkBtn/DarkBtn";

// Imports for SideMenu icons and logo from src/assets
import iconSidebarActive from "../../assets/icons/icon-sidebar-active.svg";
import iconSidebar from "../../assets/icons/icon-sidebar.svg";
import iconSidebar1 from "../../assets/icons/icon-sidebar-1.svg";
import iconTickets from "../../assets/icons/icon-tickets.svg";
import search3Svg from "../../assets/icons/search-3.svg";
import siemensLogo from "../../assets/images/siemens-logo.png";

export const AboutPage = ({ darkMode, toggleDarkMode }) => {
  return (
    <div className={styles.aboutPageLight}>
      <SideMenu
        className={styles.sideMenu}
        darkMode={darkMode}
        iconSidebar={iconSidebar}
        iconSidebar1={iconSidebar1}
        iconSidebarActive={iconSidebarActive}
        img={iconTickets}
        logo={siemensLogo}
        logoPlaceholderLogoStyleImglogoClassName={styles.sideMenu2}
        logoPlaceholderSiemensLogoSvg={siemensLogo}
        mobile={false}
      />
      <DarkBtn className={styles.darkBtnInstance} darkLight={darkMode} onClick={toggleDarkMode} />

      <div className={styles.mainContent}>
        <TopmenuFill
          className={styles.topmenuFill}
          searchFieldIconOutlinedSearch={search3Svg}
        />
        <h1 className={styles.pageTitle}>About SPARK</h1>
        <div className={styles.aboutContentGrid}>
          <WhatSparkDoesBox />
          <HowToUseSparkBox />
          <RightColumnAboutBoxes />
        </div>
        <ImpressumBox />
      </div>
    </div>
  );
};
