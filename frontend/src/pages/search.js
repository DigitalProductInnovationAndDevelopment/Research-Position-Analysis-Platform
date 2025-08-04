import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import TopBar from '../components/shared/TopBar';
import SearchHeader from '../components/shared/SearchHeader';
import SearchForm from '../components/shared/SearchForm';
import AdvancedFiltersDrawer from '../components/shared/AdvancedFiltersDrawer';
import SearchResultsList from '../components/shared/SearchResultsList';
import MultiSelectModalDropdown from '../components/shared/MultiSelectModalDropdown/MultiSelectModalDropdown';
import useDropdownSearch from '../hooks/useDropdownSearch';
import ApiCallInfoBox from '../components/shared/ApiCallInfoBox';
import Particles from '../components/animated/SearchBackground/Particles';

const OPENALEX_API_BASE = 'https://api.openalex.org';

const SearchPageLight = ({ darkMode = true }) => {
  const location = useLocation();
  // Main search/filter state
  const [searchKeyword, setSearchKeyword] = useState("");
  // Multi-select for authors and institutions
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState([]);
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const resultsPerPage = 15;

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

  // Handle URL parameters and auto-search
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchParam = urlParams.get('search');
    const yearParam = urlParams.get('publication_year');
    const institutionIdParam = urlParams.get('institution_id');
    const authorIdParams = urlParams.getAll('author_id');
    const institutionIdParams = urlParams.getAll('institution_id');
    const publicationTypeParams = urlParams.getAll('publication_type');
    const journalIdParams = urlParams.getAll('journal_id');
    const startYearParam = urlParams.get('start_year');
    const endYearParam = urlParams.get('end_year');

    // Check if we have any chart-related parameters (coming from graph click)
    const hasChartParams = searchParam || yearParam || institutionIdParam || authorIdParams.length > 0 || 
                          institutionIdParams.length > 0 || publicationTypeParams.length > 0 || 
                          journalIdParams.length > 0 || startYearParam || endYearParam;

    if (hasChartParams) {
      // Has URL parameters - came from graph click, auto-search
      console.log('Graph navigation detected - auto-searching with params:', { 
        searchParam, yearParam, institutionIdParam, authorIdParams, 
        institutionIdParams, publicationTypeParams, journalIdParams, 
        startYearParam, endYearParam 
      });

      // Set search keyword if provided
      if (searchParam) {
        setSearchKeyword(searchParam);
      }

      // Set publication year if provided
      if (yearParam) {
        setPublicationYear(yearParam);
      }

      // Set year range if provided
      if (startYearParam) {
        setStartYear(startYearParam);
      }
      if (endYearParam) {
        setEndYear(endYearParam);
      }

      // Handle authors if provided
      if (authorIdParams.length > 0) {
        console.log('Setting author details for:', authorIdParams);
        
        // Get author names from URL parameters if available
        const authorNameParams = urlParams.getAll('author_name');
        console.log('Author name params received:', authorNameParams);
        
        // Create author objects with real names if available, otherwise use IDs
        const authors = authorIdParams.map((id, index) => {
          const displayName = authorNameParams[index] || `Author ${id}`;
          console.log(`Author ${id}: using display name "${displayName}"`);
          return { 
            id: `A${id}`, 
            display_name: displayName 
          };
        });
        
        console.log('Setting selected authors:', authors);
        setSelectedAuthors(authors);
      }

      // Handle institutions if provided
      if (institutionIdParams.length > 0) {
        console.log('Setting institution details for:', institutionIdParams);
        
        // Get institution names from URL parameters if available
        const institutionNameParams = urlParams.getAll('institution_name');
        console.log('Institution name params received:', institutionNameParams);
        
        // Create institution objects with real names if available, otherwise use IDs
        const institutions = institutionIdParams.map((id, index) => {
          const displayName = institutionNameParams[index] || `Institution ${id}`;
          console.log(`Institution ${id}: using display name "${displayName}"`);
          return { 
            id: `I${id}`, 
            display_name: displayName 
          };
        });
        
        console.log('Setting selected institutions:', institutions);
        setSelectedInstitutions(institutions);
      }

      // Handle publication types if provided
      if (publicationTypeParams.length > 0) {
        const selectedTypes = publicationTypes.filter(pt => 
          publicationTypeParams.includes(pt.id)
        );
        setSelectedPublicationTypes(selectedTypes);
      }

      // Handle journals if provided
      if (journalIdParams.length > 0) {
        // Fetch journal details for each journal ID
        Promise.all(journalIdParams.map(async (journalId) => {
          try {
            const response = await fetch(`${OPENALEX_API_BASE}/sources/S${journalId}`);
            if (response.ok) {
              const journalData = await response.json();
              return { id: journalData.id, display_name: journalData.display_name };
            }
          } catch (error) {
            console.error('Failed to fetch journal details:', error);
          }
        })).then(journals => {
          const validJournals = journals.filter(journal => journal);
          setSelectedJournals(validJournals);
        });
      }

      // Auto-search with URL parameters
      setTimeout(() => {
        performAutoSearchWithParams(searchParam, yearParam, institutionIdParam, authorIdParams, 
                                  institutionIdParams, publicationTypeParams, journalIdParams,
                                  startYearParam, endYearParam);
      }, 1000); // Increased timeout to allow for author/institution fetching
    } else {
      // No URL parameters - any other navigation, just clear fields
      console.log('Direct navigation - clearing fields, no auto-search');
      clearAllFields();
    }
  }, [location.search]);

  // Function to clear all search fields
  const clearAllFields = () => {
    setSearchKeyword("");
    setSelectedAuthors([]);
    setSelectedInstitutions([]);
    setPublicationYear("");
    setStartYear("");
    setEndYear("");
    setSelectedPublicationTypes([]);
    setSelectedJournals([]);
    setResults([]);
    setError(null);
  };

  // Separate function for auto-search with URL parameters
  const performAutoSearchWithParams = async (searchParam, yearParam, institutionIdParam, authorIdParams, 
                                  institutionIdParams, publicationTypeParams, journalIdParams,
                                  startYearParam, endYearParam, page = 1) => {
    console.log('performAutoSearchWithParams called with:', { 
      searchParam, yearParam, institutionIdParam, authorIdParams, 
      institutionIdParams, publicationTypeParams, journalIdParams,
      startYearParam, endYearParam, page 
    });

    setLoading(true);
    setError(null);
    if (page === 1) {
      setResults([]);
      setCurrentPage(1);
    }

    try {
      const filters = [];

      // Use search parameter directly from URL
      if (searchParam && searchParam.trim()) {
        const keyword = searchParam.trim();
        filters.push(`title_and_abstract.search:${keyword}`);
      }

      // Use year parameter directly from URL
      if (yearParam && yearParam.trim()) {
        filters.push(`publication_year:${yearParam.trim()}`);
      }

      // Use year range parameters directly from URL
      if (startYearParam && endYearParam && startYearParam.trim() && endYearParam.trim()) {
        filters.push(`publication_year:${startYearParam.trim()}-${endYearParam.trim()}`);
      }

      // Use institution parameters directly from URL
      if (institutionIdParams && institutionIdParams.length > 0) {
        const institutionFilters = institutionIdParams.map(id => `authorships.institutions.id:I${id.trim()}`);
        filters.push(institutionFilters.join('|'));
      }

      // Use author parameters directly from URL
      if (authorIdParams && authorIdParams.length > 0) {
        const authorFilters = authorIdParams.map(id => `authorships.author.id:A${id.trim()}`);
        filters.push(authorFilters.join('|'));
      }

      // Use publication type parameters directly from URL
      if (publicationTypeParams && publicationTypeParams.length > 0) {
        const typeFilters = publicationTypeParams.map(type => `type:${type}`);
        filters.push(typeFilters.join('|'));
      }

      // Use journal parameters directly from URL
      if (journalIdParams && journalIdParams.length > 0) {
        const journalFilters = journalIdParams.map(id => `primary_location.source.id:S${id.trim()}`);
        filters.push(journalFilters.join('|'));
      }

      const filterString = filters.join(',');
      const params = new URLSearchParams();
      if (filterString) params.append('filter', filterString);
      params.append('per_page', resultsPerPage.toString());
      params.append('page', page.toString());
      params.append('sort', 'cited_by_count:desc');

      const url = `${OPENALEX_API_BASE}/works?${params.toString()}`;

      // Track API call for disclaimer
      setApiCalls([url]);

      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch search results');
      const data = await response.json();

      // Deduplicate results based on work ID and title to prevent duplicates
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

      setResults(uniqueResults);
      setTotalResults(data.meta?.count || 0);
      setTotalPages(Math.ceil((data.meta?.count || 0) / resultsPerPage));
      setCurrentPage(page);
    } catch (e) {
      setError(e.message || 'Failed to fetch search results');
    } finally {
      setLoading(false);
    }
  };

  // Fetch institution details by ID (for URL param support)
  const fetchInstitutionById = async (institutionId) => {
    try {
      const response = await fetch(`${OPENALEX_API_BASE}/institutions/I${institutionId}`);
      if (response.ok) {
        const institutionData = await response.json();
        setSelectedInstitutions([{ id: institutionData.id, display_name: institutionData.display_name }]);
      }
    } catch (error) {
      console.error('Failed to fetch institution details:', error);
    }
  };

  // Search handler
  const handleSearch = async (page = 1) => {
    setLoading(true);
    setError(null);
    if (page === 1) {
      setResults([]);
      setCurrentPage(1);
    }

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
      if (searchKeyword.trim()) {
        const keyword = searchKeyword.trim();
        // Format: title_and_abstract.search:keyword (OpenAlex handles multi-word automatically)
        filters.push(`title_and_abstract.search:${keyword}`);
      }
      if (selectedAuthors.length > 0) {
        selectedAuthors.forEach(a => {
          const authorId = 'A' + a.id.split('/').pop();
          filters.push(`authorships.author.id:${authorId}`);
        });
      }
      if (selectedInstitutions.length > 0) {
        selectedInstitutions.forEach(i => {
          const institutionId = 'I' + i.id.split('/').pop();
          filters.push(`authorships.institutions.id:${institutionId}`);
        });
      }
      if (selectedPublicationTypes.length > 0) {
        // Handle multiple publication types
        const typeFilters = selectedPublicationTypes.map(pt => `type:${pt.id}`);
        filters.push(typeFilters.join('|'));
      }
      if (publicationYear.trim()) {
        filters.push(`publication_year:${publicationYear.trim()}`);
      }
      if (startYear.trim() && endYear.trim()) {
        filters.push(`publication_year:${startYear.trim()}-${endYear.trim()}`);
      }
      if (selectedJournals.length > 0) {
        // Handle multiple journals
        const journalFilters = selectedJournals.map(journal => {
          const sourceId = journal.id.split('/').pop();
          return `primary_location.source.id:${sourceId}`;
        });
        filters.push(journalFilters.join('|'));
      }
      const filterString = filters.join(',');
      const params = new URLSearchParams();
      if (filterString) params.append('filter', filterString);
      params.append('per_page', resultsPerPage.toString());
      params.append('page', page.toString());
      params.append('sort', 'cited_by_count:desc');

      const url = `${OPENALEX_API_BASE}/works?${params.toString()}`;

      // Track API call for disclaimer
      setApiCalls([url]);

      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch search results');
      const data = await response.json();

      // Deduplicate results based on work ID and title to prevent duplicates
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

      setResults(uniqueResults);
      setTotalResults(data.meta?.count || 0);
      setTotalPages(Math.ceil((data.meta?.count || 0) / resultsPerPage));
      setCurrentPage(page);
    } catch (e) {
      setError(e.message || 'Failed to fetch search results');
    } finally {
      setLoading(false);
    }
  };

  // Advanced filter apply handler
  const handleApplyAdvanced = () => {
    setShowAdvanced(false);
    handleSearch();
  };

  // Pagination handlers
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      // Check if we came from chart (have URL parameters)
      const urlParams = new URLSearchParams(location.search);
      const searchParam = urlParams.get('search');
      const yearParam = urlParams.get('publication_year');
      const institutionIdParam = urlParams.get('institution_id');
      const authorIdParams = urlParams.getAll('author_id');
      const institutionIdParams = urlParams.getAll('institution_id');
      const publicationTypeParams = urlParams.getAll('publication_type');
      const journalIdParams = urlParams.getAll('journal_id');
      const startYearParam = urlParams.get('start_year');
      const endYearParam = urlParams.get('end_year');

      if (searchParam || yearParam || institutionIdParam || authorIdParams.length > 0 || 
          institutionIdParams.length > 0 || publicationTypeParams.length > 0 || 
          journalIdParams.length > 0 || startYearParam || endYearParam) {
        // Use auto-search with parameters
        performAutoSearchWithParams(searchParam, yearParam, institutionIdParam, authorIdParams, 
                                  institutionIdParams, publicationTypeParams, journalIdParams,
                                  startYearParam, endYearParam, newPage);
      } else {
        // Use regular search
        handleSearch(newPage);
      }
    }
  };

  const handlePreviousPage = () => {
    handlePageChange(currentPage - 1);
  };

  const handleNextPage = () => {
    handlePageChange(currentPage + 1);
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
              <SearchHeader darkMode={darkMode} />
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
                loading={loading}
                darkMode={darkMode}
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

        {/* Search Results - outside the background area */}
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1rem' }}>
          <SearchResultsList results={results} loading={loading} error={error} darkMode={darkMode} />

          {/* Pagination */}
          {!loading && !error && totalPages > 1 && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '1rem',
              marginTop: '2rem',
              padding: '1rem',
              background: '#2a2a2a',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
              border: '1px solid #404040'
            }}>
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                style={{
                  padding: '0.5rem 1rem',
                  background: currentPage === 1 ? '#3a3a3a' : '#4F6AF6',
                  color: currentPage === 1 ? '#888' : 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  fontWeight: '600'
                }}
              >
                Previous
              </button>

              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                {/* Page numbers */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      style={{
                        padding: '0.5rem 0.75rem',
                        background: currentPage === pageNum ? '#4F6AF6' : '#2a2a2a',
                        color: currentPage === pageNum ? 'white' : '#4F6AF6',
                        border: '1px solid #4F6AF6',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        minWidth: '40px'
                      }}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                style={{
                  padding: '0.5rem 1rem',
                  background: currentPage === totalPages ? '#3a3a3a' : '#4F6AF6',
                  color: currentPage === totalPages ? '#888' : 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                  fontWeight: '600'
                }}
              >
                Next
              </button>

              <div style={{
                marginLeft: '1rem',
                color: '#ccc',
                fontSize: '0.9rem',
                fontWeight: '500'
              }}>
                Page {currentPage} of {totalPages} ({totalResults.toLocaleString()} results)
              </div>
            </div>
          )}

          {/* Authors Multi-Select Modal */}
          <MultiSelectModalDropdown
            isOpen={showAuthorModal}
            onClose={() => setShowAuthorModal(false)}
            title="Select Authors"
            placeholder="Type to search authors..."
            onSearchChange={searchAuthors}
            suggestions={authorSuggestions}
            selectedItems={selectedAuthors}
            onSelect={author => {
              setSelectedAuthors(prev => prev.some(a => a.id === author.id) ? prev : [...prev, author]);
            }}
            onDeselect={author => {
              setSelectedAuthors(prev => prev.filter(a => a.id !== author.id));
            }}
            darkMode={darkMode}
            loading={authorLoading}
          />

          {/* Institutions Multi-Select Modal */}
          <MultiSelectModalDropdown
            isOpen={showInstitutionModal}
            onClose={() => setShowInstitutionModal(false)}
            title="Select Institutions"
            placeholder="Type to search institutions..."
            onSearchChange={searchInstitutions}
            suggestions={institutionSuggestions}
            selectedItems={selectedInstitutions}
            onSelect={institution => {
              setSelectedInstitutions(prev => prev.some(i => i.id === institution.id) ? prev : [...prev, institution]);
            }}
            onDeselect={institution => {
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
              // Filter the predefined publication types based on search query
              const filtered = publicationTypes.filter(pt =>
                pt.display_name.toLowerCase().includes(query.toLowerCase())
              );
              // Return a mock suggestions array for the multi-select component
              return Promise.resolve(filtered);
            }}
            suggestions={publicationTypes}
            selectedItems={selectedPublicationTypes}
            onSelect={(publicationType) => {
              setSelectedPublicationTypes(prev => {
                // Prevent duplicate selection
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
                // Prevent duplicate selection
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

export default SearchPageLight;
