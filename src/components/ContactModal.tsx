import React, { useState } from 'react';
import { useStudio } from '../context/StudioContext';
import { CornerCrosshairs, StarSparkle } from './DecorativeElements';
import {
  X,
  Copy,
  Check,
  Mail,
  Instagram,
  Twitter,
  MessageSquare,
  ArrowUpRight,
} from 'lucide-react';

export const ContactModal: React.FC = () => {
  const { isContactModalOpen, closeContactModal, contactTierSelected, rateTiers, studioConfig } =
    useStudio();

  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isContactModalOpen) return null;

  const selectedTier = rateTiers.find((t) => t.id === contactTierSelected);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey(null);
    }, 2000);
  };

  const cleanHandle = (urlOrHandle: string, platform: string) => {
    if (!urlOrHandle) return '';
    if (platform === 'instagram') {
      const match = urlOrHandle.match(/(?:instagram\.com\/)([^/?#]+)/i);
      return match ? `@${match[1]}` : urlOrHandle.startsWith('@') ? urlOrHandle : `@${urlOrHandle}`;
    }
    if (platform === 'twitter') {
      const match = urlOrHandle.match(/(?:twitter\.com|x\.com)\/([^/?#]+)/i);
      return match ? `@${match[1]}` : urlOrHandle.startsWith('@') ? urlOrHandle : `@${urlOrHandle}`;
    }
    return urlOrHandle;
  };

  const getHref = (urlOrHandle: string, platform: 'instagram' | 'twitter' | 'discord' | 'email') => {
    if (platform === 'email') {
      return `mailto:${urlOrHandle}?subject=${encodeURIComponent(
        selectedTier ? `Commission Inquiry: ${selectedTier.title}` : 'Commission Inquiry - AnthroCraft Studio'
      )}`;
    }
    if (platform === 'discord') {
      return undefined; // Discord handle copy
    }
    if (urlOrHandle.startsWith('http://') || urlOrHandle.startsWith('https://')) {
      return urlOrHandle;
    }
    if (platform === 'instagram') {
      return `https://instagram.com/${urlOrHandle.replace(/^@/, '')}`;
    }
    if (platform === 'twitter') {
      return `https://x.com/${urlOrHandle.replace(/^@/, '')}`;
    }
    return urlOrHandle;
  };

  const socialsList = [
    {
      id: 'instagram',
      name: 'INSTAGRAM',
      handle: cleanHandle(studioConfig.socials.instagram, 'instagram'),
      value: studioConfig.socials.instagram,
      href: getHref(studioConfig.socials.instagram, 'instagram'),
      icon: Instagram,
      description: 'DMs open for commission inquiries, WIPs, and custom quotes',
      actionType: 'link',
      copyValue: cleanHandle(studioConfig.socials.instagram, 'instagram'),
      tag: 'DIRECT DM & PORTFOLIO',
    },
    {
      id: 'twitter',
      name: 'TWITTER / X',
      handle: cleanHandle(studioConfig.socials.twitter, 'twitter'),
      value: studioConfig.socials.twitter,
      href: getHref(studioConfig.socials.twitter, 'twitter'),
      icon: Twitter,
      description: 'Direct messages open for art slots, previews, and queries',
      actionType: 'link',
      copyValue: cleanHandle(studioConfig.socials.twitter, 'twitter'),
      tag: 'FASTEST DM RESPONSE',
    },
    {
      id: 'discord',
      name: 'DISCORD',
      handle: studioConfig.socials.discord,
      value: studioConfig.socials.discord,
      icon: MessageSquare,
      description: 'Add or DM directly on Discord to discuss character sheets and references',
      actionType: 'copy-only',
      copyValue: studioConfig.socials.discord,
      tag: 'DIRECT CHAT & REFS',
    },
    {
      id: 'email',
      name: 'ATELIER EMAIL',
      handle: studioConfig.socials.email,
      value: studioConfig.socials.email,
      href: getHref(studioConfig.socials.email, 'email'),
      icon: Mail,
      description: 'Official studio mailbox for formal commission agreements & inquiries',
      actionType: 'mailto',
      copyValue: studioConfig.socials.email,
      tag: 'OFFICIAL INQUIRIES',
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md"
      onClick={closeContactModal}
    >
      <div
        className="relative w-full max-w-3xl border border-white/10 bg-[#0c0c0e] p-6 sm:p-8 shadow-2xl transition-all max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <CornerCrosshairs color="border-[#C5A059]/60" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-5 mb-6 shrink-0">
          <div className="flex items-center gap-3">
            <StarSparkle size="sm" variant="gold" />
            <div>
              <h3 className="font-display text-lg sm:text-xl font-bold tracking-wider text-[#F5F5F5] uppercase">
                STUDIO SOCIALS & CONTACTS
              </h3>
              <p className="text-xs text-zinc-400">
                Connect directly on your preferred platform for commissions & inquiries
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeContactModal}
            className="p-2 text-zinc-400 hover:text-[#F5F5F5] hover:bg-zinc-800 rounded transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selected Tier Notification if opened from rate sheet */}
        {selectedTier && (
          <div className="mb-6 p-3.5 border border-[#C5A059]/40 bg-[#050505] flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2.5">
              <StarSparkle size="xs" variant="gold" />
              <span className="text-xs font-mono text-zinc-300">
                Inquiring for:{' '}
                <strong className="text-[#C5A059] font-display uppercase tracking-wider">
                  {selectedTier.title}
                </strong>{' '}
                <span className="text-zinc-400 font-mono">({selectedTier.price})</span>
              </span>
            </div>
            <span className="text-[10px] font-mono tracking-widest text-[#C5A059] uppercase bg-[#C5A059]/10 px-2 py-0.5 border border-[#C5A059]/30">
              TIER SELECTED
            </span>
          </div>
        )}

        {/* Social Cards Grid */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {socialsList.map((social) => {
              const IconComponent = social.icon;
              const isCopied = copiedKey === social.id;

              return (
                <div
                  key={social.id}
                  className="group relative border border-white/10 bg-[#050505] p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 hover:border-[#C5A059]/70 hover:bg-[#070709]"
                >
                  <div>
                    {/* Top platform bar */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded bg-[#C5A059]/10 text-[#C5A059] border border-[#C5A059]/20">
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="font-display text-xs font-bold tracking-wider text-[#F5F5F5] uppercase">
                            {social.name}
                          </span>
                          <span className="block text-[9px] font-mono text-[#C5A059] tracking-widest uppercase">
                            {social.tag}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Handle / Address */}
                    <div className="my-2 p-2.5 bg-[#0c0c0e] border border-zinc-800/80 rounded">
                      <div className="text-xs font-mono text-[#F5F5F5] font-semibold break-all">
                        {social.handle}
                      </div>
                    </div>

                    <p className="text-[11px] text-zinc-400 font-light leading-relaxed mb-4">
                      {social.description}
                    </p>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-2 pt-3 border-t border-white/5">
                    {social.href && (
                      <a
                        href={social.href}
                        target={social.actionType === 'mailto' ? '_self' : '_blank'}
                        rel={social.actionType === 'mailto' ? undefined : 'noopener noreferrer'}
                        className="flex-1 flex items-center justify-center gap-1.5 bg-[#C5A059] text-[#050505] py-2 px-3 text-[11px] font-display font-bold tracking-widest uppercase hover:bg-[#d6b46f] transition-all"
                      >
                        <span>{social.actionType === 'mailto' ? 'SEND EMAIL' : 'OPEN LINK'}</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    )}

                    <button
                      type="button"
                      onClick={() => handleCopy(social.copyValue, social.id)}
                      className={`${
                        social.href ? 'px-3' : 'w-full'
                      } py-2 flex items-center justify-center gap-1.5 border border-zinc-700 bg-[#0c0c0e] text-zinc-300 hover:text-[#C5A059] hover:border-[#C5A059]/50 transition-colors text-[11px] font-mono cursor-pointer`}
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400 font-bold">COPIED</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-zinc-400" />
                          <span>{social.href ? 'COPY' : 'COPY USERNAME'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Direct Inquiry Guidelines note */}
          <div className="p-4 border border-zinc-800/80 bg-[#050505] flex items-start gap-3">
            <StarSparkle size="xs" variant="gold" />
            <div className="text-xs text-zinc-400 font-light leading-relaxed">
              <strong className="text-zinc-200 font-medium">Commission Note:</strong> Reach out directly on any channel above. For the fastest booking, please include your character references, desired tier/scope, and target deadline.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
