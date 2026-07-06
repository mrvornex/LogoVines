
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-[#fff] text-[#1A4450] py-6 mt-10 border-t border-[#1A4450]/10">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
        
        {/* Logo */}
        <h2 className="text-xl font-bold">
          Logo <span className="text-[#1A4450]">Vines</span>
        </h2>

        {/* Links */}
        <nav>
          <ul className="flex gap-6">
            <li>
              <a
                href="/privacy"
                className="hover:text-[#1A4450] transition duration-300"
              >
                Privacy Policy
              </a>
            </li>
            <li>
              <a
                href="/contact"
                className="hover:text-[#1A4450] transition duration-300"
              >
                Contact
              </a>
            </li>
          </ul>
        </nav>

        {/* Copyright */}
        <p className="text-sm text-[#1A4450]">
          © 2008–2026 Logo Vines. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
