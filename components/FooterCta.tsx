"use client";
// components/FooterCta.tsx
// The contact banner at the top of the footer. It is the home page's closing
// call to action and appears on every other page too, except /contact, where it
// would point at the page the visitor is already on.
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function FooterCta() {
    const pathname = usePathname();
    if (pathname === "/contact") return null;

    return (
        <div className="max-w-7xl mx-auto px-6 pt-16">
            <div className="bg-accent rounded-lg p-8 md:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 relative overflow-hidden">
                <div
                    className="absolute inset-0 opacity-10"
                    aria-hidden="true"
                    style={{
                        backgroundImage: `repeating-linear-gradient(45deg, white, white 1px, transparent 1px, transparent 20px)`,
                    }}
                />
                <h2 className="relative font-heading font-bold text-white text-[clamp(1.5rem,3vw,2.5rem)] leading-tight tracking-tight">
                    Have a system to build or fix?
                </h2>
                <Link
                    href="/contact"
                    className="relative flex-shrink-0 inline-flex items-center gap-2 bg-white text-ink font-body font-semibold px-8 py-4 rounded-md hover:bg-ink hover:text-white transition-colors duration-300"
                >
                    Start a project
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                        <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </Link>
            </div>
        </div>
    );
}
