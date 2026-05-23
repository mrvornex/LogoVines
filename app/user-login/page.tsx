"use client";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function LoginForm() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const registered   = searchParams.get("registered");

  const [form,        setForm]        = useState({ email: "", password: "" });
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState("");
  const [show,        setShow]        = useState(false);
  const [notVerified, setNotVerified] = useState(false);
  const [resending,   setResending]   = useState(false);
  const [resendMsg,   setResendMsg]   = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(""); setNotVerified(false);
    setLoading(true);
    try {
      const res  = await fetch("/api/auth/user-login", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(form),
      });
      const data = await res.json();

      if (data.success) {
        router.push("/"); router.refresh();
      } else if (data.notVerified) {
        setNotVerified(true);
        setError(data.message);
      } else {
        setError(data.message || "Login failed");
      }
    } catch { setError("Something went wrong"); }
    finally { setLoading(false); }
  };

  const handleResend = async () => {
    if (!form.email) return setResendMsg("Enter your email first");
    setResending(true); setResendMsg("");
    try {
      const res  = await fetch("/api/auth/resend-verification", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email: form.email }),
      });
      const data = await res.json();
      setResendMsg(data.message || "Email sent!");
    } catch { setResendMsg("Failed to resend. Try again."); }
    finally { setResending(false); }
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
          <p className="text-gray-500 text-sm mb-7">Sign in to upload and manage your logos</p>

          {/* Success — just registered */}
          {registered && !error && (
            <div className="mb-5 p-4 rounded-xl bg-[#d4a373]/10 border border-[#d4a373]/30 text-[#d4a373] text-sm space-y-2">
              <p className="font-bold">✉️ Verification email sent!</p>
              <p className="text-[#d4a373]/80 text-xs leading-relaxed">
                Please check your inbox and click the verification link to activate your account.
              </p>
              <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-3 mt-2">
                <p className="text-yellow-300 text-xs font-semibold mb-1">⚠️ Email in Spam?</p>
                <p className="text-yellow-400/80 text-xs leading-relaxed">
                  If you don't see the email in your inbox, check your <strong>Spam / Junk</strong> folder.
                  Open the email and click <strong>"Report as not spam"</strong> or <strong>"Not spam"</strong> to move it to inbox.
                </p>
              </div>
            </div>
          )}

          {/* Error */}
          {error && !notVerified && (
            <div className="mb-5 p-3 rounded-xl bg-red-900/20 border border-red-500/30 text-red-400 text-sm">⚠ {error}</div>
          )}

          {/* Not verified — special box */}
          {notVerified && (
            <div className="mb-5 p-4 rounded-xl bg-yellow-900/20 border border-yellow-500/30 text-yellow-300 text-sm">
              <p className="font-semibold mb-1">📧 Email not verified</p>
              <p className="text-yellow-400/80 text-xs mb-3">Check your inbox for the verification link.</p>
              <button
                onClick={handleResend}
                disabled={resending}
                className="text-[#d4a373] text-xs font-semibold uppercase tracking-widest hover:underline disabled:opacity-50 flex items-center gap-1"
              >
                {resending ? (
                  <><svg className="animate-spin w-3 h-3" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="60" strokeDashoffset="20"/></svg>Sending...</>
                ) : "↺ Resend verification email"}
              </button>
              {resendMsg && <p className="text-xs mt-2 text-green-400">{resendMsg}</p>}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-widest mb-2">Email</label>
              <input type="email" value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@email.com" required
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#d4a373] transition" />
            </div>

            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-widest mb-2">Password</label>
              <div className="relative">
                <input type={show ? "text" : "password"} value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••" required
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 pr-16 text-white text-sm focus:outline-none focus:border-[#d4a373] transition" />
                <button type="button" onClick={() => setShow(!show)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 transition text-xs uppercase tracking-widest">
                  {show ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3.5 bg-[#d4a373] text-black font-bold uppercase tracking-widest text-sm rounded-xl hover:bg-[#e8b989] transition disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? (
                <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="60" strokeDashoffset="20"/></svg>Signing in...</>
              ) : "Sign In"}
            </button>
          </form>

          <p className="text-center text-gray-600 text-sm mt-6">
            Don't have an account?{" "}
            <Link href="/signup" className="text-[#d4a373] hover:underline">Sign Up</Link>
          </p>
        </div>

        <p className="text-center mt-6">
          <Link href="/" className="text-gray-600 hover:text-[#d4a373] text-xs uppercase tracking-widest transition">← Back to Website</Link>
        </p>
      </div>
    </div>
  );
}

export default function UserLoginPage() {
  return <Suspense><LoginForm /></Suspense>;
}