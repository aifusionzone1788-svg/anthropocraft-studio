import React from 'react';
import { useStudio } from '../context/StudioContext';
import { StarSparkle, CornerCrosshairs } from './DecorativeElements';
import { ArtworkCard } from './ArtworkCard';
import { ArrowRight } from 'lucide-react';

export const IntroSection: React.FC = () => {
  const { studioConfig, artworks, setActivePage } = useStudio();

  // Signature featured piece
  const featuredArt = artworks[0];

  return (
    <section className="relative border-t border-white/10 bg-[#050505] px-6 sm:px-8 lg:px-12 py-20 lg:py-28 overflow-hidden">
      <div className="mx-auto max-w-7xl">
        {/* Section Label */}
        <div className="flex items-center gap-2 text-[10px] font-mono tracking-[0.3em] text-[#C5A059] uppercase mb-8">
          <StarSparkle size="xs" variant="gold" />
          <span>SECTION 01 // INTRODUCTION</span>
        </div>

        {/* Asymmetrical Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left / Main Typography Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-1">
              <h2 className="font-display text-xs sm:text-sm font-bold tracking-[0.3em] uppercase text-zinc-500">
                WELCOME TO
              </h2>
              <h3 className="font-display font-black tracking-tight uppercase text-[#F5F5F5] leading-[1.05]">
                <span className="block text-2xl xs:text-3xl sm:text-4xl md:text-[42px] lg:text-[40px] xl:text-[46px] tracking-tight whitespace-nowrap">
                  ANTHROPOCRAFT
                </span>
                <span className="block text-[#C5A059] font-light text-xl xs:text-2xl sm:text-3xl lg:text-[34px] tracking-tight mt-0.5 whitespace-nowrap">
                  STUDIO
                </span>
              </h3>
            </div>

            <div className="h-[2px] w-16 bg-[#C5A059] my-4" />

            <div className="border-l-2 border-[#C5A059] pl-5">
              <p className="text-sm sm:text-base text-[#F5F5F5]/90 font-light leading-relaxed max-w-xl">
                {studioConfig.welcomeIntro}
              </p>
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-6 text-xs font-mono text-zinc-400">
              <div className="flex items-center gap-2">
                <StarSparkle size="xs" variant="gold" />
                <span>ORIGINAL CHARACTERS</span>
              </div>
              <div className="flex items-center gap-2">
                <StarSparkle size="xs" variant="gold" />
                <span>BESPOKE COMMISSIONS</span>
              </div>
              <div className="flex items-center gap-2">
                <StarSparkle size="xs" variant="gold" />
                <span>CHARACTER REFERENCE SHEETS</span>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="button"
                onClick={() => setActivePage('gallery')}
                className="inline-flex items-center gap-2 text-xs font-display font-bold tracking-[0.2em] uppercase text-[#F5F5F5] hover:text-[#C5A059] group cursor-pointer"
              >
                <span>BROWSE RECENT WORKS</span>
                <ArrowRight className="w-4 h-4 text-[#C5A059]" />
              </button>
            </div>
          </div>

          {/* Right / Editorial Image or Placeholder Frame */}
          <div className="lg:col-span-5 relative">
            <div className="relative border border-white/10 bg-[#0c0c0c] p-3 sm:p-4">
              <CornerCrosshairs color="border-[#C5A059]/40" />

              {featuredArt ? (
                <div>
                  <ArtworkCard artwork={featuredArt} showActions={false} />
                  <div className="mt-3 flex items-center justify-between text-[10px] font-mono text-zinc-500 px-1">
                    <span className="text-zinc-400">SIGNATURE ATELIER SHOWCASE</span>
                    <span className="text-[#C5A059]">✦ ORIGINAL ARTWORK</span>
                  </div>
                </div>
              ) : (
                <div className="py-12 px-6 text-center flex flex-col items-center justify-center space-y-4 min-h-[360px]">
                  <div className="relative w-20 h-20 rounded-full border border-[#C5A059]/30 bg-[#050505] flex items-center justify-center p-2 shadow-[0_0_25px_rgba(197,160,89,0.15)]">
                    <img
                      src="https://i.postimg.cc/FKsNFtnZ/Chat-GPT-Image-Sep-4-2026-02-37-33-PM.png"
                      alt="AnthroCraft Studio Emblem"
                      className="w-full h-full object-contain rounded-full"
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="text-[10px] font-mono tracking-[0.25em] text-[#C5A059] uppercase">
                      ATELIER ARCHIVE INITIALIZED
                    </div>
                    <div className="font-display text-sm font-bold tracking-wider uppercase text-[#F5F5F5]">
                      AWAITING RECENT ORIGINAL WORKS
                    </div>
                  </div>
                  <p className="text-xs text-zinc-400 font-light max-w-xs leading-relaxed">
                    The showcase archive is primed. Commission releases and character studies will be published here upon completion.
                  </p>
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setActivePage('rates')}
                      className="inline-flex items-center gap-2 border border-[#C5A059]/50 bg-[#C5A059]/10 text-[#C5A059] px-4 py-2 text-[10px] font-display font-bold tracking-widest uppercase hover:bg-[#C5A059] hover:text-[#050505] transition-colors cursor-pointer"
                    >
                      <span>VIEW COMMISSION RATES</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

