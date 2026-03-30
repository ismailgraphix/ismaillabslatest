const services = [
  {
    num: "01",
    title: "Web Development",
    desc: "Custom, high-performance websites built with cutting-edge technologies that drive results and elevate your brand online.",
    img: "https://html.ravextheme.com/redox/light/assets/imgs/web-development/service-img-1.webp",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="2" y="4" width="24" height="18" rx="3" stroke="currentColor" strokeWidth="2"/>
        <path d="M2 10h24" stroke="currentColor" strokeWidth="2"/>
        <path d="M8 7h1M11 7h1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M9 16l3-3-3-3M13 16h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    num: "02",
    title: "Mobile Application",
    desc: "Native and cross-platform mobile apps that deliver seamless user experiences across iOS and Android devices.",
    img: "https://html.ravextheme.com/redox/light/assets/imgs/web-development/service-img-2.webp",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="8" y="2" width="12" height="24" rx="3" stroke="currentColor" strokeWidth="2"/>
        <path d="M12 20h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    num: "03",
    title: "Design & Branding",
    desc: "Distinctive visual identities and design systems that communicate your brand story with clarity and impact.",
    img: "https://html.ravextheme.com/redox/light/assets/imgs/web-development/service-img-3.webp",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="10" stroke="currentColor" strokeWidth="2"/>
        <path d="M14 4v20M4 14h20M7 7l14 14M21 7L7 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.4"/>
      </svg>
    ),
  },
  {
    num: "04",
    title: "App Development",
    desc: "Full-stack application development from ideation to deployment, built with scalability and performance in mind.",
    img: "https://html.ravextheme.com/redox/light/assets/imgs/web-development/service-img-4.webp",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M4 8l6 6-6 6M14 20h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
];

export default function Services() {
  return (
    <section id="services" className="py-28 bg-[#F7F5F0]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#4A6CF7]/10 rounded-full px-4 py-2 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4A6CF7]" />
              <span className="font-heading font-semibold text-sm text-[#4A6CF7] uppercase tracking-widest">Service We Offer</span>
            </div>
            <h2 className="font-heading font-black text-[clamp(2rem,4vw,3.5rem)] leading-tight text-[#0A0A0A]">
              We've amazing<br />web solutions
            </h2>
          </div>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 font-heading font-bold text-sm uppercase tracking-wider text-[#0A0A0A] border-b-2 border-[#4A6CF7] pb-1 hover:text-[#4A6CF7] transition-colors"
          >
            More Services →
          </a>
        </div>

        {/* Service list */}
        <div className="divide-y divide-gray-200">
          {services.map((s, i) => (
            <div
              key={s.num}
              className="group flex flex-col md:flex-row md:items-center gap-6 py-8 hover:bg-white rounded-2xl px-4 -mx-4 transition-all duration-300 cursor-pointer"
            >
              <span className="font-heading font-black text-5xl text-gray-100 group-hover:text-[#4A6CF7]/20 transition-colors w-16 flex-shrink-0">
                {s.num}
              </span>

              <div className="w-10 h-10 rounded-xl bg-[#0A0A0A] text-white flex items-center justify-center flex-shrink-0 group-hover:bg-[#4A6CF7] transition-colors">
                {s.icon}
              </div>

              <div className="flex-1">
                <h3 className="font-heading font-black text-2xl text-[#0A0A0A] mb-2 group-hover:text-[#4A6CF7] transition-colors">
                  {s.title}
                </h3>
                <p className="font-body text-gray-600 leading-relaxed max-w-xl">{s.desc}</p>
              </div>

              <div className="w-20 h-16 rounded-xl overflow-hidden flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100">
                <img src={s.img} alt={s.title} className="w-full h-full object-cover" />
              </div>

              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center group-hover:border-[#4A6CF7] group-hover:bg-[#4A6CF7] transition-all duration-300">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-gray-400 group-hover:text-white transition-colors">
                    <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
