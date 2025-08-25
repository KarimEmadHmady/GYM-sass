"use client";
import React from "react";
import { SparklesCore } from "./sparkles";

export function SparklesPreview() {
  return (
    <div className="h-[40rem] w-full bg-black flex flex-col items-center justify-center overflow-hidden rounded-md">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 text-center relative z-20">
        <div className="text-center">
          <div className="md:text-7xl text-3xl lg:text-9xl font-bold text-yellow-400 mb-2">250+</div>
          <div className="text-white/70 text-sm md:text-lg">Active Members</div>
        </div>
        <div className="text-center">
          <div className="md:text-7xl text-3xl lg:text-9xl font-bold text-green-400 mb-2">4+</div>
          <div className="text-white/70 text-sm md:text-lg">Expert Trainers</div>
        </div>
        <div className="text-center">
          <div className="md:text-7xl text-3xl lg:text-9xl font-bold text-blue-400 mb-2">24/7</div>
          <div className="text-white/70 text-sm md:text-lg">Support Available</div>
        </div>
      </div>
      <div className="w-[40rem] h-40 relative">
        {/* Gradients */}
        <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-3/4 blur-sm" />
        <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-3/4" />
        <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[5px] w-1/4 blur-sm" />
        <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-1/4" />

        {/* Core component */}
        <SparklesCore
          background="transparent"
          minSize={0.4}
          maxSize={1}
          particleDensity={1200}
          className="w-full h-full"
          particleColor="#FFFFFF"
        />

        {/* Radial Gradient to prevent sharp edges */}
        <div className="absolute inset-0 w-full h-full bg-black [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,white)]"></div>
      </div>
    </div>
  );
}
