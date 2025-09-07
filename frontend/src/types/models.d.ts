// Database Models Types

// User Model
export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'trainer' | 'member' | 'manager';
  phone?: string;
  dob?: Date;
  avatarUrl?: string;
  address?: string;
  balance: number;
  status: 'active' | 'inactive' | 'banned';
  isEmailVerified: boolean;
  
  // Subscription data
  subscriptionStartDate?: Date;
  subscriptionEndDate?: Date;
  subscriptionFreezeDays: number;
  subscriptionFreezeUsed: number;
  subscriptionStatus: 'active' | 'frozen' | 'expired' | 'cancelled';
  lastPaymentDate?: Date;
  nextPaymentDueDate?: Date;
  
  loyaltyPoints: number;
  membershipLevel: 'basic' | 'silver' | 'gold' | 'platinum';
  
  goals: {
    weightLoss: boolean;
    muscleGain: boolean;
    endurance: boolean;
  };
  
  trainerId?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

// Attendance Record
export interface AttendanceRecord {
  _id: string;
  userId: string;
  date: Date;
  status: 'present' | 'absent' | 'excused';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Workout Plan
export interface Exercise {
  _id: string;
  name: string;
  reps: number;
  sets: number;
  notes?: string;
}

export interface WorkoutPlan {
  _id: string;
  userId: string;
  planName: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  exercises: Exercise[];
  createdAt: Date;
  updatedAt: Date;
}

// Diet Plan
export interface Meal {
  mealId: string;
  mealName: string;
  calories: number;
  quantity: string;
  notes?: string;
}

export interface DietPlan {
  _id: string;
  userId: string;
  planName: string;
  description?: string;
  startDate: Date;
  endDate?: Date;
  meals: Meal[];
  createdAt: Date;
  updatedAt: Date;
}

// Reward/Loyalty Points
export interface Reward {
  _id: string;
  userId: string;
  points: number;
  redeemedFor?: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Payment
export interface Payment {
  _id: string;
  userId: string;
  amount: number;
  date: Date;
  method: string;
  status: 'pending' | 'completed' | 'failed';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Expense
export interface Expense {
  _id: string;
  amount: number;
  date: Date;
  category: string;
  paidTo?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Revenue
export interface Revenue {
  _id: string;
  amount: number;
  date: Date;
  source: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Payroll
export interface Payroll {
  _id: string;
  employeeId: string;
  amount: number;
  date: Date;
  status: 'pending' | 'paid';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Feedback
export interface Feedback {
  _id: string;
  userId: string;
  type: 'complaint' | 'suggestion' | 'compliment';
  message: string;
  status: 'pending' | 'reviewed' | 'resolved';
  response?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Message
export interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  subject: string;
  content: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Client Progress
export interface ClientProgress {
  _id: string;
  userId: string;
  date: Date;
  weight?: number;
  bodyFat?: number;
  muscleMass?: number;
  measurements?: {
    chest?: number;
    waist?: number;
    hips?: number;
    arms?: number;
    thighs?: number;
  };
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
