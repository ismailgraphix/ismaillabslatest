"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";
import HeaderLogo from "@/components/HeaderLogo";
import BarLoader from "@/components/BarLoader";
import { site } from "@/lib/site";
import CommandPalette, { OPEN_PALETTE_EVENT, NAVIGATION_START_EVENT } from "@/components/CommandPalette";

// The logo links home, so "Home" is not repeated here.
const navLinks = [
    { label: "Work", href: "/work" },
    { label: "Services", href: "/services" },
    { label: "About", href: "/about" },
    { label: "Notes", href: "/notes" },
    { label: "Contact", href: "/contact" },
];

// `showNotes` is false until enough posts are published (see lib/queries.ts),
// so the header never links to an empty notes page.
export default function Navbar({ showNotes = false }: { showNotes?: boolean }) {
    const links = showNotes ? navLinks : navLinks.filter((link) => link.href !== "/notes");
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const pathname = usePathname();
    // The shortcut shown in the header hint; set after mount, since the server cannot know the platform.
    const [shortcut, setShortcut] = useState<string | null>(null);

    useEffect(() => {
        setShortcut(/Mac|iPhone|iPad/.test(navigator.platform) ? "⌘K" : "Ctrl K");
    }, []);

    // Navigation loader. Server-rendered pages can take a moment to arrive after
    // a click; the logo's bars show beside the logo for any wait over 300 ms
    // (the delay is in CSS). A wait starts on a click on an internal link to
    // another page, or a NAVIGATION_START_EVENT from code that navigates
    // (the command palette), and ends when the path changes.
    const [navigating, setNavigating] = useState(false);
    useEffect(() => { setNavigating(false); }, [pathname]);
    useEffect(() => {
        const start = () => setNavigating(true);
        const onClick = (e: MouseEvent) => {
            if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
            const a = (e.target as HTMLElement | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
            if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
            const url = new URL(a.href, location.href);
            if (url.origin !== location.origin || url.pathname === location.pathname) return;
            start();
        };
        document.addEventListener("click", onClick);
        window.addEventListener(NAVIGATION_START_EVENT, start);
        return () => {
            document.removeEventListener("click", onClick);
            window.removeEventListener(NAVIGATION_START_EVENT, start);
        };
    }, []);
    // Never spin forever (a failed navigation leaves the path unchanged).
    useEffect(() => {
        if (!navigating) return;
        const id = window.setTimeout(() => setNavigating(false), 10_000);
        return () => window.clearTimeout(id);
    }, [navigating]);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // Close drawer whenever user navigates
    useEffect(() => { setMenuOpen(false); }, [pathname]);

    // Lock body scroll while drawer is open
    useEffect(() => {
        document.body.style.overflow = menuOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [menuOpen]);

    // Allow ESC to close drawer
    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setMenuOpen(false);
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, []);

    function isActive(href: string) {
        return pathname === href || pathname.startsWith(href + "/");
    }

    return (
        <>
            <header
                className={`fixed top-0 left-0 w-full z-50 py-4 transition-[background-color,box-shadow] duration-[240ms] ${scrolled
                    ? "bg-[var(--nav-bg)] backdrop-blur-xl shadow-[0_1px_0_0_var(--border)]"
                    : "bg-transparent"
                    }`}
            >
                <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between">

                    {/* ── Logo: the mark alone on small screens, the full logo from sm up ── */}
                    <div className="flex items-center gap-3 flex-shrink-0">
                        <Link href="/" aria-label={`${site.name}, home`} className="logo-link flex items-center rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent">
                            <HeaderLogo kind="mark" height={36} className="block sm:hidden" />
                            <HeaderLogo kind="full" height={32} className="hidden sm:block" />
                        </Link>
                        {navigating && <BarLoader delayed label="Loading page" size={14} className="text-accent" />}
                    </div>

                    {/* ── Desktop nav — absolutely centered ── */}
                    <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-1 rounded-lg px-1.5 py-1.5 bg-[var(--surface)] border border-[var(--border)]">
                        {links.map((link) => (
                            <Link
                                key={link.label}
                                href={link.href}
                                aria-current={isActive(link.href) ? "page" : undefined}
                                className={`relative font-body font-medium text-[13px] tracking-wide transition-colors duration-200 group px-4 py-2 rounded-md ${isActive(link.href)
                                    ? "text-[var(--accent-text)] bg-accent/10"
                                    : "text-[var(--text)] hover:text-[var(--accent-text)] hover:bg-[var(--chip-bg)]"
                                    }`}
                            >
                                {link.label}
                                {/* The logo's dot marks the current page; a bar grows under the others on hover. */}
                                {isActive(link.href) ? (
                                    <span className="absolute bottom-[4px] left-1/2 -translate-x-1/2 h-1 w-1 bg-accent" aria-hidden="true" />
                                ) : (
                                    <span className="absolute bottom-[5px] left-1/2 -ml-2.5 h-[2px] w-5 bg-accent origin-left scale-x-0 transition-transform duration-[120ms] ease-in group-hover:scale-x-100 group-hover:duration-[240ms] group-hover:ease-[cubic-bezier(0.2,0,0,1)] group-focus-visible:scale-x-100" aria-hidden="true" />
                                )}
                            </Link>
                        ))}
                    </nav>

                    {/* ── Right side ── */}
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => window.dispatchEvent(new Event(OPEN_PALETTE_EVENT))}
                            aria-label="Open the command menu"
                            aria-keyshortcuts="Control+K Meta+K /"
                            className="hidden lg:inline-flex items-center gap-2 h-11 rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 font-mono text-[11px] text-[var(--muted)] hover:border-accent hover:text-[var(--text)] transition-colors duration-[240ms]"
                        >
                            <span className="h-1.5 w-1.5 bg-accent" aria-hidden="true" />
                            {shortcut ?? "Menu"}
                        </button>
                        <ThemeToggle />
                        <Link
                            href="/contact"
                            className="btn-wipe hidden md:inline-flex items-center gap-2 bg-accent text-white border border-accent rounded-md font-body font-semibold text-[13px] px-5 py-2.5 hover:border-[var(--text)] hover:text-[var(--app-bg)]"
                        >
                            Start a project
                            <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true" className="btn-arrow">
                                <path d="M1 11L11 1M11 1H4M11 1v7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </Link>

                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            aria-label="Toggle menu"
                            aria-expanded={menuOpen}
                            aria-controls="mobile-nav-panel"
                            className={`md:hidden w-11 h-11 rounded-md border flex flex-col items-center justify-center gap-[5px] transition-colors duration-[120ms] ${menuOpen
                                ? "border-accent bg-accent"
                                : "border-[var(--border)] bg-[var(--surface)] hover:border-accent"
                                }`}
                        >
                            {/* Two bars that cross into an X; transform and colour only. */}
                            <span className={`block h-[2px] w-[18px] origin-center transition-[transform,background-color] duration-[240ms] ease-[cubic-bezier(0.2,0,0,1)] ${menuOpen
                                ? "translate-y-[3.5px] rotate-45 scale-x-[0.78] bg-white"
                                : "bg-[var(--text)]"
                                }`} />
                            <span className={`block h-[2px] w-[18px] origin-center transition-[transform,background-color] duration-[240ms] ease-[cubic-bezier(0.2,0,0,1)] ${menuOpen
                                ? "-translate-y-[3.5px] -rotate-45 scale-x-[0.78] bg-white"
                                : "scale-x-[0.667] bg-[var(--text)]"
                                }`} />
                        </button>
                    </div>
                </div>

                {/* ── Mobile dropdown: fades and rises in on open, closes at once ── */}
                {menuOpen && (
                    <div
                        id="mobile-nav-panel"
                        className="md:hidden menu-in bg-[var(--surface)] border-t border-[var(--border)] mt-3 pb-5 max-h-[calc(100vh-6rem)] overflow-y-auto"
                    >
                        <div className="px-6 py-5 flex flex-col gap-1">
                            {links.map((link, i) => (
                                <Link
                                    key={link.label}
                                    href={link.href}
                                    onClick={() => setMenuOpen(false)}
                                    style={{ animationDelay: `${Math.min(i, 5) * 40}ms` }}
                                    className={`menu-in font-body font-medium text-base py-3 border-b border-[var(--border)] ${isActive(link.href) ? "text-[var(--accent-text)]" : "text-[var(--text)]"}`}
                                >
                                    <span className="inline-flex items-center gap-3">
                                        {isActive(link.href) && <span className="h-1.5 w-1.5 bg-accent" aria-hidden="true" />}
                                        {link.label}
                                    </span>
                                </Link>
                            ))}
                            <Link
                                href="/contact"
                                onClick={() => setMenuOpen(false)}
                                className="btn-wipe mt-4 text-center rounded-md bg-accent text-white border border-accent font-body font-semibold py-3 text-sm hover:border-[var(--text)] hover:text-[var(--app-bg)]"
                            >
                                Start a project
                            </Link>
                        </div>
                    </div>
                )}
            </header>

            <CommandPalette showNotes={showNotes} />

            {/* Drawer backdrop */}
            {menuOpen && (
                <div
                    className="fixed inset-0 bg-black/35 z-30 backdrop-blur-sm"
                    onClick={() => setMenuOpen(false)}
                />
            )}
        </>
    );
}
