const testimonials = [
  {
    name: "Daniel Joseph",
    role: "Content Writer",
    img: "https://html.ravextheme.com/redox/light/assets/imgs/web-development/testi-author-1.webp",
    quote: "Working with Redox has been an absolute game-changer for our business. Their attention to detail and creative approach completely transformed our digital presence.",
    rating: 5,
  },
  {
    name: "Victoria Madison",
    role: "Lead Developer",
    img: "https://html.ravextheme.com/redox/light/assets/imgs/web-development/testi-author-2.webp",
    quote: "The team at Redox delivered beyond our expectations. Their strategic thinking and technical expertise helped us achieve our goals in record time.",
    rating: 5,
  },
  {
    name: "Nicholas Thomas",
    role: "Marketing Director",
    img: "https://html.ravextheme.com/redox/light/assets/imgs/web-development/testi-author-3.webp",
    quote: "Exceptional work, exceptional team. Redox brings both creative vision and technical precision to every project. Highly recommended.",
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section className="py-28 bg-[#F7F5F0] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-5"
        style={{ background: "radial-gradient(circle, #4A6CF7 0%, transparent 70%)" }}
      />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-[#4A6CF7]/10 rounded-full px-4 py-2 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4A6CF7]" />
            <span className="font-heading font-semibold text-sm text-[#4A6CF7] uppercase tracking-widest">Testimonials</span>
          </div>
          <h2 className="font-heading font-black text-[clamp(2rem,4vw,3.5rem)] leading-tight text-[#0A0A0A]">
            Clients feedback
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-white rounded-2xl p-8 hover:shadow-xl transition-shadow duration-300 relative overflow-hidden group">
              {/* Quote mark */}
              <div className="absolute top-4 right-6 font-heading font-black text-8xl text-gray-100 group-hover:text-[#4A6CF7]/10 transition-colors leading-none">
                "
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-5">
                {Array(t.rating).fill(0).map((_, s) => (
                  <svg key={s} width="16" height="16" viewBox="0 0 16 16" fill="#4A6CF7">
                    <path d="M8 1l1.8 4H14l-3.5 2.6 1.4 4.4L8 9.4 4.1 12 5.5 7.6 2 5h4.2L8 1z"/>
                  </svg>
                ))}
              </div>

              <p className="font-body text-gray-600 leading-relaxed mb-6 relative z-10 text-sm">
                "{t.quote}"
              </p>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                  <img src={t.img} alt={t.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="font-heading font-bold text-[#0A0A0A]">{t.name}</p>
                  <p className="font-body text-sm text-gray-500">{t.role}</p>
                </div>
              </div>

              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#4A6CF7] group-hover:w-full transition-all duration-500" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
