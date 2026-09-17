import { useState, FormEvent } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Search,
  Sparkles,
  ShieldCheck,
  Phone,
  ArrowRight,
  User,
  AlertCircle,
  Mail,
  Sofa,
  BedDouble,
  Droplets,
  Layers,
  Car,
  Armchair,
  Check,
  Plus,
  Minus,
  MessageCircle
} from 'lucide-react';
import { SERVICES, TIME_SLOTS } from '../data/initialData';
import { Booking, BookedServiceItem } from '../types';
import { addBooking } from '../utils/bookingStorage';
import { BUSINESS_OWNER_CONTACT } from '../utils/contactConfig';

interface BookingsSectionProps {
  onOpenFullBookingModal: () => void;
  onBookingCreated: (booking: Booking) => void;
  existingBookings: Booking[];
}

export default function BookingsSection({
  onOpenFullBookingModal,
  onBookingCreated,
  existingBookings
}: BookingsSectionProps) {
  const [activeTab, setActiveTab] = useState<'schedule' | 'track'>('schedule');

  // Fast booking state
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDateStr = tomorrow.toISOString().split('T')[0];

  // 1. Customer & Address Information
  const [customerName, setCustomerName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [streetAddress, setStreetAddress] = useState<string>('');
  const [zipCode, setZipCode] = useState<string>('77001');
  const [city, setCity] = useState<string>('Houston');
  const [state, setState] = useState<string>('TX');

  // 2. Service Selection (Carpet, Sofa, Mattress, or Others)
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedServices, setSelectedServices] = useState<{ [id: string]: number }>({
    living_room_carpet: 1
  });

  // 3. Appointment Date & Arrival Window
  const [date, setDate] = useState<string>(defaultDateStr);
  const [timeSlot, setTimeSlot] = useState<string>(TIME_SLOTS[0].timeRange);
  const [customerNotes, setCustomerNotes] = useState<string>('');

  const [bookingSuccess, setBookingSuccess] = useState<Booking | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Tracking state
  const [trackQuery, setTrackQuery] = useState<string>('');
  const [trackedBooking, setTrackedBooking] = useState<Booking | null>(null);
  const [trackSearched, setTrackSearched] = useState(false);

  // Toggle or increment a service item
  const handleSelectServiceItem = (serviceId: string) => {
    setSelectedServices((prev) => {
      const currentQty = prev[serviceId] || 0;
      if (currentQty === 0) {
        return { ...prev, [serviceId]: 1 };
      }
      return prev;
    });
  };

  const handleUpdateQty = (serviceId: string, delta: number) => {
    setSelectedServices((prev) => {
      const current = prev[serviceId] || 0;
      const next = Math.max(0, current + delta);
      if (next === 0) {
        const copy = { ...prev };
        delete copy[serviceId];
        return copy;
      }
      return { ...prev, [serviceId]: next };
    });
  };

  // Compute booked items & total price
  const bookedItems: BookedServiceItem[] = [];
  let totalPrice = 0;
  SERVICES.forEach((srv) => {
    const qty = selectedServices[srv.id] || 0;
    if (qty > 0) {
      const lineTotal = qty * srv.basePrice;
      totalPrice += lineTotal;
      bookedItems.push({
        id: srv.id,
        name: srv.name,
        quantity: qty,
        unitPrice: srv.basePrice,
        total: lineTotal
      });
    }
  });

  // Handle direct fast booking submission
  const handleFastBookSubmit = (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // 1. Validate Name
    if (!customerName.trim()) {
      setFormError('Please enter your full name.');
      return;
    }

    // 2. Validate Phone
    const digitsOnly = phone.replace(/\D/g, '');
    if (!phone.trim() || digitsOnly.length < 10) {
      setFormError('Please enter a valid 10-digit contact telephone number.');
      return;
    }

    // 3. Validate Email
    if (!email.trim() || !email.includes('@') || !email.includes('.')) {
      setFormError('Please enter a valid email address for confirmation.');
      return;
    }

    // 4. Validate Address
    if (!streetAddress.trim()) {
      setFormError('Please enter your service street address.');
      return;
    }

    // 5. Validate ZIP Code
    if (!zipCode.trim() || zipCode.length < 5) {
      setFormError('Please enter a valid 5-digit ZIP code.');
      return;
    }

    // 6. Validate Service Selection
    if (bookedItems.length === 0) {
      setFormError('Please select at least one service you want the cleaner to do (carpet, sofa, mattress, etc.).');
      return;
    }

    const randomId = `PC-${Math.floor(10000 + Math.random() * 90000)}`;

    const newBooking: Booking = {
      id: randomId,
      createdAt: new Date().toISOString(),
      customerName: customerName.trim(),
      phone: phone.trim(),
      email: email.trim().toLowerCase(),
      streetAddress: streetAddress.trim(),
      city: city.trim() || 'Houston',
      state: state.trim() || 'TX',
      zipCode: zipCode.trim(),
      propertyType: 'single_family',
      hasPets: false,
      parkingAccess: 'driveway',
      date,
      timeSlot,
      services: bookedItems,
      addOns: [],
      totalPrice,
      discount: 0,
      status: 'confirmed',
      technician: 'Assigned upon confirmation',
      customerNotes: customerNotes.trim() || 'Booked online',
      paymentStatus: 'unpaid'
    };

    addBooking(newBooking);
    onBookingCreated(newBooking);
    setBookingSuccess(newBooking);
  };

  // Handle tracking lookup
  const handleSearchBooking = (e?: FormEvent) => {
    if (e) e.preventDefault();
    setTrackSearched(true);
    const cleaned = trackQuery.trim().toLowerCase();
    if (!cleaned) {
      setTrackedBooking(null);
      return;
    }

    const found = existingBookings.find(
      (b) =>
        b.id.toLowerCase() === cleaned ||
        b.phone.replace(/\D/g, '').includes(cleaned.replace(/\D/g, '')) ||
        b.customerName.toLowerCase().includes(cleaned)
    );
    setTrackedBooking(found || null);
  };

  const serviceCategories = [
    { id: 'all', label: 'All Services', icon: Sparkles },
    { id: 'carpet', label: 'Carpet Cleaning', icon: Sparkles },
    { id: 'couch_sofa', label: 'Sofa / Couch Cleaning', icon: Sofa },
    { id: 'mattress', label: 'Mattress Cleaning', icon: BedDouble },
    { id: 'water_treatment', label: 'Water / String Treatment', icon: Droplets },
    { id: 'upholstery', label: 'Upholstery Cleaning', icon: Armchair },
    { id: 'area_rug', label: 'Area Rug Cleaning', icon: Layers },
    { id: 'other', label: 'Others (Auto & Commercial)', icon: Car }
  ];

  const filteredServices =
    activeCategory === 'all'
      ? SERVICES
      : SERVICES.filter((s) => s.category === activeCategory);

  return (
    <section id="bookings" className="py-18 bg-slate-100 border-b border-slate-200 scroll-mt-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 text-blue-600 font-bold text-xs uppercase tracking-wider bg-blue-50 px-3.5 py-1.5 rounded-full mb-3 border border-blue-200/60">
            <Calendar className="w-3.5 h-3.5" />
            <span>Cleaner Booking & Dispatch</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
            Book a Professional Cleaner
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Provide your contact details, service address, and the exact cleaning services you need (carpet, sofa, mattress, or others). Zero deposit required.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex p-1.5 bg-white rounded-2xl shadow-xs border border-slate-200 gap-1.5">
            <button
              onClick={() => setActiveTab('schedule')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'schedule'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Book Cleaner</span>
            </button>
            <button
              onClick={() => setActiveTab('track')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'track'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>Track Work Order</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Direct Fast Booking Card */}
        {activeTab === 'schedule' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10 max-w-4xl mx-auto">
            {bookingSuccess ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-extrabold text-slate-900 mb-2">Cleaner Booked Successfully!</h3>
                <p className="text-slate-600 text-sm mb-6 max-w-md mx-auto">
                  Thank you, <span className="font-bold text-slate-900">{bookingSuccess.customerName}</span>. Your cleaning appointment has been registered with reference ID:
                </p>

                <div className="inline-block bg-blue-50 border border-blue-200 rounded-2xl px-6 py-4 mb-6">
                  <div className="text-xs text-blue-700 font-bold uppercase tracking-wider">Booking Reference</div>
                  <div className="text-2xl sm:text-3xl font-black text-blue-900 tracking-wider font-mono">
                    {bookingSuccess.id}
                  </div>
                </div>

                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 text-left max-w-lg mx-auto space-y-2.5 text-xs text-slate-700 mb-6">
                  <div className="flex justify-between border-b border-slate-200 pb-2">
                    <span className="text-slate-500">Contact Details:</span>
                    <span className="font-bold text-slate-900">{bookingSuccess.customerName} &bull; {bookingSuccess.phone}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-2">
                    <span className="text-slate-500">Confirmation Email:</span>
                    <span className="font-bold text-slate-900">{bookingSuccess.email}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-2">
                    <span className="text-slate-500">Service Address:</span>
                    <span className="font-bold text-slate-900">{bookingSuccess.streetAddress}, {bookingSuccess.city}, {bookingSuccess.state} {bookingSuccess.zipCode}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-2">
                    <span className="text-slate-500">Scheduled Date & Time:</span>
                    <span className="font-bold text-blue-700">{bookingSuccess.date} &bull; {bookingSuccess.timeSlot}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block mb-1">Services Requested:</span>
                    <ul className="space-y-1 pl-1">
                      {bookingSuccess.services.map((s, idx) => (
                        <li key={idx} className="font-bold text-slate-800 flex justify-between">
                          <span>&bull; {s.name} (x{s.quantity})</span>
                          <span>${s.total}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex justify-between pt-2.5 border-t border-slate-200 text-sm font-bold text-slate-900">
                    <span>Estimated Total (Pay Upon Inspection):</span>
                    <span className="text-blue-600">${bookingSuccess.totalPrice}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-center gap-3">
                  <button
                    onClick={() => {
                      setBookingSuccess(null);
                      setSelectedServices({ living_room_carpet: 1 });
                    }}
                    className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-xs transition cursor-pointer"
                  >
                    Book Another Cleaner
                  </button>
                  <button
                    onClick={() => {
                      setTrackQuery(bookingSuccess.id);
                      setActiveTab('track');
                      setTrackedBooking(bookingSuccess);
                      setTrackSearched(true);
                      setBookingSuccess(null);
                    }}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs transition shadow-sm cursor-pointer"
                  >
                    Track This Booking
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleFastBookSubmit} className="space-y-8">
                {formError && (
                  <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2.5 shadow-2xs">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span className="font-semibold">{formError}</span>
                  </div>
                )}

                {/* 1. Contact & Address Information */}
                <div>
                  <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
                    <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-black flex items-center justify-center">
                      1
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                      Your Contact Details & Service Address
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                    {/* Name */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-blue-600" />
                        <span>Full Name *</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. John Doe"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50/50 focus:bg-white"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-blue-600" />
                        <span>Phone Number *</span>
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. (973) 555-0123"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50/50 focus:bg-white"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5 text-blue-600" />
                        <span>Email Address *</span>
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. john@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50/50 focus:bg-white"
                      />
                    </div>

                    {/* Address */}
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-blue-600" />
                        <span>Service Street Address *</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 1420 Westheimer Rd, Apt 4B"
                        value={streetAddress}
                        onChange={(e) => setStreetAddress(e.target.value)}
                        className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50/50 focus:bg-white"
                      />
                    </div>

                    {/* ZIP Code */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-blue-600" />
                        <span>5-Digit ZIP Code *</span>
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={5}
                        placeholder="e.g. 77001"
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value.replace(/\D/g, ''))}
                        className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50/50 focus:bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Service You Want Him to Do */}
                <div>
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-black flex items-center justify-center">
                        2
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                        Service You Want Him to Do (Carpet, Sofa, Mattress, or Others)
                      </h3>
                    </div>
                    <span className="text-xs font-semibold text-blue-600">
                      {bookedItems.length} {bookedItems.length === 1 ? 'service' : 'services'} selected
                    </span>
                  </div>

                  {/* Category Filter Tabs */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {serviceCategories.map((cat) => {
                      const isActive = activeCategory === cat.id;
                      const Icon = cat.icon;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setActiveCategory(cat.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                            isActive
                              ? 'bg-blue-600 text-white shadow-2xs'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          <span>{cat.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Services List / Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1">
                    {filteredServices.map((service) => {
                      const qty = selectedServices[service.id] || 0;
                      const isSelected = qty > 0;
                      return (
                        <div
                          key={service.id}
                          onClick={() => handleSelectServiceItem(service.id)}
                          className={`p-3.5 rounded-2xl border transition flex items-center justify-between cursor-pointer ${
                            isSelected
                              ? 'bg-blue-50/80 border-blue-600 ring-1 ring-blue-500 shadow-2xs'
                              : 'bg-white border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="pr-2 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-xs sm:text-sm text-slate-900">
                                {service.name}
                              </span>
                              {service.popular && (
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-blue-100 text-blue-800">
                                  Popular
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-500 mt-0.5">
                              {service.unit} &bull; ${service.basePrice}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
                            {isSelected ? (
                              <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-blue-200">
                                <button
                                  type="button"
                                  onClick={() => handleUpdateQty(service.id, -1)}
                                  className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center cursor-pointer"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="w-5 text-center font-bold text-xs text-blue-900">{qty}</span>
                                <button
                                  type="button"
                                  onClick={() => handleUpdateQty(service.id, 1)}
                                  className="w-6 h-6 rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center cursor-pointer"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleSelectServiceItem(service.id)}
                                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 font-bold text-xs transition cursor-pointer"
                              >
                                Select
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Date & Arrival Window */}
                <div>
                  <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
                    <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-black flex items-center justify-center">
                      3
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                      Appointment Date & Preferred Arrival Window
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Scheduled Date *
                      </label>
                      <input
                        type="date"
                        min={defaultDateStr}
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      />
                      <p className="text-[11px] text-slate-500 mt-1">
                        Technician will call 30 minutes prior to arriving at your address.
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Arrival Window *
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {TIME_SLOTS.map((slot) => {
                          const isSelected = timeSlot === slot.timeRange;
                          return (
                            <button
                              key={slot.id}
                              type="button"
                              onClick={() => setTimeSlot(slot.timeRange)}
                              className={`p-2.5 rounded-xl border text-left cursor-pointer transition ${
                                isSelected
                                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                              }`}
                            >
                              <div className="text-[11px] font-bold">{slot.label}</div>
                              <div className={`text-[10px] ${isSelected ? 'text-blue-100' : 'text-slate-500'}`}>
                                {slot.timeRange}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Special Notes / Instructions */}
                  <div className="mt-4">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Cleaner Special Instructions or Pet / Parking Notes (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Park in driveway, please focus on living room pet spots, gate code #1234"
                      value={customerNotes}
                      onChange={(e) => setCustomerNotes(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50/50 focus:bg-white"
                    />
                  </div>
                </div>

                {/* Summary & Submit Action */}
                <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <div className="text-xs text-slate-500">Estimated Total (Pay After Service):</div>
                    <div className="text-2xl font-black text-slate-900">
                      ${totalPrice}
                      <span className="text-xs font-normal text-slate-500 ml-1">
                        ({bookedItems.length} {bookedItems.length === 1 ? 'item' : 'items'})
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={onOpenFullBookingModal}
                      className="text-xs font-bold text-slate-600 hover:text-blue-600 px-3 py-2 cursor-pointer"
                    >
                      Need Add-ons?
                    </button>
                    <button
                      type="submit"
                      className="flex-1 sm:flex-initial px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm transition shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Book Cleaner Now</span>
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 flex items-center justify-between text-[11px] text-blue-900 font-medium">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>No advance deposit &bull; Pay by card or cash only after inspecting the clean</span>
                  </div>
                  <div className="hidden md:flex items-center gap-1 text-blue-700">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Rapid 2-4 hr walk-dry drying guarantee</span>
                  </div>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Tab 2: Live Tracking Lookup */}
        {activeTab === 'track' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10 max-w-3xl mx-auto">
            <div className="text-center mb-6">
              <h3 className="text-xl font-extrabold text-slate-900">Track Appointment Status</h3>
              <p className="text-xs text-slate-500 mt-1">
                Enter your Booking Reference (e.g. PC-94821) or phone number to view live dispatch status
              </p>
            </div>

            <form onSubmit={handleSearchBooking} className="flex gap-2.5 max-w-md mx-auto mb-8">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Booking ID or Phone (e.g. PC-94821)"
                  value={trackQuery}
                  onChange={(e) => setTrackQuery(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer shrink-0"
              >
                Track
              </button>
            </form>

            {/* Tracking Result */}
            {trackedBooking && (
              <div className="p-6 rounded-2xl bg-blue-50/70 border border-blue-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-blue-200">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-700">
                      Work Order Found
                    </span>
                    <h4 className="text-lg font-bold text-slate-900">
                      {trackedBooking.id} &bull; {trackedBooking.customerName}
                    </h4>
                  </div>
                  <span
                    className={`inline-flex px-3 py-1 rounded-full text-xs font-bold uppercase ${
                      trackedBooking.status === 'in_progress'
                        ? 'bg-purple-100 text-purple-700 border border-purple-200'
                        : trackedBooking.status === 'confirmed'
                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                        : trackedBooking.status === 'completed'
                        ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-100 text-amber-800 border border-amber-200'
                    }`}
                  >
                    {trackedBooking.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <div className="text-slate-500 font-medium">Scheduled Date</div>
                    <div className="font-bold text-slate-800 mt-0.5">{trackedBooking.date}</div>
                  </div>
                  <div>
                    <div className="text-slate-500 font-medium">Arrival Window</div>
                    <div className="font-bold text-slate-800 mt-0.5">{trackedBooking.timeSlot}</div>
                  </div>
                  <div>
                    <div className="text-slate-500 font-medium">Address</div>
                    <div className="font-bold text-slate-800 mt-0.5">
                      {trackedBooking.streetAddress}, {trackedBooking.city} {trackedBooking.zipCode}
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-500 font-medium">Assigned Van / Technician</div>
                    <div className="font-bold text-slate-800 mt-0.5">
                      {trackedBooking.technician || 'Dispatch pending assignment'}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-blue-200/60 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="text-slate-600 flex flex-wrap items-center gap-1.5">
                    <span>Questions? Contact owner:</span>
                    <a
                      href={BUSINESS_OWNER_CONTACT.telUri}
                      className="font-bold text-blue-700 hover:underline font-mono"
                      title="Call Owner"
                    >
                      {BUSINESS_OWNER_CONTACT.phone}
                    </a>
                    <a
                      href={BUSINESS_OWNER_CONTACT.getWhatsAppBookingUrl(trackedBooking.id, trackedBooking.customerName)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200 ml-1 transition"
                      title="Chat on WhatsApp"
                    >
                      <MessageCircle className="w-3 h-3 fill-emerald-600/20 text-emerald-600" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                  <div className="font-extrabold text-blue-900 text-sm">
                    ${trackedBooking.totalPrice}
                  </div>
                </div>
              </div>
            )}

            {trackSearched && !trackedBooking && (
              <div className="text-center py-6 text-slate-500 text-xs">
                <AlertCircle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                <p className="font-bold text-slate-800">No matching appointment found</p>
                <p className="mt-1">
                  Please verify your booking reference or phone number. You can also call the business owner directly at{' '}
                  <a href={BUSINESS_OWNER_CONTACT.telUri} className="font-bold text-blue-600 hover:underline font-mono">
                    {BUSINESS_OWNER_CONTACT.phone}
                  </a>{' '}
                  or message on{' '}
                  <a
                    href={BUSINESS_OWNER_CONTACT.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-emerald-600 hover:underline"
                  >
                    WhatsApp
                  </a>.
                </p>
              </div>
            )}

            {/* Quick sample bookings for demo testing */}
            {!trackedBooking && existingBookings.length > 0 && (
              <div className="mt-6 pt-6 border-t border-slate-100 text-xs">
                <span className="text-slate-500 font-medium mr-2">Try testing with active sample orders:</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {existingBookings.slice(0, 3).map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => {
                        setTrackQuery(b.id);
                        setTrackedBooking(b);
                        setTrackSearched(true);
                      }}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 rounded-lg font-mono text-[11px] cursor-pointer"
                    >
                      {b.id} ({b.customerName})
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
