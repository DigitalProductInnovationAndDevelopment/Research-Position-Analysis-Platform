import React from "react";
import topResearchFunding from "../../assets/images/topResearchFunding.png";
import topCollaborationProjectsGpt1 from "../../assets/images/top_collaboration_projects_gpt 1.png";
import topResearchPartnerListGpt1 from "../../assets/images/top_research_partner_list_gpt 1.png";
import styles from "../../assets/styles/search.module.css";
import PageLayout from "../../components/shared/PageLayout/PageLayout";

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

  const words = [];
  // Find the maximum index to determine the size of the array
  let maxIndex = 0;
  for (const word in invertedIndex) {
    invertedIndex[word].forEach(index => {
      if (index > maxIndex) maxIndex = index;
    });
  }

  // Initialize an array with nulls to hold words in correct positions
  const abstractArray = new Array(maxIndex + 1).fill(null);

  // Place words into their correct positions
  for (const word in invertedIndex) {
    invertedIndex[word].forEach(index => {
      abstractArray[index] = word;
    });
  }

  // Filter out nulls and join into a sentence
  return abstractArray.filter(word => word !== null).join(" ");
};

export const SearchPageLight = ({ darkMode, toggleDarkMode }) => {
  const [searchKeyword, setSearchKeyword] = React.useState("");
  const [institution, setInstitution] = React.useState("");
  const [yearFrom, setYearFrom] = React.useState("");
  const [yearTo, setYearTo] = React.useState("");
  const [author, setAuthor] = React.useState("");
  const [funding, setFunding] = React.useState("");

  const [searchResults, setSearchResults] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [expandedAbstracts, setExpandedAbstracts] = React.useState({});

  const toggleAbstractExpansion = (resultId) => {
    setExpandedAbstracts(prev => ({
      ...prev,
      [resultId]: !prev[resultId]
    }));
  };

  const handleSearch = async () => {
    setError(null);
    setIsLoading(true);
    setSearchResults([]);

    // Basic validation for at least one input
    if (
      !searchKeyword.trim() &&
      !institution.trim() &&
      !yearFrom.trim() &&
      !yearTo.trim() &&
      !author.trim() &&
      !funding.trim()
    ) {
      setError("Please enter at least one search criterion.");
      setIsLoading(false);
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

      // Add year filter
      if (yearFrom.trim() || yearTo.trim()) {
        if (yearFrom.trim() && yearTo.trim()) {
          filters.push(`publication_year:${yearFrom.trim()}+-+${yearTo.trim()}`);
        } else if (yearFrom.trim()) {
          filters.push(`publication_year:${yearFrom.trim()}`);
        }
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
          setIsLoading(false);
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

      // Add all filters as a single parameter
      if (filters.length > 0) {
        const filterString = filters.join(',');
        console.log('Filter string:', filterString); // Debug log
        params.append("filter", filterString);
      }

      // Add other parameters
      params.append("page", "1");
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
      setSearchResults(data.results || []);
    } catch (e) {
      setError("Failed to fetch search results. Please try again. Error: " + e.message);
      console.error("Search fetch error:", e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageLayout darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
      <div className={styles.mainContent}>
        <div className={styles.searchPageContent}>
          <h1 className={styles.filterCriteriaTitle}>Filter Criteria</h1>
          <div className={styles.filterSection}>
            <div className={styles.searchCriterium}>
              <div className={styles.label}>
                <div className={styles.criterium}>Search Keyword</div>
              </div>
              <div className={styles.input}>
                <input
                  className={styles.hereIsSpaceFor}
                  placeholder="Enter keywords for research papers..."
                  type="text"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleSearch();
                    }
                  }}
                />
              </div>
            </div>

            <div className={styles.searchCriterium}>
              <div className={styles.label}>
                <div className={styles.criterium}>Institution</div>
              </div>
              <div className={styles.input}>
                <input
                  className={styles.hereIsSpaceFor}
                  placeholder="Enter institution name..."
                  type="text"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleSearch();
                    }
                  }}
                />
              </div>
            </div>

            <div className={styles.searchCriterium}>
              <div className={styles.divWrapper}>
                <div className={styles.textWrapper3}>Year From</div>
              </div>
              <div className={styles.hereIsSpaceForWrapper}>
                <input
                  className={styles.hereIsSpaceFor2}
                  placeholder="e.g., 2000"
                  type="text"
                  value={yearFrom}
                  onChange={(e) => setYearFrom(e.target.value.replace(/[^0-9]/g, ''))} // Only allow digits
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleSearch();
                    }
                  }}
                />
              </div>
            </div>

            <div className={styles.searchCriterium}>
              <div className={styles.divWrapper}>
                <div className={styles.textWrapper3}>Year To</div>
              </div>
              <div className={styles.hereIsSpaceForWrapper}>
                <input
                  className={styles.hereIsSpaceFor2}
                  placeholder="e.g., 2023"
                  type="text"
                  value={yearTo}
                  onChange={(e) => setYearTo(e.target.value.replace(/[^0-9]/g, ''))} // Only allow digits
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleSearch();
                    }
                  }}
                />
              </div>
            </div>

            <div className={styles.searchCriterium}>
              <div className={styles.divWrapper}>
                <div className={styles.textWrapper3}>Author</div>
              </div>
              <div className={styles.hereIsSpaceForWrapper}>
                <input
                  className={styles.hereIsSpaceFor2}
                  placeholder="Enter author name..."
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleSearch();
                    }
                  }}
                />
              </div>
            </div>

            <div className={styles.searchCriterium}>
              <div className={styles.divWrapper}>
                <div className={styles.textWrapper3}>Funding</div>
              </div>
              <div className={styles.hereIsSpaceForWrapper}>
                <input
                  className={styles.hereIsSpaceFor2}
                  placeholder="Enter funding organization..."
                  type="text"
                  value={funding}
                  onChange={(e) => setFunding(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleSearch();
                    }
                  }}
                />
              </div>
            </div>

            <div className={styles.searchButtonContainer}>
              <button onClick={handleSearch} disabled={isLoading} className={styles.searchButton}>
                {isLoading ? "Searching..." : "Search"}
              </button>
            </div>

          </div>

          {error && <div className={styles.errorMessage}>{error}</div>}
          {isLoading && (
            <div className={styles.loadingContainer}>
              <div className={styles.spinner}></div>
              <div className={styles.loadingMessage}>Loading search results...</div>
            </div>
          )}

          {searchResults.length > 0 && (
            <div className={styles.searchResultsSection}>
              <h2 className={styles.searchResultsTitle}>Research Paper Results</h2>
              <div className={styles.resultsList}>
                {searchResults.map((result, index) => (
                  <div
                    key={index}
                    className={`${styles.searchResultItem} ${isSiemensPaper(result) ? styles.siemensPaper : ''}`}
                  >
                    <h3>{result.display_name || result.title || "No Title"}</h3>
                    <p>Authors: {result.authorships ? result.authorships.map(a => a.author.display_name).join(", ") : "N/A"}</p>
                    <p>Year: {result.publication_year || "N/A"}</p>
                    <p>Institutions: {result.authorships && result.authorships.length > 0
                      ? Array.from(new Set(result.authorships.flatMap(a => a.institutions || []).map(inst => inst.display_name))).join(", ")
                      : "N/A"}</p>
                    <p className={styles.citationCount}>Cited by: {result.cited_by_count || 0}</p>
                    {result.abstract_inverted_index && (
                      <div className={styles.abstractContainer}>
                        <p className={styles.abstractText}>
                          {expandedAbstracts[result.id] ?
                            reconstructAbstract(result.abstract_inverted_index) :
                            getFirstSentence(reconstructAbstract(result.abstract_inverted_index))
                          }
                        </p>
                        {reconstructAbstract(result.abstract_inverted_index).length > getFirstSentence(reconstructAbstract(result.abstract_inverted_index)).length && !expandedAbstracts[result.id] && (
                          <span
                            className={styles.expandAbstractButton}
                            onClick={() => toggleAbstractExpansion(result.id)}
                            title="Expand Abstract"
                          >
                            <div className={styles.expandIconBox}>▼</div>
                          </span>
                        )}
                        {expandedAbstracts[result.id] && (
                          <span
                            className={styles.collapseAbstractButton}
                            onClick={() => toggleAbstractExpansion(result.id)}
                            title="Collapse Abstract"
                          >
                            Collapse [ - ]
                          </span>
                        )}
                      </div>
                    )}
                    {result.id && <p><a href={result.id} target="_blank" rel="noopener noreferrer">View on OpenAlex</a></p>}
                    {result.primary_location?.landing_page_url && <p><a href={result.primary_location.landing_page_url} target="_blank" rel="noopener noreferrer">Read More (Publisher)</a></p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className={styles.resultList}>
            <div className={styles.imageBox}>
              <h2 className={styles.imageBoxTitle}>SIEMENS' TOP COLLABORATION PROJECTS</h2>
              <div className={styles.imageContent}>
                <img className={styles.chartImage} alt="Top Collaboration Projects" src={topCollaborationProjectsGpt1} />
              </div>
            </div>

            <div className={styles.imageBox}>
              <h2 className={styles.imageBoxTitle}>SIEMENS' TOP RESEARCH PARTNERS</h2>
              <div className={styles.imageContent}>
                <img className={styles.chartImage} alt="Top Research Partner List" src={topResearchPartnerListGpt1} />
              </div>
            </div>

            <div className={styles.imageBox}>
              <h2 className={styles.imageBoxTitle}>Top Funded Research Themes</h2>
              <div className={styles.imageContent}>
                <img className={styles.chartImage} alt="Top Research Funding" src={topResearchFunding} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};
