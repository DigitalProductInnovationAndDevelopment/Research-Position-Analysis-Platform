import React from "react";
import styles from "../../assets/styles/about.module.css";

const PrivacyPolicyBox = () => {
  return (
    <div style={{padding: '1rem', borderRadius: '16px', border: '1px solid #ddd'}}>
      <h2 className={styles.boxTitle}>Privacy Policy</h2>
      <p>
        This website does not collect or store any personal data. We use only publicly available, open-source information and do not track or analyze visitor behavior. No cookies are set.
      </p>
    </div>
  );
};

export default PrivacyPolicyBox; 