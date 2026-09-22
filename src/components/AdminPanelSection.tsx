import { useState } from 'react';
import {
  Shield,
  LayoutDashboard,
  Calendar,
  Clock,
  MapPin,
  Phone,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Download,
  Plus,
  RotateCcw,
  Sparkles,
  Truck,
  Users,
  LogOut,
  UserCheck,
  Check,
  Ban,
  KeyRound,
  DollarSign,
  Tag
} from 'lucide-react';
import { Booking, BookingStatus } from '../types';
import {
  exportBookingsToCSV,
  resetDemoBookings,
  updateBookingStatus,
  getStoredBookings,
  acceptBooking,
  denyBooking
} from '../utils/bookingStorage';
import { AppointmentManagement } from './AppointmentManagement';
import AdminServicesManager from './AdminServicesManager';

interface AdminPanelSectionProps {
  bookings: Booking[];
  onBookingsChange: (updated: Booking[]) => void;
  onLaunchFullAdmin: () => void;
  onOpenManualBooking: () => void;
  onLogout?: () => void;
  adminEmail?: string;
}

export default function AdminPanelSection({
  bookings,
  onBookingsChange,
  onLaunchFullAdmin,
  onOpenManualBooking,
  onLogout,
  adminEmail = 'adminProClean@gmail.com'
}: AdminPanelSectionProps) {
  const [activeSectionTab, setActiveSectionTab] = useState<'calendar' | 'stream' | 'pricing'>('calendar');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Quick stats
  const totalRevenue = bookings.reduce((sum, b) => (b.status !== 'cancelled' ? sum + b.totalPrice : sum), 0);
  const pendingCount = bookings.filter((b) => b.status === 'pending').length;
  const confirmedCount = bookings.filter((b) => b.status === 'confirmed').length;
  const inProgressCount = bookings.filter((b) => b.status === 'in_progress').length;

  // Handle Accept / Deny
  const handleAccept = (bookingId: string) => {
    const res = acceptBooking(bookingId);
    if (res) {
      onBookingsChange(getStoredBookings());
    }
  };

  const handleDeny = (bookingId: string) => {
    const reason = prompt('Please enter reason for denying this booking (optional):', 'Schedule capacity reached') || 'Unavailable';
    const res = denyBooking(bookingId, reason);
    if (res) {
      onBookingsChange(getStoredBookings());
    }
  };

  // Handle quick status change directly from this section
  const handleQuickStatusChange = (bookingId: string, newStatus: BookingStatus) => {
    updateBookingStatus(bookingId, newStatus);
    const updated = getStoredBookings();
    onBookingsChange(updated);
  };

  // Handle reset
  const handleReset = () => {
    if (confirm('Reset demo bookings to default state?')) {
      const reset = resetDemoBookings();
      onBookingsChange(reset);
    }
  };

  return (
    <section id="admin" className="py-18 bg-slate-900 text-slate-100 scroll-mt-20 border-t border-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Micro-Badge */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <div className="inline-flex items-center gap-1.5 text-sky-400 font-bold text-xs uppercase tracking-wider bg-blue-950/80 px-3.5 py-1.5 rounded-full border border-blue-800/60">
                <Shield className="w-3.5 h-3.5" />
                <span>Internal Operations &bull; Admin Panel</span>
              </div>
              <div className="inline-flex items-center gap-1.5 text-emerald-400 font-bold text-xs bg-emerald-950/60 px-3 py-1.5 rounded-full border border-emerald-800/60">
                <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Authenticated: <span className="font-mono text-emerald-300 font-semibold">{adminEmail}</span></span>
              </div>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Staff Dispatch & Management Console
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Internal panel for route coordinators and technicians to manage incoming work orders.
            </p>
          </div>

          {/* Launch Fullscreen Admin Action & Logout */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={onLaunchFullAdmin}
              className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl font-bold text-xs transition shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Launch Fullscreen Dashboard</span>
              <ExternalLink className="w-3.5 h-3.5 text-blue-200" />
            </button>

            <button
              onClick={() => setActiveSectionTab('pricing')}
              className={`border px-3.5 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-1.5 cursor-pointer ${
                activeSectionTab === 'pricing'
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-md'
                  : 'bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 hover:text-emerald-100 border-emerald-800/80'
              }`}
              title="Edit service prices & rates directly"
            >
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              <span>Edit Service Prices</span>
            </button>

            <button
              onClick={onOpenManualBooking}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3.5 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-sky-400" />
              <span>Phone Dispatch Booking</span>
            </button>

            <button
              onClick={() => exportBookingsToCSV(bookings)}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
              title="Download CSV report"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>

            <button
              onClick={handleReset}
              className="bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border border-slate-700 p-2.5 rounded-xl text-xs transition cursor-pointer"
              title="Reset demo data"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {onLogout && (
              <button
                onClick={onLogout}
                className="bg-rose-950/80 hover:bg-rose-900 text-rose-300 hover:text-rose-100 border border-rose-800/80 px-3 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
                title="Log out of Admin Portal"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            )}
          </div>
        </div>

        {/* Real-time KPI Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-4">
            <div className="text-slate-400 text-xs font-medium flex items-center justify-between">
              <span>Total Active Jobs</span>
              <Users className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl font-black text-white mt-1">{bookings.length}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Stored in local database</div>
          </div>

          <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-4">
            <div className="text-slate-400 text-xs font-medium flex items-center justify-between">
              <span>Pending Review</span>
              <AlertCircle className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-amber-400 mt-1">{pendingCount}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Needs staff confirmation</div>
          </div>

          <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-4">
            <div className="text-slate-400 text-xs font-medium flex items-center justify-between">
              <span>Confirmed & En Route</span>
              <Truck className="w-4 h-4 text-sky-400" />
            </div>
            <div className="text-2xl font-black text-sky-400 mt-1">{confirmedCount + inProgressCount}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Active technician vans</div>
          </div>

          <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-4">
            <div className="text-slate-400 text-xs font-medium flex items-center justify-between">
              <span>Dispatched Revenue</span>
              <Sparkles className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-emerald-400 mt-1">${totalRevenue}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Total booked gross</div>
          </div>
        </div>

        {/* Sub-tab Navigation */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-6">
          <button
            onClick={() => setActiveSectionTab('calendar')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition flex items-center gap-2 cursor-pointer ${
              activeSectionTab === 'calendar'
                ? 'bg-blue-600 text-white shadow-lg ring-2 ring-blue-400/30'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <Calendar className="w-4 h-4 text-sky-300" />
            <span>Dispatch Calendar 📅 ({bookings.length})</span>
          </button>

          <button
            onClick={() => setActiveSectionTab('stream')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition flex items-center gap-2 cursor-pointer ${
              activeSectionTab === 'stream'
                ? 'bg-blue-600 text-white shadow-lg ring-2 ring-blue-400/30'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <Clock className="w-4 h-4 text-sky-300" />
            <span>Recent Work Orders Stream</span>
          </button>

          <button
            onClick={() => setActiveSectionTab('pricing')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition flex items-center gap-2 cursor-pointer ${
              activeSectionTab === 'pricing'
                ? 'bg-emerald-600 text-white shadow-lg ring-2 ring-emerald-400/30'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span>Edit Service Prices & Rates 💵</span>
          </button>
        </div>

        {/* TAB 1: CALENDAR VIEW */}
        {activeSectionTab === 'calendar' && (
          <div className="bg-white rounded-3xl p-4 sm:p-6 text-slate-800 shadow-2xl border border-slate-700/60">
            <AppointmentManagement
              bookings={bookings}
              onBookingsChange={onBookingsChange}
              onOpenNewBooking={onOpenManualBooking}
            />
          </div>
        )}

        {/* TAB 2: Quick Work Order Dispatch Table */}
        {activeSectionTab === 'stream' && (
          <div className="bg-slate-800/95 border border-slate-700/80 rounded-3xl overflow-hidden shadow-xl">
            <div className="p-4 sm:p-5 border-b border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <span>Recent Work Orders</span>
                  <span className="bg-blue-900 text-sky-300 text-[11px] px-2 py-0.5 rounded-full font-semibold">
                    Live Dispatch Stream
                  </span>
                </h3>
              </div>
              <span className="text-xs text-slate-400">
                Change status instantly using the dropdown on any row
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/60 text-slate-400 font-semibold border-b border-slate-700 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Order ID</th>
                    <th className="py-3 px-4">Customer & Phone</th>
                    <th className="py-3 px-4">Service & Slot</th>
                    <th className="py-3 px-4">Location / ZIP</th>
                    <th className="py-3 px-4">Price</th>
                    <th className="py-3 px-4">Live Status Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/60 text-slate-300 font-medium">
                  {bookings.slice(0, 5).map((b) => (
                    <tr key={b.id} className="hover:bg-slate-700/30 transition">
                      <td className="py-3.5 px-4 font-mono font-bold text-sky-400">
                        {b.id}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white">{b.customerName}</div>
                        <div className="text-slate-400 text-[11px] flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3 text-slate-500" />
                          <span>{b.phone}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="text-white truncate max-w-[170px]">
                          {b.services[0]?.name || 'Cleaning Package'}
                          {b.services.length > 1 && ` +${b.services.length - 1}`}
                        </div>
                        <div className="text-slate-400 text-[11px] flex items-center gap-1 mt-0.5">
                          <Calendar className="w-3 h-3 text-slate-500" />
                          <span>{b.date} &bull; {b.timeSlot.split('-')[0]}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="text-slate-200">{b.city}, {b.state}</div>
                        <div className="text-slate-400 text-[11px] font-mono">{b.zipCode}</div>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-emerald-400 text-sm">
                        ${b.totalPrice}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          {b.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleAccept(b.id)}
                                className="bg-emerald-600 hover:bg-emerald-500 text-white px-2 py-1 rounded-lg text-xs font-bold transition shadow-xs flex items-center gap-1 cursor-pointer"
                                title="Accept & Confirm Booking"
                              >
                                <Check className="w-3 h-3" />
                                <span>Accept</span>
                              </button>
                              <button
                                onClick={() => handleDeny(b.id)}
                                className="bg-rose-600 hover:bg-rose-500 text-white px-2 py-1 rounded-lg text-xs font-bold transition shadow-xs flex items-center gap-1 cursor-pointer"
                                title="Deny Booking"
                              >
                                <Ban className="w-3 h-3" />
                                <span>Deny</span>
                              </button>
                            </>
                          )}
                          <select
                            value={b.status}
                            onChange={(e) => handleQuickStatusChange(b.id, e.target.value as BookingStatus)}
                            className={`text-xs font-bold rounded-lg px-2.5 py-1.5 border cursor-pointer focus:outline-none transition ${
                              b.status === 'confirmed'
                                ? 'bg-blue-900/60 text-blue-200 border-blue-700'
                                : b.status === 'in_progress'
                                ? 'bg-purple-900/60 text-purple-200 border-purple-700'
                                : b.status === 'completed'
                                ? 'bg-emerald-900/60 text-emerald-200 border-emerald-700'
                                : b.status === 'cancelled'
                                ? 'bg-red-900/60 text-red-200 border-red-700'
                                : 'bg-amber-900/60 text-amber-200 border-amber-700'
                            }`}
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-slate-900/50 border-t border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <span className="text-slate-400">
                Showing latest {Math.min(5, bookings.length)} of {bookings.length} work orders in storage
              </span>
              <button
                onClick={onLaunchFullAdmin}
                className="text-sky-400 hover:text-sky-300 font-bold flex items-center gap-1 cursor-pointer"
              >
                <span>Open Complete Dispatch Schedule & Technician Assignment</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: EDIT SERVICE PRICES & RATES */}
        {activeSectionTab === 'pricing' && (
          <div className="bg-white rounded-3xl p-4 sm:p-6 text-slate-800 shadow-2xl border border-slate-700/60">
            <AdminServicesManager />
          </div>
        )}
      </div>
    </section>
  );
}
