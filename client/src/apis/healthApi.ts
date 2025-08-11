import axios from 'axios';

// API configuration
const API_BASE_URL = 'http://127.0.0.1:8000';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Health check response interface
export interface HealthCheckResponse {
  status: string;
  message: string;
  timestamp: string;
}

// API service for health check
export const healthApi = {
  // Check backend health status
  checkHealth: async (): Promise<HealthCheckResponse> => {
    try {
      const response = await api.get<HealthCheckResponse>('/');
      return response.data;
    } catch (error: any) {
      console.error('Health check failed:', error);
      
      // Handle axios errors more specifically
      if (error.response) {
        // Server responded with error status
        throw new Error(`Server error: ${error.response.status} - ${error.response.statusText}`);
      } else if (error.request) {
        // Request was made but no response received
        throw new Error('No response from server - Backend may be offline');
      } else {
        // Something else happened
        throw new Error(`Request setup error: ${error.message || 'Unknown error'}`);
      }
    }
  }
};

// Export the axios instance for use in other API files
export default api;
