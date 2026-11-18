import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Directories
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'sites.json');
const CATEGORIES_FILE = path.join(DATA_DIR, 'categories.json');
const VENDORS_FILE = path.join(DATA_DIR, 'vendors.json');
const UPLOADS_DIR = path.join(__dirname, 'uploads');
const PUBLIC_DIR = path.join(__dirname, 'public');
const DIST_DIR = path.join(__dirname, 'dist');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

// Serve static assets
app.use('/assets', express.static(path.join(PUBLIC_DIR, 'assets')));
app.use('/uploads', express.static(UPLOADS_DIR));
if (fs.existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR));
}

// Default Seed Data
const DEFAULT_CLIENT_CATEGORIES = [
  'Electronics',
  'Wires & Cables',
  'Banking',
  'NBFC & Financial Services',
  'Lighting & Bulbs',
  'News Channels & Media',
  'Jewellery & Luxury',
  'FMCG & Beverages',
  'Automobile & EVs',
  'Real Estate & Infra',
  'E-Commerce & Quick Commerce',
  'Healthcare & Pharma',
  'Education & EdTech',
  'Fashion & Apparel',
  'Telecom & Tech',
  'Cement & Building Materials',
  'Government & Public Sector',
  'Entertainment & OTT',
];

const DEFAULT_VENDORS = [
  { id: 'v-1', name: 'Times OOH', contact_person: 'Corporate Sales Desk', phone: '+91 22 6635 3535', email: 'sales@timesooh.in' },
  { id: 'v-2', name: 'Bright Outdoor Media Ltd.', contact_person: 'Yogesh Lakhani', phone: '+91 98200 44555', email: 'info@brightoutdoor.com' },
  { id: 'v-3', name: 'Pioneer Publicity Corp.', contact_person: 'Regional Director', phone: '+91 11 2332 7788', email: 'business@pioneerpublicity.com' },
  { id: 'v-4', name: 'Laqshya Media Group', contact_person: 'Key Accounts Lead', phone: '+91 22 4055 9900', email: 'ooh@laqshyamedia.com' },
  { id: 'v-5', name: 'Signpost India Ltd.', contact_person: 'Strategic Alliances', phone: '+91 22 6128 0000', email: 'connect@signpostindia.com' },
  { id: 'v-6', name: 'Jagran Engage', contact_person: 'Outdoor Operations', phone: '+91 120 407 1000', email: 'engage@jagran.com' },
  { id: 'v-7', name: 'TDI International India', contact_person: 'Airports & Metro Lead', phone: '+91 11 4165 5555', email: 'corp@tdiindia.com' },
];

function readCategories() {
  if (!fs.existsSync(CATEGORIES_FILE)) {
    fs.writeFileSync(CATEGORIES_FILE, JSON.stringify(DEFAULT_CLIENT_CATEGORIES, null, 2), 'utf8');
    return DEFAULT_CLIENT_CATEGORIES;
  }
  try {
    return JSON.parse(fs.readFileSync(CATEGORIES_FILE, 'utf8'));
  } catch {
    return DEFAULT_CLIENT_CATEGORIES;
  }
}

function writeCategories(cats) {
  fs.writeFileSync(CATEGORIES_FILE, JSON.stringify(cats, null, 2), 'utf8');
}

function readVendors() {
  if (!fs.existsSync(VENDORS_FILE)) {
    fs.writeFileSync(VENDORS_FILE, JSON.stringify(DEFAULT_VENDORS, null, 2), 'utf8');
    return DEFAULT_VENDORS;
  }
  try {
    return JSON.parse(fs.readFileSync(VENDORS_FILE, 'utf8'));
  } catch {
    return DEFAULT_VENDORS;
  }
}

function writeVendors(vendors) {
  fs.writeFileSync(VENDORS_FILE, JSON.stringify(vendors, null, 2), 'utf8');
}

