export default function Hero() {
  return (
    <section id="home" className="relative w-full h-screen overflow-hidden bg-[#fafbfb]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,700;1,300&family=Barlow:wght@300;400;600&display=swap');
        .hero-heading { font-family: 'Cormorant Garamond', serif; font-weight: 800; line-height: 0.9; letter-spacing: -0.02em; }
      `}</style>

      <img
        src="/logo-wallpaper-dark.png"
        alt="Logo Background"
        className="absolute inset-0 w-full h-full object-cover opacity-30"
      />

      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
        <h1 className="hero-heading text-[#132930] mb-4" style={{ fontSize: "clamp(64px, 12vw, 140px)" }}>
          <span className="block" style={{ WebkitTextStroke: "1px rgba(26,68,80,0.4)", color: "transparent" }}>
            LOGO VINES
          </span>
        </h1>
      </div>
    </section>
  );
}



