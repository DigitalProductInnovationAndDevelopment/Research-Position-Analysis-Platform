import React, { useState, useEffect } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
  Marker
} from 'react-simple-maps';
import ResearchLeadershipAnalysis from '../ResearchLeadershipAnalysis/ResearchLeadershipAnalysis';
import styles from './WorldMapPapers.module.css';

// Helper: country name to coordinates (centroids)
const countryCentroids = {
  // North America
  US: [-95.7129, 37.0902],    // United States
  CA: [-106.3468, 56.1304],   // Canada
  MX: [-102.5528, 23.6345],   // Mexico
  
  // Europe
  GB: [-0.1278, 51.5074],     // United Kingdom
  DE: [10.4515, 51.1657],     // Germany
  FR: [2.2137, 46.6034],      // France
  IT: [12.5674, 41.8719],     // Italy
  ES: [-3.7492, 40.4637],     // Spain
  NL: [5.2913, 52.1326],      // Netherlands
  SE: [18.6435, 60.1282],     // Sweden
  CH: [8.2275, 46.8182],      // Switzerland
  BE: [4.4699, 50.5039],      // Belgium
  PL: [19.1451, 51.9194],     // Poland
  AT: [14.5501, 47.5162],     // Austria
  IE: [-8.2439, 53.4129],     // Ireland
  PT: [-8.2245, 39.3999],     // Portugal
  GR: [21.8243, 39.0742],     // Greece
  HU: [19.5033, 47.1625],     // Hungary
  CZ: [15.4729, 49.8175],     // Czech Republic
  RO: [24.9668, 45.9432],     // Romania
  UA: [31.1656, 48.3794],     // Ukraine
  NO: [8.4689, 60.4720],      // Norway
  DK: [9.5018, 56.2639],      // Denmark
  FI: [25.7482, 61.9241],     // Finland
  BG: [25.4858, 42.7339],     // Bulgaria
  HR: [15.2, 45.1],           // Croatia
  RS: [21.0059, 44.0165],     // Serbia
  SK: [19.6990, 48.6690],     // Slovakia
  SI: [14.9955, 46.0569],     // Slovenia
  LT: [23.8813, 55.1694],     // Lithuania
  LV: [24.6032, 56.8796],     // Latvia
  EE: [25.0136, 58.5953],     // Estonia
  LU: [6.1296, 49.8153],      // Luxembourg
  MT: [14.3754, 35.9375],     // Malta
  CY: [33.4297, 35.1264],     // Cyprus
  IS: [-18.1059, 64.9631],    // Iceland
  
  // Asia
  CN: [104.1954, 35.8617],    // China
  JP: [138.2529, 36.2048],    // Japan
  IN: [78.9629, 20.5937],     // India
  KR: [127.7669, 35.9078],    // South Korea
  TR: [35.2433, 38.9637],     // Turkey
  SG: [103.8198, 1.3521],     // Singapore
  IL: [34.8516, 31.0461],     // Israel
  SA: [45.0792, 23.8859],     // Saudi Arabia
  AE: [53.8478, 23.4241],     // United Arab Emirates
  TH: [100.9925, 15.8700],    // Thailand
  MY: [101.9758, 4.2105],     // Malaysia
  PH: [121.7740, 12.8797],    // Philippines
  VN: [108.2772, 14.0583],    // Vietnam
  TW: [121.5200, 23.5000],    // Taiwan
  ID: [113.9213, -0.7893],    // Indonesia
  PK: [69.3451, 30.3753],     // Pakistan
  BD: [90.3563, 23.6849],     // Bangladesh
  IR: [53.6880, 32.4279],     // Iran
  IQ: [43.6793, 33.2232],     // Iraq
  AF: [67.709953, 33.93911],  // Afghanistan
  NP: [84.1240, 28.3949],     // Nepal
  LK: [80.7718, 7.8731],      // Sri Lanka
  MM: [95.9560, 21.9162],     // Myanmar
  KH: [104.9910, 12.5657],    // Cambodia
  LA: [102.4955, 19.8563],    // Laos
  MN: [103.8467, 46.8625],    // Mongolia
  KZ: [66.9237, 48.0196],     // Kazakhstan
  UZ: [64.5853, 41.3775],     // Uzbekistan
  KG: [74.7661, 41.2044],     // Kyrgyzstan
  TJ: [71.2761, 38.8610],     // Tajikistan
  TM: [59.5563, 38.9697],     // Turkmenistan
  AZ: [47.5769, 40.1431],     // Azerbaijan
  GE: [43.3569, 42.3154],     // Georgia
  AM: [45.0382, 40.0691],     // Armenia
  JO: [36.2384, 30.5852],     // Jordan
  LB: [35.8623, 33.8547],     // Lebanon
  SY: [38.9968, 34.8021],     // Syria
  QA: [51.1839, 25.3548],     // Qatar
  OM: [55.9754, 21.5126],     // Oman
  YE: [48.5164, 15.5527],     // Yemen
  PS: [35.2332, 31.9522],     // Palestine
  BN: [114.7277, 4.5353],     // Brunei
  BT: [90.4336, 27.5142],     // Bhutan
  HK: [114.1694, 22.3193],    // Hong Kong
  MO: [113.5439, 22.1987],    // Macau
  
  // Oceania
  AU: [133.7751, -25.2744],   // Australia
  NZ: [174.8859, -40.9006],   // New Zealand
  FJ: [178.0650, -17.7134],   // Fiji
  PG: [143.9555, -6.3150],    // Papua New Guinea
  NC: [165.6180, -20.9043],   // New Caledonia
  VU: [166.9591, -15.3767],   // Vanuatu
  SB: [160.1564, -9.6457],    // Solomon Islands
  PF: [-149.4068, -17.6797],  // French Polynesia
  
  // Africa
  ZA: [22.9375, -30.5595],    // South Africa
  EG: [30.8025, 26.8206],     // Egypt
  NG: [8.6753, 9.0820],       // Nigeria
  KE: [37.9062, -0.0236],     // Kenya
  MA: [-7.0926, 31.7917],     // Morocco
  DZ: [1.6596, 28.0339],      // Algeria
  TN: [9.5375, 33.8869],      // Tunisia
  LY: [17.2283, 26.3351],     // Libya
  SD: [30.2176, 12.8628],     // Sudan
  ET: [40.4897, 9.1450],      // Ethiopia
  UG: [32.2903, 1.3733],      // Uganda
  TZ: [34.8888, -6.3690],     // Tanzania
  GH: [-1.0232, 7.9465],      // Ghana
  CI: [-5.5471, 7.5400],      // Ivory Coast
  SN: [-14.4524, 14.4974],    // Senegal
  ML: [-3.9962, 17.5707],     // Mali
  BF: [-1.5616, 12.2383],     // Burkina Faso
  NE: [8.0817, 17.6078],      // Niger
  TD: [18.7322, 15.4542],     // Chad
  CM: [12.3547, 7.3697],      // Cameroon
  CF: [20.9394, 6.6111],      // Central African Republic
  GA: [11.6094, -0.8037],     // Gabon
  CG: [15.8277, -0.2280],     // Republic of the Congo
  CD: [21.7587, -4.0383],     // Democratic Republic of the Congo
  AO: [17.8739, -11.2027],    // Angola
  ZM: [27.8493, -13.1339],    // Zambia
  ZW: [29.1549, -19.0154],    // Zimbabwe
  BW: [24.6849, -22.3285],    // Botswana
  NA: [17.2096, -22.9576],    // Namibia
  MZ: [35.5296, -18.6657],    // Mozambique
  MW: [34.3015, -13.2543],    // Malawi
  MG: [46.8691, -18.7669],    // Madagascar
  MU: [57.5522, -20.3484],    // Mauritius
  SC: [55.4915, -4.6796],     // Seychelles
  RW: [29.8739, -1.9403],     // Rwanda
  BI: [29.9189, -3.3731],     // Burundi
  DJ: [42.5903, 11.8251],     // Djibouti
  SO: [46.1996, 5.1521],      // Somalia
  ER: [39.7823, 15.1794],     // Eritrea
  SS: [30.9020, 6.8770],      // South Sudan
  GM: [-15.3101, 13.4432],    // Gambia
  GN: [-9.6966, 9.9456],      // Guinea
  GW: [-15.1804, 11.8037],    // Guinea-Bissau
  SL: [-11.7799, 8.4606],     // Sierra Leone
  LR: [-9.4295, 6.4281],      // Liberia
  TG: [0.8248, 8.6195],       // Togo
  BJ: [2.3158, 9.3077],       // Benin
  GW: [-15.1804, 11.8037],    // Guinea-Bissau
  CV: [-23.6052, 16.5388],    // Cape Verde
  ST: [6.6133, 0.1864],       // Sao Tome and Principe
  GQ: [10.2679, 1.6508],      // Equatorial Guinea
  
  // South America
  BR: [-51.9253, -14.2350],   // Brazil
  AR: [-63.6167, -38.4161],   // Argentina
  CL: [-71.5429, -35.6751],   // Chile
  CO: [-74.2973, 4.5709],     // Colombia
  PE: [-75.0152, -9.1899],    // Peru
  VE: [-66.5897, 6.4238],     // Venezuela
  EC: [-78.1834, -1.8312],    // Ecuador
  BO: [-63.5887, -16.2902],   // Bolivia
  PY: [-58.4438, -23.4425],   // Paraguay
  UY: [-55.7658, -32.5228],   // Uruguay
  GY: [-58.9302, 4.8604],     // Guyana
  SR: [-56.0278, 3.9193],     // Suriname
  GF: [-53.1258, 3.9339],     // French Guiana
  FK: [-59.5236, -51.7963],   // Falkland Islands
  
  // Central America & Caribbean
  GT: [-90.2308, 15.7835],    // Guatemala
  BZ: [-88.4976, 17.1899],    // Belize
  HN: [-86.2419, 15.1999],    // Honduras
  SV: [-88.8965, 13.7942],    // El Salvador
  NI: [-85.2072, 12.8654],    // Nicaragua
  CR: [-83.7534, 9.9281],     // Costa Rica
  PA: [-80.7821, 8.5380],     // Panama
  CU: [-77.7812, 21.5218],    // Cuba
  JM: [-77.2975, 18.1096],    // Jamaica
  HT: [-72.2852, 18.9712],    // Haiti
  DO: [-70.1627, 18.7357],    // Dominican Republic
  PR: [-66.5901, 18.2208],    // Puerto Rico
  TT: [-61.2225, 10.6598],    // Trinidad and Tobago
  BB: [-59.6132, 13.1939],    // Barbados
  GD: [-61.6790, 12.1165],    // Grenada
  LC: [-60.9789, 13.9094],    // Saint Lucia
  VC: [-61.2872, 12.9843],    // Saint Vincent and the Grenadines
  AG: [-61.7964, 17.0608],    // Antigua and Barbuda
  DM: [-61.3709, 15.4150],    // Dominica
  KN: [-62.7829, 17.3578],    // Saint Kitts and Nevis
  BS: [-77.3963, 25.0343],    // Bahamas
  
  // Other territories
  GL: [-42.6043, 71.7069],    // Greenland
  IS: [-18.1059, 64.9631],    // Iceland
  FO: [-6.9118, 61.8926],     // Faroe Islands
  AX: [19.9225, 60.1990],     // Åland Islands
  GI: [-5.3454, 36.1408],     // Gibraltar
  AD: [1.5218, 42.5063],      // Andorra
  MC: [7.4128, 43.7384],      // Monaco
  SM: [12.4578, 43.9424],     // San Marino
  VA: [12.4534, 41.9029],     // Vatican City
  LI: [9.5554, 47.1660],      // Liechtenstein
};

