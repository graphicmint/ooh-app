import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import type { OOHSite } from '../types/ooh';

export interface ExcelExportOptions {
  sites: OOHSite[];
  fileName?: string;
  campaignTitle?: string;
}

export function exportSitesToExcel({
  sites,
  fileName = 'OOH_Inventory_Master',
  campaignTitle = 'Outdoor Advertising Master Portfolio',
}: ExcelExportOptions): void {
  const workbook = XLSX.utils.book_new();

  // 1. Prepare Main Inventory Sheet Data
  const mainSheetData = sites.map((site) => {
    const primaryPhoto = site.photographs.find((p) => p.is_primary) || site.photographs[0];

    return {
      'Site UID': site.uid,
      'Site Name': site.site_name,
      'Media Format': site.category,
      'Client Category / Industry': site.client_category || 'Unassigned / Open',
      'Owning Media Vendor': site.vendor_name || 'Direct / Self',
      'Vendor Contact': site.vendor_contact || 'N/A',
      'Availability Status': site.status,
      'Current Client / Campaign': site.client_current_brand || 'Vacant / Available',
      'City': site.location.city,
      'District': site.location.district || 'N/A',
      'City Tier': site.location.tier || 'N/A',
      'State': site.location.state,
      'Postal PIN': site.location.pincode || 'N/A',
      'Complete Address': site.location.address,
      'Key Landmark': site.location.landmark || 'N/A',
      'Width (ft)': site.dimensions.width,
      'Height (ft)': site.dimensions.height,
      'Aspect Ratio': site.dimensions.aspect_ratio || 'N/A',
      'Total Area (Sq. Ft.)': site.dimensions.total_sq_ft,
      'Illumination': site.illumination,
      'Peak Traffic Flow': site.traffic_peak || 'Morning Traffic',
      'Serial In Jurisdiction': site.serial_number || 1,
      'Monthly Rate (₹)': site.rate_per_month,
      'Traffic / Footfall': site.traffic_footfall || 'High density corridor',
      'Facing Direction': site.facing_direction || 'Front Facing',
      'Photos Count': site.photographs.length,
      'Primary Photo Caption': primaryPhoto ? primaryPhoto.caption : 'None',
      'Primary Photo URL': primaryPhoto ? (primaryPhoto.url.startsWith('data:') ? '[Embedded Image Data]' : primaryPhoto.url) : 'N/A',
      'Latitude': site.location.latitude,
      'Longitude': site.location.longitude,
      'Google Maps Link': site.location.google_maps_url || `https://maps.google.com/?q=${site.location.latitude},${site.location.longitude}`,
      'Date Logged': new Date(site.created_at).toLocaleDateString(),
    };
  });

  const mainWorksheet = XLSX.utils.json_to_sheet(mainSheetData);

  // Auto-fit column widths
  if (mainSheetData.length > 0) {
    const headers = Object.keys(mainSheetData[0]);
    const colWidths = headers.map((key) => {
      let maxLen = key.length;
      for (const row of mainSheetData) {
        const val = String((row as Record<string, unknown>)[key] || '');
        if (val.length > maxLen) maxLen = Math.min(val.length, 50);
      }
      return { wch: Math.max(maxLen + 3, 14) };
    });
    mainWorksheet['!cols'] = colWidths;
  }

  XLSX.utils.book_append_sheet(workbook, mainWorksheet, 'OOH Inventory Master');

  // 2. Prepare Executive KPI Summary Sheet
  const totalCount = sites.length;
  const availableCount = sites.filter((s) => s.status === 'Available').length;
  const bookedCount = sites.filter((s) => s.status === 'Booked').length;
  const maintenanceCount = sites.filter((s) => s.status === 'Maintenance').length;
  const totalArea = sites.reduce((sum, s) => sum + s.dimensions.total_sq_ft, 0);
  const totalMonthlyValue = sites.reduce((sum, s) => sum + s.rate_per_month, 0);

  // Group by client category
  const clientCategoryBreakdown: Record<string, number> = {};
  sites.forEach((s) => {
    const cat = s.client_category || 'Unassigned / Open';
    clientCategoryBreakdown[cat] = (clientCategoryBreakdown[cat] || 0) + 1;
  });

  // Group by vendor
  const vendorBreakdown: Record<string, number> = {};
  sites.forEach((s) => {
    const ven = s.vendor_name || 'Direct / Agency Owned';
    vendorBreakdown[ven] = (vendorBreakdown[ven] || 0) + 1;
  });

  // Group by media category
  const categoryBreakdown: Record<string, number> = {};
  sites.forEach((s) => {
    categoryBreakdown[s.category] = (categoryBreakdown[s.category] || 0) + 1;
  });

  // Group by city
  const cityBreakdown: Record<string, number> = {};
  sites.forEach((s) => {
    cityBreakdown[s.location.city] = (cityBreakdown[s.location.city] || 0) + 1;
  });

  const summaryData = [
    { 'Key Performance Indicator': 'Report Title', 'Value / Metric': campaignTitle },
    { 'Key Performance Indicator': 'Generated At', 'Value / Metric': new Date().toLocaleString() },
    { 'Key Performance Indicator': 'Total Sites Exported', 'Value / Metric': totalCount },
    { 'Key Performance Indicator': 'Available Sites (Vacant)', 'Value / Metric': availableCount },
    { 'Key Performance Indicator': 'Booked Sites (Active)', 'Value / Metric': bookedCount },
    { 'Key Performance Indicator': 'Sites in Maintenance', 'Value / Metric': maintenanceCount },
    { 'Key Performance Indicator': 'Total Display Surface (Sq. Ft.)', 'Value / Metric': totalArea.toLocaleString() + ' sq ft' },
    { 'Key Performance Indicator': 'Total Monthly Portfolio Value (₹)', 'Value / Metric': '₹ ' + totalMonthlyValue.toLocaleString('en-IN') },
    { 'Key Performance Indicator': '', 'Value / Metric': '' },
    { 'Key Performance Indicator': '--- CLIENT CATEGORY BREAKDOWN ---', 'Value / Metric': 'Occupied Sites Count' },
    ...Object.entries(clientCategoryBreakdown).map(([cat, count]) => ({
      'Key Performance Indicator': cat,
      'Value / Metric': count,
    })),
    { 'Key Performance Indicator': '', 'Value / Metric': '' },
    { 'Key Performance Indicator': '--- SITE VENDOR / CONCESSIONAIRE BREAKDOWN ---', 'Value / Metric': 'Owned Sites Count' },
    ...Object.entries(vendorBreakdown).map(([ven, count]) => ({
      'Key Performance Indicator': ven,
      'Value / Metric': count,
    })),
    { 'Key Performance Indicator': '', 'Value / Metric': '' },
    { 'Key Performance Indicator': '--- MEDIA FORMAT BREAKDOWN ---', 'Value / Metric': 'Sites Count' },
    ...Object.entries(categoryBreakdown).map(([cat, count]) => ({
      'Key Performance Indicator': cat,
      'Value / Metric': count,
    })),
    { 'Key Performance Indicator': '', 'Value / Metric': '' },
    { 'Key Performance Indicator': '--- REGIONAL / CITY BREAKDOWN ---', 'Value / Metric': 'Sites Count' },
    ...Object.entries(cityBreakdown).map(([city, count]) => ({
      'Key Performance Indicator': city,
      'Value / Metric': count,
    })),
  ];

  const summaryWorksheet = XLSX.utils.json_to_sheet(summaryData);
  summaryWorksheet['!cols'] = [{ wch: 42 }, { wch: 32 }];

  XLSX.utils.book_append_sheet(workbook, summaryWorksheet, 'Executive Summary & Stats');

  // Generate Excel buffer and download
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const dataBlob = new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
  });

  const timestamp = new Date().toISOString().slice(0, 10);
  saveAs(dataBlob, `${fileName}_${timestamp}.xlsx`);
}
