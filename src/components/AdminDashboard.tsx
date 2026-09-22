import { useState, useMemo, MouseEvent } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  User,
  Search,
  Filter,
  Download,
  Plus,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Clock4,
  DollarSign,
  TrendingUp,
  Users,
  Eye,
  ArrowUpRight,
  Truck,
  Sparkles,
  ExternalLink,
  ChevronDown,
  Printer,
  LogOut,
  KeyRound,
  Image as ImageIcon,
  Layers,
  MapPin as MapPinIcon,
  Check,
  Ban,
  ShieldAlert
} from 'lucide-react';
import { Booking, BookingStatus } from '../types';
import {
  exportBookingsToCSV,
  resetDemoBookings,
  updateBookingStatus,
  acceptBooking,
  denyBooking
} from '../utils/bookingStorage';
import JobDetailsModal from './JobDetailsModal';
import ManualBookingModal from './ManualBookingModal';
import PaymentReceiptModal from './PaymentReceiptModal';
import { AppointmentManagement } from './AppointmentManagement';
import AdminPasswordModal from './AdminPasswordModal';
import AdminGalleryManager from './AdminGalleryManager';
import AdminServicesManager from './AdminServicesManager';
import AdminStatesManager from './AdminStatesManager';
import DenyBookingModal from './DenyBookingModal';

interface AdminDashboardProps {
  bookings: Booking[];
  onBookingsChange: (updated: Booking[]) => void;
  onExitDashboard: () => void;
  onLogout?: () => void;
  adminEmail?: string;
}

