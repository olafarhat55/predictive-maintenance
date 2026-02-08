import { ROLES, type Role, type NavItem } from './constants';

// Minimal user shape needed by permission utilities
export interface PermissionUser {
  role: Role;
}

// Permission definitions by role
const PERMISSIONS: Record<Role, string[]> = {
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
 */
export const userCan = (user: PermissionUser | null | undefined, action: string): boolean => {
  if (!user || !user.role) return false;

  const userPermissions = PERMISSIONS[user.role];

  if (!userPermissions) return false;
  if (userPermissions.includes('all')) return true;

  return userPermissions.includes(action);
};

/**
 * Check if user has any of the specified roles
 */
export const hasRole = (user: PermissionUser | null | undefined, roles: Role[]): boolean => {
  if (!user || !user.role) return false;
  return roles.includes(user.role);
};

/**
 * Check if user is admin
 */
export const isAdmin = (user: PermissionUser | null | undefined): boolean => {
  return user?.role === ROLES.ADMIN;
};

/**
 * Check if user is engineer
 */
export const isEngineer = (user: PermissionUser | null | undefined): boolean => {
  return user?.role === ROLES.ENGINEER;
};

/**
 * Check if user is technician
 */
export const isTechnician = (user: PermissionUser | null | undefined): boolean => {
  return user?.role === ROLES.TECHNICIAN;
};

/**
 * Get navigation items for a user based on their role
 */
export const getNavItems = (user: PermissionUser | null | undefined): NavItem[] => {
  if (!user || !user.role) return [];

  const navConfig: Record<Role, NavItem[]> = {
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
