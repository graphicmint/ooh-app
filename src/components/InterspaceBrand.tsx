import React from 'react';
import { Zap, RefreshCw, Layers } from 'lucide-react';

interface LogoProps {
  className?: string;
  isDark?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

/**
 * Geometric OOH Suite emblem motif (replacing legacy agency emblem)
 */
export const InterspaceMotif: React.FC<{
  className?: string;
  size?: number | string;
  variant?: 'gradient' | 'white' | 'circle';
}> = ({ className = '', size = 32, variant = 'gradient' }) => {
  const numSize = typeof size === 'number' ? size : 24;
  return (
    <svg
      viewBox="0 0 100 100"
      width={numSize}
      height={numSize}
      className={`shrink-0 ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="suiteBrandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E31B64" />
          <stop offset="50%" stopColor="#E63946" />
          <stop offset="100%" stopColor="#F37023" />
        </linearGradient>
      </defs>
      <rect
        x="12"
        y="12"
        width="76"
        height="76"
        rx="22"
        fill={variant === 'white' ? 'rgba(255,255,255,0.2)' : 'url(#suiteBrandGrad)'}
      />
      <path
        d="M54 24L32 54H49L45 76L68 46H51L54 24Z"
        fill="#FFFFFF"
        stroke="#FFFFFF"
        strokeWidth="3"
        strokeLinejoin="round"
      />
    </svg>
  );
};

/**
 * Branded Suite Lockup for Landing Hub & Login Page
 */
export const InterspaceLogo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
}) => {
  const iconBox =
    size === 'sm'
      ? 'w-7 h-7 rounded-lg'
      : size === 'md'
      ? 'w-9 h-9 rounded-xl'
      : size === 'lg'
      ? 'w-11 h-11 rounded-2xl'
      : 'w-14 h-14 rounded-2xl';

  const textSize =
    size === 'sm'
      ? 'text-base'
      : size === 'md'
      ? 'text-lg'
      : size === 'lg'
      ? 'text-2xl'
      : 'text-3xl';

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div
        className={`${iconBox} bg-gradient-to-tr from-[#E31B64] via-[#E63946] to-[#F37023] text-white flex items-center justify-center shadow-md shadow-rose-500/20 shrink-0`}
      >
        <Layers className="w-1/2 h-1/2 stroke-[2.5]" />
      </div>
      <div className="flex items-center gap-1.5">
        <span className={`font-black tracking-tight text-slate-900 dark:text-white ${textSize}`}>
          Blitz<span className="bg-gradient-to-r from-[#E31B64] to-[#F37023] bg-clip-text text-transparent">Deck</span>
        </span>
        <span className="text-slate-300 dark:text-slate-600 font-light">/</span>
        <span className={`font-black tracking-tight text-slate-900 dark:text-white ${textSize}`}>
          Site<span className="bg-gradient-to-r from-[#F37023] to-[#E31B64] bg-clip-text text-transparent">Sync</span>
        </span>
      </div>
    </div>
  );
};

/**
 * Branded Logo Lockup for "BlitzDeck" (Planning & Data Retrieval)
 */
export const InterspaceAdvantageLogo: React.FC<{
  className?: string;
  isDark?: boolean;
  withTagline?: boolean;
}> = ({ className = '', withTagline = true }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative group shrink-0">
        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-[#E31B64] via-[#E63946] to-[#F37023] p-[2px] shadow-lg shadow-rose-500/20">
          <div className="w-full h-full rounded-[14px] bg-white dark:bg-slate-900 flex items-center justify-center overflow-hidden">
            <Zap className="w-5 h-5 text-[#E31B64] fill-[#E31B64]/15 stroke-[2.4]" />
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="font-extrabold text-base sm:text-xl tracking-tight text-slate-900 dark:text-white">
            BLITZ
          </span>
          <span className="font-black text-base sm:text-xl tracking-tight bg-gradient-to-r from-[#E31B64] to-[#F37023] bg-clip-text text-transparent -ml-1.5">
            DECK
          </span>
          <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-rose-50 text-[#E31B64] dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200/60 dark:border-rose-900/40">
            Planning & Retrieval
          </span>
        </div>

        {withTagline && (
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium tracking-wide">
            Media Planning, GIS Corridors & Pitch Intelligence
          </p>
        )}
      </div>
    </div>
  );
};

/**
 * Branded Logo Lockup for "SiteSync" (Data Input, Bulk Upload & Save Vault)
 */
export const InterspaceDataBossLogo: React.FC<{
  className?: string;
  isDark?: boolean;
  withTagline?: boolean;
}> = ({ className = '', withTagline = true }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative group shrink-0">
        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-[#F37023] via-[#E63946] to-[#E31B64] p-[2px] shadow-lg shadow-orange-500/20">
          <div className="w-full h-full rounded-[14px] bg-white dark:bg-slate-900 flex items-center justify-center overflow-hidden">
            <RefreshCw className="w-5 h-5 text-[#F37023] stroke-[2.4]" />
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="font-extrabold text-base sm:text-xl tracking-tight text-slate-900 dark:text-white">
            SITE
          </span>
          <span className="font-black text-base sm:text-xl tracking-tight bg-gradient-to-r from-[#F37023] to-[#E31B64] bg-clip-text text-transparent -ml-1.5">
            SYNC
          </span>
          <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-amber-50 text-[#F37023] dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200/60 dark:border-amber-900/40">
            Master Data Vault
          </span>
        </div>

        {withTagline && (
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium tracking-wide">
            Spreadsheet Ingestion, Dynamic UID & Vendor Master
          </p>
        )}
      </div>
    </div>
  );
};

/**
 * Subtle Background Pattern Watermark
 */
export const SubtleBrandWatermark: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div
      className={`absolute inset-0 pointer-events-none opacity-[0.025] dark:opacity-[0.04] overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <svg width="100%" height="100%">
        <pattern
          id="suiteBrandPattern"
          width="160"
          height="160"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(-25)"
        >
          <rect x="20" y="20" width="30" height="80" rx="15" fill="#E31B64" />
          <rect x="70" y="50" width="30" height="90" rx="15" fill="#F37023" />
        </pattern>
        <rect width="100%" height="100%" fill="url(#suiteBrandPattern)" />
      </svg>
    </div>
  );
};
