import {
  Home,
  Sparkles,
  MapPin,
  Calendar,
  Layers,
  Headphones,
  ShieldCheck
} from 'lucide-react';
import { AppView } from '../types';

interface BottomNavigationProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  pendingCount?: number;
  isAdminAuthenticated?: boolean;
}

interface NavSection {
  id: AppView;
  label: string;
  shortLabel?: string;
  icon: typeof Home;
}

export default function BottomNavigation({
  currentView,
  onNavigate,
  pendingCount = 0,
  isAdminAuthenticated = false
}: BottomNavigationProps) {
  const sections: NavSection[] = [
    { id: 'home', label: 'Home', shortLabel: 'Home', icon: Home },
    { id: 'services', label: 'Our Services', shortLabel: 'Services', icon: Sparkles },
    { id: 'search-area', label: 'Search Area', shortLabel: 'Area', icon: MapPin },
    { id: 'bookings', label: 'Bookings', shortLabel: 'Bookings', icon: Calendar },
    { id: 'gallery', label: 'Before & After', shortLabel: 'Gallery', icon: Layers },
    { id: 'contact', label: 'Contact Us', shortLabel: 'Contact', icon: Headphones },
    { id: 'admin', label: 'Admin Portal', shortLabel: 'Admin', icon: ShieldCheck }
  ];

  return (
    <nav
      id="bottom-navigation-bar"
      aria-label="Navigation Sections"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_25px_rgba(0,0,0,0.08)] py-1.5 sm:py-2"
    >
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        {/* Navigation Sections Row */}
        <div className="flex items-center justify-between gap-1 sm:gap-2 overflow-x-auto no-scrollbar">
          {sections.map((section) => {
            const Icon = section.icon;
            const isActive = currentView === section.id;
            const isAdmin = section.id === 'admin';

            return (
              <button
                key={section.id}
                id={`bottom-nav-tab-${section.id}`}
                onClick={() => {
                  onNavigate(section.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`relative flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl transition-all cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-blue-600 text-white font-bold shadow-xs scale-100'
                    : 'text-slate-600 hover:text-blue-600 hover:bg-slate-100 font-medium'
                }`}
                title={section.label}
              >
                <div className="relative">
                  <Icon className={`w-4 h-4 sm:w-4.5 sm:h-4.5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  {isAdmin && isAdminAuthenticated && (
                    <span
                      className="absolute -top-1 -left-1.5 w-2 h-2 rounded-full bg-emerald-500 border border-white"
                      title="Logged in as Admin"
                    />
                  )}
                  {isAdmin && pendingCount > 0 && (
                    <span className="absolute -top-1.5 -right-2 bg-amber-500 text-white text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white shadow-2xs">
                      {pendingCount}
                    </span>
                  )}
                </div>

                <span className="text-[10px] sm:text-xs tracking-tight whitespace-nowrap">
                  <span className="sm:hidden">{section.shortLabel || section.label}</span>
                  <span className="hidden sm:inline">{section.label}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
