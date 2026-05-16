"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const NAV_LINKS = [
  { label: "Home",     href: "#home"     },
  { label: "About",    href: "#about"    },
  { label: "Process",  href: "#process"  },
  { label: "Projects", href: "#projects" },
  { label: "Contact",  href: "#contact"  },
];

export default function Navbar() {
  const router  = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <nav className="w-full bg-black/95 backdrop-blur-md text-white fixed top-0 left-0 z-50 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex items-center justify-between h-20">

          {/* Logo */}
          <div onClick={() => router.push("/")} className="cursor-pointer leading-none">
            <h1 className="text-2xl font-extrabold tracking-wide text-[#d4a373] uppercase">
              Logo Vines
            </h1>
            <p className="text-gray-400 text-xs tracking-widest uppercase">
              Graphic Designer
            </p>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-10 text-[13px] font-medium uppercase tracking-widest">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="relative group text-gray-300 hover:text-white transition duration-300"
              >
                {link.label}
                <span className="absolute left-0 -bottom-1 w-0 h-[1px] bg-[#d4a373] transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/admin")}
              className="hidden lg:block border border-[#d4a373] text-[#d4a373] px-5 py-2 text-xs uppercase tracking-widest hover:bg-[#d4a373] hover:text-black transition duration-300"
            >
              Admin
            </button>

            {/* Mobile hamburger */}
            <button
              className="md:hidden text-gray-300 hover:text-white transition p-2"
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
            >
              {open ? (
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              ) : (
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-black border-t border-white/10 px-6 py-6 flex flex-col gap-5">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setOpen(false)}
              className="text-gray-300 hover:text-[#d4a373] text-sm uppercase tracking-widest transition"
            >
              {link.label}
            </a>
          ))}
          <button
            onClick={() => { router.push("/admin"); setOpen(false); }}
            className="border border-[#d4a373] text-[#d4a373] px-5 py-2 text-xs uppercase tracking-widest hover:bg-[#d4a373] hover:text-black transition duration-300 w-fit"
          >
            Admin
          </button>
        </div>
      )}
    </nav>
  );
}