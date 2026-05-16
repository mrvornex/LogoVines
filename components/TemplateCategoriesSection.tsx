import Link from "next/link";
import { connectDB } from "@/lib/mongodb";
import Logo from "@/models/Logo";
import { TEMPLATE_CATEGORIES, templateCategoryToSlug } from "@/lib/templateCategories";

export default async function TemplateCategoriesSection() {
  await connectDB();

  // Count + get preview images per template category
  const categoryData = await Logo.aggregate([
    { $match: { type: "template" } },
    {
      $group: {
        _id:    "$category",
        count:  { $sum: 1 },
        images: { $push: "$imageUrl" },
      },
    },
  ]);

  const dataMap: Record<string, { count: number; images: string[] }> = {};
  categoryData.forEach((c: any) => {
    const slug = templateCategoryToSlug(c._id || "");
    dataMap[slug] = { count: c.count, images: c.images.slice(0, 6) };
  });

  const totalTemplates = Object.values(dataMap).reduce((a, b) => a + b.count, 0);

  return (
    <section id="template-categories" className="bg-[#080808] border-t border-white/5 py-24 px-6 md:px-16">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-[#d4a373] text-xs uppercase tracking-[0.3em] mb-4">Ready to Use</p>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white uppercase tracking-wide">
            Popular Template Categories
          </h2>
          <div className="mt-4 w-16 h-[2px] bg-[#d4a373] mx-auto" />
          <p className="text-gray-500 text-sm mt-5">
            {totalTemplates}+ templates across {TEMPLATE_CATEGORIES.length} categories
          </p>
        </div>

        {/* Grid — 4 columns, image preview cards like seeklogo */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {TEMPLATE_CATEGORIES.map((cat) => {
            const data   = dataMap[cat.slug] || { count: 0, images: [] };
            const images = data.images;

            return (
              <Link
                key={cat.slug}
                href={`/templates/${cat.slug}`}
                className="group bg-[#111] border border-white/5 rounded-2xl overflow-hidden hover:border-white/15 hover:shadow-[0_8px_40px_rgba(0,0,0,0.5)] transition-all duration-300"
              >
                {/* Preview grid — 6 logos */}
                <div className="grid grid-cols-3 gap-[2px] p-3 bg-[#0d0d0d]">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="aspect-square rounded-lg overflow-hidden bg-[#111] flex items-center justify-center"
                    >
                      {images[i] ? (
                        <img
                          src={images[i]}
                          alt=""
                          className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                        />
                      ) : (
                        <span className="text-gray-800 text-lg">{cat.icon}</span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Label bar */}
                <div
                  className="px-4 py-3 flex items-center justify-between"
                  style={{ background: cat.color }}
                >
                  <span className="text-white text-xs font-bold uppercase tracking-widest">
                    {cat.label}
                  </span>
                  <span className="text-white/70 text-[10px] font-medium">
                    {data.count > 0 ? `${data.count} logos` : "Browse →"}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* View all */}
        <div className="text-center mt-10">
          <Link
            href="/templates"
            className="inline-flex items-center gap-2 border border-white/10 text-gray-400 hover:border-[#d4a373] hover:text-[#d4a373] text-xs uppercase tracking-widest px-6 py-3 rounded-full transition"
          >
            Browse All Templates →
          </Link>
        </div>
      </div>
    </section>
  );
}