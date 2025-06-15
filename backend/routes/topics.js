const express = require('express');
const router = express.Router();
const axios = require('axios');

// Get related topics from OpenAlex with detailed metadata
router.get('/related/:topic', async (req, res) => {
    try {
        const { topic } = req.params;
        const { siemens } = req.query; // Get siemens parameter from query
        const includeSiemens = siemens === 'true';
        
        console.log('Searching for topic:', topic, 'Siemens filter:', includeSiemens);
        
        // Fetch multiple pages of works for comprehensive results
        const MAX_PAGES = 5;
        const PER_PAGE = 50;
        const MIN_RELEVANCE_SCORE = 0.3;
        
        let allWorks = [];
        
        // Fetch multiple pages
        for (let page = 1; page <= MAX_PAGES; page++) {
            // Use search parameter for broader matching and filter for title/abstract
            const openAlexUrl = `https://api.openalex.org/works?search=${encodeURIComponent(topic)}&filter=title.search:"${encodeURIComponent(topic)}"&per-page=${PER_PAGE}&page=${page}&select=concepts,display_name,authorships,primary_location,institutions_distinct_count`;
            console.log(`Fetching page ${page}:`, openAlexUrl);
            
            const response = await axios.get(openAlexUrl);
            const works = response.data.results || [];
            
            if (works.length === 0) break; // Stop if no more results
            
            allWorks = allWorks.concat(works);
        }
        
        console.log(`Total works found: ${allWorks.length}`);
        
        // Debug first work to see structure
        if (allWorks.length > 0) {
            console.log('First work structure:', JSON.stringify(allWorks[0], null, 2));
        }
        
        // Extract and deduplicate concepts from works
        const conceptsMap = new Map();
        
        allWorks.forEach(work => {
            // Debug concepts for each work
            console.log(`Work "${work.display_name}" concepts:`, work.concepts);
            
            if (work.concepts && Array.isArray(work.concepts)) {
                work.concepts.forEach(concept => {
                    // Debug each concept
                    console.log('Processing concept:', concept);
                    
                    // Only include concepts with sufficient relevance
                    if ((concept.score || 0) > MIN_RELEVANCE_SCORE) {
                        if (!conceptsMap.has(concept.id)) {
                            // Check if this work is Siemens-affiliated
                            const isSiemensWork = includeSiemens && 
                                work.authorships?.some(authorship => {
                                    const hasSiemens = authorship.institutions?.some(inst => {
                                        const isSiemens = inst.display_name?.toLowerCase().includes('siemens');
                                        if (isSiemens) {
                                            console.log('Found Siemens institution:', inst.display_name);
                                        }
                                        return isSiemens;
                                    });
                                    if (hasSiemens) {
                                        console.log('Found Siemens work:', work.display_name);
                                    }
                                    return hasSiemens;
                                }) || false;

                            // Check if the concept name itself contains Siemens
                            const isSiemensTopic = includeSiemens && 
                                concept.display_name.toLowerCase().includes('siemens');

                            if (isSiemensWork) {
                                console.log('Adding Siemens work to concept:', concept.display_name);
                            }

                            // Extract all institutions from the work
                            const institutions = work.authorships?.flatMap(authorship => 
                                authorship.institutions?.map(inst => ({
                                    name: inst.display_name,
                                    ...(includeSiemens && { 
                                        is_siemens: inst.display_name?.toLowerCase().includes('siemens')
                                    })
                                })) || []
                            ) || [];

                            conceptsMap.set(concept.id, {
                                id: concept.id,
                                name: concept.display_name,
                                description: concept.description,
                                relevance_score: concept.score,
                                works_count: concept.works_count,
                                ...(includeSiemens && { 
                                    siemens_works_count: isSiemensWork ? 1 : 0,
                                    is_siemens_topic: isSiemensTopic
                                }),
                                level: concept.level,
                                // Include context works based on Siemens filter
                                context_works: [{
                                    title: work.display_name,
                                    relevance: concept.score,
                                    authors: work.authorships?.map(a => a.author.display_name) || [],
                                    institutions_count: work.institutions_distinct_count || 0,
                                    institutions: institutions,
                                    source: work.primary_location?.source?.display_name,
                                    ...(includeSiemens && { 
                                        is_siemens: isSiemensWork
                                    })
                                }]
                            });
                        } else {
                            // Add to context works if not already present
                            const existingConcept = conceptsMap.get(concept.id);
                            
                            // Check if this work is Siemens-affiliated
                            const isSiemensWork = includeSiemens && 
                                work.authorships?.some(authorship => {
                                    const hasSiemens = authorship.institutions?.some(inst => {
                                        const isSiemens = inst.display_name?.toLowerCase().includes('siemens');
                                        if (isSiemens) {
                                            console.log('Found Siemens institution:', inst.display_name);
                                        }
                                        return isSiemens;
                                    });
                                    if (hasSiemens) {
                                        console.log('Found Siemens work:', work.display_name);
                                    }
                                    return hasSiemens;
                                }) || false;

                            // Extract all institutions from the work
                            const institutions = work.authorships?.flatMap(authorship => 
                                authorship.institutions?.map(inst => ({
                                    name: inst.display_name,
                                    ...(includeSiemens && { 
                                        is_siemens: inst.display_name?.toLowerCase().includes('siemens')
                                    })
                                })) || []
                            ) || [];

                            // Add to context works if:
                            // 1. Siemens filter is enabled AND it's a Siemens work
                            // 2. OR Siemens filter is disabled (show all works)
                            if ((includeSiemens && isSiemensWork) || !includeSiemens) {
                                if (existingConcept.context_works.length < 3) {
                                    existingConcept.context_works.push({
                                        title: work.display_name,
                                        relevance: concept.score,
                                        authors: work.authorships?.map(a => a.author.display_name) || [],
                                        institutions_count: work.institutions_distinct_count || 0,
                                        institutions: institutions,
                                        source: work.primary_location?.source?.display_name,
                                        ...(includeSiemens && { 
                                            is_siemens: isSiemensWork
                                        })
                                    });
                                }
                            }

                            // Update Siemens works count if enabled
                            if (includeSiemens && isSiemensWork) {
                                existingConcept.siemens_works_count = (existingConcept.siemens_works_count || 0) + 1;
                                console.log('Updated Siemens works count for concept:', existingConcept.name, 'New count:', existingConcept.siemens_works_count);
                            }
                        }
                    }
                });
            }
        });

        // Convert to array and sort
        let relatedTopics = Array.from(conceptsMap.values());
        
        if (includeSiemens) {
            // Sort by Siemens works count first, then by relevance score
            relatedTopics.sort((a, b) => {
                // First prioritize Siemens topics
                const siemensTopicDiff = (b.is_siemens_topic ? 1 : 0) - (a.is_siemens_topic ? 1 : 0);
                if (siemensTopicDiff !== 0) return siemensTopicDiff;
                
                // Then by Siemens works count
                const siemensDiff = (b.siemens_works_count || 0) - (a.siemens_works_count || 0);
                if (siemensDiff !== 0) return siemensDiff;
                
                // Finally by relevance score
                return (b.relevance_score || 0) - (a.relevance_score || 0);
            });

            // For topics with Siemens works, sort context works by relevance
            relatedTopics.forEach(topic => {
                if (topic.siemens_works_count > 0) {
                    topic.context_works.sort((a, b) => (b.relevance || 0) - (a.relevance || 0));
                }
            });

            // Verify and fix Siemens works count to match actual Siemens papers
            relatedTopics.forEach(topic => {
                if (includeSiemens) {
                    const actualSiemensCount = topic.context_works.filter(work => work.is_siemens).length;
                    if (actualSiemensCount !== topic.siemens_works_count) {
                        console.log('Fixing Siemens works count for topic:', topic.name);
                        console.log('Old count:', topic.siemens_works_count);
                        console.log('Actual count:', actualSiemensCount);
                    }
                    topic.siemens_works_count = actualSiemensCount;
                }
            });
        } else {
            // Sort only by relevance score
            relatedTopics.sort((a, b) => (b.relevance_score || 0) - (a.relevance_score || 0));

            // Sort context works by relevance for all topics
            relatedTopics.forEach(topic => {
                topic.context_works.sort((a, b) => (b.relevance || 0) - (a.relevance || 0));
            });
        }

        console.log('Number of unique concepts found:', relatedTopics.length);
        console.log('Topics with Siemens works:', relatedTopics.filter(t => t.siemens_works_count > 0).length);

        res.json({
            success: true,
            data: relatedTopics,
            meta: {
                total_works_analyzed: allWorks.length,
                total_concepts_found: relatedTopics.length,
                min_relevance_score: MIN_RELEVANCE_SCORE,
                search_topic: topic,
                siemens_filter_enabled: includeSiemens,
                siemens_topics_count: includeSiemens ? relatedTopics.filter(t => t.is_siemens_topic).length : 0,
                timestamp: new Date().toISOString()
            }
        });
    } catch (error) {
        console.error('Error fetching related topics:', error.message);
        console.error('Error details:', error.response?.data || error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch related topics',
            details: error.message
        });
    }
});

module.exports = router; 