import React, { useState, useRef } from 'react';
import { useStudio } from '../context/StudioContext';
import { StarSparkle } from './DecorativeElements';

export const Footer: React.FC = () => {
  const { setActivePage, studioConfig, openContactModal, openAuthModal } = useStudio();
  const [clickCount, setClickCount] = useState(0);
  const clickTimerRef = useRef<number | null>(null);

  const handleSecretClick = () => {
    setClickCount((prev) => {
      const next = prev + 1;
      if (next >= 3) {
        openAuthModal();
        return 0;
      }
      return next;
    });

    if (clickTimerRef.current) {
      window.clearTimeout(clickTimerRef.current);
    }

    clickTimerRef.current = window.setTimeout(() => {
      setClickCount(0);
    }, 2000);
  };

  return (
    <footer className="border-t border-white/10 bg-[#050505] text-zinc-400">
      <div className="mx-auto max-w-7xl px-6 py-12 sm:px-8 lg:px-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-10 border-b border-white/5">
          {/* Brand Col */}
          <div className="space-y-2 max-w-sm">
            <div className="flex items-center gap-2">
              <StarSparkle size="xs" variant="gold" />
              <span className="font-display text-sm font-black tracking-[0.2em] text-[#F5F5F5] uppercase">
                {studioConfig.brandName} {studioConfig.brandSub}
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-light leading-relaxed">
              {studioConfig.tagline}
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap items-center gap-6 sm:gap-8 text-xs font-display font-bold tracking-widest uppercase text-zinc-400">
            <button
              type="button"
              onClick={() => {
                setActivePage('home');
                const el = document.getElementById('about-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hover:text-[#C5A059] transition-colors cursor-pointer"
            >
              ABOUT
            </button>
            <button
              type="button"
              onClick={() => setActivePage('gallery')}
              className="hover:text-[#C5A059] transition-colors cursor-pointer"
            >
              ART GALLERY
            </button>
            <button
              type="button"
              onClick={() => setActivePage('rates')}
              className="hover:text-[#C5A059] transition-colors cursor-pointer"
            >
              RATE SHEET
            </button>
            <button
              type="button"
              onClick={() => openContactModal()}
              className="hover:text-[#C5A059] transition-colors cursor-pointer"
            >
              CONTACT NOW
            </button>
          </div>

          {/* Studio Signature & Status Decorative Badge */}
          <div className="flex items-center gap-3">
            <div className="relative border border-[#C5A059]/40 bg-[#0c0c0e] px-4 py-2.5 flex items-center gap-3 shadow-lg shadow-black/40 group hover:border-[#C5A059] transition-all">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C5A059] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C5A059]"></span>
              </span>
              <div className="text-left">
                <div className="text-[10px] font-mono tracking-[0.25em] text-[#C5A059] font-bold uppercase flex items-center gap-1.5">
                  <span>ATELIER STATUS</span>
                  <span className="text-zinc-600">//</span>
                  <span className="text-zinc-300">ACTIVE</span>
                </div>
                <div className="text-[11px] font-display font-semibold tracking-wider text-zinc-400 uppercase">
                  OPEN FOR BESPOKE VISIONS
                </div>
              </div>
              <StarSparkle size="xs" variant="gold" />
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-zinc-500 select-none">
          <p
            onClick={handleSecretClick}
            className="transition-colors hover:text-zinc-400 cursor-default"
            title={clickCount > 0 ? `${3 - clickCount} clicks to access owner mode` : undefined}
          >
            © {new Date().getFullYear()} ANTHROPOCRAFT STUDIO. ALL RIGHTS RESERVED.
          </p>
          <div className="flex items-center gap-4 text-[10px] text-zinc-500 tracking-wider">
            <span>ORIGINAL CHARACTER ARTWORK</span>
            <button
              type="button"
              onClick={handleSecretClick}
              className="text-[#C5A059]/40 hover:text-[#C5A059] transition-colors p-1"
              aria-label="Studio Mark"
            >
              ✦
            </button>
            <span>BOLD TYPOGRAPHY ATELIER</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

