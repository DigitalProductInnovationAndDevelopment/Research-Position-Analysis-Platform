import React from "react";
import DisclaimerBox from "./DisclaimerBox";
import PrivacyPolicyBox from "./PrivacyPolicyBox";
import styles from "../../assets/styles/about.module.css";

const RightColumnAboutBoxes = () => {
  return (
    <div className={styles.rightColumnAboutBoxes}>
      <DisclaimerBox />
      <PrivacyPolicyBox />
    </div>
  );
};

export default RightColumnAboutBoxes; 