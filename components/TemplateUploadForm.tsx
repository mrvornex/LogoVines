"use client"
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { TEMPLATE_CATEGORIES } from "@/lib/templateCategories";

interface FolderImage {
  file:    File;
  preview: string;
  title:   string;
  desc:    string;
}

const CATEGORY_CARDS = [
  { slug: "animal",           label: "Animal",               color: "#29b6f6", image: "banner-template-category-animal.png",             dbValue: "Animal" },
  { slug: "building",         label: "Building",             color: "#f5a623", image: "banner-template-category-building.png",            dbValue: "Building" },
  { slug: "business",         label: "Business",             color: "#e91e63", image: "banner-template-category-business.png",            dbValue: "Business" },
  { slug: "food-drinks",      label: "Food and Drinks",      color: "#1a237e", image: "banner-template-category-food-and-drinks.png",     dbValue: "Food & Drinks" },
  { slug: "letter",           label: "Letter",               color: "#7e57c2", image: "banner-template-category-letter.png",              dbValue: "Letter" },
  { slug: "sports",           label: "Sports",               color: "#e53935", image: "banner-template-category-sports.png",              dbValue: "Sports" },
  { slug: "technology",       label: "Technology",           color: "#00897b", image: "banner-template-category-technology.png",          dbValue: "Technology" },
  { slug: "travel-transport", label: "Travel and Transport", color: "#fb8c00", image: "banner-template-category-travel-and-transport.png", dbValue: "Travel & Transport" },
];

