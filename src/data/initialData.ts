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

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'PC-94820',
    createdAt: '2026-09-14T06:45:00Z',
    customerName: 'Customer A (Arthur Pendelton)',
    phone: '(253) 555-7320',
    email: 'arthur.pendelton@gmail.com',
    streetAddress: '3120 SW 320th St',
    aptUnit: 'Apt 12B',
    city: 'Federal Way',
    state: 'WA',
    zipCode: '98023',
    propertyType: 'apartment',
    hasPets: false,
    parkingAccess: 'parking_lot',
    date: '2026-09-14',
    timeSlot: '07:30 AM - 09:30 AM',
    exactTime: '07:30 AM',
    services: [
      { id: 'living_room_carpet', name: 'Living Room Carpet Cleaning', quantity: 1, unitPrice: 80, total: 80 },
      { id: 'bedroom_carpet', name: 'Master Bedroom Carpet', quantity: 2, unitPrice: 50, total: 100 }
    ],
    addOns: [
      { name: 'Scotchgard™ Stain Shield Protector', price: 30 },
      { name: 'Citrus Fresh Anti-Allergen Sanitizer', price: 20 }
    ],
    totalPrice: 230,
    discount: 15,
    status: 'confirmed',
    technician: 'Dave & Crew 1 (Truck #3)',
    customerNotes: 'Please ring bell at security gate. Heavy coffee stain near bay window.',
    staffNotes: 'Confirmed 7:30 AM arrival window. Access gate code given to driver.',
    notesList: [
      {
        id: 'note-1',
        createdAt: '2026-09-14T06:50:00Z',
        author: 'Dispatch Coordinator',
        category: 'staff',
        text: 'Confirmed Monday morning start at 7:30 AM sharp with Customer A.'
      },
      {
        id: 'note-2',
        createdAt: '2026-09-14T07:05:00Z',
        author: 'Driver Dave',
        category: 'technician',
        text: 'Loaded truck #3 with commercial carpet extraction wand and extra stain shield.'
      }
    ],
    paymentStatus: 'paid_deposit',
    paymentHistory: [
      {
        id: 'pay-1',
        amount: 50,
        date: '2026-09-14T06:55:00Z',
        method: 'card',
        reference: 'VISA-9412',
        notes: 'Initial booking deposit authorization'
      }
    ]
  },
  {
    id: 'PC-94819',
    createdAt: '2026-09-14T07:15:00Z',
    customerName: 'Customer B (Beatrice Cooper)',
    phone: '(425) 555-9502',
    email: 'beatrice.cooper@yahoo.com',
    streetAddress: '10200 NE 8th St',
    city: 'Bellevue',
    state: 'WA',
    zipCode: '98004',
    propertyType: 'single_family',
    hasPets: true,
    petDetails: '1 Persian cat (indoor, gentle)',
    parkingAccess: 'driveway',
    date: '2026-09-14',
    timeSlot: '09:50 AM - 11:50 AM',
    exactTime: '09:50 AM',
    services: [
      { id: 'sofa_standard', name: 'Standard Sofa / Couch Cleaning', quantity: 1, unitPrice: 90, total: 90 },
      { id: 'loveseat', name: 'Loveseat Upholstery Shampoo', quantity: 1, unitPrice: 70, total: 70 }
    ],
    addOns: [
      { name: 'Pet Urine & Deep Odor Neutralizer', price: 35 }
    ],
    totalPrice: 195,
    discount: 10,
    status: 'pending',
    technician: 'Carlos M. (Truck #1)',
    customerNotes: 'Navy blue velvet sofa. Needs delicate fabric low-moisture clean.',
    staffNotes: 'Customer B called to verify velvet fabric handling before crew leaves.',
    notesList: [
      {
        id: 'note-3',
        createdAt: '2026-09-14T07:30:00Z',
        author: 'Front Desk',
        category: 'customer',
        text: 'Customer B requested 9:50 AM arrival immediately following morning school drop-off.'
      }
    ],
    paymentStatus: 'unpaid',
    paymentHistory: []
  },
  {
    id: 'PC-94821',
    createdAt: '2026-09-14T09:30:00Z',
    customerName: 'Marcus Sterling',
    phone: '(425) 555-4921',
    email: 'marcus.sterling@gmail.com',
    streetAddress: '16600 NE 76th St',
    aptUnit: 'Apt 4B',
    city: 'Redmond',
    state: 'WA',
    zipCode: '98052',
    propertyType: 'single_family',
    hasPets: true,
    petDetails: '1 Golden Retriever (friendly, crated in guest room)',
    parkingAccess: 'driveway',
    date: '2026-09-14',
    timeSlot: '02:30 PM - 05:30 PM',
    exactTime: '02:30 PM',
    services: [
      { id: 'living_room_carpet', name: 'Living Room Carpet Cleaning', quantity: 1, unitPrice: 80, total: 80 },
      { id: 'bedroom_carpet', name: 'Bedroom Carpet', quantity: 2, unitPrice: 50, total: 100 },
      { id: 'hallway_stairs', name: 'Hallway & Staircase', quantity: 1, unitPrice: 45, total: 45 }
    ],
    addOns: [
      { name: 'Pet Urine & Deep Odor Neutralizer', price: 35 },
      { name: 'Scotchgard™ Stain Shield Protector', price: 30 }
    ],
    totalPrice: 275,
    discount: 15,
    status: 'in_progress',
    technician: 'Dave & Crew 1 (Truck #3)',
    customerNotes: 'Red wine spill in living room corner from weekend party. Driveway has room for van.',
    staffNotes: 'Eco-friendly rinse requested. Crew currently on route with Truck #3.',
    notesList: [
      {
        id: 'note-4',
        createdAt: '2026-09-14T14:15:00Z',
        author: 'Dave (Tech)',
        category: 'technician',
        text: 'Truck #3 en route, GPS updated, ETA 2:30 PM.'
      }
    ],
    paymentStatus: 'paid_full',
    paymentHistory: [
      {
        id: 'pay-2',
        amount: 275,
        date: '2026-09-14T09:40:00Z',
        method: 'card',
        reference: 'AMEX-1002',
        notes: 'Pre-paid in full online'
      }
    ]
  },
  {
    id: 'PC-94822',
    createdAt: '2026-09-14T11:15:00Z',
    customerName: 'Elena Rostova',
    phone: '(425) 555-8312',
    email: 'elena.rostova@outlook.com',
    streetAddress: '1200 Park Ave N',
    city: 'Renton',
    state: 'WA',
    zipCode: '98056',
    propertyType: 'single_family',
    hasPets: false,
    parkingAccess: 'driveway',
    date: '2026-09-15',
    timeSlot: '08:30 AM - 11:30 AM',
    exactTime: '08:30 AM',
    services: [
      { id: 'sectional_sofa', name: 'Sectional Sofa (L/U Shape)', quantity: 1, unitPrice: 145, total: 145 },
      { id: 'area_rug', name: 'Area Rug / Wool Rug', quantity: 1, unitPrice: 50, total: 50 }
    ],
    addOns: [
      { name: 'Scotchgard™ Stain Shield Protector', price: 30 }
    ],
    totalPrice: 225,
    discount: 0,
    status: 'confirmed',
    technician: 'Carlos M. (Truck #1)',
    customerNotes: 'Light gray linen sectional with juice spots.',
    staffNotes: 'Bring delicate upholstery low-moisture hand tool.',
    paymentStatus: 'paid_deposit',
    paymentHistory: [
      {
        id: 'pay-3',
        amount: 50,
        date: '2026-09-14T11:20:00Z',
        method: 'card',
        reference: 'VISA-3819'
      }
    ]
  },
  {
    id: 'PC-94823',
    createdAt: '2026-09-14T14:40:00Z',
    customerName: 'Derrick Vance',
    phone: '(253) 555-9011',
    email: 'derrick.vance@techcorp.io',
    streetAddress: '24000 104th Ave SE',
    aptUnit: 'Suite 1804',
    city: 'Kent',
    state: 'WA',
    zipCode: '98030',
    propertyType: 'apartment',
    hasPets: true,
    petDetails: '1 Siamese cat (quiet)',
    parkingAccess: 'parking_lot',
    date: '2026-09-15',
    timeSlot: '01:15 PM - 03:45 PM',
    exactTime: '01:15 PM',
    services: [
      { id: 'living_room_carpet', name: 'Carpet Cleaning (Living Room)', quantity: 1, unitPrice: 80, total: 80 },
      { id: 'mattress_clean', name: 'Mattress Sanitizing (Queen/King)', quantity: 1, unitPrice: 70, total: 70 }
    ],
    addOns: [
      { name: 'Citrus Fresh Anti-Allergen Sanitizer', price: 20 }
    ],
    totalPrice: 170,
    discount: 0,
    status: 'pending',
    technician: 'Unassigned',
    customerNotes: 'Freight elevator booked from 1:00 PM. Gate code is #4912.',
    staffNotes: 'Portable extraction unit required for high-rise.',
    paymentStatus: 'unpaid'
  },
  {
    id: 'PC-94824',
    createdAt: '2026-09-13T16:20:00Z',
    customerName: 'Claire Abernathy',
    phone: '(425) 555-3398',
    email: 'claire.abernathy@yahoo.com',
    streetAddress: '2800 Colby Ave',
    city: 'Everett',
    state: 'WA',
    zipCode: '98201',
    propertyType: 'single_family',
    hasPets: false,
    parkingAccess: 'driveway',
    date: '2026-09-16',
    timeSlot: '08:00 AM - 10:30 AM',
    exactTime: '08:00 AM',
    services: [
      { id: 'living_room_carpet', name: 'Living Room Carpet Cleaning', quantity: 2, unitPrice: 80, total: 160 },
      { id: 'sofa_standard', name: 'Standard Sofa / Couch', quantity: 1, unitPrice: 90, total: 90 }
    ],
    addOns: [
      { name: 'Scotchgard™ Stain Shield Protector', price: 30 },
      { name: 'Heavy High-Traffic Pre-Scrub Agitation', price: 25 }
    ],
    totalPrice: 275,
    discount: 30,
    status: 'confirmed',
    technician: 'Dave & Crew 1 (Truck #3)',
    customerNotes: 'Staircase and upstairs bonus room. Super friendly!',
    staffNotes: 'Confirmed for Wednesday morning.',
    paymentStatus: 'paid_full',
    paymentHistory: [
      {
        id: 'pay-4',
        amount: 275,
        date: '2026-09-14T08:00:00Z',
        method: 'card',
        reference: 'MC-8219'
      }
    ]
  },
  {
    id: 'PC-94825',
    createdAt: '2026-09-14T08:10:00Z',
    customerName: 'Robert Gomez',
    phone: '(425) 555-7281',
    email: 'rgomez.photo@gmail.com',
    streetAddress: '14800 NE 24th St',
    aptUnit: 'Unit 201',
    city: 'Redmond',
    state: 'WA',
    zipCode: '98052',
    propertyType: 'office',
    hasPets: false,
    parkingAccess: 'parking_lot',
    date: '2026-09-16',
    timeSlot: '11:00 AM - 01:30 PM',
    exactTime: '11:00 AM',
    services: [
      { id: 'car_interior', name: 'Vehicle Interior Shampoo', quantity: 1, unitPrice: 95, total: 95 },
      { id: 'sofa_standard', name: 'Standard Sofa / Couch', quantity: 2, unitPrice: 90, total: 180 }
    ],
    addOns: [
      { name: 'Pet Urine & Deep Odor Neutralizer', price: 35 }
    ],
    totalPrice: 295,
    discount: 15,
    status: 'confirmed',
    technician: 'Marcus K.',
    customerNotes: 'Office reception couch and SUV parked in visitor bay #5.',
    staffNotes: 'Confirmed visitor parking pass at lobby security.',
    paymentStatus: 'paid_full',
    paymentHistory: [
      {
        id: 'pay-5',
        amount: 295,
        date: '2026-09-14T08:15:00Z',
        method: 'zelle',
        reference: 'ZLL-9482',
        notes: 'Studio corporate account Zelle'
      }
    ]
  },
  {
    id: 'PC-94826',
    createdAt: '2026-09-12T10:00:00Z',
    customerName: 'Samantha Lee',
    phone: '(253) 555-1940',
    email: 'sam.lee77@gmail.com',
    streetAddress: '1110 3rd Ave S',
    aptUnit: 'Apt 1208',
    city: 'Federal Way',
    state: 'WA',
    zipCode: '98003',
    propertyType: 'apartment',
    hasPets: true,
    petDetails: '2 French Bulldogs',
    parkingAccess: 'street',
    date: '2026-09-17',
    timeSlot: '02:00 PM - 04:30 PM',
    exactTime: '02:00 PM',
    services: [
      { id: 'living_room_carpet', name: 'Carpet Cleaning', quantity: 1, unitPrice: 80, total: 80 },
      { id: 'sectional_sofa', name: 'Sectional Sofa (L/U Shape)', quantity: 1, unitPrice: 145, total: 145 }
    ],
    addOns: [
      { name: 'Pet Urine & Deep Odor Neutralizer', price: 35 }
    ],
    totalPrice: 260,
    discount: 0,
    status: 'pending',
    technician: 'Unassigned',
    customerNotes: 'Need thorough pet odor treatment on sofa cushions.',
    staffNotes: 'Follow up call scheduled for tomorrow morning.',
    paymentStatus: 'unpaid'
  },
  {
    id: 'PC-94827',
    createdAt: '2026-09-13T14:10:00Z',
    customerName: 'Customer C (Charles Montgomery)',
    phone: '(425) 555-4019',
    email: 'cmontgomery@everettlegal.com',
    streetAddress: '1000 SE Everett Mall Way',
    aptUnit: 'Suite 400',
    city: 'Everett',
    state: 'WA',
    zipCode: '98208',
    propertyType: 'office',
    hasPets: false,
    parkingAccess: 'parking_lot',
    date: '2026-09-14',
    timeSlot: '05:15 PM - 07:30 PM',
    exactTime: '05:15 PM',
    services: [
      { id: 'living_room_carpet', name: 'Commercial Carpet Steam Cleaning', quantity: 4, unitPrice: 75, total: 300 }
    ],
    addOns: [
      { name: 'Scotchgard™ Stain Shield Protector', price: 30 },
      { name: 'Citrus Fresh Anti-Allergen Sanitizer', price: 20 }
    ],
    totalPrice: 350,
    discount: 25,
    status: 'confirmed',
    technician: 'Dave & Crew 1 (Truck #3)',
    customerNotes: 'After hours office cleaning. Security guard on 4th floor will badge team in.',
    staffNotes: 'Confirmed after-hours badge access with building security.',
    paymentStatus: 'paid_full',
    paymentHistory: [
      {
        id: 'pay-6',
        amount: 350,
        date: '2026-09-14T10:00:00Z',
        method: 'card',
        reference: 'CORP-AMEX-9921',
        notes: 'Corporate billing card'
      }
    ]
  },
  {
    id: 'PC-94828',
    createdAt: '2026-09-13T09:00:00Z',
    customerName: 'Oakridge Executive Suites',
    phone: '(425) 555-8812',
    email: 'facilities@oakridgesuites.com',
    streetAddress: '500 108th Ave NE',
    city: 'Bellevue',
    state: 'WA',
    zipCode: '98004',
    propertyType: 'office',
    hasPets: false,
    parkingAccess: 'parking_lot',
    date: '2026-09-18',
    timeSlot: '09:00 AM - 12:00 PM',
    exactTime: '09:00 AM',
    services: [
      { id: 'sofa_standard', name: 'Executive Lounge Sofa & Armchairs', quantity: 3, unitPrice: 90, total: 270 },
      { id: 'living_room_carpet', name: 'Conference Room Carpet Steam', quantity: 2, unitPrice: 80, total: 160 }
    ],
    addOns: [
      { name: 'Scotchgard™ Stain Shield Protector', price: 30 }
    ],
    totalPrice: 460,
    discount: 40,
    status: 'confirmed',
    technician: 'Dave & Crew 1 (Truck #3)',
    customerNotes: 'Pre-event sanitization before executive board meeting.',
    staffNotes: 'Bring extra air movers to accelerate drying time.',
    paymentStatus: 'paid_deposit',
    paymentHistory: [
      {
        id: 'pay-7',
        amount: 100,
        date: '2026-09-13T09:30:00Z',
        method: 'check',
        reference: 'CHK-4819'
      }
    ]
  }
];

