import express from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorizeRole } from '../middlewares/role.middleware.js';
import {
  generateUserCard,
  generateBatchCardsController,
  generateAllMemberCardsController,
  getGeneratedCardsController,
  downloadCard
} from '../controllers/membershipCard.controller.js';

const router = express.Router();

// Generate single user card
router.post('/generate/:userId', authenticate, authorizeRole(['admin', 'manager']), generateUserCard);

// Generate cards for multiple users
router.post('/generate/batch', authenticate, authorizeRole(['admin', 'manager']), generateBatchCardsController);

// Generate cards for all active members
router.post('/generate/all', authenticate, authorizeRole(['admin', 'manager']), generateAllMemberCardsController);

// Get list of generated cards
router.get('/list', authenticate, authorizeRole(['admin', 'manager']), getGeneratedCardsController);

// Download specific card
router.get('/download/:fileName', authenticate, authorizeRole(['admin', 'manager']), downloadCard);

export default router;

