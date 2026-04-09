"use client";
import { useEffect, useState } from "react";
import {
    ROLE_DEFAULT_PERMISSIONS,
    getPermissionsByModule,
} from "@/lib/permissions";

interface AdminUser {
    id: string; name: string; email: string; role: string;
    status: string; createdAt: string; lastLoginAt: string | null;
    permissions: string[] | null;
}

const ROLES = ["admin", "editor", "viewer"] as const;

const ROLE_COLORS: Record<string, string> = {
    super_admin: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30",
    admin: "text-[#4353FF] bg-[#4353FF]/10 border-[#4353FF]/30",
    editor: "text-purple-400 bg-purple-400/10 border-purple-400/30",
    viewer: "text-gray-400 bg-gray-400/10 border-gray-400/20",
};

const ROLE_DESC: Record<string, string> = {
    admin: "High-level role label. No permissions granted by default until explicitly checked.",
    editor: "Mid-level role label. No permissions granted by default until explicitly checked.",
    viewer: "Base-level role label. No permissions granted by default until explicitly checked.",
};

export default function Page() {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);

    // Current session — fetched client-side to avoid invalid page props
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [isSuperAdmin, setIsSuperAdmin] = useState(false);

    // Add/Edit modal
    const [showForm, setShowForm] = useState(false);
    const [editUser, setEditUser] = useState<AdminUser | null>(null);
    const [form, setForm] = useState({ name: "", email: "", password: "", role: "editor" });
    const [formSaving, setFormSaving] = useState(false);
    const [formError, setFormError] = useState("");

    // Permissions modal
    const [permUser, setPermUser] = useState<AdminUser | null>(null);
    const [extraPerms, setExtraPerms] = useState<string[]>([]);
    const [permSaving, setPermSaving] = useState(false);

    const permsByModule = getPermissionsByModule();

    useEffect(() => {
        // Fetch current session user so we know role + id without props
        fetch("/api/admin/me")
            .then(r => r.json())
            .then(d => {
                if (d.user) {
                    setCurrentUserId(d.user.id);
                    setIsSuperAdmin(d.user.role === "super_admin");
                }
            })
            .catch(() => { });
        load();
    }, []);

    async function load() {
        setLoading(true);
        const r = await fetch("/api/admin/users");
        const d = await r.json();
        setUsers(d.users ?? []);
        setLoading(false);
    }

    // ── Add / Edit ──────────────────────────────────────────────────────────
    function openAdd() {
        setEditUser(null);
        setForm({ name: "", email: "", password: "", role: "editor" });
        setFormError("");
        setShowForm(true);
    }

    function openEdit(u: AdminUser) {
        setEditUser(u);
        setForm({ name: u.name, email: u.email, password: "", role: u.role });
        setFormError("");
        setShowForm(true);
    }

    async function saveUser() {
        setFormSaving(true); setFormError("");
        const url = editUser ? `/api/admin/users/${editUser.id}` : "/api/admin/users";
        const method = editUser ? "PATCH" : "POST";
        const payload = editUser
            ? { name: form.name, role: form.role }
            : { name: form.name, email: form.email, password: form.password, role: form.role };

        const r = await fetch(url, {
            method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
        });
        const d = await r.json();
        if (!r.ok) { setFormError(d.error); setFormSaving(false); return; }
        setShowForm(false); load(); setFormSaving(false);
    }

    async function deleteUser(id: string) {
        if (!confirm("Permanently delete this user?")) return;
        await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
        load();
    }

    async function toggleStatus(u: AdminUser) {
        const next = u.status === "active" ? "suspended" : "active";
        await fetch(`/api/admin/users/${u.id}`, {
            method: "PATCH", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: next }),
        });
        load();
    }

    // ── Permissions ─────────────────────────────────────────────────────────
    function openPerms(u: AdminUser) {
        setPermUser(u);
        setExtraPerms(u.permissions ?? []);
    }

    function togglePerm(name: string) {
        setExtraPerms(prev =>
            prev.includes(name) ? prev.filter(p => p !== name) : [...prev, name]
        );
    }

    async function savePerms() {
        if (!permUser) return;
        setPermSaving(true);
        await fetch(`/api/admin/users/${permUser.id}/permissions`, {
            method: "PUT", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ permissions: extraPerms }),
        });
        setPermSaving(false);
        setPermUser(null);
        load();
    }

    return (
        <>
            {/* Header */}
            <div className="sticky top-0 z-10 bg-[#0a0a0a]/95 backdrop-blur border-b border-white/[0.06] px-8 py-4 flex items-center justify-between">
                <div>
                    <h1 className="font-heading font-black text-white text-xl uppercase tracking-tight">Admin Users</h1>
                    <p className="font-body text-gray-500 text-xs mt-0.5">
                        {users.length} user{users.length !== 1 ? "s" : ""} · super admin has unrestricted access
                    </p>
                </div>
                {isSuperAdmin && (
                    <button onClick={openAdd}
                        className="flex items-center gap-2 bg-[#4353FF] text-white font-body font-semibold text-sm px-5 py-2.5 hover:bg-white hover:text-[#0f0f0f] transition-all duration-200">
                        + Add User
                    </button>
                )}
            </div>

            <div className="p-8 space-y-6">
                {/* Role legend */}
                <div className="grid sm:grid-cols-3 gap-3">
                    {ROLES.map(role => (
                        <div key={role} className="bg-[#111] border border-white/[0.06] p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <span className={`font-body font-bold text-[11px] uppercase tracking-wider px-2 py-0.5 border capitalize ${ROLE_COLORS[role]}`}>
                                    {role}
                                </span>
                            </div>
                            <p className="font-body text-gray-500 text-xs leading-relaxed">{ROLE_DESC[role]}</p>
                            <div className="mt-2 pt-2 border-t border-white/[0.04]">
                                <p className="font-body text-gray-600 text-[10px]">Requires explicit permission grants</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Users table */}
                <div className="bg-[#111] border border-white/[0.06] overflow-hidden">
                    {loading ? (
                        <div className="py-16 text-center font-body text-gray-600 text-sm">Loading…</div>
                    ) : users.length === 0 ? (
                        <div className="py-16 text-center">
                            <p className="font-body text-gray-600 text-sm mb-3">No users yet</p>
                            {isSuperAdmin && (
                                <button onClick={openAdd} className="font-body text-sm text-[#4353FF] hover:text-white transition-colors">
                                    + Add first user
                                </button>
                            )}
                        </div>
                    ) : (
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/[0.06]">
                                    {["User", "Role", "Extra Permissions", "Status", "Last Login", "Actions"].map(h => (
                                        <th key={h} className="text-left px-5 py-3 font-body font-semibold text-[11px] text-gray-500 uppercase tracking-widest whitespace-nowrap">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.04]">
                                {users.map(u => {
                                    const extraCount = u.permissions?.length ?? 0;
                                    const isSelf = u.id === currentUserId;
                                    const isSuper = u.role === "super_admin";

                                    return (
                                        <tr key={u.id} className="hover:bg-white/[0.02] transition-colors group">
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-[#4353FF]/20 border border-[#4353FF]/20 flex items-center justify-center flex-shrink-0">
                                                        <span className="font-heading font-black text-[#4353FF] text-xs">{u.name[0]?.toUpperCase()}</span>
                                                    </div>
                                                    <div>
                                                        <p className="font-heading font-bold text-white text-sm flex items-center gap-1.5">
                                                            {u.name}
                                                            {isSelf && <span className="font-body text-[9px] text-gray-600 bg-white/5 px-1.5 py-0.5 rounded">you</span>}
                                                        </p>
                                                        <p className="font-body text-gray-500 text-xs">{u.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className={`font-body font-semibold text-[11px] uppercase tracking-wider px-2.5 py-1 border capitalize ${ROLE_COLORS[u.role] ?? ROLE_COLORS.viewer}`}>
                                                    {u.role.replace("_", " ")}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4">
                                                {isSuper ? (
                                                    <span className="font-body text-[11px] text-yellow-400/70">All access</span>
                                                ) : extraCount > 0 ? (
                                                    <span className="font-body text-[11px] text-[#4353FF]">{extraCount} granted</span>
                                                ) : (
                                                    <span className="font-body text-[11px] text-gray-700">No permissions</span>
                                                )}
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className={`font-body text-xs font-semibold ${u.status === "active" ? "text-green-400" : "text-red-400"}`}>
                                                    ● {u.status}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 font-body text-gray-500 text-xs whitespace-nowrap">
                                                {u.lastLoginAt
                                                    ? new Date(u.lastLoginAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
                                                    : "Never"}
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {!isSuper && isSuperAdmin && (
                                                        <button onClick={() => openPerms(u)}
                                                            className="font-body text-xs text-[#4353FF] hover:text-white border border-[#4353FF]/30 hover:border-white/30 hover:bg-[#4353FF] px-2.5 py-1 transition-all">
                                                            Permissions
                                                        </button>
                                                    )}
                                                    {!isSuper && isSuperAdmin && (
                                                        <button onClick={() => openEdit(u)}
                                                            className="font-body text-xs text-gray-400 hover:text-white border border-white/10 hover:border-white/30 px-2.5 py-1 transition-all">
                                                            Edit
                                                        </button>
                                                    )}
                                                    {!isSuper && isSuperAdmin && !isSelf && (
                                                        <button onClick={() => toggleStatus(u)}
                                                            className={`font-body text-xs px-2.5 py-1 border transition-all ${u.status === "active"
                                                                ? "text-yellow-400 border-yellow-400/20 hover:bg-yellow-400 hover:text-black"
                                                                : "text-green-400 border-green-400/20 hover:bg-green-400 hover:text-black"
                                                                }`}>
                                                            {u.status === "active" ? "Suspend" : "Activate"}
                                                        </button>
                                                    )}
                                                    {!isSuper && isSuperAdmin && !isSelf && (
                                                        <button onClick={() => deleteUser(u.id)}
                                                            className="font-body text-xs text-red-500 hover:text-white hover:bg-red-500 border border-red-500/20 hover:border-red-500 px-2.5 py-1 transition-all">
                                                            Delete
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* ── Add / Edit User Modal ── */}
            {showForm && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-[#111] border border-white/10 w-full max-w-md">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
                            <h3 className="font-heading font-black text-white uppercase tracking-tight">
                                {editUser ? "Edit User" : "Add New User"}
                            </h3>
                            <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-white transition-colors">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                                </svg>
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            {formError && (
                                <p className="font-body text-red-400 text-sm bg-red-500/10 border border-red-500/20 px-4 py-3">{formError}</p>
                            )}
                            <div>
                                <label className="block font-body text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Full Name</label>
                                <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                                    placeholder="Jane Smith"
                                    className="w-full bg-white/5 border border-white/10 text-white font-body text-sm px-4 py-3 placeholder-gray-600 focus:outline-none focus:border-[#4353FF] transition-colors" />
                            </div>
                            {!editUser && (
                                <div>
                                    <label className="block font-body text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Email</label>
                                    <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                                        placeholder="jane@ismaillabs.com"
                                        className="w-full bg-white/5 border border-white/10 text-white font-body text-sm px-4 py-3 placeholder-gray-600 focus:outline-none focus:border-[#4353FF] transition-colors" />
                                </div>
                            )}
                            {!editUser && (
                                <div>
                                    <label className="block font-body text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2">
                                        Password <span className="text-gray-600 normal-case tracking-normal">(min 8 chars)</span>
                                    </label>
                                    <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                                        placeholder="••••••••"
                                        className="w-full bg-white/5 border border-white/10 text-white font-body text-sm px-4 py-3 placeholder-gray-600 focus:outline-none focus:border-[#4353FF] transition-colors" />
                                </div>
                            )}
                            <div>
                                <label className="block font-body text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Role</label>
                                <div className="space-y-2">
                                    {ROLES.map(role => (
                                        <label key={role} className={`flex items-start gap-3 p-3 border cursor-pointer transition-all ${form.role === role ? "border-[#4353FF] bg-[#4353FF]/5" : "border-white/[0.06] hover:border-white/15"}`}>
                                            <input type="radio" name="role" value={role}
                                                checked={form.role === role}
                                                onChange={() => setForm({ ...form, role })}
                                                className="accent-[#4353FF] mt-0.5 flex-shrink-0" />
                                            <div>
                                                <p className={`font-heading font-bold text-sm capitalize ${form.role === role ? "text-[#4353FF]" : "text-white"}`}>{role}</p>
                                                <p className="font-body text-gray-500 text-xs mt-0.5">{ROLE_DESC[role]}</p>
                                                <p className="font-body text-gray-700 text-[10px] mt-1">Manual permission assignment required</p>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="px-6 pb-6">
                            <button onClick={saveUser} disabled={formSaving}
                                className="w-full bg-[#4353FF] text-white font-heading font-black py-3.5 uppercase tracking-wider text-sm hover:bg-white hover:text-[#0f0f0f] transition-all duration-300 disabled:opacity-50">
                                {formSaving ? "Saving…" : editUser ? "Save Changes" : "Create User"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Permissions Modal ── */}
            {permUser && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-[#111] border border-white/10 w-full max-w-2xl max-h-[88vh] flex flex-col">
                        <div className="flex items-start justify-between px-6 py-4 border-b border-white/[0.06]">
                            <div>
                                <h3 className="font-heading font-black text-white uppercase tracking-tight">
                                    Permissions — {permUser.name}
                                </h3>
                                <p className="font-body text-gray-500 text-xs mt-1">
                                    Role: <span className="text-white capitalize">{permUser.role}</span>
                                    {" · "}Explicitly check the boxes below to grant access to the user.
                                </p>
                            </div>
                            <button onClick={() => setPermUser(null)} className="text-gray-500 hover:text-white transition-colors flex-shrink-0 ml-4">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                                </svg>
                            </button>
                        </div>
                        <div className="overflow-y-auto p-6 flex-1 space-y-6">
                            {Array.from(permsByModule.entries()).map(([mod, perms]) => {
                                const defaults = (ROLE_DEFAULT_PERMISSIONS[permUser.role] ?? []) as string[];
                                const allGranted = perms.every(p => defaults.includes(p.name) || extraPerms.includes(p.name));
                                return (
                                    <div key={mod}>
                                        <div className="flex items-center gap-3 mb-3">
                                            <p className="font-heading font-bold text-white text-xs uppercase tracking-widest capitalize">{mod}</p>
                                            {allGranted && (
                                                <span className="font-body text-[10px] text-green-400 bg-green-400/10 px-2 py-0.5 border border-green-400/20">Full access</span>
                                            )}
                                        </div>
                                        <div className="grid sm:grid-cols-2 gap-1.5">
                                            {perms.map(perm => {
                                                const isDefault = defaults.includes(perm.name);
                                                const isExtra = extraPerms.includes(perm.name);
                                                const isGranted = isDefault || isExtra;
                                                return (
                                                    <label key={perm.name}
                                                        className={`flex items-center gap-3 px-4 py-2.5 border transition-all cursor-pointer ${isDefault
                                                            ? "border-white/[0.04] bg-white/[0.02] cursor-not-allowed"
                                                            : isExtra
                                                                ? "border-[#4353FF]/40 bg-[#4353FF]/5"
                                                                : "border-white/[0.04] hover:border-white/10"
                                                            }`}>
                                                        <input type="checkbox" checked={isGranted} disabled={isDefault}
                                                            onChange={() => !isDefault && togglePerm(perm.name)}
                                                            className="accent-[#4353FF] w-3.5 h-3.5 flex-shrink-0" />
                                                        <div className="min-w-0">
                                                            <p className={`font-body text-xs font-medium truncate ${isGranted ? "text-white" : "text-gray-500"}`}>{perm.label}</p>
                                                            <p className="font-body text-[10px] text-gray-700 truncate">{perm.name}</p>
                                                        </div>
                                                        {isDefault && <span className="font-body text-[9px] text-gray-600 ml-auto flex-shrink-0">default</span>}
                                                        {isExtra && <span className="font-body text-[9px] text-[#4353FF] ml-auto flex-shrink-0">granted</span>}
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="p-6 border-t border-white/[0.06] flex items-center justify-between gap-4">
                            <div className="font-body text-gray-500 text-xs">
                                {extraPerms.length} explicit permission{extraPerms.length !== 1 ? "s" : ""} granted
                            </div>
                            <div className="flex gap-3">
                                <button onClick={() => setPermUser(null)}
                                    className="font-body font-semibold text-sm px-5 py-2.5 border border-white/10 text-gray-400 hover:text-white hover:border-white/30 transition-colors">
                                    Cancel
                                </button>
                                <button onClick={savePerms} disabled={permSaving}
                                    className="font-body font-semibold text-sm px-5 py-2.5 bg-[#4353FF] text-white hover:bg-white hover:text-[#0f0f0f] transition-all disabled:opacity-50">
                                    {permSaving ? "Saving…" : "Save Permissions"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}