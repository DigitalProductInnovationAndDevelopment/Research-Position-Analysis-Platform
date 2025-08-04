import React, { useState, useEffect } from "react";
import styles from "../assets/styles/position.module.css";
import TopBar from "../components/shared/TopBar";
import SearchHeader from "../components/shared/SearchHeader";
import SearchForm from "../components/shared/SearchForm";
import AdvancedFiltersDrawer from "../components/shared/AdvancedFiltersDrawer";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useNavigate } from "react-router-dom";
import MultiSelectModalDropdown from "../components/shared/MultiSelectModalDropdown/MultiSelectModalDropdown";
import useDropdownSearch from "../hooks/useDropdownSearch";
import ApiCallInfoBox from "../components/shared/ApiCallInfoBox";
import Particles from "../components/animated/SearchBackground/Particles";

// TODO: restore old parameter for limit and year range like Umut provided in the first version?

export const PositionDetailLight = ({ darkMode = true }) => {
  const navigate = useNavigate();
  
  // Main search/filter state
  const [searchKeyword, setSearchKeyword] = useState("");
  // Multi-select authors/institutions
  const [selectedAuthors, setSelectedAuthors] = useState([]);
  const [selectedInstitutions, setSelectedInstitutions] = useState([]);
  // Advanced filters
  const [publicationYear, setPublicationYear] = useState("");
  const [startYear, setStartYear] = useState("");
  const [endYear, setEndYear] = useState("");
  // Multi-select filters
  const [selectedPublicationTypes, setSelectedPublicationTypes] = useState([]);
  const [selectedJournals, setSelectedJournals] = useState([]);
  // UI state
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [error, setError] = useState(null);
  
  // Trend visualization state
  const [trendData, setTrendData] = useState(null);
  const [isLoadingTrend, setIsLoadingTrend] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [growthData, setGrowthData] = useState([]);

  // Disclaimer state
  const [userInputs, setUserInputs] = useState([]);
  const [apiCalls, setApiCalls] = useState([]);

  // Dropdown state
  const [showAuthorModal, setShowAuthorModal] = useState(false);
  const [showInstitutionModal, setShowInstitutionModal] = useState(false);
  const [showPublicationTypesModal, setShowPublicationTypesModal] = useState(false);
  const [showJournalsModal, setShowJournalsModal] = useState(false);

  // Publication types data
  const publicationTypes = [
    { id: "article", display_name: "Article" },
    { id: "preprint", display_name: "Preprint" },
    { id: "posted-content", display_name: "Posted Content" },
    { id: "book", display_name: "Book" },
    { id: "book-chapter", display_name: "Book Chapter" },
    { id: "edited-book", display_name: "Edited Book" },
    { id: "journal-issue", display_name: "Journal Issue" },
    { id: "journal-volume", display_name: "Journal Volume" },
    { id: "proceedings-article", display_name: "Proceedings Article" },
    { id: "reference-entry", display_name: "Reference Entry" },
    { id: "dataset", display_name: "Dataset" },
    { id: "dissertation", display_name: "Dissertation" },
    { id: "monograph", display_name: "Monograph" },
    { id: "report", display_name: "Report" },
    { id: "standard", display_name: "Standard" }
  ];

  // Author dropdown search
  const {
    suggestions: authorSuggestions,
    loading: authorLoading,
    searchItems: searchAuthors,
    clearSuggestions: clearAuthorSuggestions
  } = useDropdownSearch('https://api.openalex.org/authors?search={query}&per_page=20');

  // Institution dropdown search
  const {
    suggestions: institutionSuggestions,
    loading: institutionLoading,
    searchItems: searchInstitutions,
    clearSuggestions: clearInstitutionSuggestions
  } = useDropdownSearch('https://api.openalex.org/institutions?search={query}&per_page=20');

  // Journal dropdown search
  const {
    suggestions: journalSuggestions,
    loading: journalLoading,
    searchItems: searchJournals,
    clearSuggestions: clearJournalSuggestions
  } = useDropdownSearch('https://api.openalex.org/sources?filter=type:journal&search={query}&per_page=20');

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

  // Search handler for trend analysis
  const handleSearch = async () => {
    if (!searchKeyword.trim()) {
      setError("Please enter a keyword to get the trend.");
      setTrendData(null);
      setChartData([]);
      setGrowthData([]);
      return;
    }

    setIsLoadingTrend(true);
    setError(null);
    setTrendData(null);
    setChartData([]);
    setGrowthData([]);

    // Track user inputs for disclaimer
    const inputs = [];
    if (searchKeyword.trim()) inputs.push({ category: 'Keywords', value: searchKeyword.trim() });
    if (selectedAuthors.length > 0) inputs.push({ category: 'Authors', value: selectedAuthors.map(a => a.display_name).join(', ') });
    if (selectedInstitutions.length > 0) inputs.push({ category: 'Institutions', value: selectedInstitutions.map(i => i.display_name).join(', ') });
    if (selectedPublicationTypes.length > 0) inputs.push({ category: 'Publication Types', value: selectedPublicationTypes.map(pt => pt.display_name).join(', ') });
    if (publicationYear.trim()) inputs.push({ category: 'Publication Year', value: publicationYear.trim() });
    if (startYear.trim() && endYear.trim()) inputs.push({ category: 'Year Range', value: `${startYear.trim()}-${endYear.trim()}` });
    if (selectedJournals.length > 0) inputs.push({ category: 'Journals', value: selectedJournals.map(j => j.display_name).join(', ') });
    setUserInputs(inputs);

    try {
      const filters = [];
      
      // Add keyword search
      if (searchKeyword.trim()) {
        const keyword = searchKeyword.trim();
        filters.push(`title_and_abstract.search:${keyword}`);
      }

      // Add author filters (OR logic for multiple authors)
      if (selectedAuthors.length > 0) {
        const authorFilters = selectedAuthors.map(author => {
          if (author.id) {
            const authorId = author.id.split('/').pop();
            return `authorships.author.id:A${authorId}`;
          }
          return null;
        }).filter(Boolean);
        if (authorFilters.length > 0) {
          filters.push(authorFilters.join('|'));
        }
      }

      // Add institution filters (OR logic for multiple institutions)
      if (selectedInstitutions.length > 0) {
        const institutionFilters = selectedInstitutions.map(inst => {
          if (inst.id) {
            const instId = inst.id.split('/').pop();
            return `authorships.institutions.id:I${instId}`;
          }
          return null;
        }).filter(Boolean);
        if (institutionFilters.length > 0) {
          filters.push(institutionFilters.join('|'));
        }
      }

      // Add publication types filter
      if (selectedPublicationTypes.length > 0) {
        const typeFilters = selectedPublicationTypes.map(pt => `type:${pt.id}`);
        filters.push(typeFilters.join('|'));
      }
      
      // Add publication year filter
      if (publicationYear.trim()) {
        filters.push(`publication_year:${publicationYear.trim()}`);
      }
      
      // Add year range filter
      if (startYear.trim() && endYear.trim()) {
        filters.push(`publication_year:${startYear.trim()}-${endYear.trim()}`);
      }
      
      // Add journals filter
      if (selectedJournals.length > 0) {
        const journalFilters = selectedJournals.map(journal => {
          const sourceId = journal.id.split('/').pop();
          return `primary_location.source.id:${sourceId}`;
        });
        filters.push(journalFilters.join('|'));
      }

      const filterString = filters.join(',');
      const params = new URLSearchParams();
      if (filterString) params.append('filter', filterString);
      
      // Use different API approach based on whether authors are selected
      if (selectedAuthors.length > 0) {
        // When authors are selected, fetch individual papers and process them
        params.append('per_page', '200'); // Get more papers for better trend analysis
        params.append('sort', 'cited_by_count:desc');
        
        const apiUrl = `https://api.openalex.org/works?${params.toString()}`;
        setApiCalls([apiUrl]);
        
        const response = await fetch(apiUrl);
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.details || `HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Deduplicate results based on work ID and title
        const uniqueResults = [];
        const seenIds = new Set();
        const seenTitles = new Set();
        
        if (data.results && Array.isArray(data.results)) {
          data.results.forEach(result => {
            const title = result.title || result.display_name || '';
            const normalizedTitle = title.toLowerCase().trim();
            
            // Check both ID and title for duplicates
            if (result.id && !seenIds.has(result.id) && !seenTitles.has(normalizedTitle)) {
              seenIds.add(result.id);
              seenTitles.add(normalizedTitle);
              uniqueResults.push(result);
            }
          });
        }
        
        // Process individual papers to create trend data
        const yearlyDistribution = {};
        let totalPublications = 0;
        
        uniqueResults.forEach(paper => {
          const year = paper.publication_year;
          if (year) {
            yearlyDistribution[year] = (yearlyDistribution[year] || 0) + 1;
            totalPublications++;
          }
        });
        
        // Calculate growth rates
        const years = Object.keys(yearlyDistribution).sort((a, b) => parseInt(a) - parseInt(b));
        const yearOverYearGrowth = [];
        
        for (let i = 1; i < years.length; i++) {
          const currentYear = parseInt(years[i]);
          const previousYear = parseInt(years[i - 1]);
          const currentCount = yearlyDistribution[currentYear];
          const previousCount = yearlyDistribution[previousYear];
          
          if (previousCount > 0) {
            const growthRate = ((currentCount - previousCount) / previousCount) * 100;
            yearOverYearGrowth.push({
              year: currentYear,
              rate: Math.round(growthRate * 100) / 100
            });
          }
        }
        
        // Calculate average growth rate
        const averageGrowthRate = yearOverYearGrowth.length > 0 
          ? Math.round((yearOverYearGrowth.reduce((sum, item) => sum + item.rate, 0) / yearOverYearGrowth.length) * 100) / 100
          : 0;
        
        // Create trend data structure
        const trendData = {
          publication_count: totalPublications,
          yearly_distribution: yearlyDistribution,
          meta: {
            trend_factors: {
              average_growth_rate: averageGrowthRate,
              year_over_year_growth: yearOverYearGrowth,
              relative_popularity: Math.round((totalPublications / 1000) * 100) / 100
            }
          }
        };
        
        setTrendData(trendData);
        
      } else {
        // When no authors are selected, use the original group_by approach
        params.append('group_by', 'publication_year');
        params.append('per_page', '200');
        
        const apiUrl = `https://api.openalex.org/works?${params.toString()}`;
        setApiCalls([apiUrl]);
        
        const response = await fetch(apiUrl);
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.details || `HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Check if we have any results
        if (!data.group_by || data.group_by.length === 0) {
          setError("No publications found for the given keyword and filters.");
          return;
        }
        
        // Process group_by data to create trend analysis
        const yearlyDistribution = {};
        let totalPublications = 0;
        
        // Process group_by results
        data.group_by.forEach(group => {
          const year = group.key;
          const count = group.count;
          if (year && count > 0) {
            yearlyDistribution[year] = count;
            totalPublications += count;
          }
        });
        
        // Calculate growth rates
        const years = Object.keys(yearlyDistribution).sort((a, b) => parseInt(a) - parseInt(b));
        const yearOverYearGrowth = [];
        
        for (let i = 1; i < years.length; i++) {
          const currentYear = parseInt(years[i]);
          const previousYear = parseInt(years[i - 1]);
          const currentCount = yearlyDistribution[currentYear];
          const previousCount = yearlyDistribution[previousYear];
          
          if (previousCount > 0) {
            const growthRate = ((currentCount - previousCount) / previousCount) * 100;
            yearOverYearGrowth.push({
              year: currentYear,
              rate: Math.round(growthRate * 100) / 100
            });
          }
        }
        
        // Calculate average growth rate
        const averageGrowthRate = yearOverYearGrowth.length > 0 
          ? Math.round((yearOverYearGrowth.reduce((sum, item) => sum + item.rate, 0) / yearOverYearGrowth.length) * 100) / 100
          : 0;
        
        // Create trend data structure
        const trendData = {
          publication_count: totalPublications,
          yearly_distribution: yearlyDistribution,
          meta: {
            trend_factors: {
              average_growth_rate: averageGrowthRate,
              year_over_year_growth: yearOverYearGrowth,
              relative_popularity: Math.round((totalPublications / 1000) * 100) / 100
            }
          }
        };
        
        setTrendData(trendData);
      }
      
    } catch (e) {
      setError("Failed to fetch publication trend. Please try again with a different keyword or date range.");
      console.error("Keyword trend fetch error:", e);
    } finally {
      setIsLoadingTrend(false);
    }
  };

  // Advanced filter apply handler
  const handleApplyAdvanced = () => {
    setShowAdvanced(false);
    handleSearch();
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
    if (!data || !data.year || !searchKeyword.trim()) return;
    
    // Construct search parameters
    const searchParams = new URLSearchParams();
    
    // Add keyword search
    searchParams.append('search', searchKeyword.trim());
    
    // Add year filter (override any existing year range with the clicked year)
    searchParams.append('publication_year', data.year);
    
    // Add selected authors
    if (selectedAuthors.length > 0) {
      selectedAuthors.forEach(author => {
        if (author.id) {
          const authorId = author.id.split('/').pop();
          searchParams.append('author_id', authorId);
          // Also pass the display name as a string
          if (author.display_name) {
            searchParams.append('author_name', author.display_name);
            console.log('Adding author to URL:', authorId, author.display_name);
          }
        }
      });
    }
    
    // Add selected institutions
    if (selectedInstitutions.length > 0) {
      selectedInstitutions.forEach(institution => {
        if (institution.id) {
          const institutionId = institution.id.split('/').pop();
          searchParams.append('institution_id', institutionId);
          // Also pass the display name as a string
          if (institution.display_name) {
            searchParams.append('institution_name', institution.display_name);
            console.log('Adding institution to URL:', institutionId, institution.display_name);
          }
        }
      });
    }
    
    // Add publication types
    if (selectedPublicationTypes.length > 0) {
      selectedPublicationTypes.forEach(type => {
        searchParams.append('publication_type', type.id);
      });
    }
    
    // Add journals
    if (selectedJournals.length > 0) {
      selectedJournals.forEach(journal => {
        if (journal.id) {
          const journalId = journal.id.split('/').pop();
          searchParams.append('journal_id', journalId);
        }
      });
    }
    
    // Add year range (if specified, will be overridden by the clicked year)
    if (startYear.trim() && endYear.trim()) {
      searchParams.append('start_year', startYear.trim());
      searchParams.append('end_year', endYear.trim());
    }
    
    // Navigate to search page with all filters
    const finalUrl = `/search?${searchParams.toString()}`;
    console.log('Navigating to search page with URL:', finalUrl);
    navigate(finalUrl);
  };

  const renderTrendIndicators = () => {
    if (!trendData?.meta?.trend_factors) return null;

    const { average_growth_rate, relative_popularity } = trendData.meta.trend_factors;

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
    <>
      <TopBar />
      <div style={{ background: '#000', minHeight: '100vh', paddingBottom: 40 }} className={darkMode ? 'dark' : ''}>
        {/* Search Background - covers the search interface area */}
        <div style={{ position: 'relative' }}>
          <div style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            right: 0, 
            height: '600px', 
            zIndex: 1,
            pointerEvents: 'none'
          }}>
            <Particles />
          </div>
          
          {/* Search Interface Content */}
          <div style={{ position: 'relative', zIndex: 2 }}>
            <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem 1rem' }}>
              <SearchHeader 
                darkMode={darkMode} 
                title="Publication Trends"
                subtitle="Visualize research trends and gain insights into the evolution of topics"
              />
              <SearchForm
                searchKeyword={searchKeyword}
                setSearchKeyword={setSearchKeyword}
                selectedAuthors={selectedAuthors}
                setSelectedAuthors={setSelectedAuthors}
                selectedInstitutions={selectedInstitutions}
                setSelectedInstitutions={setSelectedInstitutions}
                onSearch={handleSearch}
                onOpenAdvancedFilters={() => setShowAdvanced(true)}
                onAuthorsClick={() => {
                  setShowAuthorModal(true);
                  clearAuthorSuggestions();
                }}
                onInstitutionsClick={() => {
                  setShowInstitutionModal(true);
                  clearInstitutionSuggestions();
                }}
                loading={isLoadingTrend}
                darkMode={darkMode}
                description="Enter keywords and apply filters to analyze research trends"
              />

              <AdvancedFiltersDrawer
                open={showAdvanced}
                onClose={() => setShowAdvanced(false)}
                publicationYear={publicationYear}
                setPublicationYear={setPublicationYear}
                startYear={startYear}
                setStartYear={setStartYear}
                endYear={endYear}
                setEndYear={setEndYear}
                selectedPublicationTypes={selectedPublicationTypes}
                setSelectedPublicationTypes={setSelectedPublicationTypes}
                selectedJournals={selectedJournals}
                setSelectedJournals={setSelectedJournals}
                onPublicationTypesClick={() => setShowPublicationTypesModal(true)}
                onJournalsClick={() => {
                  setShowJournalsModal(true);
                  clearJournalSuggestions();
                }}
                onApply={handleApplyAdvanced}
                darkMode={darkMode}
              />
              {/* Disclaimer Box */}
              <ApiCallInfoBox 
                userInputs={userInputs} 
                apiCalls={apiCalls} 
                darkMode={darkMode} 
              />
            </div>
          </div>
        </div>
        
        {/* Trend Visualization - outside the background area */}
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1rem' }}>
          <div className={styles.mainContent}>
            <div className={styles.pageContent}>
              <div className={styles.topRow}>
                <div className={styles.trendVisualizationBox}>
                  {error && <div className={styles.errorMessage}>{error}</div>}

                  {isLoadingTrend && (
                    <div className={styles.loadingContainer}>
                      <div className={styles.spinner}></div>
                      <p>Fetching trend data...</p>
                    </div>
                  )}

                  {/* Trend Indicators */}
                  {trendData && !isLoadingTrend && !error && renderTrendIndicators()}

                  {/* Main Chart */}
                  {chartData.length > 0 && (
                    <div className={styles.chartContainer}>
                      <h3>
                        Publication Count by Year
                        {selectedInstitutions.length > 0 && ` - ${selectedInstitutions.map(i => i.display_name).join(', ')}`}
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
                  {!isLoadingTrend && !error && chartData.length === 0 && trendData && (
                    <div className={styles.noResultsMessage}>
                      <p>No publications found</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Author Multi-Select Modal Dropdown */}
          <MultiSelectModalDropdown
            isOpen={showAuthorModal}
            onClose={() => setShowAuthorModal(false)}
            title="Select Authors"
            placeholder="Type to search authors..."
            onSearchChange={searchAuthors}
            suggestions={authorSuggestions}
            selectedItems={selectedAuthors}
            onSelect={(author) => {
              setSelectedAuthors(prev => {
                if (prev.some(a => a.id === author.id)) return prev;
                return [...prev, author];
              });
            }}
            onDeselect={(author) => {
              setSelectedAuthors(prev => prev.filter(a => a.id !== author.id));
            }}
            darkMode={darkMode}
            loading={authorLoading}
          />

          {/* Institution Multi-Select Modal Dropdown */}
          <MultiSelectModalDropdown
            isOpen={showInstitutionModal}
            onClose={() => setShowInstitutionModal(false)}
            title="Select Institutions"
            placeholder="Type to search institutions..."
            onSearchChange={searchInstitutions}
            suggestions={institutionSuggestions}
            selectedItems={selectedInstitutions}
            onSelect={(institution) => {
              setSelectedInstitutions(prev => {
                if (prev.some(i => i.id === institution.id)) return prev;
                return [...prev, institution];
              });
            }}
            onDeselect={(institution) => {
              setSelectedInstitutions(prev => prev.filter(i => i.id !== institution.id));
            }}
            darkMode={darkMode}
            loading={institutionLoading}
          />

          {/* Publication Types Multi-Select Modal */}
          <MultiSelectModalDropdown
            isOpen={showPublicationTypesModal}
            onClose={() => setShowPublicationTypesModal(false)}
            title="Select Publication Types"
            placeholder="Type to search publication types..."
            onSearchChange={(query) => {
              const filtered = publicationTypes.filter(pt => 
                pt.display_name.toLowerCase().includes(query.toLowerCase())
              );
              return Promise.resolve(filtered);
            }}
            suggestions={publicationTypes}
            selectedItems={selectedPublicationTypes}
            onSelect={(publicationType) => {
              setSelectedPublicationTypes(prev => {
                if (prev.some(pt => pt.id === publicationType.id)) {
                  return prev;
                }
                return [...prev, publicationType];
              });
            }}
            onDeselect={(publicationType) => {
              setSelectedPublicationTypes(prev => 
                prev.filter(pt => pt.id !== publicationType.id)
              );
            }}
            darkMode={darkMode}
            loading={false}
          />

          {/* Journals Multi-Select Modal */}
          <MultiSelectModalDropdown
            isOpen={showJournalsModal}
            onClose={() => setShowJournalsModal(false)}
            title="Select Journals"
            placeholder="Type to search journals..."
            onSearchChange={searchJournals}
            suggestions={journalSuggestions}
            selectedItems={selectedJournals}
            onSelect={(journal) => {
              setSelectedJournals(prev => {
                if (prev.some(j => j.id === journal.id)) {
                  return prev;
                }
                return [...prev, journal];
              });
            }}
            onDeselect={(journal) => {
              setSelectedJournals(prev => 
                prev.filter(j => j.id !== journal.id)
              );
            }}
            darkMode={darkMode}
            loading={journalLoading}
          />
        </div>
      </div>
    </>
  );
};
