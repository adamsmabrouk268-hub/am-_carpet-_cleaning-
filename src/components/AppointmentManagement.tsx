import { useState, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Clock4,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  Plus,
  Edit3,
  XCircle,
  FileText,
  RotateCcw,
  Sparkles,
  Truck,
  Download,
  Share2,
  CalendarCheck,
  CreditCard,
  MessageSquare,
  ShieldCheck,
  Check,
  ChevronDown,
  Printer
} from 'lucide-react';
import { Booking, BookingStatus, AppointmentNote, PaymentRecord } from '../types';
import {
  RescheduleModal,
  CancelModal,
  ContactCustomerModal,
  AddNoteModal,
  RecordPaymentModal
} from './AppointmentActionModals';
import PaymentReceiptModal from './PaymentReceiptModal';
import { JobDetailsModal } from './JobDetailsModal';
import DenyBookingModal from './DenyBookingModal';
import {
  updateBookingStatus,
  acceptBooking,
  denyBooking,
  rescheduleBooking,
  cancelBooking,
  markBookingCompleted,
  addBookingNote,
  recordBookingPayment,
  deleteBooking,
  downloadCalendarInvite,
  resetDemoBookings
} from '../utils/bookingStorage';

interface AppointmentManagementProps {
  bookings: Booking[];
  onBookingsChange: (updated: Booking[]) => void;
  onOpenNewBooking?: () => void;
}

type CalendarViewMode = 'day' | 'week' | 'month' | 'agenda';

