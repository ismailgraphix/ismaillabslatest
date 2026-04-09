"use client";
// app/admin/analytics/page.tsx

import { useEffect, useState } from "react";

// ── Types ─────────────────────────────────────────────────────────────────
interface Stats { total: number; today: number; month: number; unique: number }
interface Daily { date: string; views: number }
interface TopPage { path: string; views: number }
interface TopRef { referrer: string | null; visits: number }
interface TopCountry { country: string | null; visits: number }

interface AnalyticsData {
    stats: Stats;
    daily: Daily[];
    topPages: TopPage[];
    topReferrers: TopRef[];
    topCountries: TopCountry[];
}

// ── Country flag emoji helper ─────────────────────────────────────────────
const COUNTRY_FLAGS: Record<string, string> = {
    "United States": "🇺🇸", "Nigeria": "🇳🇬", "United Kingdom": "🇬🇧",
    "Canada": "🇨🇦", "Germany": "🇩🇪", "France": "🇫🇷", "India": "🇮🇳",
    "Australia": "🇦🇺", "Brazil": "🇧🇷", "Netherlands": "🇳🇱",
    "Sweden": "🇸🇪", "Norway": "🇳🇴", "Singapore": "🇸🇬",
    "South Africa": "🇿🇦", "Kenya": "🇰🇪", "Ghana": "🇬🇭",
    "Japan": "🇯🇵", "China": "🇨🇳", "Russia": "🇷🇺", "Italy": "🇮🇹",
    "Spain": "🇪🇸", "Mexico": "🇲🇽", "Argentina": "🇦🇷", "Local": "🖥️",
};
function flag(country: string | null) {
    if (!country) return "🌍";
    return COUNTRY_FLAGS[country] ?? "🌍";
}

