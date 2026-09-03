import React, { useState } from 'react';
import { useStudio } from '../context/StudioContext';
import { GalleryCategory } from '../types';
import { StarSparkle } from './DecorativeElements';
import { ArtworkCard } from './ArtworkCard';
import { Sparkles, Layers, Send, Upload } from 'lucide-react';

const CATEGORIES: GalleryCategory[] = [
  'ALL',
  'CHARACTER ART',
  'PORTRAITS',
  'FULL-BODY ART',
  'REFERENCE SHEETS',
  'MASCOT DESIGN',
  'CUSTOM ARTWORK',
];

export const GalleryPage: React.FC = () => {
  const { artworks, openContactModal, isOwnerMode, openUploadModal } = useStudio();
  const [selectedCategory, setSelectedCategory] = useState<GalleryCategory>('ALL');

  // Filter artworks
  const filteredArtworks = selectedCategory === 'ALL'
    ? artworks
    : artworks.filter((art) => art.category === selectedCategory);

  return (
    <div className="min-h-screen bg-[#050505] px-6 sm:px-8 lg:px-12 py-12 lg:py-20">
      <div className="mx-auto max-w-7xl">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-white/10">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[10px] font-mono tracking-[0.3em] text-[#C5A059] uppercase">
              <StarSparkle size="xs" variant="gold" />
              <span>ATELIER ARCHIVE // EXHIBITION</span>
              {isOwnerMode && (
                <span className="ml-2 px-2 py-0.5 bg-[#C5A059]/20 border border-[#C5A059]/40 text-[#C5A059] text-[9px] font-bold">
                  ✦ OWNER ACTIVE
                </span>
              )}
            </div>
            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight uppercase text-[#F5F5F5]">
              ART GALLERY
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 font-light max-w-lg">
              Curated original furry character art, emotive portraits, reference sheets, and bespoke client works by AnthroCraft Studio.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            {isOwnerMode && (
              <button
                type="button"
                onClick={() => openUploadModal(selectedCategory !== 'ALL' ? selectedCategory : undefined)}
                className="flex items-center gap-2 border border-[#C5A059] bg-[#0c0c0e] text-[#C5A059] hover:bg-[#C5A059] hover:text-[#050505] px-5 py-3 text-xs font-display font-bold tracking-[0.15em] uppercase transition-all cursor-pointer shadow-lg shadow-[#C5A059]/10"
                title="Owner Action: Upload New Artwork"
              >
                <Upload className="w-4 h-4" />
                <span>+ UPLOAD ARTWORK</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => openContactModal()}
              className="flex items-center gap-2 bg-[#C5A059] text-[#050505] px-6 py-3 text-xs font-display font-bold tracking-[0.15em] uppercase hover:bg-[#d6b46f] transition-all cursor-pointer shadow-[0_0_20px_rgba(197,160,89,0.2)]"
            >
              <Sparkles className="w-4 h-4" />
              <span>COMMISSION ARTWORK</span>
            </button>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="my-8 flex items-center justify-between gap-4 overflow-x-auto pb-2 scrollbar-none">
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {CATEGORIES.map((cat) => {
              const count = cat === 'ALL'
                ? artworks.length
                : artworks.filter((a) => a.category === cat).length;

              const isSelected = selectedCategory === cat;

              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 text-xs font-display font-bold tracking-[0.15em] uppercase transition-all border cursor-pointer ${
                    isSelected
                      ? 'border-[#C5A059] bg-[#C5A059]/10 text-[#C5A059]'
                      : 'border-white/10 bg-[#0c0c0c] text-zinc-400 hover:border-white/20 hover:text-[#F5F5F5]'
                  }`}
                >
                  <span>{cat}</span>
                  {count > 0 && (
                    <span className="ml-2 font-mono text-[10px] text-zinc-400">
                      ({count})
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="hidden lg:flex items-center gap-2 text-[10px] font-mono text-zinc-400">
            <Layers className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>{artworks.length} PIECES IN ARCHIVE</span>
          </div>
        </div>

        {/* Gallery Content Area */}
        <div className="space-y-12">
          {filteredArtworks.length > 0 ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between text-xs font-mono text-zinc-400 border-b border-white/5 pb-2">
                <span className="text-[#C5A059]">STUDIO ORIGINAL WORKS ({filteredArtworks.length})</span>
                <span>ASYNCHRONOUS EDITORIAL LAYOUT</span>
              </div>

              {/* Asymmetrical Grid for Curated Artwork */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {filteredArtworks.map((art) => (
                  <ArtworkCard key={art.id} artwork={art} showActions={isOwnerMode} />
                ))}
              </div>
            </div>
          ) : (
            <div className="border border-white/10 bg-[#0c0c0c] p-12 text-center flex flex-col items-center justify-center max-w-xl mx-auto space-y-4">
              <StarSparkle size="sm" variant="gold" />
              <h3 className="font-display text-xl font-bold uppercase text-[#F5F5F5]">
                NO ARCHIVED PIECES IN {selectedCategory}
              </h3>
              <p className="text-xs text-zinc-400 font-light leading-relaxed">
                New original character commissions and reference pieces are constantly being crafted in the atelier. Inquire now to commission a bespoke piece for this category.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                {isOwnerMode && (
                  <button
                    type="button"
                    onClick={() => openUploadModal(selectedCategory !== 'ALL' ? selectedCategory : undefined)}
                    className="flex items-center gap-2 border border-[#C5A059] bg-[#0c0c0e] text-[#C5A059] px-6 py-3 text-xs font-display font-bold tracking-widest uppercase hover:bg-[#C5A059] hover:text-[#050505] cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>UPLOAD TO {selectedCategory}</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => openContactModal()}
                  className="flex items-center gap-2 bg-[#C5A059] text-[#050505] px-6 py-3 text-xs font-display font-bold tracking-widest uppercase hover:bg-[#d6b46f] cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>INQUIRE FOR {selectedCategory}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
