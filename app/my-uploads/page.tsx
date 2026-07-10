"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Link from "next/link";

type Tab = "uploads" | "profile" | "account";

const STATUS_STYLE: Record<string, string> = {
  approved: "text-green-600 bg-green-50 border-green-200",
  rejected: "text-red-600 bg-red-50 border-red-200",
  pending:  "text-yellow-600 bg-yellow-50 border-yellow-200",
};

export default function DashboardPage() {
  const router = useRouter();
  const [tab,      setTab]      = useState<Tab>("uploads");
  const [user,     setUser]     = useState<any>(null);
  const [logos,    setLogos]    = useState<any[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [msg,      setMsg]      = useState<{type:"success"|"error"; text:string}|null>(null);
  const [form,     setForm]     = useState({ name:"", email:"", curPass:"", newPass:"", confirmPass:"" });

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
    const res  = await fetch("/api/user/profile", { method: "PATCH", headers: {"Content-Type":"application/json"}, body: JSON.stringify({ currentPassword: form.curPass, newPassword: form.newPass }) });
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
  const approved = logos.filter((l) => l.status === "approved").length;
  const pending  = logos.filter((l) => l.status === "pending").length;
  const rejected = logos.filter((l) => l.status === "rejected").length;

  const inputClass = "w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-[#1A4450] text-sm focus:outline-none focus:border-[#1A4450] transition";

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#1A4450] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <div className="pt-24 max-w-5xl mx-auto px-6 pb-20">

        {/* Profile header */}
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-200 flex-wrap">
          <div className="w-12 h-12 rounded-xl bg-[#1A4450]/10 border border-[#1A4450]/20 flex items-center justify-center text-[#1A4450] font-bold text-lg flex-shrink-0">
            {initials}
          </div>
          <div>
            <h1 className="text-[#1A4450] text-lg font-bold">{user?.name}</h1>
            <p className="text-gray-400 text-sm">{user?.email}</p>
          </div>
          <div className="hidden md:flex items-center gap-6 ml-6">
            {[{ n: logos.length, l:"Total"}, { n:approved, l:"Approved"}, { n:pending, l:"Pending"}].map((s) => (
              <div key={s.l} className="text-center">
                <p className="text-[#1A4450] text-lg font-bold">{s.n}</p>
                <p className="text-gray-400 text-[10px] uppercase tracking-widest">{s.l}</p>
              </div>
            ))}
          </div>
          <Link href="/upload" className="ml-auto bg-[#1A4450] text-white px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-[#1A4450]/80 transition rounded-lg flex items-center gap-2">
            <svg width="13" height="13" fill="none" viewBox="0 0 24 24"><path d="M12 3v13M5 10l7-7 7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M3 21h18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></svg>
            Upload Logo
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          {([["uploads","My Uploads"],["profile","Profile Settings"],["account","Edit Account"]] as const).map(([k,l]) => (
            <button key={k} onClick={() => setTab(k)}
              className={`px-5 py-3 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
                tab === k ? "border-[#1A4450] text-[#1A4450]" : "border-transparent text-gray-400 hover:text-[#1A4450]"
              }`}
            >{l}</button>
          ))}
        </div>

        {/* Flash */}
        {msg && (
          <div className={`mb-5 p-3 rounded-lg text-sm border ${
            msg.type === "success" ? "bg-green-50 border-green-200 text-green-600" : "bg-red-50 border-red-200 text-red-600"
          }`}>
            {msg.type === "success" ? "✓" : "⚠"} {msg.text}
          </div>
        )}

        {/* MY UPLOADS */}
        {tab === "uploads" && (
          <div>
            <div className="flex md:hidden gap-3 mb-5">
              {[{n:logos.length,l:"Total"},{n:approved,l:"Approved"},{n:pending,l:"Pending"},{n:rejected,l:"Rejected"}].map((s) => (
                <div key={s.l} className="border border-gray-200 rounded-lg p-3 flex-1 text-center">
                  <p className="text-[#1A4450] font-bold text-base">{s.n}</p>
                  <p className="text-gray-400 text-[10px] uppercase tracking-widest">{s.l}</p>
                </div>
              ))}
            </div>

            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="hidden md:grid px-5 py-3 border-b border-gray-100 text-gray-400 text-[10px] uppercase tracking-widest bg-gray-50"
                style={{ gridTemplateColumns: "52px 40px 1fr 110px 120px 70px 100px" }}>
                <span>Thumb</span><span>ID</span><span>Logo Name</span><span>Date</span><span>Category</span><span>Type</span><span>Status</span>
              </div>

              {logos.length === 0 ? (
                <div className="text-center py-16 px-6">
                  <p className="text-gray-400 text-sm mb-2">No logos uploaded yet.</p>
                  <Link href="/upload" className="text-[#1A4450] text-sm font-semibold hover:underline">Upload your first logo →</Link>
                </div>
              ) : logos.map((logo, i) => (
                <div key={logo._id}
                  className="flex md:grid gap-3 px-5 py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition items-center"
                  style={{ gridTemplateColumns: "52px 40px 1fr 110px 120px 70px 100px" }}
                >
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
                    <img src={logo.imageUrl} alt={logo.title} className="w-full h-full object-cover" />
                  </div>
                  <span className="text-gray-400 text-[10px] font-mono hidden md:block">#{i+1}</span>
                  <div className="min-w-0 flex-1">
                    {logo.status === "approved"
                      ? <Link href={`/logo/${logo._id}`} className="text-[#1A4450] text-sm font-semibold truncate block hover:underline">{logo.title}</Link>
                      : <p className="text-[#1A4450] text-sm font-semibold truncate">{logo.title}</p>
                    }
                    <p className="text-gray-400 text-xs truncate">{logo.desc}</p>
                  </div>
                  <span className="text-gray-400 text-xs hidden md:block">
                    {new Date(logo.createdAt).toLocaleDateString("en-PK", { day:"numeric", month:"short", year:"numeric" })}
                  </span>
                  <span className="text-gray-400 text-xs truncate hidden md:block">{logo.category}</span>
                  <span className="text-gray-400 text-xs capitalize hidden md:block">{logo.type || "brand"}</span>
                  <span className={`text-[10px] px-2.5 py-1 rounded-full border whitespace-nowrap w-fit ${STATUS_STYLE[logo.status] || STATUS_STYLE.pending}`}>
                    {logo.status === "approved" ? "✓ Approved" : logo.status === "rejected" ? "✗ Rejected" : "⏳ Pending"}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-gray-400 text-xs mt-3">Showing {logos.length} of {logos.length} entries</p>
          </div>
        )}

        {/* PROFILE SETTINGS */}
        {tab === "profile" && (
          <div className="max-w-md space-y-4">
            <div>
              <label className="block text-[10px] text-[#1A4450]/60 uppercase tracking-widest mb-1">Full Name</label>
              <input type="text" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className={inputClass} />
            </div>
            <div>
              <label className="block text-[10px] text-[#1A4450]/60 uppercase tracking-widest mb-1">Email Address</label>
              <input type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} className={inputClass} />
            </div>
            <button onClick={saveProfile} disabled={saving}
              className="w-full py-2.5 bg-[#1A4450] text-white font-bold uppercase tracking-widest text-xs rounded-lg hover:bg-[#1A4450]/80 transition disabled:opacity-50"
            >{saving ? "Saving..." : "Save Changes"}</button>
          </div>
        )}

        {/* EDIT ACCOUNT */}
        {tab === "account" && (
          <div className="max-w-md space-y-6">
            <div className="border border-gray-200 rounded-xl p-5 space-y-4">
              <h3 className="text-[#1A4450] font-bold text-sm uppercase tracking-widest">Change Password</h3>
              {[
                { label: "Current Password", key: "curPass",     ph: "Your current password" },
                { label: "New Password",      key: "newPass",     ph: "Min 6 characters" },
                { label: "Confirm Password",  key: "confirmPass", ph: "Repeat new password" },
              ].map((f) => (
                <div key={f.key}>
                  <label className="block text-[10px] text-[#1A4450]/60 uppercase tracking-widest mb-1">{f.label}</label>
                  <input type="password" placeholder={f.ph} value={(form as any)[f.key]}
                    onChange={(e) => setForm({...form, [f.key]: e.target.value})} className={inputClass} />
                </div>
              ))}
              <button onClick={savePassword} disabled={saving}
                className="w-full py-2.5 bg-[#1A4450] text-white font-bold uppercase tracking-widest text-xs rounded-lg hover:bg-[#1A4450]/80 transition disabled:opacity-50"
              >{saving ? "Updating..." : "Update Password"}</button>
            </div>

            <div className="border border-red-200 rounded-xl p-5">
              <h3 className="text-red-500 font-bold text-sm uppercase tracking-widest mb-2">Danger Zone</h3>
              <p className="text-gray-400 text-sm mb-4">Permanently delete your account and all uploaded logos.</p>
              <button onClick={deleteAccount} disabled={deleting}
                className="border border-red-300 text-red-500 hover:bg-red-50 px-5 py-2 text-xs font-semibold uppercase tracking-widest rounded-lg transition disabled:opacity-50"
              >{deleting ? "Deleting..." : "Delete My Account"}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}