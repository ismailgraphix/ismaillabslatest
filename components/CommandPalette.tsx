"use client";
// components/CommandPalette.tsx
// Press Ctrl/Cmd + K or "/" (or use the hint in the header) to jump to any
// page, project or service, copy the email address, switch theme or start a
// brief. Keyboard-driven: arrows move, Enter runs, Esc closes. Focus stays in
// the search field while it is open and returns where it was on close.
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { site } from "@/lib/site";

/** Other components open the palette by dispatching this event on window. */
export const OPEN_PALETTE_EVENT = "open-command-palette";

interface Item {
    id: string;
    group: "Pages" | "Work" | "Services" | "Actions";
    label: string;
    hint?: string;
    keywords?: string;
    run: () => void | Promise<void>;
}

interface SiteIndex {
    work: { title: string; slug: string }[];
    services: { title: string; slug: string }[];
}

function isTypingTarget(target: EventTarget | null) {
    const el = target as HTMLElement | null;
    if (!el) return false;
    return el.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName);
}

export default function CommandPalette({ showNotes = false }: { showNotes?: boolean }) {
    const router = useRouter();
    const { resolvedTheme, setTheme } = useTheme();

    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [active, setActive] = useState(0);
    const [index, setIndex] = useState<SiteIndex | null>(null);
    const [notice, setNotice] = useState("");

    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLUListElement>(null);
    const returnFocusRef = useRef<HTMLElement | null>(null);

    const close = useCallback(() => {
        setOpen(false);
        setQuery("");
        setNotice("");
        returnFocusRef.current?.focus?.();
    }, []);

    const openPalette = useCallback(() => {
        returnFocusRef.current = document.activeElement as HTMLElement | null;
        setActive(0);
        setOpen(true);
    }, []);

    // ── Global shortcuts and the header hint ──
    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
                e.preventDefault();
                if (open) close();
                else openPalette();
            } else if (e.key === "/" && !open && !isTypingTarget(e.target) && !e.metaKey && !e.ctrlKey && !e.altKey) {
                e.preventDefault();
                openPalette();
            }
        };
        const onOpenEvent = () => openPalette();
        window.addEventListener("keydown", onKeyDown);
        window.addEventListener(OPEN_PALETTE_EVENT, onOpenEvent);
        return () => {
            window.removeEventListener("keydown", onKeyDown);
            window.removeEventListener(OPEN_PALETTE_EVENT, onOpenEvent);
        };
    }, [open, close, openPalette]);

    // ── On open: focus the field, lock page scroll, load projects and services once ──
    useEffect(() => {
        if (!open) return;
        inputRef.current?.focus();
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        if (!index) {
            fetch("/api/site-index")
                .then((r) => (r.ok ? r.json() : null))
                .then((data: SiteIndex | null) => setIndex(data ?? { work: [], services: [] }))
                .catch(() => setIndex({ work: [], services: [] }));
        }
        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, [open, index]);

    const go = useCallback(
        (href: string) => () => {
            close();
            router.push(href);
        },
        [close, router],
    );

    const items = useMemo<Item[]>(() => {
        const isDark = resolvedTheme === "dark";
        const pages: Item[] = [
            { id: "p-home", group: "Pages", label: "Home", run: go("/") },
            { id: "p-work", group: "Pages", label: "Work", keywords: "projects case studies portfolio", run: go("/work") },
            { id: "p-services", group: "Pages", label: "Services", run: go("/services") },
            { id: "p-about", group: "Pages", label: "About", keywords: "founder studio team", run: go("/about") },
            ...(showNotes ? [{ id: "p-notes", group: "Pages" as const, label: "Notes", keywords: "blog writing", run: go("/notes") }] : []),
            { id: "p-contact", group: "Pages", label: "Contact", keywords: "email phone", run: go("/contact") },
            { id: "p-colophon", group: "Pages", label: "How this site is built", keywords: "colophon stack", run: go("/colophon") },
        ];
        const work: Item[] = (index?.work ?? []).map((p) => ({
            id: `w-${p.slug}`,
            group: "Work",
            label: p.title,
            run: go(`/work/${p.slug}`),
        }));
        const services: Item[] = (index?.services ?? []).map((s) => ({
            id: `s-${s.slug}`,
            group: "Services",
            label: s.title,
            run: go(`/services/${s.slug}`),
        }));
        const actions: Item[] = [
            { id: "a-brief", group: "Actions", label: "Start a project", hint: "Opens the brief form", keywords: "brief hire quote", run: go("/contact") },
            {
                id: "a-email",
                group: "Actions",
                label: "Copy email address",
                hint: site.email,
                keywords: "mail contact",
                run: async () => {
                    try {
                        await navigator.clipboard.writeText(site.email);
                        setNotice(`Copied ${site.email}`);
                    } catch {
                        setNotice(`Could not copy. The address is ${site.email}`);
                        return;
                    }
                    window.setTimeout(close, 900);
                },
            },
            {
                id: "a-theme",
                group: "Actions",
                label: `Switch to ${isDark ? "light" : "dark"} theme`,
                keywords: "theme dark light mode colour",
                run: () => {
                    setTheme(isDark ? "light" : "dark");
                    close();
                },
            },
        ];
        return [...actions, ...pages, ...work, ...services];
    }, [index, showNotes, resolvedTheme, setTheme, go, close]);

    const results = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return items;
        return items
            .map((item) => {
                const label = item.label.toLowerCase();
                const haystack = `${label} ${item.keywords ?? ""} ${item.group.toLowerCase()}`;
                const score = label.startsWith(q) ? 0 : label.includes(q) ? 1 : haystack.includes(q) ? 2 : -1;
                return { item, score };
            })
            .filter((r) => r.score >= 0)
            .sort((a, b) => a.score - b.score)
            .map((r) => r.item);
    }, [items, query]);

    // Keep the highlighted row valid and visible.
    useEffect(() => {
        if (active >= results.length) setActive(Math.max(0, results.length - 1));
    }, [results.length, active]);
    useEffect(() => {
        listRef.current?.querySelector<HTMLElement>(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
    }, [active]);

    function onInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setActive((i) => (results.length ? (i + 1) % results.length : 0));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActive((i) => (results.length ? (i - 1 + results.length) % results.length : 0));
        } else if (e.key === "Home") {
            e.preventDefault();
            setActive(0);
        } else if (e.key === "End") {
            e.preventDefault();
            setActive(Math.max(0, results.length - 1));
        } else if (e.key === "Enter") {
            e.preventDefault();
            results[active]?.run();
        } else if (e.key === "Escape") {
            e.preventDefault();
            close();
        } else if (e.key === "Tab") {
            // The search field is the only focusable element, which keeps focus inside the dialog.
            e.preventDefault();
        }
    }

    if (!open) return null;

    const activeId = results[active] ? `cmd-${results[active].id}` : undefined;

    return (
        <div className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[14vh]">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={close} aria-hidden="true" />

            <div
                role="dialog"
                aria-modal="true"
                aria-label="Command menu"
                className="relative w-full max-w-xl overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface)] shadow-2xl"
            >
                <div className="flex items-center gap-3 border-b border-[var(--border)] px-4">
                    <span className="h-2 w-2 shrink-0 bg-accent" aria-hidden="true" />
                    <input
                        ref={inputRef}
                        type="text"
                        role="combobox"
                        aria-expanded="true"
                        aria-controls="command-list"
                        aria-activedescendant={activeId}
                        aria-autocomplete="list"
                        aria-label="Search pages, work and actions"
                        placeholder="Search pages, work and actions"
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            setActive(0);
                        }}
                        onKeyDown={onInputKeyDown}
                        className="w-full bg-transparent py-4 font-body text-[15px] text-[var(--text)] placeholder:text-[var(--text-faint)] focus:outline-none"
                    />
                    <kbd className="shrink-0 rounded border border-[var(--border)] px-1.5 py-0.5 font-mono text-[11px] text-[var(--muted)]">Esc</kbd>
                </div>

                <ul ref={listRef} id="command-list" role="listbox" aria-label="Results" className="max-h-[50vh] overflow-y-auto py-2">
                    {results.length === 0 && <li className="px-4 py-6 text-center font-body text-sm text-[var(--muted)]">Nothing matches.</li>}
                    {results.map((item, i) => {
                        const showGroup = i === 0 || results[i - 1].group !== item.group;
                        const selected = i === active;
                        return (
                            <li key={item.id} role="presentation">
                                {showGroup && (
                                    <p className="px-4 pt-3 pb-1 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--muted)]" aria-hidden="true">
                                        {item.group}
                                    </p>
                                )}
                                <div
                                    id={`cmd-${item.id}`}
                                    role="option"
                                    aria-selected={selected}
                                    data-index={i}
                                    onMouseMove={() => setActive(i)}
                                    onClick={() => item.run()}
                                    className={`mx-2 flex cursor-pointer items-center justify-between gap-4 rounded-md px-3 py-2.5 font-body text-sm ${
                                        selected ? "bg-accent/10 text-[var(--text)]" : "text-[var(--text)]"
                                    }`}
                                >
                                    <span className="flex items-center gap-3">
                                        <span className={`h-1.5 w-1.5 ${selected ? "bg-accent" : "bg-transparent"}`} aria-hidden="true" />
                                        {item.label}
                                    </span>
                                    {item.hint && <span className="truncate font-mono text-[11px] text-[var(--muted)]">{item.hint}</span>}
                                </div>
                            </li>
                        );
                    })}
                </ul>

                <div className="flex items-center justify-between gap-4 border-t border-[var(--border)] px-4 py-2 font-mono text-[11px] text-[var(--muted)]">
                    <span aria-live="polite">{notice || "↑ ↓ to move · Enter to open"}</span>
                    {!index && <span>Loading work…</span>}
                </div>
            </div>
        </div>
    );
}
