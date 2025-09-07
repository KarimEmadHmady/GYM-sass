# دليل إظهار/إخفاء الـ Navigation

## نظرة عامة
تم تعديل الـ Navigation (Navbar) ليظهر فقط في الصفحات المحددة وإخفاؤه في باقي الصفحات.

## الصفحات التي يظهر فيها الـ Navigation

### ✅ الصفحات المسموحة:
1. **الصفحة الرئيسية** - `/`
2. **صفحة تسجيل الدخول** - `/login`

### ❌ الصفحات التي يختفي فيها الـ Navigation:
- `/dashboard` - لوحة التحكم العامة
- `/admin/dashboard` - لوحة تحكم الإدارة
- `/member/dashboard` - لوحة تحكم العضو
- `/member/profile` - ملف العضو الشخصي
- `/trainer/dashboard` - لوحة تحكم المدرب
- `/unauthorized` - صفحة غير مصرح
- أي صفحة أخرى غير المذكورة أعلاه

## كيفية عمل النظام

### 1. تحديد الصفحات المسموحة
```typescript
// في Navbar.tsx
const allowedRoutes = ['/', '/login'];
const shouldShowNavbar = allowedRoutes.includes(pathname);
```

### 2. منطق الإظهار/الإخفاء
```typescript
// إخفاء الـ navbar إذا لم يكن في الصفحات المسموحة
if (!shouldShowNavbar) {
  return null;
}
```

## إضافة صفحات جديدة للـ Navigation

إذا كنت تريد إضافة صفحات جديدة للـ Navigation، قم بتعديل مصفوفة `allowedRoutes`:

```typescript
// مثال: إضافة صفحة الخدمات
const allowedRoutes = ['/', '/login', '/services'];

// مثال: إضافة صفحة التسجيل
const allowedRoutes = ['/', '/login', '/register'];

// مثال: إضافة صفحة الاتصال
const allowedRoutes = ['/', '/login', '/contact'];
```

## إزالة صفحات من الـ Navigation

إذا كنت تريد إزالة صفحة من الـ Navigation:

```typescript
// مثال: إزالة صفحة تسجيل الدخول
const allowedRoutes = ['/']; // فقط الصفحة الرئيسية

// مثال: إزالة جميع الصفحات
const allowedRoutes = []; // لا تظهر في أي صفحة
```

## اختبار النظام

### 1. اختبار الصفحة الرئيسية
- انتقل إلى `/`
- يجب أن تظهر الـ Navigation في الأعلى

### 2. اختبار صفحة تسجيل الدخول
- انتقل إلى `/login`
- يجب أن تظهر الـ Navigation في الأعلى

### 3. اختبار صفحة أخرى
- انتقل إلى `/dashboard` أو أي صفحة أخرى
- يجب أن تختفي الـ Navigation تماماً

## الملفات المُعدلة

### `frontend/src/components/ui/Navbar/Navbar.tsx`
- إضافة منطق تحديد الصفحات المسموحة
- إضافة شرط إخفاء الـ navbar
- إضافة console.log للتتبع

## ملاحظات مهمة

1. **الأداء**: النظام يستخدم `pathname` من `usePathname()` للتحقق من الصفحة الحالية
2. **التوافق**: يعمل مع جميع الصفحات في Next.js
3. **المرونة**: يمكن تعديل الصفحات المسموحة بسهولة
4. **التتبع**: تم إضافة console.log لمراقبة عمل النظام

## مثال على الاستخدام المتقدم

### إظهار الـ Navigation في صفحات متعددة
```typescript
const allowedRoutes = [
  '/',           // الصفحة الرئيسية
  '/login',      // تسجيل الدخول
  '/register',   // التسجيل
  '/about',      // من نحن
  '/contact',    // اتصل بنا
  '/services',   // الخدمات
  '/pricing'     // الأسعار
];
```

### إظهار الـ Navigation في صفحات تبدأ بنص معين
```typescript
const shouldShowNavbar = pathname === '/' || 
                        pathname === '/login' || 
                        pathname.startsWith('/public');
```

### إظهار الـ Navigation في صفحات لا تحتوي على كلمة معينة
```typescript
const shouldShowNavbar = !pathname.includes('dashboard') && 
                        !pathname.includes('admin') && 
                        !pathname.includes('member');
```

هذا النظام يوفر تحكماً دقيقاً في إظهار الـ Navigation حسب احتياجات الموقع! 🎯
