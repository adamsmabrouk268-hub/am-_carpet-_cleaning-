import { ReviewItem } from '../types';

const STORAGE_KEY_REVIEWS = 'am_verified_customer_reviews_v1';
export const REVIEWS_CHANGED_EVENT = 'am_reviews_data_updated';

export function getStoredReviews(): ReviewItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_REVIEWS);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    // Filter out any demo reviews with placeholder names
    const filtered = parsed.filter((r: ReviewItem) => {
      if (!r || !r.id) return false;
      if (
        r.author === 'Sarah Jenkins' ||
        r.author === 'James Harrington' ||
        r.author === 'Emily Rodriguez' ||
        r.author === 'David K. Miller'
      ) {
        return false;
      }
      return true;
    });
    if (filtered.length !== parsed.length) {
      localStorage.setItem(STORAGE_KEY_REVIEWS, JSON.stringify(filtered));
    }
    return filtered;
  } catch (err) {
    console.error('Failed to load reviews from localStorage:', err);
    return [];
  }
}

export function saveStoredReviews(reviews: ReviewItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_REVIEWS, JSON.stringify(reviews));
    window.dispatchEvent(new CustomEvent(REVIEWS_CHANGED_EVENT));
  } catch (err) {
    console.error('Failed to save reviews to localStorage:', err);
  }
}

export function addStoredReview(
  data: Omit<ReviewItem, 'id' | 'date' | 'verified'>
): ReviewItem {
  const current = getStoredReviews();
  const id = `rev-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
  const newReview: ReviewItem = {
    ...data,
    id,
    date: 'Just now',
    verified: true
  };
  const updated = [newReview, ...current];
  saveStoredReviews(updated);
  return newReview;
}

export function deleteStoredReview(id: string): boolean {
  const current = getStoredReviews();
  const filtered = current.filter((r) => r.id !== id);
  if (filtered.length !== current.length) {
    saveStoredReviews(filtered);
    return true;
  }
  return false;
}
