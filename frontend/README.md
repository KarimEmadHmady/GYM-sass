This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.



1️⃣ BMI Calculator (مؤشر كتلة الجسم)

📌 المعادلة:

𝐵
𝑀
𝐼
=
الوزن
(
كجم
)
(
الطول
(
متر
)
)
2
BMI=
(الطول(متر))
2
الوزن(كجم)
	​


🔹 مثلًا: واحد وزنه 70 كجم وطوله 1.75 م →

𝐵
𝑀
𝐼
=
70
÷
(
1.75
×
1.75
)
=
22.9
BMI=70÷(1.75×1.75)=22.9

📊 التقييم:

أقل من 18.5 → Underweight

بين 18.5 - 24.9 → Normal

بين 25 - 29.9 → Overweight

30 أو أكثر → Obese

💡 الـ Tips:

Underweight → محتاج تزود أكل بروتين + تمارين مقاومة.

Normal → ممتاز، ركز على بناء عضلات.

Overweight / Obese → محتاج دايت + كارديو.

2️⃣ Calories Calculator (السعرات اليومية)

📌 أول خطوة: نحسب BMR (معدل الحرق الأساسي) باستخدام معادلة Mifflin-St Jeor:

للرجال:

𝐵
𝑀
𝑅
=
10
×
الوزن
+
6.25
×
الطول
(
سم
)
−
5
×
العمر
+
5
BMR=10×الوزن+6.25×الطول(سم)−5×العمر+5

للنساء:

𝐵
𝑀
𝑅
=
10
×
الوزن
+
6.25
×
الطول
(
سم
)
−
5
×
العمر
−
161
BMR=10×الوزن+6.25×الطول(سم)−5×العمر−161

🔹 بعد كده نضرب BMR × معامل النشاط:

قليل النشاط (Sedentary) → × 1.2

نشاط خفيف (تمارين 1-3 مرات/أسبوع) → × 1.375

نشاط متوسط (3-5 مرات/أسبوع) → × 1.55

نشاط عالي (6-7 مرات/أسبوع) → × 1.725

💡 النتيجة = السعرات اللي يحافظ بيها على وزنه.

لو عايز يخس → -500 سعر يوميًا.

لو عايز يزيد → +300 سعر يوميًا.

3️⃣ Protein Intake Calculator (البروتين اليومي)

📌 البروتين بيتحسب على حسب الوزن:

البروتيناليومي
=
الوزن
(
كجم
)
×
(
1.6
−
2.2
)
جرام
البروتيناليومي=الوزن(كجم)×(1.6−2.2)جرام

🔹 مثال: وزن 70 كجم →
من 112g لغاية 154g بروتين يوميًا.

💡 الهدف:

أقل رقم لو عايز يحافظ.

أعلى رقم لو عايز يزيد عضلات أو يخس مع الحفاظ على الكتلة العضلية.

4️⃣ Body Fat % Estimator (تقدير نسبة الدهون)

📌 فيه معادلات كتير، البسيطة تعتمد على: الوزن + الطول + قياس الوسط + الجنس.

للرجال:

𝐵
𝑜
𝑑
𝑦
𝐹
𝑎
𝑡
%
≈
(
وزن
+
(
1.2
×
𝐵
𝑀
𝐼
)
+
(
0.23
×
العمر
)
−
16.2
)
BodyFat%≈(وزن+(1.2×BMI)+(0.23×العمر)−16.2)

للنساء:

𝐵
𝑜
𝑑
𝑦
𝐹
𝑎
𝑡
%
≈
(
وزن
+
(
1.2
×
𝐵
𝑀
𝐼
)
+
(
0.23
×
العمر
)
−
5.4
)
BodyFat%≈(وزن+(1.2×BMI)+(0.23×العمر)−5.4)

(دي معادلة تقريبية مش دقيقة زي الـ calipers أو DEXA scan).

📊 مثال: لو طلع 20% → دهون معتدلة لكن محتاج يقللها لو هدفه عضلات.

5️⃣ Workout Recommendation Tool (اقتراح تمرين)

📌 مفيش حساب رياضي هنا، دي logic بالاختيار:

هدفه خسارة وزن → كارديو + HIIT + تمارين مقاومة خفيفة.

هدفه بناء عضلات → تمارين مقاومة (Push/Pull/Legs أو Upper/Lower).

هدفه لياقة عامة → Mix بين كارديو + مقاومة 3-4 مرات/أسبوع.

6️⃣ Water Intake Calculator (شرب المياه)

📌 معادلة بسيطة:

مياه
(
لتر
)
=
الوزن
(
كجم
)
×
0.033
مياه(لتر)=الوزن(كجم)×0.033

🔹 مثال: وزن 70 كجم → 70 × 0.033 = 2.3 لتر يوميًا.

💡 مع التمرين والحر لازم يزيد لتر كمان.