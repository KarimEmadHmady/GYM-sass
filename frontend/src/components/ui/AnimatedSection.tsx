import React from 'react';
import BlurText from './Sec-home/BlurText';
import GlowingEffectDemo from './Sec-home/GlowingEffectDemo';
import CurvedLoop from './Sec-home/CurvedLoop';

const AnimatedSection: React.FC = () => (
  <section className="flex items-center justify-center bg-[#000] flex-col">
    <BlurText
      text="Isn't this so cool?!"
      delay={150}
      animateBy="words"
      direction="top"
      className="text-4xl font-bold my-10"
    />
    <GlowingEffectDemo />
    <CurvedLoop marqueeText="Welcome to React Bits ✦" />
  </section>
);

export default AnimatedSection;
