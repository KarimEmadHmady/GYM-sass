import User from '../models/user.model.js';

export const registerUser = async (name, email, password) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('Email already in use');
  }

  const user = new User({ name, email, passwordHash: password });
  await user.save();
  return user;
};

export const loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    throw new Error('Invalid email or password');
  }
  return user;
};