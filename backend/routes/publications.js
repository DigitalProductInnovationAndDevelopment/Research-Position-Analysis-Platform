const express = require('express');
const router = express.Router();
const axios = require('axios');

const OPENALEX_API_BASE = 'https://api.openalex.org';

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

        const response = await axios.get(url, { params });
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
        const { 
            search = '', 
            author = '', 
            year = '', 
            institution = '',
            journal = '',
            type = '', // New: publication type (article, book, etc.)          
            language = '',// New: language of publication       
            min_citations = '',  // New: minimum citation count
            max_citations = '',  // New: maximum citation count
            subject = '',        // New: subject area
            doi = '',           // New: DOI identifier
            is_open_access = '', // New: open access status
            sort_by = 'cited_by_count:desc',
            publisher = '',      // New: specific publisher
            venue = '',         // New: conference or venue name
            abstract = '',      // New: search in abstract
            keywords = '',      // New: specific keywords
            funding = '',       // New: funding organization
            country = '',       // New: country of publication
            min_year = '',      // New: minimum publication year
            max_year = '',      // New: maximum publication year
            has_abstract = '',  // New: publications with/without abstract
            has_doi = '',       // New: publications with/without DOI
            has_pdf = '',       // New: publications with/without PDF
            has_software = '',  // New: publications with/without software
            has_dataset = '',   // New: publications with/without dataset
            page = 1, 
            per_page = 25 
        } = req.query;

        // Build search query
        let searchQuery = search;
        if (author) searchQuery += ` author:"${author}"`;
        if (year) searchQuery += ` from_publication_date:${year}`;
        if (institution) searchQuery += ` institution:"${institution}"`;
        if (journal) searchQuery += ` journal:"${journal}"`;
        if (type) searchQuery += ` type:"${type}"`;
        if (language) searchQuery += ` language:"${language}"`;
        if (subject) searchQuery += ` subject:"${subject}"`;
        if (doi) searchQuery += ` doi:"${doi}"`;
        if (is_open_access) searchQuery += ` is_open_access:${is_open_access}`;
        if (publisher) searchQuery += ` publisher:"${publisher}"`;
        if (venue) searchQuery += ` venue:"${venue}"`;
        if (abstract) searchQuery += ` abstract:"${abstract}"`;
        if (keywords) searchQuery += ` keywords:"${keywords}"`;
        if (funding) searchQuery += ` funding:"${funding}"`;
        if (country) searchQuery += ` country:"${country}"`;

        const url = `${OPENALEX_API_BASE}/works`;
        
        const params = {
            page,
            per_page,
            search: searchQuery.trim(),
            sort: sort_by
        };

        // Add filters array
        params.filter = [];

        // Citation range
        if (min_citations) params.filter.push(`cited_by_count:>=${min_citations}`);
        if (max_citations) params.filter.push(`cited_by_count:<=${max_citations}`);

        // Year range
        if (min_year) params.filter.push(`from_publication_date:>=${min_year}`);
        if (max_year) params.filter.push(`from_publication_date:<=${max_year}`);

        // Boolean filters
        if (has_abstract) params.filter.push(`has_abstract:${has_abstract}`);
        if (has_doi) params.filter.push(`has_doi:${has_doi}`);
        if (has_pdf) params.filter.push(`has_pdf:${has_pdf}`);
        if (has_software) params.filter.push(`has_software:${has_software}`);
        if (has_dataset) params.filter.push(`has_dataset:${has_dataset}`);

        const response = await axios.get(url, { params });
        
        // Format the response
        const formattedResponse = {
            meta: {
                page: parseInt(page),
                per_page: parseInt(per_page),
                total_results: response.data.meta?.count || 0,
                search_params: {
                    search,
                    author,
                    year,
                    institution,
                    journal,
                    type,
                    language,
                    min_citations,
                    max_citations,
                    subject,
                    doi,
                    is_open_access,
                    sort_by,
                    publisher,
                    venue,
                    abstract,
                    keywords,
                    funding,
                    country,
                    min_year,
                    max_year,
                    has_abstract,
                    has_doi,
                    has_pdf,
                    has_software,
                    has_dataset
                }
            },
            results: response.data.results || []
        };

        res.json(formattedResponse);
    } catch (error) {
        console.error('Error in advanced search:', error);
        res.status(500).json({ 
            error: 'Failed to perform advanced search',
            details: error.message,
            searchParams: req.query
        });
    }
});

// Keyword trends endpoint using concept-based filtering with fallback to keyword search if concept not found or invalid
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

        let conceptId = null;
        try {
            const conceptRes = await axios.get(`${OPENALEX_API_BASE}/concepts`, {
                params: { search: keyword, per_page: 1 }
            });
            const concept = conceptRes.data.results?.[0];
            if (concept?.id && concept?.display_name.toLowerCase() === keyword.toLowerCase()) {
                conceptId = concept.id.replace('https://openalex.org/', '');
                console.log(`Found exact concept match for "${keyword}": ${concept.display_name} (${conceptId})`);
            } else {
                console.log(`No exact concept match found for "${keyword}", falling back to keyword search`);
            }
        } catch (e) {
            console.warn('Concept lookup failed:', e.message);
        }

        let worksRes;
        try {
            if (conceptId) {
                console.log(`Fetching works using concept ID: ${conceptId}`);
                worksRes = await axios.get(`${OPENALEX_API_BASE}/works`, {
                    params: {
                        filter: `concept.id:${conceptId},from_publication_date:${startDate},to_publication_date:${endDate}`,
                        group_by: 'publication_year'
                    }
                });
            } else {
                worksRes = await axios.get(`${OPENALEX_API_BASE}/works`, {
                    params: {
                        search: keyword,
                        filter: `from_publication_date:${startDate},to_publication_date:${endDate}`,
                        group_by: 'publication_year'
                    }
                });
            }
        } catch (e) {
            console.error('Error fetching works:', e.message);
            return res.status(500).json({
                error: 'OpenAlex API error',
                details: e.message,
                search_method: conceptId ? 'concept' : 'keyword'
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
                concept_id: conceptId || null,
                used_keyword_search: !conceptId,
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
        
        const response = await axios.get(url);
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
