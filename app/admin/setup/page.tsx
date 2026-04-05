"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const rules = [
    { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
    { label: "One uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
    { label: "One number", test: (p: string) => /[0-9]/.test(p) },
    { label: "One special character", test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];

export default function AdminSetup() {
    const router = useRouter();
    const [step, setStep] = useState<"form" | "success">("form");
    const [mounted, setMounted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [form, setForm] = useState({
        setupToken: "",
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    useEffect(() => { setTimeout(() => setMounted(true), 80); }, []);

    const strength = rules.filter(r => r.test(form.password)).length;
    const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength];
    const strengthColor = ["", "#ef4444", "#f97316", "#eab308", "#22c55e"][strength];

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");

        if (form.password !== form.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        if (strength < 4) {
            setError("Please meet all password requirements.");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("/api/admin/setup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    setupToken: form.setupToken,
                    name: form.name,
                    email: form.email,
                    password: form.password,
                }),
            });
            const data = await res.json();
            if (!res.ok) { setError(data.error); return; }
            setStep("success");
        } catch {
            setError("Connection failed. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    if (step === "success") {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6">
                <div className="text-center max-w-md">
                    <div className="w-20 h-20 bg-[#4353FF] flex items-center justify-center mx-auto mb-6">
                        <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                            <path d="M6 18l7 7 17-17" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                    <h2 className="font-heading font-black text-white text-3xl uppercase tracking-tight mb-3">
                        Super Admin Created!
                    </h2>
                    <p className="font-body text-gray-400 mb-8">
                        Your super admin account has been created successfully. You now have full access to the admin panel.
                    </p>
                    <div className="bg-white/5 border border-white/10 p-4 mb-8 text-left">
                        <p className="font-body text-xs text-gray-500 uppercase tracking-wider mb-2">Security reminder</p>
                        <p className="font-body text-gray-400 text-sm">
                            Remove or change the <code className="text-[#4353FF] bg-[#4353FF]/10 px-1.5 py-0.5 text-xs">SETUP_TOKEN</code> in your <code className="text-[#4353FF] bg-[#4353FF]/10 px-1.5 py-0.5 text-xs">.env.local</code> to prevent others from creating super admins.
                        </p>
                    </div>
                    <button
                        onClick={() => router.push("/admin/login")}
                        className="w-full bg-[#4353FF] text-white font-heading font-black py-4 uppercase tracking-wider text-sm hover:bg-white hover:text-[#0f0f0f] transition-all duration-300"
                    >
                        Go to Login →
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] flex overflow-hidden">

            {/* Left panel */}
            <div className="hidden lg:flex lg:w-[44%] flex-col justify-between p-14 relative overflow-hidden bg-[#4353FF]">
                <div className="absolute inset-0 opacity-[0.15]"
                     style={{ backgroundImage: "repeating-linear-gradient(45deg, white, white 1px, transparent 1px, transparent 20px)" }}
                />
                <div className="relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white flex items-center justify-center">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M4 3h7.5C13.985 3 16 5.015 16 7.5S13.985 12 11.5 12H4V3z" fill="#4353FF"/>
                                <path d="M4 12l5 5" stroke="#4353FF" strokeWidth="2.5" strokeLinecap="round"/>
                            </svg>
                        </div>
                        <div>
                            <p className="font-heading font-black text-white text-lg tracking-tight leading-none">ismaillabs</p>
                            <p className="font-body text-white/60 text-[10px] uppercase tracking-[0.2em]">initial setup</p>
                        </div>
                    </div>
                </div>

                <div className="relative z-10">
                    <h1 className="font-heading font-black text-white text-[clamp(2rem,3.5vw,3.2rem)] leading-[0.92] uppercase tracking-tight mb-5">
                        ONE-TIME<br />SETUP.<br />FULL<br />CONTROL.
                    </h1>
                    <p className="font-body text-white/70 text-sm leading-relaxed max-w-xs">
                        Create the super admin account that controls all permissions, users, and settings across the entire platform.
                    </p>
                </div>

                <div className="relative z-10 space-y-3">
                    {["Full system access", "Manage all admin users", "Set role permissions", "Cannot be locked out"].map((f, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                                <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                                    <path d="M1 3.5l2 2 5-5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                            <span className="font-body text-white/80 text-sm">{f}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right panel: form */}
            <div className="flex-1 flex items-center justify-center px-6 py-12">
                <div className={`w-full max-w-[440px] transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>

                    <div className="mb-8">
                        <h2 className="font-heading font-black text-white text-3xl uppercase tracking-tight mb-2">
                            Create Super Admin
                        </h2>
                        <p className="font-body text-gray-500 text-sm">
                            This can only be done once. Choose your credentials carefully.
                        </p>
                    </div>

                    {error && (
                        <div className="mb-5 flex items-start gap-3 bg-red-500/10 border border-red-500/20 px-4 py-3">
                            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className="flex-shrink-0 mt-0.5">
                                <circle cx="7.5" cy="7.5" r="6.5" stroke="#ef4444" strokeWidth="1.4"/>
                                <path d="M7.5 4.5V8M7.5 10.5h.01" stroke="#ef4444" strokeWidth="1.4" strokeLinecap="round"/>
                            </svg>
                            <p className="font-body text-red-400 text-sm">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">

                        {/* Setup token */}
                        <div>
                            <label className="block font-body font-semibold text-[11px] text-gray-400 uppercase tracking-widest mb-2">
                                Setup Token <span className="text-[#4353FF]">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                                        <rect x="2" y="7" width="11" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
                                        <path d="M5 7V4.5a2.5 2.5 0 015 0V7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    value={form.setupToken}
                                    onChange={e => setForm({ ...form, setupToken: e.target.value })}
                                    placeholder="From your .env.local (SETUP_TOKEN)"
                                    required
                                    className="w-full bg-white/5 border border-white/10 text-white font-body text-sm pl-10 pr-4 py-3.5 placeholder-gray-600 focus:outline-none focus:border-[#4353FF] focus:bg-[#4353FF]/5 transition-all duration-200"
                                />
                            </div>
                            <p className="font-body text-gray-600 text-xs mt-1.5">
                                Find this in your <code className="text-[#4353FF]">.env.local</code> → <code className="text-[#4353FF]">SETUP_TOKEN</code>
                            </p>
                        </div>

                        {/* Name */}
                        <div>
                            <label className="block font-body font-semibold text-[11px] text-gray-400 uppercase tracking-widest mb-2">Full Name</label>
                            <input
                                type="text"
                                value={form.name}
                                onChange={e => setForm({ ...form, name: e.target.value })}
                                placeholder="Ismail Labs"
                                required
                                className="w-full bg-white/5 border border-white/10 text-white font-body text-sm px-4 py-3.5 placeholder-gray-600 focus:outline-none focus:border-[#4353FF] focus:bg-[#4353FF]/5 transition-all duration-200"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block font-body font-semibold text-[11px] text-gray-400 uppercase tracking-widest mb-2">Email Address</label>
                            <input
                                type="email"
                                value={form.email}
                                onChange={e => setForm({ ...form, email: e.target.value })}
                                placeholder="admin@ismaillabs.com"
                                required
                                className="w-full bg-white/5 border border-white/10 text-white font-body text-sm px-4 py-3.5 placeholder-gray-600 focus:outline-none focus:border-[#4353FF] focus:bg-[#4353FF]/5 transition-all duration-200"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block font-body font-semibold text-[11px] text-gray-400 uppercase tracking-widest mb-2">Password</label>
                            <div className="relative">
                                <input
                                    type={showPass ? "text" : "password"}
                                    value={form.password}
                                    onChange={e => setForm({ ...form, password: e.target.value })}
                                    placeholder="••••••••••"
                                    required
                                    className="w-full bg-white/5 border border-white/10 text-white font-body text-sm px-4 pr-12 py-3.5 placeholder-gray-600 focus:outline-none focus:border-[#4353FF] focus:bg-[#4353FF]/5 transition-all duration-200"
                                />
                                <button type="button" onClick={() => setShowPass(!showPass)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors">
                                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                                        <path d="M1.5 7.5s2.5-4 6-4 6 4 6 4-2.5 4-6 4-6-4-6-4z" stroke="currentColor" strokeWidth="1.3"/>
                                        <circle cx="7.5" cy="7.5" r="1.8" stroke="currentColor" strokeWidth="1.3"/>
                                    </svg>
                                </button>
                            </div>

                            {/* Strength bar */}
                            {form.password && (
                                <div className="mt-2">
                                    <div className="flex gap-1 mb-1.5">
                                        {[1,2,3,4].map(i => (
                                            <div key={i} className="h-1 flex-1 transition-all duration-300"
                                                 style={{ background: i <= strength ? strengthColor : "rgba(255,255,255,0.08)" }}
                                            />
                                        ))}
                                    </div>
                                    <div className="flex flex-wrap gap-x-4 gap-y-1">
                                        {rules.map(r => (
                                            <span key={r.label} className={`font-body text-[11px] flex items-center gap-1 ${r.test(form.password) ? "text-green-500" : "text-gray-600"}`}>
                        <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                          <path d="M1 3l2 2 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                                                {r.label}
                      </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Confirm password */}
                        <div>
                            <label className="block font-body font-semibold text-[11px] text-gray-400 uppercase tracking-widest mb-2">Confirm Password</label>
                            <div className="relative">
                                <input
                                    type={showPass ? "text" : "password"}
                                    value={form.confirmPassword}
                                    onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                                    placeholder="••••••••••"
                                    required
                                    className={`w-full bg-white/5 border text-white font-body text-sm px-4 py-3.5 placeholder-gray-600 focus:outline-none transition-all duration-200 ${
                                        form.confirmPassword && form.password !== form.confirmPassword
                                            ? "border-red-500/50 focus:border-red-500"
                                            : form.confirmPassword && form.password === form.confirmPassword
                                                ? "border-green-500/50 focus:border-green-500"
                                                : "border-white/10 focus:border-[#4353FF] focus:bg-[#4353FF]/5"
                                    }`}
                                />
                                {form.confirmPassword && (
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                        {form.password === form.confirmPassword ? (
                                            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                                                <path d="M2 8l4 4 7-8" stroke="#22c55e" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        ) : (
                                            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                                                <path d="M3 3l9 9M12 3l-9 9" stroke="#ef4444" strokeWidth="1.6" strokeLinecap="round"/>
                                            </svg>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#4353FF] text-white font-heading font-black py-4 uppercase tracking-wider text-sm hover:bg-white hover:text-[#0f0f0f] transition-all duration-300 disabled:opacity-50 mt-2 relative overflow-hidden group"
                        >
                            <span className="absolute inset-0 bg-white translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-400" />
                            <span className="relative flex items-center justify-center gap-2 group-hover:text-[#0f0f0f]">
                {loading ? (
                    <>
                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                        </svg>
                        Creating Super Admin...
                    </>
                ) : "Create Super Admin →"}
              </span>
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <a href="/admin/login" className="font-body text-gray-600 text-xs hover:text-gray-400 transition-colors">
                            Already have an account? Sign in →
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}