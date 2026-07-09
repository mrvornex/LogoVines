"use client";
import { useState } from "react";
import Link from "next/link";

export default function SignupPage() {
  const [form,    setForm]    = useState({ name: "", username: "", email: "", password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [sent,    setSent]    = useState(false);
  const [error,   setError]   = useState("");
  const [show,    setShow]    = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError("");
    if (form.password !== form.confirm) return setError("Passwords do not match");
    setLoading(true);
    try {
      const res  = await fetch("/api/auth/register", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ name: form.name, username: form.username, email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (data.success) setSent(true);
      else setError(data.message || "Registration failed");
    } catch { setError("Something went wrong"); }
    finally { setLoading(false); }
  };

  const inputClass = "w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-[#1A4450] text-sm placeholder-gray-400 focus:outline-none focus:border-[#1A4450] transition";

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-6">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-5 mt-9">
          <Link href="/">
            <h1 className="text-xl font-extrabold tracking-widest text-[#1A4450] uppercase">Logo Vines</h1>
          </Link>
          <p className="text-[#1A4450]/50 text-[10px] tracking-[0.3em] uppercase mt-1">Create Account</p>
        </div>

        {/* Card */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">

          {sent ? (
            <div className="space-y-4 text-center">
              <div className="text-4xl">✉️</div>
              <h3 className="text-[#1A4450] font-bold text-base">Check your email!</h3>
              <p className="text-gray-500 text-xs leading-relaxed">
                Verification link sent to <strong className="text-[#1A4450]">{form.email}</strong>
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-left">
                <p className="text-yellow-700 text-[10px] font-bold mb-1">⚠️ Email in Spam?</p>
                <p className="text-yellow-600 text-[10px] leading-relaxed">Check Spam/Junk folder and click "Not spam".</p>
              </div>
              <Link href="/user-login" className="block w-full text-center py-2.5 bg-[#1A4450] text-white font-bold uppercase tracking-widest text-xs rounded-lg hover:bg-[#1A4450]/80 transition">
                Go to Sign In →
              </Link>
            </div>
          ) : (
            <>
              <h2 className="text-[#1A4450] text-base font-bold mb-0.5">Join LogoVines</h2>
              <p className="text-gray-400 text-xs mb-5">Upload and share your logo designs</p>

              {error && <div className="mb-4 p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-500 text-xs">⚠ {error}</div>}

              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="block text-[10px] text-[#1A4450]/60 uppercase tracking-widest mb-1">Full Name</label>
                  <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ahmad Khan" required className={inputClass} />
                </div>

                <div>
                  <label className="block text-[10px] text-[#1A4450]/60 uppercase tracking-widest mb-1">Username</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">@</span>
                    <input type="text" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "") })} placeholder="ahmad_khan" required className={inputClass + " pl-7"} />
                  </div>
                  <p className="text-gray-400 text-[10px] mt-0.5">Letters, numbers, underscores only.</p>
                </div>

                <div>
                  <label className="block text-[10px] text-[#1A4450]/60 uppercase tracking-widest mb-1">Email</label>
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@email.com" required className={inputClass} />
                </div>

                <div>
                  <label className="block text-[10px] text-[#1A4450]/60 uppercase tracking-widest mb-1">Password</label>
                  <div className="relative">
                    <input type={show ? "text" : "password"} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Min 6 characters" required className={inputClass + " pr-14"} />
                    <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#1A4450] text-[10px] uppercase tracking-widest transition">
                      {show ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-[#1A4450]/60 uppercase tracking-widest mb-1">Confirm Password</label>
                  <input type="password" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} placeholder="Repeat password" required className={inputClass} />
                </div>

                <button type="submit" disabled={loading}
                  className="w-full py-2.5 bg-[#1A4450] text-white font-bold uppercase tracking-widest text-xs rounded-lg hover:bg-[#1A4450]/80 transition disabled:opacity-50 flex items-center justify-center gap-2 mt-1"
                >
                  {loading ? <><svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="60" strokeDashoffset="20"/></svg>Creating...</> : "Create Account"}
                </button>
              </form>

              <p className="text-center text-gray-400 text-xs mt-4">
                Already have an account?{" "}
                <Link href="/user-login" className="text-[#1A4450] font-semibold hover:underline">Sign In</Link>
              </p>
            </>
          )}
        </div>

        <p className="text-center mt-4">
          <Link href="/" className="text-gray-400 hover:text-[#1A4450] text-[10px] uppercase tracking-widest transition">← Back to Website</Link>
        </p>
      </div>
    </div>
  );
}