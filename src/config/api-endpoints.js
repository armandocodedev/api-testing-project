/**
 * API Endpoints Configuration
 * Contains base URLs and endpoints for all tested APIs
 */

const API_ENDPOINTS = {
  JSONPLACEHOLDER: {
    BASE_URL: 'https://jsonplaceholder.typicode.com',
    POSTS: '/posts',
    USERS: '/users',
    COMMENTS: '/comments',
    ALBUMS: '/albums',
    PHOTOS: '/photos',
    TODOS: '/todos'
  },
  
  REQRES: {
    BASE_URL: 'https://reqres.in/api',
    USERS: '/users',
    LOGIN: '/login',
    REGISTER: '/register',
    UNKNOWN: '/unknown'
  },
  
  HTTPBIN: {
    BASE_URL: 'https://httpbin.org',
    GET: '/get',
    POST: '/post',
    PUT: '/put',
    DELETE: '/delete',
    STATUS: '/status',
    HEADERS: '/headers',
    IP: '/ip',
    DELAY: '/delay',
    JSON: '/json'
  },
  
  DOG_API: {
    BASE_URL: 'https://dog.ceo/api',
    RANDOM: '/breeds/image/random',
    BREEDS: '/breeds/list/all',
    BREED_IMAGES: '/breed'
  },
  
  CAT_FACTS: {
    BASE_URL: 'https://catfact.ninja',
    FACT: '/fact',
    FACTS: '/facts',
    BREEDS: '/breeds'
  }
};

module.exports = API_ENDPOINTS;