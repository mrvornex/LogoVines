"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton() {
  const router  = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="cursor-pointer flex items-center gap-2 border border-red-500/40 text-red-400 px-4 py-2 text-xs uppercase tracking-widest hover:bg-red-500/10 transition rounded-lg disabled:opacity-50"
    >
      <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      {loading ? "Logging out..." : "Logout"}
    </button>
  );
}