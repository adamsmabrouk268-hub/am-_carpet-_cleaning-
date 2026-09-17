import { useState } from 'react';
import {
  X,
  Search,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Phone,
  Download,
  AlertCircle,
  CreditCard,
  Printer,
  ShieldCheck,
  Check,
  MessageCircle
} from 'lucide-react';
import { Booking, PaymentMethodType } from '../types';
import { downloadCalendarInvite, recordBookingPayment } from '../utils/bookingStorage';
import { BUSINESS_OWNER_CONTACT } from '../utils/contactConfig';
import PaymentReceiptModal from './PaymentReceiptModal';

interface TrackBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: Booking[];
  onBookingUpdated?: (updated: Booking) => void;
}

export default function TrackBookingModal({
  isOpen,
  onClose,
  bookings,
  onBookingUpdated
}: TrackBookingModalProps) {
  const [query, setQuery] = useState('');
  const [matchedBooking, setMatchedBooking] = useState<Booking | null>(null);
  const [searched, setSearched] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  // Online Pay in Tracker
  const [isPayingOnline, setIsPayingOnline] = useState(false);
  const [payMethod, setPayMethod] = useState<PaymentMethodType>('card');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleSearch = () => {
    setSearched(true);
    const cleanQuery = query.trim().toLowerCase();
    if (!cleanQuery) {
      setMatchedBooking(null);
      return;
    }

    const found = bookings.find(
      (b) =>
        b.id.toLowerCase() === cleanQuery ||
        b.phone.replace(/\D/g, '').includes(cleanQuery.replace(/\D/g, '')) ||
        b.email.toLowerCase() === cleanQuery
    );

    setMatchedBooking(found || null);
    setIsPayingOnline(false);
  };

  const getStatusBadge = (status: Booking['status']) => {
    switch (status) {
      case 'confirmed':
        return <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">Confirmed</span>;
      case 'in_progress':
        return <span className="bg-sky-100 text-sky-800 text-xs font-bold px-3 py-1 rounded-full animate-pulse">Technician On Route</span>;
      case 'completed':
        return <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full">Completed</span>;
      case 'cancelled':
        return <span className="bg-rose-100 text-rose-800 text-xs font-bold px-3 py-1 rounded-full">Cancelled</span>;
      default:
        return <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full">Pending Verification</span>;
    }
  };

  const handleExecutePayment = (method: PaymentMethodType, amount: number) => {
    if (!matchedBooking) return;
    setIsProcessing(true);

    setTimeout(() => {
      const updated = recordBookingPayment(matchedBooking.id, {
        amount,
        method,
        reference: `${method.toUpperCase()}-${Date.now().toString().slice(-4)}`,
        notes: `Online self-service payment via ${method.toUpperCase()}`,
        recordedBy: 'Customer Online Tracker'
      });

      if (updated) {
        setMatchedBooking(updated);
        if (onBookingUpdated) {
          onBookingUpdated(updated);
        }
      }
      setIsProcessing(false);
      setIsPayingOnline(false);
    }, 600);
  };

  const total = matchedBooking ? matchedBooking.totalPrice : 0;
  const history = matchedBooking?.paymentHistory || [];
  const paidSoFar = history.reduce((sum, p) => sum + p.amount, 0) || (matchedBooking?.depositPaid || 0);
  const remainingDue = Math.max(0, total - paidSoFar);

  return (
    <>
      <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
        <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden relative flex flex-col my-auto max-h-[92vh]">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-100 flex justify-between items-center bg-blue-50/50">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                <Search className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Track Your Appointment</h3>
                <p className="text-xs text-slate-500">Live service status, deposit receipt & payment</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-100 cursor-pointer transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-5 sm:p-6 space-y-4 text-sm overflow-y-auto">
            {/* Search box */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Enter Booking ID or Phone Number
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    if (searched) setSearched(false);
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="e.g. PC-94821 or (832) 555-4921"
                  className="flex-1 px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <button
                  onClick={handleSearch}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer"
                >
                  Track
                </button>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Tip: Try demo booking <span className="font-mono text-blue-600 font-bold cursor-pointer" onClick={() => { setQuery('PC-94821'); }}>PC-94821</span>
              </p>
            </div>

            {/* Result view */}
            {matchedBooking && (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-400 font-mono">Reference</span>
                    <div className="font-extrabold text-slate-900 text-base">{matchedBooking.id}</div>
                  </div>
                  {getStatusBadge(matchedBooking.status)}
                </div>

                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-200 text-xs">
                  <div>
                    <div className="text-slate-400 flex items-center gap-1 mb-0.5">
                      <Calendar className="w-3 h-3 text-blue-600" />
                      <span>Scheduled Date</span>
                    </div>
                    <div className="font-bold text-slate-800">{matchedBooking.date}</div>
                  </div>
                  <div>
                    <div className="text-slate-400 flex items-center gap-1 mb-0.5">
                      <Clock className="w-3 h-3 text-blue-600" />
                      <span>Arrival Window</span>
                    </div>
                    <div className="font-bold text-slate-800">{matchedBooking.timeSlot}</div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 text-xs">
                  <div className="text-slate-400 flex items-center gap-1 mb-0.5">
                    <MapPin className="w-3 h-3 text-blue-600" />
                    <span>Service Address</span>
                  </div>
                  <div className="font-semibold text-slate-800">
                    {matchedBooking.streetAddress} {matchedBooking.aptUnit || ''}, {matchedBooking.city}, {matchedBooking.state} {matchedBooking.zipCode}
                  </div>
                </div>

                {/* Payments Card in Tracker */}
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-900 flex items-center gap-1">
                      <CreditCard className="w-3.5 h-3.5 text-blue-600" />
                      <span>Payment Status:</span>
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      remainingDue === 0
                        ? 'bg-emerald-100 text-emerald-800'
                        : paidSoFar > 0
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {remainingDue === 0 ? 'Paid in Full' : paidSoFar > 0 ? 'Deposit Paid' : 'Unpaid (Due on Site)'}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 py-1.5 border-y border-slate-100 text-center">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Total Quote</span>
                      <span className="font-bold text-slate-800">${total}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Paid Online</span>
                      <span className="font-bold text-emerald-600">${paidSoFar}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Balance Due</span>
                      <span className={`font-extrabold ${remainingDue > 0 ? 'text-amber-600' : 'text-slate-400'}`}>
                        ${remainingDue}
                      </span>
                    </div>
                  </div>

                  {/* Actions for payments */}
                  <div className="flex items-center justify-between pt-1 gap-2">
                    <button
                      type="button"
                      onClick={() => setIsReceiptModalOpen(true)}
                      className="text-xs font-bold text-blue-700 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                    >
                      <Printer className="w-3 h-3" />
                      <span>View Receipt</span>
                    </button>

                    {remainingDue > 0 && !isPayingOnline && (
                      <button
                        type="button"
                        onClick={() => setIsPayingOnline(true)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1 transition cursor-pointer shadow-2xs"
                      >
                        <CreditCard className="w-3 h-3" />
                        <span>Pay ${remainingDue} Online</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Inline Payment Drawer inside tracker */}
                {isPayingOnline && remainingDue > 0 && (
                  <div className="p-3.5 bg-blue-50/90 border border-blue-200 rounded-xl space-y-3 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-blue-950">Select Online Payment Method:</span>
                      <button
                        type="button"
                        onClick={() => setIsPayingOnline(false)}
                        className="text-slate-400 hover:text-slate-600 text-[11px]"
                      >
                        Cancel
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-1.5">
                      <button
                        type="button"
                        onClick={() => setPayMethod('card')}
                        className={`p-2 rounded-lg border font-bold text-center transition cursor-pointer ${
                          payMethod === 'card'
                            ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                            : 'bg-white text-slate-700 border-slate-200'
                        }`}
                      >
                        Credit Card
                      </button>
                      <button
                        type="button"
                        onClick={() => setPayMethod('apple_pay')}
                        className={`p-2 rounded-lg border font-bold text-center transition cursor-pointer ${
                          payMethod === 'apple_pay'
                            ? 'bg-black text-white border-black shadow-2xs'
                            : 'bg-white text-slate-700 border-slate-200'
                        }`}
                      >
                        Pay Apple
                      </button>
                      <button
                        type="button"
                        onClick={() => setPayMethod('google_pay')}
                        className={`p-2 rounded-lg border font-bold text-center transition cursor-pointer ${
                          payMethod === 'google_pay'
                            ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                            : 'bg-white text-slate-700 border-slate-200'
                        }`}
                      >
                        GPay Google
                      </button>
                    </div>

                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={() => handleExecutePayment(payMethod, remainingDue)}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs"
                    >
                      {isProcessing ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Authorizing Payment...</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Pay ${remainingDue} with {payMethod === 'apple_pay' ? 'Apple Pay' : payMethod === 'google_pay' ? 'Google Pay' : 'Card'}</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                <div className="pt-2 border-t border-slate-200 text-xs">
                  <span className="text-slate-400 block mb-1">Assigned Crew:</span>
                  <span className="font-bold text-blue-900 bg-blue-50 px-2.5 py-1 rounded-md inline-block">
                    🚚 {matchedBooking.technician || 'A&M Lead Technician'}
                  </span>
                </div>

                <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => downloadCalendarInvite(matchedBooking)}
                    className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 py-2 px-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-blue-600" />
                    <span>Calendar</span>
                  </button>
                  <a
                    href={BUSINESS_OWNER_CONTACT.telUri}
                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition text-center"
                    title={`Call Owner: ${BUSINESS_OWNER_CONTACT.phone}`}
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Owner</span>
                  </a>
                  <a
                    href={BUSINESS_OWNER_CONTACT.getWhatsAppBookingUrl(matchedBooking.id, matchedBooking.customerName)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#25D366] hover:bg-[#20bd5a] text-white py-2 px-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition text-center shadow-xs"
                    title="Direct WhatsApp with Business Owner"
                  >
                    <MessageCircle className="w-3.5 h-3.5 fill-white/20" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            )}

            {searched && !matchedBooking && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-center space-y-1">
                <AlertCircle className="w-6 h-6 text-amber-600 mx-auto" />
                <div className="font-bold text-xs text-amber-900">No appointment found</div>
                <div className="text-[11px] text-amber-700">
                  Please double check your Reference ID or the phone number provided during booking.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {matchedBooking && (
        <PaymentReceiptModal
          isOpen={isReceiptModalOpen}
          onClose={() => setIsReceiptModalOpen(false)}
          booking={matchedBooking}
        />
      )}
    </>
  );
}
