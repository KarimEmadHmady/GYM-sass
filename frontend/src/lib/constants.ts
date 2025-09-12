import type { RoleNavigation, RolePermissions, NavigationItem } from '@/types';

// Role-based permissions
export const ROLE_PERMISSIONS: RolePermissions = {
  admin: [
    'users:read', 'users:write', 'users:delete',
    'attendance:read', 'attendance:write',
    'financial:read', 'financial:write',
    'workout:read', 'workout:write', 'workout:delete',
    'diet:read', 'diet:write', 'diet:delete',
    'feedback:read', 'feedback:write',
    'messages:read', 'messages:write',
    'reports:read', 'reports:write',
    'payroll:read', 'payroll:write',
    'loyalty:read', 'loyalty:write'
  ],
  trainer: [
    'users:read',
    'attendance:read', 'attendance:write',
    'workout:read', 'workout:write',
    'diet:read', 'diet:write',
    'feedback:read', 'feedback:write',
    'messages:read', 'messages:write',
    'progress:read', 'progress:write',
    'loyalty:read', 'loyalty:write'
  ],
  member: [
    'profile:read', 'profile:write',
    'attendance:read',
    'workout:read',
    'diet:read',
    'progress:read', 'progress:write',
    'feedback:write',
    'messages:read', 'messages:write',
    'loyalty:read',
    'payment:read'
  ],
  manager: [
    'users:read', 'users:write',
    'attendance:read', 'attendance:write',
    'financial:read', 'financial:write',
    'workout:read', 'workout:write',
    'diet:read', 'diet:write',
    'feedback:read', 'feedback:write',
    'messages:read', 'messages:write',
    'reports:read',
    'payroll:read', 'payroll:write',
    'loyalty:read', 'loyalty:write'
  ]
};

// Role-based navigation
export const ROLE_NAVIGATION: RoleNavigation = {
  admin: [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: 'dashboard',
      permissions: ['reports:read']
    },
    {
      label: 'Users Management',
      href: '/admin/users',
      icon: 'users',
      permissions: ['users:read']
    },
    {
      label: 'Attendance',
      href: '/admin/attendance',
      icon: 'calendar',
      permissions: ['attendance:read']
    },
    {
      label: 'Financial',
      href: '/admin/financial',
      icon: 'dollar-sign',
      permissions: ['financial:read'],
      children: [
        { label: 'Expenses', href: '/admin/financial/expenses', permissions: ['financial:read'] },
        { label: 'Revenue', href: '/admin/financial/revenue', permissions: ['financial:read'] },
        { label: 'Payroll', href: '/admin/financial/payroll', permissions: ['payroll:read'] },
        { label: 'Invoices', href: '/admin/financial/invoices', permissions: ['financial:read'] }
      ]
    },
    {
      label: 'Plans',
      href: '/admin/plans',
      icon: 'clipboard-list',
      permissions: ['workout:read', 'diet:read'],
      children: [
        { label: 'Workout Plans', href: '/admin/plans/workout', permissions: ['workout:read'] },
        { label: 'Diet Plans', href: '/admin/plans/diet', permissions: ['diet:read'] }
      ]
    },
    {
      label: 'Feedback',
      href: '/admin/feedback',
      icon: 'message-square',
      permissions: ['feedback:read']
    },
    {
      label: 'Messages',
      href: '/admin/messages',
      icon: 'mail',
      permissions: ['messages:read']
    },
    {
      label: 'Reports',
      href: '/admin/reports',
      icon: 'bar-chart',
      permissions: ['reports:read']
    },
    {
      label: 'Loyalty Points',
      href: '/admin/loyalty',
      icon: 'star',
      permissions: ['loyalty:read']
    }
  ],
  trainer: [
    {
      label: 'Dashboard',
      href: '/trainer/dashboard',
      icon: 'dashboard'
    },
    {
      label: 'My Clients',
      href: '/trainer/clients',
      icon: 'users'
    },
    {
      label: 'Attendance',
      href: '/trainer/attendance',
      icon: 'calendar'
    },
    {
      label: 'Plans',
      href: '/trainer/plans',
      icon: 'clipboard-list',
      children: [
        { label: 'Workout Plans', href: '/trainer/plans/workout' },
        { label: 'Diet Plans', href: '/trainer/plans/diet' }
      ]
    },
    {
      label: 'Progress Tracking',
      href: '/trainer/progress',
      icon: 'trending-up'
    },
    {
      label: 'Feedback',
      href: '/trainer/feedback',
      icon: 'message-square'
    },
    {
      label: 'Messages',
      href: '/trainer/messages',
      icon: 'mail'
    }
  ],
  member: [
    {
      label: 'Dashboard',
      href: '/member/dashboard',
      icon: 'dashboard'
    },
    {
      label: 'Profile',
      href: '/member/profile',
      icon: 'user'
    },
    {
      label: 'Progress',
      href: '/member/progress',
      icon: 'trending-up'
    },
    {
      label: 'Attendance',
      href: '/member/attendance',
      icon: 'calendar'
    },
    {
      label: 'Workout Plan',
      href: '/member/workout',
      icon: 'dumbbell'
    },
    {
      label: 'Diet Plan',
      href: '/member/diet',
      icon: 'utensils'
    },
    {
      label: 'Feedback',
      href: '/member/feedback',
      icon: 'message-square'
    },
    {
      label: 'Messages',
      href: '/member/messages',
      icon: 'mail'
    },
    {
      label: 'Loyalty Points',
      href: '/member/loyalty',
      icon: 'star'
    },
    {
      label: 'Payment History',
      href: '/member/payments',
      icon: 'credit-card'
    }
  ],
  manager: [
    {
      label: 'Dashboard',
      href: '/manager/dashboard',
      icon: 'dashboard'
    },
    {
      label: 'Users',
      href: '/manager/users',
      icon: 'users'
    },
    {
      label: 'Attendance',
      href: '/manager/attendance',
      icon: 'calendar'
    },
    {
      label: 'Financial',
      href: '/manager/financial',
      icon: 'dollar-sign',
      children: [
        { label: 'Expenses', href: '/manager/financial/expenses' },
        { label: 'Revenue', href: '/manager/financial/revenue' },
        { label: 'Payroll', href: '/manager/financial/payroll' }
      ]
    },
    {
      label: 'Plans',
      href: '/manager/plans',
      icon: 'clipboard-list',
      children: [
        { label: 'Workout Plans', href: '/manager/plans/workout' },
        { label: 'Diet Plans', href: '/manager/plans/diet' }
      ]
    },
    {
      label: 'Feedback',
      href: '/manager/feedback',
      icon: 'message-square'
    },
    {
      label: 'Messages',
      href: '/manager/messages',
      icon: 'mail'
    },
    {
      label: 'Reports',
      href: '/manager/reports',
      icon: 'bar-chart'
    }
  ]
};

