import React from "react";
import styles from "../../assets/styles/aggregation.module.css";
import filter from "../../assets/icons/filter.svg";
import sort from "../../assets/icons/sort.svg";
import graphImage from "../../assets/images/graph.jpg";
import PageLayout from "../../components/shared/PageLayout/PageLayout";

// Imports for SideMenu icons and logo from src/assets
// Removed individual icon imports as they are now handled by SideMenuWrapper
// import iconSidebarActive from "../../assets/icons/icon-sidebar-active.svg";
// import iconSidebar from "../../assets/icons/icon-sidebar.svg";
// import iconSidebar1 from "../../assets/icons/icon-sidebar-1.svg";
// import iconTickets from "../../assets/icons/icon-tickets.svg";
// import siemensLogo from "../../assets/images/siemens-logo.png"; // Removed, handled by wrapper
// import trendIcon from "../../assets/icons/trend.svg"; // Removed, handled by wrapper

export const AggregationAnalysisLight = ({ darkMode, toggleDarkMode }) => {
  return (
    <PageLayout darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
      <div className={styles.mainContent}>
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
    </PageLayout>
  );
};
