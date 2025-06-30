import { useState } from 'react';
import PageLayout from '../../components/shared/PageLayout/PageLayout';
import InstitutionDropdown from '../../components/shared/InstitutionDropdown/InstitutionDropdown';

const GraphViewLight = ({ darkMode, toggleDarkMode }) => {
  const [selectedInstitution, setSelectedInstitution] = useState(null);

  return (
    <PageLayout darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
      <div style={{ padding: 'var(--spacing-xl)' }}>
        <h2 style={{ marginBottom: '1.5rem' }}>Collaboration Network</h2>
        <InstitutionDropdown
          value={selectedInstitution}
          onChange={setSelectedInstitution}
          label="Select Institution"
        />
        {/* Collaboration network graph would go here, filtered by selectedInstitution */}
        {selectedInstitution && (
          <div style={{ marginTop: '2rem' }}>
            <strong>Selected Institution:</strong> {selectedInstitution.display_name}
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default GraphViewLight;
