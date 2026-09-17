import { Booking, BookingStatus, AppointmentNote, PaymentRecord } from '../types';
import { INITIAL_BOOKINGS } from '../data/initialData';

const STORAGE_KEY = 'proclean_bookings_data_v2';

export function getStoredBookings(): Booking[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_BOOKINGS));
      return INITIAL_BOOKINGS;
    }
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_BOOKINGS;
  } catch (err) {
    console.error('Failed to load bookings from localStorage:', err);
    return INITIAL_BOOKINGS;
  }
}

export function saveStoredBookings(bookings: Booking[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
  } catch (err) {
    console.error('Failed to save bookings to localStorage:', err);
  }
}

export function addBooking(newBookingData: Omit<Booking, 'id' | 'createdAt'>): Booking {
  const current = getStoredBookings();
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  const id = `PC-${randomNum}`;
  const newBooking: Booking = {
    ...newBookingData,
    id,
    createdAt: new Date().toISOString()
  };
  const updated = [newBooking, ...current];
  saveStoredBookings(updated);
  return newBooking;
}

export function updateBooking(id: string, updates: Partial<Booking>): Booking | null {
  const current = getStoredBookings();
  let updatedBooking: Booking | null = null;
  const nextList = current.map(b => {
    if (b.id === id) {
      updatedBooking = { ...b, ...updates };
      return updatedBooking;
    }
    return b;
  });
  if (updatedBooking) {
    saveStoredBookings(nextList);
  }
  return updatedBooking;
}

export function updateBookingStatus(id: string, status: BookingStatus): boolean {
  const current = getStoredBookings();
  let found = false;
  const nextList = current.map(b => {
    if (b.id === id) {
      found = true;
      return { ...b, status };
    }
    return b;
  });
  if (found) {
    saveStoredBookings(nextList);
  }
  return found;
}

export function deleteBooking(id: string): boolean {
  const current = getStoredBookings();
  const filtered = current.filter(b => b.id !== id);
  if (filtered.length !== current.length) {
    saveStoredBookings(filtered);
    return true;
  }
  return false;
}

export function rescheduleBooking(
  id: string,
  newDate: string,
  newTimeSlot: string,
  newExactTime?: string,
  rescheduleNote?: string
): Booking | null {
  const current = getStoredBookings();
  let updatedBooking: Booking | null = null;
  const now = new Date().toISOString();

  const nextList = current.map(b => {
    if (b.id === id) {
      const priorDate = b.date;
      const priorTime = b.exactTime || b.timeSlot;
      const noteEntry: AppointmentNote = {
        id: `note-${Date.now()}`,
        createdAt: now,
        author: 'Dispatch Coordinator',
        category: 'reschedule',
        text: rescheduleNote
          ? `Rescheduled from ${priorDate} (${priorTime}) to ${newDate} (${newExactTime || newTimeSlot}). Note: ${rescheduleNote}`
          : `Rescheduled from ${priorDate} (${priorTime}) to ${newDate} (${newExactTime || newTimeSlot}).`
      };

      updatedBooking = {
        ...b,
        date: newDate,
        timeSlot: newTimeSlot,
        exactTime: newExactTime || b.exactTime,
        rescheduledFrom: `${priorDate} ${priorTime}`,
        notesList: [noteEntry, ...(b.notesList || [])],
        staffNotes: b.staffNotes
          ? `${b.staffNotes} | Rescheduled: ${newDate} ${newExactTime || newTimeSlot}`
          : `Rescheduled to ${newDate} ${newExactTime || newTimeSlot}`
      };
      return updatedBooking;
    }
    return b;
  });

  if (updatedBooking) {
    saveStoredBookings(nextList);
  }
  return updatedBooking;
}

export function acceptBooking(id: string, adminNote?: string): Booking | null {
  const current = getStoredBookings();
  let updatedBooking: Booking | null = null;
  const now = new Date().toISOString();

  const nextList = current.map(b => {
    if (b.id === id) {
      const noteEntry: AppointmentNote = {
        id: `note-${Date.now()}`,
        createdAt: now,
        author: 'Admin Dispatch',
        category: 'staff',
        text: adminNote || 'Booking accepted and approved by Admin.'
      };

      updatedBooking = {
        ...b,
        status: 'confirmed',
        notesList: [noteEntry, ...(b.notesList || [])]
      };
      return updatedBooking;
    }
    return b;
  });

  if (updatedBooking) {
    saveStoredBookings(nextList);
  }
  return updatedBooking;
}

