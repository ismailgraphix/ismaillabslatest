"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
    const router = useRouter();
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => { setTimeout(() => setMounted(true), 80); }, []);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const res = await fetch("/api/admin/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (!res.ok) { setError(data.error); return; }
            router.push("/admin/dashboard");
        } catch {
            setError("Connection failed. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] flex overflow-hidden">

            {/* ── LEFT PANEL ── */}
            <div className="hidden lg:flex lg:w-[52%] relative flex-col justify-between p-14 overflow-hidden">
                {/* Grid background */}
                <div className="absolute inset-0"
                     style={{
                         backgroundImage: "linear-gradient(rgba(67,83,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(67,83,255,0.07) 1px, transparent 1px)",
                         backgroundSize: "48px 48px",
                     }}
                />
                {/* Blue glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
                     style={{ background: "radial-gradient(circle, rgba(67,83,255,0.18) 0%, transparent 70%)" }}
                />

                {/* Logo */}
                <div className={`relative z-10 transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#4353FF] flex items-center justify-center">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M4 3h7.5C13.985 3 16 5.015 16 7.5S13.985 12 11.5 12H4V3z" fill="white"/>
                                <path d="M4 12l5 5" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                            </svg>
                        </div>
                        <div>
                            <p className="font-heading font-black text-white text-lg tracking-tight leading-none">ismaillabs</p>
                            <p className="font-body text-[10px] text-gray-500 uppercase tracking-[0.2em]">admin panel</p>
                        </div>
                    </div>
                </div>

                {/* Center content */}
                <div className="relative z-10">
                    <div className={`transition-all duration-700 delay-150 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
                        <h1 className="font-heading font-black text-white text-[clamp(2.4rem,4vw,3.8rem)] leading-[0.92] uppercase tracking-tight mb-6">
                            MANAGE<br />
                            YOUR<br />
                            <span className="text-[#4353FF]">AGENCY.</span>
                        </h1>
                        <p className="font-body text-gray-400 leading-relaxed max-w-sm">
                            One dashboard to handle clients, projects, team permissions, and everything your agency needs to grow.
                        </p>
                    </div>

                    {/* Feature list */}
                    <div className={`mt-10 space-y-3 transition-all duration-700 delay-300 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
                        {[
                            "Permission-based access control",
                            "Client & project management",
                            "Team management & roles",
                            "Full audit trail",
                        ].map((f, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="w-5 h-5 rounded-full bg-[#4353FF]/20 flex items-center justify-center flex-shrink-0">
                                    <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                                        <path d="M1 3.5l2 2 5-5" stroke="#4353FF" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </div>
                                <span className="font-body text-sm text-gray-400">{f}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom stat row */}
                <div className={`relative z-10 flex gap-10 pt-8 border-t border-white/10 transition-all duration-700 delay-500 ${mounted ? "opacity-100" : "opacity-0"}`}>
                    {[
                        { num: "4", label: "Role Levels" },
                        { num: "25+", label: "Permissions" },
                        { num: "∞", label: "Clients" },
                    ].map(s => (
                        <div key={s.label}>
                            <p className="font-heading font-black text-white text-2xl">{s.num}</p>
                            <p className="font-body text-gray-500 text-xs mt-0.5">{s.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── RIGHT PANEL: Login form ── */}
            <div className="flex-1 flex items-center justify-center px-6 py-12 relative">
                {/* Subtle border left */}
                <div className="hidden lg:block absolute left-0 top-0 bottom-0 w-px bg-white/5" />

                <div className={`w-full max-w-[420px] transition-all duration-700 delay-100 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>

                    {/* Mobile logo */}
                    <div className="flex items-center gap-2 mb-10 lg:hidden">
                        <div className="w-8 h-8 bg-[#4353FF] flex items-center justify-center">
                            <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                                <path d="M4 3h7.5C13.985 3 16 7.015 16 9.5S13.985 16 11.5 16H4V3z" fill="white"/>
                                <path d="M4 16l5 5" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                            </svg>
                        </div>
                        <p className="font-heading font-black text-white">ismaillabs</p>
                    </div>

                    <div className="mb-8">
                        <h2 className="font-heading font-black text-white text-3xl uppercase tracking-tight mb-2">
                            Welcome back
                        </h2>
                        <p className="font-body text-gray-500 text-sm">
                            Sign in to your admin account
                        </p>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="mb-6 flex items-start gap-3 bg-red-500/10 border border-red-500/20 px-4 py-3">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0 mt-0.5">
                                <circle cx="8" cy="8" r="7" stroke="#ef4444" strokeWidth="1.5"/>
                                <path d="M8 5v3.5M8 11h.01" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round"/>
                            </svg>
                            <p className="font-body text-red-400 text-sm">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email */}
                        <div>
                            <label className="block font-body font-semibold text-[11px] text-gray-400 uppercase tracking-widest mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                        <rect x="1" y="3" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.4"/>
                                        <path d="M1 5l7 5 7-5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                                    </svg>
                                </div>
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={e => setForm({ ...form, email: e.target.value })}
                                    placeholder="you@ismaillabs.com"
                                    required
                                    className="w-full bg-white/5 border border-white/10 text-white font-body text-sm pl-10 pr-4 py-3.5 placeholder-gray-600 focus:outline-none focus:border-[#4353FF] focus:bg-[#4353FF]/5 transition-all duration-200"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="font-body font-semibold text-[11px] text-gray-400 uppercase tracking-widest">
                                    Password
                                </label>
                            </div>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                        <rect x="3" y="7" width="10" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
                                        <path d="M5 7V5a3 3 0 016 0v2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                                        <circle cx="8" cy="11" r="1" fill="currentColor"/>
                                    </svg>
                                </div>
                                <input
                                    type={showPass ? "text" : "password"}
                                    value={form.password}
                                    onChange={e => setForm({ ...form, password: e.target.value })}
                                    placeholder="••••••••••"
                                    required
                                    className="w-full bg-white/5 border border-white/10 text-white font-body text-sm pl-10 pr-12 py-3.5 placeholder-gray-600 focus:outline-none focus:border-[#4353FF] focus:bg-[#4353FF]/5 transition-all duration-200"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPass(!showPass)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                                >
                                    {showPass ? (
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                            <path d="M2 8s2.5-4.5 6-4.5S14 8 14 8s-2.5 4.5-6 4.5S2 8 2 8z" stroke="currentColor" strokeWidth="1.4"/>
                                            <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.4"/>
                                            <path d="M3 3l10 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                                        </svg>
                                    ) : (
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                            <path d="M2 8s2.5-4.5 6-4.5S14 8 14 8s-2.5 4.5-6 4.5S2 8 2 8z" stroke="currentColor" strokeWidth="1.4"/>
                                            <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.4"/>
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#4353FF] text-white font-heading font-black py-4 uppercase tracking-wider text-sm hover:bg-white hover:text-[#0f0f0f] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group mt-2"
                        >
                            <span className="absolute inset-0 bg-white translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-400 ease-in-out" />
                            <span className="relative flex items-center justify-center gap-2">
                {loading ? (
                    <>
                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                        </svg>
                        Signing in...
                    </>
                ) : (
                    <>
                        Sign In
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </>
                )}
              </span>
                        </button>
                    </form>

                    {/* Setup link */}
                    <div className="mt-8 pt-6 border-t border-white/5 text-center">
                        <p className="font-body text-gray-600 text-xs">
                            First time here?{" "}
                            <a href="/admin/setup" className="text-[#4353FF] hover:text-white transition-colors font-semibold">
                                Create super admin →
                            </a>
                        </p>
                    </div>

                    {/* Back to site */}
                    <div className="mt-4 text-center">
                        <a href="/" className="font-body text-gray-600 text-xs hover:text-gray-400 transition-colors">
                            ← Back to main site
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}