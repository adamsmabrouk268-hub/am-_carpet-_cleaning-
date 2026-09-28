import { useState, useEffect, FormEvent } from 'react';
import { Star, ShieldCheck, Plus, X, MessageSquare, CheckCircle2 } from 'lucide-react';
import { ReviewItem } from '../types';
import { getStoredReviews, addStoredReview, REVIEWS_CHANGED_EVENT } from '../utils/reviewStorage';

export default function Reviews() {
  const [reviews, setReviews] = useState<ReviewItem[]>(() => getStoredReviews());
  const [filter, setFilter] = useState<'all' | 'carpet' | 'sofa' | 'painting'>('all');
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // New review form state
  const [author, setAuthor] = useState('');
  const [location, setLocation] = useState('Federal Way, WA');
  const [rating, setRating] = useState(5);
  const [service, setService] = useState('Carpet Steam Cleaning');
  const [text, setText] = useState('');

  useEffect(() => {
    const handleUpdate = () => {
      setReviews(getStoredReviews());
    };
    window.addEventListener(REVIEWS_CHANGED_EVENT, handleUpdate);
    return () => window.removeEventListener(REVIEWS_CHANGED_EVENT, handleUpdate);
  }, []);

  const handleReviewSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !text.trim()) return;

    addStoredReview({
      author: author.trim(),
      location: location.trim(),
      rating,
      service,
      text: text.trim()
    });

    setSubmitSuccess(true);
    setTimeout(() => {
      setSubmitSuccess(false);
      setIsWriteModalOpen(false);
      setAuthor('');
      setText('');
      setRating(5);
    }, 1500);
  };

  const filteredReviews = reviews.filter((rev) => {
    if (filter === 'carpet') return rev.service.toLowerCase().includes('carpet');
    if (filter === 'sofa') {
      return (
        rev.service.toLowerCase().includes('sofa') ||
        rev.service.toLowerCase().includes('upholstery') ||
        rev.service.toLowerCase().includes('couch')
      );
    }
    if (filter === 'painting') return rev.service.toLowerCase().includes('paint');
    return true;
  });

  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : '5.0';

  return (
    <section id="reviews" className="py-20 bg-white border-b border-blue-100 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 text-blue-600 font-bold text-xs uppercase tracking-wider bg-blue-50 px-3.5 py-1.5 rounded-full mb-3 border border-blue-200/60">
            <Star className="w-3.5 h-3.5 fill-blue-600 text-blue-600" />
            <span>Customer Experiences</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
            Real Customer Reviews
          </h2>
          <p className="text-slate-600 text-sm">
            Genuine feedback from homeowners and businesses across Washington State.
          </p>

          {/* Rating Summary Pill & Write Review button */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            {reviews.length > 0 ? (
              <div className="inline-flex items-center gap-4 bg-slate-50 border border-slate-200/80 rounded-2xl px-6 py-3 shadow-2xs">
                <div className="text-3xl font-extrabold text-slate-900">{averageRating}</div>
                <div className="text-left">
                  <div className="flex text-amber-400 text-sm">
                    {'★'.repeat(Math.round(Number(averageRating)))}
                  </div>
                  <div className="text-xs text-slate-500 font-medium">
                    Based on {reviews.length} customer review{reviews.length === 1 ? '' : 's'}
                  </div>
                </div>
              </div>
            ) : null}

            <button
              onClick={() => setIsWriteModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs transition shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Write a Review</span>
            </button>
          </div>
        </div>

        {/* Filter chips (only show if reviews exist) */}
        {reviews.length > 0 && (
          <div className="flex justify-center gap-2 mb-10">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All ({reviews.length})
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
            <button
              onClick={() => setFilter('painting')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
                filter === 'painting'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Painting
            </button>
          </div>
        )}

        {/* Reviews List or Empty State */}
        {reviews.length === 0 ? (
          <div className="max-w-xl mx-auto text-center bg-slate-50 border border-slate-200 rounded-3xl p-8 sm:p-10 shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">No Customer Reviews Yet</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
              Have you recently had your carpets, sofas, or home painted by A&M Carpet Cleaning & Painting?
              Be the first to share your experience with our team!
            </p>
            <button
              onClick={() => setIsWriteModalOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs transition shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Leave the First Review</span>
            </button>
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-xs">
            No reviews under "{filter}" category yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        )}
      </div>

      {/* Write a Review Modal */}
      {isWriteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative">
            <button
              onClick={() => setIsWriteModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <div className="inline-flex items-center gap-1.5 text-blue-600 font-bold text-xs uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full mb-2">
                <Star className="w-3.5 h-3.5 fill-blue-600 text-blue-600" />
                <span>Customer Feedback</span>
              </div>
              <h3 className="text-xl font-extrabold text-slate-900">Write a Review</h3>
              <p className="text-xs text-slate-500 mt-1">
                Share your authentic feedback about your cleaning or painting appointment.
              </p>
            </div>

            {submitSuccess ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-slate-900 mb-1">Thank You!</h4>
                <p className="text-xs text-slate-600">Your review has been verified and published.</p>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Doe"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Location / City in WA *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Federal Way, WA"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Rating *</label>
                    <select
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white text-slate-800"
                    >
                      <option value={5}>5 Stars - Outstanding</option>
                      <option value={4}>4 Stars - Great Work</option>
                      <option value={3}>3 Stars - Average</option>
                      <option value={2}>2 Stars - Below Expectations</option>
                      <option value={1}>1 Star - Poor</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Service Received</label>
                  <select
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white text-slate-800"
                  >
                    <option>Carpet Steam Cleaning</option>
                    <option>Couch & Sofa Upholstery Shampoo</option>
                    <option>Mattress Allergen Extraction</option>
                    <option>Area Rug Precision Wash</option>
                    <option>Interior Room Wall Painting</option>
                    <option>Trim & Door Painting</option>
                    <option>Vehicle Interior Detail</option>
                    <option>Commercial Carpet Maintenance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Your Review *</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Describe the quality of the cleaning or painting, arrival punctuality, and overall experience..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsWriteModalOpen(false)}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs transition shadow-sm cursor-pointer"
                  >
                    Submit Review
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
