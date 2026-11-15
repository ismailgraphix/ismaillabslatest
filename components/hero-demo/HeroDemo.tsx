"use client";
// components/hero-demo/HeroDemo.tsx
// The hero's working mini-product: a framed app window with three tabs
// (customers, requests, payments), each a real, clickable view
// over the invented records in ./data.ts.
//
// Until the visitor touches it, a scripted cursor runs one short task per tab
// and loops. Any click, key press or focus inside the frame stops the script and
// hands control over. Under reduced motion the script never starts. The
// component is loaded lazily by components/Hero.tsx, after first paint and only
// on screens wide enough to use it.
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import BarLoader from "@/components/BarLoader";
import {
    customers,
    invoice,
    naira,
    requests,
    totalSpend,
    type OrderStatus,
} from "./data";

type TabId = "customers" | "requests" | "payments";
type PayState = "pending" | "processing" | "paid";

const TABS: { id: TabId; label: string }[] = [
    { id: "customers", label: "Customers" },
    { id: "requests", label: "Requests" },
    { id: "payments", label: "Payments" },
];

const invoiceTotal = invoice.items.reduce((sum, item) => sum + item.amount, 0);

class Aborted extends Error {}

export default function HeroDemo({ autoplay }: { autoplay: boolean }) {
    const frameRef = useRef<HTMLDivElement>(null);
    const tabRefs = useRef<Record<TabId, HTMLButtonElement | null>>({ customers: null, requests: null, payments: null });
    const visibleRef = useRef(true);

    const [tab, setTab] = useState<TabId>("customers");
    const [query, setQuery] = useState("");
    const [customerId, setCustomerId] = useState<string | null>(null);
    const [requestId, setRequestId] = useState<string | null>(null);
    const [payState, setPayState] = useState<PayState>("pending");
    const [receipt, setReceipt] = useState<{ number: string; paidAt: string } | null>(null);

    const [playing, setPlaying] = useState(autoplay);
    const [cursor, setCursor] = useState({ x: 0, y: 0, visible: false, pressed: false });

    // ── Actions shared by the visitor and the script ──
    const pay = useCallback(() => {
        setPayState("processing");
        window.setTimeout(() => {
            const now = new Date();
            setReceipt({
                number: `RCP-${String(now.getTime()).slice(-6)}`,
                paidAt: now.toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }),
            });
            setPayState("paid");
        }, 900);
    }, []);

    const resetPayment = useCallback(() => {
        setPayState("pending");
        setReceipt(null);
    }, []);

    // ── Hand control to the visitor on their first interaction ──
    const takeOver = useCallback(() => {
        setPlaying(false);
        setCursor((c) => ({ ...c, visible: false }));
    }, []);

    // ── Pause the script while the frame is off screen or the tab is hidden ──
    useEffect(() => {
        const el = frameRef.current;
        if (!el || typeof IntersectionObserver === "undefined") return;
        const obs = new IntersectionObserver(([entry]) => {
            visibleRef.current = entry.isIntersecting;
        });
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    // ── The script ──
    useEffect(() => {
        if (!playing) return;
        const controller = new AbortController();
        const { signal } = controller;

        const sleep = (ms: number) =>
            new Promise<void>((resolve, reject) => {
                // Counts down in steps of up to 100 ms, and stops counting while
                // the frame is off screen or the browser tab is hidden.
                const tick = (remaining: number) => {
                    if (signal.aborted) return reject(new Aborted());
                    if (remaining <= 0) return resolve();
                    const paused = !visibleRef.current || document.hidden;
                    const step = Math.min(remaining, 100);
                    window.setTimeout(() => tick(paused ? remaining : remaining - step), step);
                };
                tick(ms);
            });

        const moveTo = async (target: string) => {
            const frame = frameRef.current;
            const el = frame?.querySelector<HTMLElement>(`[data-demo="${target}"]`);
            if (!frame || !el) return;
            const f = frame.getBoundingClientRect();
            const r = el.getBoundingClientRect();
            setCursor({ x: r.left - f.left + Math.min(r.width / 2, 48), y: r.top - f.top + r.height / 2, visible: true, pressed: false });
            await sleep(650);
        };

        const click = async () => {
            setCursor((c) => ({ ...c, pressed: true }));
            await sleep(140);
            setCursor((c) => ({ ...c, pressed: false }));
        };

        const type = async (text: string) => {
            for (let i = 1; i <= text.length; i++) {
                setQuery(text.slice(0, i));
                await sleep(150);
            }
        };

        async function run() {
            await sleep(900); // let the hero heading land first
            for (;;) {
                // Customers: find a customer and open their account.
                await moveTo("tab-customers");
                await click();
                setTab("customers");
                setCustomerId(null);
                setQuery("");
                await sleep(300);
                await moveTo("customer-search");
                await click();
                await type("Fat");
                await sleep(350);
                await moveTo("customer-c3");
                await click();
                setCustomerId("c3");
                await sleep(2400);

                // Requests: open a request's timeline and follow-up tasks.
                await moveTo("tab-requests");
                await click();
                setTab("requests");
                setRequestId(null);
                await sleep(400);
                await moveTo("request-r1");
                await click();
                setRequestId("r1");
                await sleep(2600);

                // Payments: pay a pending invoice and show the receipt.
                await moveTo("tab-payments");
                await click();
                setTab("payments");
                resetPayment();
                await sleep(500);
                await moveTo("pay-button");
                await click();
                pay();
                await sleep(1100);
                await moveTo("receipt");
                await sleep(2400);
            }
        }

        run().catch((err) => {
            if (!(err instanceof Aborted)) console.error(err);
        });
        return () => controller.abort();
    }, [playing, pay, resetPayment]);

    // ── Tabs: arrow keys move between them (WAI-ARIA tabs pattern) ──
    function onTabKeyDown(e: React.KeyboardEvent) {
        const i = TABS.findIndex((t) => t.id === tab);
        let next = -1;
        if (e.key === "ArrowRight") next = (i + 1) % TABS.length;
        if (e.key === "ArrowLeft") next = (i - 1 + TABS.length) % TABS.length;
        if (e.key === "Home") next = 0;
        if (e.key === "End") next = TABS.length - 1;
        if (next < 0) return;
        e.preventDefault();
        const id = TABS[next].id;
        setTab(id);
        tabRefs.current[id]?.focus();
    }

    const filteredCustomers = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return customers;
        return customers.filter((c) => c.name.toLowerCase().includes(q) || c.ref.toLowerCase().includes(q));
    }, [query]);

    const customer = customers.find((c) => c.id === customerId) ?? null;
    const request = requests.find((r) => r.id === requestId) ?? null;

    const listButton = (active: boolean) =>
        `w-full text-left px-3 py-2 rounded border transition-colors duration-[120ms] ${
            active ? "border-accent bg-accent/10" : "border-transparent hover:bg-[var(--chip-bg)]"
        }`;

    return (
        <div
            ref={frameRef}
            onPointerDownCapture={playing ? takeOver : undefined}
            onKeyDownCapture={playing ? takeOver : undefined}
            onFocusCapture={playing ? takeOver : undefined}
            className="relative w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] shadow-[0_24px_60px_-30px_rgb(15_15_15/0.35)] overflow-hidden text-left"
            role="region"
            aria-label="Interactive demo with invented records: customers, requests and payments"
        >
            {/* Title bar */}
            <div className="flex items-center justify-between gap-3 px-4 h-9 border-b border-[var(--border)] bg-[var(--chip-bg)]">
                <div className="flex items-center gap-1.5" aria-hidden="true">
                    <span className="h-2 w-2 bg-[var(--border)]" />
                    <span className="h-2 w-2 bg-[var(--border)]" />
                    <span className="h-2 w-2 bg-accent" />
                </div>
                <span className="font-mono text-[11px] text-[var(--muted)] truncate">Demo Company · Back office</span>
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--text)] border border-[var(--border)] rounded px-1.5 py-0.5 shrink-0">
                    Demo data
                </span>
            </div>

            {/* Tabs */}
            <div role="tablist" aria-label="Demo views" className="flex border-b border-[var(--border)] px-2" onKeyDown={onTabKeyDown}>
                {TABS.map((t) => {
                    const selected = tab === t.id;
                    return (
                        <button
                            key={t.id}
                            ref={(el) => { tabRefs.current[t.id] = el; }}
                            id={`demo-tab-${t.id}`}
                            data-demo={`tab-${t.id}`}
                            role="tab"
                            type="button"
                            aria-selected={selected}
                            aria-controls={`demo-panel-${t.id}`}
                            tabIndex={selected ? 0 : -1}
                            onClick={() => setTab(t.id)}
                            className={`relative px-3 py-3 font-body text-[13px] font-medium transition-colors duration-[120ms] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 rounded-t ${
                                selected ? "text-[var(--text)]" : "text-[var(--muted)] hover:text-[var(--text)]"
                            }`}
                        >
                            {t.label}
                            {selected && <span className="absolute left-3 right-3 -bottom-px h-[2px] bg-accent" aria-hidden="true" />}
                        </button>
                    );
                })}
            </div>

            {/* Panels: fixed height so nothing below the hero moves while the demo plays */}
            <div className="h-[340px] font-body text-[13px] text-[var(--text)]">
                {/* ── Customers ── */}
                {tab === "customers" && (
                    <div role="tabpanel" id="demo-panel-customers" aria-labelledby="demo-tab-customers" className="grid h-full grid-cols-[190px_1fr]">
                        <div className="border-r border-[var(--border)] p-3 overflow-y-auto">
                            <label htmlFor="demo-customer-search" className="sr-only">Search customers by name or customer number</label>
                            <input
                                id="demo-customer-search"
                                data-demo="customer-search"
                                type="search"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search customers"
                                autoComplete="off"
                                className="w-full mb-2 rounded border border-[var(--border)] bg-[var(--app-bg)] px-2.5 py-1.5 text-[13px] placeholder:text-[var(--text-faint)] focus:outline-none focus:border-accent"
                            />
                            <ul className="space-y-1">
                                {filteredCustomers.map((c) => (
                                    <li key={c.id}>
                                        <button
                                            type="button"
                                            data-demo={`customer-${c.id}`}
                                            onClick={() => setCustomerId(c.id)}
                                            aria-pressed={customerId === c.id}
                                            className={listButton(customerId === c.id)}
                                        >
                                            <span className="block font-medium leading-tight">{c.name}</span>
                                            <span className="block font-mono text-[11px] text-[var(--muted)]">{c.ref}</span>
                                        </button>
                                    </li>
                                ))}
                                {filteredCustomers.length === 0 && (
                                    <li className="px-3 py-2 text-[var(--muted)]">No customer matches.</li>
                                )}
                            </ul>
                        </div>

                        <div className="p-4 overflow-y-auto">
                            {customer ? (
                                <CustomerAccount customer={customer} />
                            ) : (
                                <EmptyState>Pick a customer to open their account and orders.</EmptyState>
                            )}
                        </div>
                    </div>
                )}

                {/* ── Requests ── */}
                {tab === "requests" && (
                    <div role="tabpanel" id="demo-panel-requests" aria-labelledby="demo-tab-requests" className="grid h-full grid-cols-[190px_1fr]">
                        <ul className="border-r border-[var(--border)] p-3 space-y-1 overflow-y-auto">
                            {requests.map((r) => (
                                <li key={r.id}>
                                    <button
                                        type="button"
                                        data-demo={`request-${r.id}`}
                                        onClick={() => setRequestId(r.id)}
                                        aria-pressed={requestId === r.id}
                                        className={listButton(requestId === r.id)}
                                    >
                                        <span className="block font-medium leading-tight">{r.title}</span>
                                        <span className="block font-mono text-[11px] text-[var(--muted)]">
                                            {r.ref} · {r.priority}
                                        </span>
                                    </button>
                                </li>
                            ))}
                        </ul>

                        <div className="p-4 overflow-y-auto">
                            {request ? (
                                <div>
                                    <p className="font-heading font-bold text-[15px] leading-tight">{request.title}</p>
                                    <p className="font-mono text-[11px] text-[var(--muted)] mb-3">
                                        {request.team} · {request.customer} · today
                                    </p>

                                    <ol className="relative mb-4 space-y-2 pl-4 before:absolute before:left-[3px] before:top-1 before:bottom-1 before:w-px before:bg-[var(--border)]">
                                        {request.events.map((v) => (
                                            <li key={v.time} className="relative">
                                                <span className="absolute -left-4 top-[5px] h-[7px] w-[7px] bg-accent" aria-hidden="true" />
                                                <span className="font-mono text-[11px] text-[var(--muted)] mr-2">{v.time}</span>
                                                <span className="font-medium">{v.event}</span>
                                                <span className="block text-[12px] text-[var(--muted)]">{v.detail}</span>
                                            </li>
                                        ))}
                                    </ol>

                                    <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--muted)] mb-1.5">Next steps</p>
                                    <ul className="space-y-1.5">
                                        {request.tasks.map((task) => (
                                            <li key={task.title} className="rounded border border-[var(--border)] px-3 py-2">
                                                <span className="block font-medium">{task.title}</span>
                                                <span className="block text-[12px] text-[var(--muted)]">{task.detail}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ) : (
                                <EmptyState>Pick a request to see what happened today and what comes next.</EmptyState>
                            )}
                        </div>
                    </div>
                )}

                {/* ── Payments ── */}
                {tab === "payments" && (
                    <div role="tabpanel" id="demo-panel-payments" aria-labelledby="demo-tab-payments" className="h-full p-4 overflow-y-auto">
                        <div className="flex items-start justify-between gap-4 mb-3">
                            <div>
                                <p className="font-heading font-bold text-[15px] leading-tight">Invoice · {invoice.period}</p>
                                <p className="font-mono text-[11px] text-[var(--muted)]">
                                    {invoice.number} · {invoice.payer} · {invoice.reference}
                                </p>
                            </div>
                            <span
                                className={`shrink-0 font-mono text-[10px] uppercase tracking-[0.14em] rounded px-2 py-1 border ${
                                    payState === "paid" ? "bg-accent text-white border-accent" : "border-[var(--border)] text-[var(--muted)]"
                                }`}
                            >
                                {payState === "paid" ? "Paid" : payState === "processing" ? "Confirming" : "Pending"}
                            </span>
                        </div>

                        <table className="w-full mb-3">
                            <caption className="sr-only">Invoice items</caption>
                            <tbody>
                                {invoice.items.map((item) => (
                                    <tr key={item.label} className="border-b border-[var(--border)]">
                                        <td className="py-1.5">{item.label}</td>
                                        <td className="py-1.5 text-right font-mono tabular-nums">{naira.format(item.amount)}</td>
                                    </tr>
                                ))}
                                <tr>
                                    <th scope="row" className="pt-2 text-left font-semibold">Total</th>
                                    <td className="pt-2 text-right font-mono font-medium tabular-nums">{naira.format(invoiceTotal)}</td>
                                </tr>
                            </tbody>
                        </table>

                        {payState === "pending" && (
                            <button
                                type="button"
                                data-demo="pay-button"
                                onClick={pay}
                                className="btn-wipe w-full rounded-md bg-accent text-white font-semibold py-2.5 hover:text-[var(--app-bg)]"
                            >
                                Pay {naira.format(invoiceTotal)}
                            </button>
                        )}
                        {payState === "processing" && (
                            <p className="flex items-center justify-center gap-2 rounded-md border border-[var(--border)] py-2.5 text-[var(--muted)]">
                                <BarLoader label="" size={12} className="text-accent" />
                                Confirming payment
                            </p>
                        )}
                        {payState === "paid" && receipt && (
                            <div data-demo="receipt" className="rounded-md border border-accent/40 bg-accent/[0.06] px-3 py-2.5">
                                <p className="font-medium">Receipt {receipt.number}</p>
                                <p className="text-[12px] text-[var(--muted)]">
                                    Paid {receipt.paidAt} · Card (demo) · sent to the customer&apos;s email
                                </p>
                                <button
                                    type="button"
                                    onClick={resetPayment}
                                    className="mt-2 font-semibold text-[12px] text-[var(--accent-text)] hover:text-[var(--text)] transition-colors"
                                >
                                    Start again
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Status line */}
            <div className="flex items-center justify-between gap-3 px-4 h-8 border-t border-[var(--border)] font-mono text-[11px] text-[var(--muted)]">
                <span>{playing ? "Playing a short tour. Click anywhere to take over." : "Your turn: everything here is clickable."}</span>
                <span aria-hidden="true">{TABS.findIndex((t) => t.id === tab) + 1}/3</span>
            </div>

            {/* The scripted cursor */}
            <svg
                aria-hidden="true"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                className="pointer-events-none absolute left-0 top-0 z-10 drop-shadow-sm"
                style={{
                    opacity: cursor.visible ? 1 : 0,
                    transform: `translate(${cursor.x}px, ${cursor.y}px) scale(${cursor.pressed ? 0.85 : 1})`,
                    transition: "transform 600ms cubic-bezier(0.2,0,0,1), opacity 240ms ease",
                }}
            >
                <path d="M2 1.5 L2 16 L6 12.2 L8.8 18 L11.4 16.8 L8.7 11.2 L14 11.2 Z" fill="rgb(15 15 15)" stroke="#fff" strokeWidth="1.2" strokeLinejoin="round" />
            </svg>
        </div>
    );
}

function EmptyState({ children }: { children: React.ReactNode }) {
    return (
        <div className="h-full flex flex-col items-center justify-center text-center text-[var(--muted)] gap-3">
            <span className="h-2 w-2 bg-accent" aria-hidden="true" />
            <p className="max-w-[220px]">{children}</p>
        </div>
    );
}

const statusStyle: Record<OrderStatus, string> = {
    Delivered: "text-[var(--muted)]",
    "In transit": "text-[var(--accent-text)]",
    Processing: "text-[var(--text)]",
    Refunded: "text-[var(--text-faint)] line-through",
};

function CustomerAccount({ customer }: { customer: (typeof customers)[number] }) {
    const spend = totalSpend(customer.orders);
    const counted = customer.orders.filter((o) => o.status !== "Refunded").length;
    return (
        <div>
            <p className="font-heading font-bold text-[15px] leading-tight">{customer.name}</p>
            <p className="font-mono text-[11px] text-[var(--muted)] mb-3">
                {customer.account} account · {customer.city} · customer since {customer.since}
            </p>
            <table className="w-full mb-3">
                <caption className="sr-only">Recent orders for {customer.name}</caption>
                <thead>
                    <tr className="font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--muted)] border-b border-[var(--border)]">
                        <th scope="col" className="pb-1.5 text-left font-normal">Order</th>
                        <th scope="col" className="pb-1.5 text-right font-normal">Items</th>
                        <th scope="col" className="pb-1.5 text-right font-normal">Amount</th>
                        <th scope="col" className="pb-1.5 text-right font-normal">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {customer.orders.map((o) => (
                        <tr key={o.number} className="border-b border-[var(--border)]">
                            <td className="py-1.5">
                                <span className="font-mono text-[11px] text-[var(--muted)] mr-2">{o.date}</span>
                                {o.number}
                            </td>
                            <td className="py-1.5 text-right font-mono tabular-nums">{o.items}</td>
                            <td className="py-1.5 text-right font-mono tabular-nums">{naira.format(o.amount)}</td>
                            <td className={`py-1.5 text-right text-[12px] font-medium ${statusStyle[o.status]}`}>{o.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="flex items-baseline justify-between rounded border border-[var(--border)] px-3 py-2">
                <span className="text-[var(--muted)]">Total spend, from {counted} orders</span>
                <span className="font-mono font-medium text-[15px] tabular-nums">{naira.format(spend)}</span>
            </div>
        </div>
    );
}
