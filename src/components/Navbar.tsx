import { Sparkles, MessageCircle } from 'lucide-react';
import { AppView } from '../types';
import { BUSINESS_OWNER_CONTACT } from '../utils/contactConfig';

interface NavbarProps {
  currentView?: AppView;
  onNavigate?: (view: AppView) => void;
  onOpenBooking?: () => void;
  onOpenTrack?: () => void;
}

export default function Navbar({
  onNavigate,
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
              <span>A&M</span> <span className="text-blue-600">Carpet Cleaning & Painting</span>
            </div>
            <p className="text-[10px] sm:text-[11px] uppercase tracking-wider font-semibold text-blue-700 leading-none mt-0.5">
              Professional Cleaning & Painting Care
            </p>
          </div>
        </button>

        {/* Quick Top Action: Message Icon Only */}
        <div className="flex items-center">
          <a
            href={BUSINESS_OWNER_CONTACT.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white flex items-center justify-center shadow-sm hover:shadow-md transition cursor-pointer"
            title="Chat with Business Owner on WhatsApp"
            aria-label="Send a message on WhatsApp"
          >
            <MessageCircle className="w-5 h-5 sm:w-5.5 sm:h-5.5 fill-white/20" />
          </a>
        </div>
      </div>
    </header>
  );
}
