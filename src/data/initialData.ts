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

  // 5. Water / String Treatment
  {
    id: 'water_string_treatment',
    name: 'Water & String / Stain Treatment',
    category: 'water_treatment',
    basePrice: 85,
    unit: 'per affected zone',
    icon: 'Droplets',
    description: 'Emergency water extraction, water ring / string stain restoration, moisture removal, and anti-mildew treatment.',
    popular: true
  },

  // 6. Area Rug Cleaning
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
    stateCode: 'TX',
    stateName: 'Texas',
    cities: [
      {
        cityName: 'Houston',
        zips: ['77001', '77002', '77007', '77019', '77024', '77056', '77079', '77098'],
        popularZips: ['77001', '77002', '77024', '77056'],
        description: 'Downtown, Midtown, Galleria, River Oaks, Memorial & Katy corridor'
      },
      {
        cityName: 'Dallas',
        zips: ['75001', '75201', '75204', '75205', '75219', '75225', '75024'],
        popularZips: ['75001', '75201', '75205'],
        description: 'Downtown Arts District, Highland Park, Uptown, North Dallas & Plano'
      },
      {
        cityName: 'Austin',
        zips: ['78701', '78703', '78704', '78746', '78759'],
        popularZips: ['78701', '78704'],
        description: 'Downtown Austin, South Congress, Westlake & Arboretum'
      },
      {
        cityName: 'San Antonio',
        zips: ['78201', '78209', '78216', '78258'],
        popularZips: ['78201', '78209'],
        description: 'Downtown River Walk, Alamo Heights & Stone Oak'
      },
      {
        cityName: 'Fort Worth',
        zips: ['76102', '76107', '76109', '76132'],
        popularZips: ['76102', '76107'],
        description: 'Sundance Square, Cultural District & TCU area'
      }
    ]
  },
  {
    stateCode: 'FL',
    stateName: 'Florida',
    cities: [
      {
        cityName: 'Orlando',
        zips: ['32801', '32819', '32836', '32803'],
        popularZips: ['32801', '32819'],
        description: 'Downtown Orlando, Dr. Phillips & Lake Nona'
      },
      {
        cityName: 'Miami',
        zips: ['33101', '33131', '33139', '33140'],
        popularZips: ['33101', '33131'],
        description: 'Brickell, Downtown Miami & South Beach'
      },
      {
        cityName: 'Tampa',
        zips: ['33602', '33606', '33609', '33629'],
        popularZips: ['33602', '33606'],
        description: 'Channelside, Hyde Park & South Tampa'
      }
    ]
  },
  {
    stateCode: 'CA',
    stateName: 'California',
    cities: [
      {
        cityName: 'Los Angeles',
        zips: ['90001', '90028', '90210', '90046', '90049'],
        popularZips: ['90001', '90028', '90210'],
        description: 'Beverly Hills, Hollywood, West LA & Brentwood'
      },
      {
        cityName: 'Orange County',
        zips: ['92660', '92626', '92648', '92651'],
        popularZips: ['92660', '92626'],
        description: 'Newport Beach, Irvine & Huntington Beach'
      },
      {
        cityName: 'San Diego',
        zips: ['92101', '92109', '92130'],
        popularZips: ['92101'],
        description: 'Gaslamp Quarter, Pacific Beach & La Jolla'
      }
    ]
  },
  {
    stateCode: 'GA',
    stateName: 'Georgia',
    cities: [
      {
        cityName: 'Atlanta',
        zips: ['30301', '30309', '30328', '30305', '30326'],
        popularZips: ['30301', '30309', '30328'],
        description: 'Buckhead, Midtown, Downtown & Sandy Springs'
      }
    ]
  },
  {
    stateCode: 'IL',
    stateName: 'Illinois',
    cities: [
      {
        cityName: 'Chicago',
        zips: ['60601', '60611', '60614', '60654', '60618'],
        popularZips: ['60601', '60611'],
        description: 'The Loop, Magnificent Mile, Lincoln Park & River North'
      }
    ]
  }
];

