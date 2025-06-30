const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const { search = '', page = 1, per_page = 20 } = req.query;
  try {
    const params = new URLSearchParams({
      page,
      per_page,
    });
    if (search) params.append('search', search);
    const url = `https://api.openalex.org/institutions?${params.toString()}`;
    const response = await fetch(url);
    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to fetch institutions from OpenAlex' });
    }
    const data = await response.json();
    res.json({ results: data.results.map(inst => ({ id: inst.id, display_name: inst.display_name })) });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
