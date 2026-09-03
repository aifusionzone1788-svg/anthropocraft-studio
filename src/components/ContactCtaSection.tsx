import React from 'react';
import { useStudio } from '../context/StudioContext';
import { StarSparkle } from './DecorativeElements';
import { MessageSquare, ArrowUpRight } from 'lucide-react';

export const ContactCtaSection: React.FC = () => {
  const { openContactModal } = useStudio();

  return (
    <section className="relative border-t border-white/10 bg-[#050505] px-6 sm:px-8 lg:px-12 py-24 lg:py-36 overflow-hidden">
      {/* Background Subtle Coordinate Lines */}
      <div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-40" />

      <div className="relative z-10 mx-auto max-w-4xl text-center flex flex-col items-center">
        {/* Decorative Top Accent */}
        <div className="mb-6 flex items-center justify-center gap-3">
          <StarSparkle size="xs" variant="gold" />
          <span className="text-[10px] font-mono tracking-[0.35em] text-[#C5A059] uppercase">
            SECTION 04 // CONNECT & COMMISSION
          </span>
          <StarSparkle size="xs" variant="gold" />
        </div>

        {/* Large Heading */}
        <h2 className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight uppercase text-[#F5F5F5] leading-[0.95]">
          LET’S CREATE<br />
          <span className="text-[#C5A059]">SOMETHING UNIQUE</span>
        </h2>

        {/* Short Professional Message */}
        <p className="mt-8 max-w-xl text-sm sm:text-base text-zinc-300 font-light leading-relaxed">
          Have an original furry character, fursona reference sheet, or custom illustration concept in mind? Inquire for availability, custom quotes, and collaborative art commissions.
        </p>

        {/* Prominent Contact Now Button */}
        <div className="mt-10">
          <button
            type="button"
            onClick={() => openContactModal()}
            className="group relative flex items-center justify-center gap-3 bg-[#C5A059] text-[#050505] px-10 py-5 text-xs sm:text-sm font-display font-bold tracking-[0.2em] uppercase hover:bg-[#d6b46f] cursor-pointer shadow-[0_0_30px_rgba(197,160,89,0.25)]"
          >
            <MessageSquare className="w-4 h-4" />
            <span>CONTACT NOW</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {/* Furry Art Community Quote */}
        <div className="mt-16 pt-8 border-t border-white/10 w-full max-w-2xl flex flex-col items-center text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="h-[1px] w-8 sm:w-16 bg-gradient-to-r from-transparent to-[#C5A059]/60" />
            <StarSparkle size="xs" variant="gold" />
            <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#C5A059]">
              ATELIER ETHOS
            </span>
            <StarSparkle size="xs" variant="gold" />
            <div className="h-[1px] w-8 sm:w-16 bg-gradient-to-l from-transparent to-[#C5A059]/60" />
          </div>

          <blockquote className="relative px-6 sm:px-10 py-3">
            <p className="font-serif italic text-base sm:text-lg md:text-xl text-[#F5F5F5]/90 font-light leading-relaxed tracking-wide">
              “In a world where you can be anything, be true to the wild creature within — where imagination wears its truest fur and wings.”
            </p>
            <footer className="mt-3 text-xs font-mono tracking-widest text-[#C5A059]/80 uppercase">
              — AnthroCraft &amp; The Furry Art Collective
            </footer>
          </blockquote>
        </div>
      </div>
    </section>
  );
};