const getCountryCentroid = (countryCode) => {
  if (!countryCode) return null;
  
  // Normalize country code to uppercase
  const normalizedCode = countryCode.toUpperCase();
  
  // Direct lookup
  if (countryCentroids[normalizedCode]) {
    return countryCentroids[normalizedCode];
  }
  
  // Handle common variations
  const codeVariations = {
    'GERMANY': 'DE',
    'DEUTSCHLAND': 'DE',
    'UNITED STATES': 'US',
    'USA': 'US',
    'UNITED KINGDOM': 'GB',
    'UK': 'GB',
    'CHINA': 'CN',
    'JAPAN': 'JP',
    'FRANCE': 'FR',
    'ITALY': 'IT',
    'SPAIN': 'ES',
    'NETHERLANDS': 'NL',
    'SWEDEN': 'SE',
    'SWITZERLAND': 'CH',
    'CANADA': 'CA',
    'AUSTRALIA': 'AU'
  };
  
  // Try variations
  if (codeVariations[normalizedCode]) {
    return countryCentroids[codeVariations[normalizedCode]];
  }
  
  // Try partial matches
  for (const [variation, code] of Object.entries(codeVariations)) {
    if (normalizedCode.includes(variation) || variation.includes(normalizedCode)) {
      return countryCentroids[code];
    }
  }
  
  return null;
};

