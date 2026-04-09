"use client";

import { useState, useRef } from "react";

export default function ProfileForm({ user }: { user: any }) {
    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);
    const [password, setPassword] = useState("");
    const [avatar, setAvatar] = useState(user.avatar || null);
    
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [uploading, setUploading] = useState(false);
    const fileInput = useRef<HTMLInputElement>(null);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const fb = new FormData();
        fb.append("file", file);

        try {
            const res = await fetch("/api/admin/upload", {
                method: "POST",
                body: fb,
            });
            const data = await res.json();
            if (res.ok) {
                setAvatar(data.url);
            } else {
                alert(data.error || "Upload failed");
            }
        } catch {
            alert("Upload failed");
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("loading");
        
        try {
            const res = await fetch("/api/admin/me", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password, avatar }),
            });
            if (res.ok) {
                setStatus("success");
                setPassword(""); // clear password field
                setTimeout(() => setStatus("idle"), 3000);
            } else {
                setStatus("error");
            }
        } catch {
            setStatus("error");
        }
    };

    return (
        <form onSubmit={handleSave} className="bg-[#111] border border-white/[0.06] p-8 space-y-8">
            {/* Avatar Section */}
            <div className="flex items-center gap-6 pb-8 border-b border-white/[0.06]">
                <div className="relative group">
                    {avatar ? (
                        <img src={avatar} alt="Avatar" className="w-20 h-20 rounded-full object-cover border border-[#4353FF]/40" />
                    ) : (
                        <div className="w-20 h-20 rounded-full bg-[#4353FF]/10 border border-[#4353FF]/30 flex items-center justify-center font-heading font-black text-[#4353FF] text-2xl">
                            {name[0]?.toUpperCase()}
                        </div>
                    )}
                    <button type="button" onClick={() => fileInput.current?.click()} className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>
                    </button>
                    {uploading && (
                        <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center delay-100">
                             <svg className="animate-spin w-5 h-5 text-white" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                        </div>
                    )}
                    <input type="file" ref={fileInput} onChange={handleUpload} accept="image/*" className="hidden" />
                </div>
                <div>
                    <h3 className="font-heading font-bold text-white text-lg">Profile Image</h3>
                    <p className="font-body text-gray-500 text-xs mt-1">Recommended size: 400x400px. Max 2MB.</p>
                    {avatar && (
                        <button type="button" onClick={() => setAvatar(null)} className="font-body text-red-400 text-xs mt-2 hover:text-red-300 transition-colors">
                            Remove picture
                        </button>
                    )}
                </div>
            </div>

            {/* Fields */}
            <div className="grid gap-6">
                <div>
                    <label className="block font-body font-semibold text-[11px] text-gray-400 uppercase tracking-widest mb-2">Full Name</label>
                    <input type="text" value={name} onChange={e=>setName(e.target.value)}
                           className="w-full bg-white/5 border border-white/10 text-white font-body text-sm px-4 py-3 placeholder-gray-600 focus:outline-none focus:border-[#4353FF] transition-colors" required/>
                </div>
                <div>
                    <label className="block font-body font-semibold text-[11px] text-gray-400 uppercase tracking-widest mb-2">Email Address</label>
                    <input type="email" value={email} onChange={e=>setEmail(e.target.value)}
                           className="w-full bg-white/5 border border-white/10 text-white font-body text-sm px-4 py-3 placeholder-gray-600 focus:outline-none focus:border-[#4353FF] transition-colors" required/>
                </div>
                <div>
                    <label className="block font-body font-semibold text-[11px] text-gray-400 uppercase tracking-widest mb-2">New Password <span className="text-gray-600 normal-case tracking-normal ml-1">(Leave blank to keep current)</span></label>
                    <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••"
                           className="w-full bg-white/5 border border-white/10 text-white font-body text-sm px-4 py-3 placeholder-gray-600 focus:outline-none focus:border-[#4353FF] transition-colors"/>
                </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
                <div>
                    {status === "success" && <span className="font-body text-green-400 text-sm">Profile saved!</span>}
                    {status === "error" && <span className="font-body text-red-400 text-sm">Error saving profile.</span>}
                </div>
                <button type="submit" disabled={status === "loading" || uploading}
                        className="bg-[#4353FF] text-white font-heading font-black px-6 py-3 uppercase tracking-wider hover:bg-white hover:text-[#0f0f0f] transition-all duration-300 disabled:opacity-50">
                    {status === "loading" ? "Saving..." : "Save Changes"}
                </button>
            </div>
        </form>
    );
}
