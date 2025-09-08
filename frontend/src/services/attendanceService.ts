import { BaseService } from './baseService';
import { API_ENDPOINTS } from '@/lib/constants';
import type { AttendanceRecord, PaginationParams, PaginatedResponse } from '@/types';

export class AttendanceService extends BaseService {
  constructor() {
    super(API_ENDPOINTS.attendance.list);
  }

  // Get all attendance records
  async getAttendanceRecords(params?: PaginationParams): Promise<PaginatedResponse<AttendanceRecord>> {
    return this.getAll<AttendanceRecord>(params);
  }

  // Get attendance record by ID
  async getAttendanceRecord(id: string): Promise<AttendanceRecord> {
    return this.getById<AttendanceRecord>(id);
  }

  // Create new attendance record
  async createAttendanceRecord(attendanceData: Partial<AttendanceRecord>): Promise<AttendanceRecord> {
    return this.create<AttendanceRecord>(attendanceData);
  }

  // Update attendance record
  async updateAttendanceRecord(id: string, attendanceData: Partial<AttendanceRecord>): Promise<AttendanceRecord> {
    return this.update<AttendanceRecord>(id, attendanceData);
  }

  // Delete attendance record
  async deleteAttendanceRecord(id: string): Promise<void> {
    return this.delete(id);
  }

  // Get attendance records for specific user
  async getUserAttendance(userId: string, params?: PaginationParams): Promise<PaginatedResponse<AttendanceRecord>> {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);

    return this.apiCall<PaginatedResponse<AttendanceRecord>>(`/${userId}?${queryParams.toString()}`);
  }

  // Get attendance records by date range
  async getAttendanceByDateRange(
    startDate: Date, 
    endDate: Date, 
    params?: PaginationParams
  ): Promise<PaginatedResponse<AttendanceRecord>> {
    const queryParams = new URLSearchParams();
    queryParams.append('startDate', startDate.toISOString());
    queryParams.append('endDate', endDate.toISOString());
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);

    return this.apiCall<PaginatedResponse<AttendanceRecord>>(`/date-range?${queryParams.toString()}`);
  }

  // Get today's attendance
  async getTodayAttendance(): Promise<AttendanceRecord[]> {
    return this.apiCall<AttendanceRecord[]>('/today');
  }

  // Mark attendance
  async markAttendance(userId: string, status: 'present' | 'absent' | 'excused', notes?: string): Promise<AttendanceRecord> {
    return this.apiCall<AttendanceRecord>('/mark', {
      method: 'POST',
      body: JSON.stringify({
        userId,
        status,
        notes,
        date: new Date().toISOString()
      }),
    });
  }

  // Get attendance statistics
  async getAttendanceStats(userId?: string, startDate?: Date, endDate?: Date): Promise<{
    totalDays: number;
    presentDays: number;
    absentDays: number;
    excusedDays: number;
    attendanceRate: number;
  }> {
    const queryParams = new URLSearchParams();
    
    if (userId) queryParams.append('userId', userId);
    if (startDate) queryParams.append('startDate', startDate.toISOString());
    if (endDate) queryParams.append('endDate', endDate.toISOString());

    return this.apiCall(`/stats?${queryParams.toString()}`);
  }
}
