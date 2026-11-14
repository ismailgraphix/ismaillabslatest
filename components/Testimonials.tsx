"use client";
import { useEffect, useRef, useState } from "react";
import { site, type Testimonial } from "@/lib/site";
import SectionLabel from "@/components/SectionLabel";

// The section stays off the page until there are this many real quotes.
const MIN_QUOTES = 2;

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

// Quotes come from lib/site.ts. The sample quotes, star ratings and template
// portraits that used to be hardcoded here have been removed.
export default function Testimonials() {
  if (site.testimonials.length < MIN_QUOTES) return null;
  return <TestimonialCards testimonials={site.testimonials} />;
}

function TestimonialCards({ testimonials }: { testimonials: Testimonial[] }) {
  const { ref, inView } = useInView(0.1);
  const [active, setActive] = useState(0);

  // Auto-rotate
  useEffect(() => {
    const t = setInterval(() => setActive(p => (p + 1) % testimonials.length), 4500);
    return () => clearInterval(t);
  }, [testimonials.length]);

  return (
      <section className="bg-[var(--app-bg)] py-24 relative overflow-hidden" ref={ref}>

        {/* Big faint quote mark background */}
        <div
            className="absolute -top-10 left-1/2 -translate-x-1/2 font-heading font-bold text-[22rem] text-accent/[0.04] leading-none pointer-events-none select-none"
            aria-hidden
        >
          "
        </div>

        <div className="relative max-w-[1300px] mx-auto px-6 md:px-10">

          {/* Header */}
          <div className={`flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <div>
              <SectionLabel className="mb-3">Testimonials</SectionLabel>
              <h2
                  className="font-heading font-bold text-[var(--text)] leading-tight tracking-tight"
                  style={{ fontSize: "clamp(1.8rem, 3vw, 2.6rem)" }}
              >
                From clients
              </h2>
            </div>

            {/* Dot nav */}
            <div className="flex items-center gap-2">
              {testimonials.map((_, i) => (
                  <button
                      key={i}
                      onClick={() => setActive(i)}
                      className={`h-[4px] transition-all duration-300 ${
                          active === i ? "w-8 bg-accent" : "w-4 bg-[var(--border)] hover:bg-accent/50"
                      }`}
                      aria-label={`Testimonial ${i + 1}`}
                  />
              ))}
            </div>
          </div>

          {/* Cards */}
          <div className={`grid gap-5 ${testimonials.length === 2 ? "md:grid-cols-2" : "md:grid-cols-3"}`}>
            {testimonials.map((t, i) => (
                <div
                    key={i}
                    onClick={() => setActive(i)}
                    className={`
                relative p-8 rounded-lg cursor-pointer overflow-hidden
                border transition-all duration-500 group
                ${active === i
                        ? "bg-accent border-accent -translate-y-2"
                        : "bg-[var(--surface)] border-[var(--border)] hover:-translate-y-1 hover:border-accent/40"
                    }
                ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}
              `}
                    style={{ transitionDelay: inView ? `${i * 120}ms` : "0ms" }}
                >
                  {/* Large quote */}
                  <div
                      className={`absolute -top-2 right-5 font-heading font-bold text-[7rem] leading-none select-none pointer-events-none transition-colors duration-300 ${
                          active === i ? "text-white/10" : "text-[var(--chip-bg)]"
                      }`}
                      aria-hidden
                  >
                    "
                  </div>

                  {/* Quote text */}
                  <p className={`font-body leading-relaxed text-base mb-8 relative z-10 transition-colors duration-300 ${
                      active === i ? "text-white" : "text-[var(--muted)]"
                  }`}>
                    "{t.quote}"
                  </p>

                  {/* Author */}
                  <div className="relative z-10">
                    <p className={`font-heading font-bold text-[15px] transition-colors duration-300 ${
                        active === i ? "text-white" : "text-[var(--text)]"
                    }`}>{t.name}</p>
                    <p className={`font-body text-xs mt-0.5 transition-colors duration-300 ${
                        active === i ? "text-white/80" : "text-[var(--text-faint)]"
                    }`}>{t.role} · {t.organisation}</p>
                  </div>

                  {/* Bottom line for inactive cards */}
                  {active !== i && (
                      <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-accent group-hover:w-full transition-all duration-500" />
                  )}
                </div>
            ))}
          </div>
        </div>
      </section>
  );
}
