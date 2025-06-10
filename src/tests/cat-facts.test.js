const ApiClient = require('../utils/api-client');
const API_ENDPOINTS = require('../config/api-endpoints');
const {
  validateResponseStructure,
  validateStatusCode,
  validateHeaders,
  validateResponseTime,
  validateArrayResponse,
  validateObjectProperties
} = require('../utils/test-helpers');

describe('Cat Facts API Tests', () => {
  let apiClient;
  let startTime;

  beforeAll(() => {
    apiClient = new ApiClient(API_ENDPOINTS.CAT_FACTS.BASE_URL);
  });

  beforeEach(() => {
    startTime = Date.now();
  });

  describe('Cat Facts Endpoints', () => {
    test('GET /fact - should get a random cat fact', async () => {
      const response = await apiClient.get(API_ENDPOINTS.CAT_FACTS.FACT);
      
      validateStatusCode(response, 200);
      validateResponseStructure(response);
      validateResponseTime(startTime);
      
      validateObjectProperties(response.data, ['fact', 'length']);
      
      expect(typeof response.data.fact).toBe('string');
      expect(response.data.fact.length).toBeGreaterThan(10);
      expect(typeof response.data.length).toBe('number');
      expect(response.data.length).toBe(response.data.fact.length);
      
      // Fact should contain cat-related content
      const fact = response.data.fact.toLowerCase();
      const catTerms = ['cat', 'cats', 'kitten', 'feline', 'meow', 'purr', 'whiskers', 'paw'];
      const containsCatTerm = catTerms.some(term => fact.includes(term));
      expect(containsCatTerm).toBe(true);
    });

    test('GET /fact with max_length parameter', async () => {
      const maxLength = 100;
      const response = await apiClient.get(API_ENDPOINTS.CAT_FACTS.FACT, { max_length: maxLength });
      
      validateStatusCode(response, 200);
      validateResponseStructure(response);
      validateResponseTime(startTime);
      
      validateObjectProperties(response.data, ['fact', 'length']);
      
      expect(response.data.fact.length).toBeLessThanOrEqual(maxLength);
      expect(response.data.length).toBe(response.data.fact.length);
      expect(response.data.length).toBeLessThanOrEqual(maxLength);
    });

    test('GET /fact with very short max_length', async () => {
      const maxLength = 50;
      const response = await apiClient.get(API_ENDPOINTS.CAT_FACTS.FACT, { max_length: maxLength });
      
      validateStatusCode(response, 200);
      validateResponseStructure(response);
      validateResponseTime(startTime);
      
      expect(response.data.fact.length).toBeLessThanOrEqual(maxLength);
      expect(response.data.length).toBeLessThanOrEqual(maxLength);
      
      // Even short facts should be meaningful
      expect(response.data.fact.length).toBeGreaterThan(10);
    });
  });

  describe('Multiple Cat Facts', () => {
    test('GET /facts - should get paginated list of cat facts', async () => {
      const response = await apiClient.get(API_ENDPOINTS.CAT_FACTS.FACTS);
      
      validateStatusCode(response, 200);
      validateResponseStructure(response);
      validateResponseTime(startTime);
      
      validateObjectProperties(response.data, ['current_page', 'data', 'first_page_url', 'from', 'last_page', 'per_page', 'to', 'total']);
      validateArrayResponse(response.data.data, 1);
      
      expect(response.data.current_page).toBe(1);
      expect(response.data.per_page).toBeGreaterThan(0);
      expect(response.data.total).toBeGreaterThan(0);
      expect(response.data.data.length).toBeGreaterThan(0);
      
      // Validate first fact structure
      const firstFact = response.data.data[0];
      validateObjectProperties(firstFact, ['fact', 'length']);
      expect(typeof firstFact.fact).toBe('string');
      expect(typeof firstFact.length).toBe('number');
    });

    test('GET /facts with limit parameter', async () => {
      const limit = 5;
      const response = await apiClient.get(API_ENDPOINTS.CAT_FACTS.FACTS, { limit });
      
      validateStatusCode(response, 200);
      validateResponseStructure(response);
      validateResponseTime(startTime);
      
      expect(response.data.per_page).toBe(limit);
      expect(response.data.data.length).toBeLessThanOrEqual(limit);
      
      // Validate all facts
      response.data.data.forEach(fact => {
        validateObjectProperties(fact, ['fact', 'length']);
        expect(fact.length).toBe(fact.fact.length);
      });
    });

    test('GET /facts with page parameter', async () => {
      const page = 2;
      const response = await apiClient.get(API_ENDPOINTS.CAT_FACTS.FACTS, { page });
      
      validateStatusCode(response, 200);
      validateResponseStructure(response);
      validateResponseTime(startTime);
      
      expect(response.data.current_page).toBe(page);
      validateArrayResponse(response.data.data, 1);
      
      // Should have different facts than page 1
      expect(response.data.from).toBeGreaterThan(response.data.per_page);
    });

    test('GET /facts with max_length filter', async () => {
      const maxLength = 80;
      const response = await apiClient.get(API_ENDPOINTS.CAT_FACTS.FACTS, { max_length: maxLength });
      
      validateStatusCode(response, 200);
      validateResponseStructure(response);
      validateResponseTime(startTime);
      
      // All facts should be within the max length
      response.data.data.forEach(fact => {
        expect(fact.length).toBeLessThanOrEqual(maxLength);
        expect(fact.fact.length).toBeLessThanOrEqual(maxLength);
      });
    });
  });

  describe('Cat Breeds Endpoints', () => {
    test('GET /breeds - should get list of cat breeds', async () => {
      const response = await apiClient.get(API_ENDPOINTS.CAT_FACTS.BREEDS);
      
      validateStatusCode(response, 200);
      validateResponseStructure(response);
      validateResponseTime(startTime);
      
      validateObjectProperties(response.data, ['current_page', 'data', 'first_page_url', 'from', 'last_page', 'per_page', 'to', 'total']);
      validateArrayResponse(response.data.data, 1);
      
      expect(response.data.total).toBeGreaterThan(0);
      
      // Validate first breed structure
      const firstBreed = response.data.data[0];
      validateObjectProperties(firstBreed, ['breed', 'country', 'origin', 'coat', 'pattern']);
      
      expect(typeof firstBreed.breed).toBe('string');
      expect(typeof firstBreed.country).toBe('string');
      expect(typeof firstBreed.origin).toBe('string');
      expect(typeof firstBreed.coat).toBe('string');
      expect(typeof firstBreed.pattern).toBe('string');
      
      // Breed name should not be empty
      expect(firstBreed.breed.length).toBeGreaterThan(0);
    });

    test('GET /breeds with limit parameter', async () => {
      const limit = 10;
      const response = await apiClient.get(API_ENDPOINTS.CAT_FACTS.BREEDS, { limit });
      
      validateStatusCode(response, 200);
      validateResponseStructure(response);
      validateResponseTime(startTime);
      
      expect(response.data.per_page).toBe(limit);
      expect(response.data.data.length).toBeLessThanOrEqual(limit);
      
      // Validate all breeds
      response.data.data.forEach(breed => {
        validateObjectProperties(breed, ['breed', 'country', 'origin', 'coat', 'pattern']);
        expect(breed.breed.length).toBeGreaterThan(0);
      });
    });

    test('should validate breed information completeness', async () => {
      const response = await apiClient.get(API_ENDPOINTS.CAT_FACTS.BREEDS, { limit: 5 });
      
      response.data.data.forEach(breed => {
        // All breeds should have complete information
        expect(breed.breed).toBeTruthy();
        expect(breed.country).toBeTruthy();
        expect(breed.origin).toBeTruthy();
        expect(breed.coat).toBeTruthy();
        expect(breed.pattern).toBeTruthy();
        
        // Validate that country and origin are proper strings
        expect(breed.country.length).toBeGreaterThan(1);
        expect(breed.origin.length).toBeGreaterThan(1);
      });
    });
  });

  describe('Parameter Validation and Edge Cases', () => {
    test('should handle invalid max_length parameter gracefully', async () => {
      const response = await apiClient.get(API_ENDPOINTS.CAT_FACTS.FACT, { max_length: 'invalid' });
      
      // API should either ignore invalid parameter or return error
      expect([200, 400, 422]).toContain(response.status);
      validateResponseTime(startTime);
      
      if (response.status === 200) {
        validateObjectProperties(response.data, ['fact', 'length']);
      }
    });

    test('should handle very large max_length parameter', async () => {
      const response = await apiClient.get(API_ENDPOINTS.CAT_FACTS.FACT, { max_length: 10000 });
      
      validateStatusCode(response, 200);
      validateResponseStructure(response);
      validateResponseTime(startTime);
      
      validateObjectProperties(response.data, ['fact', 'length']);
      expect(response.data.fact.length).toBeLessThanOrEqual(10000);
    });

    test('should handle very small max_length parameter', async () => {
      try {
        const response = await apiClient.get(API_ENDPOINTS.CAT_FACTS.FACT, { max_length: 5 });
        
        if (response.status === 200) {
          // API might return very short fact or no fact
          expect(response.data.fact).toBeDefined();
        }
      } catch (error) {
        // API might return error for unreasonably small length
        expect(error.response.status).toBeGreaterThanOrEqual(400);
      }
      
      validateResponseTime(startTime);
    });

    test('should handle excessive page numbers', async () => {
      try {
        const response = await apiClient.get(API_ENDPOINTS.CAT_FACTS.FACTS, { page: 9999 });
        
        if (response.status === 200) {
          // Should return empty data or last valid page
          expect(response.data.data).toBeDefined();
          expect(Array.isArray(response.data.data)).toBe(true);
        }
      } catch (error) {
        // Might return 404 or other error for invalid page
        expect(error.response.status).toBeGreaterThanOrEqual(400);
      }
      
      validateResponseTime(startTime);
    });
  });

  describe('Content Quality Validation', () => {
    test('should validate fact content quality', async () => {
      const response = await apiClient.get(API_ENDPOINTS.CAT_FACTS.FACTS, { limit: 10 });
      
      response.data.data.forEach(factObj => {
        const fact = factObj.fact;
        
        // Facts should be complete sentences
        expect(fact.endsWith('.') || fact.endsWith('!') || fact.endsWith('?')).toBe(true);
        
        // Facts should not be too short to be meaningful
        expect(fact.length).toBeGreaterThan(15);
        
        // Facts should contain letters (not just numbers/symbols)
        expect(fact).toMatch(/[a-zA-Z]/);
        
        // Length should match actual string length
        expect(factObj.length).toBe(fact.length);
      });
    });

    test('should ensure facts are unique in single request', async () => {
      const response = await apiClient.get(API_ENDPOINTS.CAT_FACTS.FACTS, { limit: 20 });
      
      const facts = response.data.data.map(item => item.fact);
      const uniqueFacts = [...new Set(facts)];
      
      // Should have unique facts (allowing for some possible duplicates in large datasets)
      expect(uniqueFacts.length).toBeGreaterThan(facts.length * 0.8);
    });
  });

  describe('API Performance and Reliability', () => {
    test('should handle concurrent requests', async () => {
      const promises = Array.from({ length: 5 }, () => 
        apiClient.get(API_ENDPOINTS.CAT_FACTS.FACT)
      );
      
      const responses = await Promise.all(promises);
      
      responses.forEach(response => {
        validateStatusCode(response, 200);
        validateObjectProperties(response.data, ['fact', 'length']);
        expect(response.data.fact.length).toBeGreaterThan(0);
      });
      
      validateResponseTime(startTime, 10000);
      
      // Check that we get different facts (usually true for random API)
      const facts = responses.map(r => r.data.fact);
      const uniqueFacts = [...new Set(facts)];
      expect(uniqueFacts.length).toBeGreaterThan(1);
    });

    test('should maintain consistent response times', async () => {
      const responseTimes = [];
      
      for (let i = 0; i < 3; i++) {
        const requestStart = Date.now();
        const response = await apiClient.get(API_ENDPOINTS.CAT_FACTS.FACT);
        const requestTime = Date.now() - requestStart;
        
        validateStatusCode(response, 200);
        responseTimes.push(requestTime);
      }
      
      const avgResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
      const maxDeviation = Math.max(...responseTimes.map(time => Math.abs(time - avgResponseTime)));
      
      expect(maxDeviation).toBeLessThan(3000); // Allow up to 3s deviation
      console.log(`Cat Facts API average response time: ${avgResponseTime.toFixed(2)}ms`);
      
      validateResponseTime(startTime);
    });

    test('should have reasonable response times', async () => {
      const response = await apiClient.get(API_ENDPOINTS.CAT_FACTS.FACT);
      const responseTime = validateResponseTime(startTime, 5000);
      
      expect(responseTime).toBeWithinRange(0, 5000);
      console.log(`Cat Facts API response time: ${responseTime}ms`);
    });
  });

  describe('Headers and Content Type Validation', () => {
    test('should have correct content-type headers', async () => {
      const response = await apiClient.get(API_ENDPOINTS.CAT_FACTS.FACT);
      
      validateHeaders(response, {
        'content-type': 'application/json'
      });
      
      expect(response.headers['content-type']).toContain('application/json');
    });

    test('should include proper encoding headers', async () => {
      const response = await apiClient.get(API_ENDPOINTS.CAT_FACTS.FACT);
      
      // Should handle UTF-8 encoding for international characters
      if (response.headers['content-type']) {
        expect(response.headers['content-type']).toMatch(/application\/json|charset=utf-8/i);
      }
    });

    test('should support CORS for web applications', async () => {
      const response = await apiClient.get(API_ENDPOINTS.CAT_FACTS.FACT);
      
      // Check for CORS headers
      expect(response.headers['access-control-allow-origin'] || 
             response.headers['Access-Control-Allow-Origin']).toBeDefined();
    });
  });

  describe('Data Integrity Tests', () => {
    test('should validate pagination metadata consistency', async () => {
      const response = await apiClient.get(API_ENDPOINTS.CAT_FACTS.FACTS, { limit: 10 });
      
      const data = response.data;
      
      // Validate pagination math
      expect(data.from).toBeLessThanOrEqual(data.to);
      expect(data.to - data.from + 1).toBe(data.data.length);
      expect(data.current_page).toBeGreaterThan(0);
      expect(data.last_page).toBeGreaterThanOrEqual(data.current_page);
      expect(data.per_page).toBeGreaterThan(0);
      expect(data.total).toBeGreaterThan(0);
    });

    test('should validate URL consistency in pagination', async () => {
      const response = await apiClient.get(API_ENDPOINTS.CAT_FACTS.FACTS);
      
      expect(response.data.first_page_url).toContain('/facts');
      
      if (response.data.next_page_url) {
        expect(response.data.next_page_url).toContain('/facts');
        expect(response.data.next_page_url).toContain('page=');
      }
      
      if (response.data.prev_page_url) {
        expect(response.data.prev_page_url).toContain('/facts');
      }
    });
  });
});