import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Pencil, Plus, Star, Trash2 } from 'lucide-react';
import type { User } from 'firebase/auth';
import { MUSSOORIE_SANCTUARIES } from '../data/mussoorieStays';
import {
  createStayReview,
  deleteStayReview,
  updateStayReview,
  type StayReviewRecord,
} from '../lib/firebase';
import { GoogleMark } from './GoogleMark';
import { MussoorieTextureCanvas } from './MussoorieTextureCanvas';

interface GuestChroniclesSectionProps {
  user: User | null;
  reviews: StayReviewRecord[];
  onRequireSignIn: () => void;
  onNotify: (msg: string) => void;
}

export const GuestChroniclesSection: React.FC<GuestChroniclesSectionProps> = ({
  user,
  reviews,
  onRequireSignIn,
  onNotify,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showComposer, setShowComposer] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const [stayId, setStayId] = useState(MUSSOORIE_SANCTUARIES[0].id);
  const [guestRole, setGuestRole] = useState('');
  const [guestCity, setGuestCity] = useState('');
  const [stayDate, setStayDate] = useState('November 2026');
  const [nightsStayed, setNightsStayed] = useState(3);
  const [rating, setRating] = useState(5);
  const [highlight, setHighlight] = useState('');
  const [quote, setQuote] = useState('');

  const safeIndex = reviews.length > 0 ? activeIndex % reviews.length : 0;
  const activeReview = reviews[safeIndex];

  const stayNameMap = new Map(MUSSOORIE_SANCTUARIES.map((s) => [s.id, s.name]));

  const openNewComposer = () => {
    if (!user) {
      onRequireSignIn();
      return;
    }
    setEditingReviewId(null);
    setStayId(MUSSOORIE_SANCTUARIES[0].id);
    setGuestRole('');
    setGuestCity('');
    setStayDate('November 2026');
    setNightsStayed(3);
    setRating(5);
    setHighlight('');
    setQuote('');
    setFormError('');
    setShowComposer(true);
  };

  const openEditComposer = (review: StayReviewRecord) => {
    setEditingReviewId(review.id);
    setStayId(review.stayId);
    setGuestRole(review.guestRole);
    setGuestCity(review.guestCity);
    setStayDate(review.stayDate);
    setNightsStayed(review.nightsStayed);
    setRating(review.rating);
    setHighlight(review.highlight);
    setQuote(review.quote);
    setFormError('');
    setShowComposer(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      onRequireSignIn();
      return;
    }
    setFormError('');
    setSubmitting(true);
    try {
      if (editingReviewId) {
        await updateStayReview(editingReviewId, {
          rating,
          highlight,
          quote,
        });
        onNotify('Your guest chronicle has been updated.');
      } else {
        await createStayReview({
          stayId,
          authorUid: user.uid,
          guestName: user.displayName || 'CloudCrest Member',
          guestRole: guestRole || 'Weekend Retreat Guest',
          guestCity: guestCity || 'New Delhi',
          stayDate: stayDate || 'November 2026',
          nightsStayed,
          rating,
          highlight,
          quote,
        });
        setActiveIndex(0);
        onNotify('Thank you for sharing your CloudCrest Mussoorie chronicle.');
      }
      setShowComposer(false);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Could not save review.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (reviewId: string) => {
    setSubmitting(true);
    try {
      await deleteStayReview(reviewId);
      setActiveIndex(0);
      onNotify('Your chronicle entry was removed.');
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Unable to delete review.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="chronicles"
      className="relative overflow-hidden bg-[#060A13] text-[#F3F6FB] py-20 lg:py-28 border-t border-[#3B82F6]/20"
    >
      <MussoorieTextureCanvas tone="dark" density="section" />

      <div className="relative z-10 mx-auto max-w-[1320px] px-6 lg:px-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between border-b border-[#3B82F6]/20 pb-8">
          <div className="max-w-xl space-y-2.5">
            <p className="text-xs font-semibold tracking-widest uppercase text-[#60A5FA]">
              Guest Chronicles
            </p>
            <h2
              className="font-display text-3xl font-semibold tracking-tight text-[#F8FAFC] sm:text-4xl"
              style={{ textWrap: 'balance' }}
            >
              Reflections From the Mussoorie Ridge
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={openNewComposer}
              className="inline-flex items-center gap-2 rounded-md border border-[#3B82F6]/35 bg-[#090F1C] px-4 py-2.5 text-xs font-semibold text-[#F8FAFC] hover:border-[#60A5FA] hover:text-[#93C5FD] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {user ? (
                <Plus className="h-3.5 w-3.5 text-[#60A5FA]" aria-hidden="true" />
              ) : (
                <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-white">
                  <GoogleMark className="h-3 w-3" />
                </span>
              )}
              <span>{user ? 'Share a Chronicle' : 'Sign in with Google to Review'}</span>
            </button>
          </div>
        </div>

        {/* Testimonials Carousel */}
        {activeReview && (
          <div className="mt-10 rounded-lg border border-[#3B82F6]/25 bg-[#090F1C] p-7 sm:p-10 lg:p-12">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-8 space-y-6">
                <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-[#60A5FA]">
                  <span>{stayNameMap.get(activeReview.stayId) || 'CloudCrest Sanctuary'}</span>
                  <span aria-hidden="true" className="text-[#F3F6FB]/25">
                    ·
                  </span>
                  <span>{activeReview.stayDate}</span>
                  <span aria-hidden="true" className="text-[#F3F6FB]/25">
                    ·
                  </span>
                  <span className="tabular-nums">{activeReview.nightsStayed} Nights</span>
                </div>

                <div
                  className="flex items-center gap-1 text-[#3B82F6]"
                  aria-label={`${activeReview.rating} out of 5 stars`}
                >
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4"
                      fill={i < Math.round(activeReview.rating) ? 'currentColor' : 'none'}
                    />
                  ))}
                  <span className="ml-2 font-mono text-xs tabular-nums text-[#CBD5E1]">
                    {activeReview.rating.toFixed(1)} / 5.0
                  </span>
                </div>

                <p className="text-base font-semibold text-[#93C5FD]">
                  “{activeReview.highlight}”
                </p>

                <blockquote className="font-display text-2xl leading-snug text-[#F8FAFC] sm:text-[1.75rem]">
                  {activeReview.quote}
                </blockquote>
              </div>

              <div className="lg:col-span-4 flex flex-col justify-between gap-6 border-t border-[#3B82F6]/18 pt-6 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-md border border-[#60A5FA]/35 bg-[#1E3A8A]/60 font-display text-lg font-semibold text-[#DBEAFE] shrink-0">
                    {activeReview.guestInitials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#F8FAFC]">{activeReview.guestName}</p>
                    <p className="text-xs text-[#94A3B8]">
                      {activeReview.guestRole} · {activeReview.guestCity}
                    </p>
                  </div>
                </div>

                {user && activeReview.authorUid === user.uid && !activeReview.isEditorial && (
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => openEditComposer(activeReview)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#F8FAFC] hover:text-[#60A5FA] cursor-pointer"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      disabled={submitting}
                      onClick={() => handleDelete(activeReview.id)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#FCA5A5] hover:opacity-80 cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2">
                  <span className="font-mono text-xs tabular-nums text-[#94A3B8]">
                    {String(safeIndex + 1).padStart(2, '0')} /{' '}
                    {String(reviews.length).padStart(2, '0')}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      aria-label="Previous chronicle"
                      onClick={() =>
                        setActiveIndex((prev) => (prev - 1 + reviews.length) % reviews.length)
                      }
                      className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-[#3B82F6]/30 bg-[#04060A] text-[#F8FAFC] hover:border-[#60A5FA] transition-colors cursor-pointer"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      aria-label="Next chronicle"
                      onClick={() => setActiveIndex((prev) => (prev + 1) % reviews.length)}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-[#3B82F6]/30 bg-[#04060A] text-[#F8FAFC] hover:border-[#60A5FA] transition-colors cursor-pointer"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Inline Review Composer */}
        {showComposer && (
          <form
            onSubmit={handleSubmit}
            className="mt-8 rounded-lg border border-[#3B82F6]/30 bg-[#090F1C] p-6 sm:p-8 space-y-5"
          >
            <div className="flex items-center justify-between gap-4 border-b border-[#3B82F6]/15 pb-4">
              <h3 className="font-display text-2xl font-semibold text-[#F8FAFC]">
                {editingReviewId
                  ? 'Edit Your Guest Chronicle'
                  : 'Share Your Mussoorie Stay Reflection'}
              </h3>
              <button
                type="button"
                onClick={() => setShowComposer(false)}
                className="text-xs font-semibold text-[#CBD5E1] hover:text-[#60A5FA] cursor-pointer"
              >
                Cancel
              </button>
            </div>

            {!editingReviewId && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <label className="block space-y-1 text-xs font-medium text-[#CBD5E1]">
                  <span>Sanctuary Stayed</span>
                  <select
                    value={stayId}
                    onChange={(e) => setStayId(e.target.value)}
                    className="w-full rounded-md border border-[#3B82F6]/25 bg-[#04060A] px-3 py-2 text-sm text-[#F8FAFC] focus:border-[#60A5FA] focus:outline-none"
                  >
                    {MUSSOORIE_SANCTUARIES.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block space-y-1 text-xs font-medium text-[#CBD5E1]">
                  <span>Travel Context / Role</span>
                  <input
                    type="text"
                    required
                    minLength={2}
                    maxLength={80}
                    placeholder="e.g. Architect, Anniversary"
                    value={guestRole}
                    onChange={(e) => setGuestRole(e.target.value)}
                    className="w-full rounded-md border border-[#3B82F6]/25 bg-[#04060A] px-3 py-2 text-sm text-[#F8FAFC] placeholder:text-[#64748B] focus:border-[#60A5FA] focus:outline-none"
                  />
                </label>

                <label className="block space-y-1 text-xs font-medium text-[#CBD5E1]">
                  <span>Origin City</span>
                  <input
                    type="text"
                    required
                    minLength={2}
                    maxLength={80}
                    placeholder="e.g. Chandigarh"
                    value={guestCity}
                    onChange={(e) => setGuestCity(e.target.value)}
                    className="w-full rounded-md border border-[#3B82F6]/25 bg-[#04060A] px-3 py-2 text-sm text-[#F8FAFC] placeholder:text-[#64748B] focus:border-[#60A5FA] focus:outline-none"
                  />
                </label>

                <div className="grid grid-cols-2 gap-3">
                  <label className="block space-y-1 text-xs font-medium text-[#CBD5E1]">
                    <span>Month & Year</span>
                    <input
                      type="text"
                      required
                      minLength={4}
                      maxLength={40}
                      value={stayDate}
                      onChange={(e) => setStayDate(e.target.value)}
                      className="w-full rounded-md border border-[#3B82F6]/25 bg-[#04060A] px-3 py-2 text-sm text-[#F8FAFC] focus:border-[#60A5FA] focus:outline-none"
                    />
                  </label>

                  <label className="block space-y-1 text-xs font-medium text-[#CBD5E1]">
                    <span>Nights</span>
                    <input
                      type="number"
                      min={1}
                      max={30}
                      value={nightsStayed}
                      onChange={(e) => setNightsStayed(Number(e.target.value))}
                      className="w-full rounded-md border border-[#3B82F6]/25 bg-[#04060A] px-3 py-2 text-sm text-[#F8FAFC] tabular-nums focus:border-[#60A5FA] focus:outline-none"
                    />
                  </label>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
              <label className="block space-y-1 text-xs font-medium text-[#CBD5E1]">
                <span>Rating (1–5)</span>
                <select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="w-full rounded-md border border-[#3B82F6]/25 bg-[#04060A] px-3 py-2 text-sm text-[#F8FAFC] tabular-nums focus:border-[#60A5FA] focus:outline-none"
                >
                  {[5, 4, 3, 2, 1].map((r) => (
                    <option key={r} value={r}>
                      {r}.0 Stars
                    </option>
                  ))}
                </select>
              </label>

              <label className="sm:col-span-3 block space-y-1 text-xs font-medium text-[#CBD5E1]">
                <span>Headline Highlight</span>
                <input
                  type="text"
                  required
                  minLength={3}
                  maxLength={120}
                  placeholder="Memorable moment from your Mussoorie stay"
                  value={highlight}
                  onChange={(e) => setHighlight(e.target.value)}
                  className="w-full rounded-md border border-[#3B82F6]/25 bg-[#04060A] px-3 py-2 text-sm text-[#F8FAFC] placeholder:text-[#64748B] focus:border-[#60A5FA] focus:outline-none"
                />
              </label>
            </div>

            <label className="block space-y-1 text-xs font-medium text-[#CBD5E1]">
              <span>Your Chronicle</span>
              <textarea
                rows={3}
                required
                minLength={12}
                maxLength={1000}
                placeholder="Describe the atmosphere, service, and ridge views..."
                value={quote}
                onChange={(e) => setQuote(e.target.value)}
                className="w-full rounded-md border border-[#3B82F6]/25 bg-[#04060A] px-3 py-2 text-sm text-[#F8FAFC] placeholder:text-[#64748B] focus:border-[#60A5FA] focus:outline-none"
              />
            </label>

            {formError && (
              <p role="alert" className="text-xs font-medium text-[#FCA5A5]">
                {formError}
              </p>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="rounded-md bg-[#2563EB] px-6 py-2.5 text-xs font-semibold text-white hover:bg-[#1D4ED8] disabled:opacity-50 transition-colors cursor-pointer"
              >
                {submitting
                  ? 'Saving...'
                  : editingReviewId
                    ? 'Save Changes'
                    : 'Publish Chronicle'}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
};
