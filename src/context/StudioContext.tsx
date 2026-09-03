import React, { createContext, useContext, useState, useEffect } from 'react';
import { Artwork, GalleryCategory, PageType, RateTier, StudioConfig } from '../types';
import { INITIAL_ARTWORKS, INITIAL_RATE_TIERS, INITIAL_STUDIO_CONFIG } from '../data/initialData';

interface StudioContextType {
  activePage: PageType;
  setActivePage: (page: PageType) => void;
  artworks: Artwork[];
  addArtwork: (artwork: Omit<Artwork, 'id' | 'createdAt'>) => void;
  removeArtwork: (id: string) => void;
  updateArtwork: (id: string, updates: Partial<Artwork>) => void;
  rateTiers: RateTier[];
  updateRateTier: (id: string, updates: Partial<RateTier>) => void;
  resetRatesToDefaults: () => void;
  studioConfig: StudioConfig;
  updateStudioConfig: (updates: Partial<StudioConfig>) => void;
  
  // Modals & Triggers
  isUploadModalOpen: boolean;
  uploadModalCategory?: GalleryCategory;
  uploadModalTargetTierId?: string;
  openUploadModal: (category?: GalleryCategory, targetTierId?: string) => void;
  closeUploadModal: () => void;

  isContactModalOpen: boolean;
  contactTierSelected?: string;
  openContactModal: (tierId?: string) => void;
  closeContactModal: () => void;

  isEditRatesModalOpen: boolean;
  openEditRatesModal: () => void;
  closeEditRatesModal: () => void;

  lightboxArtwork: Artwork | null;
  openLightbox: (artwork: Artwork) => void;
  closeLightbox: () => void;

  // Hidden Owner / Admin Mode
  isOwnerMode: boolean;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  enableOwnerMode: (passwordOrPin: string) => boolean;
  disableOwnerMode: () => void;
  ownerPin: string;
  updateOwnerPin: (newPin: string) => void;
}

const StudioContext = createContext<StudioContextType | undefined>(undefined);

const ARTWORKS_STORAGE_KEY = 'anthrocraft_artworks_v1';
const RATES_STORAGE_KEY = 'anthrocraft_rates_v1';
const CONFIG_STORAGE_KEY = 'anthrocraft_config_v1';
const OWNER_MODE_STORAGE_KEY = 'anthrocraft_owner_mode_active';
const OWNER_PIN_STORAGE_KEY = 'anthrocraft_owner_pin_code';