export const SERVICED_ZIPS: { [zip: string]: { city: string; state: string; area: string } } = {
  // Texas - Houston
  '77001': { city: 'Houston', state: 'TX', area: 'Downtown & Inner Loop' },
  '77002': { city: 'Houston', state: 'TX', area: 'Midtown & Montrose' },
  '77007': { city: 'Houston', state: 'TX', area: 'Washington Corridor & Heights' },
  '77019': { city: 'Houston', state: 'TX', area: 'River Oaks & Montrose' },
  '77024': { city: 'Houston', state: 'TX', area: 'Memorial & Spring Branch' },
  '77056': { city: 'Houston', state: 'TX', area: 'Galleria & Uptown' },
  '77079': { city: 'Houston', state: 'TX', area: 'Energy Corridor' },
  '77098': { city: 'Houston', state: 'TX', area: 'Upper Kirby & West University' },

  // Texas - Dallas
  '75001': { city: 'Dallas', state: 'TX', area: 'North Dallas / Addison' },
  '75201': { city: 'Dallas', state: 'TX', area: 'Downtown / Arts District' },
  '75204': { city: 'Dallas', state: 'TX', area: 'Uptown / West Village' },
  '75205': { city: 'Dallas', state: 'TX', area: 'Highland Park / SMU' },
  '75219': { city: 'Dallas', state: 'TX', area: 'Oak Lawn / Turtle Creek' },
  '75225': { city: 'Dallas', state: 'TX', area: 'University Park' },
  '75024': { city: 'Dallas', state: 'TX', area: 'Plano / Legacy West' },

  // Texas - Austin & San Antonio & Fort Worth
  '78701': { city: 'Austin', state: 'TX', area: 'Downtown Austin' },
  '78703': { city: 'Austin', state: 'TX', area: 'Tarrytown & Clarksville' },
  '78704': { city: 'Austin', state: 'TX', area: 'South Congress / Barton' },
  '78746': { city: 'Austin', state: 'TX', area: 'Westlake Hills' },
  '78759': { city: 'Austin', state: 'TX', area: 'The Arboretum' },
  '78201': { city: 'San Antonio', state: 'TX', area: 'Central San Antonio' },
  '78209': { city: 'San Antonio', state: 'TX', area: 'Alamo Heights' },
  '78216': { city: 'San Antonio', state: 'TX', area: 'North Central San Antonio' },
  '78258': { city: 'San Antonio', state: 'TX', area: 'Stone Oak' },
  '76102': { city: 'Fort Worth', state: 'TX', area: 'Downtown / Sundance Square' },
  '76107': { city: 'Fort Worth', state: 'TX', area: 'Cultural District' },
  '76109': { city: 'Fort Worth', state: 'TX', area: 'TCU Area' },
  '76132': { city: 'Fort Worth', state: 'TX', area: 'Southwest Fort Worth' },

  // Florida
  '32801': { city: 'Orlando', state: 'FL', area: 'Downtown Orlando' },
  '32819': { city: 'Orlando', state: 'FL', area: 'Dr. Phillips / International Dr' },
  '32836': { city: 'Orlando', state: 'FL', area: 'Windermere / Bay Hill' },
  '32803': { city: 'Orlando', state: 'FL', area: 'Colonialtown & Mills 50' },
  '33101': { city: 'Miami', state: 'FL', area: 'Brickell & Miami Metro' },
  '33131': { city: 'Miami', state: 'FL', area: 'Brickell Key & Downtown Miami' },
  '33139': { city: 'Miami', state: 'FL', area: 'South Beach' },
  '33140': { city: 'Miami', state: 'FL', area: 'Mid Beach Miami' },
  '33602': { city: 'Tampa', state: 'FL', area: 'Downtown Tampa & Channelside' },
  '33606': { city: 'Tampa', state: 'FL', area: 'Hyde Park & Davis Islands' },
  '33609': { city: 'Tampa', state: 'FL', area: 'South Tampa' },
  '33629': { city: 'Tampa', state: 'FL', area: 'Palma Ceia' },

  // California
  '90001': { city: 'Los Angeles', state: 'CA', area: 'Los Angeles Metro' },
  '90028': { city: 'Los Angeles', state: 'CA', area: 'Hollywood & West Hollywood' },
  '90210': { city: 'Los Angeles', state: 'CA', area: 'Beverly Hills' },
  '90046': { city: 'Los Angeles', state: 'CA', area: 'Sunset Strip & Hollywood Hills' },
  '90049': { city: 'Los Angeles', state: 'CA', area: 'Brentwood' },
  '92660': { city: 'Orange County', state: 'CA', area: 'Newport Beach' },
  '92626': { city: 'Orange County', state: 'CA', area: 'Costa Mesa / South Coast' },
  '92648': { city: 'Orange County', state: 'CA', area: 'Huntington Beach' },
  '92651': { city: 'Orange County', state: 'CA', area: 'Laguna Beach' },
  '92101': { city: 'San Diego', state: 'CA', area: 'Downtown & Gaslamp' },
  '92109': { city: 'San Diego', state: 'CA', area: 'Pacific Beach & Mission Beach' },
  '92130': { city: 'San Diego', state: 'CA', area: 'Carmel Valley' },

  // Georgia
  '30301': { city: 'Atlanta', state: 'GA', area: 'Downtown Atlanta' },
  '30309': { city: 'Atlanta', state: 'GA', area: 'Midtown / Atlantic Station' },
  '30328': { city: 'Atlanta', state: 'GA', area: 'Sandy Springs' },
  '30305': { city: 'Atlanta', state: 'GA', area: 'Buckhead Village' },
  '30326': { city: 'Atlanta', state: 'GA', area: 'Lenox / Phipps Plaza' },

  // Illinois
  '60601': { city: 'Chicago', state: 'IL', area: 'Chicago Loop / Near East Side' },
  '60611': { city: 'Chicago', state: 'IL', area: 'Streeterville / Magnificent Mile' },
  '60614': { city: 'Chicago', state: 'IL', area: 'Lincoln Park & DePaul' },
  '60654': { city: 'Chicago', state: 'IL', area: 'River North' },
  '60618': { city: 'Chicago', state: 'IL', area: 'Avondale & Roscoe Village' }
};

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'PC-94820',
    createdAt: '2026-09-14T06:45:00Z',
    customerName: 'Customer A (Arthur Pendelton)',
    phone: '(832) 555-7320',
    email: 'arthur.pendelton@gmail.com',
    streetAddress: '1420 Post Oak Blvd',
    aptUnit: 'Apt 12B',
    city: 'Houston',
    state: 'TX',
    zipCode: '77056',
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
    phone: '(832) 555-9502',
    email: 'beatrice.cooper@yahoo.com',
    streetAddress: '3804 Westheimer Rd',
    city: 'Houston',
    state: 'TX',
    zipCode: '77027',
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
    phone: '(832) 555-4921',
    email: 'marcus.sterling@gmail.com',
    streetAddress: '2418 River Oaks Blvd',
    aptUnit: 'Apt 4B',
    city: 'Houston',
    state: 'TX',
    zipCode: '77056',
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
    phone: '(407) 555-8312',
    email: 'elena.rostova@outlook.com',
    streetAddress: '7822 Lake Vista Dr',
    city: 'Orlando',
    state: 'FL',
    zipCode: '32819',
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
    phone: '(404) 555-9011',
    email: 'derrick.vance@techcorp.io',
    streetAddress: '1120 Peachtree St NE',
    aptUnit: 'Suite 1804',
    city: 'Atlanta',
    state: 'GA',
    zipCode: '30309',
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
    phone: '(214) 555-3398',
    email: 'claire.abernathy@yahoo.com',
    streetAddress: '4502 Armstrong Pkwy',
    city: 'Dallas',
    state: 'TX',
    zipCode: '75205',
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
    phone: '(310) 555-7281',
    email: 'rgomez.photo@gmail.com',
    streetAddress: '934 Wilshire Blvd',
    aptUnit: 'Unit 201',
    city: 'Beverly Hills',
    state: 'CA',
    zipCode: '90210',
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
    phone: '(312) 555-1940',
    email: 'sam.lee77@gmail.com',
    streetAddress: '680 N Michigan Ave',
    aptUnit: 'Apt 1208',
    city: 'Chicago',
    state: 'IL',
    zipCode: '60611',
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
    phone: '(832) 555-4019',
    email: 'cmontgomery@lawhouston.com',
    streetAddress: '902 Memorial Drive',
    aptUnit: 'Suite 400',
    city: 'Houston',
    state: 'TX',
    zipCode: '77024',
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
    phone: '(214) 555-8812',
    email: 'facilities@oakridgesuites.com',
    streetAddress: '7200 Preston Rd',
    city: 'Dallas',
    state: 'TX',
    zipCode: '75024',
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
    location: 'Houston, TX',
    rating: 5,
    date: '3 days ago',
    service: 'Carpet & Pet Odor Extraction',
    text: 'We had stubborn dog urine stains and heavy foot traffic in the living room. Dave arrived right at 8 AM, measured everything honestly, and within 90 minutes our carpet looked practically brand new! Zero chemical smell, just crisp clean freshness.',
    verified: true
  },
  {
    id: 'rev-2',
    author: 'James Harrington',
    location: 'Orlando, FL',
    rating: 5,
    date: '1 week ago',
    service: 'Sectional Sofa Deep Shampoo',
    text: 'Booking through the website took 2 minutes. The instant price calculator was 100% accurate—no hidden upcharges or surprise fees when the technician arrived. Saved us over $1,800 compared to replacing our sectional couch!',
    verified: true
  },
  {
    id: 'rev-3',
    author: 'Emily Rodriguez',
    location: 'Los Angeles, CA',
    rating: 5,
    date: '2 weeks ago',
    service: 'Mattress & Area Rug Restoration',
    text: 'Extremely polite crew, wore shoe coverings the entire time, and put protective corner guards around our walls. The hot steam extraction brought our antique wool rug back to life. Will definitely book every spring!',
    verified: true
  },
  {
    id: 'rev-4',
    author: 'David K. Miller',
    location: 'Dallas, TX',
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
    location: 'Houston, TX',
    service: 'Hot Water Deep Extraction',
    description: 'Years of ground-in soil, shoe dirt, and dull fibers revived with our commercial truck-mounted dual-wand system.',
    stainType: 'Heavy Soil & Grease',
    beforeImg: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=800&q=80',
    afterImg: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'ba-2',
    title: 'Microfiber Velvet Sectional Sofa',
    location: 'Atlanta, GA',
    service: 'Delicate Low-Moisture Shampoo',
    description: 'Complete removal of coffee stains, body oils, and pet dander from light cream upholstery without fiber water rings.',
    stainType: 'Coffee & Spills',
    beforeImg: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
    afterImg: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'ba-3',
    title: 'Bedroom Plush Carpet & Pet Urine',
    location: 'Orlando, FL',
    service: 'Bio-Enzymatic Sub-Surface Rinse',
    description: 'Deep localized injection and extraction pulling out months-old pet accidents and deep odor crystals permanently.',
    stainType: 'Pet Stain & Odor',
    beforeImg: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
    afterImg: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80'
  }
];
