import React from "react";
import DarkBtn from "../../components/shared/DarkBtn/DarkBtn";
import PromoBox from "../../components/shared/PromoBox/PromoBox";
import SideMenu from "../../components/shared/SideMenu/SideMenu";
import TopmenuFill from "../../components/shared/TopMenu/TopMenu";
import XLargeDataBox from "../../components/shared/XLargeDataBox/XLargeDataBox";
import XSmallDataBox from "../../components/shared/XSmallDataBox/XSmallDataBox";
import XxSmallDataBox from "../../components/shared/XxSmallDataBox/XxSmallDataBox";
import arrowUpward6 from "../../assets/icons/arrow-upward-6.svg";
import lineChartRed from "../../assets/images/line-chart-red.png";
import lineChartGreen from "../../assets/images/line-chart-green.png";
import donutChart from "../../assets/images/donut-chart.png";
import dashboardPromo from "../../assets/images/dashboard-promo.png";
import siemensLogo from "../../assets/images/siemens-logo.png";
import barChartPng from "../../assets/images/bar-chart.png";
import collaborationsBarChart from "../../assets/images/collaborations_over_time.png";
import styles from "../../assets/styles/landing.module.css";


// Imports for SideMenu icons and logo from src/assets
import iconSidebarActive from "../../assets/icons/icon-sidebar-active.svg";
import iconSidebar from "../../assets/icons/icon-sidebar.svg";
import iconSidebar1 from "../../assets/icons/icon-sidebar-1.svg";
import iconTickets from "../../assets/icons/icon-tickets.svg";
import search3Svg from "../../assets/icons/search-3.svg";
// import mainLogo from "../../assets/images/logo.svg"; // Assuming this is the main logo

export const LandingPageLight = ({ darkMode, toggleDarkMode }) => {
  return (
    <div className={styles.landingPageLight}>
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
        <div className={styles.contentRows}>
          <div className={styles.strip}>
            <PromoBox
              className={styles.promoBoxInstance}
              divClassName={styles.designComponentInstanceNode}
              img={dashboardPromo}
              mobile={false}
              rightColumnImg={dashboardPromo}
              rightColumnImgClassName={styles.promoBox2}
              rightColumnImgClassNameOverride={styles.promoBox2}
              style="color"
              text="Welcome to the SPARK dashboard! Explore the interactive dashboard to pinpoint Siemens' research contributions - apply filters for topics or institutions and watch the visuals update. Try typing a keyword and hitting 'Enter' to quickly see the latest results."
            />
            <XSmallDataBox
              className={styles.designComponentInstanceNode2}
              chartImage={collaborationsBarChart}
              text="Collaborations over Time"
            />
          </div>

          <div className={styles.strip}>
            <XxSmallDataBox
              chartImage={lineChartRed}
              chartTitle="CHART TITLE"
              className={styles.designComponentInstanceNode2}
            />
            <XxSmallDataBox
              chartImage={lineChartGreen}
              chartTitle="CHART TITLE"
              className={styles.designComponentInstanceNode2}
            />
            <XxSmallDataBox
              chartImage={lineChartRed}
              chartTitle="CHART TITLE"
              className={styles.xxSmallDataBox3}
            />
          </div>

          <div className={styles.strip}>
            <XLargeDataBox
              chartImage={barChartPng}
              chartTitle="Chart Title"
              className={styles.designComponentInstanceNode2}
            />
            <div className={styles.mediumDataBox}>
              <div className={styles.topText}>
                <div className={styles.textWrapper8}>
                  Contribution per Business Unit
                </div>
                <div className={styles.rightText}>
                  <img
                    className={styles.arrowUpward2}
                    alt="Arrow upward"
                    src={arrowUpward6}
                  />
                  <div className={styles.textWrapper9}>1.10% Since yesterday</div>
                </div>
              </div>
              <div className={styles.simpledonutchart}>
                <img src={donutChart} alt="Donut Chart" className={styles.donutChartImage} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
