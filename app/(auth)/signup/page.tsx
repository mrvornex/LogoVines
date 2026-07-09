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

  const inputClass = "w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[#1A4450] text-sm placeholder-gray-400 focus:outline-none focus:border-[#1A4450] transition";

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-10">

      <div className="w-full max-w-md">

        {/* Logo heading */}
        <div className="text-center mb-8">
          <Link href="/">
            <h1 className="text-3xl font-extrabold tracking-widest text-[#1A4450] uppercase">Logo Vines</h1>
          </Link>
          <p className="text-[#1A4450]/50 text-xs tracking-[0.3em] uppercase mt-2">Create Account</p>
        </div>

        {/* Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">

          {/* Email Sent */}
          {sent ? (
            <div className="space-y-5 text-center">
              <div className="text-6xl">✉️</div>
              <h3 className="text-[#1A4450] font-bold text-xl">Check your email!</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                We sent a verification link to <strong className="text-[#1A4450]">{form.email}</strong>. Click the link to activate your account.
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-left">
                <p className="text-yellow-700 text-xs font-bold mb-1">⚠️ Email going to Spam?</p>
                <p className="text-yellow-600 text-xs leading-relaxed">
                  Check your <strong>Spam / Junk</strong> folder. Open the email and click <strong>"Not spam"</strong>.
                </p>
              </div>
              <Link href="/user-login"
                className="block w-full text-center py-3.5 bg-[#1A4450] text-white font-bold uppercase tracking-widest text-sm rounded-xl hover:bg-[#1A4450]/80 transition"
              >
                Go to Sign In →
              </Link>
            </div>

          ) : (
            <>
              <h2 className="text-[#1A4450] text-xl font-bold mb-1">Join LogoVines</h2>
              <p className="text-gray-400 text-sm mb-7">Upload and share your logo designs</p>

              {error && (
                <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-500 text-sm">⚠ {error}</div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs text-[#1A4450]/60 uppercase tracking-widest mb-2">Full Name</label>
                  <input type="text" value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Ahmad Khan" required className={inputClass} />
                </div>

                <div>
                  <label className="block text-xs text-[#1A4450]/60 uppercase tracking-widest mb-2">Username</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">@</span>
                    <input type="text" value={form.username}
                      onChange={(e) => setForm({ ...form, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "") })}
                      placeholder="ahmad_khan" required
                      className={inputClass + " pl-8"} />
                  </div>
                  <p className="text-gray-400 text-[10px] mt-1">Only letters, numbers, underscores.</p>
                </div>

                <div>
                  <label className="block text-xs text-[#1A4450]/60 uppercase tracking-widest mb-2">Email</label>
                  <input type="email" value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="you@email.com" required className={inputClass} />
                </div>

                <div>
                  <label className="block text-xs text-[#1A4450]/60 uppercase tracking-widest mb-2">Password</label>
                  <div className="relative">
                    <input type={show ? "text" : "password"} value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      placeholder="Min 6 characters" required
                      className={inputClass + " pr-16"} />
                    <button type="button" onClick={() => setShow(!show)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#1A4450] transition text-xs uppercase tracking-widest"
                    >{show ? "Hide" : "Show"}</button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-[#1A4450]/60 uppercase tracking-widest mb-2">Confirm Password</label>
                  <input type="password" value={form.confirm}
                    onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                    placeholder="Repeat password" required className={inputClass} />
                </div>

                <button type="submit" disabled={loading}
                  className="w-full py-3.5 bg-[#1A4450] text-white font-bold uppercase tracking-widest text-sm rounded-xl hover:bg-[#1A4450]/80 transition disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
                >
                  {loading ? (
                    <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="60" strokeDashoffset="20"/></svg>Creating Account...</>
                  ) : "Create Account"}
                </button>
              </form>

              <p className="text-center text-gray-400 text-sm mt-6">
                Already have an account?{" "}
                <Link href="/user-login" className="text-[#1A4450] font-semibold hover:underline">Sign In</Link>
              </p>
            </>
          )}
        </div>

        <p className="text-center mt-6">
          <Link href="/" className="text-gray-400 hover:text-[#1A4450] text-xs uppercase tracking-widest transition">← Back to Website</Link>
        </p>
      </div>
    </div>
  );
}