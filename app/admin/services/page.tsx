"use client";
import { useEffect, useState, useRef } from "react";
import Sidebar from "@/components/admin/Sidebar";

interface Service { id:string; title:string; description:string|null; image:string|null; order:number; published:boolean; }

const emptyForm = { title:"", description:"", image:"", order:0, published:true };

export default function ServicesPage() {
    const [items, setItems] = useState<Service[]>([]);
    const [session, setSession] = useState<any>(null);
    const [showModal, setShowModal] = useState(false);
    const [editItem, setEditItem] = useState<Service | null>(null);
    const [form, setForm] = useState(emptyForm);
    const [preview, setPreview] = useState("");
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const fileRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetch("/api/admin/me").then(r=>r.json()).then(d=>setSession(d.user));
        load();
    }, []);

    async function load() {
        const r = await fetch("/api/admin/services");
        const d = await r.json();
        setItems(d.services || []);
    }

    function openAdd() { setEditItem(null); setForm(emptyForm); setPreview(""); setError(""); setShowModal(true); }
    function openEdit(s: Service) {
        setEditItem(s);
        setForm({ title:s.title, description:s.description||"", image:s.image||"", order:s.order, published:s.published });
        setPreview(s.image||""); setError(""); setShowModal(true);
    }

    async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]; if (!file) return;
        setUploading(true);
        const fd = new FormData(); fd.append("file", file);
        const r = await fetch("/api/upload", { method:"POST", body:fd });
        const d = await r.json();
        if (d.url) { setForm(f=>({...f,image:d.url})); setPreview(d.url); }
        setUploading(false);
    }

    async function handleSave() {
        setSaving(true); setError("");
        const url = editItem ? `/api/admin/services/${editItem.id}` : "/api/admin/services";
        const method = editItem ? "PATCH" : "POST";
        const r = await fetch(url, { method, headers:{"Content-Type":"application/json"}, body:JSON.stringify(form) });
        const d = await r.json();
        if (!r.ok) { setError(d.error); setSaving(false); return; }
        setShowModal(false); load(); setSaving(false);
    }

    async function handleDelete(id: string) {
        if (!confirm("Delete this service?")) return;
        await fetch(`/api/admin/services/${id}`, { method:"DELETE" });
        load();
    }

    return (
        <div className="flex h-screen bg-[#0a0a0a] overflow-hidden">
            <Sidebar userName={session?.name||""} userRole={session?.role||""} userEmail={session?.email||""} />
            <main className="flex-1 overflow-y-auto">
                <div className="sticky top-0 z-10 bg-[#0a0a0a]/95 backdrop-blur border-b border-white/[0.06] px-8 py-4 flex items-center justify-between">
                    <div>
                        <h1 className="font-heading font-black text-white text-xl uppercase tracking-tight">Services</h1>
                        <p className="font-body text-gray-500 text-xs mt-0.5">Manage services shown on the site</p>
                    </div>
                    <button onClick={openAdd}
                            className="flex items-center gap-2 bg-[#4353FF] text-white font-body font-semibold text-sm px-5 py-2.5 hover:bg-white hover:text-[#0f0f0f] transition-all duration-200">
                        + Add Service
                    </button>
                </div>
                <div className="p-8">
                    {items.length === 0 ? (
                        <div className="border border-dashed border-white/10 py-20 text-center">
                            <p className="font-body text-gray-500 text-sm mb-4">No services yet</p>
                            <button onClick={openAdd} className="font-body text-sm text-[#4353FF] hover:text-white transition-colors">+ Add first service</button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {items.map((item, idx) => (
                                <div key={item.id} className="bg-[#111] border border-white/[0.06] p-5 flex items-center gap-5 group hover:border-white/15 transition-all">
                  <span className="font-heading font-black text-gray-700 text-2xl w-10 text-center flex-shrink-0">
                    {String(idx+1).padStart(2,"0")}
                  </span>
                                    {item.image && (
                                        <div className="w-16 h-12 overflow-hidden flex-shrink-0 bg-gray-900">
                                            <img src={item.image} alt="" className="w-full h-full object-cover"/>
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <h3 className="font-heading font-black text-white text-base">{item.title}</h3>
                                            {!item.published && <span className="font-body text-[10px] text-gray-500 bg-gray-700 px-2 py-0.5">HIDDEN</span>}
                                        </div>
                                        {item.description && <p className="font-body text-gray-500 text-xs truncate">{item.description}</p>}
                                    </div>
                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                                        <button onClick={() => openEdit(item)}
                                                className="font-body text-xs text-gray-400 hover:text-white transition-colors px-2 py-1 border border-white/10 hover:border-white/30">Edit</button>
                                        <button onClick={() => handleDelete(item.id)}
                                                className="font-body text-xs text-red-500 hover:text-white hover:bg-red-500 transition-all px-2 py-1 border border-red-500/20">Delete</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {showModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-[#111] border border-white/10 w-full max-w-lg max-h-[90vh] flex flex-col">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
                            <h3 className="font-heading font-black text-white uppercase tracking-tight">{editItem ? "Edit Service" : "Add Service"}</h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-white">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
                            </button>
                        </div>
                        <div className="overflow-y-auto p-6 space-y-4 flex-1">
                            {error && <p className="text-red-400 text-sm font-body bg-red-500/10 border border-red-500/20 px-4 py-3">{error}</p>}
                            <div>
                                <label className="block font-body text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Service Image</label>
                                <div className="border border-dashed border-white/10 hover:border-[#4353FF]/40 transition-colors cursor-pointer" onClick={() => fileRef.current?.click()}>
                                    {preview ? <img src={preview} className="w-full h-32 object-cover" alt=""/> :
                                        <div className="h-32 flex items-center justify-center text-gray-600 gap-2">
                                            {uploading ? <svg className="animate-spin w-5 h-5 text-[#4353FF]" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg> :
                                                <><svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M10 4v8M6 8l4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M3 16h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg><span className="font-body text-sm">Upload image</span></>}
                                        </div>}
                                    <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} className="hidden"/>
                                </div>
                            </div>
                            <div>
                                <label className="block font-body text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Title *</label>
                                <input type="text" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="Web Development"
                                       className="w-full bg-white/5 border border-white/10 text-white font-body text-sm px-4 py-3 placeholder-gray-600 focus:outline-none focus:border-[#4353FF] transition-colors"/>
                            </div>
                            <div>
                                <label className="block font-body text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Description</label>
                                <textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} rows={4}
                                          placeholder="What this service includes..."
                                          className="w-full bg-white/5 border border-white/10 text-white font-body text-sm px-4 py-3 placeholder-gray-600 focus:outline-none focus:border-[#4353FF] transition-colors resize-none"/>
                            </div>
                            <div className="flex items-center gap-6">
                                <label className="flex items-center gap-2.5 cursor-pointer">
                                    <input type="checkbox" checked={form.published} onChange={e=>setForm({...form,published:e.target.checked})} className="accent-[#4353FF] w-4 h-4"/>
                                    <span className="font-body text-gray-300 text-sm">Visible on site</span>
                                </label>
                                <div className="flex items-center gap-2">
                                    <label className="font-body text-[11px] text-gray-400 uppercase tracking-widest">Order</label>
                                    <input type="number" value={form.order} onChange={e=>setForm({...form,order:parseInt(e.target.value)||0})}
                                           className="w-16 bg-white/5 border border-white/10 text-white font-body text-sm px-3 py-2 focus:outline-none focus:border-[#4353FF]"/>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 border-t border-white/[0.06]">
                            <button onClick={handleSave} disabled={saving||uploading}
                                    className="w-full bg-[#4353FF] text-white font-heading font-black py-3.5 uppercase tracking-wider text-sm hover:bg-white hover:text-[#0f0f0f] transition-all duration-300 disabled:opacity-50">
                                {saving ? "Saving..." : editItem ? "Save Changes" : "Add Service"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}