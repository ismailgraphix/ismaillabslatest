"use client";
import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Plus, Trash2, Save, Image as ImageIcon } from "lucide-react";

export default function PersonalPortfolioAdmin() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    
    // State
    const [hero, setHero] = useState({ 
        title: "", shortTitle: "", description: "", image: "", resumeUrl: "", projectsCount: 0, yearsExp: 0, tags: [] as string[] 
    });
    const [heroTags, setHeroTags] = useState("");
    const [skills, setSkills] = useState<{name: string, level: number}[]>([]);
    const [otherSkills, setOtherSkills] = useState("");
    const [experiences, setExperiences] = useState<{role: string, company: string, period: string, desc: string, tags: string[]}[]>([]);
    const [education, setEducation] = useState<{degree: string, school: string, period: string, grade: string}[]>([]);

    useEffect(() => {
        fetch("/api/admin/personal-portfolio")
        .then(res => res.json())
        .then(data => {
            if (data && !data.error) {
                if (data.hero) {
                    setHero(data.hero);
                    setHeroTags(data.hero.tags?.join(", ") || "");
                }
                if (data.skills) setSkills(data.skills);
                if (data.otherSkills) setOtherSkills(data.otherSkills.join(", "));
                if (data.experiences) setExperiences(data.experiences);
                if (data.education) setEducation(data.education);
            }
            setLoading(false);
        })
        .catch(err => {
            console.error(err);
            setLoading(false);
        });
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            const body = {
                hero: { ...hero, tags: heroTags.split(",").map(t => t.trim()).filter(Boolean) },
                skills: skills.map(s => ({ ...s, level: Number(s.level) })),
                otherSkills: otherSkills.split(",").map(s => s.trim()).filter(Boolean),
                experiences,
                education
            };
            const r = await fetch("/api/admin/personal-portfolio", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });
            if (r.ok) toast.success("Portfolio settings saved!");
            else toast.error("Failed to save settings");
        } catch (e) {
            toast.error("Error saving");
        }
        setSaving(false);
    };

    async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploadingImage(true);
        const fd = new FormData(); fd.append("file", file);
        try {
            const r = await fetch("/api/admin/upload", { method: "POST", body: fd });
            const d = await r.json();
            if (d.url) {
                setHero(f => ({ ...f, image: d.url }));
            }
        } catch (error) {
            toast.error("Upload failed");
        }
        setUploadingImage(false);
    }

    if (loading) return <div className="p-8">Loading configuration...</div>;

    const inputClass = "w-full border-gray-200 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border";
    
    return (
        <div className="max-w-[1200px] mx-auto p-6 space-y-12">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Personal Portfolio Configurator</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage the details matching the /portfolio public view.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-md hover:bg-gray-800 disabled:opacity-50"
                >
                    <Save size={18} />
                    {saving ? "Saving..." : "Save Settings"}
                </button>
            </div>

            {/* HERO SETTINGS */}
            <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold mb-4 border-b pb-2">Hero & Profile Details</h2>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div><label className="block text-sm font-medium mb-1">Developer Short Title</label>
                            <input value={hero.shortTitle} onChange={e => setHero(x => ({...x, shortTitle: e.target.value}))} className={inputClass} placeholder="e.g. ISMAIL LABS DEV." />
                        </div>
                        <div><label className="block text-sm font-medium mb-1">Full Title</label>
                            <input value={hero.title} onChange={e => setHero(x => ({...x, title: e.target.value}))} className={inputClass} placeholder="e.g. ISMAIL LABS DEV." />
                        </div>
                        <div><label className="block text-sm font-medium mb-1">Description</label>
                            <textarea rows={3} value={hero.description} onChange={e => setHero(x => ({...x, description: e.target.value}))} className={inputClass} />
                        </div>
                        <div><label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
                            <input value={heroTags} onChange={e => setHeroTags(e.target.value)} className={inputClass} placeholder="React, Next.js, Figma" />
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div><label className="block text-sm font-medium mb-1">Resume / CV URL</label>
                            <input value={hero.resumeUrl} onChange={e => setHero(x => ({...x, resumeUrl: e.target.value}))} className={inputClass} placeholder="/cv.pdf" />
                        </div>
                        <div className="flex flex-col gap-4">
                            <label className="block text-sm font-medium">Hero Image Upload</label>
                            <div className="flex items-start gap-4">
                                {hero.image ? (
                                    <div className="w-24 h-24 bg-gray-200 rounded overflow-hidden">
                                        <img src={hero.image} alt="Hero" className="w-full h-full object-cover" />
                                    </div>
                                ) : (
                                    <div className="w-24 h-24 bg-gray-100 rounded flex items-center justify-center border border-dashed border-gray-300">
                                        <ImageIcon size={24} className="text-gray-400" />
                                    </div>
                                )}
                                <div className="flex-1">
                                    <input type="file" onChange={handleUpload} accept="image/*" className="text-sm" />
                                    {uploadingImage && <p className="text-xs text-blue-500 mt-2">Uploading...</p>}
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div><label className="block text-sm font-medium mb-1">Years Exp.</label>
                                <input type="number" value={hero.yearsExp} onChange={e => setHero(x => ({...x, yearsExp: Number(e.target.value)}))} className={inputClass} />
                            </div>
                            <div><label className="block text-sm font-medium mb-1">Projects Count</label>
                                <input type="number" value={hero.projectsCount} onChange={e => setHero(x => ({...x, projectsCount: Number(e.target.value)}))} className={inputClass} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SKILLS SETTINGS */}
            <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center justify-between border-b pb-2 mb-4">
                    <h2 className="text-lg font-bold">Primary Skills</h2>
                    <button onClick={() => setSkills(s => [...s, {name: "", level: 0}])} className="text-sm text-blue-600 flex items-center gap-1 hover:underline">
                        <Plus size={16} /> Add Skill
                    </button>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                    {skills.map((s, i) => (
                        <div key={i} className="flex items-center gap-3 border p-3 rounded">
                            <input value={s.name} onChange={e => setSkills(all => { const cl = [...all]; cl[i].name = e.target.value; return cl; })} placeholder="React / Next.js" className={inputClass} />
                            <input type="number" min={0} max={100} value={s.level} onChange={e => setSkills(all => { const cl = [...all]; cl[i].level = Number(e.target.value); return cl; })} placeholder="92" className="w-20 p-2 border border-gray-200 rounded" />
                            <strong className="text-gray-500">%</strong>
                            <button onClick={() => setSkills(all => all.filter((_, idx) => idx !== i))} className="text-red-500 hover:text-red-700 p-2">
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                </div>
                <div className="mt-6 pt-4 border-t">
                    <label className="block text-sm font-medium mb-1">Other Skills (Used for chips, comma separated)</label>
                    <input value={otherSkills} onChange={e => setOtherSkills(e.target.value)} className={inputClass} placeholder="PostgreSQL, Docker, AWS..." />
                </div>
            </section>

            {/* WORK EXPERIENCE */}
            <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center justify-between border-b pb-2 mb-4">
                    <h2 className="text-lg font-bold">Work Experience</h2>
                    <button onClick={() => setExperiences(e => [...e, {role: "", company: "", period: "", desc: "", tags: []}])} className="text-sm text-blue-600 flex items-center gap-1 hover:underline">
                        <Plus size={16} /> Add Experience
                    </button>
                </div>
                <div className="space-y-6">
                    {experiences.map((exp, i) => (
                        <div key={i} className="border border-gray-200 p-4 rounded-lg bg-gray-50 relative group">
                            <button onClick={() => setExperiences(all => all.filter((_, idx) => idx !== i))} className="absolute top-4 right-4 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Trash2 size={18} />
                            </button>
                            <div className="grid md:grid-cols-3 gap-4 mb-3 pr-8">
                                <div><label className="block text-xs text-gray-500 mb-1">Role</label>
                                    <input value={exp.role} onChange={e => setExperiences(all => { const c = [...all]; c[i].role = e.target.value; return c; })} className={inputClass} placeholder="Senior Dev" />
                                </div>
                                <div><label className="block text-xs text-gray-500 mb-1">Company</label>
                                    <input value={exp.company} onChange={e => setExperiences(all => { const c = [...all]; c[i].company = e.target.value; return c; })} className={inputClass} placeholder="TechFlow Inc." />
                                </div>
                                <div><label className="block text-xs text-gray-500 mb-1">Period</label>
                                    <input value={exp.period} onChange={e => setExperiences(all => { const c = [...all]; c[i].period = e.target.value; return c; })} className={inputClass} placeholder="2022 — Present" />
                                </div>
                            </div>
                            <div className="mb-3">
                                <label className="block text-xs text-gray-500 mb-1">Description</label>
                                <textarea rows={2} value={exp.desc} onChange={e => setExperiences(all => { const c = [...all]; c[i].desc = e.target.value; return c; })} className={inputClass} placeholder="What did you do..." />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Tags (Comma separated)</label>
                                <input value={exp.tags?.join(", ")} onChange={e => setExperiences(all => { const c = [...all]; c[i].tags = e.target.value.split(",").map(t => t.trim()).filter(Boolean); return c; })} className={inputClass} placeholder="Next.js, TypeScript" />
                            </div>
                        </div>
                    ))}
                    {experiences.length === 0 && <p className="text-gray-400 italic">No experiences added yet.</p>}
                </div>
            </section>

             {/* EDUCATION */}
             <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center justify-between border-b pb-2 mb-4">
                    <h2 className="text-lg font-bold">Education</h2>
                    <button onClick={() => setEducation(e => [...e, {degree: "", school: "", period: "", grade: ""}])} className="text-sm text-blue-600 flex items-center gap-1 hover:underline">
                        <Plus size={16} /> Add Education
                    </button>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                    {education.map((edu, i) => (
                        <div key={i} className="border border-gray-200 p-4 rounded-lg relative group">
                            <button onClick={() => setEducation(all => all.filter((_, idx) => idx !== i))} className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Trash2 size={16} />
                            </button>
                            <div className="space-y-3">
                                <div><label className="block text-xs text-gray-500 mb-1">Degree</label>
                                    <input value={edu.degree} onChange={e => setEducation(all => { const c = [...all]; c[i].degree = e.target.value; return c; })} className={inputClass} placeholder="B.Sc. Computer Science" />
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div><label className="block text-xs text-gray-500 mb-1">School</label>
                                        <input value={edu.school} onChange={e => setEducation(all => { const c = [...all]; c[i].school = e.target.value; return c; })} className={inputClass} placeholder="Univ. of X" />
                                    </div>
                                    <div><label className="block text-xs text-gray-500 mb-1">Period</label>
                                        <input value={edu.period} onChange={e => setEducation(all => { const c = [...all]; c[i].period = e.target.value; return c; })} className={inputClass} placeholder="2014 — 2018" />
                                    </div>
                                </div>
                                <div><label className="block text-xs text-gray-500 mb-1">Grade</label>
                                    <input value={edu.grade} onChange={e => setEducation(all => { const c = [...all]; c[i].grade = e.target.value; return c; })} className={inputClass} placeholder="First Class Honours" />
                                </div>
                            </div>
                        </div>
                    ))}
                    {education.length === 0 && <p className="text-gray-400 italic">No education added yet.</p>}
                </div>
            </section>
        </div>
    );
}