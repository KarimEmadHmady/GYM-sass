'use client';

import React, { useState, useEffect } from 'react';
// Simple UI components - using basic HTML elements
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
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {children}
    </button>
  );
};

const Input = ({ value, onChange, placeholder, className = '', type = 'text', disabled = false }: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  type?: string;
  disabled?: boolean;
}) => (
  <input
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    disabled={disabled}
    className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${disabled ? 'bg-gray-100' : ''} ${className}`}
  />
);

const Badge = ({ children, variant = 'default', className = '' }: { 
  children: React.ReactNode; 
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  className?: string;
}) => {
  const variantClasses = {
    default: 'bg-blue-100 text-blue-800',
    secondary: 'bg-gray-100 text-gray-800',
    destructive: 'bg-red-100 text-red-800',
    outline: 'border border-gray-300 text-gray-700'
  };
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
};

const Alert = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`p-4 rounded-md ${className}`}>
    {children}
  </div>
);

const AlertDescription = ({ children }: { children: React.ReactNode }) => (
  <div className="text-sm">
    {children}
  </div>
);

const Select = ({ value, onValueChange, children }: { 
  value: string; 
  onValueChange: (value: string) => void; 
  children: React.ReactNode;
}) => (
  <select
    value={value}
    onChange={(e) => onValueChange(e.target.value)}
    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
  >
    {children}
  </select>
);

const SelectTrigger = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`relative ${className}`}>
    {children}
  </div>
);

const SelectValue = ({ placeholder }: { placeholder: string }) => (
  <span className="text-gray-500">{placeholder}</span>
);

const SelectContent = ({ children }: { children: React.ReactNode }) => (
  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700">
    {children}
  </div>
);

const SelectItem = ({ value, children }: { value: string; children: React.ReactNode }) => (
  <option value={value} className="bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100">{children}</option>
);

const Table = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`overflow-x-auto ${className}`}>
    <table className="min-w-full divide-y divide-gray-200">
      {children}
    </table>
  </div>
);

const TableHeader = ({ children }: { children: React.ReactNode }) => (
  <thead className="bg-gray-50">
    {children}
  </thead>
);

const TableBody = ({ children }: { children: React.ReactNode }) => (
  <tbody className="bg-white divide-y divide-gray-200">
    {children}
  </tbody>
);

const TableRow = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <tr className={`hover:bg-gray-50 ${className}`}>
    {children}
  </tr>
);

const TableHead = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${className}`}>
    {children}
  </th>
);

