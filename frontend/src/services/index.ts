// Export all services from a single entry point

export { AuthService } from './authService';
export { BaseService } from './baseService';
export { UserService } from './userService';
export { AttendanceService } from './attendanceService';
export { WorkoutService } from './workoutService';
export { DietService } from './dietService';
export { LoyaltyService } from './loyaltyService';
export { PurchaseService } from './purchaseService';
export { MessageService } from './messageService';

// Import classes for instantiation
import { UserService } from './userService';
import { AttendanceService } from './attendanceService';
import { WorkoutService } from './workoutService';
import { DietService } from './dietService';
import { LoyaltyService } from './loyaltyService';
import { PurchaseService } from './purchaseService';
import { MessageService } from './messageService';

// Service instances for easy access
export const userService = new UserService();
export const attendanceService = new AttendanceService();
export const workoutService = new WorkoutService();
export const dietService = new DietService();
export const loyaltyService = new LoyaltyService();
export const purchaseService = new PurchaseService();
export const messageService = new MessageService();
