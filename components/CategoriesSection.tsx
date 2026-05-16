import Link from "next/link";
import { connectDB } from "@/lib/mongodb";
import Logo from "@/models/Logo";
import { CATEGORIES, categoryToSlug } from "@/lib/categories";

export default async function CategoriesSection() {
  await connectDB();

  const counts = await Logo.aggregate([
    { $group: { _id: "$category", count: { $sum: 1 } } },
  ]);

  const countMap: Record<string, number> = {};
  counts.forEach((c: any) => {
    countMap[categoryToSlug(c._id || "uncategorized")] = c.count;
  });

  const totalLogos = Object.values(countMap).reduce((a, b) => a + b, 0);

  // Only show categories that have logos OR all of them
  const visibleCats = CATEGORIES.filter((c) => c.slug !== "uncategorized");

  return (
    <section id="categories" className="bg-[#080808] border-t border-white/5 py-24 px-6 md:px-16">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-[#d4a373] text-xs uppercase tracking-[0.3em] mb-4">Browse By Type</p>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white uppercase tracking-wide">
            Popular Brand Categories
          </h2>
          <div className="mt-4 w-16 h-[2px] bg-[#d4a373] mx-auto" />
          <p className="text-gray-500 text-sm mt-5">
            {totalLogos}+ logos across {visibleCats.length} categories
          </p>
        </div>

        {/* Grid — 2 rows of 4 like seeklogo */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-5">
          {visibleCats.map((cat) => {
            const count = countMap[cat.slug] || 0;
            return (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="group relative bg-[#111] border border-white/5 rounded-2xl overflow-hidden hover:border-white/15 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)]"
              >
                {/* Top color bar */}
                <div className="h-[3px] w-full" style={{ background: cat.color }} />

                <div className="p-5 flex flex-col items-center gap-3">
                  {/* Icon */}
                  <div
                    className="text-2xl w-14 h-14 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                    style={{ background: `${cat.color}15` }}
                  >
                    {cat.icon}
                  </div>

                  {/* Label + count */}
                  <div className="text-center">
                    <p className="text-white text-sm font-bold uppercase tracking-wide leading-tight">
                      {cat.label}
                    </p>
                    <p className="text-gray-600 text-[11px] mt-1">
                      {count > 0 ? `${count} logo${count !== 1 ? "s" : ""}` : "Browse →"}
                    </p>
                  </div>
                </div>

                {/* Bottom hover bar */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-[2px] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
                  style={{ background: cat.color }}
                />
              </Link>
            );
          })}
        </div>

        {/* View all */}
        <div className="text-center mt-10">
          <Link
            href="/category/all"
            className="inline-flex items-center gap-2 border border-white/10 text-gray-400 hover:border-[#d4a373] hover:text-[#d4a373] text-xs uppercase tracking-widest px-6 py-3 rounded-full transition"
          >
            View All {totalLogos} Logos →
          </Link>
        </div>
      </div>
    </section>
  );
}