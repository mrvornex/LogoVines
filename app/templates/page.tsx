// import { connectDB } from "@/lib/mongodb";
// import Logo from "@/models/Logo";
// import Navbar from "@/components/Navbar";
// import Link from "next/link";
// import { TEMPLATE_CATEGORIES, templateCategoryToSlug } from "@/lib/templateCategories";

// export default async function TemplatesPage() {
//   await connectDB();

//   // Category data with counts + preview images
//   const categoryData = await Logo.aggregate([
//     { $match: { type: "template", status: "approved" } },
//     { $group: { _id: "$category", count: { $sum: 1 }, images: { $push: "$imageUrl" } } },
//   ]);

//   const dataMap: Record<string, { count: number; images: string[] }> = {};
//   categoryData.forEach((c: any) => {
//     const slug = templateCategoryToSlug(c._id || "");
//     dataMap[slug] = { count: c.count, images: c.images.slice(0, 6) };
//   });

//   const totalTemplates = Object.values(dataMap).reduce((a, b) => a + b.count, 0);
//   const totalCats      = TEMPLATE_CATEGORIES.length;

//   // Latest templates
//   const latestDocs = await Logo.find({ type: "template", status: "approved" })
//     .sort({ createdAt: -1 })
//     .limit(8)
//     .lean();

//   const latest = latestDocs.map((l: any) => ({
//     id:       l._id.toString(),
//     image:    l.imageUrl,
//     title:    l.title,
//     category: l.category,
//   }));

//   return (
//     <div className="bg-[#0a0a0a] min-h-screen">
//       <Navbar />

//       {/* ── Hero ── */}
//       <div className="pt-20 border-b border-white/5">
//         <div className="max-w-7xl mx-auto px-6 md:px-16 py-16 text-center">
//           <p className="text-[#d4a373] text-xs uppercase tracking-[0.3em] mb-4">Ready to Use</p>
//           <h1 className="text-4xl md:text-6xl font-extrabold text-white uppercase tracking-wide mb-4">
//             Logo Templates
//           </h1>
//           <div className="w-16 h-[2px] bg-[#d4a373] mx-auto mb-6" />
//           <p className="text-gray-500 text-sm max-w-xl mx-auto leading-relaxed mb-10">
//             Professional logo templates across {totalCats} categories. Find the perfect starting point for your brand identity.
//           </p>

//           {/* Stats */}
//           <div className="flex items-center justify-center gap-10 mb-10">
//             {[
//               { n: totalTemplates, l: "Templates"  },
//               { n: totalCats,      l: "Categories" },
//             ].map((s) => (
//               <div key={s.l} className="text-center">
//                 <p className="text-[#d4a373] text-3xl font-extrabold" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{s.n}</p>
//                 <p className="text-gray-600 text-[10px] uppercase tracking-widest mt-1">{s.l}</p>
//               </div>
//             ))}
//           </div>

//           {/* Search hint */}
//           <Link href="/templates/all"
//             className="inline-flex items-center gap-2 bg-[#d4a373] text-black px-8 py-3.5 uppercase tracking-widest text-sm font-bold hover:bg-[#e8b989] transition"
//           >
//             Browse All Templates →
//           </Link>
//         </div>
//       </div>

//       {/* ── Popular Template Categories — seeklogo style ── */}
//       <div className="max-w-7xl mx-auto px-6 md:px-16 py-16">
//         <div className="text-center mb-12">
//           <p className="text-[#d4a373] text-xs uppercase tracking-[0.3em] mb-3">Browse By Type</p>
//           <h2 className="text-3xl md:text-4xl font-extrabold text-white uppercase tracking-wide">
//             Popular Template Categories
//           </h2>
//           <div className="w-12 h-[2px] bg-[#d4a373] mx-auto mt-4" />
//         </div>

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
//           {TEMPLATE_CATEGORIES.map((cat) => {
//             const data   = dataMap[cat.slug] || { count: 0, images: [] };
//             const images = data.images;
//             return (
//               <Link key={cat.slug} href={`/templates/${cat.slug}`}
//                 className="group bg-[#111] border border-white/5 rounded-2xl overflow-hidden hover:border-white/15 hover:shadow-[0_8px_40px_rgba(0,0,0,0.5)] transition-all duration-300"
//               >
//                 {/* Preview grid */}
//                 <div className="grid grid-cols-3 gap-[2px] p-3 bg-[#0d0d0d]">
//                   {Array.from({ length: 6 }).map((_, i) => (
//                     <div key={i} className="aspect-square rounded-lg overflow-hidden bg-[#111] flex items-center justify-center">
//                       {images[i] ? (
//                         <img src={images[i]} alt="" className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
//                       ) : (
//                         <span className="text-gray-800 text-lg">{cat.icon}</span>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//                 {/* Label */}
//                 <div className="px-4 py-3 flex items-center justify-between" style={{ background: cat.color }}>
//                   <span className="text-white text-xs font-bold uppercase tracking-widest">{cat.label}</span>
//                   <span className="text-white/70 text-[10px]">{data.count > 0 ? `${data.count} logos` : "Browse →"}</span>
//                 </div>
//               </Link>
//             );
//           })}
//         </div>
//       </div>

//       {/* ── Latest Templates ── */}
//       {latest.length > 0 && (
//         <div className="border-t border-white/5 bg-[#080808] py-16 px-6 md:px-16">
//           <div className="max-w-7xl mx-auto">
//             <div className="flex items-center justify-between mb-10">
//               <div>
//                 <p className="text-[#d4a373] text-xs uppercase tracking-[0.3em] mb-2">Just Added</p>
//                 <h2 className="text-2xl md:text-3xl font-extrabold text-white uppercase tracking-wide">Latest Templates</h2>
//               </div>
//               <Link href="/templates/all" className="text-gray-500 hover:text-[#d4a373] text-xs uppercase tracking-widest transition">
//                 View All →
//               </Link>
//             </div>

//             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
//               {latest.map((logo) => (
//                 <Link key={logo.id} href={`/logo/${logo.id}`}
//                   className="group bg-[#111] border border-white/5 rounded-2xl overflow-hidden hover:border-[#d4a373]/30 transition-all duration-300"
//                 >
//                   <div className="aspect-square bg-[#0d0d0d] overflow-hidden">
//                     <img src={logo.image} alt={logo.title}
//                       className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
//                     />
//                   </div>
//                   <div className="p-3">
//                     <p className="text-white text-xs font-semibold truncate">{logo.title}</p>
//                     <p className="text-gray-600 text-[10px] mt-0.5">{logo.category}</p>
//                   </div>
//                 </Link>
//               ))}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ── Upload CTA ── */}
//       <div className="border-t border-white/5 py-16 px-6 text-center">
//         <p className="text-[#d4a373] text-xs uppercase tracking-[0.3em] mb-3">Contribute</p>
//         <h2 className="text-white text-2xl md:text-3xl font-extrabold uppercase tracking-wide mb-3">
//           Share Your Templates
//         </h2>
//         <p className="text-gray-500 text-sm mb-8 max-w-md mx-auto leading-relaxed">
//           Upload your logo templates and help other designers find inspiration.
//         </p>
//         <Link href="/upload"
//           className="inline-block bg-[#d4a373] text-black px-10 py-4 uppercase tracking-widest text-sm font-bold hover:bg-[#e8b989] transition"
//         >
//           Upload Template →
//         </Link>
//       </div>
//     </div>
//   );
// }

import TemplateCategoriesSection from '@/components/TemplateCategoriesSection'
import React from 'react'

const page = () => {
  return (
    <div>
      <TemplateCategoriesSection />
    </div>
  )
}

export default page