import React from "react";
import styles from "../../assets/styles/aggregation.module.css";
import DarkBtn from "../../components/shared/DarkBtn/DarkBtn";
import SideMenu from "../../components/shared/SideMenu/SideMenu";
import SearchTopMenu from "../../components/shared/SearchTopMenu/SearchTopMenu";
import filter from "../../assets/icons/filter.svg";
import sort from "../../assets/icons/sort.svg";
import graphImage from "../../assets/images/graph.jpg";

// Imports for SideMenu icons and logo from src/assets
import iconSidebarActive from "../../assets/icons/icon-sidebar-active.svg";
import iconSidebar from "../../assets/icons/icon-sidebar.svg";
import iconSidebar1 from "../../assets/icons/icon-sidebar-1.svg";
import iconTickets from "../../assets/icons/icon-tickets.svg";
import siemensLogo from "../../assets/images/siemens-logo.png";

export const AggregationAnalysisLight = ({ darkMode, toggleDarkMode }) => {
  return (
    <div className={styles.aggregationPageLight}>
      <SideMenu
        className={styles.sideMenu}
        darkMode={darkMode}
        iconSidebar={iconSidebar}
        iconSidebar1={iconSidebar1}
        iconSidebarActive={iconSidebarActive}
        img={iconTickets}
        logo={siemensLogo}
        logoPlaceholderLogoStyleImglogoClassName={styles.sideMenu2}
        mobile={false}
      />
      <DarkBtn className={styles.darkBtnInstance} darkLight={darkMode} onClick={toggleDarkMode} />

      <div className={styles.mainContent}>
        <SearchTopMenu className={styles.topmenuFill} />
        <div className={styles.graphHeader}>
          <h1 className={styles.graphTitle}>Collaboration Network</h1>
          <div className={styles.graphControls}>
            <div className={styles.sortControl}>
              <img className={styles.controlIcon} alt="Sort icon" src={sort} />
              <div className={styles.controlText}>Sort</div>
            </div>
            <div className={styles.filterControl}>
              <img className={styles.controlIcon} alt="Filter icon" src={filter} />
              <div className={styles.controlText}>Filter</div>
            </div>
          </div>
        </div>
        <div className={styles.graphContainer}>
          <img className={styles.mainGraphImage} alt="Collaboration Network Graph" src={graphImage} />
        </div>
      </div>
    </div>
  );
};
