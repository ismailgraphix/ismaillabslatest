import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ROLE_PERMISSIONS } from "@/lib/permissions";

export default async function Dashboard() {
    const session = await getSession();
    if (!session) redirect("/admin/login");

    const perms = ROLE_PERMISSIONS[session.role] || [];

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            {/* Top bar */}
            <header className="border-b border-white/10 px-8 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#4353FF] flex items-center justify-center">
                        <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                            <path d="M4 3h7.5C13.985 3 16 5.015 16 7.5S13.985 12 11.5 12H4V3z" fill="white"/>
                            <path d="M4 12l5 5" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                        </svg>
                    </div>
                    <span className="font-heading font-black text-white tracking-tight">ismaillabs <span className="text-gray-500 font-normal text-sm">/ admin</span></span>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <p className="font-heading font-bold text-sm text-white">{session.name}</p>
                        <p className="font-body text-xs text-[#4353FF] capitalize">{session.role.replace("_", " ")}</p>
                    </div>
                    <form action="/api/admin/logout" method="POST">
                        <button className="font-body text-xs text-gray-500 hover:text-white transition-colors border border-white/10 px-3 py-1.5">
                            Sign out
                        </button>
                    </form>
                </div>
            </header>

            {/* Main */}
            <main className="max-w-6xl mx-auto px-8 py-12">
                <div className="mb-10">
                    <h1 className="font-heading font-black text-3xl uppercase tracking-tight mb-2">
                        Welcome back, {session.name.split(" ")[0]} 👋
                    </h1>
                    <p className="font-body text-gray-500 text-sm">
                        You&apos;re signed in as <span className="text-[#4353FF] font-semibold capitalize">{session.role.replace("_", " ")}</span> · {session.email}
                    </p>
                </div>

                {/* Quick stat cards */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                    {[
                        { label: "Clients", value: "—", icon: "👥", color: "#4353FF" },
                        { label: "Projects", value: "—", icon: "📁", color: "#8b5cf6" },
                        { label: "Team Members", value: "—", icon: "🧑‍💻", color: "#06b6d4" },
                        { label: "Blog Posts", value: "—", icon: "📝", color: "#10b981" },
                    ].map(s => (
                        <div key={s.label} className="bg-white/5 border border-white/10 p-6 hover:border-white/20 transition-colors">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-2xl">{s.icon}</span>
                                <div className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                            </div>
                            <p className="font-heading font-black text-3xl text-white mb-1">{s.value}</p>
                            <p className="font-body text-gray-500 text-xs uppercase tracking-widest">{s.label}</p>
                        </div>
                    ))}
                </div>

                {/* Permissions overview */}
                <div className="bg-white/5 border border-white/10 p-6">
                    <h2 className="font-heading font-black text-lg uppercase tracking-tight mb-5 text-white">
                        Your Permissions
                    </h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                        {perms.map(p => (
                            <div key={p} className="flex items-center gap-2 py-1.5">
                                <div className="w-4 h-4 bg-[#4353FF]/20 flex items-center justify-center flex-shrink-0">
                                    <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                                        <path d="M1 3l2 2 4-4" stroke="#4353FF" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </div>
                                <span className="font-body text-gray-400 text-xs">{p}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Coming soon modules */}
                <div className="mt-6 grid sm:grid-cols-3 gap-4">
                    {["Client Manager", "Project Tracker", "Team & Roles", "Blog Editor", "Settings", "Audit Logs"].map(mod => (
                        <div key={mod} className="bg-white/[0.03] border border-white/5 p-5 flex items-center justify-between group hover:border-[#4353FF]/30 transition-colors cursor-not-allowed">
                            <span className="font-heading font-bold text-gray-500 text-sm">{mod}</span>
                            <span className="font-body text-[10px] text-gray-700 bg-white/5 px-2 py-1 uppercase tracking-wider">Soon</span>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}