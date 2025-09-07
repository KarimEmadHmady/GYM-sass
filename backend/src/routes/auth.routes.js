import express from 'express';
import { register, login, me } from '../controllers/auth.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorizeRole } from '../middlewares/role.middleware.js';

const router = express.Router();

router.post('/register',authorizeRole(['admin']), register);
router.post('/login', login);
router.get('/me', authenticate, me);

export default router;