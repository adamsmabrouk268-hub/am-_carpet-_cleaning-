import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import StandaloneSectionLayout from './components/StandaloneSectionLayout';
import ServicesCatalog from './components/ServicesCatalog';
import ServiceAreaChecker from './components/ServiceAreaChecker';
import Calculator from './components/Calculator';
import BookingsSection from './components/BookingsSection';
import BeforeAfterGallery from './components/BeforeAfterGallery';
import Reviews from './components/Reviews';
import ContactSection from './components/ContactSection';
import AdminPanelSection from './components/AdminPanelSection';
import AdminDashboard from './components/AdminDashboard';
import Footer from './components/Footer';
import BottomNavigation from './components/BottomNavigation';
import BookingModal from './components/BookingModal';
import TrackBookingModal from './components/TrackBookingModal';
import ManualBookingModal from './components/ManualBookingModal';
import WhatsAppFloatingButton from './components/WhatsAppFloatingButton';
import { Booking, BookedServiceItem, BookedAddOn, ServiceItem, AppView } from './types';
import { getStoredBookings, saveStoredBookings } from './utils/bookingStorage';
import AdminLogin from './components/AdminLogin';
import { Shield } from 'lucide-react';

export default function App() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [isFullAdminOpen, setIsFullAdminOpen] = useState(false);

  // Admin authentication state
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return (
        localStorage.getItem('am_admin_authenticated') === 'true' ||
        localStorage.getItem('proclean_admin_authenticated') === 'true' ||
        sessionStorage.getItem('am_admin_authenticated') === 'true' ||
        sessionStorage.getItem('proclean_admin_authenticated') === 'true'
      );
    } catch {
      return false;
    }
  });

  const handleAdminLogin = (remember: boolean) => {
    setIsAdminAuthenticated(true);
    try {
      if (remember) {
        localStorage.setItem('am_admin_authenticated', 'true');
        localStorage.setItem('am_admin_email', 'admin@amcarpetcleaning.com');
      } else {
        sessionStorage.setItem('am_admin_authenticated', 'true');
        sessionStorage.setItem('am_admin_email', 'admin@amcarpetcleaning.com');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    setIsFullAdminOpen(false);
    try {
      localStorage.removeItem('am_admin_authenticated');
      localStorage.removeItem('am_admin_email');
      localStorage.removeItem('proclean_admin_authenticated');
      localStorage.removeItem('proclean_admin_email');
      sessionStorage.removeItem('am_admin_authenticated');
      sessionStorage.removeItem('am_admin_email');
      sessionStorage.removeItem('proclean_admin_authenticated');
      sessionStorage.removeItem('proclean_admin_email');
    } catch (e) {
      console.error(e);
    }
  };

  // Modals
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);
  const [isManualBookingModalOpen, setIsManualBookingModalOpen] = useState(false);

  // Pre-filled state for booking modal
  const [bookingInitialItems, setBookingInitialItems] = useState<BookedServiceItem[] | undefined>(undefined);
  const [bookingInitialAddOns, setBookingInitialAddOns] = useState<BookedAddOn[] | undefined>(undefined);
  const [bookingInitialZip, setBookingInitialZip] = useState<string | undefined>(undefined);
  const [bookingInitialCity, setBookingInitialCity] = useState<string | undefined>(undefined);
  const [bookingInitialState, setBookingInitialState] = useState<string | undefined>(undefined);

  // Load bookings from localStorage on mount & sync initial hash
  useEffect(() => {
    const loaded = getStoredBookings();
    setBookings(loaded);

    const initialHash = window.location.hash.replace('#', '') as AppView;
    if (initialHash === 'appointments') {
      setCurrentView('admin');
      window.location.hash = '#admin';
    } else {
      const validViews: AppView[] = [
        'home',
        'services',
        'search-area',
        'calculator',
        'bookings',
        'gallery',
        'reviews',
        'contact',
        'admin',
        'all'
      ];
      if (validViews.includes(initialHash)) {
        setCurrentView(initialHash);
      }
    }
  }, []);

  // Listen to browser forward/back buttons via hashchange
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') as AppView;
      if (hash === 'appointments') {
        setCurrentView('admin');
        window.location.hash = '#admin';
        return;
      }
      const validViews: AppView[] = [
        'home',
        'services',
        'search-area',
        'calculator',
        'bookings',
        'gallery',
        'reviews',
        'contact',
        'admin',
        'all'
      ];
      if (validViews.includes(hash)) {
        setCurrentView(hash);
      } else if (!hash) {
        setCurrentView('home');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Save changes to storage whenever bookings state updates
  const handleBookingsChange = (updated: Booking[]) => {
    setBookings(updated);
    saveStoredBookings(updated);
  };

  const handleBookingCreated = (newBooking: Booking) => {
    const updated = [newBooking, ...bookings];
    setBookings(updated);
    saveStoredBookings(updated);
  };

  // Switch views and update hash
  const handleNavigate = (view: AppView) => {
    setIsFullAdminOpen(false);
    const targetView = view === 'appointments' ? 'admin' : view;
    setCurrentView(targetView);
    if (targetView === 'home') {
      window.location.hash = '';
    } else {
      window.location.hash = `#${targetView}`;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Open general booking modal
  const handleOpenGeneralBooking = () => {
    setBookingInitialItems(undefined);
    setBookingInitialAddOns(undefined);
    setBookingInitialZip(undefined);
    setBookingInitialCity(undefined);
    setBookingInitialState(undefined);
    setIsBookingModalOpen(true);
  };

  // Open booking modal with service from catalog
  const handleSelectServiceFromCatalog = (service: ServiceItem) => {
    setBookingInitialItems([
      {
        id: service.id,
        name: service.name,
        quantity: 1,
        unitPrice: service.basePrice,
        total: service.basePrice
      }
    ]);
    setBookingInitialAddOns(undefined);
    setBookingInitialZip(undefined);
    setIsBookingModalOpen(true);
  };

  // Open booking modal from quote calculator
  const handleProceedFromCalculator = (
    items: BookedServiceItem[],
    addOns: BookedAddOn[],
    _total: number,
    _discount: number
  ) => {
    setBookingInitialItems(items);
    setBookingInitialAddOns(addOns);
    setBookingInitialZip(undefined);
    setIsBookingModalOpen(true);
  };

  // Open booking modal with zip, city, state preselected from ServiceAreaChecker
  const handleSelectZipForBooking = (zip: string, city?: string, state?: string) => {
    setBookingInitialZip(zip);
    setBookingInitialCity(city);
    setBookingInitialState(state);
    setIsBookingModalOpen(true);
  };

  const pendingCount = bookings.filter((b) => b.status === 'pending').length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 selection:bg-blue-600 selection:text-white pb-28 sm:pb-32">
      {/* Top Navbar with Navigation */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenBooking={handleOpenGeneralBooking}
        onOpenTrack={() => setIsTrackModalOpen(true)}
      />

      {/* Main Content Area */}
      {isFullAdminOpen ? (
        !isAdminAuthenticated ? (
          <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
            <AdminLogin
              onLoginSuccess={handleAdminLogin}
              onCancel={() => setIsFullAdminOpen(false)}
            />
          </div>
        ) : (
          <AdminDashboard
            bookings={bookings}
            onBookingsChange={handleBookingsChange}
            onExitDashboard={() => setIsFullAdminOpen(false)}
            onLogout={handleAdminLogout}
            adminEmail="adminProClean@gmail.com"
          />
        )
      ) : (
        <main className="flex-1">
          {/* VIEW 1: DEDICATED HOMEPAGE CONSISTING OF WEBSITE DATA */}
          {currentView === 'home' && (
            <HomePage
              onNavigate={handleNavigate}
              onOpenBooking={handleOpenGeneralBooking}
              onOpenTrack={() => setIsTrackModalOpen(true)}
              onSelectService={handleSelectServiceFromCatalog}
              bookings={bookings}
            />
          )}

          {/* VIEW 2: STANDALONE SERVICES CATALOG */}
          {currentView === 'services' && (
            <StandaloneSectionLayout
              currentView="services"
              title="Our Services Catalog"
              subtitle="Full pricing catalog for deep steam carpet extraction, sofas, couches, mattresses, water treatments, area rugs, and commercial suites."
              badge="14 Cleaning Services"
              onNavigate={handleNavigate}
              onOpenBooking={handleOpenGeneralBooking}
            >
              <ServicesCatalog onSelectService={handleSelectServiceFromCatalog} />
            </StandaloneSectionLayout>
          )}

          {/* VIEW 3: STANDALONE SEARCH AREA */}
          {currentView === 'search-area' && (
            <StandaloneSectionLayout
              currentView="search-area"
              title="Search Area & Coverage Directory"
              subtitle="Select your State › City and enter your 5-digit ZIP code to verify immediate dispatch availability."
              badge="5 States & 15+ Metros"
              onNavigate={handleNavigate}
              onOpenBooking={handleOpenGeneralBooking}
            >
              <ServiceAreaChecker onSelectZipForBooking={handleSelectZipForBooking} />
            </StandaloneSectionLayout>
          )}

          {/* VIEW 4: STANDALONE INSTANT QUOTE CALCULATOR */}
          {currentView === 'calculator' && (
            <StandaloneSectionLayout
              currentView="calculator"
              title="Instant Quote Calculator"
              subtitle="Customize your rooms, furniture pieces, and specialty stain add-ons for an exact, transparent flat rate."
              badge="Flat-Rate Estimates"
              onNavigate={handleNavigate}
              onOpenBooking={handleOpenGeneralBooking}
            >
              <Calculator onProceedToBookingWithQuote={handleProceedFromCalculator} />
            </StandaloneSectionLayout>
          )}

          {/* VIEW 5: STANDALONE BOOKINGS & LIVE TRACKING */}
          {currentView === 'bookings' && (
            <StandaloneSectionLayout
              currentView="bookings"
              title="Bookings & Live Dispatch Tracking"
              subtitle="Book your 3-hour arrival window online in 2 minutes, or track your assigned cleaning technician truck in real time."
              badge="Live Order Dispatch"
              onNavigate={handleNavigate}
              onOpenBooking={handleOpenGeneralBooking}
            >
              <BookingsSection
                onOpenFullBookingModal={handleOpenGeneralBooking}
                onBookingCreated={handleBookingCreated}
                existingBookings={bookings}
              />
            </StandaloneSectionLayout>
          )}

          {/* VIEW 5B: REDIRECT APPOINTMENT MANAGEMENT CALENDAR TO ADMIN */}
          {currentView === 'appointments' && (
            <StandaloneSectionLayout
              currentView="admin"
              title="Admin & Technician Dispatch Portal"
              subtitle="The Appointment Management Calendar is integrated inside the Admin Panel."
              badge="Admin & Calendar"
              onNavigate={handleNavigate}
              onOpenBooking={handleOpenGeneralBooking}
            >
              {!isAdminAuthenticated ? (
                <AdminLogin
                  onLoginSuccess={handleAdminLogin}
                  onCancel={() => handleNavigate('home')}
                />
              ) : (
                <AdminPanelSection
                  bookings={bookings}
                  onBookingsChange={handleBookingsChange}
                  onLaunchFullAdmin={() => setIsFullAdminOpen(true)}
                  onOpenManualBooking={() => setIsManualBookingModalOpen(true)}
                  onLogout={handleAdminLogout}
                  adminEmail="adminProClean@gmail.com"
                />
              )}
            </StandaloneSectionLayout>
          )}

          {/* VIEW 6: STANDALONE BEFORE & AFTER GALLERY */}
          {currentView === 'gallery' && (
            <StandaloneSectionLayout
              currentView="gallery"
              title="Before & After Transformation Gallery"
              subtitle="Interactive split-comparison sliders showing verified residential & commercial deep steam restorations."
              badge="Real Transformations"
              onNavigate={handleNavigate}
              onOpenBooking={handleOpenGeneralBooking}
            >
              <BeforeAfterGallery />
            </StandaloneSectionLayout>
          )}

          {/* VIEW 7: STANDALONE REVIEWS */}
          {currentView === 'reviews' && (
            <StandaloneSectionLayout
              currentView="reviews"
              title="Customer Reviews & Testimonials"
              subtitle="Authenticated customer feedback from homeowners, tenants, and property managers across our service footprint."
              badge="4.9 / 5.0 Rating"
              onNavigate={handleNavigate}
              onOpenBooking={handleOpenGeneralBooking}
            >
              <Reviews />
            </StandaloneSectionLayout>
          )}

          {/* VIEW 8: STANDALONE CONTACT US */}
          {currentView === 'contact' && (
            <StandaloneSectionLayout
              currentView="contact"
              title="Contact Us & Emergency Dispatch"
              subtitle="Connect directly with our central dispatch coordinators, 24/7 water extraction squad, and regional managers."
              badge="24/7 Water Support"
              onNavigate={handleNavigate}
              onOpenBooking={handleOpenGeneralBooking}
            >
              <ContactSection />
            </StandaloneSectionLayout>
          )}

          {/* VIEW 9: STANDALONE ADMIN & CREW PANEL */}
          {currentView === 'admin' && (
            <StandaloneSectionLayout
              currentView="admin"
              title="Admin & Technician Dispatch Portal"
              subtitle="Manage work orders, assign technician vans, update payment statuses, and schedule manual phone bookings."
              badge="Crew Console"
              onNavigate={handleNavigate}
              onOpenBooking={handleOpenGeneralBooking}
            >
              {!isAdminAuthenticated ? (
                <AdminLogin
                  onLoginSuccess={handleAdminLogin}
                  onCancel={() => handleNavigate('home')}
                />
              ) : (
                <AdminPanelSection
                  bookings={bookings}
                  onBookingsChange={handleBookingsChange}
                  onLaunchFullAdmin={() => setIsFullAdminOpen(true)}
                  onOpenManualBooking={() => setIsManualBookingModalOpen(true)}
                  onLogout={handleAdminLogout}
                  adminEmail="adminProClean@gmail.com"
                />
              )}
            </StandaloneSectionLayout>
          )}

          {/* VIEW 10: ALL SECTIONS CONTINUOUS SCROLL */}
          {currentView === 'all' && (
            <div className="space-y-4">
              <div className="bg-blue-600 text-white text-center py-2 text-xs font-semibold px-4 flex items-center justify-center gap-2">
                <span>Continuous Scroll Mode (All Sections View)</span>
                <span>•</span>
                <button
                  onClick={() => handleNavigate('home')}
                  className="underline hover:text-sky-200 cursor-pointer font-bold"
                >
                  Switch back to Homepage Hub
                </button>
              </div>
              <ServicesCatalog onSelectService={handleSelectServiceFromCatalog} />
              <ServiceAreaChecker onSelectZipForBooking={handleSelectZipForBooking} />
              <Calculator onProceedToBookingWithQuote={handleProceedFromCalculator} />
              <BookingsSection
                onOpenFullBookingModal={handleOpenGeneralBooking}
                onBookingCreated={handleBookingCreated}
                existingBookings={bookings}
              />
              <BeforeAfterGallery />
              <Reviews />
              <ContactSection />
              {isAdminAuthenticated ? (
                <AdminPanelSection
                  bookings={bookings}
                  onBookingsChange={handleBookingsChange}
                  onLaunchFullAdmin={() => setIsFullAdminOpen(true)}
                  onOpenManualBooking={() => setIsManualBookingModalOpen(true)}
                  onLogout={handleAdminLogout}
                  adminEmail="adminProClean@gmail.com"
                />
              ) : (
                <div className="max-w-3xl mx-auto my-12 p-8 bg-slate-900 border border-slate-800 rounded-3xl text-center text-white shadow-xl">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-600/30 border border-blue-400/30 text-blue-300 mb-3">
                    <Shield className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    Staff Dispatch & Admin Management Console
                  </h3>
                  <p className="text-xs text-slate-400 max-w-md mx-auto mb-5">
                    Authorized dispatch login required (adminProClean@gmail.com) to view customer appointments, technician routes, and payment statuses.
                  </p>
                  <button
                    onClick={() => handleNavigate('admin')}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition cursor-pointer"
                  >
                    Login to Admin Portal
                  </button>
                </div>
              )}
            </div>
          )}
        </main>
      )}

      {/* Footer */}
      {!isFullAdminOpen && (
        <Footer
          onOpenBooking={handleOpenGeneralBooking}
          onOpenTrack={() => setIsTrackModalOpen(true)}
          onOpenAdmin={() => handleNavigate('admin')}
          onNavigate={handleNavigate}
        />
      )}

      {/* Persistent Bottom Navigation Sections */}
      {!isFullAdminOpen && (
        <>
          <BottomNavigation
            currentView={currentView}
            onNavigate={handleNavigate}
            pendingCount={pendingCount}
            isAdminAuthenticated={isAdminAuthenticated}
          />
          <WhatsAppFloatingButton />
        </>
      )}

      {/* Customer Full Itemized Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        onBookingCreated={handleBookingCreated}
        initialItems={bookingInitialItems}
        initialAddOns={bookingInitialAddOns}
        initialZip={bookingInitialZip}
        initialCity={bookingInitialCity}
        initialState={bookingInitialState}
      />

      {/* Customer Track Booking Modal */}
      <TrackBookingModal
        isOpen={isTrackModalOpen}
        onClose={() => setIsTrackModalOpen(false)}
        bookings={bookings}
        onBookingUpdated={(updated) => {
          const next = bookings.map((b) => (b.id === updated.id ? updated : b));
          handleBookingsChange(next);
        }}
      />

      {/* Internal Phone Dispatch Booking Modal */}
      <ManualBookingModal
        isOpen={isManualBookingModalOpen}
        onClose={() => setIsManualBookingModalOpen(false)}
        onBookingAdded={(newB) => {
          handleBookingCreated(newB);
          setIsManualBookingModalOpen(false);
        }}
      />
    </div>
  );
}
