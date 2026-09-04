import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { Artwork, GalleryCategory, PageType, RateTier, StudioConfig } from '../types';
import {
  INITIAL_ARTWORKS,
  INITIAL_RATE_TIERS,
  INITIAL_STUDIO_CONFIG,
  INITIAL_CONTACTS,
  INITIAL_DATA_VERSION,
} from '../data/initialData';

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
  
  // Core Source Synchronization & Cache Invalidation
  syncStatus: 'idle' | 'syncing' | 'synced' | 'error';
  lastSyncedAt: number | null;
  syncToCoreSource: (override?: {
    rateTiers?: RateTier[];
    studioConfig?: StudioConfig;
    artworks?: Artwork[];
  }) => Promise<boolean>;

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

const CORE_VERSION_STORAGE_KEY = 'anthrocraft_active_core_version';
const RATES_STORAGE_KEY = 'anthrocraft_rates_v7';
const CONFIG_STORAGE_KEY = 'anthrocraft_config_v7';
const USER_UPLOADS_STORAGE_KEY = 'anthrocraft_user_artworks_v7';
const DELETED_ARTWORKS_STORAGE_KEY = 'anthrocraft_deleted_artworks_v7';
const OWNER_MODE_STORAGE_KEY = 'anthrocraft_owner_mode_active';
const OWNER_PIN_STORAGE_KEY = 'anthrocraft_owner_pin_code';

const ALL_LEGACY_KEYS = [
  'anthrocraft_artworks_v1',
  'anthrocraft_artworks',
  'anthrocraft_rates_permanent_v3',
  'anthrocraft_rates_permanent_v2',
  'anthrocraft_rates_v1',
  'anthrocraft_rates_v4',
  'anthrocraft_rates_v5',
  'anthrocraft_rates_v6',
  'anthrocraft_config_permanent_v3',
  'anthrocraft_config_permanent_v2',
  'anthrocraft_config_v1',
  'anthrocraft_config_v4',
  'anthrocraft_config_v5',
  'anthrocraft_config_v6',
  'anthrocraft_user_artworks_v5',
  'anthrocraft_user_artworks_v6',
  'anthrocraft_deleted_artworks_v5',
  'anthrocraft_deleted_artworks_v6',
  'anthrocraft_rates_sync_v3_2026',
  'anthrocraft_artworks_blank_init_v2',
  'anthrocraft_master_version_stamp_v5',
  'anthrocraft_master_version_stamp_v6',
  'anthrocraft_app_master_version',
];

// Resilient localStorage setter with automatic cache eviction on quota pressure
function safeSetStorage(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch (e: any) {
    if (e?.name === 'QuotaExceededError' || e?.code === 22) {
      try {
        ALL_LEGACY_KEYS.forEach((k) => {
          if (k !== key) {
            try { localStorage.removeItem(k); } catch (_) {}
          }
        });
        localStorage.setItem(key, value);
      } catch (retryErr) {
        console.warn(`Browser storage quota reached for ${key}; retaining state in memory.`);
      }
    } else {
      console.warn(`Storage write issue for ${key}:`, e);
    }
  }
}

function syncRatesToStorage(tiers: RateTier[]) {
  safeSetStorage(RATES_STORAGE_KEY, JSON.stringify(tiers));
}

function syncConfigToStorage(config: StudioConfig) {
  safeSetStorage(CONFIG_STORAGE_KEY, JSON.stringify(config));
}

const LEGACY_SAMPLE_IDS = new Set([
  'art-fenrir',
  'art-solaris',
  'art-verdant',
  'art-borealis',
  'art-nightshade',
  'art-neondrift',
  '1', '2', '3', '4', '5', '6',
]);

function isLegacySampleArtwork(item: any): boolean {
  if (!item || typeof item !== 'object') return true;
  if (item.id && LEGACY_SAMPLE_IDS.has(item.id)) return true;
  if (typeof item.imageUrl === 'string' && (item.imageUrl.includes('images.unsplash.com') || item.imageUrl.includes('unsplash.com'))) return true;
  if (typeof item.title === 'string') {
    const upper = item.title.toUpperCase();
    if (
      upper.includes('FENRIR') ||
      upper.includes('SOLARIS') ||
      upper.includes('VERDANT') ||
      upper.includes('BOREALIS') ||
      upper.includes('NIGHTSHADE') ||
      upper.includes('NEON DRIFT') ||
      upper.includes('PANDA') ||
      upper.includes('ECLIPSE CHASER') ||
      upper.includes('KITSUNE RUNNER') ||
      upper.includes('SHADOW STRIKE') ||
      upper.includes('FROSTFANG') ||
      upper.includes('OBSIDIAN GUILD') ||
      upper.includes('CHRONO PACK')
    ) {
      return true;
    }
  }
  return false;
}

