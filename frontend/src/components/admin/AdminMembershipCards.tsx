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
    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
    {children}
  </div>
);

const SelectItem = ({ value, children }: { value: string; children: React.ReactNode }) => (
  <option value={value}>{children}</option>
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
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
  BarChart3
} from 'lucide-react';
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
import { membershipCardService, userService } from '@/services/membershipCardService';

interface User {
  _id: string;
  name: string;
  email: string;
  barcode: string;
  role: string;
  membershipLevel: string;
  status: string;
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
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [generatedCards, setGeneratedCards] = useState<GeneratedCard[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [generationResult, setGenerationResult] = useState<CardGenerationResult | null>(null);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchGeneratedCards();
  }, []);

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
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.barcode?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Membership Cards</h2>
          <p className="text-gray-600">Generate and manage membership cards with QR codes and barcodes</p>
        </div>
        <div className="flex items-center space-x-2">
          <QrCode className="h-6 w-6 text-blue-500" />
          <BarChart3 className="h-6 w-6 text-green-500" />
        </div>
      </div>

      {/* Generation Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Generate Cards</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={generateAllMemberCards}
              disabled={isGenerating}
              className="flex items-center space-x-2"
            >
              {isGenerating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Users className="h-4 w-4" />
              )}
              <span>Generate All Member Cards</span>
            </Button>
            
            <Button
              onClick={generateBatchCards}
              disabled={isGenerating || selectedUsers.length === 0}
              className="flex items-center space-x-2"
            >
              {isGenerating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <FileText className="h-4 w-4" />
              )}
              <span>Generate Selected ({selectedUsers.length})</span>
            </Button>
          </div>

          {generationResult && (
            <Alert className={generationResult.success ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}>
              <div className="flex items-center space-x-2">
                {generationResult.success ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500" />
                )}
                <AlertDescription>
                  <strong>{generationResult.message}</strong>
                  <div className="mt-2 text-sm">
                    <p>Generated: {generationResult.data.totalGenerated}</p>
                    <p>Errors: {generationResult.data.totalErrors}</p>
                  </div>
                </AlertDescription>
              </div>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <div className="flex space-x-4">
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="member">Members</SelectItem>
                <SelectItem value="trainer">Trainers</SelectItem>
                <SelectItem value="manager">Managers</SelectItem>
                <SelectItem value="admin">Admins</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Barcode</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedUsers.includes(user._id)}
                      onCheckedChange={(checked) => handleSelectUser(user._id, checked as boolean)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {user.barcode ? (
                      <Badge variant="outline" className="font-mono">
                        {user.barcode}
                      </Badge>
                    ) : (
                      <span className="text-gray-400">No barcode</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{user.role}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.status === 'active' ? 'default' : 'destructive'}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      onClick={() => generateSingleCard(user._id)}
                      disabled={isGenerating || !user.barcode}
                      className="px-2 py-1 text-sm"
                    >
                      <User className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Generated Cards */}
      <Card>
        <CardHeader>
          <CardTitle>Generated Cards</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>File Name</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {generatedCards.map((card) => (
                <TableRow key={card.fileName}>
                  <TableCell className="font-medium">{card.fileName}</TableCell>
                  <TableCell>{formatFileSize(card.size)}</TableCell>
                  <TableCell>{formatDate(card.created)}</TableCell>
                  <TableCell>
                    <Button
                      onClick={() => downloadCard(card.fileName)}
                      className="flex items-center space-x-1 px-2 py-1 text-sm"
                    >
                      <Download className="h-4 w-4" />
                      <span>Download</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Generation Results Dialog */}
      <Dialog open={showResults} onOpenChange={setShowResults}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Card Generation Results</DialogTitle>
            <DialogDescription>
              Detailed results of the card generation process
            </DialogDescription>
          </DialogHeader>
          {generationResult && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {generationResult.data.totalGenerated}
                  </div>
                  <div className="text-sm text-green-600">Generated</div>
                </div>
                <div className="p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">
                    {generationResult.data.totalErrors}
                  </div>
                  <div className="text-sm text-red-600">Errors</div>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {generationResult.data.totalRequested}
                  </div>
                  <div className="text-sm text-blue-600">Requested</div>
                </div>
              </div>

              {generationResult.data.errors.length > 0 && (
                <div>
                  <h4 className="font-semibold text-red-600 mb-2">Errors:</h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {generationResult.data.errors.map((error, index) => (
                      <div key={index} className="p-2 bg-red-50 rounded text-sm">
                        <strong>User ID:</strong> {error.userId} - {error.error}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminMembershipCards;
