# Membership Cards & Barcode Scanner Setup Guide

This guide will help you set up the Barcode & QR Code Membership Card feature in your Gym Management System.

## Backend Setup

### 1. Install Required Dependencies

```bash
cd backend
npm install qrcode bwip-js pdfkit
```

### 2. Environment Variables

Add the following to your `.env` file:

```env
# Frontend URL for QR code links
FRONTEND_URL=http://localhost:3000
```

### 3. Database Migration

The user model has been updated with a `barcode` field. Existing users will automatically get barcodes when they are next updated. For immediate barcode generation for existing users, you can run:

```javascript
// Run this in MongoDB shell or create a migration script
db.users.find({barcode: {$exists: false}}).forEach(function(user) {
  var count = db.users.countDocuments();
  db.users.updateOne(
    {_id: user._id}, 
    {$set: {barcode: "G" + String(count + 1).padStart(4, '0')}}
  );
});
```

### 4. Create Cards Directory

The system will automatically create a `/cards` directory in the backend root for storing generated PDF files.

## Frontend Setup

### 1. Install Required Dependencies

```bash
cd frontend
npm install sonner
```

### 2. Update API Configuration

Make sure your API base URL is correctly configured in `frontend/src/lib/api.ts`.

## Features Overview

### 1. Membership Card Generation

- **Single Card**: Generate individual membership cards
- **Batch Generation**: Generate cards for multiple selected users
- **Bulk Generation**: Generate cards for all active members
- **PDF Download**: Download generated cards as PDF files

### 2. Attendance Scanning

- **Barcode Scanner**: USB barcode scanner support (keyboard input simulation)
- **QR Code Scanner**: Webcam-based QR code scanning
- **Manual Input**: Manual barcode/QR code entry
- **Real-time Updates**: Live attendance statistics and recent scans

### 3. Card Features

- **QR Code**: Contains user profile link and basic information
- **Barcode**: Code128 format with user's unique barcode
- **Member Info**: Name, barcode, membership level, validity
- **Professional Design**: Clean, printable PDF format

## API Endpoints

### Membership Cards

- `POST /api/membership-cards/generate/:userId` - Generate single card
- `POST /api/membership-cards/generate/batch` - Generate batch cards
- `POST /api/membership-cards/generate/all` - Generate all member cards
- `GET /api/membership-cards/list` - List generated cards
- `GET /api/membership-cards/download/:fileName` - Download card

### Attendance Scanning

- `POST /api/attendance-scan/scan` - Scan barcode and record attendance
- `GET /api/attendance-scan/summary/today` - Get today's attendance summary
- `GET /api/attendance-scan/records` - Get attendance records
- `GET /api/attendance-scan/stats/:userId` - Get user attendance stats

## Usage Instructions

### For Administrators

1. **Generate Membership Cards**:
   - Go to Admin Dashboard → بطاقات العضوية (Membership Cards)
   - Select users or use "Generate All Member Cards"
   - Download generated PDF files

2. **Attendance Scanning**:
   - Go to Admin Dashboard → ماسح الحضور (Attendance Scanner)
   - Use USB barcode scanner or webcam QR scanner
   - View real-time attendance statistics

### For Reception Staff

1. **Barcode Scanner Setup**:
   - Connect USB barcode scanner to computer
   - Open Attendance Scanner page
   - Scanner will work like keyboard input
   - Scan member barcodes to record attendance

2. **QR Code Scanning**:
   - Click "QR Scan" button
   - Allow camera access
   - Point camera at member's QR code
   - System will automatically process the scan

## Hardware Compatibility

### USB Barcode Scanners
- Works with any USB barcode scanner that simulates keyboard input
- No special drivers required
- Compatible with Code128, Code39, and other common formats

### QR Code Scanners
- Uses device camera (webcam or mobile camera)
- Works in modern browsers with camera access
- Supports both QR codes and barcodes

## Troubleshooting

### Common Issues

1. **Barcode not generating for existing users**:
   - Update user records to trigger barcode generation
   - Or run the database migration script

2. **PDF generation fails**:
   - Check if `/cards` directory exists and is writable
   - Verify all dependencies are installed

3. **Camera not working for QR scanning**:
   - Ensure HTTPS connection (required for camera access)
   - Check browser permissions for camera access

4. **Barcode scanner not working**:
   - Test scanner in a text editor first
   - Ensure scanner is in "keyboard wedge" mode
   - Check if scanner sends Enter key after barcode

### Performance Tips

1. **Large batch card generation**:
   - Generate cards in smaller batches for better performance
   - Monitor server resources during bulk operations

2. **File storage**:
   - Regularly clean up old generated cards
   - Consider implementing automatic cleanup

## Security Considerations

1. **File Access**: Generated cards are stored in `/cards` directory
2. **API Authentication**: All endpoints require proper authentication
3. **Data Privacy**: QR codes contain user information - ensure secure handling

## Future Enhancements

1. **Card Templates**: Customizable card designs
2. **Bulk Printing**: Direct printing integration
3. **Mobile App**: Dedicated mobile scanner app
4. **Analytics**: Attendance analytics and reporting
5. **Integration**: Integration with existing gym management systems

## Support

For technical support or feature requests, please contact the development team or create an issue in the project repository.

