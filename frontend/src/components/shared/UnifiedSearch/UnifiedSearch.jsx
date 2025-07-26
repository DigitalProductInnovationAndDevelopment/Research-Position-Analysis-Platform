import React, { useState, useEffect, useRef } from 'react';
import Autocomplete from '../Autocomplete/Autocomplete';
import styles from './UnifiedSearch.module.css';

const UnifiedSearch = ({
  // Search state
  searchKeyword = '',
  setSearchKeyword,
  author = '',
  setAuthor,
  institution = '',
  setInstitution,
  funding = '',
  setFunding,
  topic = '',
  setTopic,
  publicationYear = '',
  setPublicationYear,
  startYear = '',
  setStartYear,
  endYear = '',
  setEndYear,
  isOpenAccess = false,
  setIsOpenAccess,
  publicationType = '',
  setPublicationType,
  
  // UI state
  loading = false,
  onSearch,
  onAdvancedFiltersToggle,
  showAdvancedFilters = false,
  
  // Configuration
  title = 'Search Publications',
  description = 'Enter keywords and apply filters to find relevant research',
  placeholder = 'Enter keywords...',
  showAdvancedButton = true,
  compact = false,
  variant = 'default', // 'default', 'minimal', 'worldmap', 'graph'
  
  // Animation
  enableAnimation = true,
  animationText = 'Discover research insights...'
}) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const animationRef = useRef(null);

  // Typewriter animation effect
  useEffect(() => {
    if (!enableAnimation) return;

    const typewriterEffect = () => {
      if (currentIndex < animationText.length) {
        setDisplayText(prev => prev + animationText[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      } else {
        setIsTyping(false);
        // Reset after a delay
        setTimeout(() => {
          setDisplayText('');
          setCurrentIndex(0);
          setIsTyping(true);
        }, 3000);
      }
    };

    animationRef.current = setTimeout(typewriterEffect, 100);
    return () => clearTimeout(animationRef.current);
  }, [currentIndex, animationText, enableAnimation]);

  const handleSearch = () => {
    if (onSearch) {
      onSearch();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'minimal':
        return {
          container: styles.minimalContainer,
          title: styles.minimalTitle,
          description: styles.minimalDescription,
          form: styles.minimalForm
        };
      case 'worldmap':
        return {
          container: styles.worldmapContainer,
          title: styles.worldmapTitle,
          description: styles.worldmapDescription,
          form: styles.worldmapForm
        };
      case 'graph':
        return {
          container: styles.graphContainer,
          title: styles.graphTitle,
          description: styles.graphDescription,
          form: styles.graphForm
        };
      default:
        return {
          container: styles.defaultContainer,
          title: styles.defaultTitle,
          description: styles.defaultDescription,
          form: styles.defaultForm
        };
    }
  };

  const variantStyles = getVariantStyles();

  if (compact) {
    return (
      <div className={`${styles.compactContainer} ${variantStyles.container}`}>
        <div className={styles.compactSearchBox}>
          <input
            type="text"
            placeholder={placeholder}
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onKeyPress={handleKeyPress}
            className={styles.compactInput}
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className={styles.compactSearchButton}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.container} ${variantStyles.container}`}>
      <div className={styles.header}>
        <h1 className={`${styles.title} ${variantStyles.title}`}>
          {enableAnimation && isTyping ? (
            <span className={styles.animatedText}>
              {displayText}
              <span className={styles.cursor}>|</span>
            </span>
          ) : (
            title
          )}
        </h1>
        <p className={`${styles.description} ${variantStyles.description}`}>
          {description}
        </p>
      </div>

      <div className={`${styles.form} ${variantStyles.form}`}>
        <div className={styles.mainSearch}>
          <div className={styles.keywordSection}>
            <label className={styles.label}>
              <span className={styles.icon}>🔍</span>
              Keywords
            </label>
            <input
              type="text"
              placeholder={placeholder}
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onKeyPress={handleKeyPress}
              className={styles.keywordInput}
            />
          </div>

          <div className={styles.filtersRow}>
            <div className={styles.filterGroup}>
              <label className={styles.subLabel}>
                <span className={styles.icon}>👤</span>
                Author
              </label>
              <Autocomplete
                value={author}
                onValueChange={setAuthor}
                placeholder="Type author name"
                type="author"
                inputStyle={styles.autocompleteInput}
              />
            </div>

            <div className={styles.filterGroup}>
              <label className={styles.subLabel}>
                <span className={styles.icon}>🏛️</span>
                Institution
              </label>
              <Autocomplete
                value={institution}
                onValueChange={setInstitution}
                placeholder="Type institution name"
                type="institution"
                inputStyle={styles.autocompleteInput}
              />
            </div>
          </div>

          {showAdvancedFilters && (
            <div className={styles.advancedFilters}>
              <div className={styles.advancedRow}>
                <div className={styles.filterGroup}>
                  <label className={styles.subLabel}>
                    <span className={styles.icon}>💰</span>
                    Funding
                  </label>
                  <Autocomplete
                    value={funding}
                    onValueChange={setFunding}
                    placeholder="Type funding source"
                    type="funding"
                    inputStyle={styles.autocompleteInput}
                  />
                </div>

                <div className={styles.filterGroup}>
                  <label className={styles.subLabel}>
                    <span className={styles.icon}>📚</span>
                    Topic
                  </label>
                  <Autocomplete
                    value={topic}
                    onValueChange={setTopic}
                    placeholder="Type research topic"
                    type="topic"
                    inputStyle={styles.autocompleteInput}
                  />
                </div>
              </div>

              <div className={styles.advancedRow}>
                <div className={styles.filterGroup}>
                  <label className={styles.subLabel}>
                    <span className={styles.icon}>📅</span>
                    Publication Year
                  </label>
                  <input
                    type="number"
                    placeholder="e.g., 2023"
                    value={publicationYear}
                    onChange={(e) => setPublicationYear(e.target.value)}
                    className={styles.yearInput}
                  />
                </div>

                <div className={styles.filterGroup}>
                  <label className={styles.subLabel}>
                    <span className={styles.icon}>📊</span>
                    Year Range
                  </label>
                  <div className={styles.yearRange}>
                    <input
                      type="number"
                      placeholder="From"
                      value={startYear}
                      onChange={(e) => setStartYear(e.target.value)}
                      className={styles.yearRangeInput}
                    />
                    <span className={styles.yearRangeSeparator}>-</span>
                    <input
                      type="number"
                      placeholder="To"
                      value={endYear}
                      onChange={(e) => setEndYear(e.target.value)}
                      className={styles.yearRangeInput}
                    />
                  </div>
                </div>
              </div>

              <div className={styles.advancedRow}>
                <div className={styles.filterGroup}>
                  <label className={styles.subLabel}>
                    <span className={styles.icon}>📄</span>
                    Publication Type
                  </label>
                  <select
                    value={publicationType}
                    onChange={(e) => setPublicationType(e.target.value)}
                    className={styles.selectInput}
                  >
                    <option value="">All types</option>
                    <option value="journal-article">Journal Article</option>
                    <option value="conference">Conference</option>
                    <option value="book">Book</option>
                    <option value="book-chapter">Book Chapter</option>
                    <option value="dataset">Dataset</option>
                  </select>
                </div>

                <div className={styles.filterGroup}>
                  <label className={styles.subLabel}>
                    <span className={styles.icon}>🔓</span>
                    Open Access
                  </label>
                  <div className={styles.checkboxContainer}>
                    <input
                      type="checkbox"
                      checked={isOpenAccess}
                      onChange={(e) => setIsOpenAccess(e.target.checked)}
                      className={styles.checkbox}
                    />
                    <span className={styles.checkboxLabel}>Open Access only</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className={styles.actions}>
          <button
            onClick={handleSearch}
            disabled={loading}
            className={styles.searchButton}
          >
            {loading ? (
              <>
                <span className={styles.spinner}></span>
                Searching...
              </>
            ) : (
              'Search'
            )}
          </button>
          
          {showAdvancedButton && (
            <button
              onClick={onAdvancedFiltersToggle}
              className={styles.advancedButton}
            >
              {showAdvancedFilters ? 'Hide Advanced' : 'Advanced Filters'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UnifiedSearch; 