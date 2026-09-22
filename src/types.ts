export type AppView =
  | 'home'
  | 'services'
  | 'search-area'
  | 'calculator'
  | 'bookings'
  | 'appointments'
  | 'gallery'
  | 'reviews'
  | 'contact'
  | 'admin'
  | 'all';

export type BookingStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';

export interface AppointmentNote {
  id: string;
  createdAt: string;
  author: string;
  text: string;
  category?: 'general' | 'staff' | 'technician' | 'customer' | 'reschedule' | 'payment';
}

export type PaymentMethodType =
  | 'card'
  | 'apple_pay'
  | 'google_pay'
  | 'cash'
  | 'zelle'
  | 'venmo'
  | 'check'
  | 'other';

export interface PaymentRecord {
  id: string;
  amount: number;
  date: string;
  method: PaymentMethodType;
  reference?: string;
  notes?: string;
  recordedBy?: string;
}

export type PropertyType = 'single_family' | 'apartment' | 'townhouse' | 'office' | 'other';

export type ParkingAccess = 'driveway' | 'street' | 'parking_lot' | 'other';

export type ServiceCategory =
  | 'carpet'
  | 'upholstery'
  | 'couch_sofa'
  | 'mattress'
  | 'area_rug'
  | 'painting'
  | 'other';

export interface ServiceItem {
  id: string;
  name: string;
  category: ServiceCategory;
  basePrice: number;
  unit: string;
  icon: string;
  description: string;
  popular?: boolean;
}

export interface AddOnItem {
  id: string;
  name: string;
  price: number;
  description: string;
}

export interface BookedServiceItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface BookedAddOn {
  id?: string;
  name: string;
  price: number;
}

export interface Booking {
  id: string;
  createdAt: string;
  customerName: string;
  phone: string;
  email: string;
  streetAddress: string;
  aptUnit?: string;
  city: string;
  state: string;
  zipCode: string;
  propertyType: PropertyType;
  hasPets: boolean;
  petDetails?: string;
  parkingAccess: ParkingAccess;
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g., '08:00 AM - 11:00 AM'
  exactTime?: string; // e.g., '07:30 AM', '09:50 AM'
  services: BookedServiceItem[];
  addOns: BookedAddOn[];
  totalPrice: number;
  discount: number;
  status: BookingStatus;
  technician?: string;
  customerNotes?: string;
  staffNotes?: string;
  notesList?: AppointmentNote[];
  paymentStatus: 'unpaid' | 'paid_deposit' | 'paid_full';
  depositAmount?: number;
  depositPaid?: number;
  quoteApproved?: boolean;
  quoteApprovedAt?: string;
  paymentMethod?: PaymentMethodType;
  paymentReference?: string;
  notificationStatus?: {
    smsSent: boolean;
    emailSent: boolean;
    sentAt?: string;
  };
  paymentHistory?: PaymentRecord[];
  cancelReason?: string;
  completedAt?: string;
  rescheduledFrom?: string;
}

export interface TimeSlotOption {
  id: string;
  label: string;
  period: 'morning' | 'midday' | 'afternoon' | 'evening';
  timeRange: string;
  maxCapacity: number;
}

export interface ReviewItem {
  id: string;
  author: string;
  location: string;
  rating: number;
  date: string;
  service: string;
  text: string;
  verified: boolean;
}

export interface BeforeAfterItem {
  id: string;
  title: string;
  location: string;
  service: string;
  description: string;
  beforeImg: string;
  afterImg: string;
  stainType: string;
}

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
