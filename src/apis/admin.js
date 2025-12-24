import apiClient from './axios';

/**
 * Admin API Service
 * Handles all admin-related API calls
 */

/**
 * Login admin user
 * @param {Object} credentials - Login credentials
 * @param {string} credentials.email - Admin email
 * @param {string} credentials.password - Admin password
 * @returns {Promise} Response with token and admin data
 */
export const login = async (credentials) => {
  try {
    const response = await apiClient.post('/api/admin/login', credentials);
    
    // Store token and admin data in localStorage
    if (response.data.success && response.data.data) {
      localStorage.setItem('adminToken', response.data.data.token);
      localStorage.setItem('adminData', JSON.stringify(response.data.data.admin));
    }
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Logout admin user
 * @returns {Promise} Response indicating logout success
 */
export const logout = async () => {
  try {
    const response = await apiClient.post('/api/admin/logout');
    
    // Clear stored auth data
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    
    return response.data;
  } catch (error) {
    // Clear stored auth data even if API call fails
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    throw error;
  }
};

/**
 * Get admin profile
 * @returns {Promise} Response with admin profile data
 */
export const getProfile = async () => {
  try {
    const response = await apiClient.get('/api/admin/profile');
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Update admin profile
 * @param {Object} profileData - Profile data to update
 * @param {string} [profileData.name] - Admin name
 * @param {string} [profileData.current_password] - Current password (for password change)
 * @param {string} [profileData.new_password] - New password (for password change)
 * @returns {Promise} Response with updated admin data
 */
export const updateProfile = async (profileData) => {
  try {
    const response = await apiClient.put('/api/admin/profile', profileData);
    
    // Update stored admin data if profile was updated
    if (response.data.success && response.data.data?.admin) {
      localStorage.setItem('adminData', JSON.stringify(response.data.data.admin));
    }
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Verify admin token
 * @returns {Promise} Response indicating token validity
 */
export const verifyToken = async () => {
  try {
    const response = await apiClient.get('/api/admin/verify-token');
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get stored admin data from localStorage
 * @returns {Object|null} Admin data or null if not found
 */
export const getStoredAdminData = () => {
  try {
    const adminData = localStorage.getItem('adminData');
    return adminData ? JSON.parse(adminData) : null;
  } catch (error) {
    console.error('Error parsing admin data:', error);
    return null;
  }
};

/**
 * Get stored admin token from localStorage
 * @returns {string|null} Admin token or null if not found
 */
export const getStoredToken = () => {
  return localStorage.getItem('adminToken');
};

/**
 * Check if admin is authenticated
 * @returns {boolean} True if token exists
 */
export const isAuthenticated = () => {
  return !!getStoredToken();
};

