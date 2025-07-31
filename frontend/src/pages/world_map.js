import React, { useState } from "react";
import TopBar from "../components/shared/TopBar";
import SearchHeader from "../components/shared/SearchHeader";
import SearchForm from "../components/shared/SearchForm";
import AdvancedFiltersDrawer from "../components/shared/AdvancedFiltersDrawer";
import WorldMapPapers from "../components/shared/WorldMapPapers/WorldMapPapers";
import ModalDropdown from "../components/shared/ModalDropdown";
import MultiSelectModalDropdown from "../components/shared/MultiSelectModalDropdown/MultiSelectModalDropdown";
import useDropdownSearch from "../hooks/useDropdownSearch";
import ApiCallInfoBox from "../components/shared/ApiCallInfoBox";
import Particles from "../components/animated/SearchBackground/Particles";

// TODO: explain how page works (how many results are shown in total, how many per country etc.)

const WorldMapPapersPage = () => {
  // Main search/filter state
  const [searchKeyword, setSearchKeyword] = useState("");
  const [author, setAuthor] = useState("");
  const [authorObject, setAuthorObject] = useState(null);
  const [institution, setInstitution] = useState("");
  const [institutionObject, setInstitutionObject] = useState(null);
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

  // Function to clear all search fields
  const clearAllFields = () => {
    setSearchKeyword("");
    setAuthor("");
    setAuthorObject(null);
    setInstitution("");
    setInstitutionObject(null);
    setPublicationYear("");
    setStartYear("");
    setEndYear("");
    setSelectedPublicationTypes([]);
    setSelectedJournals([]);
    setError(null);
  };

  // Search handler
  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    
    // Track user inputs for disclaimer
    const inputs = [];
    if (searchKeyword.trim()) inputs.push({ category: 'Keywords', value: searchKeyword.trim() });
    if (authorObject && authorObject.display_name) inputs.push({ category: 'Author', value: authorObject.display_name });
    if (institutionObject && institutionObject.display_name) inputs.push({ category: 'Institution', value: institutionObject.display_name });
    if (selectedPublicationTypes.length > 0) inputs.push({ category: 'Publication Types', value: selectedPublicationTypes.map(pt => pt.display_name).join(', ') });
    if (publicationYear.trim()) inputs.push({ category: 'Publication Year', value: publicationYear.trim() });
    if (startYear.trim() && endYear.trim()) inputs.push({ category: 'Year Range', value: `${startYear.trim()}-${endYear.trim()}` });
    if (selectedJournals.length > 0) inputs.push({ category: 'Journals', value: selectedJournals.map(j => j.display_name).join(', ') });
    setUserInputs(inputs);
    
    try {
      const filters = [];
      if (searchKeyword.trim()) {
        const keyword = searchKeyword.trim();
        filters.push(`title_and_abstract.search:${keyword}`);
      }
      if (authorObject && authorObject.id) {
        const authorId = authorObject.id.split('/').pop();
        filters.push(`authorships.author.id:A${authorId}`);
      }
      if (institutionObject && institutionObject.id) {
        const instId = institutionObject.id.split('/').pop();
        filters.push(`authorships.institutions.id:I${instId}`);
      }
      if (selectedPublicationTypes.length > 0) {
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
        const journalFilters = selectedJournals.map(journal => {
          const sourceId = journal.id.split('/').pop();
          return `primary_location.source.id:${sourceId}`;
        });
        filters.push(journalFilters.join('|'));
      }
      
      const filterString = filters.join(',');
      const params = new URLSearchParams();
      if (filterString) params.append('filter', filterString);
      params.append('per_page', 200); // Get more results for world map
      params.append('sort', 'cited_by_count:desc');
      
      const url = `https://api.openalex.org/works?${params.toString()}`;
      
      // Track API call for disclaimer
      setApiCalls([url]);
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch search results');
      const data = await response.json();
      
      // Pass the search results to WorldMapPapers component
      // You might need to update the WorldMapPapers component to accept these results
      
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
      <div style={{ background: '#000', minHeight: '100vh', paddingBottom: 40 }}>
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
                darkMode={true} 
                title="Global Research Impact Localization"
                subtitle="Find research clusters around the world"
              />
              <SearchForm
                searchKeyword={searchKeyword}
                setSearchKeyword={setSearchKeyword}
                author={author}
                institution={institution}
                onSearch={handleSearch}
                onOpenAdvancedFilters={() => setShowAdvanced(true)}
                onAuthorClick={() => {
                  setShowAuthorModal(true);
                  clearAuthorSuggestions();
                }}
                onInstitutionClick={() => {
                  setShowInstitutionModal(true);
                  clearInstitutionSuggestions();
                }}
                loading={loading}
                darkMode={true}
                description="Enter keywords and apply filters to locate research clusters"
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
                darkMode={true}
              />
              {/* Disclaimer Box */}
              <ApiCallInfoBox 
                userInputs={userInputs} 
                apiCalls={apiCalls} 
                darkMode={true} 
              />
            </div>
          </div>
        </div>
        
        {/* World Map - outside the background area */}
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1rem' }}>
          <WorldMapPapers 
            searchQuery={searchKeyword}
            authorObject={authorObject}
            institutionObject={institutionObject}
            selectedPublicationTypes={selectedPublicationTypes}
            selectedJournals={selectedJournals}
            publicationYear={publicationYear}
            startYear={startYear}
            endYear={endYear}
          />

          {/* Author Modal Dropdown */}
          <ModalDropdown
            isOpen={showAuthorModal}
            onClose={() => setShowAuthorModal(false)}
            title="Select Author"
            placeholder="Type to search authors..."
            onSearchChange={searchAuthors}
            suggestions={authorSuggestions}
            onSelect={(author) => {
              setAuthorObject(author);
              setAuthor(author.display_name);
            }}
            darkMode={true}
            loading={authorLoading}
          />

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
            darkMode={true}
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
            darkMode={true}
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
            darkMode={true}
            loading={journalLoading}
          />
        </div>
      </div>
    </>
  );
};

export default WorldMapPapersPage; 