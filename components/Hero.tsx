export default function Hero() {
  return (
    <section
      id="home"
      className="relative w-full h-screen overflow-hidden bg-[#fafbfb]"
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,700;1,300&family=Barlow:wght@300;400;600&display=swap');

        .hero-heading {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 800;
          line-height: 0.9;
          letter-spacing: -0.02em;
        }

        .hero-sub {
          font-family: 'Barlow', sans-serif;
          font-weight: 300;
          letter-spacing: 0.25em;
          text-transform: uppercase;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0);    }
        }

        .anim-1 { animation: fadeUp 0.8s ease forwards; opacity: 0; }
        .anim-2 { animation: fadeUp 0.8s ease 0.2s forwards; opacity: 0; }
        .anim-3 { animation: fadeUp 0.8s ease 0.4s forwards; opacity: 0; }
        .anim-4 { animation: fadeUp 0.8s ease 0.6s forwards; opacity: 0; }

        .cta-btn {
          font-family: 'Barlow', sans-serif;
          font-weight: 600;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          font-size: 13px;
          padding: 14px 36px;
          border: 1.5px solid #1A4450;
          color: #1A4450;
          background: transparent;
          border-radius: 2px;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-block;
        }

        .cta-btn:hover {
          background: #1A4450;
          color: #fafbfb;
        }

        .divider-line {
          width: 40px;
          height: 1px;
          background: #1A4450;
          opacity: 0.4;
          margin: 0 auto;
        }
      `}</style>

      {/* Background image */}
      <img
        src="/logo-wallpaper-dark.png"
        alt="Logo Background"
        className="absolute inset-0 w-full h-full object-cover opacity-20"
      />

      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#fafbfb]/20 via-transparent to-[#fafbfb]/60" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6 gap-6">

        {/* Top label */}
        <p className="hero-sub text-[#1A4450] text-xs opacity-60 anim-1">
          Premium Logo Design
        </p>

        {/* Divider */}
        <div className="divider-line anim-1" />

        {/* Main heading */}
        <h1
          className="hero-heading text-[#132930] anim-2"
          style={{ fontSize: "clamp(64px, 11vw, 130px)" }}
        >
          <span
            style={{
              WebkitTextStroke: "1.5px rgba(26,68,80,0.5)",
              color: "transparent",
            }}
          >
            LOGO VINES
          </span>
        </h1>

        {/* Subtitle */}
        <p
          className="hero-sub text-[#1A4450] opacity-50 anim-3 max-w-md"
          style={{ fontSize: "13px", letterSpacing: "0.2em" }}
        >
          Where brands find their identity
        </p>

        {/* CTA Button */}
        <div className="anim-4 mt-2">
          <a href="#portfolio" className="cta-btn">
            Explore Work
          </a>
        </div>
      </div>

      {/* Bottom scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 anim-4">
        <span className="hero-sub text-[#1A4450] opacity-30" style={{ fontSize: "10px", letterSpacing: "0.3em" }}>
          SCROLL
        </span>
        <div style={{
          width: "1px",
          height: "40px",
          background: "linear-gradient(to bottom, rgba(26,68,80,0.4), transparent)"
        }} />
      </div>
    </section>
  );
}



