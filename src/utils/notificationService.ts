import { Booking } from '../types';

export interface NotificationSettings {
  soundEnabled: boolean;
  desktopEnabled: boolean;
}

const SETTINGS_KEY = 'am_admin_notification_settings_v1';
const REVIEWED_KEY = 'am_admin_reviewed_booking_ids_v1';
const SYNC_EVENT_KEY = 'am_booking_notification_sync';
export const NEW_BOOKING_EVENT_NAME = 'am_new_booking_event';

// Default settings: sound enabled, desktop alerts enabled if user permits
export function getNotificationSettings(): NotificationSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to load notification settings:', e);
  }
  return {
    soundEnabled: true,
    desktopEnabled: typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted'
  };
}

export function saveNotificationSettings(settings: NotificationSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save notification settings:', e);
  }
}

/**
 * High-quality pleasant two-tone chime via HTML5 Web Audio API.
 * Does not require external audio assets.
 */
export function playNotificationSound(): void {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const playTone = (freq: number, start: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + start);

      gain.gain.setValueAtTime(0, ctx.currentTime + start);
      gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + start + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + start);
      osc.stop(ctx.currentTime + start + duration);
    };

    // Multi-tone dispatch bell: 659.25Hz (E5) -> 880.00Hz (A5)
    playTone(659.25, 0, 0.35);
    playTone(880.0, 0.18, 0.55);
  } catch (err) {
    console.warn('Audio chime playback error:', err);
  }
}

/**
 * Desktop Notification permission helpers
 */
export function getDesktopNotificationPermission(): NotificationPermission | 'unsupported' {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }
  return Notification.permission;
}

export async function requestDesktopNotificationPermission(): Promise<NotificationPermission | 'unsupported'> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }
  try {
    const permission = await Notification.requestPermission();
    const settings = getNotificationSettings();
    saveNotificationSettings({
      ...settings,
      desktopEnabled: permission === 'granted'
    });
    return permission;
  } catch (e) {
    console.warn('Failed to request desktop notification permission:', e);
    return 'denied';
  }
}

export function sendDesktopNotification(booking: Booking): void {
  if (typeof window === 'undefined' || !('Notification' in window)) return;
  if (Notification.permission !== 'granted') return;

  try {
    const serviceNames = booking.services.map((s) => s.name).join(', ') || 'Cleaning & Painting';
    const notif = new Notification('🔔 New Service Booking Received!', {
      body: `${booking.customerName} booked ${serviceNames} ($${booking.totalPrice}) for ${booking.date} (${booking.city}, ${booking.state}). Click to review in Admin Console.`,
      icon: '/favicon.ico',
      tag: `booking-${booking.id}`
    });

    notif.onclick = () => {
      window.focus();
      window.location.hash = '#admin';
      notif.close();
    };
  } catch (e) {
    console.warn('Failed to send desktop notification:', e);
  }
}

/**
 * Reviewed status persistence
 */
export function getReviewedBookingIds(): string[] {
  try {
    const raw = localStorage.getItem(REVIEWED_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error('Failed to get reviewed booking IDs:', e);
  }
  return [];
}

export function isBookingReviewed(bookingId: string): boolean {
  const ids = getReviewedBookingIds();
  return ids.includes(bookingId);
}

export function markBookingAsReviewed(bookingId: string): void {
  try {
    const ids = getReviewedBookingIds();
    if (!ids.includes(bookingId)) {
      const updated = [...ids, bookingId];
      localStorage.setItem(REVIEWED_KEY, JSON.stringify(updated));
      // Dispatch event so all components refresh their counts
      window.dispatchEvent(new CustomEvent('am_reviewed_updated', { detail: updated }));
    }
  } catch (e) {
    console.error('Failed to mark booking as reviewed:', e);
  }
}

export function markAllBookingsAsReviewed(bookingIds: string[]): void {
  try {
    const current = getReviewedBookingIds();
    const combined = Array.from(new Set([...current, ...bookingIds]));
    localStorage.setItem(REVIEWED_KEY, JSON.stringify(combined));
    window.dispatchEvent(new CustomEvent('am_reviewed_updated', { detail: combined }));
  } catch (e) {
    console.error('Failed to mark all bookings as reviewed:', e);
  }
}

export function getUnreviewedCount(bookings: Booking[]): number {
  const reviewed = new Set(getReviewedBookingIds());
  // Any booking whose ID is not in reviewed set is considered unreviewed
  return bookings.filter((b) => !reviewed.has(b.id)).length;
}

/**
 * Triggers full notification stack for a newly created booking:
 * 1. Plays sound (if enabled)
 * 2. Fires desktop notification (if enabled & permitted)
 * 3. Dispatches DOM custom event for active tabs/listeners
 * 4. Updates localStorage sync key for cross-tab listeners
 */
export function notifyNewBooking(booking: Booking): void {
  const settings = getNotificationSettings();

  if (settings.soundEnabled) {
    playNotificationSound();
  }

  if (settings.desktopEnabled) {
    sendDesktopNotification(booking);
  }

  // Dispatch local in-window event
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent(NEW_BOOKING_EVENT_NAME, {
        detail: booking
      })
    );

    // Trigger cross-tab sync via localStorage
    try {
      localStorage.setItem(
        SYNC_EVENT_KEY,
        JSON.stringify({
          booking,
          timestamp: Date.now()
        })
      );
    } catch (e) {
      console.error('Cross-tab sync error:', e);
    }
  }
}

