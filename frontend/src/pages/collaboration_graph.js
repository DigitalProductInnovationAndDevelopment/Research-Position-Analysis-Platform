import { useState, useEffect, useRef } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import TopBar from '../components/shared/TopBar';
import Orb from '../components/shared/Orbit/Orbit';
import ApiCallInfoBox from '../components/shared/ApiCallInfoBox';


const GraphViewLight = ({ darkMode = true }) => {
  const [selectedInstitution, setSelectedInstitution] = useState(null);
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hoverLink, setHoverLink] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [triggerSearch, setTriggerSearch] = useState(false);
  const [selectedAuthor, setSelectedAuthor] = useState(null);
  const [authorInput, setAuthorInput] = useState('');
  const [authorSuggestions, setAuthorSuggestions] = useState([]);
  const [showAuthorModal, setShowAuthorModal] = useState(false);
  const [modalAuthorInput, setModalAuthorInput] = useState('');
  const [modalAuthorSuggestions, setModalAuthorSuggestions] = useState([]);
  const inputRef = useRef(null);
  const fgRef = useRef();
  const [selectedEdge, setSelectedEdge] = useState(null);
  const [collabPapers, setCollabPapers] = useState([]);
  const [papersLoading, setPapersLoading] = useState(false);
  const [papersError, setPapersError] = useState(null);
  const [conferenceInfo, setConferenceInfo] = useState({});
  const [conferenceLoading, setConferenceLoading] = useState(false);
  const [showInstitutionModal, setShowInstitutionModal] = useState(false);
  const [modalInstitutionInput, setModalInstitutionInput] = useState('');
  const [modalInstitutionSuggestions, setModalInstitutionSuggestions] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [showAuthorsInGraph, setShowAuthorsInGraph] = useState(true);

  // Store works data globally for consistency
  const [worksData, setWorksData] = useState([]);

  // Disclaimer state
  const [userInputs, setUserInputs] = useState([]);
  const [apiCalls, setApiCalls] = useState([]);

  // Set longer link distance when graphData changes
  useEffect(() => {
    if (fgRef.current) {
      fgRef.current.d3Force('link').distance(200);
    }
  }, [graphData]);

  // Author autocomplete suggestions
  useEffect(() => {
    const fetchAuthors = async () => {
      if (authorInput.length < 2) {
        setAuthorSuggestions([]);
        return;
      }
      try {
        const res = await fetch(`https://api.openalex.org/authors?search=${encodeURIComponent(authorInput)}&per_page=10`);
        const data = await res.json();
        setAuthorSuggestions(data.results || []);
      } catch {
        setAuthorSuggestions([]);
      }
    };
    fetchAuthors();
  }, [authorInput]);


  // Only generate the graph when triggerSearch changes and selectedInstitution is set
  useEffect(() => {
    if (!selectedInstitution || !triggerSearch) return;
    setLoading(true);
    setError(null);

    // Track user inputs for disclaimer
    const inputs = [];
    if (selectedInstitution && selectedInstitution.display_name) inputs.push({ category: 'Institution', value: selectedInstitution.display_name });
    if (searchTerm.trim()) inputs.push({ category: 'Keyword', value: searchTerm.trim() });
    if (selectedAuthor && selectedAuthor.display_name) inputs.push({ category: 'Author', value: selectedAuthor.display_name });
    setUserInputs(inputs);

    // Track API calls for disclaimer
    const apiCallUrls = [];

    const fetchInstitutionId = async () => {
      if (!selectedInstitution) {
        throw new Error('No institution selected');
      }
      if (!selectedInstitution.id) {
        const res = await fetch(`https://api.openalex.org/institutions?search=${encodeURIComponent(selectedInstitution.display_name)}`);
        const data = await res.json();
        const id = data.results[0]?.id?.split('/').pop();
        return id;
      }
      const id = selectedInstitution.id.split('/').pop();
      return id;
    };

    // Fetch top collaborators using group_by
    const fetchTopCollaborators = async (institutionId) => {
      const filterParts = [`authorships.institutions.id:${institutionId}`];
      if (searchTerm.trim()) {
        filterParts.push(`title_and_abstract.search:${encodeURIComponent(searchTerm.trim())}`);
      }
      if (selectedAuthor && selectedAuthor.id) {
        // Use OpenAlex author id for author filter
        const authorId = selectedAuthor.id.split('/').pop();
        filterParts.push(`authorships.author.id:${authorId}`);
      }
      const filterString = filterParts.join(',');
      const url = `https://api.openalex.org/works?filter=${filterString}&group_by=authorships.institutions.id&per_page=200`;
      apiCallUrls.push(url);
      const res = await fetch(url);
      const data = await res.json();
      // Each group has a key (institution id) and count
      // Filter out the selected institution itself
      const groups = (data.group_by || []).filter(g => g.key !== `https://openalex.org/I${institutionId}`);
      // Sort by count and take top 10
      const top10 = groups.sort((a, b) => b.count - a.count).slice(0, 10);
      return top10;
    };

    // Fetch institution details for collaborator IDs
    const fetchInstitutionDetails = async (ids) => {
      if (ids.length === 0) return [];
      const url = `https://api.openalex.org/institutions?filter=id:${ids.map(id => 'I' + id).join('|')}`;
      apiCallUrls.push(url);
      const res = await fetch(url);
      const data = await res.json();
      return data.results || [];
    };

    // Fetch all works for the institution (and optionally author filter)
    const fetchWorks = async (institutionId, collaboratorIds) => {
      let filterParts = [`authorships.institutions.id:${institutionId}`];
      if (searchTerm.trim()) {
        filterParts.push(`title_and_abstract.search:${encodeURIComponent(searchTerm.trim())}`);
      }
      if (selectedAuthor && selectedAuthor.id) {
        const authorId = selectedAuthor.id.split('/').pop();
        filterParts.push(`authorships.author.id:${authorId}`);
      }
      // Only fetch works for top collaborators
      if ((!selectedAuthor || !selectedAuthor.id) && collaboratorIds.length > 0) {
        filterParts.push(`authorships.institutions.id:${collaboratorIds.map(id => id).join('|')}`);
      }
      const filterString = filterParts.join(',');
      let allWorks = [];
      let page = 1;
      let hasMore = true;
      const perPage = 50;
      while (hasMore && page <= 5) { // limit to 250 for performance
        const url = `https://api.openalex.org/works?filter=${filterString}&per_page=${perPage}&page=${page}`;
        apiCallUrls.push(url);
        const res = await fetch(url);
        const data = await res.json();
        allWorks = allWorks.concat(data.results || []);
        hasMore = data.results && data.results.length === perPage;
        page++;
      }
      return allWorks;
    };

    const fetchAndBuild = async () => {
      try {
        const institutionId = await fetchInstitutionId();
        const topCollaborators = await fetchTopCollaborators(institutionId);
        const collaboratorIds = topCollaborators.map(c => c.key.split('/').pop());
        const collaboratorDetails = await fetchInstitutionDetails(collaboratorIds);

        if (showAuthorsInGraph) {
          // Show top 10 collaborators and authors who co-published with them
          const works = await fetchWorks(institutionId, collaboratorIds);

          // Store works data globally for consistency
          setWorksData(works);

          // Collect authors who co-published with the main institution
          const authorMap = new Map(); // id -> display_name
          works.forEach(work => {
            // Only include authors if this work involves the main institution
            const hasMainInstitution = work.authorships?.some(authorship =>
              authorship.institutions?.some(inst => inst.id.split('/').pop() === institutionId)
            );

            if (hasMainInstitution) {
              work.authorships?.forEach(authorship => {
                if (authorship.author && authorship.author.id && authorship.author.display_name) {
                  authorMap.set(authorship.author.id, authorship.author.display_name);
                }
              });
            }
          });

          // Build institution nodes first
          const nodes = [
            { id: institutionId, label: selectedInstitution.display_name, type: 'institution', main: true },
            ...collaboratorDetails
              .filter(inst => inst.id.split('/').pop() !== institutionId)
              .map(inst => ({ id: inst.id.split('/').pop(), label: inst.display_name, type: 'institution' }))
          ];

          // Build links: institution-to-institution and institution-to-author
          const links = [];

          // Add institution-to-institution links with accurate counts
          for (const collaborator of topCollaborators) {
            const collaboratorId = collaborator.key.split('/').pop();
            try {
              const filterString = `authorships.institutions.lineage:i${institutionId},authorships.institutions.lineage:i${collaboratorId}`;
              const res = await fetch(
                `https://api.openalex.org/works?filter=${filterString}&per_page=1`
              );
              const data = await res.json();
              const count = data.meta?.count || 0;

              links.push({
                source: institutionId,
                target: collaboratorId,
                value: count
              });
            } catch (e) {
              console.error(`Error fetching count for institution collaboration ${institutionId}-${collaboratorId}:`, e);
              // Fallback to the original count
              links.push({
                source: institutionId,
                target: collaboratorId,
                value: collaborator.count
              });
            }
          }

          // Add institution-to-author links and detect institution-to-institution collaborations
          const authorInstitutionMap = new Map(); // key: "instId-authorId", value: count
          const institutionCollaborations = new Map(); // key: "instId1-instId2", value: count

          // Analyze works to find both author-institution and institution-institution collaborations
          works.forEach(work => {
            const workInstitutions = new Set();
            const workAuthors = new Set();

            work.authorships?.forEach(authorship => {
              if (authorship.author && authorship.author.id) {
                const authorId = authorship.author.id;
                workAuthors.add(authorId);

                authorship.institutions?.forEach(inst => {
                  const instId = inst.id.split('/').pop();
                  if (instId === institutionId || collaboratorIds.includes(instId)) {
                    workInstitutions.add(instId);
                    authorInstitutionMap.set(`${instId}-${authorId}`, (authorInstitutionMap.get(`${instId}-${authorId}`) || 0) + 1);
                  }
                });
              }
            });

            // If this work involves multiple institutions, create institution-to-institution collaboration
            if (workInstitutions.size > 1) {
              const institutions = Array.from(workInstitutions);
              for (let i = 0; i < institutions.length; i++) {
                for (let j = i + 1; j < institutions.length; j++) {
                  const key = [institutions[i], institutions[j]].sort().join('-');
                  institutionCollaborations.set(key, (institutionCollaborations.get(key) || 0) + 1);
                }
              }
            }
          });

          // Add institution-to-institution links based on actual collaborations found
          for (const [collabKey, count] of institutionCollaborations) {
            const [inst1, inst2] = collabKey.split('-');
            links.push({
              source: inst1,
              target: inst2,
              value: count
            });
          }

          // Add institution-to-author links for co-published papers
          // Only add links for authors who co-published with the main institution
          const authorsWithEdges = new Set(); // Track authors who have edges

          for (const [pair, count] of authorInstitutionMap) {
            const [instId, authorId] = pair.split('-');
            // Only include authors who co-published with the main institution
            if (instId === institutionId || collaboratorIds.includes(instId)) {
              try {
                // Check if this author co-published with the main institution
                const filterString = `authorships.author.id:${authorId},authorships.institutions.lineage:i${institutionId}`;
                const res = await fetch(
                  `https://api.openalex.org/works?filter=${filterString}&per_page=1`
                );
                const data = await res.json();
                const apiCount = data.meta?.count || 0;

                if (apiCount > 0) {
                  links.push({
                    source: instId,
                    target: authorId,
                    value: apiCount,
                    type: 'co_published_with'
                  });
                  authorsWithEdges.add(authorId); // Mark this author as having an edge
                }
              } catch (e) {
                console.error(`Error fetching count for ${pair}:`, e);
                // Fallback to the count from our analysis
                if (count > 0) {
                  links.push({
                    source: instId,
                    target: authorId,
                    value: count,
                    type: 'co_published_with'
                  });
                  authorsWithEdges.add(authorId); // Mark this author as having an edge
                }
              }
            }
          }

          // Only add author nodes for authors who have edges
          const authorsWithEdgesArray = Array.from(authorsWithEdges).map(authorId => ({
            id: authorId,
            label: authorMap.get(authorId),
            type: 'author'
          }));

          nodes.push(...authorsWithEdgesArray);

          setGraphData({ nodes, links });
        } else {
          // Only add institution nodes and institution-to-institution links
          const nodes = [
            { id: institutionId, label: selectedInstitution.display_name, type: 'institution', main: true },
            ...collaboratorDetails
              .filter(inst => inst.id.split('/').pop() !== institutionId)
              .map(inst => ({ id: inst.id.split('/').pop(), label: inst.display_name, type: 'institution' }))
          ];
          const links = topCollaborators.map(c => ({ source: institutionId, target: c.key.split('/').pop(), value: c.count }));
          setGraphData({ nodes, links });
          return;
        }

        // Set API calls for disclaimer
        setApiCalls(apiCallUrls);
      } catch (e) {
        setError('Failed to fetch collaborators or build graph.');
      } finally {
        setLoading(false);
      }
    };

    fetchAndBuild();
    setTriggerSearch(false);
  }, [triggerSearch]);

  // Handle Enter key in search input
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      setTriggerSearch(s => !s);
    }
  };

  // Helper to get node label from id or node object
  const getNodeLabel = (node) => {
    const id = typeof node === 'object' ? node.id : node;
    return graphData.nodes.find(n => n.id === id)?.label || '';
  };

  // Function to fetch conference information for papers with DOIs
  const fetchConferenceInfo = async (papers) => {
    const papersWithDoi = papers.filter(paper => paper.doi);
    console.log('Papers with DOI:', papersWithDoi);
    if (papersWithDoi.length === 0) return;

    setConferenceLoading(true);
    try {
      // Send the full DOI URLs to the backend
      const dois = papersWithDoi.map(paper => paper.doi);
      console.log('DOIs to fetch:', dois);
      const response = await fetch(`/api/publications/conference-info?dois=${dois.join(',')}`);
      const data = await response.json();
      console.log('Conference API response:', data);

      const conferenceData = {};
      data.results.forEach(result => {
        if (result.doi && !result.error) {
          // Store with the full DOI URL as key to match the paper.doi format
          const fullDoiUrl = `https://doi.org/${result.doi}`;
          conferenceData[fullDoiUrl] = result;
        }
      });
      console.log('Processed conference data:', conferenceData);

      setConferenceInfo(conferenceData);
    } catch (error) {
      console.error('Error fetching conference information:', error);
    } finally {
      setConferenceLoading(false);
    }
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh', width: '100vw', overflow: 'hidden', background: '#000' }}>
      {/* Orbit as full-page background */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 0,
          pointerEvents: 'none',
          transform: 'translateZ(0)',
          willChange: 'transform',
        }}
      >
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}>
          <Orb
            hoverIntensity={0.5}
            rotateOnHover={true}
            hue={0}
            forceHoverState={false}
          />
        </div>
      </div>

      {/* Main content */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <TopBar />
        {/* Centered header and search/filter controls */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '40vh',
            width: '100%',
            position: 'relative',
            zIndex: 2,
            marginTop: '12vh',
          }}
        >
          <h1
            style={{
              color: '#4F6AF6',
              fontWeight: 700,
              fontSize: '2rem',
              marginBottom: '0.75rem',
              lineHeight: 1.1,
              textAlign: 'center',
              textShadow: '0 2px 16px #000',
              maxWidth: 500,
            }}
          >
            Collaboration Network
          </h1>
          <p
            style={{
              color: '#fff',
              fontSize: '0.9rem',
              textAlign: 'center',
              maxWidth: 500,
              margin: '0 auto',
              lineHeight: 1.5,
              fontWeight: 700,
              fontFamily: 'inherit',
              textShadow: '0 2px 16px #000',
            }}
          >
            Select an institution to view its top 10 collaborating institutions and authors who co-published with them.
            Add either an author filter or keyword to focus on specific collaborations.
          </p>

          {/* Search/filter controls */}
          <div style={{
            marginTop: 24,
            width: '100%',
            maxWidth: 400,
            marginLeft: 'auto',
            marginRight: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            alignItems: 'center',
          }}>
            <div style={{ width: '100%', color: '#fff' }}>
              <div style={{ marginBottom: 8, width: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                <label style={{ fontWeight: 600, color: '#fff' }}>Select Institution <span style={{ color: '#ff4444' }}>*</span></label>
                <div
                  style={{
                    background: '#222',
                    border: '1px solid #ccc',
                    borderRadius: 4,
                    padding: '0.5rem',
                    width: '100%',
                    position: 'relative',
                    cursor: 'pointer',
                    minHeight: '2.5rem',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  onClick={() => {
                    setShowInstitutionModal(true);
                    setModalInstitutionInput('');
                    setModalInstitutionSuggestions([]);
                  }}
                >
                  <span style={{
                    color: selectedInstitution ? '#fff' : '#888',
                    fontSize: 16,
                    flex: 1
                  }}>
                    {selectedInstitution ? selectedInstitution.display_name : "Click to search institutions..."}
                  </span>
                  {selectedInstitution && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedInstitution(null);
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#6b7280',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        padding: 0,
                        width: '16px',
                        height: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '50%',
                        marginRight: '0.5rem',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = '#dc3545';
                        e.target.style.color = '#fff';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'none';
                        e.target.style.color = '#6b7280';
                      }}
                      title="Remove institution"
                    >
                      ×
                    </button>
                  )}
                  <span style={{ color: '#888', marginLeft: '0.5rem' }}>▼</span>
                </div>
              </div>
            </div>
            {/* Author Dropdown */}
            <div style={{ marginBottom: 8, width: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
              <label style={{ fontWeight: 600, color: '#fff' }}>Filter by Author (optional)</label>
              <div style={{ fontSize: '0.8rem', color: '#ccc', marginBottom: 4 }}>
                Choose author and/or keyword to focus your search
              </div>
              <div
                style={{
                  background: '#222',
                  border: '1px solid #ccc',
                  borderRadius: 4,
                  padding: '0.5rem',
                  width: '100%',
                  position: 'relative',
                  cursor: 'pointer',
                  minHeight: '2.5rem',
                  display: 'flex',
                  alignItems: 'center'
                }}
                onClick={() => {
                  setShowAuthorModal(true);
                  setModalAuthorInput('');
                  setModalAuthorSuggestions([]);
                }}
              >
                <span style={{
                  color: authorInput ? '#fff' : '#888',
                  fontSize: 16,
                  flex: 1
                }}>
                  {authorInput || "Click to search authors..."}
                </span>
                {selectedAuthor && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedAuthor(null);
                      setAuthorInput('');
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#6b7280',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      padding: 0,
                      width: '16px',
                      height: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '50%',
                      marginRight: '0.5rem',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = '#dc3545';
                      e.target.style.color = '#fff';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'none';
                      e.target.style.color = '#6b7280';
                    }}
                    title="Remove author"
                  >
                    ×
                  </button>
                )}
                <span style={{ color: '#888', marginLeft: '0.5rem' }}>▼</span>
              </div>
            </div>
            {/* Keyword input and search button */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
              <label style={{ fontWeight: 600, marginBottom: 4, display: 'block', color: '#fff' }}>Search by Keyword (optional)</label>
              <div style={{ fontSize: '0.8rem', color: '#ccc', marginBottom: 4 }}>
                Choose author and/or keyword to focus your search
              </div>
              <input
                ref={inputRef}
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter keyword to filter papers..."
                style={{ flex: 1, width: '100%', padding: 10, fontSize: 16, borderRadius: 6, border: '1px solid #ccc', background: '#222', color: '#fff' }}
              />
              <button
                onClick={() => {
                  setTriggerSearch(s => !s);
                  setHasSearched(true);
                }}
                disabled={!selectedInstitution || (!searchTerm.trim() && !selectedAuthor)}
                style={{
                  padding: '10px 24px',
                  fontSize: 16,
                  borderRadius: 6,
                  background: (!selectedInstitution || (!searchTerm.trim() && !selectedAuthor)) ? '#ccc' : '#4F6AF6',
                  color: '#fff',
                  border: 'none',
                  cursor: (!selectedInstitution || (!searchTerm.trim() && !selectedAuthor)) ? 'not-allowed' : 'pointer',
                  boxShadow: '0 2px 8px rgba(25, 118, 210, 0.08)'
                }}
              >
                Generate Graph
              </button>
            </div>
          </div>
        </div>

        {/* Rest of the content below */}
        {hasSearched && (
          <div style={{
            background: '#23272f',
            borderRadius: 12,
            boxShadow: '0 2px 16px rgba(0,0,0,0.15)',
            border: '1px solid #333',
            padding: '2rem 1rem',
            color: '#fff',
            maxWidth: 1200,
            margin: '2rem auto 0 auto',
            zIndex: 2,
            position: 'relative',
          }}>
            {/* Selected Institution in top left */}
            {selectedInstitution && (
              <div style={{
                position: 'absolute',
                top: 16,
                left: 24,
                color: '#fff',
                fontWeight: 600,
              }}>
                <strong>Selected Institution:</strong> {selectedInstitution.display_name}
              </div>
            )}

            {/* Toggle in top right */}
            <div style={{
              position: 'absolute',
              top: 16,
              right: 24,
              display: 'flex',
              alignItems: 'center',
            }}>
              <div
                onClick={() => {
                  setShowAuthorsInGraph(!showAuthorsInGraph);
                  setTriggerSearch(s => !s);
                }}
                style={{
                  width: 50,
                  height: 24,
                  backgroundColor: showAuthorsInGraph ? '#4F6AF6' : '#666',
                  borderRadius: 12,
                  position: 'relative',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s ease',
                  marginRight: 8,
                }}
              >
                <div
                  style={{
                    width: 18,
                    height: 18,
                    backgroundColor: '#fff',
                    borderRadius: '50%',
                    position: 'absolute',
                    top: 3,
                    left: showAuthorsInGraph ? 29 : 3,
                    transition: 'left 0.3s ease',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                  }}
                />
              </div>
              <label htmlFor="showAuthors" style={{ color: '#fff', fontWeight: 600, cursor: 'pointer' }}>
                Show Authors in Graph
              </label>
            </div>

            {/* Remove the old selected institution text that was below */}
            {loading && <div style={{ marginTop: '2rem' }}>Loading...</div>}
            {error && <div style={{ marginTop: '2rem', color: 'red' }}>{error}</div>}
            {!loading && !error && graphData.nodes.length > 1 && (
              <div style={{
                height: 800,
                width: '100%',
                minWidth: 900,
                marginTop: '2rem',
                borderRadius: 16,
                position: 'relative',
                boxShadow: '0 8px 32px rgba(25, 118, 210, 0.10)',
                padding: 24,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <ForceGraph2D
                  ref={fgRef}
                  width={1200}
                  height={750}
                  graphData={graphData}
                  nodeLabel={node => node.label}
                  nodeAutoColorBy="type"
                  nodeCanvasObject={(node, ctx, globalScale) => {
                    const label = node.label.length > 30 ? node.label.slice(0, 29) + '…' : node.label;
                    const fontSize = 12;
                    ctx.font = `${fontSize}px Sans-Serif`;
                    // Color logic
                    let fill = '#1976d2'; // default: blue for institutions
                    if (node.type === 'author') {
                      fill = '#8e24aa'; // purple for authors
                    } else if (node.main) {
                      fill = '#ff9800'; // orange for selected institution
                    }
                    ctx.fillStyle = fill;
                    ctx.beginPath();
                    ctx.arc(node.x, node.y, 10, 0, 2 * Math.PI, false);
                    ctx.shadowColor = fill;
                    ctx.shadowBlur = 4;
                    ctx.fill();
                    ctx.shadowBlur = 0;
                    ctx.fillStyle = '#fff';
                    ctx.fillText(label, node.x + 14, node.y + 5);
                  }}
                  linkDirectionalArrowLength={6}
                  linkDirectionalArrowRelPos={1}
                  linkWidth={link => Math.max(2, Math.log2(link.value + 1))}
                  linkColor={() => '#90caf9'}
                  onLinkHover={setHoverLink}
                  onNodeDragEnd={(node) => {
                    // Fix the node position after dragging
                    node.fx = node.x;
                    node.fy = node.y;
                  }}
                  onLinkClick={async (link) => {
                    setSelectedEdge(link);
                    setPapersLoading(true);
                    setPapersError(null);
                    setCollabPapers([]);
                    try {
                      let filterParts = [];

                      if (link.type === 'co_published_with') {
                        // Institution to Author link - show papers where this author co-published with the main institution
                        const institutionId = typeof link.source === 'object' ? link.source.id : link.source;
                        const authorId = typeof link.target === 'object' ? link.target.id : link.target;

                        // Show papers where this author co-published with the main institution
                        filterParts = [
                          `authorships.author.id:${authorId}`,
                          `authorships.institutions.lineage:i${institutionId}`
                        ];
                      } else {
                        // Institution to Institution link - use the exact format from your example
                        const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
                        const targetId = typeof link.target === 'object' ? link.target.id : link.target;

                        filterParts = [
                          `authorships.institutions.lineage:i${sourceId}`,
                          `authorships.institutions.lineage:i${targetId}`
                        ];
                      }

                      // Always include the keyword filter if it was applied to the graph
                      if (searchTerm.trim()) {
                        filterParts.push(`title_and_abstract.search:${encodeURIComponent(searchTerm.trim())}`);
                      }

                      const filterString = filterParts.join(',');
                      let allPapers = [];
                      let page = 1;
                      let hasMore = true;
                      const perPage = 50;
                      while (hasMore && page <= 10) { // limit to 500 for performance
                        const res = await fetch(
                          `https://api.openalex.org/works?filter=${filterString}&sort=cited_by_count:desc&per_page=${perPage}&page=${page}`
                        );
                        const data = await res.json();
                        allPapers = allPapers.concat(data.results || []);
                        hasMore = data.results && data.results.length === perPage;
                        page++;
                      }

                      // Remove duplicates based on title and set papers
                      const uniquePapers = allPapers.filter((paper, index, self) =>
                        index === self.findIndex(p => p.display_name === paper.display_name)
                      );
                      setCollabPapers(uniquePapers);

                      // Fetch conference information for papers with DOIs
                      await fetchConferenceInfo(uniquePapers);
                    } catch (e) {
                      setPapersError('Failed to fetch collaborated papers.');
                    } finally {
                      setPapersLoading(false);
                    }
                  }}
                  enableZoomPanInteraction={false}
                  backgroundColor="#23272f"
                />
                {hoverLink && (
                  <div style={{
                    position: 'absolute',
                    left: 40,
                    top: 40,
                    background: 'rgba(255,255,255,0.97)',
                    border: '1.5px solid #1976d2',
                    borderRadius: 8,
                    padding: 14,
                    pointerEvents: 'none',
                    zIndex: 10,
                    fontSize: 18,
                    color: '#222',
                    boxShadow: '0 2px 8px rgba(25, 118, 210, 0.10)'
                  }}>
                    <div><strong>Edge Type:</strong> {hoverLink.type === 'co_published_with' ? 'Institution → Author (Co-published)' : 'Institution → Institution'}</div>
                    <div><strong>From:</strong> {getNodeLabel(hoverLink.source)}</div>
                    <div><strong>To:</strong> {getNodeLabel(hoverLink.target)}</div>
                  </div>
                )}

                {/* Legend */}
              </div>
            )}
            {!loading && !error && selectedInstitution && graphData.nodes.length <= 1 && (
              <div style={{ marginTop: '2rem' }}>No collaborators found for this institution.</div>
            )}
            {selectedEdge && (
              <div style={{
                marginTop: 32,
                background: '#23272f',
                borderRadius: 12,
                border: '1px solid #333',
                padding: 24,
                boxShadow: '0 2px 16px rgba(0,0,0,0.15)',
                color: '#fff',
              }}>
                <h3 style={{ color: '#fff', marginTop: 0 }}>
                  {selectedEdge.type === 'co_published_with' ? (
                    <>
                      Papers where
                      {' '}
                      <span style={{ color: '#4F6AF6' }}>
                        {getNodeLabel(selectedEdge.target)}
                      </span>
                      {' '}
                      co-published with
                      {' '}
                      <span style={{ color: '#4F6AF6' }}>
                        {getNodeLabel(selectedEdge.source)}
                      </span>
                    </>
                  ) : (
                    <>
                      Papers co-authored by
                      {' '}
                      <span style={{ color: '#4F6AF6' }}>
                        {getNodeLabel(selectedEdge.source)}
                      </span>
                      {' '}
                      and
                      {' '}
                      <span style={{ color: '#4F6AF6' }}>
                        {getNodeLabel(selectedEdge.target)}
                      </span>
                    </>
                  )}
                </h3>
                {papersLoading && <div style={{ color: '#fff' }}>Loading papers...</div>}
                {papersError && <div style={{ color: '#ff6b6b' }}>{papersError}</div>}
                {conferenceLoading && <div style={{ color: '#fff', marginTop: 8 }}>Loading conference information...</div>}
                {!papersLoading && !papersError && (
                  <div style={{ maxWidth: 900, margin: '0 auto' }}>
                    {collabPapers.map(paper => {
                      const conferenceData = conferenceInfo[paper.doi];
                      console.log(`Paper: ${paper.display_name}, DOI: ${paper.doi}, Conference data:`, conferenceData);

                      // Extract author and institution information
                      const authorString = paper.authorships?.map(a => a.author.display_name).join(', ') || '';
                      const institutionList = paper.authorships
                        ? Array.from(new Set(paper.authorships.flatMap(a => a.institutions || []).map(inst => inst.display_name))).filter(Boolean)
                        : [];
                      const institutionString = institutionList.join(', ');
                      const publicationDate = paper.publication_date || paper.publication_year || '';
                      const journalName = paper.primary_location?.source?.display_name || '';

                      return (
                        <div key={paper.id} style={{
                          background: '#2a2a2a',
                          borderRadius: 12,
                          boxShadow: '0 2px 16px rgba(0,0,0,0.3)',
                          padding: 24,
                          marginBottom: 24,
                          border: '1px solid #404040'
                        }}>
                          <h3 style={{
                            margin: 0,
                            fontWeight: 700,
                            fontSize: '1.2rem',
                            color: '#fff'
                          }}>
                            <a
                              href={paper.id}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ color: '#fff', textDecoration: 'none' }}
                            >
                              {paper.display_name}
                            </a>
                          </h3>
                          {authorString && (
                            <div style={{
                              color: '#ccc',
                              margin: '8px 0'
                            }}>
                              {authorString}
                            </div>
                          )}
                          {institutionString && (
                            <div style={{
                              color: '#999',
                              marginBottom: 4
                            }}>
                              {institutionString}
                            </div>
                          )}
                          {journalName && (
                            <div style={{
                              color: '#999',
                              marginBottom: 4
                            }}>
                              {journalName}
                            </div>
                          )}
                          {publicationDate && (
                            <div style={{
                              color: '#999',
                              marginBottom: 4
                            }}>
                              {publicationDate}
                            </div>
                          )}
                          {conferenceData && (
                            <div style={{
                              marginTop: 12,
                              color: '#ddd',
                              background: '#1a1a1a',
                              padding: 12,
                              borderRadius: 8,
                              border: '1px solid #404040'
                            }}>
                              <div style={{ fontWeight: 600, color: '#4F6AF6', marginBottom: 8 }}>
                                Conference Information:
                              </div>
                              {conferenceData.event?.name && (
                                <div style={{ marginBottom: 4, color: '#ccc' }}>
                                  <strong>Conference:</strong> {conferenceData.event.name}
                                </div>
                              )}
                              {conferenceData.container && (
                                <div style={{ marginBottom: 4, color: '#ccc' }}>
                                  <strong>Journal/Proceedings:</strong> {conferenceData.container}
                                </div>
                              )}
                              {conferenceData.publisher && (
                                <div style={{ marginBottom: 4, color: '#ccc' }}>
                                  <strong>Publisher:</strong> {conferenceData.publisher}
                                </div>
                              )}
                              {conferenceData.type && (
                                <div style={{ color: '#ccc' }}>

                                </div>
                              )}
                              <div style={{
                                marginTop: 8,
                                padding: '8px 12px',
                                background: 'rgba(79, 106, 246, 0.1)',
                                borderRadius: 6,
                                border: '1px solid rgba(79, 106, 246, 0.3)',
                                fontSize: '0.9rem'
                              }}>
                                <span style={{ color: '#ccc', marginLeft: 4 }}>
                                  To check conference rankings, visit{' '}
                                  <a
                                    href="https://portal.core.edu.au/conf-ranks/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ color: '#4F6AF6', textDecoration: 'underline' }}
                                  >
                                    CORE Conference Rankings
                                  </a>
                                </span>
                              </div>
                            </div>
                          )}
                          {paper.doi && !conferenceData && !conferenceLoading && (
                            <div style={{
                              marginTop: 12,
                              fontSize: '0.9rem',
                              color: '#888',
                              fontStyle: 'italic',
                              background: '#1a1a1a',
                              padding: 12,
                              borderRadius: 8,
                              border: '1px solid #404040'
                            }}>
                              Conference information not available
                            </div>
                          )}

                          <div style={{
                            marginTop: 12,
                            display: 'flex',
                            gap: 16,
                            alignItems: 'center'
                          }}>

                            {paper.primary_location?.landing_page_url && (
                              <a
                                href={paper.primary_location.landing_page_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  color: '#4F6AF6',
                                  textDecoration: 'underline'
                                }}
                              >
                                View at Publisher
                              </a>
                            )}
                          </div>
                        </div>
                      );
                    })}
                    {collabPapers.length === 0 && (
                      <div style={{
                        textAlign: 'center',
                        margin: '2rem 0',
                        color: '#ccc',
                        background: '#2a2a2a',
                        border: '1px dashed #404040',
                        borderRadius: '8px',
                        padding: '2rem'
                      }}>
                        No papers found.
                      </div>
                    )}
                  </div>
                )}
                <button
                  onClick={() => setSelectedEdge(null)}
                  style={{
                    marginTop: 16,
                    padding: '8px 16px',
                    background: '#4F6AF6',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 6,
                    cursor: 'pointer',
                    fontSize: 14,
                  }}
                >
                  Close
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Disclaimer Box */}
      <ApiCallInfoBox
        userInputs={userInputs}
        apiCalls={apiCalls}
        darkMode={darkMode}
      />
      {showAuthorModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.9)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{
            background: '#222',
            border: '1px solid #ccc',
            borderRadius: 8,
            padding: '2rem',
            width: '90%',
            maxWidth: 600,
            maxHeight: '80vh',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ color: '#fff', margin: 0 }}>Select Author</h2>
              <button
                onClick={() => setShowAuthorModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#fff',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  padding: '0.5rem'
                }}
              >
                ×
              </button>
            </div>

            <input
              type="text"
              value={modalAuthorInput}
              onChange={async (e) => {
                const value = e.target.value;
                setModalAuthorInput(value);
                if (value.length >= 2) {
                  try {
                    const res = await fetch(`https://api.openalex.org/authors?search=${encodeURIComponent(value)}&per_page=20`);
                    const data = await res.json();
                    setModalAuthorSuggestions(data.results || []);
                  } catch {
                    setModalAuthorSuggestions([]);
                  }
                } else {
                  setModalAuthorSuggestions([]);
                }
              }}
              placeholder="Type to search authors..."
              style={{
                width: '100%',
                padding: '0.75rem',
                fontSize: 16,
                border: '1px solid #ccc',
                borderRadius: 4,
                background: '#333',
                color: '#fff',
                marginBottom: '1rem'
              }}
              autoFocus
            />

            <div style={{
              flex: 1,
              overflowY: 'auto',
              border: '1px solid #ccc',
              borderRadius: 4,
              background: '#333'
            }}>
              {/* Show selected author with delete option */}
              {selectedAuthor && (
                <div style={{
                  padding: '0.75rem 1rem',
                  background: '#4F6AF6',
                  color: '#fff',
                  borderBottom: '1px solid #555',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span>{selectedAuthor.display_name}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedAuthor(null);
                      setAuthorInput('');
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#6b7280',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      padding: 0,
                      width: '16px',
                      height: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '50%',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = '#dc3545';
                      e.target.style.color = '#fff';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'none';
                      e.target.style.color = '#6b7280';
                    }}
                    title="Remove author"
                  >
                    ×
                  </button>
                </div>
              )}

              {/* Show author suggestions */}
              {modalAuthorSuggestions.map((author) => (
                <div
                  key={author.id}
                  onClick={() => {
                    setSelectedAuthor(author);
                    setAuthorInput(author.display_name);
                    setShowAuthorModal(false);
                  }}
                  style={{
                    padding: '0.75rem 1rem',
                    cursor: 'pointer',
                    color: '#fff',
                    borderBottom: '1px solid #444',
                    transition: 'background 0.15s'
                  }}
                  onMouseEnter={(e) => e.target.style.background = '#444'}
                  onMouseLeave={(e) => e.target.style.background = 'transparent'}
                >
                  {author.display_name}
                  {author.h_index && (
                    <span style={{ color: '#888', marginLeft: '0.5rem' }}>
                      (H-index: {author.h_index})
                    </span>
                  )}
                </div>
              ))}
              {modalAuthorSuggestions.length === 0 && modalAuthorInput.length >= 2 && (
                <div style={{ padding: '1rem', color: '#888', textAlign: 'center' }}>
                  No authors found
                </div>
              )}
              {modalAuthorInput.length < 2 && (
                <div style={{ padding: '1rem', color: '#888', textAlign: 'center' }}>
                  Type at least 2 characters to search
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {showInstitutionModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.9)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{
            background: '#222',
            border: '1px solid #ccc',
            borderRadius: 8,
            padding: '2rem',
            width: '90%',
            maxWidth: 600,
            maxHeight: '80vh',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ color: '#fff', margin: 0 }}>Select Institution</h2>
              <button
                onClick={() => setShowInstitutionModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#fff',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  padding: '0.5rem'
                }}
              >
                ×
              </button>
            </div>

            <input
              type="text"
              value={modalInstitutionInput}
              onChange={async (e) => {
                const value = e.target.value;
                setModalInstitutionInput(value);
                if (value.length >= 2) {
                  try {
                    const res = await fetch(`https://api.openalex.org/institutions?search=${encodeURIComponent(value)}&per_page=20`);
                    const data = await res.json();
                    setModalInstitutionSuggestions(data.results || []);
                  } catch {
                    setModalInstitutionSuggestions([]);
                  }
                } else {
                  setModalInstitutionSuggestions([]);
                }
              }}
              placeholder="Type to search institutions..."
              style={{
                width: '100%',
                padding: '0.75rem',
                fontSize: 16,
                border: '1px solid #ccc',
                borderRadius: 4,
                background: '#333',
                color: '#fff',
                marginBottom: '1rem'
              }}
              autoFocus
            />

            <div style={{
              flex: 1,
              overflowY: 'auto',
              border: '1px solid #ccc',
              borderRadius: 4,
              background: '#333'
            }}>
              {/* Show selected institution with delete option */}
              {selectedInstitution && (
                <div style={{
                  padding: '0.75rem 1rem',
                  background: '#4F6AF6',
                  color: '#fff',
                  borderBottom: '1px solid #555',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span>{selectedInstitution.display_name}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedInstitution(null);
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#6b7280',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      padding: 0,
                      width: '16px',
                      height: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '50%',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = '#dc3545';
                      e.target.style.color = '#fff';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'none';
                      e.target.style.color = '#6b7280';
                    }}
                    title="Remove institution"
                  >
                    ×
                  </button>
                </div>
              )}

              {/* Show institution suggestions */}
              {modalInstitutionSuggestions.map((institution) => (
                <div
                  key={institution.id}
                  onClick={() => {
                    setSelectedInstitution(institution);
                    setShowInstitutionModal(false);
                  }}
                  style={{
                    padding: '0.75rem 1rem',
                    cursor: 'pointer',
                    color: '#fff',
                    borderBottom: '1px solid #444',
                    transition: 'background 0.15s'
                  }}
                  onMouseEnter={(e) => e.target.style.background = '#444'}
                  onMouseLeave={(e) => e.target.style.background = 'transparent'}
                >
                  {institution.display_name}
                </div>
              ))}
              {modalInstitutionSuggestions.length === 0 && modalInstitutionInput.length >= 2 && (
                <div style={{ padding: '1rem', color: '#888', textAlign: 'center' }}>
                  No institutions found
                </div>
              )}
              {modalInstitutionInput.length < 2 && (
                <div style={{ padding: '1rem', color: '#888', textAlign: 'center' }}>
                  Type at least 2 characters to search
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GraphViewLight;
