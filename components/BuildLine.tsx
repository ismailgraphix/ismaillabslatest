"use client";
// components/BuildLine.tsx
// The footer's build line: how much JavaScript the visit has actually loaded,
// measured in the visitor's browser (the first page, plus the chunks each page
// change adds), and the date and commit of the build, inlined at build time by
// next.config.mjs. It links to /colophon.
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const commit = process.env.NEXT_PUBLIC_BUILD_COMMIT ?? "";
const builtAt = process.env.NEXT_PUBLIC_BUILD_DATE ?? "";

function measureScriptKb(): number | null {
    if (typeof performance === "undefined" || !performance.getEntriesByType) return null;
    const entries = performance.getEntriesByType("resource") as PerformanceResourceTiming[];
    const bytes = entries
        .filter((e) => e.initiatorType === "script" || /\.m?js(\?|$)/.test(e.name))
        // Compressed bytes over the wire; cached files still count, as their body size.
        .reduce((sum, e) => sum + (e.encodedBodySize || e.transferSize || 0), 0);
    return bytes > 0 ? Math.round(bytes / 1024) : null;
}

export default function BuildLine() {
    const pathname = usePathname();
    const [jsKb, setJsKb] = useState<number | null>(null);

    // Measure once the page has loaded, and again after each navigation, since
    // client-side page changes fetch their own chunks.
    useEffect(() => {
        const measure = () => setJsKb(measureScriptKb());
        if (document.readyState === "complete") {
            const id = window.setTimeout(measure, 500);
            return () => window.clearTimeout(id);
        }
        window.addEventListener("load", measure, { once: true });
        return () => window.removeEventListener("load", measure);
    }, [pathname]);

    const date = builtAt
        ? new Date(builtAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "Africa/Lagos" })
        : null;

    const parts = [
        jsKb !== null ? `${jsKb} kB of JavaScript loaded` : null,
        date ? `built ${date}` : null,
        commit ? `commit ${commit}` : null,
    ].filter(Boolean);

    if (parts.length === 0) return null;

    return (
        <Link
            href="/colophon"
            className="font-mono text-[11px] text-[var(--muted)] hover:text-[var(--accent-text)] transition-colors"
            title="How this site is built"
        >
            {parts.join(" · ")}
        </Link>
    );
}
