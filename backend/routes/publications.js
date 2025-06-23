const express = require('express');
const router = express.Router();
const axios = require('axios');

const OPENALEX_API_BASE = 'https://api.openalex.org';

// Common headers for OpenAlex API calls
const OPENALEX_HEADERS = {
    'User-Agent': 'Research-Position-Analysis-Platform/1.0 (https://github.com/your-repo; mailto:your-email@example.com)',
    'Accept': 'application/json'
};

//get all publications
router.get('/', async (req, res) => {
    try {
        const { search, page = 1, per_page = 25 } = req.query;
        const url = `${OPENALEX_API_BASE}/works`;

        const params = {
            page,
            per_page,
            ...(search && { search })
        };

        const response = await axios.get(url, { 
            params,
            headers: OPENALEX_HEADERS
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching publications:', error);
        res.status(500).json({
            error: 'Failed to fetch publications',
            details: error.message
        });
    }
});

// Advanced search publications
router.get('/search', async (req, res) => {
    try {
        let {
            filter = '',
            sort = 'relevance_score:desc',
            page = 1,
            per_page = 25
        } = req.query;

        // Fix: Convert filter from search:"..." to title_and_abstract.search:...
        if (typeof filter === 'string' && filter.startsWith('search:"')) {
            const match = filter.match(/^search:"(.+)"$/);
            if (match) {
                const query = match[1];
                filter = `title_and_abstract.search:${query}`;
            }
        }

        // If filter does not contain any .search: field, do not use relevance_score sort
        let effectiveSort = sort;
        if (!filter.includes('.search:') && sort === 'relevance_score:desc') {
            effectiveSort = 'publication_year:desc';
        }

        // Initialize params for OpenAlex API
        const params = {
            page: parseInt(page),
            per_page: parseInt(per_page),
            sort: effectiveSort,
            filter
        };

        const url = `${OPENALEX_API_BASE}/works`;

        console.log('OpenAlex API Request:', { url, params }); // Debug log

        try {
            const response = await axios.get(url, {
                params,
                headers: OPENALEX_HEADERS,
                paramsSerializer: params => {
                    return require('qs').stringify(params, {
                        arrayFormat: 'repeat',
                        encode: false // Don't encode the filter parameter
                    })
                }
            });

            // Format the response to include citation counts
            const formattedResults = response.data.results.map(work => ({
                ...work,
                citation_count: work.cited_by_count || 0
            }));

            // Return the formatted results
            res.json({
                ...response.data,
                results: formattedResults
            });
        } catch (error) {
            console.error('OpenAlex API Error:', error.response?.data || error.message);
            res.status(500).json({
                error: 'Failed to fetch from OpenAlex API',
                details: error.response?.data || error.message
            });
        }
    } catch (error) {
        console.error('Server Error:', error);
        res.status(500).json({
            error: 'Internal server error',
            details: error.message
        });
    }
});

// Keyword trends endpoint using title and abstract search filtering
router.get('/keyword_trends', async (req, res) => {
    try {
        const {
            years = 5,
            limit = 10,
            keyword = '',
            start_date,
            end_date
        } = req.query;

        const validatedLimit = Math.min(Math.max(parseInt(limit), 5), 20);
        const currentYear = new Date().getFullYear();

        const startYear = start_date ? new Date(start_date).getFullYear() : currentYear - parseInt(years);
        const endYear = end_date ? new Date(end_date).getFullYear() : currentYear;

        const startDate = start_date || `${startYear}-01-01`;
        const endDate = end_date || `${endYear}-12-31`;

        let worksRes;
        try {
            console.log(`Using title and abstract search for "${keyword}"`);
            worksRes = await axios.get(`${OPENALEX_API_BASE}/works`, {
                params: {
                    filter: `title_and_abstract.search:"${keyword}",from_publication_date:${startDate},to_publication_date:${endDate}`,
                    group_by: 'publication_year'
                },

            });
        } catch (e) {
            console.error('Error fetching works:', e.message);
            if (e.response?.status === 403) {
                return res.status(500).json({
                    error: 'OpenAlex API rate limit exceeded',
                    details: 'Please try again in a few minutes or contact support if the issue persists.',
                    search_method: 'title_abstract'
                });
            }
            return res.status(500).json({
                error: 'OpenAlex API error',
                details: e.message,
                search_method: 'title_abstract'
            });
        }

        const data = worksRes?.data;
        const groupResults = data?.group_by?.length ? data.group_by : data?.results;
        if (!groupResults || !Array.isArray(groupResults)) {
            return res.status(500).json({
                error: 'OpenAlex API error',
                details: 'Unexpected API response structure'
            });
        }

        const yearly_distribution = {};
        for (let y = startYear; y <= endYear; y++) {
            yearly_distribution[y] = 0;
        }

        groupResults.forEach(entry => {
            const year = parseInt(entry.key);
            if (year >= startYear && year <= endYear) {
                yearly_distribution[year] = entry.count;
            }
        });

        const sortedYears = Object.keys(yearly_distribution).map(Number).sort((a, b) => a - b);
        const maxReliableYear = currentYear - 1;

        const growthRates = [];
        for (let i = 1; i < sortedYears.length; i++) {
            const prevYear = sortedYears[i - 1];
            const currYear = sortedYears[i];
            if (currYear > maxReliableYear) continue;
            const prev = yearly_distribution[prevYear];
            const curr = yearly_distribution[currYear];
            if (prev > 0) {
                growthRates.push({
                    year: currYear,
                    rate: ((curr - prev) / prev) * 100
                });
            }
        }

        const avgGrowth = growthRates.length ? growthRates.reduce((sum, g) => sum + g.rate, 0) / growthRates.length : 0;

        const recentYears = sortedYears.filter(y => y <= maxReliableYear).slice(-3);
        const recentTotal = recentYears.reduce((sum, y) => sum + yearly_distribution[y], 0);
        const recentAvg = recentTotal / recentYears.length || 1;
        const currentYearCount = yearly_distribution[currentYear] || 0;
        const popularity = (currentYearCount / recentAvg) * 100;

        const trendScore = (0.6 * avgGrowth) + (0.4 * popularity);
        const totalPublications = Object.values(yearly_distribution).reduce((a, b) => a + b, 0);

        return res.json({
            keyword,
            growth_rate: +trendScore.toFixed(2),
            publication_count: totalPublications,
            yearly_distribution,
            date_range: { start: startDate, end: endDate, years: endYear - startYear + 1 },
            meta: {
                search_method: 'title_abstract',
                used_keyword_search: true,
                trend_factors: {
                    average_growth_rate: +avgGrowth.toFixed(2),
                    relative_popularity: +popularity.toFixed(2),
                    year_over_year_growth: growthRates.map(g => ({
                        year: g.year,
                        rate: +g.rate.toFixed(2)
                    }))
                }
            }
        });

    } catch (error) {
        console.error('Error in keyword trends:', error);
        const status = error.response?.status || 500;
        res.status(status).json({
            error: 'OpenAlex API error',
            details: error.response?.data || error.message
        });
    }
});

//get a single publication
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const url = `${OPENALEX_API_BASE}/works/${id}`;

        const response = await axios.get(url, { headers: OPENALEX_HEADERS });
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching publication:', error);
        res.status(500).json({
            error: 'Failed to fetch publication',
            details: error.message
        });
    }
});

//post a new publication
router.post('/', (req, res) => {
    res.json({ message: 'post a new publication' });
})

//delete a publication
router.delete('/:id', (req, res) => {
    res.json({ message: 'delete a publication' });
})

//update a publication
router.patch('/:id', (req, res) => {
    res.json({ message: 'update a publication' });
})

module.exports = router;
