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

        // --- Start of new validation logic ---
        const pageNum = parseInt(page);
        const perPageNum = parseInt(per_page);

        if (isNaN(pageNum) || pageNum < 1) {
            return res.status(400).json({ error: 'Invalid page number provided.' });
        }
        if (isNaN(perPageNum) || perPageNum < 1 || perPageNum > 200) {
            return res.status(400).json({ error: 'Invalid per_page value provided. Must be between 1 and 200.' });
        }
        // --- End of new validation logic ---

        // Decode the filter parameter to handle encoded characters from frontend
        filter = decodeURIComponent(filter);
        console.log('Decoded filter:', filter);

        // Handle different filter formats from frontend
        if (typeof filter === 'string') {
            // Handle title_and_abstract.search:"..." format (from frontend)
            if (filter.startsWith('title_and_abstract.search:"')) {
                // This is already in the correct format, no conversion needed
                console.log('Using title_and_abstract.search filter:', filter);
            }
            // Handle legacy search:"..." format (fallback)
            else if (filter.startsWith('search:"')) {
                const match = filter.match(/^search:"(.+)"$/);
                if (match) {
                    const query = match[1];
                    filter = `title_and_abstract.search:${query}`;
                    console.log('Converted search filter to:', filter);
                }
            }
        }

        // If filter does not contain any .search: field, do not use relevance_score sort
        let effectiveSort = sort;
        if (!filter.includes('.search:') && sort === 'relevance_score:desc') {
            effectiveSort = 'publication_year:desc';
        }

        // Initialize params for OpenAlex API
        const params = {
            page: pageNum, // Use validated number
            per_page: perPageNum, // Use validated number
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
                        encode: true // Enable encoding to handle special characters
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
            keyword = '',
            keyword_id = '',
            start_date,
            end_date,
            per_page = 200,
            institution_id
        } = req.query;

        let filterParts = [];
        // If keyword_id is provided, add it
        if (keyword_id) {
            filterParts.push(`keywords.id:${keyword_id}`);
        }
        // If keyword is provided, add it
        if (keyword) {
            filterParts.push(`title_and_abstract.search:${keyword}`);
        }
        // Add institution filter if provided
        if (institution_id) {
            filterParts.push(`authorships.institutions.id:I${institution_id}`);
        }

        // Only add date filters if start_date or end_date is provided
        if (start_date) {
            filterParts.push(`from_publication_date:${start_date}`);
        }
        if (end_date) {
            filterParts.push(`to_publication_date:${end_date}`);
        }
        const filterString = filterParts.join(',');
        console.log(`Using filter: ${filterString}`);
        // Only send valid OpenAlex params
        const params = {
            filter: filterString,
            group_by: 'publication_year',
            per_page: per_page
        };
        let worksRes;
        try {
            worksRes = await axios.get(`${OPENALEX_API_BASE}/works`, { params });
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

        // Determine year range
        let startYear, endYear;
        const currentYear = new Date().getFullYear();
        if (start_date && end_date) {
            startYear = new Date(start_date).getFullYear();
            endYear = new Date(end_date).getFullYear();
        } else {
            const years = groupResults.map(entry => parseInt(entry.key)).filter(y => !isNaN(y));
            if (years.length > 0) {
                endYear = Math.max(...years);
                // Default to last 10 years
                startYear = endYear - 9;
            } else {
                // If no years found, default to last 10 years
                endYear = currentYear;
                startYear = currentYear - 9;
            }
        }
        const startDate = start_date || `${startYear}-01-01`;
        const endDate = end_date || `${endYear}-12-31`;

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



// Route to get conference information for a list of DOIs
router.get('/conference-info', async (req, res) => {
    try {
        console.log('Conference-info route called');
        const { dois } = req.query;
        console.log('DOIs received:', dois);

        if (!dois) {
            return res.status(400).json({ error: 'DOIs parameter is required' });
        }

        // Split the DOIs string and extract just the DOI part from URLs
        const doiList = Array.isArray(dois) ? dois : dois.split(',');
        const extractedDois = doiList.map(doiUrl => {
            // Extract just the DOI part from the full URL
            const doiMatch = doiUrl.match(/https:\/\/doi\.org\/(.+)/);
            return doiMatch ? doiMatch[1] : doiUrl;
        });

        console.log('Extracted DOIs:', extractedDois);
        const results = [];

        // Process each DOI with individual API calls
        for (const doi of extractedDois) {
            try {
                console.log(`Processing DOI: ${doi}`);
                const url = `https://api.crossref.org/works/${doi}`;
                console.log(`CrossRef URL: ${url}`);

                const response = await axios.get(url);
                console.log(`Response status: ${response.status}`);

                if (response.status !== 200) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = response.data;
                const msg = data.message;
                console.log(`Conference name: ${msg.event?.name}`);

                const info = {
                    doi: doi,
                    title: msg.title?.[0] || null,
                    container: msg['container-title']?.[0] || null,
                    type: msg.type || null,
                    publisher: msg.publisher || null,
                    year: msg.issued?.['date-parts']?.[0]?.[0] || null,
                    event: {
                        name: msg.event?.name || null
                    }
                };

                results.push(info);

                // Small delay to avoid overwhelming the API
                await new Promise(resolve => setTimeout(resolve, 100));
            } catch (error) {
                console.error(`Error processing DOI ${doi}:`, error);
                results.push({
                    doi: doi,
                    error: 'Failed to fetch conference information'
                });
            }
        }

        console.log('Results:', results);
        res.json({ results });
    } catch (error) {
        console.error('Error in conference-info route:', error);
        res.status(500).json({ error: 'Failed to fetch conference information' });
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
