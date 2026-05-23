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
  approved: "text-green-400 bg-green-900/20 border-green-500/30",
  rejected: "text-red-400 bg-red-900/20 border-red-500/30",
  pending: "text-yellow-400 bg-yellow-900/20 border-yellow-500/30",
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

  // Profile Settings form
  const [profile, setProfile] = useState({
    country: "", website: "", facebook: "", twitter: "",
    instagram: "", pinterest: "", linkedin: "", behance: "", dribbble: ""
  });

  // Edit Account form
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
        country: p.user.country || "",
        website: p.user.website || "",
        facebook: p.user.facebook || "",
        twitter: p.user.twitter || "",
        instagram: p.user.instagram || "",
        pinterest: p.user.pinterest || "",
        linkedin: p.user.linkedin || "",
        behance: p.user.behance || "",
        dribbble: p.user.dribbble || "",
      });
      setAccount({ name: p.user.name, username: p.user.username || "", email: p.user.email });
    }).finally(() => setLoading(false));
  }, []);

  // Sync tab from URL
  useEffect(() => { setTab(tabParam); }, [tabParam]);

  const changeTab = (t: Tab) => {
    setTab(t); setMsg(null);
    router.push(`/dashboard?tab=${t}`, { scroll: false });
  };

  const saveProfile = async () => {
    setSaving(true);
    const res = await fetch("/api/user/profile", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(profile) });
    const data = await res.json();
    if (data.success) flash("success", "Profile settings saved!");
    else flash("error", data.message || "Failed");
    setSaving(false);
  };

  const saveAccount = async () => {
    setSaving(true);
    const res = await fetch("/api/user/profile", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: account.name, username: account.username, email: account.email }) });
    const data = await res.json();
    if (data.success) { setUser((u: any) => ({ ...u, ...account })); flash("success", "Account settings saved!"); }
    else flash("error", data.message || "Failed");
    setSaving(false);
  };

  const changePassword = async () => {
    if (!passForm.current) return flash("error", "Current password required");
    if (passForm.newPass !== passForm.confirm) return flash("error", "Passwords do not match");
    if (passForm.newPass.length < 6) return flash("error", "Password must be 6+ characters");
    setSaving(true);
    const res = await fetch("/api/user/profile", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ currentPassword: passForm.current, newPassword: passForm.newPass }) });
    const data = await res.json();
    if (data.success) { flash("success", "Password changed!"); setPassForm({ current: "", newPass: "", confirm: "" }); }
    else flash("error", data.message || "Failed");
    setSaving(false);
  };

  const deleteAccount = async () => {
  if (!confirm("Delete your account permanently? This cannot be undone.")) return;

  try {
    setDeleting(true);

    const res = await fetch("/api/user/profile", {
      method: "DELETE",
    });

    const data = await res.json();

    if (data.success) {
      router.push("/");
    } else {
      flash("error", data.message || "Failed to delete account");
    }

  } catch (error) {
    flash("error", "Something went wrong");
  } finally {
    setDeleting(false);
  }
};

  if (loading) return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#d4a373] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const approved = logos.filter(l => l.status === "approved").length;
  const pending = logos.filter(l => l.status === "pending").length;

  const tabClass = (t: Tab) =>
    `px-5 py-3 text-sm font-semibold border-b-2 transition-all whitespace-nowrap cursor-pointer ${tab === t ? "border-[#d4a373] text-[#d4a373]" : "border-transparent text-gray-500 hover:text-white"
    }`;

  const inputClass = "w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#d4a373] transition placeholder-gray-700";
  const labelClass = "block text-xs text-gray-500 uppercase tracking-widest mb-2";

  return (
    <div className="bg-[#0a0a0a] min-h-screen">
      <Navbar />
      <div className="pt-24 max-w-5xl mx-auto px-6 pb-20">

        {/* ── Tabs ── */}
        <div className="flex items-center border-b border-white/10 mb-8">
          <button className={tabClass("uploads")} onClick={() => changeTab("uploads")}>My Uploads</button>
          <button className={tabClass("profile")} onClick={() => changeTab("profile")}>Profile Settings</button>
          <button className={tabClass("account")} onClick={() => changeTab("account")}>Edit Account</button>

          {/* Right side */}
          <div className="ml-auto flex items-center gap-5 pb-1">
            <button onClick={() => changeTab("uploads")} className="text-gray-500 hover:text-white text-xs uppercase tracking-widest transition">
              Notifications
            </button>
            <span className="text-gray-700 text-xs">|</span>
            <span className="text-[#d4a373] text-xs uppercase tracking-widest">
              @{user?.username || user?.name}
            </span>
          </div>
        </div>

        {/* Flash */}
        {msg && (
          <div className={`mb-6 p-3.5 rounded-xl text-sm border flex items-center gap-2 ${msg.type === "success" ? "bg-green-900/20 border-green-500/30 text-green-400" : "bg-red-900/20 border-red-500/30 text-red-400"
            }`}>
            {msg.type === "success" ? "✓" : "⚠"} {msg.text}
          </div>
        )}

        {/* ══ MY UPLOADS ══ */}
        {tab === "uploads" && (
          <div>
            {/* Stats row */}
            <div className="flex gap-4 mb-6">
              {[{ n: logos.length, l: "Total" }, { n: approved, l: "Approved" }, { n: pending, l: "Pending" }].map((s) => (
                <div key={s.l} className="bg-[#111] border border-white/5 rounded-xl px-5 py-3 text-center">
                  <p className="text-white font-bold text-xl">{s.n}</p>
                  <p className="text-gray-600 text-[10px] uppercase tracking-widest mt-0.5">{s.l}</p>
                </div>
              ))}
              <Link href="/upload" className="ml-auto self-center bg-[#d4a373] text-black px-5 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-[#e8b989] transition rounded-xl">
                + Upload New
              </Link>
            </div>

            {/* Table */}
            <div className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden">
              {/* Header */}
              <div className="grid px-5 py-3 border-b border-white/5 text-gray-600 text-[10px] uppercase tracking-widest"
                style={{ gridTemplateColumns: "56px 52px 1fr 120px 100px 100px" }}>
                <span>Thumb</span>
                <span>ID</span>
                <span>Logo Name</span>
                <span>Date</span>
                <span>Category</span>
                <span>Status</span>
              </div>

              {logos.length === 0 ? (
                <div className="text-center py-16 px-6">
                  <p className="text-gray-500 text-sm mb-2">You have not uploaded any logos.</p>
                  <Link href="/upload" className="text-[#d4a373] text-sm hover:underline">Upload your first logo →</Link>
                </div>
              ) : logos.map((logo, i) => (
                <div key={logo._id}
                  className="grid px-5 py-3.5 border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition items-center gap-0"
                  style={{ gridTemplateColumns: "56px 52px 1fr 120px 100px 100px" }}
                >
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-[#0d0d0d] border border-white/5 flex-shrink-0">
                    <img src={logo.imageUrl} alt={logo.title} className="w-full h-full object-cover" />
                  </div>
                  <span className="text-gray-700 text-[10px] font-mono">#{i + 1}</span>
                  <div className="min-w-0 pr-4">
                    {logo.status === "approved"
                      ? <Link href={`/logo/${logo._id}`} className="text-white text-sm font-semibold truncate block hover:text-[#d4a373] transition">{logo.title}</Link>
                      : <p className="text-white text-sm font-semibold truncate">{logo.title}</p>
                    }
                    <p className="text-gray-600 text-xs truncate">{logo.category}</p>
                  </div>
                  <span className="text-gray-500 text-xs">
                    {new Date(logo.createdAt).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                  <span className="text-gray-500 text-xs capitalize">{logo.type || "brand"}</span>
                  <span className={`text-[10px] px-2.5 py-1 rounded-full border w-fit ${STATUS_STYLE[logo.status] || STATUS_STYLE.pending}`}>
                    {logo.status === "approved" ? "✓ Live" : logo.status === "rejected" ? "✗ Rejected" : "⏳ Pending"}
                  </span>
                </div>
              ))}
            </div>

            <p className="text-gray-700 text-xs mt-4">
              Showing {logos.length} of {logos.length} entries
            </p>
          </div>
        )}

        {/* ══ PROFILE SETTINGS ══ */}
        {tab === "profile" && (
          <div className="max-w-lg space-y-5">
            {/* Country */}
            <div>
              <label className={labelClass}>Country</label>
              <select value={profile.country} onChange={(e) => setProfile({ ...profile, country: e.target.value })}
                className={inputClass + " appearance-none"}>
                <option value="">*** Select Country ***</option>
                {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Social links */}
            {[
              { key: "website", label: "Website" },
              { key: "facebook", label: "Facebook" },
              { key: "twitter", label: "Twitter / X" },
              { key: "instagram", label: "Instagram" },
              { key: "pinterest", label: "Pinterest" },
              { key: "linkedin", label: "LinkedIn" },
              { key: "behance", label: "Behance" },
              { key: "dribbble", label: "Dribbble" },
            ].map((f) => (
              <div key={f.key}>
                <label className={labelClass}>{f.label}</label>
                <input type="url" placeholder={`https://${f.key}.com/yourprofile`}
                  value={(profile as any)[f.key]}
                  onChange={(e) => setProfile({ ...profile, [f.key]: e.target.value })}
                  className={inputClass} />
              </div>
            ))}

            <button onClick={saveProfile} disabled={saving}
              className="w-full py-3.5 bg-[#d4a373] text-black font-bold uppercase tracking-widest text-sm rounded-xl hover:bg-[#e8b989] transition disabled:opacity-50">
              {saving ? "Saving..." : "Save Profile Settings"}
            </button>
          </div>
        )}

        {/* ══ EDIT ACCOUNT ══ */}
        {tab === "account" && (
          <div className="max-w-lg space-y-8">

            {/* Account Settings */}
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-bold text-base">Account Settings</h3>
                <span className="text-gray-600 text-xs">
                  Register Date: {user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-PK", { day: "numeric", month: "long", year: "numeric" }) : "—"}
                </span>
              </div>

              <div>
                <label className={labelClass}>Username</label>
                <p className="text-gray-600 text-xs mb-2">
                  Shown in navbar and profile URL.
                </p>
                <input type="text" value={account.username}
                  onChange={(e) => setAccount({ ...account, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "") })}
                  className={inputClass} placeholder="your_username" />
              </div>

              <div>
                <label className={labelClass}>Full Name</label>
                <input type="text" value={account.name}
                  onChange={(e) => setAccount({ ...account, name: e.target.value })}
                  className={inputClass} />
              </div>

              <div>
                <label className={labelClass}>Email</label>
                <input type="email" value={account.email}
                  onChange={(e) => setAccount({ ...account, email: e.target.value })}
                  className={inputClass} />
              </div>

              <button onClick={saveAccount} disabled={saving}
                className="w-full py-3.5 bg-[#d4a373] text-black font-bold uppercase tracking-widest text-sm rounded-xl hover:bg-[#e8b989] transition disabled:opacity-50">
                {saving ? "Saving..." : "Save Account Settings"}
              </button>
            </div>

            {/* Change Password */}
            <div className="space-y-5 pt-4 border-t border-white/5">
              <h3 className="text-white font-bold text-base">Change Password</h3>

              {[
                { label: "Current Password", key: "current", show: showPass.c, toggle: () => setShowPass(s => ({ ...s, c: !s.c })) },
                { label: "New Password", key: "newPass", show: showPass.n, toggle: () => setShowPass(s => ({ ...s, n: !s.n })) },
                { label: "Confirm New Password", key: "confirm", show: showPass.cf, toggle: () => setShowPass(s => ({ ...s, cf: !s.cf })) },
              ].map((f) => (
                <div key={f.key}>
                  <label className={labelClass}>{f.label}</label>
                  <div className="relative">
                    <input type={f.show ? "text" : "password"}
                      value={(passForm as any)[f.key]}
                      onChange={(e) => setPassForm({ ...passForm, [f.key]: e.target.value })}
                      className={inputClass + " pr-12"} />
                    <button type="button" onClick={f.toggle}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 transition">
                      {f.show ? (
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /><line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
                      ) : (
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1.8" /><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" /></svg>
                      )}
                    </button>
                  </div>
                </div>
              ))}

              <button onClick={changePassword} disabled={saving}
                className="w-full py-3.5 bg-[#d4a373] text-black font-bold uppercase tracking-widest text-sm rounded-xl hover:bg-[#e8b989] transition disabled:opacity-50">
                {saving ? "Updating..." : "Change Password"}
              </button>
            </div>

            {/* Delete Account */}
            <div className="pt-4 border-t border-white/5">
              <h3 className="text-white font-bold text-base mb-3">Delete Account</h3>
              <p className="text-gray-500 text-sm mb-4">Permanently delete your account and all your uploaded logos.</p>
              <button onClick={deleteAccount} disabled={deleting}
                className="border border-red-500/40 text-red-400 hover:bg-red-500/10 px-6 py-2.5 text-xs font-semibold uppercase tracking-widest rounded-xl transition disabled:opacity-50 flex items-center gap-2">
                {deleting ? (<><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="60" strokeDashoffset="20" /></svg>Deleting...</>) : "Delete My Account"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return <Suspense fallback={<div className="min-h-screen bg-[#0a0a0a]" />}><DashboardContent /></Suspense>;
}