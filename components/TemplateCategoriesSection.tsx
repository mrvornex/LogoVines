import Link from "next/link";
import { connectDB } from "@/lib/mongodb";
import Logo from "@/models/Logo";
import { templateCategoryToSlug } from "@/lib/templateCategories";

// Har category: label, slug, bottom bar color, aur ek combined preview image (public/template-category-logos/ mein rakhni hai)
const CATEGORIES = [
  { slug: "animal",           label: "Animal",                color: "#29b6f6", image: "banner-template-category-animal.png" },
  { slug: "building",         label: "Building",              color: "#f5a623", image: "banner-template-category-building.png" },
  { slug: "business",         label: "Business",              color: "#e91e63", image: "banner-template-category-business.png" },
  { slug: "food-drinks",      label: "Food and Drinks",       color: "#1a237e", image: "banner-template-category-food-and-drinks.png" },
  { slug: "letter",           label: "Letter",                color: "#7e57c2", image: "banner-template-category-letter.png" },
  { slug: "sports",           label: "Sports",                color: "#e53935", image: "banner-template-category-sports.png" },
  { slug: "technology",       label: "Technology",            color: "#00897b", image: "banner-template-category-technology.png" },
  { slug: "travel-transport", label: "Travel and Transport",  color: "#fb8c00", image: "banner-template-category-travel-and-transport.png" },
];

export default async function TemplateCategoriesSection() {
  await connectDB();

  const counts = await Logo.aggregate([
    { $match: { type: "template", status: "approved" } },
    { $group: { _id: "$category", count: { $sum: 1 } } },
  ]);

  const countMap: Record<string, number> = {};
  counts.forEach((c: any) => {
    countMap[templateCategoryToSlug(c._id || "")] = c.count;
  });

  return (
    <section id="template-categories" className="bg-white py-20 px-6 md:px-16">
      <div className="max-w-7xl mx-auto">

        <h2 className="text-center text-3xl md:text-4xl font-bold text-[#1A4450] mb-12">
          Popular Template Categories
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/templates/${cat.slug}`}
              className="block bg-white border border-[#1A4450]/10 rounded-xl overflow-hidden hover:border-[#1A4450]/30 transition"
            >
              {/* Category preview image */}
              <div className="h-44 flex items-center justify-center p-3">
                <img
                  src={`/template-category-logos/${cat.image}`}
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