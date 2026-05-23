"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

const NAV_LINKS = [
  { label: "Home",      href: "/"          },
  { label: "Logos",     href: "/logos"     },
  { label: "Templates", href: "/templates" },
  { label: "Pricing",   href: "/pricing"   },
  { label: "Contact",   href: "/#contact"  },
];

interface User { id: string; name: string; username: string; email: string; }
interface Notif { _id: string; message: string; type: string; read: boolean; createdAt: string; }

export default function Navbar() {
  const router = useRouter();
  const [user,      setUser]      = useState<User|null>(null);
  const [checking,  setChecking]  = useState(true);
  const [dropOpen,  setDropOpen]  = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifs,    setNotifs]    = useState<Notif[]>([]);
  const [unread,    setUnread]    = useState(0);
  const [mobile,    setMobile]    = useState(false);
  const dropRef  = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/user/me")
      .then((r) => r.json())
      .then((d) => setUser(d.user || null))
      .finally(() => setChecking(false));
  }, []);

  useEffect(() => {
    if (!user) return;
    const go = () =>
      fetch("/api/user/notifications").then((r) => r.json()).then((d) => {
        if (d.success) { setNotifs(d.notifications); setUnread(d.unread); }
      });
    go();
    const t = setInterval(go, 30000);
    return () => clearInterval(t);
  }, [user]);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (dropRef.current  && !dropRef.current.contains(e.target as Node))  setDropOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const handleUpload = () => {
    setMobile(false);
    if (user) router.push("/upload");
    else      router.push("/user-login");
  };

  const handleLogout = async () => {
    await fetch("/api/auth/user-logout", { method: "POST" });
    setUser(null); setDropOpen(false); setMobile(false);
    router.push("/"); router.refresh();
  };

  const openNotifs = async () => {
    setNotifOpen(!notifOpen); setDropOpen(false);
    if (!notifOpen && unread > 0) {
      await fetch("/api/user/notifications", { method: "PATCH" });
      setUnread(0);
      setNotifs((p) => p.map((n) => ({ ...n, read: true })));
    }
  };

  return (
    <nav className="w-full bg-black/95 backdrop-blur-md text-white fixed top-0 left-0 z-50 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex items-center justify-between h-20">

          {/* Brand */}
          <Link href="/" className="leading-none flex-shrink-0">
            <h1 className="text-2xl font-extrabold tracking-wide text-[#d4a373] uppercase">Logo Vines</h1>
            <p className="text-gray-500 text-[10px] tracking-widest uppercase">Graphic Designer</p>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8 text-[12px] font-medium uppercase tracking-widest">
            {NAV_LINKS.map((l) => (
              <Link key={l.label} href={l.href} className="relative group text-gray-300 hover:text-white transition">
                {l.label}
                <span className="absolute left-0 -bottom-1 w-0 h-[1px] bg-[#d4a373] group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </div>

          {/* Right */}
          <div className="flex items-center gap-3">

            {/* Upload — always visible */}
            <button onClick={handleUpload}
              className="hidden sm:flex items-center gap-1.5 bg-[#d4a373] text-black px-4 py-2 text-[11px] font-bold uppercase tracking-widest hover:bg-[#e8b989] transition rounded-lg"
            >
              <svg width="13" height="13" fill="none" viewBox="0 0 24 24">
                <path d="M12 3v13M5 10l7-7 7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 21h18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
              Upload Logo
            </button>

            {/* Loading skeleton */}
            {checking && <div className="w-24 h-8 rounded-full bg-white/5 animate-pulse" />}

            {/* ── LOGGED IN ── */}
            {!checking && user && (
              <>
                {/* Notifications bell */}
                <div className="relative" ref={notifRef}>
                  <button onClick={openNotifs}
                    className="relative w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition"
                  >
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {unread > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#d4a373] text-black text-[9px] font-bold flex items-center justify-center">
                        {unread > 9 ? "9+" : unread}
                      </span>
                    )}
                  </button>

                  {notifOpen && (
                    <div className="absolute right-0 top-12 w-80 bg-[#111] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50">
                      <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
                        <span className="text-white text-xs font-bold uppercase tracking-widest">Notifications</span>
                        <span className="text-gray-600 text-[10px]">{notifs.length} total</span>
                      </div>
                      <div className="max-h-72 overflow-y-auto">
                        {notifs.length === 0 ? (
                          <p className="text-center py-8 text-gray-600 text-sm">No notifications yet</p>
                        ) : notifs.map((n) => (
                          <div key={n._id} className={`px-4 py-3 border-b border-white/5 flex gap-3 ${!n.read ? "bg-white/[0.03]" : ""}`}>
                            <span className={`text-sm flex-shrink-0 ${n.type === "approved" ? "text-green-400" : n.type === "rejected" ? "text-red-400" : "text-[#d4a373]"}`}>
                              {n.type === "approved" ? "✓" : n.type === "rejected" ? "✗" : "↑"}
                            </span>
                            <div>
                              <p className="text-gray-300 text-xs leading-relaxed">{n.message}</p>
                              <p className="text-gray-700 text-[10px] mt-1">
                                {new Date(n.createdAt).toLocaleDateString("en-PK", { day:"numeric", month:"short" })}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Username dropdown */}
                <div className="relative" ref={dropRef}>
                  <button
                    onClick={() => { setDropOpen(!dropOpen); setNotifOpen(false); }}
                    className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full pl-2 pr-3 py-1.5 hover:bg-white/10 transition"
                  >
                    {/* Avatar icon */}
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" className="text-gray-400">
                      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8"/>
                      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                    </svg>
                    {/* Username */}
                    <span className="text-white text-xs font-medium hidden sm:block max-w-[100px] truncate">
                      {user.username || user.name.split(" ")[0]}
                    </span>
                    <svg className={`transition-transform duration-200 ${dropOpen ? "rotate-180" : ""} text-gray-500`} width="12" height="12" fill="none" viewBox="0 0 24 24">
                      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>

                  {dropOpen && (
                    <div className="absolute right-0 top-12 w-56 bg-[#111] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50">
                      {/* User info header */}
                      <div className="px-4 py-3 border-b border-white/5 bg-white/[0.02]">
                        <p className="text-white text-sm font-semibold truncate">@{user.username || user.name}</p>
                        <p className="text-gray-600 text-xs truncate">{user.email}</p>
                      </div>

                      {/* Menu items */}
                      <div className="py-1">
                        <Link href="/dashboard?tab=uploads"
                          onClick={() => setDropOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:text-white hover:bg-white/5 transition group"
                        >
                          <svg width="15" height="15" fill="none" viewBox="0 0 24 24" className="text-gray-500 group-hover:text-[#d4a373] transition">
                            <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.8"/>
                            <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.8"/>
                            <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.8"/>
                            <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.8"/>
                          </svg>
                          <span className="text-xs uppercase tracking-widest">My Uploads</span>
                        </Link>

                        <Link href="/dashboard?tab=profile"
                          onClick={() => setDropOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:text-white hover:bg-white/5 transition group"
                        >
                          <svg width="15" height="15" fill="none" viewBox="0 0 24 24" className="text-gray-500 group-hover:text-[#d4a373] transition">
                            <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8"/>
                            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                          </svg>
                          <span className="text-xs uppercase tracking-widest">Profile Settings</span>
                        </Link>

                        <Link href="/dashboard?tab=account"
                          onClick={() => setDropOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:text-white hover:bg-white/5 transition group"
                        >
                          <svg width="15" height="15" fill="none" viewBox="0 0 24 24" className="text-gray-500 group-hover:text-[#d4a373] transition">
                            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8"/>
                            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="currentColor" strokeWidth="1.8"/>
                          </svg>
                          <span className="text-xs uppercase tracking-widest">Edit Account</span>
                        </Link>

                        <button onClick={openNotifs}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:text-white hover:bg-white/5 transition group"
                        >
                          <svg width="15" height="15" fill="none" viewBox="0 0 24 24" className="text-gray-500 group-hover:text-[#d4a373] transition">
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <span className="text-xs uppercase tracking-widest">Notifications</span>
                          {unread > 0 && (
                            <span className="ml-auto bg-[#d4a373] text-black text-[9px] font-bold px-1.5 py-0.5 rounded-full">{unread}</span>
                          )}
                        </button>
                      </div>

                      <div className="border-t border-white/5 py-1">
                        <button onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-red-400 hover:bg-red-500/10 transition"
                        >
                          <svg width="15" height="15" fill="none" viewBox="0 0 24 24">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <span className="text-xs uppercase tracking-widest">Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* ── NOT LOGGED IN ── */}
            {!checking && !user && (
              <div className="hidden sm:flex items-center gap-2">
                <Link href="/user-login"
                  className="text-gray-400 hover:text-white text-xs uppercase tracking-widest transition px-3 py-2 rounded-lg hover:bg-white/5"
                >Sign In</Link>
                <Link href="/signup"
                  className="border border-white/20 text-white px-4 py-2 text-xs font-semibold uppercase tracking-widest hover:border-[#d4a373] hover:text-[#d4a373] transition rounded-lg"
                >Sign Up</Link>
                <Link href="/admin"
                  className="border border-[#d4a373]/30 text-[#d4a373]/50 px-3 py-2 text-[10px] uppercase tracking-widest hover:border-[#d4a373] hover:text-[#d4a373] transition rounded-lg"
                >Admin</Link>
              </div>
            )}

            {/* Hamburger */}
            <button className="md:hidden p-2 text-gray-300 hover:text-white" onClick={() => setMobile(!mobile)}>
              {mobile
                ? <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                : <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              }
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobile && (
        <div className="md:hidden bg-[#0a0a0a] border-t border-white/10 px-6 py-6 flex flex-col gap-4">
          {NAV_LINKS.map((l) => (
            <Link key={l.label} href={l.href} onClick={() => setMobile(false)}
              className="text-gray-300 hover:text-[#d4a373] text-sm uppercase tracking-widest transition"
            >{l.label}</Link>
          ))}
          <div className="border-t border-white/10 pt-4 flex flex-col gap-3">
            <button onClick={handleUpload} className="bg-[#d4a373] text-black px-5 py-2.5 text-xs font-bold uppercase tracking-widest w-fit rounded-lg">
              ↑ Upload Logo
            </button>
            {user ? (
              <>
                <Link href="/dashboard?tab=uploads"  onClick={() => setMobile(false)} className="text-gray-400 text-sm uppercase tracking-widest">My Uploads</Link>
                <Link href="/dashboard?tab=profile"  onClick={() => setMobile(false)} className="text-gray-400 text-sm uppercase tracking-widest">Profile Settings</Link>
                <Link href="/dashboard?tab=account"  onClick={() => setMobile(false)} className="text-gray-400 text-sm uppercase tracking-widest">Edit Account</Link>
                <button onClick={handleLogout} className="text-red-400 text-sm uppercase tracking-widest text-left">Logout</button>
              </>
            ) : (
              <>
                <Link href="/user-login" onClick={() => setMobile(false)} className="text-gray-400 text-sm uppercase tracking-widest">Sign In</Link>
                <Link href="/signup"     onClick={() => setMobile(false)} className="text-gray-400 text-sm uppercase tracking-widest">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}