// Global client initialization: purge all legacy cache on first load so every visitor on any device gets source defaults
function purgeLegacyCachesAndInitialize() {
  if (typeof window === 'undefined') return;
  try {
    const isCurrent = localStorage.getItem(CORE_VERSION_STORAGE_KEY) === INITIAL_DATA_VERSION;
    if (!isCurrent) {
      // Rescue legitimate user-uploaded artwork if any exists in prior keys
      let rescuedUploads: Artwork[] = [];
      const priorUploadKeys = [
        USER_UPLOADS_STORAGE_KEY,
        'anthrocraft_user_artworks_v6',
        'anthrocraft_user_artworks_v5',
        'anthrocraft_user_artworks_v4',
        'anthrocraft_user_artworks_permanent_v1',
      ];
      for (const k of priorUploadKeys) {
        try {
          const raw = localStorage.getItem(k);
          if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) {
              const genuine = parsed.filter(
                (item) => item && item.id && item.isUserUploaded === true && !isLegacySampleArtwork(item)
              );
              if (genuine.length > 0) {
                rescuedUploads = genuine;
                break;
              }
            }
          }
        } catch (_) {}
      }

      // Evict all legacy keys from visitor storage
      ALL_LEGACY_KEYS.forEach((k) => {
        try {
          localStorage.removeItem(k);
        } catch (_) {}
      });

      // Save rescued uploads or start completely clean
      if (rescuedUploads.length > 0) {
        try {
          localStorage.setItem(USER_UPLOADS_STORAGE_KEY, JSON.stringify(rescuedUploads));
        } catch (_) {}
      } else {
        try {
          localStorage.removeItem(USER_UPLOADS_STORAGE_KEY);
        } catch (_) {}
      }

      // Seed canonical hardcoded rate sheets and studio config defaults
      try {
        localStorage.setItem(RATES_STORAGE_KEY, JSON.stringify(INITIAL_RATE_TIERS));
        localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(INITIAL_STUDIO_CONFIG));
      } catch (_) {}

      // Stamp master release version
      try {
        localStorage.setItem(CORE_VERSION_STORAGE_KEY, INITIAL_DATA_VERSION);
      } catch (_) {}
    }
  } catch (err) {
    console.warn('Initial cache purge error:', err);
  }
}

// Run immediately upon script load
purgeLegacyCachesAndInitialize();

