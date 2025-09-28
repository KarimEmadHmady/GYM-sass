'use client';

import React, { useEffect } from 'react';
import { useRouter } from '@/i18n/navigation';
import { useAuth } from '@/hooks/useAuth';
import { getRoleBasedRedirect } from '@/middleware/auth';
import type { UserRole } from '@/types';

const DashboardPage: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (!isLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }

    // Redirect to role-specific dashboard
    if (user) {
      const redirectPath = getRoleBasedRedirect(user.role as UserRole, user.id);
      router.push(redirectPath);
    }
  }, [isAuthenticated, user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return null;
};

export default DashboardPage;
