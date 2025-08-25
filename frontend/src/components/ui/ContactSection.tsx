import React from 'react';

const ContactSection: React.FC = () => (
  <section className="text-gray-600 body-font relative py-20">
    <div className="container px-5 py-12 mx-auto flex sm:flex-nowrap flex-wrap">
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
          src="https://maps.google.com/maps?width=100%&height=600&hl=en&q=Giza+(Coch%20Gym)&ie=UTF8&t=&z=14&iwloc=B&output=embed"
          style={{ filter: "grayscale(1) contrast(1.2) opacity(0.4)" }}
        ></iframe>
        <div className="bg-white relative flex flex-wrap py-6 rounded shadow-md z-10 w-full">
          <div className="w-full px-6 mb-4">
            <h2 className="title-font font-bold text-gray-900 tracking-widest text-lg flex items-center gap-2">
              Address
            </h2>
            <p className="mt-1 text-gray-700">123 Fitness St, Giza, Egypt</p>
          </div>
          <div className="w-1/2 px-6">
            <h2 className="title-font font-semibold text-gray-900 tracking-widest text-xs flex items-center gap-1">
              Email
            </h2>
            <a href="mailto:info@cochgym.com" className="text-indigo-500 leading-relaxed">info@cochgym.com</a>
          </div>
          <div className="w-1/2 px-6 mt-4 lg:mt-0">
            <h2 className="title-font font-semibold text-gray-900 tracking-widest text-xs flex items-center gap-1">
              Phone
            </h2>
            <p className="leading-relaxed">+20 123 456 7890</p>
          </div>
        </div>
      </div>
      <div className="lg:w-1/3 md:w-1/2 bg-white flex flex-col md:ml-auto w-full md:py-8 mt-8 md:mt-0 rounded-xl shadow-lg p-8">
        <h2 className="text-gray-900 text-2xl mb-2 font-bold title-font text-center">Contact Us</h2>
        <p className="leading-relaxed mb-5 text-gray-600 text-center">Have a question or want to join? Fill out the form and our team will get back to you soon!</p>
        <form className="w-full">
          <div className="relative mb-4">
            <label htmlFor="name" className="leading-7 text-sm text-gray-600 font-semibold">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              className="w-full bg-white rounded border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 text-base outline-none text-gray-700 py-2 px-4 leading-8 transition-colors duration-200 ease-in-out"
              placeholder="Your Name"
              required
            />
          </div>
          <div className="relative mb-4">
            <label htmlFor="email" className="leading-7 text-sm text-gray-600 font-semibold">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full bg-white rounded border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 text-base outline-none text-gray-700 py-2 px-4 leading-8 transition-colors duration-200 ease-in-out"
              placeholder="you@email.com"
              required
            />
          </div>
          <div className="relative mb-4">
            <label htmlFor="message" className="leading-7 text-sm text-gray-600 font-semibold">Message</label>
            <textarea
              id="message"
              name="message"
              className="w-full bg-white rounded border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 h-32 text-base outline-none text-gray-700 py-2 px-4 resize-none leading-6 transition-colors duration-200 ease-in-out"
              placeholder="Your message..."
              required
            ></textarea>
          </div>
          <button type="submit" className="w-full text-white bg-gradient-to-br from-blue-500 to-purple-600 border-0 py-3 px-6 focus:outline-none  rounded text-lg font-bold transition-all duration-200">Send Message</button>
        </form>
      </div>
    </div>
  </section>
);

export default ContactSection;
