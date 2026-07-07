"use client";

import { useState } from "react";
import { CATEGORIES } from "@/lib/categories";

interface Logo {
  _id:        string;
  imageUrl:   string;
  title:      string;
  desc:       string;
  category:   string;
  folderName?: string | null;
  status:     string;
  createdAt:  string;
}

interface Props {
  initialLogos: Logo[];
}

const STATUS_STYLE: Record<string, string> = {
  approved: "text-green-600 bg-green-50 border-green-200",
  pending:  "text-yellow-600 bg-yellow-50 border-yellow-200",
  rejected: "text-red-600 bg-red-50 border-red-200",
};

export default function AdminLogoManager({ initialLogos }: Props) {
  const [logos,    setLogos]    = useState<Logo[]>(initialLogos);
  const [search,   setSearch]   = useState("");
  const [editId,   setEditId]   = useState<string | null>(null);
  const [editData, setEditData] = useState({ title: "", desc: "", category: "" });
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loading,  setLoading]  = useState<string | null>(null);
  const [msg,      setMsg]      = useState<{ type: "success" | "error"; text: string } | null>(null);

  const showMsg = (type: "success" | "error", text: string) => {
    setMsg({ type, text });
    setTimeout(() => setMsg(null), 3000);
  };

  const filtered = logos.filter((l) => {
    const q = search.toLowerCase();
    return !q || l.title.toLowerCase().includes(q) || l.category.toLowerCase().includes(q);
  });

  const openEdit = (logo: Logo) => {
    setEditId(logo._id);
    setEditData({ title: logo.title, desc: logo.desc, category: logo.category });
  };

  const saveEdit = async () => {
    if (!editId) return;
    if (!editData.title.trim() || !editData.desc.trim()) return showMsg("error", "Title and description required");
    setLoading(editId);
    try {
      const res  = await fetch(`/api/logos/${editId}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(editData) });
      const data = await res.json();
      if (data.success) {
        setLogos((prev) => prev.map((l) => l._id === editId ? { ...l, ...editData } : l));
        setEditId(null);
        showMsg("success", "Logo updated");
      } else showMsg("error", data.message || "Update failed");
    } catch { showMsg("error", "Something went wrong"); }
    finally { setLoading(null); }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setLoading(deleteId);
    try {
      const res  = await fetch(`/api/logos/${deleteId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setLogos((prev) => prev.filter((l) => l._id !== deleteId));
        setDeleteId(null);
        showMsg("success", "Logo deleted");
      } else showMsg("error", data.message || "Delete failed");
    } catch { showMsg("error", "Something went wrong"); }
    finally { setLoading(null); }
  };

  const inputClass = "w-full border border-gray-200 rounded-lg px-4 py-2.5 text-[#1A4450] text-sm focus:outline-none focus:border-[#1A4450] transition";

  return (
    <div className="p-8 bg-white min-h-screen">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-[#1A4450]">Manage Logos</h2>
          <p className="text-gray-400 text-sm mt-0.5">{logos.length} logos total</p>
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search logos..."
          className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-[#1A4450] focus:outline-none focus:border-[#1A4450] transition w-64"
        />
      </div>

      {/* Toast */}
      {msg && (
        <div className={`mb-5 p-3 rounded-lg text-sm border ${msg.type === "success" ? "bg-green-50 border-green-200 text-green-600" : "bg-red-50 border-red-200 text-red-600"}`}>
          {msg.text}
        </div>
      )}

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">No logos found</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((logo) => (
            <div key={logo._id} className="border border-gray-200 rounded-xl overflow-hidden hover:border-[#1A4450]/30 transition">

              {/* Image */}
              <div className="h-40 bg-gray-50 flex items-center justify-center p-3">
                <img src={logo.imageUrl} alt={logo.title} className="max-h-full max-w-full object-contain" />
              </div>

              {/* Info */}
              <div className="p-3 border-t border-gray-100">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="text-[#1A4450] font-semibold text-sm truncate">{logo.title}</p>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border whitespace-nowrap ${STATUS_STYLE[logo.status] || STATUS_STYLE.pending}`}>
                    {logo.status}
                  </span>
                </div>
                <p className="text-gray-400 text-xs truncate">{logo.category}</p>
                {logo.folderName && <p className="text-gray-300 text-[10px] mt-0.5">📁 {logo.folderName}</p>}
              </div>

              {/* Actions */}
              <div className="px-3 pb-3 flex gap-2">
                <button onClick={() => openEdit(logo)}
                  className="flex-1 py-1.5 text-xs border border-[#1A4450]/30 text-[#1A4450] rounded-lg hover:bg-[#1A4450]/5 transition"
                >Edit</button>
                <button onClick={() => setDeleteId(logo._id)}
                  className="flex-1 py-1.5 text-xs border border-red-200 text-red-500 rounded-lg hover:bg-red-50 transition"
                >Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editId && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setEditId(null)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-[#1A4450] font-bold text-lg mb-5">Edit Logo</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-widest mb-1.5">Title</label>
                <input type="text" value={editData.title} onChange={(e) => setEditData({ ...editData, title: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-widest mb-1.5">Description</label>
                <textarea value={editData.desc} onChange={(e) => setEditData({ ...editData, desc: e.target.value })} rows={3} className={inputClass + " resize-none"} />
              </div>
              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-widest mb-1.5">Category</label>
                <select value={editData.category} onChange={(e) => setEditData({ ...editData, category: e.target.value })} className={inputClass}>
                  {CATEGORIES.map((c) => <option key={c.slug} value={c.dbValue}>{c.label}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setEditId(null)} className="flex-1 py-2.5 text-sm border border-gray-200 text-gray-500 rounded-xl hover:bg-gray-50 transition">Cancel</button>
              <button onClick={saveEdit} disabled={loading === editId} className="flex-1 py-2.5 text-sm bg-[#1A4450] text-white font-semibold rounded-xl hover:bg-[#1A4450]/80 transition disabled:opacity-50">
                {loading === editId ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setDeleteId(null)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl text-center" onClick={(e) => e.stopPropagation()}>
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke="#ef4444" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <h3 className="text-[#1A4450] font-bold text-lg mb-2">Delete Logo?</h3>
            <p className="text-gray-400 text-sm mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 text-sm border border-gray-200 text-gray-500 rounded-xl hover:bg-gray-50 transition">Cancel</button>
              <button onClick={confirmDelete} disabled={loading === deleteId} className="flex-1 py-2.5 text-sm bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 transition disabled:opacity-50">
                {loading === deleteId ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}