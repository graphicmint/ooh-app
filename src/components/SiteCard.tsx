import React, { useState } from 'react';
import type { OOHSite, OOHPhotograph } from '../types/ooh';
import { formatINR } from '../utils/formatters';
import {
  MapPin,
  Maximize2,
  Sun,
  Moon,
  Eye,
  Edit2,
  Trash2,
  Sparkles,
  Presentation,
  Check,
  Building2,
  Briefcase,
  Megaphone,
} from 'lucide-react';

interface SiteCardProps {
  site: OOHSite;
  isSelected: boolean;
  onToggleSelect: (uid: string) => void;
  onViewDetails: (site: OOHSite) => void;
  onEditSite: (site: OOHSite) => void;
  onDeleteSite: (uid: string) => void;
  onQuickPptExport: (site: OOHSite) => void;
  onAddCampaign?: (uid: string) => void;
}

export const SiteCard: React.FC<SiteCardProps> = ({
  site,
  isSelected,
  onToggleSelect,
  onViewDetails,
  onEditSite,
  onDeleteSite,
  onQuickPptExport,
  onAddCampaign,
}) => {
  // Campaign grouping state
  const campaigns = (site.campaign_history && site.campaign_history.length > 0)
    ? site.campaign_history
    : [];

  const [activeCampaignIndex, setActiveCampaignIndex] = useState<number>(0);
  const activeCampaign = campaigns[activeCampaignIndex] || null;

  // Active creative photograph: prioritize the currently selected campaign's creative
  const activeCampaignPhotos = activeCampaign?.photographs || [];
  const primaryPhoto: OOHPhotograph =
    (activeCampaignPhotos.length > 0 ? activeCampaignPhotos[0] : null) ||
    site.photographs.find((p) => p.is_primary) ||
    site.photographs[0] || {
      id: 'placeholder',
      url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
      caption: site.site_name,
    };

  const dayPhotos = site.photographs.filter(
    (p) => p.angle?.includes('Day') || p.caption?.toLowerCase().includes('day')
  );
  const nightPhotos = site.photographs.filter(
    (p) => p.angle?.includes('Night') || p.caption?.toLowerCase().includes('night')
  );

  const statusStyles = {
    Available: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    Booked: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    Maintenance: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  };

  // Currently displayed brand and category from active campaign or fallback
  const displayedBrand = activeCampaign?.client_name || site.client_current_brand;
  const displayedCategory = activeCampaign?.client_category || site.client_category;

  // Distinct client categories represented across all campaigns for this UID
  const allCategories = Array.from(
    new Set([
      site.client_category,
      ...campaigns.map((c) => c.client_category).filter(Boolean),
    ].filter(Boolean))
  );

  return (
    <div
      className={`group relative flex flex-col rounded-2xl bg-white dark:bg-slate-900 border transition-all duration-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 ${
        isSelected
          ? 'border-[#E31B64] ring-2 ring-[#E31B64]/20 shadow-md'
          : 'border-slate-200/90 dark:border-slate-800/90 hover:border-rose-200 dark:hover:border-rose-950/60'
      }`}
    >
      {/* Top Media Frame */}
      <div
        className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 dark:bg-slate-800 cursor-pointer"
        onClick={() => onViewDetails(site)}
      >
        <img
          src={primaryPhoto.url}
          alt={site.site_name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80';
          }}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30 pointer-events-none" />

        {/* Multi-Select Checkbox Badge */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleSelect(site.uid);
          }}
          className={`absolute top-3 left-3 z-10 w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
            isSelected
              ? 'bg-gradient-to-r from-[#E31B64] to-[#F37023] text-white shadow-md'
              : 'bg-black/40 hover:bg-black/60 text-white/70 hover:text-white backdrop-blur-sm border border-white/20'
          }`}
          title={isSelected ? 'Deselect site' : 'Select site for export'}
        >
          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
        </button>

        {/* Status & Campaign Grouping Badges */}
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
          {campaigns.length > 1 && (
            <span
              className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/70 backdrop-blur-md text-amber-300 border border-amber-400/40 flex items-center gap-1 shadow-sm"
              title={`${campaigns.length} client campaigns consolidated under this UID card`}
            >
              <Megaphone className="w-2.5 h-2.5 text-[#F37023]" />
              <span>{campaigns.length} Campaigns</span>
            </span>
          )}

          <span
            className={`px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md border ${
              statusStyles[site.status] || statusStyles.Available
            }`}
          >
            ● {site.status}
          </span>
        </div>

        {/* Bottom Photo Badges */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
          <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-gradient-to-r from-[#E31B64]/90 to-[#F37023]/90 backdrop-blur-sm tracking-wide shadow-sm">
            {site.uid}
          </span>

          <div className="flex items-center gap-1.5">
            {dayPhotos.length > 0 && (
              <span
                className="px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-sm text-[10px] flex items-center gap-1 text-amber-300"
                title="Day photos available"
              >
                <Sun className="w-3 h-3" />
                <span>{dayPhotos.length}</span>
              </span>
            )}
            {nightPhotos.length > 0 && (
              <span
                className="px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-sm text-[10px] flex items-center gap-1 text-rose-300"
                title="Night photos available"
              >
                <Moon className="w-3 h-3" />
                <span>{nightPhotos.length}</span>
              </span>
            )}
            <span className="px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-sm text-[10px] font-mono">
              {site.photographs.length} {site.photographs.length === 1 ? 'photo' : 'photos'}
            </span>
          </div>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        {/* Category & Illumination Pills */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-[11px] font-semibold text-[#E31B64] dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-2.5 py-0.5 rounded-md border border-rose-200/50">
            {site.category}
          </span>
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" />
            {site.illumination}
          </span>
        </div>

        {/* Site Name */}
        <h3
          onClick={() => onViewDetails(site)}
          className="text-base font-bold text-slate-900 dark:text-white line-clamp-1 hover:text-[#E31B64] dark:hover:text-rose-400 cursor-pointer transition-colors"
          title={site.site_name}
        >
          {site.site_name}
        </h3>

        {/* Location & Landmark */}
        <div className="flex items-start gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-1">
          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
          <span>
            {site.location.city}
            {site.location.district ? ` (${site.location.district})` : ''}, {site.location.state}
            {site.location.tier ? ` • ${site.location.tier}` : ''} •{' '}
            {site.location.landmark || site.location.address}
          </span>
        </div>

        {/* Multi-Campaign Interactive Switcher Bar (when multiple campaigns are grouped under this UID) */}
        {campaigns.length > 1 && (
          <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between gap-1 mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Megaphone className="w-3 h-3 text-[#E31B64]" />
                <span>Grouped Campaigns ({campaigns.length})</span>
              </span>
              {onAddCampaign && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddCampaign(site.uid);
                  }}
                  className="text-[10px] font-bold text-[#E31B64] hover:text-[#F37023] flex items-center gap-0.5 transition-colors cursor-pointer"
                  title="Add new campaign to this site"
                >
                  <span>+ Add Campaign</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {campaigns.map((camp, idx) => {
                const isSelectedCamp = activeCampaignIndex === idx;
                return (
                  <button
                    key={camp.id || idx}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveCampaignIndex(idx);
                    }}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-semibold transition-all shrink-0 flex items-center gap-1 cursor-pointer ${
                      isSelectedCamp
                        ? 'bg-gradient-to-r from-[#E31B64] to-[#F37023] text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                    }`}
                    title={`Client: ${camp.client_name} | Category: ${camp.client_category}`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        camp.is_active ? 'bg-emerald-400' : 'bg-slate-400'
                      }`}
                    />
                    <span className="truncate max-w-[90px]">{camp.client_name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Client Brand & Category Badges */}
        <div className="flex flex-wrap items-center gap-1.5 mt-2.5 text-[11px]">
          {displayedBrand && (
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-bold bg-gradient-to-r from-rose-50 to-orange-50 dark:from-rose-950/60 dark:to-orange-950/40 text-[#E31B64] dark:text-rose-300 border border-rose-200/60 max-w-[220px] truncate"
              title={`Advertiser Brand: ${displayedBrand}`}
            >
              <Megaphone className="w-3 h-3 text-[#E31B64] shrink-0" />
              <span className="truncate">{displayedBrand}</span>
            </span>
          )}

          {displayedCategory && (
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-semibold bg-rose-50 text-[#E31B64] dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200/50"
              title="Client Industry Category"
            >
              <Briefcase className="w-3 h-3 text-[#E31B64]" />
              <span>{displayedCategory}</span>
            </span>
          )}

          {allCategories.length > 1 && (
            <span
              className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500"
              title={`Also booked in categories: ${allCategories.join(', ')}`}
            >
              +{allCategories.length - 1} categories
            </span>
          )}

          {site.vendor_name && (
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700 truncate max-w-[180px]"
              title={`Site Concessionaire: ${site.vendor_name}`}
            >
              <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
              <span className="truncate">{site.vendor_name}</span>
            </span>
          )}
        </div>

        {/* Technical Specs Metric Bar */}
        <div className="grid grid-cols-2 gap-2 my-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs">
          <div>
            <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider block">
              Dimensions & Ratio
            </span>
            <span className="font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 flex-wrap">
              <span>{site.dimensions.width}ft × {site.dimensions.height}ft</span>
              {site.dimensions.aspect_ratio && (
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-orange-50 dark:bg-orange-950/60 text-[#F37023] dark:text-amber-300 font-mono font-bold">
                  {site.dimensions.aspect_ratio}
                </span>
              )}
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider block">
              Total Area
            </span>
            <span className="font-semibold text-[#E31B64] dark:text-rose-400 flex items-center gap-1">
              <Maximize2 className="w-3 h-3" />
              {site.dimensions.total_sq_ft.toLocaleString()} sq ft
            </span>
          </div>
        </div>

        {/* Commercial Rate & Action Footer */}
        <div className="mt-auto pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-medium text-slate-400 block uppercase">
              Rate / Month
            </span>
            <span className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
              {formatINR(site.rate_per_month)}
            </span>
          </div>

          <div className="flex items-center gap-1">
            {onAddCampaign && (
              <button
                onClick={() => onAddCampaign(site.uid)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-[#E31B64] hover:bg-rose-50 dark:hover:bg-slate-800 transition-colors"
                title="Log New Campaign Under this UID"
              >
                <Megaphone className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => onQuickPptExport(site)}
              className="p-1.5 rounded-lg text-slate-500 hover:text-[#E31B64] hover:bg-rose-50 dark:hover:bg-slate-800 transition-colors"
              title="Generate single PPTX slide for this site"
            >
              <Presentation className="w-4 h-4" />
            </button>
            <button
              onClick={() => onEditSite(site)}
              className="p-1.5 rounded-lg text-slate-500 hover:text-[#E31B64] hover:bg-rose-50 dark:hover:bg-slate-800 transition-colors"
              title="Edit Site Details"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDeleteSite(site.uid)}
              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 transition-colors"
              title="Delete Site"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onViewDetails(site)}
              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:bg-[#E31B64] dark:hover:bg-[#E31B64] dark:hover:text-white transition-colors flex items-center gap-1 ml-1"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>View</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};