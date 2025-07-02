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
  const inputRef = useRef(null);
  const fgRef = useRef();

  // Set longer link distance when graphData changes
  useEffect(() => {
    if (fgRef.current) {
      fgRef.current.d3Force('link').distance(200);
    }
  }, [graphData]);

  // Only generate the graph when triggerSearch changes and selectedInstitution is set
  useEffect(() => {
    if (!selectedInstitution && !triggerSearch) return;
    if (!triggerSearch) return;
    setLoading(true);
    setError(null);

    const fetchInstitutionId = async () => {
      if (!selectedInstitution.id) {
        const res = await fetch(`https://api.openalex.org/institutions?search=${encodeURIComponent(selectedInstitution.display_name)}`);
        const data = await res.json();
        return data.results[0]?.id?.split('/').pop();
      }
      return selectedInstitution.id.split('/').pop();
    };

    // Fetch top collaborators using group_by
    const fetchTopCollaborators = async (institutionId) => {
      const filterParts = [`authorships.institutions.id:${institutionId}`];
      if (searchTerm.trim()) {
        filterParts.push(`title_and_abstract.search:${encodeURIComponent(searchTerm.trim())}`);
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
      // OpenAlex supports batch fetching with id filter
      const res = await fetch(`https://api.openalex.org/institutions?filter=id:${ids.map(id => 'I' + id).join('|')}`);
      const data = await res.json();
      return data.results || [];
    };

    const fetchAndBuild = async () => {
      try {
        const institutionId = await fetchInstitutionId();
        const topCollaborators = await fetchTopCollaborators(institutionId);
        const collaboratorIds = topCollaborators.map(c => c.key.split('/').pop());
        const collaboratorDetails = await fetchInstitutionDetails(collaboratorIds);
        // Build nodes and links
        const nodes = [
          { id: institutionId, label: selectedInstitution.display_name, type: 'institution', main: true },
          ...collaboratorDetails
            .filter(inst => inst.id.split('/').pop() !== institutionId)
            .map(inst => ({ id: inst.id.split('/').pop(), label: inst.display_name, type: 'institution' }))
        ];
        const links = topCollaborators.map(c => ({ source: institutionId, target: c.key.split('/').pop(), value: c.count }));
        setGraphData({ nodes, links });
      } catch (e) {
        setError('Failed to fetch collaborators or build graph.');
      } finally {
        setLoading(false);
      }
    };

    fetchAndBuild();
    // Reset triggerSearch so user can search again
    // (prevents effect from running again unless explicitly triggered)
    // eslint-disable-next-line
    setTriggerSearch(false);
  }, [triggerSearch]);

  // Handle Enter key in search input
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      setTriggerSearch(s => !s);
    }
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
        <button onClick={() => setTriggerSearch(s => !s)} style={{ marginLeft: 12, padding: '10px 24px', fontSize: 16, borderRadius: 6, background: '#1976d2', color: '#fff', border: 'none', cursor: 'pointer', boxShadow: '0 2px 8px rgba(25, 118, 210, 0.08)' }}>Search</button>
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
                ctx.fillStyle = '#1976d2';
                ctx.beginPath();
                ctx.arc(node.x, node.y, 8, 0, 2 * Math.PI, false);
                ctx.shadowColor = '#1976d2';
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
                <div><strong>With:</strong> {graphData.nodes.find(n => n.id === hoverLink.target)?.label}</div>
              </div>
            )}
            {/* Legend */}
          </div>
        )}
        {!loading && !error && selectedInstitution && graphData.nodes.length <= 1 && (
          <div style={{ marginTop: '2rem' }}>No collaborators found for this institution.</div>
        )}
      </div>
    </PageLayout>
  );
};

export default GraphViewLight;