export function AppointmentManagement({
  bookings,
  onBookingsChange,
  onOpenNewBooking
}: AppointmentManagementProps) {
  // Current calendar pivot date (default to Monday, September 14, 2026)
  const [selectedDate, setSelectedDate] = useState<string>('2026-09-14');
  const [viewMode, setViewMode] = useState<CalendarViewMode>('day');
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [serviceFilter, setServiceFilter] = useState<string>('all');
  
  // Modal states
  const [selectedBookingForDetails, setSelectedBookingForDetails] = useState<Booking | null>(null);
  const [bookingForReschedule, setBookingForReschedule] = useState<Booking | null>(null);
  const [bookingForCancel, setBookingForCancel] = useState<Booking | null>(null);
  const [bookingForDeny, setBookingForDeny] = useState<Booking | null>(null);
  const [bookingForContact, setBookingForContact] = useState<Booking | null>(null);
  const [bookingForNote, setBookingForNote] = useState<Booking | null>(null);
  const [bookingForPayment, setBookingForPayment] = useState<Booking | null>(null);
  const [bookingForReceipt, setBookingForReceipt] = useState<Booking | null>(null);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Helper date parsing
  const currentDateObj = useMemo(() => {
    const parts = selectedDate.split('-');
    return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
  }, [selectedDate]);

  // Navigate dates
  const handlePrev = () => {
    const d = new Date(currentDateObj);
    if (viewMode === 'day') {
      d.setDate(d.getDate() - 1);
    } else if (viewMode === 'week') {
      d.setDate(d.getDate() - 7);
    } else {
      d.setMonth(d.getMonth() - 1);
    }
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const handleNext = () => {
    const d = new Date(currentDateObj);
    if (viewMode === 'day') {
      d.setDate(d.getDate() + 1);
    } else if (viewMode === 'week') {
      d.setDate(d.getDate() + 7);
    } else {
      d.setMonth(d.getMonth() + 1);
    }
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const handleToday = () => {
    setSelectedDate('2026-09-14'); // Monday Sept 14, 2026 (app benchmark)
  };

  // Filtered bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = b.customerName.toLowerCase().includes(q);
        const matchesPhone = b.phone.toLowerCase().includes(q);
        const matchesId = b.id.toLowerCase().includes(q);
        const matchesAddr = b.streetAddress.toLowerCase().includes(q);
        const matchesCity = b.city.toLowerCase().includes(q);
        const matchesService = b.services.some((s) => s.name.toLowerCase().includes(q));
        if (!matchesName && !matchesPhone && !matchesId && !matchesAddr && !matchesCity && !matchesService) {
          return false;
        }
      }

      // Status
      if (statusFilter !== 'all' && b.status !== statusFilter) {
        return false;
      }

      // Service category
      if (serviceFilter !== 'all') {
        const matchesServ = b.services.some((s) =>
          s.name.toLowerCase().includes(serviceFilter.toLowerCase())
        );
        if (!matchesServ) return false;
      }

      return true;
    });
  }, [bookings, searchQuery, statusFilter, serviceFilter]);

  // Bookings for the selected Day
  const dayBookings = useMemo(() => {
    return filteredBookings
      .filter((b) => b.date === selectedDate)
      .sort((a, b) => {
        const timeA = a.exactTime || a.timeSlot;
        const timeB = b.exactTime || b.timeSlot;
        return timeA.localeCompare(timeB);
      });
  }, [filteredBookings, selectedDate]);

  // Week calculation (Monday to Sunday)
  const weekDays = useMemo(() => {
    const curr = new Date(currentDateObj);
    // Determine day of week (0 is Sun, 1 is Mon...)
    const day = curr.getDay();
    // Calculate distance to Monday
    const diffToMonday = curr.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(curr.setDate(diffToMonday));

    const days = [];
    for (let i = 0; i < 7; i++) {
      const nextDay = new Date(monday);
      nextDay.setDate(monday.getDate() + i);
      const iso = nextDay.toISOString().split('T')[0];
      const weekdayName = nextDay.toLocaleDateString('en-US', { weekday: 'short' });
      const dayNum = nextDay.getDate();
      const monthName = nextDay.toLocaleDateString('en-US', { month: 'short' });
      days.push({
        dateStr: iso,
        weekdayName,
        dayNum,
        monthName,
        isToday: iso === '2026-09-14',
        isSelected: iso === selectedDate
      });
    }
    return days;
  }, [currentDateObj, selectedDate]);

  // Month calculation
  const monthDays = useMemo(() => {
    const year = currentDateObj.getFullYear();
    const month = currentDateObj.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startOffset = (firstDay.getDay() + 6) % 7; // Monday = 0

    const days = [];
    // Previous month padding
    for (let i = startOffset; i > 0; i--) {
      const d = new Date(year, month, 1 - i);
      days.push({
        dateStr: d.toISOString().split('T')[0],
        dayNum: d.getDate(),
        isCurrentMonth: false,
        isToday: d.toISOString().split('T')[0] === '2026-09-14'
      });
    }

    // Current month days
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const d = new Date(year, month, i);
      const iso = d.toISOString().split('T')[0];
      days.push({
        dateStr: iso,
        dayNum: i,
        isCurrentMonth: true,
        isToday: iso === '2026-09-14'
      });
    }

    // Remaining trailing padding to make a multiple of 7
    while (days.length % 7 !== 0) {
      const last = new Date(days[days.length - 1].dateStr);
      last.setDate(last.getDate() + 1);
      days.push({
        dateStr: last.toISOString().split('T')[0],
        dayNum: last.getDate(),
        isCurrentMonth: false,
        isToday: last.toISOString().split('T')[0] === '2026-09-14'
      });
    }

    return days;
  }, [currentDateObj]);

  // Appointment Actions
  const handleAcceptBooking = (booking: Booking) => {
    const res = acceptBooking(booking.id);
    if (res) {
      const updated = bookings.map((b) => (b.id === booking.id ? res : b));
      onBookingsChange(updated);
      showToast(`Appointment ${booking.id} ACCEPTED and confirmed!`);
    }
  };

  const handleConfirmDenial = (reason: string) => {
    if (!bookingForDeny) return;
    const res = denyBooking(bookingForDeny.id, reason);
    if (res) {
      const updated = bookings.map((b) => (b.id === bookingForDeny.id ? res : b));
      onBookingsChange(updated);
      showToast(`Appointment ${bookingForDeny.id} DENIED: "${reason}"`);
    }
    setBookingForDeny(null);
  };

  const handleConfirmAppointment = (booking: Booking) => {
    const success = updateBookingStatus(booking.id, 'confirmed');
    if (success) {
      const updated = bookings.map((b) => (b.id === booking.id ? { ...b, status: 'confirmed' as BookingStatus } : b));
      onBookingsChange(updated);
      showToast(`Appointment confirmed for ${booking.customerName}!`);
    }
  };

  const handleMarkCompleted = (booking: Booking) => {
    const res = markBookingCompleted(booking.id);
    if (res) {
      const updated = bookings.map((b) => (b.id === booking.id ? res : b));
      onBookingsChange(updated);
      showToast(`Appointment marked completed for ${booking.customerName}!`);
    }
  };

  const handleSaveReschedule = (
    bookingId: string,
    newDate: string,
    newTimeSlot: string,
    newExactTime?: string,
    note?: string
  ) => {
    const res = rescheduleBooking(bookingId, newDate, newTimeSlot, newExactTime, note);
    if (res) {
      const updated = bookings.map((b) => (b.id === bookingId ? res : b));
      onBookingsChange(updated);
      showToast(`Appointment rescheduled to ${newDate} at ${newExactTime || newTimeSlot}!`);
    }
  };

  const handleSaveCancel = (bookingId: string, reason: string) => {
    const res = cancelBooking(bookingId, reason);
    if (res) {
      const updated = bookings.map((b) => (b.id === bookingId ? res : b));
      onBookingsChange(updated);
      showToast(`Appointment cancelled.`);
    }
  };

  const handleSaveNote = (
    bookingId: string,
    noteText: string,
    category: AppointmentNote['category']
  ) => {
    const res = addBookingNote(bookingId, noteText, 'Admin Dispatch', category);
    if (res) {
      const updated = bookings.map((b) => (b.id === bookingId ? res : b));
      onBookingsChange(updated);
      showToast(`Note saved to appointment record.`);
    }
  };

  const handleSavePayment = (
    bookingId: string,
    payment: Omit<PaymentRecord, 'id' | 'date'>
  ) => {
    const res = recordBookingPayment(bookingId, payment);
    if (res) {
      const updated = bookings.map((b) => (b.id === bookingId ? res : b));
      onBookingsChange(updated);
      showToast(`Payment of $${payment.amount} recorded successfully!`);
    }
  };

  const handleResetSchedule = () => {
    if (confirm('Reset schedule to default sample appointments (including Monday 7:30 Carpet Cleaning Customer A and 9:50 Sofa Cleaning Customer B)?')) {
      const reset = resetDemoBookings();
      onBookingsChange(reset);
      setSelectedDate('2026-09-14');
      showToast('Schedule reset to demo appointments.');
    }
  };

  // Status helper badges
  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" /> Confirmed
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <Clock4 className="w-3 h-3" /> Pending Confirm
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-200 animate-pulse">
            <Truck className="w-3 h-3" /> In Progress
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 text-purple-800 border border-purple-200">
            <ShieldCheck className="w-3 h-3" /> Completed
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
            <XCircle className="w-3 h-3" /> Cancelled
          </span>
        );
    }
  };

  // Payment helper badge
  const getPaymentBadge = (b: Booking) => {
    const history = b.paymentHistory || [];
    const paid = history.reduce((sum, p) => sum + p.amount, 0);
    if (b.paymentStatus === 'paid_full') {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
          <DollarSign className="w-3 h-3" /> Paid Full (${b.totalPrice})
        </span>
      );
    }
    if (b.paymentStatus === 'paid_deposit') {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
          <DollarSign className="w-3 h-3" /> Deposit Paid (${paid}/${b.totalPrice})
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
        <DollarSign className="w-3 h-3" /> Unpaid (${b.totalPrice} due)
      </span>
    );
  };

  // Header display string
  const currentRangeLabel = useMemo(() => {
    if (viewMode === 'day') {
      return currentDateObj.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
    }
    if (viewMode === 'week') {
      const mon = weekDays[0];
      const sun = weekDays[6];
      return `${mon.monthName} ${mon.dayNum} – ${sun.monthName} ${sun.dayNum}, 2026`;
    }
    return currentDateObj.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });
  }, [viewMode, currentDateObj, weekDays]);

  // Aggregated stats
  const stats = useMemo(() => {
    const total = bookings.length;
    const confirmed = bookings.filter((b) => b.status === 'confirmed').length;
    const pending = bookings.filter((b) => b.status === 'pending').length;
    const completed = bookings.filter((b) => b.status === 'completed').length;
    const revenue = bookings
      .filter((b) => b.status !== 'cancelled')
      .reduce((sum, b) => sum + b.totalPrice, 0);
    return { total, confirmed, pending, completed, revenue };
  }, [bookings]);

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 border border-slate-700 animate-bounce text-xs font-semibold">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Banner & Appointment Management Intro */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-blue-900/40 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 px-3 py-1 rounded-full text-xs font-bold text-blue-300 mb-2">
              <CalendarCheck className="w-3.5 h-3.5" />
              Live Dispatch & Appointment Management Calendar
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Appointment Schedule & Dispatch Hub
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1">
              Confirm bookings, reschedule timeslots, cancel, mark completed, contact customers directly, record payments, and manage technician notes.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {onOpenNewBooking && (
              <button
                onClick={onOpenNewBooking}
                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-1.5 shadow-lg shadow-blue-600/30 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Book Appointment
              </button>
            )}
            <button
              onClick={handleResetSchedule}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-3.5 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
              title="Reset to initial schedule containing Customer A and B"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset Schedule
            </button>
          </div>
        </div>

        {/* Quick KPI Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-6 pt-6 border-t border-white/10 text-xs">
          <div className="bg-white/5 backdrop-blur-xs p-3 rounded-2xl border border-white/10">
            <span className="text-slate-400 text-[11px] font-bold block">Total Jobs</span>
            <span className="text-xl font-black text-white">{stats.total}</span>
          </div>
          <div className="bg-white/5 backdrop-blur-xs p-3 rounded-2xl border border-white/10">
            <span className="text-emerald-400 text-[11px] font-bold block">Confirmed</span>
            <span className="text-xl font-black text-emerald-400">{stats.confirmed}</span>
          </div>
          <div className="bg-white/5 backdrop-blur-xs p-3 rounded-2xl border border-white/10">
            <span className="text-amber-400 text-[11px] font-bold block">Pending Action</span>
            <span className="text-xl font-black text-amber-400">{stats.pending}</span>
          </div>
          <div className="bg-white/5 backdrop-blur-xs p-3 rounded-2xl border border-white/10">
            <span className="text-purple-400 text-[11px] font-bold block">Completed</span>
            <span className="text-xl font-black text-purple-400">{stats.completed}</span>
          </div>
          <div className="bg-white/5 backdrop-blur-xs p-3 rounded-2xl border border-white/10 col-span-2 sm:col-span-1">
            <span className="text-blue-300 text-[11px] font-bold block">Booked Revenue</span>
            <span className="text-xl font-black text-white">${stats.revenue.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Calendar Controls & Navigation Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: View Mode Pills */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl w-fit">
          {(['day', 'week', 'month', 'agenda'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition cursor-pointer ${
                viewMode === mode
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {mode === 'day' && '📅 Day View'}
              {mode === 'week' && '🗓️ Week View'}
              {mode === 'month' && '📆 Month Grid'}
              {mode === 'agenda' && '📋 All Appointments'}
            </button>
          ))}
        </div>

        {/* Center: Navigation Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition border border-slate-200 cursor-pointer"
            title="Previous"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleToday}
            className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-xl border border-blue-200 transition cursor-pointer"
          >
            Today (Mon Sept 14)
          </button>
          <button
            onClick={handleNext}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition border border-slate-200 cursor-pointer"
            title="Next"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <span className="font-extrabold text-slate-900 text-sm sm:text-base ml-2">
            {currentRangeLabel}
          </span>
        </div>

        {/* Right: Quick jump datepicker */}
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-1.5 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search customer, address, service, phone (e.g. 'Customer A' or 'sofa')..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
            >
              Clear
            </button>
          )}
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-semibold text-slate-500">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 bg-white"
          >
            <option value="all">All Statuses</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Service Filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-semibold text-slate-500">Service:</span>
          <select
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            className="px-2.5 py-1.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 bg-white"
          >
            <option value="all">All Services</option>
            <option value="carpet">Carpet Cleaning</option>
            <option value="sofa">Sofa / Upholstery</option>
            <option value="mattress">Mattress Sanitizing</option>
            <option value="rug">Area / Wool Rug</option>
            <option value="painting">Painting Services</option>
            <option value="vehicle">Vehicle Interior</option>
          </select>
        </div>
      </div>

      {/* ==========================================
          VIEW 1: DAY VIEW (With exact hour blocks)
          ========================================== */}
      {viewMode === 'day' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Day View Header */}
          <div className="p-4 sm:p-6 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-slate-900">
                  {currentDateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                </h2>
                {selectedDate === '2026-09-14' && (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-blue-600 text-white">
                    Today (Monday)
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {dayBookings.length} scheduled appointment{dayBookings.length === 1 ? '' : 's'} on this date
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">
                Showing all time windows &bull; Click any action button to manage
              </span>
            </div>
          </div>

          {/* If no bookings on this day */}
          {dayBookings.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <CalendarIcon className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1">No appointments on this date</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
                There are no scheduled jobs on {selectedDate}. Jump back to Monday September 14 to see Customer A & Customer B!
              </p>
              <div className="flex justify-center gap-2">
                <button
                  onClick={handleToday}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition"
                >
                  Go to Monday (Sept 14)
                </button>
                {onOpenNewBooking && (
                  <button
                    onClick={onOpenNewBooking}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold transition"
                  >
                    + Book New Job
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {dayBookings.map((booking) => {
                const timeLabel = booking.exactTime || booking.timeSlot;
                const primaryService = booking.services[0]?.name || 'Cleaning Service';
                const isCustomerA = booking.id === 'PC-94820';
                const isCustomerB = booking.id === 'PC-94819';

                return (
                  <div
                    key={booking.id}
                    className={`p-4 sm:p-6 transition hover:bg-slate-50/70 ${
                      isCustomerA
                        ? 'bg-blue-50/30 border-l-4 border-l-blue-600'
                        : isCustomerB
                        ? 'bg-indigo-50/30 border-l-4 border-l-indigo-600'
                        : ''
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                      {/* Left: Time & Core Info */}
                      <div className="flex items-start gap-3 sm:gap-4 flex-1">
                        {/* Time block badge */}
                        <div className="bg-slate-900 text-white rounded-2xl p-2.5 sm:p-3 text-center shrink-0 w-24 sm:w-28 shadow-sm">
                          <Clock className="w-4 h-4 mx-auto mb-1 text-blue-400" />
                          <span className="font-black text-xs sm:text-sm block tracking-tight">
                            {booking.exactTime || 'Slot'}
                          </span>
                          <span className="text-[10px] text-slate-300 block truncate">
                            {booking.timeSlot}
                          </span>
                        </div>

                        {/* Customer & Service Info */}
                        <div className="space-y-1.5 flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-black text-slate-900 text-base sm:text-lg">
                              {booking.customerName}
                            </h3>
                            <span className="font-mono text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                              {booking.id}
                            </span>
                            {getStatusBadge(booking.status)}
                            {getPaymentBadge(booking)}
                          </div>

                          {/* Service title & breakdown */}
                          <div className="font-bold text-blue-700 text-sm flex items-center gap-2">
                            <span>✨ {primaryService}</span>
                            {booking.services.length > 1 && (
                              <span className="text-xs text-slate-500 font-normal">
                                + {booking.services.length - 1} more service{booking.services.length > 2 ? 's' : ''}
                              </span>
                            )}
                          </div>

                          {/* Address, Phone, Crew info */}
                          <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-slate-600 pt-0.5">
                            <span className="flex items-center gap-1 font-medium">
                              <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                              {booking.streetAddress}, {booking.city}, {booking.state} {booking.zipCode}
                            </span>
                            <span className="flex items-center gap-1 font-medium">
                              <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              {booking.phone}
                            </span>
                            <span className="flex items-center gap-1 font-medium">
                              <Truck className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                              {booking.technician || 'Unassigned Crew'}
                            </span>
                          </div>

                          {/* Notes snippet if exists */}
                          {(booking.customerNotes || booking.staffNotes) && (
                            <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-2.5 text-[11px] text-amber-900 mt-2 max-w-2xl">
                              <span className="font-bold">Instructions: </span>
                              {booking.customerNotes || booking.staffNotes}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right: Actions Toolbar (Confirm, Reschedule, Cancel, Mark Completed, Contacts, Add Note, Recode Payment) */}
                      <div className="flex flex-wrap lg:flex-col items-end gap-2 pt-2 lg:pt-0 shrink-0">
                        <div className="flex flex-wrap items-center gap-1.5">
                          {/* 1. Accept & Deny Buttons */}
                          {booking.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleAcceptBooking(booking)}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-xl font-bold text-xs transition flex items-center gap-1 shadow-xs cursor-pointer"
                                title="Accept and confirm booking"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" /> Accept
                              </button>
                              <button
                                onClick={() => setBookingForDeny(booking)}
                                className="bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 rounded-xl font-bold text-xs transition flex items-center gap-1 shadow-xs cursor-pointer"
                                title="Deny customer booking"
                              >
                                <XCircle className="w-3.5 h-3.5" /> Deny
                              </button>
                            </>
                          )}

                          {/* 2. Mark Completed Button */}
                          {booking.status !== 'completed' && booking.status !== 'cancelled' && (
                            <button
                              onClick={() => handleMarkCompleted(booking)}
                              className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded-xl font-bold text-xs transition flex items-center gap-1 shadow-xs cursor-pointer"
                              title="Mark job completed"
                            >
                              <ShieldCheck className="w-3.5 h-3.5" /> Mark Completed
                            </button>
                          )}

                          {/* 3. Reschedule Button */}
                          <button
                            onClick={() => setBookingForReschedule(booking)}
                            className="bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 px-3 py-1.5 rounded-xl font-bold text-xs transition flex items-center gap-1 cursor-pointer"
                            title="Reschedule appointment date/time"
                          >
                            <Clock className="w-3.5 h-3.5" /> Reschedule
                          </button>

                          {/* 4. Cancel Button */}
                          {booking.status !== 'cancelled' && (
                            <button
                              onClick={() => setBookingForCancel(booking)}
                              className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 px-3 py-1.5 rounded-xl font-bold text-xs transition flex items-center gap-1 cursor-pointer"
                              title="Cancel appointment"
                            >
                              <XCircle className="w-3.5 h-3.5" /> Cancel
                            </button>
                          )}
                        </div>

                        {/* Second action row: Contact, Add Note, Record Payment, Details */}
                        <div className="flex flex-wrap items-center gap-1.5">
                          {/* 5. Contact ("contacts contacts") */}
                          <button
                            onClick={() => setBookingForContact(booking)}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-1.5 rounded-xl font-bold text-xs transition flex items-center gap-1 cursor-pointer"
                            title="Contact customer (Phone, SMS, Email)"
                          >
                            <Phone className="w-3.5 h-3.5 text-emerald-600" /> Contacts
                          </button>

                          {/* 6. Add Note */}
                          <button
                            onClick={() => setBookingForNote(booking)}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-1.5 rounded-xl font-bold text-xs transition flex items-center gap-1 cursor-pointer"
                            title="Add note / view note log"
                          >
                            <FileText className="w-3.5 h-3.5 text-blue-600" /> Add Note
                            {booking.notesList && booking.notesList.length > 0 && (
                              <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[9px] flex items-center justify-center font-bold">
                                {booking.notesList.length}
                              </span>
                            )}
                          </button>

                          {/* 7. Record Payment ("recode payment") */}
                          <button
                            onClick={() => setBookingForPayment(booking)}
                            className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 px-3 py-1.5 rounded-xl font-bold text-xs transition flex items-center gap-1 cursor-pointer"
                            title="Record payment or view receipts"
                          >
                            <DollarSign className="w-3.5 h-3.5 text-emerald-600" /> Record Payment
                          </button>

                          {/* 8. Full Details Modal */}
                          <button
                            onClick={() => setSelectedBookingForDetails(booking)}
                            className="bg-slate-800 hover:bg-slate-900 text-white px-3 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer"
                            title="View full dispatch job file"
                          >
                            Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ==========================================
          VIEW 2: WEEK VIEW (7 Column Timeline)
          ========================================== */}
      {viewMode === 'week' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <h2 className="font-black text-slate-900 text-base">
              Week Schedule &bull; {currentRangeLabel}
            </h2>
            <span className="text-xs text-slate-500">
              Click any appointment card to manage, reschedule, or contact
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-7 divide-y md:divide-y-0 md:divide-x divide-slate-200 overflow-x-auto">
            {weekDays.map((day) => {
              const dayItems = filteredBookings.filter((b) => b.date === day.dateStr);

              return (
                <div
                  key={day.dateStr}
                  className={`min-h-[420px] p-3 flex flex-col ${
                    day.isToday ? 'bg-blue-50/30' : 'bg-white'
                  }`}
                >
                  {/* Column Day Header */}
                  <div
                    onClick={() => {
                      setSelectedDate(day.dateStr);
                      setViewMode('day');
                    }}
                    className={`p-2.5 rounded-2xl mb-3 text-center cursor-pointer transition ${
                      day.isToday
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <div className="text-[10px] font-extrabold uppercase tracking-wider">
                      {day.weekdayName}
                    </div>
                    <div className="text-lg font-black">{day.dayNum}</div>
                    <div className="text-[10px] opacity-80">
                      {dayItems.length} appointment{dayItems.length === 1 ? '' : 's'}
                    </div>
                  </div>

                  {/* Day items list */}
                  <div className="space-y-2 flex-1">
                    {dayItems.length === 0 ? (
                      <div className="h-32 flex items-center justify-center text-center text-slate-300 text-xs italic">
                        No jobs
                      </div>
                    ) : (
                      dayItems.map((b) => {
                        const isA = b.id === 'PC-94820';
                        const isB = b.id === 'PC-94819';
                        return (
                          <div
                            key={b.id}
                            className={`p-2.5 rounded-xl border text-xs transition shadow-2xs space-y-1.5 ${
                              isA
                                ? 'bg-blue-50 border-blue-300'
                                : isB
                                ? 'bg-indigo-50 border-indigo-300'
                                : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-extrabold text-blue-800 bg-blue-100/80 px-1.5 py-0.5 rounded text-[10px]">
                                {b.exactTime || b.timeSlot.split('-')[0]}
                              </span>
                              <span className="text-[10px] font-mono text-slate-400">
                                ${b.totalPrice}
                              </span>
                            </div>

                            <div className="font-bold text-slate-900 leading-tight truncate">
                              {b.customerName}
                            </div>
                            <div className="text-slate-600 text-[11px] font-medium leading-tight truncate">
                              {b.services[0]?.name}
                            </div>

                            {/* Status tag */}
                            <div className="flex items-center justify-between pt-1">
                              <span
                                className={`text-[9px] font-bold px-1.5 py-0.5 rounded capitalize ${
                                  b.status === 'confirmed'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : b.status === 'pending'
                                    ? 'bg-amber-100 text-amber-800'
                                    : b.status === 'completed'
                                    ? 'bg-purple-100 text-purple-800'
                                    : 'bg-slate-200 text-slate-700'
                                }`}
                              >
                                {b.status}
                              </span>

                              {/* Mini action menu buttons */}
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => setBookingForContact(b)}
                                  className="p-1 hover:bg-slate-200 rounded text-slate-600"
                                  title="Contact customer"
                                >
                                  <Phone className="w-3 h-3 text-emerald-600" />
                                </button>
                                <button
                                  onClick={() => setBookingForReschedule(b)}
                                  className="p-1 hover:bg-slate-200 rounded text-slate-600"
                                  title="Reschedule"
                                >
                                  <Clock className="w-3 h-3 text-blue-600" />
                                </button>
                                <button
                                  onClick={() => setSelectedBookingForDetails(b)}
                                  className="p-1 hover:bg-slate-200 rounded text-slate-600"
                                  title="Details"
                                >
                                  <Edit3 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ==========================================
          VIEW 3: MONTH VIEW (Monthly Calendar Grid)
          ========================================== */}
      {viewMode === 'month' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <h2 className="font-black text-slate-900 text-base">
              Monthly Calendar Overview &bull; {currentDateObj.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h2>
            <span className="text-xs text-slate-500">
              Click any date cell to view its day appointments
            </span>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-100/70 text-center text-[11px] font-bold text-slate-600 py-2">
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
            <div>Sun</div>
          </div>

          {/* Month grid */}
          <div className="grid grid-cols-7 divide-x divide-y divide-slate-100">
            {monthDays.map((cell, idx) => {
              const dayBookingsList = filteredBookings.filter((b) => b.date === cell.dateStr);

              return (
                <div
                  key={idx}
                  onClick={() => {
                    setSelectedDate(cell.dateStr);
                    setViewMode('day');
                  }}
                  className={`min-h-[100px] sm:min-h-[120px] p-2 transition cursor-pointer hover:bg-blue-50/50 flex flex-col ${
                    cell.isToday
                      ? 'bg-blue-50/40'
                      : !cell.isCurrentMonth
                      ? 'bg-slate-50/40 text-slate-300'
                      : 'bg-white text-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full ${
                        cell.isToday
                          ? 'bg-blue-600 text-white'
                          : cell.dateStr === selectedDate
                          ? 'bg-slate-900 text-white'
                          : ''
                      }`}
                    >
                      {cell.dayNum}
                    </span>
                    {dayBookingsList.length > 0 && (
                      <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded-full">
                        {dayBookingsList.length}
                      </span>
                    )}
                  </div>

                  {/* Booking pills inside date cell */}
                  <div className="space-y-1 flex-1 overflow-hidden">
                    {dayBookingsList.slice(0, 2).map((b) => (
                      <div
                        key={b.id}
                        className="truncate text-[10px] font-semibold bg-slate-100 hover:bg-blue-100 text-slate-800 px-1.5 py-0.5 rounded border border-slate-200"
                      >
                        <span className="text-blue-700 font-bold">{b.exactTime || 'Slot'}</span> {b.customerName}
                      </div>
                    ))}
                    {dayBookingsList.length > 2 && (
                      <div className="text-[9px] text-slate-400 font-bold text-center">
                        + {dayBookingsList.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ==========================================
          VIEW 4: AGENDA / ALL APPOINTMENTS LIST
          ========================================== */}
      {viewMode === 'agenda' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h2 className="font-black text-slate-900 text-base">
                Chronological Appointments Agenda
              </h2>
              <p className="text-xs text-slate-500">
                Showing {filteredBookings.length} total scheduled appointment{filteredBookings.length === 1 ? '' : 's'}
              </p>
            </div>

            <button
              onClick={() => {
                // Download CSV of bookings
                const csvHeader = 'ID,Date,Time,Customer,Phone,Address,Services,Total,Status,Payment\n';
                const csvRows = filteredBookings
                  .map(
                    (b) =>
                      `"${b.id}","${b.date}","${b.exactTime || b.timeSlot}","${b.customerName}","${b.phone}","${b.streetAddress}, ${b.city}","${b.services.map((s) => s.name).join('; ')}","${b.totalPrice}","${b.status}","${b.paymentStatus}"`
                  )
                  .join('\n');
                const blob = new Blob([csvHeader + csvRows], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `am_carpet_cleaning_schedule_${selectedDate}.csv`;
                a.click();
              }}
              className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 px-3 py-1.5 rounded-xl font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" /> Export Schedule CSV
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {filteredBookings.map((b) => (
              <div key={b.id} className="p-4 sm:p-5 hover:bg-slate-50/80 transition flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-50 text-blue-800 border border-blue-200 rounded-2xl p-2.5 text-center shrink-0 w-24">
                    <span className="text-[10px] font-bold uppercase block">{b.date}</span>
                    <span className="font-black text-xs block">{b.exactTime || 'Slot'}</span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm sm:text-base">{b.customerName}</span>
                      <span className="font-mono text-[11px] text-slate-400">{b.id}</span>
                      {getStatusBadge(b.status)}
                      {getPaymentBadge(b)}
                    </div>
                    <div className="text-xs text-blue-700 font-semibold">
                      {b.services.map((s) => `${s.quantity}x ${s.name}`).join(' &bull; ')}
                    </div>
                    <div className="text-xs text-slate-500 flex flex-wrap items-center gap-3">
                      <span>{b.streetAddress}, {b.city}</span>
                      <span>&bull;</span>
                      <span>{b.phone}</span>
                      <span>&bull;</span>
                      <span>{b.technician || 'Driver unassigned'}</span>
                    </div>
                  </div>
                </div>

                {/* Toolbar for agenda row */}
                <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                  {b.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleAcceptBooking(b)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1.5 rounded-xl font-bold text-xs transition flex items-center gap-1 cursor-pointer shadow-xs"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Accept
                      </button>
                      <button
                        onClick={() => setBookingForDeny(b)}
                        className="bg-rose-600 hover:bg-rose-700 text-white px-2.5 py-1.5 rounded-xl font-bold text-xs transition flex items-center gap-1 cursor-pointer shadow-xs"
                      >
                        <XCircle className="w-3.5 h-3.5" /> Deny
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => setBookingForReschedule(b)}
                    className="bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 px-2.5 py-1.5 rounded-xl font-bold text-xs transition flex items-center gap-1 cursor-pointer"
                  >
                    <Clock className="w-3.5 h-3.5" /> Reschedule
                  </button>
                  <button
                    onClick={() => setBookingForContact(b)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-2.5 py-1.5 rounded-xl font-bold text-xs transition flex items-center gap-1 cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-600" /> Contacts
                  </button>
                  <button
                    onClick={() => setBookingForNote(b)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-2.5 py-1.5 rounded-xl font-bold text-xs transition flex items-center gap-1 cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-blue-600" /> Note
                  </button>
                  <button
                    onClick={() => setBookingForPayment(b)}
                    className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-1.5 rounded-xl font-bold text-xs transition flex items-center gap-1 cursor-pointer"
                  >
                    <DollarSign className="w-3.5 h-3.5" /> Payment
                  </button>
                  <button
                    onClick={() => setBookingForReceipt(b)}
                    className="bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 px-2.5 py-1.5 rounded-xl font-bold text-xs transition flex items-center gap-1 cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" /> Receipt
                  </button>
                  <button
                    onClick={() => setSelectedBookingForDetails(b)}
                    className="bg-slate-800 hover:bg-slate-900 text-white px-3 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer"
                  >
                    Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==========================================
          MODALS & DRAWERS
          ========================================== */}
      {/* 1. Reschedule Modal */}
      <RescheduleModal
        booking={bookingForReschedule}
        isOpen={Boolean(bookingForReschedule)}
        onClose={() => setBookingForReschedule(null)}
        onConfirmReschedule={handleSaveReschedule}
      />

      {/* 2. Cancel Modal */}
      <CancelModal
        booking={bookingForCancel}
        isOpen={Boolean(bookingForCancel)}
        onClose={() => setBookingForCancel(null)}
        onConfirmCancel={handleSaveCancel}
      />

      {/* Deny Booking Modal */}
      <DenyBookingModal
        booking={bookingForDeny}
        isOpen={Boolean(bookingForDeny)}
        onClose={() => setBookingForDeny(null)}
        onConfirmDenial={handleConfirmDenial}
      />

      {/* 3. Contact Customer Modal */}
      <ContactCustomerModal
        booking={bookingForContact}
        isOpen={Boolean(bookingForContact)}
        onClose={() => setBookingForContact(null)}
      />

      {/* 4. Add Note Modal */}
      <AddNoteModal
        booking={bookingForNote}
        isOpen={Boolean(bookingForNote)}
        onClose={() => setBookingForNote(null)}
        onSaveNote={handleSaveNote}
      />

      {/* 5. Record Payment Modal */}
      <RecordPaymentModal
        booking={bookingForPayment}
        isOpen={Boolean(bookingForPayment)}
        onClose={() => setBookingForPayment(null)}
        onSavePayment={handleSavePayment}
      />

      {/* 6. Full Job Details Modal */}
      <JobDetailsModal
        booking={selectedBookingForDetails}
        isOpen={Boolean(selectedBookingForDetails)}
        onClose={() => setSelectedBookingForDetails(null)}
        onUpdateBooking={(updated) => {
          const next = bookings.map((b) => (b.id === updated.id ? updated : b));
          onBookingsChange(next);
          setSelectedBookingForDetails(updated);
          showToast(`Job #${updated.id} details updated.`);
        }}
        onDeleteBooking={(id) => {
          const success = deleteBooking(id);
          if (success) {
            onBookingsChange(bookings.filter((b) => b.id !== id));
            setSelectedBookingForDetails(null);
            showToast('Booking deleted.');
          }
        }}
      />

      {/* 7. Payment Receipt Modal */}
      <PaymentReceiptModal
        booking={bookingForReceipt}
        isOpen={Boolean(bookingForReceipt)}
        onClose={() => setBookingForReceipt(null)}
      />
    </div>
  );
}
