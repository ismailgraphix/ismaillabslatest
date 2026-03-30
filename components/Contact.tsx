"use client";
import { useState } from "react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <section id="contact" className="py-28 bg-[#0A0A0A] relative overflow-hidden">
      {/* BG elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#4A6CF7] to-transparent opacity-40" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-10"
        style={{ background: "radial-gradient(circle, #4A6CF7 0%, transparent 70%)" }}
      />

      <div className="relative max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-start">
        {/* Left info */}
        <div>
          <div className="inline-flex items-center gap-2 bg-[#4A6CF7]/20 rounded-full px-4 py-2 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4A6CF7]" />
            <span className="font-heading font-semibold text-sm text-[#4A6CF7] uppercase tracking-widest">Contact Us</span>
          </div>

          <h2 className="font-heading font-black text-[clamp(2rem,4vw,3.5rem)] leading-tight text-white mb-6">
            Let's Start A Discussion About Your Next Projects
          </h2>

          <p className="font-body text-gray-400 leading-relaxed mb-10">
            Have a project in mind? We'd love to hear about it. Tell us your ideas and we'll
            craft a custom strategy to bring your vision to life.
          </p>

          <div className="space-y-6">
            {[
              {
                icon: (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M10 2C7.24 2 5 4.24 5 7c0 4.25 5 11 5 11s5-6.75 5-11c0-2.76-2.24-5-5-5zm0 6.5A1.5 1.5 0 1110 5a1.5 1.5 0 010 3.5z" fill="currentColor"/>
                  </svg>
                ),
                label: "Address",
                value: "3891 Ranchview Dr. Richardson, Texas",
              },
              {
                icon: (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm9 1l-2 2-2-2M5 9h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                ),
                label: "Email",
                value: "hello@redoxagency.com",
              },
              {
                icon: (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M2 5.5C2 4.12 3.12 3 4.5 3c.39 0 .77.1 1.1.3l2.4 1.6a1.5 1.5 0 010 2.6L7 8.5c.85 1.4 2.1 2.65 3.5 3.5l1-1c.72-.72 1.88-.72 2.6 0l1.6 2.4c.5.73.3 1.71-.43 2.24-.3.21-.67.36-1.07.36C8.07 16 2 9.93 2 5.5z" fill="currentColor"/>
                  </svg>
                ),
                label: "Phone",
                value: "(505) 555-0125",
              },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#4A6CF7] flex items-center justify-center text-white flex-shrink-0">
                  {item.icon}
                </div>
                <div>
                  <p className="font-heading font-semibold text-gray-400 text-xs uppercase tracking-widest mb-1">{item.label}</p>
                  <p className="font-body text-white">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right form */}
        <div className="bg-white/5 rounded-3xl border border-white/10 p-8">
          {sent ? (
            <div className="h-full flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 bg-[#4A6CF7] rounded-full flex items-center justify-center mb-4">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <path d="M5 14l5 5 13-13" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="font-heading font-black text-2xl text-white mb-2">Message Sent!</h3>
              <p className="font-body text-gray-400">We'll get back to you within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <h3 className="font-heading font-black text-2xl text-white mb-6">Send us a message</h3>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block font-heading font-semibold text-xs text-gray-400 uppercase tracking-wider mb-2">Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => setForm({...form, name: e.target.value})}
                    placeholder="John Doe"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-body text-sm placeholder-gray-600 focus:outline-none focus:border-[#4A6CF7] transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block font-heading font-semibold text-xs text-gray-400 uppercase tracking-wider mb-2">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm({...form, email: e.target.value})}
                    placeholder="john@example.com"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-body text-sm placeholder-gray-600 focus:outline-none focus:border-[#4A6CF7] transition-colors"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-heading font-semibold text-xs text-gray-400 uppercase tracking-wider mb-2">Subject</label>
                <input
                  type="text"
                  value={form.subject}
                  onChange={e => setForm({...form, subject: e.target.value})}
                  placeholder="Project inquiry"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-body text-sm placeholder-gray-600 focus:outline-none focus:border-[#4A6CF7] transition-colors"
                />
              </div>

              <div>
                <label className="block font-heading font-semibold text-xs text-gray-400 uppercase tracking-wider mb-2">Message</label>
                <textarea
                  value={form.message}
                  onChange={e => setForm({...form, message: e.target.value})}
                  placeholder="Tell us about your project..."
                  rows={5}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-body text-sm placeholder-gray-600 focus:outline-none focus:border-[#4A6CF7] transition-colors resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#4A6CF7] text-white font-heading font-bold py-4 rounded-full hover:bg-white hover:text-[#0A0A0A] transition-all duration-300"
              >
                Send Message →
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
