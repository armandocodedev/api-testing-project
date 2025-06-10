const ApiClient = require('../utils/api-client');
const API_ENDPOINTS = require('../config/api-endpoints');
const {
  validateResponseStructure,
  validateStatusCode,
  validateHeaders,
  validateResponseTime,
  validateObjectProperties,
  sleep
} = require('../utils/test-helpers');

describe('HTTPBin API Tests', () => {
  let apiClient;
  let startTime;

  beforeAll(() => {
    apiClient = new ApiClient(API_ENDPOINTS.HTTPBIN.BASE_URL);
  });

  beforeEach(() => {
    startTime = Date.now();
  });

  describe('HTTP Methods Tests', () => {
    test('GET /get - should test GET requests', async () => {
      const params = {
        param1: 'value1',
        param2: 'value2'
      };
      
      const response = await apiClient.get(API_ENDPOINTS.HTTPBIN.GET, params);
      
      validateStatusCode(response, 200);
      validateResponseStructure(response);
      validateResponseTime(startTime);
      
      validateObjectProperties(response.data, ['args', 'headers', 'origin', 'url']);
      
      expect(response.data.args.param1).toBe('value1');
      expect(response.data.args.param2).toBe('value2');
      expect(response.data.url).toContain('/get');
    });

    test('POST /post - should test POST requests', async () => {
      const testData = {
        title: 'Test Post',
        content: 'This is test content',
        userId: 123
      };
      
      const response = await apiClient.post(API_ENDPOINTS.HTTPBIN.POST, testData);
      
      validateStatusCode(response, 200);
      validateResponseStructure(response);
      validateResponseTime(startTime);
      
      validateObjectProperties(response.data, ['args', 'data', 'files', 'form', 'headers', 'json', 'origin', 'url']);
      
      expect(response.data.json).toEqual(testData);
      expect(response.data.url).toContain('/post');
      expect(response.data.headers['Content-Type']).toContain('application/json');
    });

    test('PUT /put - should test PUT requests', async () => {
      const testData = {
        id: 1,
        title: 'Updated Title',
        content: 'Updated content'
      };
      
      const response = await apiClient.put(API_ENDPOINTS.HTTPBIN.PUT, testData);
      
      validateStatusCode(response, 200);
      validateResponseStructure(response);
      validateResponseTime(startTime);
      
      validateObjectProperties(response.data, ['args', 'data', 'files', 'form', 'headers', 'json', 'origin', 'url']);
      
      expect(response.data.json).toEqual(testData);
      expect(response.data.url).toContain('/put');
    });

    test('DELETE /delete - should test DELETE requests', async () => {
      const response = await apiClient.delete(API_ENDPOINTS.HTTPBIN.DELETE);
      
      validateStatusCode(response, 200);
      validateResponseStructure(response);
      validateResponseTime(startTime);
      
      validateObjectProperties(response.data, ['args', 'data', 'files', 'form', 'headers', 'json', 'origin', 'url']);
      
      expect(response.data.url).toContain('/delete');
    });
  });

  describe('Status Code Tests', () => {
    test('GET /status/200 - should return 200 status', async () => {
      const response = await apiClient.get(`${API_ENDPOINTS.HTTPBIN.STATUS}/200`);
      
      validateStatusCode(response, 200);
      validateResponseTime(startTime);
    });

    test('GET /status/404 - should return 404 status', async () => {
      try {
        await apiClient.get(`${API_ENDPOINTS.HTTPBIN.STATUS}/404`);
      } catch (error) {
        validateStatusCode(error.response, 404);
        validateResponseTime(startTime);
      }
    });

    test('GET /status/500 - should return 500 status', async () => {
      try {
        await apiClient.get(`${API_ENDPOINTS.HTTPBIN.STATUS}/500`);
      } catch (error) {
        validateStatusCode(error.response, 500);
        validateResponseTime(startTime);
      }
    });

    test('GET /status/418 - should return 418 (I\'m a teapot)', async () => {
      try {
        await apiClient.get(`${API_ENDPOINTS.HTTPBIN.STATUS}/418`);
      } catch (error) {
        validateStatusCode(error.response, 418);
        validateResponseTime(startTime);
      }
    });
  });

  describe('Headers Tests', () => {
    test('GET /headers - should return request headers', async () => {
      const response = await apiClient.get(API_ENDPOINTS.HTTPBIN.HEADERS);
      
      validateStatusCode(response, 200);
      validateResponseStructure(response);
      validateResponseTime(startTime);
      
      validateObjectProperties(response.data, ['headers']);
      
      expect(response.data.headers['Accept']).toBe('application/json');
      expect(response.data.headers['Content-Type']).toBe('application/json');
      expect(response.data.headers['User-Agent']).toBeDefined();
    });

    test('should test custom headers', async () => {
      const customClient = new ApiClient(API_ENDPOINTS.HTTPBIN.BASE_URL);
      customClient.client.defaults.headers['X-Custom-Header'] = 'test-value';
      customClient.client.defaults.headers['X-API-Key'] = 'secret-key';
      
      const response = await customClient.get(API_ENDPOINTS.HTTPBIN.HEADERS);
      
      validateStatusCode(response, 200);
      validateResponseTime(startTime);
      
      expect(response.data.headers['X-Custom-Header']).toBe('test-value');
      expect(response.data.headers['X-Api-Key']).toBe('secret-key');
    });
  });

  describe('IP and Origin Tests', () => {
    test('GET /ip - should return client IP', async () => {
      const response = await apiClient.get(API_ENDPOINTS.HTTPBIN.IP);
      
      validateStatusCode(response, 200);
      validateResponseStructure(response);
      validateResponseTime(startTime);
      
      validateObjectProperties(response.data, ['origin']);
      
      expect(response.data.origin).toMatch(/^\d+\.\d+\.\d+\.\d+/);
    });
  });

  describe('Delay Tests', () => {
    test('GET /delay/1 - should handle 1 second delay', async () => {
      const delaySeconds = 1;
      const response = await apiClient.get(`${API_ENDPOINTS.HTTPBIN.DELAY}/${delaySeconds}`);
      
      validateStatusCode(response, 200);
      validateResponseStructure(response);
      
      const responseTime = Date.now() - startTime;
      expect(responseTime).toBeGreaterThanOrEqual(delaySeconds * 1000);
      expect(responseTime).toBeLessThan((delaySeconds + 2) * 1000); // Allow 2s buffer
      
      validateObjectProperties(response.data, ['args', 'headers', 'origin', 'url']);
    });

    test('GET /delay/2 - should handle 2 second delay', async () => {
      const delaySeconds = 2;
      const response = await apiClient.get(`${API_ENDPOINTS.HTTPBIN.DELAY}/${delaySeconds}`);
      
      validateStatusCode(response, 200);
      
      const responseTime = Date.now() - startTime;
      expect(responseTime).toBeGreaterThanOrEqual(delaySeconds * 1000);
      expect(responseTime).toBeLessThan((delaySeconds + 2) * 1000);
    }, 15000); // Increase timeout for this test
  });

  describe('JSON Response Tests', () => {
    test('GET /json - should return sample JSON', async () => {
      const response = await apiClient.get(API_ENDPOINTS.HTTPBIN.JSON);
      
      validateStatusCode(response, 200);
      validateResponseStructure(response);
      validateResponseTime(startTime);
      
      expect(typeof response.data).toBe('object');
      expect(response.data).not.toBeNull();
      
      // HTTPBin returns a slideshow object
      if (response.data.slideshow) {
        validateObjectProperties(response.data.slideshow, ['author', 'date', 'slides', 'title']);
      }
    });
  });

  describe('Authentication Simulation', () => {
    test('should test Basic Auth simulation', async () => {
      const testData = {
        username: 'testuser',
        password: 'testpass'
      };
      
      const response = await apiClient.post('/post', testData);
      
      validateStatusCode(response, 200);
      validateResponseTime(startTime);
      
      expect(response.data.json.username).toBe(testData.username);
      expect(response.data.json.password).toBe(testData.password);
    });
  });

  describe('Form Data Tests', () => {
    test('should handle form data submission', async () => {
      // HTTPBin expects form data, but we'll simulate it with JSON
      const formData = {
        field1: 'value1',
        field2: 'value2',
        submit: 'Submit'
      };
      
      const response = await apiClient.post('/post', formData);
      
      validateStatusCode(response, 200);
      validateResponseStructure(response);
      validateResponseTime(startTime);
      
      expect(response.data.json).toEqual(formData);
    });
  });

  describe('Error Handling and Edge Cases', () => {
    test('should handle large payloads', async () => {
      const largeData = {
        data: 'x'.repeat(10000), // 10KB of data
        timestamp: Date.now(),
        metadata: {
          size: 'large',
          test: true
        }
      };
      
      const response = await apiClient.post('/post', largeData);
      
      validateStatusCode(response, 200);
      validateResponseTime(startTime, 10000); // Allow more time for large payload
      
      expect(response.data.json.data).toBe(largeData.data);
      expect(response.data.json.metadata.size).toBe('large');
    });

    test('should handle empty requests', async () => {
      const response = await apiClient.post('/post', {});
      
      validateStatusCode(response, 200);
      validateResponseTime(startTime);
      
      expect(response.data.json).toEqual({});
    });

    test('should handle special characters in data', async () => {
      const specialData = {
        text: 'Special chars: åäö ñü 中文 🚀 @#$%^&*()',
        unicode: '\\u0048\\u0065\\u006C\\u006C\\u006F',
        emoji: '😀🎉🔥💯'
      };
      
      const response = await apiClient.post('/post', specialData);
      
      validateStatusCode(response, 200);
      validateResponseTime(startTime);
      
      expect(response.data.json.text).toBe(specialData.text);
      expect(response.data.json.emoji).toBe(specialData.emoji);
    });
  });

  describe('Performance and Reliability', () => {
    test('should handle concurrent requests', async () => {
      const promises = Array.from({ length: 5 }, (_, i) => 
        apiClient.get('/get', { requestId: i })
      );
      
      const responses = await Promise.all(promises);
      
      responses.forEach((response, index) => {
        validateStatusCode(response, 200);
        expect(response.data.args.requestId).toBe(index.toString());
      });
      
      validateResponseTime(startTime, 10000);
    });

    test('should maintain consistent response times', async () => {
      const responseTimes = [];
      
      for (let i = 0; i < 3; i++) {
        const requestStart = Date.now();
        const response = await apiClient.get('/get');
        const requestTime = Date.now() - requestStart;
        
        validateStatusCode(response, 200);
        responseTimes.push(requestTime);
        
        await sleep(100); // Small delay between requests
      }
      
      // Check that response times are relatively consistent
      const avgResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
      const maxDeviation = Math.max(...responseTimes.map(time => Math.abs(time - avgResponseTime)));
      
      expect(maxDeviation).toBeLessThan(2000); // Allow up to 2s deviation
      console.log(`Average response time: ${avgResponseTime.toFixed(2)}ms`);
    });
  });

  describe('Content Type Validation', () => {
    test('should handle different content types', async () => {
      const response = await apiClient.get('/headers');
      
      validateStatusCode(response, 200);
      validateHeaders(response, {
        'content-type': 'application/json'
      });
      
      expect(response.headers['content-type']).toContain('application/json');
      expect(response.headers['content-length']).toBeDefined();
    });
  });
});