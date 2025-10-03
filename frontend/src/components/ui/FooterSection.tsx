import React from 'react';

const FooterSection: React.FC = () => {
  // Detect language from URL or localStorage (you can integrate with your i18n system)
  const isArabic = typeof window !== 'undefined' && window.location.pathname.includes('/ar');
  
  const content = {
    gymName: isArabic ? 'كوتش جيم' : 'Coach Gym',
    gymDescription: isArabic 
      ? 'وجهتك الأولى لللياقة البدنية في مصر، نوفر أحدث المعدات العالمية ومدربين محترفين معتمدين لمساعدتك في تحقيق أهدافك الرياضية.'
      : 'Your premier fitness destination in Egypt, offering world-class equipment and certified professional trainers to help you achieve your fitness goals.',
    strength: isArabic ? '💪 قوة' : '🏋️‍♂️ Strength',
    muscle: isArabic ? '💪 عضلات' : '💪 Muscle',
    cardio: isArabic ? '🏃‍♀️ كارديو' : '🏃‍♀️ Cardio',
    
    contactUs: isArabic ? 'تواصل معنا' : 'Contact Us',
    address: isArabic ? '📍المنيرة، إمبابة، الجيزة شارع المطار' : '📍 123 Fitness Street, Giza, Egypt',
    phone: isArabic ? '📞 +20 11 130 814 09' : '📞 +20 11 130 814 09',
    email: isArabic ? '✉️ info@coachgym.com' : '✉️ info@coachgym.com',
    
    workingHours: isArabic ? 'ساعات العمل' : 'Working Hours',
    satThurs: isArabic ? 'يوميًا:' : 'Daily:',
    satThursTime: '10:00 AM - 4:00 AM',
    friday: '',
    fridayTime: '',
    
    ourServices: isArabic ? 'خدماتنا' : 'Our Services',
    personalTraining: isArabic ? '💪 تدريب شخصي' : '💪 Personal Training',
    groupClasses: isArabic ? '🏋️‍♀️ فصول جماعية' : '🏋️‍♀️ Group Classes',
    yogaPilates: isArabic ? '🧘‍♀️ يوغا وبيلاتس' : '🧘‍♀️ Yoga & Pilates',
    nutritionCounseling: isArabic ? '🥗 استشارة تغذية' : '🥗 Nutrition Counseling',
    bodyComposition: isArabic ? '📊 تحليل تكوين الجسم' : '📊 Body Composition Analysis',
    lockerRooms: isArabic ? '🚿 غرف تبديل الملابس' : '🚿 Locker Rooms',
    
    copyright: isArabic ? `© ${new Date().getFullYear()} كوتش جيم. جميع الحقوق محفوظة.` : `© ${new Date().getFullYear()} Coach Gym. All rights reserved.`
  };

  return (
    <footer className="bg-black text-white border-t border-[#232526] p-[10px] rounded-[30px] sm-rounded-[250px] sm:mx-10 mx-2 my-10 py-10">
      <div className="max-w-6xl mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          
          {/* Gym Info */}
          <div className="space-y-4">
            <h3 className={`text-xl font-bold text-white/90 border-b border-white/20 pb-2 ${isArabic ? 'font-cairo' : ''}`}>
              {content.gymName}
            </h3>
            <p className={`text-white/70 text-sm leading-relaxed ${isArabic ? 'font-cairo' : ''}`}>
              {content.gymDescription}
            </p>
            <div className="flex space-x-4">
              <span className={`text-white/60 text-xs ${isArabic ? 'font-cairo' : ''}`}>{content.strength}</span>
              <span className={`text-white/60 text-xs ${isArabic ? 'font-cairo' : ''}`}>{content.muscle}</span>
              <span className={`text-white/60 text-xs ${isArabic ? 'font-cairo' : ''}`}>{content.cardio}</span>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className={`text-xl font-bold text-white/90 border-b border-white/20 pb-2 ${isArabic ? 'font-cairo' : ''}`}>
              {content.contactUs}
            </h3>
            <div className="space-y-2 text-sm text-white/70">
              <p className={isArabic ? 'font-cairo' : ''}>{content.address}</p>
              <p className={isArabic ? 'font-cairo' : ''}>{content.phone}</p>
              <p className={isArabic ? 'font-cairo' : ''}>{content.email}</p>
            </div>
          </div>

          {/* Working Hours */}
          <div className="space-y-4">
            <h3 className={`text-xl font-bold text-white/90 border-b border-white/20 pb-2 ${isArabic ? 'font-cairo' : ''}`}>
              {content.workingHours}
            </h3>
            <div className="space-y-2 text-sm text-white/70">
              <div className="flex justify-between">
                <span className={isArabic ? 'font-cairo' : ''}>{content.satThurs}</span>
                <span className="font-semibold">{content.satThursTime}</span>
              </div>
              <div className={`pt-2 text-xs text-white/50 ${isArabic ? 'font-cairo' : ''}`}>
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className={`text-xl font-bold text-white/90 border-b border-white/20 pb-2 ${isArabic ? 'font-cairo' : ''}`}>
              {content.ourServices}
            </h3>
            <div className="space-y-2 text-sm text-white/70">
              <p className={isArabic ? 'font-cairo' : ''}>{content.personalTraining}</p>
              <p className={isArabic ? 'font-cairo' : ''}>{content.groupClasses}</p>
              <p className={isArabic ? 'font-cairo' : ''}>{content.yogaPilates}</p>
              <p className={isArabic ? 'font-cairo' : ''}>{content.nutritionCounseling}</p>
              <p className={isArabic ? 'font-cairo' : ''}>{content.bodyComposition}</p>
              <p className={isArabic ? 'font-cairo' : ''}>{content.lockerRooms}</p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <hr className="border-white/10 mb-6" />
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-white/50">
          <div className={`mb-4 md:mb-0 ${isArabic ? 'font-cairo' : ''}`}>
            {content.copyright}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
