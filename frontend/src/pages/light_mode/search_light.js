import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styles from '../../assets/styles/search.module.css';
import PageLayout from '../../components/shared/PageLayout/PageLayout';
import FilterMenu from '../../components/shared/FilterMenu/FilterMenu';
import Autocomplete from '../../components/shared/Autocomplete/Autocomplete';

const getFirstSentence = (text) => {
  if (!text) return "";
  const sentenceEndMatch = text.match(/[^.!?]*[.!?]/);
  const firstSentence = sentenceEndMatch ? sentenceEndMatch[0] : text;

  // Append ellipsis if the abstract is longer than the first sentence
  return text.length > firstSentence.length ? `${firstSentence} ...` : firstSentence;
};

const isSiemensPaper = (result) => {
  if (!result.authorships) return false;

  // Check if any of the institutions in the paper are Siemens
  return result.authorships.some(authorship =>
    authorship.institutions?.some(institution =>
      institution.display_name?.toLowerCase().includes('siemens')
    )
  );
};

const reconstructAbstract = (invertedIndex) => {
  if (!invertedIndex) return "";

  // Find the maximum index to determine the size of the array
  let maxIndex = 0;
  Object.keys(invertedIndex).forEach(word => {
    invertedIndex[word].forEach(index => {
      if (index > maxIndex) maxIndex = index;
    });
  });

  // Initialize an array with nulls to hold words in correct positions
  const abstractArray = new Array(maxIndex + 1).fill(null);

  // Place words into their correct positions
  Object.entries(invertedIndex).forEach(([word, positions]) => {
    positions.forEach(index => {
      abstractArray[index] = word;
    });
  });

  // Filter out nulls and join into a sentence
  return abstractArray.filter(word => word !== null).join(" ");
};

