"use client";
import { useEffect, useState } from "react";
import Sidebar from "@/components/admin/Sidebar";

interface Category { id: string; name: string; slug: string; createdAt: string; }

export default function BlogCategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [session, setSession] = useState<any>(null);
    const [form, setForm] = useState({ name: "", slug: "" });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        fetch("/api/admin/me").then(r => r.json()).then(d => setSession(d.user));
        load();
    }, []);

    async function load() {
        const r = await fetch("/api/admin/blog/categories");
        const d = await r.json();
        setCategories(d.categories || []);
    }

    async function handleSave(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true); setError("");
        const r = await fetch("/api/admin/blog/categories", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form)
        });
        const d = await r.json();
        if (!r.ok) { setError(d.error); setSaving(false); return; }
        setForm({ name: "", slug: "" });
        load();
        setSaving(false);
    }

    async function handleDelete(id: string) {
        if (!confirm("Delete category? This might fail if posts use it.")) return;
        const r = await fetch(`/api/admin/blog/categories/${id}`, { method: "DELETE" });
        const d = await r.json();
        if (!r.ok) alert(d.error);
        else load();
    }

    return (
        <div className="flex h-screen bg-[#0a0a0a] overflow-hidden">
            <Sidebar userName={session?.name||""} userRole={session?.role||""} userEmail={session?.email||""} userAvatar={session?.avatar} />

            <main className="flex-1 flex overflow-hidden">
                <div className="w-[400px] flex-col border-r border-white/[0.06] flex-shrink-0 bg-[#0d0d0d] hidden lg:flex">
                    <div className="sticky top-0 z-10 bg-[#0a0a0a]/95 backdrop-blur border-b border-white/[0.06] px-6 py-4">
                        <h1 className="font-heading font-black text-white text-xl uppercase tracking-tight">Add Category</h1>
                    </div>
                    <div className="p-6">
                        {error && <p className="text-red-400 text-sm font-body mb-4">{error}</p>}
                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label className="block font-body text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Name</label>
                                <input type="text" value={form.name} onChange={e=>setForm({...form, name: e.target.value})} placeholder="Technology" required
                                       className="w-full bg-white/5 border border-white/10 text-white font-body text-sm px-4 py-3 placeholder-gray-600 focus:outline-none focus:border-[#4353FF]" />
                            </div>
                            <div>
                                <label className="block font-body text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Slug</label>
                                <input type="text" value={form.slug} onChange={e=>setForm({...form, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')})} placeholder="technology" required
                                       className="w-full bg-white/5 border border-white/10 text-white font-body text-sm px-4 py-3 placeholder-gray-600 focus:outline-none focus:border-[#4353FF]" />
                            </div>
                            <button type="submit" disabled={saving} className="w-full bg-[#4353FF] text-white font-heading font-black py-3 uppercase text-sm hover:bg-white hover:text-[#0f0f0f] transition-all disabled:opacity-50">
                                {saving ? "Saving..." : "Create"}
                            </button>
                        </form>
                    </div>
                </div>

                <div className="flex-1 flex flex-col">
                    <div className="sticky top-0 z-10 bg-[#0a0a0a]/95 backdrop-blur border-b border-white/[0.06] px-6 py-4 flex items-center justify-between">
                        <div>
                            <h1 className="font-heading font-black text-white text-xl uppercase tracking-tight">Categories</h1>
                            <p className="font-body text-gray-500 text-xs mt-0.5">{categories.length} total</p>
                        </div>
                    </div>
                    <div className="flex-1 p-6 overflow-y-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                            {categories.map(c => (
                                <div key={c.id} className="bg-[#111] border border-white/10 p-5 flex items-center justify-between group hover:border-white/20 transition-all">
                                    <div>
                                        <p className="font-heading font-bold text-white text-base">{c.name}</p>
                                        <p className="font-body text-[11px] text-gray-500 font-mono mt-1">/{c.slug}</p>
                                    </div>
                                    <button onClick={() => handleDelete(c.id)} className="text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all">
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 4h10M5 4V3c0-.6.4-1 1-1h4c.6 0 1 .4 1 1v1m-2 10H6c-.6 0-1-.4-1-1V5h6v8c0 .6-.4 1-1 1z" stroke="currentColor" strokeWidth="1.5"/></svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
