import React, { useState } from 'react';
import {
  MapPin,
  Plus,
  Trash2,
  Building2,
  CheckCircle2,
  AlertCircle,
  X,
  RotateCcw,
  Search,
  Sparkles,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { StateCoverage } from '../types';
import {
  getStoredStates,
  getStoredServicedZips,
  addStoredState,
  deleteStoredState,
  resetStatesToDefault
} from '../utils/adminStorage';

const STATE_PRESETS = [
  {
    stateCode: 'NY',
    stateName: 'New York',
    cityName: 'New York City',
    description: 'Manhattan, Brooklyn, Queens & Long Island Metro',
    zips: '10001, 10002, 10003, 10010, 10011, 10016, 10019, 10022, 11201, 11215, 11217, 11101',
    popularZips: '10001, 10016, 11201'
  },
  {
    stateCode: 'AZ',
    stateName: 'Arizona',
    cityName: 'Phoenix',
    description: 'Downtown Phoenix, Scottsdale, Tempe, Mesa & Chandler',
    zips: '85001, 85003, 85004, 85012, 85251, 85257, 85281, 85224',
    popularZips: '85004, 85251, 85281'
  },
  {
    stateCode: 'WA',
    stateName: 'Washington',
    cityName: 'Seattle',
    description: 'Downtown Seattle, Capitol Hill, Bellevue, Redmond & Kirkland',
    zips: '98101, 98102, 98104, 98109, 98115, 98004, 98005, 98052',
    popularZips: '98101, 98004'
  },
  {
    stateCode: 'CO',
    stateName: 'Colorado',
    cityName: 'Denver',
    description: 'LoDo, Capitol Hill, Cherry Creek, Boulder & Aurora',
    zips: '80202, 80203, 80206, 80209, 80211, 80301, 80302',
    popularZips: '80202, 80206'
  }
];

export default function AdminStatesManager() {
  const [states, setStates] = useState<StateCoverage[]>(() => getStoredStates());
  const [servicedZips, setServicedZips] = useState(() => getStoredServicedZips());
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedState, setExpandedState] = useState<string | null>(null);

  // Form State
  const [stateCode, setStateCode] = useState('');
  const [stateName, setStateName] = useState('');
  const [cityName, setCityName] = useState('');
  const [description, setDescription] = useState('');
  const [zipsInput, setZipsInput] = useState('');
  const [popularZipsInput, setPopularZipsInput] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  const refreshData = () => {
    setStates(getStoredStates());
    setServicedZips(getStoredServicedZips());
  };

  const parseZips = (text: string): string[] => {
    const rawMatches = text.match(/\b\d{5}\b/g) || [];
    return Array.from(new Set(rawMatches));
  };

  const detectedZips = parseZips(zipsInput);

  const handleApplyPreset = (preset: (typeof STATE_PRESETS)[0]) => {
    setStateCode(preset.stateCode);
    setStateName(preset.stateName);
    setCityName(preset.cityName);
    setDescription(preset.description);
    setZipsInput(preset.zips);
    setPopularZipsInput(preset.popularZips);
    setFormError(null);
  };

  const handleCreateState = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const cleanCode = stateCode.trim().toUpperCase();
    const cleanName = stateName.trim();
    const cleanCity = cityName.trim();
    const zips = parseZips(zipsInput);
    const popular = parseZips(popularZipsInput);

    if (!cleanCode || cleanCode.length !== 2) {
      setFormError('Please enter a valid 2-letter State Code (e.g. NY, AZ, CO).');
      return;
    }
    if (!cleanName) {
      setFormError('Please enter the full state name (e.g. New York).');
      return;
    }
    if (!cleanCity) {
      setFormError('Please enter a primary metro city name (e.g. New York City).');
      return;
    }
    if (zips.length === 0) {
      setFormError('Please enter at least one valid 5-digit ZIP code for this service territory.');
      return;
    }

    try {
      addStoredState({
        stateCode: cleanCode,
        stateName: cleanName,
        cityName: cleanCity,
        zips,
        popularZips: popular.length > 0 ? popular : zips.slice(0, 3),
        description: description.trim() || `${cleanCity} Metro and surrounding communities`
      });

      refreshData();
      setFormSuccess(`State ${cleanCode} (${cleanName}) successfully added with ${zips.length} ZIP codes!`);
      setTimeout(() => {
        setFormSuccess(null);
        setIsAddModalOpen(false);
        // Reset
        setStateCode('');
        setStateName('');
        setCityName('');
        setDescription('');
        setZipsInput('');
        setPopularZipsInput('');
      }, 1200);
    } catch (err) {
      console.error(err);
      setFormError('Failed to add state.');
    }
  };

  const handleDeleteState = (code: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove ${name} (${code}) from active service coverage? All associated ZIP codes will be removed.`)) {
      deleteStoredState(code);
      refreshData();
    }
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset service coverage back to initial 5 core States (TX, FL, CA, GA, IL)?')) {
      resetStatesToDefault();
      refreshData();
    }
  };

  const totalZipsCount = Object.keys(servicedZips).length;

  const filteredStates = states.filter((st) => {
    const q = searchQuery.toLowerCase();
    const matchesState = st.stateName.toLowerCase().includes(q) || st.stateCode.toLowerCase().includes(q);
    const matchesCity = st.cities.some((c) => c.cityName.toLowerCase().includes(q));
    const matchesZip = st.cities.some((c) => c.zips.some((z) => z.includes(q)));
    return matchesState || matchesCity || matchesZip;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900">Coverage States & Metros Manager</h2>
            <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
              {states.length} States • {totalZipsCount} Covered ZIPs
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Add new service territory states, metros, and 5-digit dispatch postal codes.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
            title="Reset to 5 core states (TX, FL, CA, GA, IL)"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New State & Metros</span>
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-white p-3 rounded-xl border border-slate-200">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search state name, 2-letter code, city, or 5-digit ZIP code..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
      </div>

      {/* States List Accordion / Cards */}
      <div className="space-y-4">
        {filteredStates.map((st) => {
          const isExpanded = expandedState === st.stateCode;
          const allZipsInState = st.cities.flatMap((c) => c.zips);

          return (
            <div
              key={st.stateCode}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs transition"
            >
              {/* State Header Bar */}
              <div className="p-4 sm:px-6 flex items-center justify-between bg-slate-50/70 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-black text-sm flex items-center justify-center shadow-xs">
                    {st.stateCode}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-900 text-sm">{st.stateName}</h3>
                      <span className="text-[11px] font-bold text-slate-500">({st.stateCode})</span>
                    </div>
                    <p className="text-xs text-slate-500">
                      {st.cities.length} Metros • {allZipsInState.length} Active Postal Codes
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setExpandedState(isExpanded ? null : st.stateCode)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                  >
                    <span>{isExpanded ? 'Hide Details' : 'View Cities & ZIPs'}</span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteState(st.stateCode, st.stateName)}
                    className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                    title={`Delete ${st.stateName} coverage`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Cities & ZIPs detail */}
              {isExpanded && (
                <div className="p-5 sm:px-6 space-y-4 text-xs bg-white animate-in fade-in-50 duration-150">
                  {st.cities.map((city) => (
                    <div
                      key={city.cityName}
                      className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 font-bold text-slate-900 text-sm">
                          <Building2 className="w-4 h-4 text-blue-600" />
                          <span>{city.cityName} Metro</span>
                        </div>
                        <span className="text-[11px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded">
                          {city.zips.length} ZIPs
                        </span>
                      </div>

                      {city.description && (
                        <p className="text-slate-600 text-xs">{city.description}</p>
                      )}

                      {/* ZIP Codes Tags */}
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                          Covered ZIP Codes:
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {city.zips.map((zip) => {
                            const isPop = city.popularZips?.includes(zip);
                            return (
                              <span
                                key={zip}
                                className={`font-mono text-xs px-2 py-0.5 rounded-md border font-semibold ${
                                  isPop
                                    ? 'bg-blue-600 text-white border-blue-600'
                                    : 'bg-white text-slate-700 border-slate-200'
                                }`}
                              >
                                {zip}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredStates.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
          <MapPin className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <div className="font-bold text-slate-700">No states match your search.</div>
          <p className="text-xs text-slate-400 mt-1">Try entering a different state code or city name.</p>
        </div>
      )}

      {/* MODAL: Add New State & Metros */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden relative flex flex-col my-auto max-h-[92vh]">
            {/* Header */}
            <div className="p-5 border-b border-slate-100 bg-slate-900 text-white flex justify-between items-center">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center font-bold">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold">Add New Service Territory State & Metro</h3>
                  <p className="text-[11px] text-slate-300">
                    Expands instant ZIP verification & dispatch for customers in new states
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateState} className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs">
              {/* Presets */}
              <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-3">
                <div className="font-bold text-blue-900 text-xs mb-1.5 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>Quick Autofill Sample States:</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {STATE_PRESETS.map((preset) => (
                    <button
                      key={preset.stateCode}
                      type="button"
                      onClick={() => handleApplyPreset(preset)}
                      className="bg-white hover:bg-blue-100 text-blue-800 border border-blue-200 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition cursor-pointer"
                    >
                      + {preset.stateName} ({preset.stateCode})
                    </button>
                  ))}
                </div>
              </div>

              {formError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {formSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{formSuccess}</span>
                </div>
              )}

              {/* State Code & State Name */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider text-[11px] mb-1">
                    State Code (2 Letters) *
                  </label>
                  <input
                    type="text"
                    maxLength={2}
                    value={stateCode}
                    onChange={(e) => setStateCode(e.target.value.toUpperCase())}
                    placeholder="e.g. NY"
                    className="w-full p-2.5 border border-slate-300 rounded-xl text-xs font-mono font-bold focus:ring-2 focus:ring-blue-600 outline-none"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 uppercase tracking-wider text-[11px] mb-1">
                    Full State Name *
                  </label>
                  <input
                    type="text"
                    value={stateName}
                    onChange={(e) => setStateName(e.target.value)}
                    placeholder="e.g. New York"
                    className="w-full p-2.5 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 outline-none font-semibold"
                    required
                  />
                </div>
              </div>

              {/* City & Description */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider text-[11px] mb-1">
                    Primary City / Metro *
                  </label>
                  <input
                    type="text"
                    value={cityName}
                    onChange={(e) => setCityName(e.target.value)}
                    placeholder="e.g. New York City or Phoenix"
                    className="w-full p-2.5 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 outline-none font-semibold"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider text-[11px] mb-1">
                    Neighborhood Coverage Area
                  </label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g. Downtown, Midtown, Brooklyn & Queens"
                    className="w-full p-2.5 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 outline-none"
                  />
                </div>
              </div>

              {/* ZIP Codes List Textarea */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                    Covered 5-Digit ZIP Codes *
                  </label>
                  <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                    {detectedZips.length} Valid ZIPs Detected
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={zipsInput}
                  onChange={(e) => setZipsInput(e.target.value)}
                  placeholder="Paste comma or space separated 5-digit postal codes (e.g. 10001, 10002, 10003, 10010, 11201...)"
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-xs font-mono focus:ring-2 focus:ring-blue-600 outline-none"
                  required
                />
              </div>

              {/* Popular Priority ZIPs */}
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider text-[11px] mb-1">
                  Popular / Priority ZIPs (Optional)
                </label>
                <input
                  type="text"
                  value={popularZipsInput}
                  onChange={(e) => setPopularZipsInput(e.target.value)}
                  placeholder="e.g. 10001, 10016"
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-xs font-mono focus:ring-2 focus:ring-blue-600 outline-none"
                />
              </div>

              {/* Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  Save State & Activate Coverage
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
