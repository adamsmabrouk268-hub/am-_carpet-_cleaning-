import React, { useState } from 'react';
import { X, AlertTriangle, CheckCircle2, ShieldAlert, Calendar, Clock, MapPin, User } from 'lucide-react';
import { Booking } from '../types';

interface DenyBookingModalProps {
  isOpen: boolean;
  booking: Booking | null;
  onClose: () => void;
  onConfirmDeny?: (bookingId: string, reason: string) => void;
  onConfirmDenial?: (reason: string) => void;
}

const PRESET_REASONS = [
  'Full capacity — No truck/crew availability for requested time slot',
  'Location is outside our daily truck dispatch radius',
  'Customer requested cancellation via telephone',
  'Commercial / specialty project requiring prior on-site survey',
  'Severe weather / emergency truck fleet maintenance',
  'Other / Custom reason'
];

export default function DenyBookingModal({
  isOpen,
  booking,
  onClose,
  onConfirmDeny,
  onConfirmDenial
}: DenyBookingModalProps) {
  const [selectedPreset, setSelectedPreset] = useState<string>(PRESET_REASONS[0]);
  const [customReason, setCustomReason] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !booking) return null;

  const handleConfirm = () => {
    let finalReason = selectedPreset;
    if (selectedPreset === 'Other / Custom reason') {
      if (!customReason.trim()) {
        setError('Please provide a specific reason for denying this booking.');
        return;
      }
      finalReason = customReason.trim();
    } else if (customReason.trim()) {
      finalReason = `${selectedPreset} — ${customReason.trim()}`;
    }

    if (onConfirmDenial) {
      onConfirmDenial(finalReason);
    }
    if (onConfirmDeny) {
      onConfirmDeny(booking.id, finalReason);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden relative flex flex-col my-auto animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 sm:px-6 border-b border-rose-100 bg-rose-50/80 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold shadow-xs">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Deny / Reject Booking</h3>
              <p className="text-xs text-rose-700">
                Cancel dispatch order <span className="font-mono font-bold">{booking.id}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-white/80 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-4 text-xs">
          {/* Booking Summary Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold text-slate-900 text-sm">
                <User className="w-4 h-4 text-slate-500" />
                <span>{booking.customerName}</span>
              </div>
              <span className="font-mono text-[11px] font-bold bg-slate-200 text-slate-700 px-2 py-0.5 rounded">
                ${(booking.totalPrice || 0).toFixed(2)}
              </span>
            </div>
            <div className="flex items-center gap-4 text-slate-600 text-[11px]">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                {booking.date}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                {booking.timeSlot}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                {booking.city}, {booking.state}
              </span>
            </div>
          </div>

          {/* Reason Selection */}
          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider text-[11px] mb-2">
              Select Denial Reason:
            </label>
            <div className="space-y-1.5">
              {PRESET_REASONS.map((reason) => (
                <label
                  key={reason}
                  className={`flex items-start gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition ${
                    selectedPreset === reason
                      ? 'border-rose-300 bg-rose-50/50 text-slate-900 font-semibold'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="deny_reason"
                    value={reason}
                    checked={selectedPreset === reason}
                    onChange={() => {
                      setSelectedPreset(reason);
                      setError(null);
                    }}
                    className="mt-0.5 text-rose-600 focus:ring-rose-500"
                  />
                  <span>{reason}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Additional Notes or Custom Reason */}
          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider text-[11px] mb-1.5">
              Additional Notes / Customer Message:
            </label>
            <textarea
              rows={2}
              value={customReason}
              onChange={(e) => {
                setCustomReason(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Add optional internal context or specific details for customer notice..."
              className="w-full p-2.5 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none"
            />
          </div>

          {error && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-[11px] text-amber-900 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              Denying this booking will set its status to <strong>Cancelled / Denied</strong>, release the truck slot,
              and record the denial reason in the booking audit log.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:px-6 border-t border-slate-100 bg-slate-50 flex justify-end items-center gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition cursor-pointer"
          >
            Go Back (Keep Booking)
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="bg-rose-600 hover:bg-rose-700 text-white px-5 py-2 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer flex items-center gap-1.5"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            Confirm Denial
          </button>
        </div>
      </div>
    </div>
  );
}
