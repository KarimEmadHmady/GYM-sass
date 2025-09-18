import { 
  getAllUsersService,
  getUserByIdService,
  updateUserRoleService,
  updateUserByIdService,
  deleteUserByIdService,
  deleteUserByIdHardService,
  getMyClientsService
 } from '../services/users.service.js';

export const getAllUsers = async (req, res) => {
  try {
    const users = await getAllUsersService(req.query);
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await getUserByIdService(userId);
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { userId, role } = req.body;
    const actingRole = req.user?.role;
    if (!actingRole) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const allowedRoles = ['member', 'trainer', 'manager', 'admin'];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }
    if (actingRole === 'manager') {
      const managerAllowedTargets = ['member', 'trainer'];
      if (!managerAllowedTargets.includes(role)) {
        return res.status(403).json({ message: 'Managers can only set role to member or trainer' });
      }
    }
    const user = await updateUserRoleService(userId, role);
    res.status(200).json({ message: 'User role updated successfully.', user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateUserById = async (req, res) => {
    try {
      const userId = req.params.id;
      const updateData = req.body;
      delete updateData.passwordHash; 
      // Role change guardrails
      if (Object.prototype.hasOwnProperty.call(updateData, 'role')) {
        const actingRole = req.user?.role;
        const newRole = updateData.role;
        const allowedRoles = ['member', 'trainer', 'manager', 'admin'];
        if (!actingRole) {
          return res.status(401).json({ message: 'غير مصرح: لا يوجد دور للطلب.' });
        }
        if (!allowedRoles.includes(newRole)) {
          return res.status(400).json({ message: 'دور غير صالح.' });
        }
        if (actingRole !== 'admin' && actingRole !== 'manager') {
          return res.status(403).json({ message: 'غير مصرح: لا يمكنك تعديل الدور.' });
        }
        if (actingRole === 'manager') {
          const managerAllowedTargets = ['member', 'trainer'];
          if (!managerAllowedTargets.includes(newRole)) {
            return res.status(403).json({ message: 'صلاحيات المدير تسمح فقط بتعيين الدور إلى عضو أو مدرب.' });
          }
        }
      }
      const user = await updateUserByIdService(userId, updateData);
      res.status(200).json({ message: 'User updated successfully.', user });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };

export const deleteUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await deleteUserByIdService(userId);
    res.status(200).json({ message: 'User deleted successfully.', user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteUserByIdHard = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await deleteUserByIdHardService(userId);
    res.status(200).json({ message: 'User permanently deleted successfully.', user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getMyClients = async (req, res) => {
  try {
    const trainerId = req.query.trainerId || req.user.id || req.user._id;
    const clients = await getMyClientsService(trainerId);
    res.status(200).json({ clients });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};