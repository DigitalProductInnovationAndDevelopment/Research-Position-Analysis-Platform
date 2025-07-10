import React from "react";
import { Link } from "react-router-dom";
import DisclaimerBox from "../../components/about/DisclaimerBox";
import PrivacyPolicyBox from "../../components/about/PrivacyPolicyBox";
import ImpressumBox from "../../components/about/ImpressumBox";
import searchIcon from "../../assets/icons/search.svg";
import trendIcon from "../../assets/icons/trend.svg";
import graphIcon from "../../assets/icons/graph.svg";
import barChartIcon from "../../assets/images/bar-chart.png";
import styles from "../../assets/styles/landing.module.css";

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
  ];

  return (
    <div className={styles.landingPageContainer}>
      {/* World Map button in top right */}
      <Link to="/world-map" className={styles.worldMapBtnHeroTopRight}>World Map</Link>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <div className={styles.heroTitleRow}>
            <span className={styles.sparkleIcon} role="img" aria-label="sparkles">✨</span>
            <h1 className={styles.heroTitle}>SPARK</h1>
          </div>
          <div className={styles.heroButtonsRow}>
            <Link to="/about" className={styles.learnMoreBtnHero}>Learn More</Link>
            <Link to="/search" className={styles.startExploringBtnHero}>Start Exploring</Link>
          </div>
          <p className={styles.heroSubtitle}>
            Comprehensive research publication analysis platform for discovering trends, collaborations, and emerging topics in academic literature
          </p>

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

      {/* Statistics Section */}
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
  );
};
