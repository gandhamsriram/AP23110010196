/**
 * API Service Layer
 * Handles all HTTP communication with the Campus Notifications API.
 * Falls back to mock data when the API is unreachable or requires auth.
 */
import axios from 'axios';
import { getMockNotifications, getAllMockNotifications } from './mockData';

// Create axios instance with base URL from environment variables
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://20.207.122.201/evaluation-service',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor — attaches Authorization header if token exists
 */
apiClient.interceptors.request.use(
  (config) => {
    const token = import.meta.env.VITE_API_TOKEN;
    if (token && token !== 'your_bearer_token_here') {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response interceptor — normalizes errors
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const message =
        error.response.data?.message ||
        `Server error: ${error.response.status}`;
      return Promise.reject(new Error(message));
    } else if (error.request) {
      return Promise.reject(new Error('Network error — please check your connection.'));
    }
    return Promise.reject(error);
  }
);

/**
 * Fetch notifications from the API with automatic mock fallback.
 *
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number (1-indexed)
 * @param {number} params.limit - Items per page
 * @param {string} [params.notification_type] - Filter: Event | Result | Placement
 * @returns {Promise<Object>} - { data, total, page, limit, total_pages, isMock, error }
 */
export const fetchNotifications = async ({ page = 1, limit = 10, notification_type } = {}) => {
  const params = { page, limit };
  if (notification_type) {
    params.notification_type = notification_type;
  }

  try {
    console.log('[API] Fetching notifications:', params);
    const response = await apiClient.get('/notifications', { params });
    console.log('[API] Response received:', response.data);

    const raw = response.data;
    const items = raw.data || raw.notifications || raw.results || [];
    const total = raw.total || raw.count || items.length;
    const pages = raw.total_pages || Math.ceil(total / limit) || 1;

    return {
      data: items,
      total,
      page,
      limit,
      total_pages: pages,
      isMock: false,
      error: null,
    };
  } catch (err) {
    console.warn('[API] Failed to fetch — falling back to mock data:', err.message);

    // Return mock data so the UI always has something to show
    const mockResult = getMockNotifications({ page, limit, notification_type });
    return {
      ...mockResult,
      isMock: true,
      error: err.message,
    };
  }
};

/**
 * Fetch ALL notifications (for priority inbox) with mock fallback.
 * @returns {Promise<Object>} - { data, isMock, error }
 */
export const fetchAllNotifications = async () => {
  try {
    console.log('[API] Fetching all notifications for priority inbox');
    const response = await apiClient.get('/notifications', { params: { page: 1, limit: 100 } });
    const raw = response.data;
    const items = raw.data || raw.notifications || raw.results || [];

    return { data: items, isMock: false, error: null };
  } catch (err) {
    console.warn('[API] Failed — using mock data for priority inbox:', err.message);
    return { data: getAllMockNotifications(), isMock: true, error: err.message };
  }
};

export default apiClient;
