import React from 'react';
import { Artwork } from '../types';
import { useStudio } from '../context/StudioContext';
import { CornerCrosshairs, StarSparkle } from './DecorativeElements';
import { Maximize2, Trash2 } from 'lucide-react';

interface ArtworkCardProps {
  artwork: Artwork;
  className?: string;
  showActions?: boolean;
}

export const ArtworkCard: React.FC<ArtworkCardProps> = ({
  artwork,
  className = '',
  showActions,
}) => {
  const { openLightbox, isOwnerMode, removeArtwork } = useStudio();

  const isManagementVisible = showActions !== undefined ? showActions : isOwnerMode;

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to remove "${artwork.title}" from the atelier portfolio?`)) {
      removeArtwork(artwork.id);
    }
  };

  const aspectClassMap = {
    square: 'aspect-square',
    portrait: 'aspect-[4/5]',
    tall: 'aspect-[3/5]',
    wide: 'aspect-[16/10]',
  };

  const aspectClass = artwork.aspectRatio ? aspectClassMap[artwork.aspectRatio] : 'aspect-[4/5]';

  return (
    <div
      id={`artwork-${artwork.id}`}
      onClick={() => openLightbox(artwork)}
      className={`group relative overflow-hidden border border-white/10 bg-[#0c0c0c] transition-all duration-300 hover:border-[#C5A059]/70 cursor-pointer ${aspectClass} ${className}`}
    >
      <CornerCrosshairs color="border-zinc-800 group-hover:border-[#C5A059]/70" />

      {/* Main Image */}
      <img
        src={artwork.imageUrl}
        alt={artwork.title}
        referrerPolicy="no-referrer"
        className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
        loading="lazy"
      />

      {/* Gradient Overlay for Editorial Depth */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050505]/95 via-[#050505]/30 to-[#050505]/40 opacity-70 group-hover:opacity-85 transition-opacity" />

      {/* Top Bar Details */}
      <div className="absolute top-0 inset-x-0 z-10 flex items-center justify-between p-3.5 text-[10px] tracking-widest uppercase">
        <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-xs bg-[#050505]/80 backdrop-blur-sm border border-white/10 text-zinc-300">
          <StarSparkle size="xs" variant="gold" />
          {artwork.category}
        </span>
        <div className="flex items-center gap-1.5">
          {artwork.year && (
            <span className="px-2 py-0.5 font-mono bg-[#050505]/80 backdrop-blur-sm border border-white/10 text-zinc-400 text-[10px]">
              {artwork.year}
            </span>
          )}
          {isManagementVisible && (
            <button
              type="button"
              onClick={handleDelete}
              className="p-1 rounded-xs bg-red-950/80 text-red-400 border border-red-500/50 hover:bg-red-900 hover:text-white transition-colors cursor-pointer"
              title="Delete Artwork (Owner Mode)"
              aria-label="Delete Artwork"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Hover Center Indicator */}
      <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
        <div className="flex items-center gap-2 px-4 py-2 bg-[#050505]/90 text-[#C5A059] border border-[#C5A059] text-xs font-display font-bold tracking-widest uppercase shadow-xl backdrop-blur-sm">
          <Maximize2 className="h-4 w-4" />
          <span>VIEW FULL RESOLUTION</span>
        </div>
      </div>

      {/* Bottom Title & Medium Caption */}
      <div className="absolute bottom-0 inset-x-0 z-10 p-4">
        <h4 className="font-display text-sm sm:text-base font-bold tracking-wider text-[#F5F5F5] uppercase drop-shadow-md truncate">
          {artwork.title}
        </h4>
        <div className="flex items-center justify-between text-[11px] text-zinc-400 mt-0.5">
          <span className="tracking-wider text-zinc-300 truncate">{artwork.medium || 'Original Digital Art'}</span>
          <span className="text-[10px] text-[#C5A059] tracking-widest font-mono shrink-0 ml-2">ARCHIVE</span>
        </div>
      </div>
    </div>
  );
};
