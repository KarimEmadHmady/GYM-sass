import React from 'react';

const HeroSection: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center space-y-8">
      {/* العنوان الرئيسي */}
      <h1 className="text-6xl md:text-8xl font-bold text-white drop-shadow-2xl">
        <span className="bg-clip-text text-transparent bg-gradient-to-b from-white/90 to-white/30">
          GYM Pro
        </span>
      </h1>
      {/* الوصف */}
      <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto px-4 leading-relaxed">
        Discover the world of fitness with the best trainers and advanced training programs.
      </p>
      {/* أزرار الإجراءات */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12">
        <button className="px-8 py-4 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-full border border-white/30 hover:bg-white/30 transition-all duration-300 hover:scale-105">
          Get Started
        </button>
        <button className="px-8 py-4 bg-transparent text-white font-semibold rounded-full border border-white/50 hover:bg-white/10 transition-all duration-300 hover:scale-105">
          Learn More
        </button>
      </div>
    </div>
  </div>
);

export default HeroSection;
