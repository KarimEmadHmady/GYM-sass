# Authentication System Setup

## Overview
تم إنشاء نظام authentication منظم ومتكامل للتعامل مع تسجيل الدخول والخروج وإدارة المستخدمين.

## الملفات المُنشأة/المُحدثة:

### 1. Types Organization (`src/types/`)
- `auth.d.ts` - Authentication types (LoginCredentials, RegisterData, User, etc.)
- `common.d.ts` - Common types (ApiResponse, PaginationParams, etc.)
- `index.ts` - Central export point for all types

### 2. API Configuration (`src/lib/api.ts`)
- إعداد base URL للـ API
- دوال مساعدة لإدارة الـ tokens
- دالة `apiRequest` للتعامل مع HTTP requests مع authentication headers

### 3. Auth Service (`src/services/authService.ts`)
- `AuthService` class للتعامل مع API calls
- دوال للـ login, register, logout
- استخدام types من مجلد `types`

### 4. Redux Store (`src/redux/store.ts`)
- تحديث الـ store لتضمين auth reducer

### 5. Auth Slice (`src/redux/features/auth/authSlice.ts`)
- Redux slice لإدارة authentication state
- Async thunks للـ login, register, getCurrentUser
- إدارة loading states و errors
- استخدام types من مجلد `types`

### 6. useAuth Hook (`src/hooks/useAuth.ts`)
- Custom hook للتعامل مع authentication logic
- دوال للـ login, register, logout
- إدارة navigation بعد العمليات
- استخدام types من مجلد `types`

### 7. Login Page (`src/app/[locale]/login/page.tsx`)
- فورم login محدث ومتصل بالـ authentication system
- إدارة errors و loading states
- Validation للبيانات المدخلة

## إعداد متغيرات البيئة:

أنشئ ملف `.env.local` في مجلد `frontend` وأضف:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## كيفية الاستخدام:

### في أي component:
```tsx
import { useAuth } from '@/hooks/useAuth';

const MyComponent = () => {
  const { user, isAuthenticated, login, logout, isLoading } = useAuth();
  
  // استخدام الـ functions والـ state
};
```

### للتحقق من authentication:
```tsx
const { isAuthenticated, user } = useAuth();

if (isAuthenticated) {
  // المستخدم مسجل دخول
  console.log('User:', user);
} else {
  // المستخدم غير مسجل دخول
}
```

## المميزات:

✅ **منظم ومتسق**: استخدام Redux للـ state management  
✅ **Type Safe**: TypeScript interfaces منظمة في مجلد منفصل  
✅ **Error Handling**: إدارة شاملة للأخطاء  
✅ **Loading States**: مؤشرات تحميل أثناء العمليات  
✅ **Token Management**: إدارة تلقائية للـ JWT tokens  
✅ **Auto Redirect**: إعادة توجيه تلقائية بعد العمليات  
✅ **Form Validation**: تحقق من صحة البيانات المدخلة  
✅ **Types Organization**: تنظيم الـ types في مجلد منفصل مع export مركزي

## تنظيم الـ Types:

### مجلد `src/types/`:
- **`auth.d.ts`**: جميع types المتعلقة بالـ authentication
- **`common.d.ts`**: types عامة للاستخدام في المشروع
- **`index.ts`**: نقطة export مركزية لجميع الـ types

### كيفية الاستخدام:
```tsx
// استيراد types من نقطة واحدة
import type { LoginCredentials, User, AuthState } from '@/types';

// أو استيراد types محددة
import type { LoginCredentials } from '@/types/auth';
import type { ApiResponse } from '@/types/common';
```  

## الخطوات التالية:

1. تأكد من تشغيل الـ backend server على port 5000
2. أنشئ ملف `.env.local` مع الـ API URL
3. اختبر الـ login functionality
4. أضف protected routes إذا لزم الأمر
5. أضف صفحة register إذا لم تكن موجودة
