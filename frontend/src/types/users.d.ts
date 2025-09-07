export type UserRole = 'admin' | 'trainer' | 'member' | 'manager';

export interface UpdateUserRoleRequest {
  userId: string;
  role: UserRole;
}


