import React from 'react';
import type { OOHSite } from '../types/ooh';
import {
  Zap,
  RefreshCw,
  ArrowRight,
  CheckCircle2,
  Layers,
  Sparkles,
} from 'lucide-react';
import { SubtleBrandWatermark } from './InterspaceBrand';

interface LandingHubProps {
  onSelectPortal: (portal: 'advantage' | 'databoss') => void;
  sites: OOHSite[];
  storedVendorsCount: number;
  storedCategoriesCount: number;
  onOpenAddSite?: () => void;
}

export const LandingHub: React.FC<LandingHubProps> = ({
  onSelectPortal,
  sites,
  storedVendorsCount,
  storedCategoriesCount,
}) => {
  // Compute portfolio high-level metrics
  const totalSites = sites.length;
  const totalSqFt = sites.reduce((sum, s) => sum + (s.dimensions?.total_sq_ft || 0), 0);
  const uniqueCities = Array.from(new Set(sites.map((s) => s.location.city))).length;
  const uniqueStates = Array.from(new Set(sites.map((s) => s.location.state))).length;
  const availableSitesCount = sites.filter((s) => s.status === 'Available').length;
  const occupancyRate = totalSites > 0 ? Math.round(((totalSites - availableSitesCount) / totalSites) * 100) : 0;

  return (
    <div className="relative min-h-[calc(100vh-5rem)] flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full overflow-hidden">
      {/* Subtle angled watermark backdrop */}
      <SubtleBrandWatermark />

      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto pt-2 pb-8 relative z-10">
        <div className="flex items-center justify-center mb-5">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full text-xs font-bold bg-white dark:bg-slate-900 border border-rose-200/80 dark:border-rose-900/40 shadow-sm shadow-rose-500/5">
            <Layers className="w-4 h-4 text-[#E31B64]" />
            <span className="bg-gradient-to-r from-[#E31B64] to-[#F37023] bg-clip-text text-transparent font-extrabold uppercase tracking-wider">
              OOH Media Management Suite
            </span>
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
          Select Your Operational Portal
        </h1>

        <p className="mt-4 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal max-w-2xl mx-auto">
          Choose between{' '}
          <strong className="text-[#E31B64] font-semibold">BlitzDeck</strong> for media planning, OOH analytics & client pitch retrieval, or{' '}
          <strong className="text-[#F37023] font-semibold">SiteSync</strong> for inventory input, bulk spreadsheet upload & database management.
        </p>
      </div>

      {/* Dual Portal Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-stretch max-w-6xl mx-auto w-full relative z-10">
        {/* Portal 1: BlitzDeck (Planning & Retrieval) */}
        <div
          onClick={() => onSelectPortal('advantage')}
          className="group relative flex flex-col justify-between rounded-3xl p-8 sm:p-9 bg-white dark:bg-slate-900/90 border-2 border-rose-100 dark:border-rose-950/60 hover:border-[#E31B64] dark:hover:border-[#E31B64] shadow-xl shadow-rose-500/5 hover:shadow-2xl hover:shadow-rose-500/15 transition-all duration-300 cursor-pointer overflow-hidden transform hover:-translate-y-1"
        >
          {/* Subtle Ambient Brand Glow */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-gradient-to-br from-[#E31B64]/15 via-[#F37023]/10 to-transparent rounded-full blur-3xl pointer-events-none group-hover:scale-125 transition-transform" />

          <div>
            {/* Top Badge & Icon Lockup */}
            <div className="flex items-center justify-between mb-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#E31B64] via-[#E63946] to-[#F37023] text-white flex items-center justify-center shadow-lg shadow-rose-500/25 group-hover:scale-105 transition-transform p-[2px]">
                <div className="w-full h-full rounded-[14px] bg-white dark:bg-slate-900 flex items-center justify-center">
                  <Zap className="w-7 h-7 text-[#E31B64] fill-[#E31B64]/15" />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-rose-50 dark:bg-rose-950/80 text-[#E31B64] dark:text-rose-300 border border-rose-200/80 dark:border-rose-900/60">
                  Planning & Data Retrieval
                </span>
              </div>
            </div>

            {/* Portal Title & Subtitle */}
            <div className="space-y-1">
              <div className="text-[11px] font-bold tracking-wider uppercase text-slate-400">
                Media Discovery & Pitch Engine
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white group-hover:text-[#E31B64] dark:group-hover:text-rose-400 transition-colors flex items-center gap-2">
                <span>BlitzDeck</span>
              </h2>
            </div>

            <p className="mt-2.5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Explore outdoor media across 800+ Indian cities, filter by client industry vertical or vendor, inspect GIS corridor maps, and generate client-ready Excel and PowerPoint pitch decks in seconds.
            </p>

            {/* Intelligence Badge */}
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
              <Sparkles className="w-3.5 h-3.5 text-[#E31B64]" />
              <span className="font-semibold">OOH Research, GIS & Pitch Deck Engine</span>
            </div>

            {/* Key Capabilities List */}
            <div className="mt-6 pt-6 border-t border-rose-100/70 dark:border-rose-950/40 space-y-3">
              <div className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-[#E31B64] shrink-0 mt-0.5" />
                <span><strong>Multi-Vector Filtering:</strong> Filter by Client Category (Electronics, Banking, Wires, Bulbs, Jewellery), Media Vendor, City, Illumination, and Dimensions.</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-[#E31B64] shrink-0 mt-0.5" />
                <span><strong>Interactive GIS Map:</strong> View hoarding locations, corridor clusters, and live street coordinates.</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-[#E31B64] shrink-0 mt-0.5" />
                <span><strong>1-Click PPT Pitch Decks:</strong> Multi-photo presentation slides with technical specs, traffic peak, and rate cards.</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-[#E31B64] shrink-0 mt-0.5" />
                <span><strong>Excel Media Schedules:</strong> Export selected inventory with commercial parameters & financial metrics.</span>
              </div>
            </div>
          </div>

          {/* Action Trigger */}
          <div className="mt-8 pt-6 border-t border-rose-100/70 dark:border-rose-950/40 flex items-center justify-between">
            <span className="text-xs font-bold text-[#E31B64] dark:text-rose-400 group-hover:underline">
              Browse {totalSites} Live Media Assets
            </span>
            <button className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-[#E31B64] via-[#E63946] to-[#F37023] hover:from-[#D81B60] hover:to-[#EA580C] text-white shadow-md shadow-rose-500/25 flex items-center gap-2 transition-all">
              <span>Launch BlitzDeck</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Portal 2: SiteSync (Input, Upload & Save) */}
        <div
          onClick={() => onSelectPortal('databoss')}
          className="group relative flex flex-col justify-between rounded-3xl p-8 sm:p-9 bg-white dark:bg-slate-900/90 border-2 border-orange-100 dark:border-orange-950/60 hover:border-[#F37023] dark:hover:border-[#F37023] shadow-xl shadow-orange-500/5 hover:shadow-2xl hover:shadow-orange-500/15 transition-all duration-300 cursor-pointer overflow-hidden transform hover:-translate-y-1"
        >
          {/* Subtle Ambient Brand Glow */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-gradient-to-br from-[#F37023]/15 via-[#E31B64]/10 to-transparent rounded-full blur-3xl pointer-events-none group-hover:scale-125 transition-transform" />

          <div>
            {/* Top Badge & Icon Lockup */}
            <div className="flex items-center justify-between mb-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#F37023] via-[#E63946] to-[#E31B64] text-white flex items-center justify-center shadow-lg shadow-orange-500/25 group-hover:scale-105 transition-transform p-[2px]">
                <div className="w-full h-full rounded-[14px] bg-white dark:bg-slate-900 flex items-center justify-center">
                  <RefreshCw className="w-7 h-7 text-[#F37023]" />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-amber-50 dark:bg-amber-950/80 text-[#F37023] dark:text-amber-300 border border-amber-200/80 dark:border-amber-900/60">
                  Input, Upload & Save
                </span>
              </div>
            </div>

            {/* Portal Title & Subtitle */}
            <div className="space-y-1">
              <div className="text-[11px] font-bold tracking-wider uppercase text-slate-400">
                Master Database & Sourcing Studio
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white group-hover:text-[#F37023] dark:group-hover:text-amber-400 transition-colors flex items-center gap-2">
                <span>SiteSync</span>
              </h2>
            </div>

            <p className="mt-2.5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Onboard media assets into the master database. Input single hoardings with automated 7-segment UIDs & PIN derivation, or bulk upload spreadsheets with live staging preview.
            </p>

            {/* Sourcing Indicator */}
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
              <Sparkles className="w-3.5 h-3.5 text-[#F37023]" />
              <span className="font-semibold">Automated Nomenclature & Geo-Centroid Engine</span>
            </div>

            {/* Key Capabilities List */}
            <div className="mt-6 pt-6 border-t border-orange-100/70 dark:border-orange-950/40 space-y-3">
              <div className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-[#F37023] shrink-0 mt-0.5" />
                <span><strong>Single Site Entry Wizard:</strong> Auto-generates UID (State-City-PIN-Serial-Illum-Size-Traffic) & PIN from Landmark.</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-[#F37023] shrink-0 mt-0.5" />
                <span><strong>Bulk Spreadsheet Ingestion:</strong> Drag & drop Excel (.xlsx) / CSV files with automated column mapping & preview.</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-[#F37023] shrink-0 mt-0.5" />
                <span><strong>Media Vendor Registry:</strong> Manage vendor directory, contact persons, phone numbers, and site ownership.</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-[#F37023] shrink-0 mt-0.5" />
                <span><strong>Client Category Master:</strong> Configure advertiser verticals (Electronics, Wires, Banking, Jewellery, etc.).</span>
              </div>
            </div>
          </div>

          {/* Action Trigger */}
          <div className="mt-8 pt-6 border-t border-orange-100/70 dark:border-orange-950/40 flex items-center justify-between">
            <span className="text-xs font-bold text-[#F37023] dark:text-amber-400 group-hover:underline">
              Enter Operations & Upload Vault
            </span>
            <button className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-[#F37023] via-[#E63946] to-[#E31B64] hover:from-[#EA580C] hover:to-[#D81B60] text-white shadow-md shadow-orange-500/25 flex items-center gap-2 transition-all">
              <span>Launch SiteSync</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Portfolio Quick Glance Stats Ribbon */}
      <div className="mt-12 bg-white dark:bg-slate-900 rounded-2xl border border-rose-100/70 dark:border-rose-950/40 p-6 shadow-sm max-w-6xl mx-auto w-full relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#E31B64]" />
              <span>Live Master Inventory Telemetry</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Synchronized cross-portal database state across all Indian markets
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-rose-50 text-[#E31B64] dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200/60 dark:border-rose-900/40">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E31B64] animate-ping" />
              Database Online ({totalSites} Records)
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
          <div className="p-3 rounded-xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/80">
            <p className="text-[11px] uppercase tracking-wider font-bold text-slate-400">Total Sites</p>
            <p className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">{totalSites}</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/80">
            <p className="text-[11px] uppercase tracking-wider font-bold text-slate-400">Total Media Area</p>
            <p className="text-xl font-extrabold bg-gradient-to-r from-[#E31B64] to-[#F37023] bg-clip-text text-transparent mt-0.5">
              {totalSqFt.toLocaleString()} <span className="text-xs font-normal text-slate-500">sq.ft</span>
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/80">
            <p className="text-[11px] uppercase tracking-wider font-bold text-slate-400">Cities / States</p>
            <p className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">
              {uniqueCities} <span className="text-xs text-slate-400">/ {uniqueStates}</span>
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/80">
            <p className="text-[11px] uppercase tracking-wider font-bold text-slate-400">Media Vendors</p>
            <p className="text-xl font-extrabold text-[#F37023] mt-0.5">
              {storedVendorsCount}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/80">
            <p className="text-[11px] uppercase tracking-wider font-bold text-slate-400">Client Verticals</p>
            <p className="text-xl font-extrabold text-[#E31B64] mt-0.5">
              {storedCategoriesCount}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/80">
            <p className="text-[11px] uppercase tracking-wider font-bold text-slate-400">Occupancy</p>
            <p className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">
              {occupancyRate}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
