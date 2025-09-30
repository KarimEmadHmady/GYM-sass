import QRCode from 'qrcode';
import bwipjs from 'bwip-js';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../models/user.model.js';
import { getGymSettingsService } from './gymSettings.service.js';

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
    const settings = await getGymSettingsService();
    const style = settings?.membershipCardStyle || {};
    const headerColor = style.headerColor || '#007bff';
    const backgroundColor = style.backgroundColor || '#f8f9fa';
    const textColor = style.textColor || '#000000';
    const headerTitle = style.headerTitle || 'GYM MEMBERSHIP';
    const logoUrl = style.logoUrl || settings?.logoUrl || '';
    const logoWidth = style.logoWidth || 60;
    const logoHeight = style.logoHeight || 60;
    
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
    const fileName = `${name.replace(/[^a-zA-Z0-9]/g, '_')}_${barcode}_card.pdf`;
    const filePath = path.join(cardsDir, fileName);

    // Pipe PDF to file
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // Card background
    doc.rect(0, 0, 400, 250)
       .fill(backgroundColor);

    // Header section
    doc.rect(0, 0, 400, 60)
       .fill(headerColor);
    
    // Gym logo/name
    doc.fillColor('white')
       .fontSize(24)
       .font('Helvetica-Bold')
       .text(headerTitle, 20, 20, { align: 'center' });

    // Optional logo
    if (logoUrl) {
      try {
        const res = await fetch(logoUrl);
        if (res.ok) {
          const logoArrayBuffer = await res.arrayBuffer();
          const logoBuffer = Buffer.from(logoArrayBuffer);
          doc.image(logoBuffer, 10, 10, { width: logoWidth, height: logoHeight, fit: [logoWidth, logoHeight] });
        }
      } catch {}
    }

    // Member info section
    doc.fillColor(textColor)
       .fontSize(16)
       .font('Helvetica-Bold')
       .text('Member Information', 20, 80);

    // Dynamic info lines with toggles
    doc.fontSize(12).font('Helvetica');
    let currentY = 105;
    const lineGap = 20;
    doc.text(`Name: ${name}`, 20, currentY);
    currentY += lineGap;
    doc.text(`Barcode: ${barcode}`, 20, currentY);
    currentY += lineGap;
    doc.text(`Level: ${String(membershipLevel || '').toUpperCase()}`, 20, currentY);
    currentY += lineGap;
    if (style.showMemberEmail && email) {
      doc.text(`Email: ${email}`, 20, currentY);
      currentY += lineGap;
    }
    if (style.showValidUntil) {
      const validText = subscriptionEndDate ? new Date(subscriptionEndDate).toLocaleDateString() : 'N/A';
      doc.text(`Valid Until: ${validText}`, 20, currentY);
      currentY += lineGap;
    }

    // QR Code (right side)
    doc.image(qrCodeBuffer, 250, 80, { width: 100, height: 100 });

    // Barcode (bottom)
    doc.image(barcodeBuffer, 50, 200, { width: 300, height: 30 });

  

    // Finalize PDF
    doc.end();

    return new Promise((resolve, reject) => {
      stream.on('finish', () => {
        resolve(filePath);
      });
      stream.on('error', (err) => {
        reject(err);
      });
    });

  } catch (error) {
    throw new Error(`PDF generation failed: ${error.message}`);
  }
};

/**
 * Draw a membership card onto an existing PDF document at a given position
 * @param {PDFDocument} doc
 * @param {Object} user
 * @param {number} x
 * @param {number} y
 * @param {number} width
 * @param {number} height
 */
