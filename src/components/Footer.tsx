import { Sparkles, Phone, Mail, MapPin, ShieldCheck, Clock, Home, MessageCircle } from 'lucide-react';
import { AppView } from '../types';
import { BUSINESS_OWNER_CONTACT } from '../utils/contactConfig';

interface FooterProps {
  onOpenBooking: () => void;
  onOpenTrack: () => void;
  onOpenAdmin: () => void;
  onNavigate?: (view: AppView) => void;
}

export default function Footer({ onOpenBooking, onOpenTrack, onOpenAdmin, onNavigate }: FooterProps) {
  const handleNav = (view: AppView) => {
    if (onNavigate) {
      onNavigate(view);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-slate-900 text-slate-400 py-16 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Col 1: Brand */}
          <div className="space-y-4">
            <button
              onClick={() => handleNav('home')}
              className="flex items-center gap-2.5 text-left cursor-pointer"
            >
              <div className="bg-blue-600 text-white p-2 rounded-xl">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight flex items-center gap-1.5">
                <span>A&M</span> <span className="text-blue-400">Carpet Cleaning</span>
              </span>
            </button>
            <p className="text-slate-400 text-xs leading-relaxed">
              Premium residential & commercial steam extraction for carpets, sofas, mattresses, and vehicle interiors.
              100% child, pet, and fiber safe.
            </p>
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs">
              <ShieldCheck className="w-4 h-4" />
              <span>IICRC Certified & Fully Insured</span>
            </div>
            <button
              onClick={() => handleNav('home')}
              className="inline-flex items-center gap-1.5 text-blue-400 hover:text-blue-300 font-semibold transition"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Visit Homepage Hub</span>
            </button>
          </div>

          {/* Col 2: Services */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">Cleaning Services</h4>
            <ul className="space-y-2.5">
              <li>
                <button
                  onClick={() => handleNav('services')}
                  className="hover:text-white transition text-left cursor-pointer"
                >
                  Cleaning Carpets (Deep Steam)
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('services')}
                  className="hover:text-white transition text-left cursor-pointer"
                >
                  Upholstery Cleaning (Chairs & Fabric)
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('services')}
                  className="hover:text-white transition text-left cursor-pointer"
                >
                  Couch and Sofa Cleaning
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('services')}
                  className="hover:text-white transition text-left cursor-pointer"
                >
                  Mattress Cleaning & Sanitization
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('services')}
                  className="hover:text-white transition text-left cursor-pointer"
                >
                  Water / String Treatment
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('services')}
                  className="hover:text-white transition text-left cursor-pointer"
                >
                  Area Rug Cleaning (Wool & Persian)
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('services')}
                  className="hover:text-white transition text-left cursor-pointer"
                >
                  Other Services (Auto & Commercial)
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Portals */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">Standalone Sections</h4>
            <ul className="space-y-2.5">
              <li>
                <button
                  onClick={() => handleNav('home')}
                  className="hover:text-white transition text-left cursor-pointer"
                >
                  Homepage Hub
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('services')}
                  className="hover:text-white transition text-left cursor-pointer"
                >
                  Our Services Catalog
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('search-area')}
                  className="hover:text-white transition text-left cursor-pointer"
                >
                  Search Area (State › City › ZIP)
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('calculator')}
                  className="hover:text-white transition text-left cursor-pointer"
                >
                  Instant Quote Calculator
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('bookings')}
                  className="hover:text-white transition text-left cursor-pointer"
                >
                  Bookings & Live Tracking
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('gallery')}
                  className="hover:text-white transition text-left cursor-pointer"
                >
                  Before & After Gallery
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('reviews')}
                  className="hover:text-white transition text-left cursor-pointer"
                >
                  Customer Reviews
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('contact')}
                  className="hover:text-white transition text-left cursor-pointer"
                >
                  Contact Us & Dispatch
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('admin')}
                  className="text-sky-400 hover:text-sky-300 transition font-bold flex items-center gap-1 mt-2 cursor-pointer"
                >
                  <span>Admin & Dispatch Panel</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">Business Owner Contact</h4>
            <div className="space-y-3">
              <a
                href={BUSINESS_OWNER_CONTACT.telUri}
                className="flex items-center gap-2.5 text-white hover:text-blue-400 font-bold text-sm"
                title="Call Business Owner"
              >
                <Phone className="w-4 h-4 text-blue-500" />
                <span>{BUSINESS_OWNER_CONTACT.phone}</span>
              </a>
              <a
                href={BUSINESS_OWNER_CONTACT.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-[#25D366] hover:text-emerald-400 font-bold text-sm"
                title="Chat with Owner on WhatsApp"
              >
                <MessageCircle className="w-4 h-4 fill-white/10" />
                <span>WhatsApp: {BUSINESS_OWNER_CONTACT.phone}</span>
              </a>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-blue-500 shrink-0" />
                <span>{BUSINESS_OWNER_CONTACT.email}</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                <span>Monday – Saturday: 7:30 AM – 7:00 PM<br />Sunday: 24/7 WhatsApp & Emergency</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>&copy; {new Date().getFullYear()} A&M Carpet Cleaning. All rights reserved.</p>
          <div className="flex gap-6">
            <span className="hover:text-slate-300">Privacy Policy</span>
            <span className="hover:text-slate-300">Terms of Service</span>
            <span className="hover:text-slate-300">100% Satisfaction Guarantee</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
