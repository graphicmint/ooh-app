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
      accentText: 'text-[#0D6EFD]',
      accentBg: 'bg-[#0D6EFD]/15',
      active: currentStatusFilter === 'all' || currentStatusFilter === 'All',
      filterVal: 'All',
    },
    {
      id: 'Available',
      label: 'Available (Vacant)',
      value: availableSites,
      sub: `${Math.round((availableSites / (totalSites || 1)) * 100)}% Available`,
      icon: CheckCircle2,
      accentText: 'text-[#198754] dark:text-[#20c975]',
      accentBg: 'bg-[#198754]/15',
      active: currentStatusFilter === 'Available',
      filterVal: 'Available',
    },
    {
      id: 'Booked',
      label: 'Booked / Active',
      value: bookedSites,
      sub: 'Generating Revenue',
      icon: Clock,
      accentText: 'text-[#0DCAF0]',
      accentBg: 'bg-[#0DCAF0]/15',
      active: currentStatusFilter === 'Booked',
      filterVal: 'Booked',
    },
    {
      id: 'Maintenance',
      label: 'Maintenance',
      value: maintenanceSites,
      sub: 'Inspection & Repair',
      icon: AlertTriangle,
      accentText: 'text-[#FFC107]',
      accentBg: 'bg-[#FFC107]/15',
      active: currentStatusFilter === 'Maintenance',
      filterVal: 'Maintenance',
    },
    {
      id: 'area',
      label: 'Total Surface Area',
      value: totalSqFt.toLocaleString() + ' sq ft',
      sub: 'Display Media Footprint',
      icon: Maximize2,
      accentText: 'text-[#AF1763] dark:text-[#e84c96]',
      accentBg: 'bg-[#AF1763]/15',
      active: false,
      filterVal: null,
    },
    {
      id: 'revenue',
      label: 'Monthly Portfolio',
      value: formatINR(totalMonthlyVal),
      sub: 'Potential Monthly Gross',
      icon: Coins,
      accentText: 'text-[#AB2E3C] dark:text-[#f05668]',
      accentBg: 'bg-[#AB2E3C]/15',
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
                ? 'bg-white dark:bg-[#191C24] border-[#AF1763] ring-2 ring-[#AF1763]/25 shadow-md'
                : 'bg-white dark:bg-[#191C24] border-slate-200 dark:border-[#2C2E33] hover:border-[#AF1763]/50'
            }`}
          >
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {stat.label}
              </span>
              <span className={`w-7 h-7 rounded-lg flex items-center justify-center ${stat.accentBg}`}>
                <Icon className={`w-4 h-4 ${stat.accentText}`} />
              </span>
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
