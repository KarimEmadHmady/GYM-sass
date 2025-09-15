'use client';

import React, { useState, useEffect } from 'react';
import { LoyaltyService } from '@/services/loyaltyService';
import { useCustomAlert } from '@/hooks/useCustomAlert';
import { LOYALTY_CONSTANTS } from '@/lib/constants';
import type { 
  UserPointsResponse, 
  RedeemableRewardsResponse, 
  LoyaltyPointsHistory,
  RedeemableReward 
} from '@/types';

const MemberLoyaltyPoints = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [loyaltyData, setLoyaltyData] = useState<UserPointsResponse | null>(null);
  const [rewards, setRewards] = useState<RedeemableReward[]>([]);
  const [history, setHistory] = useState<LoyaltyPointsHistory[]>([]);
  const [redeeming, setRedeeming] = useState<string | null>(null);
  
  const loyaltyService = new LoyaltyService();
  const { showAlert } = useCustomAlert();

  // Load data on component mount
  useEffect(() => {
    loadLoyaltyData();
  }, []);

  const loadLoyaltyData = async () => {
    try {
      setLoading(true);
      const [pointsData, rewardsData, historyData] = await Promise.all([
        loyaltyService.getMyPoints(),
        loyaltyService.getRedeemableRewards(),
        loyaltyService.getPointsHistory({ limit: 10 })
      ]);
      
      
      setLoyaltyData(pointsData);
      setRewards(rewardsData.rewards || []);
      setHistory(historyData.history || []);
    } catch (error) {
      console.error('Error loading loyalty data:', error);
      showAlert('خطأ في تحميل بيانات نقاط الولاء', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRedeemReward = async (rewardId: string) => {
    try {
      setRedeeming(rewardId);
      await loyaltyService.redeemReward(rewardId);
      showAlert('تم استبدال الجائزة بنجاح!', 'success');
      // Reload data to update points and rewards
      await loadLoyaltyData();
    } catch (error) {
      console.error('Error redeeming reward:', error);
      showAlert('خطأ في استبدال الجائزة', 'error');
    } finally {
      setRedeeming(null);
    }
  };

  const getMembershipLevel = (points: number) => {
    if (points >= 1000) return { level: 'Platinum', nextLevel: 'Diamond', pointsToNext: 0 };
    if (points >= 500) return { level: 'Gold', nextLevel: 'Platinum', pointsToNext: 1000 - points };
    if (points >= 200) return { level: 'Silver', nextLevel: 'Gold', pointsToNext: 500 - points };
    return { level: 'Bronze', nextLevel: 'Silver', pointsToNext: 200 - points };
  };

  const getLevelThreshold = (level: string) => {
    const thresholds = {
      'Bronze': 0,
      'Silver': 200,
      'Gold': 500,
      'Platinum': 1000,
      'Diamond': 2000
    };
    return thresholds[level as keyof typeof thresholds] || 0;
  };

  // Get transaction icon based on type
  const getTransactionIcon = (type: string) => {
    return LOYALTY_CONSTANTS.ICONS.TRANSACTION[type as keyof typeof LOYALTY_CONSTANTS.ICONS.TRANSACTION] || '⭐';
  };

  // Get reward icon based on category
  const getRewardIcon = (category: string) => {
    return LOYALTY_CONSTANTS.ICONS.REWARD[category as keyof typeof LOYALTY_CONSTANTS.ICONS.REWARD] || '🎁';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!loyaltyData) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">خطأ في تحميل بيانات نقاط الولاء</p>
      </div>
    );
  }

  const currentPoints = loyaltyData.user.loyaltyPoints;
  const membershipInfo = getMembershipLevel(currentPoints);

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
    return LOYALTY_CONSTANTS.TRANSACTION_COLORS[type as keyof typeof LOYALTY_CONSTANTS.TRANSACTION_COLORS] || 'text-gray-600';
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
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{currentPoints}</p>
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
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{currentPoints}</p>
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
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{membershipInfo.level}</p>
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
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{membershipInfo.pointsToNext}</p>
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
            {membershipInfo.level}
          </span>
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {membershipInfo.nextLevel}
          </span>
        </div>
        
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <div
            className={`bg-gradient-to-r ${getLevelColor(membershipInfo.level)} h-3 rounded-full`}
            style={{ 
              width: membershipInfo.pointsToNext === 0 ? '100%' : 
                `${Math.min(100, ((currentPoints - getLevelThreshold(membershipInfo.level)) / (getLevelThreshold(membershipInfo.nextLevel) - getLevelThreshold(membershipInfo.level))) * 100)}%` 
            }}
          ></div>
        </div>
        
        <div className="flex justify-between mt-2">
          <span className="text-xs text-gray-500 dark:text-gray-400">{getLevelThreshold(membershipInfo.level)}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">{getLevelThreshold(membershipInfo.nextLevel)}</span>
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
                      <span className="text-sm font-medium text-gray-900 dark:text-white">+{LOYALTY_CONSTANTS.POINTS_RULES.ATTENDANCE} نقطة</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">حضور حصة شخصية</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">+{LOYALTY_CONSTANTS.POINTS_RULES.PERSONAL_SESSION} نقطة</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">إكمال خطة تمرين</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">+{LOYALTY_CONSTANTS.POINTS_RULES.WORKOUT_PLAN_COMPLETION} نقطة</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">تقييم 5 نجوم</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">+{LOYALTY_CONSTANTS.POINTS_RULES.FIVE_STAR_RATING} نقطة</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">إحالة صديق</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">+{LOYALTY_CONSTANTS.POINTS_RULES.REFERRAL} نقطة</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">مكافأة الدفع</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">+{LOYALTY_CONSTANTS.POINTS_RULES.PAYMENT_BONUS} نقطة لكل دولار</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 dark:text-white">مستويات الولاء</h4>
                  <div className="space-y-2">
                    {Object.values(LOYALTY_CONSTANTS.MEMBERSHIP_LEVELS).map((level) => (
                      <div key={level.name} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">{level.name}</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {level.minPoints}-{level.maxPoints === Infinity ? '∞' : level.maxPoints} نقطة
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'transactions' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">معاملات نقاط الولاء</h3>
              
              <div className="space-y-3">
                {history.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">لا توجد معاملات حتى الآن</p>
                  </div>
                ) : (
                  history.map((transaction) => (
                    <div
                      key={transaction._id}
                    className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                        <div className="text-2xl">{getTransactionIcon(transaction.type)}</div>
                      <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">{transaction.reason}</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(transaction.createdAt).toLocaleDateString('ar-SA')}
                          </p>
                      </div>
                    </div>
                      <div className="text-right">
                        <p className={`font-medium ${getTransactionColor(transaction.type)}`}>
                          {getTransactionIcon(transaction.type)}{Math.abs(transaction.points)} نقطة
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          المتبقي: {transaction.remainingPoints}
                        </p>
                        {transaction.rewardId && (
                          <p className="text-xs text-blue-500 dark:text-blue-400">
                            جائزة: جائزة مستبدلة
                          </p>
                        )}
                        {transaction.adminId && (
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            من: الإدارة
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'rewards' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">المكافآت المتاحة</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {rewards.length === 0 ? (
                  <div className="col-span-2 text-center py-8">
                    <p className="text-gray-500">لا توجد جوائز متاحة حالياً</p>
                  </div>
                ) : (
                  rewards.map((reward) => {
                    // التحقق من إمكانية الاستبدال بناءً على الموديل
                    const canRedeem = 
                      currentPoints >= reward.pointsRequired && 
                      reward.isActive &&
                      (reward.stock === -1 || (reward.stock - reward.totalRedemptions) > 0) &&
                      (!reward.validUntil || new Date(reward.validUntil) > new Date());
                    
                    const isRedeeming = redeeming === reward._id;
                    
                    return (
                      <div
                        key={reward._id}
                    className={`p-4 border rounded-lg transition-colors ${
                          canRedeem
                        ? 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                        : 'border-gray-200 dark:border-gray-700 opacity-50'
                    }`}
                  >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            {reward.imageUrl ? (
                              <img 
                                src={reward.imageUrl} 
                                alt={reward.name}
                                className="w-8 h-8 rounded-full object-cover"
                              />
                            ) : (
                              <div className="text-2xl">{getRewardIcon(reward.category)}</div>
                            )}
                            <h4 className="font-medium text-gray-900 dark:text-white">{reward.name}</h4>
                          </div>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {reward.pointsRequired} نقطة
                          </span>
                        </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{reward.description}</p>
                        
                        {reward.stock !== -1 && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                            متبقي: {Math.max(0, reward.stock - reward.totalRedemptions)} جائزة
                          </p>
                        )}
                        
                        {reward.value && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                            القيمة: {reward.value} {reward.valueUnit || 'جنيه'}
                          </p>
                        )}
                        
                        {reward.validUntil && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                            صالح حتى: {new Date(reward.validUntil).toLocaleDateString('ar-SA')}
                          </p>
                        )}
                        
                        {reward.conditions && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                            الشروط: {reward.conditions}
                          </p>
                        )}
                        
                    <button
                          onClick={() => handleRedeemReward(reward._id)}
                          disabled={!canRedeem || isRedeeming}
                      className={`w-full py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                            canRedeem && !isRedeeming
                          ? 'bg-purple-600 text-white hover:bg-purple-700'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                        >
                          {isRedeeming ? 'جاري الاستبدال...' : 
                           canRedeem ? 'استبدال' : 
                           currentPoints < reward.pointsRequired ? 'نقاط غير كافية' :
                           !reward.isActive ? 'غير متاح' :
                           reward.stock !== -1 && (reward.stock - reward.totalRedemptions) <= 0 ? 'نفد المخزون' :
                           reward.validUntil && new Date(reward.validUntil) <= new Date() ? 'انتهت الصلاحية' :
                           'غير متاح'}
                        </button>
                  </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemberLoyaltyPoints;
