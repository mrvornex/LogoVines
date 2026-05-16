"use client";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function LoginForm() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const registered   = searchParams.get("registered");
  const [form,    setForm]    = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const [show,    setShow]    = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError("");
    setLoading(true);
    try {
      const res  = await fetch("/api/auth/user-login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data = await res.json();
      if (data.success) { router.push("/"); router.refresh(); }
      else setError(data.message || "Login failed");
    } catch { setError("Something went wrong"); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, #d4a373 1px, transparent 0)`, backgroundSize: "40px 40px" }} />
      <div className="relative w-full max-w-md">
        <div className="text-center mb-10">
          <Link href="/"><h1 className="text-3xl font-extrabold tracking-widest text-[#d4a373] uppercase">Logo Vines</h1></Link>
          <p className="text-gray-600 text-xs tracking-[0.3em] uppercase mt-2">Member Login</p>
        </div>
        <div className="bg-[#111] border border-white/10 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-white text-xl font-bold mb-1">Welcome back</h2>
          <p className="text-gray-500 text-sm mb-8">Sign in to upload and manage your logos</p>
          {registered && <div className="mb-5 p-3 rounded-xl bg-green-900/20 border border-green-500/30 text-green-400 text-sm">✓ Account created! Please sign in.</div>}
          {error      && <div className="mb-5 p-3 rounded-xl bg-red-900/20 border border-red-500/30 text-red-400 text-sm">⚠ {error}</div>}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-widest mb-2">Email</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@email.com" required
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#d4a373] transition" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-widest mb-2">Password</label>
              <div className="relative">
                <input type={show ? "text" : "password"} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••••" required
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 pr-12 text-white text-sm focus:outline-none focus:border-[#d4a373] transition" />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 transition text-xs">{show ? "Hide" : "Show"}</button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full py-3.5 bg-[#d4a373] text-black font-bold uppercase tracking-widest text-sm rounded-xl hover:bg-[#e8b989] transition duration-300 disabled:opacity-50">
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
          <p className="text-center text-gray-600 text-sm mt-6">
            Don't have an account?{" "}
            <Link href="/signup" className="text-[#d4a373] hover:underline">Sign Up</Link>
          </p>
        </div>
        <p className="text-center mt-6"><Link href="/" className="text-gray-600 hover:text-[#d4a373] text-xs uppercase tracking-widest transition">← Back to Website</Link></p>
      </div>
    </div>
  );
}

export default function UserLoginPage() {
  return <Suspense><LoginForm /></Suspense>;
}