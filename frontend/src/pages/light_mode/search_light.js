import React, { useState } from 'react';
import TopBar from '../../components/shared/TopBar';
import SearchHeader from '../../components/shared/SearchHeader';
import SearchForm from '../../components/shared/SearchForm';
import AdvancedFiltersDrawer from '../../components/shared/AdvancedFiltersDrawer';
import SearchResultsList from '../../components/shared/SearchResultsList';

const OPENALEX_API_BASE = 'https://api.openalex.org';

const SearchPageLight = () => {
  // Main search/filter state
  const [searchKeyword, setSearchKeyword] = useState("");
  const [author, setAuthor] = useState("");
  const [institution, setInstitution] = useState("");
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

  // Search handler
  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    setResults([]);
    try {
      const filters = [];
      if (searchKeyword.trim()) {
        const keyword = searchKeyword.trim();
        // Quote if multi-word
        const encodedKeyword = keyword.includes(' ') ? `"${keyword}"` : keyword;
        filters.push(`title_and_abstract.search:${encodedKeyword}`);
      }
      if (author.trim()) {
        filters.push(`raw_author_name.search:${author.trim()}`);
      }
      if (institution.trim()) {
        // Fetch institution ID from OpenAlex
        try {
          const instRes = await fetch(`${OPENALEX_API_BASE}/institutions?search=${encodeURIComponent(institution.trim())}`);
          const instData = await instRes.json();
          if (instData.results && instData.results.length > 0) {
            const instId = instData.results[0].id.split('/').pop();
            filters.push(`institutions.id:${instId}`);
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
      const filterString = filters.join(',');
      const params = new URLSearchParams();
      if (filterString) params.append('filter', filterString);
      // Add pagination/sort if needed
      const url = `${OPENALEX_API_BASE}/works?${params.toString()}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch search results');
      const data = await response.json();
      setResults(data.results || []);
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

  return (
    <>
      <TopBar />
      <div style={{ background: '#f5f6fa', minHeight: '100vh', paddingBottom: 40 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem 1rem' }}>
          <SearchHeader />
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
            publicationType={publicationType}
            setPublicationType={setPublicationType}
            onApply={handleApplyAdvanced}
          />
          <SearchResultsList results={results} loading={loading} error={error} />
        </div>
      </div>
    </>
  );
};

export default SearchPageLight;
