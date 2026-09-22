import { useRef } from 'react';
import {
  X,
  Printer,
  Download,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Calendar,
  Clock,
  MapPin,
  CreditCard,
  Phone,
  Mail
} from 'lucide-react';
import { Booking } from '../types';
import { BUSINESS_OWNER_CONTACT } from '../utils/contactConfig';

interface PaymentReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null;
}

export default function PaymentReceiptModal({
  isOpen,
  onClose,
  booking
}: PaymentReceiptModalProps) {
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !booking) return null;

  const total = booking.totalPrice;
  const history = booking.paymentHistory || [];
  const paidSoFar = history.reduce((sum, p) => sum + p.amount, 0) || (booking.depositPaid || (booking.paymentStatus === 'paid_full' ? total : (booking.paymentStatus === 'paid_deposit' ? Math.round(total * 0.2) : 0)));
  const remainingDue = Math.max(0, total - paidSoFar);

  const latestPayment = history.length > 0 ? history[0] : null;
  const paymentMethodDisplay = (method?: string) => {
    switch (method) {
      case 'apple_pay':
        return 'Apple Pay  (Contactless)';
      case 'google_pay':
        return 'Google Pay G (Contactless)';
      case 'card':
        return 'Credit / Debit Card (Visa/Mastercard)';
      case 'cash':
        return 'Cash on Site';
      case 'zelle':
        return 'Zelle / Venmo Direct';
      case 'check':
        return 'Check';
      default:
        return 'Direct Payment';
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden relative flex flex-col my-auto max-h-[95vh]">
        {/* Modal Top Bar */}
        <div className="p-4 sm:px-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Official Payment Receipt</h3>
              <p className="text-[11px] text-slate-500 font-mono">Invoice #{booking.id}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5 text-blue-600" />
              <span>Print</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Body */}
        <div ref={printRef} className="p-6 sm:p-8 overflow-y-auto space-y-5 text-xs text-slate-700 bg-white">
          {/* Header Brand */}
          <div className="flex justify-between items-start border-b border-slate-200 pb-5">
            <div>
              <div className="flex items-center gap-2 font-extrabold text-slate-900 text-lg">
                <div className="bg-blue-600 text-white p-1.5 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span>A&M <span className="text-blue-600">Carpet Cleaning & Painting</span></span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">A&M Carpet Cleaning & Painting LLC</p>
              <p className="text-[11px] text-slate-500">Owner Contact / WhatsApp: {BUSINESS_OWNER_CONTACT.phone} &bull; {BUSINESS_OWNER_CONTACT.email}</p>
            </div>

            <div className="text-right">
              <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-extrabold uppercase ${
                paidSoFar >= total
                  ? 'bg-emerald-100 text-emerald-800'
                  : paidSoFar > 0
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-amber-100 text-amber-800'
              }`}>
                {paidSoFar >= total ? 'Paid in Full' : paidSoFar > 0 ? 'Deposit Paid' : 'Payment Due on Arrival'}
              </span>
              <div className="mt-1 text-[11px] text-slate-400">Date: {new Date(booking.createdAt).toLocaleDateString()}</div>
              <div className="text-[11px] font-mono font-bold text-slate-700">Ref: {booking.id}</div>
            </div>
          </div>

          {/* Customer & Appointment Info */}
          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Customer Details</span>
              <div className="font-bold text-slate-900 text-sm">{booking.customerName}</div>
              <div className="text-slate-600">{booking.phone}</div>
              <div className="text-slate-600">{booking.email}</div>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Service Appointment</span>
              <div className="font-bold text-slate-900 text-sm flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                <span>{booking.date}</span>
              </div>
              <div className="text-slate-600 flex items-center gap-1 mt-0.5">
                <Clock className="w-3 h-3 text-blue-600" />
                <span>{booking.timeSlot}</span>
              </div>
              <div className="text-slate-600 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-blue-600" />
                <span className="truncate">{booking.streetAddress}, {booking.city}</span>
              </div>
            </div>
          </div>

          {/* Itemized Services Table */}
          <div>
            <span className="text-[11px] font-bold text-slate-900 uppercase tracking-wider block mb-2">
              Itemized Approved Services
            </span>
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200">
                    <th className="p-2.5 pl-3">Description</th>
                    <th className="p-2.5 text-center">Qty</th>
                    <th className="p-2.5 text-right">Unit</th>
                    <th className="p-2.5 pr-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {booking.services.map((srv, idx) => (
                    <tr key={idx}>
                      <td className="p-2.5 pl-3 font-medium text-slate-800">{srv.name}</td>
                      <td className="p-2.5 text-center font-bold text-slate-600">{srv.quantity}</td>
                      <td className="p-2.5 text-right text-slate-500">${srv.unitPrice}</td>
                      <td className="p-2.5 pr-3 text-right font-bold text-slate-900">${srv.total}</td>
                    </tr>
                  ))}
                  {booking.addOns.map((addon, idx) => (
                    <tr key={`addon-${idx}`} className="bg-slate-50/50">
                      <td className="p-2.5 pl-3 text-slate-700 italic">Add-on: {addon.name}</td>
                      <td className="p-2.5 text-center font-bold text-slate-600">1</td>
                      <td className="p-2.5 text-right text-slate-500">${addon.price}</td>
                      <td className="p-2.5 pr-3 text-right font-bold text-slate-900">${addon.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals & Payments Summary */}
          <div className="border-t border-slate-200 pt-4 space-y-1.5">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal:</span>
              <span className="font-semibold text-slate-800">${booking.totalPrice + (booking.discount || 0)}</span>
            </div>
            {booking.discount > 0 && (
              <div className="flex justify-between text-emerald-700 font-medium">
                <span>Multi-Room Discount Applied:</span>
                <span>-${booking.discount}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-slate-900 text-sm pt-1 border-t border-slate-100">
              <span>Total Cleaning Quote:</span>
              <span>${total}</span>
            </div>
            <div className="flex justify-between text-blue-700 font-bold text-sm">
              <span>Payment Received Today:</span>
              <span>-${paidSoFar}</span>
            </div>
            <div className="flex justify-between font-extrabold text-sm pt-1.5 border-t border-slate-200 text-slate-900">
              <span>Remaining Balance Due at Completion:</span>
              <span className={remainingDue > 0 ? 'text-amber-600' : 'text-emerald-700'}>
                ${remainingDue}
              </span>
            </div>
          </div>

          {/* Payment Details */}
          {paidSoFar > 0 && (
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3 text-[11px] space-y-1">
              <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-emerald-700" />
                <span>Payment Method: {paymentMethodDisplay(latestPayment?.method || booking.paymentMethod)}</span>
              </div>
              <div className="text-emerald-800 flex justify-between">
                <span>Transaction Ref: {latestPayment?.reference || booking.paymentReference || 'AUTH-OK-9821'}</span>
                <span>Status: Processed & Verified</span>
              </div>
            </div>
          )}

          {/* Guarantee Footer */}
          <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-sky-700 font-semibold">
              <ShieldCheck className="w-4 h-4 text-sky-600" />
              <span>100% Satisfaction Guarantee. Truck-Mounted Hot Water Extraction.</span>
            </div>
            <span className="text-slate-400">Thank you for choosing A&M Carpet Cleaning & Painting</span>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition cursor-pointer"
          >
            Close Receipt
          </button>
        </div>
      </div>
    </div>
  );
}
