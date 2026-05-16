"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { CATEGORIES } from "@/lib/categories";
import { TEMPLATE_CATEGORIES } from "@/lib/templateCategories";

type UploadType = "brand" | "template";

export default function UserUploadForm() {
  const router = useRouter();
  const [uploadType, setUploadType] = useState<UploadType>("brand");
  const [step,       setStep]       = useState<"choose"|"upload">("choose");
  const [selectedCat,setSelectedCat]= useState("");
  const [image,      setImage]      = useState<File|null>(null);
  const [preview,    setPreview]    = useState("");
  const [title,      setTitle]      = useState("");
  const [desc,       setDesc]       = useState("");
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState("");
  const [success,    setSuccess]    = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const cats = uploadType === "brand" ? CATEGORIES.filter((c) => c.slug !== "uncategorized") : TEMPLATE_CATEGORIES;

  const reset = () => { setImage(null); setPreview(""); setTitle(""); setDesc(""); setError(""); setSuccess(""); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(""); setSuccess("");
    if (!image || !title.trim() || !desc.trim()) return setError("All fields required");
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("image", image); fd.append("title", title);
      fd.append("desc", desc); fd.append("category", selectedCat);
      fd.append("type", uploadType);
      const res  = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.success) {
        setSuccess("Logo submitted for review! You'll be notified once approved.");
        setTimeout(() => router.push("/my-uploads"), 2000);
      } else if (res.status === 401) {
        router.push("/user-login");
      } else {
        setError(data.message || "Upload failed");
      }
    } catch { setError("Something went wrong"); }
    finally { setLoading(false); }
  };

  const currentCat = cats.find((c: any) => c.dbValue === selectedCat);

  // Type selection
  if (step === "choose" && !selectedCat) {
    return (
      <div className="min-h-[80vh] py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-white tracking-widest uppercase">Upload Logo</h2>
            <p className="text-gray-500 text-sm mt-2">Share your design with the community</p>
          </div>

          {/* Type toggle */}
          <div className="flex border border-white/10 rounded-xl overflow-hidden mb-8 max-w-xs mx-auto">
            {(["brand","template"] as const).map((t) => (
              <button key={t} onClick={() => { setUploadType(t); setSelectedCat(""); }}
                className={`flex-1 py-3 text-xs font-semibold uppercase tracking-widest transition ${uploadType === t ? "bg-[#d4a373] text-black" : "bg-[#111] text-gray-400 hover:text-white"}`}
              >{t}</button>
            ))}
          </div>

          <p className="text-center text-gray-500 text-xs uppercase tracking-widest mb-6">Select Category</p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {cats.map((cat: any) => (
              <button key={cat.slug} onClick={() => { setSelectedCat(cat.dbValue); reset(); setStep("upload"); }}
                className="group relative bg-[#111] border border-white/5 rounded-2xl p-5 flex flex-col items-center gap-3 hover:border-white/20 transition-all duration-300 hover:scale-[1.03] overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition rounded-t-2xl" style={{ background: cat.color }} />
                <div className="text-2xl w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${cat.color}18` }}>{cat.icon}</div>
                <p className="text-white text-xs font-semibold uppercase tracking-wide text-center">{cat.label}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => { setSelectedCat(""); setStep("choose"); reset(); }} className="flex items-center gap-2 text-gray-500 hover:text-white transition text-xs uppercase tracking-widest">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Back
          </button>
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-semibold uppercase tracking-widest"
            style={{ borderColor: `${(currentCat as any)?.color}40`, color: (currentCat as any)?.color, background: `${(currentCat as any)?.color}12` }}>
            <span>{(currentCat as any)?.icon}</span>{(currentCat as any)?.label}
          </div>
          <span className="ml-auto text-gray-600 text-xs uppercase tracking-widest">{uploadType}</span>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white tracking-widest uppercase">Submit Logo</h2>
          <p className="text-gray-500 text-sm mt-1">Your logo will be reviewed before going live</p>
        </div>

        {error   && <div className="mb-5 p-3 rounded-lg bg-red-900/30 border border-red-500/40 text-red-400 text-sm">⚠ {error}</div>}
        {success && <div className="mb-5 p-3 rounded-lg bg-green-900/30 border border-green-500/40 text-green-400 text-sm">✓ {success}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div onClick={() => fileRef.current?.click()} onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f?.type.startsWith("image/")) { setImage(f); setPreview(URL.createObjectURL(f)); } }}
            className="border-2 border-dashed border-white/10 rounded-2xl p-8 text-center cursor-pointer hover:border-white/30 transition group"
          >
            {preview ? <img src={preview} alt="preview" className="max-h-52 mx-auto rounded-xl object-contain" /> : (
              <div className="text-gray-500 group-hover:text-gray-300 transition">
                <p className="text-4xl mb-3">🖼️</p><p className="text-sm">Click or drag & drop image</p>
                <p className="text-xs mt-1 opacity-60">PNG, JPG, SVG, WEBP</p>
              </div>
            )}
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) { setImage(f); setPreview(URL.createObjectURL(f)); } }} />
          </div>

          <div>
            <label className="block text-xs text-gray-400 uppercase tracking-widest mb-2">Title *</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Logo name"
              className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#d4a373] transition" />
          </div>
          <div>
            <label className="block text-xs text-gray-400 uppercase tracking-widest mb-2">Description *</label>
            <textarea value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Describe your logo..." rows={3}
              className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#d4a373] transition resize-none" />
          </div>

          <div className="bg-[#111] border border-white/5 rounded-xl p-4 text-xs text-gray-500 leading-relaxed">
            📋 <strong className="text-gray-400">Submission Guidelines:</strong> Only submit original work. No copyrighted logos. Minimum 500px resolution. Admin will review within 24-48 hours.
          </div>

          <button type="submit" disabled={loading}
            className="w-full py-4 bg-[#d4a373] text-black font-bold uppercase tracking-widest text-sm rounded-xl hover:bg-[#e8b989] transition disabled:opacity-50"
          >{loading ? "Submitting..." : "Submit for Review"}</button>
        </form>
      </div>
    </div>
  );
}