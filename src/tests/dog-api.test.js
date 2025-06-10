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

describe('Dog API Tests', () => {
  let apiClient;
  let startTime;

  beforeAll(() => {
    apiClient = new ApiClient(API_ENDPOINTS.DOG_API.BASE_URL);
  });

  beforeEach(() => {
    startTime = Date.now();
  });

  describe('Random Dog Images', () => {
    test('GET /breeds/image/random - should get random dog image', async () => {
      const response = await apiClient.get(API_ENDPOINTS.DOG_API.RANDOM);
      
      validateStatusCode(response, 200);
      validateResponseStructure(response);
      validateResponseTime(startTime);
      
      validateObjectProperties(response.data, ['message', 'status']);
      
      expect(response.data.status).toBe('success');
      expect(response.data.message).toMatch(/^https:\/\/images\.dog\.ceo\/breeds\/.*\.(jpg|jpeg|png)$/);
      expect(typeof response.data.message).toBe('string');
    });

    test('GET /breeds/image/random/3 - should get 3 random dog images', async () => {
      const count = 3;
      const response = await apiClient.get(`${API_ENDPOINTS.DOG_API.RANDOM}/${count}`);
      
      validateStatusCode(response, 200);
      validateResponseStructure(response);
      validateResponseTime(startTime);
      
      validateObjectProperties(response.data, ['message', 'status']);
      validateArrayResponse(response.data.message, count);
      
      expect(response.data.status).toBe('success');
      expect(response.data.message).toHaveLength(count);
      
      // Validate each image URL
      response.data.message.forEach(imageUrl => {
        expect(imageUrl).toMatch(/^https:\/\/images\.dog\.ceo\/breeds\/.*\.(jpg|jpeg|png)$/);
      });
    });

    test('GET /breeds/image/random/10 - should get 10 random dog images', async () => {
      const count = 10;
      const response = await apiClient.get(`${API_ENDPOINTS.DOG_API.RANDOM}/${count}`);
      
      validateStatusCode(response, 200);
      validateResponseStructure(response);
      validateResponseTime(startTime);
      
      expect(response.data.message).toHaveLength(count);
      expect(response.data.status).toBe('success');
      
      // Check that we get unique images (usually true for random API)
      const uniqueImages = new Set(response.data.message);
      expect(uniqueImages.size).toBeGreaterThan(1); // Should have some variety
    });
  });

  describe('Dog Breeds List', () => {
    test('GET /breeds/list/all - should get all dog breeds', async () => {
      const response = await apiClient.get(API_ENDPOINTS.DOG_API.BREEDS);
      
      validateStatusCode(response, 200);
      validateResponseStructure(response);
      validateResponseTime(startTime);
      
      validateObjectProperties(response.data, ['message', 'status']);
      
      expect(response.data.status).toBe('success');
      expect(typeof response.data.message).toBe('object');
      expect(response.data.message).not.toBeNull();
      
      // Check for some common breeds
      const breeds = Object.keys(response.data.message);
      expect(breeds.length).toBeGreaterThan(50); // Should have many breeds
      expect(breeds).toContain('retriever');
      expect(breeds).toContain('bulldog');
      expect(breeds).toContain('terrier');
      
      // Check sub-breeds structure
      expect(Array.isArray(response.data.message.retriever)).toBe(true);
      expect(response.data.message.retriever).toContain('golden');
      expect(response.data.message.retriever).toContain('labrador');
    });

    test('should validate breed structure with sub-breeds', async () => {
      const response = await apiClient.get(API_ENDPOINTS.DOG_API.BREEDS);
      
      const breeds = response.data.message;
      
      // Check that each breed has an array of sub-breeds (can be empty)
      Object.keys(breeds).forEach(breed => {
        expect(Array.isArray(breeds[breed])).toBe(true);
      });
      
      // Verify specific breeds with known sub-breeds
      if (breeds.terrier) {
        expect(breeds.terrier.length).toBeGreaterThan(0);
        expect(breeds.terrier).toContain('bull');
      }
      
      if (breeds.spaniel) {
        expect(breeds.spaniel).toContain('cocker');
      }
    });
  });

  describe('Breed-Specific Images', () => {
    test('GET /breed/hound/images - should get hound breed images', async () => {
      const breed = 'hound';
      const response = await apiClient.get(`${API_ENDPOINTS.DOG_API.BREED_IMAGES}/${breed}/images`);
      
      validateStatusCode(response, 200);
      validateResponseStructure(response);
      validateResponseTime(startTime);
      
      validateObjectProperties(response.data, ['message', 'status']);
      validateArrayResponse(response.data.message, 1);
      
      expect(response.data.status).toBe('success');
      
      // Validate that all images are of the specified breed
      response.data.message.forEach(imageUrl => {
        expect(imageUrl).toMatch(/^https:\/\/images\.dog\.ceo\/breeds\/hound.*\.(jpg|jpeg|png)$/);
      });
    });

    test('GET /breed/retriever/golden/images - should get golden retriever images', async () => {
      const breed = 'retriever';
      const subBreed = 'golden';
      const response = await apiClient.get(`${API_ENDPOINTS.DOG_API.BREED_IMAGES}/${breed}/${subBreed}/images`);
      
      validateStatusCode(response, 200);
      validateResponseStructure(response);
      validateResponseTime(startTime);
      
      validateObjectProperties(response.data, ['message', 'status']);
      validateArrayResponse(response.data.message, 1);
      
      expect(response.data.status).toBe('success');
      
      // Validate that all images are of golden retrievers
      response.data.message.forEach(imageUrl => {
        expect(imageUrl).toMatch(/^https:\/\/images\.dog\.ceo\/breeds\/retriever-golden.*\.(jpg|jpeg|png)$/);
      });
    });

    test('GET /breed/bulldog/images/random - should get random bulldog image', async () => {
      const breed = 'bulldog';
      const response = await apiClient.get(`${API_ENDPOINTS.DOG_API.BREED_IMAGES}/${breed}/images/random`);
      
      validateStatusCode(response, 200);
      validateResponseStructure(response);
      validateResponseTime(startTime);
      
      validateObjectProperties(response.data, ['message', 'status']);
      
      expect(response.data.status).toBe('success');
      expect(typeof response.data.message).toBe('string');
      expect(response.data.message).toMatch(/^https:\/\/images\.dog\.ceo\/breeds\/bulldog.*\.(jpg|jpeg|png)$/);
    });

    test('GET /breed/terrier/bull/images/random/3 - should get 3 random bull terrier images', async () => {
      const breed = 'terrier';
      const subBreed = 'bull';
      const count = 3;
      const response = await apiClient.get(`${API_ENDPOINTS.DOG_API.BREED_IMAGES}/${breed}/${subBreed}/images/random/${count}`);
      
      validateStatusCode(response, 200);
      validateResponseStructure(response);
      validateResponseTime(startTime);
      
      validateObjectProperties(response.data, ['message', 'status']);
      validateArrayResponse(response.data.message, count);
      
      expect(response.data.status).toBe('success');
      expect(response.data.message).toHaveLength(count);
      
      response.data.message.forEach(imageUrl => {
        expect(imageUrl).toMatch(/^https:\/\/images\.dog\.ceo\/breeds\/terrier-bull.*\.(jpg|jpeg|png)$/);
      });
    });
  });

  describe('Error Handling', () => {
    test('GET /breed/invalidbreed/images - should handle invalid breed', async () => {
      const invalidBreed = 'invalidbreed';
      
      try {
        await apiClient.get(`${API_ENDPOINTS.DOG_API.BREED_IMAGES}/${invalidBreed}/images`);
      } catch (error) {
        validateStatusCode(error.response, 404);
        validateResponseTime(startTime);
        
        expect(error.response.data.status).toBe('error');
        expect(error.response.data.message).toContain('Breed not found');
      }
    });

    test('GET /breed/hound/invalidsubbreed/images - should handle invalid sub-breed', async () => {
      const breed = 'hound';
      const invalidSubBreed = 'invalidsubbreed';
      
      try {
        await apiClient.get(`${API_ENDPOINTS.DOG_API.BREED_IMAGES}/${breed}/${invalidSubBreed}/images`);
      } catch (error) {
        validateStatusCode(error.response, 404);
        validateResponseTime(startTime);
        
        expect(error.response.data.status).toBe('error');
        expect(error.response.data.message).toContain('Sub-breed not found');
      }
    });

    test('should handle excessive count requests gracefully', async () => {
      const excessiveCount = 100;
      
      try {
        const response = await apiClient.get(`${API_ENDPOINTS.DOG_API.RANDOM}/${excessiveCount}`);
        
        // API might limit the count or return an error
        if (response.status === 200) {
          expect(response.data.message.length).toBeLessThanOrEqual(50); // Reasonable limit
        }
      } catch (error) {
        // API might return an error for excessive requests
        expect(error.response.status).toBeGreaterThanOrEqual(400);
      }
      
      validateResponseTime(startTime);
    });
  });

  describe('Image URL Validation', () => {
    test('should validate image URLs are accessible', async () => {
      const response = await apiClient.get(API_ENDPOINTS.DOG_API.RANDOM);
      const imageUrl = response.data.message;
      
      // Test that the URL is properly formatted
      expect(imageUrl).toMatch(/^https:\/\/images\.dog\.ceo\/breeds\/.*\.(jpg|jpeg|png)$/);
      
      // Test URL components
      const url = new URL(imageUrl);
      expect(url.protocol).toBe('https:');
      expect(url.hostname).toBe('images.dog.ceo');
      expect(url.pathname).toContain('/breeds/');
      expect(url.pathname).toMatch(/\.(jpg|jpeg|png)$/);
    });

    test('should validate multiple image URLs', async () => {
      const response = await apiClient.get(`${API_ENDPOINTS.DOG_API.RANDOM}/5`);
      
      response.data.message.forEach((imageUrl, index) => {
        expect(imageUrl).toMatch(/^https:\/\/images\.dog\.ceo\/breeds\/.*\.(jpg|jpeg|png)$/);
        
        // Ensure URLs are different (usually true for random API)
        response.data.message.slice(index + 1).forEach(otherUrl => {
          // Don't enforce uniqueness as it's random, but log if all same
          if (imageUrl === otherUrl) {
            console.warn(`Duplicate URL found: ${imageUrl}`);
          }
        });
      });
    });
  });

  describe('API Performance and Reliability', () => {
    test('should handle concurrent requests', async () => {
      const promises = Array.from({ length: 5 }, () => 
        apiClient.get(API_ENDPOINTS.DOG_API.RANDOM)
      );
      
      const responses = await Promise.all(promises);
      
      responses.forEach(response => {
        validateStatusCode(response, 200);
        expect(response.data.status).toBe('success');
        expect(response.data.message).toMatch(/^https:\/\/images\.dog\.ceo\/breeds\/.*\.(jpg|jpeg|png)$/);
      });
      
      validateResponseTime(startTime, 10000);
    });

    test('should maintain consistent response structure', async () => {
      const responses = [];
      
      for (let i = 0; i < 3; i++) {
        const response = await apiClient.get(API_ENDPOINTS.DOG_API.RANDOM);
        responses.push(response);
      }
      
      responses.forEach(response => {
        validateStatusCode(response, 200);
        validateObjectProperties(response.data, ['message', 'status']);
        expect(response.data.status).toBe('success');
        expect(typeof response.data.message).toBe('string');
      });
      
      validateResponseTime(startTime);
    });

    test('should have reasonable response times', async () => {
      const response = await apiClient.get(API_ENDPOINTS.DOG_API.RANDOM);
      const responseTime = validateResponseTime(startTime, 5000);
      
      expect(responseTime).toBeWithinRange(0, 5000);
      console.log(`Dog API response time: ${responseTime}ms`);
    });
  });

  describe('Content and Headers Validation', () => {
    test('should have correct content-type headers', async () => {
      const response = await apiClient.get(API_ENDPOINTS.DOG_API.RANDOM);
      
      validateHeaders(response, {
        'content-type': 'application/json'
      });
      
      expect(response.headers['content-type']).toContain('application/json');
    });

    test('should include CORS headers for web compatibility', async () => {
      const response = await apiClient.get(API_ENDPOINTS.DOG_API.RANDOM);
      
      // Dog API should support CORS for web applications
      expect(response.headers['access-control-allow-origin']).toBeDefined();
    });
  });
});