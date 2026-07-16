"use client";

import { useState, useMemo } from "react";
import LogoCard from "@/components/LogoCard";
import Link from "next/link";
import { CATEGORIES } from "@/lib/categories";
import { TEMPLATE_CATEGORIES } from "@/lib/templateCategories";

interface Logo {
  id:          string;
  image:       string;
  title:       string;
  desc:        string;
  category:    string;
  folderName?: string | null;
  createdAt?:  string;
}

interface Props {
  logos:       Logo[];
  currentSlug: string;
  type?:       "brand" | "template";
}

type SortOption = "newest" | "popular";

export default function CategoryPageClient({ logos, currentSlug, type = "brand" }: Props) {
  const [search,      setSearch]      = useState("");
  const [sort,        setSort]        = useState<SortOption>("newest");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const cats    = type === "template" ? TEMPLATE_CATEGORIES : CATEGORIES.filter((c) => c.slug !== "uncategorized");
  const baseUrl = type === "template" ? "/templates" : "/category";

  const filtered = useMemo(() => {
    let result = [...logos];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((l) => l.title.toLowerCase().includes(q) || l.category.toLowerCase().includes(q));
    }

    if (sort === "newest") {
      result.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    }

    return result;
  }, [logos, search, sort]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-6 flex gap-6">

      {/* Sidebar */}
      {sidebarOpen && (
        <div className="w-52 flex-shrink-0">
          <div className="border border-gray-200 rounded-xl p-5 sticky top-24">

            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <svg width="15" height="15" fill="none" viewBox="0 0 24 24"><path d="M3 6h18M7 12h10M11 18h2" stroke="#1A4450" strokeWidth="1.8" strokeLinecap="round"/></svg>
                <span className="text-[#1A4450] font-semibold text-sm">Filters</span>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="text-gray-400 hover:text-[#1A4450]">
                <svg width="15" height="15" fill="none" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              </button>
            </div>

            {/* Sort By */}
            <div className="mb-5">
              <p className="text-[#1A4450] text-xs font-semibold uppercase tracking-widest mb-3">Sort By</p>
              {([["popular", "Most Popular"], ["newest", "Newest"]] as const).map(([val, label]) => (
                <label key={val} className="flex items-center gap-2 mb-2 cursor-pointer">
                  <input type="radio" name="sort" checked={sort === val} onChange={() => setSort(val)} className="accent-[#1A4450]" />
                  <span className="text-sm text-[#1A4450]">{label}</span>
                </label>
              ))}
            </div>

            <hr className="border-gray-100 mb-5" />

            {/* Category Type */}
            <div className="mb-5">
              <p className="text-[#1A4450] text-xs font-semibold uppercase tracking-widest mb-3">Category</p>
              <label className="flex items-center gap-2 mb-2 cursor-pointer" onClick={() => window.location.href = `/category/${currentSlug}`}>
                <input type="radio" readOnly checked={type === "brand"} className="accent-[#1A4450]" />
                <span className="text-sm text-[#1A4450]">Brand</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.href = `/templates/${currentSlug === "all" ? "all" : currentSlug}`}>
                <input type="radio" readOnly checked={type === "template"} className="accent-[#1A4450]" />
                <span className="text-sm text-[#1A4450]">Template</span>
              </label>
            </div>

            <hr className="border-gray-100 mb-4" />

            <button onClick={() => { setSort("newest"); setSearch(""); }}
              className="text-gray-400 hover:text-[#1A4450] text-xs transition w-full text-right">
              Clear Filter
            </button>
          </div>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 min-w-0">

        {/* Toolbar */}
        <div className="flex items-center gap-3 mb-5">
          {!sidebarOpen && (
            <button onClick={() => setSidebarOpen(true)}
              className="flex items-center gap-1.5 border border-gray-200 rounded-lg px-3 py-2 text-xs text-[#1A4450] hover:border-[#1A4450] transition">
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path d="M3 6h18M7 12h10M11 18h2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
              Filters
            </button>
          )}
          <div className="relative flex-1 max-w-sm">
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search logos..."
              className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm text-[#1A4450] focus:outline-none focus:border-[#1A4450] transition" />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">✕</button>
            )}
          </div>
          <p className="text-gray-400 text-sm ml-auto">{filtered.length} logos found</p>
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Link href={`${baseUrl}/all`}
            className={`px-3 py-1 rounded-full text-xs border transition ${currentSlug === "all" ? "bg-[#1A4450] text-white border-[#1A4450]" : "text-[#1A4450]/60 border-gray-200 hover:border-[#1A4450] hover:text-[#1A4450]"}`}
          >All</Link>
          {cats.map((cat) => (
            <Link key={cat.slug} href={`${baseUrl}/${cat.slug}`}
              className={`px-3 py-1 rounded-full text-xs border transition ${currentSlug === cat.slug ? "bg-[#1A4450] text-white border-[#1A4450]" : "text-[#1A4450]/60 border-gray-200 hover:border-[#1A4450] hover:text-[#1A4450]"}`}
            >{cat.label}</Link>
          ))}
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filtered.map((logo) => <LogoCard key={logo.id} {...logo} />)}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🔍</p>
            <p className="text-gray-400 text-lg">No logos found</p>
          </div>
        )}
      </div>
    </div>
  );
}