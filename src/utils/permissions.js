import { ROLES } from './constants';

// Permission definitions by role
const PERMISSIONS = {
  [ROLES.ADMIN]: ['all'],
  [ROLES.ENGINEER]: [
    'view_dashboard',
    'view_machines',
    'view_machine_details',
    'create_work_order',
    'view_work_orders',
    'view_alerts',
    'view_analytics',
    'view_reports',
    'export_reports',
  ],
  [ROLES.TECHNICIAN]: [
    'view_my_work_orders',
    'update_work_order',
    'complete_work_order',
    'view_alerts',
    'add_work_order_notes',
  ],
};

/**
 * Check if a user has permission to perform an action
 * @param {Object} user - The current user object
 * @param {string} action - The action to check permission for
 * @returns {boolean} - Whether the user has permission
 */
export const userCan = (user, action) => {
  if (!user || !user.role) return false;

  const userPermissions = PERMISSIONS[user.role];

  if (!userPermissions) return false;
  if (userPermissions.includes('all')) return true;

  return userPermissions.includes(action);
};

/**
 * Check if user has any of the specified roles
 * @param {Object} user - The current user object
 * @param {string[]} roles - Array of roles to check
 * @returns {boolean} - Whether the user has any of the roles
 */
export const hasRole = (user, roles) => {
  if (!user || !user.role) return false;
  return roles.includes(user.role);
};

/**
 * Check if user is admin
 * @param {Object} user - The current user object
 * @returns {boolean} - Whether the user is an admin
 */
export const isAdmin = (user) => {
  return user?.role === ROLES.ADMIN;
};

/**
 * Check if user is engineer
 * @param {Object} user - The current user object
 * @returns {boolean} - Whether the user is an engineer
 */
export const isEngineer = (user) => {
  return user?.role === ROLES.ENGINEER;
};

/**
 * Check if user is technician
 * @param {Object} user - The current user object
 * @returns {boolean} - Whether the user is a technician
 */
export const isTechnician = (user) => {
  return user?.role === ROLES.TECHNICIAN;
};

/**
 * Get navigation items for a user based on their role
 * @param {Object} user - The current user object
 * @returns {Array} - Navigation items for the user
 */
export const getNavItems = (user) => {
  if (!user || !user.role) return [];

  const navConfig = {
    [ROLES.ADMIN]: [
      { label: 'Dashboard', path: '/dashboard', icon: 'Dashboard' },
      { label: 'Assets', path: '/machines', icon: 'PrecisionManufacturing' },
      { label: 'Work Orders', path: '/work-orders', icon: 'Assignment' },
      { label: 'Maintenance', path: '/maintenance', icon: 'Build' },
      { label: 'Reports', path: '/reports', icon: 'Assessment' },
      { label: 'Alerts', path: '/alerts', icon: 'NotificationsActive' },
      { label: 'Users', path: '/users', icon: 'People' },
      { label: 'Settings', path: '/settings', icon: 'Settings' },
    ],
    [ROLES.ENGINEER]: [
      { label: 'Dashboard', path: '/dashboard', icon: 'Dashboard' },
      { label: 'Assets', path: '/machines', icon: 'PrecisionManufacturing' },
      { label: 'Work Orders', path: '/work-orders', icon: 'Assignment' },
      { label: 'Alerts', path: '/alerts', icon: 'NotificationsActive' },
    ],
    [ROLES.TECHNICIAN]: [
      { label: 'My Work Orders', path: '/my-work-orders', icon: 'Assignment' },
    ],
  };

  return navConfig[user.role] || [];
};
