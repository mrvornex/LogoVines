"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import LogoCard from "@/components/LogoCard";
import { LogoCardProps } from "@/types/logo";

interface Props {
  logos: (LogoCardProps & { createdAt?: string })[];
  categories: string[];
}

export default function LogoGrid({ logos, categories }: Props) {
  const [search, setSearch] = useState("");
  const [active, setActive] = useState("All");

  const filtered = useMemo(() => {
    return logos.filter((l) => {
      const matchCat = active === "All" || l.category === active;
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        l.title.toLowerCase().includes(q) ||
        l.desc.toLowerCase().includes(q) ||
        l.category.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [logos, search, active]);

  return (
    <section id="projects" className="bg-white px-6 md:px-16 py-16">

      {/* Header */}
      <h2 className="text-center text-3xl md:text-4xl font-bold text-[#1A4450] mb-10">
        Newest Logos
      </h2>

      {/* Search */}
      {/* <div className="max-w-xl mx-auto mb-6 relative">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search logos..."
          className="w-full border border-[#1A4450]/20 rounded-full px-5 py-3 text-[#1A4450] text-sm focus:outline-none focus:border-[#1A4450]/60 transition"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#1A4450]/40 hover:text-[#1A4450]"
          >✕</button>
        )}
      </div> */}

      {/* Category filters */}
      {/* <div className="flex flex-wrap justify-center gap-2 mb-10">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`px-4 py-1.5 rounded-full text-xs border transition ${
              active === cat
                ? "bg-[#1A4450] text-white border-[#1A4450]"
                : "text-[#1A4450]/60 border-[#1A4450]/20 hover:border-[#1A4450] hover:text-[#1A4450]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div> */}

      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {filtered.slice(0, 18).map((logo) => (
            <LogoCard key={logo.id} {...logo} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">🔍</p>
          <p className="text-[#1A4450]/50 text-lg">No logos found</p>
        </div>
      )}

      {/* View all button */}
      {filtered.length > 0 && !search && active === "All" && (
        <div className="text-center mt-12">
          <Link
            href="/category/all"
            className="inline-block bg-[#1A4450] text-white px-8 py-3 rounded-full text-sm font-semibold hover:bg-[#1A4450]/80 transition"
          >
            See all logos →
          </Link>
        </div>
      )}
    </section>
  );
}