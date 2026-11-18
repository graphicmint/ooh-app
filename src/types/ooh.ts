export type OOHCategory =
  | 'Billboards'
  | 'Unipoles'
  | 'Bus Shelters/BQS'
  | 'Gantries'
  | 'Digital OOH/DOOH'
  | 'Metro Pillars'
  | 'Foot Overbridge (FOB)'
  | 'Airport Media';

export type IlluminationType =
  | 'Front-lit'
  | 'Back-lit'
  | 'Non-lit'
  | 'Digital LED';

export type SiteStatus = 'Available' | 'Booked' | 'Maintenance';

export type PhotoAngle =
  | 'Day Shot'
  | 'Night Shot'
  | 'Long-angle View'
  | 'Close-up View'
  | 'Traffic Flow'
  | 'Drone View';

export interface OOHPhotograph {
  id: string;
  url: string;
  caption: string;
  angle?: PhotoAngle | string;
  timestamp: string;
  is_primary?: boolean;
}

export interface SiteLocation {
  address: string;
  city: string;
  district?: string;
  state: string;
  pincode?: string;
  latitude: number;
  longitude: number;
  landmark?: string;
  google_maps_url?: string;
  tier?: string;
}

export interface SiteDimensions {
  width: number;
  height: number;
  unit: 'ft' | 'm';
  total_sq_ft: number;
  aspect_ratio?: string;
}

export interface SiteVendor {
  id: string;
  name: string;
  contact_person?: string;
  phone?: string;
  email?: string;
}

export interface SiteCampaignRecord {
  id: string;
  client_name: string;
  client_category: string;
  campaign_name?: string;
  start_date?: string;
  end_date?: string;
  photographs: OOHPhotograph[];
  rate_booked?: number;
  notes?: string;
  created_at: string;
  is_active?: boolean;
}

export interface OOHSite {
  uid: string;
  site_name: string;
  category: OOHCategory;
  location: SiteLocation;
  dimensions: SiteDimensions;
  illumination: IlluminationType;
  status: SiteStatus;
  rate_per_month: number;
  photographs: OOHPhotograph[];
  traffic_footfall?: string;
  facing_direction?: string;
  traffic_peak?: 'Morning Traffic' | 'Evening Traffic' | 'Both Peak Windows' | string;
  serial_number?: number;
  client_current_brand?: string;
  client_category?: string;
  vendor_name?: string;
  vendor_contact?: string;
  notes?: string;
  campaign_history?: SiteCampaignRecord[];
  created_at: string;
  updated_at?: string;
}

export interface SiteFilterOptions {
  searchQuery: string;
  category: string;
  clientCategory: string;
  vendorName: string;
  status: string;
  illumination: string;
  city: string;
  minRate?: number;
  maxRate?: number;
  sortBy: 'created_at' | 'rate_per_month' | 'site_name' | 'total_sq_ft';
  sortOrder: 'asc' | 'desc';
}

export const DEFAULT_CLIENT_CATEGORIES: string[] = [
  'Electronics',
  'Wires & Cables',
  'Banking',
  'NBFC & Financial Services',
  'Lighting & Bulbs',
  'News Channels & Media',
  'Jewellery & Luxury',
  'FMCG & Beverages',
  'Automobile & EVs',
  'Real Estate & Infra',
  'E-Commerce & Quick Commerce',
  'Healthcare & Pharma',
  'Education & EdTech',
  'Fashion & Apparel',
  'Telecom & Tech',
  'Cement & Building Materials',
  'Government & Public Sector',
  'Entertainment & OTT',
];

export const DEFAULT_VENDORS: SiteVendor[] = [
  { id: 'v-1', name: 'Times OOH', contact_person: 'Corporate Sales Desk', phone: '+91 22 6635 3535', email: 'sales@timesooh.in' },
  { id: 'v-2', name: 'Bright Outdoor Media Ltd.', contact_person: 'Yogesh Lakhani', phone: '+91 98200 44555', email: 'info@brightoutdoor.com' },
  { id: 'v-3', name: 'Pioneer Publicity Corp.', contact_person: 'Regional Director', phone: '+91 11 2332 7788', email: 'business@pioneerpublicity.com' },
  { id: 'v-4', name: 'Laqshya Media Group', contact_person: 'Key Accounts Lead', phone: '+91 22 4055 9900', email: 'ooh@laqshyamedia.com' },
  { id: 'v-5', name: 'Signpost India Ltd.', contact_person: 'Strategic Alliances', phone: '+91 22 6128 0000', email: 'connect@signpostindia.com' },
  { id: 'v-6', name: 'Jagran Engage', contact_person: 'Outdoor Operations', phone: '+91 120 407 1000', email: 'engage@jagran.com' },
  { id: 'v-7', name: 'TDI International India', contact_person: 'Airports & Metro Lead', phone: '+91 11 4165 5555', email: 'corp@tdiindia.com' },
];
