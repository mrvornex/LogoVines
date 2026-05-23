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
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, #d4a373 1px, transparent 0)`, backgroundSize: "40px 40px" }} />

      <div className="relative w-full max-w-md text-center">
        <Link href="/"><h1 className="text-3xl font-extrabold tracking-widest text-[#d4a373] uppercase mb-10">Logo Vines</h1></Link>

        <div className="bg-[#111] border border-white/10 rounded-2xl p-10 shadow-2xl">

          {/* Loading */}
          {status === "loading" && (
            <>
              <div className="w-14 h-14 border-2 border-[#d4a373] border-t-transparent rounded-full animate-spin mx-auto mb-6" />
              <h2 className="text-white text-xl font-bold mb-2">Verifying...</h2>
              <p className="text-gray-500 text-sm">Please wait while we verify your email.</p>
            </>
          )}

          {/* Success */}
          {status === "success" && (
            <>
              <div className="w-16 h-16 bg-green-900/30 border border-green-500/40 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">✅</div>
              <h2 className="text-white text-xl font-bold mb-3">Email Verified!</h2>
              <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                Your email has been verified successfully. You can now login to your account.
              </p>
              <Link href="/user-login"
                className="inline-block bg-[#d4a373] text-black font-bold uppercase tracking-widest text-sm px-8 py-3.5 rounded-xl hover:bg-[#e8b989] transition"
              >
                Sign In Now →
              </Link>
            </>
          )}

          {/* Error */}
          {status === "error" && (
            <>
              <div className="w-16 h-16 bg-red-900/30 border border-red-500/40 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">❌</div>
              <h2 className="text-white text-xl font-bold mb-3">Verification Failed</h2>
              <p className="text-red-400 text-sm mb-8 leading-relaxed">{message}</p>
              <div className="flex flex-col gap-3">
                <Link href="/signup"
                  className="inline-block bg-[#d4a373] text-black font-bold uppercase tracking-widest text-sm px-8 py-3.5 rounded-xl hover:bg-[#e8b989] transition"
                >
                  Sign Up Again
                </Link>
                <Link href="/" className="text-gray-600 hover:text-[#d4a373] text-xs uppercase tracking-widest transition">
                  Back to Home
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return <Suspense fallback={<div className="min-h-screen bg-[#0a0a0a]" />}><VerifyContent /></Suspense>;
}