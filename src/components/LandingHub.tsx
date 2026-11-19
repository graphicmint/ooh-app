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
  const totalSites = sites.length;
  const totalSqFt = sites.reduce((sum, s) => sum + (s.dimensions?.total_sq_ft || 0), 0);
  const uniqueCities = Array.from(new Set(sites.map((s) => s.location.city))).length;
  const uniqueStates = Array.from(new Set(sites.map((s) => s.location.state))).length;
  const availableSitesCount = sites.filter((s) => s.status === 'Available').length;
  const occupancyRate = totalSites > 0 ? Math.round(((totalSites - availableSitesCount) / totalSites) * 100) : 0;

  return (
    <div className="relative min-h-[calc(100vh-5rem)] flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full overflow-hidden">
      <SubtleBrandWatermark />

      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto pt-2 pb-8 relative z-10">
        <div className="flex items-center justify-center mb-5">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full text-xs font-bold bg-white dark:bg-[#191C24] border border-slate-200 dark:border-[#2C2E33] shadow-sm">
            <Layers className="w-4 h-4 text-[#AF1763] dark:text-[#e84c96]" />
            <span className="bg-gradient-to-r from-[#AF1763] to-[#0D6EFD] bg-clip-text text-transparent font-extrabold uppercase tracking-wider">
              OOH Media Management Suite
            </span>
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
          Select Your Operational Portal
        </h1>

        <p className="mt-4 text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed font-normal max-w-2xl mx-auto">
          Choose between{' '}
          <strong className="text-[#AF1763] dark:text-[#e84c96] font-semibold">BlitzDeck</strong> for media planning, OOH analytics & client pitch retrieval, or{' '}
          <strong className="text-[#0DCAF0] font-semibold">SiteSync</strong> for inventory input, bulk spreadsheet upload & database management.
        </p>
      </div>

      {/* Dual Portal Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-stretch max-w-6xl mx-auto w-full relative z-10">
        {/* Portal 1: BlitzDeck */}
        <div
          onClick={() => onSelectPortal('advantage')}
          className="group relative flex flex-col justify-between rounded-3xl p-8 sm:p-9 bg-white dark:bg-[#191C24] border border-slate-200 dark:border-[#2C2E33] hover:border-[#AF1763] dark:hover:border-[#AF1763] shadow-xl hover:shadow-2xl hover:shadow-[#AF1763]/15 transition-all duration-300 cursor-pointer overflow-hidden transform hover:-translate-y-1"
        >
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-gradient-to-br from-[#AF1763]/20 via-[#0D6EFD]/10 to-transparent rounded-full blur-3xl pointer-events-none group-hover:scale-125 transition-transform" />

          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#AF1763] to-[#d63384] text-white flex items-center justify-center shadow-lg shadow-[#AF1763]/30 group-hover:scale-105 transition-transform p-[2px]">
                <div className="w-full h-full rounded-[14px] bg-white dark:bg-[#191C24] flex items-center justify-center">
                  <Zap className="w-7 h-7 text-[#AF1763] dark:text-[#e84c96] fill-[#AF1763]/20" />
                </div>
              </div>

              <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-[#AF1763]/10 dark:bg-[#AF1763]/20 text-[#AF1763] dark:text-[#f472b6] border border-[#AF1763]/30">
                Planning & Data Retrieval
              </span>
            </div>

            <div className="space-y-1">
              <div className="text-[11px] font-bold tracking-wider uppercase text-slate-400">
                Media Discovery & Pitch Engine
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white group-hover:text-[#AF1763] dark:group-hover:text-[#e84c96] transition-colors flex items-center gap-2">
                <span>BlitzDeck</span>
              </h2>
            </div>

            <p className="mt-2.5 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Explore outdoor media across 800+ Indian cities, filter by client industry vertical or vendor, inspect GIS corridor maps, and generate client-ready Excel and PowerPoint pitch decks in seconds.
            </p>

            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-[#0F1117] border border-slate-200 dark:border-[#2C2E33] text-xs text-slate-600 dark:text-slate-300">
              <Sparkles className="w-3.5 h-3.5 text-[#0D6EFD]" />
              <span className="font-semibold">OOH Research, GIS & Pitch Deck Engine</span>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-[#2C2E33] space-y-3">
              <div className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-[#AF1763] dark:text-[#e84c96] shrink-0 mt-0.5" />
                <span><strong>Multi-Vector Filtering:</strong> Filter by Client Category, Media Vendor, City, Illumination, and Dimensions.</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-[#0D6EFD] shrink-0 mt-0.5" />
                <span><strong>Interactive GIS Map:</strong> View hoarding locations, corridor clusters, and live street coordinates.</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-[#198754] dark:text-[#20c975] shrink-0 mt-0.5" />
                <span><strong>1-Click PPT Pitch Decks:</strong> Multi-photo presentation slides with technical specs, traffic peak, and rate cards.</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-[#0DCAF0] shrink-0 mt-0.5" />
                <span><strong>Excel Media Schedules:</strong> Export selected inventory with commercial parameters & financial metrics.</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-[#2C2E33] flex items-center justify-between">
            <span className="text-xs font-bold text-[#AF1763] dark:text-[#e84c96] group-hover:underline">
              Browse {totalSites} Live Media Assets
            </span>
            <button className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-[#AF1763] to-[#d63384] hover:brightness-110 text-white shadow-md shadow-[#AF1763]/30 flex items-center gap-2 transition-all">
              <span>Launch BlitzDeck</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Portal 2: SiteSync */}
        <div
          onClick={() => onSelectPortal('databoss')}
          className="group relative flex flex-col justify-between rounded-3xl p-8 sm:p-9 bg-white dark:bg-[#191C24] border border-slate-200 dark:border-[#2C2E33] hover:border-[#0DCAF0] dark:hover:border-[#0DCAF0] shadow-xl hover:shadow-2xl hover:shadow-[#0DCAF0]/15 transition-all duration-300 cursor-pointer overflow-hidden transform hover:-translate-y-1"
        >
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-gradient-to-br from-[#0DCAF0]/20 via-[#198754]/10 to-transparent rounded-full blur-3xl pointer-events-none group-hover:scale-125 transition-transform" />

          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#0D6EFD] to-[#0DCAF0] text-white flex items-center justify-center shadow-lg shadow-[#0DCAF0]/25 group-hover:scale-105 transition-transform p-[2px]">
                <div className="w-full h-full rounded-[14px] bg-white dark:bg-[#191C24] flex items-center justify-center">
                  <RefreshCw className="w-7 h-7 text-[#0DCAF0]" />
                </div>
              </div>

              <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-[#0DCAF0]/10 dark:bg-[#0DCAF0]/15 text-[#0aa2c0] dark:text-[#0DCAF0] border border-[#0DCAF0]/30">
                Input, Upload & Save
              </span>
            </div>

            <div className="space-y-1">
              <div className="text-[11px] font-bold tracking-wider uppercase text-slate-400">
                Master Database & Sourcing Studio
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white group-hover:text-[#0DCAF0] transition-colors flex items-center gap-2">
                <span>SiteSync</span>
              </h2>
            </div>

            <p className="mt-2.5 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Onboard media assets into the master database. Input single hoardings with automated 7-segment UIDs & PIN derivation, or bulk upload spreadsheets with live staging preview.
            </p>

            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-[#0F1117] border border-slate-200 dark:border-[#2C2E33] text-xs text-slate-600 dark:text-slate-300">
              <Sparkles className="w-3.5 h-3.5 text-[#0DCAF0]" />
              <span className="font-semibold">Automated Nomenclature & Geo-Centroid Engine</span>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-[#2C2E33] space-y-3">
              <div className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-[#0DCAF0] shrink-0 mt-0.5" />
                <span><strong>Single Site Entry Wizard:</strong> Auto-generates UID (State-City-PIN-Serial-Illum-Size-Traffic) & PIN from Landmark.</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-[#198754] dark:text-[#20c975] shrink-0 mt-0.5" />
                <span><strong>Bulk Spreadsheet Ingestion:</strong> Drag & drop Excel (.xlsx) / CSV files with automated column mapping & preview.</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-[#0D6EFD] shrink-0 mt-0.5" />
                <span><strong>Media Vendor Registry:</strong> Manage vendor directory, contact persons, phone numbers, and site ownership.</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-[#FFC107] shrink-0 mt-0.5" />
                <span><strong>Client Category Master:</strong> Configure advertiser verticals (Electronics, Wires, Banking, Jewellery, etc.).</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-[#2C2E33] flex items-center justify-between">
            <span className="text-xs font-bold text-[#0aa2c0] dark:text-[#0DCAF0] group-hover:underline">
              Enter Operations & Upload Vault
            </span>
            <button className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-[#0D6EFD] to-[#0DCAF0] hover:brightness-110 text-white shadow-md shadow-[#0DCAF0]/25 flex items-center gap-2 transition-all">
              <span>Launch SiteSync</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Portfolio Quick Glance Stats Ribbon */}
      <div className="mt-12 bg-white dark:bg-[#191C24] rounded-2xl border border-slate-200 dark:border-[#2C2E33] p-6 shadow-sm max-w-6xl mx-auto w-full relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 mb-4 border-b border-slate-100 dark:border-[#2C2E33]">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#AF1763] dark:text-[#e84c96]" />
              <span>Live Master Inventory Telemetry</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Synchronized cross-portal database state across all Indian markets
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#198754]/15 text-[#198754] dark:text-[#20c975] border border-[#198754]/30">
              <span className="w-1.5 h-1.5 rounded-full bg-[#198754] dark:bg-[#20c975] animate-ping" />
              Database Online ({totalSites} Records)
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0F1117] border border-slate-100 dark:border-[#2C2E33]">
            <p className="text-[11px] uppercase tracking-wider font-bold text-slate-400">Total Sites</p>
            <p className="text-xl font-extrabold text-[#0D6EFD] mt-0.5">{totalSites}</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0F1117] border border-slate-100 dark:border-[#2C2E33]">
            <p className="text-[11px] uppercase tracking-wider font-bold text-slate-400">Total Media Area</p>
            <p className="text-xl font-extrabold text-[#AF1763] dark:text-[#e84c96] mt-0.5">
              {totalSqFt.toLocaleString()} <span className="text-xs font-normal text-slate-500">sq.ft</span>
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0F1117] border border-slate-100 dark:border-[#2C2E33]">
            <p className="text-[11px] uppercase tracking-wider font-bold text-slate-400">Cities / States</p>
            <p className="text-xl font-extrabold text-[#0DCAF0] mt-0.5">
              {uniqueCities} <span className="text-xs text-slate-400">/ {uniqueStates}</span>
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0F1117] border border-slate-100 dark:border-[#2C2E33]">
            <p className="text-[11px] uppercase tracking-wider font-bold text-slate-400">Media Vendors</p>
            <p className="text-xl font-extrabold text-[#FFC107] mt-0.5">
              {storedVendorsCount}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0F1117] border border-slate-100 dark:border-[#2C2E33]">
            <p className="text-[11px] uppercase tracking-wider font-bold text-slate-400">Client Verticals</p>
            <p className="text-xl font-extrabold text-[#198754] dark:text-[#20c975] mt-0.5">
              {storedCategoriesCount}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0F1117] border border-slate-100 dark:border-[#2C2E33]">
            <p className="text-[11px] uppercase tracking-wider font-bold text-slate-400">Occupancy</p>
            <p className="text-xl font-extrabold text-[#AB2E3C] dark:text-[#f05668] mt-0.5">
              {occupancyRate}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
