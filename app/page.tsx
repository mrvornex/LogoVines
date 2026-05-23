import { connectDB } from "@/lib/mongodb";
import Logo from "@/models/Logo";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Process from "@/components/Process";
import CategoriesSection from "@/components/CategoriesSection";
import TemplateCategoriesSection from "@/components/TemplateCategoriesSection";
import LogoGrid from "@/components/LogoGrid";
import Contact from "@/components/contact";
import Navbar from "@/components/Navbar";

export default async function Home() {
  await connectDB();

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

  // Real stats for Hero
  const totalLogos   = await Logo.countDocuments({ status: "approved" });
  const uploadersRaw = await Logo.distinct("uploadedBy");
  const totalClients = uploadersRaw.filter(Boolean).length;

  return (
    <div className="bg-[#0a0a0a] min-h-screen">
      <Navbar />
      <Hero totalLogos={totalLogos} totalClients={totalClients} />
      {/* <About /> */}
      <Process />
      <CategoriesSection />
      <TemplateCategoriesSection />
      <LogoGrid logos={logos} categories={categories} />
      <Contact />
    </div>
  );
}