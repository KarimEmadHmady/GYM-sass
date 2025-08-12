import { getAllUsersService, updateUserRoleService , updateUserByIdService} from '../services/users.service.js';

export const getAllUsers = async (req, res) => {
  try {
    const users = await getAllUsersService();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { userId, role } = req.body;
    const user = await updateUserRoleService(userId, role);
    res.status(200).json({ message: 'User role updated successfully.', user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// الدالة الجديدة لتحديث بيانات أي يوزر
export const updateUserById = async (req, res) => {
    try {
      const userId = req.params.id;
      const updateData = req.body;
  
      // منع تحديث بعض الحقول الحساسة لو تحب (اختياري)
      delete updateData.passwordHash; // لو حابب تمنع تحديث الباسورد من هنا
  
      const user = await updateUserByIdService(userId, updateData);
      res.status(200).json({ message: 'User updated successfully.', user });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };