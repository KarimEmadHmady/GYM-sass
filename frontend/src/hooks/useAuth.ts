import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect } from 'react';
import { RootState, AppDispatch } from '@/redux/store';
import { loginUser, registerUser, logout, clearError, getCurrentUser } from '@/redux/features/auth/authSlice';
import { AuthService } from '@/services/authService';
import { getRoleBasedRedirect } from '@/middleware/auth';
import type { LoginCredentials, RegisterData, AuthResult, UserRole } from '@/types';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  
  const { user, token, isAuthenticated, isLoading, error } = useSelector(
    (state: RootState) => state.auth
  );

  // Check for existing token on app load
  useEffect(() => {
    const existingToken = AuthService.getToken();
    if (existingToken && !user) {
      // Try to get current user with existing token
      dispatch(getCurrentUser());
    }
  }, [dispatch, user]);

  // Login function
  const login = useCallback(
    async (credentials: LoginCredentials): Promise<AuthResult> => {
      try {
        const result = await dispatch(loginUser(credentials));
        if (loginUser.fulfilled.match(result)) {
          // Redirect to role-specific dashboard after successful login
          const redirectPath = getRoleBasedRedirect(result.payload.user?.role as UserRole);
          router.push(redirectPath);
          return { success: true };
        } else {
          return { success: false, error: result.payload as string };
        }
      } catch (error) {
        return { 
          success: false, 
          error: error instanceof Error ? error.message : 'Login failed' 
        };
      }
    },
    [dispatch, router]
  );

  // Register function
  const register = useCallback(
    async (userData: RegisterData): Promise<AuthResult> => {
      try {
        const result = await dispatch(registerUser(userData));
        if (registerUser.fulfilled.match(result)) {
          // Redirect to role-specific dashboard after successful registration
          const redirectPath = getRoleBasedRedirect(result.payload.user?.role as UserRole);
          router.push(redirectPath);
          return { success: true };
        } else {
          return { success: false, error: result.payload as string };
        }
      } catch (error) {
        return { 
          success: false, 
          error: error instanceof Error ? error.message : 'Registration failed' 
        };
      }
    },
    [dispatch, router]
  );

  // Logout function
  const handleLogout = useCallback(() => {
    dispatch(logout());
    // Force reload to clear any cached state
    window.location.href = '/login';
  }, [dispatch]);

  // Clear error function
  const clearAuthError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Get current user function
  const fetchCurrentUser = useCallback(async () => {
    try {
      await dispatch(getCurrentUser());
    } catch (error) {
      console.error('Failed to fetch current user:', error);
    }
  }, [dispatch]);

  return {
    // State
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    
    // Actions
    login,
    register,
    logout: handleLogout,
    clearError: clearAuthError,
    fetchCurrentUser,
  };
}; 