import { useState, useEffect, useRef } from 'react';
import PageLayout from '../../components/shared/PageLayout/PageLayout';
import InstitutionDropdown from '../../components/shared/InstitutionDropdown/InstitutionDropdown';
import ForceGraph2D from 'react-force-graph-2d';

const GraphViewLight = ({ darkMode, toggleDarkMode }) => {
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
  const inputRef = useRef(null);
  const fgRef = useRef();
  const [selectedEdge, setSelectedEdge] = useState(null);
  const [collabPapers, setCollabPapers] = useState([]);
  const [papersLoading, setPapersLoading] = useState(false);
  const [papersError, setPapersError] = useState(null);

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

  // Handle journal selection from suggestions
  const handleJournalSelect = (displayName) => {
    const found = journalSuggestions.find(j => j.display_name === displayName);
    if (found) {
      setSelectedJournal(found);
      setJournalInput(found.display_name);
    } else {
      setSelectedJournal(null);
      setJournalInput(displayName);
    }
  };

  // Only generate the graph when triggerSearch changes and selectedInstitution is set
  useEffect(() => {
    if (!selectedInstitution || !triggerSearch) return;
    setLoading(true);
    setError(null);

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
      const res = await fetch(
        `https://api.openalex.org/works?filter=${filterString}&group_by=authorships.institutions.id&per_page=200`
      );
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
      const res = await fetch(`https://api.openalex.org/institutions?filter=id:${ids.map(id => 'I' + id).join('|')}`);
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
        const res = await fetch(
          `https://api.openalex.org/works?filter=${filterString}&per_page=${perPage}&page=${page}`
        );
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
        // If a journal is selected, only show filtered collaborations
        if (selectedJournal && selectedJournal.id) {
          // Build nodes and links as before, but filtered by journal
          const nodes = [
            { id: institutionId, label: selectedInstitution.display_name, type: 'institution', main: true },
            ...collaboratorDetails
              .filter(inst => inst.id.split('/').pop() !== institutionId)
              .map(inst => ({ id: inst.id.split('/').pop(), label: inst.display_name, type: 'institution' }))
          ];
          const links = topCollaborators.map(c => ({ source: institutionId, target: c.key.split('/').pop(), value: c.count }));
          setGraphData({ nodes, links });
        } else {
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
        }
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
    <PageLayout darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
      <div style={{ padding: 'var(--spacing-xl)' }}>
        <h2 style={{ marginBottom: '1.5rem' }}>Collaboration Network</h2>
        <InstitutionDropdown
          value={selectedInstitution}
          onChange={setSelectedInstitution}
          label="Select Institution"
        />
        {/* Journal Dropdown */}
        <div style={{ marginBottom: 16, maxWidth: 400 }}>
          <label style={{ fontWeight: 600, marginBottom: 4, display: 'block' }}>Filter by Journal (optional)</label>
          <input
            type="text"
            value={journalInput}
            onChange={e => {
              setJournalInput(e.target.value);
              setSelectedJournal(null);
            }}
            placeholder="Type to search journals..."
            style={{ width: '100%', padding: 8, fontSize: 16, borderRadius: 6, border: '1px solid #ccc', background: '#f9f9f9' }}
            list="journal-suggestions"
            onBlur={e => handleJournalSelect(e.target.value)}
          />
          <datalist id="journal-suggestions">
            {journalSuggestions.map(j => (
              <option key={j.id} value={j.display_name} />
            ))}
          </datalist>
        </div>
        {selectedInstitution && (
          <div style={{ marginTop: '2rem' }}>
            <strong>Selected Institution:</strong> {selectedInstitution.display_name}
          </div>
        )}
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter keyword to filter papers..."
          style={{ marginBottom: 16, width: 350, padding: 10, fontSize: 16, borderRadius: 6, border: '1px solid #ccc', background: '#f9f9f9' }}
        />
        <button
          onClick={() => setTriggerSearch(s => !s)}
          disabled={!selectedInstitution}
          style={{
            marginLeft: 12,
            padding: '10px 24px',
            fontSize: 16,
            borderRadius: 6,
            background: !selectedInstitution ? '#ccc' : '#1976d2',
            color: '#fff',
            border: 'none',
            cursor: !selectedInstitution ? 'not-allowed' : 'pointer',
            boxShadow: '0 2px 8px rgba(25, 118, 210, 0.08)'
          }}
        >
          Search
        </button>
        {loading && <div style={{ marginTop: '2rem' }}>Loading...</div>}
        {error && <div style={{ marginTop: '2rem', color: 'red' }}>{error}</div>}
        {!loading && !error && graphData.nodes.length > 1 && (
          <div style={{
            height: 800,
            width: '100%',
            minWidth: 900,
            marginTop: '2rem',
            background: 'linear-gradient(135deg, #f8fafc 0%, #e3eafc 100%)',
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
                ctx.fillStyle = '#222';
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
          <div style={{ marginTop: 32, background: '#fff', borderRadius: 8, padding: 24, boxShadow: '0 2px 8px #ccc' }}>
            <h3>
              Papers co-authored by
              {' '}
              <span style={{ color: '#1976d2' }}>
                {getNodeLabel(selectedEdge.source)}
              </span>
              {' '}
              and
              {' '}
              <span style={{ color: '#1976d2' }}>
                {getNodeLabel(selectedEdge.target)}
              </span>
            </h3>
            {papersLoading && <div>Loading papers...</div>}
            {papersError && <div style={{ color: 'red' }}>{papersError}</div>}
            {!papersLoading && !papersError && (
              <ul style={{ marginTop: 16 }}>
                {collabPapers.map(paper => (
                  <li key={paper.id} style={{ marginBottom: 12 }}>
                    <a href={paper.id} target="_blank" rel="noopener noreferrer">
                      {paper.display_name}
                    </a>
                    {paper.publication_year && <> ({paper.publication_year})</>}
                  </li>
                ))}
                {collabPapers.length === 0 && <li>No papers found.</li>}
              </ul>
            )}
            <button onClick={() => setSelectedEdge(null)} style={{ marginTop: 16 }}>Close</button>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default GraphViewLight;
