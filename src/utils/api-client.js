const axios = require('axios');

/**
 * API Client utility for making HTTP requests
 * Provides a centralized way to handle API calls with common configurations
 */
class ApiClient {
  constructor(baseURL, timeout = 5000) {
    this.client = axios.create({
      baseURL,
      timeout,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        console.log(`Making ${config.method.toUpperCase()} request to: ${config.url}`);
        return config;
      },
      (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
      }
    );
    
    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        console.log(`Response status: ${response.status}`);
        return response;
      },
      (error) => {
        console.error('Response error:', error.response?.status, error.message);
        return Promise.reject(error);
      }
    );
  }
  
  async get(endpoint, params = {}) {
    return this.client.get(endpoint, { params });
  }
  
  async post(endpoint, data = {}) {
    return this.client.post(endpoint, data);
  }
  
  async put(endpoint, data = {}) {
    return this.client.put(endpoint, data);
  }
  
  async delete(endpoint) {
    return this.client.delete(endpoint);
  }
  
  async patch(endpoint, data = {}) {
    return this.client.patch(endpoint, data);
  }
}

module.exports = ApiClient;