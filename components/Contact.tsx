"use client";
import { useState } from "react";

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
        <section id="contact" className="py-28 bg-[#0A0A0A] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#4353FF] to-transparent opacity-40" />
            <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-10"
                 style={{ background: "radial-gradient(circle, #4353FF 0%, transparent 70%)" }}/>

            <div className="relative max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-start">
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-6 h-[3px] bg-[#4353FF]" />
                        <span className="font-body font-semibold text-[#4353FF] text-xs uppercase tracking-[0.2em]">Contact Us</span>
                    </div>
                    <h2 className="font-heading font-black text-white uppercase leading-tight text-[clamp(1.8rem,3.5vw,2.8rem)] tracking-tight mb-5">
                        LET'S START A DISCUSSION ABOUT YOUR NEXT PROJECT
                    </h2>
                    <p className="font-body text-gray-400 leading-relaxed mb-10">
                        Have a project in mind? We'd love to hear about it. Tell us your ideas and we'll craft a custom strategy to bring your vision to life.
                    </p>
                    <div className="space-y-5">
                        {[
                            { icon: "📍", label: "Address", value: "3891 Ranchview Dr. Richardson, Texas" },
                            { icon: "✉️", label: "Email", value: "hello@ismaillabs.com" },
                            { icon: "📞", label: "Phone", value: "(505) 555-0125" },
                        ].map(item => (
                            <div key={item.label} className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-[#4353FF] flex items-center justify-center flex-shrink-0 text-lg">{item.icon}</div>
                                <div>
                                    <p className="font-heading font-semibold text-gray-400 text-xs uppercase tracking-widest mb-0.5">{item.label}</p>
                                    <p className="font-body text-white text-sm">{item.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white/5 border border-white/10 p-8">
                    {state === "success" ? (
                        <div className="py-10 text-center">
                            <div className="w-16 h-16 bg-[#4353FF] flex items-center justify-center mx-auto mb-4">
                                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                                    <path d="M5 14l5 5 13-13" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                            <h3 className="font-heading font-black text-2xl text-white uppercase mb-2">Message Sent!</h3>
                            <p className="font-body text-gray-400 mb-6">We'll get back to you within 24 hours.</p>
                            <button onClick={() => setState("idle")} className="font-body text-sm text-[#4353FF] hover:text-white transition-colors">Send another message →</button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <h3 className="font-heading font-black text-2xl text-white uppercase mb-6">Send us a message</h3>
                            {state === "error" && (
                                <p className="font-body text-red-400 text-sm bg-red-500/10 border border-red-500/20 px-4 py-3">{errorMsg}</p>
                            )}
                            <div className="grid sm:grid-cols-2 gap-5">
                                {[
                                    { key:"name", label:"Name", type:"text", placeholder:"John Doe" },
                                    { key:"email", label:"Email", type:"email", placeholder:"john@example.com" },
                                ].map(f => (
                                    <div key={f.key}>
                                        <label className="block font-body font-semibold text-[11px] text-gray-400 uppercase tracking-widest mb-2">{f.label}</label>
                                        <input type={f.type} value={(form as any)[f.key]} onChange={e => setForm({...form,[f.key]:e.target.value})}
                                               placeholder={f.placeholder} required
                                               className="w-full bg-white/5 border border-white/10 text-white font-body text-sm px-4 py-3 placeholder-gray-600 focus:outline-none focus:border-[#4353FF] transition-colors"/>
                                    </div>
                                ))}
                            </div>
                            <div>
                                <label className="block font-body font-semibold text-[11px] text-gray-400 uppercase tracking-widest mb-2">Subject</label>
                                <input type="text" value={form.subject} onChange={e=>setForm({...form,subject:e.target.value})}
                                       placeholder="Project inquiry"
                                       className="w-full bg-white/5 border border-white/10 text-white font-body text-sm px-4 py-3 placeholder-gray-600 focus:outline-none focus:border-[#4353FF] transition-colors"/>
                            </div>
                            <div>
                                <label className="block font-body font-semibold text-[11px] text-gray-400 uppercase tracking-widest mb-2">Message</label>
                                <textarea value={form.message} onChange={e=>setForm({...form,message:e.target.value})}
                                          placeholder="Tell us about your project..." rows={5} required
                                          className="w-full bg-white/5 border border-white/10 text-white font-body text-sm px-4 py-3 placeholder-gray-600 focus:outline-none focus:border-[#4353FF] transition-colors resize-none"/>
                            </div>
                            <button type="submit" disabled={state === "loading"}
                                    className="w-full bg-[#4353FF] text-white font-heading font-black py-4 uppercase tracking-wider hover:bg-white hover:text-[#0f0f0f] transition-all duration-300 disabled:opacity-50 relative overflow-hidden group">
                                <span className="absolute inset-0 bg-white translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-400"/>
                                <span className="relative flex items-center justify-center gap-2 group-hover:text-[#0f0f0f]">
                  {state === "loading" ? (
                      <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Sending...</>
                  ) : "Send Message →"}
                </span>
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </section>
    );
}