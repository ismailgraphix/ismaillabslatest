"use client";
import { useEffect, useState } from "react";
import Sidebar from "@/components/admin/Sidebar";
import { ROLE_PERMISSIONS } from "@/lib/permissions";

const ROLES = ["admin", "editor", "viewer"] as const;
type Role = typeof ROLES[number];

interface User { id: string; name: string; email: string; role: string; status: string; createdAt: string; lastLoginAt: string | null; }

const roleColors: Record<string, string> = {
    super_admin: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
    admin:       "text-[#4353FF] bg-[#4353FF]/10 border-[#4353FF]/20",
    editor:      "text-purple-400 bg-purple-400/10 border-purple-400/20",
    viewer:      "text-gray-400 bg-gray-400/10 border-gray-400/20",
};

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [session, setSession] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editUser, setEditUser] = useState<User | null>(null);
    const [showPermModal, setShowPermModal] = useState<User | null>(null);
    const [form, setForm] = useState({ name: "", email: "", password: "", role: "editor" as Role });
    const [permsOverride, setPermsOverride] = useState<string[]>([]);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        fetch("/api/admin/me").then(r => r.json()).then(d => setSession(d.user));
        loadUsers();
    }, []);

    async function loadUsers() {
        setLoading(true);
        const r = await fetch("/api/admin/users");
        const d = await r.json();
        setUsers(d.users || []);
        setLoading(false);
    }

    async function handleSave() {
        setSaving(true); setError("");
        const url = editUser ? `/api/admin/users/${editUser.id}` : "/api/admin/users";
        const method = editUser ? "PATCH" : "POST";
        const body = editUser ? { name: form.name, role: form.role } : form;
        const r = await fetch(url, { method, headers: { "Content-Type":"application/json" }, body: JSON.stringify(body) });
        const d = await r.json();
        if (!r.ok) { setError(d.error); setSaving(false); return; }
        setShowModal(false); setEditUser(null); setForm({ name:"", email:"", password:"", role:"editor" });
        loadUsers(); setSaving(false);
    }

    async function handleDelete(id: string) {
        if (!confirm("Delete this user? This cannot be undone.")) return;
        await fetch(`/api/admin/users/${id}`, { method:"DELETE" });
        loadUsers();
    }

    async function savePermissions() {
        if (!showPermModal) return;
        setSaving(true);
        await fetch(`/api/admin/users/${showPermModal.id}/permissions`, {
            method: "PUT", headers: {"Content-Type":"application/json"},
            body: JSON.stringify({ permissions: permsOverride }),
        });
        setSaving(false); setShowPermModal(null); loadUsers();
    }

    const modules = [...new Set(Object.entries(ROLE_PERMISSIONS).flatMap(([,v]) => v).map(p => p.split(".")[0]))];

    return (
        <div className="flex h-screen bg-[#0a0a0a] overflow-hidden">
            <Sidebar userName={session?.name || ""} userRole={session?.role || ""} userEmail={session?.email || ""} />

            <main className="flex-1 overflow-y-auto">
                <div className="sticky top-0 z-10 bg-[#0a0a0a]/95 backdrop-blur border-b border-white/[0.06] px-8 py-4 flex items-center justify-between">
                    <div>
                        <h1 className="font-heading font-black text-white text-xl uppercase tracking-tight">Admin Users</h1>
                        <p className="font-body text-gray-500 text-xs mt-0.5">Manage access and permissions</p>
                    </div>
                    <button onClick={() => { setEditUser(null); setForm({ name:"", email:"", password:"", role:"editor" }); setShowModal(true); }}
                            className="flex items-center gap-2 bg-[#4353FF] text-white font-body font-semibold text-sm px-5 py-2.5 hover:bg-white hover:text-[#0f0f0f] transition-all duration-200">
                        + Add User
                    </button>
                </div>

                <div className="p-8">
                    <div className="bg-[#111] border border-white/[0.06] overflow-hidden">
                        <table className="w-full">
                            <thead>
                            <tr className="border-b border-white/[0.06]">
                                {["User","Role","Status","Last Login","Actions"].map(h => (
                                    <th key={h} className="text-left px-5 py-3 font-body font-semibold text-[11px] text-gray-500 uppercase tracking-widest">{h}</th>
                                ))}
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.04]">
                            {loading ? (
                                <tr><td colSpan={5} className="text-center py-12 text-gray-600 font-body text-sm">Loading...</td></tr>
                            ) : users.map(u => (
                                <tr key={u.id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-[#4353FF]/20 border border-[#4353FF]/20 flex items-center justify-center flex-shrink-0">
                                                <span className="font-heading font-black text-[#4353FF] text-xs">{u.name[0]?.toUpperCase()}</span>
                                            </div>
                                            <div>
                                                <p className="font-heading font-bold text-white text-sm">{u.name}</p>
                                                <p className="font-body text-gray-500 text-xs">{u.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4">
                      <span className={`font-body font-semibold text-[11px] uppercase tracking-wider px-2.5 py-1 border capitalize ${roleColors[u.role] || roleColors.viewer}`}>
                        {u.role.replace("_"," ")}
                      </span>
                                    </td>
                                    <td className="px-5 py-4">
                      <span className={`font-body text-xs ${u.status === "active" ? "text-green-400" : "text-red-400"}`}>
                        ● {u.status}
                      </span>
                                    </td>
                                    <td className="px-5 py-4 font-body text-gray-500 text-xs">
                                        {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleDateString() : "Never"}
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => { setShowPermModal(u); setPermsOverride([]); }}
                                                    className="font-body text-xs text-[#4353FF] hover:text-white transition-colors px-2 py-1 border border-[#4353FF]/30 hover:border-white/30">
                                                Permissions
                                            </button>
                                            {u.role !== "super_admin" && (
                                                <>
                                                    <button onClick={() => { setEditUser(u); setForm({ name:u.name, email:u.email, password:"", role:u.role as Role }); setShowModal(true); }}
                                                            className="font-body text-xs text-gray-400 hover:text-white transition-colors px-2 py-1 border border-white/10 hover:border-white/30">
                                                        Edit
                                                    </button>
                                                    <button onClick={() => handleDelete(u.id)}
                                                            className="font-body text-xs text-red-500 hover:text-white hover:bg-red-500 transition-all px-2 py-1 border border-red-500/30">
                                                        Delete
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            {/* Add/Edit User Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-[#111] border border-white/10 w-full max-w-md">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
                            <h3 className="font-heading font-black text-white uppercase tracking-tight">{editUser ? "Edit User" : "Add New User"}</h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-white transition-colors">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            {error && <p className="text-red-400 text-sm font-body bg-red-500/10 border border-red-500/20 px-4 py-3">{error}</p>}
                            {[
                                { label: "Full Name", key: "name", type: "text", placeholder: "John Doe" },
                                ...(!editUser ? [{ label: "Email", key: "email", type: "email", placeholder: "john@example.com" }] : []),
                                ...(!editUser ? [{ label: "Password", key: "password", type: "password", placeholder: "Min 8 chars" }] : []),
                            ].map(f => (
                                <div key={f.key}>
                                    <label className="block font-body text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2">{f.label}</label>
                                    <input type={f.type} placeholder={f.placeholder}
                                           value={(form as any)[f.key]}
                                           onChange={e => setForm({...form, [f.key]: e.target.value})}
                                           className="w-full bg-white/5 border border-white/10 text-white font-body text-sm px-4 py-3 placeholder-gray-600 focus:outline-none focus:border-[#4353FF] transition-colors"
                                    />
                                </div>
                            ))}
                            <div>
                                <label className="block font-body text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Role</label>
                                <select value={form.role} onChange={e => setForm({...form, role: e.target.value as Role})}
                                        className="w-full bg-white/5 border border-white/10 text-white font-body text-sm px-4 py-3 focus:outline-none focus:border-[#4353FF] transition-colors">
                                    {ROLES.map(r => <option key={r} value={r} className="bg-[#111]">{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
                                </select>
                                <p className="font-body text-gray-600 text-xs mt-1.5">
                                    {form.role === "admin" && "Can manage clients, projects, team, and content."}
                                    {form.role === "editor" && "Can create and edit content but not delete or manage users."}
                                    {form.role === "viewer" && "Read-only access to all sections."}
                                </p>
                            </div>
                            <button onClick={handleSave} disabled={saving}
                                    className="w-full bg-[#4353FF] text-white font-heading font-black py-3.5 uppercase tracking-wider text-sm hover:bg-white hover:text-[#0f0f0f] transition-all duration-300 disabled:opacity-50 mt-2">
                                {saving ? "Saving..." : editUser ? "Save Changes" : "Create User"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Permissions Modal */}
            {showPermModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-[#111] border border-white/10 w-full max-w-2xl max-h-[80vh] flex flex-col">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
                            <div>
                                <h3 className="font-heading font-black text-white uppercase tracking-tight">Permissions Override</h3>
                                <p className="font-body text-gray-500 text-xs mt-0.5">{showPermModal.name} · <span className="capitalize">{showPermModal.role}</span> (base permissions inherited)</p>
                            </div>
                            <button onClick={() => setShowPermModal(null)} className="text-gray-500 hover:text-white transition-colors">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
                            </button>
                        </div>
                        <div className="overflow-y-auto p-6 flex-1">
                            <p className="font-body text-gray-500 text-xs mb-5">Select additional permissions to grant on top of the base role. The user's role permissions always apply.</p>
                            {modules.map(mod => {
                                const modPerms = Object.values(ROLE_PERMISSIONS).flat().filter((p,i,a) => p.startsWith(mod+".") && a.indexOf(p) === i);
                                return (
                                    <div key={mod} className="mb-5">
                                        <p className="font-heading font-bold text-gray-400 text-xs uppercase tracking-widest mb-2 capitalize">{mod}</p>
                                        <div className="grid grid-cols-2 gap-1.5">
                                            {modPerms.map(perm => (
                                                <label key={perm} className="flex items-center gap-2.5 py-2 px-3 bg-white/[0.02] border border-white/[0.04] hover:border-white/10 cursor-pointer transition-colors">
                                                    <input type="checkbox" checked={permsOverride.includes(perm)}
                                                           onChange={e => setPermsOverride(p => e.target.checked ? [...p, perm] : p.filter(x => x !== perm))}
                                                           className="accent-[#4353FF] w-3.5 h-3.5"
                                                    />
                                                    <span className="font-body text-gray-400 text-xs">{perm}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="p-6 border-t border-white/[0.06]">
                            <button onClick={savePermissions} disabled={saving}
                                    className="w-full bg-[#4353FF] text-white font-heading font-black py-3.5 uppercase tracking-wider text-sm hover:bg-white hover:text-[#0f0f0f] transition-all duration-300 disabled:opacity-50">
                                {saving ? "Saving..." : "Save Permission Overrides"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}