import { connectDB } from "@/lib/mongodb";
import Logo from "@/models/Logo";
// import Navbar from "@/components/Navbar";
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
      ? { type: "template", status: "approved" }
      : { type: "template", status: "approved", category: templateSlugToDbValue(slug) };

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

  return (
    <div className="bg-white min-h-screen">
      {/* <Navbar /> */}
      <div className="pt-20">

        {/* Header */}
        <div className="border-b border-gray-200 px-6 md:px-16 py-8">
          <div className="max-w-7xl mx-auto">

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
              <Link href="/" className="hover:text-[#1A4450] transition">Home</Link>
              <span>/</span>
              <Link href="/templates" className="hover:text-[#1A4450] transition">Templates</Link>
              {slug !== "all" && (
                <><span>/</span><span className="text-[#1A4450]">{label}</span></>
              )}
            </div>

            <h1 className="text-2xl font-bold text-[#1A4450]">{label}</h1>
            <p className="text-gray-400 text-sm mt-1">{logos.length} templates found</p>

            {/* Category pills */}
            <div className="flex flex-wrap gap-2 mt-5">
              <Link href="/templates/all"
                className={`px-3 py-1 rounded-full text-xs border transition ${
                  slug === "all"
                    ? "bg-[#1A4450] text-white border-[#1A4450]"
                    : "border-gray-200 text-gray-500 hover:border-[#1A4450] hover:text-[#1A4450]"
                }`}
              >All</Link>
              {TEMPLATE_CATEGORIES.map((cat) => (
                <Link key={cat.slug} href={`/templates/${cat.slug}`}
                  className={`px-3 py-1 rounded-full text-xs border transition ${
                    slug === cat.slug
                      ? "bg-[#1A4450] text-white border-[#1A4450]"
                      : "border-gray-200 text-gray-500 hover:border-[#1A4450] hover:text-[#1A4450]"
                  }`}
                >{cat.label}</Link>
              ))}
            </div>
          </div>
        </div>

        {/* Logo grid */}
        <CategoryPageClient logos={logos} currentSlug={slug} />

      </div>
    </div>
  );
}

export async function generateStaticParams() {
  return [{ slug: "all" }, ...TEMPLATE_CATEGORIES.map((c) => ({ slug: c.slug }))];
}