"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

function useInView(threshold = 0.15) {
    const ref = useRef<HTMLDivElement>(null);
    const [inView, setInView] = useState(false);
    useEffect(() => {
        const obs = new IntersectionObserver(
            ([e]) => { if (e.isIntersecting) setInView(true); },
            { threshold, rootMargin: "200px" }
        );
        if (ref.current) obs.observe(ref.current);
        
        // Failsafe fallback: if intersection observer fails to trigger, show anyway
        const timer = setTimeout(() => setInView(true), 2000);
        return () => { obs.disconnect(); clearTimeout(timer); };
    }, [threshold]);
    return { ref, inView };
}

interface ServiceData {
    id: string;
    title: string;
    slug: string;
    icon: string | null;
    image: string | null;
}

export default function Services({ services = [] }: { services?: ServiceData[] }) {
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
                            <span className="relative text-sm">Contact Us</span>
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
                            <Link
                                href={`/services/${s.slug}`}
                                key={s.id}
                                className={`relative p-7 border border-gray-200/60 bg-white/0 hover:bg-white transition-all duration-500 group cursor-pointer overflow-hidden block
                                    ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}
                                `}
                                style={{ transitionDelay: inView ? `${150 + i * 100}ms` : "0ms" }}
                            >
                                {/* Faded number — top right */}
                                <span
                                    className="absolute top-4 right-5 font-heading font-black text-[#4353FF]/15 select-none group-hover:text-[#4353FF]/25 transition-colors duration-300"
                                    style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}
                                >
                                    {String(i + 1).padStart(2, '0')}
                                </span>

                                {/* Icon */}
                                <div className="mb-4 relative z-10 w-12 h-12 text-[#4353FF]">
                                    {s.icon ? (
                                        <div dangerouslySetInnerHTML={{ __html: s.icon }} />
                                    ) : (
                                        <div className="w-full h-full border-2 border-[#4353FF]/30 rounded-full" />
                                    )}
                                </div>

                                {/* Title */}
                                <h3 className="font-heading font-black text-[#0f0f0f] text-lg mb-4 relative z-10 group-hover:text-[#4353FF] transition-colors duration-300 line-clamp-2">
                                    {s.title}
                                </h3>

                                <div className="relative w-full overflow-hidden rounded-sm" style={{ aspectRatio: "16/9" }}>
                                    {s.image ? (
                                        <img
                                            src={s.image}
                                            alt={s.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-[#f1f1f1]" />
                                    )}
                                    {/* Blue overlay on hover */}
                                    <div className="absolute inset-0 bg-[#4353FF] opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                                </div>

                                {/* Bottom border reveal on hover */}
                                <div className="absolute bottom-0 left-0 h-[3px] w-0 bg-[#4353FF] group-hover:w-full transition-all duration-500" />
                            </Link>
                        ))}
                    </div> 
                </div>
            </div>
        </section>
    );
}