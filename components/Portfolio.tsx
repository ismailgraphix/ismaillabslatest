"use client";
import { useState, useEffect } from "react";

export default function Portfolio() {
  const [activeTab, setActiveTab] = useState("All");
  const [projects, setProjects] = useState<any[]>([]);
  const [tabs, setTabs] = useState<string[]>(["All"]);

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => {
        if (data.items) {
          setProjects(data.items);
          const categories: string[] = Array.from(new Set(data.items.map((p: any) => p.type).filter(Boolean)));
          setTabs(["All", ...categories]);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const filtered = activeTab === "All" ? projects : projects.filter((p: any) => p.type === activeTab);

  return (
    <section id="portfolio" className="py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-[#4A6CF7]/10 rounded-full px-4 py-2 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4A6CF7]" />
            <span className="font-heading font-semibold text-sm text-[#4A6CF7] uppercase tracking-widest">Recent Works Gallery</span>
          </div>
          <h2 className="font-heading font-black text-[clamp(2rem,4vw,3.5rem)] leading-tight text-[#0A0A0A]">
            Our recent project gallery
          </h2>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`font-heading font-semibold text-sm px-6 py-2.5 rounded-full border transition-all duration-200 ${
                activeTab === tab
                  ? "bg-[#4A6CF7] text-white border-[#4A6CF7]"
                  : "bg-white text-[#0A0A0A] border-gray-200 hover:border-[#4A6CF7] hover:text-[#4A6CF7]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p, i) => (
            <div key={p.id || i} className="group relative rounded-2xl overflow-hidden bg-gray-100 aspect-[4/3] cursor-pointer">
              <img
                src={p.image || p.img}
                alt={p.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <span className="inline-block bg-[#4A6CF7] text-white font-heading font-bold text-xs px-3 py-1 rounded-full mb-2">
                  {p.techStack?.[0] || p.type}
                </span>
                <h3 className="font-heading font-black text-white text-xl">{p.title}</h3>
              </div>

              {/* Arrow */}
              <div className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-300">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M3 11L11 3M11 3H5M11 3v6" stroke="#0A0A0A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
