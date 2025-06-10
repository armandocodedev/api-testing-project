# API Testing Project

A comprehensive API testing suite for popular public dummy APIs using JavaScript/Node.js with multiple testing frameworks.

## 🎯 APIs Tested

- **JSONPlaceholder** - Fake REST API for testing and prototyping
- **ReqRes** - Hosted REST-API for front-end developers  
- **HTTPBin** - HTTP request & response service
- **Dog API** - Random dog images API
- **Cat Facts API** - Random cat facts

## 🛠️ Testing Frameworks

- **Jest** - JavaScript testing framework
- **Axios** - HTTP client for API requests
- **Supertest** - HTTP assertions library
- **Newman** - Postman CLI runner

## 📁 Project Structure

```
api-testing-project/
├── src/
│   ├── tests/
│   │   ├── jsonplaceholder.test.js
│   │   ├── reqres.test.js
│   │   ├── httpbin.test.js
│   │   ├── dog-api.test.js
│   │   └── cat-facts.test.js
│   ├── utils/
│   │   ├── api-client.js
│   │   └── test-helpers.js
│   └── config/
│       └── api-endpoints.js
├── postman/
│   └── API-Testing-Collection.json
├── reports/
├── package.json
├── jest.config.js
├── .gitignore
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/armandocodedev/api-testing-project.git
cd api-testing-project
```

2. Install dependencies:
```bash
npm install
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific API tests
npm run test:jsonplaceholder
npm run test:reqres
npm run test:httpbin
npm run test:dogs
npm run test:cats

# Run Postman collection
npm run postman
```

## 📋 Test Coverage

The test suite covers:

### JSONPlaceholder API
- GET /posts - Retrieve all posts
- GET /posts/{id} - Retrieve specific post
- POST /posts - Create new post
- PUT /posts/{id} - Update post
- DELETE /posts/{id} - Delete post
- GET /users - Retrieve users
- GET /comments - Retrieve comments

### ReqRes API  
- GET /users - List users with pagination
- GET /users/{id} - Single user
- POST /users - Create user
- PUT /users/{id} - Update user
- DELETE /users/{id} - Delete user
- POST /login - User login
- POST /register - User registration

### HTTPBin API
- GET /get - Test GET requests
- POST /post - Test POST requests  
- PUT /put - Test PUT requests
- DELETE /delete - Test DELETE requests
- GET /status/{code} - Test status codes
- GET /headers - Test headers
- GET /delay/{seconds} - Test timeouts

### Dog API
- GET /breeds/image/random - Random dog image
- GET /breeds/list/all - All dog breeds
- GET /breed/{breed}/images - Breed-specific images

### Cat Facts API
- GET /fact - Random cat fact
- GET /facts - Multiple cat facts
- GET /breeds - Cat breeds

## 📊 Reports

Test reports are generated in the `reports/` directory:
- Coverage reports (HTML, LCOV)
- Test results in various formats

## 🔧 Configuration

- `jest.config.js` - Jest testing framework configuration
- `src/config/api-endpoints.js` - API endpoints configuration
- `src/utils/api-client.js` - HTTP client wrapper
- `src/utils/test-helpers.js` - Common test utilities

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add your tests
4. Run the test suite
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔗 API Documentation

- [JSONPlaceholder](https://jsonplaceholder.typicode.com/)
- [ReqRes](https://reqres.in/)
- [HTTPBin](https://httpbin.org/)
- [Dog API](https://dog.ceo/dog-api/)
- [Cat Facts API](https://catfact.ninja/)
