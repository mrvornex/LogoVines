"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Stats {
  totalLogos:       number;
  totalCategories:  number;
  thisMonth:        number;
  topCategory:      string;
  topCategoryCount: number;
  breakdown:        { _id: string; count: number }[];
  recentUploads:    { id: string; title: string; imageUrl: string; category: string; createdAt: string }[];
}

export default function AdminDashboard() {
  const [stats,   setStats]   = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setStats(d.stats);
        else setError("Failed to load stats");
      })
      .catch(() => setError("Something went wrong"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="px-6 md:px-16 py-10">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-[#111] border border-white/5 rounded-2xl p-6 animate-pulse h-28" />
        ))}
      </div>
    </div>
  );

  if (error) return (
    <div className="px-6 md:px-16 py-10 text-red-400 text-sm">{error}</div>
  );

  if (!stats) return null;

  const statCards = [
    {
      label: "Total Logos",
      value: stats.totalLogos,
      icon: "🖼️",
      color: "#d4a373",
      sub: "All time uploads",
    },
    {
      label: "Categories",
      value: stats.totalCategories,
      icon: "📂",
      color: "#6c9fff",
      sub: "Active categories",
    },
    {
      label: "This Month",
      value: stats.thisMonth,
      icon: "📈",
      color: "#6fcf97",
      sub: "New uploads",
    },
    {
      label: "Top Category",
      value: stats.topCategoryCount,
      icon: "🏆",
      color: "#e8c96a",
      sub: stats.topCategory,
    },
  ];

  // Max count for progress bars
  const maxCount = Math.max(...stats.breakdown.map((b) => b.count), 1);

  return (
    <div className="px-6 md:px-16 py-10">

      {/* Section header */}
      <div className="mb-8">
        <p className="text-[#d4a373] text-xs uppercase tracking-widest mb-1">Overview</p>
        <h2 className="text-white text-2xl font-bold">Dashboard</h2>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {statCards.map((s) => (
          <div
            key={s.label}
            className="bg-[#111] border border-white/5 rounded-2xl p-6 relative overflow-hidden group hover:border-white/10 transition"
          >
            {/* Glow */}
            <div
              className="absolute top-0 right-0 w-20 h-20 rounded-full opacity-10 blur-2xl"
              style={{ background: s.color }}
            />

            <div className="text-2xl mb-3">{s.icon}</div>
            <p
              className="text-3xl font-extrabold leading-none"
              style={{ color: s.color }}
            >
              {s.value}
            </p>
            <p className="text-white text-xs font-semibold uppercase tracking-widest mt-2">
              {s.label}
            </p>
            <p className="text-gray-600 text-[10px] mt-1 truncate">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Bottom grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Category breakdown */}
        <div className="bg-[#111] border border-white/5 rounded-2xl p-6">
          <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-6">
            Logos by Category
          </h3>
          <div className="space-y-4">
            {stats.breakdown.map((b) => (
              <div key={b._id}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-gray-400 uppercase tracking-wide truncate max-w-[70%]">
                    {b._id || "Uncategorized"}
                  </span>
                  <span className="text-[#d4a373] font-semibold">{b.count}</span>
                </div>
                <div className="h-[4px] bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${(b.count / maxCount) * 100}%`,
                      background: "linear-gradient(90deg, #d4a373, #e8c99a)",
                    }}
                  />
                </div>
              </div>
            ))}
            {stats.breakdown.length === 0 && (
              <p className="text-gray-600 text-sm text-center py-4">No logos uploaded yet</p>
            )}
          </div>
        </div>

        {/* Recent uploads */}
        <div className="bg-[#111] border border-white/5 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-white font-bold text-sm uppercase tracking-widest">
              Recent Uploads
            </h3>
            <span className="text-gray-600 text-xs">Last 5</span>
          </div>

          <div className="space-y-3">
            {stats.recentUploads.map((r) => (
              <Link
                key={r.id}
                href={`/logo/${r.id}`}
                target="_blank"
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition group"
              >
                {/* Thumb */}
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#0d0d0d] flex-shrink-0">
                  <img
                    src={r.imageUrl}
                    alt={r.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-semibold truncate">{r.title}</p>
                  <p className="text-gray-600 text-xs mt-0.5">{r.category}</p>
                </div>

                {/* Date */}
                <span className="text-gray-700 text-[10px] whitespace-nowrap flex-shrink-0">
                  {new Date(r.createdAt).toLocaleDateString("en-PK", { day: "numeric", month: "short" })}
                </span>
              </Link>
            ))}

            {stats.recentUploads.length === 0 && (
              <p className="text-gray-600 text-sm text-center py-6">No uploads yet</p>
            )}
          </div>

          {/* View all */}
          <div className="mt-4 pt-4 border-t border-white/5 text-center">
            <Link
              href="/category/all"
              className="text-gray-600 hover:text-[#d4a373] text-xs uppercase tracking-widest transition"
            >
              View All Logos →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}