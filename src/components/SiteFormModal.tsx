import React, { useState, useEffect, useRef } from 'react';
import type {
  OOHSite,
  OOHCategory,
  IlluminationType,
  SiteStatus,
  OOHPhotograph,
  PhotoAngle,
  SiteVendor,
} from '../types/ooh';
import { storageService } from '../services/storage';
import {
  X,
  Upload,
  Plus,
  Trash2,
  Star,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  MapPin,
  Maximize2,
  Coins,
  Image as ImageIcon,
  Info,
  Building2,
  Briefcase,
  Check,
  Compass,
  RefreshCw,
  ExternalLink,
  Globe,
} from 'lucide-react';
import {
  ALL_STATES,
  ALL_CITIES,
  INDIA_LOCATIONS,
  getDistrictsForState,
  getCitiesForDistrict,
  findLocationByCity,
  deriveCoordinates,
  calculateAspectRatio,
  derivePostalCode,
  extractPincode,
  getDefaultPincodeForCity,
  getIlluminationCode,
  generateHoardingUid,
  breakdownHoardingUid,
} from '../data/indiaLocations';

interface SiteFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (site: OOHSite) => void;
  siteToEdit?: OOHSite | null;
  mode: 'add' | 'edit' | 'clone';
}

const CATEGORIES: OOHCategory[] = [
  'Billboards',
  'Unipoles',
  'Bus Shelters/BQS',
  'Gantries',
  'Digital OOH/DOOH',
  'Metro Pillars',
  'Foot Overbridge (FOB)',
  'Airport Media',
];

const ILLUMINATIONS: IlluminationType[] = [
  'Front-lit',
  'Back-lit',
  'Non-lit',
  'Digital LED',
];

const STATUSES: SiteStatus[] = ['Available', 'Booked', 'Maintenance'];

const PHOTO_ANGLES: PhotoAngle[] = [
  'Day Shot',
  'Night Shot',
  'Long-angle View',
  'Close-up View',
  'Traffic Flow',
  'Drone View',
];

// Curated sample asset choices that users can quickly click to add
const BUNDLED_ASSETS = [
  {
    name: 'Median Arterial Branding',
    url: '/assets/campaign/tata_copper_median_branding_1793601400928.jpg',
    angle: 'Day Shot',
  },
  {
    name: 'Finisher Arch Gantry',
    url: '/assets/campaign/tata_copper_finisher_portal_1793601436759.jpg',
    angle: 'Day Shot',
  },
  {
    name: 'Night LED Highway Display',
    url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
    angle: 'Night Shot',
  },
  {
    name: 'Promenade Hydration Zone',
    url: '/assets/campaign/tata_copper_hydration_zone_1793601342643.jpg',
    angle: 'Traffic Flow',
  },
  {
    name: 'Illuminated Digital Billboard',
    url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    angle: 'Night Shot',
  },
  {
    name: 'Misting Tunnel Portal',
    url: '/assets/campaign/tata_copper_misting_tunnel_1793601815240.jpg',
    angle: 'Close-up View',
  },
];

