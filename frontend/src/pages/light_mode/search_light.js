import React from "react";
import DarkBtn from "../../components/shared/DarkBtn/DarkBtn";
import SideMenu from "../../components/shared/SideMenu/SideMenu";
import SearchTopMenu from "../../components/shared/SearchTopMenu/SearchTopMenu";
import topResearchFunding from "../../assets/images/topResearchFunding.png";
import topCollaborationProjectsGpt1 from "../../assets/images/top_collaboration_projects_gpt 1.png";
import topResearchPartnerListGpt1 from "../../assets/images/top_research_partner_list_gpt 1.png";
import styles from "../../assets/styles/search.module.css";

// Imports for SideMenu icons and logo from src/assets
import iconSidebarActive from "../../assets/icons/icon-sidebar-active.svg";
import iconSidebar from "../../assets/icons/icon-sidebar.svg";
import iconSidebar1 from "../../assets/icons/icon-sidebar-1.svg";
import iconTickets from "../../assets/icons/icon-tickets.svg";
import siemensLogo from "../../assets/images/siemens-logo.png";

export const SearchPageLight = ({ darkMode, toggleDarkMode }) => {
  return (
    <div className={styles.searchPageLight}>
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
        <div className={styles.searchPageContent}>
          <h1 className={styles.filterCriteriaTitle}>Filter Criteria</h1>
          <div className={styles.filterSection}>
            <div className={styles.searchCriterium}>
              <div className={styles.label}>
                <div className={styles.criterium}>Institution</div>
              </div>
              <div className={styles.input}>
                <input
                  className={styles.hereIsSpaceFor}
                  placeholder="Here is some space for keywords and other category inputs."
                  type="text"
                />
              </div>
            </div>

            <div className={styles.searchCriterium}>
              <div className={styles.divWrapper}>
                <div className={styles.textWrapper3}>Year From</div>
              </div>
              <div className={styles.hereIsSpaceForWrapper}>
                <input
                  className={styles.hereIsSpaceFor2}
                  placeholder="Here is some space for keywords and other category inputs."
                  type="text"
                />
              </div>
            </div>

            <div className={styles.searchCriterium}>
              <div className={styles.divWrapper}>
                <div className={styles.textWrapper3}>Year To</div>
              </div>
              <div className={styles.hereIsSpaceForWrapper}>
                <input
                  className={styles.hereIsSpaceFor2}
                  placeholder="Here is some space for keywords and other category inputs."
                  type="text"
                />
              </div>
            </div>

            <div className={styles.searchCriterium}>
              <div className={styles.divWrapper}>
                <div className={styles.textWrapper3}>Author</div>
              </div>
              <div className={styles.hereIsSpaceForWrapper}>
                <input
                  className={styles.hereIsSpaceFor2}
                  placeholder="Here is some space for keywords and other category inputs."
                  type="text"
                />
              </div>
            </div>

            <div className={styles.searchCriterium}>
              <div className={styles.divWrapper}>
                <div className={styles.textWrapper3}>Funding</div>
              </div>
              <div className={styles.hereIsSpaceForWrapper}>
                <input
                  className={styles.hereIsSpaceFor2}
                  placeholder="Here is some space for keywords and other category inputs."
                  type="text"
                />
              </div>
            </div>

            <div className={styles.searchCriterium}>
              <div className={styles.criteriumWrapper}>
                <div className={styles.criterium2}>+ Add Filter</div>
              </div>
              <div className={styles.input2}>
                <input
                  className={styles.hereIsSpaceFor}
                  placeholder="Here is some space for keywords and other category inputs."
                  type="text"
                />
              </div>
            </div>
          </div>

          <div className={styles.resultList}>
            <div className={styles.imageBox}>
              <h2 className={styles.imageBoxTitle}>SIEMENS' TOP COLLABORATION PROJECTS</h2>
              <div className={styles.imageContent}>
                <img className={styles.chartImage} alt="Top Collaboration Projects" src={topCollaborationProjectsGpt1} />
              </div>
            </div>

            <div className={styles.imageBox}>
              <h2 className={styles.imageBoxTitle}>SIEMENS' TOP RESEARCH PARTNERS</h2>
              <div className={styles.imageContent}>
                <img className={styles.chartImage} alt="Top Research Partner List" src={topResearchPartnerListGpt1} />
              </div>
            </div>

            <div className={styles.imageBox}>
              <h2 className={styles.imageBoxTitle}>Top Funded Research Themes</h2>
              <div className={styles.imageContent}>
                <img className={styles.chartImage} alt="Top Research Funding" src={topResearchFunding} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
