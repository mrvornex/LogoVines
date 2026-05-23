"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function PendingApprovals() {
  const [logos,      setLogos]      = useState<any[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [actionLoad, setActionLoad] = useState<{id:string; act:string}|null>(null);
  const [msg,        setMsg]        = useState<{id:string; type:"success"|"error"; text:string}|null>(null);

  const fetchPending = () => {
    fetch("/api/admin/pending").then((r) => r.json()).then((d) => { if (d.success) setLogos(d.logos); }).finally(() => setLoading(false));
  };

  useEffect(() => { fetchPending(); }, []);

  const action = async (id: string, act: "approve"|"reject") => {
    setActionLoad({ id, act });
    const res  = await fetch(`/api/admin/approve/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: act }) });
    const data = await res.json();
    if (data.success) {
      setLogos((prev) => prev.filter((l) => l._id !== id));
      setMsg({ id, type: "success", text: act === "approve" ? "Approved!" : "Rejected" });
      setTimeout(() => setMsg(null), 2000);
    }
    setActionLoad(null);
  };

  if (loading) return <div className="px-6 md:px-16 py-10"><div className="grid grid-cols-2 lg:grid-cols-4 gap-4">{[...Array(4)].map((_,i) => <div key={i} className="bg-[#111] rounded-2xl h-52 animate-pulse border border-white/5" />)}</div></div>;

  return (
    <div className="px-6 md:px-16 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-[#d4a373] text-xs uppercase tracking-widest mb-1">User Submissions</p>
          <h2 className="text-white text-2xl font-bold">Pending Approvals</h2>
        </div>
        <span className={`px-4 py-1.5 rounded-full text-xs font-bold border ${logos.length > 0 ? "bg-yellow-900/20 border-yellow-500/30 text-yellow-400" : "bg-green-900/20 border-green-500/30 text-green-400"}`}>
          {logos.length} pending
        </span>
      </div>

      {logos.length === 0 ? (
        <div className="text-center py-20 text-gray-600">
          <p className="text-5xl mb-4">✅</p>
          <p className="text-lg text-gray-500">All caught up!</p>
          <p className="text-sm mt-1 opacity-60">No pending submissions</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {logos.map((logo) => (
            <div key={logo._id} className="bg-[#111] border border-yellow-500/20 rounded-2xl overflow-hidden">
              <div className="h-44 bg-[#0d0d0d] overflow-hidden relative">
                <img src={logo.imageUrl} alt={logo.title} className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2 bg-yellow-500/20 border border-yellow-500/40 text-yellow-400 text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full">Pending</div>
              </div>
              <div className="p-4">
                <h3 className="text-white font-semibold text-sm truncate mb-1">{logo.title}</h3>
                <p className="text-gray-500 text-xs mb-1">{logo.category} · {logo.type}</p>
                <p className="text-gray-600 text-[10px] mb-3">By: {logo.uploadedBy?.name || "Unknown"}</p>
                {msg && msg.id === logo._id && (
                  <div className={`text-xs mb-2 ${msg.type === "success" ? "text-green-400" : "text-red-400"}`}>{msg.text}</div>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={() => action(logo._id, "approve")}
                    disabled={actionLoad?.id === logo._id}
                    className="flex-1 py-2 text-xs font-bold uppercase tracking-widest bg-green-500/20 border border-green-500/40 text-green-400 rounded-lg hover:bg-green-500/30 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-1"
                  >
                    {actionLoad?.id === logo._id && actionLoad?.act === "approve" ? (
                      <><svg className="animate-spin w-3 h-3" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="60" strokeDashoffset="20"/></svg> Approving...</>
                    ) : "✓ Approve"}
                  </button>
                  <button
                    onClick={() => action(logo._id, "reject")}
                    disabled={actionLoad?.id === logo._id}
                    className="flex-1 py-2 text-xs font-bold uppercase tracking-widest bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/20 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-1"
                  >
                    {actionLoad?.id === logo._id && actionLoad?.act === "reject" ? (
                      <><svg className="animate-spin w-3 h-3" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="60" strokeDashoffset="20"/></svg> Rejecting...</>
                    ) : "✗ Reject"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}