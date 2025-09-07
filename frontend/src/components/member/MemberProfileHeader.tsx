'use client';

import React from 'react';

const MemberProfileHeader = () => {
  const memberData = {
    name: 'أحمد محمد',
    email: 'ahmed@example.com',
    phone: '+966 50 123 4567',
    joinDate: '2024-01-15',
    membershipType: 'Premium',
    membershipExpiry: '2024-07-15',
    trainer: 'سارة أحمد',
    goals: ['تخسيس', 'بناء عضلات', 'لياقة عامة'],
    height: 175,
    weight: 80,
    bmi: 26.1
  };

  const getMembershipColor = (type: string) => {
    const colors = {
      Premium: 'bg-gradient-to-r from-yellow-500 to-orange-600',
      Standard: 'bg-gradient-to-r from-blue-500 to-blue-600',
      Basic: 'bg-gradient-to-r from-gray-500 to-gray-600'
    };
    return colors[type as keyof typeof colors] || 'bg-gradient-to-r from-gray-500 to-gray-600';
  };

  const getBMIColor = (bmi: number) => {
    if (bmi < 18.5) return 'text-blue-600';
    if (bmi >= 18.5 && bmi < 25) return 'text-green-600';
    if (bmi >= 25 && bmi < 30) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getBMIText = (bmi: number) => {
    if (bmi < 18.5) return 'نقص وزن';
    if (bmi >= 18.5 && bmi < 25) return 'وزن طبيعي';
    if (bmi >= 25 && bmi < 30) return 'وزن زائد';
    return 'سمنة';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        {/* Member Info */}
        <div className="flex items-center space-x-6 mb-6 lg:mb-0">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {memberData.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{memberData.name}</h2>
            <p className="text-gray-600 dark:text-gray-400">{memberData.email}</p>
            <p className="text-gray-600 dark:text-gray-400">{memberData.phone}</p>
            <div className="flex items-center mt-2">
              <span className={`px-3 py-1 text-xs font-semibold rounded-full text-white ${getMembershipColor(memberData.membershipType)}`}>
                {memberData.membershipType}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">
                ينتهي في {memberData.membershipExpiry}
              </span>
            </div>
          </div>
        </div>

        {/* Physical Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">الطول</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{memberData.height} سم</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">الوزن</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{memberData.weight} كغ</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">مؤشر كتلة الجسم</p>
            <p className={`text-2xl font-bold ${getBMIColor(memberData.bmi)}`}>
              {memberData.bmi}
            </p>
            <p className={`text-xs ${getBMIColor(memberData.bmi)}`}>
              {getBMIText(memberData.bmi)}
            </p>
          </div>
        </div>
      </div>

      {/* Goals and Trainer */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">أهدافي</h3>
            <div className="flex flex-wrap gap-2">
              {memberData.goals.map((goal, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200"
                >
                  {goal}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">مدربي</h3>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                {memberData.trainer.charAt(0)}
              </div>
              <div className="mr-3">
                <p className="font-medium text-gray-900 dark:text-white">{memberData.trainer}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">مدرب شخصي</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberProfileHeader;
