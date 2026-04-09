"use client";
import { useEffect, useState, useRef } from "react";

import Link from "next/link";

interface Post { id: string; title: string; slug: string; excerpt: string; content: string; image: string; published: boolean; author: { name: string }; category: { name: string }; createdAt: string; }
interface Category { id: string; name: string; slug: string; }

const emptyForm = { title: "", slug: "", excerpt: "", content: "", image: "", categoryId: "", published: false };

export default function BlogPostsPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [session, setSession] = useState<any>(null);
    const [showModal, setShowModal] = useState(false);
    const [editPost, setEditPost] = useState<Post | null>(null);
    const [form, setForm] = useState(emptyForm);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInput = useRef<HTMLInputElement>(null);

    useEffect(() => {

        fetch("/api/admin/blog/categories").then(r => r.json()).then(d => setCategories(d.categories || []));
        load();
    }, []);

    async function load() {
        const r = await fetch("/api/admin/blog/posts");
        const d = await r.json();
        const flattened = (d.posts || []).map((item: any) => ({
            ...item.post,
            author: item.author,
            category: item.category
        }));
        setPosts(flattened);
    }

    function openAdd() { setEditPost(null); setForm({ ...emptyForm, categoryId: categories[0]?.id || "" }); setShowModal(true); }
    function openEdit(p: Post) {
        setEditPost(p);
        const { id, author, category, createdAt, ...rest } = p as any;
        setForm({ ...rest, categoryId: categories.find(c => c.name === category?.name)?.id || categories[0]?.id || "" });
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
        } finally { setUploading(false); }
    }

    async function handleSave(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        const url = editPost ? `/api/admin/blog/posts/${editPost.id}` : "/api/admin/blog/posts";
        const method = editPost ? "PATCH" : "POST";
        const r = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
        if (!r.ok) { alert("Error saving post"); setSaving(false); return; }
        setShowModal(false); load(); setSaving(false);
    }

    async function handleDelete(id: string) {
        if (!confirm("Delete post forever?")) return;
        await fetch(`/api/admin/blog/posts/${id}`, { method: "DELETE" });
        load();
    }

    return (
        <div className="flex h-screen bg-[#0a0a0a] overflow-hidden">

            <main className="flex-1 flex flex-col overflow-hidden">
                <div className="sticky top-0 z-10 bg-[#0a0a0a]/95 backdrop-blur border-b border-white/[0.06] px-8 py-4 flex items-center justify-between">
                    <div>
                        <h1 className="font-heading font-black text-white text-xl uppercase tracking-tight">Blog Posts</h1>
                        <Link href="/admin/blog/categories" className="font-body text-xs text-[#4353FF] hover:text-white transition-colors">Manage Categories →</Link>
                    </div>
                    <button onClick={openAdd} className="bg-[#4353FF] text-white font-body font-semibold text-sm px-5 py-2.5 hover:bg-white hover:text-[#0f0f0f] transition-all">
                        + New Post
                    </button>
                </div>

                <div className="flex-1 p-8 overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {posts.map(p => (
                            <div key={p.id} className="bg-[#111] border border-white/10 group overflow-hidden flex flex-col">
                                {p.image ? (
                                    <div className="h-48 w-full bg-cover bg-center border-b border-white/10" style={{ backgroundImage: `url(${p.image})` }} />
                                ) : (
                                    <div className="h-48 w-full bg-[#1a1a1a] border-b border-white/10 flex items-center justify-center">
                                        <p className="font-body text-gray-700 text-xs uppercase tracking-widest">No Image</p>
                                    </div>
                                )}
                                <div className="p-5 flex-1 flex flex-col">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-1 ${p.published ? "bg-green-400/10 text-green-400 border border-green-400/20" : "bg-yellow-400/10 text-yellow-400 border border-yellow-400/20"}`}>
                                            {p.published ? "Published" : "Draft"}
                                        </span>
                                        {p.category && <span className="font-body text-[10px] text-gray-500 uppercase tracking-widest">{p.category.name}</span>}
                                    </div>
                                    <h2 className="font-heading font-bold text-white text-lg mb-2 line-clamp-2">{p.title}</h2>
                                    <p className="font-body text-gray-500 text-xs line-clamp-2 flex-1 mb-4">{p.excerpt || "No excerpt."}</p>

                                    <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
                                        <p className="font-body text-gray-600 text-[10px] uppercase">{p.author?.name || "Unknown"} • {new Date(p.createdAt).toLocaleDateString()}</p>
                                        <div className="flex gap-2">
                                            <button onClick={() => openEdit(p)} className="text-gray-500 hover:text-[#4353FF]">Edit</button>
                                            <button onClick={() => handleDelete(p.id)} className="text-gray-500 hover:text-red-400">Del</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {showModal && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
                        <div className="bg-[#111] w-full max-w-4xl max-h-[90vh] flex flex-col border border-white/10 shadow-2xl">
                            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
                                <h3 className="font-heading font-black text-white text-lg">{editPost ? "Edit Post" : "Draft New Post"}</h3>
                                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white"><svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 3l14 14M17 3L3 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg></button>
                            </div>
                            <form onSubmit={handleSave} className="flex-1 flex flex-col overflow-hidden">
                                <div className="flex-1 overflow-y-auto p-6 grid grid-cols-3 gap-8">
                                    <div className="col-span-2 space-y-5">
                                        <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Post Title" required
                                            className="w-full bg-transparent text-white font-heading font-black text-3xl placeholder-gray-600 focus:outline-none" />
                                        <input type="text" value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })} placeholder="post-url-slug" required
                                            className="w-full bg-transparent border-b border-white/[0.06] pb-4 text-[#4353FF] font-mono text-xs placeholder-gray-600 focus:outline-none focus:border-white/20" />

                                        <div>
                                            <label className="block font-body text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Content (Markdown / Text)</label>
                                            <textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} required rows={15}
                                                className="w-full bg-white/5 border border-white/10 text-white font-body text-sm p-4 placeholder-gray-600 focus:outline-none focus:border-[#4353FF]" />
                                        </div>
                                    </div>
                                    <div className="col-span-1 space-y-6">
                                        <div>
                                            <label className="block font-body text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Category</label>
                                            <select value={form.categoryId} onChange={e => setForm({ ...form, categoryId: e.target.value })} className="w-full bg-white/5 border border-white/10 text-white font-body text-sm px-4 py-3 focus:outline-none focus:border-[#4353FF]">
                                                {categories.map(c => <option key={c.id} value={c.id} className="bg-[#111]">{c.name}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block font-body text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Cover Image</label>
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
                                            <label className="block font-body text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Short Excerpt</label>
                                            <textarea value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} rows={4}
                                                className="w-full bg-white/5 border border-white/10 text-white font-body text-sm p-4 placeholder-gray-600 focus:outline-none focus:border-[#4353FF]" />
                                        </div>
                                        <div className="flex items-center gap-3 bg-white/5 p-4 border border-white/10">
                                            <input type="checkbox" id="pub" checked={form.published} onChange={e => setForm({ ...form, published: e.target.checked })} className="accent-[#4353FF] w-4 h-4 cursor-pointer" />
                                            <label htmlFor="pub" className="font-body text-sm text-white cursor-pointer select-none">Publish immediately</label>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6 border-t border-white/[0.06] bg-[#0a0a0a] flex justify-end">
                                    <button type="submit" disabled={saving || uploading} className="bg-[#4353FF] text-white font-heading font-black px-8 py-3 uppercase tracking-wider hover:bg-white hover:text-[#0f0f0f] transition-all disabled:opacity-50">
                                        {saving ? "Saving..." : "Save Post"}
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