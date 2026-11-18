import { OOHSite, SiteCampaignRecord, OOHPhotograph } from '../types/ooh';

/**
 * Normalizes a site UID for reliable matching.
 */
export function normalizeUid(uid: string): string {
  return (uid || '').trim().toUpperCase();
}

/**
 * Derives a canonical physical key for an outdoor site based on its city,
 * physical address, and aspect dimensions. This allows detecting duplicates
 * created via cloning, copying, or serial re-numbering.
 */
export function getSitePhysicalKey(site: OOHSite): string {
  if (!site) return '';
  const normAddr = (site.location?.address || '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
  const normCity = (site.location?.city || '')
    .toLowerCase()
    .trim();
  const w = Math.round(site.dimensions?.width || 0);
  const h = Math.round(site.dimensions?.height || 0);

  if (normAddr && normCity && w > 0 && h > 0) {
    return `${normCity}_${normAddr}_${w}x${h}`;
  }
  return normalizeUid(site.uid);
}

/**
 * Strips copy/clone annotations like "(Copy)" or "(Copy 2)" from site names.
 */
export function cleanSiteName(name: string): string {
  return (name || '')
    .replace(/\s*\((?:copy|\d+)\)/gi, '')
    .trim();
}

/**
 * Consolidates multiple site entries that share the same UID or physical location
 * into a single, unified site record.
 * 
 * All client campaigns, advertiser categories, and photographs from duplicate/cloned
 * records are merged into the single site's `campaign_history` and `photographs` gallery
 * in strict chronological order (most recent campaign first).
 */
export function consolidateSitesByUid(sitesList: OOHSite[]): OOHSite[] {
  if (!Array.isArray(sitesList) || sitesList.length === 0) return [];

  const map = new Map<string, OOHSite>();
  const physicalKeyToCanonicalUid = new Map<string, string>();

  for (const site of sitesList) {
    if (!site || !site.uid) continue;
    const uid = normalizeUid(site.uid);
    const physKey = getSitePhysicalKey(site);

    // Check if we already registered a site with this UID or same physical location
    const matchedCanonicalUid = physicalKeyToCanonicalUid.get(physKey) || (map.has(uid) ? uid : null);

    if (!matchedCanonicalUid) {
      // First time seeing this physical hoarding site
      const initialCampaigns: SiteCampaignRecord[] = [];

      if (site.campaign_history && Array.isArray(site.campaign_history)) {
        initialCampaigns.push(...site.campaign_history);
      }

      if (
        site.client_current_brand &&
        !initialCampaigns.some(
          (c) => c.client_name.toLowerCase().trim() === site.client_current_brand?.toLowerCase().trim()
        )
      ) {
        initialCampaigns.push({
          id: 'camp-base-' + uid,
          client_name: site.client_current_brand,
          client_category: site.client_category || 'General',
          campaign_name: site.notes?.slice(0, 40) || 'Primary Campaign',
          photographs: site.photographs || [],
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

      // Mark the most recent campaign as active
      initialCampaigns.forEach((c, idx) => {
        c.is_active = idx === 0;
      });

      const initialPhotos = site.photographs || [];
      const primaryBrand = initialCampaigns.length > 0 ? initialCampaigns[0].client_name : site.client_current_brand;
      const primaryCategory = initialCampaigns.length > 0 ? initialCampaigns[0].client_category : site.client_category;

      const registeredSite: OOHSite = {
        ...site,
        uid,
        site_name: cleanSiteName(site.site_name),
        client_current_brand: primaryBrand,
        client_category: primaryCategory,
        campaign_history: initialCampaigns,
        photographs: initialPhotos,
      };

      map.set(uid, registeredSite);
      physicalKeyToCanonicalUid.set(physKey, uid);
    } else {
      // Duplicate / Cloned entry encountered for this physical site! Consolidate together
      const existing = map.get(matchedCanonicalUid)!;

      // Prefer the canonical non-copy UID (e.g., MAH-MUMB-0049-01 over MAH-MUMB-0049-02)
      let canonicalUid = existing.uid;
      const isExistingCopy = existing.site_name.toLowerCase().includes('copy') || existing.uid.includes('-02-');
      const isIncomingOriginal = !site.site_name.toLowerCase().includes('copy') && site.uid.includes('-01-');
      if (isExistingCopy && isIncomingOriginal) {
        canonicalUid = uid;
      }

      // 1. Merge all campaigns from both records
      const mergedCampaigns: SiteCampaignRecord[] = [...(existing.campaign_history || [])];

      if (site.campaign_history && Array.isArray(site.campaign_history)) {
        for (const camp of site.campaign_history) {
          const alreadyExists = mergedCampaigns.some(
            (c) =>
              c.id === camp.id ||
              (c.client_name.toLowerCase().trim() === camp.client_name.toLowerCase().trim() &&
                c.client_category.toLowerCase().trim() === camp.client_category.toLowerCase().trim())
          );
          if (!alreadyExists) {
            mergedCampaigns.push(camp);
          }
        }
      }

      // If duplicate record has a brand not yet in history, append it
      if (
        site.client_current_brand &&
        !mergedCampaigns.some(
          (c) => c.client_name.toLowerCase().trim() === site.client_current_brand?.toLowerCase().trim()
        )
      ) {
        mergedCampaigns.push({
          id: 'camp-dup-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6),
          client_name: site.client_current_brand,
          client_category: site.client_category || 'General',
          campaign_name: site.notes?.slice(0, 40) || 'Campaign Booking',
          photographs: site.photographs || [],
          created_at: site.created_at || new Date().toISOString(),
          is_active: false,
        });
      }

      // 2. Strict Chronological Sort of all campaigns (newest first)
      mergedCampaigns.sort((a, b) => {
        const timeA = new Date(a.created_at || a.start_date || 0).getTime();
        const timeB = new Date(b.created_at || b.start_date || 0).getTime();
        return timeB - timeA;
      });

      // Mark the chronologically newest campaign as active
      mergedCampaigns.forEach((c, idx) => {
        c.is_active = idx === 0;
      });

      // 3. Merge photographs (deduplicate by URL and caption)
      const existingPhotoUrls = new Set((existing.photographs || []).map((p) => p.url));
      const mergedPhotos: OOHPhotograph[] = [...(existing.photographs || [])];

      if (site.photographs && Array.isArray(site.photographs)) {
        for (const p of site.photographs) {
          if (!existingPhotoUrls.has(p.url)) {
            existingPhotoUrls.add(p.url);
            mergedPhotos.push(p);
          }
        }
      }

      // 4. Derive primary brand and category from the newest campaign
      const latestBrand = mergedCampaigns[0]?.client_name || site.client_current_brand || existing.client_current_brand;
      const latestCategory = mergedCampaigns[0]?.client_category || site.client_category || existing.client_category;
      const consolidatedStatus =
        site.status === 'Booked' || existing.status === 'Booked' ? 'Booked' : existing.status;

      const mergedSite: OOHSite = {
        ...existing,
        uid: canonicalUid,
        site_name: cleanSiteName(existing.site_name) || cleanSiteName(site.site_name),
        client_current_brand: latestBrand,
        client_category: latestCategory,
        status: consolidatedStatus,
        photographs: mergedPhotos,
        campaign_history: mergedCampaigns,
        updated_at: new Date().toISOString(),
      };

      // If canonical UID changed, update map key
      if (canonicalUid !== existing.uid) {
        map.delete(existing.uid);
      }
      map.set(canonicalUid, mergedSite);
      physicalKeyToCanonicalUid.set(physKey, canonicalUid);
    }
  }

  return Array.from(map.values());
}
