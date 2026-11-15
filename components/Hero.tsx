"use client";
// components/Hero.tsx
// The home hero. Its entrance is CSS keyframes (app/globals.css, "Hero
// entrance") that start at first paint, so the heading never waits for
// JavaScript: each line rises from behind a mask (480 ms, 60 ms stagger), the
// accent words get their underline, then the supporting line, buttons and demo
// fade up. Under reduced motion the movement is dropped.
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
            <BarLoader delayed label="Loading the demo" size={20} />
        </div>
    ),
});

/** Inline animation-delay, in milliseconds. */
const delay = (ms: number) => ({ animationDelay: `${ms}ms` });

// One line of the heading, rising from behind a mask.
function HeadingLine({ children, at }: { children: React.ReactNode; at: number }) {
    return (
        <span className="block overflow-hidden pb-[0.16em] -mb-[0.16em]">
            <span className="hero-line block" style={delay(at)}>
                {children}
            </span>
        </span>
    );
}

// An accent-coloured word with an underline bar that grows from the left.
function Accent({ children, at }: { children: React.ReactNode; at: number }) {
    return (
        <span className="relative inline-block text-accent">
            {children}
            <span aria-hidden="true" className="hero-grow-x absolute left-0 bottom-[0.02em] h-[0.06em] w-full bg-accent" style={delay(at)} />
        </span>
    );
}

export default function Hero() {
    // Whether to mount the demo, and whether its tour may play by itself.
    const [demo, setDemo] = useState<{ autoplay: boolean } | null>(null);

    useEffect(() => {
        // Load the demo only where it is shown (md and up). Under reduced motion it
        // still loads, but the scripted tour does not start.
        if (window.matchMedia("(min-width: 768px)").matches) {
            const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
            setDemo({ autoplay: !reduced });
        }
    }, []);

    return (
        <section id="home" className="relative w-full min-h-screen bg-[var(--app-bg)] flex flex-col overflow-hidden">
            {/* ──────────── Background geometry: squares and thin lines, from the logo ──────────── */}

            {/* Accent square, right side */}
            <div
                aria-hidden="true"
                className="hero-fade-in absolute pointer-events-none bg-accent"
                style={{
                    width: "clamp(10px, 1.2vw, 18px)",
                    height: "clamp(10px, 1.2vw, 18px)",
                    top: "30%",
                    right: "8%",
                    ...delay(700),
                }}
            />

            {/* Plus mark, bottom left */}
            <svg
                aria-hidden="true"
                className="hero-fade-in absolute pointer-events-none hidden md:block text-[var(--text)]"
                style={{ bottom: "26%", left: "3%", ...delay(800) }}
                width="24" height="24" viewBox="0 0 24 24" fill="none"
            >
                <g opacity="0.18">
                    <line x1="12" y1="0" x2="12" y2="24" stroke="currentColor" strokeWidth="1.2" />
                    <line x1="0" y1="12" x2="24" y2="12" stroke="currentColor" strokeWidth="1.2" />
                </g>
            </svg>

            {/* ──────────── Main content ──────────── */}
            <div className="relative z-10 flex-1 flex flex-col justify-center max-w-[1400px] mx-auto w-full px-6 md:px-14 pt-36 pb-16">
                {/* Eyebrow */}
                <div className="hero-fade-rise flex items-center gap-3 mb-10">
                    {/* The logo's square dot. It pulses only when there is a real availability date to announce. */}
                    <span className="relative flex h-2 w-2" aria-hidden="true">
                        {site.availability && (
                            <span
                                className="absolute inline-flex h-full w-full bg-accent opacity-60 motion-reduce:hidden"
                                style={{ animation: "pulseDot 2.4s ease-in-out infinite" }}
                            />
                        )}
                        <span className="relative inline-flex h-2 w-2 bg-accent" />
                    </span>
                    <span className="font-mono text-xs text-[var(--text-soft)] uppercase tracking-[0.14em]">
                        {site.availability ? `Taking projects for ${site.availability}` : "Software studio"}
                    </span>
                </div>

                {/* ── Headline: the original landing page wording, set as it was: bold
                       capitals at the large display size, three lines. ── */}
                <h1
                    className="font-heading font-bold uppercase text-[var(--text)] leading-[0.87] tracking-[-0.03em] mb-14"
                    style={{ fontSize: "clamp(3.6rem, 10vw, 9.5rem)" }}
                >
                    <HeadingLine at={60}>We build</HeadingLine>
                    <HeadingLine at={120}>
                        your <Accent at={600}>digital</Accent>
                    </HeadingLine>
                    <HeadingLine at={180}>presence.</HeadingLine>
                </h1>

                {/* ── Bottom row: supporting line and buttons, then the demo ── */}
                <div className="grid gap-12 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] lg:items-start">
                    <div className="hero-fade-rise" style={delay(540)}>
                        <p className="font-body text-[var(--text-soft)] text-base md:text-lg leading-relaxed">
                            Student portals, hospital records, payments and the systems
                            behind them.
                        </p>

                        <div className="flex flex-wrap items-center gap-4 mt-8">
                            <Link
                                href="/work"
                                className="btn-wipe inline-flex items-center gap-2.5 bg-accent text-white font-body font-semibold text-sm px-6 py-3.5 rounded-md border border-accent hover:border-[var(--text)] hover:text-[var(--app-bg)]"
                            >
                                See the work
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" className="btn-arrow">
                                    <path d="M1 11L11 1M11 1H4M11 1v7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </Link>
                            <Link
                                href="/contact"
                                className="group inline-flex items-center gap-2 font-body font-medium text-sm text-[var(--text)] border border-[var(--text)] px-6 py-3.5 rounded-md hover:border-accent hover:text-[var(--accent-text)] transition-colors duration-[120ms]"
                            >
                                Start a project
                                <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true"
                                    className="transition-transform duration-[120ms] ease-in group-hover:translate-x-1 group-hover:duration-[180ms] group-hover:ease-[cubic-bezier(0.2,0,0,1)] motion-reduce:transition-none">
                                    <path d="M1 6h10M7 2l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </Link>
                        </div>

                        {/* Stats: confirmed numbers from lib/site.ts, as static text with a small bar
                            that grows beside each. Hidden while there are none. */}
                        {site.stats.length > 0 && (
                            <dl className="flex flex-wrap gap-10 mt-12">
                                {site.stats.map((s, i) => (
                                    // dt comes first in the markup, as <dl> requires; flex-col-reverse shows the number on top.
                                    <div key={s.label} className="flex flex-col-reverse">
                                        <dt className="font-mono text-[var(--text-faint)] text-[11px] uppercase tracking-[0.12em] leading-snug mt-0.5 whitespace-pre-line">
                                            {s.label}
                                        </dt>
                                        <dd className="flex items-center gap-3">
                                            <span
                                                className="font-heading font-bold text-[var(--text)] tabular-nums"
                                                style={{ fontSize: "clamp(2rem, 3.8vw, 3.5rem)" }}
                                            >
                                                {s.value}
                                            </span>
                                            <span aria-hidden="true" className="hero-grow-x block h-[3px] w-6 bg-accent" style={delay(720 + i * 60)} />
                                        </dd>
                                    </div>
                                ))}
                            </dl>
                        )}
                    </div>

                    {/* The interactive demo. Space is reserved from md up so nothing shifts when it
                        arrives; below md it is left out, since the views need room to be usable. */}
                    <div className="hero-fade-rise hidden md:block min-h-[456px]" style={delay(600)}>
                        {demo && <HeroDemo autoplay={demo.autoplay} />}
                    </div>
                </div>
            </div>
        </section>
    );
}
