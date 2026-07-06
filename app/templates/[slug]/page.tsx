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
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 pt-24 pb-4">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
          <Link href="/" className="hover:text-[#1A4450] transition">Home</Link>
          <span>/</span>
          <Link href="/templates" className="hover:text-[#1A4450] transition">Templates</Link>
          {slug !== "all" && (
            <><span>/</span><span className="text-[#1A4450]">{label}</span></>
          )}
        </div>

        <h1 className="text-2xl font-bold text-[#1A4450] mb-2">{label}</h1>
        <p className="text-gray-400 text-sm mb-6">{logos.length} templates found</p>
      </div>

      <CategoryPageClient logos={logos} currentSlug={slug} />
    </div>
  );
}

export async function generateStaticParams() {
  return [{ slug: "all" }, ...TEMPLATE_CATEGORIES.map((c) => ({ slug: c.slug }))];
}