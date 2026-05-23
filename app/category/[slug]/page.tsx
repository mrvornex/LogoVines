import { connectDB } from "@/lib/mongodb";
import Logo from "@/models/Logo";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { CATEGORIES, slugToDbValue, slugToLabel } from "@/lib/categories";
import CategoryPageClient from "@/components/CategoryPageClient";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  await connectDB();

  const query =
    slug === "all"
      ? { status: "approved" }
      : { status: "approved", category: slugToDbValue(slug) };

  const logosDocs = await Logo.find(query).sort({ createdAt: -1 }).lean();

  const logos = logosDocs.map((l: any) => ({
    id:         l._id.toString(),
    image:      l.imageUrl,
    title:      l.title,
    desc:       l.desc,
    category:   l.category || "Uncategorized",
    folderName: l.folderName || null,
    createdAt:  l.createdAt?.toISOString(),
  }));

  const label = slug === "all" ? "All Logos" : slugToLabel(slug);

  return (
    <div className="bg-[#0a0a0a] min-h-screen">
      <Navbar />
      <div className="pt-20 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-16 py-10">
          <div className="flex items-center gap-2 text-xs text-gray-600 uppercase tracking-widest mb-5">
            <Link href="/" className="hover:text-[#d4a373] transition">Home</Link>
            <span>/</span>
            <Link href="/category/all" className="hover:text-[#d4a373] transition">Categories</Link>
            {slug !== "all" && <><span>/</span><span className="text-[#d4a373]">{label}</span></>}
          </div>
          <div className="flex items-end justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl md:text-5xl font-extrabold text-white uppercase tracking-wide">{label}</h1>
              <p className="text-gray-500 text-sm mt-2">{logos.length} logo{logos.length !== 1 ? "s" : ""} found</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href="/category/all" className={`px-4 py-1.5 rounded-full text-[10px] uppercase tracking-widest border transition ${slug === "all" ? "bg-[#d4a373] text-black border-[#d4a373]" : "border-white/10 text-gray-500 hover:border-[#d4a373] hover:text-white"}`}>All</Link>
              {CATEGORIES.map((cat) => (
                <Link key={cat.slug} href={`/category/${cat.slug}`}
                  className={`px-4 py-1.5 rounded-full text-[10px] uppercase tracking-widest border transition ${slug === cat.slug ? "bg-[#d4a373] text-black border-[#d4a373]" : "border-white/10 text-gray-500 hover:border-[#d4a373] hover:text-white"}`}
                >{cat.label}</Link>
              ))}
            </div>
          </div>
        </div>
      </div>
      <CategoryPageClient logos={logos} />
      <div className="text-center py-12">
        <Link href="/#categories" className="text-gray-600 hover:text-[#d4a373] text-xs uppercase tracking-widest transition">← Back to Categories</Link>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  return [{ slug: "all" }, ...CATEGORIES.map((c) => ({ slug: c.slug }))];
}