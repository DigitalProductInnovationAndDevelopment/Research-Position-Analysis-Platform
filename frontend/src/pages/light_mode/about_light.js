import React from "react";
import styles from "../../assets/styles/about.module.css";
import WhatSparkDoesBox from "../../components/about/WhatSparkDoesBox";
import HowToUseSparkBox from "../../components/about/HowToUseSparkBox";
import ImpressumBox from "../../components/about/ImpressumBox";
import RightColumnAboutBoxes from "../../components/about/RightColumnAboutBoxes";
import PageLayout from "../../components/shared/PageLayout/PageLayout";


export const AboutPage = ({ darkMode, toggleDarkMode }) => {
  return (
    <PageLayout darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
      <div className={styles.mainContent}>
        <h1 className={styles.pageTitle}>About SPARK</h1>
        <div className={styles.aboutContentGrid}>
          <WhatSparkDoesBox />
          <HowToUseSparkBox />
          <RightColumnAboutBoxes />
        </div>
        <ImpressumBox />
      </div>
    </PageLayout>
  );
};