export const SiteFormModal: React.FC<SiteFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  siteToEdit,
  mode,
}) => {
  const [activeTab, setActiveTab] = useState<'basic' | 'location' | 'specs' | 'pricing' | 'photos'>('basic');

  // Dynamic Lists for Categories & Vendors
  const [clientCategories, setClientCategories] = useState<string[]>([]);
  const [vendors, setVendors] = useState<SiteVendor[]>([]);

  // Inline "Add New Category" State
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryInput, setNewCategoryInput] = useState('');

  // Inline "Add New Vendor" State
  const [isAddingVendor, setIsAddingVendor] = useState(false);
  const [newVendorName, setNewVendorName] = useState('');
  const [newVendorContact, setNewVendorContact] = useState('');
  const [newVendorPhone, setNewVendorPhone] = useState('');

  // Form State
  const [uid, setUid] = useState('');
  const [isUidManuallyEdited, setIsUidManuallyEdited] = useState(false);
  const [siteName, setSiteName] = useState('');
  const [category, setCategory] = useState<OOHCategory>('Billboards');
  const [status, setStatus] = useState<SiteStatus>('Available');
  const [clientCurrentBrand, setClientCurrentBrand] = useState('');
  const [clientCategory, setClientCategory] = useState('');
  const [vendorName, setVendorName] = useState('');
  const [vendorContact, setVendorContact] = useState('');

  // Location State
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Mumbai');
  const [district, setDistrict] = useState('Mumbai Suburban');
  const [state, setState] = useState('Maharashtra');
  const [tier, setTier] = useState('Tier 1');
  const [pincode, setPincode] = useState('400050');
  const [pincodeDerivationInfo, setPincodeDerivationInfo] = useState<string>('Auto-derived from Bandra West landmark');
  const [isPincodeManuallyEdited, setIsPincodeManuallyEdited] = useState(false);
  const [serialNo, setSerialNo] = useState<number>(1);
  const [trafficPeak, setTrafficPeak] = useState<string>('Morning Traffic');
  const [landmark, setLandmark] = useState('');
  const [latitude, setLatitude] = useState<number>(19.076);
  const [longitude, setLongitude] = useState<number>(72.8777);
  const [isCoordsManuallyEdited, setIsCoordsManuallyEdited] = useState(false);
  const [coordsStatus, setCoordsStatus] = useState<string>('');
  const [isCustomCity, setIsCustomCity] = useState(false);

  // Specs State
  const [width, setWidth] = useState<number>(40);
  const [height, setHeight] = useState<number>(20);
  const [illumination, setIllumination] = useState<IlluminationType>('Front-lit');
  const [trafficFootfall, setTrafficFootfall] = useState('');
  const [facingDirection, setFacingDirection] = useState('');
  const [notes, setNotes] = useState('');

  // Pricing State
  const [ratePerMonth, setRatePerMonth] = useState<number>(350000);

  // Photos State
  const [photos, setPhotos] = useState<OOHPhotograph[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Errors State
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Dynamic aspect ratio
  const ratioInfo = calculateAspectRatio(width, height);

  // Live UID Nomenclature Breakdown
  const uidBreakdown = breakdownHoardingUid({
    state: state || 'Maharashtra',
    city: city || 'Mumbai',
    pincode: pincode || '400050',
    serialNo: serialNo || 1,
    illumination,
    width,
    height,
    trafficType: trafficPeak,
  });

  // Dynamically update UID when details change (if not manually overridden)
  useEffect(() => {
    if (!isUidManuallyEdited) {
      setUid(uidBreakdown.fullUid);
    }
  }, [uidBreakdown.fullUid, isUidManuallyEdited]);

  // Load Categories & Vendors on Mount
  useEffect(() => {
    storageService.getClientCategories().then((cats) => {
      setClientCategories(cats);
    });
    storageService.getVendors().then((vens) => {
      setVendors(vens);
    });
  }, [isOpen]);

  // Populate form when siteToEdit changes
  useEffect(() => {
    if (siteToEdit && (mode === 'edit' || mode === 'clone')) {
      setSiteName(mode === 'clone' ? `${siteToEdit.site_name} (Copy)` : siteToEdit.site_name);
      setCategory(siteToEdit.category);
      setStatus(mode === 'clone' ? 'Available' : siteToEdit.status);
      setClientCurrentBrand(siteToEdit.client_current_brand || '');
      setClientCategory(siteToEdit.client_category || '');
      setVendorName(siteToEdit.vendor_name || '');
      setVendorContact(siteToEdit.vendor_contact || '');

      setAddress(siteToEdit.location.address);
      setCity(siteToEdit.location.city);
      setDistrict(siteToEdit.location.district || '');
      setState(siteToEdit.location.state);
      setTier(siteToEdit.location.tier || '');

      const pinResult = derivePostalCode(siteToEdit.location.address, siteToEdit.location.landmark, siteToEdit.location.city, siteToEdit.location.state);
      const pin = siteToEdit.location.pincode || pinResult.pincode;
      setPincode(pin);
      setPincodeDerivationInfo(siteToEdit.location.pincode ? `Saved postal code: ${pin}` : pinResult.message);
      setIsPincodeManuallyEdited(Boolean(siteToEdit.location.pincode));

      const sr = siteToEdit.serial_number || 1;
      setSerialNo(mode === 'clone' ? sr + 1 : sr);

      const traffic = siteToEdit.traffic_peak || (siteToEdit.facing_direction?.toLowerCase().includes('evening') ? 'Evening Traffic' : 'Morning Traffic');
      setTrafficPeak(traffic);

      setLandmark(siteToEdit.location.landmark || '');
      setLatitude(siteToEdit.location.latitude);
      setLongitude(siteToEdit.location.longitude);
      setIsCoordsManuallyEdited(true);
      setCoordsStatus('Saved coordinates loaded');

      setWidth(siteToEdit.dimensions.width);
      setHeight(siteToEdit.dimensions.height);
      setIllumination(siteToEdit.illumination);
      setTrafficFootfall(siteToEdit.traffic_footfall || '');
      setFacingDirection(siteToEdit.facing_direction || '');
      setNotes(siteToEdit.notes || '');

      setRatePerMonth(siteToEdit.rate_per_month);
      setPhotos([...siteToEdit.photographs]);

      if (mode === 'clone') {
        setIsUidManuallyEdited(false);
        const clonedUid = generateHoardingUid({
          state: siteToEdit.location.state,
          city: siteToEdit.location.city,
          pincode: pin,
          serialNo: sr + 1,
          illumination: siteToEdit.illumination,
          width: siteToEdit.dimensions.width,
          height: siteToEdit.dimensions.height,
          trafficType: traffic,
        });
        setUid(clonedUid);
      } else {
        setUid(siteToEdit.uid);
        setIsUidManuallyEdited(true);
      }
    } else {
      // Default new site
      setState('Maharashtra');
      setCity('Mumbai');
      setDistrict('Mumbai Suburban');
      setTier('Tier 1');
      const initPinResult = derivePostalCode('', '', 'Mumbai', 'Maharashtra');
      setPincode(initPinResult.pincode);
      setPincodeDerivationInfo(initPinResult.message);
      setIsPincodeManuallyEdited(false);
      setSerialNo(1);
      setTrafficPeak('Morning Traffic');
      setWidth(40);
      setHeight(20);
      setIllumination('Front-lit');
      setIsUidManuallyEdited(false);
      const initialUid = generateHoardingUid({
        state: 'Maharashtra',
        city: 'Mumbai',
        pincode: initPinResult.pincode,
        serialNo: 1,
        illumination: 'Front-lit',
        width: 40,
        height: 20,
        trafficType: 'Morning Traffic',
      });
      setUid(initialUid);
      setSiteName('');
      setCategory('Billboards');
      setStatus('Available');
      setClientCurrentBrand('');
      setClientCategory(''); // BLANK by default until explicitly chosen by user
      setVendorName('Bright Outdoor Media Ltd.');
      setVendorContact('+91 98200 44555');
      setAddress('');
      setLandmark('');
      const initCoords = deriveCoordinates('Mumbai', '', '');
      setLatitude(initCoords.lat);
      setLongitude(initCoords.lng);
      setIsCoordsManuallyEdited(false);
      setCoordsStatus('Auto-derived from Mumbai centroid');
      setTrafficFootfall('150,000 vehicles/day');
      setFacingDirection('Facing incoming traffic towards central business district');
      setNotes('');
      setRatePerMonth(350000);
      setPhotos([
        {
          id: 'p-new-1',
          url: '/assets/campaign/tata_copper_median_branding_1793601400928.jpg',
          caption: 'Day view front angle',
          angle: 'Day Shot',
          timestamp: new Date().toISOString(),
          is_primary: true,
        },
        {
          id: 'p-new-2',
          url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
          caption: 'Night illumination capture',
          angle: 'Night Shot',
          timestamp: new Date().toISOString(),
        },
      ]);
    }
    setErrors({});
    setActiveTab('basic');
    setIsAddingCategory(false);
    setIsAddingVendor(false);
    setIsCustomCity(false);
  }, [siteToEdit, mode, isOpen]);

  if (!isOpen) return null;

  // Auto-calculated square footage
  const totalSqFt = Math.round(width * height);

  // Available districts and cities based on current selections
  const availableDistricts = state ? getDistrictsForState(state) : [];
  const availableCities = getCitiesForDistrict(state, district);

  // Location Handlers
  const handleCitySelect = (selectedCityName: string) => {
    setCity(selectedCityName);
    const loc = findLocationByCity(selectedCityName);
    if (loc) {
      // Auto-populate State and District when City is selected
      setState(loc.state);
      setDistrict(loc.district);
      setTier(loc.tier);

      // Pincode handling: derive from address & landmark, otherwise use city default
      const derived = derivePostalCode(address, landmark, loc.city, loc.state);
      if (!isPincodeManuallyEdited || derived.source !== 'city_default') {
        setPincode(derived.pincode);
        setPincodeDerivationInfo(derived.message);
      }

      // Auto-derive latitude and longitude from City and existing address/landmark
      if (!isCoordsManuallyEdited) {
        const derivedCoords = deriveCoordinates(loc.city, address, landmark);
        setLatitude(derivedCoords.lat);
        setLongitude(derivedCoords.lng);
        setCoordsStatus(`Auto-derived from ${loc.city} (${loc.tier})`);
      }
    }
  };

  const handleStateSelect = (selectedState: string) => {
    setState(selectedState);
    if (!selectedState) return;
    const districts = getDistrictsForState(selectedState);
    if (district && !districts.includes(district)) {
      setDistrict('');
    }
    const cities = getCitiesForDistrict(selectedState, district);
    if (city && !cities.some((c) => c.city.toLowerCase() === city.toLowerCase())) {
      setCity('');
    }
  };

  const handleDistrictSelect = (selectedDistrict: string) => {
    setDistrict(selectedDistrict);
    if (!selectedDistrict) return;
    if (!state) {
      const found = INDIA_LOCATIONS.find((l) => l.district === selectedDistrict);
      if (found) setState(found.state);
    }
    const cities = getCitiesForDistrict(state, selectedDistrict);
    if (city && !cities.some((c) => c.city.toLowerCase() === city.toLowerCase())) {
      setCity('');
    }
  };

  const handleAddressChange = (newAddress: string) => {
    setAddress(newAddress);
    // Dynamic postal code derivation from landmark and street address
    const derived = derivePostalCode(newAddress, landmark, city, state);
    if (!isPincodeManuallyEdited || derived.source !== 'city_default') {
      setPincode(derived.pincode);
      setPincodeDerivationInfo(derived.message);
      if (derived.source !== 'city_default') {
        setIsPincodeManuallyEdited(false);
      }
    }
    if (!isCoordsManuallyEdited && city) {
      const derivedCoords = deriveCoordinates(city, newAddress, landmark);
      setLatitude(derivedCoords.lat);
      setLongitude(derivedCoords.lng);
      setCoordsStatus(`Auto-derived from ${city} + address`);
    }
  };

  const handleLandmarkChange = (newLandmark: string) => {
    setLandmark(newLandmark);
    // Dynamic postal code derivation from landmark and street address
    const derived = derivePostalCode(address, newLandmark, city, state);
    if (!isPincodeManuallyEdited || derived.source !== 'city_default') {
      setPincode(derived.pincode);
      setPincodeDerivationInfo(derived.message);
      if (derived.source !== 'city_default') {
        setIsPincodeManuallyEdited(false);
      }
    }
    if (!isCoordsManuallyEdited && city) {
      const derivedCoords = deriveCoordinates(city, address, newLandmark);
      setLatitude(derivedCoords.lat);
      setLongitude(derivedCoords.lng);
      setCoordsStatus(`Auto-derived from ${city} + landmark`);
    }
  };

  const handleAutoDerivePincode = () => {
    const derived = derivePostalCode(address, landmark, city, state);
    setPincode(derived.pincode);
    setPincodeDerivationInfo(derived.message);
    setIsPincodeManuallyEdited(false);
  };

  const handleAutoDeriveCoords = () => {
    if (!city) return;
    const derived = deriveCoordinates(city, address, landmark);
    setLatitude(derived.lat);
    setLongitude(derived.lng);
    setIsCoordsManuallyEdited(false);
    setCoordsStatus(`Auto-derived from ${city} centroid & corridor parameters`);
  };

  const handleRegenerateUid = () => {
    setIsUidManuallyEdited(false);
    setUid(uidBreakdown.fullUid);
  };

  const handleLatitudeChange = (val: number) => {
    setLatitude(val);
    setIsCoordsManuallyEdited(true);
    setCoordsStatus('Manual coordinates specified');
  };

  const handleLongitudeChange = (val: number) => {
    setLongitude(val);
    setIsCoordsManuallyEdited(true);
    setCoordsStatus('Manual coordinates specified');
  };

  // Add New Client Category Handler
  const handleAddNewCategory = async () => {
    if (!newCategoryInput.trim()) return;
    const cat = newCategoryInput.trim();
    const updated = await storageService.addClientCategory(cat);
    setClientCategories(updated);
    setClientCategory(cat);
    setNewCategoryInput('');
    setIsAddingCategory(false);
  };

  // Add New Vendor Handler
  const handleAddNewVendor = async () => {
    if (!newVendorName.trim()) return;
    const venName = newVendorName.trim();
    const contactInfo = [newVendorContact.trim(), newVendorPhone.trim()].filter(Boolean).join(' • ');

    const updated = await storageService.addVendor({
      name: venName,
      contact_person: newVendorContact.trim() || undefined,
      phone: newVendorPhone.trim() || undefined,
    });
    setVendors(updated);
    setVendorName(venName);
    setVendorContact(contactInfo);
    setNewVendorName('');
    setNewVendorContact('');
    setNewVendorPhone('');
    setIsAddingVendor(false);
  };

  // When vendor selected from dropdown, sync contact info
  const handleVendorSelect = (selectedName: string) => {
    setVendorName(selectedName);
    const matched = vendors.find((v) => v.name === selectedName);
    if (matched) {
      const contactInfo = [matched.contact_person, matched.phone, matched.email].filter(Boolean).join(' • ');
      if (contactInfo) setVendorContact(contactInfo);
    }
  };

  // File Upload Handlers
  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const resultUrl = e.target?.result as string;
        const newPhoto: OOHPhotograph = {
          id: 'photo-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6),
          url: resultUrl,
          caption: file.name.replace(/\.[^/.]+$/, ''),
          angle: photos.length === 0 ? 'Day Shot' : photos.length === 1 ? 'Night Shot' : 'Long-angle View',
          timestamp: new Date().toISOString(),
          is_primary: photos.length === 0,
        };
        setPhotos((prev) => [...prev, newPhoto]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleSetPrimaryPhoto = (id: string) => {
    setPhotos((prev) =>
      prev.map((p) => ({
        ...p,
        is_primary: p.id === id,
      }))
    );
  };

  const handleDeletePhoto = (id: string) => {
    setPhotos((prev) => {
      const filtered = prev.filter((p) => p.id !== id);
      if (filtered.length > 0 && !filtered.some((p) => p.is_primary)) {
        filtered[0].is_primary = true;
      }
      return filtered;
    });
  };

  const handlePhotoCaptionChange = (id: string, caption: string) => {
    setPhotos((prev) => prev.map((p) => (p.id === id ? { ...p, caption } : p)));
  };

  const handlePhotoAngleChange = (id: string, angle: PhotoAngle) => {
    setPhotos((prev) => prev.map((p) => (p.id === id ? { ...p, angle } : p)));
  };

  const handleAddBundledAsset = (asset: { name: string; url: string; angle: string }) => {
    const newPhoto: OOHPhotograph = {
      id: 'bundled-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6),
      url: asset.url,
      caption: asset.name,
      angle: asset.angle,
      timestamp: new Date().toISOString(),
      is_primary: photos.length === 0,
    };
    setPhotos((prev) => [...prev, newPhoto]);
  };

  const handleAutoGenerateUid = () => {
    const generated = storageService.generateNextUid(city, category);
    setUid(generated);
  };

  // Validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!uid.trim()) newErrors.uid = 'Site UID is mandatory';
    if (!siteName.trim()) newErrors.siteName = 'Site Name is mandatory';
    if (!category) newErrors.category = 'Media Category is required';
    if (!address.trim()) newErrors.address = 'Street Address is mandatory';
    if (!city.trim()) newErrors.city = 'City is mandatory';
    if (isNaN(width) || width <= 0) newErrors.width = 'Width must be greater than 0';
    if (isNaN(height) || height <= 0) newErrors.height = 'Height must be greater than 0';
    if (isNaN(ratePerMonth) || ratePerMonth < 0) newErrors.ratePerMonth = 'Monthly rate must be 0 or greater';
    if (photos.length === 0) newErrors.photos = 'At least 1 high-resolution site photograph is mandatory';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      if (errors.uid || errors.siteName || errors.category) setActiveTab('basic');
      else if (errors.address || errors.city) setActiveTab('location');
      else if (errors.width || errors.height) setActiveTab('specs');
      else if (errors.photos) setActiveTab('photos');
      return;
    }

    const finalPhotos = photos.map((p, idx) => ({
      ...p,
      is_primary: p.is_primary ?? idx === 0,
    }));

    const finalSite: OOHSite = {
      uid: uid.trim(),
      site_name: siteName.trim(),
      category,
      status,
      client_current_brand: clientCurrentBrand.trim() || undefined,
      client_category: clientCategory.trim() || undefined,
      vendor_name: vendorName.trim() || undefined,
      vendor_contact: vendorContact.trim() || undefined,
      location: {
        address: address.trim(),
        city: city.trim(),
        district: district.trim() || undefined,
        state: state.trim(),
        pincode: pincode.trim() || undefined,
        landmark: landmark.trim() || undefined,
        latitude: Number(latitude) || 19.076,
        longitude: Number(longitude) || 72.8777,
        google_maps_url: `https://maps.google.com/?q=${latitude},${longitude}`,
        tier: tier.trim() || undefined,
      },
      dimensions: {
        width: Number(width),
        height: Number(height),
        unit: 'ft',
        total_sq_ft: totalSqFt,
        aspect_ratio: ratioInfo.ratioText,
      },
      illumination,
      rate_per_month: Number(ratePerMonth),
      traffic_footfall: trafficFootfall.trim() || undefined,
      facing_direction: facingDirection.trim() || undefined,
      traffic_peak: trafficPeak,
      serial_number: serialNo,
      notes: notes.trim() || undefined,
      photographs: finalPhotos,
      created_at: siteToEdit && mode === 'edit' ? siteToEdit.created_at : new Date().toISOString(),
    };

    onSave(finalSite);
  };

  const tabs = [
    { id: 'basic', label: '1. Basic & Commercials', icon: Info, error: !!(errors.uid || errors.siteName) },
    { id: 'location', label: '2. Location & Geo', icon: MapPin, error: !!(errors.address || errors.city) },
    { id: 'specs', label: '3. Technical Specs', icon: Maximize2, error: !!(errors.width || errors.height) },
    { id: 'pricing', label: '4. Pricing & Vendor', icon: Coins, error: !!errors.ratePerMonth },
    { id: 'photos', label: `5. Media (${photos.length})`, icon: ImageIcon, error: !!errors.photos },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-slate-950/70 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl rounded-3xl bg-white dark:bg-[#191C24] border border-slate-200 dark:border-[#2C2E33] shadow-2xl overflow-hidden my-auto transition-all flex flex-col max-h-[92vh]">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between p-4 sm:px-6 border-b border-slate-200 dark:border-[#2C2E33] bg-white/95 dark:bg-[#191C24]/95 backdrop-blur-md shrink-0">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              {mode === 'edit' ? (
                <>
                  Edit OOH Site: <span className="text-[#AF1763] font-mono">{siteToEdit?.uid}</span>
                </>
              ) : mode === 'clone' ? (
                <>Clone As New OOH Site</>
              ) : (
                <>Add New Out-Of-Home (OOH) Site</>
              )}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Provide complete physical, commercial, client category, and site vendor details
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Multi-Section Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-[#2C2E33] bg-slate-50 dark:bg-[#0F1117] px-4 sm:px-6 overflow-x-auto shrink-0">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 px-3.5 sm:px-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
                  isActive
                    ? 'border-[#AF1763] text-[#AF1763] dark:text-[#0DCAF0] bg-white dark:bg-slate-800 shadow-sm'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                } ${tab.error ? 'text-rose-500 dark:text-rose-400' : ''}`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.error && <AlertCircle className="w-3.5 h-3.5 text-rose-500" />}
              </button>
            );
          })}
        </div>

        {/* Form Body Scrollable Area */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-4 sm:p-6 space-y-6 flex-1">
          {/* TAB 1: BASIC DETAILS & CLIENT CATEGORY */}
          {activeTab === 'basic' && (
            <div className="space-y-4 animate-fade-in">
              {/* DYNAMIC NOMENCLATURE SITE UID CARD */}
              <div className="p-4 rounded-2xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200/80 dark:border-[#AF1763]/40 space-y-3 shadow-xs">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#AF1763] dark:text-[#0DCAF0]" />
                    <label className="text-xs font-bold text-slate-900 dark:text-white">
                      Hoarding Site UID (Standard Dynamic Nomenclature) <span className="text-rose-500">*</span>
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    {isUidManuallyEdited ? (
                      <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-800">
                        Manual Custom UID
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800 flex items-center gap-1 font-mono">
                        <CheckCircle2 className="w-3 h-3" /> Auto-Generated
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={handleRegenerateUid}
                      className="text-[11px] text-[#AF1763] dark:text-[#0DCAF0] hover:text-[#AF1763] dark:hover:text-[#0DCAF0] hover:underline flex items-center gap-1 font-semibold"
                      title="Re-sync with State, City, Pincode, Illumination, Size & Traffic formula"
                    >
                      <RefreshCw className="w-3 h-3" /> Re-sync Formula
                    </button>
                  </div>
                </div>

                <input
                  type="text"
                  value={uid}
                  onChange={(e) => {
                    setUid(e.target.value.toUpperCase());
                    setIsUidManuallyEdited(true);
                  }}
                  placeholder="e.g. MAH-MUMB-0050-01-L-40X20-M"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-rose-300 dark:border-rose-800 bg-white dark:bg-slate-800 text-sm font-mono font-black text-rose-900 dark:text-rose-200 tracking-wide focus:ring-2 focus:ring-[#AF1763]/30 focus:border-[#AF1763] shadow-xs"
                />
                {errors.uid && <p className="text-xs text-rose-500 mt-1">{errors.uid}</p>}

                {/* 7-Segment Nomenclature Breakdown Chips */}
                <div className="pt-1">
                  <div className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider mb-1.5 flex items-center justify-between">
                    <span>Nomenclature Segment Breakdown (7 Parts):</span>
                    <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400">Live Dynamic Sync</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono">
                    <div className="px-2 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-[#2C2E33] flex flex-col items-center shadow-2xs" title="1. First three alphabets of State Name">
                      <span className="font-extrabold text-[#AF1763] dark:text-[#0DCAF0]">{uidBreakdown.statePart}</span>
                      <span className="text-[9px] font-sans text-slate-400 uppercase font-bold">1. State (3)</span>
                    </div>
                    <span className="text-slate-400 font-bold">-</span>
                    <div className="px-2 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-[#2C2E33] flex flex-col items-center shadow-2xs" title="2. First four alphabets of City Name (dropdown dependent on State)">
                      <span className="font-extrabold text-[#AF1763] dark:text-[#0DCAF0]">{uidBreakdown.cityPart}</span>
                      <span className="text-[9px] font-sans text-slate-400 uppercase font-bold">2. City (4)</span>
                    </div>
                    <span className="text-slate-400 font-bold">-</span>
                    <div className="px-2 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-[#2C2E33] flex flex-col items-center shadow-2xs" title="3. Last 4 Digits of Pincode (from address / landmark)">
                      <span className="font-extrabold text-blue-600 dark:text-blue-400">{uidBreakdown.pincodePart}</span>
                      <span className="text-[9px] font-sans text-slate-400 uppercase font-bold">3. PIN (4)</span>
                    </div>
                    <span className="text-slate-400 font-bold">-</span>
                    <div className="px-2 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-[#2C2E33] flex flex-col items-center shadow-2xs" title="4. Serial No of hoarding in particular Pincode Jurisdiction">
                      <span className="font-extrabold text-amber-600 dark:text-amber-400">{uidBreakdown.serialPart}</span>
                      <span className="text-[9px] font-sans text-slate-400 uppercase font-bold">4. Sr# (2)</span>
                    </div>
                    <span className="text-slate-400 font-bold">-</span>
                    <div className="px-2 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-[#2C2E33] flex flex-col items-center shadow-2xs" title="5. First alphabet of Light/Non Light/Back Light/Digital (L/N/B/D)">
                      <span className="font-extrabold text-purple-600 dark:text-purple-400">{uidBreakdown.illuminationPart}</span>
                      <span className="text-[9px] font-sans text-slate-400 uppercase font-bold">5. Light</span>
                    </div>
                    <span className="text-slate-400 font-bold">-</span>
                    <div className="px-2 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-[#2C2E33] flex flex-col items-center shadow-2xs" title="6. Size: Width in feet X Height in feet">
                      <span className="font-extrabold text-emerald-600 dark:text-emerald-400">{uidBreakdown.sizePart}</span>
                      <span className="text-[9px] font-sans text-slate-400 uppercase font-bold">6. Size (W×H)</span>
                    </div>
                    <span className="text-slate-400 font-bold">-</span>
                    <div className="px-2 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-[#2C2E33] flex flex-col items-center shadow-2xs" title="7. First alphabet of Morning Traffic / Evening Traffic (M/E)">
                      <span className="font-extrabold text-rose-600 dark:text-rose-400">{uidBreakdown.trafficPart}</span>
                      <span className="text-[9px] font-sans text-slate-400 uppercase font-bold">7. Traffic</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Media Category */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Media Category <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as OOHCategory)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#2C2E33] bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-[#AF1763]/30 focus:border-[#AF1763] cursor-pointer"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Hoarding Serial No in Pincode Jurisdiction */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between">
                    <span>Pincode Serial No. (Segment 4)</span>
                    <span className="text-[10px] text-[#AF1763] dark:text-[#0DCAF0] font-mono font-bold">
                      Encoded: [{String(serialNo).padStart(2, '0')}]
                    </span>
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={99}
                    value={serialNo}
                    onChange={(e) => setSerialNo(Math.max(1, parseInt(e.target.value, 10) || 1))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#2C2E33] bg-white dark:bg-slate-800 text-sm font-mono text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-[#AF1763]/30 focus:border-[#AF1763] font-bold"
                  />
                </div>
              </div>

              {/* Peak Traffic Dominance (Morning vs Evening Traffic) */}
              <div className="p-3.5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/50 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Compass className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <span>Peak Traffic Flow Dominance (UID Segment 7: M / E)</span>
                  </label>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-200/80 dark:bg-amber-900/80 text-amber-900 dark:text-amber-200 font-bold">
                    UID Suffix: [{trafficPeak === 'Evening Traffic' ? 'E' : 'M'}]
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Select primary viewing traffic flow. The first alphabet ('M' for Morning Traffic, 'E' for Evening Traffic) is automatically encoded into the final UID segment.
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setTrafficPeak('Morning Traffic')}
                    className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                      trafficPeak === 'Morning Traffic'
                        ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-[#2C2E33] hover:border-slate-300'
                    }`}
                  >
                    <span>☀️ Morning Traffic</span>
                    <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-black/20 font-bold">Code: M</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTrafficPeak('Evening Traffic')}
                    className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                      trafficPeak === 'Evening Traffic'
                        ? 'bg-gradient-to-r from-[#AF1763] to-[#0DCAF0] text-white border-[#AF1763] shadow-sm'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-[#2C2E33] hover:border-slate-300'
                    }`}
                  >
                    <span>🌙 Evening Traffic</span>
                    <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-black/20 font-bold">Code: E</span>
                  </button>
                </div>
              </div>

              {/* Site Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Site Name / Descriptor <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  placeholder="e.g. Bandra Reclamation Western Express Unipole A"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#2C2E33] bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-[#AF1763]/30 focus:border-[#AF1763]"
                />
                {errors.siteName && <p className="text-xs text-rose-500 mt-1">{errors.siteName}</p>}
              </div>

              {/* CLIENT CATEGORY WITH DYNAMIC ADD */}
              <div className="p-4 rounded-2xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200/80 dark:border-[#AF1763]/40 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4 text-[#AF1763] dark:text-[#0DCAF0]" />
                    <label className="text-xs font-bold text-slate-900 dark:text-white">
                      Client Category / Industry Vertical
                    </label>
                  </div>

                  {!isAddingCategory && (
                    <button
                      type="button"
                      onClick={() => setIsAddingCategory(true)}
                      className="text-xs font-semibold text-[#AF1763] dark:text-[#0DCAF0] hover:text-[#AF1763] dark:hover:text-[#0DCAF0] flex items-center gap-1 bg-white dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-rose-200 dark:border-rose-800 shadow-sm transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add New Category</span>
                    </button>
                  )}
                </div>

                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Tag the advertiser industry (e.g. Electronics, Wires, Banking, Jewellery) to analyze which categories occupy which media corridors for strategic pitch planning.
                </p>

                {isAddingCategory ? (
                  <div className="flex items-center gap-2 pt-1 animate-fade-in">
                    <input
                      type="text"
                      value={newCategoryInput}
                      onChange={(e) => setNewCategoryInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddNewCategory();
                        }
                      }}
                      placeholder="Type new category (e.g. Solar Energy, Edible Oils, Paints)..."
                      className="flex-1 px-3 py-2 text-xs rounded-xl border border-rose-300 dark:border-rose-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-[#AF1763]/30"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={handleAddNewCategory}
                      className="px-3 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-[#AF1763] to-[#0DCAF0] text-white hover:brightness-105 shadow-sm flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Save & Select</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingCategory(false);
                        setNewCategoryInput('');
                      }}
                      className="px-2.5 py-2 rounded-xl text-xs text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <select
                    value={clientCategory}
                    onChange={(e) => setClientCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#2C2E33] bg-white dark:bg-slate-800 text-sm font-medium text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-[#AF1763]/30 focus:border-[#AF1763] cursor-pointer"
                  >
                    <option value="">-- Select Client Industry Category --</option>
                    {clientCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Status & Current Brand */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Availability Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as SiteStatus)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#2C2E33] bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-[#AF1763]/30 focus:border-[#AF1763] cursor-pointer"
                  >
                    {STATUSES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Active Client / Brand Running
                  </label>
                  <input
                    type="text"
                    value={clientCurrentBrand}
                    onChange={(e) => setClientCurrentBrand(e.target.value)}
                    placeholder="e.g. Havells / Tanishq / Tata Copper (or leave blank)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#2C2E33] bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-[#AF1763]/30 focus:border-[#AF1763]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: LOCATION & GEO */}
          {activeTab === 'location' && (
            <div className="space-y-4 animate-fade-in">
              {/* Street Address */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Complete Street Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => handleAddressChange(e.target.value)}
                  placeholder="e.g. Near Sea Link Toll Plaza, Bandra West"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#2C2E33] bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-[#AF1763]/30 focus:border-[#AF1763]"
                />
                {errors.address && <p className="text-xs text-rose-500 mt-1">{errors.address}</p>}
              </div>

              {/* Corridor Landmark */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Corridor Landmark / Junction
                </label>
                <input
                  type="text"
                  value={landmark}
                  onChange={(e) => handleLandmarkChange(e.target.value)}
                  placeholder="e.g. Bandra-Worli Sea Link Approach & Western Express Highway Junction"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#2C2E33] bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-[#AF1763]/30 focus:border-[#AF1763]"
                />
              </div>

              {/* Postal Code Real-time Derivation from Address & Landmark */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-rose-50/90 via-amber-50/50 to-orange-50/70 dark:from-rose-950/30 dark:via-amber-950/20 dark:to-orange-950/30 border border-rose-200/90 dark:border-rose-800/90 flex flex-wrap items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-gradient-to-r from-[#AF1763] to-[#0DCAF0] text-white shadow-xs">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        Postal Code:
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 font-mono text-[#AF1763] dark:text-[#0DCAF0] font-black text-sm border border-rose-200 dark:border-rose-800">
                        {pincode || '------'}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-900/50 text-rose-900 dark:text-rose-200 font-bold">
                        UID Segment 3: [{pincode ? pincode.slice(-4) : '0001'}]
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>{pincodeDerivationInfo || 'Derives automatically as you type address and landmark'}</span>
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAutoDerivePincode}
                  className="text-xs font-semibold text-[#AF1763] dark:text-[#0DCAF0] hover:text-[#AF1763] dark:hover:text-[#0DCAF0] flex items-center gap-1.5 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-800 shadow-2xs hover:shadow-xs transition-all cursor-pointer"
                  title="Re-evaluate postal code from landmark and address"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Re-derive PIN</span>
                </button>
              </div>

              {/* Cascading State, District, City Selectors */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0F1117] border border-slate-200/80 dark:border-[#2C2E33] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-[#AF1763] dark:text-[#0DCAF0]" />
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Indian Geographic Hierarchy (State • District • City)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {tier && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-[#AF1763] dark:bg-rose-950/60 dark:text-[#0DCAF0]">
                        {tier} Market
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => setIsCustomCity((prev) => !prev)}
                      className="text-[11px] text-slate-500 hover:text-[#AF1763] dark:hover:text-[#0DCAF0] underline"
                    >
                      {isCustomCity ? '← Choose from Master List' : 'Enter Custom / Unlisted City'}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {/* 1. STATE DROPDOWN */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      State / UT <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={state}
                      onChange={(e) => handleStateSelect(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-[#2C2E33] bg-white dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-[#AF1763]/30 focus:border-[#AF1763] cursor-pointer"
                    >
                      <option value="">-- Select State / UT --</option>
                      {ALL_STATES.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 2. DISTRICT DROPDOWN */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      District
                    </label>
                    <select
                      value={district}
                      onChange={(e) => handleDistrictSelect(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-[#2C2E33] bg-white dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-[#AF1763]/30 focus:border-[#AF1763] cursor-pointer"
                    >
                      <option value="">-- Select District --</option>
                      {availableDistricts.length > 0
                        ? availableDistricts.map((dist) => (
                            <option key={dist} value={dist}>
                              {dist}
                            </option>
                          ))
                        : INDIA_LOCATIONS.map((l) => l.district)
                            .filter((v, i, a) => a.indexOf(v) === i)
                            .sort()
                            .map((dist) => (
                              <option key={dist} value={dist}>
                                {dist}
                              </option>
                            ))}
                    </select>
                  </div>

                  {/* 3. CITY DROPDOWN (Auto-fills State & District when selected!) */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      City / Town <span className="text-rose-500">*</span>
                    </label>
                    {isCustomCity ? (
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => {
                          setCity(e.target.value);
                          if (!isCoordsManuallyEdited) {
                            const derived = deriveCoordinates(e.target.value, address, landmark);
                            setLatitude(derived.lat);
                            setLongitude(derived.lng);
                          }
                        }}
                        placeholder="Type custom city..."
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-[#2C2E33] bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-[#AF1763]/30 focus:border-[#AF1763]"
                      />
                    ) : (
                      <select
                        value={city}
                        onChange={(e) => handleCitySelect(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-[#2C2E33] bg-white dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-[#AF1763]/30 focus:border-[#AF1763] cursor-pointer"
                      >
                        <option value="">-- Select City / Town --</option>
                        {availableCities.length > 0 ? (
                          availableCities.map((item) => (
                            <option key={`${item.state}-${item.city}`} value={item.city}>
                              {item.city} ({item.tier})
                            </option>
                          ))
                        ) : (
                          ALL_CITIES.map((cName) => (
                            <option key={cName} value={cName}>
                              {cName}
                            </option>
                          ))
                        )}
                      </select>
                    )}
                    {errors.city && <p className="text-[11px] text-rose-500 mt-1">{errors.city}</p>}
                  </div>

                  {/* 4. POSTAL PINCODE (Auto-derived from Address/Landmark or Custom) */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1 flex items-center justify-between">
                      <span>Postal Pincode</span>
                      <span className="text-[10px] text-[#AF1763] dark:text-[#0DCAF0] font-mono font-bold">
                        UID: [{pincode ? pincode.replace(/\D/g, '').slice(-4).padStart(4, '0') : '0001'}]
                      </span>
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={pincode}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                        setPincode(val);
                        setIsPincodeManuallyEdited(true);
                        setPincodeDerivationInfo(val ? `Manually specified PIN ${val}` : 'PIN cleared');
                      }}
                      placeholder="e.g. 400050"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-[#2C2E33] bg-white dark:bg-slate-800 text-xs font-mono font-bold text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-[#AF1763]/30 focus:border-[#AF1763]"
                    />
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                      <span>Derived from Landmark & Address</span>
                      {isPincodeManuallyEdited && (
                        <button
                          type="button"
                          onClick={handleAutoDerivePincode}
                          className="text-[#AF1763] dark:text-[#0DCAF0] hover:underline font-bold"
                          title="Reset to postal code derived from address & landmark"
                        >
                          Auto-derive
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <Info className="w-3.5 h-3.5 text-[#AF1763] shrink-0" />
                  <span>
                    Selecting a City automatically links its official State and District, and auto-derives its GPS centroid.
                  </span>
                </p>
              </div>

              {/* GPS Coordinates Section */}
              <div className="p-4 rounded-2xl bg-white dark:bg-[#222631] border border-slate-200 dark:border-[#2C2E33] space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <Compass className="w-4 h-4 text-[#AF1763] dark:text-[#0DCAF0]" />
                    <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Geographic GPS Coordinates (Latitude & Longitude)
                    </label>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleAutoDeriveCoords}
                      className="text-xs font-semibold text-[#AF1763] dark:text-[#0DCAF0] hover:text-[#AF1763] dark:hover:text-[#0DCAF0] flex items-center gap-1 bg-rose-50 dark:bg-rose-950/40 px-2.5 py-1 rounded-lg border border-rose-200 dark:border-rose-800 shadow-sm transition-all"
                      title="Recalculate coordinates from city and corridor address"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Re-derive GPS</span>
                    </button>

                    <a
                      href={`https://maps.google.com/?q=${latitude},${longitude}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-[#AF1763] dark:hover:text-[#0DCAF0] flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-[#2C2E33] transition-all"
                    >
                      <span>Preview Map</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      Latitude (Editable)
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={latitude}
                      onChange={(e) => handleLatitudeChange(parseFloat(e.target.value) || 0)}
                      placeholder="19.0435"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#2C2E33] bg-white dark:bg-slate-800 text-sm font-mono text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-[#AF1763]/30 focus:border-[#AF1763]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      Longitude (Editable)
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={longitude}
                      onChange={(e) => handleLongitudeChange(parseFloat(e.target.value) || 0)}
                      placeholder="72.8258"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#2C2E33] bg-white dark:bg-slate-800 text-sm font-mono text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-[#AF1763]/30 focus:border-[#AF1763]"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] pt-1">
                  <span className="text-slate-500 dark:text-slate-400">
                    {coordsStatus ? (
                      <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                        <CheckCircle2 className="w-3 h-3" /> {coordsStatus}
                      </span>
                    ) : (
                      'Coordinates automatically sync with selected city and address parameters'
                    )}
                  </span>
                  <span className="text-slate-400">
                    Precision: 6 decimal places (approx. 1 meter accuracy)
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TECHNICAL SPECS */}
          {activeTab === 'specs' && (
            <div className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Width (ft) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={width}
                    onChange={(e) => setWidth(parseFloat(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#2C2E33] bg-white dark:bg-slate-800 text-sm font-semibold text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-[#AF1763]/30 focus:border-[#AF1763]"
                  />
                  {errors.width && <p className="text-xs text-rose-500 mt-1">{errors.width}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Height (ft) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={height}
                    onChange={(e) => setHeight(parseFloat(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#2C2E33] bg-white dark:bg-slate-800 text-sm font-semibold text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-[#AF1763]/30 focus:border-[#AF1763]"
                  />
                  {errors.height && <p className="text-xs text-rose-500 mt-1">{errors.height}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Total Display Area
                  </label>
                  <div className="px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-[#222631] border border-slate-200 dark:border-[#2C2E33] text-sm font-bold text-[#AF1763] dark:text-[#0DCAF0] flex items-center gap-1.5">
                    <Maximize2 className="w-4 h-4" />
                    <span>{totalSqFt.toLocaleString()} Sq. Ft.</span>
                  </div>
                </div>

                {/* Dynamic Aspect Ratio Card */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between">
                    <span>Aspect Ratio</span>
                    <span className="text-[10px] font-mono text-slate-400">Dynamic</span>
                  </label>
                  <div className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-[#222631] border border-slate-200 dark:border-[#2C2E33] flex items-center justify-between gap-1.5">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-extrabold text-[#AF1763] dark:text-[#0DCAF0] font-mono">
                          {ratioInfo.ratioText}
                        </span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                          ({ratioInfo.decimalText})
                        </span>
                      </div>
                      <span
                        className={`inline-block mt-0.5 text-[9px] font-bold px-1.5 py-0.2 rounded ${
                          ratioInfo.orientation === 'Landscape'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                            : ratioInfo.orientation === 'Portrait'
                            ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
                            : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                        }`}
                      >
                        {ratioInfo.orientation}
                      </span>
                    </div>

                    {/* Proportional Frame Visualizer */}
                    <div
                      className="w-10 h-10 rounded-lg border border-rose-200 dark:border-rose-800 bg-white dark:bg-[#191C24] flex items-center justify-center p-1 shrink-0"
                      title={`Proportional visual render: ${width}ft x ${height}ft (${ratioInfo.ratioText})`}
                    >
                      <div
                        style={{
                          width:
                            ratioInfo.widthRatio >= ratioInfo.heightRatio
                              ? '100%'
                              : `${Math.max(25, (ratioInfo.widthRatio / ratioInfo.heightRatio) * 100)}%`,
                          height:
                            ratioInfo.heightRatio >= ratioInfo.widthRatio
                              ? '100%'
                              : `${Math.max(25, (ratioInfo.heightRatio / ratioInfo.widthRatio) * 100)}%`,
                        }}
                        className="bg-[#AF1763] dark:bg-[#0DCAF0] rounded-sm shadow-xs transition-all duration-200"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>Illumination Type (UID Segment 5)</span>
                  <span className="text-[10px] text-[#AF1763] dark:text-[#0DCAF0] font-mono font-bold">
                    UID Code: [{getIlluminationCode(illumination)}]
                  </span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {ILLUMINATIONS.map((illum) => {
                    const code = getIlluminationCode(illum);
                    return (
                      <button
                        key={illum}
                        type="button"
                        onClick={() => setIllumination(illum)}
                        className={`p-3 rounded-xl border text-xs font-semibold text-center transition-all flex flex-col items-center justify-center gap-1 ${
                          illumination === illum
                            ? 'bg-gradient-to-r from-[#AF1763] to-[#0DCAF0] text-white border-[#AF1763] shadow-sm'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-[#2C2E33] hover:border-slate-300'
                        }`}
                      >
                        <span>{illum}</span>
                        <span
                          className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold ${
                            illumination === illum
                              ? 'bg-white/20 text-white'
                              : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300'
                          }`}
                        >
                          Code: {code}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Daily Footfall / Traffic
                  </label>
                  <input
                    type="text"
                    value={trafficFootfall}
                    onChange={(e) => setTrafficFootfall(e.target.value)}
                    placeholder="e.g. 220,000 vehicles/day"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#2C2E33] bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-[#AF1763]/30 focus:border-[#AF1763]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Facing Direction & Corridor
                  </label>
                  <input
                    type="text"
                    value={facingDirection}
                    onChange={(e) => setFacingDirection(e.target.value)}
                    placeholder="e.g. Traffic towards South Mumbai"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#2C2E33] bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-[#AF1763]/30 focus:border-[#AF1763]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PRICING & SITE VENDOR DETAILS */}
          {activeTab === 'pricing' && (
            <div className="space-y-5 animate-fade-in">
              {/* Monthly Rate */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Monthly Rental / Investment Rate (₹ INR) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                    ₹
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={ratePerMonth}
                    onChange={(e) => setRatePerMonth(parseFloat(e.target.value) || 0)}
                    placeholder="350000"
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-[#2C2E33] bg-white dark:bg-slate-800 text-base font-extrabold text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-[#AF1763]/30 focus:border-[#AF1763]"
                  />
                </div>
                {errors.ratePerMonth && <p className="text-xs text-rose-500 mt-1">{errors.ratePerMonth}</p>}
              </div>

              {/* SITE VENDOR DETAILS WITH AUTO-SAVE & DYNAMIC LIST */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0F1117] border border-slate-200 dark:border-[#2C2E33] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-[#AF1763] dark:text-[#0DCAF0]" />
                    <label className="text-xs font-bold text-slate-900 dark:text-white">
                      Site Concessionaire / Owning Vendor
                    </label>
                  </div>

                  {!isAddingVendor && (
                    <button
                      type="button"
                      onClick={() => setIsAddingVendor(true)}
                      className="text-xs font-semibold text-[#AF1763] dark:text-[#0DCAF0] hover:text-[#AF1763] dark:hover:text-[#0DCAF0] flex items-center gap-1 bg-white dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-[#2C2E33] shadow-sm transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add New Vendor</span>
                    </button>
                  )}
                </div>

                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Select which agency or concessionaire owns the physical rights to this site. Once entered, the vendor appears in the permanent dropdown list for all future sites.
                </p>

                {isAddingVendor ? (
                  <div className="space-y-2 p-3 rounded-xl bg-white dark:bg-[#191C24] border border-rose-200 dark:border-rose-800 animate-fade-in">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                        Vendor / Agency Company Name:
                      </label>
                      <input
                        type="text"
                        value={newVendorName}
                        onChange={(e) => setNewVendorName(e.target.value)}
                        placeholder="e.g. Apex Outdoor Advertising / Pioneer Media"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-[#2C2E33] bg-slate-50 dark:bg-slate-800"
                        autoFocus
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] text-slate-400 mb-0.5">
                          Contact Person / Account Manager:
                        </label>
                        <input
                          type="text"
                          value={newVendorContact}
                          onChange={(e) => setNewVendorContact(e.target.value)}
                          placeholder="e.g. Rahul Sharma"
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-[#2C2E33] bg-slate-50 dark:bg-slate-800"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-400 mb-0.5">
                          Phone / Email:
                        </label>
                        <input
                          type="text"
                          value={newVendorPhone}
                          onChange={(e) => setNewVendorPhone(e.target.value)}
                          placeholder="+91 98200 XXXXX / sales@vendor.com"
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-[#2C2E33] bg-slate-50 dark:bg-slate-800"
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingVendor(false);
                          setNewVendorName('');
                        }}
                        className="px-3 py-1.5 text-xs text-slate-500 hover:bg-slate-100 rounded-lg"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleAddNewVendor}
                        className="px-3 py-1.5 text-xs font-bold bg-gradient-to-r from-[#AF1763] to-[#0DCAF0] text-white rounded-lg hover:brightness-105 shadow-sm flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Save Vendor to List</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <select
                        value={vendorName}
                        onChange={(e) => handleVendorSelect(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#2C2E33] bg-white dark:bg-slate-800 text-sm font-medium text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-[#AF1763]/30 focus:border-[#AF1763] cursor-pointer"
                      >
                        <option value="">-- Select Owning Vendor --</option>
                        {vendors.map((v) => (
                          <option key={v.id || v.name} value={v.name}>
                            {v.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <input
                        type="text"
                        value={vendorContact}
                        onChange={(e) => setVendorContact(e.target.value)}
                        placeholder="Vendor Contact Info (Phone / Desk / Lead)"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#2C2E33] bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-[#AF1763]/30"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Proposal Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Internal Proposal Notes & Visibility Analysis
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Prime corridor with uninterrupted 300m visibility. Guarantees 6-8 minutes dwell time during evening peak hours."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#2C2E33] bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-[#AF1763]/30 focus:border-[#AF1763]"
                />
              </div>
            </div>
          )}

          {/* TAB 5: MEDIA UPLOAD & GALLERY */}
          {activeTab === 'photos' && (
            <div className="space-y-6 animate-fade-in">
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                  isDragging
                    ? 'border-[#AF1763] bg-rose-50/50 dark:bg-rose-950/20'
                    : 'border-slate-300 dark:border-[#2C2E33] hover:border-[#AF1763] bg-slate-50/50 dark:bg-slate-800/40'
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => handleFileSelect(e.target.files)}
                  multiple
                  accept="image/*"
                  className="hidden"
                />
                <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950/80 text-[#AF1763] dark:text-[#0DCAF0] flex items-center justify-center mx-auto mb-3">
                  <Upload className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  Drop high-resolution photos here, or browse
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Upload Day view, Night view, and Long-angle corridor shots (PNG, JPG, WebP)
                </p>
              </div>

              {errors.photos && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 text-rose-600 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errors.photos}</span>
                </div>
              )}

              {/* Quick Preset Asset Chooser */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                    Quick-Add From Campaign Asset Library:
                  </span>
                  <span className="text-[11px] text-slate-400">Click to attach photo</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {BUNDLED_ASSETS.map((asset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleAddBundledAsset(asset)}
                      className="flex items-center gap-2 p-2 rounded-xl border border-slate-200 dark:border-[#2C2E33] bg-white dark:bg-slate-800 hover:border-[#AF1763] text-left transition-colors"
                    >
                      <img
                        src={asset.url}
                        alt={asset.name}
                        className="w-10 h-10 rounded-lg object-cover shrink-0"
                      />
                      <div className="overflow-hidden">
                        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                          {asset.name}
                        </p>
                        <span className="text-[10px] text-[#AF1763] dark:text-[#0DCAF0]">
                          +{asset.angle}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Uploaded Photos Gallery Preview */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
                  Site Photographs ({photos.length} uploaded)
                </h4>

                <div className="space-y-3">
                  {photos.map((photo) => (
                    <div
                      key={photo.id}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 rounded-2xl border border-slate-200 dark:border-[#2C2E33] bg-white dark:bg-[#222631] shadow-sm"
                    >
                      <div className="flex items-center gap-3 w-full sm:w-auto">
                        <div className="relative w-20 h-14 rounded-xl overflow-hidden shrink-0 border border-slate-200 dark:border-[#2C2E33]">
                          <img
                            src={photo.url}
                            alt={photo.caption}
                            className="w-full h-full object-cover"
                          />
                          {photo.is_primary && (
                            <span className="absolute top-1 left-1 px-1 rounded bg-gradient-to-r from-[#AF1763] to-[#0DCAF0] text-white text-[9px] font-bold">
                              Primary
                            </span>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <input
                            type="text"
                            value={photo.caption}
                            onChange={(e) => handlePhotoCaptionChange(photo.id, e.target.value)}
                            placeholder="Caption (e.g. Frontal Arterial View)"
                            className="w-full px-2.5 py-1 text-xs rounded-lg border border-slate-200 dark:border-[#2C2E33] bg-slate-50 dark:bg-[#191C24] text-slate-800 dark:text-slate-200"
                          />
                          <div className="flex items-center gap-2 mt-1">
                            <select
                              value={photo.angle || 'Day Shot'}
                              onChange={(e) => handlePhotoAngleChange(photo.id, e.target.value as PhotoAngle)}
                              className="text-[11px] px-2 py-0.5 rounded border border-slate-200 dark:border-[#2C2E33] bg-slate-50 dark:bg-[#191C24] text-slate-700 dark:text-slate-300"
                            >
                              {PHOTO_ANGLES.map((angle) => (
                                <option key={angle} value={angle}>
                                  {angle}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <button
                          type="button"
                          onClick={() => handleSetPrimaryPhoto(photo.id)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                            photo.is_primary
                              ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                              : 'text-slate-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-slate-700'
                          }`}
                          title="Set as primary showcase photo"
                        >
                          <Star className={`w-3.5 h-3.5 ${photo.is_primary ? 'fill-amber-500 text-amber-500' : ''}`} />
                          <span>{photo.is_primary ? 'Primary Photo' : 'Set Primary'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeletePhoto(photo.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-700 transition-colors"
                          title="Delete photo"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </form>

        {/* Modal Bottom Actions Bar */}
        <div className="flex items-center justify-between p-4 sm:px-6 border-t border-slate-200 dark:border-[#2C2E33] bg-slate-50 dark:bg-[#222631] shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            {activeTab !== 'basic' && (
              <button
                type="button"
                onClick={() => {
                  const idx = tabs.findIndex((t) => t.id === activeTab);
                  if (idx > 0) setActiveTab(tabs[idx - 1].id as any);
                }}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-[#2C2E33] bg-white dark:bg-slate-800 font-medium hover:bg-slate-100"
              >
                Back
              </button>
            )}
            {activeTab !== 'photos' && (
              <button
                type="button"
                onClick={() => {
                  const idx = tabs.findIndex((t) => t.id === activeTab);
                  if (idx < tabs.length - 1) setActiveTab(tabs[idx + 1].id as any);
                }}
                className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 font-semibold hover:bg-slate-300 text-slate-800 dark:text-slate-200"
              >
                Next Section →
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-[#AF1763] to-[#0DCAF0] hover:brightness-105 text-white shadow-md shadow-[#AF1763]/25 transition-all flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{mode === 'edit' ? 'Update Site' : 'Save Site to Inventory'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


