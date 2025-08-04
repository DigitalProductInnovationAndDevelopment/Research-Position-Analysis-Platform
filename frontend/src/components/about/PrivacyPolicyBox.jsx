import React from "react";
import styles from "../../assets/styles/about.module.css";

const PrivacyPolicyBox = () => {
  return (
    <div style={{
      borderRadius: '16px',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    }}>
      <div>
        <h2 className={styles.boxTitle}>Privacy Policy</h2>
        <p style={{ color: '#fff' }}>
          This website does not collect or store any personal data. We use only publicly available, open-source information and do not track or analyze visitor behavior. No cookies are set.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicyBox; 