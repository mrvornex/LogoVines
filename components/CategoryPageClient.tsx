"use client";

import { useState, useMemo, useEffect } from "react";
import LogoCard from "@/components/LogoCard";
import LogoCardSkeleton from "@/components/LogoCardSkeleton";
import { LogoCardProps } from "@/types/logo";

type SortOption = "newest" | "oldest" | "a-z" | "z-a";

interface Props {
  logos: (LogoCardProps & { createdAt?: string })[];
}

export default function CategoryPageClient({ logos }: Props) {
  const [search,  setSearch]  = useState("");
  const [sort,    setSort]    = useState<SortOption>("newest");
  const [loaded,  setLoaded]  = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 500);
    return () => clearTimeout(t);
  }, []);

  const filtered = useMemo(() => {
    let result = [...logos];
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((l) => l.title.toLowerCase().includes(q) || l.desc.toLowerCase().includes(q));
    }
    result.sort((a, b) => {
      if (sort === "newest") return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      if (sort === "oldest") return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
      if (sort === "a-z")    return a.title.localeCompare(b.title);
      if (sort === "z-a")    return b.title.localeCompare(a.title);
      return 0;
    });
    return result;
  }, [logos, search, sort]);

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-16 py-10">

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-10">
        <div className="relative flex-1 max-w-sm">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600">
            <svg width="15" height="15" fill="none" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/>
              <path d="M20 20l-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </span>
          <input
            type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search logos..."
            className="w-full bg-[#111] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#d4a373] transition"
          />
          {search && <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white transition text-xs">✕</button>}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-gray-600 text-xs uppercase tracking-widest">Sort:</span>
          {(["newest", "oldest", "a-z", "z-a"] as SortOption[]).map((s) => (
            <button key={s} onClick={() => setSort(s)}
              className={`px-4 py-2 rounded-lg text-xs uppercase tracking-widest border transition ${
                sort === s ? "bg-[#d4a373] text-black border-[#d4a373]" : "border-white/10 text-gray-500 hover:border-white/20 hover:text-white"
              }`}
            >{s}</button>
          ))}
        </div>
        <span className="text-gray-600 text-xs ml-auto hidden sm:block">{filtered.length} result{filtered.length !== 1 ? "s" : ""}</span>
      </div>

      {/* Grid */}
      {!loaded ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => <LogoCardSkeleton key={i} />)}
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((logo) => <LogoCard key={logo.id} {...logo} />)}
        </div>
      ) : (
        <div className="text-center py-24 text-gray-600">
          <p className="text-5xl mb-4">🔍</p>
          <p className="text-lg text-gray-500">No logos found</p>
          <p className="text-sm mt-2 opacity-60">Try a different search term</p>
        </div>
      )}
    </div>
  );
}