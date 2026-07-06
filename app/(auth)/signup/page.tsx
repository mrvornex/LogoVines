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

  return (
    <div className="min-h-screen bg-[#1A4450] flex items-center justify-center px-4">
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, #d4a373 1px, transparent 0)`, backgroundSize: "40px 40px" }} />

      <div className="relative w-full max-w-md">
        <div className="text-center mb-10">
          <Link href="/"><h1 className="text-3xl font-extrabold tracking-widest text-[#ffffff] uppercase">Logo Vines</h1></Link>
          <p className="text-white text-xs tracking-[0.3em] uppercase mt-2">Create Account</p>
        </div>

        <div className="bg-[#1A4450] border border-white/10 rounded-2xl p-8 shadow-2xl">

          {/* ── Email Sent Screen ── */}
          {sent ? (
            <div className="space-y-5 text-center">
              <div className="text-6xl">✉️</div>
              <h3 className="text-white font-bold text-xl">Check your email!</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                We sent a verification link to <strong className="text-white">{form.email}</strong>. Click the link to activate your account.
              </p>

              {/* Spam warning */}
              <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-xl p-4 text-left">
                <p className="text-yellow-300 text-xs font-bold mb-1">⚠️ Email going to Spam?</p>
                <p className="text-yellow-400/70 text-xs leading-relaxed">
                  Check your <strong className="text-yellow-300">Spam / Junk</strong> folder if you don't see it in inbox.
                  Open the email and click <strong className="text-yellow-300">"Report as not spam"</strong> to move it to inbox.
                </p>
              </div>

              <Link href="/user-login"
                className="block w-full text-center py-3.5 bg-[#1A4450] text-white font-bold uppercase tracking-widest text-sm rounded-xl hover:bg-[#e8b989] transition"
              >
                Go to Sign In →
              </Link>
            </div>

          ) : (
            /* ── Signup Form ── */
            <>
              <h2 className="text-white text-xl font-bold mb-1">Join LogoVines</h2>
              <p className="text-white text-sm mb-7">Upload and share your logo designs</p>

              {error && (
                <div className="mb-5 p-3 rounded-xl bg-red-900/20 border border-red-500/30 text-red-400 text-sm">⚠ {error}</div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs text-white uppercase tracking-widest mb-2">Full Name</label>
                  <input type="text" value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Ahmad Khan" required
                    className="w-full bg-[#1A4450] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-white/10 transition"
                  />
                </div>

                {/* Username */}
                <div>
                  <label className="block text-xs text-white uppercase tracking-widest mb-2">Username</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 text-sm">@</span>
                    <input type="text" value={form.username}
                      onChange={(e) => setForm({ ...form, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "") })}
                      placeholder="ahmad_khan" required
                      className="w-full bg-[#1A4450] border border-white/10 rounded-xl pl-8 pr-4 py-3 text-white text-sm focus:outline-none transition"
                    />
                  </div>
                  <p className="text-white text-[10px] mt-1">Only letters, numbers, underscores. Shown in navbar.</p>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs text-white uppercase tracking-widest mb-2">Email</label>
                  <input type="email" value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="you@email.com" required
                    className="w-full bg-[#1A4450] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none  transition"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs text-white uppercase tracking-widest mb-2">Password</label>
                  <div className="relative">
                    <input type={show ? "text" : "password"} value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      placeholder="Min 6 characters" required
                      className="w-full bg-[#1A4450] border border-white/10 rounded-xl px-4 py-3 pr-16 text-white text-sm focus:outline-none transition"
                    />
                    <button type="button" onClick={() => setShow(!show)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 transition text-xs uppercase tracking-widest"
                    >
                      {show ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-xs text-gray-500 uppercase tracking-widest mb-2">Confirm Password</label>
                  <input type="password" value={form.confirm}
                    onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                    placeholder="Repeat password" required
                    className="w-full bg-[#1A4450] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none  transition"
                  />
                </div>

                <button type="submit" disabled={loading}
                  className="w-full py-3.5 bg-[#ffffff] text-[#1A4450] font-bold uppercase tracking-widest text-sm rounded-xl hover:bg-[hsl(0,0%,94%)] transition disabled:opacity-50 flex items-center justify-center gap-2 mt-2 cursor-pointer"
                >
                  {loading ? (
                    <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="60" strokeDashoffset="20"/></svg>Creating Account...</>
                  ) : "Create Account"}
                </button>
              </form>

              <p className="text-center text-white text-sm mt-6">
                Already have an account?{" "}
                <Link href="/user-login" className="text-[#ffffff] hover:underline">Sign In</Link>
              </p>
            </>
          )}
        </div>

        <p className="text-center mt-6">
          <Link href="/" className="text-white text-xs uppercase tracking-widest transition">← Back to Website</Link>
        </p>
      </div>
    </div>
  );
}