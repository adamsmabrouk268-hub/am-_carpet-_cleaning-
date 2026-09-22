import React, { useState, useEffect, useMemo } from 'react';
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
  Wind,
  Paintbrush,
  PaintRoller,
  Palette,
  Edit3,
  Table,
  LayoutGrid,
  TrendingUp,
  Save,
  Zap,
  CheckCheck,
  SlidersHorizontal,
  ArrowUpDown
} from 'lucide-react';
import { ServiceItem, ServiceCategory } from '../types';
import {
  getStoredServices,
  addStoredService,
  deleteStoredService,
  updateStoredService,
  resetServicesToDefault,
  saveStoredServices
} from '../utils/adminStorage';

const ICON_OPTIONS = [
  { name: 'Sparkles', icon: Sparkles, label: 'Sparkles (Carpet / Steam)' },
  { name: 'Armchair', icon: Armchair, label: 'Armchair (Upholstery)' },
  { name: 'Sofa', icon: Sofa, label: 'Sofa (Couches)' },
  { name: 'BedDouble', icon: BedDouble, label: 'Bed (Mattress)' },
  { name: 'Moon', icon: Moon, label: 'Moon (Sanitize)' },
  { name: 'Droplets', icon: Droplets, label: 'Droplets (Moisture / Liquid)' },
  { name: 'Layers', icon: Layers, label: 'Layers (Area Rugs)' },
  { name: 'Paintbrush', icon: Paintbrush, label: 'Paintbrush (Painting / Walls)' },
  { name: 'PaintRoller', icon: PaintRoller, label: 'Paint Roller (Surface Coating)' },
  { name: 'Palette', icon: Palette, label: 'Palette (Colors & Trim)' },
  { name: 'Car', icon: Car, label: 'Car (Auto Detail)' },
  { name: 'ShieldCheck', icon: ShieldCheck, label: 'Shield (Protection)' },
  { name: 'Wind', icon: Wind, label: 'Wind (Air Ducts)' },
  { name: 'Footprints', icon: Footprints, label: 'Footprints (High-Traffic)' }
];

const UNIT_PRESETS = [
  'per room',
  'per wall',
  'per door / trim',
  'per cabinet set',
  'per exterior section',
  'per sofa',
  'per 2-seater',
  'per armchair',
  'per mattress',
  'per flight of stairs',
  'per area rug',
  'per sq ft',
  'per vehicle'
];

