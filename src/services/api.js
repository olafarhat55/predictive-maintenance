import axios from 'axios';
import { mockApi } from './mockApi';

// Toggle between mock and real API
const USE_MOCK = true;

// Axios instance for real API calls
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data || error);
  }
);

// Real API implementation
const realApi = {
  // Auth
  login: (email, password) => axiosInstance.post('/auth/login', { email, password }),
  logout: () => axiosInstance.post('/auth/logout'),
  requestAccess: (data) => axiosInstance.post('/auth/request-access', data),
  activateAccount: (token, password) => axiosInstance.post('/auth/activate', { token, password }),

  // Dashboard
  getDashboardStats: () => axiosInstance.get('/dashboard/stats'),
  getHealthDistribution: () => axiosInstance.get('/dashboard/health-distribution'),
  getFailureTrend: (period = 'monthly') => axiosInstance.get('/dashboard/failure-trend', { params: { period } }),
  getSensorTrends: () => axiosInstance.get('/dashboard/sensor-trends'),
  getAIInsights: () => axiosInstance.get('/dashboard/ai-insights'),

  // Machines
  getMachines: (filters) => axiosInstance.get('/machines', { params: filters }),
  getMachineById: (id) => axiosInstance.get(`/machines/${id}`),
  createMachine: (data) => axiosInstance.post('/machines', data),
  updateMachine: (id, data) => axiosInstance.put(`/machines/${id}`, data),
  deleteMachine: (id) => axiosInstance.delete(`/machines/${id}`),
  getMachineSensorHistory: (id, hours) => axiosInstance.get(`/machines/${id}/sensor-history`, { params: { hours } }),

  // Work Orders
  getWorkOrders: (filters) => axiosInstance.get('/work-orders', { params: filters }),
  getWorkOrderById: (id) => axiosInstance.get(`/work-orders/${id}`),
  createWorkOrder: (data) => axiosInstance.post('/work-orders', data),
  updateWorkOrder: (id, data) => axiosInstance.put(`/work-orders/${id}`, data),
  deleteWorkOrder: (id) => axiosInstance.delete(`/work-orders/${id}`),
  addWorkOrderNote: (id, note) => axiosInstance.post(`/work-orders/${id}/notes`, note),

  // Alerts
  getAlerts: (filters) => axiosInstance.get('/alerts', { params: filters }),
  acknowledgeAlert: (id, user) => axiosInstance.put(`/alerts/${id}/acknowledge`, { user }),

  // Users
  getUsers: () => axiosInstance.get('/users'),
  getUserById: (id) => axiosInstance.get(`/users/${id}`),
  createUser: (data) => axiosInstance.post('/users', data),
  updateUser: (id, data) => axiosInstance.put(`/users/${id}`, data),
  deleteUser: (id) => axiosInstance.delete(`/users/${id}`),

  // Company/Settings
  getCompanySettings: () => axiosInstance.get('/company'),
  updateCompanySettings: (data) => axiosInstance.put('/company', data),
  completeSetup: () => axiosInstance.post('/company/complete-setup'),

  // Notifications
  getNotifications: () => axiosInstance.get('/notifications'),
  markNotificationRead: (id) => axiosInstance.put(`/notifications/${id}/read`),
  markAllNotificationsRead: () => axiosInstance.put('/notifications/read-all'),

  // Reports
  getReportsData: () => axiosInstance.get('/reports'),

  // Maintenance
  getMaintenanceEvents: (month, year) => axiosInstance.get('/maintenance/events', { params: { month, year } }),

  // Export
  exportPDF: (type, id) => axiosInstance.post('/export/pdf', { type, id }),
};

// Export the appropriate API based on USE_MOCK flag
export const api = USE_MOCK ? mockApi : realApi;

export default api;
