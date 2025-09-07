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

router.get('/', authenticate,  authorizeRole(['admin','manager']), getAllUsers);
router.put('/role', authenticate, authorizeAdmin, updateUserRole);
router.get('/:id', authenticate,  authorizeRole(['admin','manager', 'trainer']), getUserById);

router.put('/:id', authenticate, authorizeAdmin, updateUserById);
router.delete('/:id', authenticate,  authorizeRole(['admin','manager']), deleteUserById);
router.delete('/:id/hard', authenticate, authorizeAdmin, deleteUserByIdHard);

export default router;


//router.get('/some-route', authenticate, authorizeRole(['admin', 'trainer']), someControllerFunction);
// router.post('/admin-only', authenticate, authorizeRole(['admin']), adminControllerFunction);