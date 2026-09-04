import React, { useRef } from 'react';
import { useStudio } from '../context/StudioContext';
import {
  ShieldCheck,
  Upload,
  LogOut,
  KeyRound,
  Layers,
} from 'lucide-react';
import { compressImageFile } from '../utils/imageHelper';

export const OwnerModeBanner: React.FC = () => {
  const {
    isOwnerMode,
    disableOwnerMode,
    openUploadModal,
    openAuthModal,
    setActivePage,
    activePage,
  } = useStudio();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImageFile(file, 1600, 1600, 0.85);
      const cleanTitle = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ').toUpperCase();
      openUploadModal(undefined, undefined, compressed, cleanTitle);
    } catch {
      openUploadModal();
    }
    e.target.value = '';
  };

  if (!isOwnerMode) return null;

  return (
    <aside
      aria-label="Owner Mode Controls"
      className="sticky top-0 z-50 w-full border-b border-[#C5A059]/40 bg-[#0c0c0e]/95 backdrop-blur-md px-4 sm:px-8 py-2 text-xs transition-all shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
    >
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
        {/* Left: Mode Badge */}
        <div className="flex items-center gap-2.5">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <div className="flex items-center gap-1.5 text-[11px] font-mono tracking-wider text-[#C5A059] font-bold uppercase">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>OWNER MODE ACTIVE</span>
          </div>
          <span className="text-zinc-600 hidden sm:inline">//</span>
          <span className="text-[10px] font-mono text-zinc-400 hidden sm:inline">
            Management & Upload Controls Unlocked
          </span>
        </div>

        {/* Right: Quick Action Controls */}
        <div className="flex items-center gap-2">
          <label
            className="flex items-center gap-1.5 bg-[#C5A059] text-[#050505] px-3 py-1 text-[10px] font-display font-bold tracking-widest uppercase hover:bg-[#d6b46f] transition-all cursor-pointer shadow-sm"
            title="Owner Action: Upload New Artwork"
          >
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <Upload className="w-3 h-3" />
            <span>UPLOAD ARTWORK</span>
          </label>

          {activePage !== 'gallery' && (
            <button
              type="button"
              onClick={() => setActivePage('gallery')}
              className="hidden sm:flex items-center gap-1 border border-zinc-700 bg-[#050505] text-zinc-300 px-2.5 py-1 text-[10px] font-mono tracking-wider hover:border-[#C5A059]/60 hover:text-[#C5A059] cursor-pointer"
            >
              <Layers className="w-3 h-3" />
              <span>GALLERY</span>
            </button>
          )}

          <button
            type="button"
            onClick={openAuthModal}
            className="flex items-center gap-1 border border-zinc-700 bg-[#050505] text-zinc-300 px-2 py-1 text-[10px] font-mono hover:text-[#C5A059] hover:border-[#C5A059]/40 cursor-pointer"
            title="Owner Security & PIN Settings"
          >
            <KeyRound className="w-3 h-3" />
            <span className="hidden md:inline">PIN</span>
          </button>

          <button
            type="button"
            onClick={disableOwnerMode}
            className="flex items-center gap-1 border border-red-500/30 bg-red-950/20 text-red-400 px-2.5 py-1 text-[10px] font-mono hover:bg-red-950/40 hover:border-red-500/60 transition-colors cursor-pointer"
            title="Lock and switch back to standard client view"
          >
            <LogOut className="w-3 h-3" />
            <span>LOCK</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
