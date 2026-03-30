export default function About() {
  return (
    <section id="about" className="py-28 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
        {/* Images */}
        <div className="relative">
          <div className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden bg-gray-100">
            <img
              src="https://html.ravextheme.com/redox/light/assets/imgs/web-development/about-img-6.webp"
              alt="About main"
              className="w-full h-full object-cover"
            />
            {/* Overlay accent */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/40 to-transparent" />
          </div>

          {/* Floating secondary image */}
          <div className="absolute -bottom-8 -right-8 w-52 h-64 rounded-2xl overflow-hidden border-4 border-white shadow-2xl">
            <img
              src="https://html.ravextheme.com/redox/light/assets/imgs/web-development/about-img-7.webp"
              alt="About secondary"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Stats badge */}
          <div className="absolute top-8 -right-8 bg-[#4A6CF7] text-white rounded-2xl p-5 shadow-xl">
            <p className="font-heading font-black text-4xl">10+</p>
            <p className="font-body text-sm mt-1 opacity-90">Years on<br/>the market</p>
          </div>
        </div>

        {/* Content */}
        <div className="lg:pl-8">
          <div className="inline-flex items-center gap-2 bg-[#4A6CF7]/10 rounded-full px-4 py-2 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4A6CF7]" />
            <span className="font-heading font-semibold text-sm text-[#4A6CF7] uppercase tracking-widest">About Our Company</span>
          </div>

          <h2 className="font-heading font-black text-[clamp(2rem,4vw,3.5rem)] leading-tight text-[#0A0A0A] mb-6">
            We want to bring business and the digital world together
          </h2>

          <p className="font-body text-gray-600 text-lg leading-relaxed mb-6">
            This is the main factor that sets us apart from our competition and allows us to deliver
            a specialist business consultancy service.
          </p>
          <p className="font-body text-gray-600 leading-relaxed mb-10">
            Through our years of experience, we've also learned that while each channel has its own
            set of advantages, they all work best when strategically paired with other channels.
          </p>

          {/* Features */}
          <div className="grid grid-cols-2 gap-4 mb-10">
            {[
              "Strategic Thinking", "Creative Solutions",
              "Agile Delivery", "Data-Driven Results",
            ].map((f) => (
              <div key={f} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#4A6CF7] flex items-center justify-center flex-shrink-0">
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4l2.5 2.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="font-body text-sm text-[#0A0A0A] font-medium">{f}</span>
              </div>
            ))}
          </div>

          {/* Stat row */}
          <div className="flex gap-10 pt-8 border-t border-gray-100 mb-10">
            <div>
              <p className="font-heading font-black text-5xl text-[#0A0A0A]">200<span className="text-[#4A6CF7]">+</span></p>
              <p className="font-body text-gray-500 text-sm mt-1">Projects delivered so far</p>
            </div>
            <div>
              <p className="font-heading font-black text-5xl text-[#0A0A0A]">50<span className="text-[#4A6CF7]">+</span></p>
              <p className="font-body text-gray-500 text-sm mt-1">Expert team members</p>
            </div>
          </div>

          <a
            href="#contact"
            className="inline-flex items-center gap-3 bg-[#0A0A0A] text-white font-heading font-bold px-8 py-4 rounded-full hover:bg-[#4A6CF7] transition-all duration-300"
          >
            Get Started Now
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
