import { connectDB } from "@/lib/mongodb";
import Logo from "@/models/Logo";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import LogoCard from "@/components/LogoCard";
import { categoryToSlug } from "@/lib/categories";
import LogoDetailClient from "@/components/LogoDetailClient";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function LogoDetailPage({ params }: Props) {
  const { id } = await params;

  await connectDB();

  const logo = await Logo.findById(id).lean() as any;
  if (!logo) {
    return (
      <div className="min-h-screen bg-[#1A4450] flex items-center justify-center">
        <div className="text-center">
          <p className="text-5xl mb-4">🔍</p>
          <h1 className="text-white text-2xl font-bold mb-2">Logo Not Found</h1>
          <Link href="/" className="text-[#d4a373] text-sm hover:underline">← Back to Home</Link>
        </div>
      </div>
    );
  }

  const related = await Logo.find({
    category: logo.category,
    _id: { $ne: logo._id },
  }).limit(8).lean() as any[];

  const logoData = {
    id:         logo._id.toString(),
    image:      logo.imageUrl,
    title:      logo.title,
    desc:       logo.desc,
    category:   logo.category || "Uncategorized",
    folderName: logo.folderName || null,
    createdAt:  logo.createdAt?.toISOString(),
  };

  const relatedData = related.map((r: any) => ({
    id:         r._id.toString(),
    image:      r.imageUrl,
    title:      r.title,
    desc:       r.desc,
    category:   r.category || "Uncategorized",
    folderName: r.folderName || null,
    createdAt:  r.createdAt?.toISOString(),
  }));

  const catSlug = categoryToSlug(logo.category || "uncategorized");

  return (
    <div className="bg-[#1A4450] min-h-screen">
      <Navbar />

      <div className="pt-20">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-6 md:px-16 py-6">
          <div className="flex items-center gap-2 text-xs text-white uppercase tracking-widest">
            <Link href="/" className="transition">Home</Link>
            <span>/</span>
            <Link href={`/category/${catSlug}`} className=" transition">
              {logo.category}
            </Link>
            <span>/</span>
            <span className="text-[#ffffff] truncate max-w-[200px]">{logo.title}</span>
          </div>
        </div>

        {/* Main detail */}
       <LogoDetailClient logo={logoData} related={relatedData} />

        {/* Related logos */}
        {/* {relatedData.length > 0 && (
          <div className="max-w-7xl mx-auto px-6 md:px-16 py-16 border-t border-white/5">
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-[#ffffff] text-xs uppercase tracking-[0.3em] mb-1">More Like This</p>
                <h2 className="text-2xl font-bold text-white uppercase tracking-wide">Related Logos</h2>
              </div>
              <Link
                href={`/category/${catSlug}`}
                className="text-white text-xs uppercase tracking-widest transition"
              >
                View All →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {relatedData.map((r) => (
                <LogoCard key={r.id} {...r} />
              ))}
            </div>
          </div>
        )} */}
      </div>
    </div>
  );
}