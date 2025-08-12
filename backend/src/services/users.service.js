import User from '../models/user.model.js';

export const getAllUsersService = async () => {
  return await User.find();
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