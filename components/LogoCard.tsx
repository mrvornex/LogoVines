"use client";

import Link from "next/link";
import { LogoCardProps } from "@/types/logo";

function getFileType(url: string): string {
  const ext = url.split("?")[0].split(".").pop()?.toLowerCase();
  if (ext === "svg") return "svg";
  if (ext === "pdf") return "pdf";
  if (ext === "eps") return "eps";
  if (ext === "png") return "png";
  if (ext === "jpg" || ext === "jpeg") return "jpg";
  return "img";
}

export default function LogoCard({ id, image, title, category }: LogoCardProps) {
  const fileType = getFileType(image);

  return (
    <Link
      href={`/logo/${id}`}
      className="group relative block bg-white border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 cursor-pointer"
    >
      {/* Format badge — bottom left */}
      <div className="absolute bottom-9 left-2 z-10">
        <span className="bg-gray-800 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded">
          {fileType}
        </span>
      </div>

      {/* Image */}
      <div className="h-[160px] flex items-center justify-center p-4 bg-white overflow-hidden">
        <img
          src={image}
          alt={title}
          className="max-h-full max-w-full object-contain"
        />
      </div>

      {/* Black overlay on hover — no text */}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition duration-300 mb-[36px]" />

      {/* Title below image */}
      <div className="px-2 py-2 border-t border-gray-100">
        <p className="text-gray-600 text-[11px] text-center truncate">{title}</p>
      </div>
    </Link>
  );
}