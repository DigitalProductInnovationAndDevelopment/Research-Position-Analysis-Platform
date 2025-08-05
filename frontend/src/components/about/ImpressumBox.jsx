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
          Information pursuant to § 5 TMG (German Telemedia Act)<br />
          
          <strong>Publisher:</strong><br />
          Research Position Analysis Platform (SPARK)<br />
          Research project at the Technical University of Munich (TUM)<br />
          Boltzmannstr. 3<br />
          D-85748 Garching bei München<br />
          Germany<br />
          
          <strong>Represented by:</strong><br />
          The SPARK project team at TUM<br />
          
          <strong>Contact:</strong><br />
          Website: https://research-position-analysis-platform.onrender.com/<br />
          
          <strong>Responsible for content according to § 55 Abs. 2 RStV:</strong><br />
          Research Position Analysis Platform (SPARK)<br />
          Technical University of Munich<br />
          Boltzmannstr. 3<br />
          D-85748 Garching bei München<br />
          Germany<br />
          
          <strong>Disclaimer:</strong><br />
          This website is intended solely for academic and research purposes. Despite careful content control, we assume no liability for the content of external links. The responsibility for the content of linked websites lies exclusively with their operators.
        </p>
      </div>
    </div>
  );
};

export default ImpressumBox; 