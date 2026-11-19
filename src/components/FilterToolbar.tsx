import React from 'react';
import { Search, Filter, LayoutGrid, List, MapPin, X, ArrowUpDown, Briefcase, Building2 } from 'lucide-react';
import type { OOHCategory, IlluminationType, SiteStatus } from '../types/ooh';

export type ViewMode = 'grid' | 'table' | 'map';

interface FilterToolbarProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  selectedCategory: string;
  onCategoryChange: (val: string) => void;
  selectedClientCategory: string;
  onClientCategoryChange: (val: string) => void;
  selectedVendor: string;
  onVendorChange: (val: string) => void;
  selectedIllumination: string;
  onIlluminationChange: (val: string) => void;
  selectedStatus: string;
  onStatusChange: (val: string) => void;
  selectedCity: string;
  onCityChange: (val: string) => void;
  sortBy: string;
  onSortChange: (val: any) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  availableCities: string[];
  availableClientCategories: string[];
  availableVendors: string[];
  totalResults: number;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
}

const CATEGORIES: (OOHCategory | 'All')[] = [
  'All',
  'Billboards',
  'Unipoles',
  'Bus Shelters/BQS',
  'Gantries',
  'Digital OOH/DOOH',
  'Metro Pillars',
  'Foot Overbridge (FOB)',
  'Airport Media',
];

const ILLUMINATIONS: (IlluminationType | 'All')[] = [
  'All',
  'Front-lit',
  'Back-lit',
  'Non-lit',
  'Digital LED',
];

const STATUSES: (SiteStatus | 'All')[] = ['All', 'Available', 'Booked', 'Maintenance'];

