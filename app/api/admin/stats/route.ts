import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Logo from "@/models/Logo";

export async function GET() {
  try {
    await connectDB();

    const totalLogos      = await Logo.countDocuments();
    const categories      = await Logo.distinct("category");
    const totalCategories = categories.length;

    const topCategory = await Logo.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort:  { count: -1 } },
      { $limit: 1 },
    ]);

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const thisMonth = await Logo.countDocuments({ createdAt: { $gte: startOfMonth } });

    const breakdown = await Logo.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort:  { count: -1 } },
    ]);

    const recentUploads = await Logo.find().sort({ createdAt: -1 }).limit(5).lean() as any[];

    return NextResponse.json({
      success: true,
      stats: {
        totalLogos,
        totalCategories,
        thisMonth,
        topCategory:      topCategory[0]?._id || "—",
        topCategoryCount: topCategory[0]?.count || 0,
        breakdown,
        recentUploads: recentUploads.map((r) => ({
          id:        r._id.toString(),
          title:     r.title,
          imageUrl:  r.imageUrl,
          category:  r.category,
          createdAt: r.createdAt,
        })),
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: String(error) }, { status: 500 });
  }
}