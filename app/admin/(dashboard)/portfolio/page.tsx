"use client";
import { useEffect, useState, useRef } from "react";


interface PortfolioItem { id: string; title: string; category: string; description: string | null; image: string | null; tags: string[]; liveUrl: string | null; featured: boolean; published: boolean; order: number; }

const CATEGORIES = ["Web Development", "Mobile Application", "Design & Branding", "App Development", "UI/UX Design"];

const emptyForm = { title: "", category: "Web Development", description: "", image: "", tags: "", liveUrl: "", featured: false, published: true, order: 0 };

export default function PortfolioPage() {
    const [items, setItems] = useState<PortfolioItem[]>([]);
    const [session, setSession] = useState<any>(null);
    const [showModal, setShowModal] = useState(false);
    const [editItem, setEditItem] = useState<PortfolioItem | null>(null);
    const [form, setForm] = useState(emptyForm);
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [preview, setPreview] = useState("");
    const fileRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetch("/api/admin/me").then(r => r.json()).then(d => setSession(d.user));
        loadItems();
    }, []);

    async function loadItems() {
        const r = await fetch("/api/admin/portfolio");
        const d = await r.json();
        setItems(d.items || []);
    }

    function openAdd() { setEditItem(null); setForm(emptyForm); setPreview(""); setError(""); setShowModal(true); }
    function openEdit(item: PortfolioItem) {
        setEditItem(item);
        setForm({ title: item.title, category: item.category, description: item.description || "", image: item.image || "", tags: (item.tags || []).join(", "), liveUrl: item.liveUrl || "", featured: item.featured, published: item.published, order: item.order });
        setPreview(item.image || "");
        setError("");
        setShowModal(true);
    }

    async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        const fd = new FormData(); fd.append("file", file);
        const r = await fetch("/api/upload", { method: "POST", body: fd });
        const d = await r.json();
        if (d.url) { setForm(f => ({ ...f, image: d.url })); setPreview(d.url); }
        else setError(d.error || "Upload failed");
        setUploading(false);
    }

    async function handleSave() {
        setSaving(true); setError("");
        const payload = { ...form, tags: form.tags.split(",").map(t => t.trim()).filter(Boolean) };
        const url = editItem ? `/api/admin/portfolio/${editItem.id}` : "/api/admin/portfolio";
        const method = editItem ? "PATCH" : "POST";
        const r = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
        const d = await r.json();
        if (!r.ok) { setError(d.error); setSaving(false); return; }
        setShowModal(false); loadItems(); setSaving(false);
    }

    async function togglePublish(item: PortfolioItem) {
        await fetch(`/api/admin/portfolio/${item.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ published: !item.published }) });
        loadItems();
    }

    async function handleDelete(id: string) {
        if (!confirm("Delete this portfolio item?")) return;
        await fetch(`/api/admin/portfolio/${id}`, { method: "DELETE" });
        loadItems();
    }

    return (
        <div className="flex h-screen bg-[#0a0a0a] overflow-hidden">

            <main className="flex-1 overflow-y-auto">
                <div className="sticky top-0 z-10 bg-[#0a0a0a]/95 backdrop-blur border-b border-white/[0.06] px-8 py-4 flex items-center justify-between">
                    <div>
                        <h1 className="font-heading font-black text-white text-xl uppercase tracking-tight">Portfolio</h1>
                        <p className="font-body text-gray-500 text-xs mt-0.5">{items.length} items · shown on frontend</p>
                    </div>
                    <button onClick={openAdd}
                        className="flex items-center gap-2 bg-[#4353FF] text-white font-body font-semibold text-sm px-5 py-2.5 hover:bg-white hover:text-[#0f0f0f] transition-all duration-200">
                        + Add Project
                    </button>
                </div>

                <div className="p-8">
                    {items.length === 0 ? (
                        <div className="border border-dashed border-white/10 py-20 text-center">
                            <p className="font-body text-gray-500 text-sm mb-4">No portfolio items yet</p>
                            <button onClick={openAdd} className="font-body text-sm text-[#4353FF] hover:text-white transition-colors">+ Add your first project</button>
                        </div>
                    ) : (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {items.map(item => (
                                <div key={item.id} className="bg-[#111] border border-white/[0.06] overflow-hidden group hover:border-white/15 transition-all">
                                    <div className="aspect-video bg-gray-900 relative overflow-hidden">
                                        {item.image ? (
                                            <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-700">
                                                <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><rect x="2" y="4" width="28" height="24" rx="3" stroke="currentColor" strokeWidth="1.5" /><circle cx="11" cy="13" r="3" stroke="currentColor" strokeWidth="1.5" /><path d="M2 22l8-6 6 5 4-3 10 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                            </div>
                                        )}
                                        <div className="absolute top-2 right-2 flex gap-1">
                                            {item.featured && <span className="font-body text-[10px] font-bold bg-yellow-400/90 text-black px-2 py-0.5">★ FEATURED</span>}
                                            <span className={`font-body text-[10px] font-bold px-2 py-0.5 ${item.published ? "bg-green-500/90 text-white" : "bg-gray-700 text-gray-300"}`}>
                                                {item.published ? "LIVE" : "DRAFT"}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <p className="font-body text-[10px] text-[#4353FF] uppercase tracking-widest mb-1">{item.category}</p>
                                        <h3 className="font-heading font-black text-white text-base mb-2">{item.title}</h3>
                                        {item.description && <p className="font-body text-gray-500 text-xs line-clamp-2 mb-3">{item.description}</p>}
                                        {item.tags && item.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-1 mb-3">
                                                {item.tags.map(t => <span key={t} className="font-body text-[10px] text-gray-500 bg-white/5 px-2 py-0.5">{t}</span>)}
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2 pt-3 border-t border-white/[0.06]">
                                            <button onClick={() => openEdit(item)}
                                                className="font-body text-xs text-gray-400 hover:text-white transition-colors px-2 py-1 border border-white/10 hover:border-white/30">
                                                Edit
                                            </button>
                                            <button onClick={() => togglePublish(item)}
                                                className={`font-body text-xs px-2 py-1 border transition-colors ${item.published ? "text-yellow-400 border-yellow-400/20 hover:bg-yellow-400 hover:text-black" : "text-green-400 border-green-400/20 hover:bg-green-400 hover:text-black"}`}>
                                                {item.published ? "Unpublish" : "Publish"}
                                            </button>
                                            <button onClick={() => handleDelete(item.id)}
                                                className="ml-auto font-body text-xs text-red-500 hover:text-white hover:bg-red-500 transition-all px-2 py-1 border border-red-500/20">
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-[#111] border border-white/10 w-full max-w-xl max-h-[90vh] flex flex-col">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
                            <h3 className="font-heading font-black text-white uppercase tracking-tight">{editItem ? "Edit Project" : "Add Project"}</h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-white transition-colors">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
                            </button>
                        </div>
                        <div className="overflow-y-auto p-6 space-y-4 flex-1">
                            {error && <p className="text-red-400 text-sm font-body bg-red-500/10 border border-red-500/20 px-4 py-3">{error}</p>}

                            {/* Image upload */}
                            <div>
                                <label className="block font-body text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Project Image</label>
                                <div className="border border-dashed border-white/10 hover:border-[#4353FF]/40 transition-colors cursor-pointer relative"
                                    onClick={() => fileRef.current?.click()}>
                                    {preview ? (
                                        <img src={preview} className="w-full h-36 object-cover" alt="preview" />
                                    ) : (
                                        <div className="h-36 flex flex-col items-center justify-center gap-2 text-gray-600">
                                            {uploading ? (
                                                <svg className="animate-spin w-6 h-6 text-[#4353FF]" viewBox="0 0 24 24" fill="none">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                                </svg>
                                            ) : (
                                                <>
                                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 5v10M7 10l5-5 5 5M5 19h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                                    <span className="font-body text-xs">Click to upload image</span>
                                                </>
                                            )}
                                        </div>
                                    )}
                                    <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
                                </div>
                                {preview && <button onClick={() => { setForm(f => ({ ...f, image: "" })); setPreview(""); }} className="font-body text-xs text-red-400 mt-1 hover:text-red-300">Remove image</button>}
                            </div>

                            <div>
                                <label className="block font-body text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Title *</label>
                                <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Project name"
                                    className="w-full bg-white/5 border border-white/10 text-white font-body text-sm px-4 py-3 placeholder-gray-600 focus:outline-none focus:border-[#4353FF] transition-colors" />
                            </div>

                            <div>
                                <label className="block font-body text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Category</label>
                                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 text-white font-body text-sm px-4 py-3 focus:outline-none focus:border-[#4353FF] transition-colors">
                                    {CATEGORIES.map(c => <option key={c} value={c} className="bg-[#111]">{c}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="block font-body text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Description</label>
                                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} placeholder="Brief project description..."
                                    className="w-full bg-white/5 border border-white/10 text-white font-body text-sm px-4 py-3 placeholder-gray-600 focus:outline-none focus:border-[#4353FF] transition-colors resize-none" />
                            </div>

                            <div>
                                <label className="block font-body text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Tags (comma separated)</label>
                                <input type="text" value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} placeholder="React, Next.js, Tailwind"
                                    className="w-full bg-white/5 border border-white/10 text-white font-body text-sm px-4 py-3 placeholder-gray-600 focus:outline-none focus:border-[#4353FF] transition-colors" />
                            </div>

                            <div>
                                <label className="block font-body text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Live URL</label>
                                <input type="url" value={form.liveUrl} onChange={e => setForm({ ...form, liveUrl: e.target.value })} placeholder="https://..."
                                    className="w-full bg-white/5 border border-white/10 text-white font-body text-sm px-4 py-3 placeholder-gray-600 focus:outline-none focus:border-[#4353FF] transition-colors" />
                            </div>

                            <div className="flex gap-6">
                                <label className="flex items-center gap-2.5 cursor-pointer">
                                    <input type="checkbox" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} className="accent-[#4353FF] w-4 h-4" />
                                    <span className="font-body text-gray-300 text-sm">Featured project</span>
                                </label>
                                <label className="flex items-center gap-2.5 cursor-pointer">
                                    <input type="checkbox" checked={form.published} onChange={e => setForm({ ...form, published: e.target.checked })} className="accent-[#4353FF] w-4 h-4" />
                                    <span className="font-body text-gray-300 text-sm">Published (visible on site)</span>
                                </label>
                            </div>
                        </div>

                        <div className="p-6 border-t border-white/[0.06]">
                            <button onClick={handleSave} disabled={saving || uploading}
                                className="w-full bg-[#4353FF] text-white font-heading font-black py-3.5 uppercase tracking-wider text-sm hover:bg-white hover:text-[#0f0f0f] transition-all duration-300 disabled:opacity-50">
                                {saving ? "Saving..." : editItem ? "Save Changes" : "Add Project"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}