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

  const inputClass = "w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[#1A4450] text-sm placeholder-gray-400 focus:outline-none focus:border-[#1A4450] transition";

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/">
            <h1 className="text-xl font-extrabold tracking-widest text-[#1A4450] uppercase">Logo Vines</h1>
          </Link>
          <p className="text-[#1A4450]/50 text-[10px] tracking-[0.3em] uppercase mt-1">Member Login</p>
        </div>

        {/* Card */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-[#1A4450] text-base font-bold mb-0.5">Welcome back</h2>
          <p className="text-gray-400 text-xs mb-5">Sign in to upload and manage your logos</p>

          {/* Registered success */}
          {registered && !error && (
            <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-xs space-y-1">
              <p className="font-bold">✉️ Verification email sent!</p>
              <p>Check your inbox and click the verification link.</p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2 mt-1">
                <p className="text-yellow-700 text-[10px] font-semibold">⚠️ Email in Spam?</p>
                <p className="text-yellow-600 text-[10px]">Check Spam/Junk folder and click "Not spam".</p>
              </div>
            </div>
          )}

          {/* Error */}
          {error && !notVerified && (
            <div className="mb-4 p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-500 text-xs">⚠ {error}</div>
          )}

          {/* Not verified */}
          {notVerified && (
            <div className="mb-4 p-3 rounded-lg bg-yellow-50 border border-yellow-200 text-yellow-700 text-xs">
              <p className="font-semibold mb-1">📧 Email not verified</p>
              <p className="mb-2">Check your inbox for the verification link.</p>
              <button onClick={handleResend} disabled={resending}
                className="text-[#1A4450] font-semibold hover:underline disabled:opacity-50 flex items-center gap-1"
              >
                {resending ? (
                  <><svg className="animate-spin w-3 h-3" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="60" strokeDashoffset="20"/></svg>Sending...</>
                ) : "↺ Resend verification email"}
              </button>
              {resendMsg && <p className="mt-1 text-green-600">{resendMsg}</p>}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-[10px] text-[#1A4450]/60 uppercase tracking-widest mb-1">Email</label>
              <input type="email" value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@email.com" required className={inputClass} />
            </div>

            <div>
              <label className="block text-[10px] text-[#1A4450]/60 uppercase tracking-widest mb-1">Password</label>
              <div className="relative">
                <input type={show ? "text" : "password"} value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••" required className={inputClass + " pr-14"} />
                <button type="button" onClick={() => setShow(!show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#1A4450] text-[10px] uppercase tracking-widest transition">
                  {show ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-2.5 bg-[#1A4450] text-white font-bold uppercase tracking-widest text-xs rounded-lg hover:bg-[#1A4450]/80 transition disabled:opacity-50 flex items-center justify-center gap-2 mt-1"
            >
              {loading
                ? <><svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="60" strokeDashoffset="20"/></svg>Please wait...</>
                : "Sign In"}
            </button>
          </form>

          <p className="text-center text-gray-400 text-xs mt-4">
            Don't have an account?{" "}
            <Link href="/signup" className="text-[#1A4450] font-semibold hover:underline">Sign Up</Link>
          </p>
        </div>

        <p className="text-center mt-4">
          <Link href="/" className="text-gray-400 hover:text-[#1A4450] text-[10px] uppercase tracking-widest transition">← Back to Website</Link>
        </p>
      </div>
    </div>
  );
}

export default function UserLoginPage() {
  return <Suspense><LoginForm /></Suspense>;
}