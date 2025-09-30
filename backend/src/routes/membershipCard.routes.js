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

// Generate cards for multiple users (place before :userId)
router.post('/generate/batch', (req, res, next) => {
  console.log('ROUTE BODY:', req.body);
  next();
}, authenticate, authorizeRole(['admin', 'manager']), generateBatchCardsController);

// Generate cards for all active members (place before :userId)
router.post('/generate/all', authenticate, authorizeRole(['admin', 'manager']), generateAllMemberCardsController);

// Generate single user card (keep after batch/all)
router.post('/generate/:userId', authenticate, authorizeRole(['admin', 'manager']), generateUserCard);

// Get list of generated cards
router.get('/list', authenticate, authorizeRole(['admin', 'manager']), getGeneratedCardsController);

// Download specific card
router.get('/download/:fileName', authenticate, authorizeRole(['admin', 'manager']), downloadCard);

export default router;