export default function AdminDashboard({
  bookings,
  onBookingsChange,
  onExitDashboard,
  onLogout,
  adminEmail = 'adminProClean@gmail.com'
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<
    'calendar' | 'appointments' | 'customers' | 'schedule' | 'gallery' | 'services' | 'states' | 'security'
  >('calendar');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'tomorrow' | 'week'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected booking for drawer/details modal
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [receiptBooking, setReceiptBooking] = useState<Booking | null>(null);
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [bookingForDeny, setBookingForDeny] = useState<Booking | null>(null);

  // Today string for comparisons
  const todayStr = '2026-09-15'; // aligns with default test data
  const tomorrowStr = '2026-09-16';

  // Metrics computation
  const stats = useMemo(() => {
    const totalRevenue = bookings.reduce((sum, b) => (b.status !== 'cancelled' ? sum + b.totalPrice : sum), 0);
    const todayCount = bookings.filter((b) => b.date === todayStr && b.status !== 'cancelled').length;
    const pendingCount = bookings.filter((b) => b.status === 'pending').length;
    const completedCount = bookings.filter((b) => b.status === 'completed').length;
    const inProgressCount = bookings.filter((b) => b.status === 'in_progress').length;

    return {
      totalRevenue,
      todayCount,
      pendingCount,
      completedCount,
      inProgressCount,
      totalCount: bookings.length
    };
  }, [bookings, todayStr]);

  // Filtered appointments list
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      // Status filter
      if (statusFilter !== 'all' && b.status !== statusFilter) return false;

      // Date filter
      if (dateFilter === 'today' && b.date !== todayStr) return false;
      if (dateFilter === 'tomorrow' && b.date !== tomorrowStr) return false;
      if (dateFilter === 'week') {
        const d = new Date(b.date);
        const today = new Date(todayStr);
        const diffDays = (d.getTime() - today.getTime()) / (1000 * 3600 * 24);
        if (diffDays < -1 || diffDays > 7) return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = b.customerName.toLowerCase().includes(q);
        const matchId = b.id.toLowerCase().includes(q);
        const matchPhone = b.phone.includes(q);
        const matchCity = b.city.toLowerCase().includes(q);
        const matchAddress = b.streetAddress.toLowerCase().includes(q);
        if (!matchName && !matchId && !matchPhone && !matchCity && !matchAddress) return false;
      }

      return true;
    });
  }, [bookings, statusFilter, dateFilter, searchQuery, todayStr, tomorrowStr]);

  // Unique customers CRM aggregation
  const customersList = useMemo(() => {
    const map = new Map<string, {
      name: string;
      phone: string;
      email: string;
      city: string;
      state: string;
      totalBookings: number;
      totalSpent: number;
      lastDate: string;
      latestId: string;
    }>();

    bookings.forEach((b) => {
      const key = b.phone.replace(/\D/g, '') || b.email.toLowerCase();
      const existing = map.get(key);
      if (existing) {
        existing.totalBookings += 1;
        if (b.status !== 'cancelled') existing.totalSpent += b.totalPrice;
        if (b.date > existing.lastDate) {
          existing.lastDate = b.date;
          existing.latestId = b.id;
        }
      } else {
        map.set(key, {
          name: b.customerName,
          phone: b.phone,
          email: b.email,
          city: b.city,
          state: b.state,
          totalBookings: 1,
          totalSpent: b.status !== 'cancelled' ? b.totalPrice : 0,
          lastDate: b.date,
          latestId: b.id
        });
      }
    });

    return Array.from(map.values());
  }, [bookings]);

  // Handlers
  const handleAcceptQuick = (id: string, e: MouseEvent) => {
    e.stopPropagation();
    const res = acceptBooking(id);
    if (res) {
      const nextList = bookings.map((b) => (b.id === id ? res : b));
      onBookingsChange(nextList);
    }
  };

  const handleOpenDenyModal = (booking: Booking, e: MouseEvent) => {
    e.stopPropagation();
    setBookingForDeny(booking);
  };

  const handleConfirmDenial = (reason: string) => {
    if (!bookingForDeny) return;
    const res = denyBooking(bookingForDeny.id, reason);
    if (res) {
      const nextList = bookings.map((b) => (b.id === bookingForDeny.id ? res : b));
      onBookingsChange(nextList);
    }
    setBookingForDeny(null);
  };

  const handleQuickStatusChange = (id: string, newStatus: BookingStatus, e: MouseEvent) => {
    e.stopPropagation();
    updateBookingStatus(id, newStatus);
    const nextList = bookings.map((b) => (b.id === id ? { ...b, status: newStatus } : b));
    onBookingsChange(nextList);
  };

  const handleBookingUpdated = (updated: Booking) => {
    const nextList = bookings.map((b) => (b.id === updated.id ? updated : b));
    onBookingsChange(nextList);
    setSelectedBooking(updated);
  };

  const handleBookingDeleted = (id: string) => {
    const nextList = bookings.filter((b) => b.id !== id);
    onBookingsChange(nextList);
    setSelectedBooking(null);
  };

  const handleManualBookingAdded = (newBooking: Booking) => {
    onBookingsChange([newBooking, ...bookings]);
  };

  const handleResetData = () => {
    if (window.confirm('Reset schedule to demo sample bookings?')) {
      const reset = resetDemoBookings();
      onBookingsChange(reset);
    }
  };

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
            Confirmed
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1 bg-sky-100 text-sky-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-600" />
            On Route / Active
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Completed
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 bg-rose-100 text-rose-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
            <AlertCircle className="w-3 h-3 text-amber-600" />
            Pending
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-20">
      {/* Top Admin Banner & Navigation */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Brand & Mode */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-700 text-white flex items-center justify-center font-extrabold shadow-sm">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-lg font-extrabold text-slate-900 tracking-tight">
                    A&M Carpet Cleaning & Painting Dispatch Hub
                  </h1>
                  <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded">
                    Admin Portal
                  </span>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-200">
                    {adminEmail}
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Manage cleaning & painting appointments, crew dispatch, & customer CRM
                </p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setIsPasswordModalOpen(true)}
                className="bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                title="Change Admin Password"
              >
                <KeyRound className="w-3.5 h-3.5 text-amber-700" />
                <span>Password</span>
              </button>

              <button
                onClick={() => setIsManualModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>New Booking</span>
              </button>

              <button
                onClick={() => setActiveTab('services')}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'services'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200'
                }`}
                title="Edit service prices & rates"
              >
                <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                <span>Edit Service Prices</span>
              </button>

              <button
                onClick={() => exportBookingsToCSV(bookings)}
                className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                title="Export all appointments to CSV"
              >
                <Download className="w-3.5 h-3.5 text-blue-600" />
                <span>Export CSV</span>
              </button>

              <button
                onClick={handleResetData}
                className="bg-white hover:bg-slate-100 text-slate-500 border border-slate-200 p-2 rounded-xl text-xs transition cursor-pointer"
                title="Reset to demo sample bookings"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {onLogout && (
                <button
                  onClick={onLogout}
                  className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                  title="Log out from Admin session"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out</span>
                </button>
              )}

              <button
                onClick={onExitDashboard}
                className="bg-slate-900 hover:bg-black text-white px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <span>Exit Dashboard</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Sub-tabs */}
          <div className="flex items-center gap-6 mt-4 pt-3 border-t border-slate-100 text-xs font-bold text-slate-500 overflow-x-auto">
            <button
              onClick={() => setActiveTab('calendar')}
              className={`pb-2 border-b-2 transition flex items-center gap-1.5 cursor-pointer shrink-0 ${
                activeTab === 'calendar'
                  ? 'text-blue-600 border-blue-600'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              <Calendar className="w-4 h-4 text-blue-600" />
              <span>Dispatch Calendar 📅 ({bookings.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('appointments')}
              className={`pb-2 border-b-2 transition flex items-center gap-1.5 cursor-pointer shrink-0 ${
                activeTab === 'appointments'
                  ? 'text-blue-600 border-blue-600'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>All Appointments List</span>
            </button>

            <button
              onClick={() => setActiveTab('customers')}
              className={`pb-2 border-b-2 transition flex items-center gap-1.5 cursor-pointer shrink-0 ${
                activeTab === 'customers'
                  ? 'text-blue-600 border-blue-600'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Customer CRM ({customersList.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('schedule')}
              className={`pb-2 border-b-2 transition flex items-center gap-1.5 cursor-pointer shrink-0 ${
                activeTab === 'schedule'
                  ? 'text-blue-600 border-blue-600'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              <Clock4 className="w-4 h-4" />
              <span>Truck Schedule & Capacity</span>
            </button>

            <button
              onClick={() => setActiveTab('gallery')}
              className={`pb-2 border-b-2 transition flex items-center gap-1.5 cursor-pointer shrink-0 ${
                activeTab === 'gallery'
                  ? 'text-blue-600 border-blue-600'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>Gallery Uploads</span>
            </button>

            <button
              onClick={() => setActiveTab('services')}
              className={`pb-2 border-b-2 transition flex items-center gap-1.5 cursor-pointer shrink-0 ${
                activeTab === 'services'
                  ? 'text-emerald-600 border-emerald-600 font-extrabold'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              <DollarSign className="w-4 h-4 text-emerald-600" />
              <span>Edit Service Prices & Rates 💵</span>
            </button>

            <button
              onClick={() => setActiveTab('states')}
              className={`pb-2 border-b-2 transition flex items-center gap-1.5 cursor-pointer shrink-0 ${
                activeTab === 'states'
                  ? 'text-blue-600 border-blue-600'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              <MapPinIcon className="w-4 h-4" />
              <span>States & Coverage</span>
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`pb-2 border-b-2 transition flex items-center gap-1.5 cursor-pointer shrink-0 ${
                activeTab === 'security'
                  ? 'text-blue-600 border-blue-600'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              <KeyRound className="w-4 h-4" />
              <span>Admin Security</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* KPI Metrics Summary Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Today's Jobs</span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-slate-900">{stats.todayCount} Jobs</div>
            <p className="text-[11px] text-slate-500 mt-1">
              {stats.inProgressCount > 0 ? `${stats.inProgressCount} in-progress on route` : 'All trucks scheduled'}
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Booked Revenue</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-slate-900">${stats.totalRevenue.toLocaleString()}</div>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1">
              Avg ${(stats.totalRevenue / Math.max(1, stats.totalCount)).toFixed(0)} per clean
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Action Needed</span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <AlertCircle className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-amber-700">{stats.pendingCount} Pending</div>
            <p className="text-[11px] text-slate-500 mt-1">Awaiting phone/online confirmation</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Total Completed</span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-slate-900">{stats.completedCount} Cleaned</div>
            <p className="text-[11px] text-slate-500 mt-1">100% 5-Star satisfaction rate</p>
          </div>
        </div>

        {/* TAB 0: DISPATCH CALENDAR & APPOINTMENT MANAGEMENT */}
        {activeTab === 'calendar' && (
          <div className="space-y-6">
            <AppointmentManagement
              bookings={bookings}
              onBookingsChange={onBookingsChange}
              onOpenNewBooking={() => setIsManualModalOpen(true)}
            />
          </div>
        )}

        {/* TAB 1: APPOINTMENTS VIEW */}
        {activeTab === 'appointments' && (
          <div className="space-y-4">
            {/* Filter and Search Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search customer, address, phone, or booking ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                {/* Status selector */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-slate-300 rounded-xl bg-white font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>

                {/* Date quick filter */}
                <div className="flex rounded-xl border border-slate-300 bg-slate-100 p-0.5">
                  <button
                    onClick={() => setDateFilter('all')}
                    className={`px-3 py-1 rounded-lg font-bold transition ${
                      dateFilter === 'all' ? 'bg-white shadow-xs text-blue-700' : 'text-slate-600'
                    }`}
                  >
                    All Dates
                  </button>
                  <button
                    onClick={() => setDateFilter('today')}
                    className={`px-3 py-1 rounded-lg font-bold transition ${
                      dateFilter === 'today' ? 'bg-white shadow-xs text-blue-700' : 'text-slate-600'
                    }`}
                  >
                    Today
                  </button>
                  <button
                    onClick={() => setDateFilter('tomorrow')}
                    className={`px-3 py-1 rounded-lg font-bold transition ${
                      dateFilter === 'tomorrow' ? 'bg-white shadow-xs text-blue-700' : 'text-slate-600'
                    }`}
                  >
                    Tomorrow
                  </button>
                  <button
                    onClick={() => setDateFilter('week')}
                    className={`px-3 py-1 rounded-lg font-bold transition ${
                      dateFilter === 'week' ? 'bg-white shadow-xs text-blue-700' : 'text-slate-600'
                    }`}
                  >
                    Next 7 Days
                  </button>
                </div>
              </div>
            </div>

            {/* Bookings Table */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
                    <tr>
                      <th className="py-3.5 px-4">Ref / Customer</th>
                      <th className="py-3.5 px-4">Date & Window</th>
                      <th className="py-3.5 px-4">Service & Scope</th>
                      <th className="py-3.5 px-4">Location</th>
                      <th className="py-3.5 px-4">Total</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Quick Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredBookings.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-slate-400">
                          <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                          No cleaning appointments match your filters.
                        </td>
                      </tr>
                    ) : (
                      filteredBookings.map((b) => (
                        <tr
                          key={b.id}
                          onClick={() => setSelectedBooking(b)}
                          className="hover:bg-blue-50/50 cursor-pointer transition"
                        >
                          {/* ID & Customer */}
                          <td className="py-3 px-4">
                            <span className="font-mono font-bold text-blue-700 block text-[11px]">
                              {b.id}
                            </span>
                            <div className="font-bold text-slate-900 text-sm">{b.customerName}</div>
                            <div className="text-[11px] text-slate-500 flex items-center gap-1">
                              <Phone className="w-3 h-3 text-slate-400" />
                              {b.phone}
                            </div>
                          </td>

                          {/* Date & Slot */}
                          <td className="py-3 px-4 whitespace-nowrap">
                            <div className="font-bold text-slate-800 flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-blue-600" />
                              {b.date}
                            </div>
                            <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                              <Clock className="w-3 h-3 text-slate-400" />
                              {b.timeSlot}
                            </div>
                          </td>

                          {/* Services */}
                          <td className="py-3 px-4 max-w-xs">
                            <div className="font-semibold text-slate-800 line-clamp-1">
                              {b.services.map((s) => `${s.quantity}x ${s.name}`).join(', ')}
                            </div>
                            {b.addOns.length > 0 && (
                              <div className="text-[11px] text-blue-600 font-medium">
                                + {b.addOns.map((a) => a.name).join(', ')}
                              </div>
                            )}
                          </td>

                          {/* Location */}
                          <td className="py-3 px-4">
                            <div className="font-medium text-slate-700">
                              {b.streetAddress} {b.aptUnit || ''}
                            </div>
                            <div className="text-[11px] text-slate-500">
                              {b.city}, {b.state} {b.zipCode}
                            </div>
                          </td>

                          {/* Total */}
                          <td className="py-3 px-4 whitespace-nowrap">
                            <div className="font-extrabold text-slate-900 text-sm">${b.totalPrice}</div>
                            <div className="flex items-center gap-1 mt-0.5">
                              <span
                                className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${
                                  b.paymentStatus === 'paid_full'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : b.paymentStatus === 'paid_deposit'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-amber-100 text-amber-800'
                                }`}
                              >
                                {b.paymentStatus === 'paid_full'
                                  ? 'Paid Full'
                                  : b.paymentStatus === 'paid_deposit'
                                  ? `Deposit $${b.depositPaid || 50}`
                                  : 'Unpaid'}
                              </span>
                              {b.paymentMethod && (
                                <span className="text-[10px] font-medium text-slate-500">
                                  {b.paymentMethod === 'apple_pay'
                                    ? 'Pay'
                                    : b.paymentMethod === 'google_pay'
                                    ? 'GPay'
                                    : b.paymentMethod === 'card'
                                    ? 'Card'
                                    : b.paymentMethod}
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Status */}
                          <td className="py-3 px-4 whitespace-nowrap">
                            {getStatusBadge(b.status)}
                          </td>

                          {/* Quick Actions dropdown */}
                          <td className="py-3 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-end gap-1">
                              {b.status === 'pending' && (
                                <>
                                  <button
                                    onClick={(e) => handleAcceptQuick(b.id, e)}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1 rounded-lg text-[11px] font-bold transition shadow-xs flex items-center gap-1 cursor-pointer"
                                    title="Accept and confirm booking"
                                  >
                                    <Check className="w-3 h-3" />
                                    <span>Accept</span>
                                  </button>
                                  <button
                                    onClick={(e) => handleOpenDenyModal(b, e)}
                                    className="bg-rose-600 hover:bg-rose-700 text-white px-2 py-1 rounded-lg text-[11px] font-bold transition shadow-xs flex items-center gap-1 cursor-pointer"
                                    title="Deny customer booking"
                                  >
                                    <Ban className="w-3 h-3" />
                                    <span>Deny</span>
                                  </button>
                                </>
                              )}
                              {b.status === 'confirmed' && (
                                <button
                                  onClick={(e) => handleQuickStatusChange(b.id, 'in_progress', e)}
                                  className="bg-sky-600 hover:bg-sky-700 text-white px-2.5 py-1 rounded-lg text-[11px] font-bold transition shadow-2xs"
                                >
                                  Dispatch Truck
                                </button>
                              )}
                              {b.status === 'in_progress' && (
                                <button
                                  onClick={(e) => handleQuickStatusChange(b.id, 'completed', e)}
                                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1 rounded-lg text-[11px] font-bold transition shadow-2xs"
                                >
                                  Mark Done
                                </button>
                              )}
                              <button
                                onClick={() => setReceiptBooking(b)}
                                className="bg-blue-50 hover:bg-blue-100 text-blue-700 p-1.5 rounded-lg transition text-xs"
                                title="Print / View Receipt"
                              >
                                <Printer className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setSelectedBooking(b)}
                                className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-1.5 rounded-lg transition text-xs"
                                title="Open Full Work Order"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CUSTOMER DIRECTORY (CRM) */}
        {activeTab === 'customers' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs flex justify-between items-center">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Customer Database & Booking History</h3>
                <p className="text-xs text-slate-500">Secure directory of residential and commercial cleaning clients</p>
              </div>
              <span className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full">
                {customersList.length} Total Registered Customers
              </span>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
                    <tr>
                      <th className="py-3 px-4">Customer Name</th>
                      <th className="py-3 px-4">Phone / Email</th>
                      <th className="py-3 px-4">City / Area</th>
                      <th className="py-3 px-4">Total Bookings</th>
                      <th className="py-3 px-4">Lifetime Spend</th>
                      <th className="py-3 px-4">Last Appointment</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {customersList.map((c, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="py-3 px-4 font-bold text-slate-900 text-sm">
                          {c.name}
                        </td>
                        <td className="py-3 px-4">
                          <a href={`tel:${c.phone}`} className="text-blue-600 hover:underline font-semibold block">
                            {c.phone}
                          </a>
                          <span className="text-[11px] text-slate-400">{c.email}</span>
                        </td>
                        <td className="py-3 px-4 font-medium text-slate-700">
                          {c.city}, {c.state}
                        </td>
                        <td className="py-3 px-4">
                          <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-bold">
                            {c.totalBookings} clean{c.totalBookings > 1 ? 's' : ''}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-extrabold text-slate-900">
                          ${c.totalSpent}
                        </td>
                        <td className="py-3 px-4 text-slate-600 font-medium">
                          {c.lastDate}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => {
                              const match = bookings.find((b) => b.id === c.latestId);
                              if (match) setSelectedBooking(match);
                            }}
                            className="text-xs bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 px-3 py-1.5 rounded-lg font-bold transition cursor-pointer"
                          >
                            View Job
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: TRUCK SCHEDULE & CAPACITY */}
        {activeTab === 'schedule' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
              <h3 className="font-bold text-slate-900 text-base mb-1">Truck Route Capacity & Daily Schedule</h3>
              <p className="text-xs text-slate-500 mb-4">
                Monitor team workloads across morning, midday, and afternoon arrival slots.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
                {[
                  { time: '08:00 AM - 11:00 AM', label: 'Morning Slot', max: 3 },
                  { time: '11:30 AM - 02:30 PM', label: 'Midday Slot', max: 3 },
                  { time: '03:00 PM - 06:00 PM', label: 'Afternoon Slot', max: 3 },
                  { time: '06:00 PM - 08:30 PM', label: 'Evening Slot', max: 2 }
                ].map((slot, i) => {
                  const jobsInSlot = bookings.filter(
                    (b) => b.date === todayStr && b.timeSlot === slot.time && b.status !== 'cancelled'
                  );
                  const isFull = jobsInSlot.length >= slot.max;
                  return (
                    <div
                      key={i}
                      className={`p-4 rounded-2xl border ${
                        isFull
                          ? 'bg-amber-50/70 border-amber-300'
                          : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-xs text-slate-900">{slot.label}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isFull
                              ? 'bg-amber-200 text-amber-900'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {jobsInSlot.length} / {slot.max} Booked
                        </span>
                      </div>
                      <div className="text-xs font-extrabold text-blue-700 mb-3">{slot.time}</div>

                      {/* Jobs in this slot */}
                      <div className="space-y-2">
                        {jobsInSlot.length === 0 ? (
                          <div className="text-[11px] text-slate-400 italic py-2">
                            Slot open for dispatch
                          </div>
                        ) : (
                          jobsInSlot.map((j) => (
                            <div
                              key={j.id}
                              onClick={() => setSelectedBooking(j)}
                              className="bg-white p-2.5 rounded-xl border border-slate-200 hover:border-blue-300 cursor-pointer shadow-2xs text-left"
                            >
                              <div className="font-bold text-slate-900 text-xs">{j.customerName}</div>
                              <div className="text-[11px] text-slate-500 truncate">{j.streetAddress}</div>
                              <div className="mt-1 flex items-center justify-between text-[10px]">
                                <span className="font-bold text-blue-600">${j.totalPrice}</span>
                                <span className="text-slate-400">{j.technician || 'Crew 1'}</span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
        {/* TAB 4: GALLERY MANAGER */}
        {activeTab === 'gallery' && <AdminGalleryManager />}

        {/* TAB 5: SERVICES CATALOG */}
        {activeTab === 'services' && <AdminServicesManager />}

        {/* TAB 6: COVERAGE STATES & METROS */}
        {activeTab === 'states' && <AdminStatesManager />}

        {/* TAB 7: ADMIN SECURITY & CREDENTIALS */}
        {activeTab === 'security' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold shadow-xs">
                  <KeyRound className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Admin Security & Authentication</h2>
                  <p className="text-xs text-slate-500">
                    Manage the admin portal credential and change session password
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-6 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-600">Admin Account Email:</span>
                  <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {adminEmail}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-600">Password Status:</span>
                  <span className="font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                    Active & Encrypted (Local Storage)
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-600">Default Recovery Password:</span>
                  <span className="font-mono text-slate-500">adams@268#</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(true)}
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-6 py-3 rounded-xl transition shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>Change Admin Password Now</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <JobDetailsModal
        booking={selectedBooking}
        onClose={() => setSelectedBooking(null)}
        onBookingUpdated={handleBookingUpdated}
        onBookingDeleted={handleBookingDeleted}
      />

      <ManualBookingModal
        isOpen={isManualModalOpen}
        onClose={() => setIsManualModalOpen(false)}
        onBookingAdded={handleManualBookingAdded}
      />

      <PaymentReceiptModal
        booking={receiptBooking}
        isOpen={Boolean(receiptBooking)}
        onClose={() => setReceiptBooking(null)}
      />

      {/* Admin Password Change Modal */}
      <AdminPasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />

      {/* Deny Booking Modal */}
      <DenyBookingModal
        booking={bookingForDeny}
        isOpen={Boolean(bookingForDeny)}
        onClose={() => setBookingForDeny(null)}
        onConfirmDenial={handleConfirmDenial}
      />
    </div>
  );
}
