"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { TEMPLATE_CATEGORIES } from "@/lib/templateCategories";

interface FolderImage {
  file:    File;
  preview: string;
  title:   string;
  desc:    string;
}

export default function TemplateUploadForm() {
  const router = useRouter();
  const [step,         setStep]        = useState<"choose" | "upload">("choose");
  const [selectedCat,  setSelectedCat] = useState("");
  const [tab,          setTab]         = useState<"file" | "folder">("file");
  const [image,        setImage]       = useState<File | null>(null);
  const [preview,      setPreview]     = useState("");
  const [title,        setTitle]       = useState("");
  const [desc,         setDesc]        = useState("");
  const [folderName,   setFolderName]  = useState("");
  const [folderImages, setFolderImages]= useState<FolderImage[]>([]);
  const [loading,      setLoading]     = useState(false);
  const [success,      setSuccess]     = useState("");
  const [error,        setError]       = useState("");

  const fileRef   = useRef<HTMLInputElement>(null);
  const folderRef = useRef<HTMLInputElement>(null);

  const toPreview = (f: File) => URL.createObjectURL(f);

  const resetForm = () => {
    setImage(null); setPreview(""); setTitle(""); setDesc("");
    setFolderName(""); setFolderImages([]); setError(""); setSuccess("");
  };

  const handleFolderSelect = (files: FileList) => {
    const imgs = Array.from(files).filter((f) => f.type.startsWith("image/"));
    setFolderImages(imgs.map((f) => ({
      file: f, preview: toPreview(f),
      title: f.name.replace(/\.[^.]+$/, "").split(/[\\/]/).pop() || f.name,
      desc: "",
    })));
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
      setSuccess("Template uploaded! Redirecting...");
      const cat = TEMPLATE_CATEGORIES.find((c) => c.dbValue === selectedCat);
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
      setSuccess(`${data.count} templates uploaded! Redirecting...`);
      const cat = TEMPLATE_CATEGORIES.find((c) => c.dbValue === selectedCat);
      setTimeout(() => router.push(`/templates/${cat?.slug || "all"}`), 1200);
    } else setError(data.message || "Upload failed");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(""); setSuccess(""); setLoading(true);
    try { tab === "file" ? await submitSingle() : await submitFolder(); }
    catch { setError("Something went wrong"); }
    finally { setLoading(false); }
  };

  const currentCat = TEMPLATE_CATEGORIES.find((c) => c.dbValue === selectedCat);

  // ── STEP 1: Choose Category
  if (step === "choose") {
    return (
      <div className="min-h-[70vh] bg-[#ffffff] py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-[#1A4450] tracking-widest uppercase">Select Template Category</h2>
            <p className="text-gray-500 text-sm mt-2">Choose which category to upload templates to</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {TEMPLATE_CATEGORIES.map((cat) => (
              <button key={cat.slug} onClick={() => { setSelectedCat(cat.dbValue); resetForm(); setStep("upload"); }}
                className="group relative bg-[#fff] border border-white/5 rounded-2xl p-5 flex flex-col items-center gap-3 hover:border-white/20 transition-all duration-300 hover:scale-[1.03] overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-2xl" style={{ background: cat.color }} />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" style={{ background: `radial-gradient(circle at 50% 0%, ${cat.color}18 0%, transparent 70%)` }} />
                <div className="text-2xl w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110" style={{ background: `${cat.color}18` }}>
                  {cat.icon}
                </div>
                <p className="text-[#1A4450] text-xs font-semibold uppercase tracking-wide text-center">{cat.label}</p>
                <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition text-xs" style={{ color: cat.color }}>→</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── STEP 2: Upload Form
  return (
    <div className="min-h-[70vh] bg-[#ffffff] py-10 px-4">
      <div className="max-w-3xl mx-auto">

        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => { setStep("choose"); resetForm(); }} className="flex items-center gap-2 text-[#1A4450] transition text-xs uppercase tracking-widest">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Back
          </button>
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-semibold uppercase tracking-widest"
            style={{ borderColor: `${currentCat?.color}40`, color: currentCat?.color, background: `${currentCat?.color}12` }}>
            <span>{currentCat?.icon}</span>{currentCat?.label}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[#1A4450] tracking-widest uppercase">Upload to {currentCat?.label}</h2>
          <p className="text-[#1A4450] text-sm mt-1">Logos go to Template → {currentCat?.label}</p>
        </div>

        {/* Tabs */}
        <div className="flex border border-white/10 rounded-xl overflow-hidden mb-8">
          {(["file", "folder"] as const).map((t) => (
            <button key={t} type="button" onClick={() => { setTab(t); setError(""); setSuccess(""); }}
              className={`flex-1 py-3.5 text-sm font-semibold uppercase tracking-widest transition duration-300 ${tab === t ? "text-black" : "bg-[#111] text-gray-400 hover:text-white"}`}
              style={tab === t ? { background: currentCat?.color || "#d4a373" } : {}}
            >
              {t === "file" ? "📄 Single Image" : "📁 Folder Upload"}
            </button>
          ))}
        </div>

        {error   && <div className="mb-5 p-3 rounded-lg bg-red-900/30 border border-red-500/40 text-red-400 text-sm">{error}</div>}
        {success && <div className="mb-5 p-3 rounded-lg bg-green-900/30 border border-green-500/40 text-green-400 text-sm">✓ {success}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          {tab === "file" && (
            <>
              <div onClick={() => fileRef.current?.click()} onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f?.type.startsWith("image/")) { setImage(f); setPreview(toPreview(f)); } }}
                className="border-2 border-dashed border-black rounded-2xl p-8 text-center cursor-pointer hover:border-white/30 transition group"
              >
                {preview ? <img src={preview} alt="preview" className="max-h-52 mx-auto rounded-xl object-contain" /> : (
                  <div className="text-gray-500 group-hover:text-gray-300 transition">
                    <p className="text-4xl mb-3">🖼️</p><p className="text-sm">Click or drag & drop</p>
                    <p className="text-xs mt-1 opacity-60">PNG, JPG, SVG, WEBP</p>
                  </div>
                )}
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) { setImage(f); setPreview(toPreview(f)); } }} />
              </div>
              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-widest mb-2">Title *</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Template name"
                  className="w-full bg-[#fff] border border-white/10 rounded-xl px-4 py-3 text-[#1A4450] text-sm focus:outline-none focus:border-[#a4a4a4] transition" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-widest mb-2">Description *</label>
                <textarea value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Describe this template..." rows={3}
                  className="w-full bg-[#fff] border border-white/10 rounded-xl px-4 py-3 text-[#1A4450] text-sm focus:outline-none focus:border-[#989898] transition resize-none" />
              </div>
            </>
          )}

          {tab === "folder" && (
            <>
              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-widest mb-2">Collection Name *</label>
                <input type="text" value={folderName} onChange={(e) => setFolderName(e.target.value)} placeholder="e.g. Animal Logo Pack"
                  className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#d4a373] transition" />
              </div>
              <div onClick={() => folderRef.current?.click()} onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => { e.preventDefault(); if (e.dataTransfer.files.length) handleFolderSelect(e.dataTransfer.files); }}
                className="border-2 border-dashed border-white/10 rounded-2xl p-8 text-center cursor-pointer hover:border-white/30 transition group"
              >
                <div className="text-gray-500 group-hover:text-gray-300 transition">
                  <p className="text-4xl mb-3">📁</p><p className="text-sm">Click to select folder</p>
                </div>
                <input ref={folderRef} type="file" accept="image/*" multiple
                  // @ts-ignore
                  webkitdirectory="" className="hidden" onChange={(e) => { if (e.target.files) handleFolderSelect(e.target.files); }} />
              </div>
              {folderImages.length > 0 && (
                <div className="space-y-3">
                  <p className="text-sm text-gray-400">{folderImages.length} images selected</p>
                  {folderImages.map((item, i) => (
                    <div key={i} className="bg-[#111] border border-white/10 rounded-2xl p-4 flex gap-4">
                      <img src={item.preview} alt="" className="w-16 h-16 object-cover rounded-xl flex-shrink-0" />
                      <div className="flex-1 space-y-2">
                        <input type="text" value={item.title} onChange={(e) => updateItem(i, "title", e.target.value)} placeholder="Title *"
                          className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#d4a373] transition" />
                        <input type="text" value={item.desc} onChange={(e) => updateItem(i, "desc", e.target.value)} placeholder="Description *"
                          className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#d4a373] transition" />
                      </div>
                      <button type="button" onClick={() => setFolderImages((p) => p.filter((_, idx) => idx !== i))} className="text-gray-600 hover:text-red-400 transition self-start text-lg">✕</button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          <button type="submit" disabled={loading}
            className="w-full py-4 font-bold uppercase tracking-widest text-sm rounded-xl transition duration-300 disabled:opacity-50 text-black flex items-center justify-center gap-2"
            style={{ background: loading ? "#888" : (currentCat?.color || "#d4a373") }}
          >
            {loading ? (<><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="60" strokeDashoffset="20"/></svg>Uploading...</>) : `Upload to ${currentCat?.label}`}
          </button>
        </form>
      </div>
    </div>
  );
}