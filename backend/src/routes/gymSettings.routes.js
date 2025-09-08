import express from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorizeRole } from '../middlewares/role.middleware.js';
import { getGymSettings, updateGymSettings } from '../controllers/gymSettings.controller.js';

const router = express.Router();

router.get('/', authenticate, authorizeRole(['admin','manager']), getGymSettings);
router.put('/', authenticate, authorizeRole(['admin','manager']), updateGymSettings);

export default router;