const TableCell = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 ${className}`}>
    {children}
  </td>
);

const Dialog = ({ children, open, onOpenChange }: { 
  children: React.ReactNode; 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
}) => {
  if (!open) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {children}
      </div>
    </div>
  );
};

const DialogContent = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
);

const DialogHeader = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-4">
    {children}
  </div>
);

const DialogTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-xl font-semibold text-gray-900">
    {children}
  </h2>
);

const DialogDescription = ({ children }: { children: React.ReactNode }) => (
  <p className="text-sm text-gray-600 mt-1">
    {children}
  </p>
);

const DialogTrigger = ({ children, asChild }: { children: React.ReactNode; asChild?: boolean }) => (
  <>{children}</>
);

const Checkbox = ({ checked, onCheckedChange, className = '' }: { 
  checked: boolean; 
  onCheckedChange: (checked: boolean) => void; 
  className?: string;
}) => (
  <input
    type="checkbox"
    checked={checked}
    onChange={(e) => onCheckedChange(e.target.checked)}
    className={`h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded ${className}`}
  />
);
import { 
  FileText, 
  Download, 
  Users, 
  User, 
  Loader2, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  QrCode,
  BarChart3,
  X
} from 'lucide-react';
import CustomAlert from '@/components/ui/CustomAlert';
import { useCustomAlert } from '@/hooks/useCustomAlert';
import { membershipCardService, userService } from '@/services/membershipCardService';
import { GymSettingsService, type GymSettings } from '@/services/gymSettingsService';

interface User {
  _id: string;
  name: string;
  email: string;
  barcode: string;
  role: string;
  membershipLevel: string;
  status: string;
  phone?: string;
  userNumber?: string | number;
}

interface GeneratedCard {
  fileName: string;
  filePath: string;
  size: number;
  created: string;
}

interface CardGenerationResult {
  success: boolean;
  message: string;
  data: {
    results: Array<{
      success: boolean;
      message: string;
      fileName: string;
      filePath: string;
      user: {
        id: string;
        name: string;
        barcode: string;
        email: string;
      };
    }>;
    errors: Array<{
      userId: string;
      error: string;
    }>;
    totalRequested: number;
    totalGenerated: number;
    totalErrors: number;
  };
}

const AdminMembershipCards = () => {
  const { alertState, showSuccess, showError, showWarning, hideAlert } = useCustomAlert();
  const toast = {
    success: (message: string) => showSuccess('تم', message),
    error: (message: string) => showError('خطأ', message),
    warning: (message: string) => showWarning('تنبيه', message)
  };
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [generatedCards, setGeneratedCards] = useState<GeneratedCard[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [generationResult, setGenerationResult] = useState<CardGenerationResult | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [usersPage, setUsersPage] = useState(1);
  const [cardsPage, setCardsPage] = useState(1);
  const pageSize = 10;
  const [cardStyle, setCardStyle] = useState<NonNullable<GymSettings['membershipCardStyle']>>({
    headerColor: '#007bff',
    backgroundColor: '#f8f9fa',
    textColor: '#000000',
    accentColor: '#007bff',
    headerTitle: 'GYM MEMBERSHIP',
    showGymName: true,
    showMemberEmail: false,
    showValidUntil: true,
    logoUrl: '',
    logoWidth: 60,
    logoHeight: 60,
  } as any);
  const gymSettingsService = new GymSettingsService();

  useEffect(() => {
    fetchUsers();
    fetchGeneratedCards();
    loadCardStyle();
  }, []);

  useEffect(() => {
    setUsersPage(1);
  }, [searchTerm, roleFilter, users]);

  useEffect(() => {
    setCardsPage(1);
  }, [generatedCards]);

  const loadCardStyle = async () => {
    try {
      const settings = await gymSettingsService.get();
      if ((settings as any).membershipCardStyle) {
        setCardStyle({ ...(settings as any).membershipCardStyle });
      }
    } catch (e) {
      console.error('Failed to load card style', e);
    }
  };

  const saveCardStyle = async () => {
    try {
      const updated = await gymSettingsService.update({ membershipCardStyle: cardStyle } as any);
      setCardStyle({ ...(updated as any).membershipCardStyle });
      toast.success('تم حفظ إعدادات تصميم البطاقة');
    } catch (e) {
      toast.error('فشل حفظ إعدادات التصميم');
    }
  };

  const fetchUsers = async () => {
    try {
      const data = await userService.getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Error fetching users');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchGeneratedCards = async () => {
    try {
      const data = await membershipCardService.getGeneratedCards();
      setGeneratedCards(data);
    } catch (error) {
      console.error('Error fetching generated cards:', error);
    }
  };

  const generateSingleCard = async (userId: string) => {
    setIsGenerating(true);
    try {
      const result = await membershipCardService.generateUserCard(userId);
      
      if (result.success) {
        toast.success('Card generated successfully');
        fetchGeneratedCards();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Error generating card:', error);
      toast.error('Error generating card');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateBatchCards = async () => {
    if (selectedUsers.length === 0) {
      toast.error('Please select users to generate cards for');
      return;
    }

    setIsGenerating(true);
    try {
      const result = await membershipCardService.generateBatchCards(selectedUsers);
      setGenerationResult(result);
      setShowResults(true);
      
      if (result.success) {
        toast.success(`Generated ${result.data.totalGenerated} cards successfully`);
        fetchGeneratedCards();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Error generating batch cards:', error);
      toast.error('Error generating batch cards');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateAllMemberCards = async () => {
    setIsGenerating(true);
    try {
      const result = await membershipCardService.generateAllMemberCards();
      setGenerationResult(result);
      setShowResults(true);
      
      if (result.success) {
        toast.success(`Generated ${result.data.totalGenerated} cards successfully`);
        fetchGeneratedCards();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Error generating all cards:', error);
      toast.error('Error generating all cards');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadCard = async (fileName: string) => {
    try {
      const blob = await membershipCardService.downloadCard(fileName);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Card downloaded successfully');
    } catch (error) {
      console.error('Error downloading card:', error);
      toast.error('Error downloading card');
    }
  };

  const handleSelectUser = (userId: string, checked: boolean) => {
    if (checked) {
      setSelectedUsers([...selectedUsers, userId]);
    } else {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(filteredUsers.map(user => user._id));
    } else {
      setSelectedUsers([]);
    }
  };

  const filteredUsers = users.filter(user => {
    const term = searchTerm.toLowerCase().trim();
    const matchesSearch = term === '' || [
      user.name,
      user.email,
      user.barcode,
      user.phone,
      user.userNumber !== undefined && user.userNumber !== null ? String(user.userNumber) : ''
    ]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(term));
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const totalUserPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize));
  const paginatedUsers = filteredUsers.slice((usersPage - 1) * pageSize, usersPage * pageSize);

  const totalCardPages = Math.max(1, Math.ceil(generatedCards.length / pageSize));
  const paginatedCards = generatedCards.slice((cardsPage - 1) * pageSize, cardsPage * pageSize);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-white dark:bg-gray-900 min-h-screen dark:text-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">بطاقات العضوية</h2>
          <p className="text-gray-600 dark:text-gray-300">توليد وإدارة بطاقات العضوية مع QR وباركود</p>
        </div>
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <QrCode className="h-6 w-6 text-blue-500" />
          <BarChart3 className="h-6 w-6 text-green-500" />
        </div>
      </div>

      {/* Generation Controls */}
      <Card className="dark:bg-gray-800 dark:border-gray-700 bg-white border-gray-200">
        <CardHeader className="dark:border-gray-700 border-gray-200">
          <CardTitle className="dark:text-gray-100 text-gray-900">توليد البطاقات</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 dark:text-gray-100 text-gray-900">
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={generateAllMemberCards}
              disabled={isGenerating}
              className="flex items-center space-x-2 rtl:space-x-reverse dark:bg-blue-700 dark:hover:bg-blue-800 dark:text-white bg-blue-600 text-white hover:bg-blue-700"
            >
              {isGenerating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Users className="h-4 w-4" />
              )}
              <span>توليد بطاقات جميع الأعضاء</span>
            </Button>
            <Button
              onClick={generateBatchCards}
              disabled={isGenerating || selectedUsers.length === 0}
              className="flex items-center space-x-2 rtl:space-x-reverse dark:bg-blue-700 dark:hover:bg-blue-800 dark:text-white bg-blue-600 text-white hover:bg-blue-700"
            >
              {isGenerating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <FileText className="h-4 w-4" />
              )}
              <span>توليد المحددين ({selectedUsers.length})</span>
            </Button>
            <Button
              onClick={async () => {
                if (selectedUsers.length === 0) {
                  toast.warning('اختر مستخدمين أولاً');
                  return;
                }
                try {
                  setIsGenerating(true);
                  const blob = await membershipCardService.downloadCombinedCards(selectedUsers);
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `membership_cards_selected.pdf`;
                  document.body.appendChild(a);
                  a.click();
                  window.URL.revokeObjectURL(url);
                  document.body.removeChild(a);
                  toast.success('تم تحميل ملف PDF مجمع للمحددين');
                } catch (e) {
                  toast.error('فشل تحميل الملف المجمع');
                } finally {
                  setIsGenerating(false);
                }
              }}
              disabled={isGenerating || selectedUsers.length === 0}
              className="flex items-center space-x-2 rtl:space-x-reverse dark:bg-green-700 dark:hover:bg-green-800 dark:text-white bg-green-600 text-white hover:bg-green-700"
            >
              <Download className="h-4 w-4" />
              <span>تحميل PDF للمحددين</span>
            </Button>
            <Button
              onClick={async () => {
                try {
                  setIsGenerating(true);
                  const blob = await membershipCardService.downloadCombinedCardsAll();
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `membership_cards_all_members.pdf`;
                  document.body.appendChild(a);
                  a.click();
                  window.URL.revokeObjectURL(url);
                  document.body.removeChild(a);
                  toast.success('تم تحميل ملف PDF مجمع لكل الأعضاء');
                } catch (e) {
                  toast.error('فشل تحميل الملف المجمع');
                } finally {
                  setIsGenerating(false);
                }
              }}
              disabled={isGenerating}
              className="flex items-center space-x-2 rtl:space-x-reverse dark:bg-green-700 dark:hover:bg-green-800 dark:text-white bg-green-600 text-white hover:bg-green-700"
            >
              <Download className="h-4 w-4" />
              <span>تحميل PDF لجميع الأعضاء</span>
            </Button>
          </div>

          {generationResult && (
            <Alert className={generationResult.success ? 'border-green-500 bg-green-50 dark:bg-green-900/20 dark:border-green-700 dark:text-green-200' : 'border-red-500 bg-red-50 dark:bg-red-900/20 dark:border-red-700 dark:text-red-200'}>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                {generationResult.success ? (
                  <CheckCircle className="h-4 w-4 text-green-500 dark:text-green-300" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500 dark:text-red-300" />
                )}
                <AlertDescription>
                  <strong>{generationResult.message}</strong>
                  <div className="mt-2 text-sm">
                    <p>تم التوليد: {generationResult.data.totalGenerated}</p>
                    <p>أخطاء: {generationResult.data.totalErrors}</p>
                  </div>
                </AlertDescription>
              </div>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Card Style Settings */}
      <Card className="dark:bg-gray-800 dark:border-gray-700 bg-white border-gray-200">
        <CardHeader className="dark:border-gray-700 border-gray-200">
          <CardTitle className="dark:text-gray-100 text-gray-900">إعدادات تصميم بطاقة العضوية</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 dark:text-gray-100 text-gray-900">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm">عنوان الهيدر</label>
              <Input
                value={cardStyle.headerTitle || ''}
                onChange={(e) => setCardStyle({ ...cardStyle, headerTitle: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm">رابط الشعار (Logo URL)</label>
              <Input
                value={cardStyle.logoUrl || ''}
                onChange={(e) => setCardStyle({ ...cardStyle, logoUrl: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm">لون الخلفية</label>
              <Input type="color" value={cardStyle.backgroundColor as any}
                onChange={(e) => setCardStyle({ ...cardStyle, backgroundColor: e.target.value })}
                className="mt-1 h-10 p-1"
              />
            </div>
            <div>
              <label className="text-sm">لون الهيدر</label>
              <Input type="color" value={cardStyle.headerColor as any}
                onChange={(e) => setCardStyle({ ...cardStyle, headerColor: e.target.value })}
                className="mt-1 h-10 p-1"
              />
            </div>
            <div>
              <label className="text-sm">لون النص</label>
              <Input type="color" value={cardStyle.textColor as any}
                onChange={(e) => setCardStyle({ ...cardStyle, textColor: e.target.value })}
                className="mt-1 h-10 p-1"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-sm">عرض الشعار</label>
                <Input type="number" value={Number(cardStyle.logoWidth) as any}
                  onChange={(e) => setCardStyle({ ...cardStyle, logoWidth: Number(e.target.value) })}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm">ارتفاع الشعار</label>
                <Input type="number" value={Number(cardStyle.logoHeight) as any}
                  onChange={(e) => setCardStyle({ ...cardStyle, logoHeight: Number(e.target.value) })}
                  className="mt-1"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Checkbox checked={!!cardStyle.showMemberEmail} onCheckedChange={(v) => setCardStyle({ ...cardStyle, showMemberEmail: !!v })} />
              <span className="text-sm">عرض البريد الإلكتروني</span>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Checkbox checked={!!cardStyle.showValidUntil} onCheckedChange={(v) => setCardStyle({ ...cardStyle, showValidUntil: !!v })} />
              <span className="text-sm">عرض تاريخ الانتهاء</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={saveCardStyle} className="dark:bg-blue-700 dark:hover:bg-blue-800 bg-blue-600 text-white">حفظ الإعدادات</Button>
            <Button onClick={loadCardStyle} variant="outline">إعادة التحميل</Button>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="dark:bg-gray-800 dark:border-gray-700 bg-white border-gray-200">
        <CardHeader className="dark:border-gray-700 border-gray-200">
          <CardTitle className="dark:text-gray-100 text-gray-900">المستخدمون</CardTitle>
          <div className="flex space-x-4 rtl:space-x-reverse">
            <Input
              placeholder="بحث عن مستخدم..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700 bg-white text-gray-900 border-gray-300"
            />
            <div className="w-48 dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700 bg-white text-gray-900 border-gray-300">
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="تصفية حسب الدور" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">كل الأدوار</SelectItem>
                  <SelectItem value="member">الأعضاء</SelectItem>
                  <SelectItem value="trainer">المدربين</SelectItem>
                  <SelectItem value="manager">المديرين</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="dark:text-gray-100 text-gray-900">
          <Table className="dark:bg-gray-900 bg-white dark:text-gray-100 text-gray-900">
            <TableHeader>
              <TableRow>
                <TableHead className="w-12 dark:text-gray-100 text-gray-700 dark:bg-gray-800 bg-gray-50">
                  <Checkbox
                    checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead className="dark:text-gray-100 text-gray-700 dark:bg-gray-800 bg-gray-50">الاسم</TableHead>
                <TableHead className="dark:text-gray-100 text-gray-700 dark:bg-gray-800 bg-gray-50">البريد الإلكتروني</TableHead>
                <TableHead className="dark:text-gray-100 text-gray-700 dark:bg-gray-800 bg-gray-50">الباركود</TableHead>
                <TableHead className="dark:text-gray-100 text-gray-700 dark:bg-gray-800 bg-gray-50">الدور</TableHead>
                <TableHead className="dark:text-gray-100 text-gray-700 dark:bg-gray-800 bg-gray-50">الحالة</TableHead>
                <TableHead className="dark:text-gray-100 text-gray-700 dark:bg-gray-800 bg-gray-50">إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedUsers.map((user) => (
                <TableRow key={user._id}>
                  <TableCell className="dark:text-gray-100 text-gray-900 dark:bg-gray-900 bg-white">
                    <Checkbox
                      checked={selectedUsers.includes(user._id)}
                      onCheckedChange={(checked) => handleSelectUser(user._id, checked as boolean)}
                    />
                  </TableCell>
                  <TableCell className="font-medium dark:text-gray-100 text-gray-900 dark:bg-gray-900 bg-white">
                    <div>{user.name}</div>
                    {user.userNumber && (
                      <div className="text-xs text-gray-500 dark:text-gray-400">رقم المستخدم: {user.userNumber}</div>
                    )}
                  </TableCell>
                  <TableCell className="dark:text-gray-100 text-gray-900 dark:bg-gray-900 bg-white">{user.email}</TableCell>
                  <TableCell className="dark:bg-gray-900 bg-white">
                    {user.barcode ? (
                      <Badge variant="outline" className="font-mono dark:bg-gray-700 dark:text-gray-100 dark:border-gray-500 bg-gray-100 text-gray-900 border-gray-300">
                        {user.barcode}
                      </Badge>
                    ) : (
                      <span className="text-gray-400 dark:text-gray-500">لا يوجد باركود</span>
                    )}
                  </TableCell>
                  <TableCell className="dark:bg-gray-900 bg-white">
                    <Badge variant="secondary" className="dark:bg-gray-700 dark:text-gray-100 bg-gray-200 text-gray-900">{user.role === 'admin' ? 'إدارة' : user.role === 'manager' ? 'مدير' : user.role === 'trainer' ? 'مدرب' : 'عضو'}</Badge>
                  </TableCell>
                  <TableCell className="dark:bg-gray-900 bg-white">
                    <Badge variant={user.status === 'active' ? 'default' : 'destructive'} className={user.status === 'active' ? 'dark:bg-green-700 dark:text-white bg-green-100 text-green-800' : 'dark:bg-red-700 dark:text-white bg-red-100 text-red-800'}>
                      {user.status === 'active' ? 'نشط' : user.status === 'inactive' ? 'غير نشط' : 'محظور'}
                    </Badge>
                  </TableCell>
                  <TableCell className="dark:bg-gray-900 bg-white">
                    <Button
                      onClick={() => generateSingleCard(user._id)}
                      disabled={isGenerating || !user.barcode}
                      className="px-2 py-1 text-sm dark:bg-blue-700 dark:hover:bg-blue-800 dark:text-white bg-blue-600 text-white hover:bg-blue-700"
                    >
                      <User className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-600 dark:text-gray-300">
              الصفحة {usersPage} من {totalUserPages} — عرض {paginatedUsers.length} من {filteredUsers.length}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                disabled={usersPage === 1}
                onClick={() => setUsersPage(p => Math.max(1, p - 1))}
                className="px-3 py-1"
              >السابق</Button>
              <Button
                variant="outline"
                disabled={usersPage === totalUserPages}
                onClick={() => setUsersPage(p => Math.min(totalUserPages, p + 1))}
                className="px-3 py-1"
              >التالي</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Generated Cards */}
      <Card className="dark:bg-gray-800 dark:border-gray-700 bg-white border-gray-200">
        <CardHeader className="dark:border-gray-700 border-gray-200">
          <CardTitle className="dark:text-gray-100 text-gray-900">البطاقات المولدة</CardTitle>
        </CardHeader>
        <CardContent className="dark:text-gray-100 text-gray-900">
          <Table className="dark:bg-gray-900 bg-white dark:text-gray-100 text-gray-900">
            <TableHeader>
              <TableRow>
                <TableHead className="dark:text-gray-100 text-gray-700 dark:bg-gray-800 bg-gray-50">اسم الملف</TableHead>
                <TableHead className="dark:text-gray-100 text-gray-700 dark:bg-gray-800 bg-gray-50">الحجم</TableHead>
                <TableHead className="dark:text-gray-100 text-gray-700 dark:bg-gray-800 bg-gray-50">تاريخ الإنشاء</TableHead>
                <TableHead className="dark:text-gray-100 text-gray-700 dark:bg-gray-800 bg-gray-50">إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedCards.map((card) => (
                <TableRow key={card.fileName}>
                  <TableCell className="font-medium dark:text-gray-100 text-gray-900 dark:bg-gray-900 bg-white">{card.fileName}</TableCell>
                  <TableCell className="dark:text-gray-100 text-gray-900 dark:bg-gray-900 bg-white">{formatFileSize(card.size)}</TableCell>
                  <TableCell className="dark:text-gray-100 text-gray-900 dark:bg-gray-900 bg-white">{formatDate(card.created)}</TableCell>
                  <TableCell className="dark:bg-gray-900 bg-white">
                    <Button
                      onClick={() => downloadCard(card.fileName)}
                      className="flex items-center space-x-1 px-2 py-1 text-sm dark:bg-blue-700 dark:hover:bg-blue-800 dark:text-white bg-blue-600 text-white hover:bg-blue-700 rtl:space-x-reverse"
                    >
                      <Download className="h-4 w-4" />
                      <span>تحميل</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-600 dark:text-gray-300">
              الصفحة {cardsPage} من {totalCardPages} — عرض {paginatedCards.length} من {generatedCards.length}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                disabled={cardsPage === 1}
                onClick={() => setCardsPage(p => Math.max(1, p - 1))}
                className="px-3 py-1"
              >السابق</Button>
              <Button
                variant="outline"
                disabled={cardsPage === totalCardPages}
                onClick={() => setCardsPage(p => Math.min(totalCardPages, p + 1))}
                className="px-3 py-1"
              >التالي</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Generation Results Dialog */}
      <Dialog open={showResults} onOpenChange={setShowResults}>
        <DialogContent className="relative max-w-4xl dark:bg-gray-800 bg-white dark:text-gray-100 text-gray-900">
          <button
            type="button"
            aria-label="Close"
            onClick={() => setShowResults(false)}
            className="absolute top-3 right-3 p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
          <DialogHeader>
            <DialogTitle>نتائج توليد البطاقات</DialogTitle>
            <DialogDescription>
              تفاصيل عملية توليد البطاقات
            </DialogDescription>
          </DialogHeader>
          {generationResult && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-green-50 rounded-lg dark:bg-green-900/20">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-300">
                    {generationResult.data.totalGenerated}
                  </div>
                  <div className="text-sm text-green-600 dark:text-green-300">تم التوليد</div>
                </div>
                <div className="p-4 bg-red-50 rounded-lg dark:bg-red-900/20">
                  <div className="text-2xl font-bold text-red-600 dark:text-red-300">
                    {generationResult.data.totalErrors}
                  </div>
                  <div className="text-sm text-red-600 dark:text-red-300">أخطاء</div>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg dark:bg-blue-900/20">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-300">
                    {generationResult.data.totalRequested}
                  </div>
                  <div className="text-sm text-blue-600 dark:text-blue-300">المطلوب</div>
                </div>
              </div>

              {generationResult.data.errors.length > 0 && (
                <div>
                  <h4 className="font-semibold text-red-600 dark:text-red-300 mb-2">الأخطاء:</h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {generationResult.data.errors.map((error, index) => (
                      <div key={index} className="p-2 bg-red-50 rounded text-sm dark:bg-red-900/20 dark:text-red-200">
                        <strong>معرّف المستخدم:</strong> {error.userId} - {error.error}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Global alert for this page */}
      <CustomAlert
        isOpen={alertState.isOpen}
        onClose={hideAlert}
        title={alertState.title}
        message={alertState.message}
        type={alertState.type as any}
        duration={alertState.duration}
      />
    </div>
  );
};

export default AdminMembershipCards;