export const StudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activePage, setActivePageState] = useState<PageType>('home');
  
  // Load artworks directly from hardcoded source defaults (INITIAL_ARTWORKS) combined with any owner uploads
  const [artworks, setArtworks] = useState<Artwork[]>(() => {
    try {
      // 1. Manually deleted artwork IDs (if owner deleted any item)
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

      // 2. Inspect user uploads from owner mode
      let userUploads: Artwork[] = [];
      try {
        const userSaved = localStorage.getItem(USER_UPLOADS_STORAGE_KEY);
        if (userSaved) {
          const parsed = JSON.parse(userSaved);
          if (Array.isArray(parsed)) {
            userUploads = parsed
              .filter((item) => item && !isLegacySampleArtwork(item) && item.isUserUploaded === true)
              .map((item) => ({ ...item, isUserUploaded: true }));
          }
        }
      } catch (e) {
        console.warn('Failed to parse user uploaded artworks:', e);
      }

      // Filter out user uploads that were explicitly deleted
      userUploads = userUploads.filter((item) => !deletedIds.includes(item.id));
      safeSetStorage(USER_UPLOADS_STORAGE_KEY, JSON.stringify(userUploads));

      // Filter initial source artworks that were not explicitly deleted
      const initialRemaining = INITIAL_ARTWORKS.filter((item) => !deletedIds.includes(item.id));

      // Combine user uploads on top, followed by source default artworks (preventing duplicates)
      const userIds = new Set(userUploads.map((item) => item.id));
      const combined = [...userUploads, ...initialRemaining.filter((item) => !userIds.has(item.id))];

      return combined.length > 0 ? combined : INITIAL_ARTWORKS;
    } catch (e) {
      console.warn('Failed to initialize artworks, using INITIAL_ARTWORKS:', e);
      return INITIAL_ARTWORKS;
    }
  });

  // Load rate tiers initialized from hardcoded source defaults (INITIAL_RATE_TIERS)
  const [rateTiers, setRateTiers] = useState<RateTier[]>(() => {
    try {
      const saved = localStorage.getItem(RATES_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const userTierMap = new Map<string, RateTier>();
          parsed.forEach((tier: RateTier) => {
            if (tier && tier.id) {
              userTierMap.set(tier.id, tier);
            }
          });

          // Overlay onto INITIAL_RATE_TIERS
          const mergedTiers: RateTier[] = INITIAL_RATE_TIERS.map((defaultTier) => {
            const userEdit = userTierMap.get(defaultTier.id);
            if (userEdit) {
              userTierMap.delete(defaultTier.id);
              return {
                ...defaultTier,
                ...userEdit,
                price: userEdit.price && userEdit.price.trim() !== '' ? userEdit.price : defaultTier.price,
                deliverables:
                  Array.isArray(userEdit.deliverables) && userEdit.deliverables.length > 0
                    ? userEdit.deliverables
                    : defaultTier.deliverables,
                imageUrl: userEdit.imageUrl || defaultTier.imageUrl,
              };
            }
            return defaultTier;
          });

          // Include any custom tiers added by user
          userTierMap.forEach((customTier) => {
            mergedTiers.push(customTier);
          });

          syncRatesToStorage(mergedTiers);
          return mergedTiers;
        }
      }
    } catch (e) {
      console.warn('Failed to load rate tiers, falling back to INITIAL_RATE_TIERS:', e);
    }

    syncRatesToStorage(INITIAL_RATE_TIERS);
    return INITIAL_RATE_TIERS;
  });

  // Load studio config and contact handles initialized from hardcoded source defaults (INITIAL_STUDIO_CONFIG)
  const [studioConfig, setStudioConfig] = useState<StudioConfig>(() => {
    try {
      const saved = localStorage.getItem(CONFIG_STORAGE_KEY);
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
        if (!mergedConfig.socials.discord) mergedConfig.socials.discord = INITIAL_STUDIO_CONFIG.socials.discord;
        if (!mergedConfig.socials.twitter) mergedConfig.socials.twitter = INITIAL_STUDIO_CONFIG.socials.twitter;
        if (!mergedConfig.socials.instagram) mergedConfig.socials.instagram = INITIAL_STUDIO_CONFIG.socials.instagram;
        if (!mergedConfig.socials.email) mergedConfig.socials.email = INITIAL_STUDIO_CONFIG.socials.email;

        syncConfigToStorage(mergedConfig);
        return mergedConfig;
      }
    } catch (e) {
      console.warn('Failed to load studio config:', e);
    }
    syncConfigToStorage(INITIAL_STUDIO_CONFIG);
    return INITIAL_STUDIO_CONFIG;
  });

  // Automatically save permanent user uploads when artworks change
  useEffect(() => {
    const userOnly = artworks.filter((item) => item.isUserUploaded && !isLegacySampleArtwork(item));
    safeSetStorage(USER_UPLOADS_STORAGE_KEY, JSON.stringify(userOnly));
  }, [artworks]);

  // Automatically sync rate tiers and config to permanent storage
  useEffect(() => {
    syncRatesToStorage(rateTiers);
  }, [rateTiers]);

  useEffect(() => {
    syncConfigToStorage(studioConfig);
  }, [studioConfig]);

  // Core Source Synchronization State & API sync
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced' | 'error'>('idle');
  const [lastSyncedAt, setLastSyncedAt] = useState<number | null>(null);

  // Sync state directly to server and export into src/data/initialData.ts
  const syncToCoreSource = useCallback(
    async (override?: {
      rateTiers?: RateTier[];
      studioConfig?: StudioConfig;
      artworks?: Artwork[];
    }): Promise<boolean> => {
      const payload = {
        rateTiers: override?.rateTiers ?? rateTiers,
        studioConfig: override?.studioConfig ?? studioConfig,
        artworks: override?.artworks ?? artworks,
      };

      try {
        setSyncStatus('syncing');
        const res = await fetch('/api/sync-initial-data', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.version) {
            localStorage.setItem(CORE_VERSION_STORAGE_KEY, data.version);
          }
          setSyncStatus('synced');
          setLastSyncedAt(Date.now());
          console.log(`[AnthroCraft] Successfully synced and persisted to core initialData.ts (${data.version})`);
          return true;
        } else {
          setSyncStatus('error');
          return false;
        }
      } catch (err) {
        console.warn('Backend sync unavailable (client-only mode):', err);
        setSyncStatus('error');
        return false;
      }
    },
    [rateTiers, studioConfig, artworks]
  );

  // Automatic cache validation & sync on initial mount for any visitor / new device / incognito
  useEffect(() => {
    let isMounted = true;
    async function checkServerAndInvalidateCache() {
      try {
        const res = await fetch('/api/initial-data', {
          headers: { 'Cache-Control': 'no-cache' },
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success && isMounted) {
            const storedVersion = localStorage.getItem(CORE_VERSION_STORAGE_KEY);
            // If server has custom stored data and the version differs from client cache
            if (data.version && data.version !== storedVersion && data.rateTiers && data.studioConfig) {
              console.log(`[AnthroCraft] Discovered updated core version (${data.version}). Invalidating older local cache.`);
              
              // 1. Evict legacy cached stores
              ALL_LEGACY_KEYS.forEach((k) => {
                try { localStorage.removeItem(k); } catch (_) {}
              });

              // 2. Hydrate from server core dataset
              if (Array.isArray(data.rateTiers) && data.rateTiers.length > 0) {
                setRateTiers(data.rateTiers);
                syncRatesToStorage(data.rateTiers);
              }
              if (data.studioConfig) {
                setStudioConfig(data.studioConfig);
                syncConfigToStorage(data.studioConfig);
              }
              if (Array.isArray(data.artworks) && data.artworks.length > 0) {
                setArtworks(data.artworks);
                safeSetStorage(USER_UPLOADS_STORAGE_KEY, JSON.stringify(data.artworks.filter((a: Artwork) => a.isUserUploaded)));
              }

              // 3. Mark client cache as updated to server version
              localStorage.setItem(CORE_VERSION_STORAGE_KEY, data.version);
              setLastSyncedAt(Date.now());
            }
          }
        }
      } catch {
        // Fallback to static initialData.ts
      }
    }

    checkServerAndInvalidateCache();
    return () => {
      isMounted = false;
    };
  }, []);

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
    const nextArtworks = [newArt, ...artworks];
    setArtworks(nextArtworks);

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

    // 3. Export / persist directly into core initialData.ts
    syncToCoreSource({ artworks: nextArtworks });
  };

  const removeArtwork = (id: string) => {
    // 1. Remove from state
    const nextArtworks = artworks.filter((item) => item.id !== id);
    setArtworks(nextArtworks);

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

    // 4. Export / persist directly into core initialData.ts
    syncToCoreSource({ artworks: nextArtworks });
  };

  const updateArtwork = (id: string, updates: Partial<Artwork>) => {
    const nextArtworks = artworks.map((item) => (item.id === id ? { ...item, ...updates } : item));
    setArtworks(nextArtworks);

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

    // Export / persist directly into core initialData.ts
    syncToCoreSource({ artworks: nextArtworks });
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
      syncRatesToStorage(next);
      syncToCoreSource({ rateTiers: next });
      return next;
    });
  };

  const saveAllRateTiers = (newTiers: RateTier[]) => {
    setRateTiers(newTiers);
    syncRatesToStorage(newTiers);
    syncToCoreSource({ rateTiers: newTiers });
  };

  const resetRatesToDefaults = () => {
    setRateTiers(INITIAL_RATE_TIERS);
    syncRatesToStorage(INITIAL_RATE_TIERS);
    syncToCoreSource({ rateTiers: INITIAL_RATE_TIERS });
  };

  const updateStudioConfig = (updates: Partial<StudioConfig>) => {
    setStudioConfig((prev) => {
      const next = {
        ...prev,
        ...updates,
        ...(updates.socials ? { socials: { ...prev.socials, ...updates.socials } } : {}),
      };
      syncConfigToStorage(next);
      syncToCoreSource({ studioConfig: next });
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
      syncConfigToStorage(next);
      syncToCoreSource({ studioConfig: next });
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
        syncStatus,
        lastSyncedAt,
        syncToCoreSource,
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
