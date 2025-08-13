// client/src/services/api.ts
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true,  // Enable sending cookies with requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor - handles authentication errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Don't redirect on 401 from the response interceptor
    // Let the calling component handle authentication failures
    return Promise.reject(error);
  }
);

export default api;