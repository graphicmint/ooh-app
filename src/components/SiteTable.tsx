import React from 'react';
import type { OOHSite } from '../types/ooh';
import { formatINR } from '../utils/formatters';
import {
  Eye,
  Edit2,
  Trash2,
  Presentation,
  Check,
  MapPin,
  Maximize2,
  Sparkles,
  Building2,
  Briefcase,
  Megaphone,
} from 'lucide-react';

interface SiteTableProps {
  sites: OOHSite[];
  selectedUids: string[];
  onToggleSelect: (uid: string) => void;
  onSelectAll: () => void;
  onViewDetails: (site: OOHSite) => void;
  onEditSite: (site: OOHSite) => void;
  onDeleteSite: (uid: string) => void;
  onQuickPptExport: (site: OOHSite) => void;
  onAddCampaign?: (uid: string) => void;
}

export const SiteTable: React.FC<SiteTableProps> = ({
  sites,
  selectedUids,
  onToggleSelect,
  onSelectAll,
  onViewDetails,
  onEditSite,
  onDeleteSite,
  onQuickPptExport,
  onAddCampaign,
}) => {
  const allSelected = sites.length > 0 && selectedUids.length === sites.length;
  const someSelected = selectedUids.length > 0 && selectedUids.length < sites.length;

  const statusBadge = (status: string) => {
    switch (status) {
      case 'Available':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            Available
          </span>
        );
      case 'Booked':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
            Booked
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            Maintenance
          </span>
        );
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          {/* Table Header */}
          <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="p-4 w-10">
                <button
                  type="button"
                  onClick={onSelectAll}
                  className={`w-5 h-5 rounded flex items-center justify-center border transition-all ${
                    allSelected
                      ? 'bg-[#E31B64] border-[#E31B64] text-white'
                      : someSelected
                      ? 'bg-rose-100 border-[#E31B64] text-[#E31B64]'
                      : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700'
                  }`}
                  title="Select / Deselect All"
                >
                  {(allSelected || someSelected) && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </button>
              </th>
              <th className="py-4 px-3">Site / Media Details</th>
              <th className="py-4 px-3">Category</th>
              <th className="py-4 px-3">Client Category</th>
              <th className="py-4 px-3">Owning Vendor</th>
              <th className="py-4 px-3">Location & Landmark</th>
              <th className="py-4 px-3">Dimensions & Area</th>
              <th className="py-4 px-3">Monthly Rate</th>
              <th className="py-4 px-3">Status</th>
              <th className="py-4 px-4 text-right">Actions</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {sites.map((site) => {
              const isSelected = selectedUids.includes(site.uid);
              const primaryPhoto =
                site.photographs.find((p) => p.is_primary) ||
                site.photographs[0] || {
                  url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
                  caption: site.site_name,
                };

              return (
                <tr
                  key={site.uid}
                  className={`hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors ${
                    isSelected ? 'bg-rose-50/40 dark:bg-rose-950/20' : ''
                  }`}
                >
                  {/* Select Checkbox */}
                  <td className="p-4">
                    <button
                      type="button"
                      onClick={() => onToggleSelect(site.uid)}
                      className={`w-5 h-5 rounded flex items-center justify-center border transition-all ${
                        isSelected
                          ? 'bg-[#E31B64] border-[#E31B64] text-white'
                          : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </button>
                  </td>

                  {/* Media Details + Thumbnail */}
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-3">
                      <div
                        onClick={() => onViewDetails(site)}
                        className="relative w-14 h-11 rounded-lg overflow-hidden shrink-0 bg-slate-100 dark:bg-slate-800 cursor-pointer border border-slate-200 dark:border-slate-700 group"
                      >
                        <img
                          src={primaryPhoto.url}
                          alt={site.site_name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80';
                          }}
                        />
                        <span className="absolute bottom-0 right-0 px-1 bg-black/70 text-[9px] text-white font-mono">
                          {site.photographs.length}p
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs text-[#E31B64] dark:text-rose-400">
                            {site.uid}
                          </span>
                        </div>
                        <h4
                          onClick={() => onViewDetails(site)}
                          className="font-bold text-slate-900 dark:text-white line-clamp-1 hover:text-[#E31B64] cursor-pointer"
                        >
                          {site.site_name}
                        </h4>
                        {site.campaign_history && site.campaign_history.length > 1 ? (
                          <div className="flex flex-wrap items-center gap-1 mt-1">
                            <span className="inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-gradient-to-r from-rose-50 to-orange-50 dark:from-rose-950/60 dark:to-orange-950/40 text-[#E31B64] dark:text-rose-300 border border-rose-200/50">
                              <Megaphone className="w-2.5 h-2.5 text-[#E31B64]" />
                              <span>{site.campaign_history.length} Campaigns</span>
                            </span>
                            {site.campaign_history.slice(0, 3).map((c, idx) => (
                              <span
                                key={c.id || idx}
                                className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                                title={`${c.client_name} (${c.client_category})`}
                              >
                                {c.client_name}
                              </span>
                            ))}
                            {site.campaign_history.length > 3 && (
                              <span className="text-[9px] text-slate-400 font-medium">
                                +{site.campaign_history.length - 3} more
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400">
                            {site.client_current_brand ? `Brand: ${site.client_current_brand}` : site.facing_direction || 'Front Facing'}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Media Category */}
                  <td className="py-3 px-3">
                    <span className="font-medium text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 whitespace-nowrap">
                      {site.category}
                    </span>
                  </td>

                  {/* Client Category */}
                  <td className="py-3 px-3">
                    {site.client_category ? (
                      <div>
                        <span className="inline-flex items-center gap-1 font-semibold text-rose-700 dark:text-rose-300 px-2.5 py-1 rounded-md bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 whitespace-nowrap">
                          <Briefcase className="w-3 h-3 text-[#E31B64]" />
                          <span>{site.client_category}</span>
                        </span>
                        {(() => {
                          const otherCats = Array.from(
                            new Set(
                              (site.campaign_history || [])
                                .map((c) => c.client_category)
                                .filter((cat) => Boolean(cat) && cat !== site.client_category)
                            )
                          );
                          if (otherCats.length === 0) return null;
                          return (
                            <div className="text-[10px] text-slate-400 mt-0.5" title={otherCats.join(', ')}>
                              +{otherCats.length} more {otherCats.length === 1 ? 'category' : 'categories'}
                            </div>
                          );
                        })()}
                      </div>
                    ) : (
                      <span className="text-slate-400 italic">Unassigned</span>
                    )}
                  </td>

                  {/* Owning Vendor */}
                  <td className="py-3 px-3">
                    {site.vendor_name ? (
                      <div className="flex items-start gap-1 max-w-[160px]">
                        <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-slate-800 dark:text-slate-200 truncate">
                            {site.vendor_name}
                          </p>
                          {site.vendor_contact && (
                            <p className="text-[10px] text-slate-400 truncate">
                              {site.vendor_contact}
                            </p>
                          )}
                        </div>
                      </div>
                    ) : (
                      <span className="text-slate-400">Direct / Self</span>
                    )}
                  </td>

                  {/* Location & Landmark */}
                  <td className="py-3 px-3">
                    <div className="flex items-start gap-1 max-w-xs">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-slate-800 dark:text-slate-200">
                          {site.location.city}
                          {site.location.district ? ` (${site.location.district})` : ''}, {site.location.state}
                        </p>
                        <p className="text-[11px] text-slate-400 line-clamp-1">
                          {site.location.tier ? `[${site.location.tier}] ` : ''}
                          {site.location.landmark || site.location.address}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Dimensions & Area */}
                  <td className="py-3 px-3">
                    <div className="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5 flex-wrap">
                      <span>{site.dimensions.width}' × {site.dimensions.height}'</span>
                      {site.dimensions.aspect_ratio && (
                        <span className="text-[10px] px-1 py-0.2 rounded bg-orange-50 dark:bg-orange-950/60 text-[#F37023] dark:text-amber-300 font-mono font-bold">
                          {site.dimensions.aspect_ratio}
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] font-semibold text-[#E31B64] dark:text-rose-400 flex items-center gap-1">
                      <Maximize2 className="w-3 h-3" />
                      {site.dimensions.total_sq_ft.toLocaleString()} sq ft
                    </div>
                  </td>

                  {/* Monthly Rate */}
                  <td className="py-3 px-3">
                    <div className="font-extrabold text-slate-900 dark:text-white text-sm">
                      {formatINR(site.rate_per_month)}
                    </div>
                    <div className="text-[10px] text-slate-400">/ month</div>
                  </td>

                  {/* Status */}
                  <td className="py-3 px-3">{statusBadge(site.status)}</td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
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
                        onClick={() => onViewDetails(site)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-[#E31B64] hover:bg-rose-50 dark:hover:bg-slate-800 transition-colors"
                        title="View Full Specifications"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onQuickPptExport(site)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-[#E31B64] hover:bg-rose-50 dark:hover:bg-slate-800 transition-colors"
                        title="Download PPT Slide"
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
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
