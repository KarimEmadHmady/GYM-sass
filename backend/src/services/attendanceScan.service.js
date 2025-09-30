import AttendanceRecord from '../models/userMangment/AttendanceRecord.model.js';
import User from '../models/user.model.js';
import { getUserByBarcode } from './membershipCard.service.js';

/**
 * Scan barcode and record attendance
 * @param {string} barcode - User's barcode
 * @returns {Promise<Object>} Attendance record result
 */
export const scanBarcodeAndRecordAttendance = async (barcode) => {
  try {
    // Get user by barcode
    const user = await getUserByBarcode(barcode);
    
    // Check if user already has attendance record for today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const existingAttendance = await AttendanceRecord.findOne({
      userId: user._id,
      date: {
        $gte: today,
        $lt: tomorrow
      }
    });

    if (existingAttendance) {
      return {
        success: false,
        message: 'Attendance already recorded for today',
        user: {
          id: user._id,
          name: user.name,
          barcode: user.barcode,
          email: user.email
        },
        attendance: {
          id: existingAttendance._id,
          date: existingAttendance.date,
          status: existingAttendance.status,
          time: existingAttendance.createdAt
        }
      };
    }

    // Create new attendance record
    const attendanceRecord = new AttendanceRecord({
      userId: user._id,
      date: new Date(),
      status: 'present',
      notes: 'Scanned via barcode'
    });

    await attendanceRecord.save();

    return {
      success: true,
      message: 'Attendance recorded successfully',
      user: {
        id: user._id,
        name: user.name,
        barcode: user.barcode,
        email: user.email,
        membershipLevel: user.membershipLevel
      },
      attendance: {
        id: attendanceRecord._id,
        date: attendanceRecord.date,
        status: attendanceRecord.status,
        time: attendanceRecord.createdAt
      }
    };

  } catch (error) {
    throw new Error(`Attendance scanning failed: ${error.message}`);
  }
};

/**
 * Get attendance statistics for a user
 * @param {string} userId - User ID
 * @param {Object} options - Query options
 * @returns {Promise<Object>} Attendance statistics
 */
export const getUserAttendanceStats = async (userId, options = {}) => {
  try {
    const { startDate, endDate, limit = 30 } = options;
    
    let query = { userId };
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const attendanceRecords = await AttendanceRecord.find(query)
      .sort({ date: -1 })
      .limit(limit)
      .populate('userId', 'name email barcode');

    const totalDays = attendanceRecords.length;
    const presentDays = attendanceRecords.filter(record => record.status === 'present').length;
    const absentDays = attendanceRecords.filter(record => record.status === 'absent').length;
    const excusedDays = attendanceRecords.filter(record => record.status === 'excused').length;

    return {
      success: true,
      stats: {
        totalDays,
        presentDays,
        absentDays,
        excusedDays,
        attendanceRate: totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0
      },
      records: attendanceRecords
    };

  } catch (error) {
    throw new Error(`Failed to get attendance stats: ${error.message}`);
  }
};

/**
 * Get today's attendance summary
 * @returns {Promise<Object>} Today's attendance summary
 */
export const getTodayAttendanceSummary = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayAttendance = await AttendanceRecord.find({
      date: {
        $gte: today,
        $lt: tomorrow
      }
    }).populate('userId', 'name email barcode role');

    const totalPresent = todayAttendance.filter(record => record.status === 'present').length;
    const totalAbsent = todayAttendance.filter(record => record.status === 'absent').length;
    const totalExcused = todayAttendance.filter(record => record.status === 'excused').length;

    // Get all active members count
    const totalActiveMembers = await User.countDocuments({ 
      role: 'member', 
      status: 'active' 
    });

    return {
      success: true,
      summary: {
        date: today,
        totalActiveMembers,
        totalPresent,
        totalAbsent,
        totalExcused,
        attendanceRate: totalActiveMembers > 0 ? Math.round((totalPresent / totalActiveMembers) * 100) : 0
      },
      records: todayAttendance
    };

  } catch (error) {
    throw new Error(`Failed to get today's attendance summary: ${error.message}`);
  }
};

