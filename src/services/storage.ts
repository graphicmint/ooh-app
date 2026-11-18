import {
  OOHSite,
  SiteVendor,
  SiteCampaignRecord,
  DEFAULT_CLIENT_CATEGORIES,
  DEFAULT_VENDORS,
} from '../types/ooh';
import { INITIAL_SITES } from '../data/initialSites';
import { generateHoardingUid } from '../data/indiaLocations';
import { consolidateSitesByUid } from '../utils/consolidateSites';

const DB_NAME = 'AdVantage_OOH_DB';
const DB_VERSION = 2; // Incremented for vendors and categories store
const STORE_SITES = 'ooh_sites';
const STORE_VENDORS = 'ooh_vendors';
const STORE_CATEGORIES = 'ooh_client_categories';

const LOCAL_STORAGE_KEY = 'advantage_ooh_sites_fallback';
const LOCAL_STORAGE_VENDORS_KEY = 'advantage_ooh_vendors_fallback';
const LOCAL_STORAGE_CATEGORIES_KEY = 'advantage_ooh_categories_fallback';

class StorageService {
  private dbPromise: Promise<IDBDatabase> | null = null;
  private apiAvailable: boolean | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initDB();
      this.checkApiAvailability();
    }
  }

  private async checkApiAvailability(): Promise<boolean> {
    if (this.apiAvailable !== null) return this.apiAvailable;
    try {
      const res = await fetch('/api/health');
      this.apiAvailable = res.ok;
    } catch {
      this.apiAvailable = false;
    }
    return this.apiAvailable;
  }

  private initDB(): Promise<IDBDatabase> {
    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = new Promise((resolve, reject) => {
      if (!('indexedDB' in window)) {
        reject(new Error('IndexedDB not supported'));
        return;
      }

      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_SITES)) {
          const store = db.createObjectStore(STORE_SITES, { keyPath: 'uid' });
          store.createIndex('site_name', 'site_name', { unique: false });
          store.createIndex('category', 'category', { unique: false });
          store.createIndex('city', 'location.city', { unique: false });
          store.createIndex('status', 'status', { unique: false });
          store.createIndex('client_category', 'client_category', { unique: false });
          store.createIndex('vendor_name', 'vendor_name', { unique: false });
        }
        if (!db.objectStoreNames.contains(STORE_VENDORS)) {
          db.createObjectStore(STORE_VENDORS, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(STORE_CATEGORIES)) {
          db.createObjectStore(STORE_CATEGORIES, { keyPath: 'name' });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });

    return this.dbPromise;
  }

  // --- SITES CRUD ---

  async getAllSites(): Promise<OOHSite[]> {
    // 1. Try Backend API first if reachable
    try {
      const isApi = await this.checkApiAvailability();
      if (isApi) {
        const res = await fetch('/api/sites');
        if (res.ok) {
          const json = await res.json();
          if (json.sites && Array.isArray(json.sites) && json.sites.length > 0) {
            const consolidated = consolidateSitesByUid(json.sites);
            this.cacheToIndexedDb(consolidated);
            return consolidated;
          }
        }
      }
    } catch {
      this.apiAvailable = false;
    }

    // 2. Try IndexedDB
    try {
      const db = await this.initDB();
      return await new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_SITES, 'readonly');
        const store = transaction.objectStore(STORE_SITES);
        const request = store.getAll();

        request.onsuccess = () => {
          const results = request.result as OOHSite[];
          if (!results || results.length === 0) {
            this.seedInitialData()
              .then((seeded) => resolve(consolidateSitesByUid(seeded)))
              .catch(reject);
          } else {
            resolve(consolidateSitesByUid(results));
          }
        };

        request.onerror = () => reject(request.error);
      });
    } catch (err) {
      console.warn('Fallback to LocalStorage due to:', err);
      return consolidateSitesByUid(this.getFromLocalStorage());
    }
  }

  async getSiteByUid(uid: string): Promise<OOHSite | undefined> {
    try {
      const isApi = await this.checkApiAvailability();
      if (isApi) {
        const res = await fetch(`/api/sites/${uid}`);
        if (res.ok) return await res.json();
      }
    } catch {
      this.apiAvailable = false;
    }

    try {
      const db = await this.initDB();
      return await new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_SITES, 'readonly');
        const store = transaction.objectStore(STORE_SITES);
        const request = store.get(uid);

        request.onsuccess = () => resolve(request.result as OOHSite | undefined);
        request.onerror = () => reject(request.error);
      });
    } catch {
      const all = consolidateSitesByUid(this.getFromLocalStorage());
      return all.find((s) => s.uid === uid);
    }
  }

  async saveSite(site: OOHSite): Promise<OOHSite> {
    // If site with this UID already exists locally or in API, merge them using consolidateSitesByUid
    // to preserve all past campaigns, creatives, and categories under a single unified record.
    const existing = await this.getSiteByUid(site.uid);
    let finalSite = site;
    if (existing) {
      const mergedList = consolidateSitesByUid([existing, site]);
      if (mergedList.length > 0) {
        finalSite = mergedList[0];
      }
    }

    const siteToSave: OOHSite = {
      ...finalSite,
      updated_at: new Date().toISOString(),
    };

    // Auto-register vendor if provided
    if (siteToSave.vendor_name) {
      await this.registerVendorIfNew(siteToSave.vendor_name, siteToSave.vendor_contact);
    }

    // Auto-register client category if provided
    if (siteToSave.client_category) {
      await this.registerClientCategoryIfNew(siteToSave.client_category);
    }

    // 1. Sync to backend API
    try {
      const isApi = await this.checkApiAvailability();
      if (isApi) {
        const existingRes = await fetch(`/api/sites/${site.uid}`);
        if (existingRes.ok) {
          await fetch(`/api/sites/${site.uid}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(siteToSave),
          });
        } else {
          await fetch('/api/sites', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(siteToSave),
          });
        }
      }
    } catch {
      this.apiAvailable = false;
    }

    // 2. Sync to IndexedDB
    try {
      const db = await this.initDB();
      await new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_SITES, 'readwrite');
        const store = transaction.objectStore(STORE_SITES);
        const request = store.put(siteToSave);
        request.onsuccess = () => resolve(siteToSave);
        request.onerror = () => reject(request.error);
      });
    } catch {
      // ignore
    }

    this.syncToLocalStorage(siteToSave);
    return siteToSave;
  }

  async addCampaignToSite(
    uid: string,
    campaignData: Omit<SiteCampaignRecord, 'id' | 'created_at'>
  ): Promise<{ site: OOHSite; campaign: SiteCampaignRecord }> {
    const site = await this.getSiteByUid(uid);
    if (!site) throw new Error(`Site with UID ${uid} not found in inventory.`);

    const campaignRecord: SiteCampaignRecord = {
      ...campaignData,
      id: 'camp-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6),
      created_at: new Date().toISOString(),
      is_active: true,
    };

    const existingHistory = site.campaign_history || [];
    // Mark previous campaigns as inactive
    const updatedHistory: SiteCampaignRecord[] = [
      campaignRecord,
      ...existingHistory.map((c) => ({ ...c, is_active: false })),
    ];

    // Combine photos: prepend new campaign photos to site's photo gallery
    const newPhotos = campaignRecord.photographs || [];
    const updatedPhotographs = [...newPhotos, ...(site.photographs || [])];

    const updatedSite: OOHSite = {
      ...site,
      client_current_brand: campaignRecord.client_name,
      client_category: campaignRecord.client_category || site.client_category,
      status: 'Booked',
      campaign_history: updatedHistory,
      photographs: updatedPhotographs,
      updated_at: new Date().toISOString(),
    };

    // Auto-register client category if new
    if (campaignRecord.client_category) {
      await this.registerClientCategoryIfNew(campaignRecord.client_category);
    }

    // Save site to database / api / local storage
    const saved = await this.saveSite(updatedSite);
    return { site: saved, campaign: campaignRecord };
  }

  async deleteSite(uid: string): Promise<boolean> {
    try {
      const isApi = await this.checkApiAvailability();
      if (isApi) {
        await fetch(`/api/sites/${uid}`, { method: 'DELETE' });
      }
    } catch {
      this.apiAvailable = false;
    }

    try {
      const db = await this.initDB();
      await new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_SITES, 'readwrite');
        const store = transaction.objectStore(STORE_SITES);
        const request = store.delete(uid);
        request.onsuccess = () => resolve(true);
        request.onerror = () => reject(request.error);
      });
    } catch {
      // ignore
    }

    const list = this.getFromLocalStorage().filter((s) => s.uid !== uid);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
    return true;
  }

  // --- CLIENT CATEGORIES MANAGEMENT ---

  async getClientCategories(): Promise<string[]> {
    try {
      const isApi = await this.checkApiAvailability();
      if (isApi) {
        const res = await fetch('/api/categories');
        if (res.ok) {
          const json = await res.json();
          if (Array.isArray(json.categories) && json.categories.length > 0) {
            localStorage.setItem(LOCAL_STORAGE_CATEGORIES_KEY, JSON.stringify(json.categories));
            return json.categories;
          }
        }
      }
    } catch {
      // ignore
    }

    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_CATEGORIES_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }

    return [...DEFAULT_CLIENT_CATEGORIES];
  }

  async addClientCategory(categoryName: string): Promise<string[]> {
    const trimmed = categoryName.trim();
    if (!trimmed) return this.getClientCategories();

    const current = await this.getClientCategories();
    if (!current.includes(trimmed)) {
      const updated = [...current, trimmed];
      localStorage.setItem(LOCAL_STORAGE_CATEGORIES_KEY, JSON.stringify(updated));

      try {
        const isApi = await this.checkApiAvailability();
        if (isApi) {
          await fetch('/api/categories', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: trimmed }),
          });
        }
      } catch {
        // ignore
      }

      return updated;
    }
    return current;
  }

  private async registerClientCategoryIfNew(cat: string): Promise<void> {
    await this.addClientCategory(cat);
  }

  // --- VENDORS MANAGEMENT ---

  async getVendors(): Promise<SiteVendor[]> {
    try {
      const isApi = await this.checkApiAvailability();
      if (isApi) {
        const res = await fetch('/api/vendors');
        if (res.ok) {
          const json = await res.json();
          if (Array.isArray(json.vendors) && json.vendors.length > 0) {
            localStorage.setItem(LOCAL_STORAGE_VENDORS_KEY, JSON.stringify(json.vendors));
            return json.vendors;
          }
        }
      }
    } catch {
      // ignore
    }

    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_VENDORS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }

    return [...DEFAULT_VENDORS];
  }

  async addVendor(vendorData: { name: string; contact_person?: string; phone?: string; email?: string }): Promise<SiteVendor[]> {
    const trimmedName = vendorData.name.trim();
    if (!trimmedName) return this.getVendors();

    const current = await this.getVendors();
    const existing = current.find((v) => v.name.toLowerCase() === trimmedName.toLowerCase());

    if (!existing) {
      const newVendor: SiteVendor = {
        id: 'v-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6),
        name: trimmedName,
        contact_person: vendorData.contact_person?.trim(),
        phone: vendorData.phone?.trim(),
        email: vendorData.email?.trim(),
      };
      const updated = [...current, newVendor];
      localStorage.setItem(LOCAL_STORAGE_VENDORS_KEY, JSON.stringify(updated));

      try {
        const isApi = await this.checkApiAvailability();
        if (isApi) {
          await fetch('/api/vendors', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newVendor),
          });
        }
      } catch {
        // ignore
      }

      return updated;
    }
    return current;
  }

  private async registerVendorIfNew(vendorName: string, vendorContact?: string): Promise<void> {
    await this.addVendor({
      name: vendorName,
      phone: vendorContact,
    });
  }

  // --- RESET & SEED ---

  async resetToInitial(): Promise<OOHSite[]> {
    try {
      const isApi = await this.checkApiAvailability();
      if (isApi) {
        await fetch('/api/reset', { method: 'POST' });
      }
    } catch {
      this.apiAvailable = false;
    }

    try {
      const db = await this.initDB();
      await new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(STORE_SITES, 'readwrite');
        const store = transaction.objectStore(STORE_SITES);
        const clearReq = store.clear();
        clearReq.onsuccess = () => resolve();
        clearReq.onerror = () => reject(clearReq.error);
      });
      localStorage.setItem(LOCAL_STORAGE_CATEGORIES_KEY, JSON.stringify(DEFAULT_CLIENT_CATEGORIES));
      localStorage.setItem(LOCAL_STORAGE_VENDORS_KEY, JSON.stringify(DEFAULT_VENDORS));
      return this.seedInitialData();
    } catch {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_SITES));
      localStorage.setItem(LOCAL_STORAGE_CATEGORIES_KEY, JSON.stringify(DEFAULT_CLIENT_CATEGORIES));
      localStorage.setItem(LOCAL_STORAGE_VENDORS_KEY, JSON.stringify(DEFAULT_VENDORS));
      return [...INITIAL_SITES];
    }
  }

  private async cacheToIndexedDb(sites: OOHSite[]): Promise<void> {
    try {
      const consolidated = consolidateSitesByUid(sites);
      const db = await this.initDB();
      const transaction = db.transaction(STORE_SITES, 'readwrite');
      const store = transaction.objectStore(STORE_SITES);
      store.clear(); // Clear any stale, duplicate or unmerged records
      consolidated.forEach((site) => store.put(site));
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(consolidated));
    } catch {
      // ignore
    }
  }

  private async seedInitialData(): Promise<OOHSite[]> {
    try {
      const seeded = consolidateSitesByUid(INITIAL_SITES);
      const db = await this.initDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_SITES, 'readwrite');
        const store = transaction.objectStore(STORE_SITES);

        seeded.forEach((site) => store.put(site));

        transaction.oncomplete = () => {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(seeded));
          resolve([...seeded]);
        };

        transaction.onerror = () => reject(transaction.error);
      });
    } catch {
      const seeded = consolidateSitesByUid(INITIAL_SITES);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(seeded));
      return [...seeded];
    }
  }

  private getFromLocalStorage(): OOHSite[] {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          return consolidateSitesByUid(parsed);
        }
      }
    } catch (e) {
      console.error('LocalStorage parse error', e);
    }
    return consolidateSitesByUid(INITIAL_SITES);
  }

  private syncToLocalStorage(site: OOHSite): void {
    try {
      const list = this.getFromLocalStorage();
      const idx = list.findIndex((s) => s.uid === site.uid);
      if (idx >= 0) list[idx] = site;
      else list.push(site);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
    } catch {
      // ignore
    }
  }

  generateNextUid(
    state: string = 'Maharashtra',
    city: string = 'Mumbai',
    pincode: string = '400050',
    serialNo: number = 1,
    illumination: string = 'Front-lit',
    width: number = 40,
    height: number = 20,
    trafficType: string = 'Morning Traffic'
  ): string {
    return generateHoardingUid({
      state,
      city,
      pincode,
      serialNo,
      illumination,
      width,
      height,
      trafficType,
    });
  }
}

export const storageService = new StorageService();
