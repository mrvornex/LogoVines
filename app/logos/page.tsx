import { connectDB } from "@/lib/mongodb";
import Logo from "@/models/Logo";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { CATEGORIES } from "@/lib/categories";
import CategoryPageClient from "@/components/CategoryPageClient";

export default async function LogosPage() {
  await connectDB();

  const logosDocs = await Logo.find({ status: "approved" })
    .sort({ createdAt: -1 })
    .lean();

  const logos = logosDocs.map((l: any) => ({
    id:         l._id.toString(),
    image:      l.imageUrl,
    title:      l.title,
    desc:       l.desc,
    category:   l.category || "Uncategorized",
    folderName: l.folderName || null,
    createdAt:  l.createdAt?.toISOString(),
  }));

  // Stats
  const totalLogos      = logos.length;
  const totalCategories = new Set(logos.map((l) => l.category)).size;

  return (
    <div className="bg-[#0a0a0a] min-h-screen">
      <Navbar />

      {/* ── Hero bar ── */}
      <div className="pt-20 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-16 py-14 text-center">
          <p className="text-[#d4a373] text-xs uppercase tracking-[0.3em] mb-4">Portfolio</p>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white uppercase tracking-wide mb-4">
            Logo Gallery
          </h1>
          <div className="w-16 h-[2px] bg-[#d4a373] mx-auto mb-6" />
          <p className="text-gray-500 text-sm max-w-xl mx-auto leading-relaxed mb-8">
            Browse our complete collection of professionally designed logos — from minimalist wordmarks to bold brand identities.
          </p>

          {/* Stats */}
          <div className="flex items-center justify-center gap-10">
            {[
              { n: totalLogos,      l: "Total Logos"  },
              { n: totalCategories, l: "Categories"   },
            ].map((s) => (
              <div key={s.l} className="text-center">
                <p className="text-[#d4a373] text-3xl font-extrabold" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  {s.n}
                </p>
                <p className="text-gray-600 text-[10px] uppercase tracking-widest mt-1">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Category pills ── */}
      <div className="border-b border-white/5 bg-[#080808]">
        <div className="max-w-7xl mx-auto px-6 md:px-16 py-5 flex flex-wrap gap-2">
          <Link href="/logos"
            className="px-4 py-1.5 rounded-full text-[10px] uppercase tracking-widest border transition bg-[#d4a373] text-black border-[#d4a373] font-semibold"
          >All</Link>
          {CATEGORIES.map((cat) => (
            <Link key={cat.slug} href={`/category/${cat.slug}`}
              className="px-4 py-1.5 rounded-full text-[10px] uppercase tracking-widest border border-white/10 text-gray-500 hover:border-[#d4a373] hover:text-white transition"
            >{cat.label}</Link>
          ))}
        </div>
      </div>

      {/* ── Logo grid with search + sort ── */}
      <CategoryPageClient logos={logos} />

      {/* ── Upload CTA ── */}
      <div className="border-t border-white/5 py-16 px-6 text-center bg-[#080808]">
        <p className="text-[#d4a373] text-xs uppercase tracking-[0.3em] mb-3">Share Your Work</p>
        <h2 className="text-white text-2xl md:text-3xl font-extrabold uppercase tracking-wide mb-3">
          Have a logo to share?
        </h2>
        <p className="text-gray-500 text-sm mb-8 max-w-md mx-auto leading-relaxed">
          Upload your logo designs and share them with the community. Get featured in our gallery.
        </p>
        <Link href="/upload"
          className="inline-block bg-[#d4a373] text-black px-10 py-4 uppercase tracking-widest text-sm font-bold hover:bg-[#e8b989] transition"
        >
          Upload Your Logo →
        </Link>
      </div>
    </div>
  );
}