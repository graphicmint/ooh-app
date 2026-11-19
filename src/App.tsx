import { useState, useEffect, useMemo } from 'react';
import type { OOHSite } from './types/ooh';
import type { AuthUser } from './types/auth';
import { storageService } from './services/storage';
import { authService } from './services/auth';
import { consolidateSitesByUid } from './utils/consolidateSites';
import { Navbar } from './components/Navbar';
import { LandingHub } from './components/LandingHub';
import { DataBossStudio } from './components/DataBossStudio';
import { LoginPage } from './components/LoginPage';
import { StatsBar } from './components/StatsBar';
import { FilterToolbar, type ViewMode } from './components/FilterToolbar';
import { SiteCard } from './components/SiteCard';
import { SiteTable } from './components/SiteTable';
import { SiteMapView } from './components/SiteMapView';
import { SiteModal } from './components/SiteModal';
import { SiteFormModal } from './components/SiteFormModal';
import { AddCampaignModal } from './components/AddCampaignModal';
import { ExportModal } from './components/ExportModal';
import { ToastContainer, type ToastMessage, type ToastType } from './components/Toast';
import { exportSitesToExcel } from './services/excelExport';
import { generateOOHPresentation } from './services/pptxExport';
import {
  FileSpreadsheet,
  Presentation,
  CheckSquare,
  Plus,
  Loader2,
  Inbox,
} from 'lucide-react';

