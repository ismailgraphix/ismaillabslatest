"use client";
// components/NotFoundView.tsx
// The 404 page body: the mark with its dot fallen to the baseline. Clicking the
// dot (or pressing Enter on it) puts it back and returns home.
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NotFoundView() {
    const router = useRouter();
    const [restoring, setRestoring] = useState(false);

    function restore() {
        if (restoring) return;
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (reduced) {
            router.push("/");
            return;
        }
        setRestoring(true);
        window.setTimeout(() => router.push("/"), 520);
    }

    return (
        <main className="bg-[var(--app-bg)] min-h-[80vh] flex items-center">
            <div className="max-w-[1300px] mx-auto w-full px-6 md:px-10 pt-36 pb-24 grid gap-12 md:grid-cols-[auto_1fr] md:items-center">
                {/* The mark, drawn here so the dot can move. Same geometry as public/brand/mark.svg. */}
                <div className="relative w-40 h-40 md:w-56 md:h-56 text-[var(--text)]">
                    <svg viewBox="0 0 64 64" className="w-full h-full" aria-hidden="true">
                        <rect x="17" y="26" width="11" height="28" fill="currentColor" />
                        <rect x="36" y="10" width="11" height="44" fill="currentColor" />
                        {/* Fallen dot, resting on the baseline to the right of the tall bar */}
                        <rect x="50" y="43" width="11" height="11" fill="var(--accent)" className={restoring ? "dot-hop" : ""} />
                    </svg>
                    {/* The clickable area over the fallen dot. */}
                    <button
                        type="button"
                        onClick={restore}
                        aria-label="Put the dot back and go to the home page"
                        className="absolute rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent cursor-pointer"
                        style={{ left: `${(48 / 64) * 100}%`, top: `${(41 / 64) * 100}%`, width: `${(15 / 64) * 100}%`, height: `${(15 / 64) * 100}%` }}
                    />
                </div>

                <div>
                    <p className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--muted)] mb-4">Error 404</p>
                    <h1 className="font-heading font-bold text-[var(--text)] text-[clamp(2.25rem,5vw,4rem)] leading-[1.05] tracking-[-0.03em] mb-5">
                        This page is not here.
                    </h1>
                    <p className="font-body text-[var(--muted)] text-lg leading-relaxed max-w-xl mb-8">
                        The link may be old, or the address mistyped. Put the dot back to go home, or pick a page below.
                    </p>
                    <ul className="flex flex-wrap gap-x-6 gap-y-2 font-body text-sm">
                        {[
                            { href: "/work", label: "Work" },
                            { href: "/services", label: "Services" },
                            { href: "/about", label: "About" },
                            { href: "/contact", label: "Contact" },
                        ].map((link) => (
                            <li key={link.href}>
                                <Link href={link.href} className="text-[var(--accent-text)] hover:text-[var(--text)] transition-colors hover-line">
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </main>
    );
}