export const REVIEWS: ReviewItem[] = [
  {
    id: 'rev-1',
    author: 'Sarah Jenkins',
    location: 'Bellevue, WA',
    rating: 5,
    date: '3 days ago',
    service: 'Carpet & Pet Odor Extraction',
    text: 'We had stubborn dog urine stains and heavy foot traffic in the living room. Dave arrived right at 8 AM, measured everything honestly, and within 90 minutes our carpet looked practically brand new! Zero chemical smell, just crisp clean freshness.',
    verified: true
  },
  {
    id: 'rev-2',
    author: 'James Harrington',
    location: 'Redmond, WA',
    rating: 5,
    date: '1 week ago',
    service: 'Sectional Sofa Deep Shampoo',
    text: 'Booking through the website took 2 minutes. The instant price calculator was 100% accurate—no hidden upcharges or surprise fees when the technician arrived. Saved us over $1,800 compared to replacing our sectional couch!',
    verified: true
  },
  {
    id: 'rev-3',
    author: 'Emily Rodriguez',
    location: 'Federal Way, WA',
    rating: 5,
    date: '2 weeks ago',
    service: 'Mattress & Area Rug Restoration',
    text: 'Extremely polite crew, wore shoe coverings the entire time, and put protective corner guards around our walls. The hot steam extraction brought our antique wool rug back to life. Will definitely book every spring!',
    verified: true
  },
  {
    id: 'rev-4',
    author: 'David K. Miller',
    location: 'Renton, WA',
    rating: 5,
    date: '3 weeks ago',
    service: 'Whole House 4-Room Steam Clean',
    text: 'Fastest drying time I’ve ever experienced with a steam cleaning company. By the evening it was already dry to walk on in socks. The tracking dashboard and text notifications were super reassuring.',
    verified: true
  }
];

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
