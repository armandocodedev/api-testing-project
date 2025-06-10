const ApiClient = require('../utils/api-client');
const API_ENDPOINTS = require('../config/api-endpoints');
const {
  validateResponseStructure,
  validateStatusCode,
  validateHeaders,
  validateResponseTime,
  validateArrayResponse,
  validateObjectProperties,
  generateTestData
} = require('../utils/test-helpers');

describe('JSONPlaceholder API Tests', () => {
  let apiClient;
  let startTime;

  beforeAll(() => {
    apiClient = new ApiClient(API_ENDPOINTS.JSONPLACEHOLDER.BASE_URL);
  });

  beforeEach(() => {
    startTime = Date.now();
  });

  describe('Posts Endpoints', () => {
    test('GET /posts - should retrieve all posts', async () => {
      const response = await apiClient.get(API_ENDPOINTS.JSONPLACEHOLDER.POSTS);
      
      validateStatusCode(response, 200);
      validateResponseStructure(response);
      validateArrayResponse(response.data, 1);
      validateResponseTime(startTime);
      
      // Validate first post structure
      const firstPost = response.data[0];
      validateObjectProperties(firstPost, ['userId', 'id', 'title', 'body']);
      
      expect(response.data).toHaveLength(100);
    });

    test('GET /posts/1 - should retrieve specific post', async () => {
      const postId = 1;
      const response = await apiClient.get(`${API_ENDPOINTS.JSONPLACEHOLDER.POSTS}/${postId}`);
      
      validateStatusCode(response, 200);
      validateResponseStructure(response);
      validateObjectProperties(response.data, ['userId', 'id', 'title', 'body']);
      validateResponseTime(startTime);
      
      expect(response.data.id).toBe(postId);
      expect(typeof response.data.title).toBe('string');
      expect(typeof response.data.body).toBe('string');
    });

    test('GET /posts/999 - should handle non-existent post', async () => {
      const response = await apiClient.get(`${API_ENDPOINTS.JSONPLACEHOLDER.POSTS}/999`);
      
      validateStatusCode(response, 404);
      validateResponseTime(startTime);
    });

    test('POST /posts - should create new post', async () => {
      const testData = generateTestData();
      const response = await apiClient.post(API_ENDPOINTS.JSONPLACEHOLDER.POSTS, testData);
      
      validateStatusCode(response, 201);
      validateResponseStructure(response);
      validateObjectProperties(response.data, ['id', 'title', 'body', 'userId']);
      validateResponseTime(startTime);
      
      expect(response.data.title).toBe(testData.title);
      expect(response.data.body).toBe(testData.body);
      expect(response.data.userId).toBe(testData.userId);
      expect(response.data.id).toBe(101); // JSONPlaceholder returns 101 for new posts
    });

    test('PUT /posts/1 - should update existing post', async () => {
      const testData = generateTestData();
      const postId = 1;
      const response = await apiClient.put(`${API_ENDPOINTS.JSONPLACEHOLDER.POSTS}/${postId}`, testData);
      
      validateStatusCode(response, 200);
      validateResponseStructure(response);
      validateObjectProperties(response.data, ['id', 'title', 'body', 'userId']);
      validateResponseTime(startTime);
      
      expect(response.data.id).toBe(postId);
      expect(response.data.title).toBe(testData.title);
      expect(response.data.body).toBe(testData.body);
    });

    test('DELETE /posts/1 - should delete post', async () => {
      const postId = 1;
      const response = await apiClient.delete(`${API_ENDPOINTS.JSONPLACEHOLDER.POSTS}/${postId}`);
      
      validateStatusCode(response, 200);
      validateResponseTime(startTime);
    });
  });

  describe('Users Endpoints', () => {
    test('GET /users - should retrieve all users', async () => {
      const response = await apiClient.get(API_ENDPOINTS.JSONPLACEHOLDER.USERS);
      
      validateStatusCode(response, 200);
      validateResponseStructure(response);
      validateArrayResponse(response.data, 1);
      validateResponseTime(startTime);
      
      expect(response.data).toHaveLength(10);
      
      // Validate user structure
      const firstUser = response.data[0];
      validateObjectProperties(firstUser, ['id', 'name', 'username', 'email']);
    });

    test('GET /users/1 - should retrieve specific user', async () => {
      const userId = 1;
      const response = await apiClient.get(`${API_ENDPOINTS.JSONPLACEHOLDER.USERS}/${userId}`);
      
      validateStatusCode(response, 200);
      validateResponseStructure(response);
      validateObjectProperties(response.data, ['id', 'name', 'username', 'email', 'address', 'phone', 'website', 'company']);
      validateResponseTime(startTime);
      
      expect(response.data.id).toBe(userId);
      expect(typeof response.data.name).toBe('string');
      expect(typeof response.data.email).toBe('string');
    });
  });

  describe('Comments Endpoints', () => {
    test('GET /comments - should retrieve all comments', async () => {
      const response = await apiClient.get(API_ENDPOINTS.JSONPLACEHOLDER.COMMENTS);
      
      validateStatusCode(response, 200);
      validateResponseStructure(response);
      validateArrayResponse(response.data, 1);
      validateResponseTime(startTime);
      
      expect(response.data).toHaveLength(500);
      
      // Validate comment structure
      const firstComment = response.data[0];
      validateObjectProperties(firstComment, ['postId', 'id', 'name', 'email', 'body']);
    });

    test('GET /posts/1/comments - should retrieve comments for specific post', async () => {
      const postId = 1;
      const response = await apiClient.get(`${API_ENDPOINTS.JSONPLACEHOLDER.POSTS}/${postId}/comments`);
      
      validateStatusCode(response, 200);
      validateResponseStructure(response);
      validateArrayResponse(response.data, 1);
      validateResponseTime(startTime);
      
      // All comments should belong to the specified post
      response.data.forEach(comment => {
        expect(comment.postId).toBe(postId);
      });
    });
  });

  describe('Response Headers Validation', () => {
    test('should have correct content-type headers', async () => {
      const response = await apiClient.get(API_ENDPOINTS.JSONPLACEHOLDER.POSTS);
      
      validateHeaders(response, {
        'content-type': 'application/json'
      });
      
      expect(response.headers['content-type']).toContain('application/json');
    });
  });

  describe('Performance Tests', () => {
    test('should respond within acceptable time limits', async () => {
      const response = await apiClient.get(API_ENDPOINTS.JSONPLACEHOLDER.POSTS);
      const responseTime = validateResponseTime(startTime, 3000);
      
      expect(responseTime).toBeWithinRange(0, 3000);
      console.log(`Response time: ${responseTime}ms`);
    });
  });
});