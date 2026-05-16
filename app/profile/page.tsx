"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function ProfilePage() {
  const router = useRouter();
  const [user,    setUser]    = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [deleting,setDeleting]= useState(false);
  const [msg,     setMsg]     = useState<{ type: "success"|"error"; text: string }|null>(null);
  const [form,    setForm]    = useState({ name: "", email: "", password: "", newPassword: "", confirmNew: "" });
  const [tab,     setTab]     = useState<"info"|"password"|"danger">("info");

  useEffect(() => {
    fetch("/api/user/profile")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) { setUser(d.user); setForm((f) => ({ ...f, name: d.user.name, email: d.user.email })); }
        else router.push("/user-login");
      })
      .finally(() => setLoading(false));
  }, []);

  const showMsg = (type: "success"|"error", text: string) => { setMsg({ type, text }); setTimeout(() => setMsg(null), 3000); };

  const handleSave = async () => {
    setSaving(true);
    const body: any = { name: form.name, email: form.email };
    if (tab === "password") { body.password = form.password; body.newPassword = form.newPassword; }
    if (tab === "password" && form.newPassword !== form.confirmNew) { showMsg("error", "Passwords do not match"); setSaving(false); return; }
    const res  = await fetch("/api/user/profile", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const data = await res.json();
    if (data.success) showMsg("success", "Profile updated!");
    else showMsg("error", data.message || "Update failed");
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure? This cannot be undone.")) return;
    setDeleting(true);
    await fetch("/api/user/profile", { method: "DELETE" });
    router.push("/");
  };

  if (loading) return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center"><div className="w-8 h-8 border-2 border-[#d4a373] border-t-transparent rounded-full animate-spin" /></div>;

  const initials = user?.name?.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="bg-[#0a0a0a] min-h-screen">
      <Navbar />
      <div className="pt-24 max-w-3xl mx-auto px-6 pb-20">

        {/* Profile header */}
        <div className="flex items-center gap-5 mb-10">
          <div className="w-16 h-16 rounded-2xl bg-[#d4a373]/20 border border-[#d4a373]/30 flex items-center justify-center text-[#d4a373] font-bold text-xl">
            {initials}
          </div>
          <div>
            <h1 className="text-white text-2xl font-bold">{user?.name}</h1>
            <p className="text-gray-500 text-sm">{user?.email}</p>
          </div>
          <Link href="/my-uploads" className="ml-auto border border-white/10 text-gray-400 hover:border-[#d4a373] hover:text-[#d4a373] text-xs uppercase tracking-widest px-5 py-2.5 rounded-xl transition">
            My Uploads →
          </Link>
        </div>

        {/* Tab bar */}
        <div className="flex border-b border-white/5 mb-8 gap-0">
          {([["info","Account Info"],["password","Password"],["danger","Danger Zone"]] as const).map(([k, l]) => (
            <button key={k} onClick={() => setTab(k)}
              className={`px-6 py-3 text-xs font-semibold uppercase tracking-widest border-b-2 transition ${tab === k ? "border-[#d4a373] text-[#d4a373]" : "border-transparent text-gray-500 hover:text-white"}`}
            >{l}</button>
          ))}
        </div>

        {msg && <div className={`mb-6 p-3 rounded-xl text-sm border ${msg.type === "success" ? "bg-green-900/20 border-green-500/30 text-green-400" : "bg-red-900/20 border-red-500/30 text-red-400"}`}>{msg.type === "success" ? "✓" : "⚠"} {msg.text}</div>}

        <div className="bg-[#111] border border-white/5 rounded-2xl p-7 space-y-5">

          {tab === "info" && (
            <>
              <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-5">Account Information</h3>
              <div>
                <label className="block text-xs text-gray-500 uppercase tracking-widest mb-2">Full Name</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#d4a373] transition" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 uppercase tracking-widest mb-2">Email Address</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#d4a373] transition" />
              </div>
              <button onClick={handleSave} disabled={saving} className="w-full py-3.5 bg-[#d4a373] text-black font-bold uppercase tracking-widest text-sm rounded-xl hover:bg-[#e8b989] transition disabled:opacity-50">
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </>
          )}

          {tab === "password" && (
            <>
              <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-5">Change Password</h3>
              {[
                { label: "Current Password", key: "password",   placeholder: "Your current password" },
                { label: "New Password",      key: "newPassword", placeholder: "Min 6 characters" },
                { label: "Confirm New",       key: "confirmNew",  placeholder: "Repeat new password" },
              ].map((f) => (
                <div key={f.key}>
                  <label className="block text-xs text-gray-500 uppercase tracking-widest mb-2">{f.label}</label>
                  <input type="password" value={(form as any)[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} placeholder={f.placeholder}
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#d4a373] transition" />
                </div>
              ))}
              <button onClick={handleSave} disabled={saving} className="w-full py-3.5 bg-[#d4a373] text-black font-bold uppercase tracking-widest text-sm rounded-xl hover:bg-[#e8b989] transition disabled:opacity-50">
                {saving ? "Updating..." : "Update Password"}
              </button>
            </>
          )}

          {tab === "danger" && (
            <>
              <h3 className="text-red-400 font-bold text-sm uppercase tracking-widest mb-5">Danger Zone</h3>
              <div className="border border-red-500/20 rounded-xl p-5">
                <p className="text-white font-semibold mb-1">Delete Account</p>
                <p className="text-gray-500 text-sm mb-5">Once deleted, your account and all uploads cannot be recovered.</p>
                <button onClick={handleDelete} disabled={deleting} className="border border-red-500/40 text-red-400 hover:bg-red-500/10 px-6 py-2.5 text-xs uppercase tracking-widest rounded-xl transition disabled:opacity-50">
                  {deleting ? "Deleting..." : "Delete My Account"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}