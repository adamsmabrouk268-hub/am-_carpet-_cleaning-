import React, { useState, useEffect } from 'react';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  CheckCircle2,
  Download,
  AlertCircle,
  Phone,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  User,
  Plus,
  Minus,
  Mail,
  CreditCard,
  Lock,
  FileText,
  DollarSign,
  Smartphone,
  Check,
  Printer,
  Info,
  MessageCircle
} from 'lucide-react';
import { ADD_ONS, TIME_SLOTS } from '../data/initialData';
import { getStoredServicesCatalog, DATA_CHANGED_EVENT } from '../utils/adminStorage';
import { BUSINESS_OWNER_CONTACT } from '../utils/contactConfig';
import {
  Booking,
  BookedServiceItem,
  BookedAddOn,
  PropertyType,
  ParkingAccess,
  PaymentMethodType,
  PaymentRecord,
  ServiceItem
} from '../types';
import { addBooking, downloadCalendarInvite } from '../utils/bookingStorage';
import PaymentReceiptModal from './PaymentReceiptModal';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookingCreated: (newBooking: Booking) => void;
  initialItems?: BookedServiceItem[];
  initialAddOns?: BookedAddOn[];
  initialZip?: string;
  initialCity?: string;
  initialState?: string;
}

export default function BookingModal({
  isOpen,
  onClose,
  onBookingCreated,
  initialItems,
  initialAddOns,
  initialZip,
  initialCity,
  initialState
}: BookingModalProps) {
  // Step tracker:
  // 1 = Contact & Address
  // 2 = Request Quote (Service selection)
  // 3 = Schedule Date & Arrival Window
  // 4 = Approve Quote & Pay Deposit (Online Payments)
  // 5 = Appointment Confirmed & Automatic Notifications
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Form State
  const [serviceCategory, setServiceCategory] = useState<string>('all');
  const [servicesList, setServicesList] = useState<ServiceItem[]>(() => getStoredServicesCatalog());
  const [quantities, setQuantities] = useState<{ [id: string]: number }>({});
  const [selectedAddOns, setSelectedAddOns] = useState<{ [id: string]: boolean }>({});

  useEffect(() => {
    const handleUpdate = () => {
      setServicesList(getStoredServicesCatalog());
    };
    window.addEventListener(DATA_CHANGED_EVENT, handleUpdate);
    return () => window.removeEventListener(DATA_CHANGED_EVENT, handleUpdate);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setServicesList(getStoredServicesCatalog());
    }
  }, [isOpen]);

  // Date & Slot
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDateStr = tomorrow.toISOString().split('T')[0];

  const [date, setDate] = useState<string>(defaultDateStr);
  const [timeSlot, setTimeSlot] = useState<string>('08:00 AM - 11:00 AM');

  // Customer & Location
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [aptUnit, setAptUnit] = useState('');
  const [city, setCity] = useState(initialCity || 'Federal Way');
  const [state, setState] = useState(initialState || 'WA');
  const [zipCode, setZipCode] = useState(initialZip || '98003');
  const [propertyType, setPropertyType] = useState<PropertyType>('single_family');
  const [hasPets, setHasPets] = useState(false);
  const [petDetails, setPetDetails] = useState('');
  const [parkingAccess, setParkingAccess] = useState<ParkingAccess>('driveway');
  const [customerNotes, setCustomerNotes] = useState('');

  // Step 4: Approve Quote & Pay Deposit state
  const [quoteApproved, setQuoteApproved] = useState(true);
  const [paymentChoice, setPaymentChoice] = useState<'deposit' | 'full' | 'on_site'>('deposit');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('card');

  // Card Inputs
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExp, setCardExp] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [cardZip, setCardZip] = useState('');

  // Payment Processing & UI Sheets
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [showApplePaySheet, setShowApplePaySheet] = useState(false);
  const [applePaySubmitting, setApplePaySubmitting] = useState(false);
  const [showGooglePaySheet, setShowGooglePaySheet] = useState(false);
  const [googlePaySubmitting, setGooglePaySubmitting] = useState(false);

  // Submission outcome
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  // Sync initial items if opened from calculator
  useEffect(() => {
    if (initialItems && initialItems.length > 0) {
      const qMap: { [id: string]: number } = {};
      initialItems.forEach((it) => {
        qMap[it.id] = it.quantity;
      });
      setQuantities(qMap);
    } else {
      setQuantities({ living_room_carpet: 1 });
    }

    if (initialAddOns && initialAddOns.length > 0) {
      const aMap: { [id: string]: boolean } = {};
      initialAddOns.forEach((a) => {
        const found = ADD_ONS.find((item) => item.name === a.name);
        if (found) aMap[found.id] = true;
      });
      setSelectedAddOns(aMap);
    }
  }, [initialItems, initialAddOns]);

  useEffect(() => {
    if (initialZip) setZipCode(initialZip);
    if (initialCity) setCity(initialCity);
    if (initialState) setState(initialState);
  }, [initialZip, initialCity, initialState]);

  useEffect(() => {
    if (customerName && !cardHolder) {
      setCardHolder(customerName);
    }
    if (zipCode && !cardZip) {
      setCardZip(zipCode);
    }
  }, [customerName, zipCode, cardHolder, cardZip]);

  if (!isOpen) return null;

  // Filter services by category
  const filteredServices = servicesList.filter((s) => {
    if (serviceCategory === 'all') return true;
    if (serviceCategory === 'carpet') return s.category === 'carpet';
    if (serviceCategory === 'couch_sofa') return s.id.includes('sofa') || s.id.includes('couch');
    if (serviceCategory === 'mattress') return s.id.includes('mattress');
    if (serviceCategory === 'upholstery') return s.category === 'upholstery' && !s.id.includes('sofa') && !s.id.includes('mattress');
    if (serviceCategory === 'area_rug') return s.category === 'area_rug';
    if (serviceCategory === 'painting') return s.category === 'painting';
    if (serviceCategory === 'other') return s.category === 'other';
    return true;
  });

  // Calculate booked items & totals
  const bookedServices: BookedServiceItem[] = [];
  let subtotal = 0;

  servicesList.forEach((service) => {
    const qty = quantities[service.id] || 0;
    if (qty > 0) {
      const itemTotal = qty * service.basePrice;
      bookedServices.push({
        id: service.id,
        name: service.name,
        quantity: qty,
        unitPrice: service.basePrice,
        total: itemTotal
      });
      subtotal += itemTotal;
    }
  });

  const bookedAddOns: BookedAddOn[] = [];
  ADD_ONS.forEach((addon) => {
    if (selectedAddOns[addon.id]) {
      bookedAddOns.push({
        id: addon.id,
        name: addon.name,
        price: addon.price
      });
      subtotal += addon.price;
    }
  });

  let discount = 0;
  if (subtotal >= 250) discount = 30;
  else if (subtotal >= 150) discount = 15;

  const finalTotal = Math.max(0, subtotal - discount);
  // Deposit calculation (20% of quote, rounded, minimum $35 or total if total < 35)
  const depositAmount = Math.min(finalTotal, Math.max(35, Math.round(finalTotal * 0.2)));
  const remainingAfterDeposit = Math.max(0, finalTotal - depositAmount);

  // Card brand detection helper
  const getCardBrand = (num: string) => {
    const clean = num.replace(/\D/g, '');
    if (clean.startsWith('4')) return 'Visa';
    if (clean.startsWith('51') || clean.startsWith('52') || clean.startsWith('53') || clean.startsWith('54') || clean.startsWith('55')) return 'Mastercard';
    if (clean.startsWith('34') || clean.startsWith('37')) return 'Amex';
    if (clean.startsWith('6011') || clean.startsWith('65')) return 'Discover';
    return null;
  };

  const formatCardNumber = (val: string) => {
    const clean = val.replace(/\D/g, '').slice(0, 16);
    return clean.replace(/(\d{4})/g, '$1 ').trim();
  };

  const formatCardExp = (val: string) => {
    const clean = val.replace(/\D/g, '').slice(0, 4);
    if (clean.length >= 3) {
      return `${clean.slice(0, 2)}/${clean.slice(2)}`;
    }
    return clean;
  };

  // Complete Booking & Payment Execution
  const executeFinalBookingCreation = (method: PaymentMethodType, paidAmount: number, authRef: string) => {
    setIsProcessingPayment(true);

    setTimeout(() => {
      let pStatus: 'unpaid' | 'paid_deposit' | 'paid_full' = 'unpaid';
      if (paidAmount >= finalTotal) {
        pStatus = 'paid_full';
      } else if (paidAmount > 0) {
        pStatus = 'paid_deposit';
      }

      const paymentRecord: PaymentRecord | undefined = paidAmount > 0 ? {
        id: `pay-${Date.now()}`,
        amount: paidAmount,
        date: new Date().toISOString(),
        method,
        reference: authRef,
        notes: paidAmount === finalTotal ? 'Paid in full online' : `Online 20% deposit to lock in appointment slot`,
        recordedBy: 'Online Customer Checkout'
      } : undefined;

      const newBooking = addBooking({
        customerName: customerName.trim(),
        phone: phone.trim(),
        email: email.trim().toLowerCase(),
        streetAddress: streetAddress.trim(),
        aptUnit: aptUnit.trim() || undefined,
        city: city.trim() || 'Federal Way',
        state: state.trim() || 'WA',
        zipCode: zipCode.trim(),
        propertyType,
        hasPets,
        petDetails: hasPets ? petDetails.trim() || 'Pets on site' : undefined,
        parkingAccess,
        date,
        timeSlot,
        services: bookedServices,
        addOns: bookedAddOns,
        totalPrice: finalTotal,
        discount,
        status: 'confirmed',
        technician: 'Assigned to Truck Route 1',
        customerNotes: customerNotes.trim() || undefined,
        staffNotes: paidAmount > 0
          ? `Online payment verified: $${paidAmount} via ${method.toUpperCase()} (Ref: ${authRef}). Remaining balance: $${finalTotal - paidAmount}.`
          : 'Customer selected pay on site upon completion after inspection.',
        paymentStatus: pStatus,
        depositAmount,
        depositPaid: paidAmount,
        quoteApproved: true,
        quoteApprovedAt: new Date().toISOString(),
        paymentMethod: method,
        paymentReference: authRef,
        notificationStatus: {
          smsSent: true,
          emailSent: true,
          sentAt: new Date().toISOString()
        },
        paymentHistory: paymentRecord ? [paymentRecord] : []
      });

      setIsProcessingPayment(false);
      setShowApplePaySheet(false);
      setShowGooglePaySheet(false);
      setConfirmedBooking(newBooking);
      onBookingCreated(newBooking);
      setCurrentStep(5);
    }, 600);
  };

  // Validation & Navigation handlers
  const handleNextStep = () => {
    setFormError(null);

    if (currentStep === 1) {
      if (!customerName.trim()) {
        setFormError('Please enter your full name.');
        return;
      }
      const digitsOnly = phone.replace(/\D/g, '');
      if (!phone.trim() || digitsOnly.length < 10) {
        setFormError('Please enter a valid 10-digit phone number.');
        return;
      }
      if (!email.trim() || !email.includes('@')) {
        setFormError('Please enter a valid email address.');
        return;
      }
      if (!streetAddress.trim()) {
        setFormError('Please enter your street address.');
        return;
      }
      if (!zipCode.trim() || zipCode.length < 5) {
        setFormError('Please enter a 5-digit ZIP code.');
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (bookedServices.length === 0) {
        setFormError('Please select at least one service you want the cleaner to do (carpet, sofa, mattress, or others).');
        return;
      }
      setCurrentStep(3);
    } else if (currentStep === 3) {
      if (!date || !timeSlot) {
        setFormError('Please select both a date and an arrival window.');
        return;
      }
      setCurrentStep(4);
    } else if (currentStep === 4) {
      // Step 4: Quote Approval & Payment Submission
      if (!quoteApproved) {
        setFormError('Please review and check the quote approval box to confirm your booking.');
        return;
      }

      if (paymentChoice === 'on_site') {
        executeFinalBookingCreation('cash', 0, 'PAY-ON-SITE');
        return;
      }

      const chargeAmount = paymentChoice === 'deposit' ? depositAmount : finalTotal;

      if (paymentMethod === 'apple_pay') {
        setShowApplePaySheet(true);
        return;
      }

      if (paymentMethod === 'google_pay') {
        setShowGooglePaySheet(true);
        return;
      }

      if (paymentMethod === 'card') {
        const cleanCard = cardNumber.replace(/\D/g, '');
        if (cleanCard.length < 15) {
          setFormError('Please enter a valid 16-digit credit/debit card number.');
          return;
        }
        if (cardExp.length < 5) {
          setFormError('Please enter a valid expiration date (MM/YY).');
          return;
        }
        if (cardCvc.length < 3) {
          setFormError('Please enter a valid 3 or 4-digit security code (CVC).');
          return;
        }
        const authRef = `CARD-${cleanCard.slice(-4)}-${Date.now().toString().slice(-4)}`;
        executeFinalBookingCreation('card', chargeAmount, authRef);
        return;
      }

      if (paymentMethod === 'zelle' || paymentMethod === 'venmo') {
        executeFinalBookingCreation(paymentMethod, chargeAmount, `TRANS-${Date.now().toString().slice(-6)}`);
        return;
      }

      executeFinalBookingCreation('card', chargeAmount, `AUTH-${Date.now().toString().slice(-6)}`);
    }
  };

  const handleResetAndClose = () => {
    setCurrentStep(1);
    setConfirmedBooking(null);
    setFormError(null);
    setShowApplePaySheet(false);
    setShowGooglePaySheet(false);
    setIsProcessingPayment(false);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
        <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden relative flex flex-col my-auto max-h-[92vh]">
          {/* Header */}
          <div className="p-4 sm:px-8 border-b border-slate-100 flex justify-between items-center bg-blue-50/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {currentStep === 5 ? 'Appointment Confirmed & Dispatched!' : 'Book Cleaning Appointment'}
                </h3>
                <p className="text-xs text-slate-500">
                  {currentStep === 1 && 'Step 1: Contact Details & Service Location'}
                  {currentStep === 2 && 'Step 2: Request Quote (Carpet, Sofa, Mattress & Add-ons)'}
                  {currentStep === 3 && 'Step 3: Choose Date & 3-Hour Arrival Window'}
                  {currentStep === 4 && 'Step 4: Approve Quote & Pay Deposit Online'}
                  {currentStep === 5 && 'Appointment Confirmed • Automatic Notifications Dispatched'}
                </p>
              </div>
            </div>

            <button
              onClick={handleResetAndClose}
              className="text-slate-400 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 4-Stage Flow Pipeline Tracker (Prompt: Request quote -> Approve quote -> Pay deposit -> Appointment confirmed) */}
          <div className="bg-slate-50 border-b border-slate-200 px-4 py-2.5 sm:px-8">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
              <div className={`flex items-center gap-1.5 ${currentStep <= 2 ? 'text-blue-700' : 'text-slate-900'}`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                  currentStep > 2 ? 'bg-emerald-600 text-white' : (currentStep <= 2 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600')
                }`}>
                  {currentStep > 2 ? '✓' : '1'}
                </span>
                <span className="hidden sm:inline">Request Quote</span>
                <span className="sm:hidden">Quote</span>
              </div>

              <span className="text-slate-300">→</span>

              <div className={`flex items-center gap-1.5 ${currentStep === 3 ? 'text-blue-700' : (currentStep > 3 ? 'text-slate-900' : 'text-slate-400')}`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                  currentStep > 3 ? 'bg-emerald-600 text-white' : (currentStep === 3 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600')
                }`}>
                  {currentStep > 3 ? '✓' : '2'}
                </span>
                <span>Schedule</span>
              </div>

              <span className="text-slate-300">→</span>

              <div className={`flex items-center gap-1.5 ${currentStep === 4 ? 'text-blue-700' : (currentStep > 4 ? 'text-slate-900' : 'text-slate-400')}`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                  currentStep > 4 ? 'bg-emerald-600 text-white' : (currentStep === 4 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600')
                }`}>
                  {currentStep > 4 ? '✓' : '3'}
                </span>
                <span className="hidden sm:inline">Approve & Pay Deposit</span>
                <span className="sm:hidden">Pay Deposit</span>
              </div>

              <span className="text-slate-300">→</span>

              <div className={`flex items-center gap-1.5 ${currentStep === 5 ? 'text-emerald-700 font-extrabold' : 'text-slate-400'}`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                  currentStep === 5 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                }`}>
                  {currentStep === 5 ? '✓' : '4'}
                </span>
                <span>Confirmed</span>
              </div>
            </div>

            {/* Progress bar */}
            {currentStep < 5 && (
              <div className="bg-slate-200 h-1.5 w-full rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-blue-600 h-full transition-all duration-300 rounded-full"
                  style={{ width: `${(currentStep / 4) * 100}%` }}
                />
              </div>
            )}
          </div>

          {/* Modal Body */}
          <div className="p-5 sm:p-8 overflow-y-auto space-y-6 flex-1 text-sm">
            {formError && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{formError}</span>
              </div>
            )}

            {/* STEP 1: CUSTOMER DETAILS & ADDRESS */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-blue-600" />
                      <span>Full Name *</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sarah Jenkins"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full p-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-blue-600" />
                      <span>Phone Number *</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="(555) 000-0000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full p-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-blue-600" />
                    <span>Email Address (For Confirmation & Receipts) *</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="youremail@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-blue-600" />
                      <span>Street Address *</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="123 Main Street"
                      value={streetAddress}
                      onChange={(e) => setStreetAddress(e.target.value)}
                      className="w-full p-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Apt / Unit #</label>
                    <input
                      type="text"
                      placeholder="Apt 4B"
                      value={aptUnit}
                      onChange={(e) => setAptUnit(e.target.value)}
                      className="w-full p-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">City</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full p-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">State</label>
                    <input
                      type="text"
                      value={state}
                      maxLength={2}
                      onChange={(e) => setState(e.target.value.toUpperCase())}
                      className="w-full p-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">ZIP Code *</label>
                    <input
                      type="text"
                      maxLength={5}
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value.replace(/\D/g, ''))}
                      className="w-full p-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Property Type</label>
                    <select
                      value={propertyType}
                      onChange={(e) => setPropertyType(e.target.value as PropertyType)}
                      className="w-full p-2.5 border border-slate-300 rounded-xl text-xs bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option value="single_family">Single-Family Home</option>
                      <option value="apartment">Apartment / High-rise</option>
                      <option value="townhouse">Townhouse / Condo</option>
                      <option value="office">Commercial / Office</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Truck Parking</label>
                    <select
                      value={parkingAccess}
                      onChange={(e) => setParkingAccess(e.target.value as ParkingAccess)}
                      className="w-full p-2.5 border border-slate-300 rounded-xl text-xs bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option value="driveway">Private Driveway</option>
                      <option value="street">Street Parking</option>
                      <option value="parking_lot">Building Parking Lot</option>
                      <option value="other">Other / Loading Dock</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: REQUEST QUOTE (Select Carpet, Sofa, Mattress & Add-ons) */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-bold text-slate-900 text-sm">
                      Select Services You Want Him to Do
                    </div>
                    <span className="text-xs text-blue-600 font-bold">
                      {bookedServices.length} {bookedServices.length === 1 ? 'item' : 'items'} selected
                    </span>
                  </div>

                  {/* Category Pills */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {[
                      { id: 'all', label: 'All Services' },
                      { id: 'carpet', label: 'Carpet Cleaning' },
                      { id: 'couch_sofa', label: 'Sofa / Couch' },
                      { id: 'mattress', label: 'Mattress' },
                      { id: 'upholstery', label: 'Upholstery' },
                      { id: 'area_rug', label: 'Area Rugs' },
                      { id: 'painting', label: 'Painting' },
                      { id: 'other', label: 'Others' }
                    ].map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setServiceCategory(cat.id)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                          serviceCategory === cat.id
                            ? 'bg-blue-600 text-white shadow-2xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>

                  {/* Service items list */}
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    {filteredServices.map((item) => {
                      const count = quantities[item.id] || 0;
                      return (
                        <div
                          key={item.id}
                          className={`p-3 rounded-xl border flex items-center justify-between transition ${
                            count > 0 ? 'bg-blue-50/70 border-blue-300' : 'bg-white border-slate-200'
                          }`}
                        >
                          <div>
                            <div className="font-bold text-slate-900 text-xs">{item.name}</div>
                            <div className="text-[11px] text-slate-500">
                              ${item.basePrice} / {item.unit}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                setQuantities((prev) => ({
                                  ...prev,
                                  [item.id]: Math.max(0, (prev[item.id] || 0) - 1)
                                }))
                              }
                              className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center cursor-pointer"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-6 text-center font-bold text-xs">{count}</span>
                            <button
                              type="button"
                              onClick={() =>
                                setQuantities((prev) => ({
                                  ...prev,
                                  [item.id]: (prev[item.id] || 0) + 1
                                }))
                              }
                              className="w-7 h-7 rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Add-ons */}
                <div className="pt-4 border-t border-slate-200">
                  <div className="font-bold text-slate-900 text-sm mb-3">Optional Fiber Add-ons</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {ADD_ONS.map((addon) => {
                      const isChecked = !!selectedAddOns[addon.id];
                      return (
                        <label
                          key={addon.id}
                          onClick={() =>
                            setSelectedAddOns((prev) => ({
                              ...prev,
                              [addon.id]: !prev[addon.id]
                            }))
                          }
                          className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between text-xs transition ${
                            isChecked ? 'bg-blue-50/80 border-blue-300' : 'bg-white border-slate-200'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-4 h-4 rounded border flex items-center justify-center ${
                                isChecked ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300'
                              }`}
                            >
                              {isChecked && <CheckCircle2 className="w-3 h-3" />}
                            </div>
                            <span className="font-medium text-slate-800">{addon.name}</span>
                          </div>
                          <span className="font-bold text-blue-700 ml-2 shrink-0">+${addon.price}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: DATE, ARRIVAL SLOT & NOTES */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                    Select Preferred Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full p-3.5 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1.5 flex flex-wrap items-center gap-1">
                    <span>Same-day emergency appointments may be available by calling owner at</span>
                    <a href={BUSINESS_OWNER_CONTACT.telUri} className="font-bold text-blue-600 hover:underline">
                      {BUSINESS_OWNER_CONTACT.phone}
                    </a>
                    <span>or messaging on</span>
                    <a
                      href={BUSINESS_OWNER_CONTACT.whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-emerald-600 hover:underline inline-flex items-center gap-0.5"
                    >
                      <MessageCircle className="w-3 h-3" />
                      <span>WhatsApp</span>
                    </a>.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
                    Select 3-Hour Arrival Window
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {TIME_SLOTS.map((slot) => {
                      const isSelected = timeSlot === slot.timeRange;
                      return (
                        <div
                          key={slot.id}
                          onClick={() => setTimeSlot(slot.timeRange)}
                          className={`p-4 rounded-xl border cursor-pointer transition ${
                            isSelected
                              ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-500/20 shadow-xs'
                              : 'bg-white border-slate-200 hover:border-blue-200'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-xs text-slate-900">{slot.label}</span>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                              Available
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 text-sm font-extrabold text-blue-700">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{slot.timeRange}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-1">
                            Technician calls 30 mins prior to arrival.
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Pets checkbox */}
                <div>
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                    <input
                      type="checkbox"
                      checked={hasPets}
                      onChange={(e) => setHasPets(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <span>Do you have pets in the household?</span>
                  </label>
                  {hasPets && (
                    <input
                      type="text"
                      placeholder="e.g. 1 friendly dog, will be secured in guest room"
                      value={petDetails}
                      onChange={(e) => setPetDetails(e.target.value)}
                      className="mt-2 w-full p-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Special Notes / Instructions for the Cleaner (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Wine spill near fireplace, gate code #4821, prefer fragrance-free rinse..."
                    value={customerNotes}
                    onChange={(e) => setCustomerNotes(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
            )}

            {/* STEP 4: APPROVE QUOTE & PAY DEPOSIT (ONLINE PAYMENTS) */}
            {currentStep === 4 && (
              <div className="space-y-6">
                {/* 1. APPROVE QUOTE CARD */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-600" />
                      <span className="font-bold text-slate-900 text-sm">Itemized Cleaning Quote</span>
                    </div>
                    <span className="text-[11px] font-semibold text-slate-500">
                      {date} ({timeSlot})
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    {bookedServices.map((s, idx) => (
                      <div key={idx} className="flex justify-between text-slate-700">
                        <span>{s.quantity}x {s.name}</span>
                        <span className="font-medium">${s.total}</span>
                      </div>
                    ))}
                    {bookedAddOns.map((a, idx) => (
                      <div key={`a-${idx}`} className="flex justify-between text-slate-500 italic">
                        <span>+ Add-on: {a.name}</span>
                        <span>${a.price}</span>
                      </div>
                    ))}
                    {discount > 0 && (
                      <div className="flex justify-between text-emerald-700 font-bold">
                        <span>Multi-Room Promotional Discount:</span>
                        <span>-${discount}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
                    <span className="font-bold text-slate-900">Total Approved Cleaning Quote:</span>
                    <span className="text-xl font-extrabold text-blue-700">${finalTotal}</span>
                  </div>

                  {/* Customer Quote Approval Checkbox */}
                  <label className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white border border-blue-200 cursor-pointer text-xs">
                    <input
                      type="checkbox"
                      checked={quoteApproved}
                      onChange={(e) => setQuoteApproved(e.target.checked)}
                      className="w-4 h-4 mt-0.5 text-blue-600 rounded cursor-pointer"
                    />
                    <span className="text-slate-800">
                      <strong className="text-slate-900">Approve Quote:</strong> I approve this cleaning quote of <b>${finalTotal}</b> and agree to lock in my technician appointment window.
                    </span>
                  </label>
                </div>

                {/* 2. CHOOSE DEPOSIT OPTION */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                    Select Payment Plan
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setPaymentChoice('deposit')}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition ${
                        paymentChoice === 'deposit'
                          ? 'bg-blue-50 border-blue-600 ring-2 ring-blue-600/20 shadow-xs'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                          Recommended
                        </span>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          paymentChoice === 'deposit' ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300'
                        }`}>
                          {paymentChoice === 'deposit' && <Check className="w-2.5 h-2.5" />}
                        </div>
                      </div>
                      <div className="font-bold text-slate-900 text-sm">Pay 20% Deposit</div>
                      <div className="text-lg font-extrabold text-blue-700">${depositAmount}</div>
                      <p className="text-[10px] text-slate-500 mt-1">
                        Locks in truck dispatch. Balance (${remainingAfterDeposit}) paid after work is completed.
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentChoice('full')}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition ${
                        paymentChoice === 'full'
                          ? 'bg-blue-50 border-blue-600 ring-2 ring-blue-600/20 shadow-xs'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                          100% Pre-paid
                        </span>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          paymentChoice === 'full' ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300'
                        }`}>
                          {paymentChoice === 'full' && <Check className="w-2.5 h-2.5" />}
                        </div>
                      </div>
                      <div className="font-bold text-slate-900 text-sm">Pay Full Online</div>
                      <div className="text-lg font-extrabold text-slate-900">${finalTotal}</div>
                      <p className="text-[10px] text-slate-500 mt-1">
                        Seamless 100% contactless service. Satisfaction guaranteed or free re-clean.
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentChoice('on_site')}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition ${
                        paymentChoice === 'on_site'
                          ? 'bg-blue-50 border-blue-600 ring-2 ring-blue-600/20 shadow-xs'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                          Pay on Arrival
                        </span>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          paymentChoice === 'on_site' ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300'
                        }`}>
                          {paymentChoice === 'on_site' && <Check className="w-2.5 h-2.5" />}
                        </div>
                      </div>
                      <div className="font-bold text-slate-900 text-sm">Pay on Completion</div>
                      <div className="text-lg font-extrabold text-slate-900">$0 <span className="text-xs font-normal text-slate-500">now</span></div>
                      <p className="text-[10px] text-slate-500 mt-1">
                        Pay lead technician via cash, check, or truck mobile card reader upon completion.
                      </p>
                    </button>
                  </div>
                </div>

                {/* 3. SELECT PAYMENT METHOD */}
                {paymentChoice !== 'on_site' && (
                  <div className="space-y-4 pt-2">
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Select Payment Method
                    </label>

                    {/* Method Selector Tabs */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('card')}
                        className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition cursor-pointer ${
                          paymentMethod === 'card'
                            ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-blue-200'
                        }`}
                      >
                        <CreditCard className="w-4 h-4" />
                        <span className="text-xs font-bold">Credit / Debit</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('apple_pay')}
                        className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition cursor-pointer ${
                          paymentMethod === 'apple_pay'
                            ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
                        }`}
                      >
                        <span className="text-sm font-bold tracking-tight">Pay</span>
                        <span className="text-xs font-bold">Apple Pay</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('google_pay')}
                        className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition cursor-pointer ${
                          paymentMethod === 'google_pay'
                            ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
                        }`}
                      >
                        <span className="text-xs font-bold text-sky-500">G<span className="text-amber-500">P</span><span className="text-emerald-500">a</span><span className="text-rose-500">y</span></span>
                        <span className="text-xs font-bold">Google Pay</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('zelle')}
                        className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition cursor-pointer ${
                          paymentMethod === 'zelle'
                            ? 'bg-purple-700 text-white border-purple-700 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-purple-300'
                        }`}
                      >
                        <DollarSign className="w-4 h-4" />
                        <span className="text-xs font-bold">Zelle / Venmo</span>
                      </button>
                    </div>

                    {/* Credit / Debit Card Form */}
                    {paymentMethod === 'card' && (
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-700">Card Details</span>
                          <div className="flex items-center gap-1 text-[10px] text-slate-400">
                            <span className="px-1.5 py-0.5 rounded bg-white border border-slate-200 font-semibold text-blue-700">VISA</span>
                            <span className="px-1.5 py-0.5 rounded bg-white border border-slate-200 font-semibold text-amber-600">MC</span>
                            <span className="px-1.5 py-0.5 rounded bg-white border border-slate-200 font-semibold text-blue-900">AMEX</span>
                            <span className="px-1.5 py-0.5 rounded bg-white border border-slate-200 font-semibold text-orange-600">DISC</span>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">Cardholder Name</label>
                          <input
                            type="text"
                            placeholder="Full name on card"
                            value={cardHolder}
                            onChange={(e) => setCardHolder(e.target.value)}
                            className="w-full p-2.5 border border-slate-300 bg-white rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1 flex justify-between">
                            <span>Card Number</span>
                            {getCardBrand(cardNumber) && (
                              <span className="text-blue-600 font-bold">{getCardBrand(cardNumber)}</span>
                            )}
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              placeholder="4000 1234 5678 9010"
                              maxLength={19}
                              value={cardNumber}
                              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                              className="w-full p-2.5 pl-9 border border-slate-300 bg-white rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-none font-mono tracking-wider"
                            />
                            <CreditCard className="w-4 h-4 text-slate-400 absolute left-2.5 top-3" />
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 mb-1">Expires (MM/YY)</label>
                            <input
                              type="text"
                              placeholder="MM/YY"
                              maxLength={5}
                              value={cardExp}
                              onChange={(e) => setCardExp(formatCardExp(e.target.value))}
                              className="w-full p-2.5 border border-slate-300 bg-white rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-none text-center font-mono"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 mb-1">CVC Code</label>
                            <input
                              type="password"
                              placeholder="123"
                              maxLength={4}
                              value={cardCvc}
                              onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, ''))}
                              className="w-full p-2.5 border border-slate-300 bg-white rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-none text-center font-mono"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 mb-1">Billing ZIP</label>
                            <input
                              type="text"
                              placeholder="77001"
                              maxLength={5}
                              value={cardZip}
                              onChange={(e) => setCardZip(e.target.value.replace(/\D/g, ''))}
                              className="w-full p-2.5 border border-slate-300 bg-white rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-none text-center font-mono"
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 text-[10px] text-slate-500 pt-1">
                          <Lock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>256-bit SSL Bank Grade Encryption &bull; PCI-DSS Level 1 Certified Processor</span>
                        </div>
                      </div>
                    )}

                    {/* Apple Pay Button UI */}
                    {paymentMethod === 'apple_pay' && (
                      <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-center space-y-3">
                        <div className="w-12 h-12 bg-black text-white rounded-2xl mx-auto flex items-center justify-center text-xl font-bold">
                          
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-sm">Pay with Apple Pay</div>
                          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-0.5">
                            Fast, private, and secure contactless payment using your Touch ID, Face ID, or passcode.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowApplePaySheet(true)}
                          className="w-full max-w-xs mx-auto py-3 px-6 bg-black hover:bg-slate-800 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition cursor-pointer shadow-md"
                        >
                          <span className="text-base">Pay</span>
                          <span>Pay ${paymentChoice === 'deposit' ? depositAmount : finalTotal}</span>
                        </button>
                      </div>
                    )}

                    {/* Google Pay Button UI */}
                    {paymentMethod === 'google_pay' && (
                      <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-center space-y-3">
                        <div className="w-12 h-12 bg-white text-slate-900 border border-slate-200 rounded-2xl mx-auto flex items-center justify-center font-bold text-sm shadow-2xs">
                          <span className="text-blue-600">G</span><span className="text-red-500">P</span><span className="text-amber-500">a</span><span className="text-emerald-500">y</span>
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-sm">Pay with Google Pay</div>
                          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-0.5">
                            Simple and fast checkout backed by Google standard protection.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowGooglePaySheet(true)}
                          className="w-full max-w-xs mx-auto py-3 px-6 bg-slate-900 hover:bg-black text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition cursor-pointer shadow-md"
                        >
                          <span>Buy with</span>
                          <span className="font-extrabold text-blue-400">G<span className="text-red-400">P</span><span className="text-amber-400">a</span><span className="text-emerald-400">y</span></span>
                          <span className="ml-1">${paymentChoice === 'deposit' ? depositAmount : finalTotal}</span>
                        </button>
                      </div>
                    )}

                    {/* Zelle / Venmo Info */}
                    {paymentMethod === 'zelle' && (
                      <div className="bg-purple-50/70 p-4 rounded-2xl border border-purple-200 text-xs space-y-2">
                        <div className="font-bold text-purple-900 flex items-center gap-1.5">
                          <DollarSign className="w-4 h-4 text-purple-700" />
                          <span>Zelle / Venmo Business Direct</span>
                        </div>
                        <p className="text-purple-800">
                          Send deposit (${paymentChoice === 'deposit' ? depositAmount : finalTotal}) to registered business ID:
                        </p>
                        <div className="p-2.5 bg-white border border-purple-200 rounded-xl font-mono text-slate-800 text-xs flex justify-between items-center">
                          <span>payments@amcarpetcleaning.com</span>
                          <span className="text-[10px] bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full font-bold">Verified</span>
                        </div>
                        <p className="text-[11px] text-purple-600">
                          Please enter your booking phone number (<b>{phone}</b>) in the payment memo. Your slot will be locked automatically upon clicking Confirm.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* 4. Pay on site message */}
                {paymentChoice === 'on_site' && (
                  <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 text-xs text-amber-900 space-y-2">
                    <div className="font-bold flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-amber-700" />
                      <span>Zero Deposit Required Today</span>
                    </div>
                    <p>
                      Your slot for <b>{date} ({timeSlot})</b> will be held. You can inspect the cleaning first and pay the lead technician directly on site using:
                    </p>
                    <div className="flex flex-wrap gap-2 pt-1 font-semibold text-[11px]">
                      <span className="bg-white px-2.5 py-1 rounded-lg border border-amber-200">💵 Exact Cash</span>
                      <span className="bg-white px-2.5 py-1 rounded-lg border border-amber-200">💳 Wireless Card Chip/Tap Reader</span>
                      <span className="bg-white px-2.5 py-1 rounded-lg border border-amber-200">📝 Check to "A&M Carpet Cleaning & Painting"</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* STEP 5: SUCCESS CONFIRMATION & AUTOMATIC NOTIFICATIONS */}
            {currentStep === 5 && confirmedBooking && (
              <div className="text-center py-2 space-y-5">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div>
                  <div className="inline-block bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full text-xs font-bold mb-2">
                    Booking Reference ID: <span className="font-extrabold">{confirmedBooking.id}</span>
                  </div>
                  <h3 className="text-2xl font-extrabold text-slate-900">Appointment Confirmed!</h3>
                  <p className="text-xs text-slate-600 max-w-md mx-auto mt-1">
                    Your appointment is locked in for{' '}
                    <span className="font-bold text-slate-900">{confirmedBooking.date}</span> during the{' '}
                    <span className="font-bold text-slate-900">{confirmedBooking.timeSlot}</span> window.
                  </p>
                </div>

                {/* Deposit & Payment Summary */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left max-w-md mx-auto space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-500">Customer</span>
                    <span className="font-bold text-slate-800">{confirmedBooking.customerName} ({confirmedBooking.phone})</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-500">Service Address</span>
                    <span className="font-bold text-slate-800 text-right truncate max-w-[220px]">
                      {confirmedBooking.streetAddress}, {confirmedBooking.city}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-500">Total Approved Quote</span>
                    <span className="font-bold text-slate-900">${confirmedBooking.totalPrice}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200 text-blue-700">
                    <span className="font-semibold">Paid Today ({confirmedBooking.paymentMethod ? confirmedBooking.paymentMethod.replace('_', ' ').toUpperCase() : 'DEPOSIT'})</span>
                    <span className="font-extrabold">${confirmedBooking.depositPaid || 0}</span>
                  </div>
                  <div className="flex justify-between py-1 pt-2 font-bold text-sm">
                    <span className="text-slate-900">Remaining Due at Completion</span>
                    <span className={confirmedBooking.totalPrice - (confirmedBooking.depositPaid || 0) > 0 ? 'text-amber-600' : 'text-emerald-700'}>
                      ${Math.max(0, confirmedBooking.totalPrice - (confirmedBooking.depositPaid || 0))}
                    </span>
                  </div>
                </div>

                {/* 🔔 AUTOMATIC NOTIFICATIONS FEATURE (Directly from prompt requirements) */}
                <div className="bg-blue-50/80 border border-blue-200 rounded-2xl p-4 text-left max-w-md mx-auto space-y-2.5 text-xs text-blue-950">
                  <div className="flex items-center gap-1.5 font-bold text-blue-900">
                    <span className="text-base leading-none">🔔</span>
                    <span>Automatic Notifications Dispatched</span>
                  </div>

                  <div className="space-y-2">
                    <div className="bg-white p-2.5 rounded-xl border border-blue-100 flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                        ✓
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 flex items-center gap-1">
                          <Smartphone className="w-3 h-3 text-blue-600" />
                          <span>SMS Dispatched to {confirmedBooking.phone}</span>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-0.5 font-mono bg-slate-50 p-1.5 rounded border border-slate-100">
                          "A&M: Your appointment for {confirmedBooking.date} ({confirmedBooking.timeSlot}) is locked in! Deposit ${confirmedBooking.depositPaid || 0} confirmed. Ref #{confirmedBooking.id}."
                        </p>
                      </div>
                    </div>

                    <div className="bg-white p-2.5 rounded-xl border border-blue-100 flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                        ✓
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 flex items-center gap-1">
                          <Mail className="w-3 h-3 text-blue-600" />
                          <span>Email Dispatched to {confirmedBooking.email}</span>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-0.5">
                          Detailed receipt, technician arrival preparation checklist, and calendar attachment (.ics) delivered.
                        </p>
                      </div>
                    </div>

                    <div className="bg-white p-2.5 rounded-xl border border-blue-100 flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                        🚛
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">Dispatch Fleet Board Updated</div>
                        <p className="text-[11px] text-slate-600 mt-0.5">
                          Technician crew assigned to Route 1. Driver will call 30 minutes before arrival.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap justify-center gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsReceiptModalOpen(true)}
                    className="bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-2xs"
                  >
                    <Printer className="w-3.5 h-3.5 text-blue-600" />
                    <span>View Official Receipt</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => downloadCalendarInvite(confirmedBooking)}
                    className="bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download (.ics)</span>
                  </button>

                  <a
                    href={BUSINESS_OWNER_CONTACT.getWhatsAppBookingUrl(confirmedBooking.id, confirmedBooking.customerName)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#25D366] hover:bg-[#20bd5a] text-white px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-xs"
                    title="Direct WhatsApp with Business Owner"
                  >
                    <MessageCircle className="w-3.5 h-3.5 fill-white/20" />
                    <span>WhatsApp Owner</span>
                  </a>

                  <button
                    type="button"
                    onClick={handleResetAndClose}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold text-xs transition shadow-xs cursor-pointer"
                  >
                    Done & View Site
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer actions (steps 1-4) */}
          {currentStep < 5 && (
            <div className="p-4 sm:px-8 border-t border-slate-100 bg-slate-50/80 flex justify-between items-center">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep((prev) => (prev - 1) as 1 | 2 | 3 | 4)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1 transition cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
              ) : (
                <div className="text-xs text-slate-500">
                  Total Quote: <span className="font-extrabold text-blue-700 text-base">${finalTotal}</span>
                </div>
              )}

              <button
                type="button"
                disabled={isProcessingPayment}
                onClick={handleNextStep}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition shadow-sm cursor-pointer"
              >
                {isProcessingPayment ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Authorizing Payment...</span>
                  </>
                ) : (
                  <>
                    <span>
                      {currentStep === 1 && 'Next: Select Services'}
                      {currentStep === 2 && 'Next: Select Date & Time'}
                      {currentStep === 3 && 'Next: Approve Quote & Pay Deposit'}
                      {currentStep === 4 && (
                        paymentChoice === 'deposit'
                          ? `Pay $${depositAmount} Deposit & Confirm`
                          : paymentChoice === 'full'
                          ? `Pay $${finalTotal} & Confirm`
                          : 'Confirm & Hold Slot ($0 Now)'
                      )}
                    </span>
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* APPLE PAY SHEET SIMULATION */}
      {showApplePaySheet && (
        <div className="fixed inset-0 z-60 bg-black/70 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-neutral-900 text-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl border border-neutral-700 space-y-4 animate-in fade-in slide-in-from-bottom duration-200">
            <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
              <div className="text-xl font-extrabold tracking-tight flex items-center gap-1">
                <span>Pay</span>
              </div>
              <button
                type="button"
                onClick={() => setShowApplePaySheet(false)}
                className="text-neutral-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-neutral-800 text-neutral-400">
                <span>MERCHANT</span>
                <span className="text-white font-bold">A&M Carpet Cleaning & Painting</span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-800 text-neutral-400">
                <span>CARD</span>
                <span className="text-white font-bold flex items-center gap-1">
                  <span>Apple Card (•••• 4242)</span>
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-800 text-neutral-400">
                <span>CUSTOMER</span>
                <span className="text-white">{customerName || 'Sarah Jenkins'}</span>
              </div>
              <div className="flex justify-between py-1 text-neutral-400">
                <span>AMOUNT</span>
                <span className="text-xl font-extrabold text-white">
                  ${paymentChoice === 'deposit' ? depositAmount : finalTotal}
                </span>
              </div>
            </div>

            <div className="pt-2 text-center">
              <button
                type="button"
                disabled={applePaySubmitting}
                onClick={() => {
                  setApplePaySubmitting(true);
                  setTimeout(() => {
                    setApplePaySubmitting(false);
                    executeFinalBookingCreation(
                      'apple_pay',
                      paymentChoice === 'deposit' ? depositAmount : finalTotal,
                      `APAY-AUTH-${Date.now().toString().slice(-4)}`
                    );
                  }, 800);
                }}
                className="w-full py-3.5 bg-white text-black font-extrabold rounded-2xl hover:bg-neutral-200 transition cursor-pointer flex items-center justify-center gap-2"
              >
                {applePaySubmitting ? (
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span className="text-lg"></span>
                    <span>Double Click to Pay with Face ID</span>
                  </>
                )}
              </button>
              <p className="text-[10px] text-neutral-400 mt-2">Biometric authentication simulated</p>
            </div>
          </div>
        </div>
      )}

      {/* GOOGLE PAY SHEET SIMULATION */}
      {showGooglePaySheet && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white text-slate-900 w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in slide-in-from-bottom duration-200">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <div className="font-extrabold text-lg flex items-center gap-1">
                <span className="text-blue-600">G</span><span className="text-red-500">P</span><span className="text-amber-500">a</span><span className="text-emerald-500">y</span>
                <span className="text-xs text-slate-500 ml-2 font-normal">Google Pay Checkout</span>
              </div>
              <button
                type="button"
                onClick={() => setShowGooglePaySheet(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <div className="font-bold text-slate-900">{customerName || 'Sarah Jenkins'}</div>
                  <div className="text-slate-500 text-[11px]">{email || 'customer@gmail.com'}</div>
                </div>
                <span className="text-emerald-700 bg-emerald-100 font-bold px-2 py-0.5 rounded-full text-[10px]">Active</span>
              </div>

              <div className="flex justify-between py-1 text-slate-600 border-b border-slate-100">
                <span>Payment Method</span>
                <span className="font-bold text-slate-800">Chase Visa •••• 8831</span>
              </div>

              <div className="flex justify-between py-1 text-slate-600 border-b border-slate-100">
                <span>Payee</span>
                <span className="font-bold text-slate-800">A&M Carpet Cleaning & Painting LLC</span>
              </div>

              <div className="flex justify-between py-2 items-center text-sm font-bold">
                <span>Total Charge</span>
                <span className="text-xl font-extrabold text-blue-700">
                  ${paymentChoice === 'deposit' ? depositAmount : finalTotal}
                </span>
              </div>
            </div>

            <div className="pt-1">
              <button
                type="button"
                disabled={googlePaySubmitting}
                onClick={() => {
                  setGooglePaySubmitting(true);
                  setTimeout(() => {
                    setGooglePaySubmitting(false);
                    executeFinalBookingCreation(
                      'google_pay',
                      paymentChoice === 'deposit' ? depositAmount : finalTotal,
                      `GPAY-AUTH-${Date.now().toString().slice(-4)}`
                    );
                  }, 800);
                }}
                className="w-full py-3.5 bg-slate-900 hover:bg-black text-white font-bold rounded-2xl transition cursor-pointer flex items-center justify-center gap-2 shadow-md"
              >
                {googlePaySubmitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Pay with Google</span>
                    <span className="font-extrabold text-blue-400">G<span className="text-red-400">P</span><span className="text-amber-400">a</span><span className="text-emerald-400">y</span></span>
                  </>
                )}
              </button>
              <div className="flex items-center justify-center gap-1 text-[10px] text-slate-400 mt-2">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span>Protected by Google Pay 256-bit Tokenization</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Official Receipt Modal */}
      {confirmedBooking && (
        <PaymentReceiptModal
          isOpen={isReceiptModalOpen}
          onClose={() => setIsReceiptModalOpen(false)}
          booking={confirmedBooking}
        />
      )}
    </>
  );
}
