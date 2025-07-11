import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LandingPageLight } from './pages/light_mode/landing_light';
import SearchPageLight from './pages/light_mode/search_light';
import { AboutPage } from './pages/light_mode/about_light';
import { PositionDetailLight } from './pages/light_mode/position_detail_light';
import GraphViewLight from './pages/light_mode/graph_view_light';
import WorldMapPapersPage from './pages/light_mode/WorldMapPapersPage';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

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
            <Route path="/search" element={<SearchPageLight darkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />} />
            <Route path="/graph-view" element={<GraphViewLight darkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />} />
            <Route path="/about" element={<AboutPage darkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />} />
            <Route path="/trends" element={<PositionDetailLight darkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />} />
            <Route path="/world-map" element={<WorldMapPapersPage darkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;