import express from 'express';
import { register, login, me } from '../controllers/auth.controller.js';
import { authenticate  ,authorizeAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/register',authenticate , authorizeAdmin, register);
router.post('/login', login);
router.get('/me', authenticate, me);

export default router;