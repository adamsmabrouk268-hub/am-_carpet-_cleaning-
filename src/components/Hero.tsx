import { Sparkles, Calendar, Calculator, CheckCircle2, ShieldCheck, Clock, Award, MessageCircle, Phone } from 'lucide-react';
import { BUSINESS_OWNER_CONTACT } from '../utils/contactConfig';

interface HeroProps {
  onOpenBooking: () => void;
}

export default function Hero({ onOpenBooking }: HeroProps) {
  return (
    <section className="relative bg-gradient-to-b from-blue-50/80 via-white to-white py-14 sm:py-20 lg:py-24 overflow-hidden">
      {/* Subtle decorative background water ripple circles */}
      <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 rounded-full bg-blue-100/50 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 rounded-full bg-sky-100/40 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Copy and CTAs */}
          <div className="lg:col-span-7">
            {/* Top Pill */}
            <div className="inline-flex items-center gap-2 bg-blue-100/80 border border-blue-200 text-blue-800 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase mb-6">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Professional Steam Cleaning & Interior Painting Care</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15] mb-6">
              Fresh, Deep-Cleaned Carpets <br />
              <span className="text-blue-600">& Flawless Painting</span> Right at Your Door.
            </h1>

            <p className="text-lg text-slate-600 mb-8 max-w-2xl leading-relaxed">
              Hospital-grade steam cleaning for carpets, sofas, mattresses, and area rugs, plus professional interior room and trim painting.
              We dissolve tough stains, eliminate allergens, and deliver precision brush and roll painting with 100% safe, non-toxic materials.
            </p>

            {/* Quick Feature Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8 text-xs font-semibold text-slate-700">
              <div className="flex items-center gap-2 bg-white/90 border border-blue-100 rounded-lg p-2.5 shadow-2xs">
                <Clock className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Fast 2-4 Hr Drying</span>
              </div>
              <div className="flex items-center gap-2 bg-white/90 border border-blue-100 rounded-lg p-2.5 shadow-2xs">
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Zero Hidden Fees</span>
              </div>
              <div className="flex items-center gap-2 bg-white/90 border border-blue-100 rounded-lg p-2.5 shadow-2xs">
                <Award className="w-4 h-4 text-blue-600 shrink-0" />
                <span>IICRC Certified</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <button
                onClick={onOpenBooking}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-7 py-3.5 sm:py-4 rounded-xl font-bold text-sm sm:text-base shadow-md hover:shadow-lg transition flex items-center justify-center gap-2.5 cursor-pointer transform hover:-translate-y-0.5"
              >
                <Calendar className="w-5 h-5" />
                <span>Book a Cleaning Slot</span>
              </button>

              <a
                href="#calculator"
                className="w-full sm:w-auto bg-white hover:bg-blue-50/50 text-blue-900 border border-blue-200 px-6 py-3.5 sm:py-4 rounded-xl font-bold text-sm sm:text-base shadow-2xs hover:shadow-sm transition flex items-center justify-center gap-2 text-center"
              >
                <Calculator className="w-5 h-5 text-blue-600" />
                <span>Calculate Instant Quote</span>
              </a>
            </div>

            {/* Direct Business Owner Contact & WhatsApp */}
            <div className="mt-4 flex flex-wrap items-center gap-2 sm:gap-2.5 text-xs text-slate-600">
              <span className="font-semibold text-slate-700">Owner Direct Line:</span>
              <a
                href={BUSINESS_OWNER_CONTACT.telUri}
                className="font-extrabold text-blue-600 hover:text-blue-800 underline underline-offset-2 font-mono"
                title="Call Business Owner"
              >
                {BUSINESS_OWNER_CONTACT.phone}
              </a>
              <span className="text-slate-300 hidden xs:inline">•</span>
              <a
                href={BUSINESS_OWNER_CONTACT.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2.5 py-1 rounded-lg transition shadow-2xs"
                title="Chat with Business Owner on WhatsApp"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-emerald-600/20 text-emerald-600" />
                <span>Chat on WhatsApp</span>
              </a>
              <span className="text-slate-400 hidden md:inline">• Mon–Sat 7:30 AM – 7:00 PM</span>
            </div>

            {/* Trust Quote / Stats */}
            <div className="mt-9 pt-7 border-t border-slate-200/80 flex items-center gap-6 text-xs text-slate-600">
              <div className="flex -space-x-2">
                <img
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover"
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                  alt="Customer"
                />
                <img
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover"
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
                  alt="Customer"
                />
                <img
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover"
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80"
                  alt="Customer"
                />
              </div>
              <div>
                <div className="flex items-center text-amber-400 font-bold text-sm">
                  ★★★★★ <span className="text-slate-800 ml-1.5 font-bold">4.9 / 5</span>
                </div>
                <span className="text-slate-500">Over 3,800+ homes & couches cleaned</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Showcase with Floating Badges */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Primary Image */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100 aspect-4/3 sm:aspect-square">
                <img
                  src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=80"
                  alt="Professional Carpet Steam Cleaning Technician"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="bg-blue-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                    Commercial Steam Extraction
                  </span>
                  <p className="text-sm font-semibold mt-1.5 text-white/90">
                    230°F hot water dissolves grime & stains on contact
                  </p>
                </div>
              </div>

              {/* Floating Badge 1: Next Slot */}
              <div className="absolute -top-4 -left-4 bg-white/95 backdrop-blur-md p-3.5 rounded-xl shadow-lg border border-blue-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  ✓
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Today / Tomorrow</div>
                  <div className="text-xs font-extrabold text-slate-900">Slots Open in Your Area</div>
                </div>
              </div>

              {/* Floating Badge 2: Pet & Kid Safe Guarantee */}
              <div className="absolute -bottom-5 -right-3 sm:-right-6 bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-xl border border-blue-100 max-w-[210px]">
                <div className="flex items-center gap-1.5 text-blue-600 font-bold text-xs mb-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Pet & Baby Safe</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">
                  100% zero harsh caustic chemicals or sticky residue.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
