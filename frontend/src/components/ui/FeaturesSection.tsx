import React from 'react';

const FeaturesSection: React.FC = () => (
  <section className="flex flex-col items-center justify-center bg-[#18191a] py-20 w-full">
    <h2 className="text-4xl font-bold text-center text-white mb-12">Why Choose GYM Pro?</h2>
    <div className="grid md:grid-cols-3 gap-8 mb-16 max-w-5xl w-full px-4">
      <div className="bg-[#232526] rounded-xl p-8 text-center text-white shadow-lg">
        <h3 className="text-2xl font-semibold mb-4">Expert Trainers</h3>
        <p>Our certified trainers will help you achieve your goals with personalized plans and constant motivation.</p>
      </div>
      <div className="bg-[#232526] rounded-xl p-8 text-center text-white shadow-lg">
        <h3 className="text-2xl font-semibold mb-4">Modern Equipment</h3>
        <p>Train with the latest machines and tools in a clean, safe, and inspiring environment.</p>
      </div>
      <div className="bg-[#232526] rounded-xl p-8 text-center text-white shadow-lg">
        <h3 className="text-2xl font-semibold mb-4">Community & Support</h3>
        <p>Be part of a supportive community that encourages you every step of the way.</p>
      </div>
    </div>
    {/* Trainers */}
    <h2 className="text-3xl font-bold text-center text-white mt-20 mb-10">Meet Our Trainers</h2>
    <div className="grid md:grid-cols-3 gap-8 mb-16 max-w-5xl w-full px-4">
      <div className="bg-[#232526] rounded-xl p-8 text-center text-white shadow-lg">
        <h3 className="text-xl font-semibold mb-2">Coach Ahmed</h3>
        <p>Strength & Conditioning Specialist</p>
      </div>
      <div className="bg-[#232526] rounded-xl p-8 text-center text-white shadow-lg">
        <h3 className="text-xl font-semibold mb-2">Coach Sara</h3>
        <p>Certified Nutritionist & Personal Trainer</p>
      </div>
      <div className="bg-[#232526] rounded-xl p-8 text-center text-white shadow-lg">
        <h3 className="text-xl font-semibold mb-2">Coach Omar</h3>
        <p>Functional Training & Mobility Expert</p>
      </div>
    </div>
    {/* FAQ */}
    <h2 className="text-3xl font-bold text-center text-white mt-20 mb-10">Frequently Asked Questions</h2>
    <div className="space-y-6 max-w-3xl w-full px-4">
      <div className="bg-[#232526] rounded-lg p-6 text-white">
        <h4 className="font-semibold mb-2">What are your opening hours?</h4>
        <p>We are open daily from 6:00 AM to 11:00 PM.</p>
      </div>
      <div className="bg-[#232526] rounded-lg p-6 text-white">
        <h4 className="font-semibold mb-2">Do you offer personal training?</h4>
        <p>Yes, we offer personal training sessions tailored to your needs and goals.</p>
      </div>
      <div className="bg-[#232526] rounded-lg p-6 text-white">
        <h4 className="font-semibold mb-2">How can I join GYM Pro?</h4>
        <p>You can join by visiting us or signing up online through our website.</p>
      </div>
    </div>
  </section>
);

export default FeaturesSection;
