import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import type { OOHSite, SiteVendor, OOHCategory, IlluminationType, SiteStatus } from '../types/ooh';
import { storageService } from '../services/storage';
import { generateHoardingUid, derivePostalCode, INDIA_LOCATIONS } from '../data/indiaLocations';
import { consolidateSitesByUid } from '../utils/consolidateSites';
import {
  UploadCloud,
  FileSpreadsheet,
  Plus,
  Megaphone,
  Building2,
  Tag,
  CheckCircle2,
  Database,
  Trash2,
  Edit,
  Copy,
  Eye,
  Download,
  Search,
  RefreshCw,
  Layers,
  Sparkles,
  Check,
} from 'lucide-react';

interface DataBossStudioProps {
  sites: OOHSite[];
  storedVendors: string[];
  storedCategories: string[];
  onRefresh: () => Promise<void>;
  onAddSite: () => void;
  onOpenAddCampaign?: (uid?: string) => void;
  onEditSite: (site: OOHSite) => void;
  onCloneSite: (site: OOHSite) => void;
  onViewSite: (site: OOHSite) => void;
  onDeleteSite: (uid: string) => void;
  onShowToast: (title: string, message?: string, type?: 'success' | 'error' | 'info') => void;
}

type DataBossTab = 'bulk-upload' | 'single-add' | 'vendors' | 'categories' | 'inventory-vault';

interface ParsedUploadRow {
  rowNum: number;
  site: Partial<OOHSite>;
  uidGenerated: boolean;
  pinDerived: boolean;
  status: 'valid' | 'warning' | 'error';
  validationMessage: string;
}

