import React, { useState, useRef } from 'react';
import {
  Image as ImageIcon,
  Plus,
  Trash2,
  Upload,
  Sparkles,
  MapPin,
  CheckCircle2,
  AlertCircle,
  X,
  Layers,
  RotateCcw,
  Eye,
  ExternalLink
} from 'lucide-react';
import { BeforeAfterItem } from '../types';
import {
  getStoredGallery,
  addGalleryTransformation,
  deleteGalleryTransformation,
  resetGalleryToDefault
} from '../utils/adminStorage';

const SAMPLE_PRESETS = [
  {
    label: 'Carpet Pet Odor & Spill',
    title: 'Severe Pet Stain & Odor Truck Mount Extraction',
    location: 'Dallas, TX',
    service: 'Deep Steam Carpet Extraction',
    stainType: 'Pet Urine & Ground Soil',
    description: '230°F commercial steam extraction with sub-surface enzyme dwell that removed 3-year set-in stains and neutralized all odor.',
    beforeImg: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80',
    afterImg: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'
  },
  {
    label: 'L-Sectional Couch Refresh',
    title: 'Cream Microfiber Sectional Revival',
    location: 'Austin, TX',
    service: 'Upholstery Restorative Shampoo',
    stainType: 'Body Oils, Food & Coffee',
    description: 'pH-balanced delicate microfiber foam agitation and low-moisture restorative rinse that restored plush texture and vibrant color.',
    beforeImg: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
    afterImg: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80'
  },
  {
    label: 'Persian Area Rug Bath',
    title: 'Antique Wool & Silk Rug Restoration',
    location: 'Miami, FL',
    service: 'Area Rug Precision Bath',
    stainType: 'Wine Spills & Dirt Traffic',
    description: 'Flat-bed organic botanic bath and gentle fringe brightening, preserving delicate plant-dyed wool fibers without bleeding.',
    beforeImg: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=800&q=80',
    afterImg: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80'
  }
];

