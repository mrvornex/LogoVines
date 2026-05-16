export default function About() {
  const skills = [
    { label: "Logo Design",       pct: 98 },
    { label: "Brand Identity",    pct: 92 },
    { label: "Typography",        pct: 90 },
    { label: "Visual Strategy",   pct: 85 },
  ];

  return (
    <section id="about" className="bg-[#0a0a0a] py-24 px-6 md:px-16 border-t border-white/5">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* LEFT — Image side */}
        <div className="relative">

          {/* Main image frame */}
          <div className="relative w-full max-w-md mx-auto lg:mx-0">

            {/* Gold border frame */}
            <div className="absolute -top-4 -left-4 w-full h-full border border-[#d4a373]/30 rounded-2xl" />

            {/* Image placeholder / replace with your photo */}
            <div className="relative rounded-2xl overflow-hidden bg-[#111] border border-white/10 aspect-[4/5]">
              <div className="w-full h-full flex items-center justify-center text-gray-700">
                 <img src="/bg.png" alt="Designer" className="w-full h-full object-cover" />
                {/* <div className="text-center">
                  <p className="text-6xl mb-4">🎨</p>
                  <p className="text-sm uppercase tracking-widest">Your Photo Here</p>
                </div> */}
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-5 -right-5 bg-[#d4a373] text-black px-5 py-3 rounded-xl shadow-xl">
              <p className="text-2xl font-extrabold leading-none">5+</p>
              <p className="text-[10px] uppercase tracking-widest font-semibold mt-0.5">Years Exp.</p>
            </div>
          </div>
        </div>

        {/* RIGHT — Content */}
        <div>
          <p className="text-[#d4a373] text-xs uppercase tracking-[0.3em] mb-4">About Me</p>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white uppercase tracking-wide leading-tight mb-6">
            Crafting Brands <br />
            <span className="text-[#d4a373]">With Purpose</span>
          </h2>

          <div className="space-y-4 text-gray-400 text-sm leading-relaxed mb-10">
            <p>
              I'm a passionate graphic designer specializing in logo design and brand identity.
              Every brand has a unique story — my job is to tell that story visually, in a way
              that resonates with your audience and stands the test of time.
            </p>
            <p>
              From minimalist wordmarks to bold illustrative logos, I craft identities that
              are not just beautiful — but strategic, memorable, and built to grow with your business.
            </p>
          </div>

          {/* Skills */}
          <div className="space-y-4">
            {skills.map((skill) => (
              <div key={skill.label}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-gray-300 uppercase tracking-widest">{skill.label}</span>
                  <span className="text-[#d4a373]">{skill.pct}%</span>
                </div>
                <div className="h-[3px] bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#d4a373] to-[#e8c99a] rounded-full"
                    style={{ width: `${skill.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4 mt-10 pt-8 border-t border-white/5">
            {[
              { n: "200+", l: "Logos" },
              { n: "150+", l: "Clients" },
              { n: "98%",  l: "Satisfaction" },
            ].map((s) => (
              <div key={s.l} className="text-center">
                <p className="text-2xl font-extrabold text-[#d4a373]">{s.n}</p>
                <p className="text-gray-500 text-xs uppercase tracking-widest mt-1">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}