export const DataBossStudio: React.FC<DataBossStudioProps> = ({
  sites,
  storedVendors,
  storedCategories,
  onRefresh,
  onAddSite,
  onOpenAddCampaign,
  onEditSite,
  onCloneSite,
  onViewSite,
  onDeleteSite,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<DataBossTab>('bulk-upload');

  // --- Bulk Upload State ---
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [parsedRows, setParsedRows] = useState<ParsedUploadRow[]>([]);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [isSavingBatch, setIsSavingBatch] = useState(false);
  const [batchSaveProgress, setBatchSaveProgress] = useState<{ current: number; total: number } | null>(null);

  // --- Vendor Form State ---
  const [vendorList, setVendorList] = useState<SiteVendor[]>([]);
  const [newVendorName, setNewVendorName] = useState('');
  const [newVendorContact, setNewVendorContact] = useState('');
  const [newVendorPhone, setNewVendorPhone] = useState('');
  const [newVendorEmail, setNewVendorEmail] = useState('');

  // --- Category Form State ---
  const [newCategoryName, setNewCategoryName] = useState('');

  // --- Inventory Vault Search State ---
  const [vaultSearch, setVaultSearch] = useState('');
  const [vaultFilterStatus, setVaultFilterStatus] = useState('All');
  const [vaultFilterCity, setVaultFilterCity] = useState('All');

  // Load vendors when switching to Vendors tab
  const loadFullVendors = async () => {
    try {
      const vens = await storageService.getVendors();
      setVendorList(vens);
    } catch {
      // ignore
    }
  };

  React.useEffect(() => {
    if (activeTab === 'vendors') {
      loadFullVendors();
    }
  }, [activeTab]);

  // --- EXCEL TEMPLATE DOWNLOAD ---
  const handleDownloadTemplate = () => {
    const templateData = [
      {
        'Site Name': 'Bandra Western Express Highway Unipole A',
        'Category': 'Unipoles',
        'State': 'Maharashtra',
        'District': 'Mumbai Suburban',
        'City': 'Mumbai',
        'Street Address': 'Western Express Highway, Bandra East flyover north ramp',
        'Landmark': 'Near Bandra Kurla Complex Junction',
        'Pincode': '400051',
        'Width (ft)': 60,
        'Height (ft)': 25,
        'Illumination': 'Front-lit',
        'Rate Per Month': 450000,
        'Status': 'Available',
        'Vendor Name': 'Times OOH',
        'Vendor Contact': '+91 22 6635 3535',
        'Client Industry Category': 'Banking',
        'Current Brand': 'HDFC Bank',
        'Traffic Peak': 'Evening Traffic',
        'Traffic Footfall': '280,000 vehicles/day',
        'Facing Direction': 'Northbound (Bandra to Andheri)',
        'Notes': 'High prominence visual corridor with zero obstruction',
      },
      {
        'Site Name': 'Connaught Place Outer Circle Gantry East',
        'Category': 'Gantries',
        'State': 'Delhi',
        'District': 'New Delhi',
        'City': 'Delhi',
        'Street Address': 'Barakhamba Road intersection, CP Outer Circle',
        'Landmark': 'Opposite Statesman House',
        'Pincode': '110001',
        'Width (ft)': 50,
        'Height (ft)': 15,
        'Illumination': 'Back-lit',
        'Rate Per Month': 520000,
        'Status': 'Booked',
        'Vendor Name': 'Bright Outdoor Media Ltd.',
        'Vendor Contact': '+91 98200 44555',
        'Client Industry Category': 'Electronics',
        'Current Brand': 'Samsung Galaxy',
        'Traffic Peak': 'Morning Traffic',
        'Traffic Footfall': '350,000 pedestrians & commuters',
        'Facing Direction': 'Traffic flowing towards ITO',
        'Notes': 'Prime capital shopping corridor',
      },
      {
        'Site Name': 'MG Road Metro Station Pillar Display B',
        'Category': 'Metro Pillars',
        'State': 'Karnataka',
        'District': 'Bengaluru Urban',
        'City': 'Bengaluru',
        'Street Address': 'MG Road Metro Station entrance pillar P-42',
        'Landmark': 'Near Trinity Circle & Brigade Road',
        'Pincode': '560001',
        'Width (ft)': 12,
        'Height (ft)': 20,
        'Illumination': 'Digital LED',
        'Rate Per Month': 180000,
        'Status': 'Available',
        'Vendor Name': 'Signpost India Ltd.',
        'Vendor Contact': '+91 22 6128 0000',
        'Client Industry Category': 'Wires & Cables',
        'Current Brand': 'Havells',
        'Traffic Peak': 'Both Peak Windows',
        'Traffic Footfall': '190,000 daily commuters',
        'Facing Direction': 'Direct Metro entry walkway',
        'Notes': 'High dwell time commercial district',
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'OOH_Inventory_Upload');

    worksheet['!cols'] = [
      { wch: 38 },
      { wch: 16 },
      { wch: 18 },
      { wch: 20 },
      { wch: 16 },
      { wch: 45 },
      { wch: 35 },
      { wch: 12 },
      { wch: 12 },
      { wch: 12 },
      { wch: 16 },
      { wch: 16 },
      { wch: 14 },
      { wch: 24 },
      { wch: 18 },
      { wch: 25 },
      { wch: 20 },
      { wch: 18 },
      { wch: 28 },
      { wch: 32 },
      { wch: 40 },
    ];

    XLSX.writeFile(workbook, 'SiteSync_Site_Upload_Template.xlsx');
    onShowToast('Template Downloaded', 'Spreadsheet template saved to your downloads.', 'success');
  };

  // --- SPREADSHEET PARSING ---
  const processUploadedFile = async (file: File) => {
    setIsProcessingFile(true);
    setUploadedFileName(file.name);

    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const rawRows: Record<string, any>[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

      if (rawRows.length === 0) {
        onShowToast('Empty File', 'The uploaded sheet contains no data rows.', 'error');
        setParsedRows([]);
        return;
      }

      const getCol = (row: Record<string, any>, keys: string[]): any => {
        const rowKeys = Object.keys(row);
        for (const k of keys) {
          const match = rowKeys.find((rk) => rk.toLowerCase().trim() === k.toLowerCase().trim());
          if (match !== undefined && row[match] !== '') return row[match];
        }
        return '';
      };

      const parsed: ParsedUploadRow[] = [];

      rawRows.forEach((row, idx) => {
        const siteName = String(getCol(row, ['site_name', 'site name', 'name', 'hoarding name', 'site'])).trim();
        const categoryRaw = String(getCol(row, ['category', 'media type', 'type'])).trim() || 'Billboards';
        const stateRaw = String(getCol(row, ['state', 'state name'])).trim() || 'Maharashtra';
        const districtRaw = String(getCol(row, ['district', 'district name'])).trim();
        const cityRaw = String(getCol(row, ['city', 'city name', 'town'])).trim() || 'Mumbai';
        const addressRaw = String(getCol(row, ['address', 'street address', 'street', 'location'])).trim();
        const landmarkRaw = String(getCol(row, ['landmark', 'near'])).trim();
        let pincodeRaw = String(getCol(row, ['pincode', 'pin code', 'postal code', 'pin'])).trim();

        const widthNum = parseFloat(String(getCol(row, ['width (ft)', 'width', 'w']))) || 40;
        const heightNum = parseFloat(String(getCol(row, ['height (ft)', 'height', 'h']))) || 20;
        const totalSqFt = Math.round(widthNum * heightNum);

        const illuminationRaw = String(getCol(row, ['illumination', 'lighting', 'light'])).trim() || 'Front-lit';
        const rateNum = parseFloat(String(getCol(row, ['rate per month', 'rate', 'price', 'monthly rate', 'cost']))) || 150000;
        const statusRaw = String(getCol(row, ['status', 'availability'])).trim() || 'Available';
        const vendorRaw = String(getCol(row, ['vendor name', 'vendor', 'owning vendor'])).trim() || 'Interspace Media In-house';
        const vendorContactRaw = String(getCol(row, ['vendor contact', 'contact', 'phone'])).trim();
        const clientCategoryRaw = String(getCol(row, ['client industry category', 'client category', 'industry', 'category client'])).trim();
        const brandRaw = String(getCol(row, ['current brand', 'brand', 'client', 'advertiser'])).trim();
        const trafficPeakRaw = String(getCol(row, ['traffic peak', 'traffic', 'peak traffic'])).trim() || 'Morning Traffic';
        const footfallRaw = String(getCol(row, ['traffic footfall', 'footfall', 'impressions'])).trim();
        const facingRaw = String(getCol(row, ['facing direction', 'facing', 'orientation'])).trim();
        const notesRaw = String(getCol(row, ['notes', 'remarks', 'description'])).trim();

        // 1. PINCODE DERIVATION if missing
        let pinDerived = false;
        if (!pincodeRaw || pincodeRaw.length < 6) {
          const derived = derivePostalCode(addressRaw, landmarkRaw, cityRaw, stateRaw);
          pincodeRaw = derived.pincode;
          pinDerived = true;
        }

        // 2. DYNAMIC UID GENERATION
        let uidRaw = String(getCol(row, ['uid', 'site uid', 'id'])).trim();
        let uidGenerated = false;

        if (!uidRaw) {
          uidRaw = generateHoardingUid({
            state: stateRaw,
            city: cityRaw,
            pincode: pincodeRaw,
            serialNo: idx + 1,
            illumination: illuminationRaw,
            width: widthNum,
            height: heightNum,
            trafficType: trafficPeakRaw,
          });
          uidGenerated = true;
        }

        // 3. GEO COORDINATES LOOKUP
        let lat = parseFloat(String(getCol(row, ['latitude', 'lat']))) || 0;
        let lng = parseFloat(String(getCol(row, ['longitude', 'lng', 'long']))) || 0;

        if (!lat || !lng) {
          const matchLoc = INDIA_LOCATIONS.find(
            (l) => l.city.toLowerCase() === cityRaw.toLowerCase()
          );
          if (matchLoc) {
            lat = matchLoc.lat;
            lng = matchLoc.lng;
          } else {
            lat = 19.076;
            lng = 72.8777;
          }
        }

        // Calculate aspect ratio
        const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
        const divisor = gcd(Math.round(widthNum), Math.round(heightNum));
        const ratio = divisor > 0 ? `${Math.round(widthNum) / divisor}:${Math.round(heightNum) / divisor}` : '2:1';

        let validStatus: SiteStatus = 'Available';
        if (statusRaw.toLowerCase().includes('book')) validStatus = 'Booked';
        else if (statusRaw.toLowerCase().includes('maint')) validStatus = 'Maintenance';

        let validIllum: IlluminationType = 'Front-lit';
        if (illuminationRaw.toLowerCase().includes('back')) validIllum = 'Back-lit';
        else if (illuminationRaw.toLowerCase().includes('non')) validIllum = 'Non-lit';
        else if (illuminationRaw.toLowerCase().includes('digital') || illuminationRaw.toLowerCase().includes('led')) validIllum = 'Digital LED';

        let rowStatus: 'valid' | 'warning' | 'error' = 'valid';
        let validationMsg = 'Ready to ingest';

        if (!siteName) {
          rowStatus = 'error';
          validationMsg = 'Missing mandatory Site Name';
        }

        const assembledSite: OOHSite = {
          uid: uidRaw,
          site_name: siteName || `OOH Hoarding ${uidRaw}`,
          category: (categoryRaw as OOHCategory) || 'Billboards',
          location: {
            address: addressRaw || `${cityRaw} Main Arterial Road`,
            city: cityRaw,
            district: districtRaw || cityRaw,
            state: stateRaw,
            pincode: pincodeRaw,
            latitude: lat,
            longitude: lng,
            landmark: landmarkRaw,
            google_maps_url: `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
          },
          dimensions: {
            width: widthNum,
            height: heightNum,
            unit: 'ft',
            total_sq_ft: totalSqFt,
            aspect_ratio: ratio,
          },
          illumination: validIllum,
          status: validStatus,
          rate_per_month: rateNum,
          photographs: [
            {
              id: 'photo-default-1',
              url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
              caption: 'Day Shot - Commercial Arterial View',
              angle: 'Day Shot',
              timestamp: new Date().toISOString(),
              is_primary: true,
            },
          ],
          traffic_peak: trafficPeakRaw,
          traffic_footfall: footfallRaw || '150,000+ daily impressions',
          facing_direction: facingRaw || 'Bi-directional Highway Flow',
          vendor_name: vendorRaw,
          vendor_contact: vendorContactRaw,
          client_category: clientCategoryRaw || 'Corporate',
          client_current_brand: brandRaw || 'Open for Booking',
          notes: notesRaw,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        parsed.push({
          rowNum: idx + 2,
          site: assembledSite,
          uidGenerated,
          pinDerived,
          status: rowStatus,
          validationMessage: validationMsg,
        });
      });

      // Auto-consolidate duplicate UID rows within the uploaded spreadsheet
      const validParsedSites = parsed
        .filter((p) => p.status !== 'error')
        .map((p) => p.site as OOHSite);

      const consolidatedSites = consolidateSitesByUid(validParsedSites);

      const consolidatedParsed: ParsedUploadRow[] = consolidatedSites.map((site, index) => {
        const originalRows = parsed.filter(
          (p) => String(p.site.uid).trim().toUpperCase() === site.uid
        );
        const hasDerivedPin = originalRows.some((r) => r.pinDerived);
        const hasGenUid = originalRows.some((r) => r.uidGenerated);
        const isMerged = originalRows.length > 1;

        return {
          rowNum: index + 1,
          site,
          uidGenerated: hasGenUid,
          pinDerived: hasDerivedPin,
          status: 'valid',
          validationMessage: isMerged
            ? `Consolidated from ${originalRows.length} rows with ${site.campaign_history?.length || 1} grouped campaigns`
            : 'Ready to ingest',
        };
      });

      // Keep any error rows so user can review validation issues
      const errorRows = parsed.filter((p) => p.status === 'error');
      const finalParsed = [...consolidatedParsed, ...errorRows];

      setParsedRows(finalParsed);
      onShowToast(
        'Spreadsheet Parsed & Consolidated',
        `Successfully loaded ${finalParsed.length} unique hoarding records from ${file.name}${
          parsed.length > finalParsed.length
            ? ` (${parsed.length - finalParsed.length} duplicate UID rows grouped under single records)`
            : ''
        }. Review below.`,
        'success'
      );
    } catch (err: any) {
      console.error('File parsing error:', err);
      onShowToast('Parsing Error', err.message || 'Failed to read spreadsheet file.', 'error');
    } finally {
      setIsProcessingFile(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processUploadedFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processUploadedFile(e.dataTransfer.files[0]);
    }
  };

  // --- SAVE ALL PARSED SITES TO DATABASE ---
  const handleSaveParsedBatch = async () => {
    const validRows = parsedRows.filter((r) => r.status !== 'error');
    if (validRows.length === 0) {
      onShowToast('No Valid Rows', 'Please fix errors before saving.', 'error');
      return;
    }

    setIsSavingBatch(true);
    setBatchSaveProgress({ current: 0, total: validRows.length });

    try {
      let savedCount = 0;
      for (let i = 0; i < validRows.length; i++) {
        const item = validRows[i];
        await storageService.saveSite(item.site as OOHSite);
        savedCount++;
        setBatchSaveProgress({ current: savedCount, total: validRows.length });
      }

      await onRefresh();
      onShowToast(
        'Batch Ingestion Complete',
        `Successfully saved ${savedCount} hoarding records to master database.`,
        'success'
      );

      setParsedRows([]);
      setUploadedFileName(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err: any) {
      console.error('Batch save error:', err);
      onShowToast('Batch Save Failed', err.message || 'Error writing to database.', 'error');
    } finally {
      setIsSavingBatch(false);
      setBatchSaveProgress(null);
    }
  };

  // --- ADD VENDOR HANDLER ---
  const handleAddVendor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVendorName.trim()) {
      onShowToast('Missing Name', 'Please enter a vendor company name.', 'error');
      return;
    }

    try {
      await storageService.addVendor({
        name: newVendorName.trim(),
        contact_person: newVendorContact.trim(),
        phone: newVendorPhone.trim(),
        email: newVendorEmail.trim(),
      });
      await loadFullVendors();
      await onRefresh();
      setNewVendorName('');
      setNewVendorContact('');
      setNewVendorPhone('');
      setNewVendorEmail('');
      onShowToast('Vendor Saved', `"${newVendorName.trim()}" added to master vendor directory.`, 'success');
    } catch (err: any) {
      onShowToast('Vendor Save Error', err.message, 'error');
    }
  };

  // --- ADD CATEGORY HANDLER ---
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) {
      onShowToast('Missing Category', 'Please enter an industry category name.', 'error');
      return;
    }

    try {
      await storageService.addClientCategory(newCategoryName.trim());
      await onRefresh();
      setNewCategoryName('');
      onShowToast('Category Saved', `"${newCategoryName.trim()}" added to client category master.`, 'success');
    } catch (err: any) {
      onShowToast('Category Save Error', err.message, 'error');
    }
  };

  // --- VAULT SITES (Consolidated by UID to ensure 1 unified row per hoarding) ---
  const consolidatedVaultSites = React.useMemo(() => {
    return consolidateSitesByUid(sites);
  }, [sites]);

  const vaultFilteredSites = consolidatedVaultSites.filter((site) => {
    if (vaultSearch.trim()) {
      const q = vaultSearch.toLowerCase().trim();
      const matchUid = site.uid.toLowerCase().includes(q);
      const matchName = site.site_name.toLowerCase().includes(q);
      const matchCity = site.location.city.toLowerCase().includes(q);
      const matchVendor = (site.vendor_name || '').toLowerCase().includes(q);
      const matchCat = (site.client_category || '').toLowerCase().includes(q);
      const matchBrand = (site.client_current_brand || '').toLowerCase().includes(q);
      const matchCampaigns = site.campaign_history?.some(
        (c) =>
          c.client_name.toLowerCase().includes(q) ||
          c.client_category.toLowerCase().includes(q) ||
          (c.campaign_name && c.campaign_name.toLowerCase().includes(q))
      );
      if (!matchUid && !matchName && !matchCity && !matchVendor && !matchCat && !matchBrand && !matchCampaigns) {
        return false;
      }
    }
    if (vaultFilterStatus !== 'All' && site.status !== vaultFilterStatus) return false;
    if (vaultFilterCity !== 'All' && site.location.city !== vaultFilterCity) return false;
    return true;
  });

  const uniqueCities = Array.from(new Set(consolidatedVaultSites.map((s) => s.location.city))).sort();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Studio Banner & Navigation */}
      <div className="bg-gradient-to-r from-[#AF1763] via-[#9E1459] to-[#191C24] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-[#AF1763]/40">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#0DCAF0]/15 via-[#0D6EFD]/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-rose-200 border border-white/10 mb-3">
              <RefreshCw className="w-3.5 h-3.5 text-[#0DCAF0]" />
              <span>Master Data & Sourcing Studio</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              <span className="bg-gradient-to-r from-[#0DCAF0] to-[#AF1763] bg-clip-text text-transparent">SiteSync</span> Studio
            </h1>
            <p className="mt-1 text-sm text-slate-300 max-w-2xl">
              Centralized operations workspace for onboarding hoardings, batch uploading Excel inventory sheets, maintaining vendor contacts, and managing advertiser categories.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onAddSite}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-[#0DCAF0] via-[#C2185B] to-[#AF1763] hover:from-[#0D6EFD] hover:to-[#8F1250] text-white transition-all shadow-lg shadow-orange-500/20 flex items-center gap-2"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Register Single Site</span>
            </button>

            <button
              onClick={handleDownloadTemplate}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white transition-all border border-white/20 flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Get Excel Template</span>
            </button>
          </div>
        </div>

        {/* Studio Sub-Navigation Tabs */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('bulk-upload')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'bulk-upload'
                ? 'bg-gradient-to-r from-[#0DCAF0] to-[#AF1763] text-white shadow-md shadow-orange-500/20'
                : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800 border border-slate-700/60'
            }`}
          >
            <UploadCloud className="w-4 h-4" />
            <span>Bulk Spreadsheet Ingestion</span>
          </button>

          <button
            onClick={() => setActiveTab('single-add')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'single-add'
                ? 'bg-gradient-to-r from-[#0DCAF0] to-[#AF1763] text-white shadow-md shadow-orange-500/20'
                : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800 border border-slate-700/60'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>Single Site Onboarding</span>
          </button>

          <button
            onClick={() => setActiveTab('inventory-vault')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'inventory-vault'
                ? 'bg-gradient-to-r from-[#0DCAF0] to-[#AF1763] text-white shadow-md shadow-orange-500/20'
                : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800 border border-slate-700/60'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Master Inventory Vault ({sites.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('vendors')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'vendors'
                ? 'bg-gradient-to-r from-[#0DCAF0] to-[#AF1763] text-white shadow-md shadow-orange-500/20'
                : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800 border border-slate-700/60'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Media Vendors ({storedVendors.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'categories'
                ? 'bg-gradient-to-r from-[#0DCAF0] to-[#AF1763] text-white shadow-md shadow-orange-500/20'
                : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800 border border-slate-700/60'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Client Verticals ({storedCategories.length})</span>
          </button>
        </div>
      </div>

      {/* TAB 1: BULK SPREADSHEET UPLOAD */}
      {activeTab === 'bulk-upload' && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-white dark:bg-[#191C24] rounded-3xl p-6 sm:p-8 border border-rose-100/70 dark:border-[#2C2E33] shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <UploadCloud className="w-5 h-5 text-[#0DCAF0]" />
                  <span>Upload OOH Inventory Spreadsheet (.xlsx / .csv)</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Drag and drop your outdoor media sheet. Missing UIDs and Postal Pincodes are auto-generated and derived automatically.
                </p>
              </div>

              <button
                onClick={handleDownloadTemplate}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-rose-50/70 dark:bg-rose-950/40 text-[#AF1763] dark:text-rose-300 border border-rose-200/80 dark:border-[#AF1763]/40 hover:bg-rose-100/70 flex items-center gap-2 shrink-0 transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Download Sample Excel</span>
              </button>
            </div>

            {/* Drop Zone Area */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-[#0DCAF0] bg-orange-50/50 dark:bg-orange-950/20 scale-[1.01]'
                  : 'border-slate-200 dark:border-[#2C2E33] hover:border-[#0DCAF0]/60 hover:bg-slate-50/60 dark:hover:bg-slate-800/40'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileInputChange}
                className="hidden"
              />

              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#0DCAF0]/10 to-[#AF1763]/10 text-[#0DCAF0] flex items-center justify-center mx-auto mb-4 shadow-inner border border-rose-100 dark:border-rose-950/50">
                {isProcessingFile ? (
                  <RefreshCw className="w-8 h-8 animate-spin text-[#AF1763]" />
                ) : (
                  <FileSpreadsheet className="w-8 h-8" />
                )}
              </div>

              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                {uploadedFileName ? `Loaded: ${uploadedFileName}` : 'Choose or Drag Spreadsheet Here'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
                Supports Microsoft Excel (.xlsx, .xls) and Comma-Separated Values (.csv).
              </p>

              <div className="mt-4 flex items-center justify-center gap-2">
                <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-rose-50 dark:bg-rose-950/50 text-[#AF1763] dark:text-rose-300 border border-rose-200/50 dark:border-rose-900/30">
                  Auto 7-Segment UID Generator
                </span>
                <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-amber-50 dark:bg-amber-950/50 text-[#0DCAF0] dark:text-amber-300 border border-amber-200/50 dark:border-amber-900/30">
                  Landmark PIN Derivation
                </span>
              </div>
            </div>
          </div>

          {/* Parsed Rows Preview Table */}
          {parsedRows.length > 0 && (
            <div className="bg-white dark:bg-[#191C24] rounded-3xl p-6 sm:p-8 border border-rose-100/70 dark:border-[#2C2E33] shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#AF1763]" />
                    <span>Parsed Ingestion Staging ({parsedRows.length} Hoardings Detected)</span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Verify mapped fields below. Click "Save All to Database" to commit into the master store.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setParsedRows([]);
                      setUploadedFileName(null);
                    }}
                    className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Clear Staging
                  </button>

                  <button
                    onClick={handleSaveParsedBatch}
                    disabled={isSavingBatch}
                    className="px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-[#0DCAF0] via-[#C2185B] to-[#AF1763] hover:from-[#0D6EFD] hover:to-[#8F1250] text-white shadow-md shadow-orange-500/25 flex items-center gap-2 disabled:opacity-50"
                  >
                    {isSavingBatch ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Saving ({batchSaveProgress?.current}/{batchSaveProgress?.total})...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Save All {parsedRows.length} Sites to Database</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Staging Data Table */}
              <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-[#2C2E33]">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50/80 dark:bg-slate-800/70 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-[#2C2E33]">
                    <tr>
                      <th className="p-3">#</th>
                      <th className="p-3">Generated / Mapped UID</th>
                      <th className="p-3">Site Name</th>
                      <th className="p-3">City & State</th>
                      <th className="p-3">Pincode</th>
                      <th className="p-3">Size (W x H)</th>
                      <th className="p-3">Vendor</th>
                      <th className="p-3">Client Category</th>
                      <th className="p-3">Monthly Rate</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {parsedRows.map((item) => (
                      <tr
                        key={item.rowNum}
                        className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors"
                      >
                        <td className="p-3 font-mono text-slate-400">{item.rowNum}</td>
                        <td className="p-3 font-mono font-bold text-[#AF1763] dark:text-rose-400">
                          {item.site.uid}
                          {item.uidGenerated && (
                            <span className="ml-1.5 px-1.5 py-0.5 rounded text-[10px] bg-rose-50 dark:bg-rose-950/60 text-[#AF1763] dark:text-rose-300">
                              Auto-UID
                            </span>
                          )}
                        </td>
                        <td className="p-3 font-medium text-slate-900 dark:text-white max-w-xs truncate">
                          {item.site.site_name}
                        </td>
                        <td className="p-3 text-slate-600 dark:text-slate-300">
                          {item.site.location?.city}, {item.site.location?.state}
                        </td>
                        <td className="p-3 font-mono text-slate-700 dark:text-slate-300">
                          {item.site.location?.pincode}
                          {item.pinDerived && (
                            <span className="ml-1 px-1 py-0.2 rounded text-[9px] bg-amber-50 dark:bg-amber-950 text-[#0DCAF0] dark:text-amber-300 border border-amber-200/50">
                              Derived
                            </span>
                          )}
                        </td>
                        <td className="p-3 font-medium">
                          {item.site.dimensions?.width}x{item.site.dimensions?.height} ft{' '}
                          <span className="text-[10px] text-slate-400">({item.site.dimensions?.total_sq_ft} sq.ft)</span>
                        </td>
                        <td className="p-3 text-slate-600 dark:text-slate-300">
                          {item.site.vendor_name || '—'}
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-50 dark:bg-rose-950/60 text-[#AF1763] dark:text-rose-300 border border-rose-200/50">
                            {item.site.client_category || 'General'}
                          </span>
                        </td>
                        <td className="p-3 font-bold text-slate-900 dark:text-white">
                          ₹{(item.site.rate_per_month || 0).toLocaleString()}
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              item.site.status === 'Available'
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300'
                                : item.site.status === 'Booked'
                                ? 'bg-rose-100 text-[#AF1763] dark:bg-rose-950/70 dark:text-rose-300'
                                : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                            }`}
                          >
                            {item.site.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SINGLE SITE ONBOARDING */}
      {activeTab === 'single-add' && (
        <div className="bg-white dark:bg-[#191C24] rounded-3xl p-6 sm:p-8 border border-rose-100/70 dark:border-[#2C2E33] shadow-sm space-y-6 animate-fade-in">
          <div className="max-w-2xl">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-[#0DCAF0]" />
              <span>Single OOH Site Registration Wizard</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Register a new outdoor advertising hoarding into the database. Features automated 7-segment UID nomenclature, Landmark-based postal PIN extraction, and real-time aspect ratio calculation.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-tr from-rose-50/50 via-orange-50/40 to-slate-50 dark:from-slate-800/80 dark:via-rose-950/20 dark:to-slate-900 border border-rose-100/80 dark:border-[#2C2E33] flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#AF1763]" />
                <span>Launch 4-Step Registration Modal</span>
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 max-w-lg">
                Includes Step 1: Basic Details & Media Category, Step 2: Location & Auto PIN Derivation, Step 3: Technical Specs & Aspect Ratio, Step 4: Photo Gallery & Rate Card.
              </p>
            </div>

            <button
              onClick={onAddSite}
              className="px-6 py-3 rounded-xl text-xs font-bold bg-gradient-to-r from-[#0DCAF0] via-[#C2185B] to-[#AF1763] hover:from-[#0D6EFD] hover:to-[#8F1250] text-white shadow-lg shadow-orange-500/25 flex items-center gap-2 shrink-0 transition-all"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Open Site Registration Form</span>
            </button>
          </div>

          {/* Quick List of Recently Registered Sites */}
          <div className="pt-4 border-t border-slate-100 dark:border-[#2C2E33]">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Recently Added Sites in Database
            </h4>
            <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-[#2C2E33] rounded-xl overflow-hidden">
              {sites.slice(0, 5).map((site) => (
                <div
                  key={site.uid}
                  className="p-3.5 flex items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-[#AF1763] dark:text-rose-400">
                      {site.uid}
                    </span>
                    <span className="font-medium text-slate-900 dark:text-white">
                      {site.site_name}
                    </span>
                    <span className="text-slate-500">
                      • {site.location.city}, {site.location.state}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onViewSite(site)}
                      title="Inspect site details"
                      className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onEditSite(site)}
                      title="Edit site"
                      className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onCloneSite(site)}
                      title="Clone site specifications"
                      className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: MASTER INVENTORY VAULT */}
      {activeTab === 'inventory-vault' && (
        <div className="bg-white dark:bg-[#191C24] rounded-3xl p-6 sm:p-8 border border-rose-100/70 dark:border-[#2C2E33] shadow-sm space-y-4 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Database className="w-5 h-5 text-[#0DCAF0]" />
                <span>Master Inventory Database ({consolidatedVaultSites.length} Unique Sites)</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Manage, edit, duplicate, or delete hoardings stored in the persistent database.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onOpenAddCampaign && onOpenAddCampaign()}
                className="px-3.5 py-2 rounded-xl text-xs font-bold border border-rose-200 dark:border-[#AF1763]/40 bg-rose-50/80 dark:bg-rose-950/40 hover:bg-rose-100/80 dark:hover:bg-rose-900/50 text-[#AF1763] dark:text-rose-300 flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                title="Log a new brand campaign under an existing site UID"
              >
                <Megaphone className="w-4 h-4 stroke-[2.2]" />
                <span>Add Campaign</span>
              </button>

              <button
                onClick={onAddSite}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-[#0DCAF0] via-[#C2185B] to-[#AF1763] hover:from-[#0D6EFD] hover:to-[#8F1250] text-white flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Add Site</span>
              </button>
            </div>
          </div>

          {/* Quick Filters inside Vault */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by UID, site name, city, vendor or client category..."
                value={vaultSearch}
                onChange={(e) => setVaultSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-[#2C2E33] bg-slate-50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-[#AF1763] focus:outline-none"
              />
            </div>

            <select
              value={vaultFilterCity}
              onChange={(e) => setVaultFilterCity(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-[#2C2E33] bg-slate-50 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-200"
            >
              <option value="All">All Cities ({uniqueCities.length})</option>
              {uniqueCities.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <select
              value={vaultFilterStatus}
              onChange={(e) => setVaultFilterStatus(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-[#2C2E33] bg-slate-50 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-200"
            >
              <option value="All">All Statuses</option>
              <option value="Available">Available</option>
              <option value="Booked">Booked</option>
              <option value="Maintenance">Maintenance</option>
            </select>
          </div>

          {/* Master Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-[#2C2E33] mt-4">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 dark:bg-slate-800/70 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-[#2C2E33]">
                <tr>
                  <th className="p-3">UID</th>
                  <th className="p-3">Site Name & Location</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Dimensions</th>
                  <th className="p-3">Vendor</th>
                  <th className="p-3">Client Category</th>
                  <th className="p-3">Rate / Month</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {vaultFilteredSites.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="p-8 text-center text-slate-400">
                      No sites match your vault search.
                    </td>
                  </tr>
                ) : (
                  vaultFilteredSites.map((site) => (
                    <tr
                      key={site.uid}
                      className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="p-3 font-mono font-bold text-[#AF1763] dark:text-rose-400">
                        <div>{site.uid}</div>
                        {site.campaign_history && site.campaign_history.length > 0 && (
                          <span className="inline-flex items-center gap-1 mt-1 text-[9px] font-sans font-bold px-1.5 py-0.5 rounded bg-rose-50 dark:bg-rose-950/60 text-[#AF1763] dark:text-rose-300 border border-rose-200/50">
                            {site.campaign_history.length} Campaign{site.campaign_history.length !== 1 ? 's' : ''}
                          </span>
                        )}
                      </td>
                      <td className="p-3">
                        <div className="font-semibold text-slate-900 dark:text-white">
                          {site.site_name}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {site.location.address}, {site.location.city} ({site.location.pincode})
                        </div>
                      </td>
                      <td className="p-3 text-slate-600 dark:text-slate-300">
                        {site.category}
                      </td>
                      <td className="p-3">
                        <span className="font-medium">{site.dimensions.width}x{site.dimensions.height} ft</span>
                        <span className="text-[10px] text-slate-400 block">{site.dimensions.total_sq_ft} sq.ft</span>
                      </td>
                      <td className="p-3 text-slate-700 dark:text-slate-300">
                        {site.vendor_name || '—'}
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-50 dark:bg-rose-950/60 text-[#AF1763] dark:text-rose-300 border border-rose-200/50">
                          {site.client_category || 'General'}
                        </span>
                      </td>
                      <td className="p-3 font-bold text-slate-900 dark:text-white">
                        ₹{site.rate_per_month.toLocaleString()}
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            site.status === 'Available'
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300'
                              : site.status === 'Booked'
                              ? 'bg-rose-100 text-[#AF1763] dark:bg-rose-950/70 dark:text-rose-300'
                              : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                          }`}
                        >
                          {site.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {onOpenAddCampaign && (
                            <button
                              onClick={() => onOpenAddCampaign(site.uid)}
                              title="Log new campaign under this UID"
                              className="p-1.5 rounded-lg text-[#AF1763] hover:bg-rose-50 dark:hover:bg-rose-950/50"
                            >
                              <Megaphone className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            onClick={() => onViewSite(site)}
                            title="Inspect site details"
                            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onEditSite(site)}
                            title="Edit site"
                            className="p-1.5 rounded-lg text-[#AF1763] hover:bg-rose-50 dark:hover:bg-rose-950/50"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onCloneSite(site)}
                            title="Clone site specifications"
                            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteSite(site.uid)}
                            title="Delete site from vault"
                            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: MEDIA VENDOR DIRECTORY */}
      {activeTab === 'vendors' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
          {/* Add Vendor Form */}
          <div className="bg-white dark:bg-[#191C24] rounded-3xl p-6 border border-rose-100/70 dark:border-[#2C2E33] shadow-sm h-fit">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-2">
              <Plus className="w-4 h-4 text-[#0DCAF0]" />
              <span>Register New Media Vendor</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Add vendor companies owning hoarding sites. Once registered, they appear in dropdowns across the application.
            </p>

            <form onSubmit={handleAddVendor} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Vendor / Agency Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pioneer Publicity Corp."
                  value={newVendorName}
                  onChange={(e) => setNewVendorName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-[#2C2E33] bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#AF1763] focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Contact Person
                </label>
                <input
                  type="text"
                  placeholder="e.g. Regional Manager / Key Accounts"
                  value={newVendorContact}
                  onChange={(e) => setNewVendorContact(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-[#2C2E33] bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#AF1763] focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Phone / Mobile
                </label>
                <input
                  type="text"
                  placeholder="e.g. +91 98200 12345"
                  value={newVendorPhone}
                  onChange={(e) => setNewVendorPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-[#2C2E33] bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#AF1763] focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="e.g. sales@vendor.com"
                  value={newVendorEmail}
                  onChange={(e) => setNewVendorEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-[#2C2E33] bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#AF1763] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-2.5 rounded-xl font-bold bg-gradient-to-r from-[#0DCAF0] via-[#C2185B] to-[#AF1763] hover:from-[#0D6EFD] hover:to-[#8F1250] text-white shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Building2 className="w-4 h-4" />
                <span>Save Vendor to Registry</span>
              </button>
            </form>
          </div>

          {/* Vendor Directory Listing */}
          <div className="lg:col-span-2 bg-white dark:bg-[#191C24] rounded-3xl p-6 border border-rose-100/70 dark:border-[#2C2E33] shadow-sm space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#0DCAF0]" />
                <span>Media Vendors Directory ({vendorList.length || storedVendors.length} Registered)</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Vendors currently registered across the outdoor network
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {(vendorList.length > 0
                ? vendorList
                : storedVendors.map((v, i): SiteVendor => ({ id: `v-${i}`, name: v }))
              ).map((vendor) => {
                const ownedSitesCount = sites.filter((s) => s.vendor_name === vendor.name).length;
                return (
                  <div
                    key={vendor.id || vendor.name}
                    className="p-4 rounded-2xl bg-slate-50/70 dark:bg-[#0F1117] border border-slate-200/80 dark:border-[#2C2E33]/80 hover:border-rose-300 dark:hover:border-[#AF1763]/60 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                          {vendor.name}
                        </h4>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-[#AF1763] dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200/50">
                          {ownedSitesCount} site{ownedSitesCount !== 1 ? 's' : ''}
                        </span>
                      </div>
                      {vendor.contact_person && (
                        <p className="text-[11px] text-slate-500 mt-1">
                          Contact: {vendor.contact_person}
                        </p>
                      )}
                      {vendor.phone && (
                        <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                          📞 {vendor.phone}
                        </p>
                      )}
                      {vendor.email && (
                        <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                          ✉️ {vendor.email}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: CLIENT INDUSTRY CATEGORIES MASTER */}
      {activeTab === 'categories' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
          {/* Add Category Form */}
          <div className="bg-white dark:bg-[#191C24] rounded-3xl p-6 border border-rose-100/70 dark:border-[#2C2E33] shadow-sm h-fit">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-2">
              <Plus className="w-4 h-4 text-[#0DCAF0]" />
              <span>Add Client Industry Category</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Configure industry sectors (e.g., Electronics, Wires, Banking, NBFC, Bulbs, Jewellery) to track which client industries occupy which sites.
            </p>

            <form onSubmit={handleAddCategory} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Electric Vehicles (EV)"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-[#2C2E33] bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#AF1763] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-2.5 rounded-xl font-bold bg-gradient-to-r from-[#0DCAF0] via-[#C2185B] to-[#AF1763] hover:from-[#0D6EFD] hover:to-[#8F1250] text-white shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Tag className="w-4 h-4" />
                <span>Add Category</span>
              </button>
            </form>
          </div>

          {/* Categories Listing Chips */}
          <div className="lg:col-span-2 bg-white dark:bg-[#191C24] rounded-3xl p-6 border border-rose-100/70 dark:border-[#2C2E33] shadow-sm space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Tag className="w-5 h-5 text-[#AF1763]" />
                <span>Configured Client Verticals ({storedCategories.length})</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Categories available in site registration and media planning filters
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {storedCategories.map((cat) => {
                const count = sites.filter((s) => s.client_category === cat).length;
                return (
                  <div
                    key={cat}
                    className="px-3.5 py-2 rounded-xl bg-slate-50/70 dark:bg-[#0F1117] border border-slate-200 dark:border-[#2C2E33]/80 flex items-center gap-2 text-xs"
                  >
                    <span className="font-bold text-slate-800 dark:text-slate-200">{cat}</span>
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold bg-rose-50 text-[#AF1763] dark:bg-rose-950 dark:text-rose-300 border border-rose-200/50">
                      {count} sites
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
