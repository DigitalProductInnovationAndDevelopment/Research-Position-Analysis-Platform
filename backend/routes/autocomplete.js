const express = require('express');
const axios = require('axios');
const router = express.Router();

const OPENALEX_API_BASE = 'https://api.openalex.org';
const OPENALEX_HEADERS = {
  'User-Agent': 'Research-Position-Analysis-Platform/1.0 (https://github.com/your-repo; mailto:your-email@example.com)',
  'Accept': 'application/json'
};

// Mock data for demonstration
const mockData = {
  author: [
    { id: 1, display_name: 'Alice Smith' },
    { id: 2, display_name: 'Albert Johnson' },
    { id: 3, display_name: 'Alicia Brown' },
    { id: 4, display_name: 'Alex Lee' },
    { id: 5, display_name: 'Alfred White' },
    { id: 6, display_name: 'Alison Green' },
    { id: 7, display_name: 'Alan Black' },
    { id: 8, display_name: 'Alexa Grey' },
    { id: 9, display_name: 'Alvin Blue' },
    { id: 10, display_name: 'Alana Red' },
    { id: 11, display_name: 'Alfreda Yellow' },
  ],
  institution: [
    { id: 1, display_name: 'MIT' },
    { id: 2, display_name: 'Stanford University' },
    { id: 3, display_name: 'Harvard University' },
    { id: 4, display_name: 'Caltech' },
    { id: 5, display_name: 'Oxford University' },
    { id: 6, display_name: 'Cambridge University' },
    { id: 7, display_name: 'ETH Zurich' },
    { id: 8, display_name: 'Imperial College London' },
    { id: 9, display_name: 'UCLA' },
    { id: 10, display_name: 'UC Berkeley' },
  ],
  funding: [
    { id: 1, display_name: 'NSF' },
    { id: 2, display_name: 'NIH' },
    { id: 3, display_name: 'DOE' },
    { id: 4, display_name: 'NASA' },
    { id: 5, display_name: 'DARPA' },
    { id: 6, display_name: 'ERC' },
    { id: 7, display_name: 'DFG' },
    { id: 8, display_name: 'EPSRC' },
    { id: 9, display_name: 'Wellcome Trust' },
    { id: 10, display_name: 'Gates Foundation' },
  ],
  topic: [
    { id: 1, display_name: 'Artificial Intelligence' },
    { id: 2, display_name: 'Quantum Computing' },
    { id: 3, display_name: 'Machine Learning' },
    { id: 4, display_name: 'Data Science' },
    { id: 5, display_name: 'Robotics' },
    { id: 6, display_name: 'Bioinformatics' },
    { id: 7, display_name: 'Cybersecurity' },
    { id: 8, display_name: 'Nanotechnology' },
    { id: 9, display_name: 'Renewable Energy' },
    { id: 10, display_name: 'Genomics' },
  ],
};

router.get('/', async (req, res) => {
  const { query = '', type = 'author' } = req.query;

  if (type === 'author' && query.length >= 2) {
    try {
      const url = `${OPENALEX_API_BASE}/authors`;
      const params = { search: query, per_page: 10 };
      const response = await axios.get(url, { params, headers: OPENALEX_HEADERS });
      const data = response.data;
      const results = (data.results || []).map(author => ({
        id: author.id,
        display_name: author.display_name
      }));
      return res.json({ results });
    } catch (err) {
      return res.status(500).json({ results: [], error: 'Failed to fetch from OpenAlex' });
    }
  }

  if (type === 'institution' && query.length >= 1) {
    try {
      // Use OpenAlex autocomplete endpoint for better partial matching
      const url = `${OPENALEX_API_BASE}/autocomplete`;
      const params = { 
        q: query,
        mailto: 'team@ourresearch.org'
      };
      const response = await axios.get(url, { params, headers: OPENALEX_HEADERS });
      const data = response.data;
      
      // Filter results to only include institutions
      const institutionResults = (data.results || [])
        .filter(item => item.entity_type === 'institution')
        .map(inst => ({
          id: inst.id,
          display_name: inst.display_name
        }));
      
      return res.json({ results: institutionResults });
    } catch (err) {
      console.error('OpenAlex autocomplete error:', err.message);
      return res.status(500).json({ results: [], error: 'Failed to fetch from OpenAlex autocomplete' });
    }
  }

  if (type === 'keyword' && query.length >= 2) {
    try {
      const url = `${OPENALEX_API_BASE}/concepts`;
      const params = { search: query, per_page: 10 };
      const response = await axios.get(url, { params, headers: OPENALEX_HEADERS });
      const data = response.data;
      const results = (data.results || []).map(concept => ({
        id: concept.id,
        display_name: concept.display_name
      }));
      return res.json({ results });
    } catch (err) {
      return res.status(500).json({ results: [], error: 'Failed to fetch from OpenAlex' });
    }
  }

  // fallback to mock data for other types
  const data = mockData[type] || [];
  const results = data.filter(item =>
    item.display_name.toLowerCase().includes(query.toLowerCase())
  );
  res.json({ results });
});

module.exports = router;
