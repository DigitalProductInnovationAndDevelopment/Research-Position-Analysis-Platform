import React, { useState } from "react";
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
import TextType from "../components/animated/TextType/texttype";
import Carousel from "../components/animated/Carousel/Carousel";

export const LandingPageLight = () => {
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0);

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

  // Convert features to carousel items format
  const carouselItems = features.map((feature, index) => ({
    title: feature.title,
    description: feature.description,
    id: index + 1,
    icon: <img src={feature.icon} alt={feature.title} style={{ width: '16px', height: '16px' }} />,
    link: feature.link,
  }));

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
              <TextType
                text={[
                  "Comprehensive research publication analysis platform",
                  "Discovering trends, collaborations, and emerging topics",
                  "Advanced academic literature analysis platform"
                ]}
                as="p"
                className={styles.heroSubtitle}
                style={{ fontWeight: 'bold' }}
                typingSpeed={75}
                pauseDuration={1500}
                showCursor={true}
                cursorCharacter="|"
                loop={true}
                startOnVisible={true}
              />
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

          {/* Features Carousel */}
          <section className={styles.featuresSection}>
            <div className={styles.featuresHeader}>
              <h2 className={styles.featuresTitle}>Research Analysis Tools</h2>
              <p className={styles.featuresSubtitle}>
                Powerful features to analyze research publications, track trends, and discover collaborations
              </p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', padding: '0 80px', position: 'relative' }}>
              <Carousel
                items={carouselItems}
                baseWidth={500}
                autoplay={true}
                autoplayDelay={8000}
                pauseOnHover={true}
                loop={true}
                round={false}
                currentIndex={currentCarouselIndex}
                onIndexChange={setCurrentCarouselIndex}
              />

              {/* Left Arrow */}
              <button
                onClick={() => {
                  if (currentCarouselIndex === 0) {
                    setCurrentCarouselIndex(carouselItems.length - 1);
                  } else {
                    setCurrentCarouselIndex(currentCarouselIndex - 1);
                  }
                }}
                style={{
                  position: 'absolute',
                  left: '20px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'rgba(255, 255, 255, 0.9)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: '18px',
                  color: '#333',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                  transition: 'all 0.2s ease',
                  zIndex: 10
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 1)';
                  e.target.style.transform = 'translateY(-50%) scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.9)';
                  e.target.style.transform = 'translateY(-50%) scale(1)';
                }}
              >
                ←
              </button>

              {/* Right Arrow */}
              <button
                onClick={() => {
                  if (currentCarouselIndex === carouselItems.length - 1) {
                    setCurrentCarouselIndex(0);
                  } else {
                    setCurrentCarouselIndex(currentCarouselIndex + 1);
                  }
                }}
                style={{
                  position: 'absolute',
                  right: '20px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'rgba(255, 255, 255, 0.9)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: '18px',
                  color: '#333',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                  transition: 'all 0.2s ease',
                  zIndex: 10
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 1)';
                  e.target.style.transform = 'translateY(-50%) scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.9)';
                  e.target.style.transform = 'translateY(-50%) scale(1)';
                }}
              >
                →
              </button>
            </div>
          </section>
        </div>
      </div>

      {/* Bottom Section - outside particle area, opaque background */}
      <div style={{ position: 'relative', zIndex: 3 }}>
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
