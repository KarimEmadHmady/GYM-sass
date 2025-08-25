import React from 'react';

const AnnouncementBar: React.FC = () => (
  <div className="fixed top-0 left-0 w-full z-50 text-white flex items-center justify-center py-2 px-4 shadow-md bg-white/30 backdrop-blur-md">
    <span className="flex items-center gap-2 text-sm font-medium">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 animate-bounce">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
      </svg>
      Hurry up! <span className="font-semibold">25% OFF</span> on 6-month membership - Limited Time Only
    </span>
  </div>
);

export default AnnouncementBar;
