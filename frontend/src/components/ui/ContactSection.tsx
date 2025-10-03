import React from 'react';
import { MapPin, Mail, Phone, Clock, Users, Trophy } from 'lucide-react';

const ContactSection: React.FC = () => {
  // Detect language from URL or localStorage (you can integrate with your i18n system)
  const isArabic = typeof window !== 'undefined' && window.location.pathname.includes('/ar');
  
  const content = {
    title: isArabic ? 'تواصل معنا' : 'Contact Us',
    subtitle: isArabic ? 'لديك سؤال أو تريد الانضمام؟ املأ النموذج وسيتواصل معك فريقنا قريباً!' : 'Have a question or want to join? Fill out the form and our team will get back to you soon!',
    address: isArabic ? 'العنوان' : 'Address',
    addressText: isArabic ? 'المنيرة، إمبابة، الجيزة شارع المطار' : 'Al Munirah, Imbaba, Giza',
    email: isArabic ? 'البريد الإلكتروني' : 'Email',
    phone: isArabic ? 'الهاتف' : 'Phone',
    workingHours: isArabic ? 'ساعات العمل' : 'Working Hours',
    workingHoursText: isArabic ? '24/7 - مفتوح على مدار الساعة' : '24/7 - Open 24 Hours',
    members: isArabic ? 'الأعضاء' : 'Members',
    membersText: isArabic ? 'أكثر من 500 عضو نشط' : 'Over 500 Active Members',
    achievements: isArabic ? 'الإنجازات' : 'Achievements',
    name: isArabic ? 'الاسم' : 'Name',
    namePlaceholder: isArabic ? 'اسمك' : 'Your Name',
    emailPlaceholder: isArabic ? 'بريدك الإلكتروني' : 'Your Email',
    message: isArabic ? 'الرسالة' : 'Message',
    messagePlaceholder: isArabic ? 'رسالتك...' : 'Your message...',
    sendButton: isArabic ? 'إرسال الرسالة' : 'Send Message'
  };

  return (
    <section className="text-gray-600 body-font relative py-20">
      <div className="container px-5 py-12 mx-auto flex flex-col sm:flex-row gap-6">
        {/* Map - Full Width on Mobile, Half on Desktop */}
        <div className="w-full sm:w-1/2 bg-gray-300 rounded-lg overflow-hidden relative min-h-[350px]">
          <iframe
            width="100%"
            height="100%"
            className="absolute inset-0"
            frameBorder={0}
            title="map"
            marginHeight={0}
            marginWidth={0}
            scrolling="no"
            src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d215.78964830578627!2d31.206276516918454!3d30.0760132482514!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2seg!4v1759515569104!5m2!1sen!2seg"
            style={{ filter: "grayscale(1) contrast(1.2) opacity(0.9)" }}
          ></iframe>
          

        </div>
        
        {/* Contact Info Card - Full Width on Mobile, Half on Desktop */}
        <div className="w-full sm:w-1/2 bg-white py-6 px-4 sm:px-6 rounded-lg shadow-xl">
          {/* Address - Full Width */}
          <div className="mb-6">
            <h2 className={`title-font font-bold text-gray-900 tracking-widest text-lg flex items-center gap-2 mb-2 ${isArabic ? 'font-cairo' : ''}`}>
              <MapPin className="w-5 h-5 text-blue-600" />
              {content.address}
            </h2>
            <p className={`text-gray-700 ${isArabic ? 'font-cairo' : ''}`}>{content.addressText}</p>
          </div>
          
          {/* Contact Details Grid - Responsive */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Email */}
            <div className="flex flex-col">
              <h2 className={`title-font font-semibold text-gray-900 tracking-widest text-xs flex items-center gap-1 mb-1 ${isArabic ? 'font-cairo' : ''}`}>
                <Mail className="w-4 h-4 text-green-600" />
                {content.email}
              </h2>
              <a href="mailto:info@coachgym.com" className="text-indigo-500 leading-relaxed hover:text-indigo-700 transition-colors text-sm">info@coachgym.com</a>
            </div>
            
            {/* Phone */}
            <div className="flex flex-col">
              <h2 className={`title-font font-semibold text-gray-900 tracking-widest text-xs flex items-center gap-1 mb-1 ${isArabic ? 'font-cairo' : ''}`}>
                <Phone className="w-4 h-4 text-red-600" />
                {content.phone}
              </h2>
              <p className="leading-relaxed text-sm">+20 11 13081409</p>
            </div>
            
            {/* Working Hours */}
            <div className="flex flex-col">
              <h2 className={`title-font font-semibold text-gray-900 tracking-widest text-xs flex items-center gap-1 mb-1 ${isArabic ? 'font-cairo' : ''}`}>
                <Clock className="w-4 h-4 text-purple-600" />
                {content.workingHours}
              </h2>
              <p className={`leading-relaxed text-sm ${isArabic ? 'font-cairo' : ''}`}>{content.workingHoursText}</p>
            </div>
            
            {/* Members */}
            <div className="flex flex-col">
              <h2 className={`title-font font-semibold text-gray-900 tracking-widest text-xs flex items-center gap-1 mb-1 ${isArabic ? 'font-cairo' : ''}`}>
                <Users className="w-4 h-4 text-orange-600" />
                {content.members}
              </h2>
              <p className={`leading-relaxed text-sm ${isArabic ? 'font-cairo' : ''}`}>{content.membersText}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
