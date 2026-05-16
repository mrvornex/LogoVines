import { connectDB } from "@/lib/mongodb";
import Logo from "@/models/Logo";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Process from "@/components/Process";
import CategoriesSection from "@/components/CategoriesSection";
import LogoGrid from "@/components/LogoGrid";
import Contact from "@/components/contact";
import Navbar from "@/components/Navbar";
import TemplateCategoriesSection from "@/components/TemplateCategoriesSection";

export default async function Home() {
  await connectDB();

  const logosDocs = await Logo.find({ type: { $in: ["brand", null] } }).sort({ createdAt: -1 }).lean();

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

  return (
    <div className="bg-[#0a0a0a] min-h-screen">
      <Navbar />
      <Hero />
      {/* <About />
      <Process /> */}
      <LogoGrid logos={logos} categories={categories} />
      <CategoriesSection />
      <TemplateCategoriesSection />
      <Contact />
    </div>
  );
}