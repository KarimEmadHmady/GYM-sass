import React from 'react';

const FooterSection: React.FC = () => (
  <footer className="w-full bg-gradient-to-br from-[#18191a] to-[#232526] text-white pt-10 pb-4 border-t border-[#232526] mt-10 backdrop-blur-md">
    <div className="max-w-4xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-0">
      {/* Left: Logo */}
      <div className="flex flex-col items-center md:items-start w-full md:w-1/2 gap-2">
        <span className="text-2xl font-extrabold tracking-widest mb-2 text-white/90">Coch Gym</span>
      </div>
      {/* Divider for large screens */}
      <div className="hidden md:block h-20 w-px bg-white/10 mx-8"></div>
      {/* Right: Working Hours */}
      <div className="flex flex-col items-center md:items-end w-full md:w-1/2 gap-2">
        <h3 className="font-bold text-lg mb-1 text-white/80">Working Hours</h3>
        <p className="text-white/70 text-sm mb-2 text-center md:text-right leading-relaxed">Saturday - Thursday: <span className="font-semibold">6:00 AM - 11:00 PM</span><br/>Friday: <span className="font-semibold">8:00 AM - 8:00 PM</span></p>
      </div>
    </div>
    <hr className="my-6 border-white/10" />
    <div className="text-center text-white/40 text-xs tracking-wide">
      &copy; {new Date().getFullYear()} Coch Gym. All rights reserved.
    </div>
  </footer>
);

export default FooterSection;
