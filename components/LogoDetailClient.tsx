"use client";

import { useState } from "react";
import Link from "next/link";
import { categoryToSlug } from "@/lib/categories";

interface LogoData {
  id:         string;
  image:      string;
  title:      string;
  desc:       string;
  category:   string;
  folderName: string | null;
  createdAt?: string;
}

export default function LogoDetailClient({ logo }: { logo: LogoData }) {
  const [downloading, setDownloading] = useState(false);
  const [copied,      setCopied]      = useState(false);
  const [imgLoaded,   setImgLoaded]   = useState(false);

  const catSlug = categoryToSlug(logo.category);

  // ── Download ──────────────────────────────────────────────
  const handleDownload = async () => {
    setDownloading(true);
    try {
      const res    = await fetch(logo.image);
      const blob   = await res.blob();
      const url    = URL.createObjectURL(blob);
      const a      = document.createElement("a");
      const ext    = logo.image.split(".").pop() || "png";
      a.href       = url;
      a.download   = `${logo.title.replace(/\s+/g, "_")}.${ext}`;
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

  // ── Copy link ─────────────────────────────────────────────
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedDate = logo.createdAt
    ? new Date(logo.createdAt).toLocaleDateString("en-PK", { day: "numeric", month: "long", year: "numeric" })
    : null;

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-16 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

        {/* LEFT — Image */}
        <div className="sticky top-28">
          {/* Image container */}
          <div className="relative bg-[#111] border border-white/5 rounded-3xl overflow-hidden aspect-square flex items-center justify-center p-8 group">

            {/* Checkerboard bg — shows transparency */}
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `repeating-conic-gradient(#fff 0% 25%, transparent 0% 50%)`,
                backgroundSize: "20px 20px",
              }}
            />

            {/* Skeleton */}
            {!imgLoaded && (
              <div className="absolute inset-0 bg-[#111] animate-pulse rounded-3xl" />
            )}

            <img
              src={logo.image}
              alt={logo.title}
              onLoad={() => setImgLoaded(true)}
              className={`relative z-10 max-w-full max-h-full object-contain transition-all duration-700 ${
                imgLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95"
              }`}
            />

            {/* Zoom hint */}
            <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm text-gray-400 text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition">
              Full Resolution
            </div>
          </div>

          {/* Format badges */}
          <div className="flex items-center gap-2 mt-4 flex-wrap">
            {["PNG", "JPG", "SVG"].map((fmt) => (
              <span key={fmt} className="bg-[#111] border border-white/10 text-gray-500 text-[10px] uppercase tracking-widest px-3 py-1 rounded-full">
                {fmt}
              </span>
            ))}
            <span className="text-gray-700 text-[10px] ml-auto">High Resolution</span>
          </div>
        </div>

        {/* RIGHT — Details */}
        <div className="flex flex-col gap-6">

          {/* Category + folder */}
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              href={`/category/${catSlug}`}
              className="bg-[#d4a373]/10 text-[#d4a373] text-[11px] uppercase tracking-widest px-4 py-1.5 rounded-full border border-[#d4a373]/30 hover:bg-[#d4a373]/20 transition"
            >
              {logo.category}
            </Link>
            {logo.folderName && (
              <span className="bg-white/5 text-gray-500 text-[11px] uppercase tracking-widest px-4 py-1.5 rounded-full border border-white/10">
                📁 {logo.folderName}
              </span>
            )}
          </div>

          {/* Title */}
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white uppercase tracking-wide leading-tight">
              {logo.title}
            </h1>
            {formattedDate && (
              <p className="text-gray-600 text-xs mt-2 tracking-widest uppercase">
                Added {formattedDate}
              </p>
            )}
          </div>

          {/* Divider */}
          <div className="h-[1px] bg-white/5" />

          {/* Description */}
          <p className="text-gray-400 text-sm leading-relaxed">{logo.desc}</p>

          {/* Divider */}
          <div className="h-[1px] bg-white/5" />

          {/* Download button — primary */}
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="w-full py-4 bg-[#d4a373] text-black font-bold uppercase tracking-widest text-sm rounded-xl hover:bg-[#e8b989] transition duration-300 disabled:opacity-60 flex items-center justify-center gap-3"
          >
            {downloading ? (
              <>
                <svg className="animate-spin" width="18" height="18" fill="none" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="60" strokeDashoffset="20"/>
                </svg>
                Downloading...
              </>
            ) : (
              <>
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                  <path d="M12 3v13M5 16l7 7 7-7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3 21h18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                </svg>
                Download Logo
              </>
            )}
          </button>

          {/* Secondary actions */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleCopyLink}
              className="py-3 border border-white/10 text-gray-400 hover:border-white/20 hover:text-white text-xs uppercase tracking-widest rounded-xl transition flex items-center justify-center gap-2"
            >
              {copied ? (
                <><span className="text-green-400">✓</span> Copied!</>
              ) : (
                <>
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  Copy Link
                </>
              )}
            </button>

            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hi! I like this logo: ${logo.title}. Can you make something similar?`)}`}
              target="_blank" rel="noreferrer"
              className="py-3 border border-[#25D366]/30 text-[#25D366] hover:bg-[#25D366]/10 text-xs uppercase tracking-widest rounded-xl transition flex items-center justify-center gap-2"
            >
              <svg width="14" height="14" viewBox="0 0 32 32" fill="currentColor">
                <path d="M16 2C8.268 2 2 8.268 2 16c0 2.478.678 4.8 1.856 6.8L2 30l7.4-1.832A13.94 13.94 0 0 0 16 30c7.732 0 14-6.268 14-14S23.732 2 16 2zm6.344 19.336c-.348-.174-2.06-1.016-2.38-1.132-.32-.116-.552-.174-.784.174-.232.348-.9 1.132-1.104 1.364-.204.232-.406.26-.754.086-.348-.174-1.468-.54-2.796-1.724-1.034-.92-1.732-2.056-1.936-2.404-.204-.348-.022-.536.152-.708.158-.156.348-.406.522-.61.174-.204.232-.348.348-.58.116-.232.058-.436-.028-.61-.088-.174-.784-1.892-1.076-2.59-.284-.68-.572-.588-.784-.598l-.668-.012c-.232 0-.61.086-.928.436s-1.22 1.192-1.22 2.908 1.248 3.372 1.422 3.604c.174.232 2.456 3.748 5.952 5.256.832.36 1.48.574 1.988.736.836.266 1.596.228 2.198.138.67-.1 2.06-.842 2.352-1.656.29-.814.29-1.512.202-1.656-.086-.144-.318-.232-.666-.406z"/>
              </svg>
              Order Similar
            </a>
          </div>

          {/* Info box */}
          <div className="bg-[#111] border border-white/5 rounded-2xl p-5 space-y-3">
            <h3 className="text-gray-500 text-[10px] uppercase tracking-widest mb-3">Logo Info</h3>
            {[
              { label: "Category",   value: logo.category },
              { label: "Collection", value: logo.folderName || "—" },
              { label: "Added",      value: formattedDate || "—" },
              { label: "License",    value: "Personal & Commercial Use" },
            ].map((row) => (
              <div key={row.label} className="flex justify-between items-center text-sm border-b border-white/5 pb-3 last:border-0 last:pb-0">
                <span className="text-gray-600 text-xs uppercase tracking-widest">{row.label}</span>
                <span className="text-gray-300 text-xs">{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}