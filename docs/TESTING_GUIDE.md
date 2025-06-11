# API Testing Guide

This guide provides detailed information on how to use the API testing project, run tests, and understand the test results.

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Test Structure](#test-structure)
- [Running Tests](#running-tests)
- [Understanding Test Results](#understanding-test-results)
- [Adding New Tests](#adding-new-tests)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

## 🚀 Quick Start

### Prerequisites
- Node.js v14 or higher
- npm or yarn package manager
- Git (for cloning)

### Installation Steps

1. **Clone the repository:**
```bash
git clone https://github.com/armandocodedev/api-testing-project.git
cd api-testing-project
```

2. **Install dependencies:**
```bash
npm install
```

3. **Run all tests:**
```bash
npm test
```

4. **Run tests with coverage:**
```bash
npm run test:coverage
```

## 🏗️ Test Structure

### Directory Layout
```
src/
├── tests/                 # All test files
│   ├── jsonplaceholder.test.js
│   ├── reqres.test.js
│   ├── httpbin.test.js
│   ├── dog-api.test.js
│   └── cat-facts.test.js
├── utils/                 # Test utilities
│   ├── api-client.js      # HTTP client wrapper
│   ├── test-helpers.js    # Common test functions
│   └── test-setup.js      # Jest setup configuration
└── config/
    └── api-endpoints.js   # API endpoint configurations
```

### Test Categories

Each test file covers different aspects of API testing:

#### 1. **JSONPlaceholder Tests** (`jsonplaceholder.test.js`)
- CRUD operations (Create, Read, Update, Delete)
- Data validation
- Error handling
- Response structure validation

#### 2. **ReqRes Tests** (`reqres.test.js`)
- User management endpoints
- Authentication (login/register)
- Pagination testing
- Error scenarios

#### 3. **HTTPBin Tests** (`httpbin.test.js`)
- HTTP methods testing (GET, POST, PUT, DELETE)
- Status code validation
- Headers testing
- Request/response echo testing
- Delay and timeout testing

#### 4. **Dog API Tests** (`dog-api.test.js`)
- Random image retrieval
- Breed-specific queries
- URL validation
- Data structure validation

#### 5. **Cat Facts Tests** (`cat-facts.test.js`)
- Random fact retrieval
- Pagination testing
- Content quality validation
- Parameter validation

## 🧪 Running Tests

### All Tests
```bash
# Run all tests
npm test

# Run tests in watch mode (auto-rerun on file changes)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

### Specific API Tests
```bash
# Test only JSONPlaceholder API
npm run test:jsonplaceholder

# Test only ReqRes API
npm run test:reqres

# Test only HTTPBin API
npm run test:httpbin

# Test only Dog API
npm run test:dogs

# Test only Cat Facts API
npm run test:cats
```

### Postman Collection
```bash
# Run Postman collection with Newman
npm run postman
```

### Development Tools
```bash
# Run ESLint for code quality
npm run lint

# Auto-fix ESLint issues
npm run lint:fix
```

## 📊 Understanding Test Results

### Jest Output
```bash
PASS src/tests/jsonplaceholder.test.js
  JSONPlaceholder API Tests
    Posts Endpoints
      ✓ GET /posts - should retrieve all posts (234ms)
      ✓ GET /posts/1 - should retrieve specific post (187ms)
      ✓ POST /posts - should create new post (245ms)
    Users Endpoints
      ✓ GET /users - should retrieve all users (156ms)
```

### Coverage Report
The coverage report shows:
- **Lines**: Percentage of code lines executed
- **Functions**: Percentage of functions called
- **Branches**: Percentage of code branches taken
- **Statements**: Percentage of statements executed

### Performance Metrics
Tests include response time validation:
- Most APIs should respond within 2-5 seconds
- Response times are logged in test output
- Custom `toBeWithinRange` matcher validates timing

## ➕ Adding New Tests

### 1. Create a New Test File
```javascript
// src/tests/new-api.test.js
const ApiClient = require('../utils/api-client');
const API_ENDPOINTS = require('../config/api-endpoints');
const {
  validateResponseStructure,
  validateStatusCode,
  validateResponseTime
} = require('../utils/test-helpers');

describe('New API Tests', () => {
  let apiClient;
  let startTime;

  beforeAll(() => {
    apiClient = new ApiClient('https://api.example.com');
  });

  beforeEach(() => {
    startTime = Date.now();
  });

  test('should get data from new API', async () => {
    const response = await apiClient.get('/endpoint');
    
    validateStatusCode(response, 200);
    validateResponseStructure(response);
    validateResponseTime(startTime);
    
    // Add specific assertions
    expect(response.data).toBeDefined();
  });
});
```

### 2. Add API Endpoints Configuration
```javascript
// src/config/api-endpoints.js
const API_ENDPOINTS = {
  // ... existing endpoints
  NEW_API: {
    BASE_URL: 'https://api.example.com',
    ENDPOINT: '/data'
  }
};
```

### 3. Add npm Script
```json
// package.json
{
  "scripts": {
    "test:newapi": "jest src/tests/new-api.test.js"
  }
}
```

## 🎯 Best Practices

### Test Organization
- Group related tests in `describe` blocks
- Use descriptive test names that explain the expected behavior
- Keep tests focused on a single aspect
- Use `beforeAll` and `beforeEach` for setup

### API Testing Best Practices
- **Validate Response Structure**: Always check for required fields
- **Test Error Scenarios**: Include negative test cases
- **Validate Response Times**: Ensure APIs perform within acceptable limits
- **Test Data Quality**: Verify the content makes sense
- **Handle Async Operations**: Use async/await properly

### Example Test Structure
```javascript
describe('API Endpoint Tests', () => {
  describe('Successful Scenarios', () => {
    test('should handle valid requests', async () => {
      // Test implementation
    });
  });

  describe('Error Scenarios', () => {
    test('should handle invalid requests', async () => {
      // Test implementation
    });
  });

  describe('Performance Tests', () => {
    test('should respond within time limits', async () => {
      // Test implementation
    });
  });
});
```

### Assertions Best Practices
```javascript
// Good: Specific assertions
expect(response.status).toBe(200);
expect(response.data.users).toHaveLength(10);
expect(response.data.users[0]).toHaveProperty('email');

// Avoid: Vague assertions
expect(response).toBeTruthy();
expect(response.data).toBeDefined();
```

## 🔧 Troubleshooting

### Common Issues

#### 1. **Network Timeouts**
```bash
Error: timeout of 5000ms exceeded
```
**Solution**: Increase timeout in test or check network connectivity
```javascript
jest.setTimeout(10000); // Increase to 10 seconds
```

#### 2. **API Rate Limiting**
```bash
Error: Request failed with status code 429
```
**Solution**: Add delays between requests or reduce concurrent tests
```javascript
await sleep(1000); // Wait 1 second between requests
```

#### 3. **Unexpected Response Structure**
```bash
Expected property 'data' but received undefined
```
**Solution**: Check API documentation and update test expectations

#### 4. **SSL Certificate Issues**
```bash
Error: unable to verify the first certificate
```
**Solution**: Set NODE_TLS_REJECT_UNAUTHORIZED (not recommended for production)
```bash
NODE_TLS_REJECT_UNAUTHORIZED=0 npm test
```

### Debug Mode
Run tests with verbose output:
```bash
npm test -- --verbose
```

Enable debug logging:
```bash
DEBUG=* npm test
```

### Environment Variables
Create a `.env` file for configuration:
```bash
# .env
API_TIMEOUT=10000
LOG_LEVEL=debug
```

## 📈 Continuous Integration

### GitHub Actions Example
```yaml
# .github/workflows/api-tests.yml
name: API Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '16'
      - run: npm install
      - run: npm test
      - run: npm run test:coverage
```

### Test Reports
Generate JUnit XML reports for CI:
```bash
npm test -- --reporters=default --reporters=jest-junit
```

## 🔍 Monitoring and Alerting

### Response Time Monitoring
The tests include built-in response time monitoring:
- Warnings for responses > 2 seconds
- Failures for responses > 5 seconds
- Custom timing validations

### Error Rate Tracking
Track API reliability:
- Success/failure rates per endpoint
- Error categorization
- Trend analysis over time

## 📚 Additional Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Axios Documentation](https://axios-http.com/docs/intro)
- [Postman/Newman Documentation](https://www.npmjs.com/package/newman)
- [API Testing Best Practices](https://assertible.com/blog/api-testing-best-practices)

## 🤝 Contributing

When adding new tests or features:

1. Follow the existing code structure
2. Add comprehensive test coverage
3. Update documentation
4. Test both success and failure scenarios
5. Include performance validations
6. Add appropriate error handling

## 📞 Support

If you encounter issues:
1. Check this troubleshooting guide
2. Review test logs for specific error messages
3. Ensure all dependencies are installed correctly
4. Verify API endpoints are accessible
5. Check for any API changes or deprecations