"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Stats {
  totalLogos:      number;
  approved:        number;
  pending:         number;
  rejected:        number;
  totalCategories: number;
  thisMonth:       number;
  topCategory:     string;
  breakdown:       { _id: string; count: number }[];
  recentUploads:   { id: string; title: string; imageUrl: string; category: string; status: string; createdAt: string }[];
}

const STATUS_STYLE: Record<string, string> = {
  approved: "text-green-600 bg-green-50 border-green-200",
  pending:  "text-yellow-600 bg-yellow-50 border-yellow-200",
  rejected: "text-red-600 bg-red-50 border-red-200",
};

export default function AdminDashboard() {
  const [stats,   setStats]   = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((d) => { if (d.success) setStats(d.stats); else setError("Failed to load stats"); })
      .catch(() => setError("Something went wrong"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="p-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => <div key={i} className="h-28 bg-gray-100 rounded-xl animate-pulse" />)}
    </div>
  );

  if (error) return <div className="p-8 text-red-500 text-sm">{error}</div>;
  if (!stats) return null;

  const maxCount = Math.max(...stats.breakdown.map((b) => b.count), 1);

  const statCards = [
    {
      label: "Total Logos",
      value: stats.totalLogos,
      sub: "All uploads",
      icon: (
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
          <rect x="3" y="3" width="18" height="18" rx="2" stroke="#1A4450" strokeWidth="1.8"/>
          <circle cx="8.5" cy="8.5" r="1.5" stroke="#1A4450" strokeWidth="1.8"/>
          <path d="M3 15l5-5 4 4 3-3 6 6" stroke="#1A4450" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
      ),
    },
    {
      label: "Approved",
      value: stats.approved,
      sub: "Visible to public",
      icon: (
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="9" stroke="#16a34a" strokeWidth="1.8"/>
          <path d="M8 12l3 3 5-5" stroke="#16a34a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      label: "Pending",
      value: stats.pending,
      sub: "Awaiting review",
      icon: (
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="9" stroke="#d97706" strokeWidth="1.8"/>
          <path d="M12 7v5l3 3" stroke="#d97706" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
      ),
    },
    {
      label: "This Month",
      value: stats.thisMonth,
      sub: "New uploads",
      icon: (
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
          <path d="M3 17l4-4 4 4 4-6 4 2" stroke="#6c9fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M3 21h18" stroke="#6c9fff" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
      ),
    },
  ];

  return (
    <div className="p-8 bg-white min-h-screen">

      <h2 className="text-xl font-bold text-[#1A4450] mb-8">Dashboard Overview</h2>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((s) => (
          <div key={s.label} className="bg-white border border-gray-200 rounded-xl p-5 hover:border-[#1A4450]/30 transition">
            <div className="mb-3">{s.icon}</div>
            <p className="text-2xl font-bold text-[#1A4450]">{s.value}</p>
            <p className="text-sm font-medium text-[#1A4450] mt-1">{s.label}</p>
            <p className="text-xs text-gray-400 mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Status row */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Approved", value: stats.approved, style: "text-green-600 bg-green-50 border-green-200" },
          { label: "Pending",  value: stats.pending,  style: "text-yellow-600 bg-yellow-50 border-yellow-200" },
          { label: "Rejected", value: stats.rejected, style: "text-red-600 bg-red-50 border-red-200" },
        ].map((s) => (
          <div key={s.label} className={`border rounded-xl p-4 text-center ${s.style}`}>
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-xs uppercase tracking-widest mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Bottom grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Category breakdown */}
        <div className="border border-gray-200 rounded-xl p-6">
          <h3 className="text-sm font-bold text-[#1A4450] uppercase tracking-widest mb-5">Logos by Category</h3>
          <div className="space-y-4">
            {stats.breakdown.map((b) => (
              <div key={b._id}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-gray-500 truncate max-w-[70%]">{b._id || "Uncategorized"}</span>
                  <span className="text-[#1A4450] font-semibold">{b.count}</span>
                </div>
                <div className="h-[4px] bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#1A4450] rounded-full"
                    style={{ width: `${(b.count / maxCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
            {stats.breakdown.length === 0 && (
              <p className="text-gray-400 text-sm text-center py-4">No logos yet</p>
            )}
          </div>
        </div>

        {/* Recent uploads */}
        <div className="border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-bold text-[#1A4450] uppercase tracking-widest">Recent Uploads</h3>
            <span className="text-gray-400 text-xs">Last 5</span>
          </div>
          <div className="space-y-3">
            {stats.recentUploads.map((r) => (
              <Link key={r.id} href={`/logo/${r.id}`} target="_blank"
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition"
              >
                <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  <img src={r.imageUrl} alt={r.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[#1A4450] text-sm font-medium truncate">{r.title}</p>
                  <p className="text-gray-400 text-xs">{r.category}</p>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full border ${STATUS_STYLE[r.status] || STATUS_STYLE.pending}`}>
                  {r.status}
                </span>
              </Link>
            ))}
            {stats.recentUploads.length === 0 && (
              <p className="text-gray-400 text-sm text-center py-4">No uploads yet</p>
            )}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 text-center">
            <Link href="/category/all" target="_blank"
              className="text-gray-400 hover:text-[#1A4450] text-xs uppercase tracking-widest transition"
            >View All Logos →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}