export type PageType = 'home' | 'gallery' | 'rates' | 'contact';

export type GalleryCategory = 
  | 'ALL'
  | 'CHARACTER ART'
  | 'PORTRAITS'
  | 'FULL-BODY ART'
  | 'REFERENCE SHEETS'
  | 'MASCOT DESIGN'
  | 'CUSTOM ARTWORK';

export interface Artwork {
  id: string;
  title: string;
  category: GalleryCategory;
  imageUrl: string; // Base64 dataURL or uploaded URL
  year?: string;
  medium?: string;
  description?: string;
  aspectRatio?: 'square' | 'portrait' | 'tall' | 'wide';
  createdAt: number;
}

export interface RateTier {
  id: string;
  title: string;
  price: string; // e.g. "[ADD PRICE]" or "$120"
  subtitle?: string;
  description: string;
  turnaround?: string;
  deliverables: string[];
  imageUrl?: string; // Optional real artwork sample uploaded by artist
  featured?: boolean;
}

export interface Milestone {
  number: string;
  title: string;
  description: string;
}

export interface StudioConfig {
  brandName: string;
  brandSub: string;
  tagline: string;
  welcomeHeading: string;
  welcomeIntro: string;
  aboutHeading: string;
  aboutBody: string;
  aboutPillars: {
    title: string;
    description: string;
  }[];
  commissionStatus: 'OPEN' | 'LIMITED SLOTS' | 'WAITLIST ONLY' | 'CLOSED';
  slotsAvailable: number;
  socials: {
    discord: string;
    twitter: string;
    instagram: string;
    artstation: string;
    email: string;
  };
}

export interface ContactFormData {
  clientName: string;
  contactHandle: string; // Discord, email or twitter
  contactMethod: 'Discord' | 'Email' | 'Twitter/X' | 'Other';
  commissionType: string;
  characterInfo: string;
  budgetRange: string;
  deadline?: string;
  commercialUse: boolean;
  notes?: string;
}
