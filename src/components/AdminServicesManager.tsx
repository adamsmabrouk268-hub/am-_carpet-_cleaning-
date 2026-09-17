import React, { useState } from 'react';
import {
  Sparkles,
  Plus,
  Trash2,
  Tag,
  DollarSign,
  Check,
  CheckCircle2,
  AlertCircle,
  X,
  RotateCcw,
  Star,
  Layers,
  Armchair,
  Sofa,
  BedDouble,
  Moon,
  Droplets,
  Car,
  ShieldCheck,
  Footprints,
  Flame,
  Sun,
  Wind
} from 'lucide-react';
import { ServiceItem, ServiceCategory } from '../types';
import {
  getStoredServices,
  addStoredService,
  deleteStoredService,
  updateStoredService,
  resetServicesToDefault
} from '../utils/adminStorage';

const ICON_OPTIONS = [
  { name: 'Sparkles', icon: Sparkles, label: 'Sparkles (Carpet / Steam)' },
  { name: 'Armchair', icon: Armchair, label: 'Armchair (Upholstery)' },
  { name: 'Sofa', icon: Sofa, label: 'Sofa (Couches)' },
  { name: 'BedDouble', icon: BedDouble, label: 'Bed (Mattress)' },
  { name: 'Moon', icon: Moon, label: 'Moon (Sanitize)' },
  { name: 'Droplets', icon: Droplets, label: 'Droplets (Water Treatment)' },
  { name: 'Layers', icon: Layers, label: 'Layers (Area Rugs)' },
  { name: 'Car', icon: Car, label: 'Car (Auto Detail)' },
  { name: 'ShieldCheck', icon: ShieldCheck, label: 'Shield (Protection)' },
  { name: 'Wind', icon: Wind, label: 'Wind (Air Ducts)' },
  { name: 'Footprints', icon: Footprints, label: 'Footprints (High-Traffic)' }
];

const SERVICE_PRESETS = [
  {
    name: 'Leather Couch Deep Conditioner & Wax',
    category: 'couch_sofa' as ServiceCategory,
    basePrice: 110,
    unit: '3-seater sofa',
    icon: 'Sofa',
    description: 'pH-balanced leather cleanser, micro-crack dirt extraction, and lanolin restorative conditioning balm.',
    popular: true
  },
  {
    name: 'HVAC Air Duct & Vent Sanitizing',
    category: 'other' as ServiceCategory,
    basePrice: 125,
    unit: 'system (up to 10 vents)',
    icon: 'Wind',
    description: 'Negative air commercial vacuum extraction and botanical antimicrobial fogger eliminating duct dust & mold spores.',
    popular: false
  },
  {
    name: 'Tile & Grout Deep Steam Scrub',
    category: 'other' as ServiceCategory,
    basePrice: 85,
    unit: 'room (up to 200 sq ft)',
    icon: 'Sparkles',
    description: 'High-pressure 1000 PSI rotating scrubber and acid-free tile whitening with penetrating silicone sealer.',
    popular: false
  }
];

