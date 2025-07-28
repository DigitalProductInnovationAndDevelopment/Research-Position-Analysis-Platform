import { useState, useEffect } from 'react';

const useDropdownSearch = (apiEndpoint, minSearchLength = 2) => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchItems = async (searchTerm) => {
    if (!searchTerm || searchTerm.length < minSearchLength) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(apiEndpoint.replace('{query}', encodeURIComponent(searchTerm)));
      if (!response.ok) {
        throw new Error('Failed to fetch suggestions');
      }
      const data = await response.json();
      setSuggestions(data.results || []);
    } catch (err) {
      setError(err.message);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const clearSuggestions = () => {
    setSuggestions([]);
    setError(null);
  };

  return {
    suggestions,
    loading,
    error,
    searchItems,
    clearSuggestions
  };
};

export default useDropdownSearch; 