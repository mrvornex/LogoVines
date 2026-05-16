"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

const NAV_LINKS = [
  { label: "Home",      href: "/#home"      },
  { label: "About",     href: "/#about"     },
  { label: "Process",   href: "/#process"   },
  { label: "Projects",  href: "/#projects"  },
  { label: "Templates", href: "/templates"  },
  { label: "Contact",   href: "/#contact"   },
];

interface User { id: string; name: string; email: string; }
interface Notification { _id: string; message: string; type: string; read: boolean; createdAt: string; }

export default function Navbar() {
  const router = useRouter();
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [user,        setUser]        = useState<User|null>(null);
  const [dropOpen,    setDropOpen]    = useState(false);
  const [notifOpen,   setNotifOpen]   = useState(false);
  const [notifs,      setNotifs]      = useState<Notification[]>([]);
  const [unread,      setUnread]      = useState(0);
  const dropRef  = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Fetch current user
  useEffect(() => {
    fetch("/api/user/me").then((r) => r.json()).then((d) => { if (d.user) setUser(d.user); });
  }, []);

  useEffect(() => {
    if (!user) return;
    const fetchNotifs = () => {
      fetch("/api/user/notifications").then((r) => r.json()).then((d) => {
        if (d.success) { setNotifs(d.notifications); setUnread(d.unread); }
      });
    };
    fetchNotifs();
    const interval = setInterval(fetchNotifs, 30000);
    return () => clearInterval(interval);
  }, [user]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current  && !dropRef.current.contains(e.target as Node))  setDropOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/user-logout", { method: "POST" });
    setUser(null); setDropOpen(false);
    router.push("/"); router.refresh();
  };

  const openNotifs = async () => {
    setNotifOpen(!notifOpen); setDropOpen(false);
    if (!notifOpen && unread > 0) {
      await fetch("/api/user/notifications", { method: "PATCH" });
      setUnread(0);
      setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
    }
  };

  const initials = user?.name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  const notifIcon = (type: string) =>
    type === "approved" ? "✓" : type === "rejected" ? "✗" : "📤";

  return (
    <nav className="w-full bg-black/95 backdrop-blur-md text-white fixed top-0 left-0 z-50 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex items-center justify-between h-20">

          {/* Logo */}
          <div onClick={() => router.push("/")} className="cursor-pointer leading-none flex-shrink-0">
            <h1 className="text-2xl font-extrabold tracking-wide text-[#d4a373] uppercase">Logo Vines</h1>
            <p className="text-gray-400 text-[10px] tracking-widest uppercase">Graphic Designer</p>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8 text-[12px] font-medium uppercase tracking-widest">
            {NAV_LINKS.map((link) => (
              <Link key={link.label} href={link.href} className="relative group text-gray-300 hover:text-white transition duration-300">
                {link.label}
                <span className="absolute left-0 -bottom-1 w-0 h-[1px] bg-[#d4a373] transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">

            {user ? (
              <>
                {/* Upload button */}
                <Link href="/upload" className="hidden lg:flex items-center gap-1.5 bg-[#d4a373] text-black px-4 py-2 text-[11px] font-bold uppercase tracking-widest hover:bg-[#e8b989] transition rounded-lg">
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path d="M12 3v13M5 10l7-7 7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M3 21h18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></svg>
                  Upload
                </Link>

                {/* Notifications */}
                <div className="relative" ref={notifRef}>
                  <button onClick={openNotifs} className="relative w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition">
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    {unread > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#d4a373] text-black text-[9px] font-bold flex items-center justify-center">
                        {unread > 9 ? "9+" : unread}
                      </span>
                    )}
                  </button>

                  {notifOpen && (
                    <div className="absolute right-0 top-12 w-80 bg-[#111] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50">
                      <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
                        <h3 className="text-white text-xs font-bold uppercase tracking-widest">Notifications</h3>
                        <span className="text-gray-600 text-[10px]">{notifs.length} total</span>
                      </div>
                      <div className="max-h-72 overflow-y-auto">
                        {notifs.length === 0 ? (
                          <div className="text-center py-8 text-gray-600 text-sm">No notifications yet</div>
                        ) : notifs.map((n) => (
                          <div key={n._id} className={`px-4 py-3 border-b border-white/5 flex gap-3 ${!n.read ? "bg-white/3" : ""}`}>
                            <span className={`text-sm flex-shrink-0 ${n.type === "approved" ? "text-green-400" : n.type === "rejected" ? "text-red-400" : "text-[#d4a373]"}`}>
                              {notifIcon(n.type)}
                            </span>
                            <div>
                              <p className="text-gray-300 text-xs leading-relaxed">{n.message}</p>
                              <p className="text-gray-700 text-[10px] mt-1">
                                {new Date(n.createdAt).toLocaleDateString("en-PK", { day: "numeric", month: "short" })}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* User dropdown */}
                <div className="relative" ref={dropRef}>
                  <button onClick={() => { setDropOpen(!dropOpen); setNotifOpen(false); }}
                    className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3 py-1.5 hover:bg-white/10 transition"
                  >
                    <div className="w-7 h-7 rounded-full bg-[#d4a373]/20 border border-[#d4a373]/40 flex items-center justify-center text-[#d4a373] text-[10px] font-bold">
                      {initials}
                    </div>
                    <span className="text-white text-xs font-medium hidden sm:block max-w-[80px] truncate">{user.name.split(" ")[0]}</span>
                    <svg className={`transition-transform duration-200 ${dropOpen ? "rotate-180" : ""}`} width="12" height="12" fill="none" viewBox="0 0 24 24">
                      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>

                  {dropOpen && (
                    <div className="absolute right-0 top-12 w-52 bg-[#111] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50">
                      {/* User info */}
                      <div className="px-4 py-3 border-b border-white/5">
                        <p className="text-white text-sm font-semibold truncate">{user.name}</p>
                        <p className="text-gray-600 text-xs truncate">{user.email}</p>
                      </div>

                      {/* Menu items */}
                      {[
                        { href: "/profile",    icon: "👤", label: "View Profile"     },
                        { href: "/my-uploads", icon: "🖼️", label: "My Uploads"       },
                        { href: "/upload",     icon: "⬆",  label: "Upload Logo"      },
                        { href: "/profile",    icon: "⚙",  label: "Profile Settings" },
                      ].map((item) => (
                        <Link key={item.label} href={item.href} onClick={() => setDropOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-gray-400 hover:text-white hover:bg-white/5 transition text-sm"
                        >
                          <span className="text-base">{item.icon}</span>
                          <span className="text-xs uppercase tracking-widest">{item.label}</span>
                        </Link>
                      ))}

                      <div className="border-t border-white/5">
                        <button onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-red-400 hover:bg-red-500/10 transition text-sm"
                        >
                          <span className="text-base">🚪</span>
                          <span className="text-xs uppercase tracking-widest">Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link href="/user-login" className="hidden lg:block text-gray-400 hover:text-white text-xs uppercase tracking-widest transition">Sign In</Link>
                <Link href="/signup"     className="hidden lg:block bg-[#d4a373] text-black px-5 py-2 text-xs font-bold uppercase tracking-widest hover:bg-[#e8b989] transition">Sign Up</Link>
                <button onClick={() => router.push("/admin")} className="hidden lg:block border border-[#d4a373]/40 text-[#d4a373]/60 px-4 py-2 text-[10px] uppercase tracking-widest hover:border-[#d4a373] hover:text-[#d4a373] transition">Admin</button>
              </>
            )}

            {/* Mobile hamburger */}
            <button className="md:hidden text-gray-300 hover:text-white transition p-2" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? (
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              ) : (
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-black border-t border-white/10 px-6 py-6 flex flex-col gap-4">
          {NAV_LINKS.map((link) => (
            <Link key={link.label} href={link.href} onClick={() => setMobileOpen(false)}
              className="text-gray-300 hover:text-[#d4a373] text-sm uppercase tracking-widest transition"
            >{link.label}</Link>
          ))}
          <div className="border-t border-white/10 pt-4 flex flex-col gap-3">
            {user ? (
              <>
                <Link href="/upload"     onClick={() => setMobileOpen(false)} className="text-[#d4a373] text-sm uppercase tracking-widest">⬆ Upload Logo</Link>
                <Link href="/my-uploads" onClick={() => setMobileOpen(false)} className="text-gray-400 text-sm uppercase tracking-widest">🖼️ My Uploads</Link>
                <Link href="/profile"    onClick={() => setMobileOpen(false)} className="text-gray-400 text-sm uppercase tracking-widest">👤 Profile</Link>
                <button onClick={handleLogout} className="text-red-400 text-sm uppercase tracking-widest text-left">🚪 Logout</button>
              </>
            ) : (
              <>
                <Link href="/user-login" onClick={() => setMobileOpen(false)} className="text-gray-400 text-sm uppercase tracking-widest">Sign In</Link>
                <Link href="/signup"     onClick={() => setMobileOpen(false)} className="bg-[#d4a373] text-black px-5 py-2 text-xs font-bold uppercase tracking-widest w-fit">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}