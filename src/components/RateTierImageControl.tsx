import React, { useState, useRef } from 'react';
import { RateTier } from '../types';
import { compressImageFile } from '../utils/imageHelper';
import {
  Upload,
  Trash2,
  Link as LinkIcon,
  Check,
  X,
  Sparkles,
  Loader2,
  Image as ImageIcon,
} from 'lucide-react';

interface RateTierImageControlProps {
  tier: RateTier;
  isOwnerMode: boolean;
  onUpdateImage: (newImageUrl: string | undefined) => void;
}

export const RateTierImageControl: React.FC<RateTierImageControlProps> = ({
  tier,
  isOwnerMode,
  onUpdateImage,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlValue, setUrlValue] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [imgSrc, setImgSrc] = useState<string | undefined>(tier.imageUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    setImgSrc(tier.imageUrl);
  }, [tier.imageUrl]);

  const handleImageError = () => {
    if (imgSrc && imgSrc.includes('anthropo')) {
      const match = imgSrc.match(/(anthropo[c]?raftstudio(?:-\d+)?)/);
      if (match && match[1]) {
        setImgSrc(`/artworks/${match[1]}.webp`);
      }
    }
  };

  // If Owner Mode is OFF and there is no image, render nothing (completely clean card)
  if (!isOwnerMode && !tier.imageUrl) {
    return null;
  }

  // If Owner Mode is OFF and there IS an image, render a clean sample art display with zero owner controls
  if (!isOwnerMode && tier.imageUrl) {
    return (
      <div className="mb-6 space-y-2">
        <div className="relative aspect-video overflow-hidden border border-white/10 bg-[#050505]">
          <img
            src={imgSrc || tier.imageUrl}
            alt={tier.title}
            referrerPolicy="no-referrer"
            onError={handleImageError}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute top-2 right-2 px-2 py-0.5 bg-[#050505]/90 text-[9px] font-mono text-zinc-300 border border-white/10 tracking-wider">
            SAMPLE ART
          </div>
        </div>
      </div>
    );
  }

  // Handle local file selection
  const handleFileChange = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select an image file (PNG, JPG, WEBP).');
      return;
    }

    try {
      setIsUploading(true);
      setErrorMsg(null);
      const compressedDataUrl = await compressImageFile(file, 1200, 800, 0.85);
      onUpdateImage(compressedDataUrl);
      setShowUrlInput(false);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to process image file.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleSaveUrl = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = urlValue.trim();
    if (!trimmed) {
      setErrorMsg('Please enter an image URL.');
      return;
    }
    setErrorMsg(null);
    onUpdateImage(trimmed);
    setUrlValue('');
    setShowUrlInput(false);
  };

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdateImage(undefined);
    setShowUrlInput(false);
    setErrorMsg(null);
  };

  // --- OWNER MODE ACTIVE ---
  return (
    <div className="mb-6 space-y-2">
      {/* Hidden file input for native file dialog */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/png, image/jpeg, image/webp, image/gif"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFileChange(e.target.files[0]);
          }
        }}
      />

      {/* Case 1: Image IS present in Owner Mode */}
      {tier.imageUrl ? (
        <div
          className={`relative aspect-video overflow-hidden border transition-all ${
            isDragging
              ? 'border-[#C5A059] ring-2 ring-[#C5A059]/40'
              : 'border-white/15 hover:border-[#C5A059]/60'
          } bg-[#050505] group/img`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <img
            src={imgSrc || tier.imageUrl}
            alt={tier.title}
            referrerPolicy="no-referrer"
            onError={handleImageError}
            className="w-full h-full object-cover"
          />

          {/* Top badges */}
          <div className="absolute top-2 left-2 flex items-center gap-1 px-1.5 py-0.5 bg-[#C5A059]/90 text-[#050505] text-[9px] font-mono font-bold tracking-wider uppercase">
            <Sparkles className="w-2.5 h-2.5" />
            <span>OWNER MODE</span>
          </div>

          <div className="absolute top-2 right-2 px-2 py-0.5 bg-[#050505]/90 text-[9px] font-mono text-zinc-300 border border-white/10 tracking-wider">
            SAMPLE ART
          </div>

          {/* Loading state indicator */}
          {isUploading && (
            <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-2 z-20 text-[#C5A059]">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="text-[10px] font-mono tracking-widest uppercase">
                PROCESSING IMAGE...
              </span>
            </div>
          )}

          {/* Owner Quick Action Overlay Bar */}
          <div className="absolute inset-x-0 bottom-0 p-2.5 bg-gradient-to-t from-black/95 via-black/80 to-transparent flex items-center justify-between gap-2 z-10">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="flex items-center gap-1 px-2.5 py-1.5 bg-[#C5A059] text-[#050505] hover:bg-[#d6b46f] text-[10px] font-mono font-bold tracking-wider uppercase transition-colors cursor-pointer"
                title="Upload image from your device"
              >
                <Upload className="w-3 h-3" />
                <span>REPLACE</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowUrlInput((prev) => !prev);
                  setUrlValue(tier.imageUrl || '');
                }}
                disabled={isUploading}
                className="flex items-center gap-1 px-2 py-1.5 bg-[#171717] hover:bg-[#262626] text-zinc-300 hover:text-white border border-white/10 text-[10px] font-mono tracking-wider uppercase transition-colors cursor-pointer"
                title="Change image by URL"
              >
                <LinkIcon className="w-3 h-3" />
                <span>URL</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleRemoveImage}
              disabled={isUploading}
              className="flex items-center gap-1 px-2 py-1.5 bg-red-950/80 hover:bg-red-900 border border-red-800/80 text-red-200 hover:text-white text-[10px] font-mono tracking-wider uppercase transition-colors cursor-pointer"
              title="Remove sample image completely"
            >
              <Trash2 className="w-3 h-3" />
              <span>REMOVE</span>
            </button>
          </div>
        </div>
      ) : (
        /* Case 2: Image is NOT present in Owner Mode -> show owner upload dropzone */
        <div
          className={`relative aspect-video border-2 border-dashed transition-all flex flex-col items-center justify-center p-4 text-center ${
            isDragging
              ? 'border-[#C5A059] bg-[#C5A059]/10'
              : 'border-zinc-700/80 hover:border-[#C5A059] bg-[#080808] hover:bg-[#0c0c0c]'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          {/* Owner Mode tag */}
          <div className="absolute top-2 left-2 flex items-center gap-1 px-1.5 py-0.5 bg-[#C5A059]/20 border border-[#C5A059]/40 text-[#C5A059] text-[8px] font-mono tracking-widest uppercase">
            <Sparkles className="w-2.5 h-2.5" />
            <span>OWNER: NO IMAGE</span>
          </div>

          {isUploading ? (
            <div className="flex flex-col items-center justify-center gap-2 text-[#C5A059]">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="text-[10px] font-mono tracking-widest uppercase">
                PROCESSING IMAGE...
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 w-full px-2">
              <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center text-[#C5A059] mb-0.5">
                <ImageIcon className="w-4 h-4" />
              </div>
              <p className="text-[11px] font-mono text-zinc-300 font-bold uppercase tracking-wider">
                NO SAMPLE ARTWORK SET
              </p>
              <p className="text-[10px] text-zinc-500 font-mono max-w-[200px] leading-tight">
                Drop image here or use controls below
              </p>

              <div className="flex items-center gap-2 mt-1">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1 px-2.5 py-1.5 bg-[#C5A059] hover:bg-[#d6b46f] text-[#050505] text-[10px] font-mono font-bold tracking-wider uppercase transition-colors cursor-pointer"
                >
                  <Upload className="w-3 h-3" />
                  <span>UPLOAD IMAGE</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowUrlInput((prev) => !prev)}
                  className="flex items-center gap-1 px-2 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700 text-[10px] font-mono tracking-wider uppercase transition-colors cursor-pointer"
                >
                  <LinkIcon className="w-3 h-3" />
                  <span>PASTE URL</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error message */}
      {errorMsg && (
        <div className="p-2 border border-red-500/30 bg-red-950/40 text-red-300 text-[10px] font-mono flex items-center justify-between">
          <span>{errorMsg}</span>
          <button
            type="button"
            onClick={() => setErrorMsg(null)}
            className="text-red-400 hover:text-white"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Inline URL Input Form */}
      {showUrlInput && (
        <form
          onSubmit={handleSaveUrl}
          className="p-2.5 border border-[#C5A059]/40 bg-[#080808] space-y-2 animate-fadeIn"
        >
          <div className="flex items-center justify-between text-[10px] font-mono text-[#C5A059] uppercase tracking-wider">
            <span>SET IMAGE VIA URL</span>
            <button
              type="button"
              onClick={() => setShowUrlInput(false)}
              className="text-zinc-500 hover:text-white"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
          <div className="flex items-center gap-1.5">
            <input
              type="url"
              value={urlValue}
              onChange={(e) => setUrlValue(e.target.value)}
              placeholder="https://example.com/artwork.jpg"
              className="flex-1 bg-[#121212] border border-zinc-700 px-2 py-1 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-[#C5A059] font-mono"
              autoFocus
            />
            <button
              type="submit"
              className="px-2.5 py-1 bg-[#C5A059] text-[#050505] text-[10px] font-mono font-bold tracking-wider uppercase hover:bg-[#d6b46f] transition-colors cursor-pointer flex items-center gap-1"
            >
              <Check className="w-3 h-3" />
              <span>APPLY</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
