# 🚀 دليل التشغيل السريع - نظام نقاط الولاء

## 📋 المتطلبات
- Node.js 18+
- MongoDB
- npm أو yarn

## ⚡ التشغيل السريع

### 1. تثبيت التبعيات
```bash
npm install
```

### 2. إعداد ملف البيئة
```bash
# انسخ ملف .env.example إلى .env
cp .env.example .env

# عدل الملف بإعدادات قاعدة البيانات
MONGODB_URI=mongodb://localhost:27017/gym_system
JWT_SECRET=your_jwt_secret_here
PORT=3000
```

### 3. تشغيل الخادم
```bash
# وضع التطوير
npm run dev

# أو وضع الإنتاج
npm start
```

### 4. اختبار النظام
```bash
# تشغيل اختبارات نقاط الولاء
npm run test:loyalty
```

## 🔧 اختبار API

### باستخدام Postman
1. استورد ملف `Loyalty_Points_API.postman_collection.json`
2. عدل المتغيرات (base_url, tokens, user_id)
3. ابدأ باختبار Authentication
4. ثم اختبر باقي الـ endpoints

### باستخدام curl
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

## 📊 مراقبة النظام

### سجلات الخادم
```bash
# مراقبة السجلات في الوقت الفعلي
tail -f logs/app.log
```

### قاعدة البيانات
```bash
# الاتصال بـ MongoDB
mongosh gym_system

# عرض المستخدمين ونقاطهم
db.users.find({}, {name: 1, loyaltyPoints: 1})

# عرض سجل النقاط
db.rewards.find().sort({date: -1}).limit(10)
```

## 🐛 استكشاف الأخطاء

### مشاكل شائعة:
1. **خطأ في الاتصال بقاعدة البيانات**
   - تأكد من تشغيل MongoDB
   - تحقق من MONGODB_URI في .env

2. **خطأ في JWT**
   - تأكد من JWT_SECRET في .env
   - تحقق من صحة الـ token

3. **خطأ في الصلاحيات**
   - تأكد من دور المستخدم (admin, trainer, member)
   - تحقق من middleware الصلاحيات

### سجلات الأخطاء:
```bash
# عرض أخطاء إضافة النقاط
grep "خطأ في إضافة نقاط" logs/app.log

# عرض أخطاء الاستبدال
grep "خطأ في استبدال النقاط" logs/app.log
```

## 📈 الإحصائيات

### جلب إحصائيات النقاط:
```bash
curl -H "Authorization: Bearer ADMIN_TOKEN" \
     http://localhost:3000/api/loyalty-points/stats
```

### جلب أفضل المستخدمين:
```bash
curl -H "Authorization: Bearer ADMIN_TOKEN" \
     http://localhost:3000/api/loyalty-points/top-users?limit=5
```

## 🔄 التكامل التلقائي

### مع نظام المدفوعات:
- عند إنشاء دفعة، يتم إضافة النقاط تلقائياً
- كل 10 جنيه = نقطة واحدة

### مع نظام الحضور:
- عند تسجيل الحضور، يتم إضافة النقاط تلقائياً
- حسب عدد أيام الحضور المتتالية

## 📝 ملاحظات مهمة

1. **الأمان**: جميع العمليات محمية بالصلاحيات
2. **الأداء**: استخدام indexes للاستعلامات السريعة
3. **المرونة**: يمكن تخصيص قواعد النقاط بسهولة
4. **التزامن**: النقاط تتزامن مع جدول Rewards

## 🆘 الدعم

للمساعدة:
- راجع `LOYALTY_POINTS_README.md` للتفاصيل الكاملة
- افحص سجلات الأخطاء
- اختبر الـ API باستخدام Postman
- تواصل مع فريق التطوير
