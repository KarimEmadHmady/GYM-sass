'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from '@/i18n/navigation';
import { CheckCircle, XCircle, Clock, User, Calendar, QrCode, Scan, Camera, ArrowLeft } from 'lucide-react';
import QRCodeScanner from '@/components/admin/QRCodeScanner';
import { attendanceScanService } from '@/services/membershipCardService';
import { queueAttendance } from '@/lib/offlineSync';

const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`px-6 py-4 border-b border-gray-200 dark:border-gray-700 ${className}`}>
    {children}
  </div>
);

const CardTitle = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <h3 className={`text-lg font-semibold text-gray-900 dark:text-white ${className}`}>
    {children}
  </h3>
);

const CardContent = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
);

const Button = ({ children, onClick, disabled = false, className = '', variant = 'default' }: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  variant?: 'default' | 'outline' | 'destructive';
}) => {
  const baseClasses = 'px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  const variantClasses = {
    default: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500',
    destructive: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
  };
  return (
    <button onClick={onClick} disabled={disabled} className={`${baseClasses} ${variantClasses[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}>
      {children}
    </button>
  );
};

const Badge = ({ children, variant = 'default', className = '' }: { children: React.ReactNode; variant?: 'default' | 'secondary' | 'destructive' | 'outline'; className?: string; }) => {
  const variantClasses = { default: 'bg-blue-100 text-blue-800', secondary: 'bg-gray-100 text-gray-800', destructive: 'bg-red-100 text-red-800', outline: 'border border-gray-300 text-gray-700' };
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantClasses[variant]} ${className}`}>{children}</span>;
};

