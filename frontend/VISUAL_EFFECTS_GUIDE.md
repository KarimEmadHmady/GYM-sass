# دليل التأثيرات المرئية المشروطة

## نظرة عامة
تم تطبيق نظام للتحكم في إظهار/إخفاء التأثيرات المرئية بناءً على الصفحة الحالية. يتضمن هذا النظام:

1. **Navigation Bar** - شريط التنقل
2. **Splash Cursor Effect** - تأثير الألوان في الماوس

## الصفحات المسموحة

### ✅ الصفحات التي تظهر فيها جميع التأثيرات:
1. **الصفحة الرئيسية** - `/`
2. **صفحة تسجيل الدخول** - `/login`

### ❌ الصفحات التي تختفي فيها جميع التأثيرات:
- `/dashboard` - لوحة التحكم العامة
- `/admin/dashboard` - لوحة تحكم الإدارة
- `/member/dashboard` - لوحة تحكم العضو
- `/member/profile` - ملف العضو الشخصي
- `/trainer/dashboard` - لوحة تحكم المدرب
- `/unauthorized` - صفحة غير مصرح
- أي صفحة أخرى

## المكونات المُعدلة

### 1. Navigation Bar
**الملف:** `frontend/src/components/ui/Navbar/Navbar.tsx`

```typescript
// تحديد الصفحات المسموحة
const allowedRoutes = ['/', '/login'];
const shouldShowNavbar = allowedRoutes.includes(pathname);

// إخفاء الـ navbar إذا لم يكن في الصفحات المسموحة
if (!shouldShowNavbar) {
  return null;
}
```

### 2. Splash Cursor Effect
**الملف:** `frontend/src/components/ui/ConditionalSplashCursor.tsx`

```typescript
const ConditionalSplashCursor = () => {
  const pathname = usePathname();
  const allowedRoutes = ['/', '/login'];
  const shouldShowCursor = allowedRoutes.includes(pathname);
  
  if (!shouldShowCursor) {
    return null;
  }

  return <SplashCursor />;
};
```

### 3. Layout الرئيسي
**الملف:** `frontend/src/app/layout.tsx`

```typescript
// استخدام المكون المشروط
<ConditionalSplashCursor />
```

## نظام الاختبار

### مكون الاختبار
**الملف:** `frontend/src/components/ui/NavbarVisibilityTest.tsx`

يعرض:
- الـ path الحالي
- حالة إظهار/إخفاء الـ Navigation
- حالة إظهار/إخفاء تأثير الماوس
- الصفحات المسموحة

## إضافة صفحات جديدة

### إضافة صفحة للـ Navigation وتأثير الماوس
```typescript
// في Navbar.tsx و ConditionalSplashCursor.tsx
const allowedRoutes = ['/', '/login', '/new-page'];
```

### إضافة صفحة للـ Navigation فقط
```typescript
// في Navbar.tsx
const allowedRoutes = ['/', '/login', '/services'];

// في ConditionalSplashCursor.tsx (يبقى كما هو)
const allowedRoutes = ['/', '/login'];
```

### إضافة صفحة لتأثير الماوس فقط
```typescript
// في ConditionalSplashCursor.tsx
const allowedRoutes = ['/', '/login', '/contact'];

// في Navbar.tsx (يبقى كما هو)
const allowedRoutes = ['/', '/login'];
```

## إزالة صفحات

### إزالة صفحة من جميع التأثيرات
```typescript
// في كلا الملفين
const allowedRoutes = ['/']; // إزالة '/login'
```

### إزالة جميع التأثيرات
```typescript
// في كلا الملفين
const allowedRoutes = []; // لا تظهر في أي صفحة
```

## اختبار النظام

### 1. اختبار الصفحة الرئيسية (`/`)
- ✅ يجب أن تظهر الـ Navigation
- ✅ يجب أن يظهر تأثير الماوس

### 2. اختبار صفحة تسجيل الدخول (`/login`)
- ✅ يجب أن تظهر الـ Navigation
- ✅ يجب أن يظهر تأثير الماوس

### 3. اختبار صفحة أخرى (`/dashboard`)
- ❌ يجب أن تختفي الـ Navigation
- ❌ يجب أن يختفي تأثير الماوس

## المميزات

### 1. الأداء
- التأثيرات تختفي تماماً في الصفحات غير المسموحة
- لا يتم تحميل المكونات غير الضرورية
- تحسين سرعة التحميل

### 2. المرونة
- سهولة إضافة/إزالة الصفحات
- تحكم منفصل لكل تأثير
- سهولة الصيانة

### 3. التوافق
- يعمل مع جميع الصفحات في Next.js
- متوافق مع نظام التوجيه الدولي
- لا يؤثر على وظائف الموقع

## استكشاف الأخطاء

### المشاكل الشائعة

1. **التأثيرات لا تظهر في الصفحة الرئيسية**
   - تحقق من أن الـ pathname هو `/` وليس `/en` أو `/ar`
   - تحقق من console.log في المتصفح

2. **التأثيرات تظهر في صفحات غير مرغوبة**
   - تحقق من مصفوفة `allowedRoutes`
   - تأكد من تطابق الـ pathname

3. **مكون الاختبار لا يظهر**
   - تأكد من إضافته في الصفحة الرئيسية
   - تحقق من أن الـ z-index عالي بما فيه الكفاية

### رسائل التتبع
```javascript
// في console المتصفح
console.log('Current pathname:', pathname);
console.log('Should show navbar:', shouldShowNavbar);
console.log('Should show cursor:', shouldShowCursor);
```

## التخصيص المتقدم

### صفحات مختلفة لتأثيرات مختلفة
```typescript
// Navigation للصفحات العامة
const navbarRoutes = ['/', '/login', '/about', '/contact'];

// تأثير الماوس للصفحات التفاعلية فقط
const cursorRoutes = ['/', '/login', '/games'];
```

### منطق معقد
```typescript
// إظهار في الصفحات التي تبدأ بـ /public
const shouldShow = pathname.startsWith('/public') || 
                  pathname === '/' || 
                  pathname === '/login';
```

هذا النظام يوفر تحكماً دقيقاً في التأثيرات المرئية حسب احتياجات كل صفحة! 🎨✨
