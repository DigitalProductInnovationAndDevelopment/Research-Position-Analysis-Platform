const request = require('supertest');
const express = require('express');
const axios = require('axios');
const publicationsRouter = require('../routes/publications');

// Mock the axios module
jest.mock('axios');

const app = express();
app.use('/publications', publicationsRouter);

describe('Publications Router', () => {

  // Clear all mocks after each test
  afterEach(() => {
    jest.clearAllMocks();
  });

  // Test for GET /publications
  describe('GET /publications', () => {
    it('should respond with a 200 status code and return publications', async () => {
      // Provide a mock successful response for this test
      axios.get.mockResolvedValue({ data: { results: [{ id: 'W123', title: 'Test Publication' }] } });

      const response = await request(app).get('/publications');
      
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('results');
      expect(response.body.results.length).toBeGreaterThan(0);
    });
  });

  // Test for GET /publications/search
  describe('GET /publications/search', () => {
    it('should respond with a 200 status code for a search query', async () => {
      // Provide a mock successful response for this test
      axios.get.mockResolvedValue({ data: { results: [{ id: 'W456', title: 'Search Result' }] } });

      const response = await request(app).get('/publications/search?filter=test');
      
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('results');
    });
  });

  // Test for GET /publications/:id
  describe('GET /publications/:id', () => {
    it('should respond with a 200 status code for a valid ID', async () => {
      // Provide a mock successful response for this test
      axios.get.mockResolvedValue({ data: { id: 'W12345', title: 'Specific Publication' } });

      const response = await request(app).get('/publications/W12345');

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('id', 'W12345');
    });
  });
}); 