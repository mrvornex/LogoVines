"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass]  = useState(false);
  const [loading,  setLoading]   = useState(false);
  const [error,    setError]     = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password.trim()) {
      return setError("Please enter username and password");
    }

    setLoading(true);

    try {
      const res  = await fetch("/api/auth/login", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (data.success) {
        router.push("/admin");
        router.refresh();
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#ffffff] flex items-center justify-center px-4">

      {/* Background subtle pattern */}
      <div className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #d4a373 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold tracking-widest text-[#1A4450] uppercase">
            Logo Vines
          </h1>
          <p className="text-[#1A4450] text-xs tracking-[0.3em] uppercase mt-2">
            Admin Portal
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#fff] border border-white/10 rounded-2xl p-8 shadow-1xl">

          <h2 className="text-[#1A4450] text-xl font-bold mb-1">Welcome back</h2>
          <p className="text-[#1A4450] text-sm mb-8">Sign in to manage your portfolio</p>

          {/* Error */}
          {error && (
            <div className="mb-6 p-3 rounded-xl bg-red-900/20 border border-red-500/30 text-red-400 text-sm flex items-center gap-2">
              <span>⚠</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Username */}
            <div>
              <label className="block text-xs text-[#1A4450] uppercase tracking-widest mb-2">
                Username
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1A4450]">
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                    <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2"/>
                    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  autoComplete="username"
                  className="w-full bg-[#ffffff] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-[#1A4450] text-sm focus:outline-none focus:border-[#d4a373] transition placeholder-gray-700"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs text-[#1A4450] uppercase tracking-widest mb-2">
                Password
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1A4450]">
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                    <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="2"/>
                    <path d="M8 11V7a4 4 0 1 1 8 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </span>
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full bg-[#ffffff] border border-white/10 rounded-xl pl-11 pr-12 py-3 text-[#1A4450] text-sm focus:outline-none focus:border-[#d4a373] transition placeholder-gray-700"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-#1A4450 transition"
                >
                  {showPass ? (
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                      <path d="M3 3l18 18M10.5 10.5A3 3 0 0 0 13.5 13.5M6.5 6.5A9.77 9.77 0 0 0 3 12c2 4 5.4 7 9 7a9.26 9.26 0 0 0 5.5-1.9M9 5.1A9.15 9.15 0 0 1 12 5c3.6 0 7 3 9 7a11 11 0 0 1-1.4 2.4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  ) : (
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                      <path d="M3 12c2-4 5.4-7 9-7s7 3 9 7c-2 4-5.4 7-9 7s-7-3-9-7z" stroke="currentColor" strokeWidth="2"/>
                      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#1A4450] text-white font-bold uppercase tracking-widest text-sm rounded-xl transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin" width="16" height="16" fill="none" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="60" strokeDashoffset="20"/>
                  </svg>
                  Signing in...
                </span>
              ) : "Sign In"}
            </button>
          </form>
        </div>

        {/* Back link */}
        <p className="text-center mt-6">
          <a href="/" className="text-[#1A4450] text-xs uppercase tracking-widest transition">
            ← Back to Website
          </a>
        </p>
      </div>
    </div>
  );
}