const steps = [
  {
    num: "01",
    title: "Project Research",
    desc: "We dive deep into your business goals, target audience, and competitive landscape to craft the perfect strategy.",
  },
  {
    num: "02",
    title: "Start Working",
    desc: "Our expert team kicks off with a structured plan, keeping you informed at every milestone of the process.",
  },
  {
    num: "03",
    title: "Quality Products",
    desc: "Every deliverable goes through rigorous QA testing to ensure pixel-perfect, bug-free, high-performance output.",
  },
  {
    num: "04",
    title: "Quality Finished",
    desc: "We launch your project with ongoing support, analytics, and optimization to ensure long-term success.",
  },
];

export default function Process() {
  return (
    <section className="py-28 bg-[#0A0A0A] overflow-hidden relative">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle, #4A6CF7 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-[#4A6CF7]/20 rounded-full px-4 py-2 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4A6CF7]" />
            <span className="font-heading font-semibold text-sm text-[#4A6CF7] uppercase tracking-widest">Our Work Process</span>
          </div>
          <h2 className="font-heading font-black text-[clamp(2rem,4vw,3.5rem)] leading-tight text-white">
            Follow 4 Easy Work Steps
          </h2>
        </div>

        {/* Steps grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <div key={step.num} className="relative group">
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-[calc(100%-1rem)] w-8 h-0.5 bg-[#4A6CF7]/30 z-10" />
              )}

              <div className="bg-white/5 rounded-2xl p-7 border border-white/10 hover:border-[#4A6CF7]/40 hover:bg-white/8 transition-all duration-300 h-full">
                <div className="flex items-center gap-3 mb-5">
                  <span className="font-heading font-black text-5xl text-[#4A6CF7]/30 group-hover:text-[#4A6CF7]/60 transition-colors">
                    {step.num}
                  </span>
                </div>

                <div className="w-10 h-10 rounded-xl bg-[#4A6CF7] flex items-center justify-center mb-5">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M3 9l4 4 8-8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>

                <h3 className="font-heading font-black text-xl text-white mb-3">{step.title}</h3>
                <p className="font-body text-gray-400 leading-relaxed text-sm">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 pt-16 border-t border-white/10">
          {[
            { num: "10", label: "Years of Experience" },
            { num: "50", label: "Skilled Professionals" },
            { num: "30", label: "Visited Conferences" },
            { num: "200k", label: "Hours of Work Done" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-heading font-black text-5xl text-white">
                {s.num}<span className="text-[#4A6CF7]">+</span>
              </p>
              <p className="font-body text-gray-400 text-sm mt-2">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
