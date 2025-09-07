'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [localError, setLocalError] = useState<string | null>(null);
  
  const { login, isLoading, error, isAuthenticated, clearError } = useAuth();
  const router = useRouter();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  // Clear errors when component mounts or form changes
  useEffect(() => {
    if (error) {
      setLocalError(error);
      clearError();
    }
  }, [error, clearError]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear local error when user starts typing
    if (localError) {
      setLocalError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.email || !formData.password) {
      setLocalError('Please fill in all fields');
      return;
    }

    if (!formData.email.includes('@')) {
      setLocalError('Please enter a valid email address');
      return;
    }

    try {
      const result = await login(formData);
      if (!result.success) {
        setLocalError(result.error || 'Login failed');
      }
    } catch (error) {
      setLocalError('An unexpected error occurred');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <form 
        onSubmit={handleSubmit}
        className="bg-white/20 backdrop-blur-md shadow-xl rounded-2xl px-8 py-10 w-full max-w-sm flex flex-col gap-6"
      >
        <h2 className="text-2xl font-bold text-center text-white mb-2">Login</h2>
        
        {/* Error Message */}
        {localError && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-2 rounded-lg text-sm">
            {localError}
          </div>
        )}
        
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-white font-medium">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            disabled={isLoading}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white/90 text-black disabled:opacity-50"
            placeholder="Enter your email"
          />
        </div>
        
        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="text-white font-medium">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            required
            disabled={isLoading}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white/90 text-black disabled:opacity-50"
            placeholder="Enter your password"
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="mt-2 w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold transition-all duration-200 shadow-md flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Logging in...
            </>
          ) : (
            'Login'
          )}
        </button>
        
        <div className="text-center">
          <p className="text-white/70 text-sm">
            Don't have an account?{' '}
            <a href="/register" className="text-blue-300 hover:text-blue-200 underline">
              Sign up
            </a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
