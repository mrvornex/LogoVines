export const dynamic = "force-dynamic";

import { connectDB } from "@/lib/mongodb";
import Logo from "@/models/Logo";
import Hero from "@/components/Hero";
import CategoriesSection from "@/components/CategoriesSection";
import LogoGrid from "@/components/LogoGrid";
import TemplateCategoriesSection from "@/components/TemplateCategoriesSection";
import Navbar from "@/components/Navbar";
import NewestTemplates from "@/components/Newesttemplates";

export default async function Home() {
  await connectDB();

  // Brand logos
  const logosDocs = await Logo.find({
    status: "approved",
    type: { $in: ["brand", null] },
  }).sort({ createdAt: -1 }).lean();

  const logos = logosDocs.map((l: any) => ({
    id:         l._id.toString(),
    image:      l.imageUrl,
    title:      l.title,
    desc:       l.desc,
    category:   l.category || "Uncategorized",
    folderName: l.folderName || null,
    createdAt:  l.createdAt?.toISOString(),
  }));

  const categories = ["All", ...Array.from(new Set(logos.map((l) => l.category))).sort()];

  // Newest templates
  const templateDocs = await Logo.find({
    status: "approved",
    type: "template",
  }).sort({ createdAt: -1 }).limit(12).lean();

  const templates = templateDocs.map((l: any) => ({
    id:       l._id.toString(),
    image:    l.imageUrl,
    title:    l.title,
    desc:     l.desc,
    category: l.category || "Uncategorized",
    folderName: l.folderName || null,
    createdAt: l.createdAt?.toISOString(),
  }));

  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <Hero />
      <CategoriesSection />
      <LogoGrid logos={logos} categories={categories} />
      <TemplateCategoriesSection />
      {templates.length > 0 && <NewestTemplates templates={templates} />}
    </div>
  );
}   