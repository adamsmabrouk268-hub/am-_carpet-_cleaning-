import { useState, useMemo, useEffect } from 'react';
import {
  Bell,
  BellRing,
  Volume2,
  VolumeX,
  Sparkles,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  Mail,
  User,
  Search,
  Filter,
  Eye,
  Check,
  Ban,
  Printer,
  Calendar,
  DollarSign,
  AlertCircle,
  Copy,
  ExternalLink,
  MessageSquare,
  Paintbrush,
  Truck,
  ShieldCheck,
  Flame,
  ArrowRight,
  RefreshCw,
  Zap
} from 'lucide-react';
import { Booking, BookingStatus } from '../types';
import {
  getNotificationSettings,
  saveNotificationSettings,
  playNotificationSound,
  getDesktopNotificationPermission,
  requestDesktopNotificationPermission,
  getReviewedBookingIds,
  markBookingAsReviewed,
  markAllBookingsAsReviewed
} from '../utils/notificationService';
import { acceptBooking, denyBooking, updateBookingStatus } from '../utils/bookingStorage';
import JobDetailsModal from './JobDetailsModal';
import DenyBookingModal from './DenyBookingModal';
import PaymentReceiptModal from './PaymentReceiptModal';

interface AdminNewBookingsSectionProps {
  bookings: Booking[];
  onBookingsChange: (updated: Booking[]) => void;
  onOpenManualBooking?: () => void;
  theme?: 'dark' | 'light';
}

