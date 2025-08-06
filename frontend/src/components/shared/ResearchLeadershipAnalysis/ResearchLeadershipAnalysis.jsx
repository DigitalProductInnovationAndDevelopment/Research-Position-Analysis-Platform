import React, { useState, useEffect } from 'react';
import styles from './ResearchLeadershipAnalysis.module.css';

const ResearchLeadershipAnalysis = ({ papers, searchQuery }) => {
  const [countryStats, setCountryStats] = useState([]);
  const [institutionStats, setInstitutionStats] = useState([]);
  const [yearlyTrends, setYearlyTrends] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (papers && papers.length > 0) {
      analyzeResearchLeadership();
    }
  }, [papers]);

  const analyzeResearchLeadership = () => {
    setLoading(true);

    // Analyze by country
    const countryData = {};
    const institutionData = {};
    const yearlyData = {};

    papers.forEach(paper => {
      // Country analysis
      if (paper.country) {
        if (!countryData[paper.country]) {
          countryData[paper.country] = {
            country: paper.country,
            paperCount: 0,
            totalCitations: 0,
            avgCitations: 0,
            papers: []
          };
        }
        countryData[paper.country].paperCount++;
        countryData[paper.country].totalCitations += paper.citations || 0;
        countryData[paper.country].papers.push(paper);
      }

      // Institution analysis
      if (paper.institution) {
        if (!institutionData[paper.institution]) {
          institutionData[paper.institution] = {
            institution: paper.institution,
            country: paper.country,
            paperCount: 0,
            totalCitations: 0,
            avgCitations: 0,
            papers: []
          };
        }
        institutionData[paper.institution].paperCount++;
        institutionData[paper.institution].totalCitations += paper.citations || 0;
        institutionData[paper.institution].papers.push(paper);
      }

      // Yearly trends
      if (paper.year) {
        if (!yearlyData[paper.year]) {
          yearlyData[paper.year] = {
            year: paper.year,
            paperCount: 0,
            totalCitations: 0
          };
        }
        yearlyData[paper.year].paperCount++;
        yearlyData[paper.year].totalCitations += paper.citations || 0;
      }
    });

    // Calculate averages and sort
    Object.values(countryData).forEach(country => {
      country.avgCitations = country.paperCount > 0 ? Math.round(country.totalCitations / country.paperCount) : 0;
    });

    Object.values(institutionData).forEach(institution => {
      institution.avgCitations = institution.paperCount > 0 ? Math.round(institution.totalCitations / institution.paperCount) : 0;
    });

    // Sort by total citations (descending)
    const sortedCountries = Object.values(countryData)
      .sort((a, b) => b.totalCitations - a.totalCitations)
      .slice(0, 10);

    const sortedInstitutions = Object.values(institutionData)
      .sort((a, b) => b.totalCitations - a.totalCitations)
      .slice(0, 10);

    const sortedYears = Object.values(yearlyData)
      .sort((a, b) => a.year - b.year);

    setCountryStats(sortedCountries);
    setInstitutionStats(sortedInstitutions);
    setYearlyTrends(sortedYears);
    setLoading(false);
  };

  const getCountryFlag = (countryCode) => {
    return `https://flagcdn.com/24x18/${countryCode.toLowerCase()}.png`;
  };

  const getCitationColor = (citations) => {
    if (citations > 10000) return '#ff4444';
    if (citations > 5000) return '#ff8800';
    if (citations > 1000) return '#ffcc00';
    if (citations > 100) return '#88ff00';
    return '#44ff44';
  };

  if (!papers || papers.length === 0) {
    return null;
  }

  return (
    <div className={styles.analysisContainer}>
      <div className={styles.header}>
        <h3>Research Leadership Analysis</h3>
        <p>Leading countries and institutions in "{searchQuery}" research</p>
      </div>

      {loading ? (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Analyzing research leadership...</p>
        </div>
      ) : (
        <div className={styles.analysisGrid}>
          {/* Country Leadership */}
          <div className={styles.analysisCard}>
            <h4>🏆 Country Leadership</h4>
            <div className={styles.statsList}>
              {countryStats.map((country, index) => (
                <div key={country.country} className={styles.statItem}>
                  <div className={styles.rank}>{index + 1}</div>
                  <div className={styles.flag}>
                    <img
                      src={getCountryFlag(country.country)}
                      alt={country.country}
                      onError={(e) => e.target.style.display = 'none'}
                    />
                  </div>
                  <div className={styles.details}>
                    <div className={styles.name}>{country.country}</div>
                    <div className={styles.metrics}>
                      <span>{country.paperCount} papers</span>
                      <span className={styles.citations} style={{ color: getCitationColor(country.totalCitations) }}>
                        {country.totalCitations.toLocaleString()} citations
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Institution Leadership */}
          <div className={styles.analysisCard}>
            <h4>🎓 Institution Leadership</h4>
            <div className={styles.statsList}>
              {institutionStats.map((institution, index) => (
                <div key={institution.institution} className={styles.statItem}>
                  <div className={styles.rank}>{index + 1}</div>
                  <div className={styles.institutionIcon}>🏛️</div>
                  <div className={styles.details}>
                    <div className={styles.name}>{institution.institution}</div>
                    <div className={styles.metrics}>
                      <span>{institution.country}</span>
                      <span className={styles.citations} style={{ color: getCitationColor(institution.totalCitations) }}>
                        {institution.totalCitations.toLocaleString()} citations
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Research Trends */}
          {/* <div className={styles.analysisCard}>
            <h4>📈 Research Trends</h4>
            <div className={styles.trendsContainer}>
              {yearlyTrends.map(year => (
                <div key={year.year} className={styles.trendItem}>
                  <div className={styles.year}>{year.year}</div>
                  <div className={styles.trendMetrics}>
                    <span>{year.paperCount} papers</span>
                    <span>{year.totalCitations.toLocaleString()} citations</span>
                  </div>
                </div>
              ))}
            </div>
          </div> */}

          {/* Summary Stats */}
          {/* <div className={styles.analysisCard}>
            <h4>📊 Summary</h4>
            <div className={styles.summaryStats}>
              <div className={styles.summaryItem}>
                <div className={styles.summaryValue}>{papers.length}</div>
                <div className={styles.summaryLabel}>Total Papers</div>
              </div>
              <div className={styles.summaryItem}>
                <div className={styles.summaryValue}>
                  {papers.reduce((sum, paper) => sum + (paper.citations || 0), 0).toLocaleString()}
                </div>
                <div className={styles.summaryLabel}>Total Citations</div>
              </div>
              <div className={styles.summaryItem}>
                <div className={styles.summaryValue}>
                  {new Set(papers.map(p => p.country).filter(Boolean)).size}
                </div>
                <div className={styles.summaryLabel}>Countries</div>
              </div>
              <div className={styles.summaryItem}>
                <div className={styles.summaryValue}>
                  {new Set(papers.map(p => p.institution).filter(Boolean)).size}
                </div>
                <div className={styles.summaryLabel}>Institutions</div>
              </div>
            </div>
          </div> */}
        </div>
      )}
    </div>
  );
};

export default ResearchLeadershipAnalysis; 