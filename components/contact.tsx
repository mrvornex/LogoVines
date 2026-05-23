"use client";

import { useState } from "react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent,    setSent]    = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSending(true);
    // TODO: wire to email service / API
    await new Promise((r) => setTimeout(r, 800)); // simulate
    setSent(true);
    setSending(false);
  };

  return (
    <section id="contact" className="bg-[#0a0a0a] border-t border-white/5 py-24 px-6 md:px-16">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-start">

        {/* Left */}
        <div>
          <p className="text-[#d4a373] text-xs uppercase tracking-[0.3em] mb-4">Contact</p>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white uppercase tracking-wide leading-tight">
            Let's Work<br />
            <span className="text-[#d4a373]">Together</span>
          </h2>
          <div className="mt-4 w-12 h-[2px] bg-[#d4a373]" />
          <p className="text-gray-400 mt-6 leading-relaxed">
            Have a project in mind? Tell us about your brand and we'll craft something remarkable.
          </p>

          <div className="mt-10 space-y-4">
            <a href="mailto:hello@logovines.com" className="flex items-center gap-3 text-gray-400 hover:text-[#d4a373] transition text-sm">
              <span className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-base">✉</span>
              hello@logovines.com
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="flex items-center gap-3 text-gray-400 hover:text-[#d4a373] transition text-sm">
              <span className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-base">📷</span>
              @logovines
            </a>
          </div>
        </div>

        {/* Right — Form */}
        <div>
          {sent ? (
            <div className="text-center py-16">
              <p className="text-5xl mb-4">✓</p>
              <h3 className="text-white text-xl font-bold">Message Sent!</h3>
              <p className="text-gray-400 text-sm mt-2">We'll get back to you within 24 hours.</p>
              <button
                onClick={() => { setSent(false); setForm({ name:"", email:"", message:"" }); }}
                className="mt-6 border border-[#d4a373] text-[#d4a373] px-6 py-2 text-xs uppercase tracking-widest hover:bg-[#d4a373] hover:text-black transition"
              >
                Send Another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs text-gray-500 uppercase tracking-widest mb-2">Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Your Name"
                  className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#d4a373] transition placeholder-gray-600"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 uppercase tracking-widest mb-2">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@email.com"
                  className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#d4a373] transition placeholder-gray-600"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 uppercase tracking-widest mb-2">Message</label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Tell us about your project..."
                  rows={5}
                  className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#d4a373] transition placeholder-gray-600 resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={sending}
                className="w-full py-4 bg-[#d4a373] text-black font-bold uppercase tracking-widest text-sm hover:bg-[#e8b989] transition duration-300 disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {sending ? (
                  <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="60" strokeDashoffset="20"/></svg>Sending...</>
                ) : "Send Message"}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-20 pt-8 border-t border-white/5 text-center text-gray-600 text-xs tracking-widest uppercase">
        © {new Date().getFullYear()} LogoVines. All rights reserved.
      </div>
    </section>
  );
}