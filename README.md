# AdVantage OOH | Out-Of-Home Site Management & Pitch Deck Suite

A responsive, modern web-based Out-Of-Home (OOH) media inventory management and pitch deck generation suite for outdoor advertising firms and media planners.

![AdVantage OOH Portal](https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80)

---

## 🌟 Key Features

### 1. Module A: Site Entry Form (Add / Edit / Clone)
- **Multi-Section Workflow**: Basic Details, Location & Geo, Technical Specs, Pricing & Vendors, and Media Upload.
- **Client Industry Category Dropdown**:
  - Pre-populated with popular OOH advertiser sectors: *Electronics, Wires & Cables, Banking, NBFC & Financial Services, Lighting & Bulbs, News Channels & Media, Jewellery & Luxury, FMCG & Beverages, Automobile & EVs, Real Estate & Infra, E-Commerce, Healthcare & Pharma, Education & EdTech, Fashion, Telecom, Cement, Government & PSU*.
  - **Inline "+ Add New Category"**: Allows dynamically creating and immediately selecting custom categories (e.g., Solar Energy, Edible Oils, Paints).
  - Enables media planners to easily search, retrieve, and plan campaigns based on which industry verticals are taking which media sites.
- **Site Owning Vendor / Concessionaire Management**:
  - Dropdown of all registered outdoor media vendors (e.g., *Times OOH, Bright Outdoor Media Ltd., Pioneer Publicity Corp., Laqshya Media Group, Signpost India Ltd., Jagran Engage, TDI International India*).
  - **Inline "+ Add New Vendor"**: Enter Vendor Name, Contact Person, and Phone/Email. Once saved, the vendor is automatically added to the master list and appears in the dropdown list for all future sites!
- **Drag-and-Drop Photo Uploader**: Client-side preview, caption editing, angle classification (*Day Shot*, *Night Shot*, *Long-angle View*, *Traffic Flow*, *Close-up View*, *Drone View*).
- **Primary Showcase Photo Selector**: Designate any photograph as the primary card/presentation visual.
- **Campaign Asset Chooser**: Quick 1-click addition from bundled high-resolution outdoor media and branding assets.
- **Form Validation**: Strict client-side validation ensuring UID, Site Name, Category, Dimensions, and at least 1 Photo are provided before saving.
- **Smart UID Generator**: Generates standardized alphanumeric identifiers (e.g., `OOH-MUM-1001`, `OOH-DEL-3012`) based on market city and media category.

### 2. Module B: Search, Retrieval & Filter Dashboard
- **Instant Search Engine**: Sub-millisecond filtering across UID, Site Name, Address, City, Landmark, Client Brand, Client Category, and Vendor Name.
- **Multi-Filter Controls**:
  - **Client Industry Category**: Filter sites by advertiser vertical (*Electronics, Banking, Wires, Jewellery, FMCG*, etc.).
  - **Site Owning Vendor**: Filter sites by media owner/concessionaire.
  - **Media Format**: Billboards, Unipoles, Bus Shelters (BQS), Gantries, Digital OOH/DOOH, Metro Pillars, Foot Overbridge (FOB), Airport Media.
  - **Illumination Type**: Front-lit, Back-lit, Non-lit, Digital LED.
  - **Availability Status**: Available (Vacant), Booked (Active), Maintenance.
  - **Metro City / Region**: Mumbai, Delhi NCR, Bengaluru, Hyderabad, Visakhapatnam, etc.
  - **Sort Ordering**: Newest, Rate (High to Low / Low to High), Display Surface Area, Name (A-Z).
- **Three Versatile Views**:
  - **Grid Card View**: High-impact cards with photo thumbnails, day/night badges, dimensions, location, monthly rate, and quick actions.
  - **Table List View**: Compact, high-density tabular view with sortable columns, batch checkboxes, and inline actions.
  - **Interactive Spatial Map View**: Visual geographic corridor plot displaying media nodes across metro clusters with instant dossier preview.
- **Detailed Modal / Drawer**: Full-screen inspect modal with interactive photo carousel, thumbnail slider, full technical specifications, and one-click briefing copy.
- **Batch Selection Bar**: Floating action bar for multi-site selection, bulk PowerPoint deck generation, and bulk Excel export.

