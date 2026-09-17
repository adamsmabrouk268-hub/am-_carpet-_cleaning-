import { useState, useMemo, FormEvent } from 'react';
import {
  X,
  Phone,
  Mail,
  MessageSquare,
  Clock,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  DollarSign,
  Copy,
  Check,
  User,
  MapPin,
  FileText,
  CreditCard,
  Banknote,
  Send,
  RotateCcw,
  MessageCircle
} from 'lucide-react';
import { Booking, AppointmentNote, PaymentRecord } from '../types';
import { BUSINESS_OWNER_CONTACT } from '../utils/contactConfig';

// ==========================================
// 1. RESCHEDULE MODAL
// ==========================================
interface RescheduleModalProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmReschedule: (
    bookingId: string,
    newDate: string,
    newTimeSlot: string,
    newExactTime?: string,
    note?: string
  ) => void;
}

export function RescheduleModal({
  booking,
  isOpen,
  onClose,
  onConfirmReschedule
}: RescheduleModalProps) {
  if (!isOpen || !booking) return null;

  const [newDate, setNewDate] = useState(booking.date);
  const [exactTime, setExactTime] = useState(booking.exactTime || '07:30 AM');
  const [timeSlot, setTimeSlot] = useState(booking.timeSlot || '08:00 AM - 11:00 AM');
  const [rescheduleNote, setRescheduleNote] = useState('');

  const quickTimes = [
    { label: '07:30 AM', slot: '07:30 AM - 09:30 AM' },
    { label: '09:50 AM', slot: '09:50 AM - 11:50 AM' },
    { label: '11:30 AM', slot: '11:30 AM - 02:00 PM' },
    { label: '01:15 PM', slot: '01:15 PM - 03:45 PM' },
    { label: '03:00 PM', slot: '03:00 PM - 05:30 PM' },
    { label: '05:15 PM', slot: '05:15 PM - 07:30 PM' }
  ];

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!newDate) return;
    onConfirmReschedule(booking.id, newDate, timeSlot, exactTime, rescheduleNote);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden relative flex flex-col my-auto">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-blue-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Reschedule Appointment</h3>
              <p className="text-xs text-slate-500">
                {booking.customerName} &bull; {booking.id}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Current schedule banner */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Current Booking
            </span>
            <div className="font-semibold text-slate-800 flex items-center gap-2">
              <span>{booking.date}</span>
              <span>&bull;</span>
              <span className="text-blue-600 font-bold">{booking.exactTime || booking.timeSlot}</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Services: {booking.services.map((s) => s.name).join(', ')}
            </div>
          </div>

          {/* New Date picker */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Select New Date</label>
            <input
              type="date"
              required
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-xl font-semibold text-slate-800 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Time Picker & Quick slots */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Arrival Time</label>
            <div className="grid grid-cols-3 gap-2 mb-2">
              {quickTimes.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => {
                    setExactTime(item.label);
                    setTimeSlot(item.slot);
                  }}
                  className={`py-2 px-2.5 rounded-xl font-bold border transition text-center cursor-pointer ${
                    exactTime === item.label
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Or custom time (e.g. 07:30 AM)"
                value={exactTime}
                onChange={(e) => setExactTime(e.target.value)}
                className="flex-1 p-2.5 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <input
                type="text"
                placeholder="Window (e.g. 07:30 AM - 09:30 AM)"
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                className="flex-1 p-2.5 border border-slate-300 rounded-xl text-xs text-slate-600 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Reschedule Note */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Rescheduling Reason / Note (Optional)</label>
            <textarea
              rows={2}
              value={rescheduleNote}
              onChange={(e) => setRescheduleNote(e.target.value)}
              placeholder="e.g. Customer requested move from Monday 7:30 AM to afternoon due to work meeting..."
              className="w-full p-2.5 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl font-bold transition shadow-xs cursor-pointer"
            >
              Confirm Reschedule
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ==========================================
// 2. CANCEL APPOINTMENT MODAL
// ==========================================
interface CancelModalProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmCancel: (bookingId: string, reason: string) => void;
}

export function CancelModal({
  booking,
  isOpen,
  onClose,
  onConfirmCancel
}: CancelModalProps) {
  if (!isOpen || !booking) return null;

  const [reason, setReason] = useState('Customer requested schedule cancellation');
  const [customReason, setCustomReason] = useState('');

  const reasonsList = [
    'Customer requested schedule cancellation',
    'Customer rescheduled with independent contractor',
    'Customer unavailable / missed appointment call',
    'Inclement weather / severe rain forecast',
    'Equipment maintenance / van breakdown',
    'Duplicate booking entry',
    'Other'
  ];

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const finalReason = reason === 'Other' && customReason.trim() ? customReason.trim() : reason;
    onConfirmCancel(booking.id, finalReason);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden relative flex flex-col my-auto">
        <div className="p-5 border-b border-rose-100 flex justify-between items-center bg-rose-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Cancel Appointment</h3>
              <p className="text-xs text-slate-500">
                {booking.customerName} &bull; {booking.id}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <p className="text-slate-600">
            Are you sure you want to cancel this appointment on <span className="font-bold text-slate-900">{booking.date}</span> at <span className="font-bold text-slate-900">{booking.exactTime || booking.timeSlot}</span>?
          </p>

          <div>
            <label className="block font-bold text-slate-700 mb-1.5">Reason for Cancellation</label>
            <div className="space-y-1.5">
              {reasonsList.map((r) => (
                <label
                  key={r}
                  className="flex items-center gap-2 p-2 rounded-xl hover:bg-slate-50 cursor-pointer border border-transparent has-checked:border-rose-200 has-checked:bg-rose-50/40"
                >
                  <input
                    type="radio"
                    name="cancelReason"
                    value={r}
                    checked={reason === r}
                    onChange={(e) => setReason(e.target.value)}
                    className="text-rose-600 focus:ring-rose-500"
                  />
                  <span className="font-medium text-slate-800">{r}</span>
                </label>
              ))}
            </div>
          </div>

          {reason === 'Other' && (
            <div>
              <label className="block font-bold text-slate-700 mb-1">Specify Details</label>
              <input
                type="text"
                required
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="Enter specific reason..."
                className="w-full p-2.5 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 outline-none"
              />
            </div>
          )}

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition cursor-pointer"
            >
              Keep Appointment
            </button>
            <button
              type="submit"
              className="bg-rose-600 hover:bg-rose-700 text-white px-5 py-2 rounded-xl font-bold transition shadow-xs cursor-pointer"
            >
              Confirm Cancellation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ==========================================
// 3. CONTACT CUSTOMER MODAL ("contacts contacts")
// ==========================================
interface ContactCustomerModalProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ContactCustomerModal({
  booking,
  isOpen,
  onClose
}: ContactCustomerModalProps) {
  if (!isOpen || !booking) return null;

  const [copiedType, setCopiedType] = useState<string | null>(null);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const primaryService = booking.services[0]?.name || 'Carpet Cleaning';
  const displayTime = booking.exactTime || booking.timeSlot;

  // Pre-formatted messages
  const onTheWaySMS = `Hi ${booking.customerName}, our A&M cleaning technician is on the way to your property (${booking.streetAddress}) for your ${primaryService} appointment. ETA: 15-20 minutes!`;
  const reminderSMS = `Hi ${booking.customerName}, friendly reminder of your A&M ${primaryService} appointment scheduled for ${booking.date} at ${displayTime}. Call owner or WhatsApp at ${BUSINESS_OWNER_CONTACT.phone} for any adjustments.`;
  const completedSMS = `Hi ${booking.customerName}, thank you for choosing A&M Carpet Cleaning today! Your carpets and fabrics have been professionally steam cleaned. Please allow 4-6 hours drying time.`;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden relative flex flex-col my-auto">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-blue-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Contact Customer Hub</h3>
              <p className="text-xs text-slate-500">
                Direct Communication & Dispatch Contacts
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 text-xs">
          {/* Customer Profile Card */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                <User className="w-4 h-4 text-blue-600" />
                {booking.customerName}
              </div>
              <span className="font-mono text-[11px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                {booking.id}
              </span>
            </div>

            {/* Direct Phone & Copy */}
            <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-slate-200">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-600" />
                <span className="font-bold text-slate-900">{booking.phone}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <a
                  href={`tel:${booking.phone}`}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1 text-[11px]"
                  title="Call Customer"
                >
                  <Phone className="w-3 h-3" /> Call
                </a>
                <a
                  href={`https://wa.me/${booking.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi ${booking.customerName}, this is A&M Carpet Cleaning regarding your booking #${booking.id}.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#25D366] hover:bg-[#20bd5a] text-white px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1 text-[11px]"
                  title="WhatsApp Customer"
                >
                  <MessageCircle className="w-3 h-3 fill-white/20" /> WhatsApp
                </a>
                <button
                  onClick={() => copyToClipboard(booking.phone, 'phone')}
                  className="p-1 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
                  title="Copy Phone"
                >
                  {copiedType === 'phone' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            {/* Direct Email & Copy */}
            <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-slate-200">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-sky-600" />
                <span className="font-medium text-slate-700 truncate max-w-[200px] sm:max-w-xs">{booking.email}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <a
                  href={`mailto:${booking.email}?subject=A%26M%20Carpet%20Cleaning%20Appointment%20%23${booking.id}`}
                  className="bg-sky-600 hover:bg-sky-700 text-white px-3 py-1 rounded-lg font-bold transition flex items-center gap-1"
                >
                  <Mail className="w-3 h-3" /> Email
                </a>
                <button
                  onClick={() => copyToClipboard(booking.email, 'email')}
                  className="p-1 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
                  title="Copy Email"
                >
                  {copiedType === 'email' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            {/* Address & Copy */}
            <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-slate-200">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-rose-600 shrink-0" />
                <span className="text-slate-700 font-medium">
                  {booking.streetAddress} {booking.aptUnit || ''}, {booking.city}, {booking.state} {booking.zipCode}
                </span>
              </div>
              <button
                onClick={() =>
                  copyToClipboard(
                    `${booking.streetAddress} ${booking.aptUnit || ''}, ${booking.city}, ${booking.state} ${booking.zipCode}`,
                    'address'
                  )
                }
                className="p-1 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition shrink-0 ml-2"
                title="Copy Address"
              >
                {copiedType === 'address' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          {/* Quick SMS Dispatch Templates */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                One-Click SMS Arrival Templates
              </span>
              <span className="text-[10px] text-slate-500">Tap to compose text</span>
            </div>

            <div className="space-y-2">
              <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-blue-900">En Route Notice (15-20 min)</span>
                  <a
                    href={`sms:${booking.phone}?&body=${encodeURIComponent(onTheWaySMS)}`}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-1 rounded-lg font-bold text-[10px] flex items-center gap-1 transition"
                  >
                    <Send className="w-3 h-3" /> Send SMS
                  </a>
                </div>
                <p className="text-slate-600 italic text-[11px]">&ldquo;{onTheWaySMS}&rdquo;</p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-slate-800">Appointment Reminder</span>
                  <a
                    href={`sms:${booking.phone}?&body=${encodeURIComponent(reminderSMS)}`}
                    className="bg-slate-800 hover:bg-slate-900 text-white px-2.5 py-1 rounded-lg font-bold text-[10px] flex items-center gap-1 transition"
                  >
                    <Send className="w-3 h-3" /> Send SMS
                  </a>
                </div>
                <p className="text-slate-600 italic text-[11px]">&ldquo;{reminderSMS}&rdquo;</p>
              </div>

              <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-emerald-900">Post-Cleaning Completion</span>
                  <a
                    href={`sms:${booking.phone}?&body=${encodeURIComponent(completedSMS)}`}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1 rounded-lg font-bold text-[10px] flex items-center gap-1 transition"
                  >
                    <Send className="w-3 h-3" /> Send SMS
                  </a>
                </div>
                <p className="text-slate-600 italic text-[11px]">&ldquo;{completedSMS}&rdquo;</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="bg-slate-900 hover:bg-black text-white px-5 py-2 rounded-xl font-bold text-xs transition cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 4. ADD NOTE MODAL
// ==========================================
interface AddNoteModalProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveNote: (bookingId: string, noteText: string, category: AppointmentNote['category']) => void;
}

export function AddNoteModal({
  booking,
  isOpen,
  onClose,
  onSaveNote
}: AddNoteModalProps) {
  if (!isOpen || !booking) return null;

  const [newNote, setNewNote] = useState('');
  const [category, setCategory] = useState<AppointmentNote['category']>('staff');

  const quickTags = [
    'Gate code verified on phone',
    'Customer requested low-moisture velvet tool',
    'Pet crated safely in guest bedroom',
    'Pre-scrub agitation required on hallway',
    'Customer called to confirm exact 7:30 AM arrival',
    'Key placed under front porch planter box'
  ];

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    onSaveNote(booking.id, newNote.trim(), category);
    setNewNote('');
    onClose();
  };

  const handleApplyTag = (tag: string) => {
    setNewNote((prev) => (prev ? `${prev} &bull; ${tag}` : tag));
  };

  const notesList = booking.notesList || [];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden relative flex flex-col my-auto max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-blue-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Appointment Notes Log</h3>
              <p className="text-xs text-slate-500">
                {booking.customerName} &bull; {booking.id}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
          {/* Add New Note Section */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Add New Internal Note</label>
              <textarea
                rows={3}
                required
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Enter technician note, arrival updates, access codes, customer requests..."
                className="w-full p-2.5 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Category selection */}
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-600">Category:</span>
              {(['staff', 'technician', 'customer'] as const).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg capitalize font-bold text-[11px] transition cursor-pointer ${
                    category === cat
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat} Note
                </button>
              ))}
            </div>

            {/* Quick chips */}
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Quick Preset Tags:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {quickTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleApplyTag(tag)}
                    className="text-[10px] bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 px-2 py-1 rounded-md border border-slate-200 transition cursor-pointer"
                  >
                    + {tag}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-bold transition shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" /> Save Note
              </button>
            </div>
          </form>

          {/* Existing Notes Stream */}
          <div className="pt-4 border-t border-slate-100">
            <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px] block mb-2">
              Activity & Notes History ({notesList.length})
            </span>

            {notesList.length === 0 ? (
              <div className="text-slate-400 italic text-center py-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                No recorded notes yet.
              </div>
            ) : (
              <div className="space-y-2.5">
                {notesList.map((note) => (
                  <div
                    key={note.id}
                    className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-left"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900">{note.author}</span>
                        <span
                          className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded ${
                            note.category === 'technician'
                              ? 'bg-amber-100 text-amber-800'
                              : note.category === 'payment'
                              ? 'bg-emerald-100 text-emerald-800'
                              : note.category === 'reschedule'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {note.category || 'staff'}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {new Date(note.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} &bull; {new Date(note.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-slate-700 text-[11px] whitespace-pre-wrap">{note.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="bg-slate-900 hover:bg-black text-white px-5 py-2 rounded-xl font-bold text-xs transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 5. RECORD PAYMENT MODAL ("recode payment")
// ==========================================
interface RecordPaymentModalProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
  onSavePayment: (
    bookingId: string,
    payment: Omit<PaymentRecord, 'id' | 'date'>
  ) => void;
}

export function RecordPaymentModal({
  booking,
  isOpen,
  onClose,
  onSavePayment
}: RecordPaymentModalProps) {
  if (!isOpen || !booking) return null;

  const total = booking.totalPrice;
  const history = booking.paymentHistory || [];
  const paidSoFar = history.reduce((sum, p) => sum + p.amount, 0);
  const remainingDue = Math.max(0, total - paidSoFar);

  const [amount, setAmount] = useState<number>(remainingDue > 0 ? remainingDue : total);
  const [method, setMethod] = useState<PaymentRecord['method']>('card');
  const [reference, setReference] = useState('');
  const [notes, setNotes] = useState('');
  const [recordedBy, setRecordedBy] = useState('Front Desk Coordinator');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (amount <= 0) return;
    onSavePayment(booking.id, {
      amount,
      method,
      reference: reference.trim() || undefined,
      notes: notes.trim() || undefined,
      recordedBy
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden relative flex flex-col my-auto">
        {/* Header */}
        <div className="p-5 border-b border-emerald-100 flex justify-between items-center bg-emerald-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Record Payment</h3>
              <p className="text-xs text-slate-500">
                {booking.customerName} &bull; {booking.id}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Balance card */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 grid grid-cols-3 text-center gap-2">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase">Total Job</span>
              <div className="font-extrabold text-slate-900 text-sm">${total}</div>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase">Paid to Date</span>
              <div className="font-extrabold text-emerald-600 text-sm">${paidSoFar}</div>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase">Balance Due</span>
              <div className={`font-extrabold text-sm ${remainingDue > 0 ? 'text-amber-600' : 'text-slate-500'}`}>
                ${remainingDue}
              </div>
            </div>
          </div>

          {/* Quick preset buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setAmount(remainingDue)}
              className="flex-1 py-1.5 px-2 rounded-xl font-bold bg-emerald-50 border border-emerald-200 text-emerald-800 hover:bg-emerald-100 transition cursor-pointer"
            >
              Full Balance (${remainingDue})
            </button>
            <button
              type="button"
              onClick={() => setAmount(50)}
              className="py-1.5 px-3 rounded-xl font-bold bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200 transition cursor-pointer"
            >
              $50 Deposit
            </button>
            <button
              type="button"
              onClick={() => setAmount(100)}
              className="py-1.5 px-3 rounded-xl font-bold bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200 transition cursor-pointer"
            >
              $100 Partial
            </button>
          </div>

          {/* Payment Amount input */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Amount to Record ($)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">$</span>
              <input
                type="number"
                min="1"
                step="any"
                required
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                className="w-full pl-7 pr-3 py-2.5 border border-slate-300 rounded-xl font-extrabold text-slate-900 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>

          {/* Payment Method selector */}
          <div>
            <label className="block font-bold text-slate-700 mb-1.5">Payment Method</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'card', label: 'Credit Card', icon: CreditCard },
                { id: 'apple_pay', label: 'Apple Pay ', icon: CreditCard },
                { id: 'google_pay', label: 'Google Pay G', icon: CreditCard },
                { id: 'cash', label: 'Cash on Site', icon: Banknote },
                { id: 'zelle', label: 'Zelle / Venmo', icon: DollarSign },
                { id: 'check', label: 'Paper Check', icon: FileText }
              ].map((m) => {
                const Icon = m.icon;
                const isSelected = method === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setMethod(m.id as PaymentRecord['method'])}
                    className={`py-2 px-2 rounded-xl font-bold border flex flex-col items-center gap-1 transition cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-[10px]">{m.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Reference & Notes */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Reference / Auth #</label>
              <input
                type="text"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="e.g. VISA-9412 or ApplePay-Auth"
                className="w-full p-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Staff / Tech Name</label>
              <input
                type="text"
                value={recordedBy}
                onChange={(e) => setRecordedBy(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Transaction Note (Optional)</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Deposit or balance paid on site after carpet steam walkthrough"
              className="w-full p-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          {/* Automatic notifications notice */}
          <div className="p-3 bg-blue-50/80 border border-blue-200 rounded-xl flex items-start gap-2 text-[11px] text-blue-900">
            <span className="text-base leading-none">🔔</span>
            <div>
              <span className="font-bold block">Automatic Customer Notification:</span>
              <span>An itemized receipt and balance confirmation will be dispatched via SMS to <b>{booking.phone}</b> and email to <b>{booking.email}</b>.</span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-xl font-bold transition shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" /> Save Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
