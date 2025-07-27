import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LandingPageLight } from './pages/landing_light';
import SearchPageLight from './pages/search_light';
import { AboutPage } from './pages/about_light';
import { PositionDetailLight } from './pages/position_detail_light';
import GraphViewLight from './pages/graph_view_light';
import WorldMapPapersPage from './pages/WorldMapPapersPage';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('dark');
  };

  return (
    <Router>
      <div className={`app ${isDarkMode ? 'dark' : ''}`}>
        <main>
          <Routes>
            <Route path="/" element={<LandingPageLight darkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />} />
            <Route path="/search" element={<SearchPageLight darkMode={isDarkMode} />} />
            <Route path="/graph-view" element={<GraphViewLight darkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />} />
            <Route path="/about" element={<AboutPage darkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />} />
            <Route path="/trends" element={<PositionDetailLight darkMode={true} />} />
            <Route path="/world-map" element={<WorldMapPapersPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;