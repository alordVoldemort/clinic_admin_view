import apiClient from './axios';

/**
 * Appointments API Service
 * Handles all appointment-related API calls for admin
 */

/**
 * Get all appointments with pagination and filters
 * @param {Object} params - Query parameters
 * @param {number} [params.page=1] - Page number
 * @param {number} [params.limit=20] - Items per page
 * @param {string} [params.status] - Filter by status (confirmed, tentative, pending, cancelled, completed)
 * @param {string} [params.date_from] - Filter from date (YYYY-MM-DD)
 * @param {string} [params.date_to] - Filter to date (YYYY-MM-DD)
 * @param {string} [params.search] - Search query
 * @param {string} [params.sort_by=date] - Sort field
 * @param {string} [params.sort_order=DESC] - Sort order (ASC/DESC)
 * @returns {Promise} Response with appointments and pagination
 */
export const getAllAppointments = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.status) queryParams.append('status', params.status);
    if (params.date_from) queryParams.append('date_from', params.date_from);
    if (params.date_to) queryParams.append('date_to', params.date_to);
    if (params.search) queryParams.append('search', params.search);
    if (params.sort_by) queryParams.append('sort_by', params.sort_by);
    if (params.sort_order) queryParams.append('sort_order', params.sort_order);

    const queryString = queryParams.toString();
    const url = `/api/appointments/admin${queryString ? `?${queryString}` : ''}`;
    
    const response = await apiClient.get(url);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get appointment statistics
 * @returns {Promise} Response with appointment stats
 */
export const getAppointmentStats = async () => {
  try {
    const response = await apiClient.get('/api/appointments/admin/stats');
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get today's appointments
 * @returns {Promise} Response with today's appointments
 */
export const getTodayAppointments = async () => {
  try {
    const response = await apiClient.get('/api/appointments/admin/today');
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get appointment by ID
 * @param {string} id - Appointment ID
 * @returns {Promise} Response with appointment details
 */
export const getAppointmentById = async (id) => {
  try {
    const response = await apiClient.get(`/api/appointments/admin/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Update appointment status
 * @param {string} id - Appointment ID
 * @param {Object} data - Update data
 * @param {string} data.status - New status (confirmed, tentative, pending, cancelled, completed)
 * @returns {Promise} Response with updated appointment
 */
export const updateAppointmentStatus = async (id, data) => {
  try {
    const response = await apiClient.put(`/api/appointments/admin/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Delete appointment
 * Note: If DELETE endpoint doesn't exist, this will use updateStatus to cancel
 * @param {string} id - Appointment ID
 * @returns {Promise} Response indicating success
 */
export const deleteAppointment = async (id) => {
  try {
    // Try DELETE endpoint first
    try {
      const response = await apiClient.delete(`/api/appointments/admin/${id}`);
      return response.data;
    } catch (deleteError) {
      // If DELETE doesn't exist, update status to cancelled instead
      if (deleteError.status === 404 || deleteError.status === 405) {
        return await updateAppointmentStatus(id, { status: 'cancelled' });
      }
      throw deleteError;
    }
  } catch (error) {
    throw error;
  }
};

