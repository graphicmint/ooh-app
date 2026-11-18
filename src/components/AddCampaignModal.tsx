import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Megaphone,
  Search,
  Building2,
  Calendar,
  Upload,
  Plus,
  Trash2,
  Check,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Image as ImageIcon,
  Layers,
  Tag,
  IndianRupee,
  History,
} from 'lucide-react';
import { OOHSite, OOHPhotograph, PhotoAngle, SiteCampaignRecord } from '../types/ooh';
import { storageService } from '../services/storage';
import { consolidateSitesByUid } from '../utils/consolidateSites';

interface AddCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  sites: OOHSite[];
  initialUid?: string;
  clientCategories: string[];
  onAddNewCategory?: (category: string) => void;
  onCampaignAdded: (updatedSite: OOHSite) => void;
  onShowToast: (title: string, message?: string, type?: 'success' | 'info' | 'error') => void;
}

const PHOTO_ANGLES: PhotoAngle[] = [
  'Day Shot',
  'Night Shot',
  'Long-angle View',
  'Close-up View',
  'Traffic Flow',
  'Drone View',
];

const BUNDLED_CAMPAIGN_ASSETS = [
  {
    name: 'Tata Copper Plus Marathon Banner',
    url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
    angle: 'Day Shot',
  },
  {
    name: 'Tata Copper Night Illumination',
    url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
    angle: 'Night Shot',
  },
  {
    name: 'Corridor Traffic Showcase View',
    url: 'https://images.unsplash.com/photo-1508873696983-2df5293cb395?auto=format&fit=crop&w=1200&q=80',
    angle: 'Traffic Flow',
  },
  {
    name: 'Metropolitan High Visibility Unipole',
    url: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1200&q=80',
    angle: 'Long-angle View',
  },
];

