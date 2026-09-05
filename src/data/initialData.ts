import { Milestone, RateTier, StudioConfig, Artwork } from '../types';

export const INITIAL_DATA_VERSION = "anthrocraft_v_artworks_custom_3_complete_2026";

export const INITIAL_CONTACTS: StudioConfig['socials'] = {
  "discord": "anthrocraft.studio",
  "twitter": "https://twitter.com/anthrocraft",
  "instagram": "https://instagram.com/anthrocraft.studio",
  "artstation": "https://artstation.com/anthrocraft",
  "email": "contact@anthrocraft.studio"
};

export const INITIAL_STUDIO_CONFIG: StudioConfig = {
  brandName: "ANTHROPOCRAFT",
  brandSub: "STUDIO",
  tagline: "CREATING EXPRESSIVE CHARACTERS WITH PERSONALITY AND STORY.",
  welcomeHeading: "WELCOME TO\nANTHROPOCRAFT STUDIO",
  welcomeIntro: "An independent creative art atelier dedicated to high-end furry character design, nuanced illustrative storytelling, and bespoke anthropomorphic visual art. Every project is crafted with expressive vitality, refined anatomical silhouettes, and meticulous attention to character identity.",
  aboutHeading: "ABOUT\nANTHROPOCRAFT STUDIO",
  aboutBody: "ANTHROPOCRAFT STUDIO is an independent creative sanctuary focused on delivering expressive, emotive, and anatomically dynamic furry character art. Rooted in traditional illustration fundamentals and elevated by contemporary digital technique, the studio transforms unique concepts, fursonas, and creature designs into captivating visual narratives.",
  aboutPillars: [
  {
    "title": "EXPRESSIVE DYNAMICS",
    "description": "Breathing authentic emotional nuance, gesture, and distinctive attitude into every piece."
  },
  {
    "title": "ANATOMICAL SILHOUETTE",
    "description": "Balancing stylized anthropomorphic form with rigorous grounding, flow, and volume."
  },
  {
    "title": "BESPOKE CRAFTSMANSHIP",
    "description": "Treating every client commission as a signature art piece with bespoke texture, lighting, and palette."
  }
],
  commissionStatus: "OPEN",
  slotsAvailable: 3,
  socials: INITIAL_CONTACTS,
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

export const INITIAL_ARTWORKS: Artwork[] = [
  {
    id: "art-anthro-custom-3",
    title: "CUSTOM ANTHROPOMORPHIC ARTWORK",
    category: "CUSTOM ARTWORK",
    imageUrl: "https://user30093.na.imgto.link/public/20260905/anthropocraftstudio-3.avif",
    year: "2026",
    medium: "Custom Tailored Commission / 300 DPI",
    description: "Bespoke custom anthropomorphic artwork tailored to client specifications, featuring expressive character personality, intricate thematic details, and premium finishing.",
    aspectRatio: "square",
    createdAt: 1788642900000,
    isUserUploaded: true,
  },
  {
    id: "art-anthro-fullbody-5",
    title: "FULL-BODY CHARACTER CONCEPT",
    category: "FULL-BODY ART",
    imageUrl: "https://user30093.na.imgto.link/public/20260905/anthropocraftstudio-5.avif",
    year: "2026",
    medium: "Full-Body Digital Illustration / 300 DPI",
    description: "Fully rendered anthropomorphic character art showcasing intricate costume details, anatomical posing, and striking character demeanor.",
    aspectRatio: "wide",
    createdAt: 1788642600000,
    isUserUploaded: true,
  },
  {
    id: "art-anthro-fullbody-2",
    title: "FULL-BODY CHARACTER COMPOSITION",
    category: "FULL-BODY ART",
    imageUrl: "https://user30093.na.imgto.link/public/20260905/anthropocraftstudio-2.avif",
    year: "2026",
    medium: "Master Full-Body Illustration / 300 DPI",
    description: "Detailed full-body anthropomorphic illustration emphasizing anatomical structure, costume craftsmanship, and expressive staging.",
    aspectRatio: "wide",
    createdAt: 1788642300000,
    isUserUploaded: true,
  },
  {
    id: "art-anthro-fullbody-9",
    title: "DYNAMIC FULL-BODY ANTHROPOMORPHIC ART",
    category: "FULL-BODY ART",
    imageUrl: "https://user30093.na.imgto.link/public/20260905/anthropocraftstudio-9.avif",
    year: "2026",
    medium: "Full-Body Digital Illustration / 300 DPI",
    description: "Complete full-body anthropomorphic character piece featuring dynamic anatomy, detailed costume design, and crisp lineart rendering.",
    aspectRatio: "wide",
    createdAt: 1788642000000,
    isUserUploaded: true,
  },
  {
    id: "art-anthro-portrait-studio",
    title: "ANTHROPOMORPHIC MASTER PORTRAIT",
    category: "PORTRAITS",
    imageUrl: "https://user30093.na.imgto.link/public/20260905/anthropocraftstudio.avif",
    year: "2026",
    medium: "Digital Portrait Study / 300 DPI",
    description: "Refined anthropomorphic master portrait capturing expressive character emotion, subtle textural brushwork, and atmospheric depth.",
    aspectRatio: "portrait",
    createdAt: 1788641800000,
    isUserUploaded: true,
  },
  {
    id: "art-anthro-illustration-8",
    title: "ATMOSPHERIC WORLD ILLUSTRATION",
    category: "CHARACTER ART",
    imageUrl: "https://user30093.na.imgto.link/public/20260905/anthropocraftstudio-8.avif",
    year: "2026",
    medium: "Panoramic Character Illustration / 300 DPI",
    description: "Expansive atmospheric character illustration featuring dynamic character presence, rich environmental storytelling, and cinematic color grading.",
    aspectRatio: "wide",
    createdAt: 1788641500000,
    isUserUploaded: true,
  },
  {
    id: "art-anthro-character-art-4",
    title: "ANTHROPOMORPHIC PORTRAIT STUDY",
    category: "CHARACTER ART",
    imageUrl: "https://user30093.na.imgto.link/public/20260905/anthropocraftstudio-4.avif",
    year: "2026",
    medium: "Detailed Character Portrait / 300 DPI",
    description: "Detailed character portrait study highlighting expressive facial features, soft directional lighting, and refined anatomical textures.",
    aspectRatio: "tall",
    createdAt: 1788641200000,
    isUserUploaded: true,
  },
  {
    id: "art-anthro-character-art-11",
    title: "CHARACTER ART ILLUSTRATION",
    category: "CHARACTER ART",
    imageUrl: "https://user30093.na.imgto.link/public/20260905/anthropocraftstudio-11.avif",
    year: "2026",
    medium: "Full Render Character Art / 300 DPI",
    description: "Signature fully-rendered anthropomorphic character art illustration with intricate costume details, ambient lighting, and expressive personality.",
    aspectRatio: "tall",
    createdAt: 1788641000000,
    isUserUploaded: true,
  },
  {
    id: "art-anthro-reference-sheet-main",
    title: "ANTHROPOCRAFT SIGNATURE MODEL SHEET",
    category: "REFERENCE SHEETS",
    imageUrl: "https://user30093.na.imgto.link/public/20260905/anthropocaftstudio.avif",
    year: "2026",
    medium: "Signature Character Model Sheet / 300 DPI",
    description: "Signature AnthroCraft character model guide featuring complete anatomical proportions, expression sheet, accessories, and color swatches.",
    aspectRatio: "square",
    createdAt: 1788640800000,
    isUserUploaded: true,
  },
  {
    id: "art-anthro-reference-sheet-10",
    title: "CHARACTER DESIGN & MODEL GUIDE",
    category: "REFERENCE SHEETS",
    imageUrl: "https://user30093.na.imgto.link/public/20260905/anthropocraftstudio-10.avif",
    year: "2026",
    medium: "Square Master Character Sheet / 300 DPI",
    description: "Detailed character design sheet featuring iconic character turnaround elements, expressions, and color swatches.",
    aspectRatio: "square",
    createdAt: 1788640500000,
    isUserUploaded: true,
  },
  {
    id: "art-anthro-reference-sheet-14",
    title: "CHARACTER REFERENCE SHEET III",
    category: "REFERENCE SHEETS",
    imageUrl: "https://user30093.na.imgto.link/public/20260905/anthropocraftstudio-14.avif",
    year: "2026",
    medium: "Turnaround Character Reference Sheet / 300 DPI",
    description: "Detailed multi-angle turnaround character reference guide with expression matrix, accessories layout, and color palette.",
    aspectRatio: "wide",
    createdAt: 1788640200000,
    isUserUploaded: true,
  },
  {
    id: "art-anthro-reference-sheet-15",
    title: "CHARACTER REFERENCE SHEET II",
    category: "REFERENCE SHEETS",
    imageUrl: "https://user30093.na.imgto.link/public/20260905/anthropocraftstudio-15.avif",
    year: "2026",
    medium: "Turnaround Character Reference Sheet / 300 DPI",
    description: "Comprehensive turnaround model sheet with full anatomical perspectives, color key callouts, and costume specs.",
    aspectRatio: "wide",
    createdAt: 1788640000000,
    isUserUploaded: true,
  },
  {
    id: "art-anthro-reference-sheet-13",
    title: "CHARACTER REFERENCE SHEET I",
    category: "REFERENCE SHEETS",
    imageUrl: "https://user30093.na.imgto.link/public/20260905/anthropocraftstudio-13.avif",
    year: "2026",
    medium: "Turnaround Character Reference Sheet / 300 DPI",
    description: "High-resolution master character guide with anatomical turnaround angles, expression guides, and color swatch hierarchy.",
    aspectRatio: "wide",
    createdAt: 1788639500000,
    isUserUploaded: true,
  },
  {
    id: "art-character-reference-sheet",
    title: "CHARACTER MODEL GUIDE",
    category: "REFERENCE SHEETS",
    imageUrl: "https://cdn.phototourl.com/free/2026-09-05-553f3779-48a7-4585-ba97-2a0beed0e732.png",
    year: "2026",
    medium: "Digital Character Turnaround Sheet / 300 DPI",
    description: "Detailed character model guide featuring turnaround profiles, precise color palette swatches, and character annotations.",
    aspectRatio: "wide",
    createdAt: 1788638900000,
    isUserUploaded: true,
  },
];

export const INITIAL_RATE_TIERS: RateTier[] = [
  {
    "id": "character-art",
    "title": "CHARACTER ART",
    "price": "$200 To $1000",
    "subtitle": "Standalone Character Focus",
    "description": "A fully rendered expressive character piece with dynamic posing, rich material rendering, and subtle atmospheric backdrop.",
    "turnaround": "2 - 3 Weeks",
    "deliverables": [
      "High-resolution print-ready PNG (300 DPI)",
      "Transparent background version included",
      "2 rounds of sketch & color revision",
      "Dynamic lighting & material finish"
    ],
    "featured": true
  },
  {
    "id": "portraits-icons",
    "title": "PORTRAITS & HEADSHOTS",
    "price": "$200 To $1000",
    "subtitle": "Expressive Bust & Iconography",
    "description": "Focused close-up character portrait emphasizing emotive facial expression, eye detail, fur texturing, and clean framing.",
    "turnaround": "1 - 2 Weeks",
    "deliverables": [
      "High-res square avatar format + full resolution",
      "Custom mood lighting and tonal palette",
      "1 round of sketch review",
      "Optimized for social avatars & discord badges"
    ]
  },
  {
    "id": "full-body-art",
    "title": "FULL-BODY ART",
    "price": "$300 To $1000+",
    "subtitle": "Complete Silhouette & Outfit",
    "description": "Full anatomical coverage showcasing costume details, props, complex markings, dynamic action, or relaxed resting pose.",
    "turnaround": "2 - 4 Weeks",
    "deliverables": [
      "Full body 4K+ canvas resolution",
      "Detailed costume, wings, tail, or armor pass",
      "Complex pose exploration during sketch phase",
      "Layered source export upon request"
    ]
  },
  {
    "id": "reference-sheet",
    "title": "REFERENCE SHEET",
    "price": "$300 To $1000+",
    "subtitle": "Comprehensive Character Guide",
    "description": "The definitive architectural guide for your character or fursona, including multi-angle turnaround views, color swatches, eye callouts, and apparel options.",
    "turnaround": "3 - 5 Weeks",
    "imageUrl": "https://cdn.phototourl.com/free/2026-09-05-553f3779-48a7-4585-ba97-2a0beed0e732.png",
    "deliverables": [
      "Front + Back full-body views",
      "Headshot expressions + maw / paw close-ups",
      "Precise CMYK / RGB color palette swatch chart",
      "Typography info panel (Name, Species, Traits, Notes)"
    ]
  },
  {
    "id": "mascot-design",
    "title": "MASCOT DESIGN",
    "price": "$250 To $800",
    "subtitle": "Brand & Community Mascot Identity",
    "description": "Original character creation tailored for streaming, merchandise, convention badges, or community branding with full vector/raster versatility.",
    "turnaround": "3 - 6 Weeks",
    "deliverables": [
      "Conceptual ideation sketches & silhouette tests",
      "Final character turnaround & expression sheet",
      "Commercial usage license available",
      "Vector or ultra-high-res raster exports"
    ]
  },
  {
    "id": "custom-commission",
    "title": "CUSTOM COMMISSION",
    "price": "$200 To $1000+",
    "subtitle": "Complex Multi-Character & Scene",
    "description": "Bespoke large-scale compositions, complex cinematic backgrounds, multi-character interactions, or custom artbook illustrations.",
    "turnaround": "Flexible / Based on Scope",
    "imageUrl": "https://user30093.na.imgto.link/public/20260905/anthropocraftstudio-3.avif",
    "deliverables": [
      "Custom concept storyboard & color script",
      "Full background environment design",
      "Comprehensive milestone check-ins",
      "Exclusive high-tier commercial rights support"
    ]
  }
];
