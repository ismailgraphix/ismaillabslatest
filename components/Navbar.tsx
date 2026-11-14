"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";
import Logo from "@/components/Logo";
import { site } from "@/lib/site";
import CommandPalette, { OPEN_PALETTE_EVENT } from "@/components/CommandPalette";

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
                className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${scrolled
                    ? "bg-[var(--nav-bg)] backdrop-blur-xl shadow-[0_1px_0_0_var(--border)] py-3"
                    : "bg-transparent py-5"
                    }`}
            >
                <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between">

                    {/* ── Logo: the mark alone on small screens, the full logo from sm up ── */}
                    <Link href="/" aria-label={`${site.name}, home`} className="flex items-center flex-shrink-0">
                        <Logo kind="mark" height={36} className="inline-block sm:hidden" />
                        <Logo kind="full" height={32} className="hidden sm:inline-block" />
                    </Link>

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
                                    <span className="absolute bottom-[5px] left-1/2 -translate-x-1/2 h-[2px] w-0 bg-accent transition-all duration-[240ms] group-hover:w-5 group-focus-visible:w-5" aria-hidden="true" />
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
                            className="hidden md:inline-flex items-center gap-2 bg-accent text-white border border-accent rounded-md font-body font-semibold text-[13px] px-5 py-2.5 hover:bg-[var(--text)] hover:border-[var(--text)] hover:text-[var(--app-bg)] transition-colors duration-300"
                        >
                            Start a project
                            <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                                <path d="M1 11L11 1M11 1H4M11 1v7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </Link>

                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            aria-label="Toggle menu"
                            aria-expanded={menuOpen}
                            aria-controls="mobile-nav-panel"
                            className={`md:hidden w-11 h-11 rounded-md border flex flex-col items-center justify-center gap-[5px] transition-colors duration-300 ${menuOpen
                                ? "border-accent bg-accent"
                                : "border-[var(--border)] bg-[var(--surface)] hover:border-accent"
                                }`}
                        >
                            <span className={`block h-[2px] transition-all duration-300 origin-center ${menuOpen
                                ? "w-[14px] rotate-45 translate-y-[3.5px] bg-white"
                                : "w-[18px] bg-[var(--text)]"
                                }`} />
                            <span className={`block h-[2px] transition-all duration-300 origin-center ${menuOpen
                                ? "w-[14px] -rotate-45 -translate-y-[3.5px] bg-white"
                                : "w-[12px] bg-[var(--text)]"
                                }`} />
                        </button>
                    </div>
                </div>

                {/* ── Mobile dropdown ── */}
                <div
                    id="mobile-nav-panel"
                    className={`md:hidden overflow-hidden transition-all duration-400 ease-in-out ${menuOpen ? "max-h-[calc(100vh-6rem)] opacity-100" : "max-h-0 opacity-0"
                        } bg-[var(--surface)] border-t border-[var(--border)] mt-3 pb-5`}
                >
                    <div className="px-6 py-5 flex flex-col gap-1">
                        {links.map((link, i) => (
                            <Link
                                key={link.label}
                                href={link.href}
                                onClick={() => setMenuOpen(false)}
                                style={{ transitionDelay: menuOpen ? `${i * 40}ms` : "0ms" }}
                                className={`font-body font-medium text-base py-3 border-b border-[var(--border)] transition-all duration-300 ${menuOpen ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0"
                                    } ${isActive(link.href) ? "text-[var(--accent-text)]" : "text-[var(--text)]"}`}
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
                            className="mt-4 text-center rounded-md bg-accent text-white border border-accent font-body font-semibold py-3 text-sm hover:bg-[var(--text)] hover:border-[var(--text)] hover:text-[var(--app-bg)] transition-colors duration-300"
                        >
                            Start a project
                        </Link>
                    </div>
                </div>
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
