import React, { useState, useEffect, useRef } from 'react';
import { useStudio } from '../context/StudioContext';
import { CornerCrosshairs, StarSparkle } from './DecorativeElements';
import {
  X,
  Lock,
  Unlock,
  ShieldCheck,
  AlertCircle,
  Eye,
  EyeOff,
  Upload,
  Layers,
  LogOut,
  Sparkles,
} from 'lucide-react';

export const OwnerAuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    closeAuthModal,
    isOwnerMode,
    enableOwnerMode,
    disableOwnerMode,
    ownerPin,
    updateOwnerPin,
    openUploadModal,
    setActivePage,
  } = useStudio();

  const [inputVal, setInputVal] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [shake, setShake] = useState(false);
  const [isChangingPin, setIsChangingPin] = useState(false);
  const [newPinVal, setNewPinVal] = useState('');
  const [pinSuccessMsg, setPinSuccessMsg] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isAuthModalOpen) {
      setInputVal('');
      setErrorMsg('');
      setIsChangingPin(false);
      setNewPinVal('');
      setPinSuccessMsg('');
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) {
      setErrorMsg('Please enter a PIN or master password.');
      return;
    }

    const success = enableOwnerMode(inputVal);
    if (success) {
      setErrorMsg('');
      setInputVal('');
    } else {
      setErrorMsg('Incorrect PIN or passphrase. Access denied.');
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  const handleUpdatePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPinVal.trim().length < 3) {
      setErrorMsg('PIN must be at least 3 characters.');
      return;
    }
    updateOwnerPin(newPinVal.trim());
    setPinSuccessMsg('Owner PIN successfully updated.');
    setNewPinVal('');
    setTimeout(() => {
      setIsChangingPin(false);
      setPinSuccessMsg('');
    }, 1800);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={closeAuthModal}
    >
      <div
        className={`relative w-full max-w-md border border-white/10 bg-[#0c0c0e] p-6 sm:p-8 shadow-2xl transition-all ${
          shake ? 'animate-shake' : ''
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <CornerCrosshairs color="border-[#C5A059]/70" />

        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded bg-[#C5A059]/10 text-[#C5A059] border border-[#C5A059]/20">
              {isOwnerMode ? <ShieldCheck className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            </div>
            <div>
              <span className="font-display text-sm font-black tracking-wider text-[#F5F5F5] uppercase">
                {isOwnerMode ? 'ATELIER OWNER CONTROLS' : 'ATELIER // OWNER ACCESS'}
              </span>
              <span className="block text-[9px] font-mono text-[#C5A059] tracking-widest uppercase">
                {isOwnerMode ? 'PRIVILEGED MODE ACTIVE' : 'AUTHENTICATION REQUIRED'}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={closeAuthModal}
            className="p-1.5 text-zinc-400 hover:text-[#F5F5F5] hover:bg-zinc-800 rounded transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Unlocked View if already Owner Mode */}
        {isOwnerMode ? (
          <div className="space-y-5">
            <div className="p-4 border border-[#C5A059]/30 bg-[#C5A059]/5 flex items-start gap-3">
              <StarSparkle size="xs" variant="gold" />
              <div>
                <div className="text-xs font-mono font-bold text-[#C5A059] uppercase tracking-wider">
                  OWNER MODE UNLOCKED
                </div>
                <p className="text-xs text-zinc-300 font-light mt-1 leading-relaxed">
                  Artwork upload forms, delete options, and rate editing tools are visible exclusively in your current session.
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => {
                  closeAuthModal();
                  openUploadModal();
                }}
                className="w-full flex items-center justify-center gap-2 bg-[#C5A059] text-[#050505] py-3 text-xs font-display font-bold tracking-widest uppercase hover:bg-[#d6b46f] transition-all cursor-pointer shadow-lg shadow-[#C5A059]/20"
              >
                <Upload className="w-4 h-4" />
                <span>+ UPLOAD NEW ARTWORK</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  closeAuthModal();
                  setActivePage('gallery');
                }}
                className="w-full flex items-center justify-center gap-2 border border-white/10 bg-[#050505] text-zinc-200 py-2.5 text-xs font-display font-bold tracking-widest uppercase hover:border-[#C5A059]/60 hover:text-[#C5A059] transition-all cursor-pointer"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>MANAGE ART GALLERY</span>
              </button>
            </div>

            {/* Change PIN / Password Option */}
            <div className="pt-3 border-t border-white/10">
              {isChangingPin ? (
                <form onSubmit={handleUpdatePin} className="space-y-3">
                  <div className="text-xs font-mono text-[#C5A059] uppercase tracking-wider">
                    UPDATE OWNER PIN
                  </div>
                  <div>
                    <input
                      type="text"
                      value={newPinVal}
                      onChange={(e) => setNewPinVal(e.target.value)}
                      placeholder="Enter new PIN / password (e.g. 1788)"
                      className="w-full bg-[#050505] border border-zinc-700 px-3 py-2 text-xs font-mono text-[#F5F5F5] focus:border-[#C5A059] focus:outline-none"
                    />
                  </div>
                  {pinSuccessMsg && (
                    <div className="text-[11px] text-emerald-400 font-mono flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3" />
                      <span>{pinSuccessMsg}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <button
                      type="submit"
                      className="bg-[#C5A059] text-[#050505] px-4 py-1.5 text-xs font-display font-bold tracking-widest uppercase hover:bg-[#d6b46f] cursor-pointer"
                    >
                      SAVE NEW PIN
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsChangingPin(false)}
                      className="text-xs font-mono text-zinc-400 hover:text-[#F5F5F5] px-3 py-1.5 cursor-pointer"
                    >
                      CANCEL
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                  <span>Current PIN: <strong className="text-zinc-200">{ownerPin}</strong></span>
                  <button
                    type="button"
                    onClick={() => setIsChangingPin(true)}
                    className="text-[#C5A059] hover:underline cursor-pointer text-[11px]"
                  >
                    CHANGE PIN
                  </button>
                </div>
              )}
            </div>

            {/* Lock / Exit Owner Mode */}
            <div className="pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => {
                  disableOwnerMode();
                  closeAuthModal();
                }}
                className="w-full flex items-center justify-center gap-2 border border-red-500/30 bg-red-950/10 text-red-400 py-2.5 text-xs font-mono tracking-wider hover:bg-red-950/30 hover:border-red-500/60 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>LOCK &amp; RETURN TO CLIENT VIEW</span>
              </button>
            </div>
          </div>
        ) : (
          /* Locked Form */
          <form onSubmit={handleSubmit} className="space-y-5">
            <p className="text-xs text-zinc-400 font-light leading-relaxed">
              Upload controls and edit actions are hidden by default from normal visitors. Enter your studio PIN to reveal management tools.
            </p>

            <div>
              <label className="block text-[11px] font-mono tracking-widest text-[#C5A059] uppercase mb-2">
                SECURITY PIN OR PASSPHRASE
              </label>
              <div className="relative">
                <input
                  ref={inputRef}
                  type={showPassword ? 'text' : 'password'}
                  value={inputVal}
                  onChange={(e) => {
                    setInputVal(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  placeholder="Enter PIN (e.g. 1788 or atelier)"
                  className="w-full bg-[#050505] border border-zinc-700 px-3.5 py-2.5 text-sm font-mono text-[#F5F5F5] focus:border-[#C5A059] focus:outline-none pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {errorMsg && (
              <div className="p-2.5 border border-red-500/40 bg-red-950/20 text-red-400 text-xs font-mono flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="space-y-2">
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-[#C5A059] text-[#050505] py-3 text-xs font-display font-bold tracking-widest uppercase hover:bg-[#d6b46f] transition-all cursor-pointer shadow-lg shadow-[#C5A059]/20"
              >
                <Unlock className="w-4 h-4" />
                <span>UNLOCK OWNER CONTROLS</span>
              </button>

              <button
                type="button"
                onClick={closeAuthModal}
                className="w-full py-2 text-xs font-mono text-zinc-400 hover:text-[#F5F5F5] cursor-pointer"
              >
                CANCEL / RETURN TO SITE
              </button>
            </div>

            <div className="pt-3 border-t border-white/5 text-[10px] font-mono text-zinc-500 flex items-center justify-between">
              <span>SHORTCUT: Ctrl+Shift+A</span>
              <span className="text-zinc-400">DEFAULT: 1788</span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
