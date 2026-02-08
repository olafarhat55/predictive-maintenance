import {
  mockUsers,
  mockCompany,
  mockMachines,
  mockWorkOrders,
  mockAlerts,
  mockDashboardStats,
  mockHealthDistribution,
  mockFailureTrendData,
  mockSensorTrends,
  mockAIInsights,
  mockNotifications,
  mockReportsData,
  mockMaintenanceEvents,
} from '../data/mockData';
import type { MockUser, Machine, WorkOrder, Alert, Notification, Company } from '../types';

// Simulate network delay
const delay = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

// Helper to generate unique IDs
const generateId = (): string => Date.now() + Math.random().toString(36).substr(2, 9);

// Filter interfaces
interface MachineFilters {
  type?: string;
  location?: string;
  status?: string;
  search?: string;
}

interface WorkOrderFilters {
  status?: string;
  priority?: string;
  assigned_to?: number;
}

interface AlertFilters {
  severity?: string;
  acknowledged?: boolean;
}

// In-memory data store (simulates database)
let users: MockUser[] = [...mockUsers];
let machines: Machine[] = [...mockMachines];
let workOrders: WorkOrder[] = [...mockWorkOrders];
let alerts: Alert[] = [...mockAlerts];
let notifications: Notification[] = [...mockNotifications];
let company: Company = { ...mockCompany };

