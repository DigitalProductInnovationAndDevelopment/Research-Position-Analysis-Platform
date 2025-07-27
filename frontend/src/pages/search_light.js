import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import TopBar from '../components/shared/TopBar';
import SearchHeader from '../components/shared/SearchHeader';
import SearchForm from '../components/shared/SearchForm';
import AdvancedFiltersDrawer from '../components/shared/AdvancedFiltersDrawer';
import SearchResultsList from '../components/shared/SearchResultsList';
import DropdownTrigger from '../components/shared/DropdownTrigger';
import ModalDropdown from '../components/shared/ModalDropdown';
import useDropdownSearch from '../hooks/useDropdownSearch';
import ApiCallInfoBox from '../components/shared/ApiCallInfoBox';

const OPENALEX_API_BASE = 'https://api.openalex.org';

const SearchPageLight = ({ darkMode = true }) => {
  const location = useLocation();
  // Main search/filter state
  const [searchKeyword, setSearchKeyword] = useState("");
  const [author, setAuthor] = useState("");
  const [institution, setInstitution] = useState("");
  const [institutionObject, setInstitutionObject] = useState(null);
  // Advanced filters
  const [publicationYear, setPublicationYear] = useState("");
  const [startYear, setStartYear] = useState("");
  const [endYear, setEndYear] = useState("");
  const [publicationType, setPublicationType] = useState("");
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
  const [showInstitutionModal, setShowInstitutionModal] = useState(false);
  const [showJournalModal, setShowJournalModal] = useState(false);
  const [selectedJournal, setSelectedJournal] = useState(null);
  const [journalInput, setJournalInput] = useState('');

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
    
    // Check if we have any chart-related parameters (coming from graph click)
    const hasChartParams = searchParam || yearParam || institutionIdParam;
    
    if (hasChartParams) {
      // Has URL parameters - came from graph click, auto-search
      console.log('Graph navigation detected - auto-searching with params:', { searchParam, yearParam, institutionIdParam });
      
      // Set search keyword if provided
      if (searchParam) {
        setSearchKeyword(searchParam);
      }
      
      // Set publication year if provided
      if (yearParam) {
        setPublicationYear(yearParam);
      }
      
      // Handle institution if provided
      if (institutionIdParam) {
        fetchInstitutionById(institutionIdParam);
      }
      
      // Auto-search with URL parameters
      setTimeout(() => {
        performAutoSearchWithParams(searchParam, yearParam, institutionIdParam);
      }, 200);
    } else {
      // No URL parameters - any other navigation, just clear fields
      console.log('Direct navigation - clearing fields, no auto-search');
      clearAllFields();
    }
  }, [location.search]);

  // Function to clear all search fields
  const clearAllFields = () => {
    setSearchKeyword("");
    setAuthor("");
    setInstitution("");
    setInstitutionObject(null);
    setPublicationYear("");
    setStartYear("");
    setEndYear("");
    setPublicationType("");
    setResults([]);
    setError(null);
  };

  // Separate function for auto-search with URL parameters
  const performAutoSearchWithParams = async (searchParam, yearParam, institutionIdParam, page = 1) => {
    console.log('performAutoSearchWithParams called with:', { searchParam, yearParam, institutionIdParam, page });
    
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
        // Format: title_and_abstract.search:keyword (spaces become + in URL)
        filters.push(`title_and_abstract.search:${keyword}`);
      }
      
      // Use year parameter directly from URL
      if (yearParam && yearParam.trim()) {
        filters.push(`publication_year:${yearParam.trim()}`);
      }
      
      // Use institution parameter directly from URL
      if (institutionIdParam && institutionIdParam.trim()) {
        filters.push(`authorships.institutions.id:I${institutionIdParam.trim()}`);
      }
      
      const filterString = filters.join(',');
      const params = new URLSearchParams();
      if (filterString) params.append('filter', filterString);
      params.append('per_page', resultsPerPage.toString());
      params.append('page', page.toString());
      params.append('sort', 'cited_by_count:desc');
      
      const finalUrl = `${OPENALEX_API_BASE}/works?${params.toString()}`;
      console.log('Auto-search URL:', finalUrl);
      console.log('Search filters:', filters);
      console.log('URL matches format: https://openalex.org/works?page=X&filter=...&sort=cited_by_count:desc');
      
      // Track API call for disclaimer
      setApiCalls([finalUrl]);
      
      const url = `${OPENALEX_API_BASE}/works?${params.toString()}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch search results');
      const data = await response.json();
      
      setResults(data.results || []);
      setTotalResults(data.meta?.count || 0);
      setTotalPages(Math.ceil((data.meta?.count || 0) / resultsPerPage));
      setCurrentPage(page);
    } catch (e) {
      setError(e.message || 'Failed to fetch search results');
    } finally {
      setLoading(false);
    }
  };

  // Fetch institution details by ID
  const fetchInstitutionById = async (institutionId) => {
    try {
      const response = await fetch(`${OPENALEX_API_BASE}/institutions/I${institutionId}`);
      if (response.ok) {
        const institutionData = await response.json();
        setInstitution(institutionData.display_name);
        setInstitutionObject({
          id: institutionData.id,
          display_name: institutionData.display_name
        });
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
    if (author.trim()) inputs.push({ category: 'Author', value: author.trim() });
    if (institutionObject && institutionObject.display_name) inputs.push({ category: 'Institution', value: institutionObject.display_name });
    if (publicationType.trim()) inputs.push({ category: 'Publication Type', value: publicationType.trim() });
    if (publicationYear.trim()) inputs.push({ category: 'Publication Year', value: publicationYear.trim() });
    if (startYear.trim() && endYear.trim()) inputs.push({ category: 'Year Range', value: `${startYear.trim()}-${endYear.trim()}` });
    if (selectedJournal && selectedJournal.display_name) inputs.push({ category: 'Journal', value: selectedJournal.display_name });
    setUserInputs(inputs);
    
    try {
      const filters = [];
      if (searchKeyword.trim()) {
        const keyword = searchKeyword.trim();
        // Format: title_and_abstract.search:keyword (OpenAlex handles multi-word automatically)
        filters.push(`title_and_abstract.search:${keyword}`);
      }
      if (author.trim()) {
        filters.push(`raw_author_name.search:${author.trim()}`);
      }
      if (institutionObject && institutionObject.id) {
        // Use the institution object if available (from URL params)
        const instId = institutionObject.id.split('/').pop();
        filters.push(`authorships.institutions.id:I${instId}`);
      } else if (institution.trim()) {
        // Fetch institution ID from OpenAlex for manual searches
        try {
          const instRes = await fetch(`${OPENALEX_API_BASE}/institutions?search=${encodeURIComponent(institution.trim())}`);
          const instData = await instRes.json();
          if (instData.results && instData.results.length > 0) {
            const instId = instData.results[0].id.split('/').pop();
            filters.push(`authorships.institutions.id:I${instId}`);
          }
        } catch (err) {
          // If lookup fails, skip institution filter
        }
      }
      if (publicationType.trim()) {
        filters.push(`type:${publicationType.trim()}`);
      }
      if (publicationYear.trim()) {
        filters.push(`publication_year:${publicationYear.trim()}`);
      }
      if (startYear.trim() && endYear.trim()) {
        filters.push(`publication_year:${startYear.trim()}-${endYear.trim()}`);
      }
      if (selectedJournal && selectedJournal.id) {
        const sourceId = selectedJournal.id.split('/').pop();
        filters.push(`primary_location.source.id:${sourceId}`);
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
      
      setResults(data.results || []);
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
      
      if (searchParam || yearParam || institutionIdParam) {
        // Use auto-search with parameters
        performAutoSearchWithParams(searchParam, yearParam, institutionIdParam, newPage);
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
      <div style={{ background: '#1a1a1a', minHeight: '100vh', paddingBottom: 40 }} className={darkMode ? 'dark' : ''}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem 1rem' }}>
          <SearchHeader darkMode={darkMode} />
          <SearchForm
            searchKeyword={searchKeyword}
            setSearchKeyword={setSearchKeyword}
            author={author}
            setAuthor={setAuthor}
            institution={institution}
            setInstitution={setInstitution}
            onSearch={handleSearch}
            onOpenAdvancedFilters={() => setShowAdvanced(true)}
            loading={loading}
            darkMode={darkMode}
          />

          {/* Additional Filters Section */}
          <div style={{ 
            background: '#2a2a2a', 
            borderRadius: 16, 
            boxShadow: '0 4px 24px rgba(0,0,0,0.3)', 
            padding: 24, 
            maxWidth: 900, 
            margin: '0 auto 2rem auto',
            border: '1px solid #404040'
          }}>
            <h3 style={{ 
              color: '#fff', 
              marginBottom: 16, 
              fontSize: 18, 
              fontWeight: 600 
            }}>
              Additional Filters
            </h3>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 200 }}>
                <label style={{ 
                  fontWeight: 600, 
                  marginBottom: 8, 
                  display: 'block', 
                  color: '#fff' 
                }}>
                  Institution (Advanced)
                </label>
                <DropdownTrigger
                  value={institutionObject ? institutionObject.display_name : ''}
                  placeholder="Click to search institutions..."
                  onClick={() => {
                    setShowInstitutionModal(true);
                    clearInstitutionSuggestions();
                  }}
                  darkMode={darkMode}
                />
              </div>
              <div style={{ flex: 1, minWidth: 200 }}>
                <label style={{ 
                  fontWeight: 600, 
                  marginBottom: 8, 
                  display: 'block', 
                  color: '#fff' 
                }}>
                  Journal Filter
                </label>
                <DropdownTrigger
                  value={journalInput}
                  placeholder="Click to search journals..."
                  onClick={() => {
                    setShowJournalModal(true);
                    clearJournalSuggestions();
                  }}
                  darkMode={darkMode}
                />
              </div>
            </div>
          </div>
          <AdvancedFiltersDrawer
            open={showAdvanced}
            onClose={() => setShowAdvanced(false)}
            publicationYear={publicationYear}
            setPublicationYear={setPublicationYear}
            startYear={startYear}
            setStartYear={setStartYear}
            endYear={endYear}
            setEndYear={setEndYear}
            publicationType={publicationType}
            setPublicationType={setPublicationType}
            onApply={handleApplyAdvanced}
            darkMode={darkMode}
          />
          {/* Disclaimer Box */}
          <ApiCallInfoBox 
            userInputs={userInputs} 
            apiCalls={apiCalls} 
            darkMode={darkMode} 
          />
          
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

          {/* Institution Modal Dropdown */}
          <ModalDropdown
            isOpen={showInstitutionModal}
            onClose={() => setShowInstitutionModal(false)}
            title="Select Institution"
            placeholder="Type to search institutions..."
            onSearchChange={searchInstitutions}
            suggestions={institutionSuggestions}
            onSelect={(institution) => {
              setInstitutionObject(institution);
              setInstitution(institution.display_name);
            }}
            darkMode={darkMode}
            loading={institutionLoading}
          />

          {/* Journal Modal Dropdown */}
          <ModalDropdown
            isOpen={showJournalModal}
            onClose={() => setShowJournalModal(false)}
            title="Select Journal"
            placeholder="Type to search journals..."
            onSearchChange={searchJournals}
            suggestions={journalSuggestions}
            onSelect={(journal) => {
              setSelectedJournal(journal);
              setJournalInput(journal.display_name);
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
