// Roles and Permissions Types

export type UserRole = 'admin' | 'trainer' | 'member' | 'manager';

export type SubscriptionStatus = 'active' | 'frozen' | 'expired' | 'cancelled';

export type MembershipLevel = 'basic' | 'silver' | 'gold' | 'platinum';

export type UserStatus = 'active' | 'inactive' | 'banned';

export type AttendanceStatus = 'present' | 'absent' | 'excused';

// Role-based permissions
export interface RolePermissions {
  admin: string[];
  trainer: string[];
  member: string[];
  manager: string[];
}

// Navigation items for different roles
export interface NavigationItem {
  label: string;
  href: string;
  icon?: string;
  children?: NavigationItem[];
  permissions?: string[];
}

export interface RoleNavigation {
  admin: NavigationItem[];
  trainer: NavigationItem[];
  member: NavigationItem[];
  manager: NavigationItem[];
}

// Dashboard layout configuration
export interface DashboardConfig {
  title: string;
  description: string;
  navigation: NavigationItem[];
  permissions: string[];
}
