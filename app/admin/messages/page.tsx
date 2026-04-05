"use client";
import { useEffect, useState } from "react";
import Sidebar from "@/components/admin/Sidebar";

interface Message { id: string; name: string; email: string; subject: string | null; message: string; status: string; createdAt: string; ipAddress: string | null; }

const statusColors: Record<string, string> = {
    unread:   "text-[#4353FF] bg-[#4353FF]/10 border-[#4353FF]/20",
    read:     "text-gray-400 bg-gray-400/10 border-gray-400/20",
    replied:  "text-green-400 bg-green-400/10 border-green-400/20",
    archived: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
};

export default function MessagesPage() {
    const [msgs, setMsgs] = useState<Message[]>([]);
    const [session, setSession] = useState<any>(null);
    const [selected, setSelected] = useState<Message | null>(null);
    const [filter, setFilter] = useState("all");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/admin/me").then(r => r.json()).then(d => setSession(d.user));
        loadMessages();
    }, []);

    async function loadMessages() {
        setLoading(true);
        const r = await fetch("/api/admin/messages");
        const d = await r.json();
        setMsgs(d.messages || []);
        setLoading(false);
    }

    async function updateStatus(id: string, status: string) {
        await fetch(`/api/admin/messages/${id}`, { method:"PATCH", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ status }) });
        setMsgs(m => m.map(msg => msg.id === id ? { ...msg, status } : msg));
        if (selected?.id === id) setSelected(s => s ? { ...s, status } : s);
    }

    async function deleteMsg(id: string) {
        if (!confirm("Delete this message?")) return;
        await fetch(`/api/admin/messages/${id}`, { method:"DELETE" });
        setMsgs(m => m.filter(msg => msg.id !== id));
        if (selected?.id === id) setSelected(null);
    }

    function openMessage(msg: Message) {
        setSelected(msg);
        if (msg.status === "unread") updateStatus(msg.id, "read");
    }

    const filtered = filter === "all" ? msgs : msgs.filter(m => m.status === filter);
    const unread = msgs.filter(m => m.status === "unread").length;

    return (
        <div className="flex h-screen bg-[#0a0a0a] overflow-hidden">
            <Sidebar userName={session?.name || ""} userRole={session?.role || ""} userEmail={session?.email || ""} unreadCount={unread} />

            <main className="flex-1 flex overflow-hidden">
                {/* Message list */}
                <div className="w-[380px] flex-shrink-0 border-r border-white/[0.06] flex flex-col">
                    <div className="px-5 py-4 border-b border-white/[0.06]">
                        <h1 className="font-heading font-black text-white text-lg uppercase tracking-tight">Messages</h1>
                        <p className="font-body text-gray-500 text-xs mt-0.5">{unread} unread · {msgs.length} total</p>
                    </div>

                    {/* Filter tabs */}
                    <div className="flex gap-1 px-4 py-3 border-b border-white/[0.06]">
                        {["all","unread","read","replied","archived"].map(f => (
                            <button key={f} onClick={() => setFilter(f)}
                                    className={`font-body text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1.5 transition-all ${
                                        filter === f ? "bg-[#4353FF] text-white" : "text-gray-500 hover:text-white"
                                    }`}>
                                {f}
                            </button>
                        ))}
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {loading ? (
                            <div className="p-8 text-center text-gray-600 font-body text-sm">Loading...</div>
                        ) : filtered.length === 0 ? (
                            <div className="p-8 text-center text-gray-600 font-body text-sm">No messages</div>
                        ) : filtered.map(msg => (
                            <button key={msg.id} onClick={() => openMessage(msg)}
                                    className={`w-full text-left px-5 py-4 border-b border-white/[0.04] transition-colors group ${
                                        selected?.id === msg.id ? "bg-[#4353FF]/10 border-l-2 border-l-[#4353FF]" : "hover:bg-white/[0.02]"
                                    }`}>
                                <div className="flex items-start justify-between gap-2 mb-1">
                                    <div className="flex items-center gap-2 min-w-0">
                                        {msg.status === "unread" && <div className="w-2 h-2 rounded-full bg-[#4353FF] flex-shrink-0" />}
                                        <span className={`font-heading font-bold text-sm truncate ${msg.status === "unread" ? "text-white" : "text-gray-300"}`}>{msg.name}</span>
                                    </div>
                                    <span className="font-body text-gray-600 text-[10px] whitespace-nowrap flex-shrink-0">
                    {new Date(msg.createdAt).toLocaleDateString()}
                  </span>
                                </div>
                                {msg.subject && <p className="font-body text-gray-400 text-xs truncate mb-0.5">{msg.subject}</p>}
                                <p className="font-body text-gray-600 text-xs truncate">{msg.message}</p>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Message detail */}
                <div className="flex-1 overflow-y-auto">
                    {!selected ? (
                        <div className="h-full flex items-center justify-center">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
                                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                                        <rect x="2" y="5" width="24" height="18" rx="3" stroke="#555" strokeWidth="1.8"/>
                                        <path d="M2 9l12 8 12-8" stroke="#555" strokeWidth="1.8" strokeLinecap="round"/>
                                    </svg>
                                </div>
                                <p className="font-body text-gray-600 text-sm">Select a message to read</p>
                            </div>
                        </div>
                    ) : (
                        <div className="p-8 max-w-2xl">
                            {/* Header */}
                            <div className="flex items-start justify-between gap-4 mb-8">
                                <div>
                                    <h2 className="font-heading font-black text-white text-xl mb-1">{selected.subject || "No subject"}</h2>
                                    <div className="flex items-center gap-3">
                                        <span className="font-body text-gray-400 text-sm font-semibold">{selected.name}</span>
                                        <span className="font-body text-gray-500 text-sm">{selected.email}</span>
                                        <span className="font-body text-gray-600 text-xs">{new Date(selected.createdAt).toLocaleString()}</span>
                                    </div>
                                </div>
                                <span className={`font-body font-semibold text-[10px] uppercase tracking-wider px-2.5 py-1 border flex-shrink-0 ${statusColors[selected.status]}`}>
                  {selected.status}
                </span>
                            </div>

                            {/* Message body */}
                            <div className="bg-white/[0.03] border border-white/[0.06] p-6 mb-6">
                                <p className="font-body text-gray-300 leading-relaxed whitespace-pre-wrap">{selected.message}</p>
                            </div>

                            {/* IP info */}
                            {selected.ipAddress && (
                                <p className="font-body text-gray-700 text-xs mb-6">Sent from: {selected.ipAddress}</p>
                            )}

                            {/* Actions */}
                            <div className="flex flex-wrap gap-2">
                                <a href={`mailto:${selected.email}?subject=Re: ${selected.subject || "Your message"}`}
                                   onClick={() => updateStatus(selected.id, "replied")}
                                   className="flex items-center gap-2 bg-[#4353FF] text-white font-body font-semibold text-sm px-5 py-2.5 hover:bg-white hover:text-[#0f0f0f] transition-all duration-200">
                                    Reply via Email →
                                </a>
                                {selected.status !== "archived" && (
                                    <button onClick={() => updateStatus(selected.id, "archived")}
                                            className="font-body font-semibold text-sm px-5 py-2.5 border border-white/10 text-gray-400 hover:text-white hover:border-white/30 transition-colors">
                                        Archive
                                    </button>
                                )}
                                {selected.status === "unread" && (
                                    <button onClick={() => updateStatus(selected.id, "read")}
                                            className="font-body font-semibold text-sm px-5 py-2.5 border border-white/10 text-gray-400 hover:text-white hover:border-white/30 transition-colors">
                                        Mark Read
                                    </button>
                                )}
                                <button onClick={() => deleteMsg(selected.id)}
                                        className="font-body font-semibold text-sm px-5 py-2.5 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all">
                                    Delete
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}