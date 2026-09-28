import { ServiceItem, AddOnItem, Booking, ReviewItem, BeforeAfterItem, TimeSlotOption } from '../types';

export const SERVICES: ServiceItem[] = [
  // 1. Cleaning Carpets
  {
    id: 'living_room_carpet',
    name: 'Carpet Cleaning (Living / Main Room)',
    category: 'carpet',
    basePrice: 80,
    unit: 'room (up to 250 sq ft)',
    icon: 'Sparkles',
    description: 'Deep high-pressure hot water steam extraction with pre-spray enzyme agitation.',
    popular: true
  },
  {
    id: 'bedroom_carpet',
    name: 'Carpet Cleaning (Bedroom / Study)',
    category: 'carpet',
    basePrice: 50,
    unit: 'room (up to 180 sq ft)',
    icon: 'BedDouble',
    description: 'Gentle fiber-safe sanitization, dust mite removal, and fast-drying airflow wand.'
  },
  {
    id: 'hallway_stairs',
    name: 'Carpet Cleaning (Hallway & Stairs)',
    category: 'carpet',
    basePrice: 45,
    unit: 'flight or hallway',
    icon: 'Footprints',
    description: 'High-traffic footstep dirt elimination and stair tread spot precision clean.'
  },

  // 2. Upholstery Cleaning
  {
    id: 'upholstery_armchair',
    name: 'Upholstery Cleaning (Armchair / Recliner)',
    category: 'upholstery',
    basePrice: 45,
    unit: 'armchair or recliner',
    icon: 'Armchair',
    description: 'Deep fabric shampoo and gentle extraction for upholstered armchairs, recliners, and accents.'
  },
  {
    id: 'upholstery_dining',
    name: 'Upholstery Cleaning (Dining Chairs)',
    category: 'upholstery',
    basePrice: 25,
    unit: 'per cushioned chair',
    icon: 'Armchair',
    description: 'Food spill, grease, and spot removal for fabric-padded dining and study chairs.'
  },

  // 3. Couch and Sofa Cleaning
  {
    id: 'sofa_standard',
    name: 'Couch & Sofa Cleaning (Standard 2-3 Seater)',
    category: 'couch_sofa',
    basePrice: 90,
    unit: '3-seater sofa',
    icon: 'Sofa',
    description: 'Deep fiber shampoo, crease extraction, body oil removal, and delicate fabric restorative rinse.',
    popular: true
  },
  {
    id: 'sectional_sofa',
    name: 'Couch & Sofa Cleaning (Sectional L/U Shape)',
    category: 'couch_sofa',
    basePrice: 145,
    unit: 'large sectional',
    icon: 'Sofa',
    description: 'Comprehensive cushion and backrest extraction, deodorization, and pile refresh.'
  },

  // 4. Mattress Cleaning
  {
    id: 'mattress_clean',
    name: 'Mattress Cleaning (Queen / King)',
    category: 'mattress',
    basePrice: 70,
    unit: 'mattress',
    icon: 'Moon',
    description: 'Hospital-grade allergen neutralization, sweat stain treatment, and steam sanitizing.'
  },
  {
    id: 'mattress_twin',
    name: 'Mattress Cleaning (Twin / Full)',
    category: 'mattress',
    basePrice: 55,
    unit: 'twin / full mattress',
    icon: 'Moon',
    description: 'Deep anti-dust mite steam extraction, allergen sanitization, and rapid dry treatment.'
  },

  // 5. Area Rug Cleaning
  {
    id: 'area_rug',
    name: 'Area Rug Cleaning (Wool, Persian & Synthetic)',
    category: 'area_rug',
    basePrice: 50,
    unit: 'standard rug (up to 8x10)',
    icon: 'Layers',
    description: 'Careful pH-balanced wash for wool, Persian, synthetic, and delicate fringed rugs.'
  },
  {
    id: 'large_area_rug',
    name: 'Area Rug Cleaning (Large / Delicate Silk)',
    category: 'area_rug',
    basePrice: 85,
    unit: 'large rug (up to 10x14)',
    icon: 'Layers',
    description: 'Specialized low-moisture restorative bath for oversized, antique, or delicate silk rugs.'
  },

  // 6. Painting Services
  {
    id: 'interior_room_painting',
    name: 'Interior Room Painting (Walls & Prep)',
    category: 'painting',
    basePrice: 180,
    unit: 'standard room (up to 12x14)',
    icon: 'Paintbrush',
    description: 'Full 2-coat interior wall painting including furniture protection, hole patching, light sanding, edge taping, and clean finish.',
    popular: true
  },
  {
    id: 'accent_wall_painting',
    name: 'Accent & Feature Wall Painting',
    category: 'painting',
    basePrice: 95,
    unit: 'single accent wall',
    icon: 'Palette',
    description: 'Precision designer accent wall painting with sharp clean lines, uniform coverage, and vibrant high-end finish.'
  },
  {
    id: 'trim_baseboard_painting',
    name: 'Trim, Baseboards & Door Painting',
    category: 'painting',
    basePrice: 65,
    unit: 'room baseboards or 2 doors',
    icon: 'PaintRoller',
    description: 'Detailed semi-gloss or enamel application on baseboards, door frames, mouldings, and interior passage doors.'
  },
  {
    id: 'cabinet_painting',
    name: 'Cabinet & Vanity Painting / Refinishing',
    category: 'painting',
    basePrice: 220,
    unit: 'cabinet bank or vanity',
    icon: 'Paintbrush',
    description: 'Degreasing, scuff sanding, bonding primer, and durable smooth factory-look spray or roller finish.'
  },
  {
    id: 'exterior_trim_painting',
    name: 'Exterior Trim & Porch Touch-Up Painting',
    category: 'painting',
    basePrice: 150,
    unit: 'porch or exterior section',
    icon: 'PaintRoller',
    description: 'Weather-resistant acrylic latex application on exterior window frames, porch columns, railings, and eaves.'
  },

  // 7. Other Services ("en others")
  {
    id: 'car_interior',
    name: 'Vehicle & Auto Interior Shampoo',
    category: 'other',
    basePrice: 95,
    unit: 'sedan / SUV',
    icon: 'Car',
    description: 'Full car seat steam shampoo, floor carpet extraction, floor mats, and trunk detail.'
  },
  {
    id: 'commercial_clean',
    name: 'Commercial & Office Carpet Cleaning',
    category: 'other',
    basePrice: 120,
    unit: 'office suite / unit',
    icon: 'Building2',
    description: 'High-traffic commercial carpet maintenance and low-moisture encapsulation for offices.'
  }
];

