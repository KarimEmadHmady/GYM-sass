import User from '../models/user.model.js';

export const getAllUsersService = async (query = {}) => {
  const filter = {};
  if (query.role) {
    filter.role = query.role;
  }
  if (query.status) {
    filter.status = query.status;
  }
  return await User.find(filter).sort({ createdAt: -1 });
};

export const getUserByIdService = async (userId) => {
  // Return full raw user data, including fields that might be excluded by default
  const user = await User.findById(userId).select('+passwordHash').lean();
  // const user = await User.findById(userId)
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};

export const updateUserRoleService = async (userId, role) => {
  const user = await User.findByIdAndUpdate(userId, { role }, { new: true });
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};


export const updateUserByIdService = async (userId, updateData) => {
    const user = await User.findByIdAndUpdate(userId, updateData, { new: true });
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  };

export const deleteUserByIdService = async (userId) => {
  // Soft delete: mark as deleted
  const user = await User.findByIdAndUpdate(userId, { isDeleted: true }, { new: true });
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};

export const deleteUserByIdHardService = async (userId) => {
  const user = await User.findByIdAndDelete(userId);
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};

export const getMyClientsService = async (trainerId) => {
  return await User.find({ trainerId });
};