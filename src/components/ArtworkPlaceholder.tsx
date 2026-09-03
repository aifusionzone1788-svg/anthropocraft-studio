import React, { useState, useRef } from 'react';
import { GalleryCategory } from '../types';
import { useStudio } from '../context/StudioContext';
import { CornerCrosshairs, StarSparkle } from './DecorativeElements';
import { Upload } from 'lucide-react';

interface ArtworkPlaceholderProps {
  id?: string;
  category?: GalleryCategory;
  title?: string;
  subtitle?: string;
  aspectRatio?: 'square' | 'portrait' | 'tall' | 'wide' | 'auto' | 'video';
  className?: string;
  minHeight?: string;
  targetTierId?: string;
  label?: string;
  showCaption?: boolean;
}

export const ArtworkPlaceholder: React.FC<ArtworkPlaceholderProps> = ({
  id,
  category = 'CHARACTER ART',
  title = 'UNTITLED PIECE',
  subtitle = 'ORIGINAL ARTWORK',
  aspectRatio = 'portrait',
  className = '',
  minHeight,
  targetTierId,
  label = '+ ADD ARTWORK',
  showCaption = true,
}) => {
  const { openUploadModal, addArtwork } = useStudio();
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const aspectClassMap = {
    square: 'aspect-square',
    portrait: 'aspect-[4/5]',
    tall: 'aspect-[3/5]',
    wide: 'aspect-[16/10]',
    video: 'aspect-[16/9]',
    auto: 'min-h-[280px]',
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            addArtwork({
              title: file.name.replace(/\.[^/.]+$/, '').toUpperCase() || title,
              category: category || 'CHARACTER ART',
              imageUrl: event.target.result as string,
              aspectRatio: aspectRatio === 'square' ? 'square' : aspectRatio === 'tall' ? 'tall' : aspectRatio === 'wide' ? 'wide' : 'portrait',
              year: new Date().getFullYear().toString(),
              medium: 'Digital Illustration',
            });
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            addArtwork({
              title: file.name.replace(/\.[^/.]+$/, '').toUpperCase() || title,
              category: category || 'CHARACTER ART',
              imageUrl: event.target.result as string,
              aspectRatio: aspectRatio === 'square' ? 'square' : aspectRatio === 'tall' ? 'tall' : aspectRatio === 'wide' ? 'wide' : 'portrait',
              year: new Date().getFullYear().toString(),
              medium: 'Digital Illustration',
            });
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  return (
    <div
      id={id}
      className={`group relative flex flex-col justify-between overflow-hidden border border-dashed transition-all duration-300 ${
        isDragOver
          ? 'border-[#C5A059] bg-[#C5A059]/10 shadow-[0_0_25px_rgba(197,160,89,0.2)]'
          : 'border-[#C5A059]/30 bg-[#0c0c0c] hover:border-[#C5A059]/60 hover:bg-[#121212]'
      } ${aspectRatio !== 'auto' ? aspectClassMap[aspectRatio] : ''} ${className}`}
      style={minHeight ? { minHeight } : undefined}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <CornerCrosshairs color="border-[#C5A059]/20 group-hover:border-[#C5A059]/50" />

      {/* Hidden native file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        accept="image/*"
        className="hidden"
      />

      {/* Top Bar / Metadata Header */}
      <div className="relative z-10 flex items-center justify-between p-3.5 sm:p-4 text-[10px] tracking-widest text-zinc-400 uppercase">
        <span className="flex items-center gap-1.5 text-zinc-300 group-hover:text-[#C5A059] transition-colors">
          <StarSparkle size="xs" variant="gold" />
          {category}
        </span>
        <span className="font-mono text-zinc-500 text-[9px] tracking-widest">ATELIER // EMPTY</span>
      </div>

      {/* Center Interactive Upload Trigger */}
      <div className="relative z-10 flex flex-col items-center justify-center p-6 text-center">
        <button
          type="button"
          onClick={() => openUploadModal(category, targetTierId)}
          className="group/btn flex flex-col items-center gap-3 p-4 rounded-sm cursor-pointer"
        >
          <div className="relative flex h-12 w-12 items-center justify-center rounded-full border border-[#C5A059] bg-[#050505] group-hover:bg-[#C5A059]/20">
            <span className="text-[#C5A059] text-xl font-light leading-none">
              +
            </span>
          </div>
          
          <div className="flex flex-col items-center gap-1">
            <span className="font-display text-[11px] font-bold tracking-[0.25em] text-[#C5A059] group-hover/btn:text-[#d6b46f] uppercase">
              {label}
            </span>
            <span className="text-[10px] text-zinc-400 tracking-wider">
              CLICK OR DROP ARTWORK HERE
            </span>
          </div>
        </button>
      </div>

      {/* Bottom Information Caption */}
      {showCaption && (
        <div className="relative z-10 flex items-center justify-between border-t border-white/5 bg-[#050505]/80 px-4 py-2.5 text-[11px] text-zinc-400">
          <div className="truncate pr-2">
            <p className="font-display font-medium tracking-wider text-zinc-300 truncate text-[11px]">
              {title}
            </p>
            <p className="text-[9px] text-zinc-500 tracking-widest font-mono uppercase">{subtitle}</p>
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1 text-[10px] font-mono tracking-wider text-[#C5A059] hover:text-[#d6b46f] transition-colors whitespace-nowrap cursor-pointer"
            title="Direct File Select"
          >
            <Upload className="w-3 h-3" />
            <span>BROWSE</span>
          </button>
        </div>
      )}
    </div>
  );
};
