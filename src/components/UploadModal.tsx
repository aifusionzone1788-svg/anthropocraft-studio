import React, { useState, useRef, useEffect } from 'react';
import { GalleryCategory } from '../types';
import { useStudio } from '../context/StudioContext';
import { CornerCrosshairs, StarSparkle } from './DecorativeElements';
import { X, Upload, Check, AlertCircle, Sparkles, Loader2, Image as ImageIcon } from 'lucide-react';
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
    uploadModalInitialImage,
    uploadModalInitialTitle,
    addArtwork,
    updateRateTier,
  } = useStudio();

  // All hooks MUST be declared unconditionally at top level
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<GalleryCategory>('CHARACTER ART');
  const [aspectRatio, setAspectRatio] = useState<'portrait' | 'square' | 'tall' | 'wide'>('portrait');
  const [medium, setMedium] = useState('Digital Painting');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [description, setDescription] = useState('');
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const [isCompressing, setIsCompressing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state whenever modal opens or initial values change
  useEffect(() => {
    if (isUploadModalOpen) {
      setCategory(uploadModalCategory || 'CHARACTER ART');
      if (uploadModalInitialImage) {
        setImageDataUrl(uploadModalInitialImage);
      }
      if (uploadModalInitialTitle) {
        setTitle(uploadModalInitialTitle);
        setFileName(uploadModalInitialTitle);
      }
      setError('');
    } else {
      // Reset form on close
      setTitle('');
      setDescription('');
      setImageDataUrl(null);
      setFileName('');
      setError('');
      setIsCompressing(false);
      setIsDragging(false);
    }
  }, [isUploadModalOpen, uploadModalCategory, uploadModalInitialImage, uploadModalInitialTitle]);

  // Handle incoming file
  const processFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (PNG, JPG, WEBP, GIF, SVG).');
      return;
    }
    setError('');
    setFileName(file.name);
    if (!title) {
      setTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ').toUpperCase());
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageDataUrl) {
      setError('Please select or drop an image file for this artwork before saving.');
      return;
    }

    // Save artwork to persistent state
    addArtwork({
      title: title.trim() || 'UNTITLED PIECE',
      category,
      imageUrl: imageDataUrl,
      aspectRatio,
      medium: medium.trim() || 'Digital Illustration',
      year: year.trim() || new Date().getFullYear().toString(),
      description: description.trim(),
    });

    // If a rate tier was the target, update its sample art as well
    if (uploadModalTargetTierId) {
      updateRateTier(uploadModalTargetTierId, {
        imageUrl: imageDataUrl,
      });
    }

    closeUploadModal();
  };

  // Safe early exit AFTER all hooks have executed
  if (!isUploadModalOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/70 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeUploadModal();
      }}
      aria-modal="true"
      role="dialog"
      aria-labelledby="upload-modal-title"
    >
      <div
        className="relative w-full max-w-2xl border border-[#C5A059]/40 bg-[#121214] text-[#F5F5F5] p-6 sm:p-8 shadow-2xl shadow-black/80 my-auto transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <CornerCrosshairs color="border-[#C5A059]/60" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <StarSparkle size="sm" variant="gold" />
            <h3
              id="upload-modal-title"
              className="font-display text-lg sm:text-xl font-bold tracking-wider text-[#F5F5F5] uppercase"
            >
              UPLOAD ORIGINAL ARTWORK
            </h3>
          </div>
          <button
            type="button"
            onClick={closeUploadModal}
            className="p-1.5 text-zinc-400 hover:text-[#F5F5F5] hover:bg-white/10 rounded transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Interactive File Dropzone Area */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative flex flex-col items-center justify-center border-2 border-dashed p-6 sm:p-8 text-center transition-all min-h-[160px] ${
              isDragging
                ? 'border-[#C5A059] bg-[#C5A059]/10'
                : imageDataUrl
                ? 'border-[#C5A059]/60 bg-[#09090b]'
                : 'border-zinc-700 hover:border-[#C5A059]/80 bg-[#09090b]/80 hover:bg-[#09090b]'
            }`}
          >
            {/* Native file input that covers the entire dropzone so clicking directly opens file picker */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              title="Click or drop an image file here"
            />

            {isCompressing ? (
              <div className="relative z-0 flex flex-col items-center gap-3 py-6 text-[#C5A059]">
                <Loader2 className="w-8 h-8 animate-spin" />
                <span className="font-mono text-xs tracking-wider uppercase">
                  OPTIMIZING IMAGE FOR LOCAL STORAGE...
                </span>
              </div>
            ) : imageDataUrl ? (
              <div className="relative z-0 flex flex-col items-center gap-3 w-full">
                <div className="relative max-h-48 max-w-xs overflow-hidden border border-zinc-700 bg-black/60 shadow-lg">
                  <img
                    src={imageDataUrl}
                    alt="Preview"
                    className="max-h-48 w-auto object-contain"
                  />
                </div>
                <div className="flex items-center gap-2 text-xs text-[#C5A059] font-medium">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="truncate max-w-xs">{fileName || 'Artwork Ready'}</span>
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="relative z-20 text-xs text-zinc-400 hover:text-[#C5A059] underline cursor-pointer"
                >
                  Click here or drop to replace image
                </button>
              </div>
            ) : (
              <div className="relative z-0 flex flex-col items-center gap-3 pointer-events-none">
                <div className="flex h-12 w-12 items-center justify-center border border-zinc-700 bg-zinc-900/80 text-zinc-300">
                  <Upload className="w-5 h-5 text-[#C5A059]" />
                </div>
                <div className="space-y-1">
                  <p className="font-display text-sm font-bold tracking-wider text-[#F5F5F5]">
                    DROP ARTWORK HERE OR CLICK TO BROWSE
                  </p>
                  <p className="text-xs text-zinc-400">
                    PNG, JPG, WEBP, GIF, SVG (Stored locally in your browser)
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 mt-1 border border-[#C5A059]/40 bg-[#C5A059]/10 text-[#C5A059] text-[11px] font-mono tracking-wider">
                  <ImageIcon className="w-3.5 h-3.5" />
                  CHOOSE IMAGE FILE
                </span>
              </div>
            )}
          </div>

          {/* Validation error display */}
          {error && (
            <div className="flex items-center gap-2 text-xs text-red-400 bg-red-950/40 border border-red-800/60 p-3">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
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
                className="w-full bg-[#050505] border border-zinc-700 px-3 py-2 text-sm text-[#F5F5F5] placeholder:text-zinc-600 focus:border-[#C5A059] focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono tracking-widest text-zinc-400 uppercase mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as GalleryCategory)}
                className="w-full bg-[#050505] border border-zinc-700 px-3 py-2 text-sm text-[#F5F5F5] focus:border-[#C5A059] focus:outline-none cursor-pointer transition-colors"
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
                className="w-full bg-[#050505] border border-zinc-700 px-3 py-2 text-sm text-[#F5F5F5] focus:border-[#C5A059] focus:outline-none cursor-pointer transition-colors"
              >
                <option value="portrait">Portrait (4:5)</option>
                <option value="square">Square (1:1)</option>
                <option value="tall">Tall / Vertical (3:5)</option>
                <option value="wide">Wide / Landscape (16:10)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-mono tracking-widest text-zinc-400 uppercase mb-1.5">
                Medium / Technique
              </label>
              <input
                type="text"
                value={medium}
                onChange={(e) => setMedium(e.target.value)}
                placeholder="Digital Illustration"
                className="w-full bg-[#050505] border border-zinc-700 px-3 py-2 text-sm text-[#F5F5F5] placeholder:text-zinc-600 focus:border-[#C5A059] focus:outline-none transition-colors"
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
                className="w-full bg-[#050505] border border-zinc-700 px-3 py-2 text-sm text-[#F5F5F5] placeholder:text-zinc-600 focus:border-[#C5A059] focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono tracking-widest text-zinc-400 uppercase mb-1.5">
              Artwork Notes / Description (Optional)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief artist notes, character species, or design highlights..."
              className="w-full bg-[#050505] border border-zinc-700 px-3 py-2 text-sm text-[#F5F5F5] placeholder:text-zinc-600 focus:border-[#C5A059] focus:outline-none transition-colors resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={closeUploadModal}
              className="px-4 py-2 text-xs font-mono tracking-wider text-zinc-400 hover:text-[#F5F5F5] hover:bg-white/5 transition-colors cursor-pointer"
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={isCompressing}
              className="flex items-center gap-2 bg-[#C5A059] text-[#050505] px-6 py-2.5 text-xs font-display font-bold tracking-[0.15em] uppercase hover:bg-[#d6b46f] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-[#C5A059]/20"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>ADD TO STUDIO GALLERY</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
