import React, { useState, useRef, useEffect } from 'react';
import { useStudio } from '../context/StudioContext';
import { GalleryCategory } from '../types';
import { StarSparkle } from './DecorativeElements';
import { ArtworkCard } from './ArtworkCard';
import { Sparkles, Layers, Send, Upload, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { compressImageFile } from '../utils/imageHelper';
import { HeadingReveal, FadeUp } from './ScrollReveal';
import { motion } from 'motion/react';

const CATEGORIES: GalleryCategory[] = [
  'ALL',
  'VTUBER MODELS',
  'CHARACTER ART',
  'PORTRAITS',
  'FULL-BODY ART',
  'REFERENCE SHEETS',
  'MASCOT DESIGN',
  'CUSTOM ARTWORK',
];

export const GalleryPage: React.FC = () => {
  const { artworks, openContactModal, isOwnerMode, openUploadModal, clearAllArtworks } = useStudio();
  const [selectedCategory, setSelectedCategory] = useState<GalleryCategory>('ALL');
  const [isConfirmingClear, setIsConfirmingClear] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollable = () => {
    const el = scrollerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 6);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 6);
  };

  useEffect(() => {
    checkScrollable();
    const el = scrollerRef.current;
    if (!el) return;
    el.addEventListener('scroll', checkScrollable, { passive: true });
    window.addEventListener('resize', checkScrollable);
    return () => {
      el.removeEventListener('scroll', checkScrollable);
      window.removeEventListener('resize', checkScrollable);
    };
  }, [artworks.length]);

  const scrollSections = (direction: 'left' | 'right') => {
    const el = scrollerRef.current;
    if (!el) return;
    const scrollAmount = direction === 'left' ? -300 : 300;
    el.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImageFile(file, 1600, 1600, 0.85);
      const cleanTitle = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ').toUpperCase();
      openUploadModal(
        selectedCategory !== 'ALL' ? selectedCategory : undefined,
        undefined,
        compressed,
        cleanTitle
      );
    } catch {
      openUploadModal(selectedCategory !== 'ALL' ? selectedCategory : undefined);
    }
    e.target.value = '';
  };

  // Filter artworks
  const filteredArtworks = selectedCategory === 'ALL'
    ? artworks
    : artworks.filter((art) => art.category === selectedCategory);

  return (
    <div className="min-h-screen bg-[#050505] px-6 sm:px-8 lg:px-12 py-12 lg:py-20">
      <div className="mx-auto max-w-7xl">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-white/10">
          <div className="space-y-3">
            <FadeUp delay={0} yOffset={12}>
              <div className="flex items-center gap-2 text-[10px] font-mono tracking-[0.3em] text-[#C5A059] uppercase">
                <StarSparkle size="xs" variant="gold" />
                <span>ATELIER ARCHIVE // EXHIBITION</span>
                {isOwnerMode && (
                  <span className="ml-2 px-2 py-0.5 bg-[#C5A059]/20 border border-[#C5A059]/40 text-[#C5A059] text-[9px] font-bold">
                    ✦ OWNER ACTIVE
                  </span>
                )}
              </div>
            </FadeUp>

            <div>
              <HeadingReveal
                as="h1"
                text="ART GALLERY"
                className="font-display text-4xl sm:text-6xl lg:text-7xl font-black uppercase text-[#F5F5F5]"
                startTracking="0.08em"
                endTracking="-0.02em"
                glow={true}
              />
            </div>

            <FadeUp delay={0.1} yOffset={14}>
              <p className="text-xs sm:text-sm text-zinc-400 font-light max-w-lg">
                Curated original furry character art, emotive portraits, reference sheets, and bespoke client works by AnthroCraft Studio.
              </p>
            </FadeUp>
          </div>

          {/* Action Buttons */}
          <FadeUp delay={0.15} yOffset={14}>
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              {isOwnerMode && (
                <label
                  className="relative flex items-center gap-2 border border-[#C5A059] bg-[#0c0c0e] text-[#C5A059] hover:bg-[#C5A059] hover:text-[#050505] px-5 py-3 text-xs font-display font-bold tracking-[0.15em] uppercase transition-all cursor-pointer shadow-lg shadow-[#C5A059]/10"
                  title="Owner Action: Upload New Artwork"
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleFileSelected}
                    className="hidden"
                  />
                  <Upload className="w-4 h-4" />
                  <span>+ UPLOAD ARTWORK</span>
                </label>
              )}

              {isOwnerMode && artworks.length > 0 && (
                isConfirmingClear ? (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        clearAllArtworks();
                        setIsConfirmingClear(false);
                      }}
                      className="flex items-center gap-1.5 border border-red-500 bg-red-600 text-white px-4 py-3 text-xs font-display font-bold tracking-[0.15em] uppercase hover:bg-red-700 transition-all cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>YES, DELETE ALL</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsConfirmingClear(false)}
                      className="border border-white/20 bg-[#0c0c0e] text-zinc-400 hover:text-white px-3 py-3 text-xs font-display font-bold uppercase transition-all cursor-pointer"
                    >
                      CANCEL
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsConfirmingClear(true)}
                    className="flex items-center gap-2 border border-red-500/40 bg-red-950/20 text-red-400 hover:bg-red-900/40 hover:text-red-200 px-4 py-3 text-xs font-display font-bold tracking-[0.15em] uppercase transition-all cursor-pointer"
                    title="Owner Action: Delete All Artwork from Gallery"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>CLEAR GALLERY</span>
                  </button>
                )
              )}

              <button
                type="button"
                onClick={() => openContactModal()}
                className="flex items-center gap-2 bg-[#C5A059] text-[#050505] px-6 py-3 text-xs font-display font-bold tracking-[0.15em] uppercase hover:bg-[#d6b46f] transition-all cursor-pointer shadow-[0_0_20px_rgba(197,160,89,0.2)]"
              >
                <Sparkles className="w-4 h-4" />
                <span>COMMISSION ARTWORK</span>
              </button>
            </div>
          </FadeUp>
        </div>

        {/* Categories Scroller Bar */}
        <FadeUp delay={0.2} yOffset={16} className="my-8">
          <div className="relative border border-white/10 bg-[#08080a] p-2 sm:p-2.5">
            <div className="flex items-center gap-2">
              {/* Left Scroll Button */}
              <button
                type="button"
                onClick={() => scrollSections('left')}
                disabled={!canScrollLeft}
                aria-label="Scroll section categories left"
                className={`shrink-0 flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 border transition-all cursor-pointer ${
                  canScrollLeft
                    ? 'border-[#C5A059]/50 bg-[#C5A059]/15 text-[#C5A059] hover:bg-[#C5A059] hover:text-black shadow-[0_0_12px_rgba(197,160,89,0.25)]'
                    : 'border-white/5 bg-[#050505] text-zinc-600 opacity-40 cursor-not-allowed'
                }`}
                title="Move sections left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Scrollable Track Container */}
              <div className="relative flex-1 overflow-hidden">
                {/* Left Gradient Fade Mask */}
                {canScrollLeft && (
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 z-10 bg-gradient-to-r from-[#08080a] to-transparent"
                  />
                )}

                {/* Categories Track */}
                <div
                  ref={scrollerRef}
                  className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto scroll-smooth py-1 select-none"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  {CATEGORIES.map((cat) => {
                    const count = cat === 'ALL'
                      ? artworks.length
                      : artworks.filter((a) => a.category === cat).length;

                    const isSelected = selectedCategory === cat;

                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={(e) => {
                          setSelectedCategory(cat);
                          e.currentTarget.scrollIntoView({
                            behavior: 'smooth',
                            inline: 'center',
                            block: 'nearest',
                          });
                        }}
                        className={`whitespace-nowrap shrink-0 px-3.5 sm:px-4 py-2 text-xs font-display font-bold tracking-[0.15em] uppercase transition-all border cursor-pointer ${
                          isSelected
                            ? 'border-[#C5A059] bg-[#C5A059]/15 text-[#C5A059] shadow-[0_0_15px_rgba(197,160,89,0.2)]'
                            : 'border-white/10 bg-[#0c0c0c] text-zinc-400 hover:border-white/25 hover:text-[#F5F5F5] hover:bg-white/5'
                        }`}
                      >
                        <span>{cat}</span>
                        {count > 0 && (
                          <span className={`ml-2 font-mono text-[10px] ${isSelected ? 'text-[#C5A059]' : 'text-zinc-500'}`}>
                            ({count})
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Right Gradient Fade Mask */}
                {canScrollRight && (
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 z-10 bg-gradient-to-l from-[#08080a] to-transparent"
                  />
                )}
              </div>

              {/* Right Scroll Button */}
              <button
                type="button"
                onClick={() => scrollSections('right')}
                disabled={!canScrollRight}
                aria-label="Scroll section categories right"
                className={`shrink-0 flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 border transition-all cursor-pointer ${
                  canScrollRight
                    ? 'border-[#C5A059]/50 bg-[#C5A059]/15 text-[#C5A059] hover:bg-[#C5A059] hover:text-black shadow-[0_0_12px_rgba(197,160,89,0.25)]'
                    : 'border-white/5 bg-[#050505] text-zinc-600 opacity-40 cursor-not-allowed'
                }`}
                title="Move sections right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Bottom Scroller Progress & Category Helper Bar */}
            <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between px-1 text-[10px] font-mono text-zinc-500">
              <div className="flex items-center gap-1.5 text-zinc-400">
                <span className="text-[#C5A059]">MOVE SECTIONS</span>
                <span>//</span>
                <span className="hidden sm:inline">USE ARROWS OR SWIPE TO EXPLORE CATEGORIES</span>
                <span className="sm:hidden">SWIPE OR USE ARROWS</span>
              </div>
              <div className="flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-[#C5A059]" />
                <span className="text-zinc-400">{artworks.length} PIECES TOTAL</span>
              </div>
            </div>
          </div>
        </FadeUp>

        {/* Gallery Content Area */}
        <div className="space-y-12">
          {filteredArtworks.length > 0 ? (
            <div className="space-y-6">
              <FadeUp delay={0.05} yOffset={10}>
                <div className="flex items-center justify-between text-xs font-mono text-zinc-400 border-b border-white/5 pb-2">
                  <span className="text-[#C5A059]">STUDIO ORIGINAL WORKS ({filteredArtworks.length})</span>
                  <span>ASYNCHRONOUS EDITORIAL LAYOUT</span>
                </div>
              </FadeUp>

              {/* Asymmetrical Grid for Curated Artwork with smooth scroll-driven fade-up */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {filteredArtworks.map((art, idx) => (
                  <motion.div
                    key={art.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{
                      duration: 0.55,
                      delay: Math.min((idx % 6) * 0.08, 0.4),
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="will-change-transform"
                  >
                    <ArtworkCard artwork={art} showActions={isOwnerMode} />
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            <div className="border border-white/10 bg-[#0c0c0c] p-12 sm:p-16 text-center flex flex-col items-center justify-center max-w-xl mx-auto space-y-4">
              <StarSparkle size="sm" variant="gold" />
              <h3 className="font-display text-xl font-bold uppercase text-[#F5F5F5] tracking-wider">
                {selectedCategory === 'ALL'
                  ? 'STUDIO ARCHIVE IS CURRENTLY BLANK'
                  : `NO ARCHIVED PIECES IN ${selectedCategory}`}
              </h3>
              <p className="text-xs text-zinc-400 font-light leading-relaxed max-w-md">
                {selectedCategory === 'ALL'
                  ? 'Original character commissions, reference sheets, and studio release pieces will appear here once published in Owner Mode. Inquire now to commission a bespoke piece.'
                  : `New original character commissions and reference pieces are constantly being crafted in the atelier. Inquire now to commission a bespoke piece for ${selectedCategory}.`}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
                {isOwnerMode && (
                  <button
                    type="button"
                    onClick={() => openUploadModal(selectedCategory !== 'ALL' ? selectedCategory : undefined)}
                    className="flex items-center gap-2 border border-[#C5A059] bg-[#0c0c0e] text-[#C5A059] px-6 py-3 text-xs font-display font-bold tracking-widest uppercase hover:bg-[#C5A059] hover:text-[#050505] transition-colors cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{selectedCategory !== 'ALL' ? `UPLOAD TO ${selectedCategory}` : 'UPLOAD FIRST ARTWORK'}</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => openContactModal()}
                  className="flex items-center gap-2 bg-[#C5A059] text-[#050505] px-6 py-3 text-xs font-display font-bold tracking-widest uppercase hover:bg-[#d6b46f] transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>INQUIRE FOR COMMISSIONS</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
