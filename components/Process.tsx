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

const steps = [
    {
        label: "PROCESS-1",
        title: "Project Research",
        desc: "This includes the use of robots & computer solution",
        icon: (
            <svg viewBox="0 0 48 48" fill="none" className="w-9 h-9">
                <rect x="8" y="20" width="14" height="10" rx="2" stroke="#4353FF" strokeWidth="1.6" fill="none"/>
                <rect x="26" y="14" width="14" height="10" rx="2" stroke="#4353FF" strokeWidth="1.6" fill="none"/>
                <path d="M15 20v-6a9 9 0 0118 0v6" stroke="#4353FF" strokeWidth="1.6" strokeLinecap="round" fill="none"/>
                <circle cx="34" cy="34" r="6" stroke="#4353FF" strokeWidth="1.6" fill="none"/>
                <path d="M38.2 38.2L42 42" stroke="#4353FF" strokeWidth="1.8" strokeLinecap="round"/>
                <path d="M31 34h6M34 31v6" stroke="#4353FF" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
        ),
    },
    {
        label: "PROCESS-2",
        title: "Start Working",
        desc: "This includes the use of robots & computer solution",
        icon: (
            <svg viewBox="0 0 48 48" fill="none" className="w-9 h-9">
                <path d="M24 6 L38 14 L38 34 L24 42 L10 34 L10 14 Z" stroke="#4353FF" strokeWidth="1.6" fill="none"/>
                <path d="M24 6 L38 14 M10 14 L24 22 L38 14 M24 22 L24 42" stroke="#4353FF" strokeWidth="1.4" opacity="0.35"/>
                <circle cx="24" cy="24" r="5" stroke="#4353FF" strokeWidth="1.6" fill="none"/>
                <path d="M21 24l2 2 4-4" stroke="#4353FF" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        ),
    },
    {
        label: "PROCESS-3",
        title: "Quality Products",
        desc: "This includes the use of robots & computer solution",
        icon: (
            <svg viewBox="0 0 48 48" fill="none" className="w-9 h-9">
                <path d="M14 10 C14 10 10 14 10 24 C10 34 14 38 24 42 C34 38 38 34 38 24 C38 14 34 10 24 10" stroke="#4353FF" strokeWidth="1.6" strokeLinecap="round" fill="none"/>
                <circle cx="24" cy="24" r="7" stroke="#4353FF" strokeWidth="1.6" fill="none"/>
                <path d="M20 24l3 3 5-6" stroke="#4353FF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 36 C4 40 4 44 8 44 C12 44 16 42 20 38" stroke="#4353FF" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
                <path d="M40 36 C44 40 44 44 40 44 C36 44 32 42 28 38" stroke="#4353FF" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
            </svg>
        ),
    },
    {
        label: "PROCESS-4",
        title: "Quality Finished",
        desc: "This includes the use of robots & computer solution",
        icon: (
            <svg viewBox="0 0 48 48" fill="none" className="w-9 h-9">
                <path d="M12 10 L12 42" stroke="#4353FF" strokeWidth="2" strokeLinecap="round"/>
                <path d="M12 10 L34 10 L34 26 L12 26" stroke="#4353FF" strokeWidth="1.8" strokeLinejoin="round" fill="none"/>
                <path d="M34 10 C38 10 40 14 40 18 C40 22 38 26 34 26" stroke="#4353FF" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
                <circle cx="12" cy="42" r="2.5" fill="#4353FF" opacity="0.5"/>
            </svg>
        ),
    },
];

export default function Process() {
    const { ref, inView } = useInView(0.1);

    return (
        <section className="bg-[#EBEBEB] py-20 relative overflow-hidden" ref={ref}>
            {/* Subtle dot pattern bg */}
            <div
                className="absolute inset-0 opacity-[0.025] pointer-events-none"
                style={{ backgroundImage: "radial-gradient(circle, #4353FF 1px, transparent 1px)", backgroundSize: "32px 32px" }}
            />

            <div className="relative max-w-[1300px] mx-auto px-6 md:px-10">

                {/* Header — centered, blue lines flanking label */}
                <div className={`text-center mb-14 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
                    <div className="inline-flex items-center gap-4 mb-5">
                        <div className="w-10 h-[3px] bg-[#4353FF]/40 rounded-full" />
                        <span className="font-body font-semibold text-[#4353FF] text-xs uppercase tracking-[0.25em]">Our Work Process</span>
                        <div className="w-10 h-[3px] bg-[#4353FF]/40 rounded-full" />
                    </div>
                    <h2
                        className="font-heading font-black text-[#0f0f0f] uppercase tracking-tight"
                        style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)" }}
                    >
                        FOLLOW 4 EASY WORK STEPS
                    </h2>
                </div>

                {/* Cards grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {steps.map((step, i) => (
                        <div
                            key={step.label}
                            className={`
                group relative bg-white border border-gray-200/80 p-8
                hover:border-[#4353FF]/40 hover:shadow-[0_8px_40px_rgba(67,83,255,0.12)]
                hover:-translate-y-2
                transition-all duration-400 cursor-pointer overflow-hidden
                ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}
              `}
                            style={{ transitionDelay: inView ? `${i * 120}ms` : "0ms" }}
                        >
                            {/* Circle icon container — gray bg becomes blue-tinted on hover */}
                            <div className="w-20 h-20 rounded-full bg-gray-100 group-hover:bg-[#4353FF]/10 flex items-center justify-center mb-6 transition-colors duration-300 mx-auto">
                                <div className="transition-transform duration-300 group-hover:scale-110">
                                    {step.icon}
                                </div>
                            </div>

                            {/* Process label */}
                            <p className="font-body font-semibold text-[#4353FF] text-[11px] uppercase tracking-[0.2em] mb-2 text-center">
                                {step.label}
                            </p>

                            {/* Title */}
                            <h3 className="font-heading font-black text-[#0f0f0f] text-[1.05rem] mb-3 text-center group-hover:text-[#4353FF] transition-colors duration-300">
                                {step.title}
                            </h3>

                            {/* Desc */}
                            <p className="font-body text-gray-400 text-sm leading-relaxed text-center">
                                {step.desc}
                            </p>

                            {/* Connector arrow — visible on desktop between cards */}
                            {i < steps.length - 1 && (
                                <div className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 bg-white border border-gray-200 rounded-full items-center justify-center shadow-sm">
                                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                                        <path d="M2 5h6M6 3l2 2-2 2" stroke="#4353FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </div>
                            )}

                            {/* Bottom blue line reveal on hover */}
                            <div className="absolute bottom-0 left-0 h-[3px] w-0 bg-[#4353FF] group-hover:w-full transition-all duration-500" />

                            {/* Corner glow */}
                            <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full bg-[#4353FF]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}