import React from 'react';
import { MapPin, Mail, Phone, Clock, Users, Trophy } from 'lucide-react';

const ContactSection: React.FC = () => {
  // Detect language from URL or localStorage (you can integrate with your i18n system)
  const isArabic = typeof window !== 'undefined' && window.location.pathname.includes('/ar');
  
  const content = {
    title: isArabic ? 'تواصل معنا' : 'Contact Us',
    subtitle: isArabic ? 'لديك سؤال أو تريد الانضمام؟ املأ النموذج وسيتواصل معك فريقنا قريباً!' : 'Have a question or want to join? Fill out the form and our team will get back to you soon!',
    address: isArabic ? 'العنوان' : 'Address',
    addressText: isArabic ? '123 شارع اللياقة، الجيزة، مصر' : '123 Fitness St, Giza, Egypt',
    email: isArabic ? 'البريد الإلكتروني' : 'Email',
    phone: isArabic ? 'الهاتف' : 'Phone',
    workingHours: isArabic ? 'ساعات العمل' : 'Working Hours',
    workingHoursText: isArabic ? '24/7 - مفتوح على مدار الساعة' : '24/7 - Open 24 Hours',
    members: isArabic ? 'الأعضاء' : 'Members',
    membersText: isArabic ? 'أكثر من 500 عضو نشط' : 'Over 500 Active Members',
    achievements: isArabic ? 'الإنجازات' : 'Achievements',
    achievementsText: isArabic ? 'أفضل جيم في المنطقة 2024' : 'Best Gym in Area 2024',
    name: isArabic ? 'الاسم' : 'Name',
    namePlaceholder: isArabic ? 'اسمك' : 'Your Name',
    emailPlaceholder: isArabic ? 'بريدك الإلكتروني' : 'Your Email',
    message: isArabic ? 'الرسالة' : 'Message',
    messagePlaceholder: isArabic ? 'رسالتك...' : 'Your message...',
    sendButton: isArabic ? 'إرسال الرسالة' : 'Send Message'
  };

  return (
    <section className="text-gray-600 body-font relative py-20">
      <div className="container px-5 py-12 mx-auto flex sm:flex-nowrap flex-wrap">
        {/* Map and Contact Info */}
        <div className="lg:w-2/3 md:w-1/2 bg-gray-300 rounded-lg overflow-hidden sm:mr-10 p-10 flex items-end justify-start relative min-h-[350px]">
          <iframe
            width="100%"
            height="100%"
            className="absolute inset-0"
            frameBorder={0}
            title="map"
            marginHeight={0}
            marginWidth={0}
            scrolling="no"
            src="https://maps.google.com/maps?width=100%&height=600&hl=en&q=Giza+(Coach%20Gym)&ie=UTF8&t=&z=14&iwloc=B&output=embed"
            style={{ filter: "grayscale(1) contrast(1.2) opacity(0.4)" }}
          ></iframe>
          
          {/* Contact Info Cards */}
          <div className="bg-white relative flex flex-wrap py-6 rounded-lg shadow-xl z-10 w-full">
            <div className="w-full px-6 mb-4">
              <h2 className={`title-font font-bold text-gray-900 tracking-widest text-lg flex items-center gap-2 ${isArabic ? 'font-cairo' : ''}`}>
                <MapPin className="w-5 h-5 text-blue-600" />
                {content.address}
              </h2>
              <p className={`mt-1 text-gray-700 ${isArabic ? 'font-cairo' : ''}`}>{content.addressText}</p>
            </div>
            
            <div className="w-1/2 px-6">
              <h2 className={`title-font font-semibold text-gray-900 tracking-widest text-xs flex items-center gap-1 ${isArabic ? 'font-cairo' : ''}`}>
                <Mail className="w-4 h-4 text-green-600" />
                {content.email}
              </h2>
              <a href="mailto:info@coachgym.com" className="text-indigo-500 leading-relaxed hover:text-indigo-700 transition-colors">info@coachgym.com</a>
            </div>
            
            <div className="w-1/2 px-6 mt-4 lg:mt-0">
              <h2 className={`title-font font-semibold text-gray-900 tracking-widest text-xs flex items-center gap-1 ${isArabic ? 'font-cairo' : ''}`}>
                <Phone className="w-4 h-4 text-red-600" />
                {content.phone}
              </h2>
              <p className="leading-relaxed">+20 123 456 7890</p>
            </div>
            
            <div className="w-1/2 px-6 mt-4">
              <h2 className={`title-font font-semibold text-gray-900 tracking-widest text-xs flex items-center gap-1 ${isArabic ? 'font-cairo' : ''}`}>
                <Clock className="w-4 h-4 text-purple-600" />
                {content.workingHours}
              </h2>
              <p className={`leading-relaxed text-sm ${isArabic ? 'font-cairo' : ''}`}>{content.workingHoursText}</p>
            </div>
            
            <div className="w-1/2 px-6 mt-4">
              <h2 className={`title-font font-semibold text-gray-900 tracking-widest text-xs flex items-center gap-1 ${isArabic ? 'font-cairo' : ''}`}>
                <Users className="w-4 h-4 text-orange-600" />
                {content.members}
              </h2>
              <p className={`leading-relaxed text-sm ${isArabic ? 'font-cairo' : ''}`}>{content.membersText}</p>
            </div>
            
            <div className="w-full px-6 mt-4">
              <h2 className={`title-font font-semibold text-gray-900 tracking-widest text-xs flex items-center gap-1 ${isArabic ? 'font-cairo' : ''}`}>
                <Trophy className="w-4 h-4 text-yellow-600" />
                {content.achievements}
              </h2>
              <p className={`leading-relaxed text-sm ${isArabic ? 'font-cairo' : ''}`}>{content.achievementsText}</p>
            </div>
          </div>
        </div>
        
        {/* Contact Form */}
        <div className="lg:w-1/3 md:w-1/2 bg-white flex flex-col md:ml-auto w-full md:py-8 mt-8 md:mt-0 rounded-xl shadow-xl p-8 border border-gray-100">
          <h2 className={`text-gray-900 text-2xl mb-2 font-bold title-font text-center ${isArabic ? 'font-cairo' : ''}`}>
            {content.title}
          </h2>
          <p className={`leading-relaxed mb-5 text-gray-600 text-center ${isArabic ? 'font-cairo' : ''}`}>
            {content.subtitle}
          </p>
          
          <form className="w-full">
            <div className="relative mb-4">
              <label htmlFor="name" className={`leading-7 text-sm text-gray-600 font-semibold ${isArabic ? 'font-cairo' : ''}`}>
                {content.name}
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="w-full bg-white rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-base outline-none text-gray-700 py-3 px-4 leading-8 transition-all duration-200 ease-in-out"
                placeholder={content.namePlaceholder}
                required
              />
            </div>
            
            <div className="relative mb-4">
              <label htmlFor="email" className={`leading-7 text-sm text-gray-600 font-semibold ${isArabic ? 'font-cairo' : ''}`}>
                {content.email}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full bg-white rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-base outline-none text-gray-700 py-3 px-4 leading-8 transition-all duration-200 ease-in-out"
                placeholder={content.emailPlaceholder}
                required
              />
            </div>
            
            <div className="relative mb-6">
              <label htmlFor="message" className={`leading-7 text-sm text-gray-600 font-semibold ${isArabic ? 'font-cairo' : ''}`}>
                {content.message}
              </label>
              <textarea
                id="message"
                name="message"
                className="w-full bg-white rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 h-32 text-base outline-none text-gray-700 py-3 px-4 resize-none leading-6 transition-all duration-200 ease-in-out"
                placeholder={content.messagePlaceholder}
                required
              ></textarea>
            </div>
            
            <button 
              type="submit" 
              className="w-full text-white bg-gradient-to-br from-blue-600 to-purple-600 border-0 py-4 px-6 focus:outline-none rounded-xl text-lg font-bold transition-all duration-200 hover:from-blue-700 hover:to-purple-700 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
            >
              {content.sendButton}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
