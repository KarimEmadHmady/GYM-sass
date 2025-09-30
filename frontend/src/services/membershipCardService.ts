import { apiGet, apiPost, apiRequest } from '@/lib/api';

export interface User {
  _id: string;
  name: string;
  email: string;
  barcode: string;
  role: string;
  membershipLevel: string;
  status: string;
}

export interface GeneratedCard {
  fileName: string;
  filePath: string;
  size: number;
  created: string;
}

export interface CardGenerationResult {
  success: boolean;
  message: string;
  data: {
    results: Array<{
      success: boolean;
      message: string;
      fileName: string;
      filePath: string;
      user: {
        id: string;
        name: string;
        barcode: string;
        email: string;
      };
    }>;
    errors: Array<{
      userId: string;
      error: string;
    }>;
    totalRequested: number;
    totalGenerated: number;
    totalErrors: number;
  };
}

export interface AttendanceResult {
  success: boolean;
  message: string;
  data?: {
    user: {
      id: string;
      name: string;
      barcode: string;
      email: string;
      membershipLevel: string;
    };
    attendance: {
      id: string;
      date: string;
      status: string;
      time: string;
    };
  };
}

export interface TodaySummary {
  summary: {
    date: string;
    totalActiveMembers: number;
    totalPresent: number;
    totalAbsent: number;
    totalExcused: number;
    attendanceRate: number;
  };
  records: Array<{
    _id: string;
    userId: {
      name: string;
      barcode: string;
      role: string;
    };
    status: string;
    date: string;
    createdAt: string;
  }>;
}

// Membership Card Services
export const membershipCardService = {
  // Generate single user card
  generateUserCard: async (userId: string): Promise<CardGenerationResult> => {
    const data = await apiPost<CardGenerationResult>(`/membership-cards/generate/${userId}`, {});
    return data;
  },

  // Generate cards for multiple users
  generateBatchCards: async (userIds: string[]): Promise<CardGenerationResult> => {
    const data = await apiPost<CardGenerationResult>('/membership-cards/generate/batch', { userIds });
    return data;
  },

  // Generate cards for all active members
  generateAllMemberCards: async (): Promise<CardGenerationResult> => {
    const data = await apiPost<CardGenerationResult>('/membership-cards/generate/all', {});
    return data;
  },

  // Get list of generated cards
  getGeneratedCards: async (): Promise<GeneratedCard[]> => {
    const response = await apiGet<{ data: GeneratedCard[] }>('/membership-cards/list');
    return response.data;
  },

  // Download a specific card
  downloadCard: async (fileName: string): Promise<Blob> => {
    const response = await apiRequest(`/membership-cards/download/${fileName}`);
    return await response.blob();
  }
};

// Attendance Scanning Services
export const attendanceScanService = {
  // Scan barcode and record attendance
  scanBarcode: async (barcode: string): Promise<AttendanceResult> => {
    const data = await apiPost<AttendanceResult>('/attendance-scan/scan', { barcode });
    return data;
  },

  // Get user attendance statistics
  getUserAttendanceStats: async (userId: string, options?: {
    startDate?: string;
    endDate?: string;
    limit?: number;
  }): Promise<any> => {
    const params = new URLSearchParams();
    if (options?.startDate) params.append('startDate', options.startDate);
    if (options?.endDate) params.append('endDate', options.endDate);
    if (options?.limit) params.append('limit', options.limit.toString());
    
    const data = await apiGet<any>(`/attendance-scan/stats/${userId}?${params.toString()}`);
    return data;
  },

  // Get today's attendance summary
  getTodayAttendanceSummary: async (): Promise<TodaySummary> => {
    const response = await apiGet<{ data: TodaySummary }>('/attendance-scan/summary/today');
    return response.data;
  },

  // Get attendance records with pagination
  getAttendanceRecords: async (options?: {
    page?: number;
    limit?: number;
    userId?: string;
    startDate?: string;
    endDate?: string;
    status?: string;
  }): Promise<any> => {
    const params = new URLSearchParams();
    if (options?.page) params.append('page', options.page.toString());
    if (options?.limit) params.append('limit', options.limit.toString());
    if (options?.userId) params.append('userId', options.userId);
    if (options?.startDate) params.append('startDate', options.startDate);
    if (options?.endDate) params.append('endDate', options.endDate);
    if (options?.status) params.append('status', options.status);
    
    const data = await apiGet<any>(`/attendance-scan/records?${params.toString()}`);
    return data;
  }
};

// User Services
export const userService = {
  // Get all users
  getUsers: async (): Promise<User[]> => {
    const data = await apiGet<User[]>('/users');
    return data;
  },

  // Get user by ID
  getUserById: async (userId: string): Promise<User> => {
    const data = await apiGet<User>(`/users/${userId}`);
    return data;
  }
};

