const posts = [
  {
    date: "25 June, 2024",
    author: "Admin",
    title: "Redefining User Experience with Our Web Design Agency",
    img: "https://html.ravextheme.com/redox/light/assets/imgs/web-development/post-6.webp",
    tag: "Design",
  },
  {
    date: "25 June, 2024",
    author: "Admin",
    title: "Why Prioritizing User Experience in Every Web Design Project Matters",
    img: "https://html.ravextheme.com/redox/light/assets/imgs/web-development/post-7.webp",
    tag: "UX",
  },
  {
    date: "25 June, 2024",
    author: "Admin",
    title: "Demystifying the Wizardry of Our Web Design Agency",
    img: "https://html.ravextheme.com/redox/light/assets/imgs/web-development/post-8.webp",
    tag: "Agency",
  },
];

export default function Blog() {
  return (
    <section className="py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-[#4A6CF7]/10 rounded-full px-4 py-2 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4A6CF7]" />
            <span className="font-heading font-semibold text-sm text-[#4A6CF7] uppercase tracking-widest">News & Latest Updates</span>
          </div>
          <h2 className="font-heading font-black text-[clamp(2rem,4vw,3.5rem)] leading-tight text-[#0A0A0A]">
            Check Our Company Inside Story
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {posts.map((post, i) => (
            <article key={i} className="group rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300 cursor-pointer">
              <div className="relative aspect-video overflow-hidden bg-gray-100">
                <img
                  src={post.img}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-[#4A6CF7] text-white font-heading font-bold text-xs px-3 py-1.5 rounded-full">
                    {post.tag}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-3 text-gray-400 text-xs font-body mb-4">
                  <span>{post.date}</span>
                  <span className="w-1 h-1 rounded-full bg-gray-300" />
                  <span>By {post.author}</span>
                </div>

                <h3 className="font-heading font-black text-[#0A0A0A] text-lg leading-snug mb-4 group-hover:text-[#4A6CF7] transition-colors">
                  {post.title}
                </h3>

                <div className="flex items-center gap-2 font-heading font-bold text-sm text-[#4A6CF7]">
                  Read More
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="group-hover:translate-x-1 transition-transform">
                    <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
