import { useState } from 'react';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  User,
  ShieldCheck,
  AlertTriangle,
  Car,
  FileText,
  Printer,
  CheckCircle2,
  Edit2,
  Trash2,
  Check,
  Ban
} from 'lucide-react';
import { Booking, BookingStatus } from '../types';
import { updateBooking, deleteBooking, acceptBooking, denyBooking } from '../utils/bookingStorage';
import DenyBookingModal from './DenyBookingModal';

interface JobDetailsModalProps {
  booking: Booking | null;
  isOpen?: boolean;
  onClose: () => void;
  onBookingUpdated?: (updated: Booking) => void;
  onUpdateBooking?: (updated: Booking) => void;
  onBookingDeleted?: (id: string) => void;
  onDeleteBooking?: (id: string) => void;
}

export function JobDetailsModal({
  booking,
  isOpen = true,
  onClose,
  onBookingUpdated,
  onUpdateBooking,
  onBookingDeleted,
  onDeleteBooking
}: JobDetailsModalProps) {
  if (!isOpen || !booking) return null;

  const notifyUpdated = (updated: Booking) => {
    if (onUpdateBooking) onUpdateBooking(updated);
    if (onBookingUpdated) onBookingUpdated(updated);
  };

  const notifyDeleted = (id: string) => {
    if (onDeleteBooking) onDeleteBooking(id);
    if (onBookingDeleted) onBookingDeleted(id);
  };

  const [staffNotes, setStaffNotes] = useState(booking.staffNotes || '');
  const [technician, setTechnician] = useState(booking.technician || 'Dave & Crew 1 (Truck #3)');
  const [status, setStatus] = useState<BookingStatus>(booking.status);
  const [paymentStatus, setPaymentStatus] = useState(booking.paymentStatus);
  const [isSavedNotice, setIsSavedNotice] = useState(false);
  const [noticeMessage, setNoticeMessage] = useState('Job changes successfully saved!');
  const [isDenyModalOpen, setIsDenyModalOpen] = useState(false);

  const handleSave = () => {
    const updated = updateBooking(booking.id, {
      staffNotes,
      technician,
      status,
      paymentStatus
    });
    if (updated) {
      notifyUpdated(updated);
      setNoticeMessage('Job changes successfully saved!');
      setIsSavedNotice(true);
      setTimeout(() => setIsSavedNotice(false), 2500);
    }
  };

  const handleQuickAccept = () => {
    const updated = acceptBooking(booking.id);
    if (updated) {
      setStatus('confirmed');
      notifyUpdated(updated);
      setNoticeMessage(`Booking ${booking.id} ACCEPTED and confirmed!`);
      setIsSavedNotice(true);
      setTimeout(() => setIsSavedNotice(false), 3000);
    }
  };

  const handleConfirmDenial = (reason: string) => {
    const updated = denyBooking(booking.id, reason);
    if (updated) {
      setStatus('cancelled');
      notifyUpdated(updated);
      setNoticeMessage(`Booking ${booking.id} DENIED: "${reason}"`);
      setIsSavedNotice(true);
      setTimeout(() => setIsSavedNotice(false), 3500);
    }
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete appointment ${booking.id}?`)) {
      deleteBooking(booking.id);
      notifyDeleted(booking.id);
      onClose();
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden relative flex flex-col my-auto max-h-[92vh]">
        {/* Header */}
        <div className="p-5 sm:px-8 border-b border-slate-100 flex justify-between items-center bg-blue-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900">Job Work Order</h3>
                <span className="font-mono text-xs font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                  {booking.id}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Booked on {new Date(booking.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition text-xs font-semibold flex items-center gap-1 cursor-pointer"
              title="Print Work Order"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Print</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 text-sm">
          {isSavedNotice && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{noticeMessage}</span>
            </div>
          )}

          {/* Quick Decision Action Banner for Admin */}
          <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs transition ${
            status === 'pending'
              ? 'bg-amber-50/80 border-amber-300'
              : status === 'confirmed'
              ? 'bg-blue-50/80 border-blue-200'
              : status === 'cancelled'
              ? 'bg-rose-50/80 border-rose-200'
              : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center gap-2.5">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold ${
                status === 'pending'
                  ? 'bg-amber-500 text-white'
                  : status === 'confirmed'
                  ? 'bg-blue-600 text-white'
                  : status === 'cancelled'
                  ? 'bg-rose-600 text-white'
                  : 'bg-emerald-600 text-white'
              }`}>
                {status === 'pending' && <AlertTriangle className="w-5 h-5" />}
                {status === 'confirmed' && <CheckCircle2 className="w-5 h-5" />}
                {status === 'cancelled' && <Ban className="w-5 h-5" />}
                {status === 'in_progress' && <Car className="w-5 h-5" />}
                {status === 'completed' && <Check className="w-5 h-5" />}
              </div>
              <div>
                <div className="font-bold text-xs uppercase tracking-wider text-slate-800">
                  {status === 'pending'
                    ? 'Pending Dispatch Approval'
                    : status === 'confirmed'
                    ? 'Booking Confirmed & Dispatched'
                    : status === 'cancelled'
                    ? 'Booking Denied / Cancelled'
                    : `Status: ${status.replace('_', ' ').toUpperCase()}`}
                </div>
                <p className="text-[11px] text-slate-500">
                  {status === 'pending'
                    ? 'Customer is waiting for schedule confirmation or denial.'
                    : status === 'cancelled'
                    ? 'This job is rejected or cancelled. Reason noted in audit trail.'
                    : 'Technician route & equipment prepared.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {status !== 'confirmed' && (
                <button
                  type="button"
                  onClick={handleQuickAccept}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Accept Booking</span>
                </button>
              )}

              {status !== 'cancelled' && (
                <button
                  type="button"
                  onClick={() => setIsDenyModalOpen(true)}
                  className="bg-rose-600 hover:bg-rose-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Ban className="w-4 h-4" />
                  <span>Deny Booking</span>
                </button>
              )}
            </div>
          </div>

          {/* Top Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div>
              <div className="text-[11px] text-slate-400 uppercase font-bold tracking-wider mb-1">Customer</div>
              <div className="font-bold text-slate-900 text-base flex items-center gap-1.5">
                <User className="w-4 h-4 text-blue-600" />
                {booking.customerName}
              </div>
              <div className="flex flex-col gap-1 mt-2 text-xs">
                <a
                  href={`tel:${booking.phone}`}
                  className="text-blue-600 hover:underline flex items-center gap-1.5 font-semibold"
                >
                  <Phone className="w-3.5 h-3.5" />
                  {booking.phone}
                </a>
                <a
                  href={`mailto:${booking.email}`}
                  className="text-slate-600 hover:text-blue-600 flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5" />
                  {booking.email}
                </a>
              </div>
            </div>

            <div>
              <div className="text-[11px] text-slate-400 uppercase font-bold tracking-wider mb-1">Location & Arrival</div>
              <div className="flex items-start gap-1.5 text-xs font-semibold text-slate-800">
                <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>
                  {booking.streetAddress} {booking.aptUnit || ''}
                  <br />
                  {booking.city}, {booking.state} {booking.zipCode}
                </span>
              </div>
              <div className="mt-2 text-xs font-bold text-blue-900 bg-blue-100/70 p-1.5 rounded-lg flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                <span>{booking.date} • {booking.timeSlot}</span>
              </div>
            </div>
          </div>

          {/* Services & Add-ons List */}
          <div>
            <div className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Itemized Services</div>
            <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 text-xs">
              {booking.services.map((item, idx) => (
                <div key={idx} className="p-3 flex justify-between items-center bg-white">
                  <div>
                    <span className="font-bold text-slate-800">{item.name}</span>
                    <span className="text-slate-500 ml-2">Qty: {item.quantity} × ${item.unitPrice}</span>
                  </div>
                  <span className="font-extrabold text-slate-900">${item.total}</span>
                </div>
              ))}

              {booking.addOns.map((add, idx) => (
                <div key={`addon-${idx}`} className="p-3 flex justify-between items-center bg-blue-50/40">
                  <div className="flex items-center gap-1.5 text-blue-900 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                    <span>Add-on: {add.name}</span>
                  </div>
                  <span className="font-bold text-blue-700">+${add.price}</span>
                </div>
              ))}

              {booking.discount > 0 && (
                <div className="p-2.5 flex justify-between items-center bg-emerald-50 text-emerald-800 font-semibold">
                  <span>Multi-Room Volume Discount</span>
                  <span>-${booking.discount}</span>
                </div>
              )}

              <div className="p-3 flex justify-between items-center bg-slate-100 font-extrabold text-sm text-slate-900">
                <span>Total Amount</span>
                <span className="text-blue-700 text-base">${booking.totalPrice}</span>
              </div>
            </div>
          </div>

          {/* Access & Stain Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 font-semibold block mb-1">Property & Parking</span>
              <div className="font-bold text-slate-800 capitalize">
                {booking.propertyType.replace('_', ' ')} • {booking.parkingAccess} parking
              </div>
              {booking.hasPets && (
                <div className="mt-2 text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-200 flex items-start gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <span>Pet Alert: {booking.petDetails || 'Pets present in home'}</span>
                </div>
              )}
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 font-semibold block mb-1">Customer Special Instructions</span>
              <p className="text-slate-700 italic">
                {booking.customerNotes ? `"${booking.customerNotes}"` : 'No customer notes provided.'}
              </p>
            </div>
          </div>

          {/* Operational Controls: Status, Tech & Staff Notes */}
          <div className="pt-4 border-t border-slate-200 space-y-4">
            <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Staff Job Dispatch & Notes
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Job Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as BookingStatus)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-xs bg-white focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                >
                  <option value="pending">Pending Review</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="in_progress">In Progress / On Route</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Assigned Technician</label>
                <input
                  type="text"
                  value={technician}
                  onChange={(e) => setTechnician(e.target.value)}
                  placeholder="e.g. Dave & Crew 1"
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Payment Status</label>
                <select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value as any)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-xs bg-white focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                >
                  <option value="unpaid">Unpaid (Due on site)</option>
                  <option value="paid_deposit">Deposit Paid ($50)</option>
                  <option value="paid_full">Paid in Full</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Internal Staff Notes</label>
              <textarea
                rows={2}
                value={staffNotes}
                onChange={(e) => setStaffNotes(e.target.value)}
                placeholder="Gate codes, technician equipment reminders, special fiber care..."
                className="w-full p-2.5 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:px-8 border-t border-slate-100 bg-slate-50 flex justify-between items-center">
          <button
            type="button"
            onClick={handleDelete}
            className="text-rose-600 hover:text-rose-700 text-xs font-bold flex items-center gap-1 transition cursor-pointer"
          >
            <Trash2 className="w-4 h-4" /> Delete Job
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition cursor-pointer"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>

      {/* Booking Denial Modal */}
      <DenyBookingModal
        booking={booking}
        isOpen={isDenyModalOpen}
        onClose={() => setIsDenyModalOpen(false)}
        onConfirmDenial={handleConfirmDenial}
      />
    </div>
  );
}

export default JobDetailsModal;
