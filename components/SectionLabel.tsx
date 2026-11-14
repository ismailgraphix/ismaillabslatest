"use client";
// components/SectionLabel.tsx
// The small label above a section heading: an accent bar (the bar from the
// logo) and a monospace caption. The bar starts short and lengthens the first
// time the label scrolls into view, like a progress bar. The caption uses the
// muted text colour rather than the accent, so it passes contrast in both themes.
import { useEffect, useRef, useState } from "react";

export default function SectionLabel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    const ref = useRef<HTMLDivElement>(null);
    const [inView, setInView] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el || typeof IntersectionObserver === "undefined") {
            setInView(true);
            return;
        }
        const obs = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setInView(true);
                    obs.disconnect(); // reveal once; scrolling back does not replay it
                }
            },
            { threshold: 0.5 },
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    return (
        <div ref={ref} className={`flex items-center gap-3 ${className}`}>
            <span
                className="block h-[3px] w-6 shrink-0 bg-accent origin-left transition-transform duration-[240ms] ease-[cubic-bezier(0.2,0,0,1)] motion-reduce:transition-none"
                style={{ transform: inView ? "scaleX(1)" : "scaleX(0.4)" }}
                aria-hidden="true"
            />
            <span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--muted)]">{children}</span>
        </div>
    );
}
