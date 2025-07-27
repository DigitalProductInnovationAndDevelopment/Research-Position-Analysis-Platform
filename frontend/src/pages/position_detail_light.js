import React, { useState, useEffect } from "react";
import styles from "../assets/styles/position.module.css";
import TopBar from "../components/shared/TopBar";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { OPENALEX_API_BASE } from '../config/api';

export const PositionDetailLight = ({ darkMode, toggleDarkMode }) => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const [trendData, setTrendData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [growthData, setGrowthData] = useState([]);

  // Additional parameters for the API
  const [years, setYears] = useState(5);
  const [limit, setLimit] = useState(10);
  
  // New parameters for institution
  const [selectedInstitution, setSelectedInstitution] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");



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
        keyword: keyword.trim()
      });

      if (startDate) params.append('start_date', startDate);
      if (endDate) params.append('end_date', endDate);
      if (selectedInstitution && selectedInstitution.id) {
        const institutionId = selectedInstitution.id.split('/').pop();
        params.append('institution_id', institutionId);
      }

      const response = await fetch(`/api/publications/keyword_trends?${params.toString()}`);

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
          <div className={styles.tooltipYear}>{label}</div>
          <div className={styles.tooltipPublications}>
            <strong>{payload[0].value.toLocaleString()}</strong> Publications
            {data.isCurrentYear && <span className={styles.incompleteData}>⚠ Data incomplete for current year</span>}
          </div>
          <div className={styles.tooltipHint}>
            🔍 Click to view publications
          </div>
        </div>
      );
    }
    return null;
  };

  const handleBarClick = (data) => {
    if (!data || !data.year || !keyword.trim()) return;
    
    // Construct search parameters
    const searchParams = new URLSearchParams();
    
    // Add keyword search
    searchParams.append('search', keyword.trim());
    
    // Add year filter
    searchParams.append('publication_year', data.year);
    
    // Add institution filter if selected
    if (selectedInstitution && selectedInstitution.id) {
      const institutionId = selectedInstitution.id.split('/').pop();
      searchParams.append('institution_id', institutionId);
    }
    
    // Navigate to search page with filters
    navigate(`/search?${searchParams.toString()}`);
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

          {selectedInstitution && (
            <div className={styles.indicator}>
              <span className={styles.indicatorLabel}>Institution:</span>
              <span className={styles.indicatorValue}>
                {selectedInstitution.display_name}
              </span>
            </div>
          )}

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
    <div style={{ background: darkMode ? '#1a1a1a' : '#f5f6fa', minHeight: '100vh' }}>
      <TopBar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem 1rem' }}>
        <h1 style={{ color: '#4F6AF6', fontWeight: 700, fontSize: '2.5rem', marginBottom: '1.5rem', lineHeight: 1.1 }}>Publication Trend by Keyword</h1>
        <div className={styles.mainContent}>
          <div className={styles.pageContent}>
            <div className={styles.topRow}>
              <div className={styles.trendVisualizationBox}>
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
                      <label>Institution:</label>
                      <InstitutionDropdown
                        value={selectedInstitution}
                        onChange={setSelectedInstitution}
                        placeholder="Search for institution..."
                        className={styles.institutionDropdown}
                        label=""
                        darkMode={darkMode}
                      />
                      {selectedInstitution && (
                        <div className={styles.selectedInstitutionRow}>
                          <span className={styles.selectedInstitutionText}>
                            Selected: {selectedInstitution.display_name}
                          </span>
                          <button
                            type="button"
                            onClick={() => setSelectedInstitution(null)}
                            className={styles.clearButton}
                            title="Clear institution"
                          >
                            ×
                          </button>
                        </div>
                      )}
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
                    <h3>
                      Publication Count by Year
                      {selectedInstitution && ` - ${selectedInstitution.display_name}`}
                    </h3>
                    <ResponsiveContainer width="100%" height={400}>
                      <BarChart
                        data={chartData}
                        margin={{
                          top: 20, right: 30, left: 50, bottom: 40,
                        }}
                        onClick={handleBarClick}
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
                          style={{ cursor: 'pointer' }}
                          onClick={handleBarClick}
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
      </div>
    </div>
  );
};
