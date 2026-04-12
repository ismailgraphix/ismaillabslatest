"use client";
// components/Hero.tsx
import { useEffect, useState, useRef } from "react";

// ── Scrolling ticker ──────────────────────────────────────────────────────
const SERVICES = [
    "Web Design", "Brand Identity", "Web Development",
    "UI / UX Design", "Mobile Apps", "Digital Strategy",
    "E-commerce", "Creative Direction",
];

function Ticker() {
    const items = [...SERVICES, ...SERVICES]; // duplicate for seamless loop
    return (
        <div className="w-full overflow-hidden border-t border-[#0f0f0f]/[0.08]">
            <div className="flex items-center py-4 whitespace-nowrap">
                <div
                    className="flex items-center gap-14 shrink-0"
                    style={{ animation: "ticker 30s linear infinite" }}
                >
                    {items.map((s, i) => (
                        <span key={i} className="inline-flex items-center gap-4 font-body text-[11px] text-[#0f0f0f]/40 uppercase tracking-[0.22em]">
                            <span className="w-1 h-1 rounded-full bg-[#4353FF] shrink-0" />
                            {s}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ── Count-up on scroll into view ─────────────────────────────────────────
function Counter({ end, suffix = "" }: { end: number; suffix?: string }) {
    const [val, setVal] = useState(0);
    const elRef = useRef<HTMLDivElement>(null);
    const ran = useRef(false);

    useEffect(() => {
        const el = elRef.current;
        if (!el) return;
        const obs = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && !ran.current) {
                ran.current = true;
                let start = 0;
                const steps = 48;
                const ms = 1200 / steps;
                const timer = setInterval(() => {
                    start++;
                    setVal(Math.round((start / steps) * end));
                    if (start >= steps) clearInterval(timer);
                }, ms);
            }
        }, { threshold: 0.5 });
        obs.observe(el);
        return () => obs.disconnect();
    }, [end]);

    return (
        <div ref={elRef}>
            {val}{suffix}
        </div>
    );
}

export default function Hero() {
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        // Small delay so CSS transitions play after hydration
        const t = setTimeout(() => setLoaded(true), 80);
        return () => clearTimeout(t);
    }, []);

    // Shared transition helper
    const reveal = (delay: number, extra = "") =>
        `transition-all duration-700 ease-out ${extra} ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`;

    return (
        <>
            <style>{`
                @keyframes ticker {
                    from { transform: translateX(0); }
                    to   { transform: translateX(-50%); }
                }
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(24px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes scaleIn {
                    from { opacity: 0; transform: scale(0.92); }
                    to   { opacity: 1; transform: scale(1); }
                }
                @keyframes drawUnderline {
                    from { stroke-dashoffset: 600; }
                    to   { stroke-dashoffset: 0; }
                }
                @keyframes pulseDot {
                    0%, 100% { opacity: 1;   transform: scale(1); }
                    50%       { opacity: 0.4; transform: scale(0.7); }
                }
                @keyframes rotateSlow {
                    from { transform: rotate(0deg); }
                    to   { transform: rotate(360deg); }
                }
            `}</style>

            <section
                id="home"
                className="relative w-full min-h-screen bg-[#EBEBEB] flex flex-col overflow-hidden"
            >

                {/* ──────────── Background geometry ──────────── */}

                {/* Large ghost circle — top right, very subtle */}
                <div
                    className="absolute pointer-events-none rounded-full border border-[#0f0f0f]/[0.055]"
                    style={{
                        width: "min(68vw, 860px)",
                        height: "min(68vw, 860px)",
                        top: "-22%",
                        right: "-14%",
                        opacity: loaded ? 1 : 0,
                        transition: "opacity 1.4s ease 0.3s",
                    }}
                />
                {/* Inner circle */}
                <div
                    className="absolute pointer-events-none rounded-full border border-[#0f0f0f]/[0.04]"
                    style={{
                        width: "min(48vw, 600px)",
                        height: "min(48vw, 600px)",
                        top: "-10%",
                        right: "-4%",
                        opacity: loaded ? 1 : 0,
                        transition: "opacity 1.4s ease 0.5s",
                    }}
                />

                {/* Blue filled square — right side accent, very quiet */}
                <div
                    className="absolute pointer-events-none"
                    style={{
                        width: "clamp(10px, 1.2vw, 18px)",
                        height: "clamp(10px, 1.2vw, 18px)",
                        background: "#4353FF",
                        top: "30%",
                        right: "8%",
                        opacity: loaded ? 0.7 : 0,
                        transition: "opacity 1s ease 1s",
                    }}
                />

                {/* Rotating text ring — bottom right, ultra-subtle */}
                <div
                    className="absolute pointer-events-none select-none hidden lg:block"
                    style={{
                        bottom: "14%",
                        right: "5%",
                        width: "clamp(90px, 8vw, 130px)",
                        height: "clamp(90px, 8vw, 130px)",
                        opacity: loaded ? 0.3 : 0,
                        transition: "opacity 1.2s ease 1.2s",
                        animation: "rotateSlow 22s linear infinite",
                    }}
                >
                    <svg viewBox="0 0 130 130" fill="none">
                        <path id="ring" d="M65,65 m-52,0 a52,52 0 1,1 104,0 a52,52 0 1,1 -104,0" fill="none" />
                        <text style={{ fontSize: "12.5px", letterSpacing: "3.8px", fill: "#0f0f0f" }}>
                            <textPath href="#ring">DIGITAL · AGENCY · EST. 2024 ·</textPath>
                        </text>
                        <circle cx="65" cy="65" r="2.5" fill="#4353FF" />
                    </svg>
                </div>

                {/* Cross / plus mark — bottom left area */}
                <svg
                    className="absolute pointer-events-none hidden md:block"
                    style={{ bottom: "26%", left: "3%", opacity: loaded ? 0.18 : 0, transition: "opacity 1s ease 1.4s" }}
                    width="24" height="24" viewBox="0 0 24 24" fill="none"
                >
                    <line x1="12" y1="0" x2="12" y2="24" stroke="#0f0f0f" strokeWidth="1.2" />
                    <line x1="0" y1="12" x2="24" y2="12" stroke="#0f0f0f" strokeWidth="1.2" />
                </svg>

                {/* ──────────── Main content ──────────── */}
                <div className="relative z-10 flex-1 flex flex-col justify-center max-w-[1400px] mx-auto w-full px-6 md:px-14 pt-36 pb-10">

                    {/* Eyebrow */}
                    <div
                        className="flex items-center gap-3 mb-10"
                        style={{
                            opacity: loaded ? 1 : 0,
                            transform: loaded ? "translateY(0)" : "translateY(16px)",
                            transition: "all 0.7s ease 0.1s",
                        }}
                    >
                        {/* Live pulse dot */}
                        <span className="relative flex h-2 w-2">
                            <span
                                className="absolute inline-flex h-full w-full rounded-full bg-[#4353FF] opacity-60"
                                style={{ animation: "pulseDot 2.4s ease-in-out infinite" }}
                            />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4353FF]" />
                        </span>
                        <span className="font-body text-[11px] text-[#0f0f0f]/50 uppercase tracking-[0.26em]">
                            Digital Agency · Available for Projects
                        </span>
                    </div>

                    {/* ── Headline — three lines, clipped reveal ── */}
                    {/* Line 1 */}
                    <div className="overflow-hidden">
                        <h1
                            className="font-heading font-black text-[#0f0f0f] uppercase leading-[0.87] tracking-[-0.03em]"
                            style={{
                                fontSize: "clamp(3.6rem, 10vw, 9.5rem)",
                                opacity: loaded ? 1 : 0,
                                transform: loaded ? "translateY(0)" : "translateY(110%)",
                                transition: "all 0.85s cubic-bezier(0.16,1,0.3,1) 0.18s",
                            }}
                        >
                            We Build
                        </h1>
                    </div>

                    {/* Line 2 — "Your Digital" with blue underline on "Digital" */}
                    <div className="overflow-hidden">
                        <h1
                            className="font-heading font-black text-[#0f0f0f] uppercase leading-[0.87] tracking-[-0.03em] flex flex-wrap items-baseline gap-x-[0.2em]"
                            style={{
                                fontSize: "clamp(3.6rem, 10vw, 9.5rem)",
                                opacity: loaded ? 1 : 0,
                                transform: loaded ? "translateY(0)" : "translateY(110%)",
                                transition: "all 0.85s cubic-bezier(0.16,1,0.3,1) 0.3s",
                            }}
                        >
                            <span>Your</span>
                            <span className="relative text-[#4353FF]">
                                Digital
                                {/* Animated underline */}
                                <svg
                                    className="absolute left-0 w-full"
                                    style={{ bottom: "-8%", height: "clamp(5px, 0.7vw, 10px)" }}
                                    viewBox="0 0 340 10" fill="none" preserveAspectRatio="none"
                                >
                                    <path
                                        d="M2 7 Q85 1 170 7 Q255 13 338 7"
                                        stroke="#4353FF" strokeWidth="2.5" fill="none"
                                        strokeLinecap="round"
                                        strokeDasharray="600"
                                        strokeDashoffset={loaded ? "0" : "600"}
                                        style={{ transition: "stroke-dashoffset 1.1s ease 1.1s" }}
                                    />
                                </svg>
                            </span>
                        </h1>
                    </div>

                    {/* Line 3 */}
                    <div className="overflow-hidden mb-14">
                        <h1
                            className="font-heading font-black text-[#0f0f0f] uppercase leading-[0.87] tracking-[-0.03em]"
                            style={{
                                fontSize: "clamp(3.6rem, 10vw, 9.5rem)",
                                opacity: loaded ? 1 : 0,
                                transform: loaded ? "translateY(0)" : "translateY(110%)",
                                transition: "all 0.85s cubic-bezier(0.16,1,0.3,1) 0.42s",
                            }}
                        >
                            Presence.
                        </h1>
                    </div>

                    {/* ── Bottom row ── */}
                    <div
                        className="flex flex-col md:flex-row items-start md:items-end justify-between gap-10"
                        style={{
                            opacity: loaded ? 1 : 0,
                            transform: loaded ? "translateY(0)" : "translateY(20px)",
                            transition: "all 0.8s ease 0.6s",
                        }}
                    >
                        {/* Description + CTAs */}
                        <div className="max-w-[400px]">
                            <p
                                className="font-body text-[#0f0f0f]/55 leading-relaxed"
                                style={{ fontSize: "clamp(0.88rem, 1.15vw, 1rem)" }}
                            >
                                From a stunning website to a complete digital product —
                                we design, build, and scale your online presence so you
                                can focus on running your business.
                            </p>

                            <div className="flex items-center gap-5 mt-8">
                                <a
                                    href="#about"
                                    className="inline-flex items-center gap-2.5 bg-[#0f0f0f] text-white font-body font-semibold text-[13px] px-6 py-3.5 hover:bg-[#4353FF] transition-colors duration-300 group"
                                >
                                    See Our Work
                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
                                        className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                                        <path d="M1 11L11 1M11 1H4M11 1v7" stroke="white" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </a>
                                <a
                                    href="#contact"
                                    className="font-body font-medium text-[13px] text-[#0f0f0f] border-b border-[#0f0f0f]/25 pb-0.5 hover:border-[#4353FF] hover:text-[#4353FF] transition-all duration-300 inline-flex items-center gap-1.5"
                                >
                                    Start a project
                                    <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                                        <path d="M1 6h10M7 2l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </a>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="flex items-end gap-10 md:gap-16 shrink-0">
                            {[
                                { end: 50, suffix: "+", label: "Projects\ncompleted" },
                                { end: 98, suffix: "%", label: "Client\nsatisfaction" },
                                { end: 4, suffix: "+", label: "Years of\nexperience" },
                            ].map((s) => (
                                <div key={s.label} className="text-right">
                                    <p
                                        className="font-heading font-black text-[#0f0f0f] tabular-nums"
                                        style={{ fontSize: "clamp(2rem, 3.8vw, 3.5rem)" }}
                                    >
                                        <Counter end={s.end} suffix={s.suffix} />
                                    </p>
                                    <p className="font-body text-[#0f0f0f]/40 text-[10px] uppercase tracking-[0.15em] leading-snug mt-0.5 whitespace-pre-line">
                                        {s.label}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── Ticker strip at bottom ── */}
                <div
                    className="relative z-10"
                    style={{
                        opacity: loaded ? 1 : 0,
                        transition: "opacity 0.8s ease 0.9s",
                    }}
                >
                    <Ticker />
                </div>
            </section>
        </>
    );
}