const drawMembershipCardOnDoc = async (doc, user, x, y, width, height) => {
  const { barcode, name, email, membershipLevel, subscriptionEndDate } = user;
  const settings = await getGymSettingsService();
  const style = settings?.membershipCardStyle || {};
  const headerColor = style.headerColor || '#007bff';
  const backgroundColor = style.backgroundColor || '#f8f9fa';
  const textColor = style.textColor || '#000000';
  const headerTitle = style.headerTitle || 'GYM MEMBERSHIP';
  const logoUrl = style.logoUrl || settings?.logoUrl || '';
  const logoWidth = style.logoWidth || 60;
  const logoHeight = style.logoHeight || 60;

  // Generate assets to match single card
  const [qrCodeBuffer, barcodeBuffer] = await Promise.all([
    generateQRCode(barcode, name, email),
    generateBarcode(barcode)
  ]);

  // Draw exactly like the single-card PDF at origin, but translate to (x,y)
  doc.save();
  doc.translate(x, y);

  // Background 400x250
  doc.rect(0, 0, 400, 250).fill(backgroundColor);

  // Header 0..60
  doc.rect(0, 0, 400, 60).fill(headerColor);
  doc.fillColor('white')
     .fontSize(24)
     .font('Helvetica-Bold')
     .text(headerTitle, 20, 20, { width: 360, align: 'center' });

  // Optional logo same sizes
  if (logoUrl) {
    try {
      const res = await fetch(logoUrl);
      if (res.ok) {
        const logoArrayBuffer = await res.arrayBuffer();
        const logoBuffer = Buffer.from(logoArrayBuffer);
        doc.image(logoBuffer, 10, 10, { width: logoWidth, height: logoHeight, fit: [logoWidth, logoHeight] });
      }
    } catch {}
  }

  // Info block
  doc.fillColor(textColor)
     .fontSize(16)
     .font('Helvetica-Bold')
     .text('Member Information', 20, 80);

  doc.fontSize(12).font('Helvetica');
  let currentY = 105;
  const lineGap = 20;
  doc.text(`Name: ${name}`, 20, currentY);
  currentY += lineGap;
  doc.text(`Barcode: ${barcode}`, 20, currentY);
  currentY += lineGap;
  doc.text(`Level: ${String(membershipLevel || '').toUpperCase()}`, 20, currentY);
  currentY += lineGap;
  if (style.showMemberEmail && email) {
    doc.text(`Email: ${email}`, 20, currentY);
    currentY += lineGap;
  }
  if (style.showValidUntil) {
    const validText = subscriptionEndDate ? new Date(subscriptionEndDate).toLocaleDateString() : 'N/A';
    doc.text(`Valid Until: ${validText}`, 20, currentY);
  }

  // QR at 250,80 size 100; Barcode bottom
  doc.image(qrCodeBuffer, 250, 80, { width: 100, height: 100 });
  doc.image(barcodeBuffer, 50, 200, { width: 300, height: 30 });

  doc.restore();
};

/**
 * Generate a combined PDF containing multiple membership cards laid out in a grid
 * @param {Array<string>} userIds
 * @returns {Promise<{filePath: string, fileName: string, totalCards: number}>}
 */
export const generateCombinedCardsPDF = async (userIds) => {
  // Page size A4 (portrait)
  const PAGE_WIDTH = 595.28; // points
  const PAGE_HEIGHT = 841.89;
  const MARGIN = 20;
  const GAP_X = 12;
  const GAP_Y = 16;

  // Match single-card exact size
  const cardWidth = 400;
  const cardHeight = 250;

  // Compute how many cards fit per page
  const cols = Math.max(1, Math.floor((PAGE_WIDTH - MARGIN * 2 + GAP_X) / (cardWidth + GAP_X)));
  const rows = Math.max(1, Math.floor((PAGE_HEIGHT - MARGIN * 2 + GAP_Y) / (cardHeight + GAP_Y)));

  // Center grid within page
  const totalGridWidth = cols * cardWidth + (cols - 1) * GAP_X;
  const totalGridHeight = rows * cardHeight + (rows - 1) * GAP_Y;
  const startOffsetX = Math.max(MARGIN, (PAGE_WIDTH - totalGridWidth) / 2);
  const startOffsetY = Math.max(MARGIN, (PAGE_HEIGHT - totalGridHeight) / 2);

  const users = await User.find({ _id: { $in: userIds } }).lean();
  if (!users || users.length === 0) {
    throw new Error('No users found for combined PDF');
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const fileName = `membership_cards_combined_${users.length}_${timestamp}.pdf`;
  const filePath = path.join(cardsDir, fileName);

  const doc = new PDFDocument({ size: 'A4', margin: MARGIN });
  const stream = fs.createWriteStream(filePath);
  doc.pipe(stream);

  let col = 0;
  let row = 0;
  for (let i = 0; i < users.length; i++) {
    const u = users[i];
    if (!u.barcode) continue; // skip users without barcode

    const x = startOffsetX + col * (cardWidth + GAP_X);
    const y = startOffsetY + row * (cardHeight + GAP_Y);
    // eslint-disable-next-line no-await-in-loop
    await drawMembershipCardOnDoc(doc, u, x, y, cardWidth, cardHeight);

    col++;
    if (col >= cols) {
      col = 0;
      row++;
      if (row >= rows && i < users.length - 1) {
        row = 0;
        doc.addPage();
      }
    }
  }

  doc.end();

  return new Promise((resolve, reject) => {
    stream.on('finish', () => resolve({ filePath, fileName, totalCards: users.length }));
    stream.on('error', reject);
  });
};

/**
 * Generate combined PDF for all active members
 */
export const generateCombinedAllMembersPDF = async () => {
  const members = await User.find({ 
    role: 'member', 
    status: 'active',
    barcode: { $exists: true, $ne: null }
  }).select('_id');
  const ids = members.map(m => m._id.toString());
  return generateCombinedCardsPDF(ids);
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