function getSitePhysicalKey(site) {
  if (!site) return '';
  const normAddr = String(site.location?.address || '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
  const normCity = String(site.location?.city || '')
    .toLowerCase()
    .trim();
  const w = Math.round(site.dimensions?.width || 0);
  const h = Math.round(site.dimensions?.height || 0);

  if (normAddr && normCity && w > 0 && h > 0) {
    return `${normCity}_${normAddr}_${w}x${h}`;
  }
  return String(site.uid || '').trim().toUpperCase();
}

function cleanSiteName(name) {
  return String(name || '')
    .replace(/\s*\((?:copy|\d+)\)/gi, '')
    .trim();
}

function consolidateSitesByUid(sitesList) {
  if (!Array.isArray(sitesList) || sitesList.length === 0) return [];
  const map = new Map();
  const physicalKeyToCanonicalUid = new Map();

  for (const site of sitesList) {
    if (!site || !site.uid) continue;
    const uid = String(site.uid).trim().toUpperCase();
    const physKey = getSitePhysicalKey(site);

    const matchedCanonicalUid = physicalKeyToCanonicalUid.get(physKey) || (map.has(uid) ? uid : null);

    if (!matchedCanonicalUid) {
      const initialCampaigns = Array.isArray(site.campaign_history) ? [...site.campaign_history] : [];
      if (
        site.client_current_brand &&
        !initialCampaigns.some(
          (c) => String(c.client_name).toLowerCase().trim() === String(site.client_current_brand).toLowerCase().trim()
        )
      ) {
        initialCampaigns.push({
          id: 'camp-base-' + uid,
          client_name: site.client_current_brand,
          client_category: site.client_category || 'General',
          campaign_name: site.notes ? site.notes.slice(0, 40) : 'Primary Campaign',
          photographs: Array.isArray(site.photographs) ? site.photographs : [],
          created_at: site.created_at || new Date().toISOString(),
          is_active: site.status === 'Booked',
        });
      }

      // Sort campaigns chronologically (newest first)
      initialCampaigns.sort((a, b) => {
        const timeA = new Date(a.created_at || a.start_date || 0).getTime();
        const timeB = new Date(b.created_at || b.start_date || 0).getTime();
        return timeB - timeA;
      });

      initialCampaigns.forEach((c, idx) => {
        c.is_active = idx === 0;
      });

      const primaryBrand = initialCampaigns.length > 0 ? initialCampaigns[0].client_name : site.client_current_brand;
      const primaryCategory = initialCampaigns.length > 0 ? initialCampaigns[0].client_category : site.client_category;

      const registeredSite = {
        ...site,
        uid,
        site_name: cleanSiteName(site.site_name),
        client_current_brand: primaryBrand,
        client_category: primaryCategory,
        campaign_history: initialCampaigns,
        photographs: Array.isArray(site.photographs) ? site.photographs : [],
      };

      map.set(uid, registeredSite);
      physicalKeyToCanonicalUid.set(physKey, uid);
    } else {
      const existing = map.get(matchedCanonicalUid);

      // Prefer canonical original UID (e.g. MAH-MUMB-0049-01 over MAH-MUMB-0049-02)
      let canonicalUid = existing.uid;
      const isExistingCopy = existing.site_name.toLowerCase().includes('copy') || existing.uid.includes('-02-');
      const isIncomingOriginal = !site.site_name.toLowerCase().includes('copy') && site.uid.includes('-01-');
      if (isExistingCopy && isIncomingOriginal) {
        canonicalUid = uid;
      }

      const mergedCampaigns = [...(existing.campaign_history || [])];

      if (Array.isArray(site.campaign_history)) {
        for (const camp of site.campaign_history) {
          const exists = mergedCampaigns.some(
            (c) =>
              c.id === camp.id ||
              (String(c.client_name).toLowerCase().trim() === String(camp.client_name).toLowerCase().trim() &&
                String(c.client_category).toLowerCase().trim() === String(camp.client_category).toLowerCase().trim())
          );
          if (!exists) mergedCampaigns.push(camp);
        }
      }

      if (
        site.client_current_brand &&
        !mergedCampaigns.some(
          (c) => String(c.client_name).toLowerCase().trim() === String(site.client_current_brand).toLowerCase().trim()
        )
      ) {
        mergedCampaigns.push({
          id: 'camp-dup-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6),
          client_name: site.client_current_brand,
          client_category: site.client_category || 'General',
          campaign_name: site.notes ? site.notes.slice(0, 40) : 'Archived Campaign Booking',
          photographs: Array.isArray(site.photographs) ? site.photographs : [],
          created_at: site.created_at || new Date().toISOString(),
          is_active: false,
        });
      }

      // Strict Chronological Sort of all campaigns (newest first)
      mergedCampaigns.sort((a, b) => {
        const timeA = new Date(a.created_at || a.start_date || 0).getTime();
        const timeB = new Date(b.created_at || b.start_date || 0).getTime();
        return timeB - timeA;
      });

      mergedCampaigns.forEach((c, idx) => {
        c.is_active = idx === 0;
      });

      const existingPhotoUrls = new Set((existing.photographs || []).map((p) => p.url));
      const mergedPhotos = [...(existing.photographs || [])];
      if (Array.isArray(site.photographs)) {
        for (const p of site.photographs) {
          if (!existingPhotoUrls.has(p.url)) {
            existingPhotoUrls.add(p.url);
            mergedPhotos.push(p);
          }
        }
      }

      const latestBrand = mergedCampaigns[0]?.client_name || site.client_current_brand || existing.client_current_brand;
      const latestCategory = mergedCampaigns[0]?.client_category || site.client_category || existing.client_category;

      const mergedSite = {
        ...existing,
        uid: canonicalUid,
        site_name: cleanSiteName(existing.site_name) || cleanSiteName(site.site_name),
        client_current_brand: latestBrand,
        client_category: latestCategory,
        status: site.status === 'Booked' || existing.status === 'Booked' ? 'Booked' : existing.status,
        photographs: mergedPhotos,
        campaign_history: mergedCampaigns,
        updated_at: new Date().toISOString(),
      };

      if (canonicalUid !== existing.uid) {
        map.delete(existing.uid);
      }
      map.set(canonicalUid, mergedSite);
      physicalKeyToCanonicalUid.set(physKey, canonicalUid);
    }
  }

  return Array.from(map.values());
}

function readDb() {
  if (!fs.existsSync(DB_FILE)) {
    return [];
  }
  try {
    const raw = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    const consolidated = consolidateSitesByUid(raw);
    // Persist consolidated records back to DB file
    fs.writeFileSync(DB_FILE, JSON.stringify(consolidated, null, 2), 'utf8');
    return consolidated;
  } catch (err) {
    console.error('Failed reading sites.json:', err);
    return [];
  }
}

function writeDb(sites) {
  const consolidated = consolidateSitesByUid(sites);
  fs.writeFileSync(DB_FILE, JSON.stringify(consolidated, null, 2), 'utf8');
}

// Sync helper
function autoSyncVendorAndCategory(site) {
  if (site.client_category) {
    const cats = readCategories();
    if (!cats.includes(site.client_category.trim())) {
      cats.push(site.client_category.trim());
      writeCategories(cats);
    }
  }
  if (site.vendor_name) {
    const vendors = readVendors();
    const exists = vendors.some((v) => v.name.toLowerCase() === site.vendor_name.trim().toLowerCase());
    if (!exists) {
      vendors.push({
        id: 'v-' + Date.now(),
        name: site.vendor_name.trim(),
        phone: site.vendor_contact?.trim() || undefined,
      });
      writeVendors(vendors);
    }
  }
}

// --- REST API ROUTES ---

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'AdVantage OOH API', timestamp: new Date().toISOString() });
});

