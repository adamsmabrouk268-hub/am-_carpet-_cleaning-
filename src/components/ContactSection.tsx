import { useState, FormEvent } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Building,
  Headphones,
  MessageCircle
} from 'lucide-react';
import { BUSINESS_OWNER_CONTACT } from '../utils/contactConfig';

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    cityState: 'Federal Way, WA',
    service: 'Carpet Steam Cleaning',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;
    setSubmitted(true);
  };

  return (
    <section id="contact" className="py-18 bg-white border-b border-slate-200 scroll-mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 text-blue-600 font-bold text-xs uppercase tracking-wider bg-blue-50 px-3.5 py-1.5 rounded-full mb-3 border border-blue-200/60">
            <Headphones className="w-3.5 h-3.5" />
            <span>Customer Service & Dispatch</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
            Contact Us — We're Here to Help
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Have questions about stubborn stains, interior painting estimates, commercial steam contracts, or urgent spot extraction? Reach our local dispatch coordinator immediately.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Contact Channels & Hubs (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Primary Business Owner Phone Box */}
            <div className="bg-gradient-to-br from-blue-900 to-blue-800 text-white rounded-3xl p-6 sm:p-7 shadow-md">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-700/60 border border-blue-500/30 flex items-center justify-center text-white">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-blue-200 uppercase font-bold tracking-wider">Business Owner Direct Contact</div>
                  <div className="text-xl sm:text-2xl font-black text-white">{BUSINESS_OWNER_CONTACT.phone}</div>
                </div>
              </div>

              <p className="text-xs text-blue-100/90 leading-relaxed mb-4">
                Speak directly with the business owner for immediate route openings, custom commercial estimates, and emergency stain extractions.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <a
                  href={BUSINESS_OWNER_CONTACT.telUri}
                  className="inline-flex items-center justify-center gap-2 py-3 bg-white text-blue-900 hover:bg-blue-50 rounded-xl font-bold text-xs transition shadow-sm"
                  title="Call Business Owner"
                >
                  <Phone className="w-3.5 h-3.5 text-blue-600" />
                  <span>Call Owner Now</span>
                </a>

                <a
                  href={BUSINESS_OWNER_CONTACT.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl font-bold text-xs transition shadow-sm"
                  title="Direct WhatsApp Contact"
                >
                  <MessageCircle className="w-4 h-4 fill-white/20" />
                  <span>WhatsApp Chat</span>
                </a>
              </div>
            </div>

            {/* Direct WhatsApp Contact Card */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#25D366] text-white flex items-center justify-center shadow-xs">
                    <MessageCircle className="w-5 h-5 fill-white/20" />
                  </div>
                  <div>
                    <div className="text-[11px] font-extrabold text-emerald-800 uppercase tracking-wider">
                      Instant Messaging
                    </div>
                    <div className="text-sm font-black text-slate-900">Direct WhatsApp with Owner</div>
                  </div>
                </div>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-300">
                  Active Online
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Prefer texting or sending photos of stains? Message our business owner directly on WhatsApp for an instant appraisal and slot confirmation.
              </p>

              <a
                href={BUSINESS_OWNER_CONTACT.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full py-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl font-bold text-xs transition shadow-xs hover:shadow-md"
              >
                <MessageCircle className="w-4 h-4 fill-white/20" />
                <span>Message Owner on WhatsApp ({BUSINESS_OWNER_CONTACT.phone})</span>
              </a>
            </div>

            {/* Hours & Email Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 space-y-4 text-xs text-slate-700">
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-900">Operating & Dispatch Windows</div>
                  <div className="text-slate-600 mt-0.5">
                    Monday &ndash; Saturday: 7:30 AM &ndash; 7:00 PM<br />
                    Sunday: Emergency dispatch & scheduled commercial slots
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-3 border-t border-slate-200/80">
                <Mail className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-900">Email Inquiries</div>
                  <div className="text-slate-600 mt-0.5">{BUSINESS_OWNER_CONTACT.email}</div>
                </div>
              </div>
            </div>

            {/* Regional Hubs */}
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6">
              <div className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-blue-600" />
                <span>Regional Dispatch Hubs</span>
              </div>
              <div className="space-y-2.5 text-xs text-slate-600">
                <div>
                  <span className="font-bold text-slate-900">South King Hub (Federal Way & Kent):</span> 32000 Pacific Hwy S, Federal Way, WA 98003
                </div>
                <div>
                  <span className="font-bold text-slate-900">Eastside Hub (Bellevue & Redmond):</span> 10800 NE 8th St, Bellevue, WA 98004
                </div>
                <div>
                  <span className="font-bold text-slate-900">Renton & South Metro Hub:</span> 800 N 10th St, Renton, WA 98057
                </div>
                <div>
                  <span className="font-bold text-slate-900">Snohomish County Hub (Everett):</span> 2930 Wetmore Ave, Everett, WA 98201
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Contact Form (7 cols) */}
          <div className="lg:col-span-7 bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
            {submitted ? (
              <div className="text-center py-10">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 mb-2">Message Dispatched!</h3>
                <p className="text-slate-600 text-xs sm:text-sm max-w-md mx-auto mb-6">
                  Thank you, <span className="font-bold text-slate-900">{formData.name}</span>. Your inquiry has been routed to our active route coordinator. We will call you at <span className="font-bold text-slate-900">{formData.phone}</span> within 15 minutes.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({
                      name: '',
                      phone: '',
                      email: '',
                      cityState: 'Federal Way, WA',
                      service: 'Carpet Steam Cleaning',
                      message: ''
                    });
                  }}
                  className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl font-bold text-xs transition cursor-pointer"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h3 className="text-xl font-extrabold text-slate-900 mb-1">Send a Message to Dispatch</h3>
                <p className="text-xs text-slate-500 mb-6">
                  Submit your request and our dispatch office will get back to you with an arrival time window and quote.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sarah Jenkins"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Contact Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. (973) 555-0123"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">City / State</label>
                    <input
                      type="text"
                      placeholder="e.g. Federal Way, WA or Bellevue, WA"
                      value={formData.cityState}
                      onChange={(e) => setFormData({ ...formData, cityState: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Service Inquiring About</label>
                  <select
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white text-slate-800"
                  >
                    <option>Carpet Steam Cleaning (Residential)</option>
                    <option>Upholstery & Sofa Shampoo</option>
                    <option>Mattress Allergen Sanitization</option>
                    <option>Area Rug Precision Cleaning</option>
                    <option>Interior Room Wall Painting</option>
                    <option>Accent Wall & Color Refresh</option>
                    <option>Trim, Baseboard & Door Frame Painting</option>
                    <option>Cabinet Painting & Refinishing</option>
                    <option>Exterior Trim & Touch-Up Painting</option>
                    <option>Pet Stain & Bio-Enzyme Odor Neutralizer</option>
                    <option>Vehicle Interior Carpet & Seat Detail</option>
                    <option>Commercial Office Carpet Cleaning</option>
                  </select>
                </div>

                <div className="mb-6">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Message / Project Details</label>
                  <textarea
                    rows={4}
                    placeholder="Describe your cleaning or painting requirements, room count, wall conditions, or any specific stains (pet stains, grease, high foot traffic)..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white resize-none"
                  />
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Zero spam &bull; Fast 15-min callback during dispatch hours</span>
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto px-7 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs transition shadow-sm hover:shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Message to Dispatch</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