export const ADD_ONS: AddOnItem[] = [
  {
    id: 'pet_enzyme',
    name: 'Pet Urine & Deep Odor Neutralizer',
    price: 35,
    description: 'Sub-surface bio-enzymatic treatment that destroys crystallized uric acid salts.'
  },
  {
    id: 'scotchgard_shield',
    name: 'Scotchgard™ Stain Shield Protector',
    price: 30,
    description: 'Invisible hydrophobic barrier repels liquid spills, dirt, and oils for 12 months.'
  },
  {
    id: 'heavy_traffic_pre_scrub',
    name: 'Heavy High-Traffic Pre-Scrub Agitation',
    price: 25,
    description: 'Rotary scrubbing machine to lift deeply ground-in soil before steam extraction.'
  },
  {
    id: 'anti_allergen_deodorize',
    name: 'Citrus Fresh Anti-Allergen Sanitizer',
    price: 20,
    description: 'Organic botanical disinfectant leaving a subtle natural clean citrus aroma.'
  },
  {
    id: 'drywall_patch_prep',
    name: 'Drywall Hole & Cracks Repair (Heavy Prep)',
    price: 40,
    description: 'Deep spackling, mesh taping, drywall mud skim coat, and seamless feather-sanding before painting.'
  },
  {
    id: 'primer_stain_block',
    name: 'Heavy Stain-Blocking Primer Coat',
    price: 35,
    description: 'High-adhesion shellac or oil primer locking in water stains, grease, or smoke marks.'
  }
];