export function denyBooking(id: string, reason: string): Booking | null {
  const current = getStoredBookings();
  let updatedBooking: Booking | null = null;
  const now = new Date().toISOString();

  const nextList = current.map(b => {
    if (b.id === id) {
      const noteEntry: AppointmentNote = {
        id: `note-${Date.now()}`,
        createdAt: now,
        author: 'Admin Dispatch',
        category: 'staff',
        text: `Booking denied by Admin. Reason: ${reason}`
      };

      updatedBooking = {
        ...b,
        status: 'cancelled',
        cancelReason: `Denied by Admin: ${reason}`,
        notesList: [noteEntry, ...(b.notesList || [])]
      };
      return updatedBooking;
    }
    return b;
  });

  if (updatedBooking) {
    saveStoredBookings(nextList);
  }
  return updatedBooking;
}

export function cancelBooking(id: string, reason?: string): Booking | null {
  const current = getStoredBookings();
  let updatedBooking: Booking | null = null;
  const now = new Date().toISOString();

  const nextList = current.map(b => {
    if (b.id === id) {
      const noteEntry: AppointmentNote = {
        id: `note-${Date.now()}`,
        createdAt: now,
        author: 'Staff Dispatch',
        category: 'staff',
        text: `Appointment cancelled. Reason: ${reason || 'Customer request / schedule conflict'}`
      };

      updatedBooking = {
        ...b,
        status: 'cancelled',
        cancelReason: reason || 'Cancelled by staff/customer',
        notesList: [noteEntry, ...(b.notesList || [])]
      };
      return updatedBooking;
    }
    return b;
  });

  if (updatedBooking) {
    saveStoredBookings(nextList);
  }
  return updatedBooking;
}

export function markBookingCompleted(id: string): Booking | null {
  const current = getStoredBookings();
  let updatedBooking: Booking | null = null;
  const now = new Date().toISOString();

  const nextList = current.map(b => {
    if (b.id === id) {
      const noteEntry: AppointmentNote = {
        id: `note-${Date.now()}`,
        createdAt: now,
        author: 'Technician Crew',
        category: 'technician',
        text: 'Service completed on site. Customer inspected and approved work.'
      };

      updatedBooking = {
        ...b,
        status: 'completed',
        completedAt: now,
        notesList: [noteEntry, ...(b.notesList || [])]
      };
      return updatedBooking;
    }
    return b;
  });

  if (updatedBooking) {
    saveStoredBookings(nextList);
  }
  return updatedBooking;
}

