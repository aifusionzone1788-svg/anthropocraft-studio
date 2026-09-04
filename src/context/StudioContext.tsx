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
  saveAllRateTiers: (tiers: RateTier[]) => void;
  resetRatesToDefaults: () => void;
  studioConfig: StudioConfig;
  updateStudioConfig: (updates: Partial<StudioConfig>) => void;
  updateSocials: (socials: Partial<StudioConfig['socials']>) => void;
  
  // Modals & Triggers
  isUploadModalOpen: boolean;
  uploadModalCategory?: GalleryCategory;
  uploadModalTargetTierId?: string;
  uploadModalInitialImage?: string;
  uploadModalInitialTitle?: string;
  openUploadModal: (
    category?: GalleryCategory,
    targetTierId?: string,
    initialImage?: string,
    initialTitle?: string
  ) => void;
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
const RATES_STORAGE_KEY = 'anthrocraft_rates_permanent_v3';
const LEGACY_RATES_STORAGE_KEYS = [
  'anthrocraft_rates_permanent_v2',
  'anthrocraft_rates_v1',
];
const CONFIG_STORAGE_KEY = 'anthrocraft_config_permanent_v3';
const LEGACY_CONFIG_STORAGE_KEYS = [
  'anthrocraft_config_permanent_v2',
  'anthrocraft_config_v1',
];
const GLOBAL_SYNC_VERSION_KEY = 'anthrocraft_rates_sync_v3_2026';
const OWNER_MODE_STORAGE_KEY = 'anthrocraft_owner_mode_active';
const OWNER_PIN_STORAGE_KEY = 'anthrocraft_owner_pin_code';

// Resilient localStorage setter with automatic cache eviction on quota pressure
function safeSetStorage(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch (e: any) {
    console.warn(`Storage write issue for ${key}:`, e);
    // If browser hits storage limits, clear redundant non-permanent caches and retry
    if (e?.name === 'QuotaExceededError' || e?.code === 22) {
      try {
        localStorage.removeItem(ARTWORKS_STORAGE_KEY);
        localStorage.setItem(key, value);
      } catch (retryErr) {
        console.error(`Storage quota exceeded even after cache cleanup for key ${key}:`, retryErr);
      }
    }
  }
}

function syncRatesToAllStorage(tiers: RateTier[]) {
  const serialized = JSON.stringify(tiers);
  safeSetStorage(RATES_STORAGE_KEY, serialized);
  LEGACY_RATES_STORAGE_KEYS.forEach((k) => safeSetStorage(k, serialized));
}

