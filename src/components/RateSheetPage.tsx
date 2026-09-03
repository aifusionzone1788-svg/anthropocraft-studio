import React from 'react';
import { useStudio } from '../context/StudioContext';
import { StarSparkle, CornerCrosshairs } from './DecorativeElements';
import { RateTierImageControl } from './RateTierImageControl';
import {
  Check,
  Clock,
  Send,
  ShieldCheck,
  Edit3,
} from 'lucide-react';

export const RateSheetPage: React.FC = () => {
  const {
    rateTiers,
    updateRateTier,
    openContactModal,
    studioConfig,
    isOwnerMode,
    openEditRatesModal,
  } = useStudio();

  const WORKFLOW_STEPS = [
    {
      num: '01',
      title: 'CONCEPT & INQUIRY',
      desc: 'Submit your character references, desired pose, expressions, and commission category.',
    },
    {
      num: '02',
      title: 'ROUGH SKETCH & REVISION',
      desc: 'Review anatomy, composition, and silhouette. Major revisions occur during this initial phase.',
    },
    {
      num: '03',
      title: 'COLOR & RENDERING',
      desc: 'Full lines, base flat colors, ambient lighting, fur texture, and dynamic shading pass.',
    },
    {
      num: '04',
      title: 'FINAL HIGH-RES DELIVERY',
      desc: 'Receive ultra-high-resolution 300 DPI files, transparent versions, and web-ready crops.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#050505] px-6 sm:px-8 lg:px-12 py-12 lg:py-20">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-white/10">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[10px] font-mono tracking-[0.3em] text-[#C5A059] uppercase">
              <StarSparkle size="xs" variant="gold" />
              <span>COMMISSION RATES // ATELIER PRICING</span>
            </div>
            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight uppercase text-[#F5F5F5]">
              RATE SHEET
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 font-light max-w-lg">
              Official commission guide and service rates for AnthroCraft Studio. All tiers feature personalized consultation, milestone updates, and print-ready deliverables.
            </p>
          </div>

          {/* Slots Status & Inquire Action */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 border border-white/10 bg-[#0c0c0c] text-xs font-mono text-zinc-300">
              <span
                className={`h-2 w-2 rounded-full ${
                  studioConfig.commissionStatus === 'OPEN'
                    ? 'bg-emerald-400 animate-pulse'
                    : 'bg-[#C5A059]'
                }`}
              />
              <span>{studioConfig.commissionStatus}</span>
              <span className="text-zinc-600">|</span>
              <span className="text-[#C5A059]">{studioConfig.slotsAvailable} SLOTS</span>
            </div>

            {isOwnerMode && (
              <button
                type="button"
                onClick={openEditRatesModal}
                className="flex items-center gap-2 border border-[#C5A059] bg-[#0c0c0e] text-[#C5A059] hover:bg-[#C5A059] hover:text-[#050505] px-4 py-3 text-xs font-display font-bold tracking-widest uppercase transition-all cursor-pointer shadow-lg shadow-[#C5A059]/10"
                title="Owner Action: Edit Rate Tiers and Pricing"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>EDIT RATES</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => openContactModal()}
              className="flex items-center gap-2 bg-[#C5A059] text-[#050505] px-5 py-3 text-xs font-display font-bold tracking-widest uppercase hover:bg-[#d6b46f] transition-all cursor-pointer shadow-[0_0_20px_rgba(197,160,89,0.2)]"
            >
              <Send className="w-3.5 h-3.5" />
              <span>INQUIRE FOR SLOTS</span>
            </button>
          </div>
        </div>

        {/* Quality & Milestone Assurance Banner */}
        <div className="my-8 p-4 border border-white/10 bg-[#0c0c0c] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-zinc-400">
          <div className="flex items-center gap-3">
            <StarSparkle size="xs" variant="gold" />
            <span>
              All commission tiers include private WIP milestones, 300 DPI print-ready master files, transparent renders, and full character copyright release for personal usage.
            </span>
          </div>
          <span className="text-[10px] font-mono text-[#C5A059] tracking-widest uppercase shrink-0">
            ✦ 300 DPI PRINT-READY
          </span>
        </div>

        {/* Rate Tiers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-20">
          {rateTiers.map((tier, idx) => (
            <div
              key={tier.id}
              className={`group relative flex flex-col justify-between border bg-[#0c0c0c] p-6 sm:p-8 transition-all duration-300 ${
                tier.featured
                  ? 'border-[#C5A059] shadow-[0_0_30px_rgba(197,160,89,0.12)]'
                  : 'border-white/10 hover:border-[#C5A059]/60'
              }`}
            >
              <CornerCrosshairs color="border-zinc-800 group-hover:border-[#C5A059]/50" />

              <div>
                {/* Top Number & Tag */}
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/5">
                  <span className="font-mono text-xs text-[#C5A059] tracking-widest font-bold">
                    TIER 0{idx + 1}
                  </span>
                  {tier.featured && (
                    <span className="px-2 py-0.5 text-[9px] font-mono tracking-widest uppercase bg-[#C5A059]/20 border border-[#C5A059]/50 text-[#C5A059]">
                      POPULAR
                    </span>
                  )}
                </div>

                {/* Title and Price */}
                <h3 className="font-display text-xl sm:text-2xl font-black tracking-tight uppercase text-[#F5F5F5] group-hover:text-[#C5A059] transition-colors">
                  {tier.title}
                </h3>

                {tier.subtitle && (
                  <p className="text-[11px] font-mono tracking-wider text-zinc-400 uppercase mt-1">
                    {tier.subtitle}
                  </p>
                )}

                {/* Price Display */}
                <div className="my-6 p-4 border border-white/5 bg-[#050505] flex items-baseline justify-between">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase">BASE RATE</span>
                  <span className="font-display text-2xl sm:text-3xl font-black tracking-tight text-[#C5A059]">
                    {tier.price.includes('[ADD') ? 'INQUIRE FOR QUOTE' : tier.price}
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed mb-6">
                  {tier.description}
                </p>

                {/* Sample Artwork with Owner Mode Controls */}
                <RateTierImageControl
                  tier={tier}
                  isOwnerMode={isOwnerMode}
                  onUpdateImage={(newImageUrl) =>
                    updateRateTier(tier.id, { imageUrl: newImageUrl })
                  }
                />

                {/* Deliverables checklist */}
                <div className="space-y-2.5 pb-6 border-b border-white/5">
                  <span className="block text-[10px] font-mono tracking-widest text-zinc-400 uppercase mb-2">
                    DELIVERABLES & INCLUSIONS:
                  </span>
                  {tier.deliverables.map((item, dIdx) => (
                    <div key={dIdx} className="flex items-start gap-2.5 text-xs text-zinc-300">
                      <Check className="w-3.5 h-3.5 text-[#C5A059] shrink-0 mt-0.5" />
                      <span className="leading-snug">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Card Footer with Turnaround & Action */}
              <div className="pt-6 mt-6 space-y-4">
                {tier.turnaround && (
                  <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-[#C5A059]" />
                      <span>TURNAROUND:</span>
                    </span>
                    <span className="text-[#F5F5F5] font-bold">{tier.turnaround}</span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => openContactModal(tier.id)}
                  className="w-full flex items-center justify-center gap-2 bg-[#C5A059] text-[#050505] py-3 text-xs font-display font-bold tracking-[0.15em] uppercase hover:bg-[#d6b46f] transition-all cursor-pointer shadow-[0_0_20px_rgba(197,160,89,0.15)]"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>INQUIRE FOR THIS TIER</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Commission Workflow Guide */}
        <div className="mb-20 border border-white/10 bg-[#0c0c0c] p-8 sm:p-12">
          <div className="mb-10 max-w-xl">
            <div className="flex items-center gap-2 text-[10px] font-mono tracking-[0.3em] text-[#C5A059] uppercase mb-2">
              <StarSparkle size="xs" variant="gold" />
              <span>PRODUCTION PROCESS</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-black uppercase text-[#F5F5F5]">
              COMMISSION WORKFLOW
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {WORKFLOW_STEPS.map((step) => (
              <div key={step.num} className="space-y-3 relative">
                <span className="font-display text-4xl font-black text-[#C5A059] select-none">
                  {step.num}
                </span>
                <h3 className="font-display text-sm font-bold uppercase tracking-wider text-[#F5F5F5]">
                  {step.title}
                </h3>
                <p className="text-xs text-zinc-400 font-light leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Terms of Service & Guidelines */}
        <div className="border border-white/10 bg-[#0c0c0c] p-8 sm:p-12 space-y-6">
          <div className="flex items-center gap-2 text-[10px] font-mono tracking-[0.3em] text-[#C5A059] uppercase">
            <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
            <span>TERMS OF SERVICE & STUDIO POLICIES</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-xs text-zinc-400 font-light leading-relaxed">
            <div className="space-y-2">
              <h4 className="font-display text-sm font-bold uppercase tracking-wider text-[#F5F5F5]">
                PAYMENT & SLOTS
              </h4>
              <p>
                Invoices are processed securely via PayPal or Stripe. Payment can be made 100% upfront or 50/50 milestone split for commissions over $200. Work begins once initial invoice is cleared.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-display text-sm font-bold uppercase tracking-wider text-[#F5F5F5]">
                REVISIONS & APPROVAL
              </h4>
              <p>
                Two rounds of revisions are included at the sketch phase. Minor adjustments (such as color tweaks or markings) are free during flat color. Redraws after rendering are subject to hourly fee.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-display text-sm font-bold uppercase tracking-wider text-[#F5F5F5]">
                USAGE & RIGHTS
              </h4>
              <p>
                Commissions include non-commercial personal usage rights (avatars, personal printing, social badges). Commercial rights (merchandise, streaming, branding) available upon inquiry.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

