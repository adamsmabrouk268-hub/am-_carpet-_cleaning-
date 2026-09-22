import { useState } from 'react';
import { MessageCircle, Phone, X, Sparkles, CheckCircle2 } from 'lucide-react';
import { BUSINESS_OWNER_CONTACT } from '../utils/contactConfig';

export default function WhatsAppFloatingButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-20 right-4 sm:bottom-24 sm:right-6 z-40 flex flex-col items-end">
      {/* Quick Contact Card Popup */}
      {isOpen && (
        <div className="mb-3 w-72 sm:w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-4 flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center text-white">
                <MessageCircle className="w-5 h-5 fill-white/20" />
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-emerald-100 flex items-center gap-1">
                  <span>Direct Owner Contact</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                </div>
                <div className="text-sm font-extrabold text-white">A&M Carpet Cleaning & Painting</div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition cursor-pointer"
              title="Close chat box"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 space-y-3 text-xs bg-slate-50">
            <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs space-y-1">
              <p className="text-slate-700 leading-relaxed font-medium">
                👋 Hello! Need an instant quote, stain removal advice, or emergency appointment? Reach out directly to our business owner:
              </p>
              <div className="pt-1.5 flex items-center gap-1.5 font-mono font-bold text-slate-900 text-xs">
                <span>{BUSINESS_OWNER_CONTACT.phone}</span>
                <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                  Online
                </span>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              {/* Direct WhatsApp Action */}
              <a
                href={BUSINESS_OWNER_CONTACT.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white py-2.5 px-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-xs hover:shadow-md transition text-xs"
              >
                <MessageCircle className="w-4 h-4 fill-white/20" />
                <span>Chat on WhatsApp</span>
              </a>

              {/* Direct Phone Call Action */}
              <a
                href={BUSINESS_OWNER_CONTACT.telUri}
                className="w-full bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 py-2.5 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition text-xs"
              >
                <Phone className="w-4 h-4 text-blue-600" />
                <span>Call Owner: {BUSINESS_OWNER_CONTACT.phone}</span>
              </a>
            </div>

            <div className="text-[10px] text-slate-400 text-center flex items-center justify-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-500" />
              <span>Fast response usually in under 5 minutes</span>
            </div>
          </div>
        </div>
      )}

      {/* Floating Pill / Trigger Button */}
      <div className="flex items-center gap-2">
        {!isOpen && (
          <a
            href={BUSINESS_OWNER_CONTACT.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 bg-white text-slate-800 hover:text-emerald-700 px-3 py-1.5 rounded-full shadow-lg border border-slate-200/80 text-xs font-bold hover:shadow-xl transition"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Chat on WhatsApp</span>
          </a>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative bg-[#25D366] hover:bg-[#20bd5a] text-white p-3.5 sm:p-4 rounded-full shadow-xl hover:shadow-2xl transition transform hover:scale-105 active:scale-95 flex items-center justify-center cursor-pointer border-2 border-white"
          aria-label="Direct Contact WhatsApp Business Owner"
          title="Direct Contact WhatsApp Business Owner (+1 (973) 609-4520)"
        >
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border border-white"></span>
          </span>
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <MessageCircle className="w-6 h-6 fill-white/20" />
          )}
        </button>
      </div>
    </div>
  );
}