### 3. Module C: Export Engine
- **Excel Master Workbook (`.xlsx`)**:
  - Uses `xlsx` (SheetJS) to compile a 2-sheet workbook:
    1. *OOH Inventory Master*: Complete tabular data with auto-fitted column widths, numeric formatting, and direct coordinates.
    2. *Executive Summary & Stats*: Aggregate portfolio KPIs, total display surface (sq. ft.), monthly revenue potential, category breakdown, and city distribution.
- **PowerPoint Pitch Deck (`.pptx`) via `pptxgenjs`**:
  - Generates client-ready 16:9 widescreen presentation slides for outdoor advertising campaigns.
  - **Executive Cover Slide**: High-impact dark theme proposal title, prepared-for client name, total surface area, and agency branding.
  - **Portfolio Index Overview Slide**: Tabular index summarizing all media sites in the proposal.
  - **Individual Site Profile Slides (1 Slide per Site)**:
    - **Header**: Site Name, UID badge, category pill, and availability status.
    - **Left Column**: Structured technical specification card (Dimensions, Total Area, Illumination, Location, Landmark, Traffic Footfall, Monthly Investment in ₹ INR).
    - **Right Column**: High-resolution site photographs embedded into frames with captions (handles single showcase, 2-up Day/Night split, or 3-image hero-thumbnail layout).
    - **Brand Consistency**: Agency footer, confidentiality disclaimer, date, and automatic slide numbering.

---

## 🛠 Tech Stack & Architecture

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide React icons.
- **Build Tool**: Vite 8.
- **Backend / API**: Node.js & Express 5 REST API (`/api/sites`, `/api/upload`, `/api/stats`, `/api/reset`).
- **Database / State**: Hybrid dual-layer persistence:
  - **Client-Side**: IndexedDB with LocalStorage fallback for offline capability and storing high-resolution photos.
  - **Server-Side**: File-backed JSON database (`data/sites.json`) for multi-user sync and REST endpoints.
- **Export Libraries**:
  - `xlsx` & `file-saver`: Excel workbook generation.
  - `pptxgenjs`: Client-side PowerPoint presentation builder.

---

## 🚀 Running the Application

### 1. Start the Full-Stack Production Server (Recommended)
Runs the Express API backend and serves the compiled frontend on port 3000:
```bash
cd ooh-app
npm start
```
Access the application in your browser at:
**http://localhost:3000**

### 2. Start in Vite Development Mode
```bash
cd ooh-app
npm run dev
```

---

## 📁 Project Structure

```
ooh-app/
├── data/
│   └── sites.json                 # Server-side inventory database
├── dist/                          # Production build output
├── public/
│   └── assets/
│       ├── logo.png               # Tata Copper / Agency branding logo
│       └── campaign/              # Bundled outdoor media & billboard photography
├── src/
│   ├── components/
│   │   ├── ExportModal.tsx        # PowerPoint & Excel export dialog with live progress
│   │   ├── FilterToolbar.tsx      # Instant search & multi-filter controls
│   │   ├── Navbar.tsx             # Main header with quick actions & dark mode
│   │   ├── SiteCard.tsx           # Grid card representation
│   │   ├── SiteFormModal.tsx      # Multi-section Add/Edit site form
│   │   ├── SiteMapView.tsx        # Interactive spatial corridor map
│   │   ├── SiteModal.tsx          # Full-screen site dossier & photo carousel
│   │   ├── SiteTable.tsx          # High-density tabular list view
│   │   ├── StatsBar.tsx           # Executive commercial KPIs bar
│   │   └── Toast.tsx              # Toast notification system
│   ├── data/
│   │   └── initialSites.ts        # Seed portfolio with realistic pan-India sites
│   ├── services/
│   │   ├── excelExport.ts         # ExcelJS / XLSX multi-sheet generator
│   │   ├── imageUtils.ts          # Safe image-to-base64 converter & canvas fallback
│   │   ├── pptxExport.ts          # PptxGenJS pitch deck builder
│   │   └── storage.ts             # Hybrid IndexedDB + REST API service
│   ├── types/
│   │   └── ooh.ts                 # TypeScript interfaces and enums
│   ├── utils/
│   │   └── formatters.ts          # Currency (INR) and formatting helpers
│   ├── App.tsx                    # Main application root
│   ├── index.css                  # Tailwind CSS styling & custom scrollbars
│   └── main.tsx                   # React root entry point
├── package.json
├── server.js                      # Express 5 REST API server
├── tailwind.config.js             # Tailwind CSS configuration
└── tsconfig.json
```
