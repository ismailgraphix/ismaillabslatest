"use client";
import { useEffect, useState, useRef } from "react";


interface Member { id: string; name: string; role: string; bio: string | null; image: string | null; email: string | null; linkedin: string | null; twitter: string | null; order: number; published: boolean; }

const emptyForm = { name: "", role: "", bio: "", image: "", email: "", linkedin: "", twitter: "", order: 0, published: true };

export default function TeamPage() {
    const [members, setMembers] = useState<Member[]>([]);

    const [showModal, setShowModal] = useState(false);
    const [editMember, setEditMember] = useState<Member | null>(null);
    const [form, setForm] = useState(emptyForm);
    const [preview, setPreview] = useState("");
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const fileRef = useRef<HTMLInputElement>(null);

    useEffect(() => {

        load();
    }, []);

    async function load() {
        const r = await fetch("/api/admin/team");
        const d = await r.json();
        setMembers(d.members || []);
    }

    function openAdd() { setEditMember(null); setForm(emptyForm); setPreview(""); setError(""); setShowModal(true); }
    function openEdit(m: Member) {
        setEditMember(m);
        setForm({ name: m.name, role: m.role, bio: m.bio || "", image: m.image || "", email: m.email || "", linkedin: m.linkedin || "", twitter: m.twitter || "", order: m.order, published: m.published });
        setPreview(m.image || "");
        setError(""); setShowModal(true);
    }

    async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]; if (!file) return;
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
        const url = editMember ? `/api/admin/team/${editMember.id}` : "/api/admin/team";
        const method = editMember ? "PATCH" : "POST";
        const r = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
        const d = await r.json();
        if (!r.ok) { setError(d.error); setSaving(false); return; }
        setShowModal(false); load(); setSaving(false);
    }

    async function handleDelete(id: string) {
        if (!confirm("Remove this team member?")) return;
        await fetch(`/api/admin/team/${id}`, { method: "DELETE" });
        load();
    }

    async function togglePublish(m: Member) {
        await fetch(`/api/admin/team/${m.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ published: !m.published }) });
        load();
    }

    return (
        <div className="flex h-screen bg-[#0a0a0a] overflow-hidden">

            <main className="flex-1 overflow-y-auto">
                <div className="sticky top-0 z-10 bg-[#0a0a0a]/95 backdrop-blur border-b border-white/[0.06] px-8 py-4 flex items-center justify-between">
                    <div>
                        <h1 className="font-heading font-black text-white text-xl uppercase tracking-tight">Team Members</h1>
                        <p className="font-body text-gray-500 text-xs mt-0.5">{members.length} members · displayed on site</p>
                    </div>
                    <button onClick={openAdd}
                        className="flex items-center gap-2 bg-[#4353FF] text-white font-body font-semibold text-sm px-5 py-2.5 hover:bg-white hover:text-[#0f0f0f] transition-all duration-200">
                        + Add Member
                    </button>
                </div>

                <div className="p-8">
                    {members.length === 0 ? (
                        <div className="border border-dashed border-white/10 py-20 text-center">
                            <p className="font-body text-gray-500 text-sm mb-4">No team members yet</p>
                            <button onClick={openAdd} className="font-body text-sm text-[#4353FF] hover:text-white transition-colors">+ Add first member</button>
                        </div>
                    ) : (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {members.map(m => (
                                <div key={m.id} className="bg-[#111] border border-white/[0.06] overflow-hidden group hover:border-white/15 transition-all">
                                    <div className="aspect-[3/4] bg-gray-900 relative overflow-hidden">
                                        {m.image ? (
                                            <img src={m.image} alt={m.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <div className="w-20 h-20 rounded-full bg-[#4353FF]/20 border border-[#4353FF]/30 flex items-center justify-center">
                                                    <span className="font-heading font-black text-[#4353FF] text-3xl">{m.name[0]}</span>
                                                </div>
                                            </div>
                                        )}
                                        <div className="absolute top-2 right-2">
                                            <span className={`font-body text-[10px] font-bold px-2 py-0.5 ${m.published ? "bg-green-500/90 text-white" : "bg-gray-700 text-gray-300"}`}>
                                                {m.published ? "LIVE" : "HIDDEN"}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-heading font-black text-white text-base">{m.name}</h3>
                                        <p className="font-body text-[#4353FF] text-xs font-semibold mb-2">{m.role}</p>
                                        {m.bio && <p className="font-body text-gray-500 text-xs line-clamp-2 mb-3">{m.bio}</p>}
                                        <div className="flex gap-2 pt-3 border-t border-white/[0.06]">
                                            <button onClick={() => openEdit(m)}
                                                className="font-body text-xs text-gray-400 hover:text-white transition-colors px-2 py-1 border border-white/10 hover:border-white/30">Edit</button>
                                            <button onClick={() => togglePublish(m)}
                                                className={`font-body text-xs px-2 py-1 border transition-colors ${m.published ? "text-yellow-400 border-yellow-400/20 hover:bg-yellow-400 hover:text-black" : "text-green-400 border-green-400/20 hover:bg-green-400 hover:text-black"}`}>
                                                {m.published ? "Hide" : "Show"}
                                            </button>
                                            <button onClick={() => handleDelete(m.id)}
                                                className="ml-auto font-body text-xs text-red-500 hover:text-white hover:bg-red-500 transition-all px-2 py-1 border border-red-500/20">Delete</button>
                                        </div>
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
                            <h3 className="font-heading font-black text-white uppercase tracking-tight">{editMember ? "Edit Member" : "Add Member"}</h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-white transition-colors">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
                            </button>
                        </div>
                        <div className="overflow-y-auto p-6 space-y-4 flex-1">
                            {error && <p className="text-red-400 text-sm font-body bg-red-500/10 border border-red-500/20 px-4 py-3">{error}</p>}

                            {/* Photo upload */}
                            <div>
                                <label className="block font-body text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Photo</label>
                                <div className="flex items-center gap-4">
                                    <div className="w-20 h-20 rounded-full bg-gray-800 border border-white/10 overflow-hidden flex items-center justify-center flex-shrink-0 cursor-pointer hover:border-[#4353FF]/40 transition-colors" onClick={() => fileRef.current?.click()}>
                                        {preview ? <img src={preview} className="w-full h-full object-cover" alt="" /> :
                                            uploading ? <svg className="animate-spin w-5 h-5 text-[#4353FF]" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg> :
                                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 4v8M6 8l4-4 4 4" stroke="#555" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M3 16h14" stroke="#555" strokeWidth="1.5" strokeLinecap="round" /></svg>
                                        }
                                    </div>
                                    <div>
                                        <button onClick={() => fileRef.current?.click()} type="button"
                                            className="font-body text-sm text-[#4353FF] hover:text-white transition-colors block mb-1">Upload photo</button>
                                        {preview && <button onClick={() => { setForm(f => ({ ...f, image: "" })); setPreview(""); }} type="button"
                                            className="font-body text-xs text-red-400 hover:text-red-300 transition-colors">Remove</button>}
                                    </div>
                                    <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
                                </div>
                            </div>

                            {[
                                { key: "name", label: "Full Name *", placeholder: "Charlotte Amitina" },
                                { key: "role", label: "Job Title *", placeholder: "UI/UX Designer" },
                                { key: "email", label: "Email", placeholder: "charlotte@ismaillabs.com" },
                            ].map(f => (
                                <div key={f.key}>
                                    <label className="block font-body text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2">{f.label}</label>
                                    <input type="text" value={(form as any)[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                                        placeholder={f.placeholder}
                                        className="w-full bg-white/5 border border-white/10 text-white font-body text-sm px-4 py-3 placeholder-gray-600 focus:outline-none focus:border-[#4353FF] transition-colors" />
                                </div>
                            ))}
                            <div>
                                <label className="block font-body text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Bio</label>
                                <textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} rows={3}
                                    placeholder="Short bio..." className="w-full bg-white/5 border border-white/10 text-white font-body text-sm px-4 py-3 placeholder-gray-600 focus:outline-none focus:border-[#4353FF] transition-colors resize-none" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { key: "linkedin", label: "LinkedIn URL", placeholder: "https://linkedin.com/in/..." },
                                    { key: "twitter", label: "Twitter URL", placeholder: "https://twitter.com/..." },
                                ].map(f => (
                                    <div key={f.key}>
                                        <label className="block font-body text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2">{f.label}</label>
                                        <input type="url" value={(form as any)[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                                            placeholder={f.placeholder}
                                            className="w-full bg-white/5 border border-white/10 text-white font-body text-sm px-4 py-3 placeholder-gray-600 focus:outline-none focus:border-[#4353FF] transition-colors" />
                                    </div>
                                ))}
                            </div>
                            <div className="flex items-center gap-6">
                                <label className="flex items-center gap-2.5 cursor-pointer">
                                    <input type="checkbox" checked={form.published} onChange={e => setForm({ ...form, published: e.target.checked })} className="accent-[#4353FF] w-4 h-4" />
                                    <span className="font-body text-gray-300 text-sm">Visible on site</span>
                                </label>
                                <div className="flex items-center gap-2">
                                    <label className="font-body text-[11px] font-semibold text-gray-400 uppercase tracking-widest">Order</label>
                                    <input type="number" value={form.order} onChange={e => setForm({ ...form, order: parseInt(e.target.value) || 0 })}
                                        className="w-16 bg-white/5 border border-white/10 text-white font-body text-sm px-3 py-2 focus:outline-none focus:border-[#4353FF] transition-colors" />
                                </div>
                            </div>
                        </div>
                        <div className="p-6 border-t border-white/[0.06]">
                            <button onClick={handleSave} disabled={saving || uploading}
                                className="w-full bg-[#4353FF] text-white font-heading font-black py-3.5 uppercase tracking-wider text-sm hover:bg-white hover:text-[#0f0f0f] transition-all duration-300 disabled:opacity-50">
                                {saving ? "Saving..." : editMember ? "Save Changes" : "Add Member"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}