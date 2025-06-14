import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LandingPageLight } from './pages/light_mode/landing_light';
import { SearchPageLight } from './pages/light_mode/search_light';
import { AggregationAnalysisLight } from './pages/light_mode/aggregation_analysis_light';
import { AboutPage } from './pages/light_mode/about_light';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('dark');
  };

  return (
    <Router>
      <div className={`app ${isDarkMode ? 'dark' : ''}`}>
        <main className="main-content">
          <Routes>
            <Route path="/" element={<LandingPageLight darkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />} />
            <Route path="/search" element={<SearchPageLight darkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />} />
            <Route path="/graph-view" element={<AggregationAnalysisLight darkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />} />
            <Route path="/about" element={<AboutPage darkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App; 