export default function AdminGalleryManager() {
  const [galleryItems, setGalleryItems] = useState<BeforeAfterItem[]>(() => getStoredGallery());
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [previewItem, setPreviewItem] = useState<BeforeAfterItem | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [service, setService] = useState('Deep Steam Carpet Extraction');
  const [stainType, setStainType] = useState('');
  const [description, setDescription] = useState('');
  const [beforeImg, setBeforeImg] = useState('');
  const [afterImg, setAfterImg] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  const beforeFileInputRef = useRef<HTMLInputElement>(null);
  const afterFileInputRef = useRef<HTMLInputElement>(null);

  const refreshList = () => {
    setGalleryItems(getStoredGallery());
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'before' | 'after') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setFormError('Please select a valid image file (JPG, PNG, WebP).');
      return;
    }

    // Limit to 5MB to avoid exceeding localStorage
    if (file.size > 5 * 1024 * 1024) {
      setFormError('Image size exceeds 5MB. Please choose a smaller image or compress it.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      if (target === 'before') {
        setBeforeImg(dataUrl);
      } else {
        setAfterImg(dataUrl);
      }
      setFormError(null);
    };
    reader.onerror = () => {
      setFormError('Failed to read image file.');
    };
    reader.readAsDataURL(file);
  };

  const handleApplyPreset = (preset: (typeof SAMPLE_PRESETS)[0]) => {
    setTitle(preset.title);
    setLocation(preset.location);
    setService(preset.service);
    setStainType(preset.stainType);
    setDescription(preset.description);
    setBeforeImg(preset.beforeImg);
    setAfterImg(preset.afterImg);
    setFormError(null);
  };

  const handleCreateTransformation = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!title.trim()) {
      setFormError('Please enter a descriptive title for this transformation.');
      return;
    }
    if (!location.trim()) {
      setFormError('Please enter the project location (e.g., Dallas, TX).');
      return;
    }
    if (!beforeImg.trim()) {
      setFormError('Please provide or upload a "Before" image.');
      return;
    }
    if (!afterImg.trim()) {
      setFormError('Please provide or upload an "After" image.');
      return;
    }

    try {
      addGalleryTransformation({
        title: title.trim(),
        location: location.trim(),
        service: service.trim(),
        stainType: stainType.trim() || 'General Dirt & Traffic',
        description: description.trim() || 'Professional steam extraction and restorative cleaning.',
        beforeImg: beforeImg.trim(),
        afterImg: afterImg.trim()
      });

      refreshList();
      setFormSuccess('Transformation added to gallery successfully!');
      setTimeout(() => {
        setFormSuccess(null);
        setIsAddModalOpen(false);
        // Reset form
        setTitle('');
        setLocation('');
        setStainType('');
        setDescription('');
        setBeforeImg('');
        setAfterImg('');
      }, 1200);
    } catch (err) {
      console.error(err);
      setFormError('Failed to save gallery item. Local storage may be full if images are very large.');
    }
  };

  const handleDelete = (id: string, itemTitle: string) => {
    if (window.confirm(`Are you sure you want to delete "${itemTitle}" from the Before & After gallery?`)) {
      deleteGalleryTransformation(id);
      refreshList();
    }
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset all gallery items back to the factory initial portfolio?')) {
      resetGalleryToDefault();
      refreshList();
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900">Before & After Gallery Manager</h2>
            <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
              {galleryItems.length} Transformations
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Upload new before/after project photos, edit showcase details, or delete outdated transformations.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
            title="Restore original factory transformations"
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
            <span>Upload New Images</span>
          </button>
        </div>
      </div>

      {/* Gallery Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {galleryItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col transition hover:shadow-md"
          >
            {/* Before / After Dual Image Thumbnails */}
            <div className="relative grid grid-cols-2 bg-slate-900 h-44 overflow-hidden border-b border-slate-100">
              {/* Before side */}
              <div className="relative h-full overflow-hidden group">
                <img
                  src={item.beforeImg}
                  alt={`Before - ${item.title}`}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=400&q=80';
                  }}
                />
                <span className="absolute top-2 left-2 bg-rose-600/90 text-white font-bold text-[10px] px-2 py-0.5 rounded shadow-xs uppercase tracking-wider">
                  Before
                </span>
              </div>

              {/* After side */}
              <div className="relative h-full overflow-hidden border-l border-white/20">
                <img
                  src={item.afterImg}
                  alt={`After - ${item.title}`}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80';
                  }}
                />
                <span className="absolute top-2 right-2 bg-emerald-600/90 text-white font-bold text-[10px] px-2 py-0.5 rounded shadow-xs uppercase tracking-wider">
                  After
                </span>
              </div>
            </div>

            {/* Info Body */}
            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                    {item.service}
                  </span>
                  <span className="text-[11px] text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {item.location}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
                <div className="mt-2 text-[11px] text-slate-600 font-medium">
                  <strong className="text-slate-800">Target Stain:</strong> {item.stainType}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setPreviewItem(item)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(item.id, item.title)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-2.5 py-1 rounded-lg transition cursor-pointer"
                  title="Delete this transformation"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL: Upload New Transformation */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden relative flex flex-col my-auto max-h-[92vh]">
            {/* Header */}
            <div className="p-5 border-b border-slate-100 bg-slate-900 text-white flex justify-between items-center">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center font-bold">
                  <Upload className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold">Upload New Transformation to Gallery</h3>
                  <p className="text-[11px] text-slate-300">
                    Add Before & After project photos with descriptions for website visitors
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
            <form onSubmit={handleCreateTransformation} className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs">
              {/* Quick Sample Presets */}
              <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-3">
                <div className="font-bold text-blue-900 text-xs mb-1.5 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>Quick Autofill Sample Templates:</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {SAMPLE_PRESETS.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => handleApplyPreset(preset)}
                      className="bg-white hover:bg-blue-100 text-blue-800 border border-blue-200 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition cursor-pointer"
                    >
                      + {preset.label}
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

              {/* Title & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider text-[11px] mb-1">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Heavy Red Wine Stain Extraction"
                    className="w-full p-2.5 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 outline-none font-semibold"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider text-[11px] mb-1">
                    Location (City, State) *
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Dallas, TX or Orlando, FL"
                    className="w-full p-2.5 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 outline-none"
                    required
                  />
                </div>
              </div>

              {/* Service Category & Stain Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider text-[11px] mb-1">
                    Cleaning Method / Service *
                  </label>
                  <select
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl text-xs bg-white focus:ring-2 focus:ring-blue-600 outline-none font-semibold"
                  >
                    <option value="Deep Steam Carpet Extraction">Deep Steam Carpet Extraction</option>
                    <option value="Upholstery Restorative Shampoo">Upholstery Restorative Shampoo</option>
                    <option value="Couch Cushion Rejuvenation">Couch Cushion Rejuvenation</option>
                    <option value="Mattress Allergen Neutralization">Mattress Allergen Neutralization</option>
                    <option value="Pet Stain & Odor Extraction">Pet Stain & Odor Extraction</option>
                    <option value="Area Rug Precision Bath">Area Rug Precision Bath</option>
                    <option value="Auto Interior Steam Clean">Auto Interior Steam Clean</option>
                    <option value="Commercial Carpet Maintenance">Commercial Carpet Maintenance</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider text-[11px] mb-1">
                    Stain Type / Damage *
                  </label>
                  <input
                    type="text"
                    value={stainType}
                    onChange={(e) => setStainType(e.target.value)}
                    placeholder="e.g. Pet Urine, Coffee, Mud, Grease"
                    className="w-full p-2.5 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 outline-none"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider text-[11px] mb-1">
                  Results Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Explain the cleaning process, enzyme dwell, water temperature, or fiber response..."
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 outline-none"
                />
              </div>

              {/* Dual Image Uploads */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {/* Before Image Box */}
                <div className="border border-slate-200 rounded-xl p-3 bg-slate-50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-rose-700 text-xs uppercase tracking-wider flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-rose-600"></span>
                      1. Before Image *
                    </span>
                    <button
                      type="button"
                      onClick={() => beforeFileInputRef.current?.click()}
                      className="text-[11px] text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Upload className="w-3 h-3" />
                      <span>Upload from Device</span>
                    </button>
                    <input
                      ref={beforeFileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, 'before')}
                    />
                  </div>

                  <input
                    type="text"
                    value={beforeImg}
                    onChange={(e) => setBeforeImg(e.target.value)}
                    placeholder="Paste image URL or use upload button..."
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs outline-none"
                  />

                  {beforeImg ? (
                    <div className="relative h-28 rounded-lg overflow-hidden border border-slate-200 bg-slate-200">
                      <img
                        src={beforeImg}
                        alt="Before Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=300&q=80';
                        }}
                      />
                    </div>
                  ) : (
                    <div className="h-28 rounded-lg border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 text-[11px]">
                      <ImageIcon className="w-6 h-6 mb-1 text-slate-300" />
                      <span>No Before image selected</span>
                    </div>
                  )}
                </div>

                {/* After Image Box */}
                <div className="border border-slate-200 rounded-xl p-3 bg-slate-50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-700 text-xs uppercase tracking-wider flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                      2. After Image *
                    </span>
                    <button
                      type="button"
                      onClick={() => afterFileInputRef.current?.click()}
                      className="text-[11px] text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Upload className="w-3 h-3" />
                      <span>Upload from Device</span>
                    </button>
                    <input
                      ref={afterFileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, 'after')}
                    />
                  </div>

                  <input
                    type="text"
                    value={afterImg}
                    onChange={(e) => setAfterImg(e.target.value)}
                    placeholder="Paste image URL or use upload button..."
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs outline-none"
                  />

                  {afterImg ? (
                    <div className="relative h-28 rounded-lg overflow-hidden border border-slate-200 bg-slate-200">
                      <img
                        src={afterImg}
                        alt="After Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=300&q=80';
                        }}
                      />
                    </div>
                  ) : (
                    <div className="h-28 rounded-lg border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 text-[11px]">
                      <ImageIcon className="w-6 h-6 mb-1 text-slate-300" />
                      <span>No After image selected</span>
                    </div>
                  )}
                </div>
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
                  <Upload className="w-3.5 h-3.5" />
                  Save Transformation to Gallery
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preview Full Size Modal */}
      {previewItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden relative">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">{previewItem.title}</h3>
                <p className="text-xs text-slate-500">
                  {previewItem.service} • {previewItem.location}
                </p>
              </div>
              <button
                onClick={() => setPreviewItem(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-4 bg-slate-950">
              <div className="space-y-1 text-center">
                <span className="text-[11px] font-bold text-rose-400 uppercase tracking-wider">Before Cleaning</span>
                <img
                  src={previewItem.beforeImg}
                  alt="Before"
                  className="w-full h-72 object-cover rounded-xl border border-slate-800"
                />
              </div>
              <div className="space-y-1 text-center">
                <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">After Restoration</span>
                <img
                  src={previewItem.afterImg}
                  alt="After"
                  className="w-full h-72 object-cover rounded-xl border border-slate-800"
                />
              </div>
            </div>

            <div className="p-4 text-xs text-slate-600 bg-white">
              <p>{previewItem.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