export default function AdminServicesManager() {
  const [services, setServices] = useState<ServiceItem[]>(() => getStoredServices());
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ServiceCategory>('carpet');
  const [basePrice, setBasePrice] = useState<number>(75);
  const [unit, setUnit] = useState('per room');
  const [iconName, setIconName] = useState('Sparkles');
  const [description, setDescription] = useState('');
  const [popular, setPopular] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  const refreshList = () => {
    setServices(getStoredServices());
  };

  const handleApplyPreset = (preset: (typeof SERVICE_PRESETS)[0]) => {
    setName(preset.name);
    setCategory(preset.category);
    setBasePrice(preset.basePrice);
    setUnit(preset.unit);
    setIconName(preset.icon);
    setDescription(preset.description);
    setPopular(preset.popular);
    setFormError(null);
  };

  const handleTogglePopular = (id: string, currentPopular?: boolean) => {
    updateStoredService(id, { popular: !currentPopular });
    refreshList();
  };

  const handleDelete = (id: string, serviceName: string) => {
    if (window.confirm(`Are you sure you want to remove "${serviceName}" from the services catalog?`)) {
      deleteStoredService(id);
      refreshList();
    }
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset the services catalog back to original 14 standard cleaning services?')) {
      resetServicesToDefault();
      refreshList();
    }
  };

  const handleCreateService = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!name.trim()) {
      setFormError('Please enter a service name.');
      return;
    }
    if (basePrice <= 0) {
      setFormError('Price must be greater than $0.');
      return;
    }
    if (!unit.trim()) {
      setFormError('Please enter a pricing unit (e.g., per room).');
      return;
    }

    try {
      addStoredService({
        name: name.trim(),
        category,
        basePrice: Number(basePrice),
        unit: unit.trim(),
        icon: iconName,
        description: description.trim() || 'Professional deep cleaning and restorative service.',
        popular
      });

      refreshList();
      setFormSuccess('New service successfully added to catalog!');
      setTimeout(() => {
        setFormSuccess(null);
        setIsAddModalOpen(false);
        // Reset
        setName('');
        setBasePrice(75);
        setUnit('per room');
        setDescription('');
        setPopular(false);
      }, 1200);
    } catch (err) {
      console.error(err);
      setFormError('Failed to create service.');
    }
  };

  const filteredServices = services.filter((s) => {
    const matchesCat = activeCategory === 'all' || s.category === activeCategory;
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.unit.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900">Services Catalog Manager</h2>
            <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
              {services.length} Active Services
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Add new cleaning services, update rates, toggle featured items, or manage pricing units.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
            title="Reset to 14 standard cleaning services"
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
            <span>Upload New Service</span>
          </button>
        </div>
      </div>

      {/* Filters Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
        <div className="flex flex-wrap gap-1.5">
          {[
            { id: 'all', label: 'All Services' },
            { id: 'carpet', label: 'Carpets' },
            { id: 'upholstery', label: 'Upholstery' },
            { id: 'couch_sofa', label: 'Couches' },
            { id: 'mattress', label: 'Mattresses' },
            { id: 'water_treatment', label: 'Water / Strings' },
            { id: 'area_rug', label: 'Area Rugs' },
            { id: 'other', label: 'Other Services' }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveCategory(tab.id)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                activeCategory === tab.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="w-full sm:w-64">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search service name, unit, keyword..."
            className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
      </div>

      {/* Services List Table / Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredServices.map((srv) => (
          <div
            key={srv.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition relative group"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full">
                  {srv.category.replace('_', ' ')}
                </span>
                {srv.popular && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full">
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                    Featured
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between mt-1">
                <h3 className="font-bold text-slate-900 text-sm">{srv.name}</h3>
              </div>

              <div className="flex items-baseline gap-1 my-2">
                <span className="text-xl font-black text-slate-900">${srv.basePrice}</span>
                <span className="text-xs text-slate-500">/ {srv.unit}</span>
              </div>

              <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                {srv.description}
              </p>
            </div>

            {/* Actions */}
            <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => handleTogglePopular(srv.id, srv.popular)}
                className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg transition cursor-pointer ${
                  srv.popular
                    ? 'text-amber-700 bg-amber-50 hover:bg-amber-100'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                }`}
                title="Toggle featured / popular badge"
              >
                <Star className={`w-3.5 h-3.5 ${srv.popular ? 'fill-amber-500 text-amber-500' : ''}`} />
                <span>{srv.popular ? 'Featured' : 'Mark Feature'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleDelete(srv.id, srv.name)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-2.5 py-1 rounded-lg transition cursor-pointer"
                title="Delete service"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredServices.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
          <Layers className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <div className="font-bold text-slate-700">No services match your criteria.</div>
          <p className="text-xs text-slate-400 mt-1">Try changing your category filter or search query.</p>
        </div>
      )}

      {/* MODAL: Upload New Service */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden relative flex flex-col my-auto max-h-[92vh]">
            {/* Header */}
            <div className="p-5 border-b border-slate-100 bg-slate-900 text-white flex justify-between items-center">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center font-bold">
                  <Plus className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold">Upload New Cleaning Service</h3>
                  <p className="text-[11px] text-slate-300">
                    Add new cleaning category item to online quote calculator & booking modal
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
            <form onSubmit={handleCreateService} className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs">
              {/* Presets */}
              <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-3">
                <div className="font-bold text-blue-900 text-xs mb-1.5 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>Quick Autofill Sample Templates:</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {SERVICE_PRESETS.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => handleApplyPreset(preset)}
                      className="bg-white hover:bg-blue-100 text-blue-800 border border-blue-200 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition cursor-pointer"
                    >
                      + {preset.name.slice(0, 24)}...
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

              {/* Service Name */}
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider text-[11px] mb-1">
                  Service Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Leather Recliner Deep Conditioning & Buff"
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 outline-none font-semibold"
                  required
                />
              </div>

              {/* Category & Pricing */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider text-[11px] mb-1">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ServiceCategory)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl text-xs bg-white focus:ring-2 focus:ring-blue-600 outline-none font-semibold"
                  >
                    <option value="carpet">Cleaning Carpets</option>
                    <option value="upholstery">Upholstery Cleaning</option>
                    <option value="couch_sofa">Couch & Sofa Cleaning</option>
                    <option value="mattress">Mattress Cleaning</option>
                    <option value="water_treatment">Water / String Treatment</option>
                    <option value="area_rug">Area Rug Cleaning</option>
                    <option value="other">Other Services</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider text-[11px] mb-1">
                    Base Flat Price ($) *
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 font-bold">$</span>
                    <input
                      type="number"
                      min="1"
                      step="1"
                      value={basePrice}
                      onChange={(e) => setBasePrice(Number(e.target.value))}
                      className="w-full pl-7 pr-3 py-2.5 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 outline-none font-bold"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider text-[11px] mb-1">
                    Unit Description *
                  </label>
                  <input
                    type="text"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    placeholder="e.g. per room, per sofa"
                    className="w-full p-2.5 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 outline-none"
                    required
                  />
                </div>
              </div>

              {/* Icon Selector */}
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider text-[11px] mb-1.5">
                  Display Icon
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {ICON_OPTIONS.map((opt) => {
                    const IconComp = opt.icon;
                    return (
                      <button
                        key={opt.name}
                        type="button"
                        onClick={() => setIconName(opt.name)}
                        className={`flex items-center gap-2 p-2 rounded-xl border text-[11px] font-medium transition cursor-pointer ${
                          iconName === opt.name
                            ? 'border-blue-600 bg-blue-50 text-blue-800 font-bold'
                            : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <IconComp className="w-4 h-4 text-blue-600 shrink-0" />
                        <span className="truncate">{opt.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider text-[11px] mb-1">
                  Description & Cleaning Method
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Explain the cleaning steps, steam extraction temperature, enzyme solution, etc."
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 outline-none"
                />
              </div>

              {/* Popular Checkbox */}
              <label className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer">
                <input
                  type="checkbox"
                  checked={popular}
                  onChange={(e) => setPopular(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                <div className="text-xs">
                  <span className="font-bold text-slate-800">Mark as Featured / Customer Favorite</span>
                  <p className="text-slate-500 text-[11px]">Displays prominent badge in the catalog and booking modal</p>
                </div>
              </label>

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
                  <Plus className="w-3.5 h-3.5" />
                  Save Service to Catalog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