export function addBookingNote(
  id: string,
  noteText: string,
  author: string = 'Staff Member',
  category: AppointmentNote['category'] = 'staff'
): Booking | null {
  const current = getStoredBookings();
  let updatedBooking: Booking | null = null;
  const now = new Date().toISOString();

  const nextList = current.map(b => {
    if (b.id === id) {
      const noteEntry: AppointmentNote = {
        id: `note-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        createdAt: now,
        author,
        text: noteText.trim(),
        category
      };

      updatedBooking = {
        ...b,
        notesList: [noteEntry, ...(b.notesList || [])],
        staffNotes: b.staffNotes ? `${noteText.trim()} | ${b.staffNotes}` : noteText.trim()
      };
      return updatedBooking;
    }
    return b;
  });

  if (updatedBooking) {
    saveStoredBookings(nextList);
  }
  return updatedBooking;
}

export function recordBookingPayment(
  id: string,
  payment: Omit<PaymentRecord, 'id' | 'date'>
): Booking | null {
  const current = getStoredBookings();
  let updatedBooking: Booking | null = null;
  const now = new Date().toISOString();

  const nextList = current.map(b => {
    if (b.id === id) {
      const paymentEntry: PaymentRecord = {
        id: `pay-${Date.now()}`,
        date: now,
        amount: payment.amount,
        method: payment.method,
        reference: payment.reference,
        notes: payment.notes,
        recordedBy: payment.recordedBy || 'Front Desk Coordinator'
      };

      const existingPayments = b.paymentHistory || [];
      const updatedHistory = [paymentEntry, ...existingPayments];
      const totalPaidSoFar = updatedHistory.reduce((sum, p) => sum + p.amount, 0);

      let newPaymentStatus: 'unpaid' | 'paid_deposit' | 'paid_full' = 'unpaid';
      if (totalPaidSoFar >= b.totalPrice) {
        newPaymentStatus = 'paid_full';
      } else if (totalPaidSoFar > 0) {
        newPaymentStatus = 'paid_deposit';
      }

      const noteEntry: AppointmentNote = {
        id: `note-${Date.now()}`,
        createdAt: now,
        author: payment.recordedBy || 'Billing Staff',
        category: 'payment',
        text: `Recorded payment of $${payment.amount} via ${payment.method.toUpperCase()}${payment.reference ? ` (Ref: ${payment.reference})` : ''}. Total collected: $${totalPaidSoFar} / $${b.totalPrice}.`
      };

      updatedBooking = {
        ...b,
        paymentStatus: newPaymentStatus,
        paymentHistory: updatedHistory,
        depositPaid: newPaymentStatus === 'paid_deposit' ? totalPaidSoFar : (newPaymentStatus === 'paid_full' ? b.depositPaid || totalPaidSoFar : b.depositPaid),
        paymentMethod: payment.method,
        paymentReference: payment.reference || b.paymentReference,
        notesList: [noteEntry, ...(b.notesList || [])]
      };
      return updatedBooking;
    }
    return b;
  });

  if (updatedBooking) {
    saveStoredBookings(nextList);
  }
  return updatedBooking;
}

export function resetDemoBookings(): Booking[] {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_BOOKINGS));
  return INITIAL_BOOKINGS;
}

export function downloadCalendarInvite(booking: Booking): void {
  // Format dates for ICS
  const dateStr = booking.date.replace(/-/g, '');
  let startHour = 8;
  if (booking.timeSlot.includes('11:30')) startHour = 11;
  else if (booking.timeSlot.includes('03:00')) startHour = 15;
  else if (booking.timeSlot.includes('06:00')) startHour = 18;

  const startFormatted = `${dateStr}T${String(startHour).padStart(2, '0')}0000`;
  const endFormatted = `${dateStr}T${String(startHour + 3).padStart(2, '0')}0000`;

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//A&M Carpet Cleaning//Carpet & Upholstery Cleaning//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `SUMMARY:A&M Carpet Cleaning (#${booking.id})`,
    `DESCRIPTION:Professional cleaning appointment for ${booking.customerName}. Services: ${booking.services.map(s => `${s.quantity}x ${s.name}`).join(', ')}. Total: $${booking.totalPrice}. Technician: ${booking.technician || 'A&M Cleaning Team'}. Call or WhatsApp owner at +1 (973) 609-4520 for changes.`,
    `LOCATION:${booking.streetAddress}, ${booking.city}, ${booking.state} ${booking.zipCode}`,
    `DTSTART:${startFormatted}`,
    `DTEND:${endFormatted}`,
    `STATUS:CONFIRMED`,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `am-booking-${booking.id}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportBookingsToCSV(bookings: Booking[]): void {
  const headers = [
    'Booking ID',
    'Date',
    'Time Slot',
    'Customer Name',
    'Phone',
    'Email',
    'Address',
    'City',
    'State',
    'ZIP',
    'Services',
    'Add-ons',
    'Total Price ($)',
    'Status',
    'Payment Status',
    'Technician',
    'Notes'
  ];

  const rows = bookings.map(b => [
    b.id,
    b.date,
    `"${b.timeSlot}"`,
    `"${b.customerName}"`,
    `"${b.phone}"`,
    b.email,
    `"${b.streetAddress} ${b.aptUnit || ''}"`,
    b.city,
    b.state,
    b.zipCode,
    `"${b.services.map(s => `${s.quantity}x ${s.name}`).join('; ')}"`,
    `"${b.addOns.map(a => a.name).join('; ')}"`,
    b.totalPrice,
    b.status,
    b.paymentStatus,
    `"${b.technician || 'Unassigned'}"`,
    `"${(b.customerNotes || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `am-bookings-${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
