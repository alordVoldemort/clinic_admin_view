import axios from "axios";
import { API_CONFIG } from './config';

// Live production API configuration
console.log('🔧 Admin Panel Configuration:');
console.log('Environment:', process.env.NODE_ENV);
console.log('Live API URL:', API_CONFIG.BASE_URL);

// Create axios instance
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
});

// Request interceptor - Add auth token to requests
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem("adminToken");

    // Add token to Authorization header if it exists
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle common errors
apiClient.interceptors.response.use(
  (response) => {
    // Return response data directly
    return response;
  },
  (error) => {
    // Handle common error cases
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;

      // Handle 401 Unauthorized - Token expired or invalid
      if (status === 401) {
        // Clear stored auth data
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminData");

        // Redirect to login if not already there
        if (
          window.location.pathname !== "/login" &&
          window.location.pathname !== "/"
        ) {
          window.location.href = "/login";
        }
      }

      // Return error with message
      return Promise.reject({
        message: data?.message || data?.error || "An error occurred",
        status,
        data: data?.data || null,
      });
    } else if (error.request) {
      // Request was made but no response received
      return Promise.reject({
        message: "Network error. Please check your connection.",
        status: null,
        data: null,
      });
    } else {
      // Something else happened
      return Promise.reject({
        message: error.message || "An unexpected error occurred",
        status: null,
        data: null,
      });
    }
  }
);

export default apiClient;
