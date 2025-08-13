import { registerUser, loginUser } from '../services/auth.service.js';
import { generateToken } from '../utils/jwt.util.js';
import dotenv from 'dotenv';

dotenv.config();

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await registerUser(name, email, password);
    res.status(201).json({ message: 'User registered successfully.', user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await loginUser(email, password);
    const token = generateToken({ id: user._id, role: user.role }, process.env.JWT_SECRET, '10d');
    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};