export const TIME_SLOTS: TimeSlotOption[] = [
  {
    id: 'slot_morning',
    label: 'Morning Slot',
    period: 'morning',
    timeRange: '08:00 AM - 11:00 AM',
    maxCapacity: 3
  },
  {
    id: 'slot_midday',
    label: 'Midday Slot',
    period: 'midday',
    timeRange: '11:30 AM - 02:30 PM',
    maxCapacity: 3
  },
  {
    id: 'slot_afternoon',
    label: 'Afternoon Slot',
    period: 'afternoon',
    timeRange: '03:00 PM - 06:00 PM',
    maxCapacity: 3
  },
  {
    id: 'slot_evening',
    label: 'Evening / Express Slot',
    period: 'evening',
    timeRange: '06:00 PM - 08:30 PM',
    maxCapacity: 2
  }
];

export interface CityCoverage {
  cityName: string;
  zips: string[];
  popularZips: string[];
  description: string;
}

export interface StateCoverage {
  stateCode: string;
  stateName: string;
  cities: CityCoverage[];
}

export const STATES_DATA: StateCoverage[] = [
  {
    stateCode: 'WA',
    stateName: 'Washington',
    cities: [
      {
        cityName: 'Federal Way',
        zips: ['98003', '98023', '98001', '98063', '98093'],
        popularZips: ['98003', '98023'],
        description: 'Downtown Federal Way, Twin Lakes, Campus, Steel Lake, Mirror Lake & Redondo Beach'
      },
      {
        cityName: 'Everett',
        zips: ['98201', '98203', '98204', '98208', '98207'],
        popularZips: ['98201', '98208'],
        description: 'Port Gardner, Silver Lake, Harborview, Cascade View & Snohomish River corridor'
      },
      {
        cityName: 'Renton',
        zips: ['98055', '98056', '98057', '98058', '98059'],
        popularZips: ['98055', '98056', '98058'],
        description: 'Downtown Renton, The Landing, Renton Highlands, Kennydale & Fairwood'
      },
      {
        cityName: 'Kent',
        zips: ['98030', '98031', '98032', '98042', '98064'],
        popularZips: ['98030', '98031', '98032'],
        description: 'Kent East Hill, West Hill, Kent Valley, Panther Lake & Lake Meridian'
      },
      {
        cityName: 'Redmond',
        zips: ['98052', '98053', '98073', '98074'],
        popularZips: ['98052', '98053'],
        description: 'Downtown Redmond, Marymoor Park, Education Hill, Overlake & Grass Lawn'
      },
      {
        cityName: 'Bellevue',
        zips: ['98004', '98005', '98006', '98007', '98008'],
        popularZips: ['98004', '98006', '98007'],
        description: 'Downtown Bellevue, West Bellevue, Crossroads, Factoria, Newport Hills & Somerset'
      }
    ]
  }
];

