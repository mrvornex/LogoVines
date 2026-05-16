"use client";

import Link from "next/link";
import { LogoCardProps } from "@/types/logo";

export default function LogoCard({ id, image, title, desc, category, folderName }: LogoCardProps) {
  return (
    <Link
      href={`/logo/${id}`}
      className="group relative overflow-hidden rounded-2xl bg-[#111] border border-white/5 hover:border-[#d4a373]/40 shadow-lg hover:shadow-[0_0_30px_rgba(212,163,115,0.1)] transition-all duration-500 cursor-pointer block"
    >
      {/* Image */}
      <div className="h-[240px] overflow-hidden bg-[#0d0d0d]">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
        />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-500" />

      {/* Category badge */}
      <div className="absolute top-3 left-3 z-10">
        <span className="bg-black/60 backdrop-blur-sm text-[#d4a373] text-[10px] uppercase tracking-widest px-3 py-1 rounded-full border border-[#d4a373]/30">
          {category}
        </span>
      </div>

      {/* Folder badge */}
      {folderName && (
        <div className="absolute top-3 right-3 z-10">
          <span className="bg-black/60 backdrop-blur-sm text-gray-400 text-[10px] uppercase tracking-widest px-3 py-1 rounded-full border border-white/10">
            📁 {folderName}
          </span>
        </div>
      )}

      {/* Hover content */}
      <div className="absolute bottom-0 left-0 right-0 p-5 z-10 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition duration-500">
        <h2 className="text-white font-bold text-lg leading-tight">{title}</h2>
        <p className="text-gray-300 text-sm mt-1 line-clamp-2">{desc}</p>
        <span className="inline-flex items-center gap-1 text-[#d4a373] text-xs mt-2 uppercase tracking-widest">
          View Details →
        </span>
      </div>

      {/* Static bottom bar */}
      <div className="p-4 border-t border-white/5 group-hover:opacity-0 transition duration-300">
        <h3 className="text-white font-semibold text-sm truncate">{title}</h3>
        <p className="text-gray-500 text-xs mt-0.5 truncate">{desc}</p>
      </div>
    </Link>
  );
}