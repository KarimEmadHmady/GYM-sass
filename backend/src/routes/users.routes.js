import express from 'express';
import { authenticate, authorizeAdmin } from '../middlewares/auth.middleware.js';
import { authorizeRole } from '../middlewares/role.middleware.js';
import { 
    getAllUsers,
    getUserById,
    updateUserRole,
    updateUserById,
    deleteUserById,
    deleteUserByIdHard,
    getMyClients
 } from '../controllers/users.controller.js';

const router = express.Router();

router.get('/', authenticate,  authorizeRole(['admin','manager', 'trainer','accountant']), getAllUsers);
router.put('/role', authenticate, authorizeRole(['admin','manager','accountant']), updateUserRole);
router.get('/my-clients', authenticate, authorizeRole(['admin','manager', 'trainer','accountant']), getMyClients);
router.get('/:id', authenticate, getUserById);

router.put('/:id', authenticate, updateUserById);
router.delete('/:id', authenticate,  authorizeRole(['admin','manager','accountant']), deleteUserById);
router.delete('/:id/hard', authenticate, authorizeAdmin, deleteUserByIdHard);

export default router;


//router.get('/some-route', authenticate, authorizeRole(['admin', 'trainer']), someControllerFunction);
// router.post('/admin-only', authenticate, authorizeRole(['admin']), adminControllerFunction);