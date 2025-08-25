import React from 'react';

const SocialSidebar: React.FC = () => (
  <div className="fixed left-4 top-1/3 z-50 flex flex-col gap-4 p-2">
    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-pink-500 transition-colors">
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect width="20" height="20" x="2" y="2" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.5" y2="6.5"/></svg>
    </a>
    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-blue-500 transition-colors">
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
    </a>
    <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="hover:text-fuchsia-500 transition-colors">
      <svg className="w-6 h-6" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><g><path d="M34.5 6c.3 2.7 2.2 8.1 8.1 8.7v6.2c-2.1.2-6.1-.1-9.7-2.2v13.7c0 7.2-5.1 12.5-12.5 12.5-7.1 0-12.4-5.6-12.4-12.4 0-6.7 5.2-12.3 12.4-12.3.5 0 1.1 0 1.6.1v6.4c-.5-.1-1-.2-1.6-.2-3.5 0-6.1 2.7-6.1 6 0 3.4 2.6 6.1 6.1 6.1 3.5 0 6.1-2.7 6.1-6.1V6h7.9z" fill="currentColor"/></g></svg>
    </a>
  </div>
);

export default SocialSidebar;
