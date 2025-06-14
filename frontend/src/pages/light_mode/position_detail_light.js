import React from "react";
import styles from "../../assets/styles/position.module.css";
import Cards from "../../components/shared/Cards/Cards";
import DarkBtn from "../../components/shared/DarkBtn/DarkBtn";
import SideMenu from "../../components/shared/SideMenu/SideMenu";
import TicketsAndTasks from "../../components/shared/TicketsAndTasks/TicketsAndTasks";
import TodaysTrends from "../../components/shared/TodaysTrends/TodaysTrends";
import TopmenuFill from "../../components/shared/TopMenu/TopMenu";
import XLargeDataBox from "../../components/shared/XLargeDataBox/XLargeDataBox";

// Image imports from assets
import lineChartRed from "../../assets/images/line-chart-red.png";
import cardsImage from "../../assets/images/Cards.png";
import ticketsAndTasksImage from "../../assets/images/Tickets and tasks.png";
import todaysTrendsImage from "../../assets/images/Today's trends.png";

// Imports for SideMenu icons and logo from src/assets
import homeIcon from "../../assets/icons/home.svg";
import searchIcon from "../../assets/icons/search.svg";
import graphIcon from "../../assets/icons/graph.svg";
import aboutIcon from "../../assets/icons/about.png";
import dividerLineImg from "../../assets/images/divider-line.svg";
import siemensLogo from "../../assets/images/siemens-logo.png";
import search3Svg from "../../assets/icons/search-3.svg";

export const PositionDetailLight = ({ darkMode, toggleDarkMode }) => {
  return (
    <div className={styles.positionPageLight}>
      <SideMenu
        className={styles.sideMenu}
        darkMode={darkMode}
        iconSidebarActive={homeIcon}
        iconSidebar={searchIcon}
        iconSidebar1={graphIcon}
        img={aboutIcon}
        logo={siemensLogo}
        logoPlaceholderLogoStyleImglogoClassName={styles.sideMenu2} // Assuming this prop name is still relevant for styling
        logoPlaceholderSiemensLogoSvg={siemensLogo}
        mobile={false}
      />
      <DarkBtn className={styles.darkBtnInstance} darkLight={darkMode} onClick={toggleDarkMode} />

      <div className={styles.mainContent}>
        <TopmenuFill
          className={styles.topmenuFill}
          searchFieldIconOutlinedSearch={search3Svg}
        />
        <div className={styles.pageContent}>
          {/* Top Row: Chart, Trends, Ticket Statuses */}
          <div className={styles.topRow}>
            <XLargeDataBox
              chartImage={lineChartRed}
              chartTitle="Placeholder Chart for our actual results"
              className={styles.chartBox}
            />
            <TodaysTrends
              className={styles.trendsBox}
              trends={[
                { title: "Resolved", value: "449" },
                { title: "Received", value: "426" },
                { title: "Average first response time", value: "33m" },
                { title: "Average response time", value: "3h 8m" },
                { title: "Resolution within SLA", value: "94%" },
              ]}
            />
            <div className={styles.ticketStatusColumn}>
              <TicketStatusBox label="Unresolved" value="60" />
              <TicketStatusBox label="Overdue" value="16" isOverdue={true} />
              <TicketStatusBox label="Open" value="43" />
              <TicketStatusBox label="On hold" value="64" />
            </div>
          </div>

          {/* Bottom Row: Placeholder List and Tasks */}
          <div className={styles.bottomRow}>
            <Cards
              className={styles.listSection}
              cardData={[
                { title: "Waiting on Feature Request", value: "4238" },
                { title: "Awaiting Customer Response", value: "1005" },
                { title: "Awaiting Developer Fix", value: "914" },
                { title: "Pending", value: "281" },
              ]}
              title="Placeholder List for actual results"
              viewDetailsText="View details"
            />
            <TicketsAndTasks
              className={styles.tasksSection}
              tickets={[]} // No specific tickets in screenshot
              tasks={[
                { title: "Create new task" },
                { title: "Finish ticket update", status: "URGENT" },
                { title: "Create new ticket example", status: "NEW" },
                { title: "Update ticket report", status: "DEFAULT" },
              ]} // Placeholder tasks, need to adjust TicketAndTasks component for this visual
              title="Placeholder"
              subtitle="Today"
              createTaskText="Create new task"
              viewAllText="View all"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
