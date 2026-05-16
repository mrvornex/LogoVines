"use client";

import { useEffect, useRef, useState } from "react";

const WORDS = ["Identity", "Legacy", "Vision", "Story", "Mark"];

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [wordIdx, setWordIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  // Cycling words
  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setWordIdx((i) => (i + 1) % WORDS.length);
        setVisible(true);
      }, 400);
    }, 2600);
    return () => clearInterval(interval);
  }, []);

  // Particle canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = (canvas.width = canvas.offsetWidth);
    let H = (canvas.height = canvas.offsetHeight);

    const particles = Array.from({ length: 55 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.5 + 0.3,
      alpha: Math.random() * 0.4 + 0.1,
    }));

    let animId: number;

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(212,163,115,${0.08 * (1 - dist / 130)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212,163,115,${p.alpha})`;
        ctx.fill();
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
      });

      animId = requestAnimationFrame(draw);
    };

    draw();

    const onResize = () => {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <section id="home" className="relative w-full h-screen overflow-hidden bg-[#070707]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,700;1,300&family=Barlow:wght@300;400;600&display=swap');
        .hero-heading { font-family: 'Cormorant Garamond', serif; font-weight: 700; line-height: 0.9; letter-spacing: -0.02em; }
        .hero-sub     { font-family: 'Barlow', sans-serif; font-weight: 300; letter-spacing: 0.35em; }
        .hero-btn     { font-family: 'Barlow', sans-serif; font-weight: 600; letter-spacing: 0.2em; }

        @keyframes fadeUp  { from { opacity:0; transform:translateY(32px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeIn  { from { opacity:0; } to { opacity:1; } }
        @keyframes wordIn  { from { opacity:0; transform:translateY(10px) skewY(2deg); } to { opacity:1; transform:translateY(0) skewY(0); } }
        @keyframes wordOut { from { opacity:1; transform:translateY(0); } to { opacity:0; transform:translateY(-10px); } }
        @keyframes scanline { 0% { transform:translateY(-100%); } 100% { transform:translateY(100vh); } }
        @keyframes shimmer  { 0%,100% { opacity:0.4; } 50% { opacity:1; } }

        .anim-1 { animation: fadeUp 0.9s cubic-bezier(.16,1,.3,1) 0.2s both; }
        .anim-2 { animation: fadeUp 0.9s cubic-bezier(.16,1,.3,1) 0.45s both; }
        .anim-3 { animation: fadeUp 0.9s cubic-bezier(.16,1,.3,1) 0.65s both; }
        .anim-4 { animation: fadeUp 0.9s cubic-bezier(.16,1,.3,1) 0.85s both; }
        .anim-5 { animation: fadeIn 1.2s ease 1.1s both; }

        .word-in  { animation: wordIn  0.4s cubic-bezier(.16,1,.3,1) both; }
        .word-out { animation: wordOut 0.35s ease both; }

        .scanline-el {
          animation: scanline 8s linear infinite;
          background: linear-gradient(to bottom, transparent, rgba(212,163,115,0.03), transparent);
          height: 120px; width: 100%;
          position: absolute; pointer-events: none; z-index: 2;
        }
        .shimmer { animation: shimmer 3s ease-in-out infinite; }
      `}</style>

      {/* BG */}
      <img src="/bg1.jpg" alt="" className="absolute inset-0 w-full h-full object-cover opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-br from-black via-[#0a0806] to-[#0d0a07]" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#070707] via-transparent to-[#070707]/80" />

      {/* Scanline */}
      <div className="scanline-el" />

      {/* Particles */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ mixBlendMode: "screen" }} />

      {/* Corner decorations */}
      <div className="absolute top-8 left-8 w-12 h-12 border-t border-l border-[#d4a373]/30 anim-5" />
      <div className="absolute top-8 right-8 w-12 h-12 border-t border-r border-[#d4a373]/30 anim-5" />
      <div className="absolute bottom-8 left-8 w-12 h-12 border-b border-l border-[#d4a373]/30 anim-5" />
      <div className="absolute bottom-8 right-8 w-12 h-12 border-b border-r border-[#d4a373]/30 anim-5" />

      {/* Side label */}
      <div className="absolute left-8 top-1/2 -translate-y-1/2 -rotate-90 origin-center hidden lg:flex items-center gap-3 anim-5">
        <span className="text-[#d4a373]/50 text-[10px] tracking-[0.4em] uppercase hero-sub shimmer">
          Graphic Design Studio
        </span>
      </div>

      {/* Scroll indicator */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-2 anim-5">
        <span className="text-[#d4a373]/40 text-[9px] tracking-[0.35em] uppercase hero-sub" style={{ writingMode: "vertical-rl" }}>Scroll</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-[#d4a373]/40 to-transparent" />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">

        {/* Eyebrow */}
        <div className="flex items-center gap-4 mb-8 anim-1">
          <div className="h-[1px] w-10 bg-[#d4a373]/50" />
          <span className="hero-sub text-[#d4a373]/80 text-[11px] tracking-[0.45em] uppercase">Est. 2019</span>
          <div className="h-[1px] w-10 bg-[#d4a373]/50" />
        </div>

        {/* Heading */}
        <h1 className="hero-heading text-white mb-4 anim-2" style={{ fontSize: "clamp(64px, 12vw, 140px)" }}>
          LOGO
          <span className="block" style={{ WebkitTextStroke: "1px rgba(212,163,115,0.6)", color: "transparent" }}>
            VINES
          </span>
        </h1>

        {/* Animated word */}
        <div className="flex items-center gap-3 mb-10 anim-3 h-10">
          <span className="text-gray-500 hero-sub text-sm tracking-[0.3em] uppercase">Your Brand</span>
          <span className="text-[#d4a373]/40">—</span>
          <span className={`text-[#d4a373] hero-sub text-sm tracking-[0.3em] uppercase inline-block ${visible ? "word-in" : "word-out"}`}>
            {WORDS[wordIdx]}
          </span>
        </div>

        {/* Divider */}
        <div className="w-[1px] h-10 bg-gradient-to-b from-[#d4a373]/40 to-transparent mb-10 anim-3" />

        {/* CTAs */}
        <div className="flex items-center gap-5 flex-wrap justify-center anim-4">
          <a href="#projects" className="hero-btn relative overflow-hidden group bg-[#d4a373] text-black text-[11px] px-9 py-4 uppercase tracking-[0.2em] transition-all duration-300 hover:shadow-[0_0_30px_rgba(212,163,115,0.35)]">
            <span className="relative z-10">View Portfolio</span>
            <span className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300" />
          </a>
          <a href="#contact" className="hero-btn text-white/80 text-[11px] px-9 py-4 uppercase tracking-[0.2em] border border-white/15 hover:border-[#d4a373]/50 hover:text-white transition-all duration-300">
            Start a Project
          </a>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-8 md:gap-14 mt-16 anim-5">
          {[{ n: "200+", l: "Logos" }, { n: "150+", l: "Clients" }, { n: "5+", l: "Years" }].map((s, i) => (
            <div key={i} className="text-center">
              <p className="text-white font-bold" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(24px, 4vw, 36px)", lineHeight: 1 }}>{s.n}</p>
              <p className="hero-sub text-[#d4a373]/60 text-[9px] tracking-[0.35em] uppercase mt-1.5">{s.l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#070707] to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#d4a373]/30 to-transparent" />
    </section>
  );
}