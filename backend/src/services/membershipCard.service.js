import QRCode from 'qrcode';
import bwipjs from 'bwip-js';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../models/user.model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure cards directory exists
const cardsDir = path.join(__dirname, '../../cards');
if (!fs.existsSync(cardsDir)) {
  fs.mkdirSync(cardsDir, { recursive: true });
}

/**
 * Generate QR Code for user
 * @param {string} barcode - User's barcode
 * @param {string} name - User's name
 * @param {string} email - User's email
 * @returns {Promise<Buffer>} QR Code buffer
 */
const generateQRCode = async (barcode, name, email) => {
  try {
    // Create QR data with user profile link and basic info
    const qrData = JSON.stringify({
      barcode,
      name,
      email,
      profileUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/profile/${barcode}`,
      timestamp: new Date().toISOString()
    });

    const qrCodeBuffer = await QRCode.toBuffer(qrData, {
      type: 'png',
      width: 200,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });

    return qrCodeBuffer;
  } catch (error) {
    throw new Error(`QR Code generation failed: ${error.message}`);
  }
};

/**
 * Generate Barcode for user
 * @param {string} barcode - User's barcode value
 * @returns {Promise<Buffer>} Barcode buffer
 */
const generateBarcode = async (barcode) => {
  try {
    const barcodeBuffer = await bwipjs.toBuffer({
      bcid: 'code128',        // Barcode type
      text: barcode,          // Text to encode
      scale: 3,               // Scaling factor
      height: 50,             // Bar height, in millimeters
      includetext: true,      // Show human-readable text
      textxalign: 'center',   // Always good to set this
    });

    return barcodeBuffer;
  } catch (error) {
    throw new Error(`Barcode generation failed: ${error.message}`);
  }
};

/**
 * Generate PDF membership card
 * @param {Object} user - User object
 * @returns {Promise<string>} File path of generated PDF
 */
const generateMembershipCardPDF = async (user) => {
  try {
    const { barcode, name, email, membershipLevel, subscriptionEndDate } = user;
    
    // Generate QR Code and Barcode
    const [qrCodeBuffer, barcodeBuffer] = await Promise.all([
      generateQRCode(barcode, name, email),
      generateBarcode(barcode)
    ]);

    // Create PDF document
    const doc = new PDFDocument({
      size: [400, 250], // Card size in points (4x2.5 inches)
      margin: 20
    });

    // Generate filename
    const fileName = `${name.replace(/[^a-zA-Z0-9]/g, '_')}_card.pdf`;
    const filePath = path.join(cardsDir, fileName);

    // Pipe PDF to file
    doc.pipe(fs.createWriteStream(filePath));

    // Card background
    doc.rect(0, 0, 400, 250)
       .fill('#f8f9fa');

    // Header section
    doc.rect(0, 0, 400, 60)
       .fill('#007bff');
    
    // Gym logo/name
    doc.fillColor('white')
       .fontSize(24)
       .font('Helvetica-Bold')
       .text('GYM MEMBERSHIP', 20, 20, { align: 'center' });

    // Member info section
    doc.fillColor('black')
       .fontSize(16)
       .font('Helvetica-Bold')
       .text('Member Information', 20, 80);

    doc.fontSize(12)
       .font('Helvetica')
       .text(`Name: ${name}`, 20, 105)
       .text(`Barcode: ${barcode}`, 20, 125)
       .text(`Level: ${membershipLevel.toUpperCase()}`, 20, 145)
       .text(`Valid Until: ${subscriptionEndDate ? new Date(subscriptionEndDate).toLocaleDateString() : 'N/A'}`, 20, 165);

    // QR Code (right side)
    doc.image(qrCodeBuffer, 250, 80, { width: 100, height: 100 });

    // Barcode (bottom)
    doc.image(barcodeBuffer, 50, 200, { width: 300, height: 30 });

    // Footer
    doc.fillColor('#666')
       .fontSize(8)
       .text('Scan QR code or barcode for attendance', 20, 235, { align: 'center' });

    // Finalize PDF
    doc.end();

    return new Promise((resolve, reject) => {
      doc.on('end', () => resolve(filePath));
      doc.on('error', reject);
    });

  } catch (error) {
    throw new Error(`PDF generation failed: ${error.message}`);
  }
};

/**
 * Generate membership card for a single user
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Card generation result
 */
export const generateSingleCard = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    if (!user.barcode) {
      throw new Error('User does not have a barcode');
    }

    const filePath = await generateMembershipCardPDF(user);
    const fileName = path.basename(filePath);

    return {
      success: true,
      message: 'Membership card generated successfully',
      fileName,
      filePath,
      user: {
        id: user._id,
        name: user.name,
        barcode: user.barcode,
        email: user.email
      }
    };
  } catch (error) {
    throw new Error(`Card generation failed: ${error.message}`);
  }
};

/**
 * Generate membership cards for multiple users
 * @param {Array<string>} userIds - Array of user IDs
 * @returns {Promise<Object>} Batch generation result
 */
export const generateBatchCards = async (userIds) => {
  try {
    const results = [];
    const errors = [];

    for (const userId of userIds) {
      try {
        const result = await generateSingleCard(userId);
        results.push(result);
      } catch (error) {
        errors.push({
          userId,
          error: error.message
        });
      }
    }

    return {
      success: true,
      message: `Generated ${results.length} cards successfully`,
      results,
      errors,
      totalRequested: userIds.length,
      totalGenerated: results.length,
      totalErrors: errors.length
    };
  } catch (error) {
    throw new Error(`Batch card generation failed: ${error.message}`);
  }
};

/**
 * Generate membership cards for all active members
 * @returns {Promise<Object>} Batch generation result
 */
export const generateAllMemberCards = async () => {
  try {
    const members = await User.find({ 
      role: 'member', 
      status: 'active',
      barcode: { $exists: true, $ne: null }
    });

    if (members.length === 0) {
      return {
        success: true,
        message: 'No active members found',
        results: [],
        errors: [],
        totalRequested: 0,
        totalGenerated: 0,
        totalErrors: 0
      };
    }

    const userIds = members.map(member => member._id.toString());
    return await generateBatchCards(userIds);
  } catch (error) {
    throw new Error(`Generate all cards failed: ${error.message}`);
  }
};

/**
 * Get user by barcode for attendance scanning
 * @param {string} barcode - User's barcode
 * @returns {Promise<Object>} User object
 */
export const getUserByBarcode = async (barcode) => {
  try {
    const user = await User.findOne({ barcode, status: 'active' });
    if (!user) {
      throw new Error('User not found or inactive');
    }
    return user;
  } catch (error) {
    throw new Error(`User lookup failed: ${error.message}`);
  }
};

/**
 * Get list of generated cards
 * @returns {Promise<Array>} List of card files
 */
export const getGeneratedCards = async () => {
  try {
    const files = fs.readdirSync(cardsDir);
    const cardFiles = files
      .filter(file => file.endsWith('.pdf'))
      .map(file => ({
        fileName: file,
        filePath: path.join(cardsDir, file),
        size: fs.statSync(path.join(cardsDir, file)).size,
        created: fs.statSync(path.join(cardsDir, file)).birthtime
      }))
      .sort((a, b) => b.created - a.created);

    return cardFiles;
  } catch (error) {
    throw new Error(`Failed to get card list: ${error.message}`);
  }
};

