"use client";
import { useEffect, useState } from "react";
import PillButton from "@/components/admin/PillButton";


interface Message { id: string; name: string; email: string; subject: string | null; message: string; status: string; createdAt: string; ipAddress: string | null; }

const statusColors: Record<string, string> = {
    unread: "text-[#4353FF] bg-[#4353FF]/10 border-[#4353FF]/20",
    read: "text-[var(--text-soft)] bg-gray-400/10 border-gray-400/20",
    replied: "text-green-400 bg-green-400/10 border-green-400/20",
    archived: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
};

export default function MessagesPage() {
    const [msgs, setMsgs] = useState<Message[]>([]);
    const [session, setSession] = useState<any>(null);
    const [selected, setSelected] = useState<Message | null>(null);
    const [filter, setFilter] = useState("all");
    const [loading, setLoading] = useState(true);

    useEffect(() => {

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
        await fetch(`/api/admin/messages/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
        setMsgs(m => m.map(msg => msg.id === id ? { ...msg, status } : msg));
        if (selected?.id === id) setSelected(s => s ? { ...s, status } : s);
    }

    async function deleteMsg(id: string) {
        if (!confirm("Delete this message?")) return;
        await fetch(`/api/admin/messages/${id}`, { method: "DELETE" });
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
        <div className="flex h-screen bg-[var(--app-bg)] overflow-hidden">

            <main className="flex-1 flex overflow-hidden">
                {/* Message list */}
                <div className="w-[380px] flex-shrink-0 border-r border-[var(--border)] flex flex-col">
                    <div className="px-5 py-4 border-b border-[var(--border)]">
                        <h1 className="font-heading font-black text-[var(--text)] text-lg uppercase tracking-tight">Messages</h1>
                        <p className="font-body text-[var(--text-faint)] text-xs mt-0.5">{unread} unread · {msgs.length} total</p>
                    </div>

                    {/* Filter tabs */}
                    <div className="flex gap-1 px-4 py-3 border-b border-[var(--border)]">
                        {["all", "unread", "read", "replied", "archived"].map(f => (
                            <button key={f} onClick={() => setFilter(f)}
                                className={`font-body text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1.5 rounded-full transition-all ${filter === f ? "bg-[#4353FF] text-[var(--text)]" : "text-[var(--text-faint)] hover:text-[var(--text)]"
                                    }`}>
                                {f}
                            </button>
                        ))}
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {loading ? (
                            <div className="p-8 text-center text-[var(--text-faint)] font-body text-sm">Loading...</div>
                        ) : filtered.length === 0 ? (
                            <div className="p-8 text-center text-[var(--text-faint)] font-body text-sm">No messages</div>
                        ) : filtered.map(msg => (
                            <button key={msg.id} onClick={() => openMessage(msg)}
                                className={`w-full text-left px-5 py-4 border-b border-[var(--border)] transition-colors group ${selected?.id === msg.id ? "bg-[#4353FF]/10 border-l-2 border-l-[#4353FF]" : "hover:bg-[var(--surface-2)]"
                                    }`}>
                                <div className="flex items-start justify-between gap-2 mb-1">
                                    <div className="flex items-center gap-2 min-w-0">
                                        {msg.status === "unread" && <div className="w-2 h-2 rounded-full bg-[#4353FF] flex-shrink-0" />}
                                        <span className={`font-heading font-bold text-sm truncate ${msg.status === "unread" ? "text-[var(--text)]" : "text-[var(--text-soft)]"}`}>{msg.name}</span>
                                    </div>
                                    <span className="font-body text-[var(--text-faint)] text-[10px] whitespace-nowrap flex-shrink-0">
                                        {new Date(msg.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                {msg.subject && <p className="font-body text-[var(--text-soft)] text-xs truncate mb-0.5">{msg.subject}</p>}
                                <p className="font-body text-[var(--text-faint)] text-xs truncate">{msg.message}</p>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Message detail */}
                <div className="flex-1 overflow-y-auto">
                    {!selected ? (
                        <div className="h-full flex items-center justify-center">
                            <div className="text-center">
                                <div className="w-16 h-16 rounded-full bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center mx-auto mb-4">
                                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                                        <rect x="2" y="5" width="24" height="18" rx="3" stroke="#555" strokeWidth="1.8" />
                                        <path d="M2 9l12 8 12-8" stroke="#555" strokeWidth="1.8" strokeLinecap="round" />
                                    </svg>
                                </div>
                                <p className="font-body text-[var(--text-faint)] text-sm">Select a message to read</p>
                            </div>
                        </div>
                    ) : (
                        <div className="p-8 max-w-2xl">
                            {/* Header */}
                            <div className="flex items-start justify-between gap-4 mb-8">
                                <div>
                                    <h2 className="font-heading font-black text-[var(--text)] text-xl mb-1">{selected.subject || "No subject"}</h2>
                                    <div className="flex items-center gap-3">
                                        <span className="font-body text-[var(--text-soft)] text-sm font-semibold">{selected.name}</span>
                                        <span className="font-body text-[var(--text-faint)] text-sm">{selected.email}</span>
                                        <span className="font-body text-[var(--text-faint)] text-xs">{new Date(selected.createdAt).toLocaleString()}</span>
                                    </div>
                                </div>
                                <span className={`font-body font-semibold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full border flex-shrink-0 ${statusColors[selected.status]}`}>
                                    {selected.status}
                                </span>
                            </div>

                            {/* Message body */}
                            <div className="bg-[var(--surface-2)] border border-[var(--border)] rounded-lg p-6 mb-6">
                                <p className="font-body text-[var(--text-soft)] leading-relaxed whitespace-pre-wrap">{selected.message}</p>
                            </div>

                            {/* IP info */}
                            {selected.ipAddress && (
                                <p className="font-body text-[var(--text-faint)] text-xs mb-6">Sent from: {selected.ipAddress}</p>
                            )}

                            {/* Actions */}
                            <div className="flex flex-wrap gap-2">
                                <PillButton href={`mailto:${selected.email}?subject=Re: ${selected.subject || "Your message"}`}
                                    onClick={() => updateStatus(selected.id, "replied")}>
                                    Reply via Email
                                </PillButton>
                                {selected.status !== "archived" && (
                                    <PillButton variant="outline" onClick={() => updateStatus(selected.id, "archived")}>
                                        Archive
                                    </PillButton>
                                )}
                                {selected.status === "unread" && (
                                    <PillButton variant="outline" onClick={() => updateStatus(selected.id, "read")}>
                                        Mark Read
                                    </PillButton>
                                )}
                                <PillButton variant="danger" onClick={() => deleteMsg(selected.id)}>Delete</PillButton>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}