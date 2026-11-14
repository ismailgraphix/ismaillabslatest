"use client";
// components/ContactForm.tsx
// The project brief form on /contact.
//
// It posts to the existing /api/admin/messages endpoint, which stores name,
// email, subject and message. Until the messages table has columns for the
// brief fields, "what you need" and the organisation go into the subject, and
// the organisation and timeline are written at the top of the message, so they
// all appear in the admin inbox without a database change.
import { useState } from "react";

const TIMELINES = ["As soon as possible", "Within 3 months", "3 to 6 months", "Not sure yet"];
const OTHER_NEED = "Something else";

const fieldClass =
    "w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-md text-[var(--text)] font-body text-[15px] px-4 py-3 placeholder:text-[var(--text-faint)] focus:outline-none focus:border-accent focus-visible:ring-2 focus-visible:ring-accent/30 transition-colors";
const labelClass = "block font-mono text-[11px] text-[var(--muted)] uppercase tracking-[0.14em] mb-2";

const emptyForm = { name: "", email: "", organisation: "", need: "", timeline: "", message: "" };

export default function ContactForm({ needs }: { needs: string[] }) {
    const [form, setForm] = useState(emptyForm);
    const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMsg, setErrorMsg] = useState("");

    const needOptions = [...needs, OTHER_NEED];
    const set = (key: keyof typeof emptyForm) =>
        (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
            setForm((f) => ({ ...f, [key]: e.target.value }));

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setState("loading");

        const organisation = form.organisation.trim();
        const subject = [form.need || "Project enquiry", organisation].filter(Boolean).join(" · ");
        const details = [
            organisation && `Organisation: ${organisation}`,
            form.need && `What they need: ${form.need}`,
            form.timeline && `Timeline: ${form.timeline}`,
        ].filter(Boolean).join("\n");
        const message = details ? `${details}\n\n${form.message.trim()}` : form.message.trim();

        try {
            const r = await fetch("/api/admin/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: form.name.trim(), email: form.email.trim(), subject, message }),
            });
            const d = await r.json();
            if (!r.ok) { setErrorMsg(d.error || "Something went wrong. Please try again."); setState("error"); return; }
            setState("success");
            setForm(emptyForm);
        } catch {
            setErrorMsg("The message could not be sent. Please try again, or email us directly.");
            setState("error");
        }
    }

    if (state === "success") {
        return (
            <div className="py-10 text-center" role="status">
                <div className="w-16 h-16 bg-accent rounded-md flex items-center justify-center mx-auto mb-4" aria-hidden="true">
                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                        <path d="M5 14l5 5 13-13" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
                <h2 className="font-heading font-bold text-2xl text-[var(--text)] mb-2">Message sent</h2>
                <p className="font-body text-[var(--muted)] mb-6">Thanks. We have your message and will reply by email.</p>
                <button onClick={() => setState("idle")} className="font-body text-sm text-[var(--accent-text)] hover:text-[var(--text)] transition-colors">
                    Send another message →
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <h2 className="font-heading font-bold text-2xl text-[var(--text)] mb-6">Send us a brief</h2>

            {state === "error" && (
                <p role="alert" className="font-body text-red-500 text-sm bg-red-500/10 border border-red-500/20 rounded-md px-4 py-3">{errorMsg}</p>
            )}

            <div className="grid sm:grid-cols-2 gap-5">
                <div>
                    <label htmlFor="contact-name" className={labelClass}>Name</label>
                    <input id="contact-name" type="text" autoComplete="name" required value={form.name} onChange={set("name")} className={fieldClass} />
                </div>
                <div>
                    <label htmlFor="contact-email" className={labelClass}>Email</label>
                    <input id="contact-email" type="email" autoComplete="email" required value={form.email} onChange={set("email")} className={fieldClass} />
                </div>
            </div>

            <div>
                <label htmlFor="contact-organisation" className={labelClass}>Organisation <span className="normal-case tracking-normal">(optional)</span></label>
                <input id="contact-organisation" type="text" autoComplete="organization" value={form.organisation} onChange={set("organisation")} className={fieldClass} />
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
                <div>
                    <label htmlFor="contact-need" className={labelClass}>What you need</label>
                    <select id="contact-need" required value={form.need} onChange={set("need")} className={`${fieldClass} cursor-pointer`}>
                        <option value="" disabled>Choose one</option>
                        {needOptions.map((need) => (
                            <option key={need} value={need}>{need}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="contact-timeline" className={labelClass}>Timeline</label>
                    <select id="contact-timeline" value={form.timeline} onChange={set("timeline")} className={`${fieldClass} cursor-pointer`}>
                        <option value="">Choose one</option>
                        {TIMELINES.map((t) => (
                            <option key={t} value={t}>{t}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div>
                <label htmlFor="contact-message" className={labelClass}>Message</label>
                <textarea
                    id="contact-message"
                    required
                    rows={6}
                    value={form.message}
                    onChange={set("message")}
                    placeholder="What should the system do, who will use it, and what exists today?"
                    className={`${fieldClass} resize-y`}
                />
            </div>

            <button
                type="submit"
                disabled={state === "loading"}
                className="w-full bg-accent text-white border border-accent font-body font-semibold text-[15px] rounded-md py-4 hover:bg-[var(--text)] hover:border-[var(--text)] hover:text-[var(--app-bg)] transition-colors duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
            >
                {state === "loading" ? (
                    <>
                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                        Sending…
                    </>
                ) : "Send brief →"}
            </button>
        </form>
    );
}