const SERVICE_PRESETS = [
  {
    name: 'Interior Accent & Feature Wall Painting',
    category: 'painting' as ServiceCategory,
    basePrice: 95,
    unit: 'single accent wall',
    icon: 'Palette',
    description: 'Designer interior accent wall painting with clean tape edging, priming, and smooth uniform coverage.',
    popular: true
  },
  {
    name: 'Baseboard & Door Frame Trim Painting',
    category: 'painting' as ServiceCategory,
    basePrice: 65,
    unit: 'room trim or 2 doors',
    icon: 'PaintRoller',
    description: 'Semi-gloss or satin enamel detailed brush and roller coating for baseboards, mouldings, and trims.',
    popular: false
  },
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
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Inline Price Editing State
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [inlinePriceInput, setInlinePriceInput] = useState<string>('');

  // Toast notification
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' } | null>(null);

  // Batch Edit in Table View
  const [isBatchEditMode, setIsBatchEditMode] = useState(false);
  const [batchDrafts, setBatchDrafts] = useState<Record<string, number>>({});

  // Bulk Price Adjuster Drawer / Toolbar
  const [isBulkAdjustOpen, setIsBulkAdjustOpen] = useState(false);
  const [bulkAdjustmentAmount, setBulkAdjustmentAmount] = useState<number>(5);
  const [bulkAdjustmentMode, setBulkAdjustmentMode] = useState<'dollar' | 'percent'>('dollar');
  const [bulkAdjustmentScope, setBulkAdjustmentScope] = useState<string>('all');
  const [bulkDirection, setBulkDirection] = useState<'increase' | 'decrease'>('increase');

  // Full Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [editName, setEditName] = useState('');
  const [editCategory, setEditCategory] = useState<ServiceCategory>('carpet');
  const [editBasePrice, setEditBasePrice] = useState<number>(75);
  const [editUnit, setEditUnit] = useState('per room');
  const [editIconName, setEditIconName] = useState('Sparkles');
  const [editDescription, setEditDescription] = useState('');
  const [editPopular, setEditPopular] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [editSuccess, setEditSuccess] = useState<string | null>(null);

  // Add Service Form State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
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

  const showToast = (text: string, type: 'success' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage((prev) => (prev?.text === text ? null : prev));
    }, 4000);
  };

  // --- Inline Price Edit Handlers ---
  const handleStartInlineEdit = (srv: ServiceItem) => {
    setEditingPriceId(srv.id);
    setInlinePriceInput(String(srv.basePrice));
  };

  const handleCancelInlineEdit = () => {
    setEditingPriceId(null);
    setInlinePriceInput('');
  };

  const handleSaveInlinePrice = (srv: ServiceItem, newPriceVal?: number) => {
    const targetPrice = newPriceVal !== undefined ? newPriceVal : Number(inlinePriceInput);
    if (isNaN(targetPrice) || targetPrice <= 0) {
      alert('Price must be a valid number greater than $0.');
      return;
    }

    const updated = updateStoredService(srv.id, { basePrice: targetPrice });
    if (updated) {
      refreshList();
      setEditingPriceId(null);
      showToast(`Updated "${srv.name}" price to $${targetPrice} / ${srv.unit}! Instantly synced with live quote calculator.`);
    }
  };

  const handleQuickStepPrice = (srv: ServiceItem, delta: number) => {
    const newPrice = Math.max(5, srv.basePrice + delta);
    const updated = updateStoredService(srv.id, { basePrice: newPrice });
    if (updated) {
      refreshList();
      if (editingPriceId === srv.id) {
        setInlinePriceInput(String(newPrice));
      }
      showToast(`Adjusted "${srv.name}" price to $${newPrice} / ${srv.unit}`);
    }
  };

  // --- Batch Price Edit Handlers (Table View) ---
  const handleStartBatchEdit = () => {
    const initialDrafts: Record<string, number> = {};
    services.forEach((s) => {
      initialDrafts[s.id] = s.basePrice;
    });
    setBatchDrafts(initialDrafts);
    setIsBatchEditMode(true);
  };

  const handleCancelBatchEdit = () => {
    setBatchDrafts({});
    setIsBatchEditMode(false);
  };

  const handleBatchDraftChange = (serviceId: string, val: number) => {
    setBatchDrafts((prev) => ({
      ...prev,
      [serviceId]: val
    }));
  };

  const handleSaveBatchPrices = () => {
    let modifiedCount = 0;
    const currentServices = getStoredServices();
    const updated = currentServices.map((s) => {
      const draftVal = batchDrafts[s.id];
      if (draftVal !== undefined && !isNaN(draftVal) && draftVal > 0 && draftVal !== s.basePrice) {
        modifiedCount++;
        return { ...s, basePrice: draftVal };
      }
      return s;
    });

    if (modifiedCount === 0) {
      setIsBatchEditMode(false);
      showToast('No prices were modified.', 'info');
      return;
    }

    saveStoredServices(updated);
    refreshList();
    setIsBatchEditMode(false);
    showToast(`Successfully updated ${modifiedCount} service prices across the system!`);
  };

  const modifiedBatchCount = useMemo(() => {
    let count = 0;
    services.forEach((s) => {
      const draftVal = batchDrafts[s.id];
      if (draftVal !== undefined && !isNaN(draftVal) && draftVal > 0 && draftVal !== s.basePrice) {
        count++;
      }
    });
    return count;
  }, [batchDrafts, services]);

  // --- Bulk Rate Adjustment Handler ---
  const handleApplyBulkAdjustment = (
    amount: number,
    mode: 'dollar' | 'percent',
    direction: 'increase' | 'decrease',
    scope: string
  ) => {
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid positive number for adjustment.');
      return;
    }

    const currentServices = getStoredServices();
    let affectedCount = 0;

    const updated = currentServices.map((s) => {
      if (scope === 'all' || s.category === scope) {
        affectedCount++;
        let newPrice = s.basePrice;
        if (mode === 'dollar') {
          newPrice = direction === 'increase' ? s.basePrice + amount : s.basePrice - amount;
        } else {
          const delta = Math.round((s.basePrice * amount) / 100);
          newPrice = direction === 'increase' ? s.basePrice + delta : s.basePrice - delta;
        }
        return {
          ...s,
          basePrice: Math.max(5, newPrice)
        };
      }
      return s;
    });

    if (affectedCount === 0) {
      alert('No services matched the selected category.');
      return;
    }

    const sign = direction === 'increase' ? '+' : '-';
    const unitStr = mode === 'dollar' ? `$${amount}` : `${amount}%`;

    saveStoredServices(updated);
    refreshList();
    showToast(`Applied ${sign}${unitStr} rate adjustment to ${affectedCount} services!`);
  };

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: services.length };
    services.forEach((s) => {
      counts[s.category] = (counts[s.category] || 0) + 1;
    });
    return counts;
  }, [services]);

  // --- Full Edit Modal Handlers ---
  const handleOpenEditModal = (srv: ServiceItem) => {
    setEditingService(srv);
    setEditName(srv.name);
    setEditCategory(srv.category);
    setEditBasePrice(srv.basePrice);
    setEditUnit(srv.unit);
    setEditIconName(srv.icon || 'Sparkles');
    setEditDescription(srv.description || '');
    setEditPopular(Boolean(srv.popular));
    setEditError(null);
    setEditSuccess(null);
    setIsEditModalOpen(true);
  };

  const handleSaveEditModal = (e: React.FormEvent) => {
    e.preventDefault();
    setEditError(null);

    if (!editingService) return;
    if (!editName.trim()) {
      setEditError('Please enter a service name.');
      return;
    }
    if (editBasePrice <= 0) {
      setEditError('Price must be greater than $0.');
      return;
    }
    if (!editUnit.trim()) {
      setEditError('Please enter a pricing unit (e.g., per room).');
      return;
    }

    const updated = updateStoredService(editingService.id, {
      name: editName.trim(),
      category: editCategory,
      basePrice: Number(editBasePrice),
      unit: editUnit.trim(),
      icon: editIconName,
      description: editDescription.trim() || 'Professional cleaning service.',
      popular: editPopular
    });

    if (updated) {
      refreshList();
      setEditSuccess('Service and rates successfully updated!');
      showToast(`Saved changes for "${updated.name}" ($${updated.basePrice} / ${updated.unit})`);
      setTimeout(() => {
        setIsEditModalOpen(false);
        setEditSuccess(null);
      }, 1000);
    } else {
      setEditError('Failed to save service updates.');
    }
  };

  // --- Preset & Add Handlers ---
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
    showToast(`Updated featured status.`);
  };

  const handleDelete = (id: string, serviceName: string) => {
    if (window.confirm(`Are you sure you want to remove "${serviceName}" from the services catalog?`)) {
      deleteStoredService(id);
      refreshList();
      showToast(`Removed "${serviceName}" from catalog.`, 'info');
    }
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset all service catalog items & prices back to default rates?')) {
      resetServicesToDefault();
      refreshList();
      showToast('Reset all services to default pricing.', 'info');
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
      showToast(`Added new service: "${name.trim()}" at $${basePrice} / ${unit.trim()}`);
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

  const avgPrice = services.length > 0
    ? Math.round(services.reduce((acc, s) => acc + s.basePrice, 0) / services.length)
    : 0;

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-slate-700 flex items-start gap-3 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="bg-emerald-500 text-slate-950 p-1.5 rounded-lg shrink-0 mt-0.5">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="flex-1 text-xs">
            <div className="font-bold text-emerald-400">Live Rates Updated</div>
            <p className="text-slate-200 mt-0.5 leading-relaxed">{toastMessage.text}</p>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Banner & Overview */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">Services & Rates Manager</h2>
              <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                {services.length} Active Services
              </span>
              <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                Avg Rate: ${avgPrice}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl">
              Edit price rates for each service, adjust pricing units, add specialty treatments, or customize descriptions. Any price changes instantly update the customer instant quote calculator and online booking flows.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-white text-blue-700 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Cards Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
                <span className="hidden sm:inline">Cards</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition cursor-pointer ${
                  viewMode === 'table'
                    ? 'bg-white text-blue-700 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Quick Price Table"
              >
                <Table className="w-4 h-4" />
                <span className="hidden sm:inline">Price Table</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setIsBulkAdjustOpen(!isBulkAdjustOpen)}
              className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
                isBulkAdjustOpen
                  ? 'bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs'
                  : 'text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200'
              }`}
              title="Bulk adjust rates across services"
            >
              <Zap className="w-3.5 h-3.5 text-amber-600" />
              <span>Bulk Rate Adjuster</span>
            </button>

            <button
              type="button"
              onClick={handleResetDefaults}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
              title="Reset all prices to defaults"
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
              <span>Add New Service</span>
            </button>
          </div>
        </div>
      </div>

      {/* BULK RATE ADJUSTER TOOLBAR */}
      {isBulkAdjustOpen && (
        <div className="bg-amber-50/90 border border-amber-200 p-4 sm:p-5 rounded-2xl shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-amber-200/70">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-amber-200/80 rounded-lg text-amber-900">
                <SlidersHorizontal className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wider">
                  Bulk Rate Adjustment Engine
                </h4>
                <p className="text-[11px] text-amber-800">
                  Quickly increase or discount rates across multiple services at once. Changes sync immediately to live calculators.
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsBulkAdjustOpen(false)}
              className="text-amber-700 hover:text-amber-950 text-xs font-bold flex items-center gap-1 cursor-pointer self-end md:self-auto"
            >
              <X className="w-3.5 h-3.5" />
              <span>Close Tool</span>
            </button>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
            {/* Quick Presets */}
            <span className="font-bold text-amber-900">1-Click Presets:</span>
            <button
              type="button"
              onClick={() => handleApplyBulkAdjustment(5, 'dollar', 'increase', bulkAdjustmentScope)}
              className="bg-white hover:bg-amber-100 text-amber-950 border border-amber-300 px-2.5 py-1.5 rounded-lg font-bold transition cursor-pointer shadow-2xs"
            >
              +$5 / service
            </button>
            <button
              type="button"
              onClick={() => handleApplyBulkAdjustment(10, 'dollar', 'increase', bulkAdjustmentScope)}
              className="bg-white hover:bg-amber-100 text-amber-950 border border-amber-300 px-2.5 py-1.5 rounded-lg font-bold transition cursor-pointer shadow-2xs"
            >
              +$10 / service
            </button>
            <button
              type="button"
              onClick={() => handleApplyBulkAdjustment(10, 'percent', 'increase', bulkAdjustmentScope)}
              className="bg-white hover:bg-amber-100 text-amber-950 border border-amber-300 px-2.5 py-1.5 rounded-lg font-bold transition cursor-pointer shadow-2xs"
            >
              +10% Peak Season
            </button>
            <button
              type="button"
              onClick={() => handleApplyBulkAdjustment(5, 'percent', 'increase', bulkAdjustmentScope)}
              className="bg-white hover:bg-amber-100 text-amber-950 border border-amber-300 px-2.5 py-1.5 rounded-lg font-bold transition cursor-pointer shadow-2xs"
            >
              +5% Inflation
            </button>
            <button
              type="button"
              onClick={() => handleApplyBulkAdjustment(5, 'dollar', 'decrease', bulkAdjustmentScope)}
              className="bg-white hover:bg-amber-100 text-rose-800 border border-amber-300 px-2.5 py-1.5 rounded-lg font-bold transition cursor-pointer shadow-2xs"
            >
              -$5 Discount
            </button>
            <button
              type="button"
              onClick={() => handleApplyBulkAdjustment(10, 'percent', 'decrease', bulkAdjustmentScope)}
              className="bg-white hover:bg-amber-100 text-rose-800 border border-amber-300 px-2.5 py-1.5 rounded-lg font-bold transition cursor-pointer shadow-2xs"
            >
              -10% Promo Sale
            </button>

            {/* Scope Selector */}
            <div className="ml-auto flex items-center gap-2">
              <span className="font-semibold text-amber-900 text-xs">Target Scope:</span>
              <select
                value={bulkAdjustmentScope}
                onChange={(e) => setBulkAdjustmentScope(e.target.value)}
                className="bg-white border border-amber-300 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-800 outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
              >
                <option value="all">All Services ({services.length})</option>
                <option value="carpet">Carpets ({categoryCounts['carpet'] || 0})</option>
                <option value="upholstery">Upholstery ({categoryCounts['upholstery'] || 0})</option>
                <option value="couch_sofa">Couches ({categoryCounts['couch_sofa'] || 0})</option>
                <option value="mattress">Mattresses ({categoryCounts['mattress'] || 0})</option>
                <option value="area_rug">Area Rugs ({categoryCounts['area_rug'] || 0})</option>
                <option value="painting">Painting ({categoryCounts['painting'] || 0})</option>
                <option value="other">Other ({categoryCounts['other'] || 0})</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Filters Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
        <div className="flex flex-wrap gap-1.5">
          {[
            { id: 'all', label: 'All Services' },
            { id: 'carpet', label: 'Carpets' },
            { id: 'upholstery', label: 'Upholstery' },
            { id: 'couch_sofa', label: 'Couches' },
            { id: 'mattress', label: 'Mattresses' },
            { id: 'area_rug', label: 'Area Rugs' },
            { id: 'painting', label: 'Painting Services' },
            { id: 'other', label: 'Other Services' }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveCategory(tab.id)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                activeCategory === tab.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  activeCategory === tab.id
                    ? 'bg-blue-800 text-blue-100'
                    : 'bg-slate-200 text-slate-700'
                }`}
              >
                {categoryCounts[tab.id] || 0}
              </span>
            </button>
          ))}
        </div>

        <div className="w-full sm:w-64">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, price, keyword..."
            className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
      </div>

      {/* VIEW 1: GRID VIEW WITH DEDICATED PRICE BOX & INLINE EDITING */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredServices.map((srv) => {
            const isEditingPrice = editingPriceId === srv.id;

            return (
              <div
                key={srv.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition relative group"
              >
                <div>
                  {/* Category & Badge */}
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

                  {/* Service Title */}
                  <h3 className="font-bold text-slate-900 text-sm leading-snug">{srv.name}</h3>

                  {/* PRICE CONTAINER */}
                  <div className="mt-3 mb-3">
                    {isEditingPrice ? (
                      /* Inline Quick Price Editor */
                      <div className="bg-blue-50 border-2 border-blue-500 rounded-xl p-3 shadow-sm animate-in fade-in duration-150">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[11px] font-bold text-blue-900 flex items-center gap-1">
                            <DollarSign className="w-3.5 h-3.5 text-blue-700" />
                            Edit Service Price
                          </span>
                          <span className="text-[10px] text-blue-700 font-medium">/{srv.unit}</span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <div className="relative flex-1">
                            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">$</span>
                            <input
                              type="number"
                              min="1"
                              step="1"
                              value={inlinePriceInput}
                              onChange={(e) => setInlinePriceInput(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleSaveInlinePrice(srv);
                                } else if (e.key === 'Escape') {
                                  handleCancelInlineEdit();
                                }
                              }}
                              autoFocus
                              className="w-full pl-6 pr-2 py-1.5 bg-white border border-blue-300 rounded-lg text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-600"
                            />
                          </div>

                          <button
                            type="button"
                            onClick={() => handleSaveInlinePrice(srv)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1.5 rounded-lg font-bold text-xs transition flex items-center gap-1 cursor-pointer shadow-xs"
                            title="Save new rate"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Save</span>
                          </button>

                          <button
                            type="button"
                            onClick={handleCancelInlineEdit}
                            className="bg-slate-200 hover:bg-slate-300 text-slate-700 p-1.5 rounded-lg transition cursor-pointer"
                            title="Cancel"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Quick increment buttons */}
                        <div className="flex items-center gap-1.5 mt-2">
                          <span className="text-[10px] text-slate-500 font-medium">Quick Adjust:</span>
                          <button
                            type="button"
                            onClick={() => handleQuickStepPrice(srv, -5)}
                            className="text-[10px] font-bold bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 px-1.5 py-0.5 rounded cursor-pointer"
                          >
                            -$5
                          </button>
                          <button
                            type="button"
                            onClick={() => handleQuickStepPrice(srv, 5)}
                            className="text-[10px] font-bold bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 px-1.5 py-0.5 rounded cursor-pointer"
                          >
                            +$5
                          </button>
                          <button
                            type="button"
                            onClick={() => handleQuickStepPrice(srv, 10)}
                            className="text-[10px] font-bold bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 px-1.5 py-0.5 rounded cursor-pointer"
                          >
                            +$10
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Normal Display with Direct "Edit Price" button */
                      <div className="bg-slate-50 hover:bg-blue-50/40 border border-slate-200 rounded-xl px-3.5 py-2.5 flex items-center justify-between transition group-hover:border-blue-200">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block leading-tight">
                            Current Rate
                          </span>
                          <div className="flex items-baseline gap-1 mt-0.5">
                            <span className="text-xl font-black text-slate-900">${srv.basePrice}</span>
                            <span className="text-xs text-slate-500 font-medium">/ {srv.unit}</span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleStartInlineEdit(srv)}
                          className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 bg-white hover:bg-blue-50 border border-blue-200 px-2.5 py-1.5 rounded-lg shadow-2xs transition cursor-pointer"
                          title="Click to edit price directly"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit Price</span>
                        </button>
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {srv.description}
                  </p>
                </div>

                {/* Actions Footer */}
                <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={() => handleTogglePopular(srv.id, srv.popular)}
                    className={`inline-flex items-center gap-1 font-semibold px-2 py-1 rounded-lg transition cursor-pointer ${
                      srv.popular
                        ? 'text-amber-700 bg-amber-50 hover:bg-amber-100'
                        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                    }`}
                    title="Toggle featured badge"
                  >
                    <Star className={`w-3.5 h-3.5 ${srv.popular ? 'fill-amber-500 text-amber-500' : ''}`} />
                    <span>{srv.popular ? 'Featured' : 'Feature'}</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(srv)}
                      className="inline-flex items-center gap-1 font-semibold text-slate-700 hover:text-blue-700 hover:bg-blue-50 px-2 py-1 rounded-lg transition cursor-pointer"
                      title="Edit all service details & pricing"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-blue-600" />
                      <span>Details</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(srv.id, srv.name)}
                      className="inline-flex items-center gap-1 font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-2 py-1 rounded-lg transition cursor-pointer"
                      title="Delete service"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW 2: PRICE TABLE SPREADSHEET VIEW */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          {/* Table Header Controls */}
          <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                Direct Price Spreadsheet
              </span>
              <span className="text-slate-400 text-xs">({filteredServices.length} items shown)</span>
            </div>

            <div className="flex items-center gap-2">
              {isBatchEditMode ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-amber-900 bg-amber-100 border border-amber-300 px-2.5 py-1 rounded-lg">
                    {modifiedBatchCount} prices modified
                  </span>
                  <button
                    type="button"
                    onClick={handleSaveBatchPrices}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    <span>Save All Changes</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelBatchEdit}
                    className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-2.5 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleStartBatchEdit}
                  className="bg-white hover:bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs transition"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Batch Edit All Rates</span>
                </button>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Service Name</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-4">Rate ($ USD)</th>
                  <th className="py-3 px-3">Pricing Unit</th>
                  <th className="py-3 px-3">Featured</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredServices.map((srv) => {
                  const isEditingPrice = editingPriceId === srv.id;
                  const draftVal = batchDrafts[srv.id] !== undefined ? batchDrafts[srv.id] : srv.basePrice;
                  const isDraftModified = isBatchEditMode && draftVal !== srv.basePrice;

                  return (
                    <tr key={srv.id} className={`hover:bg-slate-50/80 transition ${isDraftModified ? 'bg-amber-50/40' : ''}`}>
                      {/* Name & Icon */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{srv.name}</div>
                        <div className="text-[11px] text-slate-400 line-clamp-1">{srv.description}</div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-3">
                        <span className="bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded-full text-[10px]">
                          {srv.category.replace('_', ' ')}
                        </span>
                      </td>

                      {/* Rate ($ USD) with batch editing or inline editing */}
                      <td className="py-3 px-4">
                        {isBatchEditMode ? (
                          <div className="flex items-center gap-1.5">
                            <span className="text-slate-400 font-bold">$</span>
                            <input
                              type="number"
                              min="1"
                              step="1"
                              value={draftVal}
                              onChange={(e) => handleBatchDraftChange(srv.id, Number(e.target.value))}
                              className={`w-20 p-1 text-xs font-bold border rounded-md outline-none transition ${
                                isDraftModified
                                  ? 'border-amber-500 bg-amber-50 text-amber-950 ring-1 ring-amber-400 font-black'
                                  : 'border-slate-300 bg-white text-slate-900 focus:border-blue-500'
                              }`}
                            />
                            {isDraftModified && (
                              <span className="text-[10px] text-amber-700 font-semibold whitespace-nowrap">
                                (was ${srv.basePrice})
                              </span>
                            )}
                          </div>
                        ) : isEditingPrice ? (
                          <div className="flex items-center gap-1.5 max-w-[160px]">
                            <span className="text-slate-400 font-bold">$</span>
                            <input
                              type="number"
                              min="1"
                              step="1"
                              value={inlinePriceInput}
                              onChange={(e) => setInlinePriceInput(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSaveInlinePrice(srv);
                                if (e.key === 'Escape') handleCancelInlineEdit();
                              }}
                              autoFocus
                              className="w-20 p-1 text-xs font-bold border border-blue-400 rounded-md outline-none focus:ring-1 focus:ring-blue-600"
                            />
                            <button
                              type="button"
                              onClick={() => handleSaveInlinePrice(srv)}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white p-1 rounded-md cursor-pointer"
                              title="Save Price"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={handleCancelInlineEdit}
                              className="bg-slate-200 hover:bg-slate-300 text-slate-700 p-1 rounded-md cursor-pointer"
                              title="Cancel"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="font-black text-slate-900 text-sm">${srv.basePrice}</span>
                            <button
                              type="button"
                              onClick={() => handleStartInlineEdit(srv)}
                              className="text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 p-1 rounded-md transition cursor-pointer"
                              title="Quick-edit this price"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </td>

                      {/* Unit */}
                      <td className="py-3 px-3 text-slate-500 font-medium">
                        {srv.unit}
                      </td>

                      {/* Featured */}
                      <td className="py-3 px-3">
                        <button
                          type="button"
                          onClick={() => handleTogglePopular(srv.id, srv.popular)}
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold cursor-pointer transition ${
                            srv.popular
                              ? 'bg-amber-100 text-amber-800 border border-amber-300'
                              : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                          }`}
                        >
                          <Star className={`w-3 h-3 ${srv.popular ? 'fill-amber-500 text-amber-500' : ''}`} />
                          {srv.popular ? 'Yes' : 'No'}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(srv)}
                            className="bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 px-2.5 py-1 rounded-lg font-bold text-[11px] transition cursor-pointer flex items-center gap-1"
                          >
                            <Edit3 className="w-3 h-3 text-blue-600" />
                            <span>Edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(srv.id, srv.name)}
                            className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 p-1 rounded-lg transition cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {filteredServices.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
          <Layers className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <div className="font-bold text-slate-700">No services match your criteria.</div>
          <p className="text-xs text-slate-400 mt-1">Try changing your category filter or search query.</p>
        </div>
      )}

      {/* MODAL 1: EDIT SERVICE & PRICING */}
      {isEditModalOpen && editingService && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden relative flex flex-col my-auto max-h-[92vh]">
            {/* Header */}
            <div className="p-5 border-b border-slate-100 bg-slate-900 text-white flex justify-between items-center">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center font-bold">
                  <Edit3 className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold">Edit Cleaning Service & Rates</h3>
                  <p className="text-[11px] text-slate-300">
                    Modify prices, billing units, and description for "{editingService.name}"
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveEditModal} className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs">
              {/* Alert / Notice */}
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 text-xs flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Instant Price Sync:</span>
                  <p className="text-[11px] text-blue-800 mt-0.5 leading-relaxed">
                    Updating the price rate immediately recalculates instant quotes in the customer Calculator and updates the online booking forms.
                  </p>
                </div>
              </div>

              {editError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{editError}</span>
                </div>
              )}

              {editSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{editSuccess}</span>
                </div>
              )}

              {/* Service Name */}
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider text-[11px] mb-1">
                  Service Name *
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="e.g. Living Room Carpet Steam Cleaning"
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 outline-none font-semibold text-slate-900"
                  required
                />
              </div>

              {/* Category, Base Price & Unit */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider text-[11px] mb-1">
                    Category *
                  </label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value as ServiceCategory)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl text-xs bg-white focus:ring-2 focus:ring-blue-600 outline-none font-semibold"
                  >
                    <option value="carpet">Cleaning Carpets</option>
                    <option value="upholstery">Upholstery Cleaning</option>
                    <option value="couch_sofa">Couch & Sofa Cleaning</option>
                    <option value="mattress">Mattress Cleaning</option>
                    <option value="area_rug">Area Rug Cleaning</option>
                    <option value="painting">Painting Services</option>
                    <option value="other">Other Services</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider text-[11px] mb-1">
                    Rate Price ($ USD) *
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 font-bold">$</span>
                    <input
                      type="number"
                      min="1"
                      step="1"
                      value={editBasePrice}
                      onChange={(e) => setEditBasePrice(Number(e.target.value))}
                      className="w-full pl-7 pr-3 py-2.5 border-2 border-blue-400 bg-blue-50/30 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 outline-none font-black text-slate-900 text-sm"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider text-[11px] mb-1">
                    Pricing Unit *
                  </label>
                  <input
                    type="text"
                    value={editUnit}
                    onChange={(e) => setEditUnit(e.target.value)}
                    placeholder="e.g. per room, per sofa"
                    className="w-full p-2.5 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 outline-none font-semibold"
                    required
                  />
                </div>
              </div>

              {/* Quick Unit Presets */}
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Common Pricing Units:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {UNIT_PRESETS.map((pUnit) => (
                    <button
                      key={pUnit}
                      type="button"
                      onClick={() => setEditUnit(pUnit)}
                      className={`text-[10px] px-2 py-0.5 rounded-lg border font-medium transition cursor-pointer ${
                        editUnit === pUnit
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {pUnit}
                    </button>
                  ))}
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
                        onClick={() => setEditIconName(opt.name)}
                        className={`flex items-center gap-2 p-2 rounded-xl border text-[11px] font-medium transition cursor-pointer ${
                          editIconName === opt.name
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
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Explain cleaning steps, steam extraction temperature, enzyme solution, etc."
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 outline-none leading-relaxed"
                />
              </div>

              {/* Popular Checkbox */}
              <label className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer">
                <input
                  type="checkbox"
                  checked={editPopular}
                  onChange={(e) => setEditPopular(e.target.checked)}
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
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  Save Changes & Update Rates
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: UPLOAD NEW SERVICE */}
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
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 outline-none font-semibold text-slate-900"
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
                    <option value="area_rug">Area Rug Cleaning</option>
                    <option value="painting">Painting Services</option>
                    <option value="other">Other Services</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider text-[11px] mb-1">
                    Base Flat Price ($) *
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 font-bold">$</span>
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
