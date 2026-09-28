import { useState, useEffect } from 'react';
import { Bell, Sparkles, Check, X, ArrowRight, Volume2, VolumeX, MapPin, DollarSign, Clock } from 'lucide-react';
import { Booking } from '../types';
import {
  NEW_BOOKING_EVENT_NAME,
  getNotificationSettings,
  saveNotificationSettings,
  playNotificationSound,
  markBookingAsReviewed
} from '../utils/notificationService';

interface LiveBookingNotificationToastProps {
  onOpenAdminToBooking?: (bookingId?: string) => void;
}

interface ToastItem {
  id: string;
  booking: Booking;
  timestamp: number;
}

export default function LiveBookingNotificationToast({
  onOpenAdminToBooking
}: LiveBookingNotificationToastProps) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => getNotificationSettings().soundEnabled);

  useEffect(() => {
    // 1. Listen for local custom event within same window
    const handleNewBooking = (e: Event) => {
      const customEvent = e as CustomEvent<Booking>;
      if (customEvent.detail) {
        addToast(customEvent.detail);
      }
    };

    // 2. Listen for cross-tab storage sync
    const handleStorageSync = (e: StorageEvent) => {
      if (e.key === 'am_booking_notification_sync' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (parsed && parsed.booking) {
            addToast(parsed.booking);
            if (soundEnabled) {
              playNotificationSound();
            }
          }
        } catch (err) {
          console.error('Failed to parse cross-tab sync:', err);
        }
      }
    };

    window.addEventListener(NEW_BOOKING_EVENT_NAME, handleNewBooking);
    window.addEventListener('storage', handleStorageSync);

    return () => {
      window.removeEventListener(NEW_BOOKING_EVENT_NAME, handleNewBooking);
      window.removeEventListener('storage', handleStorageSync);
    };
  }, [soundEnabled]);

  const addToast = (booking: Booking) => {
    const newToast: ToastItem = {
      id: `${booking.id}-${Date.now()}`,
      booking,
      timestamp: Date.now()
    };

    setToasts((prev) => [newToast, ...prev.slice(0, 2)]); // Keep at most 3 visible
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    const settings = getNotificationSettings();
    saveNotificationSettings({ ...settings, soundEnabled: next });
    if (next) {
      playNotificationSound();
    }
  };

  const handleReviewClick = (toast: ToastItem) => {
    markBookingAsReviewed(toast.booking.id);
    removeToast(toast.id);
    if (onOpenAdminToBooking) {
      onOpenAdminToBooking(toast.booking.id);
    } else {
      window.location.hash = '#admin';
    }
  };

  if (toasts.length === 0) return null;

  return (
    <aside aria-label="Notifications" className="fixed top-20 right-4 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const b = toast.booking;
        const serviceNames = b.services.map((s) => s.name).join(', ') || 'Cleaning & Painting';

        return (
          <div
            key={toast.id}
            role="alert"
            className="pointer-events-auto bg-slate-900/95 text-white border-2 border-amber-500/80 rounded-2xl shadow-2xl p-4 backdrop-blur-md transition-all duration-300 transform translate-y-0 animate-in fade-in slide-in-from-top-4"
          >
            {/* Header pill & sound toggle */}
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500" />
                </span>
                <span className="text-xs font-black tracking-wider uppercase text-amber-400 flex items-center gap-1">
                  <Bell className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
                  New Booking Alert!
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={toggleSound}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                  title={soundEnabled ? 'Mute sound alerts' : 'Unmute sound alerts'}
                >
                  {soundEnabled ? (
                    <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <VolumeX className="w-3.5 h-3.5 text-slate-500" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => removeToast(toast.id)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                  title="Dismiss notification"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-extrabold text-sm text-white line-clamp-1">
                    {b.customerName}
                  </h4>
                  <p className="text-xs text-amber-200/90 font-medium line-clamp-1 mt-0.5">
                    {serviceNames}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-sm font-extrabold text-emerald-400 block">
                    ${b.totalPrice}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {b.id}
                  </span>
                </div>
              </div>

              <div className="mt-2 text-[11px] text-slate-300 flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-sky-400 shrink-0" />
                  {b.city}, {b.state}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-amber-400 shrink-0" />
                  {b.date} &bull; {b.timeSlot}
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between gap-2">
              <span className="text-[10px] text-slate-400 italic">
                Just received from customer
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleReviewClick(toast)}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-3 py-1.5 rounded-xl transition flex items-center gap-1 shadow-md cursor-pointer"
                >
                  <span>Review in Admin</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </aside>
  );
}
