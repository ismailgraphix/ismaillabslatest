"use client";
// components/hero-demo/HeroDemo.tsx
// The hero's working mini-product: a framed app window with three tabs
// (student portal, hospital records, payments), each a real, clickable view
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
    classFor,
    gpaFor,
    gradeFor,
    invoice,
    naira,
    patients,
    students,
} from "./data";

type TabId = "students" | "hospital" | "payments";
type PayState = "pending" | "processing" | "paid";

const TABS: { id: TabId; label: string }[] = [
    { id: "students", label: "Student portal" },
    { id: "hospital", label: "Hospital records" },
    { id: "payments", label: "Payments" },
];

const invoiceTotal = invoice.items.reduce((sum, item) => sum + item.amount, 0);

class Aborted extends Error {}

export default function HeroDemo({ autoplay }: { autoplay: boolean }) {
    const frameRef = useRef<HTMLDivElement>(null);
    const tabRefs = useRef<Record<TabId, HTMLButtonElement | null>>({ students: null, hospital: null, payments: null });
    const visibleRef = useRef(true);

    const [tab, setTab] = useState<TabId>("students");
    const [query, setQuery] = useState("");
    const [studentId, setStudentId] = useState<string | null>(null);
    const [patientId, setPatientId] = useState<string | null>(null);
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
                // Student portal: find a student and open the result sheet.
                await moveTo("tab-students");
                await click();
                setTab("students");
                setStudentId(null);
                setQuery("");
                await sleep(300);
                await moveTo("student-search");
                await click();
                await type("Fat");
                await sleep(350);
                await moveTo("student-s3");
                await click();
                setStudentId("s3");
                await sleep(2400);

                // Hospital records: open a patient's visit and prescription.
                await moveTo("tab-hospital");
                await click();
                setTab("hospital");
                setPatientId(null);
                await sleep(400);
                await moveTo("patient-p1");
                await click();
                setPatientId("p1");
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

    const filteredStudents = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return students;
        return students.filter((s) => s.name.toLowerCase().includes(q) || s.matric.toLowerCase().includes(q));
    }, [query]);

    const student = students.find((s) => s.id === studentId) ?? null;
    const patient = patients.find((p) => p.id === patientId) ?? null;

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
            aria-label="Interactive demo with invented records: student portal, hospital records and payments"
        >
            {/* Title bar */}
            <div className="flex items-center justify-between gap-3 px-4 h-9 border-b border-[var(--border)] bg-[var(--chip-bg)]">
                <div className="flex items-center gap-1.5" aria-hidden="true">
                    <span className="h-2 w-2 bg-[var(--border)]" />
                    <span className="h-2 w-2 bg-[var(--border)]" />
                    <span className="h-2 w-2 bg-accent" />
                </div>
                <span className="font-mono text-[11px] text-[var(--muted)] truncate">Demo University · Demo Hospital</span>
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
                {/* ── Student portal ── */}
                {tab === "students" && (
                    <div role="tabpanel" id="demo-panel-students" aria-labelledby="demo-tab-students" className="grid h-full grid-cols-[190px_1fr]">
                        <div className="border-r border-[var(--border)] p-3 overflow-y-auto">
                            <label htmlFor="demo-student-search" className="sr-only">Search students by name or matric number</label>
                            <input
                                id="demo-student-search"
                                data-demo="student-search"
                                type="search"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search students"
                                autoComplete="off"
                                className="w-full mb-2 rounded border border-[var(--border)] bg-[var(--app-bg)] px-2.5 py-1.5 text-[13px] placeholder:text-[var(--text-faint)] focus:outline-none focus:border-accent"
                            />
                            <ul className="space-y-1">
                                {filteredStudents.map((s) => (
                                    <li key={s.id}>
                                        <button
                                            type="button"
                                            data-demo={`student-${s.id}`}
                                            onClick={() => setStudentId(s.id)}
                                            aria-pressed={studentId === s.id}
                                            className={listButton(studentId === s.id)}
                                        >
                                            <span className="block font-medium leading-tight">{s.name}</span>
                                            <span className="block font-mono text-[11px] text-[var(--muted)]">{s.matric}</span>
                                        </button>
                                    </li>
                                ))}
                                {filteredStudents.length === 0 && (
                                    <li className="px-3 py-2 text-[var(--muted)]">No student matches.</li>
                                )}
                            </ul>
                        </div>

                        <div className="p-4 overflow-y-auto">
                            {student ? (
                                <ResultSheet student={student} />
                            ) : (
                                <EmptyState>Pick a student to open their result sheet.</EmptyState>
                            )}
                        </div>
                    </div>
                )}

                {/* ── Hospital records ── */}
                {tab === "hospital" && (
                    <div role="tabpanel" id="demo-panel-hospital" aria-labelledby="demo-tab-hospital" className="grid h-full grid-cols-[190px_1fr]">
                        <ul className="border-r border-[var(--border)] p-3 space-y-1 overflow-y-auto">
                            {patients.map((p) => (
                                <li key={p.id}>
                                    <button
                                        type="button"
                                        data-demo={`patient-${p.id}`}
                                        onClick={() => setPatientId(p.id)}
                                        aria-pressed={patientId === p.id}
                                        className={listButton(patientId === p.id)}
                                    >
                                        <span className="block font-medium leading-tight">{p.name}</span>
                                        <span className="block font-mono text-[11px] text-[var(--muted)]">
                                            {p.hospitalNo} · {p.age}{p.sex}
                                        </span>
                                    </button>
                                </li>
                            ))}
                        </ul>

                        <div className="p-4 overflow-y-auto">
                            {patient ? (
                                <div>
                                    <p className="font-heading font-bold text-[15px] leading-tight">{patient.name}</p>
                                    <p className="font-mono text-[11px] text-[var(--muted)] mb-3">{patient.clinic} · today</p>

                                    <ol className="relative mb-4 space-y-2 pl-4 before:absolute before:left-[3px] before:top-1 before:bottom-1 before:w-px before:bg-[var(--border)]">
                                        {patient.visits.map((v) => (
                                            <li key={v.time} className="relative">
                                                <span className="absolute -left-4 top-[5px] h-[7px] w-[7px] bg-accent" aria-hidden="true" />
                                                <span className="font-mono text-[11px] text-[var(--muted)] mr-2">{v.time}</span>
                                                <span className="font-medium">{v.event}</span>
                                                <span className="block text-[12px] text-[var(--muted)]">{v.detail}</span>
                                            </li>
                                        ))}
                                    </ol>

                                    <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--muted)] mb-1.5">Prescription</p>
                                    <ul className="space-y-1.5">
                                        {patient.prescriptions.map((rx) => (
                                            <li key={rx.drug} className="rounded border border-[var(--border)] px-3 py-2">
                                                <span className="block font-medium">{rx.drug}</span>
                                                <span className="block text-[12px] text-[var(--muted)]">
                                                    {rx.dose} · {rx.frequency} · {rx.duration}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ) : (
                                <EmptyState>Pick a patient to see today&apos;s visit and prescription.</EmptyState>
                            )}
                        </div>
                    </div>
                )}

                {/* ── Payments ── */}
                {tab === "payments" && (
                    <div role="tabpanel" id="demo-panel-payments" aria-labelledby="demo-tab-payments" className="h-full p-4 overflow-y-auto">
                        <div className="flex items-start justify-between gap-4 mb-3">
                            <div>
                                <p className="font-heading font-bold text-[15px] leading-tight">School fees · {invoice.session}</p>
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
                                className="w-full rounded-md bg-accent text-white font-semibold py-2.5 hover:bg-[var(--text)] hover:text-[var(--app-bg)] transition-colors duration-[180ms]"
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
                                    Paid {receipt.paidAt} · Card (demo) · sent to the student&apos;s email
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

function ResultSheet({ student }: { student: (typeof students)[number] }) {
    const gpa = gpaFor(student.results);
    const units = student.results.reduce((sum, r) => sum + r.units, 0);
    return (
        <div>
            <p className="font-heading font-bold text-[15px] leading-tight">{student.name}</p>
            <p className="font-mono text-[11px] text-[var(--muted)] mb-3">
                {student.programme} · {student.level} level · {student.session}
            </p>
            <table className="w-full mb-3">
                <caption className="sr-only">Result sheet for {student.name}</caption>
                <thead>
                    <tr className="font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--muted)] border-b border-[var(--border)]">
                        <th scope="col" className="pb-1.5 text-left font-normal">Course</th>
                        <th scope="col" className="pb-1.5 text-right font-normal">Units</th>
                        <th scope="col" className="pb-1.5 text-right font-normal">Score</th>
                        <th scope="col" className="pb-1.5 text-right font-normal">Grade</th>
                    </tr>
                </thead>
                <tbody>
                    {student.results.map((r) => (
                        <tr key={r.code} className="border-b border-[var(--border)]">
                            <td className="py-1.5">
                                <span className="font-mono text-[11px] text-[var(--muted)] mr-2">{r.code}</span>
                                {r.title}
                            </td>
                            <td className="py-1.5 text-right font-mono tabular-nums">{r.units}</td>
                            <td className="py-1.5 text-right font-mono tabular-nums">{r.score}</td>
                            <td className="py-1.5 text-right font-mono font-medium">{gradeFor(r.score).grade}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="flex items-baseline justify-between rounded border border-[var(--border)] px-3 py-2">
                <span className="text-[var(--muted)]">GPA, from {units} units</span>
                <span>
                    <span className="font-mono font-medium text-[15px] tabular-nums">{gpa.toFixed(2)}</span>
                    <span className="text-[var(--muted)]"> · {classFor(gpa)}</span>
                </span>
            </div>
        </div>
    );
}
