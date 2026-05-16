"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function NotFound() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setTimeout(() => setMounted(true), 100); }, []);

  return (
    <div className="min-h-screen bg-[#070707] flex items-center justify-center px-6 overflow-hidden relative">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@700&family=Barlow:wght@300;400;600&display=swap');
        @keyframes fadeUp   { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
        @keyframes flicker  { 0%,100%{opacity:1} 41%{opacity:1} 42%{opacity:0.6} 43%{opacity:1} 74%{opacity:1} 75%{opacity:0.4} 76%{opacity:1} }
        @keyframes float    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes spin-slow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        .anim-1 { animation: fadeUp 0.8s cubic-bezier(.16,1,.3,1) 0.1s both; }
        .anim-2 { animation: fadeUp 0.8s cubic-bezier(.16,1,.3,1) 0.25s both; }
        .anim-3 { animation: fadeUp 0.8s cubic-bezier(.16,1,.3,1) 0.4s both; }
        .anim-4 { animation: fadeUp 0.8s cubic-bezier(.16,1,.3,1) 0.55s both; }
        .flicker { animation: flicker 4s infinite; }
        .float   { animation: float 4s ease-in-out infinite; }
        .spin-slow { animation: spin-slow 18s linear infinite; }
        .serif { font-family: 'Cormorant Garamond', serif; }
        .sans  { font-family: 'Barlow', sans-serif; }
      `}</style>

      {/* Background ring */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[600px] rounded-full border border-[#d4a373]/5 spin-slow" />
        <div className="absolute w-[400px] h-[400px] rounded-full border border-[#d4a373]/8" style={{ animation: "spin-slow 12s linear infinite reverse" }} />
      </div>

      {/* Orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-[#d4a373]/5 blur-[100px] pointer-events-none" />

      {/* Corner decorations */}
      <div className="absolute top-8 left-8 w-10 h-10 border-t border-l border-[#d4a373]/20" />
      <div className="absolute top-8 right-8 w-10 h-10 border-t border-r border-[#d4a373]/20" />
      <div className="absolute bottom-8 left-8 w-10 h-10 border-b border-l border-[#d4a373]/20" />
      <div className="absolute bottom-8 right-8 w-10 h-10 border-b border-r border-[#d4a373]/20" />

      <div className="relative z-10 text-center max-w-lg">

        {/* 404 */}
        <div className="float anim-1">
          <p
            className="serif flicker leading-none select-none"
            style={{
              fontSize: "clamp(100px, 20vw, 180px)",
              fontWeight: 700,
              WebkitTextStroke: "1px rgba(212,163,115,0.4)",
              color: "transparent",
              textShadow: "0 0 60px rgba(212,163,115,0.15)",
            }}
          >
            404
          </p>
        </div>

        {/* Gold line */}
        <div className="w-16 h-[1px] bg-[#d4a373]/50 mx-auto mb-6 anim-2" />

        {/* Heading */}
        <h1 className="serif text-white text-3xl md:text-4xl font-bold mb-3 anim-2">
          Page Not Found
        </h1>

        {/* Sub */}
        <p className="sans text-gray-500 text-sm font-light leading-relaxed mb-10 anim-3" style={{ letterSpacing: "0.05em" }}>
          The page you're looking for doesn't exist or has been moved.
          <br />Let's get you back on track.
        </p>

        {/* Buttons */}
        <div className="flex items-center justify-center gap-4 flex-wrap anim-4">
          <Link
            href="/"
            className="sans bg-[#d4a373] text-black text-xs font-semibold uppercase px-8 py-3.5 tracking-widest hover:bg-[#e8b989] transition duration-300 hover:shadow-[0_0_24px_rgba(212,163,115,0.3)]"
          >
            Back to Home
          </Link>
          <Link
            href="/category/all"
            className="sans text-gray-400 text-xs font-light uppercase px-8 py-3.5 tracking-widest border border-white/10 hover:border-[#d4a373]/40 hover:text-white transition duration-300"
          >
            Browse Logos
          </Link>
        </div>

        {/* Bottom hint */}
        <p className="sans text-gray-700 text-[10px] uppercase tracking-[0.3em] mt-12 anim-4">
          LogoVines · Graphic Design Studio
        </p>
      </div>
    </div>
  );
}
