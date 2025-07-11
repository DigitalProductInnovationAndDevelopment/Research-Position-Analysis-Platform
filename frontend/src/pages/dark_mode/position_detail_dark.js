import React, { useState, useEffect } from "react";
import styles from "../../assets/styles/position.module.css";
import PageLayout from "../../components/shared/PageLayout/PageLayout";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

export const PositionDetailDark = ({ darkMode, toggleDarkMode }) => {
  const [keyword, setKeyword] = useState("Siemens");
  const [trendData, setTrendData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [growthData, setGrowthData] = useState([]);
  
  // Additional parameters for the API
  const [years, setYears] = useState(5);
  const [limit, setLimit] = useState(10);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Load initial Siemens data on component mount
  useEffect(() => {
    handleGetTrend();
  }, []); // Empty dependency array means this runs once on mount

  useEffect(() => {
    if (trendData && trendData.yearly_distribution) {
      // Format data for the main chart
      const formattedData = Object.entries(trendData.yearly_distribution)
        .sort(([yearA], [yearB]) => parseInt(yearA) - parseInt(yearB))
        .map(([year, count]) => ({
          year: year,
          publications: count,
          isCurrentYear: parseInt(year) === new Date().getFullYear()
        }));
      setChartData(formattedData);

      // Format growth rate data for trend indicators
      if (trendData.meta?.trend_factors?.year_over_year_growth) {
        const growthFormatted = trendData.meta.trend_factors.year_over_year_growth.map(growth => ({
          year: growth.year,
          growthRate: growth.rate
        }));
        setGrowthData(growthFormatted);
      }
    }
  }, [trendData]);

  const handleGetTrend = async () => {
    if (!keyword.trim()) {
      setError("Please enter a keyword to get the trend.");
      setTrendData(null);
      setChartData([]);
      setGrowthData([]);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setTrendData(null);
    setChartData([]);
    setGrowthData([]);

    try {
      const params = new URLSearchParams({
        keyword: keyword.trim(),
        years: years.toString(),
        limit: Math.min(Math.max(parseInt(limit), 5), 20).toString()
      });

      if (startDate) params.append('start_date', startDate);
      if (endDate) params.append('end_date', endDate);

      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:4000';
      const response = await fetch(`${backendUrl}/api/publications/keyword_trends?${params.toString()}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.details || `HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Check if we have any data
      if (!data.yearly_distribution || Object.values(data.yearly_distribution).every(count => count === 0)) {
        setError("No data available for the given keyword and date range.");
        return;
      }
      
      setTrendData(data);
    } catch (e) {
      setError("Failed to fetch publication trend. Please try again with a different keyword or date range.");
      console.error("Keyword trend fetch error:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className={styles.customTooltip}>
          <p className={styles.tooltipYear}>Year: {label}</p>
          <p className={styles.tooltipPublications}>
            Publications: {payload[0].value}
            {data.isCurrentYear && <span className={styles.incompleteData}> (incomplete)</span>}
          </p>
        </div>
      );
    }
    return null;
  };

  const renderTrendIndicators = () => {
    if (!trendData?.meta?.trend_factors) return null;

    const { average_growth_rate, relative_popularity, year_over_year_growth } = trendData.meta.trend_factors;
    
    return (
      <div className={styles.trendIndicators}>
        <h3>Trend Analysis</h3>
        <div className={styles.indicatorGrid}>
          <div className={styles.indicator}>
            <span className={styles.indicatorLabel}>Growth Rate:</span>
            <span className={`${styles.indicatorValue} ${average_growth_rate > 0 ? styles.positive : styles.negative}`}>
              {average_growth_rate > 0 ? '+' : ''}{average_growth_rate}%
            </span>
          </div>
          <div className={styles.indicator}>
            <span className={styles.indicatorLabel}>Popularity Score:</span>
            <span className={styles.indicatorValue}>{relative_popularity}</span>
          </div>
          <div className={styles.indicator}>
            <span className={styles.indicatorLabel}>Total Publications:</span>
            <span className={styles.indicatorValue}>{trendData.publication_count}</span>
          </div>
          <div className={styles.indicator}>
            <span className={styles.indicatorLabel}>Search Method:</span>
            <span className={styles.indicatorValue}>
              Title & Abstract Search
            </span>
          </div>
        </div>
      </div>
    );
  };

  const renderGrowthChart = () => {
    if (growthData.length === 0) return null;

    return (
      <div className={styles.growthChartContainer}>
        <h3>Year-over-Year Growth Rates</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={growthData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="growthRate" stroke="#8884d8" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  };

  return (
    <PageLayout darkMode={darkMode} toggleDarkMode={toggleDarkMode} hideSearch={true}>
      <div className={styles.mainContent}>
        <div className={styles.pageContent}>
          <div className={styles.topRow}>
            <div className={styles.trendVisualizationBox}>
              <h2 className={styles.trendTitle}>Publication Trend by Keyword</h2>
              
              {/* Enhanced Input Section */}
              <div className={styles.inputSection}>
                <div className={styles.mainInputRow}>
                  <input
                    type="text"
                    className={styles.trendInput}
                    placeholder="Enter keyword (e.g., 'artificial intelligence')"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        handleGetTrend();
                      }
                    }}
                  />
                  <button
                    className={styles.trendButton}
                    onClick={handleGetTrend}
                    disabled={isLoading}
                  >
                    {isLoading ? "Loading..." : "Get Trend"}
                  </button>
                </div>
                
                <div className={styles.parameterRow}>
                  <div className={styles.parameterGroup}>
                    <label>Years:</label>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={years}
                      onChange={(e) => setYears(parseInt(e.target.value) || 5)}
                      className={styles.parameterInput}
                    />
                  </div>
                  <div className={styles.parameterGroup}>
                    <label>Limit:</label>
                    <input
                      type="number"
                      min="5"
                      max="20"
                      value={limit}
                      onChange={(e) => setLimit(parseInt(e.target.value) || 10)}
                      className={styles.parameterInput}
                    />
                  </div>
                  <div className={styles.parameterGroup}>
                    <label>Start Date:</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className={styles.parameterInput}
                    />
                  </div>
                  <div className={styles.parameterGroup}>
                    <label>End Date:</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className={styles.parameterInput}
                    />
                  </div>
                </div>
              </div>

              {error && <div className={styles.errorMessage}>{error}</div>}
              
              {isLoading && (
                <div className={styles.loadingContainer}>
                  <div className={styles.spinner}></div>
                  <p>Fetching trend data...</p>
                </div>
              )}

              {/* Trend Indicators */}
              {trendData && !isLoading && !error && renderTrendIndicators()}

              {/* Main Chart */}
              {chartData.length > 0 && (
                <div className={styles.chartContainer}>
                  <h3>Publication Count by Year</h3>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart
                      data={chartData}
                      margin={{
                        top: 20, right: 30, left: 50, bottom: 40,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="year" 
                        angle={0} 
                        textAnchor="middle" 
                        height={40}
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis 
                        label={{ 
                          value: 'Publications', 
                          angle: -90, 
                          position: 'insideLeft',
                          style: { textAnchor: 'middle' }
                        }}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar 
                        dataKey="publications" 
                        fill="var(--color-primary)"
                        stroke="var(--color-primary-dark)"
                        strokeWidth={1}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Growth Rate Chart */}
              {growthData.length > 0 && renderGrowthChart()}

              {/* No Results Message */}
              {!isLoading && !error && chartData.length === 0 && trendData && (
                <div className={styles.noResultsMessage}>
                  No trend data found for "{keyword}". Try a different keyword or adjust the date range.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}; 