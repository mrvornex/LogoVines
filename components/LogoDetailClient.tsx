"use client";

import { useState } from "react";
import Link from "next/link";
import { categoryToSlug } from "@/lib/categories";
import LogoCard from "@/components/LogoCard";

interface LogoData {
  id:         string;
  image:      string;
  title:      string;
  desc:       string;
  category:   string;
  folderName: string | null;
  createdAt?: string;
}

interface Props {
  logo:    LogoData;
  related: LogoData[];
}

function getFileType(url: string): string {
  const ext = url.split("?")[0].split(".").pop()?.toLowerCase();
  if (ext === "svg") return "SVG";
  if (ext === "pdf") return "PDF";
  if (ext === "eps") return "EPS";
  if (ext === "png") return "PNG";
  if (ext === "jpg" || ext === "jpeg") return "JPG";
  return "PNG";
}

export default function LogoDetailClient({ logo, related }: Props) {
  const [downloading, setDownloading] = useState(false);
  const [copied,      setCopied]      = useState(false);

  const fileType = getFileType(logo.image);
  const catSlug  = categoryToSlug(logo.category);

  const formattedDate = logo.createdAt
    ? new Date(logo.createdAt).toLocaleDateString("en-PK", { day: "numeric", month: "long", year: "numeric" })
    : null;

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const res  = await fetch(logo.image);
      const blob = await res.blob();
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href     = url;
      a.download = `${logo.title.replace(/\s+/g, "_")}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      alert("Download failed. Try right-click → Save image.");
    } finally {
      setDownloading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-6">
          <Link href="/" className="hover:text-[#1A4450] transition">Home</Link>
          <span>/</span>
          <Link href={`/category/${catSlug}`} className="hover:text-[#1A4450] transition">{logo.category}</Link>
          <span>/</span>
          <span className="text-[#1A4450]">{logo.title}</span>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-[#1A4450] mb-1">{logo.title} Logo PNG Vector</h1>
        <p className="text-gray-400 text-sm mb-6">{logo.desc}</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT — Logo image */}
          <div className="lg:col-span-2">
            <div className="border border-gray-200 rounded-xl flex items-center justify-center bg-white p-10 min-h-[320px]">
              <img
                src={logo.image}
                alt={logo.title}
                className="max-w-full max-h-[300px] object-contain"
              />
            </div>
            <p className="text-center text-gray-400 text-xs mt-3">{logo.title} Logo PNG Vector</p>

            {/* Info table */}
            <div className="mt-6 border border-gray-200 rounded-xl overflow-hidden">
              <div className="grid grid-cols-2 divide-x divide-gray-200">
                <div className="p-4">
                  <p className="text-gray-400 text-xs mb-1">Information</p>
                  <p className="text-[#1A4450] text-sm font-medium">{logo.title} Logo PNG Vector</p>
                  {logo.folderName && (
                    <p className="text-gray-400 text-xs mt-1">Collection: {logo.folderName}</p>
                  )}
                </div>
                <div className="p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Type:</span>
                    <span className="text-[#1A4450] font-semibold">{logo.category}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Format:</span>
                    <span className="text-[#1A4450] font-semibold">{fileType}</span>
                  </div>
                  {formattedDate && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Added:</span>
                      <span className="text-[#1A4450] font-semibold">{formattedDate}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Share buttons */}
            <div className="flex items-center gap-3 mt-5">
              <span className="text-gray-400 text-sm">Share:</span>
              <button
                onClick={handleCopy}
                className="border border-gray-200 text-gray-500 hover:border-[#1A4450] hover:text-[#1A4450] text-xs px-4 py-2 rounded-lg transition"
              >
                {copied ? "✓ Copied!" : "Copy Link"}
              </button>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(logo.title + " logo: " + (typeof window !== "undefined" ? window.location.href : ""))}`}
                target="_blank" rel="noreferrer"
                className="border border-gray-200 text-gray-500 hover:border-green-500 hover:text-green-600 text-xs px-4 py-2 rounded-lg transition"
              >
                WhatsApp
              </a>
            </div>
          </div>

          {/* RIGHT — Download box */}
          <div className="space-y-4">
            <div className="border border-gray-200 rounded-xl p-5">
              <h3 className="text-lg font-bold text-[#1A4450] mb-1">Free Download</h3>
              <p className="text-gray-400 text-xs mb-4">Download this logo in PNG format for free.</p>

              <button
                onClick={handleDownload}
                disabled={downloading}
                className="w-full bg-[#1A4450] text-white py-3 rounded-lg font-semibold text-sm hover:bg-[#1A4450]/80 transition disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {downloading ? (
                  <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="60" strokeDashoffset="20"/></svg>Downloading...</>
                ) : (
                  <>↓ Download Logo</>
                )}
              </button>
            </div>

            {/* Category */}
            <div className="border border-gray-200 rounded-xl p-5">
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-3">Category</p>
              <Link
                href={`/category/${catSlug}`}
                className="inline-block bg-[#1A4450]/10 text-[#1A4450] text-xs font-semibold px-4 py-2 rounded-full hover:bg-[#1A4450]/20 transition"
              >
                {logo.category}
              </Link>
            </div>

            {/* License */}
            <div className="border border-gray-200 rounded-xl p-5">
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">License</p>
              <p className="text-[#1A4450] text-sm font-medium">Free for personal & commercial use</p>
            </div>
          </div>
        </div>

        {/* Related logos */}
        {related.length > 0 && (
          <div className="mt-14">
            <h2 className="text-lg font-bold text-[#1A4450] mb-6">Related Logos</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {related.map((r) => (
                <LogoCard key={r.id} {...r} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}