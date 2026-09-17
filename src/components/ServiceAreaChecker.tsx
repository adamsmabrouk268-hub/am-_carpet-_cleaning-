import { useState, useEffect } from 'react';
import { MapPin, Search, CheckCircle2, AlertCircle, ArrowRight, Building2, ChevronRight, Sparkles, Navigation } from 'lucide-react';
import { SERVICED_ZIPS, StateCoverage, CityCoverage } from '../data/initialData';
import { getStoredStatesCoverage, DATA_CHANGED_EVENT } from '../utils/adminStorage';
import { BUSINESS_OWNER_CONTACT } from '../utils/contactConfig';

interface ServiceAreaCheckerProps {
  onSelectZipForBooking: (zip: string, city?: string, state?: string) => void;
}

export default function ServiceAreaChecker({ onSelectZipForBooking }: ServiceAreaCheckerProps) {
  const [statesData, setStatesData] = useState<StateCoverage[]>(() => getStoredStatesCoverage());

  useEffect(() => {
    const handleUpdate = () => {
      setStatesData(getStoredStatesCoverage());
    };
    window.addEventListener(DATA_CHANGED_EVENT, handleUpdate);
    return () => window.removeEventListener(DATA_CHANGED_EVENT, handleUpdate);
  }, []);

  // Navigation hierarchy: State > City > ZIP code
  const [selectedStateCode, setSelectedStateCode] = useState<string>('TX'); // Default Texas as requested
  const [selectedCityName, setSelectedCityName] = useState<string>('Houston'); // Default Houston as requested
  const [zipInput, setZipInput] = useState<string>('');

  // Result state
  const [result, setResult] = useState<{
    status: 'idle' | 'success' | 'unsupported';
    message: string;
    details?: string;
    zip?: string;
    city?: string;
    state?: string;
  }>({ status: 'idle', message: '' });

  // Currently selected State object
  const currentState: StateCoverage =
    statesData.find((s) => s.stateCode === selectedStateCode) || statesData[0] || {
      stateCode: 'TX',
      stateName: 'Texas',
      cities: []
    };

  // Currently selected City object
  const currentCity: CityCoverage =
    currentState.cities.find((c) => c.cityName === selectedCityName) || currentState.cities[0] || {
      cityName: 'Houston',
      description: 'Metropolitan Area',
      zips: [],
      popularZips: []
    };

  // Handle switching state
  const handleStateChange = (code: string) => {
    setSelectedStateCode(code);
    const newState = statesData.find((s) => s.stateCode === code) || statesData[0];
    if (newState && newState.cities.length > 0) {
      const defaultCity = newState.cities[0];
      setSelectedCityName(defaultCity.cityName);
    }
    setZipInput('');
    setResult({ status: 'idle', message: '' });
  };

  // Handle switching city
  const handleCityChange = (cityName: string) => {
    setSelectedCityName(cityName);
    setZipInput('');
    setResult({ status: 'idle', message: '' });
  };

  // Validate ZIP code
  const handleCheckZip = (customZip?: string) => {
    const zip = (customZip || zipInput).trim();
    if (!zip || zip.length < 5) {
      setResult({
        status: 'unsupported',
        message: 'Please enter a valid 5-digit U.S. ZIP code.'
      });
      return;
    }

    // Check dynamic states coverage for exact zip match
    let matchedCityInfo: { city: string; state: string; area?: string } | null = null;
    for (const st of statesData) {
      for (const ct of st.cities) {
        if (ct.zips.includes(zip)) {
          matchedCityInfo = { city: ct.cityName, state: st.stateCode, area: ct.description };
          break;
        }
      }
      if (matchedCityInfo) break;
    }

    if (matchedCityInfo) {
      setResult({
        status: 'success',
        message: `Availability Confirmed for ZIP ${zip}!`,
        details: `We service ${matchedCityInfo.city}, ${matchedCityInfo.state} (${matchedCityInfo.area || 'Service Area'}). High-pressure truck-mount steam extraction vans available with $0 travel surcharge!`,
        zip,
        city: matchedCityInfo.city,
        state: matchedCityInfo.state
      });
      return;
    }

    // Check if zip is in our initial database
    if (SERVICED_ZIPS[zip]) {
      const match = SERVICED_ZIPS[zip];
      setResult({
        status: 'success',
        message: `Availability Confirmed for ZIP ${zip}!`,
        details: `We service ${match.city}, ${match.state} (${match.area}). High-pressure truck-mount steam extraction vans available with $0 travel surcharge!`,
        zip,
        city: match.city,
        state: match.state
      });
    } else if (currentCity.zips.includes(zip)) {
      setResult({
        status: 'success',
        message: `Availability Confirmed for ZIP ${zip} (${currentCity.cityName}, ${currentState.stateName})!`,
        details: `${currentCity.description}. Local mobile steam units open for same-day & next-day arrival windows.`,
        zip,
        city: currentCity.cityName,
        state: currentState.stateCode
      });
    } else if (/^[79362]\d{4}$/.test(zip)) {
      // Regional match
      setResult({
        status: 'success',
        message: `Service is available for ZIP ${zip}!`,
        details: `Standard regional crew covers this route. Open morning and afternoon arrival windows available.`,
        zip,
        city: currentCity.cityName,
        state: currentState.stateCode
      });
    } else {
      setResult({
        status: 'unsupported',
        message: `No direct online route found for ZIP ${zip}.`,
        details: `Our crews currently operate across ${currentState.stateName} and nearby metro zones. Contact business owner directly at ${BUSINESS_OWNER_CONTACT.phone} or chat on WhatsApp for custom route accommodation.`
      });
    }
  };

  return (
    <section id="search-area" className="py-18 bg-white border-b border-slate-200 scroll-mt-20">
      {/* Anchor alias for old links */}
      <div id="areas" className="-top-24 relative" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 text-blue-600 font-bold text-xs uppercase tracking-wider bg-blue-50 px-3.5 py-1.5 rounded-full mb-3 border border-blue-100">
            <MapPin className="w-3.5 h-3.5" />
            <span>Service Coverage Area</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
            Find Coverage: Choose State &rsaquo; City &rsaquo; ZIP Code
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Select your state and metropolitan city below, then enter your zip code to confirm truck-mount van availability and lock in zero travel fees.
          </p>
        </div>

        {/* Multi-step Interactive Selector Container */}
        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
          {/* Step 1: Choose State */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[11px] font-bold">1</span>
                Step 1: Choose State
              </span>
              <span className="text-xs text-blue-600 font-semibold">
                Active: {currentState.stateName} ({currentState.stateCode})
              </span>
            </div>

            <div className="flex flex-wrap gap-2 sm:gap-2.5">
              {statesData.map((state) => {
                const isSelected = state.stateCode === selectedStateCode;
                return (
                  <button
                    key={state.stateCode}
                    onClick={() => handleStateChange(state.stateCode)}
                    className={`px-4 py-2.5 rounded-xl font-bold text-sm transition flex items-center gap-2 cursor-pointer border ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-blue-50/50'
                    }`}
                  >
                    <Navigation className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-blue-500'}`} />
                    <span>{state.stateName}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded-md ${isSelected ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-500'}`}>
                      {state.stateCode}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Choose City */}
          <div className="mb-6 pt-5 border-t border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[11px] font-bold">2</span>
                Step 2: Choose City in {currentState.stateName}
              </span>
              <span className="text-xs text-slate-500">
                {currentState.cities.length} serviced metro zones
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
              {currentState.cities.map((city) => {
                const isCitySelected = city.cityName === selectedCityName;
                return (
                  <button
                    key={city.cityName}
                    onClick={() => handleCityChange(city.cityName)}
                    className={`p-3 rounded-xl text-left transition border cursor-pointer flex flex-col justify-between ${
                      isCitySelected
                        ? 'bg-blue-900 text-white border-blue-900 shadow-sm ring-2 ring-blue-500/30'
                        : 'bg-white text-slate-800 border-slate-200 hover:border-blue-300 hover:bg-blue-50/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <Building2 className={`w-4 h-4 ${isCitySelected ? 'text-sky-300' : 'text-blue-600'}`} />
                      {isCitySelected && (
                        <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
                      )}
                    </div>
                    <div className="font-bold text-sm tracking-tight">{city.cityName}</div>
                    <div className={`text-[11px] mt-0.5 truncate ${isCitySelected ? 'text-blue-200' : 'text-slate-500'}`}>
                      {city.popularZips.length} active hubs
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3: Enter ZIP Code to Confirm Availability (As requested by user!) */}
          <div className="pt-5 border-t border-slate-200">
            {/* The website says: enter your zip code to confirm availability */}
            <div className="bg-white border-2 border-blue-500/80 rounded-2xl p-5 sm:p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                    3
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                      Enter your zip code to confirm availability
                    </h3>
                    <p className="text-xs text-slate-500">
                      Location selected: <span className="font-bold text-blue-700">{currentState.stateName} &rsaquo; {currentCity.cityName}</span>
                    </p>
                  </div>
                </div>

                <div className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold px-2.5 py-1 rounded-full self-start sm:self-auto flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-emerald-600" />
                  <span>Truck vans active today</span>
                </div>
              </div>

              {/* Input + Button */}
              <div className="flex flex-col sm:flex-row gap-2.5">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    maxLength={5}
                    value={zipInput}
                    onChange={(e) => {
                      setZipInput(e.target.value.replace(/\D/g, ''));
                      if (result.status !== 'idle') setResult({ status: 'idle', message: '' });
                    }}
                    onKeyDown={(e) => e.key === 'Enter' && handleCheckZip()}
                    placeholder={`Enter 5-digit ZIP for ${currentCity.cityName} (e.g. ${currentCity.popularZips[0] || '77001'})`}
                    className="w-full pl-11 pr-4 py-3.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white font-semibold text-slate-800 shadow-2xs"
                  />
                </div>

                <button
                  onClick={() => handleCheckZip()}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-7 py-3.5 rounded-xl font-bold text-sm transition shadow-sm hover:shadow-md cursor-pointer shrink-0 flex items-center justify-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  <span>Confirm Availability</span>
                </button>
              </div>

              {/* Quick ZIP Chips for this city */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-1.5 text-xs">
                <span className="text-slate-500 font-medium mr-1">Popular {currentCity.cityName} ZIPs:</span>
                {currentCity.popularZips.map((chipZip) => (
                  <button
                    key={chipZip}
                    onClick={() => {
                      setZipInput(chipZip);
                      handleCheckZip(chipZip);
                    }}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 border border-slate-200 text-slate-700 rounded-lg font-medium transition cursor-pointer"
                  >
                    {chipZip}
                  </button>
                ))}
              </div>

              {/* Result: Confirmed */}
              {result.status === 'success' && (
                <div className="mt-5 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-left flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-sm text-emerald-950 flex items-center gap-2">
                        <span>{result.message}</span>
                        <span className="bg-emerald-200/70 text-emerald-800 text-[10px] uppercase font-extrabold px-2 py-0.5 rounded">
                          Serviced Zone
                        </span>
                      </div>
                      <div className="text-xs text-emerald-800 mt-0.5">{result.details}</div>
                    </div>
                  </div>

                  {result.zip && (
                    <button
                      onClick={() => onSelectZipForBooking(result.zip!, result.city, result.state)}
                      className="shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition shadow-xs cursor-pointer w-full sm:w-auto justify-center"
                    >
                      <span>Book Cleaning in {result.zip}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}

              {/* Result: Unsupported */}
              {result.status === 'unsupported' && (
                <div className="mt-5 p-4 rounded-xl bg-amber-50 border border-amber-200 text-left flex items-start gap-3 shadow-2xs">
                  <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-sm text-amber-950">{result.message}</div>
                    <div className="text-xs text-amber-800 mt-0.5 leading-relaxed">{result.details}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Coverage Highlights Bento */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 text-center text-xs text-slate-600">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold shrink-0">
              $0
            </div>
            <div className="text-left">
              <div className="font-bold text-slate-900 text-sm">No Travel Surcharges</div>
              <div className="text-slate-500">All local metro zones qualify for standard flat rates.</div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold shrink-0">
              ⚡
            </div>
            <div className="text-left">
              <div className="font-bold text-slate-900 text-sm">Same-Day & Next-Day Slots</div>
              <div className="text-slate-500">Emergency spot extraction and flexible 3-hour arrival windows.</div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold shrink-0">
              🛡️
            </div>
            <div className="text-left">
              <div className="font-bold text-slate-900 text-sm">Insured & Certified Technicians</div>
              <div className="text-slate-500">IICRC certified carpet steam cleaners with truck-mount units.</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
