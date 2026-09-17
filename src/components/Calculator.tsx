import { useState } from 'react';
import { Calculator as CalcIcon, Plus, Minus, Check, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { SERVICES, ADD_ONS } from '../data/initialData';
import { BookedServiceItem, BookedAddOn } from '../types';

interface CalculatorProps {
  onProceedToBookingWithQuote: (
    items: BookedServiceItem[],
    addOns: BookedAddOn[],
    total: number,
    discount: number
  ) => void;
}

export default function Calculator({ onProceedToBookingWithQuote }: CalculatorProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Quantities for each service item initialized dynamically from SERVICES
  const [quantities, setQuantities] = useState<{ [id: string]: number }>(() => {
    const initial: { [id: string]: number } = {};
    SERVICES.forEach((s) => {
      initial[s.id] = s.id === 'living_room_carpet' ? 1 : 0;
    });
    return initial;
  });

  // Selected add-on IDs
  const [selectedAddOns, setSelectedAddOns] = useState<{ [id: string]: boolean }>({
    pet_enzyme: false,
    scotchgard_shield: true,
    heavy_traffic_pre_scrub: false,
    anti_allergen_deodorize: false
  });

  const updateQuantity = (id: string, delta: number) => {
    setQuantities((prev) => {
      const current = prev[id] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [id]: next };
    });
  };

  const toggleAddOn = (id: string) => {
    setSelectedAddOns((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Compute totals
  let subtotal = 0;
  let totalItemsCount = 0;
  const bookedServices: BookedServiceItem[] = [];

  SERVICES.forEach((service) => {
    const qty = quantities[service.id] || 0;
    if (qty > 0) {
      const itemTotal = qty * service.basePrice;
      subtotal += itemTotal;
      totalItemsCount += qty;
      bookedServices.push({
        id: service.id,
        name: service.name,
        quantity: qty,
        unitPrice: service.basePrice,
        total: itemTotal
      });
    }
  });

  const bookedAddOns: BookedAddOn[] = [];
  ADD_ONS.forEach((addon) => {
    if (selectedAddOns[addon.id]) {
      subtotal += addon.price;
      bookedAddOns.push({
        id: addon.id,
        name: addon.name,
        price: addon.price
      });
    }
  });

  // Volume discount: $15 off if subtotal > $150, $30 off if subtotal > $250
  let discount = 0;
  if (subtotal >= 250) {
    discount = 30;
  } else if (subtotal >= 150) {
    discount = 15;
  }

  const finalTotal = Math.max(0, subtotal - discount);

  // Time estimate
  const estimatedHours = Math.max(1, Math.round((totalItemsCount * 0.5 + 0.5) * 10) / 10);

  const handleBookNow = () => {
    onProceedToBookingWithQuote(bookedServices, bookedAddOns, finalTotal, discount);
  };

  return (
    <section id="calculator" className="py-20 bg-white border-b border-blue-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 text-blue-600 font-bold text-xs uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full mb-3">
            <CalcIcon className="w-3.5 h-3.5" />
            <span>Transparent Pricing Tool</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
            Instant Carpet & Upholstery Price Estimator
          </h2>
          <p className="text-slate-600 text-sm">
            Adjust the items and add-ons you need cleaned. Zero estimation guesswork—the price you see is what you pay.
          </p>
        </div>

        <div className="bg-slate-50 p-6 sm:p-9 rounded-3xl border border-slate-200 shadow-sm">
          {/* Section 1: Rooms & Items Selection */}
          <div className="mb-8">
            <div className="text-sm font-bold text-slate-900 mb-2 flex items-center justify-between">
              <span>Step 1: Select Rooms & Furniture Items</span>
              <span className="text-xs font-semibold text-blue-600">
                {totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'} selected
              </span>
            </div>

            {/* Quick Category Filter */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {[
                { id: 'all', label: 'All Services' },
                { id: 'carpet', label: 'Cleaning Carpets' },
                { id: 'upholstery', label: 'Upholstery' },
                { id: 'couch_sofa', label: 'Couches & Sofas' },
                { id: 'mattress', label: 'Mattresses' },
                { id: 'water_treatment', label: 'Water / String' },
                { id: 'area_rug', label: 'Area Rugs' },
                { id: 'other', label: 'Others' }
              ].map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setActiveCategory(c.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    activeCategory === c.id
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'bg-white text-slate-600 hover:bg-blue-50 border border-slate-200'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {SERVICES.filter((item) => activeCategory === 'all' || item.category === activeCategory).map((item) => {
                const qty = quantities[item.id] || 0;
                const isSelected = qty > 0;
                return (
                  <div
                    key={item.id}
                    className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-blue-50/70 border-blue-300 shadow-2xs'
                        : 'bg-white border-slate-200 hover:border-blue-200'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-sm text-slate-800">{item.name}</div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        <span className="font-bold text-blue-700">${item.basePrice}</span> / {item.unit}
                      </div>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, -1)}
                        disabled={qty === 0}
                        className="w-8 h-8 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-slate-700 transition cursor-pointer"
                        title="Decrease"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>

                      <span className="w-7 text-center font-extrabold text-sm text-slate-900">
                        {qty}
                      </span>

                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-8 h-8 rounded-lg border border-blue-600 bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition shadow-2xs cursor-pointer"
                        title="Increase"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: Protective Treatments & Add-ons */}
          <div className="mb-8 pt-6 border-t border-slate-200">
            <div className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Step 2: Recommended Protective Treatments & Odor Shields</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {ADD_ONS.map((addon) => {
                const isChecked = !!selectedAddOns[addon.id];
                return (
                  <label
                    key={addon.id}
                    onClick={() => toggleAddOn(addon.id)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start justify-between gap-3 ${
                      isChecked
                        ? 'bg-blue-50/80 border-blue-300 shadow-2xs'
                        : 'bg-white border-slate-200 hover:border-blue-200'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-5 h-5 rounded-md border mt-0.5 flex items-center justify-center transition ${
                          isChecked ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isChecked && <Check className="w-3.5 h-3.5" />}
                      </div>
                      <div>
                        <div className="font-bold text-sm text-slate-800">{addon.name}</div>
                        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{addon.description}</p>
                      </div>
                    </div>
                    <span className="font-extrabold text-sm text-blue-700 shrink-0">+${addon.price}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Section 3: Summary Bar */}
          <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white p-6 sm:p-8 rounded-2xl shadow-lg flex flex-col lg:flex-row justify-between items-center gap-6">
            <div className="w-full lg:w-auto">
              <div className="flex items-center gap-3">
                <span className="text-xs uppercase tracking-wider font-bold text-blue-200">
                  Estimated Total
                </span>
                {discount > 0 && (
                  <span className="bg-emerald-400 text-emerald-950 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                    ${discount} Multi-Room Savings Applied!
                  </span>
                )}
              </div>

              <div className="flex items-baseline gap-3 mt-1">
                <span className="text-4xl sm:text-5xl font-extrabold tracking-tight">${finalTotal}</span>
                {discount > 0 && (
                  <span className="text-lg text-blue-300 line-through">${subtotal}</span>
                )}
                <span className="text-xs text-blue-200 font-medium ml-2">
                  (Estimated duration: ~{estimatedHours} hrs)
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs text-blue-200 mt-2">
                <ShieldCheck className="w-4 h-4 text-sky-300" />
                <span>Includes free deep vacuuming, pre-spotting, and high-velocity dry wand pass.</span>
              </div>
            </div>

            <button
              onClick={handleBookNow}
              disabled={finalTotal === 0}
              className="w-full lg:w-auto bg-white hover:bg-blue-50 text-blue-900 px-8 py-4 rounded-xl font-extrabold text-sm transition shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              <span>Lock In Estimate & Choose Time Slot</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
