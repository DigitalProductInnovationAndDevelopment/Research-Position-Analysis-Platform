import React from "react";
import { Link } from "react-router-dom";
import DisclaimerBox from "../components/about/DisclaimerBox";
import PrivacyPolicyBox from "../components/about/PrivacyPolicyBox";
import ImpressumBox from "../components/about/ImpressumBox";
import searchIcon from "../assets/icons/search.svg";
import trendIcon from "../assets/icons/trend.svg";
import graphIcon from "../assets/icons/graph.svg";
import worldMapIcon from "../assets/icons/world-map.svg";
import styles from "../assets/styles/landing.module.css";
import Particles from "../components/animated/SearchBackground/Particles";

export const LandingPageLight = () => {
  const features = [
    {
      title: "Keyword Search & Filtering",
      description: "Search publications with advanced filters by year, affiliation, and more",
      icon: searchIcon,
      link: "/search",
    },
    {
      title: "Topic Trends",
      description: "Visualize publication frequency over time for emerging research topics",
      icon: trendIcon,
      link: "/trends",
    },
    {
      title: "Collaboration Graph",
      description: "Analyze institutional research networks and partnerships",
      icon: graphIcon,
      link: "/graph-view",
    },
    {
      title: "World Map Visualization",
      description: "Visualize research distribution and impact across the globe on an interactive world map",
      icon: worldMapIcon,
      link: "/world-map",
    },
  ];

  return (
    <div style={{ background: '#000', minHeight: '100vh', width: '100vw' }}>
      {/* Particle Background - covers the entire page */}
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
      
      {/* Content Layer */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        <div className={styles.landingPageContainer}>
          {/* Hero Section */}
          <section className={styles.heroSection}>
            <div className={styles.heroContent}>
              <div className={styles.heroTitleRow}>
                <span className={styles.sparkleIcon} role="img" aria-label="sparkles">✨</span>
                <h1 className={styles.heroTitle}>SPARK</h1>
              </div>
              <p className={styles.heroSubtitle}>
                Comprehensive research publication analysis platform for discovering trends, collaborations, and emerging topics in academic literature
              </p>
              <div className={styles.heroButtonsRow} style={{ display: 'flex', gap: 6, marginTop: 24 }}>
                <Link to="/search" className={styles.startExploringBtnHero} style={{ 
                  flex: 1, 
                  minWidth: 180, 
                  height: 48, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontSize: 18,
                  background: '#4F6AF6',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontWeight: '600',
                  transition: 'background 0.2s, transform 0.2s'
                }}>
                  Start Exploring
                </Link>
                <Link to="/about" className={styles.learnMoreBtnHero} style={{ 
                  flex: 1, 
                  minWidth: 180, 
                  height: 48, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontSize: 18,
                  background: 'transparent',
                  color: '#4F6AF6',
                  border: '2px solid #4F6AF6',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontWeight: '600',
                  transition: 'background 0.2s, color 0.2s'
                }}>
                  Learn More
                </Link>
              </div>
            </div>
          </section>

          {/* Features Grid */}
          <section className={styles.featuresSection}>
            <div className={styles.featuresHeader}>
              <h2 className={styles.featuresTitle}>Research Analysis Tools</h2>
              <p className={styles.featuresSubtitle}>
                Powerful features to analyze research publications, track trends, and discover collaborations
              </p>
            </div>
            <div className={styles.featuresGrid}>
              {features.map((feature) => (
                <div key={feature.title} className={styles.featureCard}>
                  <div className={styles.featureIconWrapper}>
                    <img src={feature.icon} alt={feature.title} className={styles.featureIcon} />
                  </div>
                  <div className={styles.featureCardContent}>
                    <h3 className={styles.featureCardTitle}>{feature.title}</h3>
                    <p className={styles.featureCardDescription}>{feature.description}</p>
                  </div>
                  <Link to={feature.link} className={styles.featureCardButton + " text-foreground"}>
                    Explore
                  </Link>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
      
      {/* Bottom Section - outside particle area, opaque background */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        <section className={styles.statisticsSection}>
          <div className={styles.statisticsGrid}>
            <DisclaimerBox />
            <PrivacyPolicyBox />
            <div className={styles.impressumBoxLanding}>
              <ImpressumBox />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