export const mockApi = {
  // ============ AUTH ============
  login: async (email: string, password: string) => {
    await delay(500);
    const user = users.find((u) => u.email === email && u.password === password);
    if (!user) {
      throw new Error('Invalid email or password');
    }
    const { password: _, ...userWithoutPassword } = user;
    return {
      user: userWithoutPassword,
      token: `mock-token-${user.id}-${Date.now()}`,
    };
  },

  logout: async () => {
    await delay(200);
    return { success: true };
  },

  requestAccess: async (data: any) => {
    await delay(800);
    // Simulate sending activation email
    const activationToken = `admin-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    console.log('=== ACTIVATION EMAIL SENT ===');
    console.log('To:', data.email);
    console.log('Activation Link:', `/activate?token=${activationToken}`);
    console.log('=============================');
    return {
      success: true,
      message: 'Request submitted! Check your email for activation link.',
    };
  },

  activateAccount: async (token: string, password: string) => {
    await delay(500);
    // Determine user role from token
    const isAdmin = !token.includes('engineer') && !token.includes('technician');
    const role = token.includes('engineer') ? 'engineer' : token.includes('technician') ? 'technician' : 'admin';

    // Create activated user
    const activatedUser = {
      id: users.length + 1,
      name: isAdmin ? 'Pholan Elphlany' : 'New User',
      email: isAdmin ? 'pholan@company.com' : 'user@company.com',
      role: role,
      first_login: isAdmin, // Only admin goes to setup wizard
      company_id: 1,
      created_at: new Date().toISOString(),
    };

    return {
      success: true,
      message: 'Account activated successfully.',
      user: activatedUser,
      token: `mock-token-${activatedUser.id}-${Date.now()}`,
      redirectTo: isAdmin ? '/setup' : '/login',
    };
  },

  inviteUser: async (data: any) => {
    await delay(500);
    // Simulate sending invitation email
    const inviteToken = `${data.role}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    console.log('=== INVITATION EMAIL SENT ===');
    console.log('To:', data.email);
    console.log('Role:', data.role);
    console.log('Activation Link:', `/activate?token=${inviteToken}`);
    console.log('=============================');

    const newUser = {
      id: users.length + 1,
      name: data.name,
      email: data.email,
      role: data.role,
      status: 'invited',
      first_login: true,
      company_id: 1,
      created_at: new Date().toISOString(),
    };
    users.push({ ...newUser, avatar: null, password: 'temp123' } as MockUser);

    return newUser;
  },

  // ============ DASHBOARD ============
  getDashboardStats: async () => {
    await delay(300);
    return mockDashboardStats;
  },

  getHealthDistribution: async () => {
    await delay(300);
    return mockHealthDistribution;
  },

  getFailureTrend: async (period: string = 'monthly') => {
    await delay(300);
    const data = mockFailureTrendData[period] || mockFailureTrendData.monthly;
    return data;
  },

  getSensorTrends: async () => {
    await delay(300);
    return mockSensorTrends;
  },

  getAIInsights: async () => {
    await delay(400);
    return mockAIInsights;
  },

  // ============ MACHINES ============
  getMachines: async (filters: MachineFilters = {}) => {
    await delay(500);
    let result = [...machines];

    if (filters.type) {
      result = result.filter((m) => m.type === filters.type);
    }
    if (filters.location) {
      result = result.filter((m) => m.location === filters.location);
    }
    if (filters.status) {
      result = result.filter((m) => m.status === filters.status);
    }
    if (filters.search) {
      const search = filters.search.toLowerCase();
      result = result.filter(
        (m) =>
          m.name.toLowerCase().includes(search) ||
          m.asset_id.toLowerCase().includes(search)
      );
    }

    return result;
  },

  getMachineById: async (id: string | number) => {
    await delay(300);
    const machine = machines.find((m) => m.id === Number(id));
    if (!machine) {
      throw new Error('Machine not found');
    }
    return machine;
  },

  createMachine: async (data: any) => {
    await delay(500);
    const newMachine: Machine = {
      id: machines.length + 1,
      asset_id: `${data.type.substring(0, 3).toUpperCase()}-${String(machines.length + 1).padStart(3, '0')}`,
      status: 'healthy',
      sensors: { temperature: 70, vibration: 0.2, pressure: 95 },
      prediction: {
        failure_probability: 5,
        rul: 200,
        ttf: '40 days',
        status: 'healthy',
        recommendation: 'New asset. Establishing baseline.',
      },
      ...data,
    };
    machines.push(newMachine);
    return newMachine;
  },

  updateMachine: async (id: string | number, data: any) => {
    await delay(400);
    const index = machines.findIndex((m) => m.id === Number(id));
    if (index === -1) {
      throw new Error('Machine not found');
    }
    machines[index] = { ...machines[index], ...data };
    return machines[index];
  },

  deleteMachine: async (id: string | number) => {
    await delay(300);
    machines = machines.filter((m) => m.id !== Number(id));
    return { success: true };
  },

  getMachineSensorHistory: async (id: string | number, hours: number = 24) => {
    await delay(400);
    // Generate mock sensor history
    const history = [];
    const now = Date.now();
    for (let i = hours; i >= 0; i--) {
      const time = new Date(now - i * 60 * 60 * 1000);
      history.push({
        timestamp: time.toISOString(),
        temperature: 70 + Math.random() * 10,
        vibration: 0.2 + Math.random() * 0.3,
        pressure: 95 + Math.random() * 8,
      });
    }
    return history;
  },

  // ============ WORK ORDERS ============
  getWorkOrders: async (filters: WorkOrderFilters = {}) => {
    await delay(500);
    let result = [...workOrders];

    if (filters.status) {
      result = result.filter((wo) => wo.status === filters.status);
    }
    if (filters.priority) {
      result = result.filter((wo) => wo.priority === filters.priority);
    }
    if (filters.assigned_to) {
      result = result.filter((wo) => wo.assigned_to?.id === filters.assigned_to);
    }

    return result;
  },

  getWorkOrderById: async (id: string | number) => {
    await delay(300);
    const workOrder = workOrders.find((wo) => wo.id === Number(id));
    if (!workOrder) {
      throw new Error('Work order not found');
    }
    return workOrder;
  },

  createWorkOrder: async (data: any) => {
    await delay(500);
    const machine = machines.find((m) => m.id === data.machine_id);
    const newWorkOrder: WorkOrder = {
      id: workOrders.length + 101,
      wo_number: `WO-2026-${workOrders.length + 101}`,
      machine_name: machine?.name || 'Unknown',
      asset_id: machine?.asset_id || 'Unknown',
      status: 'open',
      created_at: new Date().toISOString(),
      notes: [],
      ...data,
    };
    workOrders.push(newWorkOrder);
    return newWorkOrder;
  },

  updateWorkOrder: async (id: string | number, data: any) => {
    await delay(400);
    const index = workOrders.findIndex((wo) => wo.id === Number(id));
    if (index === -1) {
      throw new Error('Work order not found');
    }
    workOrders[index] = { ...workOrders[index], ...data };
    return workOrders[index];
  },

  deleteWorkOrder: async (id: string | number) => {
    await delay(300);
    workOrders = workOrders.filter((wo) => wo.id !== Number(id));
    return { success: true };
  },

  addWorkOrderNote: async (id: string | number, note: any) => {
    await delay(300);
    const index = workOrders.findIndex((wo) => wo.id === Number(id));
    if (index === -1) {
      throw new Error('Work order not found');
    }
    const newNote = {
      id: generateId(),
      ...note,
      created_at: new Date().toISOString(),
    };
    workOrders[index].notes.push(newNote);
    return newNote;
  },

  // ============ ALERTS ============
  getAlerts: async (filters: AlertFilters = {}) => {
    await delay(400);
    let result = [...alerts];

    if (filters.severity) {
      result = result.filter((a) => a.severity === filters.severity);
    }
    if (filters.acknowledged !== undefined) {
      result = result.filter((a) => a.acknowledged === filters.acknowledged);
    }

    return result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },

  acknowledgeAlert: async (id: string | number, user: any) => {
    await delay(300);
    const index = alerts.findIndex((a) => a.id === Number(id));
    if (index === -1) {
      throw new Error('Alert not found');
    }
    alerts[index] = {
      ...alerts[index],
      acknowledged: true,
      acknowledged_by: user,
      acknowledged_at: new Date().toISOString(),
    };
    return alerts[index];
  },

  // ============ USERS ============
  getUsers: async () => {
    await delay(400);
    return users.map(({ password, ...user }) => user);
  },

  getUserById: async (id: string | number) => {
    await delay(300);
    const user = users.find((u) => u.id === Number(id));
    if (!user) {
      throw new Error('User not found');
    }
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },

  createUser: async (data: any) => {
    await delay(500);
    const newUser: MockUser = {
      id: users.length + 1,
      avatar: null,
      first_login: true,
      company_id: 1,
      created_at: new Date().toISOString(),
      password: 'temp123', // Temporary password
      ...data,
    };
    users.push(newUser);
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  },

  updateUser: async (id: string | number, data: any) => {
    await delay(400);
    const index = users.findIndex((u) => u.id === Number(id));
    if (index === -1) {
      throw new Error('User not found');
    }
    users[index] = { ...users[index], ...data };
    const { password, ...userWithoutPassword } = users[index];
    return userWithoutPassword;
  },

  deleteUser: async (id: string | number) => {
    await delay(300);
    users = users.filter((u) => u.id !== Number(id));
    return { success: true };
  },

  // ============ COMPANY/SETTINGS ============
  getCompanySettings: async () => {
    await delay(300);
    return company;
  },

  updateCompanySettings: async (data: any) => {
    await delay(400);
    company = { ...company, ...data };
    return company;
  },

  completeSetup: async () => {
    await delay(300);
    company.setup_completed = true;
    return company;
  },

  // ============ NOTIFICATIONS ============
  getNotifications: async () => {
    await delay(300);
    return notifications;
  },

  markNotificationRead: async (id: string | number) => {
    await delay(200);
    const index = notifications.findIndex((n) => n.id === Number(id));
    if (index !== -1) {
      notifications[index].read = true;
    }
    return notifications[index];
  },

  markAllNotificationsRead: async () => {
    await delay(200);
    notifications = notifications.map((n) => ({ ...n, read: true }));
    return { success: true };
  },

  // ============ REPORTS ============
  getReportsData: async () => {
    await delay(500);
    return mockReportsData;
  },

  // ============ MAINTENANCE CALENDAR ============
  getMaintenanceEvents: async (month: number, year: number) => {
    await delay(300);
    return mockMaintenanceEvents;
  },

  // ============ EXPORT ============
  exportPDF: async (type: string, id: string | number) => {
    await delay(1000);
    // In real app, this would generate and return a PDF
    return {
      success: true,
      message: 'PDF exported successfully',
      url: '#',
    };
  },
};

export default mockApi;
