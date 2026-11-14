"use client";
import { useState } from "react";
import { Mail, Phone } from "lucide-react";
import { site } from "@/lib/site";
import SectionLabel from "@/components/SectionLabel";

// Contact details come from lib/site.ts. The phone row only exists once a real
// number has been supplied there.
const contactDetails = [
    { icon: Mail, label: "Email", value: site.email, href: `mailto:${site.email}` },
    ...(site.phone
        ? [{ icon: Phone, label: "Phone", value: site.phone, href: `tel:${site.phone.replace(/[^+\d]/g, "")}` }]
        : []),
];

const fieldClass =
    "w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-md text-[var(--text)] font-body text-[15px] px-4 py-3 placeholder:text-[var(--text-faint)] focus:outline-none focus:border-accent transition-colors";
const labelClass = "block font-mono text-[11px] text-[var(--muted)] uppercase tracking-[0.14em] mb-2";

export default function Contact() {
    const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
    const [state, setState] = useState<"idle"|"loading"|"success"|"error">("idle");
    const [errorMsg, setErrorMsg] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setState("loading");
        try {
            const r = await fetch("/api/admin/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const d = await r.json();
            if (!r.ok) { setErrorMsg(d.error || "Something went wrong"); setState("error"); return; }
            setState("success");
            setForm({ name:"", email:"", subject:"", message:"" });
        } catch {
            setErrorMsg("Failed to send. Please try again.");
            setState("error");
        }
    }

    return (
        <section id="contact" className="py-28 bg-[var(--app-bg)] relative overflow-hidden">
            {/* Thin bar divider */}
            <div className="absolute top-0 left-0 w-full h-px bg-[var(--border)]" />

            <div className="relative max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-start">
                <div>
                    <SectionLabel className="mb-4">Contact us</SectionLabel>
                    <h2 className="font-heading font-bold text-[var(--text)] leading-[1.1] text-[clamp(1.8rem,3.5vw,2.8rem)] tracking-tight mb-5">
                        Let&apos;s start a discussion about your next project
                    </h2>
                    <p className="font-body text-[var(--muted)] text-base md:text-[17px] leading-relaxed mb-10 max-w-[520px]">
                        Have a project in mind? We&apos;d love to hear about it. Tell us your ideas and we&apos;ll craft a custom strategy to bring your vision to life.
                    </p>
                    <div className="space-y-5">
                        {contactDetails.map((item) => (
                            <div key={item.label} className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-accent rounded-md flex items-center justify-center flex-shrink-0 text-white">
                                    <item.icon size={18} strokeWidth={2.2} />
                                </div>
                                <div>
                                    <p className="font-mono text-[var(--muted)] text-[11px] uppercase tracking-[0.14em] mb-0.5">{item.label}</p>
                                    <a href={item.href} className="font-body text-[var(--text)] text-[15px] hover:text-[var(--accent-text)] transition-colors">{item.value}</a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-8">
                    {state === "success" ? (
                        <div className="py-10 text-center">
                            <div className="w-16 h-16 bg-accent rounded-md flex items-center justify-center mx-auto mb-4">
                                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                                    <path d="M5 14l5 5 13-13" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                            <h3 className="font-heading font-bold text-2xl text-[var(--text)] mb-2">Message sent</h3>
                            <p className="font-body text-[var(--muted)] mb-6">Thanks. We have your message and will reply by email.</p>
                            <button onClick={() => setState("idle")} className="font-body text-sm text-[var(--accent-text)] hover:text-[var(--text)] transition-colors">Send another message →</button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <h3 className="font-heading font-bold text-2xl text-[var(--text)] mb-6">Send us a message</h3>
                            {state === "error" && (
                                <p className="font-body text-red-500 text-sm bg-red-500/10 border border-red-500/20 rounded-md px-4 py-3">{errorMsg}</p>
                            )}
                            <div className="grid sm:grid-cols-2 gap-5">
                                {[
                                    { key:"name", label:"Name", type:"text", placeholder:"John Doe" },
                                    { key:"email", label:"Email", type:"email", placeholder:"john@example.com" },
                                ].map(f => (
                                    <div key={f.key}>
                                        <label className={labelClass}>{f.label}</label>
                                        <input type={f.type} value={(form as any)[f.key]} onChange={e => setForm({...form,[f.key]:e.target.value})}
                                               placeholder={f.placeholder} required
                                               className={fieldClass}/>
                                    </div>
                                ))}
                            </div>
                            <div>
                                <label className={labelClass}>Subject</label>
                                <input type="text" value={form.subject} onChange={e=>setForm({...form,subject:e.target.value})}
                                       placeholder="Project inquiry"
                                       className={fieldClass}/>
                            </div>
                            <div>
                                <label className={labelClass}>Message</label>
                                <textarea value={form.message} onChange={e=>setForm({...form,message:e.target.value})}
                                          placeholder="Tell us about your project..." rows={5} required
                                          className={`${fieldClass} resize-none`}/>
                            </div>
                            <button type="submit" disabled={state === "loading"}
                                    className="w-full bg-accent text-white border border-accent font-body font-semibold text-[15px] rounded-md py-4 hover:bg-[var(--text)] hover:border-[var(--text)] hover:text-[var(--app-bg)] transition-colors duration-300 disabled:opacity-50 flex items-center justify-center gap-2">
                                {state === "loading" ? (
                                    <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Sending...</>
                                ) : "Send message →"}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </section>
    );
}