// GET /api/categories
app.get('/api/categories', (req, res) => {
  const categories = readCategories();
  res.json({ categories });
});

// POST /api/categories
app.post('/api/categories', (req, res) => {
  const { name } = req.body;
  if (!name || !name.trim()) return res.status(400).json({ error: 'Category name is required' });

  const categories = readCategories();
  const trimmed = name.trim();
  if (!categories.includes(trimmed)) {
    categories.push(trimmed);
    writeCategories(categories);
  }
  res.json({ success: true, categories });
});

// GET /api/vendors
app.get('/api/vendors', (req, res) => {
  const vendors = readVendors();
  res.json({ vendors });
});

// POST /api/vendors
app.post('/api/vendors', (req, res) => {
  const vendorData = req.body;
  if (!vendorData || !vendorData.name || !vendorData.name.trim()) {
    return res.status(400).json({ error: 'Vendor name is required' });
  }

  const vendors = readVendors();
  const trimmedName = vendorData.name.trim();
  const existing = vendors.find((v) => v.name.toLowerCase() === trimmedName.toLowerCase());

  if (!existing) {
    const newVendor = {
      id: vendorData.id || 'v-' + Date.now(),
      name: trimmedName,
      contact_person: vendorData.contact_person?.trim(),
      phone: vendorData.phone?.trim(),
      email: vendorData.email?.trim(),
    };
    vendors.push(newVendor);
    writeVendors(vendors);
    return res.status(201).json({ success: true, vendor: newVendor, vendors });
  }
  res.json({ success: true, vendor: existing, vendors });
});

