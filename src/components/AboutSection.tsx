import React from 'react';
import { useStudio } from '../context/StudioContext';
import { StarSparkle, CornerCrosshairs } from './DecorativeElements';
import { ArtworkCard } from './ArtworkCard';

export const AboutSection: React.FC = () => {
  const { studioConfig, artworks } = useStudio();

  // Highlight studio character study piece
  const aboutArt = artworks[1] || artworks[0];

  return (
    <section
      id="about-section"
      className="relative border-t border-white/10 bg-[#050505] px-6 sm:px-8 lg:px-12 py-20 lg:py-28 overflow-hidden"
    >
      <div className="mx-auto max-w-7xl">
        {/* Section Label */}
        <div className="flex items-center gap-2 text-[10px] font-mono tracking-[0.3em] text-[#C5A059] uppercase mb-8">
          <StarSparkle size="xs" variant="gold" />
          <span>SECTION 02 // STUDIO IDENTITY</span>
        </div>

        {/* Top Editorial Heading */}
        <div className="mb-14 max-w-3xl">
          <h2 className="font-display text-xs sm:text-sm font-bold tracking-[0.3em] uppercase text-zinc-500 mb-2">
            ABOUT
          </h2>
          <h3 className="font-display font-black tracking-tight uppercase text-[#F5F5F5] leading-[1.05]">
            <span className="block text-2xl xs:text-3xl sm:text-4xl md:text-[42px] lg:text-[40px] xl:text-[46px] tracking-tight whitespace-nowrap">
              ANTHROPOCRAFT
            </span>
            <span className="block text-[#C5A059] font-light text-xl xs:text-2xl sm:text-3xl lg:text-[34px] tracking-tight mt-0.5 whitespace-nowrap">
              STUDIO
            </span>
          </h3>
          <div className="border-l-2 border-[#C5A059] pl-5 mt-6">
            <p className="text-sm sm:text-base text-[#F5F5F5]/90 font-light leading-relaxed">
              {studioConfig.aboutBody}
            </p>
          </div>
        </div>

        {/* Asymmetrical Grid: 3 Pillars + Optional Artwork Placement */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left: 3 Editorial Pillars */}
          <div className="lg:col-span-7 space-y-6">
            {studioConfig.aboutPillars.map((pillar, idx) => (
              <div
                key={pillar.title}
                className="group relative border border-white/10 bg-[#0c0c0c] p-6 sm:p-7 transition-all duration-300 hover:border-[#C5A059]/60"
              >
                <CornerCrosshairs color="border-zinc-800 group-hover:border-[#C5A059]/40" />
                <div className="flex items-start gap-4">
                  <span className="font-mono text-sm font-bold text-[#C5A059] tracking-widest pt-1">
                    0{idx + 1}
                  </span>
                  <div className="space-y-2">
                    <h4 className="font-display text-base sm:text-lg font-bold tracking-wider uppercase text-[#F5F5F5] group-hover:text-[#C5A059] transition-colors">
                      {pillar.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Studio Editorial Canvas Frame / Placeholder */}
          <div className="lg:col-span-5 relative">
            <div className="relative border border-white/10 bg-[#0c0c0c] p-3 sm:p-4">
              <CornerCrosshairs color="border-[#C5A059]/40" />

              {aboutArt ? (
                <ArtworkCard artwork={aboutArt} showActions={false} />
              ) : (
                <div className="py-12 px-6 text-center flex flex-col items-center justify-center space-y-4 min-h-[320px]">
                  <div className="w-16 h-16 rounded-full border border-[#C5A059]/30 bg-[#050505] flex items-center justify-center p-2 shadow-[0_0_20px_rgba(197,160,89,0.12)]">
                    <img
                      src="https://i.postimg.cc/FKsNFtnZ/Chat-GPT-Image-Sep-4-2026-02-37-33-PM.png"
                      alt="AnthroCraft Emblem"
                      className="w-full h-full object-contain rounded-full"
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="text-[10px] font-mono tracking-[0.25em] text-[#C5A059] uppercase">
                      STUDIO PHILOSOPHY & CRAFT
                    </div>
                    <div className="font-display text-sm font-bold tracking-wider uppercase text-[#F5F5F5]">
                      BESPOKE CHARACTER ARTISTRY
                    </div>
                  </div>
                  <p className="text-xs text-zinc-400 font-light max-w-xs leading-relaxed">
                    Every piece is rendered with dedication to expressive emotion, anatomical silhouette, and dynamic narrative depth.
                  </p>
                </div>
              )}

              <div className="mt-3 flex items-center justify-between text-[10px] font-mono text-zinc-500 px-1">
                <span>CANVAS REF // ABOUT-02</span>
                <span className="text-[#C5A059]">✦ DISCIPLINE</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

