"use client";
// components/SectionIndex.tsx
// The home page's section index: a slim rail at the right edge on wide screens
// (1400 px and up, where it clears the content). Each section is a short bar;
// the active one lengthens and the logo's dot moves beside it (240 ms).
// Labels appear on hover or focus. Each entry is an ordinary anchor link.
import { useEffect, useState } from "react";

const ROW = 28; // px between entries; the dot moves in steps of this

export default function SectionIndex({ sections }: { sections: { id: string; label: string }[] }) {
    const [active, setActive] = useState(0);

    useEffect(() => {
        const targets = sections
            .map((s) => document.getElementById(s.id))
            .filter((el): el is HTMLElement => Boolean(el));
        if (targets.length === 0 || typeof IntersectionObserver === "undefined") return;

        // A section is active while it crosses the middle band of the viewport.
        const io = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (!entry.isIntersecting) continue;
                    const i = sections.findIndex((s) => s.id === entry.target.id);
                    if (i >= 0) setActive(i);
                }
            },
            { rootMargin: "-45% 0px -50% 0px" },
        );
        targets.forEach((t) => io.observe(t));
        return () => io.disconnect();
    }, [sections]);

    if (sections.length < 2) return null;

    return (
        <nav aria-label="On this page" className="fixed right-8 top-1/2 z-40 -translate-y-1/2 hidden min-[1400px]:block">
            <ol className="relative" style={{ height: sections.length * ROW }}>
                {/* The dot, moving beside the active bar */}
                <span
                    aria-hidden="true"
                    className="absolute -left-3 top-0 h-1.5 w-1.5 bg-accent transition-transform duration-[240ms] ease-[cubic-bezier(0.2,0,0,1)] motion-reduce:transition-none"
                    style={{ transform: `translateY(${active * ROW + (ROW - 6) / 2}px)` }}
                />
                {sections.map((s, i) => {
                    const isActive = i === active;
                    return (
                        <li key={s.id} className="flex items-center justify-end" style={{ height: ROW }}>
                            <a
                                href={`#${s.id}`}
                                aria-current={isActive ? "location" : undefined}
                                className="group relative flex h-full w-8 items-center justify-end focus-visible:outline-none"
                            >
                                <span className="pointer-events-none absolute right-10 whitespace-nowrap rounded border border-[var(--border)] bg-[var(--surface)] px-2 py-1 font-mono text-[11px] text-[var(--text)] opacity-0 transition-opacity duration-[120ms] group-hover:opacity-100 group-focus-visible:opacity-100">
                                    {s.label}
                                </span>
                                <span
                                    aria-hidden="true"
                                    className={`block h-[2px] w-6 origin-right transition-[transform,background-color] duration-[240ms] ease-[cubic-bezier(0.2,0,0,1)] motion-reduce:transition-none group-focus-visible:outline group-focus-visible:outline-2 group-focus-visible:outline-offset-4 group-focus-visible:outline-accent ${
                                        isActive ? "bg-accent scale-x-100" : "bg-[var(--text-faint)] scale-x-50 group-hover:scale-x-75"
                                    }`}
                                />
                            </a>
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
