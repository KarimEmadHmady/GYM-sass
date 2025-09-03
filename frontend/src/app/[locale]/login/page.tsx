import React from 'react';

const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center ">
      <form className="bg-white/20 backdrop-blur-md shadow-xl rounded-2xl px-8 py-10 w-full max-w-sm flex flex-col gap-6 ">
        <h2 className="text-2xl font-bold text-center text-white-800 mb-2">Login</h2>
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-white-700 font-medium">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white/90 text-black"
            placeholder="Enter your email"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="text-white-700 font-medium">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white/90 text-black"
            placeholder="Enter your password"
          />
        </div>
        <button
          type="submit"
          className="mt-2 w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all duration-200 shadow-md"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
