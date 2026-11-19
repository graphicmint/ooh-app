import pptxgen from 'pptxgenjs';
import { OOHSite } from '../types/ooh';
import { getBase64Image } from './imageUtils';

export interface PptxExportOptions {
  sites: OOHSite[];
  presentationTitle?: string;
  clientName?: string;
  agencyName?: string;
  includeCover?: boolean;
  onProgress?: (current: number, total: number, message: string) => void;
}

export async function generateOOHPresentation({
  sites,
  presentationTitle = 'Premium Out-Of-Home (OOH) Media Proposal',
  clientName = 'Valued Advertiser / Brand Partner',
  agencyName = 'BlitzDeck Media',
  includeCover = true,
  onProgress,
}: PptxExportOptions): Promise<void> {
  const pptx = new pptxgen();
  pptx.layout = 'LAYOUT_16x9'; // 10 x 5.625 inches
  pptx.author = agencyName;
  pptx.company = agencyName;
  pptx.subject = presentationTitle;
  pptx.title = presentationTitle;

  const totalSteps = sites.length + (includeCover ? 2 : 0);
  let currentStep = 0;

  // --- SLIDE 1: COVER SLIDE ---
  if (includeCover) {
    currentStep++;
    onProgress?.(currentStep, totalSteps, 'Building executive cover slide...');

    const coverSlide = pptx.addSlide();
    coverSlide.background = { color: '0F172A' }; // Slate 900

    // Accent line
    coverSlide.addShape(pptx.ShapeType.rect, {
      x: 0.8,
      y: 1.0,
      w: 0.8,
      h: 0.08,
      fill: { color: 'E31B64' }, // Interspace Magenta
    });

    // Tagline / Category
    coverSlide.addText('OUTDOOR MEDIA SOLUTIONS & SITE DOSSIER', {
      x: 0.8,
      y: 1.25,
      w: 8.4,
      h: 0.4,
      fontSize: 13,
      bold: true,
      color: 'F37023', // Interspace Sunset Orange
      fontFace: 'Arial',
      charSpacing: 2,
    });

    // Main Title
    coverSlide.addText(presentationTitle, {
      x: 0.8,
      y: 1.7,
      w: 8.4,
      h: 1.3,
      fontSize: 32,
      bold: true,
      color: 'FFFFFF',
      fontFace: 'Arial',
    });

    // Subtitle card
    coverSlide.addShape(pptx.ShapeType.rect, {
      x: 0.8,
      y: 3.2,
      w: 8.4,
      h: 1.4,
      fill: { color: '1E293B' }, // Slate 800
      line: { color: '334155', width: 1 },
    });

    coverSlide.addText(`PROPOSAL PREPARED FOR: ${clientName.toUpperCase()}`, {
      x: 1.1,
      y: 3.4,
      w: 7.8,
      h: 0.35,
      fontSize: 12,
      bold: true,
      color: '38BDF8', // Sky 400
      fontFace: 'Arial',
    });

    const totalSqFt = sites.reduce((sum, s) => sum + s.dimensions.total_sq_ft, 0);
    const cities = Array.from(new Set(sites.map((s) => s.location.city))).join(', ');

    coverSlide.addText(
      `Portfolio Scope: ${sites.length} Prime Media Assets  |  Total Surface: ${totalSqFt.toLocaleString()} Sq. Ft.\nKey Markets: ${cities || 'All India'}\nDate: ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`,
      {
        x: 1.1,
        y: 3.8,
        w: 7.8,
        h: 0.7,
        fontSize: 11,
        color: '94A3B8',
        fontFace: 'Arial',
        lineSpacing: 18,
      }
    );

    // Footer
    coverSlide.addText(`${agencyName} • Comprehensive OOH Inventory & Pitch Deck Suite`, {
      x: 0.8,
      y: 5.0,
      w: 8.4,
      h: 0.3,
      fontSize: 10,
      color: '64748B',
      fontFace: 'Arial',
    });
  }

  // --- SLIDE 2: INVENTORY EXECUTIVE SUMMARY / INDEX ---
  if (includeCover && sites.length > 1) {
    currentStep++;
    onProgress?.(currentStep, totalSteps, 'Compiling inventory overview table...');

    const summarySlide = pptx.addSlide();
    summarySlide.background = { color: 'F8FAFC' };

    // Slide Header
    summarySlide.addText('PORTFOLIO EXECUTIVE OVERVIEW', {
      x: 0.6,
      y: 0.4,
      w: 8.8,
      h: 0.4,
      fontSize: 20,
      bold: true,
      color: '0F172A',
      fontFace: 'Arial',
    });

    summarySlide.addText('Summary of selected outdoor advertising sites, formats and commercial terms', {
      x: 0.6,
      y: 0.8,
      w: 8.8,
      h: 0.3,
      fontSize: 11,
      color: '64748B',
      fontFace: 'Arial',
    });

    // Summary Table Headers
    const tableRows: pptxgen.TableRow[] = [
      [
        { text: 'UID', options: { bold: true, fill: { color: '1E293B' }, color: 'FFFFFF' } },
        { text: 'Site Name & Location', options: { bold: true, fill: { color: '1E293B' }, color: 'FFFFFF' } },
        { text: 'Category', options: { bold: true, fill: { color: '1E293B' }, color: 'FFFFFF' } },
        { text: 'Dimensions (W x H)', options: { bold: true, fill: { color: '1E293B' }, color: 'FFFFFF' } },
        { text: 'Area (Sq Ft)', options: { bold: true, fill: { color: '1E293B' }, color: 'FFFFFF' } },
        { text: 'Illumination', options: { bold: true, fill: { color: '1E293B' }, color: 'FFFFFF' } },
        { text: 'Monthly Rate (₹)', options: { bold: true, fill: { color: '1E293B' }, color: 'FFFFFF' } },
        { text: 'Status', options: { bold: true, fill: { color: '1E293B' }, color: 'FFFFFF' } },
      ],
    ];

    // Show up to 9 sites on summary table
    sites.slice(0, 9).forEach((site) => {
      tableRows.push([
        { text: site.uid, options: { bold: true, color: '4338CA' } },
        { text: `${site.site_name} (${site.location.city})` },
        { text: site.category },
        { text: `${site.dimensions.width}' x ${site.dimensions.height}'` },
        { text: `${site.dimensions.total_sq_ft.toLocaleString()}` },
        { text: site.illumination },
        { text: `₹ ${site.rate_per_month.toLocaleString('en-IN')}`, options: { bold: true } },
        {
          text: site.status,
          options: {
            color: site.status === 'Available' ? '15803D' : site.status === 'Booked' ? '1D4ED8' : 'B45309',
            bold: true,
          },
        },
      ]);
    });

    summarySlide.addTable(tableRows, {
      x: 0.6,
      y: 1.25,
      w: 8.8,
      fontSize: 9,
      fontFace: 'Arial',
      autoPage: false,
      colW: [1.1, 2.3, 1.1, 1.1, 0.8, 0.9, 1.0, 0.9],
      border: { pt: 0.5, color: 'CBD5E1' },
      fill: { color: 'FFFFFF' },
    });

    // Footer
    addStandardFooter(summarySlide, pptx, agencyName, currentStep);
  }

  // --- SITE DETAIL SLIDES (1 Slide Per OOH Site) ---
  for (let i = 0; i < sites.length; i++) {
    const site = sites[i];
    currentStep++;
    onProgress?.(currentStep, totalSteps, `Rendering slide for ${site.uid}: ${site.site_name}...`);

    const slide = pptx.addSlide();
    slide.background = { color: 'F8FAFC' }; // Clean neutral slate-50

    // 1. TOP HEADER SECTION (y: 0.35 to 1.15)
    // Category & UID Badge Bar
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 0.5,
      y: 0.35,
      w: 2.5,
      h: 0.28,
      rectRadius: 0.08,
      fill: { color: 'E31B64' }, // Interspace Magenta
    });
    slide.addText(site.uid, {
      x: 0.5,
      y: 0.35,
      w: 2.5,
      h: 0.28,
      fontSize: 8.5,
      bold: true,
      color: 'FFFFFF',
      align: 'center',
      fontFace: 'Arial',
    });

    // Category Pill
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 3.1,
      y: 0.35,
      w: 1.6,
      h: 0.28,
      rectRadius: 0.08,
      fill: { color: 'FFF1F4' }, // Interspace Rose Tint
    });
    slide.addText(site.category, {
      x: 3.1,
      y: 0.35,
      w: 1.6,
      h: 0.28,
      fontSize: 9,
      bold: true,
      color: 'BE124D', // Deep Berry
      align: 'center',
      fontFace: 'Arial',
    });

    // Status Pill
    const statusBg = site.status === 'Available' ? 'DCFCE7' : site.status === 'Booked' ? 'DBEAFE' : 'FEF3C7';
    const statusColor = site.status === 'Available' ? '166534' : site.status === 'Booked' ? '1E40AF' : '92400E';
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 4.8,
      y: 0.35,
      w: 1.3,
      h: 0.28,
      rectRadius: 0.08,
      fill: { color: statusBg },
    });
    slide.addText(`● ${site.status}`, {
      x: 4.8,
      y: 0.35,
      w: 1.3,
      h: 0.28,
      fontSize: 9,
      bold: true,
      color: statusColor,
      align: 'center',
      fontFace: 'Arial',
    });

    // Main Site Title
    slide.addText(site.site_name, {
      x: 0.5,
      y: 0.68,
      w: 9.0,
      h: 0.45,
      fontSize: 18,
      bold: true,
      color: '0F172A', // Slate 900
      fontFace: 'Arial',
    });

    // Sub-header Location
    slide.addText(`${site.location.address}, ${site.location.city}, ${site.location.state}`, {
      x: 0.5,
      y: 1.08,
      w: 9.0,
      h: 0.25,
      fontSize: 10,
      color: '64748B', // Slate 500
      fontFace: 'Arial',
    });

    // 2. LEFT COLUMN: STRUCTURED METADATA TABLE & COMMERCIAL CARD (x: 0.5, y: 1.4, w: 4.2)
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 0.5,
      y: 1.4,
      w: 4.2,
      h: 3.7,
      rectRadius: 0.08,
      fill: { color: 'FFFFFF' },
      line: { color: 'E2E8F0', width: 1 },
    });

    // Card Header Bar
    slide.addShape(pptx.ShapeType.rect, {
      x: 0.5,
      y: 1.4,
      w: 4.2,
      h: 0.35,
      fill: { color: 'F1F5F9' },
    });
    slide.addText('TECHNICAL SPECIFICATIONS & COMMERCIALS', {
      x: 0.65,
      y: 1.4,
      w: 3.9,
      h: 0.35,
      fontSize: 10,
      bold: true,
      color: '334155',
      fontFace: 'Arial',
    });

    // Key-Value Rows
    const specTableRows: pptxgen.TableRow[] = [
      [
        { text: 'Dimensions & Ratio', options: { bold: true, color: '475569' } },
        {
          text: `${site.dimensions.width} ft x ${site.dimensions.height} ft (${site.dimensions.aspect_ratio || '2:1'})`,
          options: { bold: true, color: '0F172A' },
        },
      ],
      [
        { text: 'Total Display Area', options: { bold: true, color: '475569' } },
        { text: `${site.dimensions.total_sq_ft.toLocaleString()} Sq. Ft.`, options: { bold: true, color: '0F172A' } },
      ],
      [
        { text: 'Media & Client Industry', options: { bold: true, color: '475569' } },
        { text: `${site.category} (${site.client_category || 'Open'})`, options: { bold: true, color: '4338CA' } },
      ],
      [
        { text: 'Owning Media Vendor', options: { bold: true, color: '475569' } },
        { text: site.vendor_name || 'Direct / Agency Owned', options: { color: '0F172A' } },
      ],
      [
        { text: 'City, District & State', options: { bold: true, color: '475569' } },
        { text: `${site.location.city}${site.location.district ? ` (${site.location.district})` : ''}, ${site.location.state}` },
      ],
      [
        { text: 'Key Landmark', options: { bold: true, color: '475569' } },
        { text: site.location.landmark || 'Prime Urban Corridor' },
      ],
      [
        { text: 'Traffic & Direction', options: { bold: true, color: '475569' } },
        { text: `${site.traffic_footfall || 'Arterial Flow'} • ${site.facing_direction || 'Front'}` },
      ],
      [
        { text: 'Monthly Investment', options: { bold: true, color: '0F172A', fill: { color: 'EEF2FF' } } },
        {
          text: `₹ ${site.rate_per_month.toLocaleString('en-IN')} / mo`,
          options: { bold: true, color: '4338CA', fill: { color: 'EEF2FF' }, fontSize: 11 },
        },
      ],
    ];

    slide.addTable(specTableRows, {
      x: 0.65,
      y: 1.85,
      w: 3.9,
      fontSize: 9,
      fontFace: 'Arial',
      autoPage: false,
      colW: [1.6, 2.3],
      rowH: 0.3,
      border: { pt: 0.5, color: 'F1F5F9' },
    });

    // Notes or campaign line at bottom of card
    if (site.client_current_brand || site.notes) {
      slide.addText(
        `Campaign / Focus: ${site.client_current_brand || site.notes || 'Available for immediate installation'}`,
        {
          x: 0.65,
          y: 4.45,
          w: 3.9,
          h: 0.55,
          fontSize: 8.5,
          color: '64748B',
          fontFace: 'Arial',
          italic: true,
          lineSpacing: 12,
        }
      );
    }

    // 3. RIGHT COLUMN: HIGH-RESOLUTION SITE PHOTOGRAPHS (x: 4.9, y: 1.4, w: 4.6, h: 3.7)
    const photos = site.photographs.length > 0 ? site.photographs : [];

    if (photos.length === 0) {
      // Fallback placeholder card
      slide.addShape(pptx.ShapeType.roundRect, {
        x: 4.9,
        y: 1.4,
        w: 4.6,
        h: 3.7,
        rectRadius: 0.08,
        fill: { color: 'E2E8F0' },
      });
      slide.addText('Site Photograph Pending Verification', {
        x: 4.9,
        y: 3.0,
        w: 4.6,
        h: 0.4,
        align: 'center',
        color: '64748B',
        fontSize: 12,
      });
    } else if (photos.length === 1) {
      // Single Large Showcase Frame
      const p = photos[0];
      const base64Img = await getBase64Image(p.url, p.caption || 'Site Photograph');

      slide.addImage({
        data: base64Img,
        x: 4.9,
        y: 1.4,
        w: 4.6,
        h: 3.3,
        sizing: { type: 'cover', w: 4.6, h: 3.3 },
      });

      // Caption overlay bar
      slide.addShape(pptx.ShapeType.rect, {
        x: 4.9,
        y: 4.7,
        w: 4.6,
        h: 0.4,
        fill: { color: '0F172A' },
      });
      slide.addText(`${p.angle || 'Ground View'}: ${p.caption || site.site_name}`, {
        x: 5.0,
        y: 4.7,
        w: 4.4,
        h: 0.4,
        fontSize: 9,
        color: 'FFFFFF',
        fontFace: 'Arial',
      });
    } else if (photos.length === 2) {
      // 2-Up Split View (e.g. Day Shot & Night Shot)
      // Top Photo (Day)
      const p1 = photos[0];
      const img1 = await getBase64Image(p1.url, p1.caption || 'Day View');

      slide.addImage({
        data: img1,
        x: 4.9,
        y: 1.4,
        w: 4.6,
        h: 1.6,
        sizing: { type: 'cover', w: 4.6, h: 1.6 },
      });

      slide.addShape(pptx.ShapeType.rect, {
        x: 4.9,
        y: 2.7,
        w: 4.6,
        h: 0.3,
        fill: { color: '0F172ACC' },
      });
      slide.addText(`[${p1.angle || 'DAY VIEW'}] ${p1.caption || 'Daytime traffic visual'}`, {
        x: 5.0,
        y: 2.7,
        w: 4.4,
        h: 0.3,
        fontSize: 8.5,
        color: 'FFFFFF',
        fontFace: 'Arial',
      });

      // Bottom Photo (Night / Alternate angle)
      const p2 = photos[1];
      const img2 = await getBase64Image(p2.url, p2.caption || 'Night View');

      slide.addImage({
        data: img2,
        x: 4.9,
        y: 3.1,
        w: 4.6,
        h: 1.6,
        sizing: { type: 'cover', w: 4.6, h: 1.6 },
      });

      slide.addShape(pptx.ShapeType.rect, {
        x: 4.9,
        y: 4.4,
        w: 4.6,
        h: 0.3,
        fill: { color: '0F172ACC' },
      });
      slide.addText(`[${p2.angle || 'NIGHT VIEW'}] ${p2.caption || 'Illuminated night capture'}`, {
        x: 5.0,
        y: 4.4,
        w: 4.4,
        h: 0.3,
        fontSize: 8.5,
        color: 'FFFFFF',
        fontFace: 'Arial',
      });
    } else {
      // 3+ Photos: 1 Hero Image + 2 Side-by-Side Thumbnail Frames
      const p1 = photos[0];
      const img1 = await getBase64Image(p1.url, p1.caption || 'Hero Angle');

      slide.addImage({
        data: img1,
        x: 4.9,
        y: 1.4,
        w: 4.6,
        h: 2.0,
        sizing: { type: 'cover', w: 4.6, h: 2.0 },
      });

      slide.addShape(pptx.ShapeType.rect, {
        x: 4.9,
        y: 3.1,
        w: 4.6,
        h: 0.3,
        fill: { color: '0F172ACC' },
      });
      slide.addText(`[${p1.angle || 'PRIMARY'}] ${p1.caption || 'Corridor view'}`, {
        x: 5.0,
        y: 3.1,
        w: 4.4,
        h: 0.3,
        fontSize: 8.5,
        color: 'FFFFFF',
        fontFace: 'Arial',
      });

      // Bottom Left Photo
      const p2 = photos[1];
      const img2 = await getBase64Image(p2.url, p2.caption || 'Angle 2');
      slide.addImage({
        data: img2,
        x: 4.9,
        y: 3.5,
        w: 2.25,
        h: 1.3,
        sizing: { type: 'cover', w: 2.25, h: 1.3 },
      });
      slide.addShape(pptx.ShapeType.rect, {
        x: 4.9,
        y: 4.5,
        w: 2.25,
        h: 0.3,
        fill: { color: '0F172ACC' },
      });
      slide.addText(`[${p2.angle || 'VIEW 2'}]`, {
        x: 4.95,
        y: 4.5,
        w: 2.15,
        h: 0.3,
        fontSize: 8,
        color: 'FFFFFF',
        fontFace: 'Arial',
      });

      // Bottom Right Photo
      const p3 = photos[2] || photos[0];
      const img3 = await getBase64Image(p3.url, p3.caption || 'Angle 3');
      slide.addImage({
        data: img3,
        x: 7.25,
        y: 3.5,
        w: 2.25,
        h: 1.3,
        sizing: { type: 'cover', w: 2.25, h: 1.3 },
      });
      slide.addShape(pptx.ShapeType.rect, {
        x: 7.25,
        y: 4.5,
        w: 2.25,
        h: 0.3,
        fill: { color: '0F172ACC' },
      });
      slide.addText(`[${p3.angle || 'VIEW 3'}]`, {
        x: 7.3,
        y: 4.5,
        w: 2.15,
        h: 0.3,
        fontSize: 8,
        color: 'FFFFFF',
        fontFace: 'Arial',
      });
    }

    // 4. FOOTER BAR
    addStandardFooter(slide, pptx, agencyName, currentStep);
  }

  // Final step: export
  onProgress?.(totalSteps, totalSteps, 'Finalizing PowerPoint (.pptx) pitch deck file...');
  const dateStr = new Date().toISOString().slice(0, 10);
  await pptx.writeFile({ fileName: `OOH_Pitch_Deck_${dateStr}.pptx` });
}

function addStandardFooter(slide: pptxgen.Slide, pptx: pptxgen, agencyName: string, slideNum: number): void {
  // Divider
  slide.addShape(pptx.ShapeType.line, {
    x: 0.5,
    y: 5.25,
    w: 9.0,
    h: 0,
    line: { color: 'CBD5E1', width: 0.5 },
  });

  // Footer Left
  slide.addText(`${agencyName} • Premium OOH Network`, {
    x: 0.5,
    y: 5.3,
    w: 4.0,
    h: 0.25,
    fontSize: 8,
    color: '94A3B8',
    fontFace: 'Arial',
  });

  // Footer Center
  slide.addText('Commercials indicative & subject to slot availability upon booking', {
    x: 4.0,
    y: 5.3,
    w: 4.0,
    h: 0.25,
    fontSize: 8,
    color: '94A3B8',
    align: 'center',
    fontFace: 'Arial',
  });

  // Footer Right (Slide Number)
  slide.addText(`Slide ${slideNum}`, {
    x: 8.0,
    y: 5.3,
    w: 1.5,
    h: 0.25,
    fontSize: 8,
    color: '94A3B8',
    align: 'right',
    fontFace: 'Arial',
  });
}
