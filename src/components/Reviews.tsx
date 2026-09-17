import { useState } from 'react';
import { Star, ShieldCheck, ThumbsUp, MessageSquare } from 'lucide-react';
import { REVIEWS } from '../data/initialData';

export default function Reviews() {
  const [filter, setFilter] = useState<'all' | 'carpet' | 'sofa'>('all');

  const filteredReviews = REVIEWS.filter((rev) => {
    if (filter === 'carpet') return rev.service.toLowerCase().includes('carpet');
    if (filter === 'sofa') return rev.service.toLowerCase().includes('sofa') || rev.service.toLowerCase().includes('upholstery');
    return true;
  });

  return (
    <section id="reviews" className="py-20 bg-white border-b border-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 text-blue-600 font-bold text-xs uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full mb-3">
            <Star className="w-3.5 h-3.5 fill-blue-600 text-blue-600" />
            <span>Verified Customer Feedback</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
            Trusted by Thousands of Homeowners
          </h2>
          <p className="text-slate-600 text-sm">
            Rated 4.9 / 5 stars across our metropolitan service areas. Read unedited reviews from verified bookings.
          </p>

          {/* Rating Summary Pill */}
          <div className="mt-6 inline-flex items-center gap-4 bg-slate-50 border border-slate-200/80 rounded-2xl px-6 py-3 shadow-2xs">
            <div className="text-3xl font-extrabold text-slate-900">4.9</div>
            <div className="text-left">
              <div className="flex text-amber-400 text-sm">
                {'★'.repeat(5)}
              </div>
              <div className="text-xs text-slate-500 font-medium">Based on 1,420+ completed jobs</div>
            </div>
          </div>
        </div>

        {/* Filter chips */}
        <div className="flex justify-center gap-2 mb-10">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Reviews
          </button>
          <button
            onClick={() => setFilter('carpet')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
              filter === 'carpet'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Carpet Cleaning
          </button>
          <button
            onClick={() => setFilter('sofa')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
              filter === 'sofa'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Sofa & Upholstery
          </button>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-slate-50/70 border border-slate-200 rounded-2xl p-6 flex flex-col justify-between shadow-2xs hover:shadow-xs transition"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex text-amber-400 text-sm">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                  </div>
                  <span className="text-[11px] text-slate-400">{rev.date}</span>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed italic mb-4">
                  "{rev.text}"
                </p>
              </div>

              <div className="pt-4 border-t border-slate-200/80">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-sm text-slate-900">{rev.author}</div>
                    <div className="text-[11px] text-slate-500">{rev.location}</div>
                  </div>
                  {rev.verified && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                      <ShieldCheck className="w-3 h-3" />
                      Verified
                    </span>
                  )}
                </div>
                <div className="mt-2 text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-1 rounded inline-block">
                  {rev.service}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