export function App() {
  const [sites, setSites] = useState<OOHSite[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Always start on the Login Page on initial load
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    authService.clearSession();
    return null;
  });

  // Active Portal State ('landing' | 'advantage' | 'databoss')
  const [activePortal, setActivePortal] = useState<'landing' | 'advantage' | 'databoss'>('landing');

  const handleSelectPortal = (portal: 'landing' | 'advantage' | 'databoss') => {
    setActivePortal(portal);
    if (typeof window !== 'undefined') {
      localStorage.setItem('blitzdeck_active_portal', portal);
    }
  };

  // Dynamic Lists for Filters
  const [storedCategories, setStoredCategories] = useState<string[]>([]);
  const [storedVendors, setStoredVendors] = useState<string[]>([]);

  // Dark Mode State (defaults to dark to match the #191C24 / #AF1763 dashboard scheme)
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('blitzdeck_theme_v2');
      if (saved === 'light') return false;
      return true;
    }
    return true;
  });

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedClientCategory, setSelectedClientCategory] = useState('All');
  const [selectedVendor, setSelectedVendor] = useState('All');
  const [selectedIllumination, setSelectedIllumination] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedCity, setSelectedCity] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  // Selection State for Bulk Operations
  const [selectedUids, setSelectedUids] = useState<string[]>([]);

  // Modals State
  const [inspectedSite, setInspectedSite] = useState<OOHSite | null>(null);
  const [isSiteModalOpen, setIsSiteModalOpen] = useState(false);

  const [formMode, setFormMode] = useState<'add' | 'edit' | 'clone'>('add');
  const [siteToEdit, setSiteToEdit] = useState<OOHSite | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Campaign Modal State
  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);
  const [campaignTargetUid, setCampaignTargetUid] = useState<string | undefined>(undefined);

  const handleOpenAddCampaign = (uid?: string) => {
    setCampaignTargetUid(uid);
    setIsCampaignModalOpen(true);
  };

  const handleCampaignAdded = (updatedSite: OOHSite) => {
    setSites((prev) =>
      consolidateSitesByUid(prev.map((s) => (s.uid === updatedSite.uid ? updatedSite : s)))
    );
    if (inspectedSite && inspectedSite.uid === updatedSite.uid) {
      setInspectedSite(updatedSite);
    }
    loadSitesAndMasters();
  };

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (title: string, message?: string, type: ToastType = 'info') => {
    const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).slice(2, 5);
    setToasts((prev) => [...prev, { id, title, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sync dark mode class
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('blitzdeck_theme_v2', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('blitzdeck_theme_v2', 'light');
    }
  }, [isDark]);

  // Load sites and dynamic master data
  const loadSitesAndMasters = async () => {
    setIsLoading(true);
    try {
      const data = await storageService.getAllSites();
      setSites(consolidateSitesByUid(data));

      const cats = await storageService.getClientCategories();
      setStoredCategories(cats);

      const vens = await storageService.getVendors();
      setStoredVendors(vens.map((v) => v.name));
    } catch (err) {
      console.error('Failed to load sites:', err);
      addToast('Error Loading Inventory', 'Failed to retrieve sites from database.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSitesAndMasters();
  }, []);

  // Unique cities from dataset
  const availableCities = useMemo(() => {
    return Array.from(new Set(sites.map((s) => s.location.city))).sort();
  }, [sites]);

  // Combined client categories (stored + current brand category + all historical campaign categories)
  const availableClientCategories = useMemo(() => {
    const fromSites = sites.map((s) => s.client_category).filter(Boolean) as string[];
    const fromCampaigns = sites.flatMap(
      (s) => s.campaign_history?.map((c) => c.client_category).filter(Boolean) || []
    ) as string[];
    return Array.from(new Set([...storedCategories, ...fromSites, ...fromCampaigns])).sort();
  }, [sites, storedCategories]);

  // Combined vendors (stored + any present in current sites)
  const availableVendors = useMemo(() => {
    const fromSites = sites.map((s) => s.vendor_name).filter(Boolean) as string[];
    return Array.from(new Set([...storedVendors, ...fromSites])).sort();
  }, [sites, storedVendors]);

  // Filtered & Sorted Sites (Guaranteed single consolidated card per UID)
  const filteredSites = useMemo(() => {
    return sites
      .filter((site) => {
        // Search query across UID, site name, location, brand, vendor, and all associated campaigns
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchUid = site.uid.toLowerCase().includes(q);
          const matchName = site.site_name.toLowerCase().includes(q);
          const matchCity = site.location.city.toLowerCase().includes(q);
          const matchAddr = site.location.address.toLowerCase().includes(q);
          const matchLandmark = (site.location.landmark || '').toLowerCase().includes(q);
          const matchBrand = (site.client_current_brand || '').toLowerCase().includes(q);
          const matchClientCat = (site.client_category || '').toLowerCase().includes(q);
          const matchVendor = (site.vendor_name || '').toLowerCase().includes(q);
          const matchCampaigns = site.campaign_history?.some(
            (c) =>
              c.client_name.toLowerCase().includes(q) ||
              c.client_category.toLowerCase().includes(q) ||
              (c.campaign_name && c.campaign_name.toLowerCase().includes(q))
          );

          if (
            !matchUid &&
            !matchName &&
            !matchCity &&
            !matchAddr &&
            !matchLandmark &&
            !matchBrand &&
            !matchClientCat &&
            !matchVendor &&
            !matchCampaigns
          ) {
            return false;
          }
        }

        // Media Category
        if (selectedCategory !== 'All' && site.category !== selectedCategory) {
          return false;
        }

        // Client Industry Category (checks current brand and any grouped campaign category)
        if (selectedClientCategory !== 'All') {
          const matchesCurrent = site.client_category === selectedClientCategory;
          const matchesCampaign = site.campaign_history?.some(
            (c) => c.client_category === selectedClientCategory
          );
          if (!matchesCurrent && !matchesCampaign) {
            return false;
          }
        }

        // Site Owning Vendor
        if (selectedVendor !== 'All' && site.vendor_name !== selectedVendor) {
          return false;
        }

        // Illumination
        if (selectedIllumination !== 'All' && site.illumination !== selectedIllumination) {
          return false;
        }

        // Status
        if (selectedStatus !== 'All' && site.status !== selectedStatus) {
          return false;
        }

        // City
        if (selectedCity !== 'All' && site.location.city !== selectedCity) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'rate_desc') return b.rate_per_month - a.rate_per_month;
        if (sortBy === 'rate_asc') return a.rate_per_month - b.rate_per_month;
        if (sortBy === 'area_desc') return b.dimensions.total_sq_ft - a.dimensions.total_sq_ft;
        if (sortBy === 'name_asc') return a.site_name.localeCompare(b.site_name);
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
  }, [
    sites,
    searchQuery,
    selectedCategory,
    selectedClientCategory,
    selectedVendor,
    selectedIllumination,
    selectedStatus,
    selectedCity,
    sortBy,
  ]);

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedCategory !== 'All' ||
    selectedClientCategory !== 'All' ||
    selectedVendor !== 'All' ||
    selectedIllumination !== 'All' ||
    selectedStatus !== 'All' ||
    selectedCity !== 'All';

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedClientCategory('All');
    setSelectedVendor('All');
    setSelectedIllumination('All');
    setSelectedStatus('All');
    setSelectedCity('All');
    setSortBy('newest');
  };

  // Selection Handlers
  const handleToggleSelect = (uid: string) => {
    setSelectedUids((prev) =>
      prev.includes(uid) ? prev.filter((id) => id !== uid) : [...prev, uid]
    );
  };

  const handleSelectAllFiltered = () => {
    const allFilteredUids = filteredSites.map((s) => s.uid);
    const areAllSelected = allFilteredUids.every((id) => selectedUids.includes(id));

    if (areAllSelected) {
      setSelectedUids((prev) => prev.filter((id) => !allFilteredUids.includes(id)));
    } else {
      setSelectedUids((prev) => Array.from(new Set([...prev, ...allFilteredUids])));
    }
  };

  const selectedSitesList = useMemo(() => {
    return sites.filter((s) => selectedUids.includes(s.uid));
  }, [sites, selectedUids]);

  // Modal Actions
  const handleOpenAddSite = () => {
    setSiteToEdit(null);
    setFormMode('add');
    setIsFormModalOpen(true);
  };

  const handleOpenEditSite = (site: OOHSite) => {
    setSiteToEdit(site);
    setFormMode('edit');
    setIsFormModalOpen(true);
    setIsSiteModalOpen(false);
  };

  const handleOpenCloneSite = (site: OOHSite) => {
    setSiteToEdit(site);
    setFormMode('clone');
    setIsFormModalOpen(true);
    setIsSiteModalOpen(false);
  };

  const handleViewDetails = (site: OOHSite) => {
    setInspectedSite(site);
    setIsSiteModalOpen(true);
  };

  const handleSaveSite = async (savedSite: OOHSite) => {
    try {
      await storageService.saveSite(savedSite);
      await loadSitesAndMasters();
      setIsFormModalOpen(false);

      if (inspectedSite && inspectedSite.uid === savedSite.uid) {
        setInspectedSite(savedSite);
      }

      addToast(
        formMode === 'edit' ? 'Site Updated Successfully' : 'New OOH Site Registered',
        `${savedSite.uid}: ${savedSite.site_name} saved to inventory master.`,
        'success'
      );
    } catch (err: any) {
      console.error('Save error:', err);
      addToast('Save Failed', err.message || 'Unable to store site.', 'error');
    }
  };

  const handleDeleteSite = async (uid: string) => {
    const target = sites.find((s) => s.uid === uid);
    if (!target) return;

    if (
      window.confirm(
        `Are you sure you want to delete site ${uid} ("${target.site_name}") from the inventory master?`
      )
    ) {
      try {
        await storageService.deleteSite(uid);
        setSelectedUids((prev) => prev.filter((id) => id !== uid));
        await loadSitesAndMasters();
        if (inspectedSite?.uid === uid) {
          setIsSiteModalOpen(false);
          setInspectedSite(null);
        }
        addToast('Site Removed', `Media asset ${uid} was removed from the inventory.`, 'info');
      } catch (err: any) {
        addToast('Delete Failed', err.message, 'error');
      }
    }
  };

  const handleResetSampleData = async () => {
    if (
      window.confirm(
        'Reset database to curated default OOH inventory (including Tata Copper Plus & metro prime sites)?'
      )
    ) {
      try {
        await storageService.resetToInitial();
        await loadSitesAndMasters();
        setSelectedUids([]);
        addToast('Inventory Reset', 'Sample portfolio and campaign assets restored.', 'success');
      } catch (err: any) {
        addToast('Reset Failed', err.message, 'error');
      }
    }
  };

  // Quick single-site PPT export
  const handleQuickSinglePptExport = async (site: OOHSite) => {
    addToast('Generating PPT Slide', `Preparing presentation slide for ${site.uid}...`, 'info');
    try {
      await generateOOHPresentation({
        sites: [site],
        presentationTitle: `${site.uid} - ${site.site_name} Media Dossier`,
        clientName: site.client_current_brand || site.client_category || 'Valued Brand Partner',
        includeCover: true,
      });
      addToast('Download Ready', `PowerPoint deck for ${site.uid} downloaded.`, 'success');
    } catch (err: any) {
      addToast('Export Error', err.message, 'error');
    }
  };

  // Quick Excel export for currently filtered sites
  const handleQuickExcelExport = () => {
    const list = selectedSitesList.length > 0 ? selectedSitesList : filteredSites;
    if (list.length === 0) {
      addToast('No Sites to Export', 'Please adjust filters or select sites.', 'error');
      return;
    }
    exportSitesToExcel({
      sites: list,
      fileName: 'OOH_Inventory_Export',
      campaignTitle: 'Outdoor Media Inventory Export',
    });
    addToast('Excel Downloaded', `Exported ${list.length} site specifications to Excel.`, 'success');
  };

  // Authentication Gate: Require Login if not authenticated
  if (!currentUser) {
    return (
      <div className={isDark ? 'dark' : ''}>
        <LoginPage
          isDark={isDark}
          onLoginSuccess={(user) => {
            setCurrentUser(user);
            addToast(
              `Welcome, ${user.name}!`,
              `Authenticated into BlitzDeck & SiteSync Portal as ${user.email}`,
              'success'
            );
          }}
        />
        <ToastContainer toasts={toasts} onDismiss={removeToast} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#000000] text-slate-900 dark:text-slate-100 transition-colors">
      {/* Top Navbar */}
      <Navbar
        currentPortal={activePortal}
        onSelectPortal={handleSelectPortal}
        onAddSite={handleOpenAddSite}
        onAddCampaign={() => handleOpenAddCampaign()}
        onExportExcel={handleQuickExcelExport}
        onOpenPptModal={() => setIsExportModalOpen(true)}
        onResetData={handleResetSampleData}
        isDark={isDark}
        onToggleDark={() => setIsDark((prev) => !prev)}
        selectedCount={selectedUids.length}
        totalFiltered={filteredSites.length}
        user={currentUser}
        onLogout={() => {
          authService.clearSession();
          setCurrentUser(null);
          addToast('Signed Out', 'You have been safely signed out.', 'info');
        }}
      />

      {/* Main Content Area based on Active Portal */}
      {activePortal === 'landing' ? (
        <LandingHub
          onSelectPortal={handleSelectPortal}
          sites={sites}
          storedVendorsCount={storedVendors.length}
          storedCategoriesCount={storedCategories.length}
          onOpenAddSite={handleOpenAddSite}
        />
      ) : activePortal === 'databoss' ? (
        <DataBossStudio
          sites={sites}
          storedVendors={storedVendors}
          storedCategories={storedCategories}
          onRefresh={loadSitesAndMasters}
          onAddSite={handleOpenAddSite}
          onOpenAddCampaign={handleOpenAddCampaign}
          onEditSite={handleOpenEditSite}
          onCloneSite={handleOpenCloneSite}
          onViewSite={handleViewDetails}
          onDeleteSite={handleDeleteSite}
          onShowToast={addToast}
        />
      ) : (
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Commercial KPIs Summary Header */}
          <StatsBar
            sites={sites}
            currentStatusFilter={selectedStatus}
            onSelectStatusFilter={(st) => setSelectedStatus(st)}
          />

          {/* Filter & Search Toolbar */}
          <FilterToolbar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            selectedClientCategory={selectedClientCategory}
            onClientCategoryChange={setSelectedClientCategory}
            selectedVendor={selectedVendor}
            onVendorChange={setSelectedVendor}
            selectedIllumination={selectedIllumination}
            onIlluminationChange={setSelectedIllumination}
            selectedStatus={selectedStatus}
            onStatusChange={setSelectedStatus}
            selectedCity={selectedCity}
            onCityChange={setSelectedCity}
            sortBy={sortBy}
            onSortChange={setSortBy}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            availableCities={availableCities}
            availableClientCategories={availableClientCategories}
            availableVendors={availableVendors}
            totalResults={filteredSites.length}
            onResetFilters={handleResetFilters}
            hasActiveFilters={hasActiveFilters}
          />

          {/* Results Area */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin text-[#AF1763] mb-3" />
              <p className="text-sm font-medium">Loading OOH site portfolio...</p>
            </div>
          ) : filteredSites.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-rose-200 dark:border-[#2C2E33] p-12 text-center bg-white/50 dark:bg-[#191C24]/50">
              <div className="w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-[#AF1763] dark:text-rose-400 flex items-center justify-center mx-auto mb-4 border border-rose-200/50">
                <Inbox className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                No matching OOH sites found
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1 mb-6">
                We couldn't find any media sites matching your current search criteria, client category, or vendor filters.
              </p>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200"
                >
                  Clear All Filters
                </button>
                <button
                  onClick={handleOpenAddSite}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-[#AF1763] via-[#C2185B] to-[#0DCAF0] hover:from-[#8F1250] hover:to-[#0D6EFD] text-white shadow-md flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Site</span>
                </button>
              </div>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredSites.map((site) => (
                <SiteCard
                  key={site.uid}
                  site={site}
                  isSelected={selectedUids.includes(site.uid)}
                  onToggleSelect={handleToggleSelect}
                  onViewDetails={handleViewDetails}
                  onEditSite={handleOpenEditSite}
                  onDeleteSite={handleDeleteSite}
                  onQuickPptExport={handleQuickSinglePptExport}
                  onAddCampaign={handleOpenAddCampaign}
                />
              ))}
            </div>
          ) : viewMode === 'table' ? (
            <SiteTable
              sites={filteredSites}
              selectedUids={selectedUids}
              onToggleSelect={handleToggleSelect}
              onSelectAll={handleSelectAllFiltered}
              onViewDetails={handleViewDetails}
              onEditSite={handleOpenEditSite}
              onDeleteSite={handleDeleteSite}
              onQuickPptExport={handleQuickSinglePptExport}
              onAddCampaign={handleOpenAddCampaign}
            />
          ) : (
            <SiteMapView sites={filteredSites} onViewDetails={handleViewDetails} />
          )}
        </main>
      )}

      {/* Floating Batch Selection Toolbar (Advantage Planning mode) */}
      {selectedUids.length > 0 && activePortal === 'advantage' && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 px-5 py-3 rounded-2xl bg-slate-900/95 dark:bg-slate-800/95 text-white shadow-2xl border border-slate-700 backdrop-blur-md animate-slide-up">
          <div className="flex items-center gap-2 text-xs font-semibold pr-3 border-r border-slate-700">
            <CheckSquare className="w-4 h-4 text-[#AF1763]" />
            <span>
              <strong>{selectedUids.length}</strong> site{selectedUids.length !== 1 ? 's' : ''} selected
            </span>
          </div>

          <button
            onClick={() => setIsExportModalOpen(true)}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-[#AF1763] via-[#C2185B] to-[#0DCAF0] hover:from-[#8F1250] hover:to-[#0D6EFD] text-white flex items-center gap-1.5 transition-all shadow-md"
          >
            <Presentation className="w-3.5 h-3.5" />
            <span>Export Pitch Deck (.pptx)</span>
          </button>

          <button
            onClick={handleQuickExcelExport}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 transition-all"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Export Excel (.xlsx)</span>
          </button>

          <button
            onClick={() => setSelectedUids([])}
            className="text-xs text-slate-400 hover:text-white pl-2"
          >
            Clear Selection
          </button>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 dark:border-[#2C2E33] bg-white/80 dark:bg-[#191C24] py-6 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 dark:text-white">
              BlitzDeck & SiteSync
            </span>
            <span>• Outdoor Media Planning & Master Vault Architecture</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleSelectPortal('advantage')}
              className={`hover:underline transition-colors ${
                activePortal === 'advantage' ? 'font-bold text-[#AF1763] dark:text-[#e84c96]' : ''
              }`}
            >
              BlitzDeck
            </button>
            <span>•</span>
            <button
              onClick={() => handleSelectPortal('databoss')}
              className={`hover:underline transition-colors ${
                activePortal === 'databoss' ? 'font-bold text-[#0DCAF0]' : ''
              }`}
            >
              SiteSync
            </button>
            <span>•</span>
            <button
              onClick={() => handleSelectPortal('landing')}
              className={`hover:underline transition-colors ${
                activePortal === 'landing' ? 'font-bold text-slate-900 dark:text-white' : ''
              }`}
            >
              Portal Selector
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <SiteModal
        site={inspectedSite}
        isOpen={isSiteModalOpen}
        onClose={() => setIsSiteModalOpen(false)}
        onEdit={handleOpenEditSite}
        onClone={handleOpenCloneSite}
        onExportPpt={handleQuickSinglePptExport}
        onAddCampaign={(uid) => {
          setIsSiteModalOpen(false);
          handleOpenAddCampaign(uid);
        }}
        onShowToast={addToast}
      />

      <AddCampaignModal
        isOpen={isCampaignModalOpen}
        onClose={() => setIsCampaignModalOpen(false)}
        sites={sites}
        initialUid={campaignTargetUid}
        clientCategories={availableClientCategories}
        onAddNewCategory={async (cat) => {
          await storageService.addClientCategory(cat);
          setStoredCategories((prev) => Array.from(new Set([...prev, cat])));
        }}
        onCampaignAdded={handleCampaignAdded}
        onShowToast={addToast}
      />

      <SiteFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleSaveSite}
        siteToEdit={siteToEdit}
        mode={formMode}
      />

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        selectedSites={selectedSitesList}
        filteredSites={filteredSites}
        onShowToast={addToast}
      />

      {/* Toasts */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}

export default App;
