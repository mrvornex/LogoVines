"use client";

import { useState, useMemo } from "react";
import LogoCard from "@/components/LogoCard";
import Link from "next/link";
import { CATEGORIES } from "@/lib/categories";
import { TEMPLATE_CATEGORIES } from "@/lib/templateCategories";

interface Logo {
  id:         string;
  image:      string;
  title:      string;
  desc:       string;
  category:   string;
  folderName?: string | null;
  createdAt?: string;
}

interface Props {
  logos:       Logo[];
  currentSlug: string;
  type?:       "brand" | "template";
}

export default function CategoryPageClient({ logos, currentSlug, type = "brand" }: Props) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return logos;
    const q = search.toLowerCase();
    return logos.filter(
      (l) => l.title.toLowerCase().includes(q) || l.category.toLowerCase().includes(q)
    );
  }, [logos, search]);

  const cats    = type === "template" ? TEMPLATE_CATEGORIES : CATEGORIES.filter((c) => c.slug !== "uncategorized");
  const baseUrl = type === "template" ? "/templates" : "/category";

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Search */}
        <div className="relative max-w-2xl mx-auto mb-8">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search logos..."
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-[#1A4450] focus:outline-none focus:border-[#1A4450] transition"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">✕</button>
          )}
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          <Link href={`${baseUrl}/all`}
            className={`px-4 py-1.5 rounded-full text-xs border transition ${
              currentSlug === "all" ? "bg-[#1A4450] text-white border-[#1A4450]" : "text-[#1A4450]/60 border-gray-200 hover:border-[#1A4450] hover:text-[#1A4450]"
            }`}
          >All</Link>
          {cats.map((cat) => (
            <Link key={cat.slug} href={`${baseUrl}/${cat.slug}`}
              className={`px-4 py-1.5 rounded-full text-xs border transition ${
                currentSlug === cat.slug ? "bg-[#1A4450] text-white border-[#1A4450]" : "text-[#1A4450]/60 border-gray-200 hover:border-[#1A4450] hover:text-[#1A4450]"
              }`}
            >{cat.label}</Link>
          ))}
        </div>

        {/* Results count */}
        <p className="text-gray-400 text-sm mb-6">{filtered.length} logos found</p>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filtered.map((logo) => (
              <LogoCard key={logo.id} {...logo} />
            ))}
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