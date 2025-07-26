import React, { useState } from "react";
import { Link } from "react-router-dom";
import WhatSparkDoesBox from "../components/about/WhatSparkDoesBox";
import HowToUseSparkBox from "../components/about/HowToUseSparkBox";
import DisclaimerBox from "../components/about/DisclaimerBox";
import PrivacyPolicyBox from "../components/about/PrivacyPolicyBox";
import ImpressumBox from "../components/about/ImpressumBox";
import TopBar from "../components/shared/TopBar";
import styles from "../assets/styles/landing.module.css";

export const AboutPage = () => {
  const [tab, setTab] = useState("what");
  return (
    <div className={styles.landingPageContainer}>
      <TopBar />
      <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'left', paddingLeft: 2, marginTop: 32 }}>
        <h1 style={{ color: '#4F6AF6', fontWeight: 700, fontSize: '2.5rem', marginBottom: '0.5rem', lineHeight: 1.1 }}>Learn more</h1>
      </div>
      {/* Toggle Tabs for Main Content */}
      <section className={styles.featuresSection}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
          <button
            onClick={() => setTab("what")}
            style={{
              padding: '12px 32px',
              borderRadius: 24,
              border: 'none',
              background: tab === "what" ? 'var(--color-primary, #4f46e5)' : '#f3f4f6',
              color: tab === "what" ? '#fff' : '#222',
              fontWeight: 600,
              fontSize: 18,
              marginRight: 8,
              boxShadow: tab === "what" ? '0 2px 8px rgba(79,70,229,0.12)' : 'none',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            What SPARK Does
          </button>
          <button
            onClick={() => setTab("how")}
            style={{
              padding: '12px 32px',
              borderRadius: 24,
              border: 'none',
              background: tab === "how" ? 'var(--color-primary, #4f46e5)' : '#f3f4f6',
              color: tab === "how" ? '#fff' : '#222',
              fontWeight: 600,
              fontSize: 18,
              marginLeft: 8,
              boxShadow: tab === "how" ? '0 2px 8px rgba(79,70,229,0.12)' : 'none',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            How to use SPARK
          </button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '40vh', width: '100%' }}>
          <div className={styles.featureCard} style={{ maxWidth: 800, width: '100%', margin: '0 auto', border: '1px solid #ddd' }}>
            {tab === "what" ? <WhatSparkDoesBox /> : <HowToUseSparkBox />}
          </div>
        </div>
      </section>
      {/* Small boxes row at the bottom */}
      <section className={styles.statisticsSection}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 32, flexWrap: 'wrap' }}>
          <div className={styles.featureCard} style={{ minWidth: 220, maxWidth: 300, padding: 16, border: '1px solid #eee' }}><DisclaimerBox /></div>
          <div className={styles.featureCard} style={{ minWidth: 220, maxWidth: 300, padding: 16, border: '1px solid #eee' }}><PrivacyPolicyBox /></div>
          <div className={styles.featureCard} style={{ minWidth: 220, maxWidth: 300, padding: 16, border: '1px solid #eee' }}><ImpressumBox /></div>
        </div>
      </section>
    </div>
  );
};
