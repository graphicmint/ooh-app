import React from 'react';
import {
  Plus,
  Megaphone,
  FileSpreadsheet,
  Presentation,
  RotateCcw,
  Moon,
  Sun,
  Home,
  ArrowRight,
  LogOut,
  Zap,
  RefreshCw,
} from 'lucide-react';
import { AuthUser } from '../types/auth';
import {
  InterspaceAdvantageLogo,
  InterspaceDataBossLogo,
  InterspaceLogo,
} from './InterspaceBrand';

interface NavbarProps {
  currentPortal: 'landing' | 'advantage' | 'databoss';
  onSelectPortal: (portal: 'landing' | 'advantage' | 'databoss') => void;
  onAddSite: () => void;
  onAddCampaign?: () => void;
  onExportExcel: () => void;
  onOpenPptModal: () => void;
  onResetData: () => void;
  isDark: boolean;
  onToggleDark: () => void;
  selectedCount: number;
  totalFiltered: number;
  user?: AuthUser | null;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPortal,
  onSelectPortal,
  onAddSite,
  onAddCampaign,
  onExportExcel,
  onOpenPptModal,
  onResetData,
  isDark,
  onToggleDark,
  selectedCount,
  totalFiltered,
  user,
  onLogout,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#191C24]/95 backdrop-blur-md border-b border-slate-200 dark:border-[#2C2E33] transition-colors shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Logo & Portal Branding */}
          <div className="flex items-center gap-3.5 shrink-0">
            <div
              onClick={() => onSelectPortal('landing')}
              className="cursor-pointer group select-none"
              title="Return to Portal Hub"
            >
              {currentPortal === 'advantage' ? (
                <InterspaceAdvantageLogo isDark={isDark} />
              ) : currentPortal === 'databoss' ? (
                <InterspaceDataBossLogo isDark={isDark} />
              ) : (
                <div className="flex items-center gap-3">
                  <InterspaceLogo isDark={isDark} size="md" />
                  <div className="hidden sm:block border-l border-slate-200 dark:border-[#2C2E33] pl-3">
                    <span className="text-[11px] font-black uppercase tracking-widest text-[#AF1763] dark:text-[#e84c96]">
                      OOH Enterprise Suite
                    </span>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                      Outdoor Media Architecture
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Central Portal Switcher Navigation Pill */}
          <div className="hidden lg:flex items-center p-1 rounded-2xl bg-slate-100 dark:bg-[#0F1117] border border-slate-200 dark:border-[#2C2E33] text-xs font-bold shadow-inner">
            <button
              onClick={() => onSelectPortal('landing')}
              className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all ${
                currentPortal === 'landing'
                  ? 'bg-white dark:bg-[#191C24] text-slate-900 dark:text-white shadow-sm ring-1 ring-slate-200 dark:ring-[#2C2E33]'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Home className="w-3.5 h-3.5 text-slate-400" />
              <span>Portal Hub</span>
            </button>

            <button
              onClick={() => onSelectPortal('advantage')}
              className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all ${
                currentPortal === 'advantage'
                  ? 'bg-gradient-to-r from-[#AF1763] to-[#d63384] text-white shadow-md shadow-[#AF1763]/30'
                  : 'text-slate-600 dark:text-slate-400 hover:text-[#AF1763] dark:hover:text-[#f472b6]'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>BlitzDeck</span>
            </button>

            <button
              onClick={() => onSelectPortal('databoss')}
              className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all ${
                currentPortal === 'databoss'
                  ? 'bg-gradient-to-r from-[#0D6EFD] to-[#0DCAF0] text-white shadow-md shadow-[#0DCAF0]/25'
                  : 'text-slate-600 dark:text-slate-400 hover:text-[#0DCAF0]'
              }`}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>SiteSync</span>
            </button>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Quick Switcher for Mobile */}
            <div className="flex lg:hidden items-center">
              {currentPortal === 'landing' ? (
                <button
                  onClick={() => onSelectPortal('advantage')}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-[#AF1763] text-white flex items-center gap-1"
                >
                  <span>BlitzDeck</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              ) : currentPortal === 'advantage' ? (
                <button
                  onClick={() => onSelectPortal('databoss')}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-[#0DCAF0] text-[#0F1117] flex items-center gap-1"
                >
                  <span>SiteSync</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              ) : (
                <button
                  onClick={() => onSelectPortal('advantage')}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-[#AF1763] text-white flex items-center gap-1"
                >
                  <span>BlitzDeck</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Portal Hub Return Button */}
            {currentPortal !== 'landing' && (
              <button
                onClick={() => onSelectPortal('landing')}
                title="Return to Portal Hub"
                className="p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#222631] hover:text-[#AF1763] dark:hover:text-white transition-colors flex items-center gap-1.5 border border-slate-200 dark:border-[#2C2E33]"
              >
                <Home className="w-3.5 h-3.5 text-slate-400" />
                <span className="hidden sm:inline">Hub</span>
              </button>
            )}

            {/* Reset Seed Data */}
            <button
              onClick={onResetData}
              title="Reset to default seed portfolio"
              className="p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#222631] transition-colors flex items-center gap-1.5 border border-slate-200 dark:border-[#2C2E33]"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden xl:inline">Reset</span>
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={onToggleDark}
              className="p-2 sm:px-2.5 sm:py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#222631] transition-colors border border-slate-200 dark:border-[#2C2E33]"
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? <Sun className="w-4 h-4 text-[#FFC107]" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* BLITZDECK PORTAL SPECIFIC ACTIONS */}
            {currentPortal === 'advantage' && (
              <>
                {/* Excel Export Button */}
                <button
                  onClick={onExportExcel}
                  className="px-3 py-2 rounded-xl text-xs font-semibold bg-[#0DCAF0]/10 text-[#0aa2c0] dark:text-[#0DCAF0] border border-[#0DCAF0]/30 hover:bg-[#0DCAF0]/20 transition-all flex items-center gap-1.5 shadow-sm"
                  title={`Export ${selectedCount > 0 ? selectedCount + ' selected' : totalFiltered + ' filtered'} sites to Excel`}
                >
                  <FileSpreadsheet className="w-4 h-4 text-[#0DCAF0]" />
                  <span className="hidden sm:inline">Excel</span>
                  <span className="text-[10px] px-1.5 py-0.2 bg-[#0DCAF0]/20 rounded font-mono font-bold text-[#0aa2c0] dark:text-[#0DCAF0]">
                    {selectedCount > 0 ? selectedCount : totalFiltered}
                  </span>
                </button>

                {/* PPTX Pitch Deck Button */}
                <button
                  onClick={onOpenPptModal}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-[#AF1763] to-[#d63384] hover:brightness-110 text-white shadow-md shadow-[#AF1763]/30 transition-all flex items-center gap-1.5"
                  title="Generate client-ready PowerPoint presentation"
                >
                  <Presentation className="w-4 h-4" />
                  <span className="hidden sm:inline">
                    {selectedCount > 0 ? 'Pitch Deck' : 'PPT Deck'}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 bg-white/20 rounded font-mono font-bold text-white">
                    {selectedCount > 0 ? selectedCount : totalFiltered}
                  </span>
                </button>
              </>
            )}

            {/* ADD CAMPAIGN BUTTON */}
            {onAddCampaign && (
              <button
                type="button"
                onClick={onAddCampaign}
                className="px-3.5 py-2 rounded-xl text-xs font-bold border border-[#0D6EFD]/40 bg-[#0D6EFD]/10 hover:bg-[#0D6EFD]/20 text-[#0D6EFD] dark:text-[#5ca0ff] flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                title="Log a new brand campaign under an existing site UID"
              >
                <Megaphone className="w-4 h-4 stroke-[2.2]" />
                <span className="hidden sm:inline">Add Campaign</span>
              </button>
            )}

            {/* ADD SITE BUTTON (Emerald Green CTA matching reference dashboard) */}
            <button
              onClick={onAddSite}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#198754] hover:bg-[#157347] text-white shadow-md shadow-[#198754]/25 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Add Site</span>
            </button>

            {/* USER PROFILE & LOGOUT */}
            {user && (
              <div className="relative group pl-1">
                <button
                  type="button"
                  className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1.5 rounded-xl border border-slate-200 dark:border-[#2C2E33] bg-slate-50 dark:bg-[#0F1117] hover:border-[#AF1763]/60 transition-all text-left cursor-pointer"
                  title={`${user.name} (${user.email})`}
                >
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-r from-[#AF1763] to-[#0D6EFD] text-white flex items-center justify-center font-black text-xs shadow-xs shrink-0">
                    {user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <div className="hidden xl:block">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">
                      {user.name}
                    </p>
                    <p className="text-[10px] text-slate-400 font-medium leading-none truncate max-w-[140px]">
                      {user.email}
                    </p>
                  </div>
                </button>

                {/* Dropdown Menu on hover / focus */}
                <div className="absolute right-0 mt-1 w-64 p-3 bg-white dark:bg-[#191C24] border border-slate-200 dark:border-[#2C2E33] rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  <div className="space-y-1 pb-2.5 mb-2.5 border-b border-slate-100 dark:border-[#2C2E33]">
                    <p className="text-xs font-bold text-slate-900 dark:text-white">
                      {user.name}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono break-all">
                      {user.email}
                    </p>
                    <div className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-[#AF1763]/15 text-[#AF1763] dark:text-[#f472b6]">
                      {user.role}
                    </div>
                  </div>

                  {onLogout && (
                    <button
                      onClick={onLogout}
                      className="w-full px-3 py-2 rounded-xl text-xs font-semibold text-[#AB2E3C] dark:text-[#f05668] hover:bg-[#AB2E3C]/10 flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
