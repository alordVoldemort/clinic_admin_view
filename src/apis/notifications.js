import apiClient from './axios';

/**
 * Notifications API Service
 * Handles all notification-related API calls for admin
 */

/**
 * Get unseen notifications
 * @param {number} [limit=10] - Maximum number of notifications to return
 * @returns {Promise} Response with notifications array
 */
export const getNotifications = async (limit = 10) => {
  try {
    const response = await apiClient.get(`/api/admin/notifications?limit=${limit}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get unseen notifications count
 * @returns {Promise} Response with count
 */
export const getUnseenCount = async () => {
  try {
    const response = await apiClient.get('/api/admin/notifications/count');
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Mark notification as seen
 * @param {string} id - Notification ID (optional, if not provided, marks all as seen)
 * @param {boolean} markAll - If true, marks all notifications as seen
 * @returns {Promise} Response indicating success
 */
export const markAsSeen = async (id = undefined, markAll = false) => {
  try {
    const payload = markAll ? { mark_all: true } : { id };
    const response = await apiClient.put('/api/admin/notifications/mark-seen', payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

