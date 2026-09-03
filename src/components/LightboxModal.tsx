import React, { useEffect } from 'react';
import { useStudio } from '../context/StudioContext';
import { CornerCrosshairs, StarSparkle } from './DecorativeElements';
import { X, Calendar, Layers, Info, Trash2 } from 'lucide-react';

export const LightboxModal: React.FC = () => {
  const { lightboxArtwork, closeLightbox, removeArtwork, isOwnerMode } = useStudio();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeLightbox]);

  if (!lightboxArtwork) return null;

  const handleDelete = () => {
    removeArtwork(lightboxArtwork.id);
    closeLightbox();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/95 backdrop-blur-xl animate-in fade-in duration-200"
      onClick={closeLightbox}
    >
      <div
        className="relative flex flex-col max-h-[92vh] max-w-5xl w-full border border-white/10 bg-[#0c0c0c] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <CornerCrosshairs color="border-[#C5A059]/70" />

        {/* Top Minimal Bar */}
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-3 bg-[#050505] text-zinc-400 text-xs">
          <div className="flex items-center gap-2">
            <StarSparkle size="xs" variant="gold" />
            <span className="font-display font-bold tracking-widest text-[#F5F5F5] uppercase">
              {lightboxArtwork.title}
            </span>
            <span className="text-zinc-600">//</span>
            <span className="text-[#C5A059] text-[11px] uppercase tracking-wider font-mono">
              {lightboxArtwork.category}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {isOwnerMode && (
              <button
                type="button"
                onClick={handleDelete}
                className="flex items-center gap-1.5 text-red-400 hover:text-red-300 border border-red-500/30 hover:border-red-500/60 bg-red-950/20 px-2.5 py-1 transition-colors cursor-pointer"
                title="Owner Action: Delete Artwork from Atelier"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="text-[10px] font-mono tracking-wider">DELETE PIECE</span>
              </button>
            )}
            <button
              type="button"
              onClick={closeLightbox}
              className="flex items-center gap-1 text-zinc-400 hover:text-[#F5F5F5] px-2 py-1 transition-colors cursor-pointer"
            >
              <span className="text-[10px] font-mono tracking-widest">ESC</span>
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Artwork Preview Area */}
        <div className="relative flex-1 flex items-center justify-center p-4 bg-[#050505] overflow-auto max-h-[70vh]">
          <img
            src={lightboxArtwork.imageUrl}
            alt={lightboxArtwork.title}
            className="max-h-[66vh] max-w-full object-contain rounded-xs border border-white/10 shadow-2xl"
          />
        </div>

        {/* Bottom Details Footer */}
        <div className="border-t border-white/10 bg-[#0c0c0c] px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-zinc-400">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>{lightboxArtwork.medium || 'Digital Illustration'}</span>
            </div>
            {lightboxArtwork.year && (
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>{lightboxArtwork.year}</span>
              </div>
            )}
            {lightboxArtwork.description && (
              <div className="flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-[#C5A059]" />
                <span className="text-[#F5F5F5] italic">{lightboxArtwork.description}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono text-zinc-500 tracking-wider">
              ANTHROPOCRAFT STUDIO ARCHIVE
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
