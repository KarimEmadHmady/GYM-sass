'use client';

import React, { useState, useRef, useEffect } from 'react';
// Simple UI components
const Button = ({ children, onClick, disabled = false, className = '', variant = 'default', size = 'md' }: { 
  children: React.ReactNode; 
  onClick?: () => void; 
  disabled?: boolean; 
  className?: string;
  variant?: 'default' | 'outline' | 'destructive' | 'ghost';
  size?: 'sm' | 'md';
}) => {
  const baseClasses = 'rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  const variantClasses = {
    default: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500',
    destructive: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500'
  };
  const sizeClasses = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-4 py-2'
  };
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {children}
    </button>
  );
};

const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white rounded-lg shadow-md border border-gray-200 ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`px-6 py-4 border-b border-gray-200 ${className}`}>
    {children}
  </div>
);

const CardTitle = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <h3 className={`text-lg font-semibold text-gray-900 ${className}`}>
    {children}
  </h3>
);

const CardContent = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
);

const Alert = ({ children, className = '', variant = 'default' }: { children: React.ReactNode; className?: string; variant?: 'default' | 'destructive' }) => {
  const variantClasses = variant === 'destructive'
    ? 'border border-red-200 bg-red-50 text-red-800'
    : 'border border-gray-200 bg-gray-50 text-gray-800';
  return (
    <div className={`p-4 rounded-md ${variantClasses} ${className}`}>
      {children}
    </div>
  );
};

const AlertDescription = ({ children }: { children: React.ReactNode }) => (
  <div className="text-sm">
    {children}
  </div>
);
import { QrCode, Camera, X, CheckCircle, XCircle } from 'lucide-react';
// Simple toast implementation
const toast = {
  success: (message: string) => {
    // You can replace this with your preferred toast library
    alert(`Success: ${message}`);
  },
  error: (message: string) => {
    alert(`Error: ${message}`);
  },
  warning: (message: string) => {
    alert(`Warning: ${message}`);
  }
};

interface QRCodeScannerProps {
  onScan: (data: string) => void;
  onClose: () => void;
}

const QRCodeScanner: React.FC<QRCodeScannerProps> = ({ onScan, onClose }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastScannedData, setLastScannedData] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanningIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      stopScanning();
    };
  }, []);

  const startScanning = async () => {
    try {
      setError(null);
      setIsScanning(true);

      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' } // Use back camera if available
      });

      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      // Start scanning for QR codes
      startQRCodeDetection();

    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Unable to access camera. Please check permissions.');
      setIsScanning(false);
    }
  };

  const stopScanning = () => {
    setIsScanning(false);
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    if (scanningIntervalRef.current) {
      clearInterval(scanningIntervalRef.current);
      scanningIntervalRef.current = null;
    }
  };

  const startQRCodeDetection = () => {
    scanningIntervalRef.current = setInterval(() => {
      if (videoRef.current && canvasRef.current) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        if (context && video.videoWidth && video.videoHeight) {
          // Set canvas size to match video
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;

          // Draw video frame to canvas
          context.drawImage(video, 0, 0, canvas.width, canvas.height);

          // Get image data
          const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
          
          // Simple QR code detection (this is a basic implementation)
          // In a real app, you'd use a library like jsQR or qr-scanner
          try {
            const qrData = detectQRCode(imageData);
            if (qrData) {
              handleQRCodeDetected(qrData);
            }
          } catch (err) {
            // Silently continue scanning
          }
        }
      }
    }, 100); // Check every 100ms
  };

  const detectQRCode = (imageData: ImageData): string | null => {
    // This is a simplified QR code detection
    // In a real implementation, you would use a proper QR code library like jsQR
    // For now, we'll simulate detection by looking for patterns in the image
    
    // This is just a placeholder - you would need to implement actual QR code detection
    // or use a library like: import jsQR from 'jsqr';
    
    // For demonstration purposes, we'll return null
    // In a real app, you would use:
    // const code = jsQR(imageData.data, imageData.width, imageData.height);
    // return code ? code.data : null;
    
    return null;
  };

  const handleQRCodeDetected = (data: string) => {
    setLastScannedData(data);
    stopScanning();
    onScan(data);
    toast.success('QR Code scanned successfully!');
  };

  const handleManualInput = () => {
    const input = prompt('Enter barcode or QR code data manually:');
    if (input && input.trim()) {
      onScan(input.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <QrCode className="h-5 w-5" />
              <span>QR Code Scanner</span>
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!isScanning ? (
            <div className="space-y-4">
              <div className="text-center text-gray-600">
                <Camera className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                <p>Click to start scanning QR codes</p>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  onClick={startScanning}
                  className="flex-1"
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Start Camera
                </Button>
                <Button
                  variant="outline"
                  onClick={handleManualInput}
                  className="flex-1"
                >
                  Manual Input
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative">
                <video
                  ref={videoRef}
                  className="w-full h-48 bg-gray-100 rounded"
                  playsInline
                  muted
                />
                <canvas
                  ref={canvasRef}
                  className="hidden"
                />
                <div className="absolute inset-0 border-2 border-blue-500 rounded pointer-events-none">
                  <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-blue-500"></div>
                  <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-blue-500"></div>
                  <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-blue-500"></div>
                  <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-blue-500"></div>
                </div>
              </div>
              
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">
                  Point your camera at a QR code
                </p>
                <Button
                  variant="outline"
                  onClick={stopScanning}
                  className="w-full"
                >
                  Stop Scanning
                </Button>
              </div>
            </div>
          )}

          {lastScannedData && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Scanned:</strong> {lastScannedData}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default QRCodeScanner;