// GET /api/sites - list with search & filters
app.get('/api/sites', (req, res) => {
  let sites = readDb();
  const { q, category, illumination, status, city, clientCategory, vendor } = req.query;

  if (q) {
    const query = String(q).toLowerCase();
    sites = sites.filter(
      (s) =>
        s.uid.toLowerCase().includes(query) ||
        s.site_name.toLowerCase().includes(query) ||
        s.location.city.toLowerCase().includes(query) ||
        (s.client_category && s.client_category.toLowerCase().includes(query)) ||
        (s.vendor_name && s.vendor_name.toLowerCase().includes(query)) ||
        (s.client_current_brand && s.client_current_brand.toLowerCase().includes(query)) ||
        (s.location.landmark && s.location.landmark.toLowerCase().includes(query))
    );
  }

  if (category && category !== 'All') {
    sites = sites.filter((s) => s.category === category);
  }

  if (illumination && illumination !== 'All') {
    sites = sites.filter((s) => s.illumination === illumination);
  }

  if (status && status !== 'All') {
    sites = sites.filter((s) => s.status === status);
  }

  if (city && city !== 'All') {
    sites = sites.filter((s) => s.location.city === city);
  }

  if (clientCategory && clientCategory !== 'All') {
    sites = sites.filter((s) => s.client_category === clientCategory);
  }

  if (vendor && vendor !== 'All') {
    sites = sites.filter((s) => s.vendor_name === vendor);
  }

  res.json({ total: sites.length, sites });
});

// GET /api/sites/:uid - single site
app.get('/api/sites/:uid', (req, res) => {
  const sites = readDb();
  const site = sites.find((s) => s.uid === req.params.uid);
  if (!site) return res.status(404).json({ error: 'Site not found' });
  res.json(site);
});

