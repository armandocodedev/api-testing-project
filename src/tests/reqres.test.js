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

describe('ReqRes API Tests', () => {
  let apiClient;
  let startTime;

  beforeAll(() => {
    apiClient = new ApiClient(API_ENDPOINTS.REQRES.BASE_URL);
  });

  beforeEach(() => {
    startTime = Date.now();
  });

  describe('Users Endpoints', () => {
    test('GET /users - should retrieve paginated users list', async () => {
      const response = await apiClient.get(API_ENDPOINTS.REQRES.USERS);
      
      validateStatusCode(response, 200);
      validateResponseStructure(response);
      validateResponseTime(startTime);
      
      // Validate pagination structure
      validateObjectProperties(response.data, ['page', 'per_page', 'total', 'total_pages', 'data', 'support']);
      validateArrayResponse(response.data.data, 1);
      
      expect(response.data.page).toBe(1);
      expect(response.data.per_page).toBe(6);
      expect(response.data.total).toBeGreaterThan(0);
      
      // Validate user structure
      const firstUser = response.data.data[0];
      validateObjectProperties(firstUser, ['id', 'email', 'first_name', 'last_name', 'avatar']);
    });

    test('GET /users?page=2 - should retrieve second page of users', async () => {
      const response = await apiClient.get(API_ENDPOINTS.REQRES.USERS, { page: 2 });
      
      validateStatusCode(response, 200);
      validateResponseStructure(response);
      validateResponseTime(startTime);
      
      expect(response.data.page).toBe(2);
      validateArrayResponse(response.data.data, 1);
    });

    test('GET /users/2 - should retrieve specific user', async () => {
      const userId = 2;
      const response = await apiClient.get(`${API_ENDPOINTS.REQRES.USERS}/${userId}`);
      
      validateStatusCode(response, 200);
      validateResponseStructure(response);
      validateResponseTime(startTime);
      
      validateObjectProperties(response.data, ['data', 'support']);
      validateObjectProperties(response.data.data, ['id', 'email', 'first_name', 'last_name', 'avatar']);
      
      expect(response.data.data.id).toBe(userId);
      expect(typeof response.data.data.email).toBe('string');
      expect(response.data.data.email).toContain('@');
    });

    test('GET /users/23 - should handle non-existent user', async () => {
      const response = await apiClient.get(`${API_ENDPOINTS.REQRES.USERS}/23`);
      
      validateStatusCode(response, 404);
      validateResponseTime(startTime);
      
      expect(response.data).toEqual({});
    });

    test('POST /users - should create new user', async () => {
      const userData = {
        name: 'John Doe',
        job: 'Software Developer'
      };
      
      const response = await apiClient.post(API_ENDPOINTS.REQRES.USERS, userData);
      
      validateStatusCode(response, 201);
      validateResponseStructure(response);
      validateResponseTime(startTime);
      
      validateObjectProperties(response.data, ['name', 'job', 'id', 'createdAt']);
      
      expect(response.data.name).toBe(userData.name);
      expect(response.data.job).toBe(userData.job);
      expect(response.data.id).toBeDefined();
      expect(response.data.createdAt).toBeDefined();
    });

    test('PUT /users/2 - should update existing user', async () => {
      const userData = {
        name: 'Jane Smith',
        job: 'QA Engineer'
      };
      
      const userId = 2;
      const response = await apiClient.put(`${API_ENDPOINTS.REQRES.USERS}/${userId}`, userData);
      
      validateStatusCode(response, 200);
      validateResponseStructure(response);
      validateResponseTime(startTime);
      
      validateObjectProperties(response.data, ['name', 'job', 'updatedAt']);
      
      expect(response.data.name).toBe(userData.name);
      expect(response.data.job).toBe(userData.job);
      expect(response.data.updatedAt).toBeDefined();
    });

    test('PATCH /users/2 - should partially update user', async () => {
      const userData = {
        job: 'Senior Developer'
      };
      
      const userId = 2;
      const response = await apiClient.patch(`${API_ENDPOINTS.REQRES.USERS}/${userId}`, userData);
      
      validateStatusCode(response, 200);
      validateResponseStructure(response);
      validateResponseTime(startTime);
      
      expect(response.data.job).toBe(userData.job);
      expect(response.data.updatedAt).toBeDefined();
    });

    test('DELETE /users/2 - should delete user', async () => {
      const userId = 2;
      const response = await apiClient.delete(`${API_ENDPOINTS.REQRES.USERS}/${userId}`);
      
      validateStatusCode(response, 204);
      validateResponseTime(startTime);
      
      // No content expected for 204 status
      expect(response.data).toBeFalsy();
    });
  });

  describe('Authentication Endpoints', () => {
    test('POST /register - should register user successfully', async () => {
      const registrationData = {
        email: 'eve.holt@reqres.in',
        password: 'pistol'
      };
      
      const response = await apiClient.post(API_ENDPOINTS.REQRES.REGISTER, registrationData);
      
      validateStatusCode(response, 200);
      validateResponseStructure(response);
      validateResponseTime(startTime);
      
      validateObjectProperties(response.data, ['id', 'token']);
      
      expect(response.data.id).toBeDefined();
      expect(response.data.token).toBeDefined();
      expect(typeof response.data.token).toBe('string');
    });

    test('POST /register - should fail with missing password', async () => {
      const registrationData = {
        email: 'sydney@fife'
      };
      
      try {
        await apiClient.post(API_ENDPOINTS.REQRES.REGISTER, registrationData);
      } catch (error) {
        validateStatusCode(error.response, 400);
        validateResponseTime(startTime);
        
        expect(error.response.data.error).toBe('Missing password');
      }
    });

    test('POST /login - should login successfully', async () => {
      const loginData = {
        email: 'eve.holt@reqres.in',
        password: 'cityslicka'
      };
      
      const response = await apiClient.post(API_ENDPOINTS.REQRES.LOGIN, loginData);
      
      validateStatusCode(response, 200);
      validateResponseStructure(response);
      validateResponseTime(startTime);
      
      validateObjectProperties(response.data, ['token']);
      
      expect(response.data.token).toBeDefined();
      expect(typeof response.data.token).toBe('string');
    });

    test('POST /login - should fail with missing password', async () => {
      const loginData = {
        email: 'peter@klaven'
      };
      
      try {
        await apiClient.post(API_ENDPOINTS.REQRES.LOGIN, loginData);
      } catch (error) {
        validateStatusCode(error.response, 400);
        validateResponseTime(startTime);
        
        expect(error.response.data.error).toBe('Missing password');
      }
    });
  });

  describe('Resources Endpoints', () => {
    test('GET /unknown - should retrieve list of resources', async () => {
      const response = await apiClient.get(API_ENDPOINTS.REQRES.UNKNOWN);
      
      validateStatusCode(response, 200);
      validateResponseStructure(response);
      validateResponseTime(startTime);
      
      validateObjectProperties(response.data, ['page', 'per_page', 'total', 'total_pages', 'data', 'support']);
      validateArrayResponse(response.data.data, 1);
      
      // Validate resource structure
      const firstResource = response.data.data[0];
      validateObjectProperties(firstResource, ['id', 'name', 'year', 'color', 'pantone_value']);
    });

    test('GET /unknown/2 - should retrieve specific resource', async () => {
      const resourceId = 2;
      const response = await apiClient.get(`${API_ENDPOINTS.REQRES.UNKNOWN}/${resourceId}`);
      
      validateStatusCode(response, 200);
      validateResponseStructure(response);
      validateResponseTime(startTime);
      
      validateObjectProperties(response.data, ['data', 'support']);
      validateObjectProperties(response.data.data, ['id', 'name', 'year', 'color', 'pantone_value']);
      
      expect(response.data.data.id).toBe(resourceId);
    });
  });

  describe('Response Headers and Performance', () => {
    test('should have correct content-type headers', async () => {
      const response = await apiClient.get(API_ENDPOINTS.REQRES.USERS);
      
      validateHeaders(response, {
        'content-type': 'application/json'
      });
      
      expect(response.headers['content-type']).toContain('application/json');
    });

    test('should include CORS headers', async () => {
      const response = await apiClient.get(API_ENDPOINTS.REQRES.USERS);
      
      expect(response.headers['access-control-allow-origin']).toBeDefined();
    });

    test('should respond within acceptable time limits', async () => {
      const response = await apiClient.get(API_ENDPOINTS.REQRES.USERS);
      const responseTime = validateResponseTime(startTime, 3000);
      
      expect(responseTime).toBeWithinRange(0, 3000);
      console.log(`ReqRes response time: ${responseTime}ms`);
    });
  });

  describe('Error Handling', () => {
    test('should handle malformed requests gracefully', async () => {
      try {
        await apiClient.post(API_ENDPOINTS.REQRES.USERS, 'invalid-json');
      } catch (error) {
        expect(error.response.status).toBeGreaterThanOrEqual(400);
        validateResponseTime(startTime);
      }
    });
  });
});