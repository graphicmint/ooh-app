import React from 'react';
import { OOHSite } from '../types/ooh';
import { formatINR } from '../utils/formatters';
import { CheckCircle2, Clock, AlertTriangle, Maximize2, Coins, MapPin } from 'lucide-react';

interface StatsBarProps {
  sites: OOHSite[];
  currentStatusFilter: string;
  onSelectStatusFilter: (status: string) => void;
}

export const StatsBar: React.FC<StatsBarProps> = ({
  sites,
  currentStatusFilter,
  onSelectStatusFilter,
}) => {
  const totalSites = sites.length;
  const availableSites = sites.filter((s) => s.status === 'Available').length;
  const bookedSites = sites.filter((s) => s.status === 'Booked').length;
  const maintenanceSites = sites.filter((s) => s.status === 'Maintenance').length;

  const totalSqFt = sites.reduce((sum, s) => sum + s.dimensions.total_sq_ft, 0);
  const totalMonthlyVal = sites.reduce((sum, s) => sum + s.rate_per_month, 0);

  const stats = [
    {
      id: 'all',
      label: 'Total Inventory',
      value: totalSites,
      sub: `${Array.from(new Set(sites.map((s) => s.location.city))).length} Metro Cities`,
      icon: MapPin,
      color: 'rose',
      active: currentStatusFilter === 'all' || currentStatusFilter === 'All',
      filterVal: 'All',
    },
    {
      id: 'Available',
      label: 'Available (Vacant)',
      value: availableSites,
      sub: `${Math.round((availableSites / (totalSites || 1)) * 100)}% Available`,
      icon: CheckCircle2,
      color: 'emerald',
      active: currentStatusFilter === 'Available',
      filterVal: 'Available',
    },
    {
      id: 'Booked',
      label: 'Booked / Active',
      value: bookedSites,
      sub: 'Generating Revenue',
      icon: Clock,
      color: 'sunset',
      active: currentStatusFilter === 'Booked',
      filterVal: 'Booked',
    },
    {
      id: 'Maintenance',
      label: 'Maintenance',
      value: maintenanceSites,
      sub: 'Inspection & Repair',
      icon: AlertTriangle,
      color: 'amber',
      active: currentStatusFilter === 'Maintenance',
      filterVal: 'Maintenance',
    },
    {
      id: 'area',
      label: 'Total Surface Area',
      value: totalSqFt.toLocaleString() + ' sq ft',
      sub: 'Display Media Footprint',
      icon: Maximize2,
      color: 'rose',
      active: false,
      filterVal: null,
    },
    {
      id: 'revenue',
      label: 'Monthly Portfolio',
      value: formatINR(totalMonthlyVal),
      sub: 'Potential Monthly Gross',
      icon: Coins,
      color: 'sunset',
      active: false,
      filterVal: null,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 my-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        const isClickable = stat.filterVal !== null;

        return (
          <button
            key={stat.id}
            type="button"
            disabled={!isClickable}
            onClick={() => stat.filterVal && onSelectStatusFilter(stat.filterVal)}
            className={`text-left p-4 rounded-xl border transition-all ${
              isClickable ? 'cursor-pointer hover:shadow-md' : 'cursor-default'
            } ${
              stat.active
                ? 'bg-white dark:bg-slate-800 border-[#E31B64] dark:border-rose-400 ring-2 ring-[#E31B64]/20 shadow-md'
                : 'bg-white/80 dark:bg-slate-900/80 border-slate-200/90 dark:border-slate-800/90 hover:border-rose-200 dark:hover:border-rose-900/60'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {stat.label}
              </span>
              <Icon
                className={`w-4 h-4 ${
                  stat.color === 'emerald'
                    ? 'text-emerald-500'
                    : stat.color === 'sunset'
                    ? 'text-[#F37023]'
                    : stat.color === 'amber'
                    ? 'text-amber-500'
                    : 'text-[#E31B64]'
                }`}
              />
            </div>
            <div className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              {stat.value}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 truncate">
              {stat.sub}
            </div>
          </button>
        );
      })}
    </div>
  );
};