export default function TemplateUploadForm() {
  const router = useRouter();
  const [step,         setStep]         = useState<"choose" | "upload">("choose");
  const [selectedCat,  setSelectedCat]  = useState("");
  const [tab,          setTab]          = useState<"file" | "folder">("file");
  const [image,        setImage]        = useState<File | null>(null);
  const [preview,      setPreview]      = useState("");
  const [title,        setTitle]        = useState("");
  const [desc,         setDesc]         = useState("");
  const [folderName,   setFolderName]   = useState("");
  const [folderImages, setFolderImages] = useState<FolderImage[]>([]);
  const [loading,      setLoading]      = useState(false);
  const [success,      setSuccess]      = useState("");
  const [error,        setError]        = useState("");

  const fileRef   = useRef<HTMLInputElement>(null);
  const folderRef = useRef<HTMLInputElement>(null);

  const toPreview = (f: File) => URL.createObjectURL(f);

  const resetForm = () => {
    setImage(null); setPreview(""); setTitle(""); setDesc("");
    setFolderName(""); setFolderImages([]); setError(""); setSuccess("");
  };

  const handleFolderSelect = (files: FileList) => {
    const imgs = Array.from(files).filter((f) => f.type.startsWith("image/"));
    setFolderImages(imgs.map((f) => ({ file: f, preview: toPreview(f), title: f.name.replace(/\.[^.]+$/, ""), desc: "" })));
  };

  const updateItem = (i: number, field: "title" | "desc", val: string) =>
    setFolderImages((prev) => prev.map((item, idx) => idx === i ? { ...item, [field]: val } : item));

  const submitSingle = async () => {
    if (!image || !title.trim() || !desc.trim()) return setError("All fields required");
    const fd = new FormData();
    fd.append("image", image); fd.append("title", title);
    fd.append("desc", desc); fd.append("category", selectedCat);
    fd.append("type", "template");
    const res  = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (data.success) {
      setSuccess("Template uploaded!");
      const cat = CATEGORY_CARDS.find((c) => c.dbValue === selectedCat);
      setTimeout(() => router.push(`/templates/${cat?.slug || "all"}`), 1200);
    } else setError(data.message || "Upload failed");
  };

  const submitFolder = async () => {
    if (!folderImages.length || !folderName.trim()) return setError("Folder name and images required");
    const missing = folderImages.findIndex((f) => !f.title.trim() || !f.desc.trim());
    if (missing !== -1) return setError(`Image ${missing + 1}: title and description required`);
    const fd = new FormData();
    fd.append("folderName", folderName);
    fd.append("type", "template");
    folderImages.forEach((item) => fd.append("folderImages", item.file));
    folderImages.forEach((item, i) => {
      fd.append(`folderTitles[${i}]`, item.title);
      fd.append(`folderDescs[${i}]`, item.desc);
      fd.append(`folderCategories[${i}]`, selectedCat);
    });
    const res  = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (data.success) {
      setSuccess(`${data.count} templates uploaded!`);
      const cat = CATEGORY_CARDS.find((c) => c.dbValue === selectedCat);
      setTimeout(() => router.push(`/templates/${cat?.slug || "all"}`), 1200);
    } else setError(data.message || "Upload failed");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(""); setSuccess(""); setLoading(true);
    try { tab === "file" ? await submitSingle() : await submitFolder(); }
    catch { setError("Something went wrong"); }
    finally { setLoading(false); }
  };

  const inputClass = "w-full border border-gray-200 rounded-lg px-4 py-3 text-[#1A4450] text-sm focus:outline-none focus:border-[#1A4450] transition";
  const currentCat = CATEGORY_CARDS.find((c) => c.dbValue === selectedCat);

  // ── STEP 1: Choose Category
  if (step === "choose") {
    return (
      <div className="bg-white min-h-[70vh] py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-[#1A4450]">Select Template Category</h2>
            <p className="text-gray-400 text-sm mt-2">Choose which category to upload templates to</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {CATEGORY_CARDS.map((cat) => (
              <button key={cat.slug}
                onClick={() => { setSelectedCat(cat.dbValue); resetForm(); setStep("upload"); }}
                className="block bg-white border border-[#1A4450]/10 rounded-xl overflow-hidden hover:border-[#1A4450]/30 transition text-left"
              >
                <div className="h-36 flex items-center justify-center p-1 bg-white">
                  <img src={`/template-category-logos/${cat.image}`} alt={cat.label} className="max-w-full max-h-full object-contain" />
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
            {currentCat?.label}
          </span>
        </div>

        <h2 className="text-2xl font-bold text-[#1A4450] mb-1">Upload to {currentCat?.label}</h2>
        <p className="text-gray-400 text-sm mb-8">Templates will appear in {currentCat?.label} category</p>

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
              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-widest mb-1.5">Title *</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Template name" className={inputClass} />
              </div>
              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-widest mb-1.5">Description *</label>
                <textarea value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Describe this template..." rows={3} className={inputClass + " resize-none"} />
              </div>
            </>
          )}

          {tab === "folder" && (
            <>
              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-widest mb-1.5">Collection Name *</label>
                <input type="text" value={folderName} onChange={(e) => setFolderName(e.target.value)} placeholder="e.g. Animal Logo Pack" className={inputClass} />
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
                        <input type="text" value={item.title} onChange={(e) => updateItem(i, "title", e.target.value)} placeholder="Title *"
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[#1A4450] text-sm focus:outline-none focus:border-[#1A4450] transition" />
                        <input type="text" value={item.desc} onChange={(e) => updateItem(i, "desc", e.target.value)} placeholder="Description *"
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[#1A4450] text-sm focus:outline-none focus:border-[#1A4450] transition" />
                      </div>
                      <button type="button" onClick={() => setFolderImages((p) => p.filter((_, idx) => idx !== i))} className="text-gray-300 hover:text-red-400 transition self-start text-lg">✕</button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          <button type="submit" disabled={loading}
            className="w-full py-3.5 bg-[#1A4450] text-white font-semibold text-sm rounded-xl hover:bg-[#1A4450]/80 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (<><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="60" strokeDashoffset="20"/></svg>Uploading...</>) : `Upload to ${currentCat?.label}`}
          </button>
        </form>
      </div>
    </div>
  );
}
