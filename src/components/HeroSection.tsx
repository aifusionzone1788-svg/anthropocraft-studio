import React from 'react';
import { useStudio } from '../context/StudioContext';
import { StarSparkle } from './DecorativeElements';
import { ArrowRight, Sparkles } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { setActivePage, studioConfig } = useStudio();

  return (
    <section className="relative min-h-[calc(100vh-5rem)] flex flex-col justify-center items-center px-6 sm:px-8 lg:px-12 py-16 lg:py-24 overflow-hidden bg-grid-pattern">
      {/* Abstract Architectural Markings */}
      <div className="pointer-events-none absolute top-10 left-8 sm:left-16 flex items-center gap-2 text-[10px] font-mono tracking-[0.3em] text-zinc-500 select-none">
        <StarSparkle size="xs" variant="gold" />
        <span>ATELIER // 001</span>
      </div>

      <div className="pointer-events-none absolute top-10 right-8 sm:right-16 text-[10px] font-mono tracking-[0.3em] text-zinc-500 select-none hidden sm:block">
        <span>EDITION 2026</span>
      </div>

      <div className="pointer-events-none absolute bottom-10 left-8 sm:left-16 text-[10px] font-mono tracking-[0.3em] text-zinc-500 select-none hidden md:block">
        <span>ANTHROPOMORPHIC FINE ART</span>
      </div>

      <div className="pointer-events-none absolute bottom-10 right-8 sm:right-16 flex items-center gap-2 text-[10px] font-mono tracking-[0.3em] text-zinc-500 select-none hidden md:flex">
        <span>EST. STUDIO</span>
        <StarSparkle size="xs" variant="gold" />
      </div>

      {/* Main Center Container */}
      <div className="relative z-10 mx-auto max-w-5xl w-full flex flex-col items-center">
        {/* Subtle Decorative Star Accent */}
        <div className="mb-6 flex items-center justify-center gap-3">
          <div className="h-[1px] w-8 sm:w-16 bg-gradient-to-r from-transparent to-[#C5A059]/60" />
          <StarSparkle size="xs" variant="gold" />
          <div className="h-[1px] w-8 sm:w-16 bg-gradient-to-l from-transparent to-[#C5A059]/60" />
        </div>

        {/* High-Impact Brand Typography - Centered and fitted within frame */}
        <div className="relative my-4 select-none w-full max-w-5xl mx-auto px-2 sm:px-6 text-center flex flex-col items-center justify-center">
          <div className="relative inline-flex flex-col items-center text-center max-w-full">
            <h1 className="font-display font-black uppercase text-[#F5F5F5] leading-[0.9] text-center">
              <span className="block text-[clamp(1.5rem,6.2vw,4.5rem)] tracking-tight whitespace-nowrap text-center">
                {studioConfig.brandName}
              </span>
              <span className="block text-[#C5A059] text-[clamp(1.25rem,4.8vw,3.6rem)] tracking-tight font-black mt-1 sm:mt-2 whitespace-nowrap text-center">
                {studioConfig.brandSub}
              </span>
            </h1>

            {/* Geometric star accents matching design theme */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 hidden sm:block pointer-events-none">
              <StarSparkle size="sm" variant="gold" />
            </div>
            <div className="absolute bottom-2 -right-6 hidden sm:block pointer-events-none">
              <StarSparkle size="xs" variant="gold" />
            </div>
          </div>
        </div>

        {/* Tagline Container with Bold Left Accent Border */}
        <div className="my-8 sm:my-10 w-full max-w-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 px-4">
          <div className="border-l-2 border-[#C5A059] pl-5 max-w-md">
            <p className="text-base sm:text-lg font-light text-[#F5F5F5]/90 leading-snug tracking-wide uppercase font-display">
              {studioConfig.tagline}
            </p>
          </div>
          <div className="text-xs text-zinc-400 font-light leading-relaxed max-w-xs sm:border-l sm:border-white/10 sm:pl-5">
            A high-end creative atelier dedicated to expressive furry character illustration and narrative identity.
          </div>
        </div>

        {/* Two Clear Call-to-Action Buttons */}
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full max-w-md">
          <button
            type="button"
            onClick={() => setActivePage('gallery')}
            className="group w-full sm:w-auto relative flex items-center justify-center gap-3 bg-[#C5A059] text-[#050505] px-8 py-4 text-xs font-display font-bold tracking-[0.15em] uppercase hover:bg-[#d6b46f] cursor-pointer shadow-[0_0_25px_rgba(197,160,89,0.25)]"
          >
            <span>EXPLORE GALLERY</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setActivePage('rates')}
            className="group w-full sm:w-auto relative flex items-center justify-center gap-3 border border-[#C5A059] bg-[#0c0c0c]/80 px-8 py-4 text-xs font-display font-bold tracking-[0.15em] uppercase text-[#C5A059] hover:bg-[#C5A059] hover:text-[#050505] cursor-pointer"
          >
            <span>RATE SHEET</span>
            <Sparkles className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
};

