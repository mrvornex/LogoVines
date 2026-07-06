import Link from "next/link";
import { connectDB } from "@/lib/mongodb";
import Logo from "@/models/Logo";
import { categoryToSlug } from "@/lib/categories";

// Har category: label, slug, bottom bar color, aur ek combined preview image (public/category-logos/ mein rakhni hai)
const CATEGORIES = [
  { slug: "auto-moto",    label: "Auto & Moto",     color: "#29b6f6", image: "banner-brand-category-auto-and-moto.png" },
  { slug: "fashion",      label: "Fashion",         color: "#f5a623", image: "banner-brand-category-fashion.png" },
  { slug: "social-media", label: "Social Media",    color: "#e91e63", image: "banner-brand-category-social-media.png" },
  { slug: "technology",   label: "Technology",      color: "#1a237e", image: "banner-brand-category-technology.png" },
  { slug: "food-drinks",  label: "Food and Drinks", color: "#7e57c2", image: "banner-brand-category-food-and-drinks.png" },
  { slug: "finance",      label: "Finance",         color: "#e53935", image: "banner-brand-category-finance.png" },
  { slug: "transport",    label: "Transport",       color: "#00897b", image: "banner-brand-category-transport.png" },
  { slug: "sports",       label: "Sports",          color: "#fb8c00", image: "banner-brand-category-sports.png" },
];

export default async function CategoriesSection() {
  await connectDB();

  const counts = await Logo.aggregate([
    { $match: { status: "approved" } },
    { $group: { _id: "$category", count: { $sum: 1 } } },
  ]);

  const countMap: Record<string, number> = {};
  counts.forEach((c: any) => {
    countMap[categoryToSlug(c._id || "uncategorized")] = c.count;
  });

  return (
    <section id="categories" className="bg-white py-20 px-6 md:px-16">
      <div className="max-w-7xl mx-auto">

        <h2 className="text-center text-3xl md:text-4xl font-bold text-[#1A4450] mb-12">
          Popular Brand Categories
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="block bg-white border border-[#1A4450]/10 rounded-xl overflow-hidden hover:border-[#1A4450]/30 transition"
            >
              {/* Category preview image */}
              <div className="h-44 flex items-center justify-center p-1">
                <img
                  src={`/category-logos/${cat.image}`}
                  alt={cat.label}
                  className="max-w-full max-h-full object-contain"
                />
              </div>

              {/* Bottom color bar */}
              <div
                className="py-3 text-center text-white text-sm font-semibold"
                style={{ background: cat.color }}
              >
                {cat.label}
                {countMap[cat.slug] > 0 && (
                  <span className="opacity-80"> · {countMap[cat.slug]}</span>
                )}
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}