/**
 * Test Helper Functions
 * Common utilities and assertions for test files
 */

/**
 * Validates the structure of a standard API response
 */
function validateResponseStructure(response, expectedKeys = []) {
  expect(response).toBeDefined();
  expect(response.status).toBeDefined();
  expect(response.data).toBeDefined();
  
  if (expectedKeys.length > 0) {
    expectedKeys.forEach(key => {
      expect(response.data).toHaveProperty(key);
    });
  }
}

/**
 * Validates HTTP status codes
 */
function validateStatusCode(response, expectedStatus) {
  expect(response.status).toBe(expectedStatus);
}

/**
 * Validates response headers
 */
function validateHeaders(response, expectedHeaders = {}) {
  Object.keys(expectedHeaders).forEach(header => {
    expect(response.headers[header.toLowerCase()]).toBeDefined();
  });
}

/**
 * Validates response time is within acceptable limits
 */
function validateResponseTime(startTime, maxTime = 5000) {
  const responseTime = Date.now() - startTime;
  expect(responseTime).toBeLessThan(maxTime);
  return responseTime;
}

/**
 * Validates array response structure
 */
function validateArrayResponse(data, minLength = 0) {
  expect(Array.isArray(data)).toBe(true);
  expect(data.length).toBeGreaterThanOrEqual(minLength);
}

/**
 * Validates object properties
 */
function validateObjectProperties(obj, requiredProps = []) {
  requiredProps.forEach(prop => {
    expect(obj).toHaveProperty(prop);
    expect(obj[prop]).toBeDefined();
  });
}

/**
 * Generates random test data
 */
function generateTestData() {
  return {
    title: `Test Title ${Date.now()}`,
    body: `Test body content ${Math.random()}`,
    userId: Math.floor(Math.random() * 10) + 1,
    id: Math.floor(Math.random() * 1000) + 1
  };
}

/**
 * Sleep function for testing delays
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
  validateResponseStructure,
  validateStatusCode,
  validateHeaders,
  validateResponseTime,
  validateArrayResponse,
  validateObjectProperties,
  generateTestData,
  sleep
};