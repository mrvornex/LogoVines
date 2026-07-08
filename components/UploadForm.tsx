"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { CATEGORIES } from "@/lib/categories";

type UploadTab = "file" | "folder";

interface FolderImage {
  file:    File;
  preview: string;
  title:   string;
  desc:    string;
}

export default function UploadForm() {
  const router = useRouter();
  const [step,         setStep]         = useState<"choose" | "upload">("choose");
  const [selectedCat,  setSelectedCat]  = useState("");
  const [tab,          setTab]          = useState<UploadTab>("file");
  const [image,        setImage]        = useState<File | null>(null);
  const [preview,      setPreview]      = useState("");
  const [title,        setTitle]        = useState("");
  const [desc,         setDesc]         = useState("");
  const [folderName,   setFolderName]   = useState("");
  const [folderImages, setFolderImages] = useState<FolderImage[]>([]);
  const [loading,      setLoading]      = useState(false);
  const [aiLoading,    setAiLoading]    = useState(false);
  const [success,      setSuccess]      = useState("");
  const [error,        setError]        = useState("");

  const fileRef   = useRef<HTMLInputElement>(null);
  const folderRef = useRef<HTMLInputElement>(null);

  const toPreview = (f: File) => URL.createObjectURL(f);

  const resetForm = () => {
    setImage(null); setPreview(""); setTitle(""); setDesc("");
    setFolderName(""); setFolderImages([]); setError(""); setSuccess("");
  };

  const generateWithAI = async (file: File) => {
    setAiLoading(true); setError("");
    try {
      const fd = new FormData();
      fd.append("image", file);
      const res  = await fetch("/api/ai-generate", { method: "POST", body: fd });
      const data = await res.json();
      if (data.success) { setTitle(data.title); setDesc(data.desc); }
      else setError("AI failed: " + (data.message || "Try again"));
    } catch { setError("AI generation failed."); }
    finally { setAiLoading(false); }
  };

  const generateFolderItemAI = async (idx: number, file: File) => {
    setFolderImages((prev) => prev.map((item, i) => i === idx ? { ...item, title: "Generating...", desc: "..." } : item));
    try {
      const fd = new FormData();
      fd.append("image", file);
      const res  = await fetch("/api/ai-generate", { method: "POST", body: fd });
      const data = await res.json();
      if (data.success) setFolderImages((prev) => prev.map((item, i) => i === idx ? { ...item, title: data.title, desc: data.desc } : item));
    } catch {}
  };

  const handleFolderSelect = (files: FileList) => {
    const imgs = Array.from(files).filter((f) => f.type.startsWith("image/"));
    setFolderImages(imgs.map((f) => ({ file: f, preview: toPreview(f), title: f.name.replace(/\.[^.]+$/, ""), desc: "" })));
  };

  const updateFolderItem = (idx: number, field: "title" | "desc", val: string) =>
    setFolderImages((prev) => prev.map((item, i) => i === idx ? { ...item, [field]: val } : item));

  const removeFolderItem = (idx: number) =>
    setFolderImages((prev) => prev.filter((_, i) => i !== idx));

  const submitSingle = async () => {
    if (!image)        return setError("Please select an image");
    if (!title.trim()) return setError("Title is required");
    if (!desc.trim())  return setError("Description is required");
    const fd = new FormData();
    fd.append("image", image); fd.append("title", title);
    fd.append("desc", desc); fd.append("category", selectedCat);
    const res  = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (data.success) {
      setSuccess("Logo uploaded!");
      const cat = CATEGORIES.find((c) => c.dbValue === selectedCat);
      setTimeout(() => router.push(`/category/${cat?.slug || "uncategorized"}`), 1200);
    } else setError(data.message || "Upload failed");
  };

  const submitFolder = async () => {
    if (!folderImages.length) return setError("No images selected");
    if (!folderName.trim())   return setError("Folder name required");
    const missing = folderImages.findIndex((f) => !f.title.trim() || !f.desc.trim());
    if (missing !== -1) return setError(`Image ${missing + 1}: title and description required`);
    const fd = new FormData();
    fd.append("folderName", folderName);
    folderImages.forEach((item) => fd.append("folderImages", item.file));
    folderImages.forEach((item, i) => {
      fd.append(`folderTitles[${i}]`, item.title);
      fd.append(`folderDescs[${i}]`, item.desc);
      fd.append(`folderCategories[${i}]`, selectedCat);
    });
    const res  = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (data.success) {
      setSuccess(`${data.count} logos uploaded!`);
      const cat = CATEGORIES.find((c) => c.dbValue === selectedCat);
      setTimeout(() => router.push(`/category/${cat?.slug || "uncategorized"}`), 1200);
    } else setError(data.message || "Upload failed");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(""); setSuccess(""); setLoading(true);
    try { tab === "file" ? await submitSingle() : await submitFolder(); }
    catch { setError("Something went wrong"); }
    finally { setLoading(false); }
  };

  const inputClass = "w-full border border-gray-200 rounded-lg px-4 py-3 text-[#1A4450] text-sm focus:outline-none focus:border-[#1A4450] transition";

  // ── STEP 1: Choose Category
 if (step === "choose") {
    const CATEGORY_CARDS = [
      { slug: "auto-moto",    label: "Auto & Moto",     color: "#29b6f6", image: "banner-brand-category-auto-and-moto.png",     dbValue: "Auto & Moto" },
      { slug: "fashion",      label: "Fashion",         color: "#f5a623", image: "banner-brand-category-fashion.png",            dbValue: "Fashion" },
      { slug: "social-media", label: "Social Media",    color: "#e91e63", image: "banner-brand-category-social-media.png",       dbValue: "Social Media" },
      { slug: "technology",   label: "Technology",      color: "#1a237e", image: "banner-brand-category-technology.png",         dbValue: "Technology" },
      { slug: "food-drinks",  label: "Food and Drinks", color: "#7e57c2", image: "banner-brand-category-food-and-drinks.png",    dbValue: "Food & Drinks" },
      { slug: "finance",      label: "Finance",         color: "#e53935", image: "banner-brand-category-finance.png",            dbValue: "Finance" },
      { slug: "transport",    label: "Transport",       color: "#00897b", image: "banner-brand-category-transport.png",          dbValue: "Transport" },
      { slug: "sports",       label: "Sports",          color: "#fb8c00", image: "banner-brand-category-sports.png",             dbValue: "Sports" },
    ];

    return (
      <div className="bg-white min-h-[70vh] py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-[#1A4450]">Select Category</h2>
            <p className="text-gray-400 text-sm mt-2">Choose which category to upload logos to</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {CATEGORY_CARDS.map((cat) => (
              <button key={cat.slug}
                onClick={() => { setSelectedCat(cat.dbValue); resetForm(); setStep("upload"); }}
                className="block bg-white border border-[#1A4450]/10 rounded-xl overflow-hidden hover:border-[#1A4450]/30 transition text-left"
              >
                <div className="h-36 flex items-center justify-center p-1 bg-white">
                  <img src={`/category-logos/${cat.image}`} alt={cat.label} className="max-w-full max-h-full object-contain" />
                </div>
                <div className="py-2.5 text-center text-white text-sm font-semibold" style={{ background: cat.color }}>
                  {cat.label}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── STEP 2: Upload Form
  const currentCat = CATEGORIES.find((c) => c.dbValue === selectedCat);

  return (
    <div className="bg-white min-h-[70vh] py-10 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Back + badge */}
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => { setStep("choose"); resetForm(); }}
            className="flex items-center gap-2 text-gray-400 hover:text-[#1A4450] transition text-xs uppercase tracking-widest"
          >
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Back
          </button>
          <span className="border border-gray-200 text-[#1A4450] text-xs font-semibold px-4 py-1.5 rounded-full">
            {currentCat?.icon} {currentCat?.label}
          </span>
        </div>

        <h2 className="text-2xl font-bold text-[#1A4450] mb-1">Upload to {currentCat?.label}</h2>
        <p className="text-gray-400 text-sm mb-8">Logos will appear in the {currentCat?.label} category</p>

        {/* Tabs */}
        <div className="flex border border-gray-200 rounded-xl overflow-hidden mb-8">
          {(["file", "folder"] as const).map((t) => (
            <button key={t} type="button" onClick={() => { setTab(t); setError(""); setSuccess(""); }}
              className={`flex-1 py-3 text-sm font-semibold transition ${tab === t ? "bg-[#1A4450] text-white" : "text-gray-400 hover:text-[#1A4450]"}`}
            >
              {t === "file" ? "Single Image" : "Folder Upload"}
            </button>
          ))}
        </div>

        {error   && <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">{error}</div>}
        {success && <div className="mb-5 p-3 rounded-lg bg-green-50 border border-green-200 text-green-600 text-sm">✓ {success}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          {tab === "file" && (
            <>
              <div onClick={() => fileRef.current?.click()} onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f?.type.startsWith("image/")) { setImage(f); setPreview(toPreview(f)); } }}
                className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center cursor-pointer hover:border-[#1A4450]/40 transition"
              >
                {preview
                  ? <img src={preview} alt="preview" className="max-h-48 mx-auto rounded-lg object-contain" />
                  : <div className="text-gray-400"><p className="text-3xl mb-2">🖼️</p><p className="text-sm">Click or drag & drop</p><p className="text-xs mt-1 opacity-60">PNG, JPG, SVG, WEBP</p></div>
                }
                <input ref={fileRef} type="file" accept="image/*" className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) { setImage(f); setPreview(toPreview(f)); } }} />
              </div>

              {image && (
                <button type="button" onClick={() => generateWithAI(image)} disabled={aiLoading}
                  className="w-full py-3 border border-[#1A4450]/30 text-[#1A4450] rounded-xl text-sm font-semibold hover:bg-[#1A4450]/5 transition disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {aiLoading ? <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="60" strokeDashoffset="20"/></svg>Analyzing...</> : "✨ Generate with AI"}
                </button>
              )}

              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-widest mb-1.5">Title *</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Logo name" className={inputClass} />
              </div>
              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-widest mb-1.5">Description *</label>
                <textarea value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Describe this logo..." rows={3} className={inputClass + " resize-none"} />
              </div>
            </>
          )}

          {tab === "folder" && (
            <>
              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-widest mb-1.5">Collection Name *</label>
                <input type="text" value={folderName} onChange={(e) => setFolderName(e.target.value)} placeholder="e.g. Sports Logos Pack" className={inputClass} />
              </div>
              <div onClick={() => folderRef.current?.click()} onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => { e.preventDefault(); if (e.dataTransfer.files.length) handleFolderSelect(e.dataTransfer.files); }}
                className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center cursor-pointer hover:border-[#1A4450]/40 transition"
              >
                <div className="text-gray-400"><p className="text-3xl mb-2">📁</p><p className="text-sm">Click to select folder</p></div>
                <input ref={folderRef} type="file" accept="image/*" multiple
                  // @ts-ignore
                  webkitdirectory="" className="hidden" onChange={(e) => { if (e.target.files) handleFolderSelect(e.target.files); }} />
              </div>

              {folderImages.length > 0 && (
                <div className="space-y-3">
                  <p className="text-sm text-gray-400">{folderImages.length} images selected</p>
                  {folderImages.map((item, i) => (
                    <div key={i} className="border border-gray-200 rounded-xl p-4 flex gap-4">
                      <img src={item.preview} alt="" className="w-14 h-14 object-cover rounded-lg flex-shrink-0" />
                      <div className="flex-1 space-y-2">
                        <button type="button" onClick={() => generateFolderItemAI(i, item.file)}
                          className="w-full py-1.5 border border-[#1A4450]/30 text-[#1A4450] rounded-lg text-xs font-semibold hover:bg-[#1A4450]/5 transition"
                        >{item.title === "Generating..." ? "Generating..." : "✨ AI Generate"}</button>
                        <input type="text" value={item.title === "Generating..." ? "" : item.title} onChange={(e) => updateFolderItem(i, "title", e.target.value)} placeholder="Title *"
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[#1A4450] text-sm focus:outline-none focus:border-[#1A4450] transition" />
                        <input type="text" value={item.desc === "..." ? "" : item.desc} onChange={(e) => updateFolderItem(i, "desc", e.target.value)} placeholder="Description *"
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[#1A4450] text-sm focus:outline-none focus:border-[#1A4450] transition" />
                      </div>
                      <button type="button" onClick={() => removeFolderItem(i)} className="text-gray-300 hover:text-red-400 transition self-start text-lg">✕</button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          <button type="submit" disabled={loading}
            className="w-full py-3.5 bg-[#1A4450] text-white font-semibold text-sm rounded-xl hover:bg-[#1A4450]/80 transition disabled:opacity-50"
          >
            {loading ? "Uploading..." : tab === "file" ? `Upload to ${currentCat?.label}` : `Upload ${folderImages.length > 0 ? folderImages.length + " logos" : "Folder"}`}
          </button>
        </form>
      </div>
    </div>
  );
}