export const FilterToolbar: React.FC<FilterToolbarProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedClientCategory,
  onClientCategoryChange,
  selectedVendor,
  onVendorChange,
  selectedIllumination,
  onIlluminationChange,
  selectedStatus,
  onStatusChange,
  selectedCity,
  onCityChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  availableCities,
  availableClientCategories,
  availableVendors,
  totalResults,
  onResetFilters,
  hasActiveFilters,
}) => {
  return (
    <div className="bg-white dark:bg-[#191C24] rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-[#2C2E33] shadow-sm mb-6 transition-colors">
      {/* Top Row: Search Bar + Sort + View Mode Switcher */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 mb-4">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by UID, Site Name, Client Category (e.g. Banking, Wires), Vendor, or City..."
            className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-[#2C2E33] bg-slate-50/50 dark:bg-[#0F1117] text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#AF1763]/25 focus:border-[#AF1763] transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sort & View Switches */}
        <div className="flex items-center gap-2 sm:gap-3 self-end md:self-auto">
          {/* Sort By Dropdown */}
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-[#2C2E33] bg-slate-50/50 dark:bg-[#0F1117] text-xs font-medium text-slate-700 dark:text-slate-200">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="bg-transparent border-none focus:outline-none cursor-pointer pr-2"
            >
              <option value="newest">Recently Added</option>
              <option value="rate_desc">Rate: High to Low</option>
              <option value="rate_asc">Rate: Low to High</option>
              <option value="area_desc">Area: Largest First</option>
              <option value="name_asc">Site Name (A-Z)</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-[#2C2E33]">
            <button
              onClick={() => onViewModeChange('grid')}
              className={`p-2 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-slate-700 text-[#AF1763] dark:text-rose-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
              title="Grid Card View"
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden sm:inline">Grid</span>
            </button>
            <button
              onClick={() => onViewModeChange('table')}
              className={`p-2 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-slate-700 text-[#AF1763] dark:text-rose-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
              title="Compact Table List View"
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">Table</span>
            </button>
            <button
              onClick={() => onViewModeChange('map')}
              className={`p-2 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                viewMode === 'map'
                  ? 'bg-white dark:bg-slate-700 text-[#AF1763] dark:text-rose-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
              title="Interactive Spatial Map View"
            >
              <MapPin className="w-4 h-4" />
              <span className="hidden sm:inline">Map</span>
            </button>
          </div>
        </div>
      </div>

      {/* Second Row: Multi-Filter Controls */}
      <div className="flex flex-wrap items-center gap-2.5 pt-3 border-t border-slate-100 dark:border-[#2C2E33] text-xs">
        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-medium mr-1">
          <Filter className="w-3.5 h-3.5 text-[#AF1763]" />
          <span>Filters:</span>
        </div>

        {/* Client Category Filter */}
        <div className="relative">
          <select
            value={selectedClientCategory}
            onChange={(e) => onClientCategoryChange(e.target.value)}
            className={`px-3 py-1.5 rounded-lg border font-medium cursor-pointer transition-all ${
              selectedClientCategory !== 'All'
                ? 'bg-rose-50 dark:bg-rose-950/50 border-rose-300 dark:border-rose-800 text-[#AF1763] dark:text-rose-300 ring-1 ring-rose-500/20'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-[#2C2E33] text-slate-700 dark:text-slate-300'
            }`}
          >
            <option value="All">All Client Categories</option>
            {availableClientCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Site Vendor Filter */}
        <div className="relative">
          <select
            value={selectedVendor}
            onChange={(e) => onVendorChange(e.target.value)}
            className={`px-3 py-1.5 rounded-lg border font-medium cursor-pointer transition-all ${
              selectedVendor !== 'All'
                ? 'bg-orange-50 dark:bg-orange-950/50 border-orange-300 dark:border-orange-800 text-[#0DCAF0] dark:text-amber-300 ring-1 ring-orange-500/20'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-[#2C2E33] text-slate-700 dark:text-slate-300'
            }`}
          >
            <option value="All">All Site Vendors</option>
            {availableVendors.map((ven) => (
              <option key={ven} value={ven}>
                {ven}
              </option>
            ))}
          </select>
        </div>

        {/* Media Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className={`px-3 py-1.5 rounded-lg border font-medium cursor-pointer transition-all ${
            selectedCategory !== 'All'
              ? 'bg-rose-50 dark:bg-rose-950/50 border-rose-300 dark:border-rose-800 text-[#AF1763] dark:text-rose-300'
              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-[#2C2E33] text-slate-700 dark:text-slate-300'
          }`}
        >
          <option value="All">All Media Formats</option>
          {CATEGORIES.filter((c) => c !== 'All').map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* Status Filter */}
        <select
          value={selectedStatus}
          onChange={(e) => onStatusChange(e.target.value)}
          className={`px-3 py-1.5 rounded-lg border font-medium cursor-pointer transition-all ${
            selectedStatus !== 'All'
              ? 'bg-rose-50 dark:bg-rose-950/50 border-rose-300 dark:border-rose-800 text-[#AF1763] dark:text-rose-300'
              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-[#2C2E33] text-slate-700 dark:text-slate-300'
          }`}
        >
          <option value="All">All Statuses</option>
          {STATUSES.filter((s) => s !== 'All').map((st) => (
            <option key={st} value={st}>
              {st}
            </option>
          ))}
        </select>

        {/* City Filter */}
        <select
          value={selectedCity}
          onChange={(e) => onCityChange(e.target.value)}
          className={`px-3 py-1.5 rounded-lg border font-medium cursor-pointer transition-all ${
            selectedCity !== 'All'
              ? 'bg-rose-50 dark:bg-rose-950/50 border-rose-300 dark:border-rose-800 text-[#AF1763] dark:text-rose-300'
              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-[#2C2E33] text-slate-700 dark:text-slate-300'
          }`}
        >
          <option value="All">All Metro Cities</option>
          {availableCities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>

        {/* Illumination Filter */}
        <select
          value={selectedIllumination}
          onChange={(e) => onIlluminationChange(e.target.value)}
          className={`px-3 py-1.5 rounded-lg border font-medium cursor-pointer transition-all ${
            selectedIllumination !== 'All'
              ? 'bg-rose-50 dark:bg-rose-950/50 border-rose-300 dark:border-rose-800 text-[#AF1763] dark:text-rose-300'
              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-[#2C2E33] text-slate-700 dark:text-slate-300'
          }`}
        >
          <option value="All">All Illuminations</option>
          {ILLUMINATIONS.filter((i) => i !== 'All').map((illum) => (
            <option key={illum} value={illum}>
              {illum}
            </option>
          ))}
        </select>

        {/* Reset Filters Chip */}
        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors font-medium ml-auto"
          >
            <X className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        )}

        <div className="ml-auto text-slate-500 dark:text-slate-400 font-medium">
          Showing <span className="font-bold text-slate-900 dark:text-white">{totalResults}</span> sites
        </div>
      </div>
    </div>
  );
};
