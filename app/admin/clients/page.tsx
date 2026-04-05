"use client";
import { useEffect, useState } from "react";
import Sidebar from "@/components/admin/Sidebar";

interface Client { id:string; name:string; email:string|null; phone:string|null; company:string|null; status:string; notes:string|null; budget:number|null; createdAt:string; }

const STATUS_OPTIONS = ["lead","active","completed","archived"] as const;
const STATUS_COLORS: Record<string, string> = {
    lead:      "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
    active:    "text-green-400 bg-green-400/10 border-green-400/20",
    completed: "text-[#4353FF] bg-[#4353FF]/10 border-[#4353FF]/20",
    archived:  "text-gray-500 bg-gray-500/10 border-gray-500/20",
};

const emptyForm = { name:"", email:"", phone:"", company:"", status:"lead", notes:"", budget:"" };

export default function ClientsPage() {
    const [clientList, setClientList] = useState<Client[]>([]);
    const [session, setSession] = useState<any>(null);
    const [showModal, setShowModal] = useState(false);
    const [editClient, setEditClient] = useState<Client | null>(null);
    const [form, setForm] = useState(emptyForm);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [filter, setFilter] = useState("all");
    const [search, setSearch] = useState("");
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);

    useEffect(() => {
        fetch("/api/admin/me").then(r => r.json()).then(d => setSession(d.user));
        load();
    }, []);

    async function load() {
        const r = await fetch("/api/admin/clients");
        const d = await r.json();
        setClientList(d.clients || []);
    }

    function openAdd() { setEditClient(null); setForm(emptyForm); setError(""); setShowModal(true); }
    function openEdit(c: Client) {
        setEditClient(c);
        setForm({ name:c.name, email:c.email||"", phone:c.phone||"", company:c.company||"", status:c.status, notes:c.notes||"", budget:c.budget?.toString()||"" });
        setError(""); setShowModal(true);
    }

    async function handleSave() {
        setSaving(true); setError("");
        const payload = { ...form, budget: form.budget ? parseInt(form.budget) : null };
        const url = editClient ? `/api/admin/clients/${editClient.id}` : "/api/admin/clients";
        const method = editClient ? "PATCH" : "POST";
        const r = await fetch(url, { method, headers:{"Content-Type":"application/json"}, body:JSON.stringify(payload) });
        const d = await r.json();
        if (!r.ok) { setError(d.error); setSaving(false); return; }
        setShowModal(false); load(); setSaving(false);
        if (editClient) setSelectedClient(d.client);
    }

    async function updateStatus(id: string, status: string) {
        await fetch(`/api/admin/clients/${id}`, { method:"PATCH", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ status }) });
        setClientList(cl => cl.map(c => c.id === id ? {...c, status} : c));
        if (selectedClient?.id === id) setSelectedClient(s => s ? {...s, status} : s);
    }

    async function handleDelete(id: string) {
        if (!confirm("Delete this client?")) return;
        await fetch(`/api/admin/clients/${id}`, { method:"DELETE" });
        setClientList(cl => cl.filter(c => c.id !== id));
        if (selectedClient?.id === id) setSelectedClient(null);
    }

    const filtered = clientList
        .filter(c => filter === "all" || c.status === filter)
        .filter(c => !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.email?.toLowerCase().includes(search.toLowerCase()) || c.company?.toLowerCase().includes(search.toLowerCase()));

    const counts = STATUS_OPTIONS.reduce((a, s) => ({ ...a, [s]: clientList.filter(c => c.status === s).length }), {} as Record<string, number>);

    return (
        <div className="flex h-screen bg-[#0a0a0a] overflow-hidden">
            <Sidebar userName={session?.name||""} userRole={session?.role||""} userEmail={session?.email||""} />

            <main className="flex-1 flex overflow-hidden">
                {/* Left: list */}
                <div className={`flex flex-col border-r border-white/[0.06] ${selectedClient ? "w-[420px] flex-shrink-0" : "flex-1"}`}>
                    {/* Header */}
                    <div className="sticky top-0 z-10 bg-[#0a0a0a]/95 backdrop-blur border-b border-white/[0.06] px-6 py-4">
                        <div className="flex items-center justify-between mb-3">
                            <div>
                                <h1 className="font-heading font-black text-white text-xl uppercase tracking-tight">Clients</h1>
                                <p className="font-body text-gray-500 text-xs mt-0.5">{clientList.length} total</p>
                            </div>
                            <button onClick={openAdd}
                                    className="flex items-center gap-2 bg-[#4353FF] text-white font-body font-semibold text-sm px-4 py-2 hover:bg-white hover:text-[#0f0f0f] transition-all duration-200">
                                + Add
                            </button>
                        </div>
                        {/* Search */}
                        <div className="relative mb-3">
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                                <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.4"/>
                                <path d="M10 10l2.5 2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                            </svg>
                            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search clients..."
                                   className="w-full bg-white/5 border border-white/10 text-white font-body text-sm pl-9 pr-4 py-2.5 placeholder-gray-600 focus:outline-none focus:border-[#4353FF] transition-colors"/>
                        </div>
                        {/* Status filters */}
                        <div className="flex gap-1 flex-wrap">
                            <button onClick={() => setFilter("all")}
                                    className={`font-body text-[11px] font-semibold px-2.5 py-1 transition-all ${filter === "all" ? "bg-[#4353FF] text-white" : "text-gray-500 hover:text-white"}`}>
                                All ({clientList.length})
                            </button>
                            {STATUS_OPTIONS.map(s => (
                                <button key={s} onClick={() => setFilter(s)}
                                        className={`font-body text-[11px] font-semibold px-2.5 py-1 capitalize transition-all ${filter === s ? "bg-[#4353FF] text-white" : "text-gray-500 hover:text-white"}`}>
                                    {s} ({counts[s] || 0})
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* List */}
                    <div className="flex-1 overflow-y-auto divide-y divide-white/[0.04]">
                        {filtered.length === 0 ? (
                            <div className="py-16 text-center">
                                <p className="font-body text-gray-600 text-sm">No clients found</p>
                            </div>
                        ) : filtered.map(c => (
                            <button key={c.id} onClick={() => setSelectedClient(c)}
                                    className={`w-full text-left px-6 py-4 transition-colors group ${selectedClient?.id === c.id ? "bg-[#4353FF]/10 border-l-2 border-l-[#4353FF]" : "hover:bg-white/[0.02]"}`}>
                                <div className="flex items-start justify-between gap-2 mb-1">
                                    <div className="flex items-center gap-2 min-w-0">
                                        <div className="w-7 h-7 rounded-full bg-[#4353FF]/20 flex items-center justify-center flex-shrink-0">
                                            <span className="font-heading font-black text-[#4353FF] text-xs">{c.name[0]}</span>
                                        </div>
                                        <span className="font-heading font-bold text-white text-sm truncate">{c.name}</span>
                                    </div>
                                    <span className={`font-body text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 border capitalize flex-shrink-0 ${STATUS_COLORS[c.status]}`}>
                    {c.status}
                  </span>
                                </div>
                                {c.company && <p className="font-body text-gray-500 text-xs ml-9">{c.company}</p>}
                                {c.email && <p className="font-body text-gray-600 text-xs ml-9 truncate">{c.email}</p>}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right: detail */}
                {selectedClient && (
                    <div className="flex-1 overflow-y-auto p-8">
                        <div className="flex items-start justify-between gap-4 mb-8">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-full bg-[#4353FF]/20 border border-[#4353FF]/30 flex items-center justify-center flex-shrink-0">
                                    <span className="font-heading font-black text-[#4353FF] text-2xl">{selectedClient.name[0]}</span>
                                </div>
                                <div>
                                    <h2 className="font-heading font-black text-white text-2xl">{selectedClient.name}</h2>
                                    {selectedClient.company && <p className="font-body text-gray-400 text-sm">{selectedClient.company}</p>}
                                </div>
                            </div>
                            <button onClick={() => setSelectedClient(null)} className="text-gray-600 hover:text-white transition-colors">
                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M2 2l14 14M16 2L2 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
                            </button>
                        </div>

                        {/* Info cards */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            {[
                                { label:"Email", value:selectedClient.email || "—" },
                                { label:"Phone", value:selectedClient.phone || "—" },
                                { label:"Budget", value:selectedClient.budget ? `$${selectedClient.budget.toLocaleString()}` : "—" },
                                { label:"Added", value:new Date(selectedClient.createdAt).toLocaleDateString() },
                            ].map(item => (
                                <div key={item.label} className="bg-white/[0.03] border border-white/[0.06] p-4">
                                    <p className="font-body text-[11px] font-semibold text-gray-500 uppercase tracking-widest mb-1">{item.label}</p>
                                    <p className="font-body text-white text-sm">{item.value}</p>
                                </div>
                            ))}
                        </div>

                        {/* Status change */}
                        <div className="bg-white/[0.03] border border-white/[0.06] p-5 mb-6">
                            <p className="font-body text-[11px] font-semibold text-gray-500 uppercase tracking-widest mb-3">Status</p>
                            <div className="flex flex-wrap gap-2">
                                {STATUS_OPTIONS.map(s => (
                                    <button key={s} onClick={() => updateStatus(selectedClient.id, s)}
                                            className={`font-body text-xs font-semibold uppercase tracking-wider px-3 py-1.5 border capitalize transition-all ${
                                                selectedClient.status === s ? STATUS_COLORS[s] : "text-gray-600 border-white/10 hover:border-white/30 hover:text-white"
                                            }`}>{s}</button>
                                ))}
                            </div>
                        </div>

                        {/* Notes */}
                        {selectedClient.notes && (
                            <div className="bg-white/[0.03] border border-white/[0.06] p-5 mb-6">
                                <p className="font-body text-[11px] font-semibold text-gray-500 uppercase tracking-widest mb-2">Notes</p>
                                <p className="font-body text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{selectedClient.notes}</p>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-3">
                            <button onClick={() => openEdit(selectedClient)}
                                    className="flex-1 bg-[#4353FF] text-white font-body font-semibold text-sm py-3 hover:bg-white hover:text-[#0f0f0f] transition-all">
                                Edit Client
                            </button>
                            <button onClick={() => handleDelete(selectedClient.id)}
                                    className="font-body font-semibold text-sm px-5 py-3 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all">
                                Delete
                            </button>
                        </div>
                    </div>
                )}
            </main>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-[#111] border border-white/10 w-full max-w-lg max-h-[90vh] flex flex-col">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
                            <h3 className="font-heading font-black text-white uppercase tracking-tight">{editClient ? "Edit Client" : "Add Client"}</h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-white transition-colors">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
                            </button>
                        </div>
                        <div className="overflow-y-auto p-6 space-y-4 flex-1">
                            {error && <p className="text-red-400 text-sm font-body bg-red-500/10 border border-red-500/20 px-4 py-3">{error}</p>}
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { key:"name", label:"Full Name *", placeholder:"John Doe", type:"text" },
                                    { key:"company", label:"Company", placeholder:"Acme Inc.", type:"text" },
                                    { key:"email", label:"Email", placeholder:"john@acme.com", type:"email" },
                                    { key:"phone", label:"Phone", placeholder:"+1 234 567 890", type:"tel" },
                                ].map(f => (
                                    <div key={f.key}>
                                        <label className="block font-body text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2">{f.label}</label>
                                        <input type={f.type} value={(form as any)[f.key]} onChange={e=>setForm({...form,[f.key]:e.target.value})}
                                               placeholder={f.placeholder}
                                               className="w-full bg-white/5 border border-white/10 text-white font-body text-sm px-4 py-3 placeholder-gray-600 focus:outline-none focus:border-[#4353FF] transition-colors"/>
                                    </div>
                                ))}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block font-body text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Status</label>
                                    <select value={form.status} onChange={e=>setForm({...form,status:e.target.value})}
                                            className="w-full bg-white/5 border border-white/10 text-white font-body text-sm px-4 py-3 focus:outline-none focus:border-[#4353FF] transition-colors">
                                        {STATUS_OPTIONS.map(s => <option key={s} value={s} className="bg-[#111] capitalize">{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block font-body text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Budget ($)</label>
                                    <input type="number" value={form.budget} onChange={e=>setForm({...form,budget:e.target.value})} placeholder="5000"
                                           className="w-full bg-white/5 border border-white/10 text-white font-body text-sm px-4 py-3 placeholder-gray-600 focus:outline-none focus:border-[#4353FF] transition-colors"/>
                                </div>
                            </div>
                            <div>
                                <label className="block font-body text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Notes</label>
                                <textarea value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} rows={3}
                                          placeholder="Internal notes about this client..."
                                          className="w-full bg-white/5 border border-white/10 text-white font-body text-sm px-4 py-3 placeholder-gray-600 focus:outline-none focus:border-[#4353FF] transition-colors resize-none"/>
                            </div>
                        </div>
                        <div className="p-6 border-t border-white/[0.06]">
                            <button onClick={handleSave} disabled={saving}
                                    className="w-full bg-[#4353FF] text-white font-heading font-black py-3.5 uppercase tracking-wider text-sm hover:bg-white hover:text-[#0f0f0f] transition-all duration-300 disabled:opacity-50">
                                {saving ? "Saving..." : editClient ? "Save Changes" : "Add Client"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}