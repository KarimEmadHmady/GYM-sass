'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

const MemberProfile: React.FC = () => {
  return (
    <ProtectedRoute allowedRoles={['member']}>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Profile Header */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-2xl font-bold">JD</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">John Doe</h1>
                <p className="text-gray-600">john.doe@example.com</p>
                <p className="text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded-full inline-block mt-2">
                  Gold Member
                </p>
              </div>
            </div>
          </div>

          {/* Profile Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Full Name</label>
                  <p className="text-gray-900">John Doe</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="text-gray-900">john.doe@example.com</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Phone</label>
                  <p className="text-gray-900">+1 (555) 123-4567</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Address</label>
                  <p className="text-gray-900">123 Main St, City, State 12345</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Date of Birth</label>
                  <p className="text-gray-900">January 15, 1990</p>
                </div>
              </div>
            </div>

            {/* Membership Information */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Membership Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Membership Level</label>
                  <p className="text-yellow-600 font-semibold">Gold</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Subscription Status</label>
                  <p className="text-green-600 font-semibold">Active</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Start Date</label>
                  <p className="text-gray-900">January 1, 2024</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">End Date</label>
                  <p className="text-gray-900">December 31, 2024</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Loyalty Points</label>
                  <p className="text-blue-600 font-semibold">1,250 points</p>
                </div>
              </div>
            </div>
          </div>

          {/* Goals */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Fitness Goals</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-gray-900">Weight Loss</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-gray-900">Muscle Gain</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                <span className="text-gray-500">Endurance</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                <div className="text-blue-600 font-semibold">Edit Profile</div>
                <div className="text-sm text-gray-500">Update your information</div>
              </button>
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                <div className="text-green-600 font-semibold">Change Password</div>
                <div className="text-sm text-gray-500">Update your password</div>
              </button>
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                <div className="text-purple-600 font-semibold">View Progress</div>
                <div className="text-sm text-gray-500">Track your fitness journey</div>
              </button>
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                <div className="text-orange-600 font-semibold">Contact Support</div>
                <div className="text-sm text-gray-500">Get help and support</div>
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default MemberProfile;
