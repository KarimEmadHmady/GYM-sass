# Complete Gym Management System Setup

## Overview
تم إنشاء نظام إدارة الجيم متكامل ومنظم يتضمن:
- نظام Authentication متقدم مع role-based access control
- Dashboards مخصصة لكل role (Admin, Member, Trainer, Manager)
- Services منظمة للتعامل مع جميع الـ API calls
- Types منظمة ومفصلة لجميع الـ models
- Navigation system ذكي يعتمد على الـ permissions

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

### 8. Role-Based Navigation (`src/hooks/useNavigation.ts`)
- Hook للتعامل مع navigation items بناءً على الـ role
- Filtering للـ navigation items حسب الـ permissions
- Breadcrumbs و active item detection

### 9. Permissions System (`src/hooks/usePermissions.ts`)
- Hook للتحقق من الـ permissions
- Role-based access control
- Route protection utilities

### 10. Dashboard Layouts (`src/components/layouts/DashboardLayout.tsx`)
- Layout موحد لجميع الـ dashboards
- Sidebar navigation responsive
- User info و logout functionality

### 11. Protected Routes (`src/components/auth/ProtectedRoute.tsx`)
- Component لحماية الصفحات
- Role-based access control
- Automatic redirects

### 12. Services Organization (`src/services/`)
- `baseService.ts` - Base class للـ CRUD operations
- `userService.ts` - User management operations
- `attendanceService.ts` - Attendance tracking
- `workoutService.ts` - Workout plans management
- `dietService.ts` - Diet plans management
- `loyaltyService.ts` - Loyalty points system

### 13. Dashboard Pages
- `admin/dashboard/page.tsx` - Admin dashboard مع statistics
- `member/dashboard/page.tsx` - Member dashboard مع progress tracking
- `trainer/dashboard/page.tsx` - Trainer dashboard مع client management
- `unauthorized/page.tsx` - Access denied page

## إعداد متغيرات البيئة:

أنشئ ملف `.env.local` في مجلد `frontend` وأضف:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## كيفية الاستخدام:

### Authentication:
```tsx
import { useAuth } from '@/hooks/useAuth';

const MyComponent = () => {
  const { user, isAuthenticated, login, logout, isLoading } = useAuth();
  
  // استخدام الـ functions والـ state
};
```

### Permissions:
```tsx
import { usePermissions } from '@/hooks/usePermissions';

const MyComponent = () => {
  const { hasPermission, hasRole, canAccessRoute } = usePermissions();
  
  if (hasPermission('users:read')) {
    // المستخدم لديه صلاحية قراءة المستخدمين
  }
  
  if (hasRole('admin')) {
    // المستخدم admin
  }
};
```

### Navigation:
```tsx
import { useNavigation } from '@/hooks/useNavigation';

const MyComponent = () => {
  const { navigationItems, getBreadcrumbs, isActiveItem } = useNavigation();
  
  // استخدام navigation items
};
```

### Services:
```tsx
import { userService, attendanceService, workoutService } from '@/services';

// استخدام الـ services
const users = await userService.getUsers();
const attendance = await attendanceService.getTodayAttendance();
const workouts = await workoutService.getUserWorkoutPlans(userId);
```

### Protected Routes:
```tsx
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

const MyPage = () => (
  <ProtectedRoute allowedRoles={['admin']} requiredPermissions={['users:read']}>
    <div>Admin only content</div>
  </ProtectedRoute>
);
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
✅ **Role-Based Access Control**: نظام permissions متقدم  
✅ **Responsive Design**: تصميم متجاوب لجميع الأجهزة  
✅ **Service Layer**: طبقة services منظمة للـ API calls  
✅ **Navigation System**: نظام navigation ذكي يعتمد على الـ permissions  
✅ **Dashboard Layouts**: layouts مخصصة لكل role  
✅ **Protected Routes**: حماية الصفحات بناءً على الـ roles والـ permissions

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

1. **تأكد من تشغيل الـ backend server** على port 3000
2. **أنشئ ملف `.env.local`** مع الـ API URL
3. **اختبر الـ login functionality** مع مختلف الـ roles
4. **أضف صفحات إضافية** حسب الحاجة:
   - صفحات إدارة المستخدمين للـ Admin
   - صفحات إدارة الخطط للـ Trainer
   - صفحات الملف الشخصي للـ Member
5. **أضف صفحة register** إذا لم تكن موجودة
6. **أضف صفحات إضافية** مثل:
   - Financial management pages
   - Reports and analytics
   - Feedback management
   - Message system

## هيكل المشروع النهائي:

```
frontend/src/
├── types/           # جميع الـ TypeScript types
├── services/        # طبقة الـ API services
├── hooks/          # Custom hooks للـ authentication والـ permissions
├── components/     # UI components
│   ├── auth/       # Authentication components
│   └── layouts/    # Layout components
├── lib/            # Utilities والـ constants
├── middleware/     # Route protection middleware
└── app/            # Next.js app directory
    └── [locale]/   # Internationalized routes
        ├── admin/  # Admin dashboard pages
        ├── member/ # Member dashboard pages
        ├── trainer/# Trainer dashboard pages
        └── login/  # Authentication pages
```

النظام الآن جاهز للاستخدام مع بنية منظمة ومتسقة! 🚀
