# دليل تبويب الاستبدالات في لوحة الإدارة

## نظرة عامة
تم إضافة تبويب جديد "الاستبدالات" في لوحة إدارة نقاط الولاء (`AdminLoyalty.tsx`) لعرض جميع عمليات الاستبدال التي تمت من قبل المستخدمين.

## الميزات الجديدة

### 1. نظام التبويبات
تم إعادة تنظيم واجهة الإدارة لتشمل 4 تبويبات:
- **إدارة الجوائز** 🎁 - إدارة الجوائز المتاحة
- **الاستبدالات** 🔄 - عرض جميع عمليات الاستبدال
- **سجل النقاط** 📊 - عرض جميع معاملات النقاط
- **إضافة نقاط** ➕ - إضافة نقاط يدوياً للمستخدمين

### 2. تبويب الاستبدالات
#### الفلاتر المتاحة:
- **المستخدم**: فلترة حسب مستخدم معين
- **الجائزة**: فلترة حسب جائزة معينة
- **من تاريخ**: فلترة من تاريخ محدد
- **إلى تاريخ**: فلترة إلى تاريخ محدد

#### البيانات المعروضة:
- **المستخدم**: اسم المستخدم ورقم الهاتف
- **الجائزة**: اسم الجائزة المستبدلة
- **النقاط المستخدمة**: عدد النقاط المستخدمة (باللون الأحمر)
- **النقاط المتبقية**: النقاط المتبقية للمستخدم
- **التاريخ**: تاريخ الاستبدال

### 3. تحسينات الواجهة
- تصميم متجاوب للشاشات المختلفة
- ألوان مميزة للبيانات المهمة
- رسائل تحميل وأخطاء واضحة
- فلاتر متقدمة للبحث

## الكود المضاف

### State Management
```typescript
// Tab state
const [activeTab, setActiveTab] = useState<'rewards' | 'redemptions' | 'history' | 'addPoints'>('rewards');

// الاستبدالات
const [redemptions, setRedemptions] = useState<any[]>([]);
const [redemptionsLoading, setRedemptionsLoading] = useState(false);
const [redemptionsError, setRedemptionsError] = useState<string | null>(null);
const [redemptionsFilter, setRedemptionsFilter] = useState({
  userId: '',
  rewardId: '',
  startDate: '',
  endDate: ''
});
```

### Functions
```typescript
// جلب الاستبدالات
const fetchRedemptions = async () => {
  setRedemptionsLoading(true);
  setRedemptionsError(null);
  try {
    const filters = {
      type: 'redeemed',
      ...redemptionsFilter
    };
    const res = await loyaltyService.getPointsHistory(filters);
    setRedemptions(res?.history || []);
  } catch {
    setRedemptionsError('تعذر جلب بيانات الاستبدالات');
  } finally {
    setRedemptionsLoading(false);
  }
};

// فلترة الاستبدالات
const handleRedemptionsFilter = (e: React.FormEvent) => {
  e.preventDefault();
  fetchRedemptions();
};

// إعادة تعيين فلاتر الاستبدالات
const handleResetRedemptionsFilters = () => {
  setRedemptionsFilter({
    userId: '',
    rewardId: '',
    startDate: '',
    endDate: ''
  });
  fetchRedemptions();
};
```

### UI Components
```tsx
{/* التبويبات */}
<div className="bg-white dark:bg-gray-800 rounded-lg shadow">
  <div className="border-b border-gray-200 dark:border-gray-700">
    <nav className="flex space-x-8 px-6">
      {[
        { id: 'rewards', name: 'إدارة الجوائز', icon: '🎁' },
        { id: 'redemptions', name: 'الاستبدالات', icon: '🔄' },
        { id: 'history', name: 'سجل النقاط', icon: '📊' },
        { id: 'addPoints', name: 'إضافة نقاط', icon: '➕' }
      ].map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id as any)}
          className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
            activeTab === tab.id
              ? 'border-blue-500 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
        >
          <span className="mr-2">{tab.icon}</span>
          {tab.name}
        </button>
      ))}
    </nav>
  </div>
</div>
```

## الاستخدام

### 1. الوصول للاستبدالات
1. انتقل إلى لوحة الإدارة
2. اختر "Loyalty Points" من القائمة
3. اضغط على تبويب "الاستبدالات"

### 2. فلترة البيانات
1. استخدم قائمة المستخدمين لفلترة مستخدم معين
2. استخدم قائمة الجوائز لفلترة جائزة معينة
3. حدد نطاق زمني للبحث
4. اضغط "بحث" لتطبيق الفلاتر

### 3. إعادة تعيين الفلاتر
اضغط "إعادة تعيين" لإزالة جميع الفلاتر وعرض جميع الاستبدالات

## البيانات المعروضة

### جدول الاستبدالات
| العمود | الوصف | مثال |
|--------|--------|------|
| المستخدم | اسم المستخدم ورقم الهاتف | أحمد محمد (01234567890) |
| الجائزة | اسم الجائزة المستبدلة | قسيمة خصم 10% |
| النقاط المستخدمة | عدد النقاط المستخدمة | 200 |
| النقاط المتبقية | النقاط المتبقية للمستخدم | 150 |
| التاريخ | تاريخ الاستبدال | 2024-01-20 14:30 |

## المميزات التقنية

### 1. الأداء
- تحميل البيانات بشكل متوازي
- فلاتر محلية للبحث السريع
- تحديث تلقائي للبيانات

### 2. تجربة المستخدم
- واجهة سهلة الاستخدام
- رسائل واضحة للحالات المختلفة
- تصميم متجاوب

### 3. الأمان
- عرض البيانات للمديرين فقط
- التحقق من الصلاحيات
- معالجة آمنة للأخطاء

## التطوير المستقبلي

- إضافة تصدير البيانات
- إضافة إحصائيات مفصلة للاستبدالات
- إضافة إشعارات للاستبدالات الجديدة
- إضافة تقارير دورية

## ملاحظات مهمة

1. **البيانات**: يتم جلب الاستبدالات من سجل نقاط الولاء مع فلتر `type: 'redeemed'`
2. **التحديث**: يتم تحديث البيانات تلقائياً عند فتح التبويب
3. **الأداء**: يتم تحميل البيانات بشكل متوازي مع باقي البيانات
4. **التوافق**: يعمل مع جميع المتصفحات الحديثة