const PopupModal = ({ isOpen, onClose, title, message, type = 'success', data }: { isOpen: boolean; onClose: () => void; title: string; message: string; type?: 'success' | 'error' | 'warning'; data?: any; }) => {
  if (!isOpen) return null;
  const getIcon = () => type === 'success' ? <CheckCircle className="h-8 w-8 text-green-500" /> : type === 'error' ? <XCircle className="h-8 w-8 text-red-500" /> : <Clock className="h-8 w-8 text-yellow-500" />;
  const bg = type === 'success' ? 'bg-green-50 dark:bg-green-900/20 border-green-500 dark:border-green-400' : type === 'error' ? 'bg-red-50 dark:bg-red-900/20 border-red-500 dark:border-red-400' : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500 dark:border-yellow-400';
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70 bg-opacity-50" onClick={onClose} />
      <div className={`relative bg-white dark:bg-gray-800 rounded-lg shadow-xl border-2 max-w-md w-full mx-4 ${bg}`}>
        <div className="p-6">
          <div className="flex items-center justify-center mb-4">{getIcon()}</div>
          <h3 className="text-lg font-semibold text-center text-gray-900 dark:text-white mb-2">{title}</h3>
          <p className="text-center text-gray-700 dark:text-gray-300 mb-4">{message}</p>
          {data && (
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 mb-4">
              <div className="text-sm text-gray-700 dark:text-gray-300">
                <p><strong>العضو:</strong> {data.user.name}</p>
                <p><strong>الباركود:</strong> {data.user.barcode}</p>
                <p><strong>الوقت:</strong> {new Date(data.attendance.time).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</p>
              </div>
            </div>
          )}
          <div className="flex justify-center">
            <Button onClick={onClose} className="px-6 py-2">موافق</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface AttendanceResult { success: boolean; message: string; data?: { user: { id: string; name: string; barcode: string; email: string; membershipLevel: string; }; attendance: { id: string; date: string; status: string; time: string; }; }; }
interface TodaySummary { summary: { date: string; totalActiveMembers: number; totalPresent: number; totalAbsent: number; totalExcused: number; attendanceRate: number; }; records: Array<{ _id: string; userId: { name: string; barcode: string; role: string; }; status: string; date: string; createdAt: string; }>; }

const ManagerAttendanceScanner = ({ params }: { params: { userId: string } }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [barcode, setBarcode] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [lastResult, setLastResult] = useState<AttendanceResult | null>(null);
  const [todaySummary, setTodaySummary] = useState<TodaySummary | null>(null);
  const [recentScans, setRecentScans] = useState<any[]>([]);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupData, setPopupData] = useState<{title: string, message: string, type: 'success' | 'error' | 'warning', data?: any} | null>(null);
  const [offlineAlertOpen, setOfflineAlertOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const playSound = (type: 'success' | 'error' | 'warning') => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.connect(gainNode); gainNode.connect(audioContext.destination);
    if (type === 'success') { oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); }
    if (type === 'error') { oscillator.frequency.setValueAtTime(400, audioContext.currentTime); oscillator.frequency.setValueAtTime(300, audioContext.currentTime + 0.1); oscillator.frequency.setValueAtTime(200, audioContext.currentTime + 0.2); }
    if (type === 'warning') { oscillator.frequency.setValueAtTime(800, audioContext.currentTime); }
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime); gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    oscillator.start(audioContext.currentTime); oscillator.stop(audioContext.currentTime + 0.3);
  };

  const toast = {
    success: (message: string, data?: any) => { playSound('success'); setPopupData({ title: 'تم بنجاح!', message, type: 'success', data }); setShowPopup(true); },
    error: (message: string) => { playSound('error'); setPopupData({ title: 'خطأ!', message, type: 'error' }); setShowPopup(true); },
    warning: (message: string) => { playSound('warning'); setPopupData({ title: 'تحذير!', message, type: 'warning' }); setShowPopup(true); }
  };

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated || (user?.role !== 'manager' && user?.role !== 'admin')) {
      router.push('/login');
      return;
    }
    if (params.userId && user?.id && params.userId !== user.id) {
      router.replace(`/ar/manager/dashboard/${user.id}`);
      return;
    }
    fetchTodaySummary();
    fetchRecentScans();
  }, [isAuthenticated, user, router, isLoading, params.userId]);

  useEffect(() => { if (inputRef.current) inputRef.current.focus(); }, []);

  const fetchTodaySummary = async () => {
    try { const data = await attendanceScanService.getTodayAttendanceSummary(); setTodaySummary(data); } catch {}
  };
  const fetchRecentScans = async () => {
    try { const data = await attendanceScanService.getAttendanceRecords({ limit: 10 }); setRecentScans(data.data.records); } catch {}
  };

  const translateAttendanceError = (backendMessage: string | undefined, currentBarcode?: string) => {
    const msg = (backendMessage || '').toLowerCase();
    if (msg.includes('already') || msg.includes('duplicate') || msg.includes('scanned') || (msg.includes('تم') && msg.includes('الحضور'))) return 'تم تسجيل الحضور مسبقًا لهذا اليوم.';
    if (msg.includes('not found') || msg.includes('no user') || msg.includes('invalid') || msg.includes('غير موجود')) return `الباركود الذي أدخلته غير موجود${currentBarcode ? `: ${currentBarcode}` : ''}`;
    if (msg.includes('inactive') || msg.includes('suspended') || msg.includes('محظور') || msg.includes('غير نشط')) return 'لا يمكن تسجيل الحضور لهذا الحساب لأنه غير نشط.';
    return 'حدث خطأ أثناء مسح الباركود.';
  };

  const handleScan = async (scannedBarcode: string) => {
    if (!scannedBarcode.trim()) return;
    setIsScanning(true); setBarcode(scannedBarcode);

    // إذا كنا أوفلاين: خزّن الحضور محليًا وأظهر رسالة مناسبة
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      try {
        const clientUuid = `${scannedBarcode}-${Date.now()}`;
        await queueAttendance({
          clientUuid,
          barcode: scannedBarcode,
          time: new Date().toISOString(),
          adminId: user?.id
        });
        setOfflineAlertOpen(true);
        fetchTodaySummary();
        fetchRecentScans();
      } catch (error) {
        toast.error('حدث خطأ أثناء حفظ الحضور مؤقتًا.');
      } finally {
        setIsScanning(false);
        setBarcode('');
        setTimeout(() => {
          if (inputRef.current) inputRef.current.focus();
        }, 100);
      }
      return;
    }

    try {
      const result = await attendanceScanService.scanBarcode(scannedBarcode);
      setLastResult(result);
      if (result.success) { toast.success(result.message, result.data); fetchTodaySummary(); fetchRecentScans(); }
      else { toast.warning(translateAttendanceError(result.message, scannedBarcode)); }
    } catch (error) {
      const message = error instanceof Error ? error.message : undefined; toast.error(translateAttendanceError(message, scannedBarcode));
    } finally {
      setIsScanning(false); setBarcode(''); setTimeout(() => { if (inputRef.current) inputRef.current.focus(); }, 100);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value; setBarcode(value);
    if (value.includes('\n') || value.includes('\r')) { const clean = value.replace(/[\n\r]/g, '').trim(); if (clean) handleScan(clean); }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => { if (e.key === 'Enter' && barcode.trim()) handleScan(barcode.trim()); };
  const handleQRScan = (data: string) => { setShowQRScanner(false); try { const qrData = JSON.parse(data); if (qrData.barcode) handleScan(qrData.barcode); else handleScan(data); } catch { handleScan(data); } };

  const formatTime = (dateString: string) => new Date(dateString).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const getStatusIcon = (status: string) => status === 'present' ? <CheckCircle className="h-4 w-4 text-green-500" /> : status === 'absent' ? <XCircle className="h-4 w-4 text-red-500" /> : status === 'excused' ? <Clock className="h-4 w-4 text-yellow-500" /> : <Clock className="h-4 w-4 text-gray-500" />;
  const getStatusBadge = (status: string) => status === 'present' ? <Badge variant="default" className="bg-green-500">حاضر</Badge> : status === 'absent' ? <Badge variant="destructive">غائب</Badge> : status === 'excused' ? <Badge variant="secondary" className="bg-yellow-500">معذور</Badge> : <Badge variant="outline">غير معروف</Badge>;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">

            <div className="flex flex-col items-center justify-center gap-2">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">ماسح الحضور</h1>
              <p className="text-gray-600 dark:text-gray-300">امسح باركود الأعضاء لتسجيل الحضور</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Scan className="h-6 w-6 text-blue-500 dark:text-blue-400" />
            <span className="text-sm text-gray-500 dark:text-gray-400">جاهز للمسح</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <QrCode className="h-5 w-5" />
                  <span>ماسح الباركود</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="barcode" className="text-sm font-medium text-gray-700 dark:text-gray-300">امسح أو أدخل الباركود</label>
                  <input ref={inputRef} id="barcode" type="text" value={barcode} onChange={handleInputChange} onKeyPress={handleKeyPress} placeholder="امسح الباركود أو اكتبه يدوياً..." className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg font-mono bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 disabled:bg-gray-100 dark:disabled:bg-gray-600" disabled={isScanning} />
                </div>
                <div className="flex space-x-2">
                  <Button onClick={() => handleScan(barcode)} disabled={!barcode.trim() || isScanning} className="flex-1">{isScanning ? 'جاري المعالجة...' : 'تسجيل الحضور'}</Button>
                  <Button variant="outline" onClick={() => setShowQRScanner(true)} className="flex items-center space-x-2"><Camera className="h-4 w-4" /><span>مسح QR</span></Button>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2"><Calendar className="h-5 w-5" /><span>ملخص اليوم</span></CardTitle>
              </CardHeader>
              <CardContent>
                {todaySummary ? (
                  <div className="space-y-3">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{todaySummary.summary.attendanceRate}%</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">معدل الحضور</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="text-center"><div className="font-semibold text-green-600 dark:text-green-400">{todaySummary.summary.totalPresent}</div><div className="text-gray-500 dark:text-gray-400">حاضر</div></div>
                      <div className="text-center"><div className="font-semibold text-gray-600 dark:text-gray-400">{todaySummary.summary.totalActiveMembers}</div><div className="text-gray-500 dark:text-gray-400">إجمالي الأعضاء</div></div>
                    </div>
                  </div>
                ) : (<div className="text-center text-gray-500 dark:text-gray-400">جاري التحميل...</div>)}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2"><Clock className="h-5 w-5" /><span>المسوحات الأخيرة</span></CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {(() => {
                    const validScans = recentScans.filter(scan => scan.userId);
                    return validScans.length > 0 ? validScans.map((scan) => (
                    <div key={scan._id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(scan.status)}
                        <div>
                          <div className="font-medium text-sm text-gray-900 dark:text-white">
                            {scan.userId?.name || 'عضو غير معروف'}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {scan.userId?.barcode || 'N/A'}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-500 dark:text-gray-400">{formatTime(scan.createdAt)}</div>
                        {getStatusBadge(scan.status)}
                      </div>
                    </div>
                    )) : (<div className="text-center text-gray-500 dark:text-gray-400 text-sm">لا توجد مسوحات حديثة</div>);
                  })()}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {showQRScanner && (
          <QRCodeScanner onScan={handleQRScan} onClose={() => setShowQRScanner(false)} />
        )}

        {popupData && (
          <PopupModal isOpen={showPopup} onClose={() => { setShowPopup(false); setPopupData(null); }} title={popupData.title} message={popupData.message} type={popupData.type} data={popupData.data} />
        )}

        {/* Offline Alert Modal */}
        {offlineAlertOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={()=>setOfflineAlertOpen(false)}></div>
            <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-sm p-6 z-10">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xl">📱</div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">حفظ أوفلاين</h4>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
                تم حفظ الحضور مؤقتًا أوفلاين، وسيتم مزامنته تلقائيًا عند عودة الاتصال بالإنترنت.
              </p>
              <div className="flex items-center justify-end gap-2">
                <button 
                  onClick={()=>setOfflineAlertOpen(false)} 
                  className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white"
                >
                  موافق
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagerAttendanceScanner;


