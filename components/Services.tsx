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

const services = [
    {
        num: "01",
        title: "Web Development",
        img: "https://html.ravextheme.com/redox/light/assets/imgs/web-development/service-img-1.webp",
        icon: (
            <svg viewBox="0 0 56 56" fill="none" className="w-12 h-12">
                <rect x="6" y="10" width="44" height="32" rx="3" stroke="#4353FF" strokeWidth="1.8" fill="none"/>
                <path d="M6 18h44" stroke="#4353FF" strokeWidth="1.8"/>
                <path d="M10 14h1M14 14h1M18 14h1" stroke="#4353FF" strokeWidth="2" strokeLinecap="round"/>
                <path d="M18 28l-5 4 5 4M38 28l5 4-5 4" stroke="#4353FF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M32 26l-8 12" stroke="#4353FF" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
        ),
    },
    {
        num: "02",
        title: "Mobile Application",
        img: "https://html.ravextheme.com/redox/light/assets/imgs/web-development/service-img-2.webp",
        icon: (
            <svg viewBox="0 0 56 56" fill="none" className="w-12 h-12">
                <rect x="16" y="6" width="24" height="44" rx="4" stroke="#4353FF" strokeWidth="1.8" fill="none"/>
                <path d="M16 14h24M16 42h24" stroke="#4353FF" strokeWidth="1.8"/>
                <circle cx="28" cy="47" r="2" stroke="#4353FF" strokeWidth="1.5" fill="none"/>
                <rect x="22" y="10" width="12" height="2" rx="1" fill="#4353FF" opacity="0.4"/>
                <path d="M22 24l4 4-4 4M34 24l-4 4 4 4" stroke="#4353FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        ),
    },
    {
        num: "03",
        title: "Design & Branding",
        img: "https://html.ravextheme.com/redox/light/assets/imgs/web-development/service-img-3.webp",
        icon: (
            <svg viewBox="0 0 56 56" fill="none" className="w-12 h-12">
                <circle cx="28" cy="22" r="10" stroke="#4353FF" strokeWidth="1.8" fill="none"/>
                <path d="M28 12v20M18 22h20" stroke="#4353FF" strokeWidth="1.5" opacity="0.4"/>
                <path d="M18 38 C18 34 22 32 28 32 C34 32 38 34 38 38" stroke="#4353FF" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
                <path d="M34 36 L36 44 L28 41 L20 44 L22 36" stroke="#4353FF" strokeWidth="1.5" strokeLinejoin="round" fill="none"/>
            </svg>
        ),
    },
    {
        num: "04",
        title: "App Development",
        img: "https://html.ravextheme.com/redox/light/assets/imgs/web-development/service-img-4.webp",
        icon: (
            <svg viewBox="0 0 56 56" fill="none" className="w-12 h-12">
                <rect x="6" y="10" width="44" height="32" rx="3" stroke="#4353FF" strokeWidth="1.8" fill="none"/>
                <path d="M6 18h44" stroke="#4353FF" strokeWidth="1.8"/>
                <circle cx="28" cy="34" r="6" stroke="#4353FF" strokeWidth="1.5" fill="none"/>
                <path d="M28 30v4l3 2" stroke="#4353FF" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M10 14h1M14 14h1" stroke="#4353FF" strokeWidth="2" strokeLinecap="round"/>
            </svg>
        ),
    },
];

export default function Services() {
    const { ref, inView } = useInView(0.1);

    return (
        <section id="services" className="bg-[#EBEBEB] py-20" ref={ref}>
            <div className="max-w-[1300px] mx-auto px-6 md:px-10">
                <div className="grid lg:grid-cols-[320px_1fr] gap-10 items-start">

                    {/* ── LEFT: Title + CTA ── */}
                    <div className={`lg:sticky lg:top-28 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
                        {/* Label */}
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-6 h-[3px] bg-[#4353FF]" />
                            <span className="font-body font-semibold text-[#4353FF] text-xs uppercase tracking-[0.2em]">Service We Offer</span>
                        </div>

                        <h2
                            className="font-heading font-black text-[#0f0f0f] uppercase leading-[1.0] tracking-tight mb-8"
                            style={{ fontSize: "clamp(1.7rem, 2.8vw, 2.4rem)" }}
                        >
                            WE&apos;VE AMAZING WEB SOLUTIONS
                        </h2>

                        <a
                            href="#contact"
                            className="inline-flex items-center gap-3 bg-[#4353FF] text-white font-body font-semibold px-7 py-4 hover:bg-[#0f0f0f] transition-all duration-300 group relative overflow-hidden"
                        >
                            <span className="absolute inset-0 bg-[#0f0f0f] translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-400" />
                            <span className="relative text-sm">More Services</span>
                            <span className="relative group-hover:rotate-45 transition-transform duration-300">
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <path d="M1.5 1.5h10v10M1.5 11.5l10-10" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
                        </a>
                    </div>

                    {/* ── RIGHT: 2×2 grid ── */}
                    <div className="grid sm:grid-cols-2 gap-0 border border-gray-200/60 bg-white/20">
                        {services.map((s, i) => (
                            <div
                                key={s.num}
                                className={`relative p-7 border border-gray-200/60 bg-white/0 hover:bg-white transition-all duration-500 group cursor-pointer overflow-hidden
                  ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}
                `}
                                style={{ transitionDelay: inView ? `${150 + i * 100}ms` : "0ms" }}
                            >
                                {/* Faded number — top right */}
                                <span
                                    className="absolute top-4 right-5 font-heading font-black text-[#4353FF]/15 select-none group-hover:text-[#4353FF]/25 transition-colors duration-300"
                                    style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}
                                >
                  {s.num}
                </span>

                                {/* Icon */}
                                <div className="mb-4 relative z-10">
                                    {s.icon}
                                </div>

                                {/* Title */}
                                <h3 className="font-heading font-black text-[#0f0f0f] text-lg mb-4 relative z-10 group-hover:text-[#4353FF] transition-colors duration-300">
                                    {s.title}
                                </h3>

                                {/* Image — rectangular, appears below title */}
                                <div className="relative w-full overflow-hidden rounded-sm" style={{ aspectRatio: "16/9" }}>
                                    <img
                                        src={s.img}
                                        alt={s.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    {/* Blue overlay on hover */}
                                    <div className="absolute inset-0 bg-[#4353FF] opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                                </div>

                                {/* Bottom border reveal on hover */}
                                <div className="absolute bottom-0 left-0 h-[3px] w-0 bg-[#4353FF] group-hover:w-full transition-all duration-500" />
                            </div>
                        ))}
                    </div> 
                </div>
            </div>
        </section>
    );
}