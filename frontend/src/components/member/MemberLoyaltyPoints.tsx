'use client';

import React, { useState } from 'react';

const MemberLoyaltyPoints = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const loyaltyData = {
    totalPoints: 1250,
    availablePoints: 800,
    usedPoints: 450,
    level: 'Gold',
    nextLevel: 'Platinum',
    pointsToNext: 250
  };

  const recentTransactions = [
    {
      id: 1,
      type: 'earned',
      description: 'حضور حصة تدريبية',
      points: 50,
      date: '2024-01-20',
      icon: '🏋️'
    },
    {
      id: 2,
      type: 'earned',
      description: 'إكمال خطة تمرين',
      points: 100,
      date: '2024-01-19',
      icon: '📋'
    },
    {
      id: 3,
      type: 'redeemed',
      description: 'استبدال قسيمة خصم 10%',
      points: -200,
      date: '2024-01-18',
      icon: '🎫'
    },
    {
      id: 4,
      type: 'earned',
      description: 'تقييم 5 نجوم',
      points: 25,
      date: '2024-01-17',
      icon: '⭐'
    },
    {
      id: 5,
      type: 'earned',
      description: 'حضور حصة شخصية',
      points: 75,
      date: '2024-01-16',
      icon: '👤'
    }
  ];

  const rewards = [
    {
      id: 1,
      name: 'قسيمة خصم 10%',
      points: 200,
      description: 'خصم 10% على جميع الخدمات',
      icon: '🎫',
      available: true
    },
    {
      id: 2,
      name: 'حصصة شخصية مجانية',
      points: 500,
      description: 'حصصة تدريب شخصي مجانية',
      icon: '👤',
      available: true
    },
    {
      id: 3,
      name: 'قسيمة خصم 20%',
      points: 800,
      description: 'خصم 20% على جميع الخدمات',
      icon: '🎫',
      available: false
    },
    {
      id: 4,
      name: 'عضوية شهر إضافي',
      points: 1000,
      description: 'شهر إضافي من العضوية',
      icon: '🏆',
      available: false
    }
  ];

  const getLevelColor = (level: string) => {
    const colors = {
      Bronze: 'from-yellow-600 to-yellow-800',
      Silver: 'from-gray-400 to-gray-600',
      Gold: 'from-yellow-400 to-yellow-600',
      Platinum: 'from-purple-400 to-purple-600',
      Diamond: 'from-blue-400 to-blue-600'
    };
    return colors[level as keyof typeof colors] || 'from-gray-400 to-gray-600';
  };

  const getTransactionColor = (type: string) => {
    return type === 'earned' ? 'text-green-600' : 'text-red-600';
  };

  const getTransactionIcon = (type: string) => {
    return type === 'earned' ? '➕' : '➖';
  };

  return (
    <div className="space-y-6">
      {/* Points Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center text-white text-xl">
              ⭐
            </div>
            <div className="mr-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">إجمالي النقاط</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{loyaltyData.totalPoints}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center text-white text-xl">
              💰
            </div>
            <div className="mr-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">النقاط المتاحة</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{loyaltyData.availablePoints}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white text-xl">
              🏆
            </div>
            <div className="mr-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">المستوى الحالي</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{loyaltyData.level}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-xl">
              🎯
            </div>
            <div className="mr-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">للوصول للمستوى التالي</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{loyaltyData.pointsToNext}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Level Progress */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          تقدمك نحو المستوى التالي
        </h3>
        
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {loyaltyData.level}
          </span>
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {loyaltyData.nextLevel}
          </span>
        </div>
        
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-3 rounded-full"
            style={{ width: '70%' }}
          ></div>
        </div>
        
        <div className="flex justify-between mt-2">
          <span className="text-xs text-gray-500 dark:text-gray-400">0</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">1000</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', name: 'نظرة عامة', icon: '📊' },
              { id: 'transactions', name: 'المعاملات', icon: '💳' },
              { id: 'rewards', name: 'المكافآت', icon: '🎁' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">نظرة عامة على نقاط الولاء</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 dark:text-white">كيفية كسب النقاط</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">حضور حصة تدريبية</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">+50 نقطة</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">حضور حصة شخصية</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">+75 نقطة</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">إكمال خطة تمرين</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">+100 نقطة</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">تقييم 5 نجوم</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">+25 نقطة</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 dark:text-white">مستويات الولاء</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Bronze</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">0-199 نقطة</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Silver</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">200-499 نقطة</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Gold</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">500-999 نقطة</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Platinum</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">1000+ نقطة</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'transactions' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">معاملات نقاط الولاء</h3>
              
              <div className="space-y-3">
                {recentTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="text-2xl">{transaction.icon}</div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{transaction.description}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{transaction.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-medium ${getTransactionColor(transaction.type)}`}>
                        {getTransactionIcon(transaction.type)}{Math.abs(transaction.points)} نقطة
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'rewards' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">المكافآت المتاحة</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {rewards.map((reward) => (
                  <div
                    key={reward.id}
                    className={`p-4 border rounded-lg transition-colors ${
                      reward.available
                        ? 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                        : 'border-gray-200 dark:border-gray-700 opacity-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{reward.icon}</div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{reward.name}</h4>
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {reward.points} نقطة
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{reward.description}</p>
                    <button
                      disabled={!reward.available}
                      className={`w-full py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                        reward.available
                          ? 'bg-purple-600 text-white hover:bg-purple-700'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {reward.available ? 'استبدال' : 'غير متاح'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemberLoyaltyPoints;
