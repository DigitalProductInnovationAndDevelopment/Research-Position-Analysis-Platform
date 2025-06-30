const express = require('express');
const router = express.Router();

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

router.get('/', (req, res) => {
  const { query = '', type = 'author' } = req.query;
  const data = mockData[type] || [];
  const results = data.filter(item =>
    item.display_name.toLowerCase().includes(query.toLowerCase())
  );
  res.json({ results });
});

module.exports = router;
