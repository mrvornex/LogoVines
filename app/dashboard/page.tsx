"use client";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Link from "next/link";

type Tab = "uploads" | "profile" | "account";

const COUNTRIES = [
  "Pakistan", "Afghanistan", "Albania", "Algeria", "Argentina", "Australia", "Austria", "Bangladesh",
  "Belgium", "Brazil", "Canada", "China", "Denmark", "Egypt", "Finland", "France", "Germany", "Ghana",
  "Greece", "Hungary", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Italy", "Japan", "Jordan",
  "Kenya", "Malaysia", "Mexico", "Morocco", "Netherlands", "Nigeria", "Norway", "Philippines", "Poland",
  "Portugal", "Romania", "Russia", "Saudi Arabia", "South Africa", "Spain", "Sweden", "Switzerland",
  "Thailand", "Turkey", "UAE", "UK", "USA", "Vietnam", "Other"
];

const STATUS_STYLE: Record<string, string> = {
  approved: "text-green-600 bg-green-50 border-green-200",
  rejected: "text-red-600 bg-red-50 border-red-200",
  pending: "text-yellow-600 bg-yellow-50 border-yellow-200",
};

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = (searchParams.get("tab") as Tab) || "uploads";
  const [tab, setTab] = useState<Tab>(tabParam);
  const [user, setUser] = useState<any>(null);
  const [logos, setLogos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [profile, setProfile] = useState({
    country: "", website: "", facebook: "", twitter: "",
    instagram: "", pinterest: "", linkedin: "", behance: "", dribbble: ""
  });
  const [account, setAccount] = useState({ name: "", username: "", email: "" });
  const [passForm, setPassForm] = useState({ current: "", newPass: "", confirm: "" });
  const [showPass, setShowPass] = useState({ c: false, n: false, cf: false });

  const flash = (type: "success" | "error", text: string) => {
    setMsg({ type, text }); setTimeout(() => setMsg(null), 3500);
  };

  useEffect(() => {
    Promise.all([
      fetch("/api/user/profile").then(r => r.json()),
      fetch("/api/user/uploads").then(r => r.json()),
    ]).then(([p, u]) => {
      if (!p.success) { router.push("/user-login"); return; }
      setUser(p.user);
      setLogos(u.logos || []);
      setProfile({
        country: p.user.country || "", website: p.user.website || "",
        facebook: p.user.facebook || "", twitter: p.user.twitter || "",
        instagram: p.user.instagram || "", pinterest: p.user.pinterest || "",
        linkedin: p.user.linkedin || "", behance: p.user.behance || "", dribbble: p.user.dribbble || "",
      });
      setAccount({ name: p.user.name, username: p.user.username || "", email: p.user.email });
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => { setTab(tabParam); }, [tabParam]);

  const changeTab = (t: Tab) => {
    setTab(t); setMsg(null);
    router.push(`/dashboard?tab=${t}`, { scroll: false });
  };

  const saveProfile = async () => {
    setSaving(true);
    const res = await fetch("/api/user/profile", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(profile) });
    const data = await res.json();
    if (data.success) flash("success", "Profile saved!"); else flash("error", data.message || "Failed");
    setSaving(false);
  };

  const saveAccount = async () => {
    setSaving(true);
    const res = await fetch("/api/user/profile", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: account.name, username: account.username, email: account.email }) });
    const data = await res.json();
    if (data.success) { setUser((u: any) => ({ ...u, ...account })); flash("success", "Account saved!"); } else flash("error", data.message || "Failed");
    setSaving(false);
  };

  const changePassword = async () => {
    if (!passForm.current) return flash("error", "Current password required");
    if (passForm.newPass !== passForm.confirm) return flash("error", "Passwords do not match");
    if (passForm.newPass.length < 6) return flash("error", "Password must be 6+ characters");
    setSaving(true);
    const res = await fetch("/api/user/profile", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ currentPassword: passForm.current, newPassword: passForm.newPass }) });
    const data = await res.json();
    if (data.success) { flash("success", "Password changed!"); setPassForm({ current: "", newPass: "", confirm: "" }); } else flash("error", data.message || "Failed");
    setSaving(false);
  };

  const deleteAccount = async () => {
    if (!confirm("Delete your account permanently? This cannot be undone.")) return;
    try {
      setDeleting(true);
      const res = await fetch("/api/user/profile", { method: "DELETE" });
      const data = await res.json();
      if (data.success) router.push("/"); else flash("error", data.message || "Failed");
    } catch { flash("error", "Something went wrong"); }
    finally { setDeleting(false); }
  };

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#1A4450] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const approved = logos.filter(l => l.status === "approved").length;
  const pending = logos.filter(l => l.status === "pending").length;
  const inputClass = "w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-[#1A4450] text-sm focus:outline-none focus:border-[#1A4450] transition placeholder-gray-400";
  const labelClass = "block text-[10px] text-[#1A4450]/60 uppercase tracking-widest mb-1.5";

  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <div className="pt-24 max-w-5xl mx-auto px-6 pb-20">

        {/* Tabs */}
        <div className="flex items-center border-b border-gray-200 mb-6">
          {(["uploads", "profile", "account"] as Tab[]).map((k) => (
            <button key={k} onClick={() => changeTab(k)}
              className={`px-5 py-3 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${tab === k ? "border-[#1A4450] text-[#1A4450]" : "border-transparent text-gray-400 hover:text-[#1A4450]"
                }`}
            >{k === "uploads" ? "My Uploads" : k === "profile" ? "Profile Settings" : "Edit Account"}</button>
          ))}
          <div className="ml-auto flex items-center gap-3 pb-1">
            <span className="text-[#1A4450] text-xs font-semibold">@{user?.username || user?.name}</span>
          </div>
        </div>

        {/* Flash */}
        {msg && (
          <div className={`mb-5 p-3 rounded-lg text-sm border ${msg.type === "success" ? "bg-green-50 border-green-200 text-green-600" : "bg-red-50 border-red-200 text-red-600"}`}>
            {msg.type === "success" ? "✓" : "⚠"} {msg.text}
          </div>
        )}

        {/* MY UPLOADS */}
        {tab === "uploads" && (
          <div>
            <div className="flex gap-3 mb-5 flex-wrap">
              {[{ n: logos.length, l: "Total" }, { n: approved, l: "Approved" }, { n: pending, l: "Pending" }].map((s) => (
                <div key={s.l} className="border border-gray-200 rounded-xl px-5 py-3 text-center">
                  <p className="text-[#1A4450] font-bold text-xl">{s.n}</p>
                  <p className="text-gray-400 text-[10px] uppercase tracking-widest mt-0.5">{s.l}</p>
                </div>
              ))}
              <Link href="/upload" className="ml-auto self-center bg-[#1A4450] text-white px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-[#1A4450]/80 transition rounded-lg">
                + Upload New
              </Link>
            </div>

            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="hidden md:grid px-5 py-3 border-b border-gray-100 text-gray-400 text-[10px] uppercase tracking-widest bg-gray-50"
                style={{ gridTemplateColumns: "52px 44px 1fr 110px 110px 80px 100px" }}>
                <span>Thumb</span><span>ID</span><span>Logo Name</span><span>Date</span><span>Category</span><span>Type</span><span>Status</span>
              </div>
              {logos.length === 0 ? (
                <div className="text-center py-14 px-6">
                  <p className="text-gray-400 text-sm mb-2">No logos uploaded yet.</p>
                  <Link href="/upload" className="text-[#1A4450] text-sm font-semibold hover:underline">Upload your first logo →</Link>
                </div>
              ) : logos.map((logo, i) => (
                <div key={logo._id}
                  className="flex md:grid px-5 py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition items-center gap-3"
                  style={{ gridTemplateColumns: "52px 44px 1fr 110px 110px 80px 100px" }}
                >
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
                    <img src={logo.imageUrl} alt={logo.title} className="w-full h-full object-cover" />
                  </div>
                  <span className="text-gray-400 text-[10px] font-mono hidden md:block">#{i + 1}</span>
                  <div className="min-w-0 flex-1 pr-4">
                    {logo.status === "approved"
                      ? <Link href={`/logo/${logo._id}`} className="text-[#1A4450] text-sm font-semibold truncate block hover:underline">{logo.title}</Link>
                      : <p className="text-[#1A4450] text-sm font-semibold truncate">{logo.title}</p>
                    }
                    <p className="text-gray-400 text-xs truncate">{logo.category}</p>
                  </div>
                  <span className="text-gray-400 text-xs hidden md:block">{new Date(logo.createdAt).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" })}</span>
                  <span className="text-gray-400 text-xs truncate hidden md:block">{logo.category}</span>
                  <span className="text-gray-400 text-xs capitalize hidden md:block">{logo.type || "brand"}</span>
                  <span className={`text-[10px] px-2.5 py-1 rounded-full border w-fit ${STATUS_STYLE[logo.status] || STATUS_STYLE.pending}`}>
                    {logo.status === "approved" ? "✓ Live" : logo.status === "rejected" ? "✗ Rejected" : "⏳ Pending"}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-gray-400 text-xs mt-3">Showing {logos.length} entries</p>
          </div>
        )}

        {/* PROFILE SETTINGS */}
        {tab === "profile" && (
          <div className="max-w-md space-y-4">
            <div>
              <label className={labelClass}>Country</label>
              <select value={profile.country} onChange={(e) => setProfile({ ...profile, country: e.target.value })} className={inputClass + " appearance-none"}>
                <option value="">Select Country</option>
                {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            {[
              { key: "website", label: "Website", ph: "https://yourwebsite.com" },
              { key: "facebook", label: "Facebook", ph: "https://facebook.com/yourprofile" },
              { key: "twitter", label: "Twitter / X", ph: "https://twitter.com/yourhandle" },
              { key: "instagram", label: "Instagram", ph: "https://instagram.com/yourprofile" },
              { key: "pinterest", label: "Pinterest", ph: "https://pinterest.com/yourprofile" },
              { key: "linkedin", label: "LinkedIn", ph: "https://linkedin.com/in/yourprofile" },
              { key: "behance", label: "Behance", ph: "https://behance.net/yourprofile" },
              { key: "dribbble", label: "Dribbble", ph: "https://dribbble.com/yourprofile" },
            ].map((f) => (
              <div key={f.key}>
                <label className={labelClass}>{f.label}</label>
                <input type="url" placeholder={f.ph} value={(profile as any)[f.key]}
                  onChange={(e) => setProfile({ ...profile, [f.key]: e.target.value })} className={inputClass} />
              </div>
            ))}
            <button onClick={saveProfile} disabled={saving}
              className="w-full py-2.5 bg-[#1A4450] text-white font-bold uppercase tracking-widest text-xs rounded-lg hover:bg-[#1A4450]/80 transition disabled:opacity-50"
            >{saving ? "Saving..." : "Save Profile"}</button>
          </div>
        )}

        {/* EDIT ACCOUNT */}
        {tab === "account" && (
          <div className="max-w-md space-y-6">
            {/* Account info */}
            <div className="border border-gray-200 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-[#1A4450] font-bold text-sm uppercase tracking-widest">Account Settings</h3>
                <span className="text-gray-400 text-xs">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-PK", { day: "numeric", month: "long", year: "numeric" }) : ""}</span>
              </div>
              {[
                { label: "Username", key: "username", type: "text", ph: "your_username" },
                { label: "Full Name", key: "name", type: "text", ph: "Your name" },
                { label: "Email", key: "email", type: "email", ph: "you@email.com" },
              ].map((f) => (
                <div key={f.key}>
                  <label className={labelClass}>{f.label}</label>
                  <input type={f.type} placeholder={f.ph} value={(account as any)[f.key]}
                    onChange={(e) => setAccount({ ...account, [f.key]: f.key === "username" ? e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "") : e.target.value })}
                    className={inputClass} />
                </div>
              ))}
              <button onClick={saveAccount} disabled={saving}
                className="w-full py-2.5 bg-[#1A4450] text-white font-bold uppercase tracking-widest text-xs rounded-lg hover:bg-[#1A4450]/80 transition disabled:opacity-50"
              >{saving ? "Saving..." : "Save Account"}</button>
            </div>

            {/* Change Password */}
            <div className="border border-gray-200 rounded-xl p-5 space-y-4">
              <h3 className="text-[#1A4450] font-bold text-sm uppercase tracking-widest">Change Password</h3>
              {[
                { label: "Current Password", key: "current", show: showPass.c, toggle: () => setShowPass(s => ({ ...s, c: !s.c })) },
                { label: "New Password", key: "newPass", show: showPass.n, toggle: () => setShowPass(s => ({ ...s, n: !s.n })) },
                { label: "Confirm New Password", key: "confirm", show: showPass.cf, toggle: () => setShowPass(s => ({ ...s, cf: !s.cf })) },
              ].map((f) => (
                <div key={f.key}>
                  <label className={labelClass}>{f.label}</label>
                  <div className="relative">
                    <input type={f.show ? "text" : "password"} value={(passForm as any)[f.key]}
                      onChange={(e) => setPassForm({ ...passForm, [f.key]: e.target.value })}
                      className={inputClass + " pr-12"} />
                    <button type="button" onClick={f.toggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#1A4450] transition">
                      {f.show
                        ? <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /><line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
                        : <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1.8" /><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" /></svg>
                      }
                    </button>
                  </div>
                </div>
              ))}
              <button onClick={changePassword} disabled={saving}
                className="w-full py-2.5 bg-[#1A4450] text-white font-bold uppercase tracking-widest text-xs rounded-lg hover:bg-[#1A4450]/80 transition disabled:opacity-50"
              >{saving ? "Updating..." : "Change Password"}</button>
            </div>

            {/* Danger Zone */}
            <div className="border border-red-200 rounded-xl p-5">
              <h3 className="text-red-500 font-bold text-sm uppercase tracking-widest mb-2">Danger Zone</h3>
              <p className="text-gray-400 text-sm mb-4">Permanently delete your account and all uploaded logos.</p>
              <button onClick={deleteAccount} disabled={deleting}
                className="border border-red-300 text-red-500 hover:bg-red-50 px-5 py-2 text-xs font-semibold uppercase tracking-widest rounded-lg transition disabled:opacity-50 flex items-center gap-2"
              >
                {deleting ? <><svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="60" strokeDashoffset="20" /></svg>Deleting...</> : "Delete My Account"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return <Suspense fallback={<div className="min-h-screen bg-white" />}><DashboardContent /></Suspense>;
}