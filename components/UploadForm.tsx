"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { CATEGORIES } from "@/lib/categories";

const Spinner = () => (
  <svg className="animate-spin w-3 h-3" fill="none" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="60" strokeDashoffset="20"/>
  </svg>
);

type UploadTab = "file" | "folder";

interface FolderImage {
  file:     File;
  preview:  string;
  title:    string;
  desc:     string;
}

export default function UploadForm() {
  const router = useRouter();

  // Step 1: choose category | Step 2: upload form
  const [step,          setStep]          = useState<"choose" | "upload">("choose");
  const [selectedCat,   setSelectedCat]   = useState<string>("");
  const [tab,           setTab]           = useState<UploadTab>("file");

  // Single file
  const [image,    setImage]    = useState<File | null>(null);
  const [preview,  setPreview]  = useState<string>("");
  const [title,    setTitle]    = useState("");
  const [desc,     setDesc]     = useState("");

  // Folder
  const [folderName,   setFolderName]   = useState("");
  const [folderImages, setFolderImages] = useState<FolderImage[]>([]);

  const [loading,   setLoading]   = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [success,   setSuccess]   = useState("");
  const [error,     setError]     = useState("");

  const fileRef   = useRef<HTMLInputElement>(null);
  const folderRef = useRef<HTMLInputElement>(null);

  const toPreview = (f: File) => URL.createObjectURL(f);

  // AI generate title + desc from image
  const generateWithAI = async (file: File) => {
    setAiLoading(true); setError("");
    try {
      const fd = new FormData();
      fd.append("image", file);
      const res  = await fetch("/api/ai-generate", { method: "POST", body: fd });
      const data = await res.json();
      if (data.success) { setTitle(data.title); setDesc(data.desc); }
      else setError("AI failed: " + (data.message || "Try again"));
    } catch { setError("AI generation failed. Try again."); }
    finally { setAiLoading(false); }
  };

  const generateFolderItemAI = async (idx: number, file: File) => {
    setFolderImages((prev) => prev.map((item, i) => i === idx ? { ...item, title: "Generating...", desc: "..." } : item));
    try {
      const fd = new FormData();
      fd.append("image", file);
      const res  = await fetch("/api/ai-generate", { method: "POST", body: fd });
      const data = await res.json();
      if (data.success) {
        setFolderImages((prev) => prev.map((item, i) => i === idx ? { ...item, title: data.title, desc: data.desc } : item));
      }
    } catch {}
  };

  const resetForm = () => {
    setImage(null); setPreview(""); setTitle(""); setDesc("");
    setFolderName(""); setFolderImages([]);
    setError(""); setSuccess("");
  };

  const handleFolderSelect = (files: FileList) => {
    const imgs = Array.from(files).filter((f) => f.type.startsWith("image/"));
    setFolderImages(imgs.map((f) => ({
      file:    f,
      preview: toPreview(f),
      title:   f.name.replace(/\.[^.]+$/, "").split(/[\\/]/).pop() || f.name,
      desc:    "",
    })));
  };

  const updateFolderItem = (idx: number, field: "title" | "desc", val: string) => {
    setFolderImages((prev) => prev.map((item, i) => i === idx ? { ...item, [field]: val } : item));
  };

  const removeFolderItem = (idx: number) => {
    setFolderImages((prev) => prev.filter((_, i) => i !== idx));
  };

  // ── Submit single ─────────────────────────────────────────
  const submitSingle = async () => {
    if (!image)        return setError("Please select an image");
    if (!title.trim()) return setError("Title is required");
    if (!desc.trim())  return setError("Description is required");

    const formData = new FormData();
    formData.append("image",    image);
    formData.append("title",    title);
    formData.append("desc",     desc);
    formData.append("category", selectedCat);

    const res  = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();

    if (data.success) {
      setSuccess("Logo uploaded successfully!");
      setTimeout(() => {
        const cat = CATEGORIES.find((c) => c.dbValue === selectedCat);
        router.push(`/category/${cat?.slug || "uncategorized"}`);
      }, 1200);
    } else {
      setError(typeof data.message === "string" ? data.message : "Upload failed — check Cloudinary credentials");
    }
  };

  // ── Submit folder ─────────────────────────────────────────
  const submitFolder = async () => {
    if (folderImages.length === 0) return setError("No images selected");
    if (!folderName.trim())        return setError("Folder name is required");

    const missing = folderImages.findIndex((f) => !f.title.trim() || !f.desc.trim());
    if (missing !== -1) return setError(`Image ${missing + 1}: title and description required`);

    const formData = new FormData();
    formData.append("folderName", folderName);
    folderImages.forEach((item) => formData.append("folderImages", item.file));
    folderImages.forEach((item, i) => {
      formData.append(`folderTitles[${i}]`,     item.title);
      formData.append(`folderDescs[${i}]`,      item.desc);
      formData.append(`folderCategories[${i}]`, selectedCat);
    });

    const res  = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();

    if (data.success) {
      setSuccess(`${data.count} logos uploaded! Redirecting...`);
      setTimeout(() => {
        const cat = CATEGORIES.find((c) => c.dbValue === selectedCat);
        router.push(`/category/${cat?.slug || "uncategorized"}`);
      }, 1200);
    } else {
      setError(typeof data.message === "string" ? data.message : "Upload failed — check Cloudinary credentials");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setSuccess("");
    setLoading(true);
    try {
      tab === "file" ? await submitSingle() : await submitFolder();
    } catch (err: any) {
      setError(err?.message || JSON.stringify(err) || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ── STEP 1: Choose Category ────────────────────────────────
  if (step === "choose") {
    return (
      <div className="min-h-[70vh] bg-[#0a0a0a] py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-white tracking-widest uppercase">
              Select Category
            </h2>
            <p className="text-gray-500 text-sm mt-2">
              Choose which category you want to upload logos to
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {CATEGORIES.filter((c) => c.slug !== "uncategorized").map((cat) => (
              <button
                key={cat.slug}
                onClick={() => {
                  setSelectedCat(cat.dbValue);
                  resetForm();
                  setStep("upload");
                }}
                className="group relative bg-[#111] border border-white/5 rounded-2xl p-5 flex flex-col items-center gap-3 hover:border-white/20 transition-all duration-300 hover:scale-[1.03] overflow-hidden text-left"
              >
                {/* Top accent */}
                <div
                  className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-2xl"
                  style={{ background: cat.color }}
                />
                {/* Glow */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                  style={{ background: `radial-gradient(circle at 50% 0%, ${cat.color}18 0%, transparent 70%)` }}
                />

                <div
                  className="text-2xl w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                  style={{ background: `${cat.color}18`, color: cat.color }}
                >
                  {cat.icon}
                </div>
                <p className="text-white text-xs font-semibold uppercase tracking-wide text-center leading-tight">
                  {cat.label}
                </p>
                <div
                  className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 text-xs"
                  style={{ color: cat.color }}
                >→</div>
              </button>
            ))}

            {/* Uncategorized at end */}
            <button
              onClick={() => {
                setSelectedCat("Uncategorized");
                resetForm();
                setStep("upload");
              }}
              className="group relative bg-[#111] border border-white/5 rounded-2xl p-5 flex flex-col items-center gap-3 hover:border-white/20 transition-all duration-300 hover:scale-[1.03] overflow-hidden"
            >
              <div className="text-2xl w-12 h-12 rounded-xl flex items-center justify-center bg-[#d4a373]/10 text-[#d4a373]">◉</div>
              <p className="text-white text-xs font-semibold uppercase tracking-wide">Other</p>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── STEP 2: Upload Form ────────────────────────────────────
  const currentCat = CATEGORIES.find((c) => c.dbValue === selectedCat);

  return (
    <div className="min-h-[70vh] bg-[#0a0a0a] py-10 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Back + current category */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => { setStep("choose"); resetForm(); }}
            className="flex items-center gap-2 text-gray-500 hover:text-white transition text-xs uppercase tracking-widest"
          >
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
              <path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back
          </button>

          {/* Selected category badge */}
          <div
            className="flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-semibold uppercase tracking-widest"
            style={{ borderColor: `${currentCat?.color}40`, color: currentCat?.color, background: `${currentCat?.color}12` }}
          >
            <span>{currentCat?.icon}</span>
            {currentCat?.label}
          </div>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white tracking-widest uppercase">
            Upload to {currentCat?.label}
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            All uploaded logos will appear in the {currentCat?.label} category
          </p>
        </div>

        {/* Tabs */}
        <div className="flex border border-white/10 rounded-xl overflow-hidden mb-8">
          {(["file", "folder"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => { setTab(t); setError(""); setSuccess(""); }}
              className={`flex-1 py-3.5 text-sm font-semibold uppercase tracking-widest transition duration-300 ${
                tab === t ? "text-black" : "bg-[#111] text-gray-400 hover:text-white"
              }`}
              style={tab === t ? { background: currentCat?.color || "#d4a373" } : {}}
            >
              {t === "file" ? "📄 Single Image" : "📁 Folder Upload"}
            </button>
          ))}
        </div>

        {/* Alerts */}
        {error   && <div className="mb-5 p-3 rounded-lg bg-red-900/30 border border-red-500/40 text-red-400 text-sm">{error}</div>}
        {success && <div className="mb-5 p-3 rounded-lg bg-green-900/30 border border-green-500/40 text-green-400 text-sm">✓ {success}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* ── SINGLE FILE ── */}
          {tab === "file" && (
            <>
              <div
                onClick={() => fileRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const f = e.dataTransfer.files[0];
                  if (f?.type.startsWith("image/")) { setImage(f); setPreview(toPreview(f)); }
                }}
                className="border-2 border-dashed border-white/10 rounded-2xl p-8 text-center cursor-pointer hover:border-white/30 transition group"
              >
                {preview ? (
                  <img src={preview} alt="preview" className="max-h-52 mx-auto rounded-xl object-contain" />
                ) : (
                  <div className="text-gray-500 group-hover:text-gray-300 transition">
                    <p className="text-4xl mb-3">🖼️</p>
                    <p className="text-sm">Click or drag & drop image</p>
                    <p className="text-xs mt-1 opacity-60">PNG, JPG, SVG, WEBP</p>
                  </div>
                )}
                <input ref={fileRef} type="file" accept="image/*" className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) { setImage(f); setPreview(toPreview(f)); } }}
                />
              </div>

              {/* AI Generate Button */}
              {image && (
                <button
                  type="button"
                  onClick={() => generateWithAI(image)}
                  disabled={aiLoading}
                  className="w-full py-3 border border-[#d4a373]/50 text-[#d4a373] rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#d4a373]/10 transition flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {aiLoading ? (
                    <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="60" strokeDashoffset="20"/></svg> AI is analyzing image...</>
                  ) : (
                    <><span>✨</span> Generate Title & Description with AI</>
                  )}
                </button>
              )}

              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-widest mb-2">Title *</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Nike Swoosh Logo"
                  className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#d4a373] transition"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-widest mb-2">Description *</label>
                <textarea value={desc} onChange={(e) => setDesc(e.target.value)}
                  placeholder="Describe this logo..." rows={3}
                  className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#d4a373] transition resize-none"
                />
              </div>
            </>
          )}

          {/* ── FOLDER ── */}
          {tab === "folder" && (
            <>
              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-widest mb-2">Collection Name *</label>
                <input type="text" value={folderName} onChange={(e) => setFolderName(e.target.value)}
                  placeholder="e.g. Sports Logos Pack"
                  className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#d4a373] transition"
                />
              </div>

              <div
                onClick={() => folderRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => { e.preventDefault(); if (e.dataTransfer.files.length) handleFolderSelect(e.dataTransfer.files); }}
                className="border-2 border-dashed border-white/10 rounded-2xl p-8 text-center cursor-pointer hover:border-white/30 transition group"
              >
                <div className="text-gray-500 group-hover:text-gray-300 transition">
                  <p className="text-4xl mb-3">📁</p>
                  <p className="text-sm">Click to select folder</p>
                  <p className="text-xs mt-1 opacity-60">All images inside will be loaded</p>
                </div>
                <input ref={folderRef} type="file" accept="image/*" multiple
                  // @ts-ignore
                  webkitdirectory="" className="hidden"
                  onChange={(e) => { if (e.target.files) handleFolderSelect(e.target.files); }}
                />
              </div>

              {folderImages.length > 0 && (
                <div className="space-y-3">
                  <p className="text-sm text-gray-400">{folderImages.length} image{folderImages.length > 1 ? "s" : ""} — fill details:</p>
                  {folderImages.map((item, i) => (
                    <div key={i} className="bg-[#111] border border-white/10 rounded-2xl p-4 flex gap-4">
                      <img src={item.preview} alt="" className="w-16 h-16 object-cover rounded-xl flex-shrink-0" />
                      <div className="flex-1 space-y-2">
                        <button type="button" onClick={() => generateFolderItemAI(i, item.file)}
                          className="w-full py-1.5 border border-[#d4a373]/40 text-[#d4a373] rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-[#d4a373]/10 transition flex items-center justify-center gap-1"
                        >
                          {item.title === "Generating..." ? "⏳ Generating..." : "✨ AI Generate"}
                        </button>
                        <input type="text" value={item.title === "Generating..." ? "" : item.title} onChange={(e) => updateFolderItem(i, "title", e.target.value)}
                          placeholder="Title *"
                          className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#d4a373] transition"
                        />
                        <input type="text" value={item.desc === "..." ? "" : item.desc} onChange={(e) => updateFolderItem(i, "desc", e.target.value)}
                          placeholder="Description *"
                          className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#d4a373] transition"
                        />
                      </div>
                      <button type="button" onClick={() => removeFolderItem(i)} className="text-gray-600 hover:text-red-400 transition self-start text-lg">✕</button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          <button 
            type="submit" disabled={loading}
            className="w-full py-4 font-bold uppercase tracking-widest text-sm rounded-xl transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-black"
            style={{ background: loading ? "#888" : (currentCat?.color || "#d4a373") }}
          >
            {loading ? "Uploading..." : tab === "file" ? `Upload to ${currentCat?.label}` : `Upload ${folderImages.length > 0 ? folderImages.length + " logos" : ""} to ${currentCat?.label}`}
          </button>
        </form>
      </div>
    </div>
  );
}