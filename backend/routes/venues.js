const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

// GET /api/venues?search=...
router.get('/', async (req, res) => {
  const { search } = req.query;
  try {
    // OpenAlex venues endpoint
    // See: https://docs.openalex.org/api-entities/venues/get-lists-of-venues
    let url = 'https://api.openalex.org/venues?per_page=20';
    if (search) {
      url += `&search=${encodeURIComponent(search)}`;
    }
    const response = await fetch(url);
    const data = await response.json();
    // TODO: Using display_name for filtering is less precise than using OpenAlex IDs.
    const venues = (data.results || []).map(v => ({
      id: v.id,
      display_name: v.display_name
    }));
    res.json({ venues });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch venues from OpenAlex.' });
  }
});

module.exports = router; 