import {
  generateSingleCard,
  generateBatchCards,
  generateAllMemberCards,
  getGeneratedCards,
  generateCombinedCardsPDF,
  generateCombinedAllMembersPDF
} from '../services/membershipCard.service.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

/**
 * Generate membership card for a single user
 */
export const generateUserCard = async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await generateSingleCard(userId);
    
    res.status(200).json({
      success: true,
      message: 'Membership card generated successfully',
      data: result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Generate membership cards for multiple users
 */
export const generateBatchCardsController = async (req, res) => {
  try {
    const { userIds } = req.body;
    
    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'User IDs array is required'
      });
    }

    const result = await generateBatchCards(userIds);
    
    res.status(200).json({
      success: true,
      message: 'Batch card generation completed',
      data: result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Generate membership cards for all active members
 */
export const generateAllMemberCardsController = async (req, res) => {
  try {
    const result = await generateAllMemberCards();
    
    res.status(200).json({
      success: true,
      message: 'All member cards generation completed',
      data: result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get list of generated cards
 */
export const getGeneratedCardsController = async (req, res) => {
  try {
    const cards = await getGeneratedCards();
    
    res.status(200).json({
      success: true,
      message: 'Generated cards retrieved successfully',
      data: cards
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Download a specific membership card
 */
export const downloadCard = async (req, res) => {
  try {
    const { fileName } = req.params;
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const cardsDir = path.join(__dirname, '../../cards');
    const filePath = path.join(cardsDir, fileName);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'Card file not found'
      });
    }
    
    // Set headers for file download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    
    // Stream the file
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
    
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Generate a combined PDF for specified user IDs and return it as a downloadable file
 */
export const downloadCombinedCards = async (req, res) => {
  try {
    const { userIds } = req.body;
    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ success: false, message: 'User IDs array is required' });
    }
    const { filePath, fileName } = await generateCombinedCardsPDF(userIds);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Generate a combined PDF for all active members
 */
export const downloadCombinedCardsAll = async (req, res) => {
  try {
    const { filePath, fileName } = await generateCombinedAllMembersPDF();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

