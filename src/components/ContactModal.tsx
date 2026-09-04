import React, { useState, useEffect } from 'react';
import { useStudio } from '../context/StudioContext';
import { CornerCrosshairs, StarSparkle } from './DecorativeElements';
import { INITIAL_STUDIO_CONFIG } from '../data/initialData';
import {
  X,
  Copy,
  Check,
  Mail,
  Instagram,
  Twitter,
  MessageSquare,
  ArrowUpRight,
  Edit3,
  Save,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';

export const ContactModal: React.FC = () => {
  const {
    isContactModalOpen,
    closeContactModal,
    contactTierSelected,
    rateTiers,
    studioConfig,
    updateSocials,
    isOwnerMode,
  } = useStudio();

  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Owner Mode Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [formInstagram, setFormInstagram] = useState(studioConfig.socials.instagram);
  const [formTwitter, setFormTwitter] = useState(studioConfig.socials.twitter);
  const [formDiscord, setFormDiscord] = useState(studioConfig.socials.discord);
  const [formEmail, setFormEmail] = useState(studioConfig.socials.email);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Synchronize local form fields when studioConfig changes or modal opens
  useEffect(() => {
    if (isContactModalOpen) {
      setFormInstagram(studioConfig.socials.instagram);
      setFormTwitter(studioConfig.socials.twitter);
      setFormDiscord(studioConfig.socials.discord);
      setFormEmail(studioConfig.socials.email);
      setSaveSuccess(false);
    }
  }, [isContactModalOpen, studioConfig.socials]);

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
    const trimmed = urlOrHandle.trim();
    if (platform === 'instagram') {
      const match = trimmed.match(/(?:instagram\.com\/)([^/?#]+)/i);
      return match ? `@${match[1]}` : trimmed.startsWith('@') ? trimmed : `@${trimmed}`;
    }
    if (platform === 'twitter') {
      const match = trimmed.match(/(?:twitter\.com|x\.com)\/([^/?#]+)/i);
      return match ? `@${match[1]}` : trimmed.startsWith('@') ? trimmed : `@${trimmed}`;
    }
    return trimmed;
  };

  const getHref = (urlOrHandle: string, platform: 'instagram' | 'twitter' | 'discord' | 'email') => {
    if (!urlOrHandle) return undefined;
    const trimmed = urlOrHandle.trim();
    if (platform === 'email') {
      const cleanEmail = trimmed.replace(/^mailto:/i, '');
      return `mailto:${cleanEmail}?subject=${encodeURIComponent(
        selectedTier ? `Commission Inquiry: ${selectedTier.title}` : 'Commission Inquiry - AnthroCraft Studio'
      )}`;
    }
    if (platform === 'discord') {
      if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
        return trimmed;
      }
      return undefined; // Discord username copied to clipboard
    }
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      return trimmed;
    }
    if (platform === 'instagram') {
      return `https://instagram.com/${trimmed.replace(/^@/, '')}`;
    }
    if (platform === 'twitter') {
      return `https://x.com/${trimmed.replace(/^@/, '')}`;
    }
    return trimmed;
  };

  const handleSaveSocials = (e: React.FormEvent) => {
    e.preventDefault();
    updateSocials({
      instagram: formInstagram.trim(),
      twitter: formTwitter.trim(),
      discord: formDiscord.trim(),
      email: formEmail.trim(),
    });
    setSaveSuccess(true);
    setIsEditing(false);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 4000);
  };

  const handleResetToDefaults = () => {
    if (window.confirm('Reset all social links and contact handles to studio defaults?')) {
      setFormInstagram(INITIAL_STUDIO_CONFIG.socials.instagram);
      setFormTwitter(INITIAL_STUDIO_CONFIG.socials.twitter);
      setFormDiscord(INITIAL_STUDIO_CONFIG.socials.discord);
      setFormEmail(INITIAL_STUDIO_CONFIG.socials.email);
    }
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
      href: studioConfig.socials.discord?.startsWith('http') ? studioConfig.socials.discord : undefined,
      icon: MessageSquare,
      description: 'Add or DM directly on Discord to discuss character sheets and references',
      actionType: studioConfig.socials.discord?.startsWith('http') ? 'link' : 'copy-only',
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
              <div className="flex items-center gap-2">
                <h3 className="font-display text-lg sm:text-xl font-bold tracking-wider text-[#F5F5F5] uppercase">
                  {isEditing ? 'EDIT STUDIO CONTACTS' : 'STUDIO SOCIALS & CONTACTS'}
                </h3>
                {isOwnerMode && (
                  <span className="text-[9px] font-mono tracking-widest text-[#C5A059] uppercase bg-[#C5A059]/10 px-2 py-0.5 border border-[#C5A059]/30">
                    OWNER MODE
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-400">
                {isEditing
                  ? 'Update handles, usernames, and direct links. Saved permanently to your browser.'
                  : 'Connect directly on your preferred platform for commissions & inquiries'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isOwnerMode && (
              <button
                type="button"
                onClick={() => {
                  setIsEditing(!isEditing);
                  setSaveSuccess(false);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-bold tracking-wider uppercase border border-[#C5A059] bg-[#C5A059]/10 text-[#C5A059] hover:bg-[#C5A059] hover:text-[#050505] transition-all cursor-pointer"
                title="Owner Action: Edit all contact links and handles"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{isEditing ? 'VIEW CARDS' : 'EDIT CONTACTS'}</span>
                <span className="sm:hidden">{isEditing ? 'VIEW' : 'EDIT'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={closeContactModal}
              className="p-2 text-zinc-400 hover:text-[#F5F5F5] hover:bg-zinc-800 rounded transition-colors cursor-pointer"
              aria-label="Close Contact Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Selected Tier Notification if opened from rate sheet */}
        {selectedTier && !isEditing && (
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

        {/* Success Alert Banner */}
        {saveSuccess && (
          <div className="mb-6 p-3 border border-emerald-500/40 bg-emerald-950/40 flex items-center gap-2.5 text-emerald-300 text-xs font-mono shrink-0 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Contact channels updated and saved permanently to browser storage!</span>
          </div>
        )}

        {/* Modal Body: Either Owner Edit Form OR Client Social Cards */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {isEditing ? (
            /* OWNER EDIT FORM */
            <form onSubmit={handleSaveSocials} className="space-y-4">
              <div className="p-3 border border-[#C5A059]/30 bg-[#08080a] flex items-center justify-between text-xs font-mono text-[#C5A059]">
                <div className="flex items-center gap-2">
                  <StarSparkle size="xs" variant="gold" />
                  <span>DIRECT OWNER EDITING // CONTACT HANDLES & DESTINATIONS</span>
                </div>
                <span className="text-[10px] text-zinc-500 tracking-wider">AUTO-PERSISTED</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Instagram */}
                <div className="border border-zinc-800 bg-[#050505] p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-xs font-display font-bold tracking-wider text-[#F5F5F5] uppercase">
                      <Instagram className="w-4 h-4 text-[#C5A059]" />
                      <span>INSTAGRAM</span>
                    </label>
                    <span className="text-[9px] font-mono text-zinc-500 uppercase">HANDLE OR URL</span>
                  </div>
                  <input
                    type="text"
                    value={formInstagram}
                    onChange={(e) => setFormInstagram(e.target.value)}
                    placeholder="anthrocraft.studio or https://instagram.com/..."
                    className="w-full bg-[#0c0c0e] border border-zinc-700 px-3 py-2 text-xs text-[#F5F5F5] focus:border-[#C5A059] focus:outline-none font-mono"
                  />
                  <div className="text-[10px] font-mono text-zinc-400 flex items-center justify-between">
                    <span>Preview: {cleanHandle(formInstagram, 'instagram') || 'None'}</span>
                  </div>
                </div>

                {/* Twitter / X */}
                <div className="border border-zinc-800 bg-[#050505] p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-xs font-display font-bold tracking-wider text-[#F5F5F5] uppercase">
                      <Twitter className="w-4 h-4 text-[#C5A059]" />
                      <span>TWITTER / X</span>
                    </label>
                    <span className="text-[9px] font-mono text-zinc-500 uppercase">HANDLE OR URL</span>
                  </div>
                  <input
                    type="text"
                    value={formTwitter}
                    onChange={(e) => setFormTwitter(e.target.value)}
                    placeholder="anthrocraft or https://x.com/..."
                    className="w-full bg-[#0c0c0e] border border-zinc-700 px-3 py-2 text-xs text-[#F5F5F5] focus:border-[#C5A059] focus:outline-none font-mono"
                  />
                  <div className="text-[10px] font-mono text-zinc-400 flex items-center justify-between">
                    <span>Preview: {cleanHandle(formTwitter, 'twitter') || 'None'}</span>
                  </div>
                </div>

                {/* Discord */}
                <div className="border border-zinc-800 bg-[#050505] p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-xs font-display font-bold tracking-wider text-[#F5F5F5] uppercase">
                      <MessageSquare className="w-4 h-4 text-[#C5A059]" />
                      <span>DISCORD</span>
                    </label>
                    <span className="text-[9px] font-mono text-zinc-500 uppercase">USER OR INVITE</span>
                  </div>
                  <input
                    type="text"
                    value={formDiscord}
                    onChange={(e) => setFormDiscord(e.target.value)}
                    placeholder="anthrocraft.studio or https://discord.gg/..."
                    className="w-full bg-[#0c0c0e] border border-zinc-700 px-3 py-2 text-xs text-[#F5F5F5] focus:border-[#C5A059] focus:outline-none font-mono"
                  />
                  <div className="text-[10px] font-mono text-zinc-400">
                    <span>Clients copy this handle or click to visit invite</span>
                  </div>
                </div>

                {/* Atelier Email */}
                <div className="border border-zinc-800 bg-[#050505] p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-xs font-display font-bold tracking-wider text-[#F5F5F5] uppercase">
                      <Mail className="w-4 h-4 text-[#C5A059]" />
                      <span>ATELIER EMAIL</span>
                    </label>
                    <span className="text-[9px] font-mono text-zinc-500 uppercase">MAILBOX</span>
                  </div>
                  <input
                    type="email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="contact@anthrocraft.studio"
                    className="w-full bg-[#0c0c0e] border border-zinc-700 px-3 py-2 text-xs text-[#F5F5F5] focus:border-[#C5A059] focus:outline-none font-mono"
                  />
                  <div className="text-[10px] font-mono text-zinc-400">
                    <span>Triggers client default email client with subject</span>
                  </div>
                </div>
              </div>

              {/* Form Footer Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={handleResetToDefaults}
                  className="flex items-center gap-1.5 text-xs font-mono text-zinc-500 hover:text-zinc-300 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>RESET TO DEFAULTS</span>
                </button>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => {
                      setFormInstagram(studioConfig.socials.instagram);
                      setFormTwitter(studioConfig.socials.twitter);
                      setFormDiscord(studioConfig.socials.discord);
                      setFormEmail(studioConfig.socials.email);
                      setIsEditing(false);
                    }}
                    className="flex-1 sm:flex-none px-4 py-2 text-xs font-mono text-zinc-400 hover:text-[#F5F5F5] cursor-pointer"
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#C5A059] text-[#050505] px-6 py-2.5 text-xs font-display font-bold tracking-widest uppercase hover:bg-[#d6b46f] transition-colors cursor-pointer shadow-lg shadow-[#C5A059]/20"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>SAVE CONTACTS</span>
                  </button>
                </div>
              </div>
            </form>
          ) : (
            /* CLIENT VIEW CARDS */
            <>
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

                          {/* Quick Edit in Owner Mode */}
                          {isOwnerMode && (
                            <button
                              type="button"
                              onClick={() => setIsEditing(true)}
                              className="text-[10px] font-mono text-[#C5A059] hover:text-[#d6b46f] flex items-center gap-1 border border-[#C5A059]/30 hover:border-[#C5A059] bg-[#C5A059]/5 px-2 py-0.5 transition-colors cursor-pointer"
                              title={`Edit ${social.name} handle in Owner Mode`}
                            >
                              <Edit3 className="w-3 h-3" />
                              <span>EDIT</span>
                            </button>
                          )}
                        </div>

                        {/* Handle / Address */}
                        <div className="my-2 p-2.5 bg-[#0c0c0e] border border-zinc-800/80 rounded">
                          <div className="text-xs font-mono text-[#F5F5F5] font-semibold break-all">
                            {social.handle || <span className="text-zinc-500 italic">Not set</span>}
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};
