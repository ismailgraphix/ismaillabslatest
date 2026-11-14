"use client";
import { useEffect, useRef, useState } from "react";

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
            {/* Ghost arc — consistent with Hero's geometry language */}
            <div className="absolute -left-20 bottom-10 w-56 h-56 rounded-full border border-[#0f0f0f]/[0.055] pointer-events-none" />

            <div className="max-w-[1300px] mx-auto px-8 grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">

                {/* ── LEFT: label + heading ── */}
                <div className={`transition-all duration-1000 ${inView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-16"}`}>

                    {/* Label */}
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-8 h-[3px] bg-[#4353FF]" />
                        <span className="font-body font-semibold text-[#4353FF] text-xs uppercase tracking-[0.2em]">About Our Company</span>
                    </div>

                    {/* Heading */}
                    <h2
                        className="font-heading font-black text-[var(--text)] uppercase leading-[1.0] tracking-tight"
                        style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)" }}
                    >
                        WE WANT TO BRING BUSINESS<br />
                        AND THE DIGITAL WORLD<br />
                        TOGETHER
                    </h2>
                </div>

                {/* ── RIGHT: body + CTA ── */}
                <div className={`transition-all duration-1000 delay-150 ${inView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-16"}`}>

                    {/* Body — theme-safe muted text */}
                    <p className="font-body text-[var(--text-soft)] leading-relaxed text-[15px] mb-10 max-w-[500px]">
                        This is the main factor that sets us apart from our competition and allows us to
                        deliver a specialist business consultancy service. Through our years of experience,
                        we've also learned that while each channel has its own set of advantages, they all
                        work best when strategically paired with other channels.
                    </p>

                    {/* CTA — pill shape, theme-safe hover, valid Tailwind duration */}
                    <a
                        href="#services"
                        className="inline-flex items-center gap-3 bg-[#4353FF] text-white font-body font-semibold px-7 py-4 rounded-full hover:bg-[var(--text)] hover:text-[var(--surface)] transition-all duration-[400ms] group"
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
