import React, { useState } from "react";
import styles from "../assets/styles/search.module.css";

export const SearchDark = () => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [institution, setInstitution] = useState("");
  const [yearFrom, setYearFrom] = useState("");
  const [yearTo, setYearTo] = useState("");
  const [author, setAuthor] = useState("");
  const [funding, setFunding] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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
        filters.push(`title_and_abstract.search:${searchKeyword.trim()}`);
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
    <div className={styles.searchPageDark}>
      <div className={styles.searchContainer}>
        <div className={styles.searchResults}>
          {/* Search page content will go here */}
        </div>
      </div>
    </div>
  );
}; 