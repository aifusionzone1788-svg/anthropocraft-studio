import React from 'react';
import { INITIAL_MILESTONES } from '../data/initialData';
import { useStudio } from '../context/StudioContext';
import { StarSparkle, CornerCrosshairs } from './DecorativeElements';
import { ArrowRight } from 'lucide-react';

export const MilestonesSection: React.FC = () => {
  const { openContactModal } = useStudio();

  return (
    <section className="relative border-t border-white/10 bg-[#050505] px-6 sm:px-8 lg:px-12 py-20 lg:py-28 overflow-hidden">
      <div className="mx-auto max-w-7xl">
        {/* Section Label */}
        <div className="flex items-center gap-2 text-[10px] font-mono tracking-[0.3em] text-[#C5A059] uppercase mb-8">
          <StarSparkle size="xs" variant="gold" />
          <span>SECTION 03 // STUDIO TIMELINE</span>
        </div>

        {/* Section Title */}
        <div className="mb-16">
          <h2 className="font-display text-xs sm:text-sm font-bold tracking-[0.3em] uppercase text-zinc-500 mb-2">
            CAREER
          </h2>
          <h3 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight uppercase text-[#F5F5F5]">
            MILESTONES
          </h3>
          <div className="h-[2px] w-20 bg-[#C5A059] mt-4" />
        </div>

        {/* Editorial Milestone Grid matching Bold Typography pattern */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {INITIAL_MILESTONES.slice(0, 3).map((item) => (
            <div
              key={item.number}
              className="group relative border border-white/10 bg-[#0c0c0c] p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:border-[#C5A059]/60 hover:bg-[#121212]"
            >
              <CornerCrosshairs color="border-zinc-800 group-hover:border-[#C5A059]/50" />

              {/* Top: Large Editorial Number */}
              <div>
                <div className="font-display text-4xl sm:text-5xl font-extrabold text-[#C5A059] tracking-tighter mb-4 select-none">
                  {item.number}
                </div>
                <h4 className="font-display text-xs sm:text-sm font-bold tracking-[0.15em] uppercase text-[#F5F5F5] mb-2 group-hover:text-[#C5A059] transition-colors">
                  {item.title}
                </h4>
                <p className="text-xs text-zinc-400 font-light leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Bottom Subtle Bar */}
              <div className="mt-8 pt-3 border-t border-white/5 flex items-center justify-between text-[9px] font-mono text-zinc-500">
                <span>PHASE {item.number}</span>
                <span className="text-[#C5A059]">✦ ATELIER</span>
              </div>
            </div>
          ))}

          {/* 4th Item: Bold Call to Action Box from Design HTML */}
          <div className="group relative border border-[#C5A059]/40 bg-[#0c0c0c] p-5 sm:p-6 lg:p-5 xl:p-7 flex flex-col justify-between transition-all duration-300 hover:border-[#C5A059]">
            <CornerCrosshairs color="border-[#C5A059]/60" />

            <div>
              <div className="text-[#C5A059] uppercase tracking-[0.2em] text-[10px] font-mono font-bold mb-3 flex items-center gap-2">
                <StarSparkle size="xs" variant="gold" />
                <span>LET’S CREATE</span>
              </div>
              <h4 className="font-display text-lg sm:text-xl md:text-2xl lg:text-[17px] xl:text-xl font-black uppercase text-[#F5F5F5] leading-tight mb-3 tracking-tight">
                <span className="block">START YOUR</span>
                <span className="block">COMMISSION</span>
              </h4>
              <p className="text-xs text-zinc-400 font-light leading-relaxed mb-6">
                Now accepting select character commissions, concept illustrations, and custom visual projects.
              </p>
            </div>

            <button
              type="button"
              onClick={() => openContactModal()}
              className="inline-flex items-center gap-2 text-xs font-display font-bold uppercase tracking-widest text-[#C5A059] border-b border-[#C5A059] pb-1 hover:text-[#d6b46f] hover:border-[#d6b46f] transition-all cursor-pointer w-fit"
            >
              <span>Contact Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

