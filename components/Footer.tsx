const footerLinks = {
  Company: ["About Us", "Our Team", "Careers", "News & Blog", "Contact"],
  Services: ["Web Development", "Mobile Apps", "UI/UX Design", "Branding", "Digital Marketing"],
  Resources: ["Documentation", "Case Studies", "Portfolio", "Pricing", "FAQ"],
};

export default function Footer() {
  return (
    <footer className="bg-[#0A0A0A] border-t border-white/10">
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
            className="relative flex-shrink-0 inline-flex items-center gap-2 bg-white text-[#4A6CF7] font-heading font-black px-8 py-4 rounded-full hover:bg-[#0A0A0A] hover:text-white transition-all duration-300"
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
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 pb-12 border-b border-white/10">
          {/* Brand */}
          <div>
            <a href="#home" className="inline-block mb-5">
              <span className="font-heading font-black text-2xl text-white tracking-tight">
                RE<span className="text-[#4A6CF7]">DOX</span>
              </span>
            </a>
            <p className="font-body text-gray-400 text-sm leading-relaxed mb-6">
              We bring business and the digital world together with passion for creative problem solving.
            </p>
            <div className="flex gap-3">
              {["fb", "ig", "tw", "li"].map((s) => (
                <div key={s} className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-[#4A6CF7] hover:border-[#4A6CF7] hover:text-white transition-all cursor-pointer font-heading font-bold text-xs">
                  {s}
                </div>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([cat, links]) => (
            <div key={cat}>
              <h4 className="font-heading font-black text-white mb-5">{cat}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="font-body text-sm text-gray-400 hover:text-[#4A6CF7] transition-colors hover-line">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8">
          <p className="font-body text-gray-500 text-sm">
            © 2025 Redox. All Rights Reserved.
          </p>
          <div className="flex gap-6">
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((l) => (
              <a key={l} href="#" className="font-body text-xs text-gray-500 hover:text-[#4A6CF7] transition-colors">
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
