"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import LogoCard from "@/components/LogoCard";
import LogoCardSkeleton from "@/components/LogoCardSkeleton";
import { LogoCardProps } from "@/types/logo";

interface Props {
  logos:      (LogoCardProps & { createdAt?: string })[];
  categories: string[];
}

export default function LogoGrid({ logos, categories }: Props) {
  const [search,  setSearch]  = useState("");
  const [active,  setActive]  = useState("All");
  const [loaded,  setLoaded]  = useState(false);

  // Simulate initial load effect
  useState(() => {
    const t = setTimeout(() => setLoaded(true), 600);
    return () => clearTimeout(t);
  });

  const filtered = useMemo(() => {
    return logos.filter((l) => {
      const matchCat    = active === "All" || l.category === active;
      const q           = search.toLowerCase();
      const matchSearch =
        !q ||
        l.title.toLowerCase().includes(q) ||
        l.desc.toLowerCase().includes(q)  ||
        l.category.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [logos, search, active]);

  return (
    <section id="projects" className="px-6 md:px-16 py-20">

      {/* Section Header */}
      <div className="text-center mb-12">
        <p className="text-[#d4a373] text-xs uppercase tracking-[0.3em] mb-3">Portfolio</p>
        <h2 className="text-4xl md:text-5xl font-extrabold text-white uppercase tracking-wide">
          Our Work
        </h2>
        <div className="mt-4 w-16 h-[2px] bg-[#d4a373] mx-auto" />
      </div>

      {/* Search */}
      <div className="max-w-xl mx-auto mb-8 relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/>
            <path d="M20 20l-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </span>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search logos..."
          className="w-full bg-[#111] border border-white/10 rounded-full pl-11 pr-5 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#d4a373] transition"
        />
        {search && (
          <button onClick={() => setSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition">✕</button>
        )}
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-2 mb-12">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`px-5 py-2 rounded-full text-xs uppercase tracking-widest font-semibold border transition duration-300 ${
              active === cat
                ? "bg-[#d4a373] text-black border-[#d4a373]"
                : "bg-transparent text-gray-400 border-white/10 hover:border-[#d4a373] hover:text-white"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Results count */}
      {(search || active !== "All") && (
        <p className="text-center text-gray-500 text-sm mb-8">
          {filtered.length} logo{filtered.length !== 1 ? "s" : ""} found
        </p>
      )}

      {/* Grid — skeleton or real */}
      {!loaded ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => <LogoCardSkeleton key={i} />)}
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((logo) => (
            <LogoCard key={logo.id} {...logo} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-600">
          <p className="text-5xl mb-4">🔍</p>
          <p className="text-lg">No logos found</p>
          <p className="text-sm mt-2 opacity-60">Try a different search or category</p>
        </div>
      )}

      {/* View all categories link */}
      {filtered.length > 0 && !search && active === "All" && (
        <div className="text-center mt-12">
          <Link
            href="/category/all"
            className="inline-flex items-center gap-2 border border-white/10 text-gray-400 hover:border-[#d4a373] hover:text-[#d4a373] text-xs uppercase tracking-widest px-6 py-3 rounded-full transition"
          >
            Browse All Categories →
          </Link>
        </div>
      )}
    </section>
  );
}