import { connectDB } from "@/lib/mongodb";
import Logo from "@/models/Logo";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { TEMPLATE_CATEGORIES, templateSlugToDbValue, templateSlugToLabel } from "@/lib/templateCategories";
import CategoryPageClient from "@/components/CategoryPageClient";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function TemplateCategoryPage({ params }: Props) {
  const { slug } = await params;
  await connectDB();

  const query =
    slug === "all"
      ? { type: "template" }
      : { type: "template", category: templateSlugToDbValue(slug) };

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

  const label = slug === "all" ? "All Templates" : templateSlugToLabel(slug);
  const currentCat = TEMPLATE_CATEGORIES.find((c) => c.slug === slug);

  return (
    <div className="bg-[#0a0a0a] min-h-screen">
      <Navbar />
      <div className="pt-20 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-16 py-10">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-gray-600 uppercase tracking-widest mb-5">
            <Link href="/" className="hover:text-[#d4a373] transition">Home</Link>
            <span>/</span>
            <Link href="/templates" className="hover:text-[#d4a373] transition">Templates</Link>
            {slug !== "all" && (
              <><span>/</span><span className="text-[#d4a373]">{label}</span></>
            )}
          </div>

          <div className="flex items-end justify-between flex-wrap gap-4">
            <div>
              {currentCat && (
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className="text-2xl w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: `${currentCat.color}20` }}
                  >
                    {currentCat.icon}
                  </span>
                </div>
              )}
              <h1 className="text-3xl md:text-5xl font-extrabold text-white uppercase tracking-wide">
                {label}
              </h1>
              <p className="text-gray-500 text-sm mt-2">
                {logos.length} template{logos.length !== 1 ? "s" : ""} found
              </p>
            </div>

            {/* Category pills */}
            <div className="flex flex-wrap gap-2 max-w-2xl">
              <Link href="/templates/all"
                className={`px-4 py-1.5 rounded-full text-[10px] uppercase tracking-widest border transition ${
                  slug === "all" ? "bg-[#d4a373] text-black border-[#d4a373]" : "border-white/10 text-gray-500 hover:border-[#d4a373] hover:text-white"
                }`}
              >All</Link>
              {TEMPLATE_CATEGORIES.map((cat) => (
                <Link key={cat.slug} href={`/templates/${cat.slug}`}
                  className={`px-4 py-1.5 rounded-full text-[10px] uppercase tracking-widest border transition ${
                    slug === cat.slug ? "text-white border-transparent" : "border-white/10 text-gray-500 hover:text-white"
                  }`}
                  style={slug === cat.slug ? { background: cat.color, borderColor: cat.color } : {}}
                >
                  {cat.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <CategoryPageClient logos={logos} />

      <div className="text-center py-12">
        <Link href="/templates" className="text-gray-600 hover:text-[#d4a373] text-xs uppercase tracking-widest transition">
          ← Back to Templates
        </Link>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  return [{ slug: "all" }, ...TEMPLATE_CATEGORIES.map((c) => ({ slug: c.slug }))];
}