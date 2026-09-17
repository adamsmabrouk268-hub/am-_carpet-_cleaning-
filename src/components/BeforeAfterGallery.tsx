import { useState, useEffect } from 'react';
import { Camera, MapPin, Sparkles, CheckCircle2 } from 'lucide-react';
import { BeforeAfterItem } from '../types';
import { getStoredGallery, DATA_CHANGED_EVENT } from '../utils/adminStorage';

export default function BeforeAfterGallery() {
  const [items, setItems] = useState<BeforeAfterItem[]>(() => getStoredGallery());
  const [activeTab, setActiveTab] = useState(0);
  const [sliderPosition, setSliderPosition] = useState(50); // percentage 0 to 100

  useEffect(() => {
    const handleDataChange = () => {
      setItems(getStoredGallery());
    };
    window.addEventListener(DATA_CHANGED_EVENT, handleDataChange);
    return () => window.removeEventListener(DATA_CHANGED_EVENT, handleDataChange);
  }, []);

  const safeIndex = Math.min(activeTab, Math.max(0, items.length - 1));
  const currentItem = items[safeIndex] || {
    id: 'placeholder',
    title: 'Steam Carpet Restoration',
    location: 'Dallas, TX',
    service: 'Deep Steam Carpet Extraction',
    description: 'Commercial 230°F hot water extraction.',
    beforeImg: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80',
    afterImg: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    stainType: 'Deep Soil'
  };

  return (
    <section id="gallery" className="py-20 bg-slate-50 border-b border-blue-100 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 text-blue-600 font-bold text-xs uppercase tracking-wider bg-blue-100/60 px-3 py-1 rounded-full mb-3">
            <Camera className="w-3.5 h-3.5" />
            <span>Real Customer Transformations</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
            Before & After Cleaning Results
          </h2>
          <p className="text-slate-600 text-sm">
            Slide or inspect our recent residential & commercial restoration jobs. Notice the true fiber color revival.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {items.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(idx);
                setSliderPosition(50);
              }}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                safeIndex === idx
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-blue-50 hover:text-blue-700 border border-slate-200'
              }`}
            >
              <span>{item.title}</span>
              <span className="text-[10px] opacity-75">({item.location})</span>
            </button>
          ))}
        </div>

        {/* Interactive Split Slider Display */}
        <div className="max-w-4xl mx-auto bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-md">
          <div className="relative h-72 sm:h-[420px] rounded-2xl overflow-hidden select-none bg-slate-900">
            {/* After Image (Full background) */}
            <img
              src={currentItem.afterImg}
              alt={`${currentItem.title} After`}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4 bg-blue-600 text-white text-xs font-extrabold px-3 py-1.5 rounded-lg shadow-md z-10 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>AFTER (Deep Steam)</span>
            </div>

            {/* Before Image (Clipped by sliderPosition) */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${sliderPosition}%` }}
            >
              <img
                src={currentItem.beforeImg}
                alt={`${currentItem.title} Before`}
                className="absolute inset-0 w-full h-full object-cover max-w-none"
                style={{ width: '100%', minWidth: '896px' }}
              />
              <div className="absolute top-4 left-4 bg-slate-900/80 text-white text-xs font-extrabold px-3 py-1.5 rounded-lg shadow-md z-10">
                BEFORE (Stained)
              </div>
            </div>

            {/* Slider Divider Line */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-20 shadow-lg flex items-center justify-center"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="w-8 h-8 -ml-3.5 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white text-xs font-bold">
                ↔
              </div>
            </div>

            {/* Native range input overlay for seamless drag */}
            <input
              type="range"
              min="0"
              max="100"
              value={sliderPosition}
              onChange={(e) => setSliderPosition(Number(e.target.value))}
              aria-label="Before and after slider position"
              className="absolute inset-0 opacity-0 cursor-ew-resize z-30 w-full h-full"
            />
          </div>

          {/* Details below slider */}
          <div className="mt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-2">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg text-slate-900">{currentItem.title}</h3>
                <span className="inline-flex items-center gap-1 text-xs text-slate-500 font-medium">
                  <MapPin className="w-3 h-3 text-blue-600" />
                  {currentItem.location}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1 max-w-xl">{currentItem.description}</p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs bg-blue-50 text-blue-800 font-bold px-3 py-1.5 rounded-lg border border-blue-200">
                Method: {currentItem.service}
              </span>
              <div className="text-xs text-slate-500 font-medium hidden md:flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>100% Stain Extraction</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
