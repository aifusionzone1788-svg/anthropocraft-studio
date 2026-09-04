import { Milestone, RateTier, StudioConfig, Artwork } from '../types';

export const INITIAL_STUDIO_CONFIG: StudioConfig = {
  brandName: 'ANTHROPOCRAFT',
  brandSub: 'STUDIO',
  tagline: 'CREATING EXPRESSIVE CHARACTERS WITH PERSONALITY AND STORY.',
  welcomeHeading: 'WELCOME TO\nANTHROPOCRAFT STUDIO',
  welcomeIntro:
    'An independent creative art atelier dedicated to high-end furry character design, nuanced illustrative storytelling, and bespoke anthropomorphic visual art. Every project is crafted with expressive vitality, refined anatomical silhouettes, and meticulous attention to character identity.',
  aboutHeading: 'ABOUT\nANTHROPOCRAFT STUDIO',
  aboutBody:
    'ANTHROPOCRAFT STUDIO is an independent creative sanctuary focused on delivering expressive, emotive, and anatomically dynamic furry character art. Rooted in traditional illustration fundamentals and elevated by contemporary digital technique, the studio transforms unique concepts, fursonas, and creature designs into captivating visual narratives.',
  aboutPillars: [
    {
      title: 'EXPRESSIVE DYNAMICS',
      description: 'Breathing authentic emotional nuance, gesture, and distinctive attitude into every piece.',
    },
    {
      title: 'ANATOMICAL SILHOUETTE',
      description: 'Balancing stylized anthropomorphic form with rigorous grounding, flow, and volume.',
    },
    {
      title: 'BESPOKE CRAFTSMANSHIP',
      description: 'Treating every client commission as a signature art piece with bespoke texture, lighting, and palette.',
    },
  ],
  commissionStatus: 'OPEN',
  slotsAvailable: 3,
  socials: {
    discord: 'anthrocraft.studio',
    twitter: 'https://twitter.com/anthrocraft',
    instagram: 'https://instagram.com/anthrocraft.studio',
    artstation: 'https://artstation.com/anthrocraft',
    email: 'contact@anthrocraft.studio',
  },
};

export const INITIAL_MILESTONES: Milestone[] = [
  {
    number: '01',
    title: 'THE BEGINNING',
    description: 'Started creating original character artwork and exploring expressive anthropomorphic visual styles.',
  },
  {
    number: '02',
    title: 'GROWING THE STUDIO',
    description: 'Expanded into professional commissions, custom character reference sheets, and creative collaborative work.',
  },
  {
    number: '03',
    title: 'CREATIVE COLLABORATIONS',
    description: 'Worked with collectors, clients, and creators across diverse international communities on signature projects.',
  },
  {
    number: '04',
    title: 'CONTINUING THE JOURNEY',
    description: 'Continuing to develop AnthroCraft Studio, refining techniques, and creating unforgettable character art.',
  },
];

export const INITIAL_ARTWORKS: Artwork[] = [];

export const INITIAL_RATE_TIERS: RateTier[] = [
  {
    id: 'character-art',
    title: 'CHARACTER ART',
    price: '$200 To $1000',
    subtitle: 'Standalone Character Focus',
    description: 'A fully rendered expressive character piece with dynamic posing, rich material rendering, and subtle atmospheric backdrop.',
    turnaround: '2 - 3 Weeks',
    deliverables: [
      'High-resolution print-ready PNG (300 DPI)',
      'Transparent background version included',
      '2 rounds of sketch & color revision',
      'Dynamic lighting & material finish',
    ],
    featured: true,
  },
  {
    id: 'portraits-icons',
    title: 'PORTRAITS & HEADSHOTS',
    price: '$200 To $1000',
    subtitle: 'Expressive Bust & Iconography',
    description: 'Focused close-up character portrait emphasizing emotive facial expression, eye detail, fur texturing, and clean framing.',
    turnaround: '1 - 2 Weeks',
    deliverables: [
      'High-res square avatar format + full resolution',
      'Custom mood lighting and tonal palette',
      '1 round of sketch review',
      'Optimized for social avatars & discord badges',
    ],
  },
  {
    id: 'full-body-art',
    title: 'FULL-BODY ART',
    price: '$300 To $1000+',
    subtitle: 'Complete Silhouette & Outfit',
    description: 'Full anatomical coverage showcasing costume details, props, complex markings, dynamic action, or relaxed resting pose.',
    turnaround: '2 - 4 Weeks',
    deliverables: [
      'Full body 4K+ canvas resolution',
      'Detailed costume, wings, tail, or armor pass',
      'Complex pose exploration during sketch phase',
      'Layered source export upon request',
    ],
  },
  {
    id: 'reference-sheet',
    title: 'REFERENCE SHEET',
    price: '$300 To $1000+',
    subtitle: 'Comprehensive Character Guide',
    description: 'The definitive architectural guide for your character or fursona, including multi-angle turnaround views, color swatches, eye callouts, and apparel options.',
    turnaround: '3 - 5 Weeks',
    deliverables: [
      'Front + Back full-body views',
      'Headshot expressions + maw / paw close-ups',
      'Precise CMYK / RGB color palette swatch chart',
      'Typography info panel (Name, Species, Traits, Notes)',
    ],
  },
  {
    id: 'mascot-design',
    title: 'MASCOT DESIGN',
    price: '$250 To $800',
    subtitle: 'Brand & Community Mascot Identity',
    description: 'Original character creation tailored for streaming, merchandise, convention badges, or community branding with full vector/raster versatility.',
    turnaround: '3 - 6 Weeks',
    deliverables: [
      'Conceptual ideation sketches & silhouette tests',
      'Final character turnaround & expression sheet',
      'Commercial usage license available',
      'Vector or ultra-high-res raster exports',
    ],
  },
  {
    id: 'custom-commission',
    title: 'CUSTOM COMMISSION',
    price: '$200 To $1000+',
    subtitle: 'Complex Multi-Character & Scene',
    description: 'Bespoke large-scale compositions, complex cinematic backgrounds, multi-character interactions, or custom artbook illustrations.',
    turnaround: 'Flexible / Based on Scope',
    deliverables: [
      'Custom concept storyboard & color script',
      'Full background environment design',
      'Comprehensive milestone check-ins',
      'Exclusive high-tier commercial rights support',
    ],
  },
];
