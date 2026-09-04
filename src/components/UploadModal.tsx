import React, { useState, useRef } from 'react';
import { GalleryCategory } from '../types';
import { useStudio } from '../context/StudioContext';
import { CornerCrosshairs, StarSparkle } from './DecorativeElements';
import { X, Upload, Check, AlertCircle, Sparkles, Loader2 } from 'lucide-react';
import { compressImageFile } from '../utils/imageHelper';

const CATEGORIES: GalleryCategory[] = [
  'CHARACTER ART',
  'PORTRAITS',
  'FULL-BODY ART',
  'REFERENCE SHEETS',
  'MASCOT DESIGN',
  'CUSTOM ARTWORK',
];

export const UploadModal: React.FC = () => {
  const {
    isUploadModalOpen,
    closeUploadModal,
    uploadModalCategory,
    uploadModalTargetTierId,
    addArtwork,
    updateRateTier,
  } = useStudio();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<GalleryCategory>(uploadModalCategory || 'CHARACTER ART');
  const [aspectRatio, setAspectRatio] = useState<'portrait' | 'square' | 'tall' | 'wide'>('portrait');
  const [medium, setMedium] = useState('Digital Painting');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [description, setDescription] = useState('');
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync category if passed from trigger
  React.useEffect(() => {
    if (uploadModalCategory) {
      setCategory(uploadModalCategory);
    }
  }, [uploadModalCategory]);

  if (!isUploadModalOpen) return null;

  const [isCompressing, setIsCompressing] = useState(false);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (PNG, JPG, WEBP).');
      return;
    }
    setError('');
    setFileName(file.name);
    if (!title) {
      setTitle(file.name.replace(/\.[^/.]+$/, '').toUpperCase());
    }

    try {
      setIsCompressing(true);
      const compressed = await compressImageFile(file, 1600, 1600, 0.85);
      setImageDataUrl(compressed);
    } catch (err: any) {
      setError(err?.message || 'Failed to process image file.');
    } finally {
      setIsCompressing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageDataUrl) {
      setError('Please upload an image for this artwork slot.');
      return;
    }

    // Add to gallery
    addArtwork({
      title: title.trim() || 'UNTITLED PIECE',
      category,
      imageUrl: imageDataUrl,
      aspectRatio,
      medium: medium.trim() || 'Digital Illustration',
      year: year.trim() || new Date().getFullYear().toString(),
      description: description.trim(),
    });

    // If target was a rate tier, optionally update its sample image
    if (uploadModalTargetTierId) {
      updateRateTier(uploadModalTargetTierId, {
        imageUrl: imageDataUrl,
      });
    }

    // Reset and close
    setImageDataUrl(null);
    setTitle('');
    setDescription('');
    closeUploadModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md">
      <div
        className="relative w-full max-w-2xl border border-white/10 bg-[#0c0c0c] p-6 sm:p-8 shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <CornerCrosshairs color="border-[#C5A059]/60" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <StarSparkle size="sm" variant="gold" />
            <h3 className="font-display text-lg sm:text-xl font-bold tracking-wider text-[#F5F5F5] uppercase">
              UPLOAD ORIGINAL ARTWORK
            </h3>
          </div>
          <button
            type="button"
            onClick={closeUploadModal}
            className="p-1 text-zinc-400 hover:text-[#F5F5F5] hover:bg-zinc-800 rounded transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Drag and Drop Box */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative flex flex-col items-center justify-center border border-dashed p-6 sm:p-8 text-center cursor-pointer transition-all ${
              imageDataUrl
                ? 'border-[#C5A059]/60 bg-[#050505]'
                : 'border-zinc-700 hover:border-[#C5A059] bg-[#050505]/60 hover:bg-[#050505]'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
              accept="image/*"
              className="hidden"
            />

            {isCompressing ? (
              <div className="flex flex-col items-center gap-3 py-6 text-[#C5A059]">
                <Loader2 className="w-8 h-8 animate-spin" />
                <span className="font-mono text-xs tracking-wider uppercase">OPTIMIZING IMAGE FOR STORAGE...</span>
              </div>
            ) : imageDataUrl ? (
              <div className="relative flex flex-col items-center gap-3">
                <div className="relative max-h-48 max-w-xs overflow-hidden border border-zinc-700">
                  <img
                    src={imageDataUrl}
                    alt="Preview"
                    className="max-h-48 w-auto object-contain"
                  />
                </div>
                <div className="flex items-center gap-2 text-xs text-[#C5A059]">
                  <Check className="w-4 h-4" />
                  <span>{fileName || 'Artwork Loaded'}</span>
                </div>
                <span className="text-[11px] text-zinc-400 underline">
                  Click to choose a different image
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center border border-zinc-700 bg-zinc-900 text-zinc-300">
                  <Upload className="w-5 h-5 text-[#C5A059]" />
                </div>
                <div className="space-y-1">
                  <p className="font-display text-sm font-bold tracking-wider text-[#F5F5F5]">
                    DROP ARTWORK HERE OR CLICK TO BROWSE
                  </p>
                  <p className="text-xs text-zinc-500">
                    Supports high-resolution PNG, JPG, WEBP (All original artwork stays local to your browser)
                  </p>
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="flex items-center gap-2 text-xs text-red-400 bg-red-950/30 border border-red-800/50 p-2.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-mono tracking-widest text-zinc-400 uppercase mb-1.5">
                Artwork Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. LUMEN WOLF REF SHEET"
                className="w-full bg-[#050505] border border-zinc-800 px-3 py-2 text-sm text-[#F5F5F5] placeholder:text-zinc-600 focus:border-[#C5A059] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono tracking-widest text-zinc-400 uppercase mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as GalleryCategory)}
                className="w-full bg-[#050505] border border-zinc-800 px-3 py-2 text-sm text-[#F5F5F5] focus:border-[#C5A059] focus:outline-none"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-mono tracking-widest text-zinc-400 uppercase mb-1.5">
                Aspect Ratio
              </label>
              <select
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value as any)}
                className="w-full bg-[#050505] border border-zinc-800 px-3 py-2 text-sm text-[#F5F5F5] focus:border-[#C5A059] focus:outline-none"
              >
                <option value="portrait">Portrait (4:5)</option>
                <option value="square">Square (1:1)</option>
                <option value="tall">Tall / Vertical (3:5)</option>
                <option value="wide">Wide / Landscape (16:10)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-mono tracking-widest text-zinc-400 uppercase mb-1.5">
                Medium / Tools
              </label>
              <input
                type="text"
                value={medium}
                onChange={(e) => setMedium(e.target.value)}
                placeholder="Digital Illustration"
                className="w-full bg-[#050505] border border-zinc-800 px-3 py-2 text-sm text-[#F5F5F5] placeholder:text-zinc-600 focus:border-[#C5A059] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono tracking-widest text-zinc-400 uppercase mb-1.5">
                Year
              </label>
              <input
                type="text"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="2026"
                className="w-full bg-[#050505] border border-zinc-800 px-3 py-2 text-sm text-[#F5F5F5] placeholder:text-zinc-600 focus:border-[#C5A059] focus:outline-none"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={closeUploadModal}
              className="px-4 py-2 text-xs font-mono tracking-wider text-zinc-400 hover:text-[#F5F5F5] cursor-pointer"
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 bg-[#C5A059] text-[#050505] px-6 py-2.5 text-xs font-display font-bold tracking-[0.15em] uppercase hover:bg-[#d6b46f] transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              ADD TO STUDIO GALLERY
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
