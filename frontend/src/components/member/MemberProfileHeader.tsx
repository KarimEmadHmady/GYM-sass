'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { usePermissions } from '@/hooks/usePermissions';
import type { User as UserModel } from '@/types/models';
import { UserService } from '@/services/userService';

const MemberProfileHeader = () => {
  const { user: authUser } = usePermissions();
  const [user, setUser] = useState<UserModel | null>(null);
  const [trainerName, setTrainerName] = useState<string>('-');
  const userService = new UserService();

  useEffect(() => {
    const load = async () => {
      try {
        const id = (authUser as any)?._id || (authUser as any)?.id;
        if (!id) return;
        const me = await userService.getUser(id);
        setUser(me);
        const tId = (me as any)?.trainerId;
        if (tId) {
          try {
            const trainer = await userService.getUser(typeof tId === 'object' ? (tId as any)._id : tId);
            setTrainerName(trainer?.name || '-');
          } catch {
            setTrainerName('-');
          }
        }
      } catch {
        setUser(null);
      }
    };
    load();
  }, [authUser]);

  const derived = useMemo(() => {
    const name = user?.name || '-';
    const email = user?.email || '-';
    const phone = user?.phone || '-';
    const membershipLevel = (user?.membershipLevel || 'basic') as string;
    const membershipMap: Record<string, string> = {
      basic: 'Basic',
      silver: 'Silver',
      gold: 'Gold',
      platinum: 'Platinum',
    };
    const membershipType = membershipMap[membershipLevel] || 'Basic';
    const membershipExpiry = user?.subscriptionEndDate ? new Date(user.subscriptionEndDate).toLocaleDateString('ar-EG') : '-';
    const height = (user as any)?.heightCm ?? (user as any)?.metadata?.heightCm ?? '-';
    const weight = (user as any)?.baselineWeightKg ?? '-';
    const hNum = typeof height === 'number' ? height : parseFloat(height);
    const wNum = typeof weight === 'number' ? weight : parseFloat(weight);
    const bmi = hNum && wNum && !Number.isNaN(hNum) && !Number.isNaN(wNum) ? +(wNum / Math.pow(hNum / 100, 2)).toFixed(1) : undefined;
    const goalsArr: string[] = [];
    if (user?.goals?.weightLoss) goalsArr.push('تخسيس');
    if (user?.goals?.muscleGain) goalsArr.push('بناء عضلات');
    if (user?.goals?.endurance) goalsArr.push('قوة تحمل');
    return { name, email, phone, membershipType, membershipExpiry, height, weight, bmi, goalsArr };
  }, [user]);

  const getMembershipColor = (type: string) => {
    const colors = {
      Premium: 'bg-gradient-to-r from-yellow-500 to-orange-600',
      Standard: 'bg-gradient-to-r from-blue-500 to-blue-600',
      Basic: 'bg-gradient-to-r from-gray-500 to-gray-600',
      Silver: 'bg-gradient-to-r from-gray-400 to-gray-500',
      Gold: 'bg-gradient-to-r from-yellow-500 to-amber-600',
      Platinum: 'bg-gradient-to-r from-purple-500 to-indigo-600',
    } as Record<string, string>;
    return colors[type] || 'bg-gradient-to-r from-gray-500 to-gray-600';
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
            {derived.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{derived.name}</h2>
            <p className="text-gray-600 dark:text-gray-400">{derived.email}</p>
            <p className="text-gray-600 dark:text-gray-400">{derived.phone}</p>
            <div className="flex items-center mt-2">
              <span className={`px-3 py-1 text-xs font-semibold rounded-full text-white ${getMembershipColor(derived.membershipType)}`}>
                {derived.membershipType}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">
                ينتهي في {derived.membershipExpiry}
              </span>
            </div>
          </div>
        </div>

        {/* Physical Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">الطول</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{derived.height !== '-' ? `${derived.height} سم` : '-'}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">الوزن</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{derived.weight !== '-' ? `${derived.weight} كغ` : '-'}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">مؤشر كتلة الجسم</p>
            {typeof derived.bmi === 'number' ? (
              <>
                <p className={`text-2xl font-bold ${getBMIColor(derived.bmi)}`}>{derived.bmi}</p>
                <p className={`text-xs ${getBMIColor(derived.bmi)}`}>{getBMIText(derived.bmi)}</p>
              </>
            ) : (
              <p className="text-2xl font-bold text-gray-400">-</p>
            )}
          </div>
        </div>
      </div>

      {/* Goals and Trainer */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">أهدافي</h3>
            <div className="flex flex-wrap gap-2">
              {derived.goalsArr.length > 0 ? (
                derived.goalsArr.map((goal, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200"
                  >
                    {goal}
                  </span>
                ))
              ) : (
                <span className="text-gray-500 dark:text-gray-400">لا توجد أهداف محددة</span>
              )}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">مدربي</h3>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                {trainerName && trainerName !== '-' ? trainerName.charAt(0) : '?'}
              </div>
              <div className="mr-3">
                <p className="font-medium text-gray-900 dark:text-white">{trainerName}</p>
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
