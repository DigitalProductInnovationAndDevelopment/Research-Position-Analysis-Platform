import React from "react";
import styles from "../../assets/styles/about.module.css";

const ImpressumBox = () => {
  return (
    <div style={{
      borderRadius: '16px',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    }}>
      <div>
        <h2 className={styles.impressumTitle}>Impressum</h2>
        <p className={styles.impressumText}>
          Information in accordance with Section 5 TMG<br />
          (Telemediengesetz):<br />
          Jane Doe<br />
          c/o Technical University of Munich<br />
          Munich, Germany<br />
          Contact:<br />
          E-mail: jane.doe@example.com<br />
          Responsible for content according to Section 55 (2) <br />
          RStV (Rundfunkstaatsvertrag):<br />
          Jane Doe<br />
          (Address as above). No cookies are set.
        </p>
      </div>
    </div>
  );
};

export default ImpressumBox; 