import React from 'react';

interface LogoProps {
  className?: string;
  isDark?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

/**
 * High-fidelity vector SVG representation of the official Interspace "is" emblem
 * with the signature magenta-to-sunset gradient (#E31B64 -> #F37023).
 */
export const InterspaceMotif: React.FC<{
  className?: string;
  size?: number | string;
  variant?: 'gradient' | 'white' | 'circle';
}> = ({ className = '', size = 32, variant = 'gradient' }) => {
  if (variant === 'circle') {
    return (
      <img
        src="/assets/logos/interspace-icon-circle.png"
        alt="Interspace Emblem"
        className={`rounded-full object-cover shrink-0 ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={`shrink-0 ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="isBrandGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#E31B64" />
          <stop offset="50%" stopColor="#E63946" />
          <stop offset="100%" stopColor="#F37023" />
        </linearGradient>
        <linearGradient id="isBrandGlow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E31B64" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#F37023" stopOpacity="0.8" />
        </linearGradient>
      </defs>

      {/* Top slanted pill dot */}
      <rect
        x="54"
        y="8"
        width="16"
        height="12"
        rx="6"
        transform="rotate(-28 54 8)"
        fill={variant === 'white' ? '#FFFFFF' : 'url(#isBrandGrad)'}
      />

      {/* Upper slanted bar ('i' stem) */}
      <rect
        x="36"
        y="23"
        width="22"
        height="56"
        rx="11"
        transform="rotate(-28 36 23)"
        fill={variant === 'white' ? '#FFFFFF' : 'url(#isBrandGrad)'}
      />

      {/* Lower interlocking stroke ('s' curve) */}
      <path
        d="M 45 42 L 56 36 C 65 31 74 38 72 49 L 52 87 C 50 91 44 93 40 91 L 32 87 C 28 85 27 80 29 76 L 39 57 C 41 53 43 47 45 42 Z"
        fill={variant === 'white' ? '#FFFFFF' : 'url(#isBrandGrad)'}
      />
    </svg>
  );
};

/**
 * Official Interspace Communications Logo Lockup
 */
export const InterspaceLogo: React.FC<LogoProps> = ({
  className = '',
  isDark = false,
  size = 'md',
}) => {
  const heightClass =
    size === 'sm'
      ? 'h-7'
      : size === 'md'
      ? 'h-9'
      : size === 'lg'
      ? 'h-11'
      : 'h-14';

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {isDark ? (
        <img
          src="/assets/logos/interspace-logo-dark.png"
          alt="Interspace Communications"
          className={`${heightClass} object-contain`}
        />
      ) : (
        <img
          src="/assets/logos/interspace-logo-light.jpg"
          alt="Interspace Communications"
          className={`${heightClass} object-contain rounded-sm`}
        />
      )}
    </div>
  );
};

/**
 * Branded Logo Lockup for "Interspace Advantage" (Planning & Data Retrieval)
 */
export const InterspaceAdvantageLogo: React.FC<{
  className?: string;
  isDark?: boolean;
  withTagline?: boolean;
}> = ({ className = '', isDark = false, withTagline = true }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative group shrink-0">
        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-[#E31B64] via-[#E63946] to-[#F37023] p-[2px] shadow-lg shadow-rose-500/20">
          <div className="w-full h-full rounded-[14px] bg-white dark:bg-slate-900 flex items-center justify-center overflow-hidden">
            <img
              src="/assets/logos/interspace-icon-circle.png"
              alt="Interspace Icon"
              className="w-8 h-8 rounded-full object-cover"
            />
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="font-extrabold text-base sm:text-xl tracking-tight text-slate-900 dark:text-white">
            INTERSPACE
          </span>
          <span className="font-black text-base sm:text-xl tracking-tight bg-gradient-to-r from-[#E31B64] to-[#F37023] bg-clip-text text-transparent">
            ADVANTAGE
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
 * Branded Logo Lockup for "Interspace DataBoss" (Data Input, Bulk Upload & Save Vault)
 */
export const InterspaceDataBossLogo: React.FC<{
  className?: string;
  isDark?: boolean;
  withTagline?: boolean;
}> = ({ className = '', isDark = false, withTagline = true }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative group shrink-0">
        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-[#F37023] via-[#E63946] to-[#E31B64] p-[2px] shadow-lg shadow-orange-500/20">
          <div className="w-full h-full rounded-[14px] bg-white dark:bg-slate-900 flex items-center justify-center overflow-hidden">
            <InterspaceMotif size={24} variant="gradient" />
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="font-extrabold text-base sm:text-xl tracking-tight text-slate-900 dark:text-white">
            INTERSPACE
          </span>
          <span className="font-black text-base sm:text-xl tracking-tight bg-gradient-to-r from-[#F37023] to-[#E31B64] bg-clip-text text-transparent">
            DATABOSS
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
 * ICR&A Analytics Badge (Magnifying Glass + Node Network Motif)
 */
export const IcraAnalyticsBadge: React.FC<{
  className?: string;
  size?: number;
}> = ({ className = '', size = 36 }) => {
  return (
    <div
      className={`inline-flex items-center gap-2 p-1.5 rounded-xl bg-white dark:bg-slate-900 border border-rose-100 dark:border-rose-950/60 shadow-sm ${className}`}
    >
      <img
        src="/assets/logos/icra-analytics-logo.png"
        alt="ICR&A Analytics"
        className="rounded-lg object-contain shrink-0"
        style={{ width: size, height: size }}
      />
      <div className="text-left pr-2">
        <span className="block text-[11px] font-bold text-slate-900 dark:text-white leading-tight">
          ICR&A Powered
        </span>
        <span className="block text-[9px] text-slate-500 font-medium">
          OOH Research & Analytics
        </span>
      </div>
    </div>
  );
};

/**
 * Subtle Background Brand Motif (Subtle angled watermarks)
 */
export const SubtleBrandWatermark: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div
      className={`absolute inset-0 pointer-events-none opacity-[0.025] dark:opacity-[0.04] overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <svg width="100%" height="100%">
        <pattern
          id="isBrandPattern"
          width="160"
          height="160"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(-25)"
        >
          <rect x="20" y="20" width="30" height="80" rx="15" fill="#E31B64" />
          <rect x="70" y="50" width="30" height="90" rx="15" fill="#F37023" />
        </pattern>
        <rect width="100%" height="100%" fill="url(#isBrandPattern)" />
      </svg>
    </div>
  );
};
