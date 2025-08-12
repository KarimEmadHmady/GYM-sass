import express from 'express';
import { getAllUsers, updateUserRole , updateUserById } from '../controllers/users.controller.js';
import { authenticate, authorizeAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/', authenticate, authorizeAdmin, getAllUsers);
router.put('/role', authenticate, authorizeAdmin, updateUserRole);

router.put('/:id', authenticate, authorizeAdmin, updateUserById);

export default router;


//router.get('/some-route', authenticate, authorizeRole(['admin', 'trainer']), someControllerFunction);
// router.post('/admin-only', authenticate, authorizeRole(['admin']), adminControllerFunction);