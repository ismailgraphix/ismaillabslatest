"use client";
// app/admin/analytics/page.tsx
import { useEffect, useState } from "react";

interface Stats {
    total: number;
    today: number;
    month: number;
    unique: number;
}

interface DailyPoint {
    date: string;   // "2024-04-10"
    views: number;
}

interface TopPage {
    path: string;
    views: number;
}

interface TopReferrer {
    referrer: string | null;
    visits: number;
}

interface AnalyticsData {
    stats: Stats;
    daily: DailyPoint[];
    topPages: TopPage[];
    topReferrers: TopReferrer[];
}

// ── Tiny bar chart (pure CSS, no library needed) ──────────────────────────
function BarChart({ data }: { data: DailyPoint[] }) {
    const max = Math.max(...data.map(d => d.views), 1);

    // Fill missing days so we always show 7 bars
    const days: DailyPoint[] = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const key = d.toISOString().split("T")[0];
        const found = data.find(p => p.date === key);
        days.push({ date: key, views: found?.views ?? 0 });
    }

    return (
        <div className="flex items-end gap-2 h-32 w-full">
            {days.map(day => {
                const pct = Math.round((day.views / max) * 100);
                const label = new Date(day.date + "T12:00:00").toLocaleDateString("en-US", { weekday: "short" });
                return (
                    <div key={day.date} className="flex-1 flex flex-col items-center gap-1.5 group">
                        <div className="relative w-full flex items-end" style={{ height: "96px" }}>
                            <div
                                className="w-full bg-[#4353FF]/30 group-hover:bg-[#4353FF] transition-all duration-300 rounded-sm relative"
                                style={{ height: `${Math.max(pct, 4)}%` }}
                            >
                                {/* Tooltip */}
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#1a1a1a] border border-white/10 text-white text-[10px] font-body px-2 py-1 rounded-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                    {day.views} view{day.views !== 1 ? "s" : ""}
                                </div>
                            </div>
                        </div>
                        <span className="text-[10px] font-body text-gray-600 group-hover:text-gray-400 transition-colors">{label}</span>
                    </div>
                );
            })}
        </div>
    );
}

// ── Stat card ─────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, color }: { label: string; value: number; sub?: string; color: string }) {
    return (
        <div className="bg-[#111] border border-white/[0.06] p-5 rounded-sm">
            <p className="font-body text-[11px] text-gray-500 uppercase tracking-widest mb-3">{label}</p>
            <p className="font-heading font-black text-white text-4xl">{value.toLocaleString()}</p>
            {sub && <p className="font-body text-[11px] text-gray-600 mt-1">{sub}</p>}
            <div className="mt-4 h-0.5 w-8 rounded-full" style={{ background: color }} />
        </div>
    );
}

