"use client";
import { CardSpotlight } from "@/components/ui/card-spotlight";

export function CardSpotlightDemo() {
  // Detect language from URL or localStorage (you can integrate with your i18n system)
  const isArabic = typeof window !== 'undefined' && window.location.pathname.includes('/ar');
  
  const content = {
    title: isArabic ? 'خطط الاشتراك' : 'Subscription Plans',
    subtitle: isArabic ? 'اختر الخطة المناسبة لك' : 'Choose the plan that suits you',
    plans: [
      {
        name: isArabic ? 'خطة 6 أشهر' : '6 Months Plan',
        price: '1,200',
        currency: isArabic ? 'ج.م' :'L.E',
        period: isArabic ? '/6 أشهر' : '/6 months',
        color: 'blue',
        features: isArabic ? [
          'دخول كامل للجيم',
          'استخدام جميع المعدات',
          'فصول لياقة أساسية',
          'غرفة تبديل الملابس',
          'موقف سيارات مجاني',
          'دعم فني أساسي'
        ] : [
          'Full gym access',
          'Use all equipment',
          'Basic fitness classes',
          'Locker room access',
          'Free parking',
          'Basic technical support'
        ]
      },
      {
        name: isArabic ? 'خطة سنة كاملة' : '1 Year Plan',
        price: '2,000',
        currency: isArabic ? 'ج.م' :'L.E',
        period: isArabic ? '/سنة' : '/year',
        color: 'green',
        features: isArabic ? [
          'كل مميزات خطة 6 أشهر',
          'فصول لياقة متقدمة',
          'مدرب شخصي (مرتين شهرياً)',
          'استشارة تغذية مجانية',
          'حجز ذو أولوية',
          'دخول 24/7',
          'خصم 17% على السعر السنوي'
        ] : [
          'All 6 months features',
          'Advanced fitness classes',
          'Personal trainer (2x/month)',
          'Free nutrition consultation',
          'Priority booking',
          '24/7 access',
          '17% discount on annual price'
        ]
      },
      {
        name: isArabic ? 'خطة VIP' : 'VIP Plan',
        price: '3,500',
        currency: isArabic ? 'ج.م' :'L.E',
        period: isArabic ? '/سنة' : '/year',
        color: 'purple',
        features: isArabic ? [
          'كل مميزات الخطة السنوية',
          'تدريب شخصي غير محدود',
          'خطة وجبات مخصصة',
          'دخول السبا والساونا',
          'تذاكر ضيوف (3 شهرياً)',
          'أحداث حصرية',
          'خصم 30% على السعر السنوي'
        ] : [
          'All annual plan features',
          'Unlimited personal training',
          'Custom meal plans',
          'Spa & sauna access',
          'Guest passes (3/month)',
          'Exclusive events',
          '30% discount on annual price'
        ]
      }
    ]
  };

  return (
    <div className="flex flex-col items-center gap-8 p-8">
      <div className="text-center mb-8">
        <h2 className={`text-4xl md:text-5xl font-bold text-white mb-4 ${isArabic ? 'font-cairo' : ''}`}>
          {content.title}
        </h2>
        <p className={`text-xl text-white/80 ${isArabic ? 'font-cairo' : ''}`}>
          {content.subtitle}
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
        {content.plans.map((plan, index) => (
          <CardSpotlight key={index} className="h-[500px] w-80">
            <div className="text-center">
              <h3 className={`text-2xl font-bold relative z-20 text-white mb-2 ${isArabic ? 'font-cairo' : ''}`}>
                {plan.name}
              </h3>
              <div className={`text-4xl font-bold text-${plan.color}-400 relative z-20 mb-2 ${isArabic ? 'font-cairo' : ''}`}>
                {plan.price} {plan.currency}
              </div>
              <div className={`text-lg text-white/70 relative z-20 mb-4 ${isArabic ? 'font-cairo' : ''}`}>
                {plan.period}
              </div>
            </div>
            
            <div className="text-neutral-200 mt-4 relative z-20">
              <ul className="list-none space-y-3">
                {plan.features.map((feature, featureIndex) => (
                  <Step key={featureIndex} title={feature} isArabic={isArabic} />
                ))}
              </ul>
            </div>
            
            <div className="mt-6 relative z-20">
              <button className={`w-full bg-${plan.color}-600 hover:bg-${plan.color}-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg ${isArabic ? 'font-cairo' : ''}`}>
                {isArabic ? 'اختر الخطة' : 'Choose Plan'}
              </button>
            </div>
          </CardSpotlight>
        ))}
      </div>
    </div>
  );
}

const Step = ({ title, isArabic }: { title: string; isArabic: boolean }) => {
  return (
    <li className="flex gap-3 items-start">
      <CheckIcon />
      <span className={`text-white text-sm ${isArabic ? 'font-cairo' : ''}`}>
        {title}
      </span>
    </li>
  );
};

const CheckIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-5 w-5 text-green-400 mt-0.5 shrink-0"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path
        d="M12 2c-.218 0 -.432 .002 -.642 .005l-.616 .017l-.299 .013l-.579 .034l-.553 .046c-4.785 .464 -6.732 2.411 -7.196 7.196l-.046 .553l-.034 .579c-.005 .098 -.01 .198 -.013 .299l-.017 .616l-.004 .318l-.001 .324c0 .218 .002 .432 .005 .642l.017 .616l.013 .299l.034 .579l.046 .553c.464 4.785 2.411 6.732 7.196 7.196l.553 .046l.579 .034c.098 .005 .198 .01 .299 .013l.616 .017l.642 .005l.642 -.005l.616 -.017l.299 -.013l.579 -.034l.553 -.046c4.785 -.464 6.732 -2.411 7.196 -7.196l.046 -.553l.034 -.579c.005 -.098 .01 -.198 .013 -.299l.017 -.616l.005 -.642l-.005 -.642l-.017 -.616l-.013 -.299l-.034 -.579l-.046 -.553c-.464 -4.785 -2.411 -6.732 -7.196 -7.196l-.553 -.046l-.579 -.034a28.058 28.058 0 0 0 -.299 -.013l-.616 -.017l-.318 -.004l-.324 -.001zm2.293 7.293a1 1 0 0 1 1.497 1.32l-.083 .094l-4 4a1 1 0 0 1 -1.32 .083l-.094 -.083l-2 -2a1 1 0 0 1 1.32 -1.497l.094 .083l1.293 1.292l3.293 -3.292z"
        fill="currentColor"
        strokeWidth="0"
      />
    </svg>
  );
};
