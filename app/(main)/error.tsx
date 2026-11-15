"use client";
// app/(main)/error.tsx
// Shown when a public page fails to render (usually the database being
// unreachable). The header and footer stay; the visitor can retry, or go
// somewhere that does not need the failed data.
import { useEffect } from "react";
import Link from "next/link";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <main className="bg-[var(--app-bg)] min-h-[80vh] flex items-center">
            <div className="max-w-[1300px] mx-auto w-full px-6 md:px-10 pt-36 pb-24">
                <p className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--muted)] mb-4">Something went wrong</p>
                <h1 className="font-heading font-bold text-[var(--text)] text-[clamp(2.25rem,5vw,4rem)] leading-[1.05] tracking-[-0.03em] mb-5 max-w-3xl">
                    This page did not load.
                </h1>
                <p className="font-body text-[var(--muted)] text-lg leading-relaxed max-w-xl mb-8">
                    It is a problem on our side, not with your connection. Try again in a moment, or write to{" "}
                    <a href="mailto:hello@ismaillabs.com" className="text-[var(--accent-text)] underline underline-offset-4">
                        hello@ismaillabs.com
                    </a>
                    .
                </p>
                <div className="flex flex-wrap items-center gap-4">
                    <button
                        type="button"
                        onClick={reset}
                        className="btn-wipe inline-flex items-center gap-2.5 bg-accent text-white font-body font-semibold text-sm px-6 py-3.5 rounded-md border border-accent hover:border-[var(--text)] hover:text-[var(--app-bg)]"
                    >
                        Try again
                    </button>
                    <Link
                        href="/contact"
                        className="inline-flex items-center gap-2 font-body font-medium text-sm text-[var(--text)] border border-[var(--text)] px-6 py-3.5 rounded-md hover:border-accent hover:text-[var(--accent-text)] transition-colors duration-[120ms]"
                    >
                        Contact
                    </Link>
                </div>
                {error.digest && (
                    <p className="mt-10 font-mono text-xs text-[var(--text-faint)]">Reference: {error.digest}</p>
                )}
            </div>
        </main>
    );
}
