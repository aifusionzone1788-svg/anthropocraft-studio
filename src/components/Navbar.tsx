import React, { useState, useRef } from 'react';
import { useStudio } from '../context/StudioContext';
import { PageType } from '../types';
import { StarSparkle } from './DecorativeElements';
import { Menu, X, MessageSquare, ShieldCheck } from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    activePage,
    setActivePage,
    studioConfig,
    openContactModal,
    isOwnerMode,
    openAuthModal,
  } = useStudio();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const clickCountRef = useRef(0);
  const clickTimerRef = useRef<number | null>(null);

  const handleSecretClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    clickCountRef.current += 1;
    if (clickCountRef.current >= 3) {
      openAuthModal();
      clickCountRef.current = 0;
      return;
    }
    if (clickTimerRef.current) window.clearTimeout(clickTimerRef.current);
    clickTimerRef.current = window.setTimeout(() => {
      clickCountRef.current = 0;
    }, 2000);
  };

  const handleNavClick = (page: PageType, sectionId?: string) => {
    setMobileMenuOpen(false);
    if (page === 'home' && sectionId) {
      if (activePage !== 'home') {
        setActivePage('home');
        setTimeout(() => {
          const el = document.getElementById(sectionId);
          el?.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      } else {
        const el = document.getElementById(sectionId);
        el?.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      setActivePage(page);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#050505]/95 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 sm:px-8 lg:px-12">
        {/* Brand Logotype */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleSecretClick}
            className="p-1 text-left cursor-pointer hover:opacity-80 transition-opacity"
            title="Studio Mark (Triple click for Owner Access)"
            aria-label="Studio Mark"
          >
            <StarSparkle size="sm" variant="gold" />
          </button>
          <button
            type="button"
            onClick={() => handleNavClick('home')}
            className="group flex flex-col text-left cursor-pointer"
          >
            <span className="font-display text-base sm:text-lg font-black tracking-[0.2em] text-[#F5F5F5] uppercase group-hover:text-[#C5A059]">
              {studioConfig.brandName}
            </span>
            <span className="text-[9px] font-mono tracking-[0.4em] text-zinc-500 uppercase">
              {studioConfig.brandSub} // ATELIER
            </span>
          </button>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 lg:gap-10">
          <button
            type="button"
            onClick={() => handleNavClick('home', 'about-section')}
            className={`text-xs font-display font-bold tracking-[0.2em] transition-colors cursor-pointer ${
              activePage === 'home'
                ? 'text-[#F5F5F5] hover:text-[#C5A059]'
                : 'text-zinc-400 hover:text-[#F5F5F5]'
            }`}
          >
            ABOUT
          </button>

          <button
            type="button"
            onClick={() => handleNavClick('gallery')}
            className={`relative text-xs font-display font-bold tracking-[0.2em] transition-colors cursor-pointer ${
              activePage === 'gallery'
                ? 'text-[#C5A059]'
                : 'text-zinc-400 hover:text-[#F5F5F5]'
            }`}
          >
            ART GALLERY
            {activePage === 'gallery' && (
              <span className="absolute -bottom-2 left-0 right-0 h-[2px] bg-[#C5A059]" />
            )}
          </button>

          <button
            type="button"
            onClick={() => handleNavClick('rates')}
            className={`relative text-xs font-display font-bold tracking-[0.2em] transition-colors cursor-pointer ${
              activePage === 'rates'
                ? 'text-[#C5A059]'
                : 'text-zinc-400 hover:text-[#F5F5F5]'
            }`}
          >
            RATE SHEET
            {activePage === 'rates' && (
              <span className="absolute -bottom-2 left-0 right-0 h-[2px] bg-[#C5A059]" />
            )}
          </button>

          <button
            type="button"
            onClick={() => openContactModal()}
            className="text-xs font-display font-bold tracking-[0.2em] text-zinc-400 hover:text-[#C5A059] transition-colors cursor-pointer"
          >
            CONTACT
          </button>
        </nav>

        {/* Status Badge & CTA */}
        <div className="hidden lg:flex items-center gap-4">
          {isOwnerMode && (
            <button
              type="button"
              onClick={openAuthModal}
              className="flex items-center gap-1.5 px-3 py-1 border border-[#C5A059]/50 bg-[#C5A059]/10 text-[10px] font-mono tracking-widest text-[#C5A059] hover:bg-[#C5A059]/20 transition-colors cursor-pointer"
              title="Owner Mode Active - Click for settings"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>OWNER</span>
            </button>
          )}

          <div className="flex items-center gap-2 px-3 py-1 border border-white/10 bg-[#0c0c0c] text-[10px] font-mono tracking-widest text-zinc-300">
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                studioConfig.commissionStatus === 'OPEN'
                  ? 'bg-emerald-400'
                  : studioConfig.commissionStatus === 'LIMITED SLOTS'
                  ? 'bg-[#C5A059]'
                  : 'bg-zinc-600'
              }`}
            />
            <span>{studioConfig.commissionStatus}</span>
          </div>

          <button
            type="button"
            onClick={() => openContactModal()}
            className="flex items-center gap-2 border border-[#C5A059] bg-[#0c0c0c] px-4 py-2 text-xs font-display font-bold tracking-[0.15em] text-[#C5A059] hover:bg-[#C5A059] hover:text-[#050505] transition-all cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>INQUIRE</span>
          </button>
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-zinc-400 hover:text-[#F5F5F5] md:hidden cursor-pointer"
          aria-label="Toggle Navigation"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/10 bg-[#0c0c0c] px-6 py-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/5 text-xs text-zinc-400 font-mono">
            <span>STATUS:</span>
            <span className="text-[#C5A059]">{studioConfig.commissionStatus}</span>
          </div>
          <div className="flex flex-col space-y-3">
            <button
              type="button"
              onClick={() => handleNavClick('home', 'about-section')}
              className="text-left font-display text-sm font-bold tracking-widest text-zinc-300 hover:text-[#C5A059] py-1"
            >
              ABOUT
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('gallery')}
              className={`text-left font-display text-sm font-bold tracking-widest py-1 ${
                activePage === 'gallery' ? 'text-[#C5A059]' : 'text-zinc-300 hover:text-[#F5F5F5]'
              }`}
            >
              ART GALLERY
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('rates')}
              className={`text-left font-display text-sm font-bold tracking-widest py-1 ${
                activePage === 'rates' ? 'text-[#C5A059]' : 'text-zinc-300 hover:text-[#F5F5F5]'
              }`}
            >
              RATE SHEET
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                openContactModal();
              }}
              className="text-left font-display text-sm font-bold tracking-widest text-[#C5A059] py-1"
            >
              CONTACT NOW
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
