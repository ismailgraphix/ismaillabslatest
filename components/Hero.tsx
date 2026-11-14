"use client";
// components/Hero.tsx
import { useEffect, useState } from "react";
import Link from "next/link";
import { site } from "@/lib/site";

// One line of the heading, rising from behind a mask.
function HeadingLine({ children, loaded, delay }: { children: React.ReactNode; loaded: boolean; delay: number }) {
    return (
        <span className="block overflow-hidden pb-[0.16em] -mb-[0.16em]">
            <span
                className="block"
                style={{
                    opacity: loaded ? 1 : 0,
                    transform: loaded ? "translateY(0)" : "translateY(110%)",
                    transition: `all 0.85s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
                }}
            >
                {children}
            </span>
        </span>
    );
}

export default function Hero() {
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        // Small delay so CSS transitions play after hydration
        const t = setTimeout(() => setLoaded(true), 80);
        return () => clearTimeout(t);
    }, []);

    return (
        <section
            id="home"
            className="relative w-full min-h-screen bg-[var(--app-bg)] flex flex-col overflow-hidden"
        >

            {/* ──────────── Background geometry: squares and thin lines, from the logo ──────────── */}

            {/* Accent square, right side */}
            <div
                className="absolute pointer-events-none"
                style={{
                    width: "clamp(10px, 1.2vw, 18px)",
                    height: "clamp(10px, 1.2vw, 18px)",
                    background: "var(--accent)",
                    top: "30%",
                    right: "8%",
                    opacity: loaded ? 1 : 0,
                    transition: "opacity 1s ease 1s",
                }}
            />

            {/* Cross / plus mark — bottom left area */}
            <svg
                className="absolute pointer-events-none hidden md:block text-[var(--text)]"
                style={{ bottom: "26%", left: "3%", opacity: loaded ? 0.18 : 0, transition: "opacity 1s ease 1.4s" }}
                width="24" height="24" viewBox="0 0 24 24" fill="none"
            >
                <line x1="12" y1="0" x2="12" y2="24" stroke="currentColor" strokeWidth="1.2" />
                <line x1="0" y1="12" x2="24" y2="12" stroke="currentColor" strokeWidth="1.2" />
            </svg>

            {/* ──────────── Main content ──────────── */}
            <div className="relative z-10 flex-1 flex flex-col justify-center max-w-[1400px] mx-auto w-full px-6 md:px-14 pt-36 pb-16">

                {/* Eyebrow */}
                <div
                    className="flex items-center gap-3 mb-10"
                    style={{
                        opacity: loaded ? 1 : 0,
                        transform: loaded ? "translateY(0)" : "translateY(16px)",
                        transition: "all 0.7s ease 0.1s",
                    }}
                >
                    {/* Status light: the logo's square dot */}
                    <span className="relative flex h-2 w-2">
                        <span
                            className="absolute inline-flex h-full w-full bg-accent opacity-60"
                            style={{ animation: "pulseDot 2.4s ease-in-out infinite" }}
                        />
                        <span className="relative inline-flex h-2 w-2 bg-accent" />
                    </span>
                    <span className="font-mono text-xs text-[var(--text-soft)] uppercase tracking-[0.14em]">
                        Digital Agency · Available for Projects
                    </span>
                </div>

                {/* ── Headline: one h1, three lines, each rising from behind a mask.
                       Set at the large display size the landing page had before the rebrand. ── */}
                <h1
                    className="font-heading font-bold text-[var(--text)] leading-[0.95] tracking-[-0.04em] mb-14"
                    style={{ fontSize: "clamp(3.6rem, 10vw, 9.5rem)" }}
                >
                    <HeadingLine loaded={loaded} delay={0.18}>We build</HeadingLine>
                    <HeadingLine loaded={loaded} delay={0.3}>
                        your{" "}
                        <span className="relative inline-block text-accent">
                            digital
                            {/* Underline bar, growing from the left */}
                            <span
                                className="absolute left-0 bottom-[0.02em] h-[0.06em] w-full bg-accent origin-left"
                                style={{
                                    transform: loaded ? "scaleX(1)" : "scaleX(0)",
                                    transition: "transform 0.9s cubic-bezier(0.2,0,0,1) 1.1s",
                                }}
                            />
                        </span>
                    </HeadingLine>
                    <HeadingLine loaded={loaded} delay={0.42}>presence.</HeadingLine>
                </h1>

                {/* ── Bottom row ── */}
                <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-10">
                    {/* Description + CTAs */}
                    <div
                        className="max-w-[460px]"
                        style={{
                            opacity: loaded ? 1 : 0,
                            transform: loaded ? "translateY(0)" : "translateY(20px)",
                            transition: "all 0.8s ease 0.6s",
                        }}
                    >
                        <p className="font-body text-[var(--text-soft)] text-base md:text-lg leading-relaxed">
                            From a stunning website to a complete digital product —
                            we design, build, and scale your online presence so you
                            can focus on running your business.
                        </p>

                        <div className="flex flex-wrap items-center gap-4 mt-8">
                            <Link
                                href="/portfolio#work"
                                className="inline-flex items-center gap-2.5 bg-accent text-white font-body font-semibold text-sm px-6 py-3.5 rounded-md border border-accent hover:bg-[var(--text)] hover:border-[var(--text)] hover:text-[var(--app-bg)] transition-colors duration-300 group"
                            >
                                See Our Work
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
                                    className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-inherit">
                                    <path d="M1 11L11 1M11 1H4M11 1v7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </Link>
                            <a
                                href="#contact"
                                className="inline-flex items-center gap-2 font-body font-medium text-sm text-[var(--text)] border border-[var(--text)] px-6 py-3.5 rounded-md hover:border-accent hover:text-[var(--accent-text)] transition-colors duration-300 group"
                            >
                                Start a project
                                <svg width="11" height="11" viewBox="0 0 12 12" fill="none"
                                    className="transition-transform duration-300 group-hover:translate-x-0.5">
                                    <path d="M1 6h10M7 2l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Stats: confirmed numbers from lib/site.ts, as static text. Hidden while there are none. */}
                    {site.stats.length > 0 && (
                        <div className="flex items-end gap-10 md:gap-16 shrink-0">
                            {site.stats.map((s) => (
                                <div key={s.label} className="text-right">
                                    <p
                                        className="font-heading font-bold text-[var(--text)] tabular-nums"
                                        style={{ fontSize: "clamp(2rem, 3.8vw, 3.5rem)" }}
                                    >
                                        {s.value}
                                    </p>
                                    <p className="font-mono text-[var(--text-faint)] text-[11px] uppercase tracking-[0.12em] leading-snug mt-0.5 whitespace-pre-line">
                                        {s.label}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

        </section>
    );
}
