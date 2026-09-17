import { Sparkles, Search, Phone, Calendar, MessageCircle } from 'lucide-react';
import { AppView } from '../types';
import { BUSINESS_OWNER_CONTACT } from '../utils/contactConfig';

interface NavbarProps {
  currentView?: AppView;
  onNavigate?: (view: AppView) => void;
  onOpenBooking?: () => void;
  onOpenTrack: () => void;
}

export default function Navbar({
  onNavigate,
  onOpenBooking,
  onOpenTrack
}: NavbarProps) {
  const handleNav = (view: AppView) => {
    if (onNavigate) {
      onNavigate(view);
    } else {
      window.location.hash = view === 'home' ? '' : `#${view}`;
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between gap-3">
        {/* Brand Logo */}
        <button
          onClick={() => handleNav('home')}
          className="flex items-center gap-2.5 sm:gap-3 cursor-pointer text-left shrink-0"
        >
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white p-2 sm:p-2.5 rounded-xl shadow-md flex items-center justify-center">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <div className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
              <span>A&M</span> <span className="text-blue-600">Carpet Cleaning</span>
            </div>
            <p className="text-[10px] sm:text-[11px] uppercase tracking-wider font-semibold text-blue-700 leading-none mt-0.5">
              Professional Care & Restoration
            </p>
          </div>
        </button>

        {/* Quick Top Actions (Phone, WhatsApp, Track, Book Now) */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          <a
            href={BUSINESS_OWNER_CONTACT.telUri}
            className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-blue-600 bg-slate-50 hover:bg-slate-100 px-3 py-2 rounded-xl border border-slate-200 transition"
            title="Call Owner & Dispatch: +1 (973) 609-4520"
          >
            <Phone className="w-3.5 h-3.5 text-blue-600" />
            <span className="font-mono">{BUSINESS_OWNER_CONTACT.phone}</span>
          </a>

          <a
            href={BUSINESS_OWNER_CONTACT.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-bold text-white bg-[#25D366] hover:bg-[#20bd5a] px-2.5 sm:px-3 py-2 rounded-xl shadow-xs transition"
            title="Direct WhatsApp Contact with Business Owner: +1 (973) 609-4520"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-white/20" />
            <span className="hidden xs:inline">WhatsApp</span>
          </a>

          <button
            onClick={onOpenTrack}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-blue-600 bg-slate-50 hover:bg-slate-100 px-3 py-2 rounded-xl border border-slate-200 transition cursor-pointer"
            title="Track Your Appointment"
          >
            <Search className="w-3.5 h-3.5 text-blue-600" />
            <span className="hidden xs:inline">Track Order</span>
            <span className="xs:hidden">Track</span>
          </button>

          {onOpenBooking && (
            <button
              onClick={onOpenBooking}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold px-3.5 sm:px-4 py-2 rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Book Now</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