export const StudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activePage, setActivePageState] = useState<PageType>('home');
  
  // Load artworks from localStorage
  const [artworks, setArtworks] = useState<Artwork[]>(() => {
    try {
      const saved = localStorage.getItem(ARTWORKS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to load artworks from storage:', e);
    }
    return INITIAL_ARTWORKS;
  });

  // Load rate tiers from localStorage
  const [rateTiers, setRateTiers] = useState<RateTier[]>(() => {
    try {
      const saved = localStorage.getItem(RATES_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // If saved tiers still have '[ADD PRICE]', migrate them to new defaults
          return parsed.map((tier: RateTier) => {
            const initialMatch = INITIAL_RATE_TIERS.find((t) => t.id === tier.id);
            if (tier.price.includes('[ADD') && initialMatch) {
              return {
                ...tier,
                price: initialMatch.price,
                imageUrl: tier.imageUrl || initialMatch.imageUrl,
              };
            }
            return tier;
          });
        }
      }
    } catch (e) {
      console.warn('Failed to load rate tiers:', e);
    }
    return INITIAL_RATE_TIERS;
  });

  // Load studio config from localStorage
  const [studioConfig, setStudioConfig] = useState<StudioConfig>(() => {
    try {
      const saved = localStorage.getItem(CONFIG_STORAGE_KEY);
      if (saved) {
        return { ...INITIAL_STUDIO_CONFIG, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn('Failed to load studio config:', e);
    }
    return INITIAL_STUDIO_CONFIG;
  });

  // Save to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(ARTWORKS_STORAGE_KEY, JSON.stringify(artworks));
    } catch (e) {
      console.warn('Failed to save artworks (might exceed storage limit):', e);
    }
  }, [artworks]);

  useEffect(() => {
    try {
      localStorage.setItem(RATES_STORAGE_KEY, JSON.stringify(rateTiers));
    } catch (e) {
      console.warn('Failed to save rate tiers:', e);
    }
  }, [rateTiers]);

  useEffect(() => {
    try {
      localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(studioConfig));
    } catch (e) {
      console.warn('Failed to save config:', e);
    }
  }, [studioConfig]);

  // Smooth scroll to top when page changes
  const setActivePage = (page: PageType) => {
    setActivePageState(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Artwork actions
  const addArtwork = (artworkData: Omit<Artwork, 'id' | 'createdAt'>) => {
    const newArt: Artwork = {
      ...artworkData,
      id: `art_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: Date.now(),
    };
    setArtworks((prev) => [newArt, ...prev]);
  };

  const removeArtwork = (id: string) => {
    setArtworks((prev) => prev.filter((item) => item.id !== id));
  };

  const updateArtwork = (id: string, updates: Partial<Artwork>) => {
    setArtworks((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  // Rate actions
  const updateRateTier = (id: string, updates: Partial<RateTier>) => {
    setRateTiers((prev) =>
      prev.map((tier) => (tier.id === id ? { ...tier, ...updates } : tier))
    );
  };

  const resetRatesToDefaults = () => {
    setRateTiers(INITIAL_RATE_TIERS);
  };

  const updateStudioConfig = (updates: Partial<StudioConfig>) => {
    setStudioConfig((prev) => ({ ...prev, ...updates }));
  };

  // Modals state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadModalCategory, setUploadModalCategory] = useState<GalleryCategory | undefined>(undefined);
  const [uploadModalTargetTierId, setUploadModalTargetTierId] = useState<string | undefined>(undefined);

  const openUploadModal = (category?: GalleryCategory, targetTierId?: string) => {
    setUploadModalCategory(category);
    setUploadModalTargetTierId(targetTierId);
    setIsUploadModalOpen(true);
  };

  const closeUploadModal = () => {
    setIsUploadModalOpen(false);
    setUploadModalCategory(undefined);
    setUploadModalTargetTierId(undefined);
  };

  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contactTierSelected, setContactTierSelected] = useState<string | undefined>(undefined);

  const openContactModal = (tierId?: string) => {
    setContactTierSelected(tierId);
    setIsContactModalOpen(true);
  };

  const closeContactModal = () => {
    setIsContactModalOpen(false);
    setContactTierSelected(undefined);
  };

  const [isEditRatesModalOpen, setIsEditRatesModalOpen] = useState(false);
  const openEditRatesModal = () => setIsEditRatesModalOpen(true);
  const closeEditRatesModal = () => setIsEditRatesModalOpen(false);

  const [lightboxArtwork, setLightboxArtwork] = useState<Artwork | null>(null);
  const openLightbox = (artwork: Artwork) => setLightboxArtwork(artwork);
  const closeLightbox = () => setLightboxArtwork(null);

  // Hidden Owner Mode state (persisted in sessionStorage/localStorage)
  const [isOwnerMode, setIsOwnerMode] = useState<boolean>(() => {
    try {
      return (
        sessionStorage.getItem(OWNER_MODE_STORAGE_KEY) === 'true' ||
        localStorage.getItem(OWNER_MODE_STORAGE_KEY) === 'true'
      );
    } catch {
      return false;
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [ownerPin, setOwnerPinState] = useState<string>(() => {
    try {
      return localStorage.getItem(OWNER_PIN_STORAGE_KEY) || '1788';
    } catch {
      return '1788';
    }
  });

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  const enableOwnerMode = (passwordOrPin: string): boolean => {
    const input = passwordOrPin.trim().toLowerCase();
    const currentPin = ownerPin.trim().toLowerCase();
    // Accept user's custom PIN, or standard fallbacks: '1788', 'atelier', 'studio2026', 'admin'
    const isMatch =
      input === currentPin ||
      input === '1788' ||
      input === 'atelier' ||
      input === 'studio2026' ||
      input === 'admin';

    if (isMatch) {
      setIsOwnerMode(true);
      try {
        sessionStorage.setItem(OWNER_MODE_STORAGE_KEY, 'true');
        localStorage.setItem(OWNER_MODE_STORAGE_KEY, 'true');
      } catch (e) {
        console.warn('Could not persist owner mode state', e);
      }
      setIsAuthModalOpen(false);
      return true;
    }
    return false;
  };

  const disableOwnerMode = () => {
    setIsOwnerMode(false);
    try {
      sessionStorage.removeItem(OWNER_MODE_STORAGE_KEY);
      localStorage.removeItem(OWNER_MODE_STORAGE_KEY);
    } catch (e) {
      console.warn('Could not clear owner mode storage', e);
    }
  };

  const updateOwnerPin = (newPin: string) => {
    if (newPin.trim().length >= 3) {
      setOwnerPinState(newPin.trim());
      try {
        localStorage.setItem(OWNER_PIN_STORAGE_KEY, newPin.trim());
      } catch (e) {
        console.warn('Could not save owner PIN', e);
      }
    }
  };

  // Global secret shortcut listener: Ctrl + Shift + A, Ctrl + Shift + O, or Cmd + Shift + A/O
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Ctrl+Shift+A or Cmd+Shift+A or Ctrl+Shift+O
      if ((e.ctrlKey || e.metaKey) && e.shiftKey) {
        const key = e.key.toLowerCase();
        if (key === 'a' || key === 'o') {
          e.preventDefault();
          if (isOwnerMode) {
            // Already owner: quick toggle or reminder
            setIsAuthModalOpen(true);
          } else {
            setIsAuthModalOpen(true);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOwnerMode]);

  return (
    <StudioContext.Provider
      value={{
        activePage,
        setActivePage,
        artworks,
        addArtwork,
        removeArtwork,
        updateArtwork,
        rateTiers,
        updateRateTier,
        resetRatesToDefaults,
        studioConfig,
        updateStudioConfig,
        isUploadModalOpen,
        uploadModalCategory,
        uploadModalTargetTierId,
        openUploadModal,
        closeUploadModal,
        isContactModalOpen,
        contactTierSelected,
        openContactModal,
        closeContactModal,
        isEditRatesModalOpen,
        openEditRatesModal,
        closeEditRatesModal,
        lightboxArtwork,
        openLightbox,
        closeLightbox,
        isOwnerMode,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        enableOwnerMode,
        disableOwnerMode,
        ownerPin,
        updateOwnerPin,
      }}
    >
      {children}
    </StudioContext.Provider>
  );
};

export const useStudio = () => {
  const context = useContext(StudioContext);
  if (!context) {
    throw new Error('useStudio must be used within a StudioProvider');
  }
  return context;
};
