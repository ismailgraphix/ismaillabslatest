"use client";

// app/admin/projects/page.tsx

import { useState, useEffect, useRef } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────
type ProjectType = "web" | "landing" | "mobile_app";

interface Project {
    id: string;
    title: string;
    description: string | null;
    image: string | null;
    techStack: string[];
    type: ProjectType;
    link: string | null;
    published: boolean;
    order: number;
    createdAt: string;
    updatedAt: string;
}

const TYPE_LABELS: Record<ProjectType, string> = {
    web: "Web App",
    landing: "Landing Page",
    mobile_app: "Mobile App",
};

const TYPE_COLORS: Record<ProjectType, string> = {
    web: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    landing: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    mobile_app: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
};

// ── Empty form state ──────────────────────────────────────────────────────────
const EMPTY: Omit<Project, "id" | "createdAt" | "updatedAt"> = {
    title: "",
    description: "",
    image: "",
    techStack: [],
    type: "web",
    link: "",
    published: false,
    order: 0,
};

// ── Confirm modal ─────────────────────────────────────────────────────────────
function ConfirmModal({ message, onConfirm, onCancel }: {
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">

            <div className="bg-[#111] border border-white/10 rounded-sm w-full max-w-sm mx-4 p-6 shadow-2xl">
                <p className="text-white text-sm font-body leading-relaxed">{message}</p>
                <div className="flex justify-end gap-2 mt-6">
                    <button onClick={onCancel}
                        className="px-4 py-2 text-xs font-body font-medium text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-sm transition-colors">
                        Cancel
                    </button>
                    <button onClick={onConfirm}
                        className="px-4 py-2 text-xs font-body font-medium text-white bg-red-500/80 hover:bg-red-500 rounded-sm transition-colors">
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── Project card ──────────────────────────────────────────────────────────────
function ProjectCard({ project, onEdit, onDelete, onTogglePublish }: {
    project: Project;
    onEdit: (p: Project) => void;
    onDelete: (id: string) => void;
    onTogglePublish: (p: Project) => void;
}) {
    return (
        <div className="group bg-[#111] border border-white/[0.06] rounded-sm overflow-hidden hover:border-white/[0.12] transition-all duration-200">
            {/* Image */}
            <div className="relative h-44 bg-[#0d0d0d] overflow-hidden">
                {project.image ? (
                    <img src={project.image} alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <svg width="32" height="32" viewBox="0 0 16 16" fill="none" className="text-gray-700">
                            <rect x="1" y="2" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
                            <circle cx="5.5" cy="6.5" r="1.5" stroke="currentColor" strokeWidth="1.3" />
                            <path d="M1 11l4-3 3 2.5 2-1.5 5 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                )}
                {/* Publish badge */}
                <div className={`absolute top-2 right-2 px-2 py-0.5 text-[9px] font-body font-bold uppercase tracking-wider rounded-sm ${project.published ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-gray-500/20 text-gray-500 border border-gray-500/20"
                    }`}>
                    {project.published ? "Live" : "Draft"}
                </div>
                {/* Type badge */}
                <div className={`absolute top-2 left-2 px-2 py-0.5 text-[9px] font-body font-bold uppercase tracking-wider rounded-sm border ${TYPE_COLORS[project.type]}`}>
                    {TYPE_LABELS[project.type]}
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                <h3 className="font-heading font-black text-white text-sm truncate mb-1">{project.title}</h3>
                {project.description && (
                    <p className="text-gray-500 text-xs font-body line-clamp-2 leading-relaxed mb-3">{project.description}</p>
                )}
                {/* Tech Stack */}
                {project.techStack.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                        {project.techStack.slice(0, 4).map(tag => (
                            <span key={tag} className="px-1.5 py-0.5 bg-white/5 text-gray-400 text-[10px] font-body rounded-sm border border-white/[0.04]">
                                {tag}
                            </span>
                        ))}
                        {project.techStack.length > 4 && (
                            <span className="px-1.5 py-0.5 bg-white/5 text-gray-600 text-[10px] font-body rounded-sm border border-white/[0.04]">
                                +{project.techStack.length - 4}
                            </span>
                        )}
                    </div>
                )}
                {/* Actions */}
                <div className="flex items-center gap-1.5 pt-3 border-t border-white/[0.06]">
                    <button onClick={() => onEdit(project)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-body font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded-sm transition-colors">
                        <svg width="11" height="11" viewBox="0 0 14 14" fill="none"><path d="M2 10.5L8.5 4l2 2L4 12.5H2v-2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /><path d="M7 5l2 2" stroke="currentColor" strokeWidth="1.5" /></svg>
                        Edit
                    </button>
                    <button onClick={() => onTogglePublish(project)}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-body font-medium rounded-sm transition-colors ${project.published
                            ? "text-yellow-500 hover:text-yellow-400 hover:bg-yellow-500/5"
                            : "text-emerald-500 hover:text-emerald-400 hover:bg-emerald-500/5"
                            }`}>
                        {project.published ? "Unpublish" : "Publish"}
                    </button>
                    {project.link && (
                        <a href={project.link} target="_blank" rel="noopener noreferrer"
                            className="p-1.5 text-gray-600 hover:text-white hover:bg-white/5 rounded-sm transition-colors">
                            <svg width="11" height="11" viewBox="0 0 14 14" fill="none"><path d="M6 2H2a1 1 0 00-1 1v9a1 1 0 001 1h9a1 1 0 001-1V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><path d="M9 1h4m0 0v4m0-4L7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </a>
                    )}
                    <button onClick={() => onDelete(project.id)}
                        className="p-1.5 text-gray-600 hover:text-red-400 hover:bg-red-500/5 rounded-sm transition-colors">
                        <svg width="11" height="11" viewBox="0 0 14 14" fill="none"><path d="M2 4h10M5 4V2h4v2M6 7v4M8 7v4M3 4l.7 8.3A1 1 0 004.7 13h4.6a1 1 0 001-.7L11 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── Drawer / form ─────────────────────────────────────────────────────────────
function ProjectDrawer({ project, onClose, onSave }: {
    project: Partial<Project> | null;
    onClose: () => void;
    onSave: (data: Omit<Project, "id" | "createdAt" | "updatedAt">, id?: string) => Promise<void>;
}) {
    const isNew = !project?.id;
    const [form, setForm] = useState<Omit<Project, "id" | "createdAt" | "updatedAt">>(() => ({
        title: project?.title ?? "",
        description: project?.description ?? "",
        image: project?.image ?? "",
        techStack: project?.techStack ?? [],
        type: project?.type ?? "web",
        link: project?.link ?? "",
        published: project?.published ?? false,
        order: project?.order ?? 0,
    }));
    const [techInput, setTechInput] = useState("");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const titleRef = useRef<HTMLInputElement>(null);

    useEffect(() => { titleRef.current?.focus(); }, []);

    function addTech() {
        const trimmed = techInput.trim();
        if (!trimmed || form.techStack.includes(trimmed)) { setTechInput(""); return; }
        setForm(f => ({ ...f, techStack: [...f.techStack, trimmed] }));
        setTechInput("");
    }

    function removeTech(tag: string) {
        setForm(f => ({ ...f, techStack: f.techStack.filter(t => t !== tag) }));
    }

    async function handleSubmit() {
        if (!form.title.trim()) { setError("Title is required."); return; }
        setSaving(true);
        setError("");
        try {
            await onSave(form, project?.id);
        } catch (e: any) {
            setError(e.message ?? "Something went wrong.");
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="fixed inset-0 z-40 flex items-stretch">
            {/* Overlay */}
            <div className="flex-1 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            {/* Panel */}
            <div className="w-full max-w-lg bg-[#0d0d0d] border-l border-white/[0.08] flex flex-col shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
                    <div>
                        <h2 className="font-heading font-black text-white text-sm">{isNew ? "New Project" : "Edit Project"}</h2>
                        <p className="text-gray-600 text-[11px] font-body mt-0.5">{isNew ? "Add a new agency project" : `Editing: ${project?.title}`}</p>
                    </div>
                    <button onClick={onClose} className="w-7 h-7 flex items-center justify-center text-gray-600 hover:text-white hover:bg-white/5 rounded-sm transition-colors">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
                    </button>
                </div>

                {/* Form */}
                <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-body px-3 py-2 rounded-sm">
                            {error}
                        </div>
                    )}

                    {/* Title */}
                    <div>
                        <label className="block text-[11px] font-body font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Title *</label>
                        <input
                            ref={titleRef}
                            type="text"
                            value={form.title}
                            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                            placeholder="e.g. E-commerce Dashboard"
                            className="w-full bg-white/[0.04] border border-white/[0.08] text-white text-sm font-body placeholder:text-gray-700 px-3 py-2.5 rounded-sm focus:outline-none focus:border-[#4353FF]/50 focus:bg-[#4353FF]/[0.03] transition-colors"
                        />
                    </div>

                    {/* Image URL */}
                    <div>
                        <label className="block text-[11px] font-body font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Image URL</label>
                        <input
                            type="text"
                            value={form.image ?? ""}
                            onChange={e => setForm(f => ({ ...f, image: e.target.value }))}
                            placeholder="https://..."
                            className="w-full bg-white/[0.04] border border-white/[0.08] text-white text-sm font-body placeholder:text-gray-700 px-3 py-2.5 rounded-sm focus:outline-none focus:border-[#4353FF]/50 transition-colors"
                        />
                        {form.image && (
                            <div className="mt-2 h-28 rounded-sm overflow-hidden border border-white/[0.06]">
                                <img src={form.image} alt="preview" className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                            </div>
                        )}
                    </div>

                    {/* Type */}
                    <div>
                        <label className="block text-[11px] font-body font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Type *</label>
                        <div className="grid grid-cols-3 gap-2">
                            {(["web", "landing", "mobile_app"] as ProjectType[]).map(t => (
                                <button key={t} type="button"
                                    onClick={() => setForm(f => ({ ...f, type: t }))}
                                    className={`py-2 text-xs font-body font-medium rounded-sm border transition-all ${form.type === t
                                        ? "bg-[#4353FF] border-[#4353FF] text-white"
                                        : "bg-white/[0.03] border-white/[0.08] text-gray-400 hover:text-white hover:border-white/20"
                                        }`}>
                                    {TYPE_LABELS[t]}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tech Stack */}
                    <div>
                        <label className="block text-[11px] font-body font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Tech Stack</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={techInput}
                                onChange={e => setTechInput(e.target.value)}
                                onKeyDown={e => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addTech(); } }}
                                placeholder="React, Node.js… press Enter"
                                className="flex-1 bg-white/[0.04] border border-white/[0.08] text-white text-sm font-body placeholder:text-gray-700 px-3 py-2.5 rounded-sm focus:outline-none focus:border-[#4353FF]/50 transition-colors"
                            />
                            <button type="button" onClick={addTech}
                                className="px-3 py-2 bg-[#4353FF]/20 text-[#4353FF] hover:bg-[#4353FF]/30 text-xs font-body font-medium rounded-sm transition-colors border border-[#4353FF]/20">
                                Add
                            </button>
                        </div>
                        {form.techStack.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-2">
                                {form.techStack.map(tag => (
                                    <span key={tag} className="flex items-center gap-1 px-2 py-1 bg-white/5 border border-white/[0.08] text-gray-300 text-[11px] font-body rounded-sm">
                                        {tag}
                                        <button type="button" onClick={() => removeTech(tag)} className="text-gray-600 hover:text-red-400 transition-colors">
                                            <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><path d="M1 1l6 6M7 1L1 7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-[11px] font-body font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Description</label>
                        <textarea
                            rows={4}
                            value={form.description ?? ""}
                            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                            placeholder="Brief description of the project…"
                            className="w-full bg-white/[0.04] border border-white/[0.08] text-white text-sm font-body placeholder:text-gray-700 px-3 py-2.5 rounded-sm focus:outline-none focus:border-[#4353FF]/50 transition-colors resize-none leading-relaxed"
                        />
                    </div>

                    {/* Link */}
                    <div>
                        <label className="block text-[11px] font-body font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Live URL</label>
                        <input
                            type="text"
                            value={form.link ?? ""}
                            onChange={e => setForm(f => ({ ...f, link: e.target.value }))}
                            placeholder="https://project.com"
                            className="w-full bg-white/[0.04] border border-white/[0.08] text-white text-sm font-body placeholder:text-gray-700 px-3 py-2.5 rounded-sm focus:outline-none focus:border-[#4353FF]/50 transition-colors"
                        />
                    </div>

                    {/* Order & Publish row */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[11px] font-body font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Display Order</label>
                            <input
                                type="number"
                                value={form.order}
                                onChange={e => setForm(f => ({ ...f, order: parseInt(e.target.value) || 0 }))}
                                className="w-full bg-white/[0.04] border border-white/[0.08] text-white text-sm font-body px-3 py-2.5 rounded-sm focus:outline-none focus:border-[#4353FF]/50 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-[11px] font-body font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Status</label>
                            <button type="button"
                                onClick={() => setForm(f => ({ ...f, published: !f.published }))}
                                className={`w-full py-2.5 text-xs font-body font-medium rounded-sm border transition-all ${form.published
                                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                                    : "bg-white/[0.03] border-white/[0.08] text-gray-500"
                                    }`}>
                                {form.published ? "● Published" : "○ Draft"}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-white/[0.06] flex items-center justify-end gap-2">
                    <button onClick={onClose} className="px-4 py-2 text-xs font-body font-medium text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-sm transition-colors">
                        Cancel
                    </button>
                    <button onClick={handleSubmit} disabled={saving}
                        className="flex items-center gap-2 px-5 py-2 text-xs font-body font-semibold text-white bg-[#4353FF] hover:bg-[#3344ee] rounded-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        {saving && (
                            <svg className="animate-spin" width="11" height="11" viewBox="0 0 14 14" fill="none">
                                <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="2" strokeDasharray="20" strokeDashoffset="5" />
                            </svg>
                        )}
                        {saving ? "Saving…" : isNew ? "Create Project" : "Save Changes"}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [filterType, setFilterType] = useState<ProjectType | "all">("all");
    const [filterStatus, setFilterStatus] = useState<"all" | "published" | "draft">("all");
    const [drawerProject, setDrawerProject] = useState<Partial<Project> | null | false>(false);
    const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
    const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

    // ── fetch ──
    async function fetchProjects() {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/projects");
            const data = await res.json();
            if (res.ok) setProjects(data.projects);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { fetchProjects(); }, []);

    // ── show toast ──
    function showToast(msg: string, ok = true) {
        setToast({ msg, ok });
        setTimeout(() => setToast(null), 3000);
    }

    // ── save (create / update) ──
    async function handleSave(formData: Omit<Project, "id" | "createdAt" | "updatedAt">, id?: string) {
        const isNew = !id;
        const res = await fetch(isNew ? "/api/admin/projects" : `/api/admin/projects/${id}`, {
            method: isNew ? "POST" : "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Failed to save");
        await fetchProjects();
        setDrawerProject(false);
        showToast(isNew ? "Project created!" : "Project updated!");
    }

    // ── delete ──
    async function handleDelete(id: string) {
        const res = await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
        if (res.ok) {
            setProjects(p => p.filter(x => x.id !== id));
            showToast("Project deleted.", true);
        } else {
            showToast("Delete failed.", false);
        }
        setDeleteTarget(null);
    }

    // ── toggle publish ──
    async function handleTogglePublish(project: Project) {
        const res = await fetch(`/api/admin/projects/${project.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ published: !project.published }),
        });
        if (res.ok) {
            setProjects(p => p.map(x => x.id === project.id ? { ...x, published: !x.published } : x));
            showToast(project.published ? "Project unpublished." : "Project published!");
        }
    }

    // ── filter ──
    const filtered = projects.filter(p => {
        const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.techStack.some(t => t.toLowerCase().includes(search.toLowerCase()));
        const matchType = filterType === "all" || p.type === filterType;
        const matchStatus = filterStatus === "all" || (filterStatus === "published" ? p.published : !p.published);
        return matchSearch && matchType && matchStatus;
    });

    const stats = {
        total: projects.length,
        published: projects.filter(p => p.published).length,
        web: projects.filter(p => p.type === "web").length,
        landing: projects.filter(p => p.type === "landing").length,
        mobile: projects.filter(p => p.type === "mobile_app").length,
    };

    return (

        <>

            {/* Toast */}
            {toast && (
                <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-2.5 rounded-sm shadow-xl text-xs font-body font-medium border transition-all ${toast.ok ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-red-500/10 border-red-500/20 text-red-400"
                    }`}>
                    {toast.ok
                        ? <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M2 7l4 4 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        : <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
                    }
                    {toast.msg}
                </div>
            )}

            <div className="p-8">
                {/* Header */}
                <div className="flex items-start justify-between mb-8">
                    <div>
                        <h1 className="font-heading font-black text-white text-2xl tracking-tight">Projects</h1>
                        <p className="text-gray-500 text-sm font-body mt-1">Agency work shown on the homepage</p>
                    </div>
                    <button onClick={() => setDrawerProject({})}
                        className="flex items-center gap-2 px-4 py-2.5 bg-[#4353FF] hover:bg-[#3344ee] text-white text-xs font-body font-semibold rounded-sm transition-colors">
                        <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
                        New Project
                    </button>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-5 gap-3 mb-6">
                    {[
                        { label: "Total", value: stats.total, color: "text-white" },
                        { label: "Published", value: stats.published, color: "text-emerald-400" },
                        { label: "Web Apps", value: stats.web, color: "text-blue-400" },
                        { label: "Landing", value: stats.landing, color: "text-purple-400" },
                        { label: "Mobile", value: stats.mobile, color: "text-amber-400" },
                    ].map(stat => (
                        <div key={stat.label} className="bg-[#111] border border-white/[0.06] rounded-sm px-4 py-3">
                            <p className={`font-heading font-black text-xl ${stat.color}`}>{stat.value}</p>
                            <p className="text-gray-600 text-[10px] font-body uppercase tracking-wider mt-0.5">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-3 mb-6">
                    <div className="relative flex-1 min-w-48">
                        <svg width="13" height="13" viewBox="0 0 14 14" fill="none" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600">
                            <circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.5" />
                            <path d="M9.5 9.5l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                            placeholder="Search projects…"
                            className="w-full bg-white/[0.04] border border-white/[0.08] text-white text-sm font-body placeholder:text-gray-700 pl-9 pr-3 py-2 rounded-sm focus:outline-none focus:border-[#4353FF]/50 transition-colors" />
                    </div>
                    {/* Type filter */}
                    <div className="flex gap-1">
                        {(["all", "web", "landing", "mobile_app"] as const).map(t => (
                            <button key={t} onClick={() => setFilterType(t)}
                                className={`px-3 py-2 text-xs font-body font-medium rounded-sm transition-colors ${filterType === t
                                    ? "bg-[#4353FF] text-white"
                                    : "bg-white/[0.03] border border-white/[0.08] text-gray-500 hover:text-white"
                                    }`}>
                                {t === "all" ? "All" : TYPE_LABELS[t as ProjectType]}
                            </button>
                        ))}
                    </div>
                    {/* Status filter */}
                    <div className="flex gap-1">
                        {(["all", "published", "draft"] as const).map(s => (
                            <button key={s} onClick={() => setFilterStatus(s)}
                                className={`px-3 py-2 text-xs font-body font-medium rounded-sm capitalize transition-colors ${filterStatus === s
                                    ? "bg-[#4353FF] text-white"
                                    : "bg-white/[0.03] border border-white/[0.08] text-gray-500 hover:text-white"
                                    }`}>
                                {s}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="bg-[#111] border border-white/[0.06] rounded-sm overflow-hidden animate-pulse">
                                <div className="h-44 bg-white/[0.03]" />
                                <div className="p-4 space-y-2">
                                    <div className="h-3 bg-white/[0.04] rounded-sm w-3/4" />
                                    <div className="h-2 bg-white/[0.03] rounded-sm w-full" />
                                    <div className="h-2 bg-white/[0.03] rounded-sm w-2/3" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="w-12 h-12 bg-white/[0.03] border border-white/[0.06] rounded-sm flex items-center justify-center mb-4">
                            <svg width="20" height="20" viewBox="0 0 16 16" fill="none" className="text-gray-700">
                                <path d="M8 1L15 5l-7 4L1 5l7-4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                                <path d="M1 9l7 4 7-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <p className="text-gray-500 text-sm font-body">
                            {search || filterType !== "all" || filterStatus !== "all"
                                ? "No projects match your filters."
                                : "No projects yet. Create your first one!"}
                        </p>
                        {!(search || filterType !== "all" || filterStatus !== "all") && (
                            <button onClick={() => setDrawerProject({})}
                                className="mt-4 px-4 py-2 bg-[#4353FF]/10 text-[#4353FF] text-xs font-body font-medium rounded-sm hover:bg-[#4353FF]/20 transition-colors border border-[#4353FF]/20">
                                Create Project
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filtered.map(p => (
                            <ProjectCard key={p.id} project={p}
                                onEdit={setDrawerProject}
                                onDelete={setDeleteTarget}
                                onTogglePublish={handleTogglePublish}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Drawer */}
            {drawerProject !== false && (
                <ProjectDrawer
                    project={drawerProject}
                    onClose={() => setDrawerProject(false)}
                    onSave={handleSave}
                />
            )}

            {/* Delete confirm */}
            {deleteTarget && (
                <ConfirmModal
                    message="Are you sure you want to delete this project? This action cannot be undone."
                    onConfirm={() => handleDelete(deleteTarget)}
                    onCancel={() => setDeleteTarget(null)}
                />
            )}
        </>
    );
}