// Dashboard configurations
export const DASHBOARD_CONFIGS = {
  admin: {
    title: 'Admin Dashboard',
    description: 'Manage your gym operations',
    basePath: '/admin'
  },
  trainer: {
    title: 'Trainer Dashboard',
    description: 'Manage your clients and training programs',
    basePath: '/trainer'
  },
  member: {
    title: 'Member Dashboard',
    description: 'Track your fitness journey',
    basePath: '/member'
  },
  manager: {
    title: 'Manager Dashboard',
    description: 'Oversee gym operations',
    basePath: '/manager'
  }
};

// API endpoints
export const API_ENDPOINTS = {
  // Auth
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    me: '/auth/me'
  },
  // Users
  users: {
    list: '/users',
    create: '/users',
    update: (id: string) => `/users/${id}`,
    delete: (id: string) => `/users/${id}`,
    get: (id: string) => `/users/${id}`,
    role: '/role',
    deleteHard: (id: string) => `/${id}/hard`,
    myClients: '/my-clients'
  },
  // Attendance
  attendance: {
    list: '/attendance',
    create: '/attendance',
    update: (id: string) => `/attendance/${id}`,
    delete: (id: string) => `/attendance/${id}`,
    user: (userId: string) => `/attendance/user/${userId}`
  },
  // Workout Plans
  workoutPlans: {
    list: '/workout-plans',
    create: '/workout-plans',
    update: (id: string) => `/workout-plans/${id}`,
    delete: (id: string) => `/workout-plans/${id}`,
    user: (userId: string) => `/workout-plans/user/${userId}`
  },
  // Diet Plans
  dietPlans: {
    list: '/diet-plans',
    create: '/diet-plans',
    update: (id: string) => `/diet-plans/${id}`,
    delete: (id: string) => `/diet-plans/${id}`,
    user: (userId: string) => `/diet-plans/user/${userId}`
  },
  // Financial
  financial: {
    expenses: {
      list: '/expenses',
      create: '/expenses',
      update: (id: string) => `/expenses/${id}`,
      delete: (id: string) => `/expenses/${id}`
    },
    revenue: {
      list: '/revenue',
      create: '/revenue',
      update: (id: string) => `/revenue/${id}`,
      delete: (id: string) => `/revenue/${id}`
    },
    payroll: {
      list: '/payroll',
      create: '/payroll',
      update: (id: string) => `/payroll/${id}`,
      delete: (id: string) => `/payroll/${id}`
    }
  },
  // Loyalty Points
  loyalty: {
    user: (userId: string) => `/loyalty-points/user/${userId}`,
    myPoints: '/loyalty-points/my-points',
    add: '/loyalty-points/add',
    redeem: '/loyalty-points/redeem',
    stats: '/loyalty-points/stats',
    topUsers: '/loyalty-points/top-users'
  },
  // Feedback
  feedback: {
    list: '/feedback',
    create: '/feedback',
    update: (id: string) => `/feedback/${id}`,
    delete: (id: string) => `/feedback/${id}`,
    user: (userId: string) => `/feedback/${userId}`,
  },
  // Messages
  messages: {
    list: '/messages',
    create: '/messages',
    update: (id: string) => `/messages/${id}`,
    delete: (id: string) => `/messages/${id}`,
    markRead: (id: string) => `/messages/${id}/mark-read`,
    updateStatus: (id: string) => `/messages/${id}/read`,
    userMessages: (userId: string) => `/messages/${userId}`
  },
  // Progress
  progress: {
    list: '/progress',
    create: '/progress',
    update: (id: string) => `/progress/${id}`,
    delete: (id: string) => `/progress/${id}`,
    user: (userId: string) => `/progress/${userId}`,
    trainer: (trainerId: string) => `/progress/trainer/${trainerId}`
  },
  // Payments
  payments: {
    list: '/payments',
    create: '/payments',
    update: (id: string) => `/payments/${id}`,
    delete: (id: string) => `/payments/${id}`,
    user: (userId: string) => `/payments/${userId}`
  },
  // Purchases
  purchases: {
    list: '/purchases',
    create: '/purchases',
    update: (id: string) => `/purchases/${id}`,
    delete: (id: string) => `/purchases/${id}`,
    user: (userId: string) => `/purchases/user/${userId}`
  },
  // Session Schedules
  sessionSchedules: {
    list: '/schedules',
    create: (userId: string) => `/schedules/${userId}`,
    update: (id: string) => `/schedules/${id}`,
    delete: (id: string) => `/schedules/${id}`,
    user: (userId: string) => `/schedules/${userId}`,
  },
};