import React, { useState, useEffect } from "react";
import styles from "../../assets/styles/position.module.css";
import PageLayout from "../../components/shared/PageLayout/PageLayout";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const PositionDetailLight = ({ darkMode, toggleDarkMode }) => {
  const [keyword, setKeyword] = useState("");
  const [trendData, setTrendData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (trendData && trendData.yearly_distribution) {
      const formattedData = Object.entries(trendData.yearly_distribution)
        .sort(([yearA], [yearB]) => parseInt(yearA) - parseInt(yearB))
        .map(([year, count]) => ({
          year: year,
          publications: count,
        }));
      setChartData(formattedData);
    }
  }, [trendData]);

  const handleGetTrend = async () => {
    if (!keyword.trim()) {
      setError("Please enter a keyword to get the trend.");
      setTrendData(null);
      setChartData([]); // Clear chart data as well
      return;
    }
    setIsLoading(true);
    setError(null);
    setTrendData(null); // Clear previous data
    setChartData([]); // Clear chart data

    try {
      const params = new URLSearchParams({ keyword: keyword.trim() });
      const response = await fetch(`http://localhost:4000/api/publications/keyword_trends?${params.toString()}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setTrendData(data);
    } catch (e) {
      setError("Failed to fetch publication trend. Error: " + e.message);
      console.error("Keyword trend fetch error:", e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageLayout darkMode={darkMode} toggleDarkMode={toggleDarkMode} hideSearch={true}>
      <div className={styles.mainContent}>
        <div className={styles.pageContent}>
          {/* Top Row: Chart, Trends, Ticket Statuses */}
          <div className={styles.topRow}>
            {/* New Trend Visualization Box */}
            <div className={styles.trendVisualizationBox}>
              <h2 className={styles.trendTitle}>Publication Trend by Keyword</h2>
              <div className={styles.trendInputContainer}>
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

              {error && <div className={styles.errorMessage}>{error}</div>}
              {isLoading && (
                <div className={styles.loadingContainer}>
                  <div className={styles.spinner}></div>
                  <p>Fetching trend data...</p>
                </div>
              )}

              {chartData.length > 0 && (
                <ResponsiveContainer width="100%" height={600}>
                  <BarChart
                    data={chartData}
                    margin={{
                      top: 20, right: 0, left: 50, bottom: 40,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" angle={0} textAnchor="middle" height={40} />
                    <YAxis label={{ value: 'publications', angle: -90, position: 'left', textAnchor: 'middle', dx: -10, dy: -100 }} />
                    <Tooltip />
                    <Bar dataKey="publications" fill="var(--color-primary)" />
                  </BarChart>
                </ResponsiveContainer>
              )}

              {!isLoading && !error && chartData.length === 0 && trendData && trendData.total_publications === 0 && ( /* Ensure this only shows when no data and not loading/error */
                <div className={styles.noResultsMessage}>No trend data found for this keyword.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};