// POST /api/sites - create or consolidate site
app.post('/api/sites', (req, res) => {
  const newSite = req.body;
  if (!newSite.uid || !newSite.site_name || !newSite.category) {
    return res.status(400).json({ error: 'Missing mandatory fields: uid, site_name, category' });
  }

  const sites = readDb();
  const existingIndex = sites.findIndex(
    (s) => String(s.uid).trim().toUpperCase() === String(newSite.uid).trim().toUpperCase()
  );

  if (existingIndex !== -1) {
    // UID already exists: consolidate and group campaigns together under single UID card
    const consolidated = consolidateSitesByUid([sites[existingIndex], newSite]);
    const merged = consolidated[0];
    sites[existingIndex] = merged;
    autoSyncVendorAndCategory(merged);
    writeDb(sites);
    return res.status(200).json(merged);
  }

  const siteWithTimestamps = {
    ...newSite,
    created_at: newSite.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  autoSyncVendorAndCategory(siteWithTimestamps);

  sites.push(siteWithTimestamps);
  writeDb(sites);
  res.status(201).json(siteWithTimestamps);
});

// PUT /api/sites/:uid - update site
app.put('/api/sites/:uid', (req, res) => {
  const sites = readDb();
  const idx = sites.findIndex((s) => s.uid === req.params.uid);
  if (idx === -1) return res.status(404).json({ error: 'Site not found' });

  const updatedSite = {
    ...sites[idx],
    ...req.body,
    uid: req.params.uid,
    updated_at: new Date().toISOString(),
  };

  autoSyncVendorAndCategory(updatedSite);

  sites[idx] = updatedSite;
  writeDb(sites);
  res.json(updatedSite);
});

// POST /api/sites/:uid/campaigns - append campaign history to site
app.post('/api/sites/:uid/campaigns', (req, res) => {
  const sites = readDb();
  const idx = sites.findIndex((s) => s.uid === req.params.uid);
  if (idx === -1) return res.status(404).json({ error: 'Site not found' });

  const { client_name, client_category, campaign_name, start_date, end_date, photographs, rate_booked, notes } = req.body;
  if (!client_name || !client_name.trim()) {
    return res.status(400).json({ error: 'Client name is required for campaign' });
  }

  const campaignRecord = {
    id: 'camp-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6),
    client_name: client_name.trim(),
    client_category: (client_category || sites[idx].client_category || 'General').trim(),
    campaign_name: campaign_name?.trim() || undefined,
    start_date: start_date || undefined,
    end_date: end_date || undefined,
    photographs: photographs || [],
    rate_booked: rate_booked !== undefined && rate_booked !== '' ? Number(rate_booked) : undefined,
    notes: notes?.trim() || undefined,
    created_at: new Date().toISOString(),
    is_active: true,
  };

  const existingHistory = sites[idx].campaign_history || [];
  const updatedHistory = [
    campaignRecord,
    ...existingHistory.map((c) => ({ ...c, is_active: false })),
  ];

  const updatedPhotographs = [
    ...(campaignRecord.photographs || []),
    ...(sites[idx].photographs || []),
  ];

  const updatedSite = {
    ...sites[idx],
    client_current_brand: campaignRecord.client_name,
    client_category: campaignRecord.client_category,
    status: 'Booked',
    campaign_history: updatedHistory,
    photographs: updatedPhotographs,
    updated_at: new Date().toISOString(),
  };

  autoSyncVendorAndCategory(updatedSite);
  sites[idx] = updatedSite;
  writeDb(sites);

  res.status(201).json({ success: true, campaign: campaignRecord, site: updatedSite });
});

// DELETE /api/sites/:uid - delete site
app.delete('/api/sites/:uid', (req, res) => {
  let sites = readDb();
  const exists = sites.some((s) => s.uid === req.params.uid);
  if (!exists) return res.status(404).json({ error: 'Site not found' });

  sites = sites.filter((s) => s.uid !== req.params.uid);
  writeDb(sites);
  res.json({ success: true, message: `Site ${req.params.uid} removed.` });
});

// POST /api/upload - image upload
app.post('/api/upload', (req, res) => {
  const { dataUrl, filename } = req.body;
  if (!dataUrl || !dataUrl.startsWith('data:image/')) {
    return res.status(400).json({ error: 'Invalid image data URL' });
  }

  try {
    const matches = dataUrl.match(/^data:image\/([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return res.status(400).json({ error: 'Malformed base64 image string' });
    }

    const ext = matches[1].replace('jpeg', 'jpg');
    const base64Data = matches[2];
    const safeName = (filename || 'upload').replace(/[^a-zA-Z0-9_-]/g, '_');
    const newFilename = `${Date.now()}_${safeName}.${ext}`;
    const filePath = path.join(UPLOADS_DIR, newFilename);

    fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'));
    const url = `/uploads/${newFilename}`;

    res.json({ success: true, url, filename: newFilename });
  } catch (err) {
    console.error('Upload write failed:', err);
    res.status(500).json({ error: 'Failed to write uploaded image' });
  }
});

// GET /api/stats
app.get('/api/stats', (req, res) => {
  const sites = readDb();
  const totalSites = sites.length;
  const available = sites.filter((s) => s.status === 'Available').length;
  const booked = sites.filter((s) => s.status === 'Booked').length;
  const maintenance = sites.filter((s) => s.status === 'Maintenance').length;
  const totalSqFt = sites.reduce((sum, s) => sum + s.dimensions.total_sq_ft, 0);
  const totalMonthlyVal = sites.reduce((sum, s) => sum + s.rate_per_month, 0);

  // Client category breakdown
  const clientCategoryBreakdown = {};
  sites.forEach((s) => {
    const cat = s.client_category || 'Unassigned';
    clientCategoryBreakdown[cat] = (clientCategoryBreakdown[cat] || 0) + 1;
  });

  // Vendor breakdown
  const vendorBreakdown = {};
  sites.forEach((s) => {
    const ven = s.vendor_name || 'Direct / Self';
    vendorBreakdown[ven] = (vendorBreakdown[ven] || 0) + 1;
  });

  res.json({
    totalSites,
    available,
    booked,
    maintenance,
    totalSqFt,
    totalMonthlyVal,
    clientCategoryBreakdown,
    vendorBreakdown,
  });
});

// Catch-all route to serve SPA frontend
if (fs.existsSync(DIST_DIR)) {
  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api')) {
      res.sendFile(path.join(DIST_DIR, 'index.html'));
    } else {
      next();
    }
  });
}

app.listen(PORT, () => {
  console.log(`AdVantage OOH Server running on http://localhost:${PORT}`);
});
