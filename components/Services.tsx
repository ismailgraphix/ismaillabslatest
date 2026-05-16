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
    const [showAll, setShowAll] = useState(false);
    const visible = showAll ? services : services.slice(0, 4);

    return (
        <section id="services" className="bg-[var(--app-bg)] py-20" ref={ref}>
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
                            className="font-heading font-black text-[var(--text)] uppercase leading-[1.0] tracking-tight mb-8"
                            style={{ fontSize: "clamp(1.7rem, 2.8vw, 2.4rem)" }}
                        >
                            WE&apos;VE AMAZING WEB SOLUTIONS
                        </h2>

                        {/* CTA — pill, theme-safe hover, no broken slide overlay */}
                        <a
                            href="#contact"
                            className="inline-flex items-center gap-3 bg-[#4353FF] text-white border border-[#4353FF] font-body font-semibold px-7 py-4 rounded-full hover:bg-[var(--text)] hover:text-[var(--surface)] transition-all duration-[400ms] group"
                        >
                            <span className="text-sm">Contact Us</span>
                            <span className="group-hover:rotate-45 transition-transform duration-300">
                                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                                    <path d="M1.5 1.5h10v10M1.5 11.5l10-10" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </span>
                        </a>
                    </div>

                    {/* ── RIGHT: 2×2 grid ── */}
                    <div>
                        {/* Outer wrapper — no border/bg, inner card borders form the grid lines */}
                        <div className="grid sm:grid-cols-2 gap-0 rounded-2xl overflow-hidden">
                            {visible.map((s, i) => {
                                // Alternate slide direction per column
                                const isRightCol = i % 2 === 1;
                                const enterClass = inView
                                    ? "opacity-100 translate-x-0"
                                    : isRightCol
                                        ? "opacity-0 translate-x-6"
                                        : "opacity-0 -translate-x-6";

                                return (
                                    <Link
                                        href={`/services/${s.slug}`}
                                        key={s.id}
                                        className={`relative p-7 border border-[var(--border)] bg-transparent hover:bg-[var(--surface)] transition-all duration-500 group cursor-pointer overflow-hidden block ${enterClass}`}
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
                                        <h3 className="font-heading font-black text-[var(--text)] text-lg mb-4 relative z-10 group-hover:text-[#4353FF] transition-colors duration-300 line-clamp-2">
                                            {s.title}
                                        </h3>

                                        {/* Image — theme-safe placeholder, no blue overlay */}
                                        <div className="relative w-full overflow-hidden rounded-xl" style={{ aspectRatio: "16/9" }}>
                                            {s.image ? (
                                                <img
                                                    src={s.image}
                                                    alt={s.title}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-[var(--surface)]" />
                                            )}
                                        </div>

                                        {/* Bottom border reveal on hover */}
                                        <div className="absolute bottom-0 left-0 h-[3px] w-0 bg-[#4353FF] group-hover:w-full transition-all duration-500" />
                                    </Link>
                                );
                            })}
                        </div>

                        {services.length > 4 && (
                            <div className={`mt-8 flex justify-center transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
                                {/* Show all — pill, lighter border weight */}
                                <button
                                    type="button"
                                    onClick={() => setShowAll(v => !v)}
                                    className="inline-flex items-center gap-2 rounded-full border-[1.5px] border-[var(--border)] text-[var(--text)] font-body font-semibold px-6 py-3.5 hover:bg-[var(--text)] hover:text-[var(--surface)] hover:border-[var(--text)] transition-all duration-300 text-sm"
                                >
                                    {showAll ? "Show less" : `View all (${services.length})`}
                                    <svg
                                        width="14" height="14" viewBox="0 0 14 14" fill="none"
                                        className={`transition-transform duration-300 ${showAll ? "rotate-180" : ""}`}
                                    >
                                        <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}