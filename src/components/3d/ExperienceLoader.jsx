import React, { useEffect, useState } from 'react';

export default function ExperienceLoader({ loaded = false }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (loaded) {
      setProgress(100);
      return;
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + Math.floor(Math.random() * 8) + 3;
      });
    }, 80);

    return () => clearInterval(interval);
  }, [loaded]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#05070c] transition-all duration-700 ease-in-out ${
        loaded ? 'opacity-0 pointer-events-none scale-105' : 'opacity-100'
      }`}
      aria-hidden="true"
    >
      {/* Glowing Ambient Backdrop Aura */}
      <div className="absolute w-[350px] h-[350px] bg-gradient-to-tr from-[#00f0ff]/20 to-[#7000ff]/20 rounded-full blur-[100px] animate-pulse" />

      {/* Cyber Orbit Ring */}
      <div className="relative flex items-center justify-center mb-8">
        <div className="w-28 h-28 border-2 border-transparent border-t-[#00f0ff] border-r-[#7000ff] rounded-full animate-spin" />
        <div className="absolute w-20 h-20 border-2 border-transparent border-b-[#00f0ff] border-l-[#7000ff] rounded-full animate-[spin_1.5s_linear_infinite_reverse]" />
        
        {/* Center Percentage Display */}
        <span className="absolute text-sm font-mono font-bold text-[#00f0ff]">
          {progress}%
        </span>
      </div>

      {/* Main Brand Wordmark */}
      <h1 className="text-3xl tracking-[0.35em] font-black text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] via-[#ffffff] to-[#7000ff] drop-shadow-[0_0_20px_rgba(0,240,255,0.6)]">
        DEVCORE
      </h1>

      {/* Status Caption */}
      <p className="mt-3 text-xs tracking-[0.25em] text-[#a0a5b5] uppercase font-mono">
        Assembling Your Digital Universe
      </p>

      {/* Bottom Progress Bar */}
      <div className="mt-6 w-48 h-[2px] bg-white/10 rounded-full overflow-hidden relative">
        <div
          className="h-full bg-gradient-to-r from-[#00f0ff] to-[#7000ff] transition-all duration-300 ease-out shadow-[0_0_10px_#00f0ff]"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}