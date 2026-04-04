"use client";
import { useEffect, useRef, useState } from "react";

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
        ([e]) => { if (e.isIntersecting) setInView(true); },
        { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

const testimonials = [
  {
    name: "Daniel Joseph",
    role: "Content Writer",
    company: "CreativeCo",
    img: "https://html.ravextheme.com/redox/light/assets/imgs/web-development/testi-author-1.webp",
    quote: "Working with this team has been an absolute game-changer. Their attention to detail and creative approach completely transformed our digital presence.",
    rating: 5,
  },
  {
    name: "Victoria Madison",
    role: "Lead Developer",
    company: "TechFlow Inc.",
    img: "https://html.ravextheme.com/redox/light/assets/imgs/web-development/testi-author-2.webp",
    quote: "Delivered beyond our expectations. Their strategic thinking and technical expertise helped us hit our goals in record time. Would hire again without hesitation.",
    rating: 5,
  },
  {
    name: "Nicholas Thomas",
    role: "Marketing Director",
    company: "BrandLab",
    img: "https://html.ravextheme.com/redox/light/assets/imgs/web-development/testi-author-3.webp",
    quote: "Exceptional work, exceptional people. They bring creative vision and technical precision together in a way I've rarely seen. Highly recommended.",
    rating: 5,
  },
];

export default function Testimonials() {
  const { ref, inView } = useInView(0.1);
  const [active, setActive] = useState(0);

  // Auto-rotate
  useEffect(() => {
    const t = setInterval(() => setActive(p => (p + 1) % testimonials.length), 4500);
    return () => clearInterval(t);
  }, []);

  return (
      <section className="bg-[#EBEBEB] py-24 relative overflow-hidden" ref={ref}>

        {/* Big faint quote mark background */}
        <div
            className="absolute -top-10 left-1/2 -translate-x-1/2 font-heading font-black text-[22rem] text-[#4353FF]/[0.03] leading-none pointer-events-none select-none"
            aria-hidden
        >
          "
        </div>

        <div className="relative max-w-[1300px] mx-auto px-6 md:px-10">

          {/* Header */}
          <div className={`flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-6 h-[3px] bg-[#4353FF]" />
                <span className="font-body font-semibold text-[#4353FF] text-xs uppercase tracking-[0.2em]">Testimonials</span>
              </div>
              <h2
                  className="font-heading font-black text-[#0f0f0f] uppercase leading-tight tracking-tight"
                  style={{ fontSize: "clamp(1.8rem, 3vw, 2.6rem)" }}
              >
                WHAT CLIENTS SAY<br />ABOUT US
              </h2>
            </div>

            {/* Dot nav */}
            <div className="flex items-center gap-2">
              {testimonials.map((_, i) => (
                  <button
                      key={i}
                      onClick={() => setActive(i)}
                      className={`rounded-full transition-all duration-300 ${
                          active === i ? "w-8 h-3 bg-[#4353FF]" : "w-3 h-3 bg-gray-300 hover:bg-[#4353FF]/50"
                      }`}
                      aria-label={`Testimonial ${i + 1}`}
                  />
              ))}
            </div>
          </div>

          {/* Cards */}
          <div className="grid md:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
                <div
                    key={i}
                    onClick={() => setActive(i)}
                    className={`
                relative p-8 cursor-pointer overflow-hidden
                border-2 transition-all duration-500 group
                ${active === i
                        ? "bg-[#4353FF] border-[#4353FF] -translate-y-3 shadow-[0_20px_60px_rgba(67,83,255,0.3)]"
                        : "bg-white border-gray-100 hover:-translate-y-1 hover:border-[#4353FF]/30 hover:shadow-lg"
                    }
                ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}
              `}
                    style={{ transitionDelay: inView ? `${i * 120}ms` : "0ms",
                      transition: "opacity 0.7s ease, transform 0.5s ease, background 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease"
                    }}
                >
                  {/* Large quote */}
                  <div
                      className={`absolute -top-2 right-5 font-heading font-black text-[7rem] leading-none select-none pointer-events-none transition-colors duration-300 ${
                          active === i ? "text-white/10" : "text-gray-100"
                      }`}
                      aria-hidden
                  >
                    "
                  </div>

                  {/* Stars */}
                  <div className="flex gap-1 mb-5">
                    {Array(t.rating).fill(0).map((_, s) => (
                        <svg key={s} width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path
                              d="M7 1l1.6 3.5H12l-2.8 2.2 1.1 3.8L7 8.5 3.7 10.5l1.1-3.8L2 4.5h3.4L7 1z"
                              fill={active === i ? "rgba(255,255,255,0.9)" : "#4353FF"}
                          />
                        </svg>
                    ))}
                  </div>

                  {/* Quote text */}
                  <p className={`font-body leading-relaxed text-[15px] mb-8 relative z-10 transition-colors duration-300 ${
                      active === i ? "text-white/90" : "text-gray-500"
                  }`}>
                    "{t.quote}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-3 relative z-10">
                    <div className={`w-12 h-12 rounded-full overflow-hidden flex-shrink-0 ring-2 transition-all duration-300 ${
                        active === i ? "ring-white/40" : "ring-gray-100"
                    }`}>
                      <img src={t.img} alt={t.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className={`font-heading font-black text-[15px] transition-colors duration-300 ${
                          active === i ? "text-white" : "text-[#0f0f0f]"
                      }`}>{t.name}</p>
                      <p className={`font-body text-xs mt-0.5 transition-colors duration-300 ${
                          active === i ? "text-white/60" : "text-gray-400"
                      }`}>{t.role} · {t.company}</p>
                    </div>
                  </div>

                  {/* Bottom line for inactive cards */}
                  {active !== i && (
                      <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-[#4353FF] group-hover:w-full transition-all duration-500" />
                  )}
                </div>
            ))}
          </div>
        </div>
      </section>
  );
}