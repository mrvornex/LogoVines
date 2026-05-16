"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();
  const [form,    setForm]    = useState({ name: "", email: "", password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const [show,    setShow]    = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError("");
    if (form.password !== form.confirm) return setError("Passwords do not match");
    setLoading(true);
    try {
      const res  = await fetch("/api/auth/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: form.name, email: form.email, password: form.password }) });
      const data = await res.json();
      if (data.success) router.push("/user-login?registered=1");
      else setError(data.message || "Registration failed");
    } catch { setError("Something went wrong"); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, #d4a373 1px, transparent 0)`, backgroundSize: "40px 40px" }} />
      <div className="relative w-full max-w-md">
        <div className="text-center mb-10">
          <Link href="/"><h1 className="text-3xl font-extrabold tracking-widest text-[#d4a373] uppercase">Logo Vines</h1></Link>
          <p className="text-gray-600 text-xs tracking-[0.3em] uppercase mt-2">Create Account</p>
        </div>
        <div className="bg-[#111] border border-white/10 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-white text-xl font-bold mb-1">Join LogoVines</h2>
          <p className="text-gray-500 text-sm mb-8">Upload and share your logo designs</p>
          {error && <div className="mb-5 p-3 rounded-xl bg-red-900/20 border border-red-500/30 text-red-400 text-sm">⚠ {error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            {[{ label: "Full Name", key: "name", type: "text", placeholder: "Ahmad Khan" },
              { label: "Email",     key: "email", type: "email", placeholder: "you@email.com" }].map((f) => (
              <div key={f.key}>
                <label className="block text-xs text-gray-500 uppercase tracking-widest mb-2">{f.label}</label>
                <input type={f.type} value={(form as any)[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} placeholder={f.placeholder} required
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#d4a373] transition" />
              </div>
            ))}
            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-widest mb-2">Password</label>
              <div className="relative">
                <input type={show ? "text" : "password"} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Min 6 characters" required
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 pr-12 text-white text-sm focus:outline-none focus:border-[#d4a373] transition" />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 transition text-xs">{show ? "Hide" : "Show"}</button>
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-widest mb-2">Confirm Password</label>
              <input type="password" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} placeholder="Repeat password" required
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#d4a373] transition" />
            </div>
            <button type="submit" disabled={loading} className="w-full py-3.5 bg-[#d4a373] text-black font-bold uppercase tracking-widest text-sm rounded-xl hover:bg-[#e8b989] transition duration-300 disabled:opacity-50 mt-2">
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>
          <p className="text-center text-gray-600 text-sm mt-6">
            Already have an account?{" "}
            <Link href="/user-login" className="text-[#d4a373] hover:underline">Sign In</Link>
          </p>
        </div>
        <p className="text-center mt-6"><Link href="/" className="text-gray-600 hover:text-[#d4a373] text-xs uppercase tracking-widest transition">← Back to Website</Link></p>
      </div>
    </div>
  );
}