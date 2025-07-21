const request = require('supertest');
const express = require('express');
const axios = require('axios');
const publicationsRouter = require('../routes/publications');

// Mock the axios module
jest.mock('axios');

const app = express();
// Mount the router to a path
app.use('/api/publications', publicationsRouter);

describe('Backend API: /api/publications', () => {

  afterEach(() => {
    // Clear all mocks after each test
    jest.clearAllMocks();
  });

  describe('GET /api/publications/search', () => {

    // Test for Async Logic Handling and Data Transformation
    it('should return successfully with formatted data when OpenAlex API call succeeds', async () => {
      const mockApiResponse = {
        data: {
          results: [
            { id: 'W123', display_name: 'Test Publication 1', cited_by_count: 50 },
            { id: 'W456', display_name: 'Test Publication 2' /* missing cited_by_count */ },
          ],
          meta: { count: 2 },
        },
      };
      axios.get.mockResolvedValue(mockApiResponse);

      const response = await request(app).get('/api/publications/search?filter=test');

      expect(response.status).toBe(200);
      expect(response.body.results).toHaveLength(2);
      // Check that data transformation (adding citation_count) works correctly
      expect(response.body.results[0]).toHaveProperty('citation_count', 50);
      expect(response.body.results[1]).toHaveProperty('citation_count', 0); // Check for default value
    });

    // Test for Error Handling Middleware
    it('should return a 500 error when the OpenAlex API call fails', async () => {
      const errorMessage = 'Network Error';
      axios.get.mockRejectedValue({ message: errorMessage });

      const response = await request(app).get('/api/publications/search?filter=test');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        error: 'Failed to fetch from OpenAlex API',
        details: errorMessage,
      });
    });
  });
}); 