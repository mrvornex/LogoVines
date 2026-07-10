"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function VerifyContent() {
  const searchParams = useSearchParams();
  const token        = searchParams.get("token");

  const [status,  setStatus]  = useState<"loading"|"success"|"error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) { setStatus("error"); setMessage("No verification token found."); return; }
    fetch(`/api/auth/verify-email?token=${token}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) { setStatus("success"); setMessage(d.message); }
        else           { setStatus("error");   setMessage(d.message); }
      })
      .catch(() => { setStatus("error"); setMessage("Something went wrong."); });
  }, [token]);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm text-center">

        {/* Logo */}
        <Link href="/">
          <h1 className="text-xl font-extrabold tracking-widest text-[#1A4450] uppercase mb-8">Logo Vines</h1>
        </Link>

        {/* Card */}
        <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">

          {/* Loading */}
          {status === "loading" && (
            <>
              <div className="w-10 h-10 border-2 border-[#1A4450] border-t-transparent rounded-full animate-spin mx-auto mb-5" />
              <h2 className="text-[#1A4450] text-base font-bold mb-1">Verifying...</h2>
              <p className="text-gray-400 text-sm">Please wait while we verify your email.</p>
            </>
          )}

          {/* Success */}
          {status === "success" && (
            <>
              <div className="w-14 h-14 bg-green-50 border border-green-200 rounded-full flex items-center justify-center mx-auto mb-5">
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="#16a34a" strokeWidth="1.8"/>
                  <path d="M8 12l3 3 5-5" stroke="#16a34a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h2 className="text-[#1A4450] text-base font-bold mb-2">Email Verified!</h2>
              <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                Your email has been verified. You can now sign in to your account.
              </p>
              <Link href="/user-login"
                className="block w-full py-2.5 bg-[#1A4450] text-white font-bold uppercase tracking-widest text-xs rounded-lg hover:bg-[#1A4450]/80 transition"
              >
                Sign In Now →
              </Link>
            </>
          )}

          {/* Error */}
          {status === "error" && (
            <>
              <div className="w-14 h-14 bg-red-50 border border-red-200 rounded-full flex items-center justify-center mx-auto mb-5">
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="#ef4444" strokeWidth="1.8"/>
                  <path d="M15 9l-6 6M9 9l6 6" stroke="#ef4444" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
              </div>
              <h2 className="text-[#1A4450] text-base font-bold mb-2">Verification Failed</h2>
              <p className="text-red-500 text-sm mb-6 leading-relaxed">{message}</p>
              <div className="flex flex-col gap-3">
                <Link href="/signup"
                  className="block w-full py-2.5 bg-[#1A4450] text-white font-bold uppercase tracking-widest text-xs rounded-lg hover:bg-[#1A4450]/80 transition"
                >
                  Sign Up Again
                </Link>
                <Link href="/" className="text-gray-400 hover:text-[#1A4450] text-xs uppercase tracking-widest transition">
                  Back to Home
                </Link>
              </div>
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

export default function VerifyEmailPage() {
  return <Suspense fallback={<div className="min-h-screen bg-white" />}><VerifyContent /></Suspense>;
}