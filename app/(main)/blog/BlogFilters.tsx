"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface BlogFiltersProps {
    categories: { id: string; name: string }[];
}

export default function BlogFilters({ categories }: BlogFiltersProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const activeCategory = searchParams.get("category") || "all";
    const sortOrder = searchParams.get("sort") || "newest";

    const updateFilter = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value === "all" || value === "newest") {
            params.delete(key);
        } else {
            params.set(key, value);
        }
        router.push(`/blog?${params.toString()}`, { scroll: false });
    };

    return (
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 py-4 border-y border-[var(--border)]">
            {/* Categories */}
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 hide-scrollbar">
                <button
                    onClick={() => updateFilter("category", "all")}
                    className={`whitespace-nowrap px-4 py-2 font-body text-xs font-bold uppercase tracking-widest transition-all ${activeCategory === "all"
                        ? "bg-[#4353FF] text-white"
                        : "bg-[var(--chip-bg)] text-[var(--muted)] hover:brightness-110 hover:text-[var(--text)]"
                        }`}
                >
                    All
                </button>
                {categories.map(c => (
                    <button
                        key={c.id}
                        onClick={() => updateFilter("category", c.id)}
                        className={`whitespace-nowrap px-4 py-2 font-body text-xs font-bold uppercase tracking-widest transition-all ${activeCategory === c.id
                            ? "bg-[#4353FF] text-white"
                            : "bg-[var(--chip-bg)] text-[var(--muted)] hover:brightness-110 hover:text-[var(--text)]"
                            }`}
                    >
                        {c.name}
                    </button>
                ))}
            </div>

            {/* Sort Date */}
            <div className="flex items-center gap-3 w-full md:w-auto">
                <span className="font-body text-xs tracking-widest text-[var(--muted)] uppercase">Sort by:</span>
                <select
                    value={sortOrder}
                    onChange={(e) => updateFilter("sort", e.target.value)}
                    className="bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] font-body text-xs px-3 py-2 uppercase tracking-wide focus:outline-none focus:border-[#4353FF] transition-colors cursor-pointer rounded-sm"
                >
                    <option value="newest" className="bg-[var(--surface)] text-[var(--text)]">Newest First</option>
                    <option value="oldest" className="bg-[var(--surface)] text-[var(--text)]">Oldest First</option>

                </select>
            </div>
        </div>
    );
}
