"use client";
// components/Hero.tsx
import { useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { site } from "@/lib/site";
import BarLoader from "@/components/BarLoader";

// The demo is its own chunk, fetched after the hero has painted.
const HeroDemo = dynamic(() => import("@/components/hero-demo/HeroDemo"), {
    ssr: false,
    loading: () => (
        <div className="h-[456px] rounded-lg border border-[var(--border)] bg-[var(--surface)] flex items-center justify-center text-accent">
            <BarLoader label="Loading the demo" size={20} />
        </div>
    ),
});

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

// An accent-coloured word with an underline bar that grows from the left.
function Accent({ children, loaded, delay }: { children: React.ReactNode; loaded: boolean; delay: number }) {
    return (
        <span className="relative inline-block text-accent">
            {children}
            <span
                aria-hidden="true"
                className="absolute left-0 bottom-[0.02em] h-[0.06em] w-full bg-accent origin-left"
                style={{
                    transform: loaded ? "scaleX(1)" : "scaleX(0)",
                    transition: `transform 0.9s cubic-bezier(0.2,0,0,1) ${delay}s`,
                }}
            />
        </span>
    );
}

export default function Hero() {
    const [loaded, setLoaded] = useState(false);
    // Whether to mount the demo, and whether its tour may play by itself.
    const [demo, setDemo] = useState<{ autoplay: boolean } | null>(null);

    useEffect(() => {
        // Small delay so CSS transitions play after hydration
        const t = setTimeout(() => setLoaded(true), 80);

        // Load the demo only where it is shown (md and up). Under reduced motion it
        // still loads, but the scripted tour does not start.
        if (window.matchMedia("(min-width: 768px)").matches) {
            const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
            setDemo({ autoplay: !reduced });
        }
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
                    {/* The logo's square dot. It pulses only when there is a real availability date to announce. */}
                    <span className="relative flex h-2 w-2" aria-hidden="true">
                        {site.availability && (
                            <span
                                className="absolute inline-flex h-full w-full bg-accent opacity-60"
                                style={{ animation: "pulseDot 2.4s ease-in-out infinite" }}
                            />
                        )}
                        <span className="relative inline-flex h-2 w-2 bg-accent" />
                    </span>
                    <span className="font-mono text-xs text-[var(--text-soft)] uppercase tracking-[0.14em]">
                        {site.availability
                            ? `Taking projects for ${site.availability}`
                            : `Software studio · ${site.location}`}
                    </span>
                </div>

                {/* ── Headline: one h1, three lines, each rising from behind a mask.
                       Large display type, as the landing page had before the rebrand. The
                       positioning line is longer than the old three words, so the top size is
                       the largest at which "We build the software" still fits on one line. ── */}
                <h1
                    className="font-heading font-bold text-[var(--text)] leading-[0.98] tracking-[-0.04em] mb-14"
                    style={{ fontSize: "clamp(2.6rem, 7.4vw, 7.25rem)" }}
                >
                    <HeadingLine loaded={loaded} delay={0.18}>We build the software</HeadingLine>
                    <HeadingLine loaded={loaded} delay={0.3}>
                        <Accent loaded={loaded} delay={1.1}>universities</Accent> and
                    </HeadingLine>
                    <HeadingLine loaded={loaded} delay={0.42}>
                        <Accent loaded={loaded} delay={1.3}>hospitals</Accent> run on.
                    </HeadingLine>
                </h1>

                {/* ── Bottom row: supporting line and buttons, then the demo ── */}
                <div className="grid gap-12 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] lg:items-start">
                    {/* Description + CTAs */}
                    <div
                        style={{
                            opacity: loaded ? 1 : 0,
                            transform: loaded ? "translateY(0)" : "translateY(20px)",
                            transition: "all 0.8s ease 0.6s",
                        }}
                    >
                        <p className="font-body text-[var(--text-soft)] text-base md:text-lg leading-relaxed">
                            Student portals, hospital records, payments and the systems
                            behind them. Built in Abuja for clients anywhere.
                        </p>

                        <div className="flex flex-wrap items-center gap-4 mt-8">
                            <Link
                                href="/work"
                                className="inline-flex items-center gap-2.5 bg-accent text-white font-body font-semibold text-sm px-6 py-3.5 rounded-md border border-accent hover:bg-[var(--text)] hover:border-[var(--text)] hover:text-[var(--app-bg)] transition-colors duration-300 group"
                            >
                                See the work
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"
                                    className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-inherit">
                                    <path d="M1 11L11 1M11 1H4M11 1v7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </Link>
                            <Link
                                href="/contact"
                                className="inline-flex items-center gap-2 font-body font-medium text-sm text-[var(--text)] border border-[var(--text)] px-6 py-3.5 rounded-md hover:border-accent hover:text-[var(--accent-text)] transition-colors duration-300 group"
                            >
                                Start a project
                                <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true"
                                    className="transition-transform duration-300 group-hover:translate-x-0.5">
                                    <path d="M1 6h10M7 2l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </Link>
                        </div>

                        {/* Stats: confirmed numbers from lib/site.ts, as static text. Hidden while there are none. */}
                        {site.stats.length > 0 && (
                            <dl className="flex flex-wrap gap-10 mt-12">
                                {site.stats.map((s) => (
                                    // dt comes first in the markup, as <dl> requires; flex-col-reverse shows the number on top.
                                    <div key={s.label} className="flex flex-col-reverse">
                                        <dt className="font-mono text-[var(--text-faint)] text-[11px] uppercase tracking-[0.12em] leading-snug mt-0.5 whitespace-pre-line">
                                            {s.label}
                                        </dt>
                                        <dd
                                            className="font-heading font-bold text-[var(--text)] tabular-nums"
                                            style={{ fontSize: "clamp(2rem, 3.8vw, 3.5rem)" }}
                                        >
                                            {s.value}
                                        </dd>
                                    </div>
                                ))}
                            </dl>
                        )}
                    </div>

                    {/* The interactive demo. Space is reserved from md up so nothing shifts when it
                        arrives; below md it is left out, since the views need room to be usable. */}
                    <div
                        className="hidden md:block min-h-[456px]"
                        style={{
                            opacity: loaded ? 1 : 0,
                            transform: loaded ? "translateY(0)" : "translateY(24px)",
                            transition: "all 0.8s ease 0.75s",
                        }}
                    >
                        {demo && <HeroDemo autoplay={demo.autoplay} />}
                    </div>
                </div>
            </div>

        </section>
    );
}