export const AddCampaignModal: React.FC<AddCampaignModalProps> = ({
  isOpen,
  onClose,
  sites,
  initialUid,
  clientCategories,
  onAddNewCategory,
  onCampaignAdded,
  onShowToast,
}) => {
  // Guarantee consolidated unique site portfolio
  const consolidatedSites = React.useMemo(() => {
    return consolidateSitesByUid(sites);
  }, [sites]);

  const [selectedUid, setSelectedUid] = useState<string>(initialUid || (consolidatedSites[0]?.uid ?? ''));
  const [siteSearch, setSiteSearch] = useState('');

  // Campaign Form State
  const [clientName, setClientName] = useState('');
  const [clientCategory, setClientCategory] = useState('');
  const [campaignName, setCampaignName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [rateBooked, setRateBooked] = useState<number | ''>('');
  const [notes, setNotes] = useState('');

  // Category inline add
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryInput, setNewCategoryInput] = useState('');

  // Photographs state
  const [photos, setPhotos] = useState<OOHPhotograph[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync initial UID if passed
  useEffect(() => {
    if (initialUid) {
      setSelectedUid(initialUid);
    } else if (!selectedUid && consolidatedSites.length > 0) {
      setSelectedUid(consolidatedSites[0].uid);
    }
  }, [initialUid, consolidatedSites]);

  // Selected Site object
  const selectedSite = consolidatedSites.find((s) => s.uid === selectedUid);

  // Auto-populate default category from site when site changes (if not yet chosen)
  useEffect(() => {
    if (selectedSite && !clientCategory) {
      if (selectedSite.client_category) {
        setClientCategory(selectedSite.client_category);
      } else if (clientCategories.length > 0) {
        setClientCategory(clientCategories[0]);
      }
    }
  }, [selectedSite]);

  if (!isOpen) return null;

  // Filtered sites for dropdown/search
  const filteredSitesForSelect = consolidatedSites.filter((s) => {
    if (!siteSearch.trim()) return true;
    const q = siteSearch.toLowerCase().trim();
    return (
      s.uid.toLowerCase().includes(q) ||
      s.site_name.toLowerCase().includes(q) ||
      s.location.city.toLowerCase().includes(q) ||
      (s.client_current_brand && s.client_current_brand.toLowerCase().includes(q))
    );
  });

  const handleAddNewCategory = () => {
    const trimmed = newCategoryInput.trim();
    if (!trimmed) return;
    if (onAddNewCategory) {
      onAddNewCategory(trimmed);
    }
    setClientCategory(trimmed);
    setNewCategoryInput('');
    setIsAddingCategory(false);
    onShowToast('Category Added', `"${trimmed}" is now available and selected.`, 'success');
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const url = e.target?.result as string;
        const newPhoto: OOHPhotograph = {
          id: 'photo-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
          url,
          caption: `${file.name.replace(/\.[^/.]+$/, '')} - Campaign Shot`,
          angle: 'Day Shot',
          timestamp: new Date().toISOString(),
          is_primary: photos.length === 0,
        };
        setPhotos((prev) => [...prev, newPhoto]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleAddBundledAsset = (asset: { name: string; url: string; angle: string }) => {
    const newPhoto: OOHPhotograph = {
      id: 'photo-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      url: asset.url,
      caption: `${asset.name} - ${clientName || 'Campaign Display'}`,
      angle: asset.angle as PhotoAngle,
      timestamp: new Date().toISOString(),
      is_primary: photos.length === 0,
    };
    setPhotos((prev) => [...prev, newPhoto]);
  };

  const handleRemovePhoto = (id: string) => {
    setPhotos((prev) => {
      const filtered = prev.filter((p) => p.id !== id);
      if (filtered.length > 0 && !filtered.some((p) => p.is_primary)) {
        filtered[0].is_primary = true;
      }
      return filtered;
    });
  };

  const handleSetPrimaryPhoto = (id: string) => {
    setPhotos((prev) =>
      prev.map((p) => ({
        ...p,
        is_primary: p.id === id,
      }))
    );
  };

  const handleUpdateCaption = (id: string, caption: string) => {
    setPhotos((prev) => prev.map((p) => (p.id === id ? { ...p, caption } : p)));
  };

  const handleUpdateAngle = (id: string, angle: PhotoAngle) => {
    setPhotos((prev) => prev.map((p) => (p.id === id ? { ...p, angle } : p)));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!selectedUid) {
      newErrors.uid = 'Please select an existing site UID from inventory.';
    }
    if (!clientName.trim()) {
      newErrors.clientName = 'Client / Advertiser brand name is required.';
    }
    if (!clientCategory.trim()) {
      newErrors.clientCategory = 'Please choose or add a client industry category.';
    }
    if (photos.length === 0) {
      newErrors.photos = 'Please upload at least 1 campaign photograph showing the active creative.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      onShowToast('Validation Incomplete', 'Please fill all required campaign fields.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const campaignPayload = {
        client_name: clientName.trim(),
        client_category: clientCategory.trim(),
        campaign_name: campaignName.trim() || undefined,
        start_date: startDate || undefined,
        end_date: endDate || undefined,
        photographs: photos,
        rate_booked: rateBooked !== '' ? Number(rateBooked) : undefined,
        notes: notes.trim() || undefined,
      };

      const result = await storageService.addCampaignToSite(selectedUid, campaignPayload);

      onShowToast(
        'Campaign Logged Successfully',
        `Appended new campaign "${clientName}" directly to site ${selectedUid}.`,
        'success'
      );

      onCampaignAdded(result.site);
      onClose();
    } catch (err: any) {
      console.error('Failed to log campaign:', err);
      onShowToast('Error Logging Campaign', err.message || 'Failed to save campaign record.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-slate-950/75 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-auto transition-all flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:px-6 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-[#E31B64] to-[#F37023] text-white flex items-center justify-center shadow-md shadow-[#E31B64]/20">
              <Megaphone className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Log New Brand Campaign</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-[#E31B64] dark:bg-rose-950/60 dark:text-rose-300">
                  Append to Site History
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Record advertiser changes, client categories, and fresh creatives under an existing UID without duplicating inventory.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-4 sm:p-6 space-y-5 flex-1">
          {/* STEP 1: SELECT EXISTING SITE BY UID */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#E31B64] dark:text-[#F37023]" />
                <label className="text-xs font-bold text-slate-900 dark:text-white">
                  1. Select Target Hoarding by Site UID <span className="text-rose-500">*</span>
                </label>
              </div>

              {/* Quick Search */}
              <div className="relative sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter UIDs, cities, names..."
                  value={siteSearch}
                  onChange={(e) => setSiteSearch(e.target.value)}
                  className="w-full pl-8 pr-2.5 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-[#E31B64]/30"
                />
              </div>
            </div>

            {/* Site UID Select Dropdown */}
            <div>
              <select
                value={selectedUid}
                onChange={(e) => setSelectedUid(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm font-mono font-bold text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-[#E31B64]/30 focus:border-[#E31B64] cursor-pointer"
              >
                {filteredSitesForSelect.map((site) => (
                  <option key={site.uid} value={site.uid}>
                    {site.uid} — {site.site_name} ({site.location.city}) [{(site.campaign_history || []).length} Campaign{site.campaign_history?.length !== 1 ? 's' : ''} | Current: {site.client_current_brand || 'Vacant'}]
                  </option>
                ))}
              </select>
              {errors.uid && <p className="text-xs text-rose-500 mt-1">{errors.uid}</p>}
            </div>

            {/* Selected Site Information Card */}
            {selectedSite && (
              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-rose-100 dark:border-rose-950/60 shadow-2xs space-y-2 animate-fade-in">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-700/60 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-xs text-[#E31B64] dark:text-[#F37023]">
                      {selectedSite.uid}
                    </span>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {selectedSite.site_name}
                    </span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                    {selectedSite.category} • {selectedSite.dimensions.width}'x{selectedSite.dimensions.height}' ({selectedSite.dimensions.total_sq_ft} sq.ft)
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-400 block">Location:</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300 truncate block">
                      {selectedSite.location.city}, {selectedSite.location.state}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Site Vendor:</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300 truncate block">
                      {selectedSite.vendor_name || 'Direct Concession'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Previous Brand:</span>
                    <span className="font-bold text-[#E31B64] dark:text-rose-300 truncate block">
                      {selectedSite.client_current_brand || 'No Previous Brand'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Logged Campaigns:</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                      <History className="w-3 h-3 text-[#F37023]" />
                      {(selectedSite.campaign_history?.length || 0)} Recorded
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* STEP 2: NEW CAMPAIGN & ADVERTISER DETAILS */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
              <Tag className="w-4 h-4 text-[#E31B64]" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                2. New Campaign & Client Details
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Client / Brand Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Client / Advertiser Brand <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="e.g. Tata Copper Plus, Samsung Galaxy, HDFC Bank"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-[#E31B64]/30 focus:border-[#E31B64]"
                />
                {errors.clientName && <p className="text-xs text-rose-500 mt-1">{errors.clientName}</p>}
              </div>

              {/* Client Industry Category */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Client Category <span className="text-rose-500">*</span>
                  </label>
                  {!isAddingCategory && (
                    <button
                      type="button"
                      onClick={() => setIsAddingCategory(true)}
                      className="text-[11px] font-semibold text-[#E31B64] dark:text-[#F37023] hover:underline flex items-center gap-0.5 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" /> Add Category
                    </button>
                  )}
                </div>

                {isAddingCategory ? (
                  <div className="flex items-center gap-1.5 animate-fade-in">
                    <input
                      type="text"
                      value={newCategoryInput}
                      onChange={(e) => setNewCategoryInput(e.target.value)}
                      placeholder="New category name..."
                      className="flex-1 px-3 py-2 text-xs rounded-xl border border-rose-300 dark:border-rose-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-[#E31B64]/30"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={handleAddNewCategory}
                      className="px-2.5 py-2 rounded-xl text-xs font-bold bg-[#E31B64] text-white hover:brightness-105"
                    >
                      <Check className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsAddingCategory(false)}
                      className="px-2 py-2 rounded-xl text-xs text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <select
                    value={clientCategory}
                    onChange={(e) => setClientCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-[#E31B64]/30 focus:border-[#E31B64] cursor-pointer"
                  >
                    <option value="">Select industry category...</option>
                    {clientCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                )}
                {errors.clientCategory && <p className="text-xs text-rose-500 mt-1">{errors.clientCategory}</p>}
              </div>

              {/* Campaign Name / Tagline */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Campaign Title / Theme <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  placeholder="e.g. Vizag Marathon 2026, Diwali Push"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-[#E31B64]/30"
                />
              </div>

              {/* Booked Commercial Rate */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Campaign Commercial Rate (₹/Month) <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">₹</span>
                  <input
                    type="number"
                    value={rateBooked}
                    onChange={(e) => setRateBooked(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder={selectedSite ? String(selectedSite.rate_per_month) : '150000'}
                    className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-[#E31B64]/30"
                  />
                </div>
              </div>

              {/* Campaign Dates */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Campaign Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Campaign End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Booking Remarks / Execution Notes
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Special creative rotation instructions, illumination timing, concession terms..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          {/* STEP 3: CAMPAIGN PHOTOGRAPHS UPLOAD */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[#F37023]" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  3. Campaign Photographs & Creative Display <span className="text-rose-500">*</span>
                </h4>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                {photos.length} photo{photos.length !== 1 ? 's' : ''} staged
              </span>
            </div>

            {/* Upload Drag & Drop Box */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-[#E31B64] bg-rose-50/50 dark:bg-rose-950/20'
                  : 'border-slate-300 dark:border-slate-700 hover:border-[#E31B64] bg-slate-50/50 dark:bg-slate-800/40'
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => handleFileSelect(e.target.files)}
                multiple
                accept="image/*"
                className="hidden"
              />
              <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-950/80 text-[#E31B64] dark:text-[#F37023] flex items-center justify-center mx-auto mb-2">
                <Upload className="w-5 h-5" />
              </div>
              <h5 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                Upload Campaign Photos (Day Shot, Night Illumination, Traffic Shot)
              </h5>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Drop creative photos here or click to browse files from your machine.
              </p>
            </div>

            {errors.photos && (
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 text-rose-600 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errors.photos}</span>
              </div>
            )}

            {/* Bundled Asset Quick Click */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">
                  Or Quick-Add Sample Campaign Visuals:
                </span>
                <span className="text-[10px] text-slate-400">Click to attach photo</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {BUNDLED_CAMPAIGN_ASSETS.map((asset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleAddBundledAsset(asset)}
                    className="flex items-center gap-2 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-[#E31B64] text-left transition-colors cursor-pointer"
                  >
                    <img
                      src={asset.url}
                      alt={asset.name}
                      className="w-8 h-8 rounded-lg object-cover shrink-0"
                    />
                    <div className="overflow-hidden">
                      <p className="text-[11px] font-semibold text-slate-800 dark:text-slate-200 truncate">
                        {asset.name}
                      </p>
                      <span className="text-[10px] text-[#E31B64] dark:text-[#F37023] block leading-none">
                        +{asset.angle}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Photos Preview Grid */}
            {photos.length > 0 && (
              <div className="space-y-2.5 pt-2">
                <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Staged Photographs ({photos.length})
                </h5>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {photos.map((photo) => (
                    <div
                      key={photo.id}
                      className={`relative flex gap-3 p-2.5 rounded-2xl border transition-all ${
                        photo.is_primary
                          ? 'border-[#E31B64] bg-rose-50/40 dark:bg-rose-950/20 ring-1 ring-[#E31B64]/30'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'
                      }`}
                    >
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200 dark:border-slate-700">
                        <img
                          src={photo.url}
                          alt={photo.caption}
                          className="w-full h-full object-cover"
                        />
                        {photo.is_primary && (
                          <span className="absolute top-1 left-1 px-1 rounded bg-[#E31B64] text-white text-[9px] font-bold">
                            Primary
                          </span>
                        )}
                      </div>

                      <div className="flex-1 space-y-1.5 overflow-hidden">
                        <input
                          type="text"
                          value={photo.caption}
                          onChange={(e) => handleUpdateCaption(photo.id, e.target.value)}
                          placeholder="Photo Caption..."
                          className="w-full px-2 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
                        />

                        <select
                          value={photo.angle}
                          onChange={(e) => handleUpdateAngle(photo.id, e.target.value as PhotoAngle)}
                          className="w-full px-2 py-1 text-[11px] rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300"
                        >
                          {PHOTO_ANGLES.map((angle) => (
                            <option key={angle} value={angle}>
                              {angle}
                            </option>
                          ))}
                        </select>

                        <div className="flex items-center justify-between pt-0.5">
                          {!photo.is_primary ? (
                            <button
                              type="button"
                              onClick={() => handleSetPrimaryPhoto(photo.id)}
                              className="text-[10px] text-slate-500 hover:text-[#E31B64] font-semibold"
                            >
                              Make Primary
                            </button>
                          ) : (
                            <span className="text-[10px] text-[#E31B64] font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Cover Visual
                            </span>
                          )}

                          <button
                            type="button"
                            onClick={() => handleRemovePhoto(photo.id)}
                            className="p-1 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg"
                            title="Remove Photo"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </form>

        {/* Modal Footer */}
        <div className="flex items-center justify-between p-4 sm:px-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 shrink-0">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Target UID: <strong className="font-mono text-slate-900 dark:text-white">{selectedUid}</strong>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleSubmit}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-[#E31B64] to-[#F37023] hover:brightness-105 active:scale-[0.99] text-white shadow-md shadow-[#E31B64]/25 flex items-center gap-1.5 disabled:opacity-50 cursor-pointer transition-all"
            >
              {isSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Logging Campaign...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  <span>Save Campaign to History</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
