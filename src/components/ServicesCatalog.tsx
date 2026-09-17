import { useState, useEffect, useMemo } from 'react';
import {
  Sparkles,
  Armchair,
  Sofa,
  BedDouble,
  Droplets,
  Layers,
  Car,
  Check,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { ServiceItem, ServiceCategory } from '../types';
import { SERVICES } from '../data/initialData';
import { getStoredServicesCatalog, DATA_CHANGED_EVENT } from '../utils/adminStorage';

interface ServicesCatalogProps {
  onSelectService: (service: ServiceItem) => void;
}

export default function ServicesCatalog({ onSelectService }: ServicesCatalogProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [storedCatalog, setStoredCatalog] = useState<ServiceItem[]>(() => getStoredServicesCatalog());

  useEffect(() => {
    const handleUpdate = () => {
      setStoredCatalog(getStoredServicesCatalog());
    };
    window.addEventListener(DATA_CHANGED_EVENT, handleUpdate);
    return () => window.removeEventListener(DATA_CHANGED_EVENT, handleUpdate);
  }, []);

  const baseCatalogItems = [
    {
      id: 'living_room_carpet',
      category: 'carpet' as ServiceCategory,
      categoryLabel: 'Cleaning Carpets',
      name: 'Carpet Cleaning',
      icon: Sparkles,
      price: '$80',
      unit: 'room (living / bedroom from $50)',
      tag: 'Deep Steam',
      description:
        'Truck-mounted 230°F hot water extraction that deep-cleans fibers right down to the backing, eliminating heavy ground-in traffic dirt.',
      features: [
        'Pre-spray enzyme agitation',
        'Living rooms, bedrooms, and staircases',
        'High-velocity dry air wand pass',
        'Zero chemical residue left behind'
      ],
      matchedServiceId: 'living_room_carpet'
    },
    {
      id: 'upholstery_armchair',
      category: 'upholstery' as ServiceCategory,
      categoryLabel: 'Upholstery Cleaning',
      name: 'Upholstery Cleaning',
      icon: Armchair,
      price: '$45',
      unit: 'armchairs / $25 dining chairs',
      tag: 'Fabric Care',
      description:
        'Delicate, fiber-safe shampoo extraction for armchairs, recliners, cushioned dining chairs, ottomans, and fabric headboards.',
      features: [
        'Safe on linen, velvet, microfiber & cotton',
        'Armchairs, recliners & dining room chairs',
        'Food & drink stain spot treatment',
        'Gentle color-brightening fabric rinse'
      ],
      matchedServiceId: 'upholstery_armchair'
    },
    {
      id: 'sofa_standard',
      category: 'couch_sofa' as ServiceCategory,
      categoryLabel: 'Couch and Sofa Cleaning',
      name: 'Couch & Sofa Cleaning',
      icon: Sofa,
      price: '$90',
      unit: 'standard couch / $145 sectional',
      tag: 'Customer Favorite',
      description:
        'Revitalize your living room seating. Complete deep steam extraction of cushions, backrests, crevices, and armrests.',
      features: [
        'Standard 2-3 seaters, sectionals & loveseats',
        'Deep crevice & crumb extraction',
        'Body oil, neck grime & stain release',
        'Fast drying within 2 to 3 hours'
      ],
      popular: true,
      matchedServiceId: 'sofa_standard'
    },
    {
      id: 'mattress_clean',
      category: 'mattress' as ServiceCategory,
      categoryLabel: 'Mattress Cleaning',
      name: 'Mattress Cleaning',
      icon: BedDouble,
      price: '$70',
      unit: 'Queen/King / $55 Twin/Full',
      tag: 'Allergen Defense',
      description:
        'Medical-grade steam and antimicrobial extraction eradicating dust mites, dead skin cells, perspiration, and allergen spores.',
      features: [
        'Both sides deep steam sanitized',
        'Dust mite & nighttime allergen neutralization',
        'Sweat and accidental stain treatment',
        'Gentle non-toxic botanical formula'
      ],
      matchedServiceId: 'mattress_clean'
    },
    {
      id: 'water_string_treatment',
      category: 'water_treatment' as ServiceCategory,
      categoryLabel: 'Water / String Treatment',
      name: 'Water / String Treatment',
      icon: Droplets,
      price: '$85',
      unit: 'per affected zone / emergency',
      tag: 'Restoration',
      description:
        'High-capacity water extraction, flood and spill mitigation, water ring removal, tack string restoration, and anti-mildew drying.',
      features: [
        'Emergency standing moisture extraction',
        'Water stain & carpet string line remediation',
        'Sub-surface pad moisture assessment',
        'Antimicrobial mold & mildew barrier'
      ],
      popular: true,
      matchedServiceId: 'water_string_treatment'
    },
    {
      id: 'area_rug',
      category: 'area_rug' as ServiceCategory,
      categoryLabel: 'Area Rug Cleaning',
      name: 'Area Rug Cleaning',
      icon: Layers,
      price: '$50',
      unit: 'per rug (up to 8x10)',
      tag: 'Gentle Wash',
      description:
        'Gentle, customized cleaning for synthetic, wool, Persian, oriental, and antique woven rugs preserving delicate dyes and fringes.',
      features: [
        'Fiber & color-fastness testing',
        'Low-moisture flat dry process',
        'Delicate fringe combing & care',
        'Protects hardwood floor underneath'
      ],
      matchedServiceId: 'area_rug'
    },
    {
      id: 'car_interior',
      category: 'other' as ServiceCategory,
      categoryLabel: 'Other Services',
      name: 'Other Services (Auto & Commercial)',
      icon: Car,
      price: '$95',
      unit: 'vehicles / commercial suites',
      tag: 'Specialty Care',
      description:
        'Complete interior steam shampoo for vehicles (seats, mats, trunk) and high-traffic commercial office carpet maintenance.',
      features: [
        'Full car & SUV seat shampoo and floor extraction',
        'Commercial office & retail carpet cleaning',
        'Sub-surface pet urine & bio-enzyme flush',
        'Flexible business & weekend dispatch hours'
      ],
      matchedServiceId: 'car_interior'
    }
  ];

  // Merge custom services added by admin that are not in baseCatalogItems
  const catalogItems = useMemo(() => {
    const baseIds = new Set(baseCatalogItems.map((b) => b.id));
    const customCards = storedCatalog
      .filter((s) => !baseIds.has(s.id))
      .map((s) => ({
        id: s.id,
        category: s.category,
        categoryLabel: s.category.toUpperCase().replace('_', ' '),
        name: s.name,
        icon: Layers,
        price: `$${s.basePrice}`,
        unit: s.unit || 'service',
        tag: 'Custom Service',
        description: s.description || 'Specialized commercial & residential cleaning service.',
        features: [
          'Professional grade equipment & eco solutions',
          'Certified clean technicians',
          '100% Satisfaction guarantee',
          'Free spot inspection before treatment'
        ],
        matchedServiceId: s.id
      }));

    return [...baseCatalogItems, ...customCards];
  }, [storedCatalog]);

  const categoriesList = [
    { id: 'all', label: 'All Services' },
    { id: 'carpet', label: 'Cleaning Carpets' },
    { id: 'upholstery', label: 'Upholstery Cleaning' },
    { id: 'couch_sofa', label: 'Couch & Sofa Cleaning' },
    { id: 'mattress', label: 'Mattress Cleaning' },
    { id: 'water_treatment', label: 'Water / String Treatment' },
    { id: 'area_rug', label: 'Area Rug Cleaning' },
    { id: 'other', label: 'Other Services' }
  ];

  const filteredCards =
    activeCategory === 'all'
      ? catalogItems
      : catalogItems.filter((item) => item.category === activeCategory);

  const handleBookCard = (card: (typeof catalogItems)[0]) => {
    const matched =
      storedCatalog.find((s) => s.id === card.matchedServiceId) ||
      SERVICES.find((s) => s.id === card.matchedServiceId) ||
      storedCatalog[0] ||
      SERVICES[0];
    onSelectService(matched);
  };

  return (
    <section id="services" className="py-20 bg-slate-50 border-b border-blue-100 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 text-blue-600 font-bold text-xs uppercase tracking-wider bg-blue-100/60 px-3 py-1 rounded-full mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Our Cleaning Services</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            Professional Cleaning Services Built for Results
          </h2>
          <p className="text-slate-600 text-base leading-relaxed">
            From deep carpet steam extraction and couch revitalizing to water / string restoration and mattress sanitization.
            All powered by 230°F commercial extraction and 100% child- & pet-safe solutions.
          </p>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            {categoriesList.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white text-slate-700 hover:bg-blue-50 border border-slate-200'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCards.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.id}
                className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>
                    {service.tag && (
                      <span className="text-[11px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800 px-2.5 py-1 rounded-full">
                        {service.tag}
                      </span>
                    )}
                  </div>

                  <div className="text-[11px] font-bold uppercase tracking-wider text-blue-600 mb-1">
                    {service.categoryLabel}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1.5">{service.name}</h3>
                  <div className="flex items-baseline gap-1.5 mb-3">
                    <span className="text-2xl font-extrabold text-blue-700">{service.price}</span>
                    <span className="text-xs text-slate-500 font-medium">{service.unit}</span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed mb-4">{service.description}</p>

                  {/* Included features list */}
                  <ul className="space-y-2 mb-6 border-t border-slate-100 pt-4">
                    {service.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                        <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => handleBookCard(service)}
                  className="w-full bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 group-hover:bg-blue-600 group-hover:text-white cursor-pointer"
                >
                  <span>Book This Service</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner with Satisfaction Guarantee */}
        <div className="mt-12 bg-blue-900 text-white rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-800 text-sky-300 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <h4 className="font-bold text-base sm:text-lg">Need a Custom or Multi-Room Combination?</h4>
              <p className="text-blue-200 text-xs sm:text-sm mt-0.5">
                Combine carpets, couch cleaning, and mattress sanitization in one visit to automatically unlock volume discounts.
              </p>
            </div>
          </div>
          <a
            href="#calculator"
            className="whitespace-nowrap px-6 py-3 rounded-xl bg-white text-blue-900 hover:bg-blue-50 font-bold text-xs sm:text-sm transition flex items-center gap-2 shrink-0"
          >
            <span>Open Instant Calculator</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

