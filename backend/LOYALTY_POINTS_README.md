# 🎯 نظام نقاط الولاء (Loyalty Points System)

## 📋 نظرة عامة

نظام نقاط الولاء هو نظام متكامل لإدارة نقاط العملاء في الجيم، حيث يمكن للعملاء كسب نقاط من خلال المدفوعات والحضور واستبدالها بمكافآت مختلفة.

---

## 🏗️ البنية التقنية

### الملفات المضافة:
- `src/services/loyaltyPoints.service.js` - منطق الأعمال
- `src/controllers/loyaltyPoints.controller.js` - التحكم في الطلبات
- `src/routes/loyaltyPoints.routes.js` - مسارات API
- `src/validators/loyaltyPoints.validator.js` - التحقق من صحة البيانات

### الملفات المحدثة:
- `src/services/payment.service.js` - إضافة نقاط تلقائياً عند الدفع
- `src/services/attendanceRecords.service.js` - إضافة نقاط تلقائياً عند الحضور
- `server.js` - إضافة routes الجديدة

---

## 🎮 قواعد كسب النقاط

### 1. نقاط المدفوعات
- **كل 10 جنيه = نقطة واحدة**
- يتم إضافة النقاط تلقائياً عند إنشاء أي دفعة
- مثال: دفع 150 جنيه = 15 نقطة

### 2. نقاط الحضور
- **حضور اليوم = 5 نقاط**
- **حضور 3 أيام متتالية = 20 نقطة**
- **حضور أسبوع متتالي = 50 نقطة**

### 3. نقاط إضافية (يدوياً)
- يمكن للمدير إضافة نقاط يدوياً لأي سبب
- مثال: مكافأة خاصة، عيد ميلاد، إلخ

---

## 🔧 API Endpoints

### جلب نقاط المستخدم
```http
GET /api/loyalty-points/my-points
GET /api/loyalty-points/user/:userId
```

### إضافة نقاط (للمدير فقط)
```http
POST /api/loyalty-points/add
Content-Type: application/json

{
  "userId": "user_id_here",
  "points": 50,
  "reason": "مكافأة خاصة"
}
```

### استبدال نقاط
```http
POST /api/loyalty-points/redeem
Content-Type: application/json

{
  "userId": "user_id_here",
  "points": 100,
  "reward": "جلسة تدريب مجانية"
}
```

### إحصائيات النقاط (للمدير فقط)
```http
GET /api/loyalty-points/stats
```

### أفضل المستخدمين
```http
GET /api/loyalty-points/top-users?limit=10
```

### إضافة نقاط من الدفع (للمدير فقط)
```http
POST /api/loyalty-points/payment-points
Content-Type: application/json

{
  "userId": "user_id_here",
  "amount": 200,
  "paymentType": "دفع اشتراك شهري"
}
```

### إضافة نقاط الحضور (للمدير والمدرب)
```http
POST /api/loyalty-points/attendance-points
Content-Type: application/json

{
  "userId": "user_id_here",
  "attendanceStreak": 7
}
```

---

## 🔐 الصلاحيات

### المدير (Admin)
- ✅ إضافة نقاط يدوياً
- ✅ استبدال نقاط
- ✅ جلب الإحصائيات
- ✅ إضافة نقاط من الدفع
- ✅ إضافة نقاط الحضور

### المدرب (Trainer)
- ✅ إضافة نقاط الحضور
- ✅ جلب نقاط عملائه

### العضو (Member)
- ✅ رؤية نقاطه
- ✅ استبدال نقاطه
- ✅ جلب سجل نقاطه

---

## 📊 قاعدة البيانات

### جدول المستخدمين (Users)
```javascript
{
  loyaltyPoints: { type: Number, default: 0 }
}
```

### جدول المكافآت (Rewards)
```javascript
{
  userId: ObjectId,
  points: Number, // موجب للإضافة، سالب للاستبدال
  redeemedFor: String, // سبب الإضافة أو المكافأة المستبدلة
  date: Date
}
```

---

## 🔄 التكامل التلقائي

### 1. مع نظام المدفوعات
- عند إنشاء أي دفعة، يتم حساب النقاط تلقائياً
- كل 10 جنيه = نقطة واحدة
- يتم تسجيل العملية في جدول Rewards

### 2. مع نظام الحضور
- عند تسجيل الحضور، يتم حساب النقاط تلقائياً
- يتم حساب عدد أيام الحضور المتتالية
- يتم إضافة النقاط حسب القواعد المحددة

---

## 🛡️ الأمان والتحقق

### التحقق من البيانات
- جميع المدخلات يتم التحقق منها باستخدام Joi
- التحقق من وجود المستخدم
- التحقق من كفاية النقاط للاستبدال

### الصلاحيات
- استخدام middleware للتحقق من الصلاحيات
- كل endpoint له صلاحيات محددة
- التحقق من دور المستخدم

---

## 📈 الإحصائيات المتاحة

### إحصائيات عامة
- إجمالي النقاط في النظام
- عدد المستخدمين
- متوسط النقاط لكل مستخدم
- أعلى نقاط في النظام

### أفضل المستخدمين
- قائمة بأفضل 10 مستخدمين في النقاط
- يمكن تحديد عدد النتائج

---

## 🚀 الاستخدام

### 1. تثبيت التبعيات
```bash
npm install
```

### 2. تشغيل الخادم
```bash
npm start
```

### 3. اختبار API
```bash
# جلب نقاط المستخدم
curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:3000/api/loyalty-points/my-points

# إضافة نقاط (للمدير)
curl -X POST \
     -H "Authorization: Bearer ADMIN_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"userId":"user_id","points":50,"reason":"مكافأة"}' \
     http://localhost:3000/api/loyalty-points/add
```

---

## 🔧 التخصيص

### تغيير قواعد النقاط
يمكن تعديل قواعد النقاط في `loyaltyPoints.service.js`:

```javascript
// تغيير نسبة النقاط من المدفوعات
export const calculatePointsFromPayment = (amount) => {
  return Math.floor(amount / 5); // كل 5 جنيه = نقطة واحدة
};

// تغيير نقاط الحضور
export const addAttendancePoints = async (userId, attendanceStreak) => {
  let points = 0;
  if (attendanceStreak >= 7) {
    points = 100; // تغيير من 50 إلى 100
  }
  // ...
};
```

---

## 🐛 استكشاف الأخطاء

### مشاكل شائعة:
1. **خطأ في إضافة النقاط**: تأكد من وجود المستخدم
2. **خطأ في الاستبدال**: تأكد من كفاية النقاط
3. **خطأ في الصلاحيات**: تأكد من دور المستخدم

### سجلات الأخطاء:
- يتم تسجيل أخطاء إضافة النقاط في console
- لا توقف العملية الرئيسية إذا فشلت إضافة النقاط

---

## 📝 ملاحظات مهمة

1. **التزامن**: النقاط تتزامن مع جدول Rewards
2. **الأمان**: جميع العمليات محمية بالصلاحيات
3. **الأداء**: استخدام indexes للاستعلامات السريعة
4. **المرونة**: يمكن تخصيص قواعد النقاط بسهولة

---

## 🤝 المساهمة

لإضافة ميزات جديدة أو تحسين النظام:
1. إنشاء branch جديد
2. إضافة الميزة مع الاختبارات
3. إنشاء Pull Request
4. مراجعة الكود والموافقة

---

## 📞 الدعم

لأي استفسارات أو مشاكل:
- إنشاء Issue في GitHub
- التواصل مع فريق التطوير
- مراجعة التوثيق أولاً
