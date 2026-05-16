const steps = [
  {
    number: "01",
    icon: "💬",
    title: "Discovery",
    desc:
      "We start with a detailed conversation about your brand — your vision, target audience, competitors, and goals. The more we understand, the better we design.",
  },
  {
    number: "02",
    icon: "✏️",
    title: "Concept",
    desc:
      "Based on your brief, we sketch multiple concepts exploring different directions — from minimalist to bold. You'll see the thinking behind every idea.",
  },
  {
    number: "03",
    icon: "🎨",
    title: "Design",
    desc:
      "The best concept is refined into a polished, professional logo — with perfect typography, colors, and proportions. Every pixel is intentional.",
  },
  {
    number: "04",
    icon: "🔁",
    title: "Revisions",
    desc:
      "Your feedback matters. We refine the design until it's exactly right. No rush — we iterate until you're completely satisfied.",
  },
  {
    number: "05",
    icon: "📦",
    title: "Delivery",
    desc:
      "Final files delivered in all formats — PNG, SVG, PDF, AI. Ready for print, web, social media, and everything in between.",
  },
];

export default function Process() {
  return (
    <section id="process" className="bg-[#080808] py-24 px-6 md:px-16 border-t border-white/5">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-[#d4a373] text-xs uppercase tracking-[0.3em] mb-4">How It Works</p>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white uppercase tracking-wide">
            My Process
          </h2>
          <div className="mt-4 w-16 h-[2px] bg-[#d4a373] mx-auto" />
          <p className="text-gray-500 text-sm mt-6 max-w-xl mx-auto leading-relaxed">
            A clear, collaborative process from first conversation to final delivery —
            so you always know what's happening and what's next.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">

          {/* Vertical line — desktop */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-[#d4a373]/20 to-transparent -translate-x-1/2" />

          <div className="space-y-8 lg:space-y-0">
            {steps.map((step, i) => {
              const isEven = i % 2 === 0;
              return (
                <div
                  key={step.number}
                  className={`lg:grid lg:grid-cols-2 lg:gap-16 items-center ${
                    isEven ? "" : "lg:direction-rtl"
                  }`}
                >
                  {/* Content */}
                  <div
                    className={`relative bg-[#111] border border-white/5 rounded-2xl p-7 hover:border-[#d4a373]/20 transition duration-300 group
                      ${isEven ? "lg:col-start-1" : "lg:col-start-2 lg:row-start-1"}`}
                  >
                    {/* Step number */}
                    <span className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-[#d4a373] text-black text-xs font-extrabold flex items-center justify-center shadow-lg">
                      {i + 1}
                    </span>

                    <div className="flex items-start gap-4">
                      <span className="text-3xl flex-shrink-0">{step.icon}</span>
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-[#d4a373]/40 text-xs font-mono">{step.number}</span>
                          <h3 className="text-white font-bold text-lg uppercase tracking-wide">
                            {step.title}
                          </h3>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
                      </div>
                    </div>
                  </div>

                  {/* Center dot — desktop */}
                  <div
                    className={`hidden lg:flex items-center justify-center
                      ${isEven ? "lg:col-start-2 lg:row-start-1" : "lg:col-start-1 lg:row-start-1"}`}
                  >
                    <div className="w-4 h-4 rounded-full bg-[#d4a373] shadow-[0_0_16px_rgba(212,163,115,0.5)]" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <p className="text-gray-500 text-sm mb-5">Ready to start your project?</p>
          <a
            href="#contact"
            className="inline-block bg-[#d4a373] text-black px-10 py-4 uppercase tracking-widest text-sm font-bold hover:bg-[#e8b989] transition duration-300"
          >
            Start a Project
          </a>
        </div>
      </div>
    </section>
  );
}