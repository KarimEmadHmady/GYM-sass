import express from 'express';
import { authenticate, authorizeAdmin } from '../middlewares/auth.middleware.js';
import { 
    getAllUsers,
    getUserById,
    updateUserRole,
    updateUserById,
    deleteUserById,
    deleteUserByIdHard
 } from '../controllers/users.controller.js';

const router = express.Router();

router.get('/', authenticate, authorizeAdmin, getAllUsers);
router.put('/role', authenticate, authorizeAdmin, updateUserRole);
router.get('/:id', authenticate, authorizeAdmin, getUserById);

router.put('/:id', authenticate, authorizeAdmin, updateUserById);
router.delete('/:id', authenticate, authorizeAdmin, deleteUserById);
router.delete('/:id/hard', authenticate, authorizeAdmin, deleteUserByIdHard);

export default router;


//router.get('/some-route', authenticate, authorizeRole(['admin', 'trainer']), someControllerFunction);
// router.post('/admin-only', authenticate, authorizeRole(['admin']), adminControllerFunction);