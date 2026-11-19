import React, { useState } from 'react';
import { OOHSite } from '../types/ooh';
import { generateOOHPresentation } from '../services/pptxExport';
import { exportSitesToExcel } from '../services/excelExport';
import {
  X,
  Presentation,
  FileSpreadsheet,
  CheckCircle2,
  Sparkles,
  Loader2,
  Layers,
} from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSites: OOHSite[];
  filteredSites: OOHSite[];
  onShowToast: (title: string, message?: string, type?: 'success' | 'info' | 'error') => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  selectedSites,
  filteredSites,
  onShowToast,
}) => {
  const [exportType, setExportType] = useState<'pptx' | 'xlsx'>('pptx');
  const [scope, setScope] = useState<'selected' | 'filtered'>('selected');

  const [presentationTitle, setPresentationTitle] = useState(
    'Premium Out-Of-Home (OOH) Media Proposal'
  );
  const [clientName, setClientName] = useState('Tata Copper Plus & Brand Partners');
  const [agencyName, setAgencyName] = useState('BlitzDeck Media');
  const [includeCover, setIncludeCover] = useState(true);

  // Progress state
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 100, message: '' });

  if (!isOpen) return null;

  // Strict selection enforcement: if selectedSites > 0, strictly export selectedSites
  const sitesToExport = selectedSites.length > 0 ? selectedSites : filteredSites;

  const handleStartExport = async () => {
    if (sitesToExport.length === 0) {
      onShowToast('No Sites Selected', 'Please select or filter at least 1 site to export.', 'error');
      return;
    }

    setIsExporting(true);
    setProgress({ current: 0, total: sitesToExport.length + 2, message: 'Initializing pitch deck generation...' });

    try {
      if (exportType === 'pptx') {
        await generateOOHPresentation({
          sites: sitesToExport,
          presentationTitle,
          clientName,
          agencyName,
          includeCover,
          onProgress: (current, total, message) => {
            setProgress({ current, total, message });
          },
        });
        onShowToast(
          'Pitch Deck Downloaded',
          `Generated client presentation with ${sitesToExport.length} site slides.`,
          'success'
        );
      } else {
        // Excel
        setProgress({ current: 50, total: 100, message: 'Structuring master spreadsheet...' });
        exportSitesToExcel({
          sites: sitesToExport,
          fileName: 'OOH_Inventory_Export',
          campaignTitle: presentationTitle,
        });
        onShowToast(
          'Excel Export Complete',
          `Exported ${sitesToExport.length} sites with specs & summary analytics.`,
          'success'
        );
      }
      setTimeout(() => {
        setIsExporting(false);
        onClose();
      }, 500);
    } catch (err: any) {
      console.error('Export error:', err);
      setIsExporting(false);
      onShowToast('Export Failed', err.message || 'An error occurred during file generation.', 'error');
    }
  };

  const percent = progress.total > 0 ? Math.round((progress.current / progress.total) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-slate-950/70 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl rounded-3xl bg-white dark:bg-[#191C24] border border-slate-200 dark:border-[#2C2E33] shadow-2xl overflow-hidden my-auto transition-all">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:px-6 border-b border-slate-200 dark:border-[#2C2E33] bg-white/95 dark:bg-[#191C24]/95">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-[#AF1763] to-[#0DCAF0] text-white flex items-center justify-center shadow-md shadow-[#AF1763]/20">
              <Presentation className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Client Dossier & Export Engine
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Generate high-impact PowerPoint pitch deck (.pptx) or Excel audit sheet (.xlsx)
              </p>
            </div>
          </div>
          {!isExporting && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Form Body */}
        <div className="p-4 sm:p-6 space-y-5">
          {/* Format Selector: PPTX vs XLSX */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              Select Output Format:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setExportType('pptx')}
                className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                  exportType === 'pptx'
                    ? 'border-[#AF1763] bg-rose-50/60 dark:bg-rose-950/30 ring-2 ring-[#AF1763]/20'
                    : 'border-slate-200 dark:border-[#2C2E33] hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#AF1763] to-[#0DCAF0] text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Presentation className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">PowerPoint (.pptx)</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    1 Slide per site with high-res photo frames & specs
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setExportType('xlsx')}
                className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                  exportType === 'xlsx'
                    ? 'border-emerald-600 bg-emerald-50/60 dark:bg-emerald-950/40 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 dark:border-[#2C2E33] hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <FileSpreadsheet className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Excel Master (.xlsx)</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Full tabular data with executive KPI summary sheet
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Scope Banner */}
          <div className="p-3.5 rounded-2xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200/80 dark:border-[#AF1763]/40 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-[#AF1763] dark:text-[#0DCAF0] shrink-0" />
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  {selectedSites.length > 0
                    ? `Exporting Selected Sites Only (${selectedSites.length} sites)`
                    : `Exporting All Filtered Sites (${filteredSites.length} sites)`}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {selectedSites.length > 0
                    ? 'Strict selection mode: Only the sites you individually checked will be saved to your file.'
                    : 'Select specific sites with checkboxes to restrict your export, or export all currently filtered sites.'}
                </p>
              </div>
            </div>
            {selectedSites.length > 0 && (
              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-gradient-to-r from-[#AF1763] to-[#0DCAF0] text-white shadow-sm shrink-0 font-mono">
                {selectedSites.length} Selected
              </span>
            )}
          </div>

          {/* PPTX Specific Settings */}
          {exportType === 'pptx' && (
            <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-[#2C2E33]">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Deck Title
                </label>
                <input
                  type="text"
                  value={presentationTitle}
                  onChange={(e) => setPresentationTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-[#2C2E33] text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-[#AF1763]/30 focus:border-[#AF1763]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Client / Target Brand
                  </label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-[#2C2E33] text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-[#AF1763]/30 focus:border-[#AF1763]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Agency Footer
                  </label>
                  <input
                    type="text"
                    value={agencyName}
                    onChange={(e) => setAgencyName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-[#2C2E33] text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-[#AF1763]/30 focus:border-[#AF1763]"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 pt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeCover}
                  onChange={(e) => setIncludeCover(e.target.checked)}
                  className="rounded text-[#AF1763] focus:ring-[#AF1763]"
                />
                <span>Include Executive Cover Slide & Index Overview Table</span>
              </label>
            </div>
          )}

          {/* Live Progress Bar when generating */}
          {isExporting && (
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-[#AF1763]/40 space-y-2 animate-pulse">
              <div className="flex items-center justify-between text-xs font-bold text-rose-950 dark:text-rose-200">
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-[#AF1763]" />
                  <span>{progress.message || 'Generating proposal dossier...'}</span>
                </span>
                <span>{percent}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-rose-200 dark:bg-rose-900 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#AF1763] to-[#0DCAF0] transition-all duration-300"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 sm:px-6 border-t border-slate-200 dark:border-[#2C2E33] bg-slate-50 dark:bg-[#222631]">
          <span className="text-xs text-slate-500">
            Exporting <strong>{sitesToExport.length}</strong> site profile{sitesToExport.length !== 1 ? 's' : ''}
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={isExporting}
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isExporting}
              onClick={handleStartExport}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-[#AF1763] to-[#0DCAF0] hover:brightness-105 text-white shadow-md shadow-[#AF1763]/25 flex items-center gap-1.5 disabled:opacity-50 transition-all"
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating Deck...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Download {exportType.toUpperCase()}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
