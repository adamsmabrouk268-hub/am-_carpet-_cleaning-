export const BUSINESS_OWNER_CONTACT = {
  name: 'A&M Carpet Cleaning - Owner & Dispatch',
  phone: '+1 (973) 609-4520',
  phoneRaw: '+19736094520',
  phoneNumeric: '19736094520',
  telUri: 'tel:+19736094520',
  whatsappNumber: '19736094520',
  whatsappDisplay: '+1 (973) 609-4520',
  whatsappUrl:
    'https://wa.me/19736094520?text=Hello%20A%26M%20Carpet%20Cleaning!%20I%20would%20like%20to%20get%20a%20cleaning%20quote%20or%20book%20an%20appointment.',
  email: 'dispatch@amcarpetcleaning.com',
  hours: 'Monday – Saturday: 7:30 AM – 7:00 PM EST (24/7 WhatsApp & Emergency)',
  getWhatsAppBookingUrl: (bookingId?: string, customerName?: string) => {
    let msg = 'Hello A&M Carpet Cleaning!';
    if (bookingId) {
      msg += ` I have an inquiry about booking #${bookingId}`;
    }
    if (customerName) {
      msg += ` for ${customerName}`;
    }
    msg += '.';
    return `https://wa.me/19736094520?text=${encodeURIComponent(msg)}`;
  }
};
