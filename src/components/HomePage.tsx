import { useState, FormEvent } from 'react';
import {
  Sparkles,
  MapPin,
  Calculator,
  Calendar,
  Layers,
  Star,
  Phone,
  LayoutDashboard,
  Shield,
  ShieldCheck,
  Clock,
  Award,
  ArrowRight,
  Search,
  CheckCircle2,
  Truck,
  Droplets,
  DollarSign,
  AlertCircle,
  MessageCircle
} from 'lucide-react';
import { AppView, Booking, ServiceItem } from '../types';
import { SERVICES, STATES_DATA, SERVICED_ZIPS } from '../data/initialData';
import { BUSINESS_OWNER_CONTACT } from '../utils/contactConfig';

interface HomePageProps {
  onNavigate: (view: AppView) => void;
  onOpenBooking: () => void;
  onOpenTrack: () => void;
  onSelectService: (service: ServiceItem) => void;
  bookings: Booking[];
}

export default function HomePage({
  onNavigate,
  onOpenBooking,
  onOpenTrack,
  onSelectService,
  bookings
}: HomePageProps) {
  // Quick ZIP check input on homepage
  const [quickZip, setQuickZip] = useState('');
  const [quickZipResult, setQuickZipResult] = useState<{
    status: 'idle' | 'serviced' | 'not_serviced';
    city?: string;
    state?: string;
    area?: string;
  }>({ status: 'idle' });

  // Quick order tracking input on homepage
  const [quickTrackId, setQuickTrackId] = useState('');
  const [quickTrackResult, setQuickTrackResult] = useState<Booking | null | undefined>(undefined);

  const handleCheckQuickZip = (e: FormEvent) => {
    e.preventDefault();
    const cleanZip = quickZip.trim();
    if (!cleanZip) return;

    if (SERVICED_ZIPS[cleanZip]) {
      const match = SERVICED_ZIPS[cleanZip];
      setQuickZipResult({
        status: 'serviced',
        city: match.city,
        state: match.state,
        area: match.area
      });
    } else {
      setQuickZipResult({
        status: 'not_serviced'
      });
    }
  };

  const handleQuickTrack = (e: FormEvent) => {
    e.preventDefault();
    const id = quickTrackId.trim().toUpperCase();
    if (!id) return;
    const found = bookings.find((b) => b.id.toUpperCase() === id);
    setQuickTrackResult(found || null);
  };

  // Website data metrics
  const totalServices = SERVICES.length;
  const totalStates = STATES_DATA.length;
  const totalZipsServiced = Object.keys(SERVICED_ZIPS).length;
  const activeJobsCount = bookings.filter((b) => b.status === 'confirmed' || b.status === 'in_progress').length;

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* 1. HERO WITH WEBSITE DATA HIGHLIGHTS */}
      <section className="relative bg-gradient-to-b from-blue-50/90 via-white to-slate-50 py-12 sm:py-16 lg:py-20 overflow-hidden border-b border-blue-100/60">
        <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 rounded-full bg-blue-100/60 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 rounded-full bg-sky-100/50 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            {/* Left Col: Hero Pitch */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 bg-blue-100/80 border border-blue-200 text-blue-800 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase mb-5">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>Hospital-Grade Steam Cleaning & Upholstery Care</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-[1.15] mb-5">
                Fresh, Deep-Cleaned Carpets <br />
                <span className="text-blue-600">& Furniture</span> Right at Your Door.
              </h1>

              <p className="text-base sm:text-lg text-slate-600 mb-6 max-w-2xl leading-relaxed">
                Explore our full platform of cleaning solutions, check coverage across Washington State,
                calculate instant flat-rate quotes, or manage your appointment directly. Every section is built
                to stand on its own with complete transparency.
              </p>

              {/* Quick Feature Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-7 text-xs font-semibold text-slate-700">
                <div className="flex items-center gap-2 bg-white border border-blue-100 rounded-xl p-2.5 shadow-2xs">
                  <Clock className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Fast 2-4 Hr Drying</span>
                </div>
                <div className="flex items-center gap-2 bg-white border border-blue-100 rounded-xl p-2.5 shadow-2xs">
                  <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Zero Hidden Fees</span>
                </div>
                <div className="flex items-center gap-2 bg-white border border-blue-100 rounded-xl p-2.5 shadow-2xs">
                  <Award className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>IICRC Certified</span>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3.5">
                <button
                  onClick={onOpenBooking}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3.5 rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition flex items-center gap-2 cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Appointment</span>
                </button>

                <button
                  onClick={() => onNavigate('admin')}
                  className="bg-slate-900 hover:bg-black text-white px-5 py-3.5 rounded-xl font-bold text-sm shadow-md transition flex items-center gap-2 cursor-pointer"
                  title="Open Admin Panel and Dispatch Calendar"
                >
                  <Shield className="w-4 h-4 text-sky-400" />
                  <span>Admin & Calendar ({bookings.length})</span>
                </button>

                <button
                  onClick={() => onNavigate('services')}
                  className="bg-white hover:bg-blue-50 text-blue-900 border border-blue-200 px-5 py-3.5 rounded-xl font-bold text-sm shadow-2xs transition flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span>Services Catalog</span>
                </button>

                <button
                  onClick={() => onNavigate('calculator')}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-5 py-3.5 rounded-xl font-bold text-sm transition flex items-center gap-2 cursor-pointer"
                >
                  <Calculator className="w-4 h-4 text-slate-600" />
                  <span>Instant Calculator</span>
                </button>
              </div>

              {/* Trust bar */}
              <div className="mt-8 pt-6 border-t border-slate-200 flex items-center gap-4 text-xs text-slate-500">
                <div className="flex text-amber-400 font-bold text-sm">
                  ★★★★★ <span className="text-slate-800 ml-1 font-bold">4.9 / 5</span>
                </div>
                <span>•</span>
                <span>3,800+ homes & couches cleaned</span>
                <span>•</span>
                <span className="text-emerald-600 font-bold">100% Eco & Pet Safe</span>
              </div>
            </div>

            {/* Right Col: Hero Visual Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-xl border-4 border-white bg-slate-100 aspect-4/3 sm:aspect-square">
                <img
                  src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=80"
                  alt="Professional Carpet Steam Cleaning Technician"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="bg-blue-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                    Commercial Steam Extraction
                  </span>
                  <p className="text-sm font-semibold mt-1.5 text-white/95">
                    230°F hot water dissolves grime & stains on contact
                  </p>
                </div>
              </div>

              {/* Floating Status Card */}
              <div className="absolute -top-3 -left-3 bg-white/95 backdrop-blur-md p-3.5 rounded-xl shadow-lg border border-blue-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <Truck className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Live Fleet Status</div>
                  <div className="text-xs font-extrabold text-slate-900">3 Vans Active in Washington State</div>
                </div>
              </div>

              {/* Floating Guaranteed Card */}
              <div className="absolute -bottom-3 -right-3 bg-white/95 backdrop-blur-md p-3.5 rounded-xl shadow-lg border border-blue-100 max-w-[200px]">
                <div className="flex items-center gap-1.5 text-blue-600 font-bold text-xs mb-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Pet & Baby Safe</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">
                  Zero toxic residue. Fresh botanical citrus scents.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. MASTER WEBSITE DATA KPI METRICS STRIP */}
      <section className="bg-blue-900 text-white py-6 border-y border-blue-800 shadow-inner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-3">
              <div className="text-3xl sm:text-4xl font-black text-sky-300">{totalServices} Services</div>
              <p className="text-xs sm:text-sm text-blue-200 mt-1">Carpet, Sofa, Mattress & Treatment</p>
            </div>
            <div className="p-3 border-l border-blue-800/80">
              <div className="text-3xl sm:text-4xl font-black text-sky-300">{totalStates} States</div>
              <p className="text-xs sm:text-sm text-blue-200 mt-1">{totalZipsServiced}+ Active ZIP Code Zones</p>
            </div>
            <div className="p-3 border-l border-blue-800/80">
              <div className="text-3xl sm:text-4xl font-black text-sky-300">{activeJobsCount} Active Jobs</div>
              <p className="text-xs sm:text-sm text-blue-200 mt-1">Real-Time Mobile Dispatch</p>
            </div>
            <div className="p-3 border-l border-blue-800/80">
              <div className="text-3xl sm:text-4xl font-black text-sky-300">4.9 / 5.0</div>
              <p className="text-xs sm:text-sm text-blue-200 mt-1">100% Guaranteed Satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CORE SECTIONS DIRECTORY (EACH SECTION CAN STAND ON ITS OWN) */}
      <section className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
            <span>Website Architecture & Standalone Sections</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Explore Each Section On Its Own
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-3">
            Each section of A&M Carpet Cleaning and Painting is independently engineered with its own dedicated view, data inputs, and controls. Click any section below to view and use it standing completely on its own.
          </p>
        </div>

        {/* BENTO GRID OF ALL WEBSITE DATA SECTIONS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* SECTION 1: SERVICES CATALOG */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                  <Sparkles className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full border border-blue-200">
                  {totalServices} Cleaning Options
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Our Services Catalog</h3>
              <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                Full transparent pricing for deep carpet steam extraction, 3-seater sofas, L-shape sectionals, mattresses, area rugs, vehicle interiors, and commercial suites.
              </p>
              <div className="space-y-1.5 text-xs text-slate-700 mb-6 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="flex justify-between font-medium">
                  <span>• Carpet Cleaning (Living Room)</span>
                  <span className="font-bold text-blue-600">$80</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>• Sectional Sofa (L/U Shape)</span>
                  <span className="font-bold text-blue-600">$145</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>• Mattress Steam Sanitization</span>
                  <span className="font-bold text-blue-600">$70</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>• Area Rug Cleaning (Standard)</span>
                  <span className="font-bold text-blue-600">$50</span>
                </div>
              </div>
            </div>
            <div className="pt-2 flex items-center gap-2">
              <button
                onClick={() => onNavigate('services')}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Open Standalone Services</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* SECTION 2: SERVICE AREA CHECKER */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <MapPin className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full border border-emerald-200">
                  Washington State Coverage
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Search Area & Coverage</h3>
              <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                Interactive State › City › ZIP directory covering Federal Way, Everett, Renton, Kent, Redmond, Bellevue, and surrounding hubs.
              </p>

              {/* Inline Quick ZIP Tester */}
              <form onSubmit={handleCheckQuickZip} className="mb-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    maxLength={5}
                    placeholder="Enter 5-digit ZIP"
                    value={quickZip}
                    onChange={(e) => setQuickZip(e.target.value)}
                    className="flex-1 text-xs border border-slate-300 rounded-lg px-2.5 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    type="submit"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-2 rounded-lg transition cursor-pointer"
                  >
                    Check
                  </button>
                </div>
                {quickZipResult.status === 'serviced' && (
                  <div className="mt-2 text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-200 p-2 rounded-lg flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Serviced! {quickZipResult.city}, {quickZipResult.state} ({quickZipResult.area})</span>
                  </div>
                )}
                {quickZipResult.status === 'not_serviced' && (
                  <div className="mt-2 text-[11px] text-amber-800 bg-amber-50 border border-amber-200 p-2 rounded-lg flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>Outside current automated route. Contact dispatch for custom booking.</span>
                  </div>
                )}
              </form>
            </div>
            <div className="pt-2">
              <button
                onClick={() => onNavigate('search-area')}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Open Standalone Search Area</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* SECTION 3: INSTANT QUOTE CALCULATOR */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                  <Calculator className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold bg-purple-50 text-purple-700 px-2.5 py-1 rounded-full border border-purple-200">
                  Instant Estimates
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Instant Quote Calculator</h3>
              <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                Dynamically adjust quantity counters for rooms, staircases, sectionals, and add-on bio-enzymatic pet treatments or Scotchgard™ protection with zero hidden fees.
              </p>
              <div className="bg-purple-50/70 border border-purple-100 rounded-xl p-3 text-xs text-purple-950 space-y-1 mb-6">
                <div className="font-bold flex items-center gap-1 text-purple-900">
                  <DollarSign className="w-3.5 h-3.5" /> Real-Time Volume Discounts
                </div>
                <p className="text-[11px] text-purple-800">
                  Orders over $200 automatically qualify for multi-room bundle discounts and priority dispatch slot reservations.
                </p>
              </div>
            </div>
            <div className="pt-2">
              <button
                onClick={() => onNavigate('calculator')}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Open Standalone Calculator</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* SECTION 4: BOOKINGS & LIVE TRACKING */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                  <Calendar className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full border border-amber-200">
                  Live Dispatch
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Bookings & Live Tracking</h3>
              <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                Direct booking system and live dispatch lookup. Track technician truck progress, verified arrival windows, and appointment status in real time.
              </p>

              {/* Quick Tracker Search */}
              <form onSubmit={handleQuickTrack} className="mb-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Reference (e.g. PC-94821)"
                    value={quickTrackId}
                    onChange={(e) => setQuickTrackId(e.target.value)}
                    className="flex-1 text-xs border border-slate-300 rounded-lg px-2.5 py-2 outline-none focus:ring-2 focus:ring-amber-500 uppercase"
                  />
                  <button
                    type="submit"
                    className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-3 py-2 rounded-lg transition cursor-pointer"
                  >
                    Track
                  </button>
                </div>
                {quickTrackResult && (
                  <div className="mt-2 text-[11px] bg-amber-50 border border-amber-200 p-2 rounded-lg text-amber-900">
                    <span className="font-bold">{quickTrackResult.id}</span>: {quickTrackResult.status.toUpperCase()} ({quickTrackResult.city}, {quickTrackResult.state})
                  </div>
                )}
                {quickTrackResult === null && (
                  <div className="mt-2 text-[11px] text-red-700 bg-red-50 border border-red-200 p-2 rounded-lg">
                    No booking found with this ID.
                  </div>
                )}
              </form>
            </div>
            <div className="pt-2">
              <button
                onClick={() => onNavigate('bookings')}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Open Standalone Bookings</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* SECTION 5: BEFORE & AFTER GALLERY */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center">
                  <Layers className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold bg-sky-50 text-sky-700 px-2.5 py-1 rounded-full border border-sky-200">
                  Visual Results
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Before & After Gallery</h3>
              <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                Interactive split-comparison sliders showing verified residential & commercial results: stubborn coffee stains, high-traffic grime, and bio-enzyme pet urine extraction.
              </p>
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="rounded-lg overflow-hidden border border-slate-200 h-20 bg-slate-100 relative">
                  <img
                    src="https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=400&q=80"
                    alt="Before carpet"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-1 left-1 bg-red-600 text-white text-[9px] font-black px-1.5 py-0.2 rounded">BEFORE</span>
                </div>
                <div className="rounded-lg overflow-hidden border border-slate-200 h-20 bg-slate-100 relative">
                  <img
                    src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80"
                    alt="After carpet"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-1 left-1 bg-emerald-600 text-white text-[9px] font-black px-1.5 py-0.2 rounded">AFTER</span>
                </div>
              </div>
            </div>
            <div className="pt-2">
              <button
                onClick={() => onNavigate('gallery')}
                className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Open Standalone Gallery</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* SECTION 6: CUSTOMER REVIEWS */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
                  <Star className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold bg-rose-50 text-rose-700 px-2.5 py-1 rounded-full border border-rose-200">
                  4.9 / 5.0 Rating
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Customer Reviews & Trust</h3>
              <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                Read authenticated feedback from property managers, homeowners, and pet owners who experienced our rapid drying times and botanical deodorizers.
              </p>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-600 mb-6 italic">
                “Dave arrived right on time, measured everything honestly, and within 90 minutes our carpet looked practically brand new! Zero chemical smell.”
                <div className="mt-1 text-slate-800 font-bold not-italic text-[11px]">— Sarah J., Bellevue WA (Verified)</div>
              </div>
            </div>
            <div className="pt-2">
              <button
                onClick={() => onNavigate('reviews')}
                className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Open Standalone Reviews</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* SECTION 7: CONTACT US & EMERGENCY DISPATCH */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center">
                  <Phone className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold bg-teal-50 text-teal-700 px-2.5 py-1 rounded-full border border-teal-200">
                  Business Owner Direct
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Owner Contact & WhatsApp</h3>
              <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                Connect directly with the business owner for custom quotes, same-day scheduling, and immediate WhatsApp messaging.
              </p>
              <div className="space-y-2 text-xs text-slate-700 mb-6 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Phone:</span>
                  <a href={BUSINESS_OWNER_CONTACT.telUri} className="font-bold text-slate-900 text-sm hover:text-blue-600">
                    {BUSINESS_OWNER_CONTACT.phone}
                  </a>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">WhatsApp:</span>
                  <a
                    href={BUSINESS_OWNER_CONTACT.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Direct Chat</span>
                  </a>
                </div>
                <div className="flex items-center justify-between text-slate-500 text-[11px] pt-1 border-t border-slate-200">
                  <span>Hours:</span>
                  <span>Mon-Sat 7:30 AM - 7:00 PM EST</span>
                </div>
              </div>
            </div>
            <div className="pt-2 space-y-2">
              <a
                href={BUSINESS_OWNER_CONTACT.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs py-2.5 px-4 rounded-xl transition flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <MessageCircle className="w-4 h-4 fill-white/20" />
                <span>Chat with Owner on WhatsApp</span>
              </a>
              <button
                onClick={() => onNavigate('contact')}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs py-2 px-4 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Full Contact & Inquiry Form</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* SECTION 8: ADMIN & DISPATCH PANEL (WITH CALENDAR) */}
          <div className="bg-white rounded-2xl border-2 border-indigo-200 p-6 shadow-xs hover:shadow-md transition flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-bl-xl">
              Internal &bull; Calendar Inside
            </div>
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                  <Calendar className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full border border-indigo-200">
                  Dispatch Calendar & Crew Console
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Admin Panel & Dispatch Calendar 📅</h3>
              <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                Internal management hub housing the Appointment Management Calendar (Day/Week/Month views, Mon 7:30 AM Customer A, Mon 9:50 AM Customer B), work order queues, status workflows (confirm, reschedule, cancel, complete), payment recording, and technician van routing.
              </p>
              <div className="bg-indigo-50/80 p-3 rounded-xl border border-indigo-100 text-xs text-indigo-950 mb-5 space-y-1.5">
                <div className="flex items-center justify-between font-bold">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Includes Visual Dispatch Calendar</span>
                  </span>
                  <span className="bg-indigo-600 text-white px-2 py-0.5 rounded-full text-[10px] font-extrabold">
                    {bookings.length} Bookings
                  </span>
                </div>
                <div className="text-[11px] text-slate-600">
                  {bookings.filter((b) => b.status === 'pending').length} pending approval &bull; Quick action modals &bull; CRM &bull; Van schedule
                </div>
              </div>
            </div>
            <div className="pt-2">
              <button
                onClick={() => onNavigate('admin')}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>Access Admin Panel & Calendar</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* SECTION 9: CONTINUOUS SCROLL VIEW */}
          <div className="bg-gradient-to-br from-blue-700 to-indigo-800 text-white rounded-2xl p-6 shadow-xs hover:shadow-md transition flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-white/20 text-white flex items-center justify-center">
                  <Layers className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold bg-white/20 text-white px-2.5 py-1 rounded-full">
                  All Sections
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Continuous Scroll View</h3>
              <p className="text-xs text-blue-100 mb-6 leading-relaxed">
                Prefer to browse the entire website sequentially on one continuous page? You can view all sections stacked together with seamless smooth scrolling.
              </p>
            </div>
            <div className="pt-2">
              <button
                onClick={() => onNavigate('all')}
                className="w-full bg-white hover:bg-blue-50 text-blue-900 font-bold text-xs py-2.5 px-4 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
              >
                <span>View Full Page Scroll</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. BOTTOM BOOKING BANNER */}
      <section className="bg-slate-900 text-white py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">
            Ready for Revitalized, Deep-Cleaned Carpets & Furniture?
          </h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto mb-6">
            Lock in your 3-hour arrival slot online in under 2 minutes. Transparent pricing, botanical solutions, and rapid 2-4 hour drying.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onOpenBooking}
              className="bg-blue-600 hover:bg-blue-700 text-white px-7 py-3.5 rounded-xl font-bold text-sm shadow-lg transition flex items-center gap-2 cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Your Cleaning Slot</span>
            </button>
            <button
              onClick={onOpenTrack}
              className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 px-6 py-3.5 rounded-xl font-bold text-sm transition flex items-center gap-2 cursor-pointer"
            >
              <Search className="w-4 h-4 text-sky-400" />
              <span>Track Existing Appointment</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
