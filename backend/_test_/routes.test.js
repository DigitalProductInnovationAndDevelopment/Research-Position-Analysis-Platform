const request = require('supertest');
const express = require('express');
const publicationsRouter = require('../routes/publications');

// Setup a minimal express app for testing
const app = express();
app.use('/api/publications', publicationsRouter);

describe('Backend API Routes', () => {

  // Test #1: Route Handler Returns Expected Response
  describe('GET /api/publications', () => {
    it('should return a 200 OK status and a valid JSON response for the base route', async () => {
      const response = await request(app).get('/api/publications');
      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toMatch(/json/);
      expect(response.body).toBeDefined();
    });
  });

  // Test #2: Validation Middleware Works
  describe('GET /api/publications/search', () => {
    it('should return a 400 Bad Request for invalid page parameters', async () => {
      const response = await request(app)
        .get('/api/publications/search?filter=title.search:test&page=invalid-page-number');
      
      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Invalid page number provided.' });
    });
  });

  // Test #3: Error Handling for Non-existent Routes
  describe('GET /api/non-existent-route', () => {
    it('should return a 404 Not Found for routes that do not exist', async () => {
      const response = await request(app).get('/api/this-route-does-not-exist');
      expect(response.status).toBe(404);
    });
  });

});