export default function AnalyticsPage() {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetch("/api/admin/analytics")
            .then(r => r.json())
            .then(d => {
                if (d.error) { setError(d.error); return; }
                setData(d);
            })
            .catch(() => setError("Failed to load analytics"))
            .finally(() => setLoading(false));
    }, []);

    const maxPageViews = Math.max(...(data?.topPages.map(p => p.views) ?? [1]), 1);

    return (
        <>
            {/* Header */}
            <div className="sticky top-0 z-10 bg-[#0a0a0a]/95 backdrop-blur border-b border-white/[0.06] px-8 py-4 flex items-center justify-between">
                <div>
                    <h1 className="font-heading font-black text-white text-xl uppercase tracking-tight">Analytics</h1>
                    <p className="font-body text-gray-500 text-xs mt-0.5">
                        Public page views tracked on your site
                    </p>
                </div>
                <div className="font-body text-[11px] text-gray-600 bg-white/[0.03] border border-white/[0.06] px-3 py-1.5 rounded-sm">
                    Last updated: {new Date().toLocaleTimeString()}
                </div>
            </div>

            <div className="p-8 space-y-6">
                {loading && (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="bg-[#111] border border-white/[0.06] p-5 rounded-sm animate-pulse">
                                <div className="h-2 bg-white/[0.04] rounded w-24 mb-4" />
                                <div className="h-8 bg-white/[0.06] rounded w-16" />
                            </div>
                        ))}
                    </div>
                )}

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-body px-4 py-3 rounded-sm">
                        {error}
                    </div>
                )}

                {data && (
                    <>
                        {/* Stat cards */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <StatCard label="Total Views" value={data.stats.total} sub="All time" color="#4353FF" />
                            <StatCard label="Today" value={data.stats.today} sub="Since midnight" color="#10b981" />
                            <StatCard label="This Month" value={data.stats.month} sub="Last 30 days" color="#8b5cf6" />
                            <StatCard label="Unique Visitors" value={data.stats.unique} sub="Last 30 days (by IP)" color="#f59e0b" />
                        </div>

                        {/* Chart + Top Pages side by side */}
                        <div className="grid lg:grid-cols-2 gap-4">
                            {/* 7-day bar chart */}
                            <div className="bg-[#111] border border-white/[0.06] rounded-sm p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="font-heading font-black text-white text-sm uppercase tracking-wider">Last 7 Days</h2>
                                    <span className="font-body text-[11px] text-gray-600">Daily views</span>
                                </div>
                                {data.daily.length === 0 ? (
                                    <div className="h-32 flex items-center justify-center text-gray-700 text-sm font-body">
                                        No data yet
                                    </div>
                                ) : (
                                    <BarChart data={data.daily} />
                                )}
                            </div>

                            {/* Top pages */}
                            <div className="bg-[#111] border border-white/[0.06] rounded-sm p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="font-heading font-black text-white text-sm uppercase tracking-wider">Top Pages</h2>
                                    <span className="font-body text-[11px] text-gray-600">Last 30 days</span>
                                </div>
                                {data.topPages.length === 0 ? (
                                    <div className="flex items-center justify-center h-32 text-gray-700 text-sm font-body">
                                        No data yet
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {data.topPages.map((page, i) => (
                                            <div key={page.path} className="group">
                                                <div className="flex items-center justify-between mb-1">
                                                    <div className="flex items-center gap-2 min-w-0">
                                                        <span className="font-body text-[10px] text-gray-700 w-4 flex-shrink-0">{i + 1}</span>
                                                        <span className="font-body text-xs text-gray-300 truncate">{page.path}</span>
                                                    </div>
                                                    <span className="font-heading font-bold text-white text-xs ml-4 flex-shrink-0">
                                                        {page.views.toLocaleString()}
                                                    </span>
                                                </div>
                                                <div className="h-0.5 bg-white/[0.04] rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-[#4353FF]/50 group-hover:bg-[#4353FF] transition-all duration-500 rounded-full"
                                                        style={{ width: `${Math.round((page.views / maxPageViews) * 100)}%` }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Top Referrers */}
                        <div className="bg-[#111] border border-white/[0.06] rounded-sm p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="font-heading font-black text-white text-sm uppercase tracking-wider">Traffic Sources</h2>
                                <span className="font-body text-[11px] text-gray-600">Last 30 days</span>
                            </div>
                            {data.topReferrers.length === 0 ? (
                                <p className="text-gray-700 text-sm font-body">No referrer data yet.</p>
                            ) : (
                                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {data.topReferrers.map((ref, i) => {
                                        const label = ref.referrer
                                            ? (() => { try { return new URL(ref.referrer).hostname; } catch { return ref.referrer; } })()
                                            : "Direct / None";
                                        return (
                                            <div key={i} className="flex items-center justify-between bg-white/[0.02] border border-white/[0.04] px-4 py-3 rounded-sm">
                                                <div className="flex items-center gap-2 min-w-0">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-[#4353FF] flex-shrink-0" />
                                                    <span className="font-body text-xs text-gray-300 truncate">{label}</span>
                                                </div>
                                                <span className="font-heading font-bold text-white text-sm ml-3 flex-shrink-0">
                                                    {ref.visits.toLocaleString()}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Empty state hint */}
                        {data.stats.total === 0 && (
                            <div className="border border-dashed border-[#4353FF]/20 bg-[#4353FF]/5 p-8 text-center rounded-sm">
                                <p className="font-heading font-black text-[#4353FF] text-lg mb-2">No views recorded yet</p>
                                <p className="font-body text-gray-500 text-sm">
                                    Make sure <code className="text-[#4353FF] bg-[#4353FF]/10 px-1.5 py-0.5 rounded text-xs">usePageView()</code> is added to your public layout,<br />
                                    then visit your public site to start seeing data here.
                                </p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    );
}