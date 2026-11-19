import React, { useState } from 'react';
import { OOHSite } from '../types/ooh';
import { formatINR } from '../utils/formatters';
import { MapPin, ExternalLink, Eye, Maximize2, Sparkles } from 'lucide-react';

interface SiteMapViewProps {
  sites: OOHSite[];
  onViewDetails: (site: OOHSite) => void;
}

export const SiteMapView: React.FC<SiteMapViewProps> = ({ sites, onViewDetails }) => {
  const [selectedSite, setSelectedSite] = useState<OOHSite | null>(sites[0] || null);
  const [activeCity, setActiveCity] = useState<string>('All');

  const cities = ['All', ...Array.from(new Set(sites.map((s) => s.location.city)))];

  const displayedSites =
    activeCity === 'All' ? sites : sites.filter((s) => s.location.city === activeCity);

  return (
    <div className="bg-white dark:bg-[#191C24] rounded-2xl border border-slate-200 dark:border-[#2C2E33] shadow-sm overflow-hidden transition-colors mb-6">
      {/* City Switcher Tabs */}
      <div className="p-4 border-b border-slate-200 dark:border-[#2C2E33] flex flex-wrap items-center justify-between gap-3 bg-slate-50/70 dark:bg-slate-800/40">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[#AF1763]" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Interactive Spatial Corridors:
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {cities.map((city) => (
            <button
              key={city}
              onClick={() => {
                setActiveCity(city);
                const match = sites.find((s) => city === 'All' || s.location.city === city);
                if (match) setSelectedSite(match);
              }}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                activeCity === city
                  ? 'bg-gradient-to-r from-[#AF1763] to-[#0DCAF0] text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-[#2C2E33]'
              }`}
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 min-h-[480px]">
        {/* Left 2 Cols: Visual Geo Spatial Canvas */}
        <div className="lg:col-span-2 relative bg-slate-950 p-6 flex flex-col justify-between overflow-hidden">
          {/* Subtle Grid Map Background */}
          <div
            className="absolute inset-0 opacity-20 bg-[radial-gradient(#AF1763_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"
          />

          {/* Map Header */}
          <div className="relative z-10 flex items-center justify-between text-white mb-6">
            <div>
              <span className="text-[11px] font-mono text-[#0DCAF0] font-semibold uppercase tracking-wider">
                Geographic Dispersion
              </span>
              <h4 className="text-base font-bold">
                {activeCity === 'All' ? 'Pan-India Arterial Corridors' : `${activeCity} Media Network`}
              </h4>
            </div>
            <div className="text-xs text-slate-400 font-mono">
              {displayedSites.length} media nodes mapped
            </div>
          </div>

          {/* Spatial Node Grid */}
          <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 gap-3 my-auto">
            {displayedSites.map((site) => {
              const isSelected = selectedSite?.uid === site.uid;

              return (
                <button
                  key={site.uid}
                  onClick={() => setSelectedSite(site)}
                  className={`p-3.5 rounded-xl border text-left transition-all backdrop-blur-md ${
                    isSelected
                      ? 'bg-[#AF1763]/20 border-[#AF1763] ring-2 ring-[#AF1763]/30 text-white shadow-lg -translate-y-0.5'
                      : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 text-slate-300 hover:bg-slate-800/80'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    <span className="font-mono text-[10px] font-bold text-rose-200">
                      {site.uid}
                    </span>
                    <span
                      className={`w-2 h-2 rounded-full ${
                        site.status === 'Available'
                          ? 'bg-emerald-400'
                          : site.status === 'Booked'
                          ? 'bg-blue-400'
                          : 'bg-amber-400'
                      }`}
                    />
                  </div>
                  <h5 className="font-semibold text-xs line-clamp-1 text-white">
                    {site.site_name}
                  </h5>
                  <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                    {site.location.city} • {site.location.landmark || site.location.address}
                  </p>
                  <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-800 text-[10px]">
                    <span className="font-semibold text-rose-300">{formatINR(site.rate_per_month)}</span>
                    <span className="text-slate-400">{site.dimensions.total_sq_ft} sq ft</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Map Footer Info */}
          <div className="relative z-10 pt-4 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Available
              <span className="w-2 h-2 rounded-full bg-blue-400 ml-2"></span> Booked
              <span className="w-2 h-2 rounded-full bg-amber-400 ml-2"></span> Maintenance
            </span>
            <span className="font-mono">WGS-84 Coordinate Overlay</span>
          </div>
        </div>

        {/* Right Col: Selected Site Geo Dossier Panel */}
        <div className="p-6 bg-white dark:bg-[#191C24] flex flex-col justify-between">
          {selectedSite ? (
            <div>
              <div className="relative aspect-video rounded-xl overflow-hidden mb-4 border border-slate-200 dark:border-[#2C2E33] bg-slate-100 dark:bg-slate-800">
                <img
                  src={selectedSite.photographs[0]?.url || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80'}
                  alt={selectedSite.site_name}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-gradient-to-r from-[#AF1763] to-[#0DCAF0] text-white">
                  {selectedSite.uid}
                </span>
                <span className="absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold bg-black/60 backdrop-blur-sm text-white">
                  {selectedSite.category}
                </span>
              </div>

              <h4 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                {selectedSite.site_name}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-start gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#AF1763] shrink-0 mt-0.5" />
                <span>
                  {selectedSite.location.address}, {selectedSite.location.city},{' '}
                  {selectedSite.location.state}
                </span>
              </p>

              {/* Geo Specs List */}
              <div className="space-y-2 mt-4 pt-3 border-t border-slate-100 dark:border-[#2C2E33] text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Coordinates:</span>
                  <span className="font-mono font-medium text-slate-700 dark:text-slate-300">
                    {selectedSite.location.latitude.toFixed(4)}, {selectedSite.location.longitude.toFixed(4)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Display Surface:</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1">
                    <Maximize2 className="w-3 h-3 text-[#AF1763]" />
                    {selectedSite.dimensions.width}' × {selectedSite.dimensions.height}' ({selectedSite.dimensions.total_sq_ft} sq ft)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Illumination:</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    {selectedSite.illumination}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Monthly Commercial:</span>
                  <span className="font-extrabold text-[#AF1763] dark:text-[#0DCAF0]">
                    {formatINR(selectedSite.rate_per_month)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Traffic / Dwell:</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300 text-right max-w-[60%]">
                    {selectedSite.traffic_footfall || 'High density junction'}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 mt-6">
                <a
                  href={
                    selectedSite.location.google_maps_url ||
                    `https://maps.google.com/?q=${selectedSite.location.latitude},${selectedSite.location.longitude}`
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-[#2C2E33] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  <span>Google Maps</span>
                </a>
                <button
                  onClick={() => onViewDetails(selectedSite)}
                  className="px-3 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-[#AF1763] to-[#0DCAF0] hover:brightness-105 text-white flex items-center justify-center gap-1.5 shadow-sm transition-all"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Full Dossier</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-400 text-xs">
              Select a media node on the map to inspect
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
