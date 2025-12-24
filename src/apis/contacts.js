import apiClient from './axios';

/**
 * Contacts API Service
 * Handles all contact-related API calls for admin
 */

/**
 * Get all contacts with pagination and filters
 * @param {Object} params - Query parameters
 * @param {number} [params.page=1] - Page number
 * @param {number} [params.limit=20] - Items per page
 * @param {string} [params.status] - Filter by status (unread, read)
 * @param {string} [params.responded] - Filter by responded status (0 or 1)
 * @param {string} [params.search] - Search query
 * @param {string} [params.sort_by=createdAt] - Sort field
 * @param {string} [params.sort_order=DESC] - Sort order (ASC/DESC)
 * @returns {Promise} Response with contacts and pagination
 */
export const getAllContacts = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.status) queryParams.append('status', params.status);
    if (params.responded !== undefined && params.responded !== '') {
      queryParams.append('responded', params.responded);
    }
    if (params.search) queryParams.append('search', params.search);
    if (params.sort_by) queryParams.append('sort_by', params.sort_by);
    if (params.sort_order) queryParams.append('sort_order', params.sort_order);

    const queryString = queryParams.toString();
    const url = `/api/contact/admin${queryString ? `?${queryString}` : ''}`;
    
    const response = await apiClient.get(url);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get contact by ID
 * @param {string} id - Contact ID
 * @returns {Promise} Response with contact details
 */
export const getContactById = async (id) => {
  try {
    const response = await apiClient.get(`/api/contact/admin/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Update contact status
 * @param {string} id - Contact ID
 * @param {Object} data - Update data
 * @param {string} [data.status] - New status (unread, read)
 * @param {boolean} [data.responded] - Responded status
 * @returns {Promise} Response with updated contact
 */
export const updateContactStatus = async (id, data) => {
  try {
    const response = await apiClient.put(`/api/contact/admin/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Mark contact as read
 * @param {string} id - Contact ID
 * @returns {Promise} Response with updated contact
 */
export const markAsRead = async (id) => {
  try {
    const response = await apiClient.put(`/api/contact/admin/${id}/read`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get unread contacts count
 * @returns {Promise} Response with unread count
 */
export const getUnreadCount = async () => {
  try {
    const response = await apiClient.get('/api/contact/admin/unread-count');
    return response.data;
  } catch (error) {
    throw error;
  }
};

