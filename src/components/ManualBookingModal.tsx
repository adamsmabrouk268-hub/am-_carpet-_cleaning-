import { useState, FormEvent } from 'react';
import { X, Plus, Calendar, User, Phone, MapPin, Sparkles } from 'lucide-react';
import { Booking, BookedServiceItem } from '../types';
import { getStoredServicesCatalog } from '../utils/adminStorage';
import { addBooking } from '../utils/bookingStorage';

interface ManualBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookingAdded: (booking: Booking) => void;
}

export default function ManualBookingModal({
  isOpen,
  onClose,
  onBookingAdded
}: ManualBookingModalProps) {
  const servicesList = getStoredServicesCatalog();
  const todayStr = new Date().toISOString().split('T')[0];

  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [city, setCity] = useState('Federal Way');
  const [state, setState] = useState('WA');
  const [zipCode, setZipCode] = useState('98003');
  const [date, setDate] = useState(todayStr);
  const [timeSlot, setTimeSlot] = useState('08:00 AM - 11:00 AM');
  const [technician, setTechnician] = useState('Dave & Crew 1 (Truck #3)');
  const [selectedServiceId, setSelectedServiceId] = useState(servicesList[0]?.id || 'living_room_carpet');
  const [serviceQty, setServiceQty] = useState(1);
  const [customTotal, setCustomTotal] = useState(servicesList[0]?.basePrice || 75);
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!customerName || !phone || !streetAddress) return;

    const matchedService = servicesList.find((s) => s.id === selectedServiceId) || servicesList[0];
    const serviceItems: BookedServiceItem[] = [
      {
        id: matchedService.id,
        name: matchedService.name,
        quantity: serviceQty,
        unitPrice: matchedService.basePrice,
        total: serviceQty * matchedService.basePrice
      }
    ];

    const newBooking = addBooking({
      customerName: customerName.trim(),
      phone: phone.trim(),
      email: email.trim() || 'phone-order@amcarpetcleaning.com',
      streetAddress: streetAddress.trim(),
      city: city.trim(),
      state: state.trim(),
      zipCode: zipCode.trim(),
      propertyType: 'single_family',
      hasPets: false,
      parkingAccess: 'driveway',
      date,
      timeSlot,
      services: serviceItems,
      addOns: [],
      totalPrice: customTotal,
      discount: 0,
      status: 'confirmed',
      technician,
      customerNotes: notes || 'Booked via phone dispatch',
      staffNotes: 'Direct phone dispatch order',
      paymentStatus: 'unpaid'
    });

    onBookingAdded(newBooking);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden relative flex flex-col">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-blue-50/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">New Phone / Dispatch Booking</h3>
              <p className="text-xs text-slate-500">Record a phone call appointment into schedule</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Customer Name *</label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Full Name"
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Phone Number *</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(555) 000-0000"
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Email (Optional)</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="customer@email.com"
              className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Street Address *</label>
            <input
              type="text"
              required
              value={streetAddress}
              onChange={(e) => setStreetAddress(e.target.value)}
              placeholder="1234 Main St"
              className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">State</label>
              <input
                type="text"
                value={state}
                maxLength={2}
                onChange={(e) => setState(e.target.value.toUpperCase())}
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">ZIP</label>
              <input
                type="text"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Arrival Slot</label>
              <select
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 outline-none font-semibold"
              >
                <option>08:00 AM - 11:00 AM</option>
                <option>11:30 AM - 02:30 PM</option>
                <option>03:00 PM - 06:00 PM</option>
                <option>06:00 PM - 08:30 PM</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="col-span-2">
              <label className="block font-bold text-slate-700 mb-1">Primary Service</label>
              <select
                value={selectedServiceId}
                onChange={(e) => {
                  const sId = e.target.value;
                  setSelectedServiceId(sId);
                  const matched = servicesList.find((s) => s.id === sId);
                  if (matched) setCustomTotal(matched.basePrice * serviceQty);
                }}
                className="w-full p-2.5 border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                {servicesList.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} (${s.basePrice})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Agreed Total ($)</label>
              <input
                type="number"
                value={customTotal}
                onChange={(e) => setCustomTotal(Number(e.target.value))}
                className="w-full p-2.5 border border-slate-300 rounded-xl font-bold text-blue-700 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Assigned Lead / Truck</label>
            <input
              type="text"
              value={technician}
              onChange={(e) => setTechnician(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Notes / Instructions</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Call 15 mins ahead, gate code #1234"
              className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-bold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold transition shadow-xs cursor-pointer"
            >
              Save Appointment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
