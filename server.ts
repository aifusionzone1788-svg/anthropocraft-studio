import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import {
  INITIAL_RATE_TIERS,
  INITIAL_STUDIO_CONFIG,
  INITIAL_ARTWORKS,
  INITIAL_DATA_VERSION,
} from './src/data/initialData';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Body parser with generous limit for compressed artworks
app.use(express.json({ limit: '35mb' }));

const DATA_DIR = path.join(process.cwd(), 'data');
const STORE_FILE = path.join(DATA_DIR, 'studio-store.json');
const INITIAL_DATA_FILE = path.join(process.cwd(), 'src', 'data', 'initialData.ts');

if (!fs.existsSync(DATA_DIR)) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  } catch (err) {
    console.warn('Could not create data directory:', err);
  }
}

// Seed store file on first startup if not already created
if (!fs.existsSync(STORE_FILE)) {
  try {
    fs.writeFileSync(
      STORE_FILE,
      JSON.stringify(
        {
          version: INITIAL_DATA_VERSION,
          updatedAt: new Date().toISOString(),
          rateTiers: INITIAL_RATE_TIERS,
          studioConfig: INITIAL_STUDIO_CONFIG,
          artworks: INITIAL_ARTWORKS,
        },
        null,
        2
      ),
      'utf-8'
    );
  } catch (err) {
    console.warn('Could not seed initial store:', err);
  }
}

// Helper to generate formatted TypeScript for src/data/initialData.ts
function generateInitialDataTs(data: {
  rateTiers: any[];
  studioConfig: any;
  artworks: any[];
  version: string;
}) {
  const contacts = data.studioConfig?.socials || {
    discord: 'anthrocraft.studio',
    twitter: 'https://twitter.com/anthrocraft',
    instagram: 'https://instagram.com/anthrocraft.studio',
    artstation: 'https://artstation.com/anthrocraft',
    email: 'contact@anthrocraft.studio',
  };

  return `import { Milestone, RateTier, StudioConfig, Artwork } from '../types';

export const INITIAL_DATA_VERSION = ${JSON.stringify(data.version)};

export const INITIAL_CONTACTS: StudioConfig['socials'] = ${JSON.stringify(contacts, null, 2)};

export const INITIAL_STUDIO_CONFIG: StudioConfig = {
  brandName: ${JSON.stringify(data.studioConfig?.brandName || 'ANTHROPOCRAFT')},
  brandSub: ${JSON.stringify(data.studioConfig?.brandSub || 'STUDIO')},
  tagline: ${JSON.stringify(data.studioConfig?.tagline || 'CREATING EXPRESSIVE CHARACTERS WITH PERSONALITY AND STORY.')},
  welcomeHeading: ${JSON.stringify(data.studioConfig?.welcomeHeading || 'WELCOME TO\\nANTHROPOCRAFT STUDIO')},
  welcomeIntro: ${JSON.stringify(data.studioConfig?.welcomeIntro || '')},
  aboutHeading: ${JSON.stringify(data.studioConfig?.aboutHeading || 'ABOUT\\nANTHROPOCRAFT STUDIO')},
  aboutBody: ${JSON.stringify(data.studioConfig?.aboutBody || '')},
  aboutPillars: ${JSON.stringify(data.studioConfig?.aboutPillars || [
    { title: 'EXPRESSIVE DYNAMICS', description: 'Breathing authentic emotional nuance, gesture, and distinctive attitude into every piece.' },
    { title: 'ANATOMICAL SILHOUETTE', description: 'Balancing stylized anthropomorphic form with rigorous grounding, flow, and volume.' },
    { title: 'BESPOKE CRAFTSMANSHIP', description: 'Treating every client commission as a signature art piece with bespoke texture, lighting, and palette.' }
  ], null, 2)},
  commissionStatus: ${JSON.stringify(data.studioConfig?.commissionStatus || 'OPEN')},
  slotsAvailable: ${Number(data.studioConfig?.slotsAvailable ?? 3)},
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

export const INITIAL_ARTWORKS: Artwork[] = ${JSON.stringify(data.artworks || [], null, 2)};

export const INITIAL_RATE_TIERS: RateTier[] = ${JSON.stringify(data.rateTiers || [], null, 2)};
`;
}

// API Routes FIRST

// 1. Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

// 2. Fetch current core default dataset for any new visitor or device
app.get('/api/initial-data', (req, res) => {
  try {
    if (fs.existsSync(STORE_FILE)) {
      const content = fs.readFileSync(STORE_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      return res.json({
        success: true,
        source: 'server_store',
        version: parsed.version || INITIAL_DATA_VERSION,
        rateTiers: parsed.rateTiers || INITIAL_RATE_TIERS,
        studioConfig: parsed.studioConfig || INITIAL_STUDIO_CONFIG,
        artworks: parsed.artworks || INITIAL_ARTWORKS,
        updatedAt: parsed.updatedAt,
      });
    }
  } catch (err) {
    console.warn('Error reading store file, fallback to static:', err);
  }

  // Fallback response if store file not yet written
  res.json({
    success: true,
    source: 'in_memory_defaults',
    version: INITIAL_DATA_VERSION,
    rateTiers: INITIAL_RATE_TIERS,
    studioConfig: INITIAL_STUDIO_CONFIG,
    artworks: INITIAL_ARTWORKS,
  });
});

// 3. Persist and export Owner Mode edits directly into initialData.ts and persistent store
app.post('/api/sync-initial-data', (req, res) => {
  try {
    const { rateTiers, studioConfig, artworks } = req.body;
    if (!rateTiers || !studioConfig || !artworks) {
      return res.status(400).json({ error: 'Missing rateTiers, studioConfig, or artworks' });
    }

    const version = `anthrocraft_v_${Date.now()}`;
    const payload = {
      version,
      updatedAt: new Date().toISOString(),
      rateTiers,
      studioConfig,
      artworks,
    };

    // 1. Write persistent JSON store
    fs.writeFileSync(STORE_FILE, JSON.stringify(payload, null, 2), 'utf-8');

    // 2. Export / persist directly into src/data/initialData.ts
    const tsContent = generateInitialDataTs({
      rateTiers,
      studioConfig,
      artworks,
      version,
    });
    fs.writeFileSync(INITIAL_DATA_FILE, tsContent, 'utf-8');

    console.log(`[AnthroCraft API] Synced updated state directly into ${INITIAL_DATA_FILE} (Version: ${version})`);

    return res.json({
      success: true,
      version,
      message: 'State exported and persisted directly into core initialData.ts defaults',
    });
  } catch (err: any) {
    console.error('Failed to sync initial data:', err);
    return res.status(500).json({ error: err?.message || 'Failed to sync initial data' });
  }
});

// Vite middleware / Static Serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AnthroCraft Full-Stack Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