export default function AdminNewBookingsSection({
  bookings,
  onBookingsChange,
  onOpenManualBooking,
  theme = 'light'
}: AdminNewBookingsSectionProps) {
  // Settings & Reviewed IDs state
  const [settings, setSettings] = useState(() => getNotificationSettings());
  const [reviewedIds, setReviewedIds] = useState<string[]>(() => getReviewedBookingIds());
  const [desktopPerm, setDesktopPerm] = useState<NotificationPermission | 'unsupported'>(() =>
    getDesktopNotificationPermission()
  );

  // Filters & Search
  const [activeFilter, setActiveFilter] = useState<
    'all' | 'unreviewed' | 'pending' | 'confirmed' | 'carpet' | 'painting' | 'upholstery'
  >('unreviewed');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Modals
  const [selectedBookingForDetails, setSelectedBookingForDetails] = useState<Booking | null>(null);
  const [selectedBookingForDeny, setSelectedBookingForDeny] = useState<Booking | null>(null);
  const [selectedBookingForReceipt, setSelectedBookingForReceipt] = useState<Booking | null>(null);

  // Sync reviewed IDs when other components or tabs update them
  useEffect(() => {
    const handleReviewedSync = () => {
      setReviewedIds(getReviewedBookingIds());
    };
    window.addEventListener('am_reviewed_updated', handleReviewedSync);
    return () => window.removeEventListener('am_reviewed_updated', handleReviewedSync);
  }, []);

  // Compute Unreviewed count
  const unreviewedCount = useMemo(() => {
    const reviewedSet = new Set(reviewedIds);
    return bookings.filter((b) => !reviewedSet.has(b.id)).length;
  }, [bookings, reviewedIds]);

  // Handlers for settings
  const toggleSound = () => {
    const next = !settings.soundEnabled;
    const nextSettings = { ...settings, soundEnabled: next };
    setSettings(nextSettings);
    saveNotificationSettings(nextSettings);
    if (next) {
      playNotificationSound();
    }
  };

  const handleTestSound = () => {
    playNotificationSound();
  };

  const handleRequestDesktopPermission = async () => {
    const perm = await requestDesktopNotificationPermission();
    setDesktopPerm(perm);
    if (perm === 'granted') {
      const nextSettings = { ...settings, desktopEnabled: true };
      setSettings(nextSettings);
      saveNotificationSettings(nextSettings);
    }
  };

  const handleMarkAsReviewed = (bookingId: string) => {
    markBookingAsReviewed(bookingId);
    setReviewedIds(getReviewedBookingIds());
  };

  const handleMarkAllAsReviewed = () => {
    const allIds = bookings.map((b) => b.id);
    markAllBookingsAsReviewed(allIds);
    setReviewedIds(getReviewedBookingIds());
  };

  const handleAccept = (bookingId: string) => {
    const res = acceptBooking(bookingId);
    if (res) {
      handleMarkAsReviewed(bookingId);
      const updated = bookings.map((b) => (b.id === bookingId ? res : b));
      onBookingsChange(updated);
    }
  };

  const handleDenialConfirmed = (reason: string) => {
    if (!selectedBookingForDeny) return;
    const res = denyBooking(selectedBookingForDeny.id, reason);
    if (res) {
      handleMarkAsReviewed(selectedBookingForDeny.id);
      const updated = bookings.map((b) => (b.id === selectedBookingForDeny.id ? res : b));
      onBookingsChange(updated);
    }
    setSelectedBookingForDeny(null);
  };

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id).catch(() => {});
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filter Bookings
  const filteredBookings = useMemo(() => {
    const reviewedSet = new Set(reviewedIds);

    return bookings.filter((b) => {
      // Category / Status Filter
      if (activeFilter === 'unreviewed' && reviewedSet.has(b.id)) {
        return false;
      }
      if (activeFilter === 'pending' && b.status !== 'pending') {
        return false;
      }
      if (activeFilter === 'confirmed' && b.status !== 'confirmed') {
        return false;
      }
      if (activeFilter === 'carpet') {
        const hasCarpet = b.services.some(
          (s) => s.id.includes('carpet') || s.name.toLowerCase().includes('carpet')
        );
        if (!hasCarpet) return false;
      }
      if (activeFilter === 'painting') {
        const hasPainting = b.services.some(
          (s) => s.id.includes('painting') || s.name.toLowerCase().includes('paint')
        );
        if (!hasPainting) return false;
      }
      if (activeFilter === 'upholstery') {
        const hasUpholstery = b.services.some(
          (s) =>
            s.id.includes('sofa') ||
            s.id.includes('upholstery') ||
            s.name.toLowerCase().includes('couch') ||
            s.name.toLowerCase().includes('upholstery')
        );
        if (!hasUpholstery) return false;
      }

      // Keyword Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesId = b.id.toLowerCase().includes(q);
        const matchesName = b.customerName.toLowerCase().includes(q);
        const matchesPhone = b.phone.includes(q);
        const matchesCity = b.city.toLowerCase().includes(q);
        const matchesStreet = b.streetAddress.toLowerCase().includes(q);
        const matchesService = b.services.some((s) => s.name.toLowerCase().includes(q));

        if (!matchesId && !matchesName && !matchesPhone && !matchesCity && !matchesStreet && !matchesService) {
          return false;
        }
      }

      return true;
    });
  }, [bookings, reviewedIds, activeFilter, searchQuery]);

  const reviewedSet = useMemo(() => new Set(reviewedIds), [reviewedIds]);

  const isDark = theme === 'dark';

  return (
    <div className="space-y-6">
      {/* 1. NOTIFICATION COMMAND & ALERT STATUS BAR */}
      <div
        className={`p-5 rounded-2xl border transition shadow-sm ${
          isDark
            ? 'bg-slate-800/90 border-slate-700/80 text-white'
            : 'bg-white border-slate-200 text-slate-800'
        }`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Status Indicator */}
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
              </span>
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" />
                Live Customer Dispatch Listener Active
              </span>
              {unreviewedCount > 0 && (
                <span className="bg-rose-500 text-white text-[11px] font-black px-2.5 py-0.5 rounded-full animate-pulse shadow-xs">
                  {unreviewedCount} NEW BOOKING{unreviewedCount > 1 ? 'S' : ''}
                </span>
              )}
            </div>
            <h3 className="text-lg font-black tracking-tight">
              Customer Booking Alerts & New Work Orders
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Instantly review, approve, and dispatch incoming requests for carpet steam cleaning and painting services.
            </p>
          </div>

          {/* Quick Actions & Settings Controls */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Sound Toggle */}
            <button
              type="button"
              onClick={toggleSound}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border ${
                settings.soundEnabled
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:border-emerald-800 dark:text-emerald-300'
                  : 'bg-slate-100 border-slate-300 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-300'
              }`}
              title="Toggle audio alert chime for new incoming bookings"
            >
              {settings.soundEnabled ? (
                <>
                  <Volume2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Sound Alerts ON</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4 text-slate-500" />
                  <span>Sound Muted</span>
                </>
              )}
            </button>

            {/* Test Sound Button */}
            <button
              type="button"
              onClick={handleTestSound}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border ${
                isDark
                  ? 'bg-slate-700/80 border-slate-600 text-slate-200 hover:bg-slate-700'
                  : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50 shadow-2xs'
              }`}
              title="Test the 2-tone dispatch chime"
            >
              <Bell className="w-3.5 h-3.5 text-amber-500" />
              <span>Test Chime</span>
            </button>

            {/* Desktop Notification Request */}
            {desktopPerm === 'granted' ? (
              <span className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold bg-sky-50 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 border border-sky-300 dark:border-sky-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                <span>Desktop Alerts Active</span>
              </span>
            ) : desktopPerm === 'unsupported' ? null : (
              <button
                type="button"
                onClick={handleRequestDesktopPermission}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
                title="Enable browser notifications when in background"
              >
                <BellRing className="w-3.5 h-3.5" />
                <span>Enable Desktop Alerts</span>
              </button>
            )}


            {/* Mark All Reviewed */}
            {unreviewedCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllAsReviewed}
                className="bg-slate-200 hover:bg-slate-300 text-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-100 px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                title="Clear all NEW badges"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Mark All Reviewed</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick KPI stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-100 dark:border-slate-700/80">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              Unreviewed New
            </span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xl font-black text-rose-600 dark:text-rose-400">
                {unreviewedCount}
              </span>
              {unreviewedCount > 0 && (
                <span className="text-[10px] font-bold text-rose-500 bg-rose-50 dark:bg-rose-950/80 px-1.5 py-0.5 rounded">
                  Action required
                </span>
              )}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              Total Inquiries
            </span>
            <div className="text-xl font-black text-slate-800 dark:text-slate-100 mt-1">
              {bookings.length} Orders
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              Pending Confirmation
            </span>
            <div className="text-xl font-black text-amber-600 dark:text-amber-400 mt-1">
              {bookings.filter((b) => b.status === 'pending').length}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              New Bookings Value
            </span>
            <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
              ${bookings.reduce((s, b) => (b.status !== 'cancelled' ? s + b.totalPrice : s), 0).toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* 2. FILTER TABS & SEARCH BAR */}
      <div
        className={`p-4 rounded-2xl border transition shadow-2xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between ${
          isDark
            ? 'bg-slate-800/90 border-slate-700/80 text-white'
            : 'bg-white border-slate-200 text-slate-800'
        }`}
      >
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search new booking by customer, phone, city, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-9 pr-3 py-2 rounded-xl text-xs outline-none border transition ${
              isDark
                ? 'bg-slate-900 border-slate-700 text-white focus:border-blue-500'
                : 'bg-slate-50 border-slate-300 text-slate-900 focus:bg-white focus:border-blue-500'
            }`}
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveFilter('unreviewed')}
            className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1 cursor-pointer ${
              activeFilter === 'unreviewed'
                ? 'bg-rose-600 text-white shadow-xs'
                : isDark
                ? 'bg-slate-700 text-slate-300 hover:text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Unreviewed ({unreviewedCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-blue-600 text-white shadow-xs'
                : isDark
                ? 'bg-slate-700 text-slate-300 hover:text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Bookings ({bookings.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('pending')}
            className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
              activeFilter === 'pending'
                ? 'bg-amber-600 text-white shadow-xs'
                : isDark
                ? 'bg-slate-700 text-slate-300 hover:text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Pending ({bookings.filter((b) => b.status === 'pending').length})
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('carpet')}
            className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
              activeFilter === 'carpet'
                ? 'bg-blue-600 text-white shadow-xs'
                : isDark
                ? 'bg-slate-700 text-slate-300 hover:text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Carpet Cleaning
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('painting')}
            className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
              activeFilter === 'painting'
                ? 'bg-indigo-600 text-white shadow-xs'
                : isDark
                ? 'bg-slate-700 text-slate-300 hover:text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Paintbrush className="w-3.5 h-3.5 inline mr-1" />
            Painting
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('upholstery')}
            className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
              activeFilter === 'upholstery'
                ? 'bg-sky-600 text-white shadow-xs'
                : isDark
                ? 'bg-slate-700 text-slate-300 hover:text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Couches & Sofas
          </button>
        </div>
      </div>

      {/* 3. BOOKINGS LIST / FEED */}
      {filteredBookings.length === 0 ? (
        <div
          className={`p-12 text-center rounded-2xl border transition ${
            isDark
              ? 'bg-slate-800/60 border-slate-700/80 text-slate-400'
              : 'bg-white border-slate-200 text-slate-500'
          }`}
        >
          <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-3">
            <Bell className="w-7 h-7" />
          </div>
          <h4 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
            {activeFilter === 'unreviewed' ? 'All Booking Alerts Reviewed' : 'No Bookings Found'}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1">
            {activeFilter === 'unreviewed'
              ? 'There are no pending unreviewed booking alerts. As new customers book services, they will appear here instantly with sound alerts.'
              : 'No bookings match the selected criteria. New orders will appear here as soon as customers submit them.'}
          </p>
          {activeFilter !== 'all' && bookings.length > 0 && (
            <div className="mt-4 flex justify-center">
              <button
                type="button"
                onClick={() => setActiveFilter('all')}
                className="bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-800 dark:text-slate-200 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                View All Bookings ({bookings.length})
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((b) => {
            const isUnreviewed = !reviewedSet.has(b.id);
            const isPainting = b.services.some(
              (s) => s.id.includes('painting') || s.name.toLowerCase().includes('paint')
            );

            return (
              <div
                key={b.id}
                className={`rounded-2xl border transition-all duration-200 shadow-xs relative overflow-hidden ${
                  isUnreviewed
                    ? isDark
                      ? 'bg-slate-800/95 border-amber-500/80 ring-2 ring-amber-500/30'
                      : 'bg-amber-50/40 border-amber-400 ring-2 ring-amber-400/20'
                    : isDark
                    ? 'bg-slate-800/80 border-slate-700 hover:border-slate-600'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Visual Top Highlight Accent */}
                {isUnreviewed && (
                  <div className="h-1 bg-gradient-to-r from-amber-500 via-rose-500 to-amber-500 w-full" />
                )}

                <div className="p-5">
                  {/* Header Row: ID, Badges, Timestamp */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-100 dark:border-slate-700/60">
                    <div className="flex flex-wrap items-center gap-2">
                      {isUnreviewed && (
                        <span className="inline-flex items-center gap-1 bg-rose-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider animate-pulse shadow-xs">
                          <Flame className="w-3 h-3" />
                          NEW BOOKING
                        </span>
                      )}

                      <span className="font-mono font-extrabold text-blue-700 dark:text-sky-400 text-xs flex items-center gap-1">
                        #{b.id}
                        <button
                          type="button"
                          onClick={() => handleCopyId(b.id)}
                          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 cursor-pointer"
                          title="Copy Booking ID"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                        {copiedId === b.id && (
                          <span className="text-[10px] text-emerald-600 font-sans font-bold">Copied!</span>
                        )}
                      </span>

                      {/* Status badge */}
                      {b.status === 'confirmed' ? (
                        <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                          Confirmed & Dispatched
                        </span>
                      ) : b.status === 'in_progress' ? (
                        <span className="bg-sky-100 text-sky-800 dark:bg-sky-950/80 dark:text-sky-300 text-[11px] font-bold px-2.5 py-0.5 rounded-full animate-pulse flex items-center gap-1">
                          <Truck className="w-3 h-3" />
                          Crew In Progress
                        </span>
                      ) : b.status === 'cancelled' ? (
                        <span className="bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                          Cancelled
                        </span>
                      ) : (
                        <span className="bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-300 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                          <AlertCircle className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                          Pending Staff Approval
                        </span>
                      )}

                      {isPainting && (
                        <span className="bg-indigo-100 text-indigo-800 dark:bg-indigo-950/80 dark:text-indigo-300 text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Paintbrush className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                          Painting Project
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        Received: {b.createdAt ? new Date(b.createdAt).toLocaleDateString() + ' ' + new Date(b.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recent'}
                      </span>
                    </div>
                  </div>

                  {/* Body Grid: Customer, Services, Arrival & Price */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {/* Column 1: Customer & Address */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-sky-300 flex items-center justify-center font-black text-xs shrink-0">
                          {b.customerName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                            {b.customerName}
                          </h4>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 capitalize">
                            Property: {b.propertyType ? b.propertyType.replace('_', ' ') : 'Residential'}
                          </span>
                        </div>
                      </div>

                      {/* Phone & Email */}
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-semibold">
                          <Phone className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span>{b.phone}</span>
                          <a
                            href={`tel:${b.phone.replace(/\D/g, '')}`}
                            className="text-[11px] font-bold text-blue-600 dark:text-sky-400 hover:underline"
                          >
                            Call
                          </a>
                          <span>&bull;</span>
                          <a
                            href={`sms:${b.phone.replace(/\D/g, '')}`}
                            className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                          >
                            SMS
                          </a>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                          <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{b.email}</span>
                        </div>
                      </div>

                      {/* Location Address */}
                      <div className="flex items-start gap-1.5 text-xs text-slate-700 dark:text-slate-300 pt-1">
                        <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold leading-tight">
                            {b.streetAddress} {b.aptUnit ? `(${b.aptUnit})` : ''}
                          </p>
                          <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                            {b.city}, {b.state} {b.zipCode}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Column 2: Booked Services & Special Notes */}
                    <div className="space-y-2 border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-700/60 md:pl-5">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Selected Services ({b.services.length})
                      </div>
                      <div className="space-y-1.5">
                        {b.services.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between text-xs py-1 px-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800"
                          >
                            <span className="font-semibold text-slate-800 dark:text-slate-200">
                              {item.quantity}x {item.name}
                            </span>
                            <span className="font-bold text-slate-900 dark:text-slate-100">
                              ${item.total || item.unitPrice * item.quantity}
                            </span>
                          </div>
                        ))}

                        {/* Add-ons */}
                        {b.addOns && b.addOns.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {b.addOns.map((add, aIdx) => (
                              <span
                                key={aIdx}
                                className="bg-sky-50 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 border border-sky-200 dark:border-sky-800 text-[10px] font-bold px-2 py-0.5 rounded-md"
                              >
                                + {add.name} (${add.price})
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Customer Note */}
                      {b.customerNotes && (
                        <div className="mt-2 p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-[11px] text-amber-900 dark:text-amber-200">
                          <span className="font-bold block">Customer Note:</span>
                          <span className="italic">{b.customerNotes}</span>
                        </div>
                      )}
                    </div>

                    {/* Column 3: Schedule Window & Payment Totals */}
                    <div className="space-y-2 border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-700/60 md:pl-5 flex flex-col justify-between">
                      <div>
                        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                          Arrival Window & Date
                        </div>
                        <div className="bg-blue-50/70 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/70 p-2.5 rounded-xl">
                          <div className="text-xs font-black text-blue-900 dark:text-sky-200 flex items-center gap-1.5">
                            <Calendar className="w-4 h-4 text-blue-600 dark:text-sky-400" />
                            <span>{b.date}</span>
                          </div>
                          <div className="text-xs text-blue-700 dark:text-sky-300 font-semibold mt-0.5 flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-blue-500" />
                            <span>{b.timeSlot}</span>
                          </div>
                          {b.technician && (
                            <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                              <Truck className="w-3 h-3" />
                              <span>Van: {b.technician}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Financials */}
                      <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700/60">
                        <div className="flex items-baseline justify-between">
                          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                            Total Estimate:
                          </span>
                          <span className="text-xl font-black text-slate-900 dark:text-white">
                            ${b.totalPrice}
                          </span>
                        </div>

                        <div className="mt-1 flex items-center justify-between text-xs">
                          <span className="text-[11px] text-slate-500 dark:text-slate-400">Payment:</span>
                          <span
                            className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                              b.paymentStatus === 'paid_full'
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                : b.paymentStatus === 'paid_deposit'
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-sky-300'
                                : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200'
                            }`}
                          >
                            {b.paymentStatus === 'paid_full'
                              ? 'Paid Full Online'
                              : b.paymentStatus === 'paid_deposit'
                              ? `Deposit Paid: $${b.depositPaid || b.depositAmount || 0}`
                              : 'Pay Upon Completion'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions Footer Bar */}
                  <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-700/60 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {isUnreviewed && (
                        <button
                          type="button"
                          onClick={() => handleMarkAsReviewed(b.id)}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-slate-500" />
                          <span>Mark Reviewed</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => setSelectedBookingForDetails(b)}
                        className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                        <span>Work Order Details</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedBookingForReceipt(b)}
                        className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                      >
                        <Printer className="w-3.5 h-3.5 text-slate-500" />
                        <span>Receipt</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      {b.status !== 'confirmed' && b.status !== 'completed' && (
                        <button
                          type="button"
                          onClick={() => handleAccept(b.id)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Accept & Dispatch Crew</span>
                        </button>
                      )}

                      {b.status !== 'cancelled' && (
                        <button
                          type="button"
                          onClick={() => setSelectedBookingForDeny(b)}
                          className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 dark:bg-rose-950/60 dark:border-rose-800 dark:text-rose-300 px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                        >
                          <Ban className="w-3.5 h-3.5" />
                          <span>Deny Booking</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODALS */}
      {selectedBookingForDetails && (
        <JobDetailsModal
          booking={selectedBookingForDetails}
          isOpen={true}
          onClose={() => setSelectedBookingForDetails(null)}
          onBookingUpdated={(updated) => {
            const nextList = bookings.map((b) => (b.id === updated.id ? updated : b));
            onBookingsChange(nextList);
            setSelectedBookingForDetails(updated);
          }}
          onBookingDeleted={(id) => {
            const nextList = bookings.filter((b) => b.id !== id);
            onBookingsChange(nextList);
            setSelectedBookingForDetails(null);
          }}
        />
      )}

      {selectedBookingForDeny && (
        <DenyBookingModal
          booking={selectedBookingForDeny}
          isOpen={true}
          onClose={() => setSelectedBookingForDeny(null)}
          onConfirmDenial={handleDenialConfirmed}
        />
      )}

      {selectedBookingForReceipt && (
        <PaymentReceiptModal
          booking={selectedBookingForReceipt}
          isOpen={true}
          onClose={() => setSelectedBookingForReceipt(null)}
        />
      )}
    </div>
  );
}