// ── Sparkline bar chart ───────────────────────────────────────────────────
function BarChart({ data }: { data: Daily[] }) {
    const days: Daily[] = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const key = d.toISOString().split("T")[0];
        const found = data.find(p => p.date === key);
        days.push({ date: key, views: found?.views ?? 0 });
    }
    const max = Math.max(...days.map(d => d.views), 1);

    return (
        <div className="flex items-end gap-1.5 h-28 w-full">
            {days.map((day, i) => {
                const pct = Math.max((day.views / max) * 100, 3);
                const label = new Date(day.date + "T12:00:00").toLocaleDateString("en-US", { weekday: "short" });
                const isToday = i === 6;
                return (
                    <div key={day.date} className="flex-1 flex flex-col items-center gap-1.5 group cursor-default">
                        <div className="w-full flex items-end justify-center" style={{ height: "88px" }}>
                            <div
                                className="w-full rounded-sm relative transition-all duration-300"
                                style={{
                                    height: `${pct}%`,
                                    background: isToday
                                        ? "#4353FF"
                                        : "rgba(67,83,255,0.25)",
                                }}
                            >
                                <div className="absolute -top-9 left-1/2 -translate-x-1/2 bg-[#1a1a1a] border border-white/10 text-white text-[10px] font-body px-2 py-1 rounded-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-xl">
                                    {day.views} view{day.views !== 1 ? "s" : ""}
                                </div>
                                {/* hover highlight */}
                                <div className="absolute inset-0 rounded-sm bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        </div>
                        <span className={`text-[10px] font-body transition-colors ${isToday ? "text-[#4353FF] font-bold" : "text-gray-700 group-hover:text-gray-400"}`}>
                            {label}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}

// ── Animated count-up number ──────────────────────────────────────────────
function CountUp({ value }: { value: number }) {
    const [display, setDisplay] = useState(0);
    useEffect(() => {
        const duration = 800;
        const steps = 40;
        const increment = value / steps;
        let current = 0;
        let step = 0;
        const timer = setInterval(() => {
            step++;
            current = Math.min(current + increment, value);
            setDisplay(Math.floor(current));
            if (step >= steps) clearInterval(timer);
        }, duration / steps);
        return () => clearInterval(timer);
    }, [value]);
    return <>{display.toLocaleString()}</>;
}

// ── Stat card ─────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, accent, icon }: {
    label: string; value: number; sub: string; accent: string; icon: React.ReactNode;
}) {
    return (
        <div className="relative bg-[#111] border border-white/[0.06] p-5 overflow-hidden group hover:border-white/[0.12] transition-all duration-300">
            {/* Glow */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: `radial-gradient(circle at top left, ${accent}08 0%, transparent 60%)` }} />

            <div className="relative">
                <div className="flex items-start justify-between mb-4">
                    <div className="w-8 h-8 flex items-center justify-center rounded-sm"
                        style={{ background: `${accent}15`, color: accent }}>
                        {icon}
                    </div>
                    <div className="h-0.5 w-6 rounded-full mt-4" style={{ background: accent }} />
                </div>
                <p className="font-heading font-black text-white text-3xl mb-0.5">
                    <CountUp value={value} />
                </p>
                <p className="font-body text-[11px] text-gray-500 uppercase tracking-widest">{label}</p>
                <p className="font-body text-[10px] text-gray-700 mt-0.5">{sub}</p>
            </div>
        </div>
    );
}

// ── Section header ────────────────────────────────────────────────────────
function SectionHead({ title, sub }: { title: string; sub: string }) {
    return (
        <div className="flex items-center justify-between mb-5">
            <h2 className="font-heading font-black text-white text-xs uppercase tracking-[0.15em]">{title}</h2>
            <span className="font-body text-[10px] text-gray-600 uppercase tracking-wider">{sub}</span>
        </div>
    );
}

// ── Horizontal progress row ───────────────────────────────────────────────
function ProgressRow({ label, value, max, accent = "#4353FF", prefix }: {
    label: string; value: number; max: number; accent?: string; prefix?: string;
}) {
    const pct = Math.round((value / Math.max(max, 1)) * 100);
    return (
        <div className="group">
            <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2 min-w-0">
                    {prefix && <span className="text-sm flex-shrink-0">{prefix}</span>}
                    <span className="font-body text-xs text-gray-300 truncate">{label}</span>
                </div>
                <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                    <span className="font-body text-[10px] text-gray-600">{pct}%</span>
                    <span className="font-heading font-bold text-white text-xs">{value.toLocaleString()}</span>
                </div>
            </div>
            <div className="h-0.5 bg-white/[0.05] rounded-full overflow-hidden">
                <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${pct}%`, background: accent }}
                />
            </div>
        </div>
    );
}

// ── Skeleton loader ───────────────────────────────────────────────────────
function Skeleton({ className }: { className?: string }) {
    return <div className={`animate-pulse bg-white/[0.04] rounded-sm ${className}`} />;
}

// ── Main page ─────────────────────────────────────────────────────────────
export default function AnalyticsPage() {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    async function load() {
        try {
            const r = await fetch("/api/admin/analytics");
            const d = await r.json();
            if (d.error) { setError(d.error); return; }
            setData(d);
            setLastUpdated(new Date());
        } catch {
            setError("Failed to load analytics data.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { load(); }, []);

    const maxPage = Math.max(...(data?.topPages.map(p => p.views) ?? [1]), 1);
    const maxCountry = Math.max(...(data?.topCountries.map(c => c.visits) ?? [1]), 1);
    const maxRef = Math.max(...(data?.topReferrers.map(r => r.visits) ?? [1]), 1);

    return (
        <>
            {/* ── Header ── */}
            <div className="sticky top-0 z-10 bg-[#0a0a0a]/95 backdrop-blur border-b border-white/[0.06] px-8 py-4 flex items-center justify-between">
                <div>
                    <h1 className="font-heading font-black text-white text-xl uppercase tracking-tight">Analytics</h1>
                    <p className="font-body text-gray-500 text-xs mt-0.5">
                        Public page views · tracked in real time
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    {lastUpdated && (
                        <span className="font-body text-[11px] text-gray-700">
                            Updated {lastUpdated.toLocaleTimeString()}
                        </span>
                    )}
                    <button onClick={load}
                        className="flex items-center gap-1.5 font-body text-xs text-gray-400 hover:text-white border border-white/[0.08] hover:border-white/20 px-3 py-1.5 rounded-sm transition-all">
                        <svg width="11" height="11" viewBox="0 0 14 14" fill="none">
                            <path d="M13 2v4H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M1 7a6 6 0 0110.5-4L13 6M1 12v-4h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M13 7a6 6 0 01-10.5 4L1 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Refresh
                    </button>
                </div>
            </div>

            <div className="p-8 space-y-6">

                {/* ── Error ── */}
                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-body px-4 py-3 rounded-sm">
                        {error}
                    </div>
                )}

                {/* ── Stat cards ── */}
                {loading ? (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="bg-[#111] border border-white/[0.06] p-5 space-y-3">
                                <Skeleton className="w-8 h-8" />
                                <Skeleton className="w-16 h-7" />
                                <Skeleton className="w-24 h-2" />
                            </div>
                        ))}
                    </div>
                ) : data && (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatCard
                            label="Total Views" value={data.stats.total} sub="All time"
                            accent="#4353FF"
                            icon={<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M1 8s3-5 7-5 7 5 7 5-3 5-7 5-7-5-7-5z" stroke="currentColor" strokeWidth="1.5" /><circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.5" /></svg>}
                        />
                        <StatCard
                            label="Today" value={data.stats.today} sub="Since midnight"
                            accent="#10b981"
                            icon={<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" /><path d="M8 5v3l2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>}
                        />
                        <StatCard
                            label="This Month" value={data.stats.month} sub="Last 30 days"
                            accent="#8b5cf6"
                            icon={<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><rect x="2" y="3" width="12" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.5" /><path d="M5 1v3M11 1v3M2 7h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>}
                        />
                        <StatCard
                            label="Unique Visitors" value={data.stats.unique} sub="By IP · 30 days"
                            accent="#f59e0b"
                            icon={<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="6" cy="5" r="3" stroke="currentColor" strokeWidth="1.5" /><path d="M1 14c0-2.8 2.2-5 5-5s5 2.2 5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><path d="M12 7l1.5 1.5L16 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                        />
                    </div>
                )}

                {/* ── Chart row ── */}
                {loading ? (
                    <div className="grid lg:grid-cols-2 gap-4">
                        <div className="bg-[#111] border border-white/[0.06] p-6 space-y-4">
                            <Skeleton className="w-32 h-3" />
                            <Skeleton className="w-full h-28" />
                        </div>
                        <div className="bg-[#111] border border-white/[0.06] p-6 space-y-3">
                            <Skeleton className="w-24 h-3" />
                            {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="w-full h-6" />)}
                        </div>
                    </div>
                ) : data && (
                    <div className="grid lg:grid-cols-2 gap-4">
                        {/* Bar chart */}
                        <div className="bg-[#111] border border-white/[0.06] p-6">
                            <SectionHead title="Last 7 Days" sub="Daily views" />
                            {data.daily.length === 0 && data.stats.total === 0 ? (
                                <div className="h-28 flex items-center justify-center text-gray-700 text-sm font-body">
                                    No data yet
                                </div>
                            ) : (
                                <BarChart data={data.daily} />
                            )}
                            <div className="flex items-center gap-3 mt-4 pt-4 border-t border-white/[0.04]">
                                <div className="flex items-center gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-sm bg-[#4353FF]" />
                                    <span className="font-body text-[10px] text-gray-600">Today</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-sm bg-[#4353FF]/25" />
                                    <span className="font-body text-[10px] text-gray-600">Previous days</span>
                                </div>
                            </div>
                        </div>

                        {/* Top pages */}
                        <div className="bg-[#111] border border-white/[0.06] p-6">
                            <SectionHead title="Top Pages" sub="Last 30 days" />
                            {data.topPages.length === 0 ? (
                                <div className="h-28 flex items-center justify-center text-gray-700 text-sm font-body">No data yet</div>
                            ) : (
                                <div className="space-y-4">
                                    {data.topPages.map((page, i) => (
                                        <ProgressRow
                                            key={page.path}
                                            label={page.path}
                                            value={page.views}
                                            max={maxPage}
                                            accent="#4353FF"
                                            prefix={`${i + 1}`}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ── Countries + Referrers row ── */}
                {loading ? (
                    <div className="grid lg:grid-cols-2 gap-4">
                        {[0, 1].map(i => (
                            <div key={i} className="bg-[#111] border border-white/[0.06] p-6 space-y-3">
                                <Skeleton className="w-28 h-3" />
                                {Array.from({ length: 5 }).map((_, j) => <Skeleton key={j} className="w-full h-6" />)}
                            </div>
                        ))}
                    </div>
                ) : data && (
                    <div className="grid lg:grid-cols-2 gap-4">

                        {/* Countries */}
                        <div className="bg-[#111] border border-white/[0.06] p-6">
                            <SectionHead title="Countries" sub="Last 30 days" />
                            {data.topCountries.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-8 text-center">
                                    <span className="text-3xl mb-2">🌍</span>
                                    <p className="font-body text-gray-700 text-xs">No country data yet</p>
                                    <p className="font-body text-gray-800 text-[10px] mt-1">Countries are resolved from visitor IPs</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {data.topCountries.map((c, i) => (
                                        <ProgressRow
                                            key={`${c.country}-${i}`}
                                            label={c.country ?? "Unknown"}
                                            value={c.visits}
                                            max={maxCountry}
                                            accent="#10b981"
                                            prefix={flag(c.country)}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Referrers */}
                        <div className="bg-[#111] border border-white/[0.06] p-6">
                            <SectionHead title="Traffic Sources" sub="Last 30 days" />
                            {data.topReferrers.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-8 text-center">
                                    <span className="text-3xl mb-2">🔗</span>
                                    <p className="font-body text-gray-700 text-xs">No referrer data yet</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {data.topReferrers.map((ref, i) => {
                                        let label = "Direct / None";
                                        if (ref.referrer) {
                                            try { label = new URL(ref.referrer).hostname; }
                                            catch { label = ref.referrer; }
                                        }
                                        return (
                                            <ProgressRow
                                                key={i}
                                                label={label}
                                                value={ref.visits}
                                                max={maxRef}
                                                accent="#8b5cf6"
                                                prefix={ref.referrer ? "↗" : "→"}
                                            />
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ── Empty state ── */}
                {!loading && data && data.stats.total === 0 && (
                    <div className="border border-dashed border-[#4353FF]/20 bg-[#4353FF]/[0.03] p-10 text-center rounded-sm">
                        <div className="w-12 h-12 bg-[#4353FF]/10 border border-[#4353FF]/20 rounded-sm flex items-center justify-center mx-auto mb-4">
                            <svg width="20" height="20" viewBox="0 0 16 16" fill="none" className="text-[#4353FF]">
                                <path d="M1 8s3-5 7-5 7 5 7 5-3 5-7 5-7-5-7-5z" stroke="currentColor" strokeWidth="1.5" />
                                <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.5" />
                            </svg>
                        </div>
                        <p className="font-heading font-black text-white text-base mb-1">No views recorded yet</p>
                        <p className="font-body text-gray-500 text-sm">
                            Visit your public site to start tracking.
                            Make sure <code className="text-[#4353FF] bg-[#4353FF]/10 px-1.5 py-0.5 rounded text-xs mx-1">PageViewTracker</code>
                            is in your public layout.
                        </p>
                    </div>
                )}
            </div>
        </>
    );
}