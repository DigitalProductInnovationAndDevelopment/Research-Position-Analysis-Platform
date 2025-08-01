import React, { useState } from "react";
import WhatSparkDoesBox from "../components/about/WhatSparkDoesBox";
import HowToUseSparkBox from "../components/about/HowToUseSparkBox";
import DisclaimerBox from "../components/about/DisclaimerBox";
import PrivacyPolicyBox from "../components/about/PrivacyPolicyBox";
import ImpressumBox from "../components/about/ImpressumBox";
import TopBar from "../components/shared/TopBar";
import Particles from "../components/animated/SearchBackground/Particles";


export const AboutPage = ({ darkMode = true }) => {
  const [tab, setTab] = useState("what");
  
  // Apply dark mode class to body
  React.useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
      document.body.style.backgroundColor = '#000000';
    } else {
      document.body.classList.remove('dark');
      document.body.style.backgroundColor = '';
    }
  }, [darkMode]);
  
  return (
    <>
      <TopBar />
      <div style={{ background: '#000', minHeight: '100vh', paddingBottom: 40 }} className={darkMode ? 'dark' : ''}>
        {/* Search Background - covers the entire page */}
        <div style={{ position: 'relative' }}>
          <div style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0,
            zIndex: 1,
            pointerEvents: 'none'
          }}>
            <Particles />
          </div>
          
          {/* Search Interface Content */}
          <div style={{ position: 'relative', zIndex: 2 }}>
            <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'left', paddingLeft: 2, marginTop: 32 }}>
              <h1 style={{ color: '#4F6AF6', fontWeight: 700, fontSize: '2.5rem', marginBottom: '0.5rem', lineHeight: 1.1 }}>Learn more</h1>
            </div>
        {/* Toggle Tabs for Main Content */}
        <section style={{ 
          /* background: 'rgba(0,0,0,0.7)', */ // removed for transparency
          padding: '2.5rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
            <button
              onClick={() => setTab("what")}
              style={{
                padding: '12px 32px',
                borderRadius: 24,
                border: 'none',
                background: tab === "what" ? '#4F6AF6' : '#333',
                color: tab === "what" ? '#fff' : '#fff',
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
                background: tab === "how" ? '#4F6AF6' : '#333',
                color: tab === "how" ? '#fff' : '#fff',
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
          <div style={{ display: 'flex', alignItems: 'stretch', justifyContent: 'center', minHeight: '40vh', width: '100%' }}>
            <div style={{ 
              border: '2px solid #a259ff',
              borderRadius: '18px',
              padding: '3rem 2.5rem 2.5rem 2.5rem',
              maxWidth: 800, 
              width: '100%', 
              margin: '0 auto',
              color: '#fff',
              display: 'flex',
              flexDirection: 'column'
            }}>
              {tab === "what" ? <WhatSparkDoesBox /> : <HowToUseSparkBox />}
            </div>
          </div>
        </section>
        </div>
        </div>
        
        {/* Content outside the background area */}
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1rem' }}>
          {/* Small boxes row at the bottom */}
          <section style={{ 
            background: '#000', 
            padding: '2.5rem 0 2rem 0'
          }}>
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '2rem',
              maxWidth: 1100,
              margin: '0 auto',
              alignItems: 'stretch',
              justifyItems: 'center'
            }}>
              <div style={{ 
                background: '#000', 
                border: '2px solid #a259ff',
                borderRadius: '18px',
                padding: '2rem 1.5rem 1.5rem 1.5rem',
                color: '#fff'
              }}><DisclaimerBox /></div>
              <div style={{ 
                background: '#000', 
                border: '2px solid #a259ff',
                borderRadius: '18px',
                padding: '2rem 1.5rem 1.5rem 1.5rem',
                color: '#fff'
              }}><PrivacyPolicyBox /></div>
              <div style={{ 
                background: '#000', 
                border: '2px solid #a259ff',
                borderRadius: '18px',
                padding: '2rem 1.5rem 1.5rem 1.5rem',
                color: '#fff'
              }}><ImpressumBox /></div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};
