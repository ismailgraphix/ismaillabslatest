"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface BlogFiltersProps {
    categories: { id: string; name: string }[];
}

const chipBase = "whitespace-nowrap px-4 py-2 rounded font-mono text-xs uppercase tracking-[0.1em] transition-colors";
const chipActive = "bg-accent text-white";
const chipIdle = "bg-[var(--chip-bg)] text-[var(--muted)] hover:text-[var(--text)]";

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
                    className={`${chipBase} ${activeCategory === "all" ? chipActive : chipIdle}`}
                >
                    All
                </button>
                {categories.map(c => (
                    <button
                        key={c.id}
                        onClick={() => updateFilter("category", c.id)}
                        className={`${chipBase} ${activeCategory === c.id ? chipActive : chipIdle}`}
                    >
                        {c.name}
                    </button>
                ))}
            </div>

            {/* Sort Date */}
            <div className="flex items-center gap-3 w-full md:w-auto">
                <span className="font-mono text-xs tracking-[0.1em] text-[var(--muted)] uppercase">Sort by:</span>
                <select
                    value={sortOrder}
                    onChange={(e) => updateFilter("sort", e.target.value)}
                    className="bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] font-body text-sm px-3 py-2 focus:outline-none focus:border-accent transition-colors cursor-pointer rounded-md"
                >
                    <option value="newest" className="bg-[var(--surface)] text-[var(--text)]">Newest first</option>
                    <option value="oldest" className="bg-[var(--surface)] text-[var(--text)]">Oldest first</option>

                </select>
            </div>
        </div>
    );
}
