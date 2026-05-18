"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Link from "next/link";

type Tab = "uploads" | "profile" | "account";

const STATUS_STYLE: Record<string, string> = {
  approved: "text-green-400 bg-green-900/20 border-green-500/30",
  rejected: "text-red-400 bg-red-900/20 border-red-500/30",
  pending:  "text-yellow-400 bg-yellow-900/20 border-yellow-500/30",
};

export default function DashboardPage() {
  const router = useRouter();
  const [tab,     setTab]     = useState<Tab>("uploads");
  const [user,    setUser]    = useState<any>(null);
  const [logos,   setLogos]   = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [deleting,setDeleting]= useState(false);
  const [msg,     setMsg]     = useState<{type:"success"|"error"; text:string}|null>(null);
  const [form,    setForm]    = useState({ name:"", email:"", curPass:"", newPass:"", confirmPass:"" });

  const flash = (type: "success"|"error", text: string) => {
    setMsg({type, text}); setTimeout(() => setMsg(null), 3000);
  };

  useEffect(() => {
    Promise.all([
      fetch("/api/user/profile").then((r) => r.json()),
      fetch("/api/user/uploads").then((r) => r.json()),
    ]).then(([p, u]) => {
      if (!p.success) { router.push("/user-login"); return; }
      setUser(p.user);
      setLogos(u.logos || []);
      setForm((f) => ({ ...f, name: p.user.name, email: p.user.email }));
    }).finally(() => setLoading(false));
  }, []);

  const saveProfile = async () => {
    setSaving(true);
    const res  = await fetch("/api/user/profile", { method: "PATCH", headers: {"Content-Type":"application/json"}, body: JSON.stringify({ name: form.name, email: form.email }) });
    const data = await res.json();
    if (data.success) { setUser((u: any) => ({...u, name: form.name, email: form.email})); flash("success", "Profile updated!"); }
    else flash("error", data.message || "Failed");
    setSaving(false);
  };

  const savePassword = async () => {
    if (form.newPass !== form.confirmPass) return flash("error", "Passwords do not match");
    if (form.newPass.length < 6) return flash("error", "Password must be 6+ characters");
    setSaving(true);
    const res  = await fetch("/api/user/profile", { method: "PATCH", headers: {"Content-Type":"application/json"}, body: JSON.stringify({ password: form.curPass, newPassword: form.newPass }) });
    const data = await res.json();
    if (data.success) { flash("success", "Password updated!"); setForm((f) => ({...f, curPass:"", newPass:"", confirmPass:""})); }
    else flash("error", data.message || "Failed");
    setSaving(false);
  };

  const deleteAccount = async () => {
    if (!confirm("Delete your account permanently? This cannot be undone.")) return;
    setDeleting(true);
    await fetch("/api/user/profile", { method: "DELETE" });
    router.push("/");
  };

  const initials = user?.name?.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0,2) || "";
  const approved  = logos.filter((l) => l.status === "approved").length;
  const pending   = logos.filter((l) => l.status === "pending").length;
  const rejected  = logos.filter((l) => l.status === "rejected").length;

  if (loading) return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#d4a373] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="bg-[#0a0a0a] min-h-screen">
      <Navbar />

      <div className="pt-24 max-w-6xl mx-auto px-6 md:px-10 pb-20">

        {/* ── Profile header ── */}
        <div className="flex items-center gap-5 mb-8 pb-6 border-b border-white/5 flex-wrap">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-2xl bg-[#d4a373]/15 border border-[#d4a373]/30 flex items-center justify-center text-[#d4a373] font-bold text-2xl flex-shrink-0">
            {initials}
          </div>

          {/* Name + email */}
          <div>
            <h1 className="text-white text-xl font-bold">{user?.name}</h1>
            <p className="text-gray-500 text-sm">{user?.email}</p>
          </div>

          {/* Stats */}
          <div className="hidden md:flex items-center gap-6 ml-8">
            {[
              { n: logos.length, l: "Total"    },
              { n: approved,     l: "Approved"  },
              { n: pending,      l: "Pending"   },
            ].map((s) => (
              <div key={s.l} className="text-center">
                <p className="text-white text-lg font-bold">{s.n}</p>
                <p className="text-gray-600 text-[10px] uppercase tracking-widest">{s.l}</p>
              </div>
            ))}
          </div>

          {/* Upload button */}
          <Link href="/upload"
            className="ml-auto bg-[#d4a373] text-black px-5 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-[#e8b989] transition rounded-xl flex items-center gap-2"
          >
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
              <path d="M12 3v13M5 10l7-7 7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3 21h18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
            Upload Logo
          </Link>
        </div>

        {/* ── Tabs ── */}
        <div className="flex items-center border-b border-white/5 mb-8">
          {([
            ["uploads", "My Uploads"],
            ["profile", "Profile Settings"],
            ["account", "Edit Account"],
          ] as const).map(([k, l]) => (
            <button key={k} onClick={() => setTab(k)}
              className={`px-6 py-3.5 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
                tab === k ? "border-[#d4a373] text-[#d4a373]" : "border-transparent text-gray-500 hover:text-white"
              }`}
            >{l}</button>
          ))}
        </div>

        {/* Flash message */}
        {msg && (
          <div className={`mb-6 p-3 rounded-xl text-sm border flex items-center gap-2 ${
            msg.type === "success" ? "bg-green-900/20 border-green-500/30 text-green-400" : "bg-red-900/20 border-red-500/30 text-red-400"
          }`}>
            {msg.type === "success" ? "✓" : "⚠"} {msg.text}
          </div>
        )}

        {/* ══ MY UPLOADS ══ */}
        {tab === "uploads" && (
          <div>
            {/* Mobile stats */}
            <div className="flex md:hidden gap-4 mb-6">
              {[{ n: logos.length, l:"Total"}, { n:approved, l:"Approved"}, { n:pending, l:"Pending"}, { n:rejected, l:"Rejected"}].map((s) => (
                <div key={s.l} className="bg-[#111] border border-white/5 rounded-xl p-3 flex-1 text-center">
                  <p className="text-white font-bold text-lg">{s.n}</p>
                  <p className="text-gray-600 text-[10px] uppercase tracking-widest">{s.l}</p>
                </div>
              ))}
            </div>

            <div className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden">

              {/* Table head */}
              <div className="hidden md:grid gap-4 px-5 py-3 border-b border-white/5 text-gray-600 text-[10px] uppercase tracking-widest"
                style={{ gridTemplateColumns: "56px 48px 1fr 110px 120px 70px 100px" }}
              >
                <span>Thumb</span>
                <span>ID</span>
                <span>Logo Name</span>
                <span>Date</span>
                <span>Category</span>
                <span>Type</span>
                <span>Status</span>
              </div>

              {logos.length === 0 ? (
                <div className="text-center py-16 px-6">
                  <p className="text-5xl mb-4">🖼️</p>
                  <p className="text-gray-500 text-sm mb-2">You have not uploaded any logos.</p>
                  <Link href="/upload" className="text-[#d4a373] text-sm hover:underline">Upload your first logo →</Link>
                </div>
              ) : (
                logos.map((logo, i) => (
                  <div key={logo._id}
                    className="flex md:grid gap-3 md:gap-4 px-5 py-3 border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition items-center"
                    style={{ gridTemplateColumns: "56px 48px 1fr 110px 120px 70px 100px" }}
                  >
                    {/* Thumb */}
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#0d0d0d] flex-shrink-0 border border-white/5">
                      <img src={logo.imageUrl} alt={logo.title} className="w-full h-full object-cover" />
                    </div>

                    {/* ID */}
                    <span className="text-gray-700 text-[10px] font-mono hidden md:block">#{i+1}</span>

                    {/* Name + desc */}
                    <div className="min-w-0 flex-1">
                      {logo.status === "approved" ? (
                        <Link href={`/logo/${logo._id}`} className="text-white text-sm font-semibold truncate block hover:text-[#d4a373] transition">{logo.title}</Link>
                      ) : (
                        <p className="text-white text-sm font-semibold truncate">{logo.title}</p>
                      )}
                      <p className="text-gray-600 text-xs truncate">{logo.desc}</p>
                    </div>

                    {/* Date */}
                    <span className="text-gray-500 text-xs hidden md:block">
                      {new Date(logo.createdAt).toLocaleDateString("en-PK", { day:"numeric", month:"short", year:"numeric" })}
                    </span>

                    {/* Category */}
                    <span className="text-gray-500 text-xs truncate hidden md:block">{logo.category}</span>

                    {/* Type */}
                    <span className="text-gray-600 text-xs capitalize hidden md:block">{logo.type || "brand"}</span>

                    {/* Status */}
                    <span className={`text-[10px] px-2.5 py-1 rounded-full border whitespace-nowrap w-fit ${STATUS_STYLE[logo.status] || STATUS_STYLE.pending}`}>
                      {logo.status === "approved" ? "✓ Approved" : logo.status === "rejected" ? "✗ Rejected" : "⏳ Pending"}
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* Count */}
            <p className="text-gray-700 text-xs mt-4">
              Showing {logos.length} of {logos.length} entries
            </p>
          </div>
        )}

        {/* ══ PROFILE SETTINGS ══ */}
        {tab === "profile" && (
          <div className="max-w-lg">
            <div className="bg-[#111] border border-white/5 rounded-2xl p-7 space-y-5">
              <h3 className="text-white font-bold text-sm uppercase tracking-widest">Account Information</h3>

              <div>
                <label className="block text-xs text-gray-500 uppercase tracking-widest mb-2">Full Name</label>
                <input
                  type="text" value={form.name}
                  onChange={(e) => setForm({...form, name: e.target.value})}
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#d4a373] transition"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-500 uppercase tracking-widest mb-2">Email Address</label>
                <input
                  type="email" value={form.email}
                  onChange={(e) => setForm({...form, email: e.target.value})}
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#d4a373] transition"
                />
              </div>

              <button onClick={saveProfile} disabled={saving}
                className="w-full py-3.5 bg-[#d4a373] text-black font-bold uppercase tracking-widest text-sm rounded-xl hover:bg-[#e8b989] transition disabled:opacity-50"
              >{saving ? "Saving..." : "Save Changes"}</button>
            </div>
          </div>
        )}

        {/* ══ EDIT ACCOUNT ══ */}
        {tab === "account" && (
          <div className="max-w-lg space-y-6">

            {/* Change Password */}
            <div className="bg-[#111] border border-white/5 rounded-2xl p-7 space-y-5">
              <h3 className="text-white font-bold text-sm uppercase tracking-widest">Change Password</h3>

              {[
                { label: "Current Password", key: "curPass",     ph: "Your current password" },
                { label: "New Password",      key: "newPass",     ph: "Min 6 characters"      },
                { label: "Confirm Password",  key: "confirmPass", ph: "Repeat new password"   },
              ].map((f) => (
                <div key={f.key}>
                  <label className="block text-xs text-gray-500 uppercase tracking-widest mb-2">{f.label}</label>
                  <input
                    type="password" placeholder={f.ph}
                    value={(form as any)[f.key]}
                    onChange={(e) => setForm({...form, [f.key]: e.target.value})}
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#d4a373] transition"
                  />
                </div>
              ))}

              <button onClick={savePassword} disabled={saving}
                className="w-full py-3.5 bg-[#d4a373] text-black font-bold uppercase tracking-widest text-sm rounded-xl hover:bg-[#e8b989] transition disabled:opacity-50"
              >{saving ? "Updating..." : "Update Password"}</button>
            </div>

            {/* Danger zone */}
            <div className="bg-[#111] border border-red-500/20 rounded-2xl p-7">
              <h3 className="text-red-400 font-bold text-sm uppercase tracking-widest mb-2">Danger Zone</h3>
              <p className="text-gray-500 text-sm mb-5 leading-relaxed">
                Permanently delete your account and all uploaded logos. This action cannot be undone.
              </p>
              <button onClick={deleteAccount} disabled={deleting}
                className="border border-red-500/40 text-red-400 hover:bg-red-500/10 px-6 py-2.5 text-xs font-semibold uppercase tracking-widest rounded-xl transition disabled:opacity-50"
              >{deleting ? "Deleting..." : "Delete My Account"}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}