const SearchPageLight = ({ darkMode, toggleDarkMode }) => {
  const location = useLocation();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [institution, setInstitution] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [author, setAuthor] = useState("");
  const [funding, setFunding] = useState("");

  const [topic, setTopic] = useState("");
  const [publicationTypes, setPublicationTypes] = useState([]);
  const [availableTypes, setAvailableTypes] = useState([]);
  const [isOpenAccess, setIsOpenAccess] = useState(false);
  const [publicationYear, setPublicationYear] = useState("");
  const [startYear, setStartYear] = useState("");
  const [endYear, setEndYear] = useState("");

  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedAbstracts, setExpandedAbstracts] = useState({});
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [activeFilters, setActiveFilters] = useState(['Keyword', 'Author', 'Institution']);

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const response = await fetch('https://api.openalex.org/types');
        const data = await response.json();
        setAvailableTypes(data.results);
      } catch (error) {
        console.error('Failed to fetch publication types:', error);
      }
    };
    fetchTypes();
  }, []);

  // Helper to normalize text for accent/diacritic/case-insensitive matching
  const normalizeForMatch = (str) => {
    return String(str)
      .normalize('NFD')
      .replace(/ß/g, 'ss')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  };

  // Function to highlight multiple search terms in text, accent/case-insensitive
  const highlightText = (text, searchTerms, className) => {
    if (!text) return String(text ?? '');
    let safeText = String(text);
    if (!searchTerms || (Array.isArray(searchTerms) && searchTerms.length === 0) || !className) return safeText;
    const terms = Array.isArray(searchTerms) ? searchTerms.filter(Boolean) : [searchTerms];
    if (terms.length === 0) return safeText;
    // Normalize search terms for matching
    const normalizedTerms = terms.map(normalizeForMatch);
    // Split the text into words and non-words to preserve original formatting
    const parts = [];
    let lastIndex = 0;
    const regex = /\b\w+\b/g;
    let match;
    while ((match = regex.exec(safeText)) !== null) {
      const word = match[0];
      const normWord = normalizeForMatch(word);
      const shouldHighlight = normalizedTerms.some(term => term && normWord.includes(term));
      if (match.index > lastIndex) {
        parts.push(safeText.slice(lastIndex, match.index));
      }
      if (shouldHighlight) {
        parts.push(<span key={match.index} className={className}>{word}</span>);
      } else {
        parts.push(word);
      }
      lastIndex = match.index + word.length;
    }
    if (lastIndex < safeText.length) {
      parts.push(safeText.slice(lastIndex));
    }
    return parts;
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('q');
    if (query) {
      setSearchKeyword(query);
      handleSearchWithQuery(query);
    }
  }, [location]);

  // Pagination state
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalResults, setTotalResults] = React.useState(0);
  const [hasNextPage, setHasNextPage] = React.useState(false);
  const [hasPreviousPage, setHasPreviousPage] = React.useState(false);

  const toggleAbstractExpansion = (resultId) => {
    setExpandedAbstracts(prev => ({
      ...prev,
      [resultId]: !prev[resultId]
    }));
  };

  const handleNextPage = () => {
    if (hasNextPage) {
      handleSearch(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (hasPreviousPage) {
      handleSearch(currentPage - 1);
    }
  };

  const handleSearch = async (page = 1) => {
    setError(null);
    setLoading(true);
    setSearchResults([]);

    // Data type validation for year fields
    if (activeFilters.includes('Publication Year')) {
      const yearVal = publicationYear.trim();
      if (yearVal !== '') {
        if (/^-\d+$/.test(yearVal)) {
          setError(`Invalid input: '${publicationYear}' is a negative year. Please enter a valid positive integer year (e.g., 2023).`);
          setLoading(false);
          return;
        }
        if (!/^\d+$/.test(yearVal)) {
          setError(`Invalid input: '${publicationYear}' is not a valid year. Please enter a valid positive integer year (e.g., 2023).`);
          setLoading(false);
          return;
        }
      }
    }
    if (activeFilters.includes('Year Range')) {
      const startVal = startYear.trim();
      const endVal = endYear.trim();
      if (startVal !== '') {
        if (/^-\d+$/.test(startVal)) {
          setError(`Invalid input: '${startYear}' is a negative year. Please enter a valid positive integer year (e.g., 2020).`);
          setLoading(false);
          return;
        }
        if (!/^\d+$/.test(startVal)) {
          setError(`Invalid input: '${startYear}' is not a valid year. Please enter a valid positive integer year (e.g., 2020).`);
          setLoading(false);
          return;
        }
      }
      if (endVal !== '') {
        if (/^-\d+$/.test(endVal)) {
          setError(`Invalid input: '${endYear}' is a negative year. Please enter a valid positive integer year (e.g., 2023).`);
          setLoading(false);
          return;
        }
        if (!/^\d+$/.test(endVal)) {
          setError(`Invalid input: '${endYear}' is not a valid year. Please enter a valid positive integer year (e.g., 2023).`);
          setLoading(false);
          return;
        }
      }
    }

    // Data type validation for string fields
    const stringFields = [
      { value: searchKeyword, name: 'Keyword', active: activeFilters.includes('Keyword') },
      { value: author, name: 'Author', active: activeFilters.includes('Author') },
      { value: institution, name: 'Institution', active: activeFilters.includes('Institution') },
      { value: funding, name: 'Funding', active: activeFilters.includes('Funding') },
      { value: topic, name: 'Topic', active: activeFilters.includes('Topic') },
    ];
    for (const field of stringFields) {
      if (field.active) {
        const val = field.value;
        // Only validate if the field is non-empty (including whitespace)
        if (val && (val.trim() === '' || /^\d+$/.test(val.trim()))) {
          if (field.name === 'Author') {
            setError(`Invalid input: '${val}' is not a valid value for Author. Please enter a non-empty string without numbers.`);
          } else {
            setError(`Invalid input: '${val}' is not a valid value for ${field.name}. Please enter a non-empty string that is not only a number.`);
          }
          setLoading(false);
          return;
        }
      }
    }

    // Basic validation for at least one input
    if (
      !searchKeyword.trim() &&
      !institution.trim() &&
      !startDate &&
      !endDate &&
      !author.trim() &&
      !funding.trim() &&
      !topic.trim() &&
      !publicationYear.trim() &&
      !startYear.trim() &&
      !endYear.trim() &&
      publicationTypes.length === 0 &&
      !isOpenAccess
    ) {
      setError("Please enter at least one search criterion.");
      setLoading(false);
      return;
    }

    try {
      const params = new URLSearchParams();
      const filters = [];

      // Add search keyword filter
      if (searchKeyword.trim()) {
        // Replace spaces with + symbols for OpenAlex API compatibility
        const encodedKeyword = searchKeyword.trim().replace(/\s+/g, '+');
        filters.push(`title_and_abstract.search:${encodedKeyword}`);
      }

      // Add date filters
      if (activeFilters.includes('Date Range')) {
        const formatDate = (date) => date.toISOString().split('T')[0];
        if (startDate || endDate) {
          if (startDate && endDate) {
            filters.push(`publication_date:${formatDate(startDate)},${formatDate(endDate)}`);
          } else if (startDate) {
            filters.push(`from_publication_date:${formatDate(startDate)}`);
          } else { // only endDate
            filters.push(`to_publication_date:${formatDate(endDate)}`);
          }
        }
      } else if (activeFilters.includes('Year Range')) {
        if (startYear && endYear) {
          filters.push(`publication_year:${startYear}-${endYear}`);
        } else if (startYear) {
          filters.push(`publication_year:${startYear}`);
        } else if (endYear) {
          filters.push(`publication_year:${endYear}`);
        }
      } else if (activeFilters.includes('Publication Year') && publicationYear) {
        filters.push(`publication_year:${publicationYear}`);
      }

      // Handle institution search
      let institutionIds = [];
      if (institution.trim()) {
        try {
          // Step 1: Search for institutions by name
          const institutionResponse = await fetch(`https://api.openalex.org/institutions?search=${encodeURIComponent(institution.trim())}`);
          if (!institutionResponse.ok) {
            throw new Error('Failed to fetch institutions');
          }
          const institutionData = await institutionResponse.json();

          // Get all institution IDs
          institutionIds = institutionData.results.map(inst => inst.id.split('/').pop());

          if (institutionIds.length > 0) {
            // Step 2: Add institution IDs to the filter
            filters.push(`institutions.id:${institutionIds.join('|')}`);
          }
        } catch (error) {
          console.error('Error fetching institutions:', error);
          setError('Failed to fetch institution data. Please try again.');
          setLoading(false);
          return;
        }
      }

      // Add author filter
      if (author.trim()) {
        // Search within raw author names with proper encoding
        filters.push(`raw_author_name.search:${encodeURIComponent(author.trim())}`);
      }

      // Add funding filter
      if (funding.trim()) {
        filters.push(`grants.funder.display_name:"${funding.trim()}"`);
      }

      // Add Open Access filter
      if (isOpenAccess) {
        filters.push('is_oa:true');
      }

      // Add Topic (Concept) filter
      if (topic.trim()) {
        // Assuming topic is an ID, if not, it should be resolved to an ID first
        const topicFilterValue = topic.startsWith('C') ? `concepts.id:${topic}` : `concepts.display_name.search:${topic}`;
        filters.push(topicFilterValue);
      }

      // Add Type filter
      if (publicationTypes.length > 0) {
        filters.push(`type:${publicationTypes.map(t => t.id).join('|')}`);
      }

      // Add all filters as a single parameter
      if (filters.length > 0) {
        const filterString = filters.join(',');
        console.log('Filter string:', filterString); // Debug log
        params.append("filter", filterString);
      }

      // Add other parameters
      params.append("page", page.toString());
      params.append("per_page", "25");
      params.append("sort", "relevance_score:desc");

      const url = `http://localhost:4000/api/publications/search?${params.toString()}`;
      console.log('Making request to:', url); // Debug log

      const response = await fetch(url);
      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('Error response:', errorData);
        throw new Error(`HTTP error! status: ${response.status}${errorData ? `, details: ${JSON.stringify(errorData)}` : ''}`);
      }
      const data = await response.json();

      // Update search results and pagination state
      setSearchResults(data.results || []);
      setCurrentPage(page);
      setTotalResults(data.meta?.count || 0);

      // Calculate pagination state
      const totalPages = Math.ceil((data.meta?.count || 0) / 25);
      setHasNextPage(page < totalPages);
      setHasPreviousPage(page > 1);

    } catch (e) {
      setError("Failed to fetch search results. Please try again. Error: " + e.message);
      console.error("Search fetch error:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchWithQuery = async (query) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        filter: `search:"${query}"`,
        sort: 'relevance_score:desc',
        page: 1,
        per_page: 25
      });

      const response = await fetch(`http://localhost:4000/api/publications/search?${params}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.details || data.error || 'Failed to fetch search results');
      }

      setSearchResults(data.results || []);
    } catch (error) {
      console.error('Search error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSelectFilter = (filter) => {
    if (!activeFilters.includes(filter)) {
      setActiveFilters([...activeFilters, filter]);
    }
    setShowFilterMenu(false);
  };

  const handleTypeToggle = (type) => {
    setPublicationTypes(prev =>
      prev.some(pt => pt.id === type.id)
        ? prev.filter(pt => pt.id !== type.id)
        : [...prev, type]
    );
  };

  const allFilters = [
    'Funding', 'Open Access', 'Topic', 'Type', 'Publication Year', 'Year Range', 'Date Range'
  ];
  const availableFilters = allFilters.filter(f => !activeFilters.includes(f));

  return (
    <PageLayout darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
      <div style={{ padding: 'var(--spacing-xl)' }}>
        <div className={styles.searchPageContent}>
          <div className={styles.searchContainer}>
            <div className={styles.filterControls}>
              <div className={styles.activeFilters}>
                {activeFilters.map(filter => (
                  <div key={filter} className={styles.filterCriterium}>
                    <label className={styles.label}>{filter}</label>
                    {filter === 'Keyword' && (
                      <Autocomplete
                        value={searchKeyword}
                        onValueChange={setSearchKeyword}
                        placeholder="Enter keywords..."
                        apiEndpoint="https://api.openalex.org/concepts"
                        onEnterPress={() => handleSearch()}
                      />
                    )}
                    {filter === 'Author' && (
                      <Autocomplete
                        value={author}
                        onValueChange={setAuthor}
                        placeholder="Enter author name..."
                        apiEndpoint="https://api.openalex.org/authors"
                        onEnterPress={() => handleSearch()}
                      />
                    )}
                    {filter === 'Institution' && (
                      <Autocomplete
                        value={institution}
                        onValueChange={setInstitution}
                        placeholder="Enter institution name..."
                        apiEndpoint="https://api.openalex.org/institutions"
                        onEnterPress={() => handleSearch()}
                      />
                    )}
                    {filter === 'Funding' && (
                      <input
                        type="text"
                        value={funding}
                        onChange={(e) => setFunding(e.target.value)}
                        placeholder="Enter funding organization..."
                        className={styles.input}
                        onKeyDown={handleKeyPress}
                      />
                    )}
                    {filter === 'Open Access' && (
                      <div className={styles.checkboxContainer}>
                        <input
                          type="checkbox"
                          id="open-access-checkbox"
                          checked={isOpenAccess}
                          onChange={(e) => setIsOpenAccess(e.target.checked)}
                          className={styles.checkbox}
                        />
                        <label htmlFor="open-access-checkbox" className={styles.checkboxLabel}>Only Open Access Results</label>
                      </div>
                    )}
                    {filter === 'Topic' && (
                      <Autocomplete
                        value={topic}
                        onValueChange={setTopic}
                        placeholder="Enter topic name or ID..."
                        apiEndpoint="https://api.openalex.org/concepts"
                        onEnterPress={() => handleSearch()}
                      />
                    )}
                    {filter === 'Type' && (
                      <div className={styles.multiSelectContainer}>
                        <div className={styles.selectedTypes}>
                          {publicationTypes.length > 0
                            ? publicationTypes.map(t => t.display_name).join(', ')
                            : "Select publication types..."}
                        </div>
                        <div className={styles.multiSelectDropdown}>
                          {availableTypes.map(type => (
                            <div key={type.id} className={styles.multiSelectItem}>
                              <input
                                type="checkbox"
                                id={`type-${type.id}`}
                                checked={publicationTypes.some(pt => pt.id === type.id)}
                                onChange={() => handleTypeToggle(type)}
                              />
                              <label htmlFor={`type-${type.id}`}>{type.display_name}</label>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {filter === 'Publication Year' && (
                      <input
                        type="text"
                        value={publicationYear}
                        onChange={(e) => setPublicationYear(e.target.value)}
                        placeholder="e.g., 2023"
                        className={styles.input}
                        onKeyDown={handleKeyPress}
                      />
                    )}
                    {filter === 'Year Range' && (
                      <div className={styles.yearFilter}>
                        <input
                          type="text"
                          value={startYear}
                          onChange={(e) => setStartYear(e.target.value)}
                          placeholder="From Year"
                          className={styles.yearInput}
                          onKeyDown={handleKeyPress}
                        />
                        <input
                          type="text"
                          value={endYear}
                          onChange={(e) => setEndYear(e.target.value)}
                          placeholder="To Year"
                          className={styles.yearInput}
                          onKeyDown={handleKeyPress}
                        />
                      </div>
                    )}
                    {filter === 'Date Range' && (
                      <div className={styles.yearFilter}>
                        <DatePicker
                          selected={startDate}
                          onChange={(date) => setStartDate(date)}
                          selectsStart
                          startDate={startDate}
                          endDate={endDate}
                          placeholderText="Start Date"
                          className={styles.dateInput}
                          dateFormat="yyyy-MM-dd"
                        />
                        <DatePicker
                          selected={endDate}
                          onChange={(date) => setEndDate(date)}
                          selectsEnd
                          startDate={startDate}
                          endDate={endDate}
                          minDate={startDate}
                          placeholderText="End Date"
                          className={styles.dateInput}
                          dateFormat="yyyy-MM-dd"
                        />
                      </div>
                    )}
                  </div>
                ))}
                <div className={styles.addFilterContainer}>
                  <button className={styles.addFilterBtn} onClick={() => setShowFilterMenu(!showFilterMenu)}>+</button>
                  {showFilterMenu && <FilterMenu onSelectFilter={handleSelectFilter} availableFilters={availableFilters} />}
                </div>
              </div>
            </div>

            <div className={styles.searchButtonContainer}>
              <button
                onClick={() => handleSearch()}
                disabled={loading}
                className={styles.searchButton}
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>

            {error && <p className={styles.errorMessage}>{error}</p>}
          </div>

          {loading && (
            <div className={styles.loadingContainer}>
              <div className={styles.spinner}></div>
              <p className={styles.loadingMessage}>Loading results...</p>
            </div>
          )}

          {searchResults.length > 0 && (
            <div className={styles.searchResultsSection}>
              <div className={styles.resultsList}>
                {searchResults.map((result) => {
                  const authorString = result.authorships?.map(a => a.author.display_name).join(', ');
                  // Gather all unique institutions for this result
                  const institutionList = result.authorships
                    ? Array.from(new Set(result.authorships.flatMap(a => a.institutions || []).map(inst => inst.display_name))).filter(Boolean)
                    : [];
                  const institutionString = institutionList.join(', ');
                  // Format publication date as 'Published on Jan 01 2020' or 'Published on 2020'
                  let publicationDate = '';
                  if (result.publication_date) {
                    const dateObj = new Date(result.publication_date);
                    if (!isNaN(dateObj)) {
                      const day = String(dateObj.getDate()).padStart(2, '0');
                      const month = dateObj.toLocaleString('default', { month: 'short' });
                      const year = dateObj.getFullYear();
                      publicationDate = `Published on ${month} ${day} ${year}`;
                    }
                  }
                  if (!publicationDate && result.publication_year) {
                    publicationDate = `Published on ${result.publication_year}`;
                  }
                  const journalName = result.primary_location?.source?.display_name || '';

                  return (
                    <div key={result.id} className={`${styles.searchResultItem} ${isSiemensPaper(result) ? styles.siemensPaper : ''}`}>
                      <h3 className={styles.resultTitle}>
                        <a href={result.id} target="_blank" rel="noopener noreferrer">
                          {highlightText(result.display_name, searchKeyword.split(/\s+/), styles.highlightBackground)}
                        </a>
                      </h3>
                      <div className={styles.resultMeta}>
                        <span className={styles.authors}>
                          {highlightText(authorString, [author], styles.highlightBold)}
                        </span>
                        {institutionList.length > 0 && (
                          <div style={{ color: 'black', marginTop: 4 }}>
                            {institutionString}
                          </div>
                        )}
                        {journalName && (
                          <div style={{ color: 'black', marginTop: 4 }}>
                            {journalName}
                          </div>
                        )}
                        {publicationDate && (
                          <div style={{ color: 'black', marginTop: 4 }}>
                            {publicationDate}
                          </div>
                        )}
                      </div>

                      {result.abstract_inverted_index && (
                        <div className={styles.abstractContainer}>
                          <p className={styles.abstractText}>
                            {expandedAbstracts[result.id]
                              ? highlightText(reconstructAbstract(result.abstract_inverted_index), searchKeyword.split(/\s+/), styles.highlightBold)
                              : getFirstSentence(reconstructAbstract(result.abstract_inverted_index))
                            }
                          </p>
                          {reconstructAbstract(result.abstract_inverted_index).length > getFirstSentence(reconstructAbstract(result.abstract_inverted_index)).length && (
                            <button onClick={() => toggleAbstractExpansion(result.id)} className={styles.toggleAbstractButton}>
                              {expandedAbstracts[result.id] ? 'Show less' : 'Show more'}
                            </button>
                          )}
                        </div>
                      )}

                      <div className={styles.resultActions}>
                        <span className={styles.citationCount}>Cited by {result.cited_by_count}</span>
                        {result.primary_location?.landing_page_url && (
                          <a href={result.primary_location.landing_page_url} target="_blank" rel="noopener noreferrer" className={styles.actionLink}>
                            View at Publisher
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination Bar */}
              <div className={styles.paginationBar}>
                <div className={styles.paginationInfo}>
                  <span>Showing {((currentPage - 1) * 25) + 1} - {Math.min(currentPage * 25, totalResults)} of {totalResults} results</span>
                </div>
                <div className={styles.paginationControls}>
                  <button
                    onClick={handlePreviousPage}
                    disabled={!hasPreviousPage || loading}
                    className={styles.paginationButton}
                  >
                    Previous
                  </button>
                  <span className={styles.pageInfo}>Page {currentPage}</span>
                  <button
                    onClick={handleNextPage}
                    disabled={!hasNextPage || loading}
                    className={styles.paginationButton}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default SearchPageLight;
