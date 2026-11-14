"use client";
import { useEffect, useRef, useState } from "react";
import SectionLabel from "@/components/SectionLabel";

function useInView(threshold = 0.2) {
    const ref = useRef<HTMLDivElement>(null);
    const [inView, setInView] = useState(false);
    useEffect(() => {
        const obs = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setInView(true); },
            { threshold }
        );
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, [threshold]);
    return { ref, inView };
}

// The two template photographs and the "25+ years / 375+ projects" counters
// that used to sit here are gone. Stats now come from lib/site.ts and show in
// the hero only, and this section carries no image until there is a real one.
export default function About() {
    const { ref, inView } = useInView(0.15);

    return (
        <section id="about" className="bg-[var(--app-bg)] py-24 overflow-hidden relative" ref={ref}>
            <div className="max-w-[1300px] mx-auto px-6 md:px-8 grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">

                {/* ── LEFT: label + heading ── */}
                <div className={`transition-all duration-1000 ${inView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-16"}`}>
                    <SectionLabel className="mb-5">About our company</SectionLabel>

                    <h2
                        className="font-heading font-bold text-[var(--text)] leading-[1.1] tracking-tight"
                        style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)" }}
                    >
                        We want to bring business and the digital world together
                    </h2>
                </div>

                {/* ── RIGHT: body + CTA ── */}
                <div className={`transition-all duration-1000 delay-150 ${inView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-16"}`}>
                    <p className="font-body text-[var(--text-soft)] leading-relaxed text-base md:text-[17px] mb-10 max-w-[540px]">
                        This is the main factor that sets us apart from our competition and allows us to
                        deliver a specialist business consultancy service. Through our years of experience,
                        we've also learned that while each channel has its own set of advantages, they all
                        work best when strategically paired with other channels.
                    </p>

                    <a
                        href="#services"
                        className="inline-flex items-center gap-3 bg-accent text-white border border-accent font-body font-semibold text-sm px-7 py-4 rounded-md hover:bg-[var(--text)] hover:border-[var(--text)] hover:text-[var(--app-bg)] transition-colors duration-300 group"
                    >
                        <span>Get Started Now</span>
                        <span className="group-hover:rotate-45 transition-transform duration-300">
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-inherit">
                                <path d="M2 2h10v10M2 12L12 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </span>
                    </a>
                </div>
            </div>
        </section>
    );
}
