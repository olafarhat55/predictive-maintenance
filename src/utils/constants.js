// User Roles
export const ROLES = {
  ADMIN: 'admin',
  ENGINEER: 'engineer',
  TECHNICIAN: 'technician',
};

// Machine Status
export const MACHINE_STATUS = {
  RUNNING: 'running',
  WARNING: 'warning',
  CRITICAL: 'critical',
  MAINTENANCE: 'maintenance',
  OFFLINE: 'offline',
};

// Work Order Status
export const WORK_ORDER_STATUS = {
  OPEN: 'open',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

// Work Order Priority
export const PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
};

// Alert Types
export const ALERT_TYPE = {
  PREDICTION: 'prediction',
  THRESHOLD: 'threshold',
  ANOMALY: 'anomaly',
  MAINTENANCE_DUE: 'maintenance_due',
};

// Alert Severity
export const ALERT_SEVERITY = {
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'error',
  CRITICAL: 'critical',
};

// Navigation Items by Role
export const NAV_ITEMS = {
  [ROLES.ADMIN]: [
    { label: 'Dashboard', path: '/dashboard', icon: 'Dashboard' },
    { label: 'Machines', path: '/machines', icon: 'Build' },
    { label: 'Work Orders', path: '/work-orders', icon: 'Assignment' },
    { label: 'Alerts', path: '/alerts', icon: 'Notifications' },
    { label: 'Analytics', path: '/analytics', icon: 'Analytics' },
    { label: 'Users', path: '/users', icon: 'People' },
    { label: 'Settings', path: '/settings', icon: 'Settings' },
  ],
  [ROLES.ENGINEER]: [
    { label: 'Dashboard', path: '/dashboard', icon: 'Dashboard' },
    { label: 'Machines', path: '/machines', icon: 'Build' },
    { label: 'Work Orders', path: '/work-orders', icon: 'Assignment' },
    { label: 'Alerts', path: '/alerts', icon: 'Notifications' },
    { label: 'Analytics', path: '/analytics', icon: 'Analytics' },
  ],
  [ROLES.TECHNICIAN]: [
    { label: 'My Work Orders', path: '/my-work-orders', icon: 'Assignment' },
    { label: 'Alerts', path: '/alerts', icon: 'Notifications' },
  ],
};

// Chart Colors
export const CHART_COLORS = {
  primary: '#1976d2',
  secondary: '#dc004e',
  success: '#4caf50',
  warning: '#ff9800',
  error: '#f44336',
  info: '#2196f3',
};

// Status Colors
export const STATUS_COLORS = {
  [MACHINE_STATUS.RUNNING]: '#4caf50',
  [MACHINE_STATUS.WARNING]: '#ff9800',
  [MACHINE_STATUS.CRITICAL]: '#f44336',
  [MACHINE_STATUS.MAINTENANCE]: '#2196f3',
  [MACHINE_STATUS.OFFLINE]: '#9e9e9e',
};

// API Endpoints (for mock/real API)
export const API_ENDPOINTS = {
  AUTH: '/api/auth',
  MACHINES: '/api/machines',
  WORK_ORDERS: '/api/work-orders',
  ALERTS: '/api/alerts',
  USERS: '/api/users',
  ANALYTICS: '/api/analytics',
};
