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
  const [selectedJournal, setSelectedJournal] = useState(null);
  const [journalInput, setJournalInput] = useState('');
  const [journalSuggestions, setJournalSuggestions] = useState([]);
  const [showJournalModal, setShowJournalModal] = useState(false);
  const [modalJournalInput, setModalJournalInput] = useState('');
  const [modalJournalSuggestions, setModalJournalSuggestions] = useState([]);
  const inputRef = useRef(null);
  const fgRef = useRef();
  const [selectedEdge, setSelectedEdge] = useState(null);
  const [collabPapers, setCollabPapers] = useState([]);
  const [papersLoading, setPapersLoading] = useState(false);
  const [papersError, setPapersError] = useState(null);
  const [showInstitutionModal, setShowInstitutionModal] = useState(false);
  const [modalInstitutionInput, setModalInstitutionInput] = useState('');
  const [modalInstitutionSuggestions, setModalInstitutionSuggestions] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [showJournalsInGraph, setShowJournalsInGraph] = useState(true);

  // Disclaimer state
  const [userInputs, setUserInputs] = useState([]);
  const [apiCalls, setApiCalls] = useState([]);

  // Set longer link distance when graphData changes
  useEffect(() => {
    if (fgRef.current) {
      fgRef.current.d3Force('link').distance(200);
    }
  }, [graphData]);

  // Journal autocomplete suggestions
  useEffect(() => {
    const fetchJournals = async () => {
      if (journalInput.length < 2) {
        setJournalSuggestions([]);
        return;
      }
      try {
        const res = await fetch(`https://api.openalex.org/sources?filter=type:journal&search=${encodeURIComponent(journalInput)}&per_page=10`);
        const data = await res.json();
        setJournalSuggestions(data.results || []);
      } catch {
        setJournalSuggestions([]);
      }
    };
    fetchJournals();
  }, [journalInput]);


  // Only generate the graph when triggerSearch changes and selectedInstitution is set
  useEffect(() => {
    if (!selectedInstitution || !triggerSearch) return;
    setLoading(true);
    setError(null);

    // Track user inputs for disclaimer
    const inputs = [];
    if (selectedInstitution && selectedInstitution.display_name) inputs.push({ category: 'Institution', value: selectedInstitution.display_name });
    if (searchTerm.trim()) inputs.push({ category: 'Keyword', value: searchTerm.trim() });
    if (selectedJournal && selectedJournal.display_name) inputs.push({ category: 'Journal', value: selectedJournal.display_name });
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
      if (selectedJournal && selectedJournal.id) {
        // Use OpenAlex source id for journal filter
        const sourceId = selectedJournal.id.split('/').pop();
        filterParts.push(`primary_location.source.id:${sourceId}`);
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

    // Fetch all works for the institution (and optionally journal filter)
    const fetchWorks = async (institutionId, collaboratorIds) => {
      let filterParts = [`authorships.institutions.id:${institutionId}`];
      if (searchTerm.trim()) {
        filterParts.push(`title_and_abstract.search:${encodeURIComponent(searchTerm.trim())}`);
      }
      if (selectedJournal && selectedJournal.id) {
        const sourceId = selectedJournal.id.split('/').pop();
        filterParts.push(`primary_location.source.id:${sourceId}`);
      }
      // Only fetch works for top collaborators
      if ((!selectedJournal || !selectedJournal.id) && collaboratorIds.length > 0) {
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
        if (showJournalsInGraph) {
          // No journal selected: show top 10 collaborators and all unique sources as nodes
          const works = await fetchWorks(institutionId, collaboratorIds);
          // Collect all unique sources from works
          const sourceMap = new Map(); // id -> display_name
          works.forEach(work => {
            (work.locations || []).forEach(loc => {
              if (loc.source && loc.source.id && loc.source.display_name) {
                sourceMap.set(loc.source.id, loc.source.display_name);
              }
            });
          });
          // Build institution nodes
          const nodes = [
            { id: institutionId, label: selectedInstitution.display_name, type: 'institution', main: true },
            ...collaboratorDetails
              .filter(inst => inst.id.split('/').pop() !== institutionId)
              .map(inst => ({ id: inst.id.split('/').pop(), label: inst.display_name, type: 'institution' })),
            ...Array.from(sourceMap.entries()).map(([id, label]) => ({ id, label, type: 'source' }))
          ];
          // Build links: institution-to-institution and institution-to-source
          const links = [
            ...topCollaborators.map(c => ({ source: institutionId, target: c.key.split('/').pop(), value: c.count })),
          ];
          // Add institution-to-source links
          works.forEach(work => {
            const instIds = work.authorships?.flatMap(auth => auth.institutions.map(inst => inst.id.split('/').pop())) || [];
            (work.locations || []).forEach(loc => {
              if (loc.source && loc.source.id) {
                instIds.forEach(instId => {
                  if (instId === institutionId || collaboratorIds.includes(instId)) {
                    links.push({ source: instId, target: loc.source.id, value: 1, type: 'published_in' });
                  }
                });
              }
            });
          });
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

  return (
    <>
      <TopBar />
      <div style={{ background: '#000', minHeight: '100vh', paddingBottom: 40 }} className={darkMode ? 'dark' : ''}>
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
          }}
        >
          <Orb
            hoverIntensity={0.5}
            rotateOnHover={true}
            hue={0}
            forceHoverState={false}
          />
        </div>

        {/* Main content */}
        <div style={{ position: 'relative', zIndex: 1 }}>
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
              paddingTop: '2rem',
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
                fontSize: '1rem',
                textAlign: 'center',
                maxWidth: 400,
                margin: '0 auto',
                lineHeight: 1.5,
                fontWeight: 700,
                fontFamily: 'inherit',
                textShadow: '0 2px 16px #000',
              }}
            >
              Show insights into collaborative networks formed through scholarly publications.
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
                  <label style={{ fontWeight: 600, color: '#fff' }}>Select Institution</label>
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
                    <span style={{ color: '#888', marginLeft: '0.5rem' }}>▼</span>
                  </div>
                </div>
              </div>
              {/* Journal Dropdown */}
              <div style={{ marginBottom: 8, width: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                <label style={{ fontWeight: 600, color: '#fff' }}>Filter by Journal (optional)</label>
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
                    setShowJournalModal(true);
                    setModalJournalInput('');
                    setModalJournalSuggestions([]);
                  }}
                >
                  <span style={{
                    color: journalInput ? '#fff' : '#888',
                    fontSize: 16,
                    flex: 1
                  }}>
                    {journalInput || "Click to search journals..."}
                  </span>
                  <span style={{ color: '#888', marginLeft: '0.5rem' }}>▼</span>
                </div>
              </div>
              {/* Keyword input and search button */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
                <label style={{ fontWeight: 600, marginBottom: 4, display: 'block', color: '#fff' }}>Search by Keyword</label>
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
                  disabled={!selectedInstitution}
                  style={{
                    padding: '10px 24px',
                    fontSize: 16,
                    borderRadius: 6,
                    background: !selectedInstitution ? '#ccc' : '#4F6AF6',
                    color: '#fff',
                    border: 'none',
                    cursor: !selectedInstitution ? 'not-allowed' : 'pointer',
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
                    setShowJournalsInGraph(!showJournalsInGraph);
                    setTriggerSearch(s => !s);
                  }}
                  style={{
                    width: 50,
                    height: 24,
                    backgroundColor: showJournalsInGraph ? '#4F6AF6' : '#666',
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
                      left: showJournalsInGraph ? 29 : 3,
                      transition: 'left 0.3s ease',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    }}
                  />
                </div>
                <label htmlFor="showJournals" style={{ color: '#fff', fontWeight: 600, cursor: 'pointer' }}>
                  Show Journals in Graph
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
                      if (node.type === 'source') {
                        fill = '#8e24aa'; // purple for journals/sources
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
                    onLinkClick={async (link) => {
                      setSelectedEdge(link);
                      setPapersLoading(true);
                      setPapersError(null);
                      setCollabPapers([]);
                      try {
                        // Build the filter for both institutions (selected and collaborator)
                        const getLineageId = (node) => {
                          const id = typeof node === 'object' ? node.id : node;
                          const cleanId = id.replace('https://openalex.org/I', '').replace(/^I/, '');
                          return cleanId.startsWith('i') ? cleanId : `i${cleanId}`;
                        };
                        const sourceLineage = getLineageId(link.source);
                        const targetLineage = getLineageId(link.target);
                        const filterParts = [
                          `authorships.institutions.lineage:${sourceLineage}`,
                          `authorships.institutions.lineage:${targetLineage}`
                        ];
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
                            `https://api.openalex.org/works?filter=${filterString}&per_page=${perPage}&page=${page}`
                          );
                          const data = await res.json();
                          allPapers = allPapers.concat(data.results || []);
                          hasMore = data.results && data.results.length === perPage;
                          page++;
                        }
                        setCollabPapers(allPapers);
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
                      <div><strong>Collaborations:</strong> {hoverLink.value}</div>
                      <div><strong>With:</strong> {getNodeLabel(hoverLink.target)}</div>
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
                  </h3>
                  {papersLoading && <div style={{ color: '#fff' }}>Loading papers...</div>}
                  {papersError && <div style={{ color: '#ff6b6b' }}>{papersError}</div>}
                  {!papersLoading && !papersError && (
                    <ul style={{ marginTop: 16, color: '#fff' }}>
                      {collabPapers.map(paper => (
                        <li key={paper.id} style={{ marginBottom: 12 }}>
                          <a
                            href={paper.id}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: '#4F6AF6', textDecoration: 'none' }}
                          >
                            {paper.display_name}
                          </a>
                          {paper.publication_year && <span style={{ color: '#ccc' }}> ({paper.publication_year})</span>}
                        </li>
                      ))}
                      {collabPapers.length === 0 && <li style={{ color: '#ccc' }}>No papers found.</li>}
                    </ul>
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
        {showJournalModal && (
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
                <h2 style={{ color: '#fff', margin: 0 }}>Select Journal</h2>
                <button
                  onClick={() => setShowJournalModal(false)}
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
                value={modalJournalInput}
                onChange={async (e) => {
                  const value = e.target.value;
                  setModalJournalInput(value);
                  if (value.length >= 2) {
                    try {
                      const res = await fetch(`https://api.openalex.org/sources?filter=type:journal&search=${encodeURIComponent(value)}&per_page=20`);
                      const data = await res.json();
                      setModalJournalSuggestions(data.results || []);
                    } catch {
                      setModalJournalSuggestions([]);
                    }
                  } else {
                    setModalJournalSuggestions([]);
                  }
                }}
                placeholder="Type to search journals..."
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
                {modalJournalSuggestions.map((journal) => (
                  <div
                    key={journal.id}
                    onClick={() => {
                      setSelectedJournal(journal);
                      setJournalInput(journal.display_name);
                      setShowJournalModal(false);
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
                    {journal.display_name}
                  </div>
                ))}
                {modalJournalSuggestions.length === 0 && modalJournalInput.length >= 2 && (
                  <div style={{ padding: '1rem', color: '#888', textAlign: 'center' }}>
                    No journals found
                  </div>
                )}
                {modalJournalInput.length < 2 && (
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
    </>
  );
};

export default GraphViewLight;
