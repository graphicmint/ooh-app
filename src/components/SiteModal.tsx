import React, { useState } from 'react';
import type { OOHSite, OOHPhotograph } from '../types/ooh';
import { formatINR, formatDate } from '../utils/formatters';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  MapPin,
  ExternalLink,
  Presentation,
  Edit2,
  Copy,
  Sparkles,
  Calendar,
  Share2,
  Car,
  Compass,
  Check,
  Building2,
  Briefcase,
  Megaphone,
  History,
  Tag,
} from 'lucide-react';

interface SiteModalProps {
  site: OOHSite | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (site: OOHSite) => void;
  onClone: (site: OOHSite) => void;
  onExportPpt: (site: OOHSite) => void;
  onAddCampaign?: (uid: string) => void;
  onShowToast: (title: string, message?: string, type?: 'success' | 'info' | 'error') => void;
}

export const SiteModal: React.FC<SiteModalProps> = ({
  site,
  isOpen,
  onClose,
  onEdit,
  onClone,
  onExportPpt,
  onAddCampaign,
  onShowToast,
}) => {
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [isCopied, setIsCopied] = useState(false);

  if (!isOpen || !site) return null;

  const photos = site.photographs.length > 0 ? site.photographs : [];
  const currentPhoto: OOHPhotograph | undefined = photos[activePhotoIndex] || photos[0];

  const handlePrevPhoto = () => {
    setActivePhotoIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const handleNextPhoto = () => {
    setActivePhotoIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  };

  const handleCopySpecs = () => {
    const text = `*OOH MEDIA SITE SPECIFICATION*
UID: ${site.uid}
Site: ${site.site_name}
Media Format: ${site.category}
Client Category: ${site.client_category || 'Open / Unassigned'}
Owning Vendor: ${site.vendor_name || 'Direct / Self'} ${site.vendor_contact ? `(${site.vendor_contact})` : ''}
Location: ${site.location.address}, ${site.location.city}, ${site.location.state}
Dimensions: ${site.dimensions.width}ft x ${site.dimensions.height}ft (${site.dimensions.total_sq_ft} sq ft)
Illumination: ${site.illumination}
Monthly Rate: ${formatINR(site.rate_per_month)}
Status: ${site.status}
Maps: ${site.location.google_maps_url || `https://maps.google.com/?q=${site.location.latitude},${site.location.longitude}`}`;

    navigator.clipboard.writeText(text);
    setIsCopied(true);
    onShowToast('Specifications Copied', 'Site briefing summary copied to clipboard.', 'success');
    setTimeout(() => setIsCopied(false), 2000);
  };

  const statusColors = {
    Available: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    Booked: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    Maintenance: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-slate-950/70 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-5xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-auto transition-all">
        {/* Top Sticky Header */}
        <div className="flex items-center justify-between p-4 sm:px-6 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-gradient-to-r from-[#E31B64] to-[#F37023] text-white shadow-sm">
              {site.uid}
            </span>
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                statusColors[site.status]
              }`}
            >
              ● {site.status}
            </span>
            <span className="hidden sm:inline text-xs font-medium text-slate-500 dark:text-slate-400">
              {site.category}
            </span>
            {site.client_category && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-rose-50 text-[#E31B64] dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200/50">
                <Briefcase className="w-3 h-3 text-[#E31B64]" />
                <span>{site.client_category}</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={handleCopySpecs}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Copy Briefing Specs"
            >
              {isCopied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            </button>
            <button
              onClick={() => onExportPpt(site)}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose-50 dark:bg-rose-950/60 text-[#E31B64] dark:text-rose-300 border border-rose-200 dark:border-rose-900/60 hover:bg-rose-100 flex items-center gap-1.5"
              title="Export PPT Slide"
            >
              <Presentation className="w-4 h-4" />
              <span className="hidden sm:inline">Export PPTX</span>
            </button>
            <button
              onClick={() => onEdit(site)}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 flex items-center gap-1.5"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Edit</span>
            </button>
            <button
              onClick={() => onClone(site)}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 hidden sm:flex items-center gap-1.5"
              title="Clone as new site"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Clone</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="max-h-[80vh] overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Main Title & Corridor */}
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {site.site_name}
            </h2>
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-1.5 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#E31B64]" />
                {site.location.address}, {site.location.city}
                {site.location.district ? ` (${site.location.district})` : ''}, {site.location.state}
                {site.location.tier ? ` [${site.location.tier}]` : ''}
              </span>
              {site.location.landmark && (
                <span>• Landmark: {site.location.landmark}</span>
              )}
            </div>
          </div>

          {/* Module: Interactive Photo Carousel */}
          <div className="space-y-3">
            <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-slate-950 flex items-center justify-center border border-slate-200 dark:border-slate-800 group shadow-lg">
              {currentPhoto ? (
                <img
                  src={currentPhoto.url}
                  alt={currentPhoto.caption || site.site_name}
                  className="w-full h-full object-cover select-none"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80';
                  }}
                />
              ) : (
                <div className="text-slate-500 text-sm">No photo available</div>
              )}

              {/* Photo Caption Overlay Bar */}
              {currentPhoto && (
                <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex items-center justify-between text-white">
                  <div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-[#E31B64] to-[#F37023] text-white mr-2">
                      {currentPhoto.angle || 'Standard View'}
                    </span>
                    <span className="text-sm font-medium">{currentPhoto.caption}</span>
                  </div>
                  <span className="text-xs text-slate-300 font-mono">
                    {activePhotoIndex + 1} of {photos.length}
                  </span>
                </div>
              )}

              {/* Navigation Arrows */}
              {photos.length > 1 && (
                <>
                  <button
                    onClick={handlePrevPhoto}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={handleNextPhoto}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Strip */}
            {photos.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {photos.map((photo, idx) => (
                  <button
                    key={photo.id || idx}
                    onClick={() => setActivePhotoIndex(idx)}
                    className={`relative w-20 sm:w-24 aspect-[16/10] rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                      activePhotoIndex === idx
                        ? 'border-[#E31B64] ring-2 ring-rose-500/30 shadow-md scale-105'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={photo.url}
                      alt={photo.caption}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-1 left-1 px-1 rounded bg-black/80 text-[8px] text-white font-mono">
                      {photo.angle?.split(' ')[0] || `P${idx + 1}`}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Grid: Technical Specs, Commercials & Vendor */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Column 1: Dimensions & Physical Specs */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-3">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Physical Specifications
              </span>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Dimensions:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {site.dimensions.width} ft × {site.dimensions.height} ft
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Aspect Ratio:</span>
                  <span className="font-bold text-[#F37023] font-mono">
                    {site.dimensions.aspect_ratio || '2:1'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Total Display Area:</span>
                  <span className="font-bold text-[#E31B64] dark:text-rose-400 flex items-center gap-1">
                    <Maximize2 className="w-3.5 h-3.5" />
                    {site.dimensions.total_sq_ft.toLocaleString()} Sq. Ft.
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Illumination:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    {site.illumination}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Structure Category:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {site.category}
                  </span>
                </div>
                {site.traffic_peak && (
                  <div className="flex justify-between items-center pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                    <span className="text-slate-500 dark:text-slate-400">Peak Traffic Dominance:</span>
                    <span className="font-bold text-[#F37023] flex items-center gap-1 font-mono">
                      {site.traffic_peak} [{site.traffic_peak.startsWith('Evening') ? 'E' : 'M'}]
                    </span>
                  </div>
                )}
                {site.location.pincode && (
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Postal Pincode:</span>
                    <span className="font-bold font-mono text-[#E31B64] dark:text-rose-400">
                      {site.location.pincode} (Last 4: {site.location.pincode.slice(-4)})
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Column 2: Commercials & Client Category */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-3">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Commercials & Category
              </span>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Monthly Investment:</span>
                  <span className="text-base font-extrabold text-slate-900 dark:text-white">
                    {formatINR(site.rate_per_month)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Client Category:</span>
                  <span className="font-bold text-violet-700 dark:text-violet-300">
                    {site.client_category || 'Open / Available'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Current Client:</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200 text-right">
                    {site.client_current_brand || 'None (Open for branding)'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Availability:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {site.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Column 3: Site Vendor & Audience */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-3">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Vendor & Audience
              </span>
              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-[#F37023]" /> Owning Media Vendor:
                  </span>
                  <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                    {site.vendor_name || 'Direct / Agency Owned'}
                  </p>
                  {site.vendor_contact && (
                    <p className="text-[11px] text-slate-500 mt-0.5">{site.vendor_contact}</p>
                  )}
                </div>

                <div>
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Car className="w-3.5 h-3.5 text-[#F37023]" /> Daily Footfall / Traffic:
                  </span>
                  <p className="font-medium text-slate-800 dark:text-slate-200 mt-0.5">
                    {site.traffic_footfall || 'High-volume urban artery'}
                  </p>
                </div>

                <div className="pt-1 flex flex-col gap-1 text-[11px] text-slate-500">
                  <span>GPS: {site.location.latitude.toFixed(4)}, {site.location.longitude.toFixed(4)}</span>
                  <a
                    href={
                      site.location.google_maps_url ||
                      `https://maps.google.com/?q=${site.location.latitude},${site.location.longitude}`
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[#E31B64] dark:text-rose-400 font-semibold hover:underline"
                  >
                    <span>View on Google Maps</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Notes / Special Highlights */}
          {site.notes && (
            <div className="p-4 rounded-2xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/60 text-xs">
              <span className="font-bold text-[#E31B64] dark:text-rose-300 block mb-1">
                Corridor & Site Notes:
              </span>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{site.notes}</p>
            </div>
          )}

          {/* Module: Multi-Brand Campaign Booking History */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 dark:border-slate-700 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-[#E31B64] to-[#F37023] text-white flex items-center justify-center shadow-xs">
                  <History className="w-4 h-4 stroke-[2.2]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>Campaign Booking History</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-100 text-[#E31B64] dark:bg-rose-950/70 dark:text-rose-300 font-bold">
                      {site.campaign_history?.length || 0} Logged
                    </span>
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Chronological record of advertisers, client categories, and campaign creative photographs for this site UID.
                  </p>
                </div>
              </div>

              {onAddCampaign && (
                <button
                  type="button"
                  onClick={() => onAddCampaign(site.uid)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold border border-rose-200 dark:border-rose-900/60 bg-white dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/50 text-[#E31B64] dark:text-rose-300 flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                >
                  <Megaphone className="w-3.5 h-3.5 stroke-[2.2]" />
                  <span>Log New Campaign</span>
                </button>
              )}
            </div>

            {site.campaign_history && site.campaign_history.length > 0 ? (
              <div className="space-y-3">
                {site.campaign_history.map((camp, idx) => (
                  <div
                    key={camp.id || idx}
                    className="p-3.5 rounded-xl bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-750 shadow-2xs space-y-2.5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900 dark:text-white">
                          {camp.client_name}
                        </span>
                        {camp.campaign_name && (
                          <span className="text-xs text-slate-500 font-medium">
                            • {camp.campaign_name}
                          </span>
                        )}
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-50 dark:bg-rose-950/60 text-[#E31B64] dark:text-rose-300 border border-rose-200/50">
                          {camp.client_category}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-[11px]">
                        {camp.rate_booked && (
                          <span className="font-bold font-mono text-slate-800 dark:text-slate-200">
                            {formatINR(camp.rate_booked)}/mo
                          </span>
                        )}
                        {camp.is_active ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300">
                            Active Campaign
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-750 text-slate-500">
                            Past Booking
                          </span>
                        )}
                      </div>
                    </div>

                    {(camp.start_date || camp.end_date) && (
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-mono">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>
                          {camp.start_date || 'Start'} → {camp.end_date || 'Current'}
                        </span>
                      </div>
                    )}

                    {camp.notes && (
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 italic">
                        "{camp.notes}"
                      </p>
                    )}

                    {/* Campaign Photos */}
                    {camp.photographs && camp.photographs.length > 0 && (
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5">
                          Campaign Creatives ({camp.photographs.length}):
                        </span>
                        <div className="flex items-center gap-2 overflow-x-auto pb-1">
                          {camp.photographs.map((p, pIdx) => (
                            <div
                              key={p.id || pIdx}
                              className="relative w-16 h-12 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-750 shrink-0 group"
                              title={p.caption || 'Campaign photograph'}
                            >
                              <img
                                src={p.url}
                                alt={p.caption}
                                className="w-full h-full object-cover"
                              />
                              <span className="absolute bottom-0 inset-x-0 bg-black/75 text-[7px] text-white px-1 truncate text-center">
                                {p.angle?.split(' ')[0] || `Img ${pIdx + 1}`}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 px-4 rounded-xl border border-dashed border-slate-200 dark:border-slate-750 bg-white dark:bg-slate-850">
                <Megaphone className="w-6 h-6 text-slate-300 dark:text-slate-600 mx-auto mb-1.5" />
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  No previous campaigns recorded yet for this site.
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Current Brand: <strong>{site.client_current_brand || 'None (Open for booking)'}</strong>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
