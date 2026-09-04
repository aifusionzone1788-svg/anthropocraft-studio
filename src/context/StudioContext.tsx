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
const USER_UPLOADS_STORAGE_KEY = 'anthrocraft_user_artworks_permanent_v1';
const DELETED_ARTWORKS_STORAGE_KEY = 'anthrocraft_deleted_artworks_ids_v1';
const RATES_STORAGE_KEY = 'anthrocraft_rates_v1';
const CONFIG_STORAGE_KEY = 'anthrocraft_config_v1';
const OWNER_MODE_STORAGE_KEY = 'anthrocraft_owner_mode_active';
const OWNER_PIN_STORAGE_KEY = 'anthrocraft_owner_pin_code';

export const StudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activePage, setActivePageState] = useState<PageType>('home');
  
  // Load & merge artworks from localStorage (user uploads + default items)
  const [artworks, setArtworks] = useState<Artwork[]>(() => {
    try {
      // 1. Manually deleted artwork IDs (never resurrect unless re-added)
      let deletedIds: string[] = [];
      try {
        const deletedRaw = localStorage.getItem(DELETED_ARTWORKS_STORAGE_KEY);
        if (deletedRaw) {
          const parsedDeleted = JSON.parse(deletedRaw);
          if (Array.isArray(parsedDeleted)) {
            deletedIds = parsedDeleted;
          }
        }
      } catch (e) {
        console.warn('Failed to parse deleted artwork IDs:', e);
      }

      // 2. Dedicated permanent storage for user-uploaded artworks
      let userUploads: Artwork[] = [];
      try {
        const userSaved = localStorage.getItem(USER_UPLOADS_STORAGE_KEY);
        if (userSaved) {
          const parsed = JSON.parse(userSaved);
          if (Array.isArray(parsed)) {
            userUploads = parsed.map((item) => ({ ...item, isUserUploaded: true }));
          }
        }
      } catch (e) {
        console.warn('Failed to parse permanent user uploaded artworks:', e);
      }

      // 3. Backward compatibility: inspect legacy ARTWORKS_STORAGE_KEY to rescue any previous custom uploads
      try {
        const legacySaved = localStorage.getItem(ARTWORKS_STORAGE_KEY);
        if (legacySaved) {
          const parsed = JSON.parse(legacySaved);
          if (Array.isArray(parsed)) {
            parsed.forEach((item: Artwork) => {
              const isDefault = INITIAL_ARTWORKS.some((initArt) => initArt.id === item.id);
              const alreadyPresent = userUploads.some((u) => u.id === item.id);
              if (!isDefault && !alreadyPresent && item.id) {
                userUploads.push({ ...item, isUserUploaded: true });
              }
            });
          }
        }
      } catch (e) {
        console.warn('Failed to inspect legacy artworks:', e);
      }

      // Filter out any user uploads that were explicitly deleted
      userUploads = userUploads.filter((item) => !deletedIds.includes(item.id));

      // Persist consolidated user uploads back to USER_UPLOADS_STORAGE_KEY so they are never lost
      try {
        localStorage.setItem(USER_UPLOADS_STORAGE_KEY, JSON.stringify(userUploads));
      } catch (e) {
        console.warn('Failed to sync user uploads storage:', e);
      }

      // 4. Filter default INITIAL_ARTWORKS against deletedIds
      const activeDefaultArtworks = INITIAL_ARTWORKS.filter(
        (defaultArt) => !deletedIds.includes(defaultArt.id)
      );

      // 5. Merge: user uploads first, followed by default artworks that don't share IDs
      const userUploadIds = new Set(userUploads.map((u) => u.id));
      const nonDuplicateDefaults = activeDefaultArtworks.filter((d) => !userUploadIds.has(d.id));

      const merged = [...userUploads, ...nonDuplicateDefaults];

      // Sync merged state to storage
      try {
        localStorage.setItem(ARTWORKS_STORAGE_KEY, JSON.stringify(merged));
      } catch (e) {
        console.warn('Failed to sync merged artworks cache:', e);
      }

      return merged;
    } catch (e) {
      console.error('Failed to initialize and merge artworks:', e);
      return INITIAL_ARTWORKS;
    }
  });

  // Load rate tiers from localStorage
  const [rateTiers, setRateTiers] = useState<RateTier[]>(() => {
    try {
      const saved = localStorage.getItem(RATES_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // List of legacy placeholder Unsplash images that were previously seeded
          const legacySampleUrls = [
            'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7',
            'https://images.unsplash.com/photo-1516934024742-b461fba47600',
            'https://images.unsplash.com/photo-1543466835-00a7907e9de1',
            'https://images.unsplash.com/photo-1534188753412-3e26d0d618d6',
            'https://images.unsplash.com/photo-1557053910-d9eadeed1c58',
            'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe',
          ];

          return parsed.map((tier: RateTier) => {
            const initialMatch = INITIAL_RATE_TIERS.find((t) => t.id === tier.id);
            let cleanedImageUrl = tier.imageUrl;

            // Remove legacy sample image if matched
            if (
              cleanedImageUrl &&
              legacySampleUrls.some((legacyUrl) => cleanedImageUrl?.startsWith(legacyUrl))
            ) {
              cleanedImageUrl = undefined;
            }

            const updatedTier: RateTier = {
              ...tier,
              imageUrl: cleanedImageUrl,
            };

            if (tier.price.includes('[ADD') && initialMatch) {
              updatedTier.price = initialMatch.price;
            }

            if (!cleanedImageUrl) {
              delete updatedTier.imageUrl;
            }

            return updatedTier;
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
      isUserUploaded: true,
    };

    // Prepend to current artworks state
    setArtworks((prev) => [newArt, ...prev]);

    // 1. Permanently record in USER_UPLOADS_STORAGE_KEY
    try {
      const userSaved = localStorage.getItem(USER_UPLOADS_STORAGE_KEY);
      const currentUploads: Artwork[] = userSaved ? JSON.parse(userSaved) : [];
      const updatedUploads = [newArt, ...currentUploads.filter((item) => item.id !== newArt.id)];
      localStorage.setItem(USER_UPLOADS_STORAGE_KEY, JSON.stringify(updatedUploads));
    } catch (e) {
      console.warn('Failed to save to permanent user uploads storage:', e);
    }

    // 2. Remove from deleted IDs list if re-added
    try {
      const deletedSaved = localStorage.getItem(DELETED_ARTWORKS_STORAGE_KEY);
      if (deletedSaved) {
        const deletedIds: string[] = JSON.parse(deletedSaved);
        const updatedDeleted = deletedIds.filter((id) => id !== newArt.id);
        localStorage.setItem(DELETED_ARTWORKS_STORAGE_KEY, JSON.stringify(updatedDeleted));
      }
    } catch (e) {
      console.warn('Failed to update deleted IDs on add:', e);
    }
  };

  const removeArtwork = (id: string) => {
    // 1. Remove from state
    setArtworks((prev) => prev.filter((item) => item.id !== id));

    // 2. Remove from permanent USER_UPLOADS_STORAGE_KEY
    try {
      const userSaved = localStorage.getItem(USER_UPLOADS_STORAGE_KEY);
      if (userSaved) {
        const currentUploads: Artwork[] = JSON.parse(userSaved);
        const updatedUploads = currentUploads.filter((item) => item.id !== id);
        localStorage.setItem(USER_UPLOADS_STORAGE_KEY, JSON.stringify(updatedUploads));
      }
    } catch (e) {
      console.warn('Failed to remove from user uploads storage:', e);
    }

    // 3. Mark in DELETED_ARTWORKS_STORAGE_KEY so it is never auto-restored
    try {
      const deletedSaved = localStorage.getItem(DELETED_ARTWORKS_STORAGE_KEY);
      const deletedIds: string[] = deletedSaved ? JSON.parse(deletedSaved) : [];
      if (!deletedIds.includes(id)) {
        deletedIds.push(id);
        localStorage.setItem(DELETED_ARTWORKS_STORAGE_KEY, JSON.stringify(deletedIds));
      }
    } catch (e) {
      console.warn('Failed to persist deleted artwork ID:', e);
    }
  };

  const updateArtwork = (id: string, updates: Partial<Artwork>) => {
    setArtworks((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );

    // If it's a user upload, also update in USER_UPLOADS_STORAGE_KEY
    try {
      const userSaved = localStorage.getItem(USER_UPLOADS_STORAGE_KEY);
      if (userSaved) {
        const currentUploads: Artwork[] = JSON.parse(userSaved);
        const targetIdx = currentUploads.findIndex((item) => item.id === id);
        if (targetIdx !== -1) {
          currentUploads[targetIdx] = { ...currentUploads[targetIdx], ...updates };
          localStorage.setItem(USER_UPLOADS_STORAGE_KEY, JSON.stringify(currentUploads));
        }
      }
    } catch (e) {
      console.warn('Failed to update artwork in user uploads storage:', e);
    }
  };

  // Rate actions
  const updateRateTier = (id: string, updates: Partial<RateTier>) => {
    setRateTiers((prev) =>
      prev.map((tier) => {
        if (tier.id === id) {
          const updated = { ...tier, ...updates };
          if ('imageUrl' in updates && (!updates.imageUrl || (typeof updates.imageUrl === 'string' && updates.imageUrl.trim() === ''))) {
            delete updated.imageUrl;
          }
          return updated;
        }
        return tier;
      })
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
