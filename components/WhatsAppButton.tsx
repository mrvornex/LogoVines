"use client";

import { useState } from "react";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "923001234567";
const DEFAULT_MESSAGE = "Hello! I'm interested in your logo design services. Can you help me?";

export default function WhatsAppButton() {
  const [hovered, setHovered] = useState(false);

  const handleClick = () => {
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(DEFAULT_MESSAGE)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">

      {/* Tooltip */}
      <div
        className={`transition-all duration-300 ${
          hovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4 pointer-events-none"
        }`}
      >
        <div className="bg-[#111] border border-white/10 text-white text-sm px-4 py-2 rounded-xl shadow-xl whitespace-nowrap">
          💬 Chat on WhatsApp
          <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[6px] border-l-[#111]" />
        </div>
      </div>

      {/* Button */}
      <button  
        onClick={handleClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        aria-label="Chat on WhatsApp"
        className="relative w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-transform duration-300 hover:scale-110 active:scale-95"
        style={{ background: "#25D366" }}
      >
        {/* Ping animation */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30" />

        {/* WhatsApp Icon */}
        <svg
          width="28"
          height="28"
          viewBox="0 0 32 32"
          fill="white"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M16 2C8.268 2 2 8.268 2 16c0 2.478.678 4.8 1.856 6.8L2 30l7.4-1.832A13.94 13.94 0 0 0 16 30c7.732 0 14-6.268 14-14S23.732 2 16 2zm0 25.6a11.55 11.55 0 0 1-5.88-1.6l-.42-.252-4.392 1.088 1.116-4.268-.276-.44A11.56 11.56 0 0 1 4.4 16C4.4 9.59 9.59 4.4 16 4.4S27.6 9.59 27.6 16 22.41 27.6 16 27.6zm6.344-8.664c-.348-.174-2.06-1.016-2.38-1.132-.32-.116-.552-.174-.784.174-.232.348-.9 1.132-1.104 1.364-.204.232-.406.26-.754.086-.348-.174-1.468-.54-2.796-1.724-1.034-.92-1.732-2.056-1.936-2.404-.204-.348-.022-.536.152-.708.158-.156.348-.406.522-.61.174-.204.232-.348.348-.58.116-.232.058-.436-.028-.61-.088-.174-.784-1.892-1.076-2.59-.284-.68-.572-.588-.784-.598l-.668-.012c-.232 0-.61.086-.928.436-.32.348-1.22 1.192-1.22 2.908s1.248 3.372 1.422 3.604c.174.232 2.456 3.748 5.952 5.256.832.36 1.48.574 1.988.736.836.266 1.596.228 2.198.138.67-.1 2.06-.842 2.352-1.656.29-.814.29-1.512.202-1.656-.086-.144-.318-.232-.666-.406z"/>
        </svg>
      </button>
    </div>
  );
}