const OPENALEX_API_BASE = 'https://api.openalex.org';

const WorldMapPapers = ({ searchQuery, onPaperSelect, onApiCallsUpdate, triggerSearch = false, searchResults = null }) => {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [mapError, setMapError] = useState(false);
  const [tooltipContent, setTooltipContent] = useState(null);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    if (searchResults && searchResults.length > 0) {
      // Process searchResults directly
      const mapped = searchResults.map((work, idx) => {
        // Try to get first author institution country and coordinates
        let country = null;
        let coordinates = null;
        let institution = null;
        if (work.authorships && work.authorships.length > 0) {
          const firstAuth = work.authorships[0];
          if (firstAuth.institutions && firstAuth.institutions.length > 0) {
            const inst = firstAuth.institutions[0];
            country = inst.country_code || inst.country || null;
            institution = inst.display_name || null;
            // If OpenAlex provides lat/lon, use it (not always available)
            if (inst.latitude && inst.longitude) {
              coordinates = [inst.longitude, inst.latitude];
            } else if (country) {
              coordinates = getCountryCentroid(country);
            }
          }
        }
        // Fallback: use country from work if available
        if (!coordinates && work.country_code) {
          coordinates = getCountryCentroid(work.country_code);
          country = work.country_code;
        }
        // Fallback: skip if no coordinates
        if (!coordinates) return null;
        return {
          id: work.id || idx,
          title: work.title || work.display_name || 'Untitled',
          authors: work.authorships ? work.authorships.map(a => a.author?.display_name || '').filter(Boolean) : [],
          citations: work.citation_count || work.cited_by_count || 0,
          country,
          coordinates,
          year: work.publication_year || null,
          institution: institution || null
        };
      }).filter(Boolean);

      // Ensure all countries from leadership analysis have markers
      const countriesWithMarkers = new Set(mapped.map(p => p.country));
      const additionalMarkers = [];

      // Get all unique countries from the search results
      const allCountriesInData = new Set();
      searchResults.forEach((work) => {
        let country = null;
        if (work.authorships && work.authorships.length > 0) {
          const firstAuth = work.authorships[0];
          if (firstAuth.institutions && firstAuth.institutions.length > 0) {
            const inst = firstAuth.institutions[0];
            country = inst.country_code || inst.country || null;
          }
        }
        if (!country && work.country_code) {
          country = work.country_code;
        }
        if (country) {
          allCountriesInData.add(country);
        }
      });

      // Create markers for ALL countries that appear in the data
      allCountriesInData.forEach((country) => {
        const coordinates = getCountryCentroid(country);
        if (coordinates) {
          // If country doesn't have any markers yet, create one
          if (!countriesWithMarkers.has(country)) {
            additionalMarkers.push({
              id: `additional-${country}`,
              title: `Research papers from ${country}`,
              authors: [],
              citations: 0,
              country,
              coordinates,
              year: null,
              institution: null,
              isAdditional: true
            });
            countriesWithMarkers.add(country);
          }
        }
      });
      const allMarkers = [...mapped, ...additionalMarkers];
      setPapers(allMarkers);
    } else if (triggerSearch && searchQuery) {
      fetchPapersByQuery(searchQuery);
    } else {
      setPapers([]);
    }
  }, [searchResults, triggerSearch, searchQuery]);

  // Add global event listeners to prevent zoom
  useEffect(() => {
    const handleWheel = (e) => {
      if (e.ctrlKey) {
        e.preventDefault(); // Prevent zoom on ctrl + wheel
      }
    };

    const handleGesture = (e) => {
      e.preventDefault(); // Prevent pinch zoom on Mac trackpad
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('gesturestart', handleGesture, { passive: false });
    window.addEventListener('gesturechange', handleGesture, { passive: false });
    window.addEventListener('gestureend', handleGesture, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('gesturestart', handleGesture);
      window.removeEventListener('gesturechange', handleGesture);
      window.removeEventListener('gestureend', handleGesture);
    };
  }, []);

  const fetchPapersByQuery = async (query) => {
    const trimmed = (query || '').trim();
    if (!trimmed) {
      setPapers([]);
      setFetchError(null);
      setLoading(false);
      // Update API calls for disclaimer
      if (onApiCallsUpdate) {
        onApiCallsUpdate([]);
      }
      return;
    }
    setLoading(true);
    setFetchError(null);
    try {
      const filter = `title_and_abstract.search:"${trimmed.replace(/"/g, '\\"')}"`;
      const params = new URLSearchParams({
        filter,
        per_page: 100
      });
      const apiUrl = `${OPENALEX_API_BASE}/works?${params.toString()}`;
      
      // Update API calls for disclaimer
      if (onApiCallsUpdate) {
        onApiCallsUpdate([apiUrl]);
      }
      
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error('API error');
      const data = await response.json();
      if (!data.results || !Array.isArray(data.results) || data.results.length === 0) {
        setPapers([]);
        setLoading(false);
        return;
      }
      // Map OpenAlex results to marker format
      const mapped = data.results.map((work, idx) => {
        // Try to get first author institution country and coordinates
        let country = null;
        let coordinates = null;
        let institution = null;
        if (work.authorships && work.authorships.length > 0) {
          const firstAuth = work.authorships[0];
          if (firstAuth.institutions && firstAuth.institutions.length > 0) {
            const inst = firstAuth.institutions[0];
            country = inst.country_code || inst.country || null;
            institution = inst.display_name || null;
            // If OpenAlex provides lat/lon, use it (not always available)
            if (inst.latitude && inst.longitude) {
              coordinates = [inst.longitude, inst.latitude];
            } else if (country) {
              coordinates = getCountryCentroid(country);
            }
          }
        }
        // Fallback: use country from work if available
        if (!coordinates && work.country_code) {
          coordinates = getCountryCentroid(work.country_code);
          country = work.country_code;
        }
        // Fallback: skip if no coordinates
        if (!coordinates) return null;
        return {
          id: work.id || idx,
          title: work.title || work.display_name || 'Untitled',
          authors: work.authorships ? work.authorships.map(a => a.author?.display_name || '').filter(Boolean) : [],
          citations: work.citation_count || work.cited_by_count || 0,
          country,
          coordinates,
          year: work.publication_year || null,
          institution: institution || null
        };
      }).filter(Boolean);
      setPapers(mapped);
    } catch (error) {
      console.error('OpenAlex API Error:', error.response?.data || error.message);
      setFetchError('Failed to fetch papers.');
      setPapers([]);
      // Update API calls for disclaimer even on error
      if (onApiCallsUpdate) {
        onApiCallsUpdate([]);
      }
    } finally {
      setLoading(false);
    }
  };

  // Helper to offset markers with the same coordinates
  function offsetMarkers(papers) {
    
    // Group by coordinates as string
    const groups = {};
    papers.forEach((paper) => {
      const key = paper.coordinates.join(',');
      if (!groups[key]) groups[key] = [];
      if (groups[key].length < 5) { // Only allow up to 5 papers per country
        groups[key].push(paper);
      }
    });
    
    // Offset each group
    const R = 2.5; // increased degrees offset radius
    const result = [];
    Object.values(groups).forEach((group) => {
      if (group.length === 1) {
        result.push(group[0]);
      } else {
        group.forEach((paper, i) => {
          const angle = (2 * Math.PI * i) / group.length;
          const dx = R * Math.cos(angle);
          const dy = R * Math.sin(angle);
          result.push({
            ...paper,
            coordinates: [paper.coordinates[0] + dx, paper.coordinates[1] + dy],
          });
        });
      }
    });
    
    return result;
  }

  const getMarkerSize = (citations) => {
    if (citations > 20000) return 12;
    if (citations > 15000) return 10;
    if (citations > 10000) return 8;
    if (citations > 5000) return 6;
    return 4;
  };

  const getMarkerColor = (citations) => {
    if (citations > 20000) return '#ff4444';
    if (citations > 15000) return '#ff8800';
    if (citations > 10000) return '#ffcc00';
    if (citations > 5000) return '#88ff00';
    return '#44ff44';
  };

  const handleMarkerClick = (paper) => {
    if (onPaperSelect) {
      onPaperSelect(paper);
    }
  };

  const handleMarkerMouseEnter = (paper, evt) => {
    // Position tooltip near mouse
    const tooltipX = evt?.clientX || 0;
    const tooltipY = evt?.clientY || 0;
    setTooltipContent({
      title: paper.title,
      authors: paper.authors.join(', '),
      citations: paper.citations?.toLocaleString?.() || paper.citations,
      year: paper.year,
      institution: paper.institution,
      x: tooltipX,
      y: tooltipY
    });
  };

  const handleMarkerMouseLeave = () => {
    setTooltipContent('');
  };

  const handleMapError = () => {
    setMapError(true);
  };

  // Zoom control functions
  const handleZoomIn = () => {
    setZoom(prevZoom => Math.min(prevZoom + 0.5, 4));
  };

  const handleZoomOut = () => {
    setZoom(prevZoom => Math.max(prevZoom - 0.5, 0.8));
  };

  const handleZoomReset = () => {
    setZoom(1);
  };

  return (
    <div className={styles.worldMapContainer}>
      <div className={styles.header}>
        <h2>Global Research Impact Map</h2>
        <p>Leading papers by citation count and country</p>
      </div>
      {loading && (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading research data...</p>
        </div>
      )}
      {fetchError && (
        <div className={styles.errorContainer}>
          <h3>Error</h3>
          <p>{fetchError}</p>
        </div>
      )}
      {!loading && !fetchError && papers.length === 0 && searchQuery && (
        <div className={styles.emptyStateContainer}>
          <div className={styles.emptyStateIcon}>🔍</div>
          <h3 className={styles.emptyStateTitle}>No Results Found</h3>
          <p className={styles.emptyStateSubtitle}>
            No research papers found for your search query. Try different keywords or filters to discover relevant research.
          </p>
          <div className={styles.emptyStateFeatures}>
            <div className={styles.emptyStateFeature}>
              <div className={styles.featureIcon}>📝</div>
              <div className={styles.featureText}>Try different keywords</div>
            </div>
            <div className={styles.emptyStateFeature}>
              <div className={styles.featureIcon}>🔬</div>
              <div className={styles.featureText}>Use specific terms</div>
            </div>
            <div className={styles.emptyStateFeature}>
              <div className={styles.featureIcon}>🌍</div>
              <div className={styles.featureText}>Check filters</div>
            </div>
          </div>
        </div>
      )}
      {!loading && !fetchError && papers.length === 0 && !searchQuery && (
        <div className={styles.emptyStateContainer}>
          <div className={styles.emptyStateIcon}>🌍</div>
          <h3 className={styles.emptyStateTitle}>Discover Global Research Impact</h3>
          <p className={styles.emptyStateSubtitle}>
            Enter keywords in the search box above to find research papers and visualize their global impact on the world map.
          </p>
          <div className={styles.emptyStateFeatures}>
            <div className={styles.emptyStateFeature}>
              <div className={styles.featureIcon}>📊</div>
              <div className={styles.featureText}>Citation Analysis</div>
            </div>
            <div className={styles.emptyStateFeature}>
              <div className={styles.featureIcon}>🏆</div>
              <div className={styles.featureText}>Research Leadership</div>
            </div>
            <div className={styles.emptyStateFeature}>
              <div className={styles.featureIcon}>🎯</div>
              <div className={styles.featureText}>Global Impact</div>
            </div>
          </div>
        </div>
      )}
      {mapError ? (
        <div className={styles.errorContainer}>
          <h3>Map Loading Error</h3>
          <p>Unable to load the world map. Please try refreshing the page.</p>
          <button onClick={() => window.location.reload()} className={styles.retryButton}>
            Retry
          </button>
        </div>
      ) : papers.length > 0 && (
        <div 
          className={styles.mapContainer}
        >
          {/* Zoom Controls */}
          <div className={styles.zoomControls}>
            <button 
              className={styles.zoomButton} 
              onClick={handleZoomIn}
              title="Zoom In"
            >
              +
            </button>
            <button 
              className={styles.zoomButton} 
              onClick={handleZoomOut}
              title="Zoom Out"
            >
              −
            </button>
            <button 
              className={styles.zoomButton} 
              onClick={handleZoomReset}
              title="Reset Zoom"
            >
              ⌂
            </button>
          </div>
          
          <ComposableMap
            projection="geoEqualEarth"
            projectionConfig={{
              scale: 200,
              center: [0, 0]
            }}
            style={{
              width: '100%',
              height: '100%'
            }}
          >
            <ZoomableGroup
              center={[0, 0]}
              zoom={zoom}
              maxZoom={4}
              minZoom={0.8}
              disablePanning={false}
              disableZooming={true}
            >
              <Geographies 
                geography="https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"
                onError={handleMapError}
              >
                {({ geographies }) => {
                  return geographies.map((geo) => (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill="#b0b0b0"
                      stroke="#D6D6DA"
                      strokeWidth={0.5}
                      style={{
                        default: { outline: 'none' },
                        hover: { fill: '#F5F5F5', outline: 'none' },
                        pressed: { outline: 'none' }
                      }}
                    />
                  ));
                }}
              </Geographies>
              {(() => {
                const markersToRender = offsetMarkers(papers.slice(0, 100));
                
                return markersToRender.map((paper) => {
                  return (
                    <Marker
                      key={paper.id}
                      coordinates={paper.coordinates}
                      onClick={() => handleMarkerClick(paper)}
                      onMouseEnter={e => handleMarkerMouseEnter(paper, e)}
                      onMouseLeave={handleMarkerMouseLeave}
                    >
                      <circle
                        r={getMarkerSize(paper.citations)}
                        fill={getMarkerColor(paper.citations)}
                        stroke="#fff"
                        strokeWidth={2}
                        className={styles.marker}
                      />
                    </Marker>
                  );
                });
              })()}
            </ZoomableGroup>
          </ComposableMap>
        </div>
      )}
      
      {papers.length > 0 && (
        <div className={styles.legend}>
          <h4>Citation Impact Legend</h4>
          <div className={styles.legendItems}>
            <div className={styles.legendItem}>
              <div className={styles.legendDot} style={{ backgroundColor: '#ff4444', width: '12px', height: '12px' }}></div>
              <span>20,000+ citations</span>
            </div>
            <div className={styles.legendItem}>
              <div className={styles.legendDot} style={{ backgroundColor: '#ff8800', width: '10px', height: '10px' }}></div>
              <span>15,000+ citations</span>
            </div>
            <div className={styles.legendItem}>
              <div className={styles.legendDot} style={{ backgroundColor: '#ffcc00', width: '8px', height: '8px' }}></div>
              <span>10,000+ citations</span>
            </div>
            <div className={styles.legendItem}>
              <div className={styles.legendDot} style={{ backgroundColor: '#88ff00', width: '6px', height: '6px' }}></div>
              <span>5,000+ citations</span>
            </div>
            <div className={styles.legendItem}>
              <div className={styles.legendDot} style={{ backgroundColor: '#44ff44', width: '4px', height: '4px' }}></div>
              <span>&lt; 5,000 citations</span>
            </div>
          </div>
        </div>
      )}
      
      {/* Research Leadership Analysis */}
      {papers.length > 0 && !loading && (
        <ResearchLeadershipAnalysis 
          papers={papers} 
          searchQuery={searchQuery || 'research'} 
        />
      )}
      
      {tooltipContent && (
        <div
          className={styles.tooltip}
          style={{
            left: tooltipContent.x ? tooltipContent.x + 20 : '50%',
            top: tooltipContent.y ? tooltipContent.y - 20 : '50%',
            position: 'fixed',
            zIndex: 2000
          }}
        >
          <h4>{tooltipContent.title}</h4>
          <p><strong>Authors:</strong> {tooltipContent.authors}</p>
          <p><strong>Citations:</strong> {tooltipContent.citations}</p>
          {tooltipContent.year && <p><strong>Year:</strong> {tooltipContent.year}</p>}
          {tooltipContent.institution && <p><strong>Institution:</strong> {tooltipContent.institution}</p>}
        </div>
      )}
    </div>
  );
};

export default WorldMapPapers; 