function syncConfigToAllStorage(config: StudioConfig) {
  const serialized = JSON.stringify(config);
  safeSetStorage(CONFIG_STORAGE_KEY, serialized);
  LEGACY_CONFIG_STORAGE_KEYS.forEach((k) => safeSetStorage(k, serialized));
}

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

  // Load rate tiers from permanent storage and automatically overwrite legacy default rates
  const [rateTiers, setRateTiers] = useState<RateTier[]>(() => {
    try {
      const isSynced = localStorage.getItem(GLOBAL_SYNC_VERSION_KEY) === 'synced_v3';
      const saved =
        localStorage.getItem(RATES_STORAGE_KEY) ||
        localStorage.getItem('anthrocraft_rates_permanent_v2') ||
        localStorage.getItem('anthrocraft_rates_v1');

      // Set of old rates that should be automatically overwritten for all visitors
      const legacyDefaultPrices = new Set([
        '$120+', '$120',
        '$65+', '$65',
        '$160+', '$160',
        '$220+', '$220',
        '$280+', '$280',
        'CUSTOM QUOTE',
        '[ADD PRICE]',
        'INQUIRE FOR QUOTE',
      ]);

      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const userTierMap = new Map<string, RateTier>();
          parsed.forEach((tier: RateTier) => {
            if (tier && tier.id) {
              userTierMap.set(tier.id, tier);
            }
          });

          // Overlay user edits over initial rate tiers, overwriting legacy default rates
          const mergedTiers: RateTier[] = INITIAL_RATE_TIERS.map((defaultTier) => {
            const userEdit = userTierMap.get(defaultTier.id);
            if (userEdit) {
              userTierMap.delete(defaultTier.id);

              const hasLegacyPrice =
                !userEdit.price ||
                legacyDefaultPrices.has(userEdit.price.trim()) ||
                legacyDefaultPrices.has(userEdit.price.trim().toUpperCase()) ||
                !isSynced;

              const effectivePrice = hasLegacyPrice ? defaultTier.price : userEdit.price;

              return {
                ...defaultTier,
                ...userEdit,
                price: effectivePrice,
                // Ensure deliverables match updated defaults if user deliverables are empty
                deliverables:
                  Array.isArray(userEdit.deliverables) && userEdit.deliverables.length > 0
                    ? userEdit.deliverables
                    : defaultTier.deliverables,
                // Preserve custom uploaded artwork sample image
                imageUrl: userEdit.imageUrl || defaultTier.imageUrl,
              };
            }
            return defaultTier;
          });

          // Include any custom tiers added by user
          userTierMap.forEach((customTier) => {
            mergedTiers.push(customTier);
          });

          syncRatesToAllStorage(mergedTiers);
          safeSetStorage(GLOBAL_SYNC_VERSION_KEY, 'synced_v3');
          return mergedTiers;
        }
      }
    } catch (e) {
      console.warn('Failed to load permanent rate tiers, falling back to INITIAL_RATE_TIERS:', e);
    }

    syncRatesToAllStorage(INITIAL_RATE_TIERS);
    safeSetStorage(GLOBAL_SYNC_VERSION_KEY, 'synced_v3');
    return INITIAL_RATE_TIERS;
  });

  // Load studio config and contact handles from permanent storage, ensuring global default contacts match
  const [studioConfig, setStudioConfig] = useState<StudioConfig>(() => {
    try {
      const saved =
        localStorage.getItem(CONFIG_STORAGE_KEY) ||
        localStorage.getItem('anthrocraft_config_permanent_v2') ||
        localStorage.getItem('anthrocraft_config_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        const mergedConfig: StudioConfig = {
          ...INITIAL_STUDIO_CONFIG,
          ...parsed,
          socials: {
            ...INITIAL_STUDIO_CONFIG.socials,
            ...(parsed.socials || {}),
          },
        };
        // Ensure non-empty active social defaults
        if (!mergedConfig.socials.discord) mergedConfig.socials.discord = INITIAL_STUDIO_CONFIG.socials.discord;
        if (!mergedConfig.socials.twitter) mergedConfig.socials.twitter = INITIAL_STUDIO_CONFIG.socials.twitter;
        if (!mergedConfig.socials.instagram) mergedConfig.socials.instagram = INITIAL_STUDIO_CONFIG.socials.instagram;
        if (!mergedConfig.socials.email) mergedConfig.socials.email = INITIAL_STUDIO_CONFIG.socials.email;

        syncConfigToAllStorage(mergedConfig);
        return mergedConfig;
      }
    } catch (e) {
      console.warn('Failed to load studio config:', e);
    }
    syncConfigToAllStorage(INITIAL_STUDIO_CONFIG);
    return INITIAL_STUDIO_CONFIG;
  });

  // Automatically save permanent user uploads when artworks change
  useEffect(() => {
    const userOnly = artworks.filter((item) => item.isUserUploaded);
    safeSetStorage(USER_UPLOADS_STORAGE_KEY, JSON.stringify(userOnly));
  }, [artworks]);

  // Automatically sync rate tiers and config to permanent storage
  useEffect(() => {
    syncRatesToAllStorage(rateTiers);
  }, [rateTiers]);

  useEffect(() => {
    syncConfigToAllStorage(studioConfig);
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
    setRateTiers((prev) => {
      const next = prev.map((tier) => {
        if (tier.id === id) {
          const updated = { ...tier, ...updates };
          if (
            'imageUrl' in updates &&
            (!updates.imageUrl ||
              (typeof updates.imageUrl === 'string' && updates.imageUrl.trim() === ''))
          ) {
            delete updated.imageUrl;
          }
          return updated;
        }
        return tier;
      });
      syncRatesToAllStorage(next);
      return next;
    });
  };

  const saveAllRateTiers = (newTiers: RateTier[]) => {
    setRateTiers(newTiers);
    syncRatesToAllStorage(newTiers);
  };

  const resetRatesToDefaults = () => {
    setRateTiers(INITIAL_RATE_TIERS);
    syncRatesToAllStorage(INITIAL_RATE_TIERS);
  };

  const updateStudioConfig = (updates: Partial<StudioConfig>) => {
    setStudioConfig((prev) => {
      const next = {
        ...prev,
        ...updates,
        ...(updates.socials ? { socials: { ...prev.socials, ...updates.socials } } : {}),
      };
      syncConfigToAllStorage(next);
      return next;
    });
  };

  const updateSocials = (socialsUpdate: Partial<StudioConfig['socials']>) => {
    setStudioConfig((prev) => {
      const next = {
        ...prev,
        socials: {
          ...prev.socials,
          ...socialsUpdate,
        },
      };
      syncConfigToAllStorage(next);
      return next;
    });
  };

  // Modals state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadModalCategory, setUploadModalCategory] = useState<GalleryCategory | undefined>(undefined);
  const [uploadModalTargetTierId, setUploadModalTargetTierId] = useState<string | undefined>(undefined);
  const [uploadModalInitialImage, setUploadModalInitialImage] = useState<string | undefined>(undefined);
  const [uploadModalInitialTitle, setUploadModalInitialTitle] = useState<string | undefined>(undefined);

  const openUploadModal = (
    category?: GalleryCategory,
    targetTierId?: string,
    initialImage?: string,
    initialTitle?: string
  ) => {
    setUploadModalCategory(category);
    setUploadModalTargetTierId(targetTierId);
    setUploadModalInitialImage(initialImage);
    setUploadModalInitialTitle(initialTitle);
    setIsUploadModalOpen(true);
  };

  const closeUploadModal = () => {
    setIsUploadModalOpen(false);
    setUploadModalCategory(undefined);
    setUploadModalTargetTierId(undefined);
    setUploadModalInitialImage(undefined);
    setUploadModalInitialTitle(undefined);
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
        saveAllRateTiers,
        resetRatesToDefaults,
        studioConfig,
        updateStudioConfig,
        updateSocials,
        isUploadModalOpen,
        uploadModalCategory,
        uploadModalTargetTierId,
        uploadModalInitialImage,
        uploadModalInitialTitle,
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
