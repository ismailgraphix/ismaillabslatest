"use client";
// components/ContactForm.tsx
// The project brief form on /contact.
//
// It posts to the existing /api/admin/messages endpoint, which stores name,
// email, subject and message. Until the messages table has columns for the
// brief fields, "what you need" and the organisation go into the subject, and
// the organisation and timeline are written at the top of the message, so they
// all appear in the admin inbox without a database change.
//
// Each field is checked in the browser before sending and again on the server;
// errors show under the field they belong to. A hidden "website" field catches
// bots (see app/api/admin/messages/route.ts).
import { useRef, useState } from "react";
import BarLoader from "@/components/BarLoader";

const TIMELINES = ["As soon as possible", "Within 3 months", "3 to 6 months", "Not sure yet"];
const OTHER_NEED = "Something else";

const fieldClass =
    "w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-md text-[var(--text)] font-body text-[15px] px-4 py-3 placeholder:text-[var(--text-faint)] focus:outline-none focus:border-accent focus-visible:ring-2 focus-visible:ring-accent/30 aria-[invalid=true]:border-[var(--error-text)] transition-colors";
const labelClass = "block font-mono text-[11px] text-[var(--muted)] uppercase tracking-[0.14em] mb-2";

const emptyForm = { name: "", email: "", organisation: "", need: "", timeline: "", message: "", website: "" };
type Field = keyof typeof emptyForm;
type Errors = Partial<Record<Field, string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MESSAGE_MAX = 4500;

function validate(form: typeof emptyForm): Errors {
    const errors: Errors = {};
    if (!form.name.trim()) errors.name = "Please enter your name.";
    if (!form.email.trim()) errors.email = "Please enter your email address.";
    else if (!EMAIL_PATTERN.test(form.email.trim())) errors.email = "Please enter a valid email address, like name@example.com.";
    if (!form.need) errors.need = "Please choose what you need.";
    if (!form.message.trim()) errors.message = "Please tell us a little about the project.";
    return errors;
}

/** The order fields appear in, so focus goes to the first one with a problem. */
const FIELD_ORDER: Field[] = ["name", "email", "organisation", "need", "timeline", "message"];

export default function ContactForm({ needs }: { needs: string[] }) {
    const [form, setForm] = useState(emptyForm);
    const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMsg, setErrorMsg] = useState("");
    const [errors, setErrors] = useState<Errors>({});
    const formRef = useRef<HTMLFormElement>(null);

    const needOptions = [...needs, OTHER_NEED];
    const set = (key: Field) =>
        (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
            setForm((f) => ({ ...f, [key]: e.target.value }));
            // Clear a field's error as soon as it is edited.
            if (errors[key]) setErrors((errs) => ({ ...errs, [key]: undefined }));
        };

    function focusFirstError(errs: Errors) {
        const first = FIELD_ORDER.find((f) => errs[f]);
        if (first) formRef.current?.querySelector<HTMLElement>(`#contact-${first}`)?.focus();
    }

    /** Props that tie a field to its label, its error message and its invalid state. */
    const describe = (key: Field) => ({
        "aria-invalid": errors[key] ? true : undefined,
        "aria-describedby": errors[key] ? `contact-${key}-error` : undefined,
    });
    const fieldError = (field: Field) =>
        errors[field] ? (
            <p id={`contact-${field}-error`} className="mt-2 font-body text-sm text-[var(--error-text)]">
                {errors[field]}
            </p>
        ) : null;

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const found = validate(form);
        setErrors(found);
        if (Object.keys(found).length > 0) {
            setState("idle");
            focusFirstError(found);
            return;
        }
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
                body: JSON.stringify({ name: form.name.trim(), email: form.email.trim(), subject, message, website: form.website }),
            });
            const d = await r.json().catch(() => ({}));
            if (!r.ok) {
                // The server's field errors use its own names; subject is built from "what you need".
                const server = (d.fieldErrors ?? {}) as Record<string, string>;
                const mapped: Errors = {
                    name: server.name,
                    email: server.email,
                    need: server.subject,
                    message: server.message,
                };
                const hasField = Object.values(mapped).some(Boolean);
                setErrors(mapped);
                setErrorMsg(hasField ? "Please check the highlighted fields." : d.error || "Something went wrong. Please try again.");
                setState("error");
                if (hasField) focusFirstError(mapped);
                return;
            }
            setState("success");
            setErrors({});
            setForm(emptyForm);
        } catch {
            setErrorMsg("The message could not be sent. Please try again, or email us directly.");
            setState("error");
        }
    }

    if (state === "success") {
        return (
            <div className="py-10 text-center" role="status" aria-live="polite">
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
        <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-5">
            <h2 className="font-heading font-bold text-2xl text-[var(--text)] mb-6">Send us a brief</h2>

            {state === "error" && (
                <p role="alert" className="font-body text-[var(--error-text)] text-sm bg-[var(--error-bg)] border border-[var(--error-border)] rounded-md px-4 py-3">{errorMsg}</p>
            )}

            <div className="grid sm:grid-cols-2 gap-5">
                <div>
                    <label htmlFor="contact-name" className={labelClass}>Name</label>
                    <input id="contact-name" type="text" autoComplete="name" required maxLength={120} value={form.name} onChange={set("name")} className={fieldClass} {...describe("name")} />
                    {fieldError("name")}
                </div>
                <div>
                    <label htmlFor="contact-email" className={labelClass}>Email</label>
                    <input id="contact-email" type="email" autoComplete="email" required maxLength={254} value={form.email} onChange={set("email")} className={fieldClass} {...describe("email")} />
                    {fieldError("email")}
                </div>
            </div>

            <div>
                <label htmlFor="contact-organisation" className={labelClass}>Organisation <span className="normal-case tracking-normal">(optional)</span></label>
                <input id="contact-organisation" type="text" autoComplete="organization" maxLength={200} value={form.organisation} onChange={set("organisation")} className={fieldClass} />
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
                <div>
                    <label htmlFor="contact-need" className={labelClass}>What you need</label>
                    <select id="contact-need" required value={form.need} onChange={set("need")} className={`${fieldClass} cursor-pointer`} {...describe("need")}>
                        <option value="" disabled>Choose one</option>
                        {needOptions.map((need) => (
                            <option key={need} value={need}>{need}</option>
                        ))}
                    </select>
                    {fieldError("need")}
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
                    maxLength={MESSAGE_MAX}
                    placeholder="What should the system do, who will use it, and what exists today?"
                    className={`${fieldClass} resize-y`}
                    {...describe("message")}
                />
                {fieldError("message")}
            </div>

            {/* Honeypot. Hidden from people and from screen readers; only bots fill it in. */}
            <div aria-hidden="true" className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden">
                <label htmlFor="contact-website">Website</label>
                <input id="contact-website" type="text" name="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={set("website")} />
            </div>

            <button
                type="submit"
                disabled={state === "loading"}
                className="btn-wipe w-full bg-accent text-white border border-accent font-body font-semibold text-[15px] rounded-md py-4 hover:border-[var(--text)] hover:text-[var(--app-bg)] disabled:opacity-50 flex items-center justify-center gap-2"
            >
                {state === "loading" ? (
                    <>
                        <BarLoader delayed label="" size={14} />
                        Sending…
                    </>
                ) : "Send brief →"}
            </button>
        </form>
    );
}
