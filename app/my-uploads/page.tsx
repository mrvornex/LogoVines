"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function MyUploadsPage() {
  const router  = useRouter();
  const [logos,   setLogos]   = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/user/uploads")
      .then((r) => r.json())
      .then((d) => { if (d.success) setLogos(d.logos); else router.push("/user-login"); })
      .finally(() => setLoading(false));
  }, []);

  const statusColor = (s: string) =>
    s === "approved" ? "text-green-400 bg-green-900/20 border-green-500/30" :
    s === "rejected" ? "text-red-400 bg-red-900/20 border-red-500/30" :
    "text-yellow-400 bg-yellow-900/20 border-yellow-500/30";

  const statusLabel = (s: string) =>
    s === "approved" ? "✓ Approved" : s === "rejected" ? "✗ Rejected" : "⏳ Pending";

  return (
    <div className="bg-[#0a0a0a] min-h-screen">
      <Navbar />
      <div className="pt-24 max-w-7xl mx-auto px-6 md:px-16 pb-20">

        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="text-[#d4a373] text-xs uppercase tracking-widest mb-1">Your Portfolio</p>
            <h1 className="text-white text-3xl font-bold uppercase tracking-wide">My Uploads</h1>
          </div>
          <Link href="/upload" className="bg-[#d4a373] text-black px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-[#e8b989] transition rounded-xl">
            + Upload New
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => <div key={i} className="bg-[#111] rounded-2xl h-64 animate-pulse border border-white/5" />)}
          </div>
        ) : logos.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-5xl mb-4">🖼️</p>
            <p className="text-white text-xl font-bold mb-2">No uploads yet</p>
            <p className="text-gray-500 text-sm mb-6">Start sharing your logo designs</p>
            <Link href="/upload" className="bg-[#d4a373] text-black px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-[#e8b989] transition">Upload Logo</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {logos.map((logo) => (
              <div key={logo._id} className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden group">
                <div className="h-48 bg-[#0d0d0d] overflow-hidden">
                  <img src={logo.imageUrl} alt={logo.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-white font-semibold text-sm truncate">{logo.title}</h3>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border whitespace-nowrap flex-shrink-0 ${statusColor(logo.status)}`}>
                      {statusLabel(logo.status)}
                    </span>
                  </div>
                  <p className="text-gray-600 text-xs">{logo.category}</p>
                  <p className="text-gray-700 text-[10px] mt-1">
                    {new Date(logo.createdAt).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                  {logo.status === "approved" && (
                    <Link href={`/logo/${logo._id}`} className="block mt-3 text-center text-[#d4a373] text-xs border border-[#d4a373]/30 rounded-lg py-1.5 hover:bg-[#d4a373]/10 transition">
                      View →
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}