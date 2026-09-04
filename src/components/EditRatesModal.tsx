import React, { useState } from 'react';
import { useStudio } from '../context/StudioContext';
import { CornerCrosshairs, StarSparkle } from './DecorativeElements';
import { X, Save, RotateCcw, Upload, Trash2, Image as ImageIcon } from 'lucide-react';
import { RateTier } from '../types';
import { compressImageFile } from '../utils/imageHelper';

export const EditRatesModal: React.FC = () => {
  const {
    isEditRatesModalOpen,
    closeEditRatesModal,
    rateTiers,
    saveAllRateTiers,
    updateRateTier,
    resetRatesToDefaults,
    studioConfig,
    updateStudioConfig,
  } = useStudio();

  const [localTiers, setLocalTiers] = useState<RateTier[]>(rateTiers);
  const [localStatus, setLocalStatus] = useState(studioConfig.commissionStatus);
  const [localSlots, setLocalSlots] = useState(studioConfig.slotsAvailable);

  React.useEffect(() => {
    setLocalTiers(rateTiers);
    setLocalStatus(studioConfig.commissionStatus);
    setLocalSlots(studioConfig.slotsAvailable);
  }, [rateTiers, studioConfig, isEditRatesModalOpen]);

  if (!isEditRatesModalOpen) return null;

  const handleTierChange = (id: string, field: keyof RateTier, value: any) => {
    setLocalTiers((prev) =>
      prev.map((tier) => (tier.id === id ? { ...tier, [field]: value } : tier))
    );
  };

  const handleSaveAll = () => {
    saveAllRateTiers(localTiers);
    updateStudioConfig({
      commissionStatus: localStatus,
      slotsAvailable: localSlots,
    });
    closeEditRatesModal();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/90 backdrop-blur-md"
      onClick={closeEditRatesModal}
    >
      <div
        className="relative w-full max-w-4xl border border-white/10 bg-[#0c0c0c] p-6 sm:p-8 shadow-2xl transition-all max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <CornerCrosshairs color="border-[#C5A059]/60" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6 shrink-0">
          <div className="flex items-center gap-2">
            <StarSparkle size="sm" variant="gold" />
            <div>
              <h3 className="font-display text-lg sm:text-xl font-bold tracking-wider text-[#F5F5F5] uppercase">
                COMMISSION RATES & STUDIO STATUS
              </h3>
              <p className="text-xs text-zinc-400">
                Set your custom prices, turnaround times, and slot availability
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeEditRatesModal}
            className="p-1 text-zinc-400 hover:text-[#F5F5F5] hover:bg-zinc-800 rounded transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Commission Status Setting */}
        <div className="mb-6 p-4 border border-white/10 bg-[#050505] grid grid-cols-1 sm:grid-cols-2 gap-4 shrink-0">
          <div>
            <label className="block text-[11px] font-mono tracking-widest text-zinc-400 uppercase mb-1">
              COMMISSION QUEUE STATUS
            </label>
            <select
              value={localStatus}
              onChange={(e) => setLocalStatus(e.target.value as any)}
              className="w-full bg-[#0c0c0c] border border-zinc-700 px-3 py-2 text-sm text-[#F5F5F5] focus:border-[#C5A059] focus:outline-none"
            >
              <option value="OPEN">OPEN FOR COMMISSIONS</option>
              <option value="LIMITED SLOTS">LIMITED SLOTS AVAILABLE</option>
              <option value="WAITLIST ONLY">WAITLIST ONLY</option>
              <option value="CLOSED">COMMISSIONS CLOSED</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-mono tracking-widest text-zinc-400 uppercase mb-1">
              CURRENT OPEN SLOTS
            </label>
            <input
              type="number"
              min={0}
              max={20}
              value={localSlots}
              onChange={(e) => setLocalSlots(parseInt(e.target.value) || 0)}
              className="w-full bg-[#0c0c0c] border border-zinc-700 px-3 py-2 text-sm text-[#F5F5F5] focus:border-[#C5A059] focus:outline-none"
            />
          </div>
        </div>

        {/* Tiers List */}
        <div className="flex-1 overflow-y-auto space-y-5 pr-2">
          {localTiers.map((tier, idx) => (
            <div
              key={tier.id}
              className="p-4 border border-zinc-800 bg-[#050505] relative space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-[#C5A059] tracking-widest uppercase font-bold">
                  TIER 0{idx + 1}
                </span>
                <span className="text-[11px] font-mono text-zinc-500">{tier.id}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-1">
                  <label className="block text-[10px] font-mono tracking-widest text-zinc-400 uppercase mb-1">
                    SERVICE NAME
                  </label>
                  <input
                    type="text"
                    value={tier.title}
                    onChange={(e) => handleTierChange(tier.id, 'title', e.target.value)}
                    className="w-full bg-[#0c0c0c] border border-zinc-800 px-3 py-1.5 text-xs text-[#F5F5F5] focus:border-[#C5A059] focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-1">
                  <label className="block text-[10px] font-mono tracking-widest text-zinc-400 uppercase mb-1">
                    PRICE (e.g. $120+ or [ADD PRICE])
                  </label>
                  <input
                    type="text"
                    value={tier.price}
                    onChange={(e) => handleTierChange(tier.id, 'price', e.target.value)}
                    className="w-full bg-[#0c0c0c] border border-zinc-800 px-3 py-1.5 text-xs text-[#C5A059] font-bold focus:border-[#C5A059] focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-1">
                  <label className="block text-[10px] font-mono tracking-widest text-zinc-400 uppercase mb-1">
                    ESTIMATED TURNAROUND
                  </label>
                  <input
                    type="text"
                    value={tier.turnaround || ''}
                    onChange={(e) => handleTierChange(tier.id, 'turnaround', e.target.value)}
                    placeholder="e.g. 2 - 3 Weeks"
                    className="w-full bg-[#0c0c0c] border border-zinc-800 px-3 py-1.5 text-xs text-zinc-300 focus:border-[#C5A059] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono tracking-widest text-zinc-400 uppercase mb-1">
                  DESCRIPTION
                </label>
                <textarea
                  rows={2}
                  value={tier.description}
                  onChange={(e) => handleTierChange(tier.id, 'description', e.target.value)}
                  className="w-full bg-[#0c0c0c] border border-zinc-800 px-3 py-1.5 text-xs text-zinc-300 focus:border-[#C5A059] focus:outline-none resize-none"
                />
              </div>

              {/* Sample Artwork Image Field */}
              <div className="pt-1">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase">
                    SAMPLE ARTWORK IMAGE (OPTIONAL)
                  </label>
                  {tier.imageUrl && (
                    <button
                      type="button"
                      onClick={() => handleTierChange(tier.id, 'imageUrl', '')}
                      className="text-[10px] font-mono text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>REMOVE IMAGE</span>
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {tier.imageUrl ? (
                    <div className="w-10 h-10 shrink-0 border border-zinc-700 bg-black overflow-hidden relative">
                      <img
                        src={tier.imageUrl}
                        alt={tier.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-10 h-10 shrink-0 border border-dashed border-zinc-700 bg-[#080808] flex items-center justify-center text-zinc-600">
                      <ImageIcon className="w-4 h-4" />
                    </div>
                  )}
                  <input
                    type="text"
                    placeholder="Enter Image URL or upload file..."
                    value={tier.imageUrl || ''}
                    onChange={(e) => handleTierChange(tier.id, 'imageUrl', e.target.value)}
                    className="flex-1 bg-[#0c0c0c] border border-zinc-800 px-3 py-1.5 text-xs text-zinc-300 focus:border-[#C5A059] focus:outline-none font-mono"
                  />
                  <label className="flex items-center gap-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-3 py-1.5 text-xs font-mono cursor-pointer border border-zinc-700 shrink-0 transition-colors">
                    <Upload className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>UPLOAD</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        if (e.target.files && e.target.files[0]) {
                          try {
                            const compressed = await compressImageFile(e.target.files[0], 1200, 800, 0.85);
                            handleTierChange(tier.id, 'imageUrl', compressed);
                          } catch (err) {
                            console.error('Failed to compress image:', err);
                          }
                        }
                      }}
                    />
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-5 mt-4 border-t border-white/10 shrink-0">
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Reset all rates and placeholders to default?')) {
                resetRatesToDefaults();
                setLocalTiers(rateTiers);
              }
            }}
            className="flex items-center gap-1.5 text-xs font-mono text-zinc-500 hover:text-zinc-300 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>RESET TO DEFAULTS</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={closeEditRatesModal}
              className="px-4 py-2 text-xs font-mono text-zinc-400 hover:text-[#F5F5F5] cursor-pointer"
            >
              CANCEL
            </button>
            <button
              type="button"
              onClick={handleSaveAll}
              className="flex items-center gap-2 bg-[#C5A059] text-[#050505] px-6 py-2 text-xs font-display font-bold tracking-widest uppercase hover:bg-[#d6b46f] transition-colors cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              SAVE RATE SHEET
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
