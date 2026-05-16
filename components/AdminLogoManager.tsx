"use client";

import { useState } from "react";

const CATEGORIES = [
  "Uncategorized", "Minimalist", "Modern", "Vintage", "3D",
  "Typography", "Mascot", "Abstract", "Tech", "Food & Beverage",
  "Fashion", "Real Estate",
];

interface Logo {
  _id: string;
  imageUrl: string;
  title: string;
  desc: string;
  category: string;
  folderName?: string | null;
  createdAt: string;
}

interface Props {
  initialLogos: Logo[];
}

export default function AdminLogoManager({ initialLogos }: Props) {
  const [logos,   setLogos]   = useState<Logo[]>(initialLogos);
  const [search,  setSearch]  = useState("");
  const [editId,  setEditId]  = useState<string | null>(null);
  const [editData, setEditData] = useState({ title: "", desc: "", category: "" });
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loading,  setLoading]  = useState<string | null>(null); // stores id of item being processed
  const [msg,      setMsg]      = useState<{ type: "success" | "error"; text: string } | null>(null);

  const showMsg = (type: "success" | "error", text: string) => {
    setMsg({ type, text });
    setTimeout(() => setMsg(null), 3000);
  };

  // ── Filter ─────────────────────────────────────────────────
  const filtered = logos.filter((l) => {
    const q = search.toLowerCase();
    return (
      !q ||
      l.title.toLowerCase().includes(q) ||
      l.category.toLowerCase().includes(q) ||
      (l.folderName || "").toLowerCase().includes(q)
    );
  });

  // ── Open edit modal ────────────────────────────────────────
  const openEdit = (logo: Logo) => {
    setEditId(logo._id);
    setEditData({ title: logo.title, desc: logo.desc, category: logo.category });
  };

  // ── Save edit ──────────────────────────────────────────────
  const saveEdit = async () => {
    if (!editId) return;
    if (!editData.title.trim() || !editData.desc.trim()) {
      return showMsg("error", "Title and description are required");
    }

    setLoading(editId);
    try {
      const res  = await fetch(`/api/logos/${editId}`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(editData),
      });
      const data = await res.json();

      if (data.success) {
        setLogos((prev) =>
          prev.map((l) =>
            l._id === editId
              ? { ...l, title: editData.title, desc: editData.desc, category: editData.category }
              : l
          )
        );
        setEditId(null);
        showMsg("success", "Logo updated successfully");
      } else {
        showMsg("error", data.message || "Update failed");
      }
    } catch {
      showMsg("error", "Something went wrong");
    } finally {
      setLoading(null);
    }
  };

  // ── Delete ─────────────────────────────────────────────────
  const confirmDelete = async () => {
    if (!deleteId) return;

    setLoading(deleteId);
    try {
      const res  = await fetch(`/api/logos/${deleteId}`, { method: "DELETE" });
      const data = await res.json();

      if (data.success) {
        setLogos((prev) => prev.filter((l) => l._id !== deleteId));
        setDeleteId(null);
        showMsg("success", "Logo deleted successfully");
      } else {
        showMsg("error", data.message || "Delete failed");
      }
    } catch {
      showMsg("error", "Something went wrong");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="px-6 md:px-16 py-10">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
        <div>
          <h2 className="text-white text-2xl font-bold">Manage Logos</h2>
          <p className="text-gray-500 text-sm mt-1">{logos.length} logos total</p>
        </div>

        {/* Search */}
        <div className="relative w-full max-w-xs">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600">
            <svg width="15" height="15" fill="none" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/>
              <path d="M20 20l-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search logos..."
            className="w-full bg-[#111] border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#d4a373] transition"
          />
        </div>
      </div>

      {/* Toast */}
      {msg && (
        <div className={`mb-6 p-3 rounded-xl text-sm border ${
          msg.type === "success"
            ? "bg-green-900/20 border-green-500/30 text-green-400"
            : "bg-red-900/20 border-red-500/30 text-red-400"
        }`}>
          {msg.type === "success" ? "✓" : "⚠"} {msg.text}
        </div>
      )}

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-600">
          <p className="text-4xl mb-3">🖼️</p>
          <p>No logos found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((logo) => (
            <div
              key={logo._id}
              className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition group"
            >
              {/* Image */}
              <div className="h-44 bg-[#0d0d0d] overflow-hidden">
                <img
                  src={logo.imageUrl}
                  alt={logo.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
              </div>

              {/* Info */}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="text-white font-semibold text-sm truncate">{logo.title}</h3>
                  <span className="text-[#d4a373] text-[10px] uppercase tracking-widest bg-[#d4a373]/10 px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0">
                    {logo.category}
                  </span>
                </div>
                <p className="text-gray-500 text-xs line-clamp-2 mb-1">{logo.desc}</p>
                {logo.folderName && (
                  <p className="text-gray-600 text-[10px]">📁 {logo.folderName}</p>
                )}
              </div>

              {/* Actions */}
              <div className="px-4 pb-4 flex gap-2">
                <button
                  onClick={() => openEdit(logo)}
                  className="flex-1 py-2 text-xs uppercase tracking-widest font-semibold border border-[#d4a373]/40 text-[#d4a373] rounded-lg hover:bg-[#d4a373]/10 transition"
                >
                  ✏ Edit
                </button>
                <button
                  onClick={() => setDeleteId(logo._id)}
                  className="flex-1 py-2 text-xs uppercase tracking-widest font-semibold border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/10 transition"
                >
                  🗑 Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── EDIT MODAL ── */}
      {editId && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setEditId(null)}
        >
          <div
            className="bg-[#111] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-white font-bold text-lg mb-5">Edit Logo</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs text-gray-500 uppercase tracking-widest mb-2">Title</label>
                <input
                  type="text"
                  value={editData.title}
                  onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#d4a373] transition"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-500 uppercase tracking-widest mb-2">Description</label>
                <textarea
                  value={editData.desc}
                  onChange={(e) => setEditData({ ...editData, desc: e.target.value })}
                  rows={3}
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#d4a373] transition resize-none"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-500 uppercase tracking-widest mb-2">Category</label>
                <select
                  value={editData.category}
                  onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#d4a373] transition"
                >
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setEditId(null)}
                className="flex-1 py-3 text-xs uppercase tracking-widest border border-white/10 text-gray-400 rounded-xl hover:border-white/20 transition"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                disabled={loading === editId}
                className="flex-1 py-3 text-xs uppercase tracking-widest bg-[#d4a373] text-black font-bold rounded-xl hover:bg-[#e8b989] transition disabled:opacity-50"
              >
                {loading === editId ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── DELETE CONFIRM MODAL ── */}
      {deleteId && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setDeleteId(null)}
        >
          <div
            className="bg-[#111] border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-4xl mb-4">🗑️</p>
            <h3 className="text-white font-bold text-lg mb-2">Delete Logo?</h3>
            <p className="text-gray-500 text-sm mb-6">
              Yeh logo permanently delete ho jayega. Yeh action undo nahi ho sakta.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 py-3 text-xs uppercase tracking-widest border border-white/10 text-gray-400 rounded-xl hover:border-white/20 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={loading === deleteId}
                className="flex-1 py-3 text-xs uppercase tracking-widest bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition disabled:opacity-50"
              >
                {loading === deleteId ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}