/**
 * Helper to generate an instant realistic sample booking payload for admin testing
 */
export function createSampleBookingData(): Omit<Booking, 'id' | 'createdAt'> {
  const sampleCustomers = [
    {
      name: 'Jessica Vance',
      phone: '(206) 555-0149',
      email: 'jvance.tech@outlook.com',
      city: 'Seattle',
      state: 'WA',
      zip: '98101',
      street: '1420 5th Avenue',
      apt: 'Unit 1804',
      serviceId: 'living_room_carpet',
      serviceName: 'Carpet Cleaning (Living / Main Room)',
      price: 80,
      addOnName: 'Scotchgard™ Stain Shield Protector',
      addOnPrice: 30,
      notes: 'High-rise apartment, freight elevator code: #4092. Pet dander removal needed.'
    },
    {
      name: 'Marcus Sterling',
      phone: '(253) 555-8321',
      email: 'marcus.sterling@gmail.com',
      city: 'Tacoma',
      state: 'WA',
      zip: '98402',
      street: '745 Pacific Ave',
      apt: 'Suite 300',
      serviceId: 'interior_walls_doors',
      serviceName: 'Interior Wall & Trim Painting',
      price: 180,
      addOnName: 'Baseboard & Trim Precision Enamel',
      addOnPrice: 65,
      notes: 'Need accent walls and trim painted in newly remodeled living room.'
    },
    {
      name: 'Elena Rostova',
      phone: '(425) 555-3890',
      email: 'elena.rostova@icloud.com',
      city: 'Bellevue',
      state: 'WA',
      zip: '98004',
      street: '10650 NE 4th Street',
      apt: 'Apt 502',
      serviceId: 'sofa_sectional_l',
      serviceName: 'L-Shaped Sectional Couch Steam Clean',
      price: 145,
      addOnName: 'Pet Stain & Urine Enzyme Treatment',
      addOnPrice: 35,
      notes: 'Golden Retriever puppy accident on right chaise lounge. Need organic enzyme deodorizer.'
    },
    {
      name: 'David & Karen Miller',
      phone: '(253) 555-7712',
      email: 'karen.miller@yahoo.com',
      city: 'Federal Way',
      state: 'WA',
      zip: '98003',
      street: '32410 1st Ave S',
      apt: undefined,
      serviceId: 'bedroom_carpet',
      serviceName: 'Carpet Cleaning (Bedroom / Study)',
      price: 50,
      addOnName: 'Citrus Fresh Anti-Allergen Sanitizer',
      addOnPrice: 20,
      notes: 'Preparing guest room for family visit next week.'
    }
  ];

  const picked = sampleCustomers[Math.floor(Math.random() * sampleCustomers.length)];
  const today = new Date();
  today.setDate(today.getDate() + Math.floor(Math.random() * 3) + 1);
  const dateStr = today.toISOString().split('T')[0];

  const total = picked.price + picked.addOnPrice;

  return {
    customerName: picked.name,
    phone: picked.phone,
    email: picked.email,
    streetAddress: picked.street,
    aptUnit: picked.apt,
    city: picked.city,
    state: picked.state,
    zipCode: picked.zip,
    propertyType: picked.apt ? 'apartment' : 'single_family',
    hasPets: true,
    petDetails: 'Family pet on premises',
    parkingAccess: picked.apt ? 'parking_lot' : 'driveway',
    date: dateStr,
    timeSlot: '09:00 AM - 12:00 PM',
    services: [
      {
        id: picked.serviceId,
        name: picked.serviceName,
        quantity: 1,
        unitPrice: picked.price,
        total: picked.price
      }
    ],
    addOns: [
      {
        name: picked.addOnName,
        price: picked.addOnPrice
      }
    ],
    totalPrice: total,
    discount: 0,
    status: 'pending',
    technician: 'A&M Dispatch Route 1',
    customerNotes: picked.notes,
    staffNotes: 'Online booking inquiry received via live customer booking form.',
    paymentStatus: 'paid_deposit',
    depositPaid: 35,
    depositAmount: 35,
    paymentMethod: 'card'
  };
}