export const SERVICED_ZIPS: { [zip: string]: { city: string; state: string; area: string } } = {
  // Washington - Federal Way
  '98003': { city: 'Federal Way', state: 'WA', area: 'Downtown & Commons' },
  '98023': { city: 'Federal Way', state: 'WA', area: 'Twin Lakes & Redondo' },
  '98001': { city: 'Federal Way', state: 'WA', area: 'North Federal Way & Algona' },
  '98063': { city: 'Federal Way', state: 'WA', area: 'Campus & Steel Lake' },
  '98093': { city: 'Federal Way', state: 'WA', area: 'Mirror Lake Hub' },

  // Washington - Everett
  '98201': { city: 'Everett', state: 'WA', area: 'Downtown Everett & Port Gardner' },
  '98203': { city: 'Everett', state: 'WA', area: 'Lowell & Beverly Park' },
  '98204': { city: 'Everett', state: 'WA', area: 'Paine Field & West Everett' },
  '98208': { city: 'Everett', state: 'WA', area: 'Silver Lake & Mill Creek Border' },
  '98207': { city: 'Everett', state: 'WA', area: 'Cascade View & Valley' },

  // Washington - Renton
  '98055': { city: 'Renton', state: 'WA', area: 'Downtown & The Landing' },
  '98056': { city: 'Renton', state: 'WA', area: 'Renton Highlands & Kennydale' },
  '98057': { city: 'Renton', state: 'WA', area: 'South Renton & Valley' },
  '98058': { city: 'Renton', state: 'WA', area: 'Fairwood & Cascade' },
  '98059': { city: 'Renton', state: 'WA', area: 'East Renton Highlands & Maple Valley' },

  // Washington - Kent
  '98030': { city: 'Kent', state: 'WA', area: 'Kent East Hill & Lake Meridian' },
  '98031': { city: 'Kent', state: 'WA', area: 'Panther Lake & East Kent' },
  '98032': { city: 'Kent', state: 'WA', area: 'Kent Downtown & West Valley' },
  '98042': { city: 'Kent', state: 'WA', area: 'Covington Border & East Hill' },
  '98064': { city: 'Kent', state: 'WA', area: 'West Hill & Highline Hub' },

  // Washington - Redmond
  '98052': { city: 'Redmond', state: 'WA', area: 'Downtown & Marymoor Park' },
  '98053': { city: 'Redmond', state: 'WA', area: 'Redmond Ridge & Novelty Hill' },
  '98073': { city: 'Redmond', state: 'WA', area: 'Education Hill & North Redmond' },
  '98074': { city: 'Redmond', state: 'WA', area: 'Sammamish Plateau & East Redmond' },

  // Washington - Bellevue
  '98004': { city: 'Bellevue', state: 'WA', area: 'Downtown Bellevue & West Bellevue' },
  '98005': { city: 'Bellevue', state: 'WA', area: 'Wilburton & Spring District' },
  '98006': { city: 'Bellevue', state: 'WA', area: 'Somerset & Factoria' },
  '98007': { city: 'Bellevue', state: 'WA', area: 'Crossroads & Lake Hills' },
  '98008': { city: 'Bellevue', state: 'WA', area: 'Phantom Lake & Robinswood' }
};

export const INITIAL_BOOKINGS: Booking[] = [];

export const REVIEWS: ReviewItem[] = [];

export const BEFORE_AFTER: BeforeAfterItem[] = [
  {
    id: 'ba-1',
    title: 'High-Traffic Living Room Carpet',
    location: 'Federal Way, WA',
    service: 'Hot Water Deep Extraction',
    description: 'Years of ground-in soil, shoe dirt, and dull fibers revived with our commercial truck-mounted dual-wand system.',
    stainType: 'Heavy Soil & Grease',
    beforeImg: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=800&q=80',
    afterImg: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'ba-2',
    title: 'Microfiber Velvet Sectional Sofa',
    location: 'Bellevue, WA',
    service: 'Delicate Low-Moisture Shampoo',
    description: 'Complete removal of coffee stains, body oils, and pet dander from light cream upholstery without fiber water rings.',
    stainType: 'Coffee & Spills',
    beforeImg: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
    afterImg: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'ba-3',
    title: 'Bedroom Plush Carpet & Pet Urine',
    location: 'Everett, WA',
    service: 'Bio-Enzymatic Sub-Surface Rinse',
    description: 'Deep localized injection and extraction pulling out months-old pet accidents and deep odor crystals permanently.',
    stainType: 'Pet Stain & Odor',
    beforeImg: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
    afterImg: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80'
  }
];
