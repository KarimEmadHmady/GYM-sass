# دليل تطابق بيانات نقاط الولاء مع الموديلات

## نظرة عامة
هذا الدليل يوضح كيف يتم تطابق البيانات المعروضة في واجهة المستخدم مع الموديلات الموجودة في الباك اند.

## الموديلات المستخدمة

### 1. LoyaltyPointsHistory.model.js
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  points: Number,
  type: String (enum: ['earned', 'redeemed', 'admin_added', 'admin_deducted', 'payment_bonus', 'attendance_bonus', 'expired']),
  reason: String,
  rewardId: ObjectId (ref: RedeemableReward),
  paymentId: ObjectId (ref: Payment),
  attendanceId: ObjectId (ref: AttendanceRecord),
  remainingPoints: Number,
  adminId: ObjectId (ref: User),
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

### 2. RedeemableReward.model.js
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  pointsRequired: Number,
  category: String (enum: ['discount', 'free_session', 'merchandise', 'subscription_extension', 'premium_feature', 'gift_card']),
  isActive: Boolean,
  stock: Number (-1 = unlimited),
  imageUrl: String,
  validUntil: Date,
  minMembershipLevel: String (enum: ['basic', 'silver', 'gold', 'platinum']),
  value: Number,
  valueUnit: String,
  conditions: String,
  maxRedemptionsPerUser: Number,
  totalRedemptions: Number,
  createdAt: Date,
  updatedAt: Date
}
```

## تطابق البيانات في الواجهة

### 1. عرض النقاط الحالية
```typescript
// من API: GET /loyalty-points/my-points
const pointsData = {
  user: {
    id: string,
    name: string,
    email: string,
    loyaltyPoints: number
  },
  history: LoyaltyPointsHistory[]
}

// في الواجهة
const currentPoints = loyaltyData.user.loyaltyPoints;
```

### 2. عرض الجوائز المتاحة
```typescript
// من API: GET /loyalty-points/rewards
const rewardsData = {
  user: {
    loyaltyPoints: number,
    membershipLevel: string
  },
  rewards: RedeemableReward[]
}

// في الواجهة
rewards.map((reward) => {
  const canRedeem = 
    currentPoints >= reward.pointsRequired && 
    reward.isActive &&
    (reward.stock === -1 || (reward.stock - reward.totalRedemptions) > 0) &&
    (!reward.validUntil || new Date(reward.validUntil) > new Date());
})
```

### 3. عرض تاريخ المعاملات
```typescript
// من API: GET /loyalty-points/history
const historyData = {
  history: LoyaltyPointsHistory[],
  totalCount: number,
  pagination: {
    limit: number,
    total: number
  }
}

// في الواجهة
history.map((transaction) => {
  // عرض البيانات من الموديل
  transaction.points        // عدد النقاط
  transaction.type          // نوع العملية
  transaction.reason        // السبب
  transaction.remainingPoints // النقاط المتبقية
  transaction.createdAt     // تاريخ العملية
  transaction.rewardId      // معرف الجائزة (إذا كانت استبدال)
  transaction.adminId       // معرف المدير (إذا كانت من الإدارة)
})
```

## الحقول المعروضة في الواجهة

### 1. بطاقات النقاط
- **إجمالي النقاط**: `user.loyaltyPoints`
- **النقاط المتاحة**: `user.loyaltyPoints` (نفس القيمة)
- **المستوى الحالي**: محسوب من `user.loyaltyPoints`
- **النقاط للوصول للمستوى التالي**: محسوب من `user.loyaltyPoints`

### 2. الجوائز
- **الاسم**: `reward.name`
- **الوصف**: `reward.description`
- **النقاط المطلوبة**: `reward.pointsRequired`
- **الفئة**: `reward.category`
- **الصورة**: `reward.imageUrl` (إذا كانت متوفرة)
- **القيمة**: `reward.value` + `reward.valueUnit`
- **الشروط**: `reward.conditions`
- **المخزون المتبقي**: `reward.stock - reward.totalRedemptions`
- **تاريخ انتهاء الصلاحية**: `reward.validUntil`

### 3. المعاملات
- **النقاط**: `transaction.points`
- **النوع**: `transaction.type`
- **السبب**: `transaction.reason`
- **النقاط المتبقية**: `transaction.remainingPoints`
- **التاريخ**: `transaction.createdAt`
- **الجائزة**: `transaction.rewardId` (إذا كانت استبدال)
- **المدير**: `transaction.adminId` (إذا كانت من الإدارة)

## منطق التحقق من الاستبدال

```typescript
const canRedeem = 
  currentPoints >= reward.pointsRequired &&           // النقاط كافية
  reward.isActive &&                                  // الجائزة نشطة
  (reward.stock === -1 ||                             // مخزون غير محدود
   (reward.stock - reward.totalRedemptions) > 0) &&   // أو مخزون متاح
  (!reward.validUntil ||                              // لا يوجد تاريخ انتهاء
   new Date(reward.validUntil) > new Date());         // أو لم تنته الصلاحية
```

## رسائل الحالة

```typescript
const getStatusMessage = () => {
  if (isRedeeming) return 'جاري الاستبدال...';
  if (canRedeem) return 'استبدال';
  if (currentPoints < reward.pointsRequired) return 'نقاط غير كافية';
  if (!reward.isActive) return 'غير متاح';
  if (reward.stock !== -1 && (reward.stock - reward.totalRedemptions) <= 0) return 'نفد المخزون';
  if (reward.validUntil && new Date(reward.validUntil) <= new Date()) return 'انتهت الصلاحية';
  return 'غير متاح';
};
```

## API Endpoints المستخدمة

1. **GET /loyalty-points/my-points** - جلب نقاط المستخدم الحالي
2. **GET /loyalty-points/rewards** - جلب الجوائز المتاحة
3. **GET /loyalty-points/history** - جلب تاريخ النقاط
4. **POST /loyalty-points/redeem-reward** - استبدال جائزة

## ملاحظات مهمة

1. **الأمان**: جميع البيانات تأتي من المستخدم الحالي فقط
2. **التحديث**: البيانات تُحدث تلقائياً بعد كل عملية
3. **التحقق**: يتم التحقق من جميع الشروط قبل السماح بالاستبدال
4. **الأداء**: يتم تحميل البيانات بشكل متوازي لتحسين الأداء
5. **معالجة الأخطاء**: يتم عرض رسائل خطأ واضحة للمستخدم

## التطوير المستقبلي

- إضافة pagination للتاريخ
- إضافة فلاتر للبحث
- إضافة إشعارات للجوائز الجديدة
- إضافة تحليلات مفصلة للنقاط
