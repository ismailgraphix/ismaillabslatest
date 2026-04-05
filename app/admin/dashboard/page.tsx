import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db, users, messages, clients, portfolioItems } from "@/db";
import { eq, count } from "drizzle-orm";
import Sidebar from "@/components/admin/Sidebar";
import Link from "next/link";

export default async function Dashboard() {
    const session = await getSession();
    if (!session) redirect("/admin/login");

    const [userCount] = await db.select({ count: count() }).from(users).catch(() => [{ count: 0 }]);
    const [msgCount]  = await db.select({ count: count() }).from(messages).where(eq(messages.status, "unread")).catch(() => [{ count: 0 }]);
    const [clientCount] = await db.select({ count: count() }).from(clients).catch(() => [{ count: 0 }]);
    const [portCount] = await db.select({ count: count() }).from(portfolioItems).catch(() => [{ count: 0 }]);

    const recentMessages = await db.select().from(messages).orderBy(messages.createdAt).limit(5).catch(() => []);

    const stats = [
        { label: "Unread Messages", value: msgCount.count, color: "#4353FF", href: "/admin/messages", icon: "✉️" },
        { label: "Clients",         value: clientCount.count, color: "#8b5cf6", href: "/admin/clients", icon: "👥" },
        { label: "Portfolio Items", value: portCount.count, color: "#06b6d4", href: "/admin/portfolio", icon: "🖼️" },
        { label: "Admin Users",     value: userCount.count, color: "#10b981", href: "/admin/users", icon: "🛡️" },
    ];

    return (
        <div className="flex h-screen bg-[#0a0a0a] overflow-hidden">
            <Sidebar userName={session.name} userRole={session.role} userEmail={session.email} unreadCount={Number(msgCount.count)} />

            <main className="flex-1 overflow-y-auto">
                {/* Top bar */}
                <div className="sticky top-0 z-10 bg-[#0a0a0a]/95 backdrop-blur border-b border-white/[0.06] px-8 py-4 flex items-center justify-between">
                    <div>
                        <h1 className="font-heading font-black text-white text-xl uppercase tracking-tight">Dashboard</h1>
                        <p className="font-body text-gray-500 text-xs mt-0.5">{new Date().toLocaleDateString("en-US", { weekday:"long", year:"numeric", month:"long", day:"numeric" })}</p>
                    </div>
                    <div className="flex items-center gap-2">
            <span className="font-body text-xs text-gray-500 bg-white/5 border border-white/10 px-3 py-1.5 capitalize">
              {session.role.replace("_"," ")}
            </span>
                    </div>
                </div>

                <div className="p-8">
                    {/* Welcome */}
                    <div className="mb-8 bg-gradient-to-r from-[#4353FF]/10 to-transparent border border-[#4353FF]/20 p-6 flex items-center justify-between">
                        <div>
                            <h2 className="font-heading font-black text-white text-2xl mb-1">
                                Welcome back, {session.name.split(" ")[0]} 👋
                            </h2>
                            <p className="font-body text-gray-400 text-sm">{session.email}</p>
                        </div>
                        <Link href="/admin/messages" className="hidden md:flex items-center gap-2 bg-[#4353FF] text-white font-body font-semibold text-sm px-5 py-2.5 hover:bg-white hover:text-[#0f0f0f] transition-all duration-300">
                            View Messages →
                        </Link>
                    </div>

                    {/* Stats */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        {stats.map(s => (
                            <Link key={s.label} href={s.href}
                                  className="bg-[#111] border border-white/[0.06] p-6 hover:border-white/15 transition-all duration-200 group">
                                <div className="flex items-start justify-between mb-4">
                                    <span className="text-2xl">{s.icon}</span>
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-gray-700 group-hover:text-gray-400 transition-colors">
                                        <path d="M3 13L13 3M13 3H6M13 3v7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </div>
                                <p className="font-heading font-black text-4xl text-white mb-1">{s.value}</p>
                                <p className="font-body text-gray-500 text-xs uppercase tracking-widest">{s.label}</p>
                                <div className="mt-4 h-0.5 w-0 group-hover:w-full transition-all duration-500" style={{ background: s.color }} />
                            </Link>
                        ))}
                    </div>

                    {/* Recent messages */}
                    <div className="bg-[#111] border border-white/[0.06]">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
                            <h3 className="font-heading font-black text-white text-sm uppercase tracking-wider">Recent Messages</h3>
                            <Link href="/admin/messages" className="font-body text-xs text-[#4353FF] hover:text-white transition-colors">View all →</Link>
                        </div>
                        {recentMessages.length === 0 ? (
                            <div className="px-6 py-12 text-center">
                                <p className="font-body text-gray-600 text-sm">No messages yet. They'll appear here when visitors contact you.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-white/[0.04]">
                                {recentMessages.map((msg) => (
                                    <Link key={msg.id} href={`/admin/messages`}
                                          className="flex items-start gap-4 px-6 py-4 hover:bg-white/[0.02] transition-colors group">
                                        <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${msg.status === "unread" ? "bg-[#4353FF]" : "bg-gray-700"}`} />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 mb-0.5">
                                                <span className="font-heading font-bold text-white text-sm">{msg.name}</span>
                                                <span className="font-body text-gray-600 text-xs">{msg.email}</span>
                                            </div>
                                            {msg.subject && <p className="font-body text-gray-500 text-xs truncate">{msg.subject}</p>}
                                            <p className="font-body text-gray-600 text-xs truncate mt-0.5">{msg.message}</p>
                                        </div>
                                        <span className="font-body text-gray-600 text-xs whitespace-nowrap flex-shrink-0">
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </span>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}