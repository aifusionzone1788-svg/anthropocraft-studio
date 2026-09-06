import React, { useEffect, useState } from 'react';
import { useStudio } from '../context/StudioContext';
import { GalleryCategory } from '../types';
import { CornerCrosshairs, StarSparkle } from './DecorativeElements';
import { X, Calendar, Layers, Info, Trash2, Edit3, Check, RotateCcw, AlertCircle } from 'lucide-react';

const CATEGORIES: GalleryCategory[] = [
  'CHARACTER ART',
  'PORTRAITS',
  'FULL-BODY ART',
  'REFERENCE SHEETS',
  'MASCOT DESIGN',
  'CUSTOM ARTWORK',
];

export const LightboxModal: React.FC = () => {
  const { lightboxArtwork, closeLightbox, removeArtwork, updateArtwork, isOwnerMode } = useStudio();

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState<GalleryCategory>('CHARACTER ART');
  const [editMedium, setEditMedium] = useState('');
  const [editYear, setEditYear] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [imgSrc, setImgSrc] = useState('');
  const [imgError, setImgError] = useState(false);

  // Sync edit form fields whenever lightbox opens a piece
  useEffect(() => {
    if (lightboxArtwork) {
      setEditTitle(lightboxArtwork.title);
      setEditCategory(lightboxArtwork.category);
      setEditMedium(lightboxArtwork.medium || '');
      setEditYear(lightboxArtwork.year || '');
      setEditDescription(lightboxArtwork.description || '');
      setImgSrc(lightboxArtwork.imageUrl);
      setImgError(false);
      setIsEditing(false);
    }
  }, [lightboxArtwork]);

  const handleImageError = () => {
    const match = imgSrc.match(/(anthropo[c]?raftstudio(?:-\d+(?:-\d+)*)?)/);
    if (match && !imgSrc.includes('.webp')) {
      setImgSrc(`/artworks/${match[1]}.webp`);
    } else if (imgSrc.includes('mascot') && !imgSrc.includes('.webp')) {
      setImgSrc('/artworks/mascot.webp');
    } else {
      setImgError(true);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeLightbox]);

  if (!lightboxArtwork) return null;

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${lightboxArtwork.title}" permanently?`)) {
      removeArtwork(lightboxArtwork.id);
      closeLightbox();
    }
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    updateArtwork(lightboxArtwork.id, {
      title: editTitle.trim() || 'UNTITLED PIECE',
      category: editCategory,
      medium: editMedium.trim() || 'Digital Illustration',
      year: editYear.trim() || new Date().getFullYear().toString(),
      description: editDescription.trim(),
    });
    setIsEditing(false);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-6 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
      onClick={closeLightbox}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="relative flex flex-col max-h-[94vh] max-w-5xl w-full border border-[#C5A059]/40 bg-[#121214] text-[#F5F5F5] shadow-2xl shadow-black/90 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <CornerCrosshairs color="border-[#C5A059]/70" />

        {/* Top Header Bar */}
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-3 bg-[#0a0a0c] text-zinc-400 text-xs">
          <div className="flex items-center gap-2 overflow-hidden">
            <StarSparkle size="xs" variant="gold" />
            <span className="font-display font-bold tracking-widest text-[#F5F5F5] uppercase truncate max-w-xs sm:max-w-md">
              {lightboxArtwork.title}
            </span>
            <span className="text-zinc-600 hidden sm:inline">//</span>
            <span className="text-[#C5A059] text-[11px] uppercase tracking-wider font-mono hidden sm:inline">
              {lightboxArtwork.category}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {isOwnerMode && (
              <>
                <button
                  type="button"
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center gap-1.5 text-[#C5A059] hover:text-[#d6b46f] border border-[#C5A059]/40 hover:border-[#C5A059] bg-[#C5A059]/10 px-2.5 py-1 transition-colors cursor-pointer"
                  title="Owner Action: Edit Artwork Details"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-mono tracking-wider">
                    {isEditing ? 'VIEW' : 'EDIT DETAILS'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleDelete}
                  className="flex items-center gap-1.5 text-red-400 hover:text-red-300 border border-red-500/30 hover:border-red-500/60 bg-red-950/30 px-2.5 py-1 transition-colors cursor-pointer"
                  title="Owner Action: Delete Artwork permanently"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-mono tracking-wider hidden sm:inline">DELETE</span>
                </button>
              </>
            )}

            <button
              type="button"
              onClick={closeLightbox}
              className="flex items-center gap-1 text-zinc-400 hover:text-[#F5F5F5] px-2 py-1 transition-colors cursor-pointer"
              aria-label="Close lightbox"
            >
              <span className="text-[10px] font-mono tracking-widest hidden sm:inline">ESC</span>
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Artwork Viewport */}
        <div className="relative flex-1 flex items-center justify-center p-4 bg-[#050505] overflow-auto max-h-[66vh]">
          {!imgError ? (
            <img
              src={imgSrc}
              alt={lightboxArtwork.title}
              referrerPolicy="no-referrer"
              onError={handleImageError}
              className="max-h-[62vh] max-w-full object-contain rounded-xs border border-white/10 shadow-2xl"
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center max-w-md bg-[#0c0c0e] border border-dashed border-red-500/30 rounded-xs">
              <AlertCircle className="w-10 h-10 text-amber-500/80 mb-3" />
              <h4 className="text-sm font-display font-bold tracking-widest text-zinc-200 uppercase">
                REMOTE IMAGE UNAVAILABLE
              </h4>
              <p className="text-xs text-zinc-400 mt-2">
                The image host returned HTTP 404 (Not Found) for this external link.
              </p>
              <div className="mt-3 p-2 bg-black/60 border border-white/5 font-mono text-[10px] text-zinc-400 break-all select-all">
                {lightboxArtwork.imageUrl}
              </div>
              {isOwnerMode && (
                <p className="text-[11px] text-[#C5A059] mt-3">
                  Tip: Use the Edit or Delete button above to update or replace this entry.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Bottom Details / Edit Form */}
        {isEditing ? (
          <form
            onSubmit={handleSaveEdit}
            className="border-t border-white/10 bg-[#0c0c0e] p-4 sm:p-5 space-y-3"
          >
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div className="sm:col-span-2">
                <label className="block text-[10px] font-mono tracking-wider text-zinc-400 uppercase mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full bg-[#050505] border border-zinc-700 px-2.5 py-1.5 text-xs text-[#F5F5F5] focus:border-[#C5A059] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono tracking-wider text-zinc-400 uppercase mb-1">
                  Category
                </label>
                <select
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value as GalleryCategory)}
                  className="w-full bg-[#050505] border border-zinc-700 px-2.5 py-1.5 text-xs text-[#F5F5F5] focus:border-[#C5A059] focus:outline-none cursor-pointer"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-mono tracking-wider text-zinc-400 uppercase mb-1">
                  Year
                </label>
                <input
                  type="text"
                  value={editYear}
                  onChange={(e) => setEditYear(e.target.value)}
                  className="w-full bg-[#050505] border border-zinc-700 px-2.5 py-1.5 text-xs text-[#F5F5F5] focus:border-[#C5A059] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-[10px] font-mono tracking-wider text-zinc-400 uppercase mb-1">
                  Medium / Technique
                </label>
                <input
                  type="text"
                  value={editMedium}
                  onChange={(e) => setEditMedium(e.target.value)}
                  className="w-full bg-[#050505] border border-zinc-700 px-2.5 py-1.5 text-xs text-[#F5F5F5] focus:border-[#C5A059] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono tracking-wider text-zinc-400 uppercase mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full bg-[#050505] border border-zinc-700 px-2.5 py-1.5 text-xs text-[#F5F5F5] focus:border-[#C5A059] focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/5">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="flex items-center gap-1 px-3 py-1.5 text-xs text-zinc-400 hover:text-zinc-200 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>CANCEL</span>
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 bg-[#C5A059] text-[#050505] px-4 py-1.5 text-xs font-bold font-display uppercase tracking-wider hover:bg-[#d6b46f] cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>SAVE CHANGES</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="border-t border-white/10 bg-[#0c0c0e] px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-zinc-400">
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
        )}
      </div>
    </div>
  );
};
