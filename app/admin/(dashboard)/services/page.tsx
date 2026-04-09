"use client";
import { useEffect, useState, useRef } from "react";

import Link from "next/link";

interface Service { id: string; title: string; slug: string; description: string; content: string; image: string; icon: string; order: number; published: boolean; createdAt: string; }

const emptyForm = { title: "", slug: "", description: "", content: "", image: "", icon: "", order: 0, published: false };

export default function ServicesAdminPage() {
    const [services, setServices] = useState<Service[]>([]);

    const [showModal, setShowModal] = useState(false);
    const [editService, setEditService] = useState<Service | null>(null);
    const [form, setForm] = useState(emptyForm);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInput = useRef<HTMLInputElement>(null);

    useEffect(() => {

        load();
    }, []);

    async function load() {
        const r = await fetch("/api/admin/services");
        const d = await r.json();
        setServices(d.services || []);
    }

    function openAdd() {
        setEditService(null);
        setForm({ ...emptyForm, order: services.length });
        setShowModal(true);
    }
    function openEdit(s: Service) {
        setEditService(s);
        const { id, createdAt, ...rest } = s as any;
        setForm({ ...rest, description: rest.description || "", content: rest.content || "" });
        setShowModal(true);
    }

    async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        const fb = new FormData(); fb.append("file", file);
        try {
            const res = await fetch("/api/admin/upload", { method: "POST", body: fb });
            const data = await res.json();
            if (res.ok) setForm(f => ({ ...f, image: data.url }));
            else alert(data.error || "Upload failed");
        } catch {
            alert("Network error during upload");
        } finally { setUploading(false); }
    }

    async function handleSave(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        const url = editService ? `/api/admin/services/${editService.id}` : "/api/admin/services";
        const method = editService ? "PATCH" : "POST";
        const r = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
        if (!r.ok) { alert("Error saving service"); setSaving(false); return; }
        setShowModal(false); load(); setSaving(false);
    }

    async function handleDelete(id: string) {
        if (!confirm("Delete service forever?")) return;
        await fetch(`/api/admin/services/${id}`, { method: "DELETE" });
        load();
    }

    return (
        <div className="flex h-screen bg-[#0a0a0a] overflow-hidden">

            <main className="flex-1 flex flex-col overflow-hidden">
                <div className="sticky top-0 z-10 bg-[#0a0a0a]/95 backdrop-blur border-b border-white/[0.06] px-8 py-4 flex items-center justify-between">
                    <div>
                        <h1 className="font-heading font-black text-white text-xl uppercase tracking-tight">Services Matrix</h1>
                    </div>
                    <button onClick={openAdd} className="bg-[#4353FF] text-white font-body font-semibold text-sm px-5 py-2.5 hover:bg-white hover:text-[#0f0f0f] transition-all">
                        + New Service
                    </button>
                </div>

                <div className="flex-1 p-8 overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                        {services.map(s => (
                            <div key={s.id} className="bg-[#111] border border-white/10 group overflow-hidden flex flex-col">
                                {s.image ? (
                                    <div className="h-40 w-full bg-cover bg-center border-b border-white/10" style={{ backgroundImage: `url(${s.image})` }} />
                                ) : (
                                    <div className="h-40 w-full bg-[#1a1a1a] border-b border-white/10 flex items-center justify-center">
                                        <p className="font-body text-gray-700 text-xs uppercase tracking-widest">No Image</p>
                                    </div>
                                )}
                                <div className="p-5 flex-1 flex flex-col">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-1 ${s.published ? "bg-green-400/10 text-green-400 border border-green-400/20" : "bg-yellow-400/10 text-yellow-400 border border-yellow-400/20"}`}>
                                            {s.published ? "Active" : "Draft"}
                                        </span>
                                        <span className="font-body text-[10px] text-gray-400 ml-auto">Order: {s.order}</span>
                                    </div>
                                    <h2 className="font-heading font-bold text-white text-lg mb-2 truncate">{s.title}</h2>
                                    <p className="font-body text-gray-500 text-xs line-clamp-2 flex-1 mb-4">{s.description || "No description."}</p>

                                    <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
                                        {/* Decode SVG or show text */}
                                        <div className="text-[#4353FF] w-6 h-6 flex items-center justify-center overflow-hidden" dangerouslySetInnerHTML={{ __html: s.icon || '' }} />

                                        <div className="flex gap-2">
                                            <button onClick={() => openEdit(s)} className="text-gray-500 hover:text-[#4353FF] text-[11px] font-bold uppercase tracking-widest">Edit</button>
                                            <button onClick={() => handleDelete(s.id)} className="text-gray-500 hover:text-red-400 text-[11px] font-bold uppercase tracking-widest">Del</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {showModal && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
                        <div className="bg-[#111] w-full max-w-5xl max-h-[90vh] flex flex-col border border-white/10 shadow-2xl">
                            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
                                <h3 className="font-heading font-black text-white text-lg">{editService ? "Edit Service" : "Deploy New Service"}</h3>
                                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white"><svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 3l14 14M17 3L3 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg></button>
                            </div>
                            <form onSubmit={handleSave} className="flex-1 flex flex-col overflow-hidden">
                                <div className="flex-1 overflow-y-auto p-6 grid grid-cols-3 gap-8">
                                    <div className="col-span-2 space-y-5">
                                        <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Service Title" required
                                            className="w-full bg-transparent text-white font-heading font-black text-3xl placeholder-gray-600 focus:outline-none" />
                                        <input type="text" value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })} placeholder="service-url-slug" required
                                            className="w-full bg-transparent border-b border-white/[0.06] pb-4 text-[#4353FF] font-mono text-xs placeholder-gray-600 focus:outline-none focus:border-white/20" />

                                        <div>
                                            <label className="block font-body text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Short Subtitle / Description</label>
                                            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 text-white font-body text-sm p-4 placeholder-gray-600 focus:outline-none focus:border-[#4353FF]" />
                                        </div>

                                        <div>
                                            <label className="block font-body text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Detailed Markdown Content (For Service Page)</label>
                                            <textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} required rows={10}
                                                className="w-full bg-white/5 border border-white/10 text-white font-body text-sm p-4 placeholder-gray-600 focus:outline-none focus:border-[#4353FF] font-mono" />
                                        </div>
                                    </div>
                                    <div className="col-span-1 space-y-6">
                                        <div>
                                            <label className="block font-body text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Hero Image</label>
                                            {form.image ? (
                                                <div className="relative h-32 w-full mb-2 bg-cover bg-center border border-white/10" style={{ backgroundImage: `url(${form.image})` }}>
                                                    <button type="button" onClick={() => setForm({ ...form, image: "" })} className="absolute top-2 right-2 w-6 h-6 bg-black/60 rounded flex items-center justify-center hover:bg-red-500 transition-colors">
                                                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="white" strokeWidth="1.5"><path d="M1 1l8 8M9 1L1 9" /></svg>
                                                    </button>
                                                </div>
                                            ) : (
                                                <button type="button" onClick={() => fileInput.current?.click()} className="w-full h-32 border border-dashed border-white/20 hover:border-[#4353FF] bg-white/5 flex flex-col items-center justify-center text-gray-500 transition-colors">
                                                    {uploading ? <span className="animate-pulse">Uploading...</span> : "+ Upload Image"}
                                                </button>
                                            )}
                                            <input type="file" ref={fileInput} onChange={handleUpload} accept="image/*" className="hidden" />
                                        </div>
                                        <div>
                                            <label className="block font-body text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Raw SVG Icon Code</label>
                                            <textarea value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })} rows={5} placeholder="<svg>...</svg>"
                                                className="w-full bg-white/5 border border-white/10 text-white font-mono text-[10px] p-4 placeholder-gray-600 focus:outline-none focus:border-[#4353FF]" />
                                            {form.icon && (
                                                <div className="mt-2 text-[#4353FF] p-2 bg-white/5 inline-block border border-white/10" dangerouslySetInnerHTML={{ __html: form.icon }} />
                                            )}
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="flex-1">
                                                <label className="block font-body text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Grid Order</label>
                                                <input type="number" value={form.order} onChange={e => setForm({ ...form, order: parseInt(e.target.value) || 0 })} className="w-full bg-white/5 border border-white/10 text-white p-2 text-center" />
                                            </div>
                                            <div className="flex items-center gap-3 bg-white/5 p-4 border border-white/10 flex-1 h-full">
                                                <input type="checkbox" id="pub_svc" checked={form.published} onChange={e => setForm({ ...form, published: e.target.checked })} className="accent-[#4353FF] w-4 h-4 cursor-pointer" />
                                                <label htmlFor="pub_svc" className="font-body text-xs text-white cursor-pointer select-none">Active</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6 border-t border-white/[0.06] bg-[#0a0a0a] flex justify-end">
                                    <button type="submit" disabled={saving || uploading} className="bg-[#4353FF] text-white font-heading font-black px-8 py-3 uppercase tracking-wider hover:bg-white hover:text-[#0f0f0f] transition-all disabled:opacity-50">
                                        {saving ? "Saving..." : "Deploy Service"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}