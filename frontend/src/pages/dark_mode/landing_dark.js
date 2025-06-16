/**
 * Landing Page Dark Mode Component
 * This component renders the dark mode version of the landing page
 * It includes all the same components as the light version but with dark styling
 */

import React from "react";
// Import UI components
import { DarkBtn } from "../components/landing/DarkBtn";
import { PromoBox } from "../components/landing/PromoBox";
import { SideMenu } from "../components/landing/SideMenu";
import { TopmenuFill } from "../components/landing/TopmenuFill";

// Import data visualization components
import { XLargeDataBox } from "../components/landing/XLargeDataBox";
import { XSmallDataBox } from "../components/landing/XSmallDataBox";
import { XxSmallDataBox } from "../components/landing/XxSmallDataBox";

// Import image assets
import arrowUpward6 from "../assets/images/arrow-upward-6.svg";
import group46 from "../assets/images/group-46.png";
import group47 from "../assets/images/group-47.png";
import group48 from "../assets/images/group-48.png";
import styles from "../assets/styles/landing.module.css";
import vector2 from "../assets/images/vector-2.svg";
import vector3 from "../assets/images/vector-3.svg";
import vector from "../assets/images/vector.svg";

/**
 * LandingPageDark Component
 * @returns {JSX.Element} The dark mode version of the landing page
 */
export const LandingPageDark = () => {
  return (
    <div className={styles.landingPageDark}>
      <div className={styles.strip}>
        {/* TODO: Implement dark mode version of the landing page */}
        {/* This will include:
            - Dark themed navigation --> Export with another account from Figma, currently reached max amount of exports
            - Dark themed data visualizations
            - Dark themed promotional content */}
      </div>
    </div>
  );
}; 