const footerLinks = {
  Company: ["About Us", "Our Team", "Careers", "News & Blog", "Contact"],
  Services: ["Web Development", "Mobile Apps", "UI/UX Design", "Branding", "Digital Marketing"],
  Resources: ["Documentation", "Case Studies", "Portfolio", "Pricing", "FAQ"],
};

export default function Footer() {
  const socialLinks = [
    {
      label: "Facebook",
      href: "#",
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.5-3.89 3.79-3.89 1.1 0 2.25.2 2.25.2v2.46h-1.27c-1.25 0-1.64.78-1.64 1.57V12h2.79l-.45 2.89h-2.34v6.99A10 10 0 0 0 22 12Z" />
        </svg>
      ),
    },
    {
      label: "Instagram",
      href: "#",
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="3.5" y="3.5" width="17" height="17" rx="5" stroke="currentColor" strokeWidth="1.8" />
          <circle cx="12" cy="12" r="3.8" stroke="currentColor" strokeWidth="1.8" />
          <circle cx="17.4" cy="6.8" r="1.2" fill="currentColor" />
        </svg>
      ),
    },
    {
      label: "X (Twitter)",
      href: "#",
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M18.9 2H22l-6.8 7.78L23 22h-6.1l-4.78-6.26L6.7 22H3.6l7.3-8.35L1.5 2h6.25l4.32 5.7L18.9 2Zm-1.07 18h1.7L6.83 3.9h-1.82L17.83 20Z" />
        </svg>
      ),
    },
    {
      label: "LinkedIn",
      href: "#",
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M6.94 8.5H3.56V20h3.38V8.5ZM5.25 3A1.97 1.97 0 1 0 5.3 6.94 1.97 1.97 0 0 0 5.25 3ZM20.45 13.37c0-3.4-1.8-4.98-4.2-4.98a3.63 3.63 0 0 0-3.27 1.8V8.5H9.62V20h3.36v-6.1c0-1.6.31-3.16 2.3-3.16 1.96 0 1.98 1.83 1.98 3.26V20h3.36v-6.63Z" />
        </svg>
      ),
    },
  ];

  return (
    <footer className="bg-[var(--surface)] border-t border-[var(--border)]">
      {/* CTA Banner */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="bg-[#4A6CF7] rounded-3xl p-12 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `repeating-linear-gradient(45deg, white, white 1px, transparent 1px, transparent 20px)`,
            }}
          />
          <h2 className="relative font-heading font-black text-white text-[clamp(1.5rem,3vw,2.5rem)] leading-tight">
            Let's Start Your Next<br />Dream Project
          </h2>
          <a
            href="#contact"
            className="relative flex-shrink-0 inline-flex items-center gap-2 bg-white text-[#4A6CF7] font-heading font-black px-8 py-4 rounded-full hover:bg-[var(--text)] hover:text-[var(--surface)] transition-all duration-300"
          >
            Get in Touch
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-6 pb-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 pb-12 border-b border-[var(--border)]">
          {/* Brand */}
          <div>
            <a href="#home" className="inline-block mb-5">
              <span className="font-heading font-black text-2xl text-[var(--text)] tracking-tight">
                Ismail<span className="text-[#4A6CF7]">labs</span>
              </span>
            </a>
            <p className="font-body text-[var(--muted)] text-sm leading-relaxed mb-6">
              We bring business and the digital world together with passion for creative problem solving.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  aria-label={item.label}
                  className="w-9 h-9 rounded-full bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center text-[var(--muted)] hover:bg-[#4A6CF7] hover:border-[#4A6CF7] hover:text-white transition-all"
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([cat, links]) => (
            <div key={cat}>
              <h4 className="font-heading font-black text-[var(--text)] mb-5">{cat}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="font-body text-sm text-[var(--muted)] hover:text-[#4A6CF7] transition-colors hover-line">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8">
          <p className="font-body text-[var(--muted)] text-sm">
            © 2025 Ismaillabs. All Rights Reserved.
          </p>
          <div className="flex gap-6">
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((l) => (
              <a key={l} href="#" className="font-body text-xs text-[var(--muted)] hover:text-[#4A6CF7] transition-colors">
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
